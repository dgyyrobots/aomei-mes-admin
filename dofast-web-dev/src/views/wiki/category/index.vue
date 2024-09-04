<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="父id" prop="pid">
        <!-- <el-input v-model="queryParams.pid" placeholder="请输入父id" clearable @keyup.enter.native="handleQuery" /> -->
        <el-select v-model="queryParams.pid" placeholder="请选择父id" @change="handleQuery" clearable>
          <el-option :label="item.name" :value="item.id" v-for="item in sjList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类别等级" prop="categoryLevel">
        <el-select v-model="queryParams.categoryLevel" placeholder="请选择类别等级" clearable size="small" @change="handleQuery">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.WIKI_CATEGORY_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="种类名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入种类名称" clearable @keyup.enter.native="handleQuery" />
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
          v-hasPermi="['wiki:category:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['wiki:category:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="种类id" align="center" prop="id" />
      <el-table-column label="父id" align="center" prop="pid" />
      <el-table-column label="类别等级" align="center" prop="categoryLevel">
        <template slot-scope="{row}">
          <!-- <dict-tag :type="DICT_TYPE.WIKI_CATEGORY_TYPE" :value="row.categoryLevel" /> -->
          {{ row.categoryLevel ? 1 : 0 }}
        </template>
      </el-table-column>
      <el-table-column label="种类名称" align="center" prop="name" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['wiki:category:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['wiki:category:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父id" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入父id" />
          <!-- <el-select v-model="form.pid" placeholder="请选择父id">
            <el-option :label="item.name" :value="item.id" v-for="item in sjList" :key="item.id"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="类别等级" prop="categoryLevel">
          <el-radio-group v-model="form.categoryLevel">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.WIKI_CATEGORY_TYPE)" :key="dict.value"
              :label="dict.value">
              {{ dict.label }}
            </el-radio>
          </el-radio-group>

        </el-form-item>
        <el-form-item label="种类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入种类名称" />
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
import { createCategory, updateCategory, deleteCategory, getCategory, getCategoryPage, exportCategoryExcel } from "@/api/wiki/category";

export default {
  name: "Category",
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
      // 首页的分类列表
      list: [],
      sjList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        pid: null,
        categoryLevel: null,
        name: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        categoryLevel: [{ required: true, message: "类别等级不能为空", trigger: "blur" }],
        name: [{ required: true, message: "种类名称不能为空", trigger: "blur" }],
      },
      fag: true
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
      getCategoryPage(this.queryParams).then(response => {
        if (response.data.list.length && this.fag) {
          this.fag = false;
          this.sjList = response.data.list;
        }
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
        pid: undefined,
        categoryLevel: undefined,
        name: undefined,
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
      this.title = "添加首页的分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getCategory(id).then(response => {
        response.data.categoryLevel = response.data.categoryLevel ? '1' : '0';
        this.form = response.data;
        console.log(this.form);
        this.open = true;
        this.title = "修改首页的分类";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        let obj = JSON.parse(JSON.stringify(this.form));
        obj.categoryLevel = obj.categoryLevel == '1' ? true : false;
        // 修改的提交
        if (obj.id != null) {
          updateCategory(obj).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCategory(obj).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除首页的分类编号为"' + id + '"的数据项?').then(function () {
        return deleteCategory(id);
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
      this.$modal.confirm('是否确认导出所有首页的分类数据项?').then(() => {
        this.exportLoading = true;
        return exportCategoryExcel(params);
      }).then(response => {
        this.$download.excel(response, '首页的分类.xls');
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
