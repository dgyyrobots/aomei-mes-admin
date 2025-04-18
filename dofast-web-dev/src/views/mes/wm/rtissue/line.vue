<template>
  <div class="app-container">
    <el-row v-if="optType != 'view'" :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['wms:rt-issue:create']">新增 </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['wms:rt-issue:update']">修改 </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['wms:rt-issue:delete']">删除 </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="rtissuelineList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="物料编码" width="120px" align="center" prop="itemCode" />
      <el-table-column label="物料名称" width="150px" align="center" prop="itemName" />
      <el-table-column label="规格型号" align="center" prop="specification" :show-overflow-tooltip="true" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="退料数量" align="center" prop="quantityRt" />
      <el-table-column label="领料批次号" width="120px" align="center" prop="batchCode" />
      <el-table-column label="仓库名称" width="100px" align="center" prop="warehouseName" />
      <el-table-column label="库区名称" width="100px" align="center" prop="locationName" />
      <el-table-column label="库位名称" align="center" prop="areaName" />
      <el-table-column label="操作" width="100px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="optType != 'view'" v-hasPermi="['wms:rt-issue:update']">修改 </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-if="optType != 'view'" v-hasPermi="['wms:rt-issue:delete']">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改生产退料单行对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="物料编码" prop="itemCode">
              <el-input v-model="form.itemCode" placeholder="请选择退料物料">
                <el-button slot="append" @click="handleSelectStock" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
            <StockSelect ref="stockSelect" :warehouseCode="warehouseCode" @onSelected="onStockSelected"></StockSelect>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料名称" prop="itemName">
              <el-input v-model="form.itemName" readonly="readonly" placeholder="请选择退料物料" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input v-model="form.unitOfMeasure" readonly="readonly" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="规格型号" prop="specification">
              <el-input v-model="form.specification" readonly="readonly" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="批次号" prop="batchCode">
              <el-input v-model="form.batchCode" readonly="readonly" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退料数量" prop="quantityRt">
              <el-input v-model="form.quantityRt" :max="form.quantityMax" placeholder="请输入退料数量" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接收仓库" prop="warehouseId">
              <el-cascader v-model="warehouseInfo" :options="warehouseOptions" :props="warehouseProps" @change="handleWarehouseChanged"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRtissueline, getRtissueline, delRtissueline, addRtissueline, updateRtissueline } from '@/api/mes/wm/rtissueline';
import StockSelect from '@/components/stockSelect/single.vue';
import { getTreeList } from '@/api/mes/wm/warehouse';

export default {
  name: 'Rtissueline',
  components: {
    StockSelect,
  },
  props: {
    rtId: null,
    optType: null,
  },
  data() {
    return {
      warehouseCode: 'XBK_VIRTUAL', //线边库
      warehouseInfo: [],
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
      },
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
      // 生产退料单行表格数据
      rtissuelineList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        rtId: this.rtId,
        materialStockId: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        quantityRt: null,
        batchCode: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemCode: [
          {
            required: true,
            message: '物料不能为空',
            trigger: 'blur',
          },
        ],
        quantityRt: [
          {
            required: true,
            message: '退料数量不能为空',
            trigger: 'blur',
          },
        ],
        warehouseId: [
          {
            required: true,
            message: '接收仓库不能为空',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getWarehouseList();
  },
  methods: {
    /** 查询生产退料单行列表 */
    getList() {
      this.loading = true;
      listRtissueline(this.queryParams).then(response => {
        this.rtissuelineList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    getWarehouseList() {
      getTreeList().then(response => {
        if (response.data) {
          this.warehouseOptions = response.data.filter(el => {
            return el.warehouseCode.indexOf('VIR') == -1;
          });
        }
        this.warehouseOptions.map(w => {
          w.children.map(l => {
            let lstr = JSON.stringify(l.children)
              .replace(/locationId/g, 'lId')
              .replace(/areaId/g, 'pId')
              .replace(/areaName/g, 'pName');
            l.children = JSON.parse(lstr);
          });

          let wstr = JSON.stringify(w.children)
            .replace(/warehouseId/g, 'wId')
            .replace(/locationId/g, 'pId')
            .replace(/locationName/g, 'pName');
          w.children = JSON.parse(wstr);
        });
        let ostr = JSON.stringify(this.warehouseOptions)
          .replace(/warehouseId/g, 'pId')
          .replace(/warehouseName/g, 'pName');
        this.warehouseOptions = JSON.parse(ostr);
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
        rtId: this.rtId,
        materialStockId: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        quantityRt: null,
        quantityMax: null,
        batchCode: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
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
      this.title = '添加生产退料单行';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const lineId = row.id || this.ids;
      getRtissueline(lineId).then(response => {
        this.form = response.data;
        this.warehouseInfo[0] = response.data.warehouseId;
        this.warehouseInfo[1] = response.data.locationId;
        this.warehouseInfo[2] = response.data.areaId;
        this.open = true;
        this.title = '修改生产退料单行';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRtissueline(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addRtissueline(this.form).then(response => {
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
      const lineIds = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除生产退料单行编号为"' + lineIds + '"的数据项？')
        .then(function () {
          return delRtissueline(lineIds);
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
        'wm/rtissueline/export',
        {
          ...this.queryParams,
        },
        `rtissueline_${new Date().getTime()}.xlsx`,
      );
    },
    handleSelectStock() {
      this.$refs.stockSelect.showFlag = true;
      this.$refs.stockSelect.getList();
    },
    //物料选择弹出框
    onStockSelected(obj) {
      if (obj != undefined && obj != null) {
        this.form.materialStockId = obj.materialStockId;
        this.form.itemId = obj.itemId;
        this.form.itemCode = obj.itemCode;
        this.form.itemName = obj.itemName;
        this.form.specification = obj.specification;
        this.form.unitOfMeasure = obj.unitOfMeasure;
        this.form.batchCode = obj.batchCode;
        this.form.quantityRt = obj.quantityOnhand;
        this.form.quantityMax = obj.quantityOnhand;
      }
    },
    //选择默认的仓库、库区、库位
    handleWarehouseChanged(obj) {
      if (obj != null) {
        debugger;
        this.form.warehouseId = obj[0];
        this.form.locationId = obj[1];
        this.form.areaId = obj[2];
      }
    },
  },
};
</script>
