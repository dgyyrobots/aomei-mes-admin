<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="字段名" prop="field">
        <el-input v-model="queryParams.field" placeholder="请输入字段名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="验证器" prop="validator">
        <el-select v-model="queryParams.validator" placeholder="请选择验证器" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.SYSTEM_FORM_VALIDATOR)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.SYSTEM_FORM_ITEM_TYPE)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:form-item:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['system:form-item:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="字段名" align="center" prop="field" />
      <el-table-column label="验证器" align="center" prop="validator">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_FORM_VALIDATOR" :value="scope.row.validator" />
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="type">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_FORM_ITEM_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="默认值" align="center" prop="defaultValue" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:form-item:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:form-item:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父级" prop="parentId">
          <Treeselect v-model="form.parentId" :options="options" placeholder="上级字段" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="字段名" prop="field">
          <el-input v-model="form.field" placeholder="请输入字段名" />
        </el-form-item>
        <el-form-item label="验证器" prop="validator">
          <el-select v-model="form.validator" placeholder="请选择验证器">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.SYSTEM_FORM_VALIDATOR)" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.SYSTEM_FORM_ITEM_TYPE)" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="其他参数" prop="props">
          <el-input v-model="form.props" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="组件参数" prop="componentProps">
          <el-input v-model="form.componentProps" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="字典" prop="dictType">
          <el-select v-model="form.dictType" placeholder="请选择字典">
            <el-option v-for="dict in dictOptions" :key="dict.id" :label="dict.name" :value="dict.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="默认值" prop="defaultValue">
          <el-input v-model="form.defaultValue" placeholder="请输入默认值" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
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
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { createFormItem, updateFormItem, deleteFormItem, getFormItem, getFormItemList, exportFormItemExcel } from '@/api/system/formItem';
import { listAllSimple as listAllSimpleDictType } from '@/api/system/dict/type';

export default {
  name: 'FormItem',
  components: { Treeselect },
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
      // 字段列表
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
        field: null,
        validator: null,
        type: null,
        createTime: [],
      },
      dictOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [{ required: true, message: '父级不能为空', trigger: 'change' }],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        field: [{ required: true, message: '字段名不能为空', trigger: 'blur' }],
        validator: [{ required: true, message: '验证器不能为空', trigger: 'change' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
      },
      form_id: 0,
    };
  },
  computed: {
    options() {
      const options = this.treeFilter(
        [
          {
            id: 0,
            name: '根节点',
            children: this.list,
          },
        ],
        node => {
          return [
            {
              id: node.id,
              label: node.name,
              children: node.children && node.children.length ? node.children : undefined,
            },
          ];
        },
      );
      return options;
    },
  },
  created() {
    this.form_id = this.$route?.query?.form_id ? this.$route.query.form_id : 0;
    this.getList();
    /** 查询字典下拉列表 */
    listAllSimpleDictType().then(response => {
      this.dictOptions = response.data;
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getFormItemList({ formId: this.form_id }).then(response => {
        this.list = this.handleTree(response.data);
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
        parentId: 0,
        name: undefined,
        field: undefined,
        validator: undefined,
        type: undefined,
        props: undefined,
        componentProps: undefined,
        dictType: undefined,
        defaultValue: undefined,
        sort: 0,
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
      this.title = '添加字段';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getFormItem(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改字段';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        this.form.formId = this.form_id;
        // 修改的提交
        if (this.form.id != null) {
          updateFormItem(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createFormItem(this.form).then(response => {
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
        .confirm('是否确认删除字段编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteFormItem(id);
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
        .confirm('是否确认导出所有字段数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportFormItemExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '字段.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    /** 转换设备类型数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.machineryTypeId,
        label: node.machineryTypeName,
        children: node.children,
      };
    },
  },
};
</script>
