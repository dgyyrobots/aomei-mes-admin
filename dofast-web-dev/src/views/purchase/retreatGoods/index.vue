<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="仓退单ID" prop="retreatId">
        <el-input v-model="queryParams.retreatId" placeholder="请输入仓退单ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="商品编号" prop="goodsNumber">
        <el-input v-model="queryParams.goodsNumber" placeholder="请输入商品编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="queryParams.goodsName" placeholder="请输入商品名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="商品规格" prop="goodsSpecs">
        <el-input v-model="queryParams.goodsSpecs" placeholder="请输入商品规格" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="商品单位" prop="company">
        <el-input v-model="queryParams.company" placeholder="请输入商品单位" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="采购单价" prop="monovalent">
        <el-input v-model="queryParams.monovalent" placeholder="请输入采购单价" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="采购数量" prop="quantity">
        <el-input v-model="queryParams.quantity" placeholder="请输入采购数量" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="入库数量" prop="receiveNum">
        <el-input v-model="queryParams.receiveNum" placeholder="请输入入库数量" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="入库单位" prop="unitOfMeasure">
        <el-input v-model="queryParams.unitOfMeasure" placeholder="请输入入库单位" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="批次" prop="batchCode">
        <el-input v-model="queryParams.batchCode" placeholder="请输入批次" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="项次" prop="consequence">
        <el-input v-model="queryParams.consequence" placeholder="请输入项次" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态（0-未收货 , 1-未打印，2-已打印，3-已入库）" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态（0-未收货 , 1-未打印，2-已打印，3-已入库）" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['purchase:goods:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['purchase:goods:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="仓退单ID" align="center" prop="retreatId" />
      <el-table-column label="商品编号" align="center" prop="goodsNumber" />
      <el-table-column label="商品名称" align="center" prop="goodsName" />
      <el-table-column label="商品规格" align="center" prop="goodsSpecs" />
      <el-table-column label="商品单位" align="center" prop="company" />
      <el-table-column label="采购单价" align="center" prop="monovalent" />
      <el-table-column label="采购数量" align="center" prop="quantity" />
      <el-table-column label="入库数量" align="center" prop="receiveNum" />
      <el-table-column label="入库单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="批次" align="center" prop="batchCode" />
      <el-table-column label="项次" align="center" prop="consequence" />
      <el-table-column label="状态（0-未收货 , 1-未打印，2-已打印，3-已入库）" align="center" prop="status" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库ID" align="center" prop="warehouseId" />
      <el-table-column label="仓库编码" align="center" prop="warehouseCode" />
      <el-table-column label="仓库名称" align="center" prop="warehouseName" />
      <el-table-column label="库区ID" align="center" prop="locationId" />
      <el-table-column label="库区编码" align="center" prop="locationCode" />
      <el-table-column label="库区名称" align="center" prop="locationName" />
      <el-table-column label="库位ID" align="center" prop="areaId" />
      <el-table-column label="库位编码" align="center" prop="areaCode" />
      <el-table-column label="库位名称" align="center" prop="areaName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['purchase:goods:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['purchase:goods:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="仓退单ID" prop="retreatId">
          <el-input v-model="form.retreatId" placeholder="请输入仓退单ID" />
        </el-form-item>
        <el-form-item label="商品编号" prop="goodsNumber">
          <el-input v-model="form.goodsNumber" placeholder="请输入商品编号" />
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品规格" prop="goodsSpecs">
          <el-input v-model="form.goodsSpecs" placeholder="请输入商品规格" />
        </el-form-item>
        <el-form-item label="商品单位" prop="company">
          <el-input v-model="form.company" placeholder="请输入商品单位" />
        </el-form-item>
        <el-form-item label="采购单价" prop="monovalent">
          <el-input v-model="form.monovalent" placeholder="请输入采购单价" />
        </el-form-item>
        <el-form-item label="采购数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入采购数量" />
        </el-form-item>
        <el-form-item label="入库数量" prop="receiveNum">
          <el-input v-model="form.receiveNum" placeholder="请输入入库数量" />
        </el-form-item>
        <el-form-item label="入库单位" prop="unitOfMeasure">
          <el-input v-model="form.unitOfMeasure" placeholder="请输入入库单位" />
        </el-form-item>
        <el-form-item label="批次" prop="batchCode">
          <el-input v-model="form.batchCode" placeholder="请输入批次" />
        </el-form-item>
        <el-form-item label="项次" prop="consequence">
          <el-input v-model="form.consequence" placeholder="请输入项次" />
        </el-form-item>
        <el-form-item label="状态（0-未收货 , 1-未打印，2-已打印，3-已入库）" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createGoods, updateGoods, deleteGoods, getGoods, getGoodsPage, exportGoodsExcel } from "@/api/purchase/retreatGoods";

export default {
  name: "Goods",
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
      // ERP仓退单单身列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        retreatId: null,
        goodsNumber: null,
        goodsName: null,
        goodsSpecs: null,
        company: null,
        monovalent: null,
        quantity: null,
        receiveNum: null,
        unitOfMeasure: null,
        batchCode: null,
        consequence: null,
        status: null,
        createTime: [],
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
      getGoodsPage(this.queryParams).then(response => {
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
        retreatId: undefined,
        goodsNumber: undefined,
        goodsName: undefined,
        goodsSpecs: undefined,
        company: undefined,
        monovalent: undefined,
        quantity: undefined,
        receiveNum: undefined,
        unitOfMeasure: undefined,
        batchCode: undefined,
        consequence: undefined,
        status: undefined,
        warehouseId: undefined,
        warehouseCode: undefined,
        warehouseName: undefined,
        locationId: undefined,
        locationCode: undefined,
        locationName: undefined,
        areaId: undefined,
        areaCode: undefined,
        areaName: undefined,
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
      this.title = "添加ERP仓退单单身";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getGoods(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改ERP仓退单单身";
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
          updateGoods(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createGoods(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除ERP仓退单单身编号为"' + id + '"的数据项?').then(function() {
          return deleteGoods(id);
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
      this.$modal.confirm('是否确认导出所有ERP仓退单单身数据项?').then(() => {
          this.exportLoading = true;
          return exportGoodsExcel(params);
        }).then(response => {
          this.$download.excel(response, 'ERP仓退单单身.xls');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
