<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="采购订单Id" prop="purchaseId">
        <el-input v-model="queryParams.purchaseId" placeholder="请输入采购订单Id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商品编号" prop="goodsNumber">
        <el-input v-model="queryParams.goodsNumber" placeholder="请输入商品编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="queryParams.goodsName" placeholder="请输入商品名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商品规格" prop="goodsSpecs">
        <el-input v-model="queryParams.goodsSpecs" placeholder="请输入商品规格" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商品单位" prop="company">
        <el-input v-model="queryParams.company" placeholder="请输入商品单位" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="采购单价" prop="monovalent">
        <el-input v-model="queryParams.monovalent" placeholder="请输入采购单价" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="采购数量" prop="quantity">
        <el-input v-model="queryParams.quantity" placeholder="请输入采购数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="税金" prop="taxes">
        <el-input v-model="queryParams.taxes" placeholder="请输入税金" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="采购总价" prop="total">
        <el-input v-model="queryParams.total" placeholder="请输入采购总价" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商品分类名称" prop="categoryName">
        <el-input v-model="queryParams.categoryName" placeholder="请输入商品分类名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="品牌名称" prop="brandName">
        <el-input v-model="queryParams.brandName" placeholder="请输入品牌名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['purchase:goods:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['purchase:goods:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="采购订单Id" align="center" prop="purchaseId" />
      <el-table-column label="商品编号" align="center" prop="goodsNumber" />
      <el-table-column label="商品名称" align="center" prop="goodsName" />
      <el-table-column label="商品规格" align="center" prop="goodsSpecs" />
      <el-table-column label="商品单位" align="center" prop="company" />
      <el-table-column label="采购单价" align="center" prop="monovalent" />
      <el-table-column label="采购数量" align="center" prop="quantity" />
      <el-table-column label="税金" align="center" prop="taxes" />
      <el-table-column label="采购总价" align="center" prop="total" />
      <el-table-column label="商品分类名称" align="center" prop="categoryName" />
      <el-table-column label="品牌名称" align="center" prop="brandName" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['purchase:goods:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['purchase:goods:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="采购订单Id" prop="purchaseId">
          <el-input v-model="form.purchaseId" placeholder="请输入采购订单Id" />
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
        <el-form-item label="税金" prop="taxes">
          <el-input v-model="form.taxes" placeholder="请输入税金" />
        </el-form-item>
        <el-form-item label="采购总价" prop="total">
          <el-input v-model="form.total" placeholder="请输入采购总价" />
        </el-form-item>
        <el-form-item label="商品分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入商品分类名称" />
        </el-form-item>
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="form.brandName" placeholder="请输入品牌名称" />
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
import { createGoods, updateGoods, deleteGoods, getGoods, getGoodsPage, exportGoodsExcel } from '@/api/purchase/goods';

export default {
  name: 'Goods',
  components: {},
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
      // 采购商品明细列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        purchaseId: null,
        goodsNumber: null,
        goodsName: null,
        goodsSpecs: null,
        company: null,
        monovalent: null,
        quantity: null,
        taxes: null,
        total: null,
        categoryName: null,
        brandName: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
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
        purchaseId: undefined,
        goodsNumber: undefined,
        goodsName: undefined,
        goodsSpecs: undefined,
        company: undefined,
        monovalent: undefined,
        quantity: undefined,
        taxes: undefined,
        total: undefined,
        categoryName: undefined,
        brandName: undefined,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加采购商品明细';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getGoods(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改采购商品明细';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateGoods(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createGoods(this.form).then(response => {
          this.$modal.msgSuccess('新增成功');
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal
        .confirm('是否确认删除采购商品明细编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteGoods(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm('是否确认导出所有采购商品明细数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportGoodsExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '采购商品明细.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
