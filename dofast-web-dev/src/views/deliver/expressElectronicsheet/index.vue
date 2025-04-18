<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="配送快递名字" prop="companyName">
        <el-input v-model="queryParams.companyName" placeholder="请输入配送快递名字" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="配送信息" prop="info">
        <el-input v-model="queryParams.info" placeholder="请输入配送信息" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="配送编码(快递鸟)" prop="kdnCode">
        <el-input v-model="queryParams.kdnCode" placeholder="请输入配送编码(快递鸟)" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="信息模板" prop="template">
        <el-input v-model="queryParams.template" placeholder="请输入信息模板" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="快递配置信息" prop="config">
        <el-input v-model="queryParams.config" placeholder="请输入快递配置信息" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
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
          v-hasPermi="['deliver:express-electronicsheet:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['deliver:express-electronicsheet:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="配送快递名字" align="center" prop="companyName" />
      <el-table-column label="类型" align="center" prop="type" />
      <el-table-column label="配送信息" align="center" prop="info" />
      <el-table-column label="配送编码(快递鸟)" align="center" prop="kdnCode" />
      <el-table-column label="信息模板" align="center" prop="template">
        <template v-slot="scope">
          {{ JSON.stringify(scope.row.template) }}
        </template>
      </el-table-column>
      <el-table-column label="快递配置信息" align="center" prop="config">
        <template v-slot="scope">
          {{ JSON.stringify(scope.row.config) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['deliver:express-electronicsheet:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['deliver:express-electronicsheet:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="配送快递名字" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入配送快递名字" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <!-- <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="请选择字典生成" value="" />
          </el-select> -->
          <el-input v-model="form.type" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="配送信息" prop="info">
          <el-input v-model="form.info" placeholder="请输入配送信息" />
        </el-form-item>
        <el-form-item label="配送编码(快递鸟)" prop="kdnCode">
          <el-input v-model="form.kdnCode" placeholder="请输入配送编码(快递鸟)" />
        </el-form-item>
        <el-form-item label="信息模板" prop="template">
          <el-input v-model="form.template" placeholder="请输入信息模板" />
        </el-form-item>
        <el-form-item label="快递配置信息" prop="config">
          <el-input v-model="form.config" placeholder="请输入快递配置信息" />
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
import { createExpressElectronicsheet, updateExpressElectronicsheet, deleteExpressElectronicsheet, getExpressElectronicsheet, getExpressElectronicsheetPage, exportExpressElectronicsheetExcel } from "@/api/deliver/expressElectronicsheet";

export default {
  name: "ExpressElectronicsheet",
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
      // 电子面单列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        companyName: null,
        type: null,
        info: null,
        kdnCode: null,
        template: null,
        config: null,
        createTime: [],
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
      getExpressElectronicsheetPage(this.queryParams).then(response => {
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
        companyName: undefined,
        type: undefined,
        info: undefined,
        kdnCode: undefined,
        template: undefined,
        config: undefined,
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
      this.title = "添加电子面单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getExpressElectronicsheet(id).then(response => {
        response.data.config = JSON.stringify(response.data.config);
        response.data.template = JSON.stringify(response.data.template);
        this.form = response.data;
        this.open = true;
        this.title = "修改电子面单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        let obj = JSON.parse(JSON.stringify(this.form));
        obj.config = JSON.parse(obj.config);
        obj.template = JSON.parse(obj.template);
        // 修改的提交
        if (this.form.id != null) {
          updateExpressElectronicsheet(obj).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createExpressElectronicsheet(obj).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除电子面单编号为"' + id + '"的数据项?').then(function () {
        return deleteExpressElectronicsheet(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有电子面单数据项?').then(() => {
        this.exportLoading = true;
        return exportExpressElectronicsheetExcel(params);
      }).then(response => {
        this.$download.excel(response, '电子面单.xls');
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
