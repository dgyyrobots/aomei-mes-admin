<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="120px">

      <el-form-item label="异常类型" prop="exceptionType">
        <el-select v-model="queryParams.exceptionType" placeholder="请选择异常类型" clearable>
          <el-option v-for="dict in dict.type.mes_exception_type" :key="dict.value" :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>

      <el-form-item label="子类异常项编号" prop="subclassExceptionCode">
        <el-input v-model="queryParams.subclassExceptionCode" placeholder="请输入子类异常项编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="子类异常项名称" prop="subclassExceptionName">
        <el-input v-model="queryParams.subclassExceptionName" placeholder="请输入子类异常项名称" clearable @keyup.enter.native="handleQuery"/>
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
                   v-hasPermi="['mes:subclass-exception:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['mes:subclass-exception:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="子类异常项编号" align="center" prop="subclassExceptionCode" />
      <el-table-column label="子类异常项名称" align="center" prop="subclassExceptionName" />
      <el-table-column label="异常类型" align="center" prop="exceptionType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_exception_type" :value="scope.row.exceptionType"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['mes:subclass-exception:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['mes:subclass-exception:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="65%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="子类异常项编号" prop="subclassExceptionCode">
              <el-input v-model="form.subclassExceptionCode" placeholder="请输入子类异常项编号" :disabled="optType !== 'add'"/>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view'"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="子类异常项名称" prop="subclassExceptionName">
              <el-input v-model="form.subclassExceptionName" placeholder="请输入子类异常项名称"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="异常类型" prop="exceptionType">
              <el-select v-model="form.exceptionType" placeholder="请选择异常类型">
                <el-option v-for="dict in dict.type.mes_exception_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
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
import { createSubclassException, updateSubclassException, deleteSubclassException, getSubclassException, getSubclassExceptionPage, exportSubclassExceptionExcel } from "@/api/mes/subclassException";
import {genCode} from '@/api/mes/autocode/rule';

export default {
  name: "SubclassException",
  dicts: ['mes_exception_type'],
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
      // 子类异常项配置列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        exceptionType: null,
        subclassExceptionCode: null,
        subclassExceptionName: null,
        remark: null,
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
      getSubclassExceptionPage(this.queryParams).then(response => {
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
        exceptionType: undefined,
        subclassExceptionCode: undefined,
        subclassExceptionName: undefined,
        remark: undefined,
      };
      this.autoGenFlag = false;
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
      this.optType = 'add';
      this.title = "添加子类异常项配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getSubclassException(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改子类异常项配置";
        this.optType = 'edit';
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
          updateSubclassException(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createSubclassException(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除子类异常项配置编号为"' + id + '"的数据项?').then(function() {
          return deleteSubclassException(id);
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
      this.$modal.confirm('是否确认导出所有子类异常项配置数据项?').then(() => {
          this.exportLoading = true;
          return exportSubclassExceptionExcel(params);
        }).then(response => {
          this.$download.excel(response, '子类异常项配置.xls');
          this.exportLoading = false;
        }).catch(() => {});
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        this.loading = true;
        genCode('SUBCLASS_EXCEPTION_CODE').then(response => {
          this.form.subclassExceptionCode = response;
          this.loading = false;
        });
      } else {
        this.form.subclassExceptionCode = null;
      }
    },
  }
};
</script>
