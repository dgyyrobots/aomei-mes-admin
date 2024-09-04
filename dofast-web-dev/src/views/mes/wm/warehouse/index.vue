<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="仓库编码" prop="warehouseCode">
        <el-input v-model="queryParams.warehouseCode" placeholder="请输入仓库编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['wms:warehouse:create']">新增 </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['wms:warehouse:update']">修改 </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['wms:warehouse:delete']">删除 </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehouseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="仓库编码" align="center" prop="warehouseCode">
        <template slot-scope="scope">
          <el-button type="text" @click="handleView(scope.row)" v-hasPermi="['wms:warehouse:query']">
            {{ scope.row.warehouseCode }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="仓库名称" align="center" prop="warehouseName" />
      <el-table-column label="位置" align="center" prop="location" :show-overflow-tooltip="true" />
      <el-table-column label="面积" align="center" prop="area">
        <template slot-scope="scope"> {{ scope.row.area }} ㎡</template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="charge" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="200px" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-s-shop" @click="handleLocation(scope.row.id)" v-hasPermi="['wms:warehouse:update', 'wms:warehouse:query']">库区 </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['wms:warehouse:update']">修改 </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['wms:warehouse:delete']">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改仓库设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="仓库编码" prop="warehouseCode">
              <el-input v-model="form.warehouseCode" placeholder="请输入仓库编码" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view'"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库名称" prop="warehouseName">
              <el-input v-model="form.warehouseName" placeholder="请输入仓库名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="位置" prop="location">
              <el-input v-model="form.location" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="面积" prop="area">
              <el-input-number :min="0" :step="1" :percision="2" v-model="form.area" placeholder="请输入面积" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="charge">
              <el-input v-model="form.charge" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="详细地址" prop="fastAddress">
              <el-input v-model="fastAddress" type="textarea" placeholder="请输入详细地址" class="!w-255 mr-5"></el-input>
              <el-button type="primary" @click="parseAddress()" class="ml-5">解析</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件人" prop="name">
              <el-input v-model="form.name" placeholder="请输入收件人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件电话" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入收件电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="省市区" prop="areaId">
              <el-cascader v-model="form.areaId" placeholder="请选择省市区" :options="areaOptions" :props="{ label: 'name', value: 'id' }"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="街道" prop="street">
              <el-input v-model="form.street" placeholder="请输入街道"></el-input>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="邮政编码" prop="postCode">-->
          <!--              <el-input v-model="form.postCode" placeholder="请输入邮政编码"></el-input>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="24">
            <el-form-item label="详细地址" prop="detailAddress">
              <el-input v-model="form.detailAddress" placeholder="请输入详细地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view'">返回</el-button>
        <el-button type="primary" @click="submitForm" v-else>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWarehouse, getWarehouse, delWarehouse, addWarehouse, updateWarehouse } from '@/api/mes/wm/warehouse';
import { genCode } from '@/api/mes/autocode/rule';
import { getAreaById, getAreaFieldsById, getAreaIdsByNames, getAreaTree } from '@/api/system/area';
import { parseAddress } from '@/api/infra/address';

export default {
  name: 'Warehouse',
  data() {
    return {
      //自动生成编码
      autoGenFlag: false,
      optType: undefined,
      fastAddress: '',
      areaOptions: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 仓库设置表格数据
      warehouseList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        warehouseCode: null,
        warehouseName: null,
        location: null,
        area: null,
        charge: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        warehouseCode: [{ required: true, message: '仓库编码不能为空', trigger: 'blur' }],
        warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
        name: [{ required: !this.disableEditAddress, message: '请输入收件人', trigger: 'blur' }],
        mobile: [{ required: !this.disableEditAddress, message: '请输入收件电话', trigger: 'blur' }],
        areaId: [{ required: !this.disableEditAddress, message: '请输入收件人区域', trigger: 'blur' }],
        postCode: [{ required: !this.disableEditAddress, message: '请输入邮政编码', trigger: 'blur' }],
        detailAddress: [{ required: !this.disableEditAddress, message: '请输入收件详情', trigger: 'blur' }],
      },
    };
  },
  created() {
    getAreaTree().then(
      data =>
        (this.areaOptions = this.treeFilter(data || [], (child, parent, deep) => {
          if (deep != 2) {
            return [child];
          }
          return [
            {
              ...child,
              children: undefined,
            },
          ];
        })),
    );
    this.getList();
  },
  methods: {
    async parseAddress() {
      if (this.fastAddress) {
        const result = await parseAddress(this.fastAddress);
        if (result.data) {
          this.form.name = result.data.name;
          this.form.mobile = result.data.mobile;
          this.form.detailAddress = (result.data.streetName || '') + (result.data.address || '');
          this.form.areaId = await getAreaIdsByNames([result.data.provinceName, result.data.cityName, result.data.expAreaName]);
        }
      }
    },
    /** 查询仓库设置列表 */
    getList() {
      this.loading = true;
      listWarehouse(this.queryParams).then(response => {
        this.warehouseList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        warehouseCode: null,
        warehouseName: null,
        location: null,
        area: null,
        charge: null,
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        userId: '',
        name: '',
        mobile: '',
        areaId: [],
        postCode: '',
        street: '',
        detailAddress: '',
      };
      this.autoGenFlag = false;
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加仓库设置';
      this.optType = 'add';
    },
    // 查询明细按钮操作
    handleView(row) {
      this.reset();
      const warehouseId = row.id || this.ids;
      getWarehouse(warehouseId).then(async response => {
        response.data.name = response.data.sendName;
        response.data.mobile = response.data.sendMobile;
        response.data.detailAddress = response.data.sendDetail;
        response.data.street = response.data.sendStreet;
        response.data.areaId = await getAreaIdsByNames([response.data.sendState, response.data.sendCity, response.data.sendDistrict]);
        this.form = response.data;

        this.open = true;
        this.title = '查看仓库';
        this.optType = 'view';
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const warehouseId = row.id || this.ids;
      getWarehouse(warehouseId).then(async response => {
        response.data.name = response.data.sendName;
        response.data.mobile = response.data.sendMobile;
        response.data.detailAddress = response.data.sendDetail;
        response.data.street = response.data.sendStreet;
        response.data.areaId = await getAreaIdsByNames([response.data.sendState, response.data.sendCity, response.data.sendDistrict]);
        this.form = response.data;
        this.open = true;
        this.title = '修改仓库设置';
        this.optType = 'edit';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.form.sendName = this.form.name;
          this.form.sendMobile = this.form.sendPhone = this.form.mobile;
          this.form.sendDetail = this.form.detailAddress;
          this.form.sendStreet = this.form.street;
          const names = await getAreaFieldsById(this.form.areaId[this.form.areaId.length - 1], 'name');
          this.form.sendState = names[0];
          this.form.sendCity = names[1];
          this.form.sendDistrict = names[2];
          if (this.form.id != null) {
            updateWarehouse(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addWarehouse(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const warehouseIds = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除仓库设置编号为"' + warehouseIds + '"的数据项？')
        .then(function () {
          return delWarehouse(warehouseIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'wms/warehouse/export-excel',
        {
          ...this.queryParams,
        },
        `warehouse_${new Date().getTime()}.xlsx`,
      );
    },
    handleLocation(warehouseId) {
      this.$router.push({ name: 'WmsLocation', query: { warehouseId: warehouseId || 0, optType: this.optType } });
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        genCode('WAREHOUSE_CODE').then(response => {
          this.form.warehouseCode = response;
        });
      } else {
        this.form.warehouseCode = null;
      }
    },
  },
};
</script>
