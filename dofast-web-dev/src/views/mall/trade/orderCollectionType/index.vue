<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery" />
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['trade:order-collection-type:create']">新增 </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['trade:order-collection-type:export']">导出 </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="表单" align="center" prop="formId" :formatter="row => getOptionLabel(forms, row.formId)" />
      <el-table-column label="类型" align="center" prop="type" :formatter="row => ['系统自动', '可发布', '可自用', '可发布可自用'][row.type]" />
      <el-table-column label="状态" align="center" prop="status" :formatter="row => ['已启用', '已禁用'][row.status]" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['trade:order-collection-type:update']">修改 </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['trade:order-collection-type:delete']">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="表单" prop="formId">
          <el-select v-model="form.formId" placeholder="请选择表单">
            <el-option v-for="opt in forms" :label="opt.name" :value="opt.id" :key="opt.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择表单">
            <el-option label="系统自动" :value="0" />
            <el-option label="可发布" :value="1" />
            <el-option label="可自用" :value="2" />
            <el-option label="可发布可自用" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择表单">
            <el-option label="已启用" :value="0" />
            <el-option label="已禁用" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sortCode">
          <el-input-number v-model="form.sortCode" :min="0" />
        </el-form-item>
        <el-form-item label="描述">
          <editor v-model="form.description" :min-height="192" />
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
import { createOrderCollectionType, updateOrderCollectionType, deleteOrderCollectionType, getOrderCollectionType, getOrderCollectionTypePage, exportOrderCollectionTypeExcel } from '@/api/mall/trade/orderCollectionType';
import { getFormSimpleList } from '@/api/system/form.js';
import Editor from '@/components/Editor';

export default {
  name: 'OrderCollectionType',
  components: {
    Editor,
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
      // 采集任务类型列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        formId: null,
        description: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单列表
      forms: [],
      // 表单校验
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        formId: [{ required: true, message: '表单不能为空', trigger: 'change' }],
      },
    };
  },
  created() {
    this.getList();
    getFormSimpleList({ type: 'collection', status: 0 }).then(res => {
      this.forms = res.data.map(item => {
        return { ...item, value: item.id, label: item.name };
      });
    });
  },
  methods: {
    getOptionLabel(options, value) {
      console.log(options, value);
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          console.log(options[i]);
          return options[i].label;
        }
      }
      return '';
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getOrderCollectionTypePage(this.queryParams).then(response => {
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
        name: undefined,
        formId: undefined,
        description: undefined,
        sortCode: 0,
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
      this.title = '添加采集任务类型';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getOrderCollectionType(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改采集任务类型';
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
          updateOrderCollectionType(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createOrderCollectionType(this.form).then(response => {
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
        .confirm('是否确认删除采集任务类型编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteOrderCollectionType(id);
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
        .confirm('是否确认导出所有采集任务类型数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportOrderCollectionTypeExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '采集任务类型.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
