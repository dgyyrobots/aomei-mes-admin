<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="库区名称" prop="locationName">
        <el-input v-model="queryParams.locationName" placeholder="请输入库区名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['wms:storage-location:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['wms:storage-location:update']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['wms:storage-location:delete']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="locationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="库区编码" align="center" prop="locationCode">
        <template slot-scope="scope">
          <el-button type="text" @click="handleView(scope.row)" v-hasPermi="['wms:storage-location:query']">{{ scope.row.locationCode }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="库区名称" align="center" prop="locationName" />
      <el-table-column label="所属工艺编码" align="center" prop="processCode" />
      <el-table-column label="面积" align="center" prop="area" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-shop" @click="handleArea(scope.row.id)" v-hasPermi="['wms:storage-area:update', 'wms:storage-area:update']">库位</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['wms:storage-location:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['wms:storage-location:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改库区设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="库区编码" prop="locationCode">
              <el-input v-model="form.locationCode" placeholder="请输入库区编码" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view'"> </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库区名称" prop="locationName">
              <el-input v-model="form.locationName" placeholder="请输入库区名称" />
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
            <el-form-item label="工序编码" prop="area">
              <el-input v-model="form.processCode" placeholder="请输入工序编码" />
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
import { listLocation, getLocation, delLocation, addLocation, updateLocation } from '@/api/mes/wm/location';
import { genCode } from '@/api/mes/autocode/rule';
export default {
  name: 'Location',
  dicts: ['sys_yes_no'],
  data() {
    return {
      //自动生成编码
      autoGenFlag: false,
      optType: undefined,
      warehouseId: undefined,
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
      // 库区设置表格数据
      locationList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        locationCode: null,
        locationName: null,
        warehouseId: null,
        area: null,
        areaFlag: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        locationCode: [{ required: true, message: '库区编码不能为空', trigger: 'blur' }],
        locationName: [{ required: true, message: '库区名称不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    //从上级页面获取的规则ID
    const warehouseId = this.$route.query.warehouseId;
    this.warehouseId = warehouseId;
    this.queryParams.warehouseId = warehouseId;
    this.getList();
  },
  methods: {
    /** 查询库区设置列表 */
    getList() {
      this.loading = true;
      listLocation(this.queryParams).then(response => {
        this.locationList = response.data.list;
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
        locationCode: null,
        locationName: null,
        warehouseId: this.warehouseId,
        area: null,
        areaFlag: null,
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      this.title = '添加库区设置';
      this.optType = 'add';
    },
    // 查询明细按钮操作
    handleView(row) {
      this.reset();
      const locationId = row.id || this.ids;
      getLocation(locationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '查看库区';
        this.optType = 'view';
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const locationId = row.id || this.ids;
      getLocation(locationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改库区设置';
        this.optType = 'edit';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLocation(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addLocation(this.form).then(response => {
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
      const locationIds = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除库区设置编号为"' + locationIds + '"的数据项？')
        .then(function () {
          return delLocation(locationIds);
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
        'mes/wm/location/export',
        {
          ...this.queryParams,
        },
        `location_${new Date().getTime()}.xlsx`,
      );
    },
    handleArea(locationId) {
      this.$router.push({ name: 'WmsArea', query: { locationId: locationId || 0, optType: this.optType } });
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        genCode('LOCATION_CODE').then(response => {
          this.form.locationCode = response;
        });
      } else {
        this.form.locationCode = null;
      }
    },
  },
};
</script>
