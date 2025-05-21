<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="计划记录表头ID" prop="headerId">
        <el-input v-model="queryParams.headerId" placeholder="请输入计划记录表头ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="项目ID" prop="subjectId">
        <el-input v-model="queryParams.subjectId" placeholder="请输入项目ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="项目编码" prop="subjectCode">
        <el-input v-model="queryParams.subjectCode" placeholder="请输入项目编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="项目名称" prop="subjectName">
        <el-input v-model="queryParams.subjectName" placeholder="请输入项目名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="项目类型" prop="subjectType">
        <el-select v-model="queryParams.subjectType" placeholder="请选择项目类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="标准" prop="subjectStandard">
        <el-input v-model="queryParams.subjectStandard" placeholder="请输入标准" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="queryParams.remark" placeholder="请输入备注" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="预留字段1" prop="attr1">
        <el-input v-model="queryParams.attr1" placeholder="请输入预留字段1" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="预留字段2" prop="attr2">
        <el-input v-model="queryParams.attr2" placeholder="请输入预留字段2" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="预留字段3" prop="attr3">
        <el-input v-model="queryParams.attr3" placeholder="请输入预留字段3" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="预留字段4" prop="attr4">
        <el-input v-model="queryParams.attr4" placeholder="请输入预留字段4" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
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
                   v-hasPermi="['cmms:dv-check-plan-line-log:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['cmms:dv-check-plan-line-log:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="计划记录单身ID" align="center" prop="id" />
      <el-table-column label="计划记录表头ID" align="center" prop="headerId" />
      <el-table-column label="项目ID" align="center" prop="subjectId" />
      <el-table-column label="项目编码" align="center" prop="subjectCode" />
      <el-table-column label="项目名称" align="center" prop="subjectName" />
      <el-table-column label="项目类型" align="center" prop="subjectType" />
      <el-table-column label="项目内容" align="center" prop="subjectContent" />
      <el-table-column label="标准" align="center" prop="subjectStandard" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="预留字段1" align="center" prop="attr1" />
      <el-table-column label="预留字段2" align="center" prop="attr2" />
      <el-table-column label="预留字段3" align="center" prop="attr3" />
      <el-table-column label="预留字段4" align="center" prop="attr4" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['cmms:dv-check-plan-line-log:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['cmms:dv-check-plan-line-log:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="计划记录表头ID" prop="headerId">
          <el-input v-model="form.headerId" placeholder="请输入计划记录表头ID" />
        </el-form-item>
        <el-form-item label="项目ID" prop="subjectId">
          <el-input v-model="form.subjectId" placeholder="请输入项目ID" />
        </el-form-item>
        <el-form-item label="项目编码" prop="subjectCode">
          <el-input v-model="form.subjectCode" placeholder="请输入项目编码" />
        </el-form-item>
        <el-form-item label="项目名称" prop="subjectName">
          <el-input v-model="form.subjectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目类型" prop="subjectType">
          <el-select v-model="form.subjectType" placeholder="请选择项目类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目内容">
          <editor v-model="form.subjectContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="标准" prop="subjectStandard">
          <el-input v-model="form.subjectStandard" placeholder="请输入标准" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="预留字段1" prop="attr1">
          <el-input v-model="form.attr1" placeholder="请输入预留字段1" />
        </el-form-item>
        <el-form-item label="预留字段2" prop="attr2">
          <el-input v-model="form.attr2" placeholder="请输入预留字段2" />
        </el-form-item>
        <el-form-item label="预留字段3" prop="attr3">
          <el-input v-model="form.attr3" placeholder="请输入预留字段3" />
        </el-form-item>
        <el-form-item label="预留字段4" prop="attr4">
          <el-input v-model="form.attr4" placeholder="请输入预留字段4" />
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
import { createDvCheckPlanLineLog, updateDvCheckPlanLineLog, deleteDvCheckPlanLineLog, getDvCheckPlanLineLog, getDvCheckPlanLineLogPage, exportDvCheckPlanLineLogExcel } from "@/api/cmms/dvCheckPlanLineLog";
import Editor from '@/components/Editor/index.vue';

export default {
  name: "DvCheckPlanLineLog",
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
      // 点检计划记录单身列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        headerId: null,
        subjectId: null,
        subjectCode: null,
        subjectName: null,
        subjectType: null,
        subjectContent: null,
        subjectStandard: null,
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
        subjectId: [{ required: true, message: "项目ID不能为空", trigger: "blur" }],
        subjectCode: [{ required: true, message: "项目编码不能为空", trigger: "blur" }],
        subjectContent: [{ required: true, message: "项目内容不能为空", trigger: "blur" }],
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
      getDvCheckPlanLineLogPage(this.queryParams).then(response => {
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
        headerId: undefined,
        subjectId: undefined,
        subjectCode: undefined,
        subjectName: undefined,
        subjectType: undefined,
        subjectContent: undefined,
        subjectStandard: undefined,
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
      this.title = "添加点检计划记录单身";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getDvCheckPlanLineLog(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改点检计划记录单身";
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
          updateDvCheckPlanLineLog(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createDvCheckPlanLineLog(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除点检计划记录单身编号为"' + id + '"的数据项?').then(function() {
          return deleteDvCheckPlanLineLog(id);
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
      this.$modal.confirm('是否确认导出所有点检计划记录单身数据项?').then(() => {
          this.exportLoading = true;
          return exportDvCheckPlanLineLogExcel(params);
        }).then(response => {
          this.$download.excel(response, '点检计划记录单身.xls');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
