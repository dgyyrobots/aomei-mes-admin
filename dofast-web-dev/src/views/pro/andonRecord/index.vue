<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工作站ID" prop="workstationId">
        <el-input v-model="queryParams.workstationId" placeholder="请输入工作站ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工作站编号" prop="workstationCode">
        <el-input v-model="queryParams.workstationCode" placeholder="请输入工作站编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工作站名称" prop="workstationName">
        <el-input v-model="queryParams.workstationName" placeholder="请输入工作站名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入用户名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="名称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产工单ID" prop="workorderId">
        <el-input v-model="queryParams.workorderId" placeholder="请输入生产工单ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产工单编号" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入生产工单编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产工单名称" prop="workorderName">
        <el-input v-model="queryParams.workorderName" placeholder="请输入生产工单名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工序ID" prop="processId">
        <el-input v-model="queryParams.processId" placeholder="请输入工序ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工序编号" prop="processCode">
        <el-input v-model="queryParams.processCode" placeholder="请输入工序编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工序名称" prop="processName">
        <el-input v-model="queryParams.processName" placeholder="请输入工序名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="呼叫原因" prop="andonReason">
        <el-input v-model="queryParams.andonReason" placeholder="请输入呼叫原因" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="级别" prop="andonLevel">
        <el-input v-model="queryParams.andonLevel" placeholder="请输入级别" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="操作时间" prop="operationTime">
        <el-date-picker v-model="queryParams.operationTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="激活中" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择激活中" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
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
      <el-form-item label="创建者" prop="createBy">
        <el-input v-model="queryParams.createBy" placeholder="请输入创建者" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="更新者" prop="updateBy">
        <el-input v-model="queryParams.updateBy" placeholder="请输入更新者" clearable @keyup.enter.native="handleQuery"/>
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
                   v-hasPermi="['pro:andon-record:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['pro:andon-record:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="记录ID" align="center" prop="recordId" />
      <el-table-column label="工作站ID" align="center" prop="workstationId" />
      <el-table-column label="工作站编号" align="center" prop="workstationCode" />
      <el-table-column label="工作站名称" align="center" prop="workstationName" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="用户名" align="center" prop="userName" />
      <el-table-column label="名称" align="center" prop="nickName" />
      <el-table-column label="生产工单ID" align="center" prop="workorderId" />
      <el-table-column label="生产工单编号" align="center" prop="workorderCode" />
      <el-table-column label="生产工单名称" align="center" prop="workorderName" />
      <el-table-column label="工序ID" align="center" prop="processId" />
      <el-table-column label="工序编号" align="center" prop="processCode" />
      <el-table-column label="工序名称" align="center" prop="processName" />
      <el-table-column label="呼叫原因" align="center" prop="andonReason" />
      <el-table-column label="级别" align="center" prop="andonLevel" />
      <el-table-column label="操作时间" align="center" prop="operationTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.operationTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="激活中" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="预留字段1" align="center" prop="attr1" />
      <el-table-column label="预留字段2" align="center" prop="attr2" />
      <el-table-column label="预留字段3" align="center" prop="attr3" />
      <el-table-column label="预留字段4" align="center" prop="attr4" />
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新者" align="center" prop="updateBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['pro:andon-record:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['pro:andon-record:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工作站ID" prop="workstationId">
          <el-input v-model="form.workstationId" placeholder="请输入工作站ID" />
        </el-form-item>
        <el-form-item label="工作站编号" prop="workstationCode">
          <el-input v-model="form.workstationCode" placeholder="请输入工作站编号" />
        </el-form-item>
        <el-form-item label="工作站名称" prop="workstationName">
          <el-input v-model="form.workstationName" placeholder="请输入工作站名称" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="名称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="生产工单ID" prop="workorderId">
          <el-input v-model="form.workorderId" placeholder="请输入生产工单ID" />
        </el-form-item>
        <el-form-item label="生产工单编号" prop="workorderCode">
          <el-input v-model="form.workorderCode" placeholder="请输入生产工单编号" />
        </el-form-item>
        <el-form-item label="生产工单名称" prop="workorderName">
          <el-input v-model="form.workorderName" placeholder="请输入生产工单名称" />
        </el-form-item>
        <el-form-item label="工序ID" prop="processId">
          <el-input v-model="form.processId" placeholder="请输入工序ID" />
        </el-form-item>
        <el-form-item label="工序编号" prop="processCode">
          <el-input v-model="form.processCode" placeholder="请输入工序编号" />
        </el-form-item>
        <el-form-item label="工序名称" prop="processName">
          <el-input v-model="form.processName" placeholder="请输入工序名称" />
        </el-form-item>
        <el-form-item label="呼叫原因" prop="andonReason">
          <el-input v-model="form.andonReason" placeholder="请输入呼叫原因" />
        </el-form-item>
        <el-form-item label="级别" prop="andonLevel">
          <el-input v-model="form.andonLevel" placeholder="请输入级别" />
        </el-form-item>
        <el-form-item label="操作时间" prop="operationTime">
          <el-date-picker clearable v-model="form.operationTime" type="date" value-format="timestamp" placeholder="选择操作时间" />
        </el-form-item>
        <el-form-item label="激活中" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
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
        <el-form-item label="创建者" prop="createBy">
          <el-input v-model="form.createBy" placeholder="请输入创建者" />
        </el-form-item>
        <el-form-item label="更新者" prop="updateBy">
          <el-input v-model="form.updateBy" placeholder="请输入更新者" />
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
import { createAndonRecord, updateAndonRecord, deleteAndonRecord, getAndonRecord, getAndonRecordPage, exportAndonRecordExcel } from "@/api/pro/andonRecord";

export default {
  name: "AndonRecord",
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
      // 安灯呼叫记录列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        userId: null,
        userName: null,
        nickName: null,
        workorderId: null,
        workorderCode: null,
        workorderName: null,
        processId: null,
        processCode: null,
        processName: null,
        andonReason: null,
        andonLevel: null,
        operationTime: [],
        status: null,
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: [],
        updateBy: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        workstationId: [{ required: true, message: "工作站ID不能为空", trigger: "blur" }],
        userId: [{ required: true, message: "用户ID不能为空", trigger: "blur" }],
        andonReason: [{ required: true, message: "呼叫原因不能为空", trigger: "blur" }],
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
      getAndonRecordPage(this.queryParams).then(response => {
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
        recordId: undefined,
        workstationId: undefined,
        workstationCode: undefined,
        workstationName: undefined,
        userId: undefined,
        userName: undefined,
        nickName: undefined,
        workorderId: undefined,
        workorderCode: undefined,
        workorderName: undefined,
        processId: undefined,
        processCode: undefined,
        processName: undefined,
        andonReason: undefined,
        andonLevel: undefined,
        operationTime: undefined,
        status: undefined,
        remark: undefined,
        attr1: undefined,
        attr2: undefined,
        attr3: undefined,
        attr4: undefined,
        createBy: undefined,
        updateBy: undefined,
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
      this.title = "添加安灯呼叫记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recordId = row.recordId;
      getAndonRecord(recordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改安灯呼叫记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.recordId != null) {
          updateAndonRecord(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createAndonRecord(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const recordId = row.recordId;
      this.$modal.confirm('是否确认删除安灯呼叫记录编号为"' + recordId + '"的数据项?').then(function() {
          return deleteAndonRecord(recordId);
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
      this.$modal.confirm('是否确认导出所有安灯呼叫记录数据项?').then(() => {
          this.exportLoading = true;
          return exportAndonRecordExcel(params);
        }).then(response => {
          this.$download.excel(response, '安灯呼叫记录.xls');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
