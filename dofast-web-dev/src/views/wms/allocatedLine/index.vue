<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="调拨单ID" prop="allocatedId">
        <el-input v-model="queryParams.allocatedId" placeholder="请输入调拨单ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="库存ID" prop="materialStockId">
        <el-input v-model="queryParams.materialStockId" placeholder="请输入库存ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="产品物料ID" prop="itemId">
        <el-input v-model="queryParams.itemId" placeholder="请输入产品物料ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="产品物料编码" prop="itemCode">
        <el-input v-model="queryParams.itemCode" placeholder="请输入产品物料编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="产品物料名称" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入产品物料名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="规格型号" prop="specification">
        <el-input v-model="queryParams.specification" placeholder="请输入规格型号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="单位" prop="unitOfMeasure">
        <el-input v-model="queryParams.unitOfMeasure" placeholder="请输入单位" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="调拨数量" prop="quantityAllocated">
        <el-input v-model="queryParams.quantityAllocated" placeholder="请输入调拨数量" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="调拨批次号" prop="batchCode">
        <el-input v-model="queryParams.batchCode" placeholder="请输入调拨批次号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="仓库ID" prop="warehouseId">
        <el-input v-model="queryParams.warehouseId" placeholder="请输入仓库ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="仓库编码" prop="warehouseCode">
        <el-input v-model="queryParams.warehouseCode" placeholder="请输入仓库编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="库区ID" prop="locationId">
        <el-input v-model="queryParams.locationId" placeholder="请输入库区ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="库区编码" prop="locationCode">
        <el-input v-model="queryParams.locationCode" placeholder="请输入库区编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="库区名称" prop="locationName">
        <el-input v-model="queryParams.locationName" placeholder="请输入库区名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="库位ID" prop="areaId">
        <el-input v-model="queryParams.areaId" placeholder="请输入库位ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="库位编码" prop="areaCode">
        <el-input v-model="queryParams.areaCode" placeholder="请输入库位编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="库位名称" prop="areaName">
        <el-input v-model="queryParams.areaName" placeholder="请输入库位名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="queryParams.remark" placeholder="请输入备注" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['wms:allocated-line:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['wms:allocated-line:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="行ID" align="center" prop="id" />
      <el-table-column label="调拨单ID" align="center" prop="allocatedId" />
      <el-table-column label="库存ID" align="center" prop="materialStockId" />
      <el-table-column label="产品物料ID" align="center" prop="itemId" />
      <el-table-column label="产品物料编码" align="center" prop="itemCode" />
      <el-table-column label="产品物料名称" align="center" prop="itemName" />
      <el-table-column label="规格型号" align="center" prop="specification" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="调拨数量" align="center" prop="quantityAllocated" />
      <el-table-column label="调拨批次号" align="center" prop="batchCode" />
      <el-table-column label="仓库ID" align="center" prop="warehouseId" />
      <el-table-column label="仓库编码" align="center" prop="warehouseCode" />
      <el-table-column label="仓库名称" align="center" prop="warehouseName" />
      <el-table-column label="库区ID" align="center" prop="locationId" />
      <el-table-column label="库区编码" align="center" prop="locationCode" />
      <el-table-column label="库区名称" align="center" prop="locationName" />
      <el-table-column label="库位ID" align="center" prop="areaId" />
      <el-table-column label="库位编码" align="center" prop="areaCode" />
      <el-table-column label="库位名称" align="center" prop="areaName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['wms:allocated-line:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['wms:allocated-line:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="调拨单ID" prop="allocatedId">
          <el-input v-model="form.allocatedId" placeholder="请输入调拨单ID" />
        </el-form-item>
        <el-form-item label="库存ID" prop="materialStockId">
          <el-input v-model="form.materialStockId" placeholder="请输入库存ID" />
        </el-form-item>
        <el-form-item label="产品物料ID" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入产品物料ID" />
        </el-form-item>
        <el-form-item label="产品物料编码" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="请输入产品物料编码" />
        </el-form-item>
        <el-form-item label="产品物料名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入产品物料名称" />
        </el-form-item>
        <el-form-item label="规格型号" prop="specification">
          <el-input v-model="form.specification" placeholder="请输入规格型号" />
        </el-form-item>
        <el-form-item label="单位" prop="unitOfMeasure">
          <el-input v-model="form.unitOfMeasure" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="调拨数量" prop="quantityAllocated">
          <el-input v-model="form.quantityAllocated" placeholder="请输入调拨数量" />
        </el-form-item>
        <el-form-item label="调拨批次号" prop="batchCode">
          <el-input v-model="form.batchCode" placeholder="请输入调拨批次号" />
        </el-form-item>
        <el-form-item label="仓库ID" prop="warehouseId">
          <el-input v-model="form.warehouseId" placeholder="请输入仓库ID" />
        </el-form-item>
        <el-form-item label="仓库编码" prop="warehouseCode">
          <el-input v-model="form.warehouseCode" placeholder="请输入仓库编码" />
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="库区ID" prop="locationId">
          <el-input v-model="form.locationId" placeholder="请输入库区ID" />
        </el-form-item>
        <el-form-item label="库区编码" prop="locationCode">
          <el-input v-model="form.locationCode" placeholder="请输入库区编码" />
        </el-form-item>
        <el-form-item label="库区名称" prop="locationName">
          <el-input v-model="form.locationName" placeholder="请输入库区名称" />
        </el-form-item>
        <el-form-item label="库位ID" prop="areaId">
          <el-input v-model="form.areaId" placeholder="请输入库位ID" />
        </el-form-item>
        <el-form-item label="库位编码" prop="areaCode">
          <el-input v-model="form.areaCode" placeholder="请输入库位编码" />
        </el-form-item>
        <el-form-item label="库位名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入库位名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createAllocatedLine, updateAllocatedLine, deleteAllocatedLine, getAllocatedLine, getAllocatedLinePage, exportAllocatedLineExcel } from "@/api/wms/allocatedLine";

export default {
  name: "AllocatedLine",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 调拨单身列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        allocatedId: null,
        materialStockId: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        quantityAllocated: null,
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
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemId: [{ required: true, message: "产品物料ID不能为空", trigger: "blur" }],
        quantityAllocated: [{ required: true, message: "调拨数量不能为空", trigger: "blur" }],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getAllocatedLinePage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        allocatedId: undefined,
        materialStockId: undefined,
        itemId: undefined,
        itemCode: undefined,
        itemName: undefined,
        specification: undefined,
        unitOfMeasure: undefined,
        quantityAllocated: undefined,
        batchCode: undefined,
        warehouseId: undefined,
        warehouseCode: undefined,
        warehouseName: undefined,
        locationId: undefined,
        locationCode: undefined,
        locationName: undefined,
        areaId: undefined,
        areaCode: undefined,
        areaName: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加调拨单身";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getAllocatedLine(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改调拨单身";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateAllocatedLine(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createAllocatedLine(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除调拨单身编号为"' + id + '"的数据项?').then(function() {
          return deleteAllocatedLine(id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有调拨单身数据项?').then(() => {
          this.exportLoading = true;
          return exportAllocatedLineExcel(params);
        }).then(response => {
          this.$download.excel(response, '调拨单身.xls');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
