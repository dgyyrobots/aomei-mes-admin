<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="等级代码" prop="levelCode">
        <el-input v-model="queryParams.levelCode" placeholder="请输入等级代码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="等级名称" prop="levelName">
        <el-input v-model="queryParams.levelName" placeholder="请输入等级名称" clearable @keyup.enter.native="handleQuery"/>
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
                   v-hasPermi="['mes:exception-level-config:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['mes:exception-level-config:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="等级代码" align="center" prop="levelCode" />
      <el-table-column label="等级名称" align="center" prop="levelName" />
      <el-table-column label="显示颜色" align="center" prop="color" />
      <el-table-column label="要求响应时间(分钟)" align="center" prop="responseTime" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['mes:exception-level-config:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['mes:exception-level-config:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="65%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">

        <el-row>
          <el-col :span="8">
            <el-form-item label="等级代码" prop="levelCode">
              <el-input v-model="form.levelCode" placeholder="请输入等级代码" />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view'"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="等级名称" prop="levelName">
              <el-input v-model="form.levelName" placeholder="请输入等级名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="5">
            <el-form-item label="显示颜色" prop="color">
              <el-color-picker v-model="form.color"></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-input v-model="form.color" maxlength="7" placeholder="在左侧选择颜色" />
          </el-col>

          <el-col :span="12">
            <el-form-item label="要求响应时间(分钟)" prop="responseTime">
              <el-input-number :min="1" v-model="form.responseTime" placeholder="请输入" />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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
import { createExceptionLevelConfig, updateExceptionLevelConfig, deleteExceptionLevelConfig, getExceptionLevelConfig, getExceptionLevelConfigPage, exportExceptionLevelConfigExcel } from "@/api/mes/exceptionLevelConfig";
import {genCode} from '@/api/mes/autocode/rule';

export default {
  name: "ExceptionLevelConfig",
  components: {
  },
  data() {
    return {
      autoGenFlag: false,
      optType: undefined,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 异常等级配置列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        levelCode: null,
        levelName: null,
        color: null,
        responseTime: [],
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        levelCode: [{ required: true, message: "等级代码不能为空", trigger: "blur" }],
        levelName: [{ required: true, message: "等级名称不能为空", trigger: "blur" }],
        color: [{ required: true, message: "显示颜色不能为空", trigger: "blur" }],
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
      getExceptionLevelConfigPage(this.queryParams).then(response => {
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
        levelCode: undefined,
        levelName: undefined,
        color: undefined,
        responseTime: undefined,
        remark: undefined,
        attr1: undefined,
        attr2: undefined,
        attr3: undefined,
        attr4: undefined,
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
      this.title = "添加异常等级配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getExceptionLevelConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改异常等级配置";
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
          updateExceptionLevelConfig(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createExceptionLevelConfig(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除异常等级配置编号为"' + id + '"的数据项?').then(function() {
          return deleteExceptionLevelConfig(id);
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
      this.$modal.confirm('是否确认导出所有异常等级配置数据项?').then(() => {
          this.exportLoading = true;
          return exportExceptionLevelConfigExcel(params);
        }).then(response => {
          this.$download.excel(response, '异常等级配置.xls');
          this.exportLoading = false;
        }).catch(() => {});
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        this.loading = true;
        genCode('EXCEPTION_LEVEL_CODE').then(response => {
          this.form.levelCode = response;
          this.loading = false;
        });
      } else {
        this.form.levelCode = null;
      }
    },
  }
};
</script>
