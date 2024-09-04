<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="讲师名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入讲师名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="讲师授课方向" prop="direction" label-width="96">
        <el-input v-model="queryParams.direction" placeholder="请输入讲师授课方向" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="讲师照片" prop="picture">
        <el-input v-model="queryParams.picture" placeholder="请输入讲师照片" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
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
          v-hasPermi="['wiki:lecturer:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['wiki:lecturer:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="讲师名称" align="center" prop="name" />
      <el-table-column label="讲师授课方向" align="center" prop="direction" />
      <el-table-column label="讲师照片" align="center" prop="picture">
        <template slot-scope="{row}">
          <img :src="row.picture" style="width: 150px;height: 200px;" alt="">
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
            v-hasPermi="['wiki:lecturer:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['wiki:lecturer:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="讲师名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入讲师名称" />
        </el-form-item>
        <el-form-item label="讲师授课方向" prop="direction">
          <el-input v-model="form.direction" placeholder="请输入讲师授课方向" />
        </el-form-item>
        <el-form-item label="讲师照片" prop="picture">
          <imageUpload v-model="form.picture" :limit="1" />
        </el-form-item>
        <!-- <el-form-item label="讲师课件" prop="courseware">
          <el-cascader v-model="form.courseware" :options="options" :props="props" clearable></el-cascader>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createLecturer, updateLecturer, deleteLecturer, getLecturer, getLecturerPage, exportLecturerExcel } from "@/api/wiki/lecturer";
import ImageUpload from '@/components/ImageUpload';
export default {
  name: "Lecturer",
  components: {
    ImageUpload
  },
  data() {
    return {
      props: { multiple: true },
      options: [{
        value: 1,
        label: '东南',
        children: [{
          value: 2,
          label: '上海',
        }, {
          value: 7,
          label: '江苏',
        }, {
          value: 12,
          label: '浙江',
        }]
      }, {
        value: 17,
        label: '西北',
        children: [{
          value: 18,
          label: '陕西',
        }, {
          value: 21,
          label: '新疆维吾尔族自治区',
        }]
      }],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 讲师的信息	列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        direction: null,
        // picture: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "讲师名称不能为空", trigger: "blur" }],
        direction: [{ required: true, message: "讲师授课方向不能为空", trigger: "blur" }],
        picture: [{ required: true, message: "讲师照片不能为空", trigger: "blur" }],
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
      getLecturerPage(this.queryParams).then(response => {
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
        direction: undefined,
        picture: undefined,
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
      this.title = "添加讲师的信息	";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getLecturer(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改讲师的信息	";
      });
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.form);
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateLecturer(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createLecturer(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除讲师的信息	编号为"' + id + '"的数据项?').then(function () {
        return deleteLecturer(id);
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
      this.$modal.confirm('是否确认导出所有讲师的信息	数据项?').then(() => {
        this.exportLoading = true;
        return exportLecturerExcel(params);
      }).then(response => {
        this.$download.excel(response, '讲师的信息	.xls');
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
