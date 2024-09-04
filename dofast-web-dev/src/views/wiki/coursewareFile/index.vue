<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="课件id" prop="coursewareId">
        <!-- <el-input v-model="queryParams.coursewareId" placeholder="请输入课件id" clearable @keyup.enter.native="handleQuery" /> -->
        <el-select v-model="queryParams.coursewareId" placeholder="请选择课件id" clearable @change="handleQuery">
          <el-option :label="item.coursewareName" :value="item.id" v-for="item in kjList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件名称" prop="filename">
        <el-input v-model="queryParams.filename" placeholder="请输入文件名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="文件路径" prop="filepath">
        <el-input v-model="queryParams.filepath" placeholder="请输入文件路径" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="文件大小" prop="fileSize">
        <el-input v-model="queryParams.fileSize" placeholder="请输入文件大小" clearable @keyup.enter.native="handleQuery" />
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
          v-hasPermi="['wiki:courseware-file:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['wiki:courseware-file:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="文件id" align="center" prop="id" />
      <el-table-column label="课件id" align="center" prop="coursewareId" />
      <el-table-column label="文件名称" align="center" prop="filename" />
      <el-table-column label="文件路径" align="center" prop="filepath" />
      <el-table-column label="文件大小" align="center" prop="fileSize" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['wiki:courseware-file:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['wiki:courseware-file:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课件id" prop="coursewareId">
          <!-- <el-input v-model="form.coursewareId" placeholder="请输入课件id" /> -->
          <el-select v-model="form.coursewareId" placeholder="请选择课件id">
            <el-option :label="item.coursewareName" :value="item.id" v-for="item in kjList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件名称" prop="filename">
          <el-input v-model="form.filename" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="文件路径" prop="filepath">
          <el-input v-model="form.filepath" placeholder="请输入文件路径" disabled />
        </el-form-item>
        <el-form-item label="文件大小" prop="fileSize">
          <el-input v-model="form.fileSize" placeholder="请输入文件大小" />
        </el-form-item>
        <el-form-item label="文件上传">
          <FileUpload :limit="1" v-model="form.filepath" :fileType="['pdf', 'mp4']"></FileUpload>
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
import { createCoursewareFile, updateCoursewareFile, deleteCoursewareFile, getCoursewareFile, getCoursewareFilePage, exportCoursewareFileExcel } from "@/api/wiki/coursewareFile";
import { createCoursewave, updateCoursewave, deleteCoursewave, getCoursewave, getCoursewavePage, exportCoursewaveExcel } from "@/api/wiki/coursewave";
import FileUpload from '@/components/FileUpload';
export default {
  name: "CoursewareFile",
  components: {
    FileUpload
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
      // 课件文件的保存地址列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        coursewareId: null,
        filename: null,
        filepath: null,
        fileSize: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        coursewareId: [{ required: true, message: "课件id不能为空", trigger: "blur" }],
        filename: [{ required: true, message: "文件名称不能为空", trigger: "blur" }],
        filepath: [{ required: true, message: "文件路径不能为空", trigger: "blur" }],
      },
      kjList: []
    };
  },
  created() {
    this.getList();
    this.getKj()
  },
  methods: {
    // 获取课件列表
    getKj() {
      getCoursewavePage({ pageSize: 100 }).then(response => {
        this.kjList = response.data.list;
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getCoursewareFilePage(this.queryParams).then(response => {
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
        coursewareId: undefined,
        filename: undefined,
        filepath: undefined,
        fileSize: undefined,
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
      this.title = "添加课件文件的保存地址";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getCoursewareFile(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改课件文件的保存地址";
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
          updateCoursewareFile(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCoursewareFile(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除课件文件的保存地址编号为"' + id + '"的数据项?').then(function () {
        return deleteCoursewareFile(id);
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
      this.$modal.confirm('是否确认导出所有课件文件的保存地址数据项?').then(() => {
        this.exportLoading = true;
        return exportCoursewareFileExcel(params);
      }).then(response => {
        this.$download.excel(response, '课件文件的保存地址.xls');
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
