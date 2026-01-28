<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="审批单号" prop="auditCode">
        <el-input v-model="queryParams.auditCode" placeholder="请输入审批单号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="提交人" prop="submitUserName">
        <el-input v-model="queryParams.submitUserName" placeholder="请输入提交人姓名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="提交时间" prop="submitTime">
        <el-date-picker v-model="queryParams.submitTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']"/>
      </el-form-item>

      <el-form-item label="审批人" prop="auditUserName">
        <el-input v-model="queryParams.auditUserName" placeholder="请输入审批人姓名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="审批时间" prop="auditTime">
        <el-date-picker v-model="queryParams.auditTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']"/>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>

      <el-form-item label="生产工序" prop="processCode">
        <el-select @change="val => { handleProcessChange(val) }" v-model="queryParams.processCode" placeholder="请选择工序" clearable>
          <el-option v-for="item in processOptions" :key="item.processCode" :label="item.processName" :value="item.processCode"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['pro:feedback-audit:export']">导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="审批单号" width="150" align="center" prop="auditCode"/>
      <el-table-column label="提交人" align="center" prop="submitNickName"/>
      <el-table-column label="提交时间" align="center" prop="submitTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.submitTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工序" align="center" prop="processName"/>
      <el-table-column label="设备名称" align="center" prop="machineryName"/>
      <el-table-column label="报工总数" align="center" prop="quantity"/>
      <el-table-column label="合格总数" align="center" prop="quantityQuality"/>
      <el-table-column label="工艺损耗" align="center" prop="quantityExcess"/>
      <el-table-column label="审批人" align="center" prop="auditNickName"/>
      <el-table-column label="审批时间" align="center" prop="auditTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.auditTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status"/>
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="150" label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-if="scope.row.status === 'PREPARE'" v-hasPermi="['pro:feedback-audit:update']">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-if="scope.row.status === 'PREPARE'" v-hasPermi="['pro:feedback-audit:delete']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="80%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">

        <el-row>
          <el-col :span="8">
            <el-form-item label="审批单号" prop="auditCode">
              <el-input v-model="form.auditCode" placeholder="请输入审批单号" :disabled="readonly"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提交人" prop="submitNickName">
              <el-input v-model="form.submitNickName" placeholder="请输入提交人" :disabled="readonly"/>
            </el-form-item>
          </el-col>

          <el-col float-right :span="8">
            <el-form-item label="提交时间" prop="submitTime">
              <el-date-picker clearable v-model="form.submitTime" type="date" value-format="timestamp" placeholder="选择提交时间" :disabled="readonly"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态" disabled>
                <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 审批时间字段 - 状态非PREPARE时显示 -->
          <el-col :span="8" v-if="form.status !== 'PREPARE'">
            <el-form-item label="审批时间" prop="auditTime">
              <el-date-picker clearable v-model="form.auditTime" type="date" value-format="timestamp" placeholder="选择审批时间" :disabled="true"/>
            </el-form-item>
          </el-col>

          <!-- 审批人字段 - 状态非PREPARE时显示 -->
          <el-col :span="8" v-if="form.status !== 'PREPARE'">
            <el-form-item label="审批人" prop="auditNickName">
              <el-input v-model="form.auditUserName" placeholder="请输入审批人姓名" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">报工汇总信息</el-divider>
        <el-table
          v-loading="summaryLoading"
          :data="auditSummaryList"
          border
          highlight-current-row
          height="230"
          @row-click="handleSummaryRowClick"
          style="margin-bottom: 20px;">
          <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="workorderCode" label="工单号" width="170" :show-overflow-tooltip="true" align="center" />
          <el-table-column prop="taskCode" label="任务单号" width="120" align="center"></el-table-column>
          <el-table-column prop="processName" label="工序" width="60" align="center"></el-table-column>
          <el-table-column prop="nickName" label="报工人" width="70" align="center"></el-table-column>
          <el-table-column prop="sumQuantityFeedback" label="总生产数量" align="center"></el-table-column>
          <el-table-column prop="sumQuantityQualified" label="总合格数量" align="center"></el-table-column>
          <el-table-column prop="sumQuantityUnquanlified" label="总不良数量" align="center"></el-table-column>
          <el-table-column prop="sumQuantityExcess" label="总工艺损耗数量" align="center"></el-table-column>
          <el-table-column prop="principalDisplay" width="350" label="参与人员" align="center" :show-overflow-tooltip="true"></el-table-column>
        </el-table>

        <el-divider content-position="left">报工详情</el-divider>
        <el-table
          v-loading="detailLoading"
          :data="auditDetailList"
          border
          height="250"
          row-key="id"
          :tree-props="{ children: 'feedbackDefectList', hasChildren: 'hasChildren' }">
          <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.feedbackCode">{{ scope.row.tempIndex }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="feedbackCode" label="报工单号" width="160" :show-overflow-tooltip="true" />

<!--          <el-table-column label="报工单号/缺陷名称" width="190" :show-overflow-tooltip="true">
            <template  slot-scope="scope">
              <span v-if="scope.row.defectName" style="color: #F56C6C;">
                  {{ scope.row.defectName }}
              </span>
              <span v-else>
                  {{ scope.row.feedbackCode }}
              </span>
            </template>
          </el-table-column>-->


<!--          <el-table-column prop="workorderCode" label="工单号/缺陷编码" width="160" :show-overflow-tooltip="true"></el-table-column>-->
          <el-table-column label="工单号/缺陷名称" width="190" :show-overflow-tooltip="true">
            <template  slot-scope="scope">
              <span v-if="scope.row.defectName" >
                  {{ scope.row.defectName }}
              </span>
              <span v-else>
                  {{ scope.row.workorderCode }}
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="itemName" label="物料名称" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
          <el-table-column prop="processName" label="工序/缺陷工序" width="100" align="center"></el-table-column>
          <el-table-column prop="nickName" label="报工人" width="70" align="center"></el-table-column>
          <el-table-column prop="quantityFeedback" label="报工数量" align="center"></el-table-column>
<!--          <el-table-column label="报工数量/起始米数" width="150" align="center" :show-overflow-tooltip="true">
            <template  slot-scope="scope">
              <span v-if="scope.row.startMeter" >
                  {{ scope.row.startMeter }}
              </span>
              <span v-else>
                  {{ scope.row.quantityFeedback }}
              </span>
            </template>
          </el-table-column>-->


          <el-table-column prop="quantityQualified" label="合格数量" align="center"></el-table-column>
<!--          <el-table-column label="合格数量/结束米数" width="150" :show-overflow-tooltip="true">
            <template  slot-scope="scope">
              <span v-if="scope.row.endMeter">
                  {{ scope.row.endMeter }}
              </span>
              <span v-else>
                  {{ scope.row.quantityQualified }}
              </span>
            </template>
          </el-table-column>-->

          <el-table-column label="不良数量" width="80" align="center" :show-overflow-tooltip="true">
            <template  slot-scope="scope">
              <span v-if="scope.row.defectMeter">
                  {{ scope.row.defectMeter }}
              </span>
              <span v-else>
                  {{ scope.row.quantityUnquanlified }}
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="quantityExcess" label="工艺损耗" width="100" align="center"></el-table-column>

          <el-table-column prop="feedbackTime" label="报工时间" width="180" align="center">
            <template slot-scope="scope">
              {{ parseTime(scope.row.feedbackTime) }}
            </template>
          </el-table-column>
<!--          <el-table-column prop="teamCode" label="班组" width="80" align="center"></el-table-column>-->
          <el-table-column label="班组/来源班组" width="120" align="center" :show-overflow-tooltip="true">
            <template  slot-scope="scope">
              <span v-if="scope.row.defectMeter">
                  {{ scope.row.originTeamCode }}
              </span>
              <span v-else>
                  {{ scope.row.teamCode }}
              </span>
            </template>
          </el-table-column>


          <!--          <el-table-column prop="batchCode" label="批次号" width="150" align="center"></el-table-column>-->
          <el-table-column label="批次号/来源批次" width="150" align="center" :show-overflow-tooltip="true">
            <template  slot-scope="scope">
              <span v-if="scope.row.defectMeter">
                  {{ scope.row.originBatchCode }}
              </span>
              <span v-else>
                  {{ scope.row.batchCode }}
              </span>
            </template>
          </el-table-column>




        </el-table>

        <pagination
          v-show="detailTotal > 0" :total="detailTotal" :page.sync="detailQueryParams.pageNo" :limit.sync="detailQueryParams.pageSize" @pagination="loadAuditDetails" small/>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleExecute" v-if="form.status === 'PREPARE' && !readonly" v-hasPermi="['pro:feedback-audit:update']">审批通过
        </el-button>

        <el-button type="warning" @click="handleTransfer" v-if="form.status === 'PREPARE'" v-hasPermi="['pro:feedback-audit:update']">转审
        </el-button>

        <el-button @click="cancel">取 消</el-button>

        <el-button type="danger" @click="handleReject" v-if="form.status === 'PREPARE' && !readonly" v-hasPermi="['pro:feedback-audit:update']">审批不通过
        </el-button>

      </div>
    </el-dialog>

    <el-dialog title="审批转审" :visible.sync="transferOpen" width="90%" append-to-body>
      <el-form :model="transferForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="目标审批人" prop="targetAuditUserId">
              <el-input v-model="transferForm.targetAuditUserId" placeholder="请选择" disabled>
                <el-button slot="append" icon="el-icon-search" @click="handleUserSelect"></el-button>
              </el-input>
            </el-form-item>
            <UserSingleSelect ref="userSelect" @onSelected="onUserSelected"></UserSingleSelect>
          </el-col>

          <el-col :span="12">
            <el-form-item label="转审备注" prop="remark">
              <el-input v-model="transferForm.remark" placeholder="请输入转审原因"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-divider content-position="left">选择要转审的报工明细（可多选）</el-divider>

      <el-table
        :data="transferDetailList"
        @selection-change="handleTransferSelectionChange"
        border
        height="400"
        style="margin-bottom: 20px;">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="feedbackCode" label="报工单号" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="workorderCode" label="工单号" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="itemName" label="物料名称" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="processName" label="工序" width="80" align="center"></el-table-column>
        <el-table-column prop="nickName" label="报工人" width="80" align="center"></el-table-column>
        <el-table-column prop="quantityFeedback" label="报工数量" width="100" align="center"></el-table-column>
        <el-table-column prop="quantityQualified" label="合格数量" width="100" align="center"></el-table-column>
        <el-table-column prop="quantityUnquanlified" label="不良数量" width="100" align="center"></el-table-column>
        <el-table-column prop="feedbackTime" label="报工时间" width="160" align="center">
          <template slot-scope="scope">
            {{ parseTime(scope.row.feedbackTime) }}
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="transferOpen = false">取 消</el-button>
        <el-button type="primary" @click="submitTransferSelection">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {createFeedbackAudit, updateFeedbackAudit, deleteFeedbackAudit, getFeedbackAudit, getFeedbackAuditPage, exportFeedbackAuditExcel, auditFeedback, executes , transferFeedbackAuditDetails } from "@/api/mes/pro/feedbackAudit";

import {getAuditSummary} from "@/api/mes/pro/feedbackAuditItem";
import {getAuditDetails} from "@/api/mes/pro/feedbackAuditDetail";
import {listProcess} from "@/api/mes/pro/process";

import UserSingleSelect from '@/components/userSelect/single.vue';

export default {
  name: "FeedbackAudit",
  dicts: ['mes_order_status'],
  components: { UserSingleSelect },
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
      // 报工审批主表列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        auditCode: null,
        submitUserId: null,
        submitUserName: null,
        submitTime: [],
        auditUserId: null,
        auditUserName: null,
        auditTime: [],
        status: null,
        remark: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        auditCode: [{required: true, message: "审批单号不能为空", trigger: "blur"}],
        submitUserId: [{required: true, message: "提交人ID不能为空", trigger: "blur"}],
        submitUserName: [{required: true, message: "提交人姓名不能为空", trigger: "blur"}],
        submitTime: [{required: true, message: "提交时间不能为空", trigger: "blur"}],
        status: [{required: true, message: "状态不能为空", trigger: "blur"}],
      },
      // 汇总数据列表
      auditSummaryList: [],
      // 详情数据列表
      auditDetailList: [],
      // 汇总数据加载状态
      summaryLoading: false,
      // 详情数据加载状态
      detailLoading: false,
      detailQueryParams: {
        pageNo: 1,
        pageSize: 10,
        auditId: null,
        auditItemId: null
      },
      detailTotal: 0,
      // 只读模式
      readonly: false,
      processOptions: [], // 工序选项
      // 转审拓展
      transferOpen: false, // 控制转审对话框显示
      transferForm: {
        id: undefined, // 原审批单ID
        targetAuditUserId: undefined, // 目标审批人ID
        targetAuditUserName: '', // 目标审批人姓名
        remark: '' // 转审备注
      },
      transferDetailList: [], // 用于转审的明细列表
      selectedTransferDetails: [], // 选中的转审明细
      userList: [], // 用户列表
      userListLoading: false,

    };
  },
  created() {
    this.getList();
    this.getProcess();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getFeedbackAuditPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.auditSummaryList = [];
      this.auditDetailList = [];

      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        auditCode: undefined,
        submitUserId: undefined,
        submitUserName: undefined,
        submitTime: undefined,
        auditUserId: undefined,
        auditUserName: undefined,
        auditTime: undefined,
        status: undefined,
        remark: undefined,
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
      this.title = "添加报工审批主表";
      this.readonly = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getFeedbackAudit(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改报工审批主表";
        this.readonly = false;
        // 设置审批时间为当前时间
        if (this.form.status === 'PREPARE') {
          this.form.auditTime = new Date().getTime();
          // 设置审批人为当前用户（需要根据实际用户信息调整）
          this.form.auditUserName = "当前用户"; // 这里替换为实际获取当前用户的代码
        }
        this.loadAuditSummary(id);
      });
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const id = row.id;
      getFeedbackAudit(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看报工审批主表";
        this.readonly = true;
        this.loadAuditSummary(id);
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
          updateFeedbackAudit(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createFeedbackAudit(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除报工审批主表编号为"' + id + '"的数据项?').then(function () {
        return deleteFeedbackAudit(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有报工审批主表数据项?').then(() => {
        this.exportLoading = true;
        return exportFeedbackAuditExcel(params);
      }).then(response => {
        this.$download.excel(response, '报工审批主表.xls');
        this.exportLoading = false;
      }).catch(() => {
      });
    },

    // 加载汇总数据
    loadAuditSummary(auditId) {
      this.summaryLoading = true;
      getAuditSummary(auditId).then(response => {
        // this.auditSummaryList = response.data;
        this.auditSummaryList = response.data.map(item => {
          // 添加格式化后的负责人显示字段
          return {
            ...item,
            principalDisplay: this.formatPrincipal(item.allPrincipal)
          };
        });
        this.summaryLoading = false;
        // 默认选中第一行并加载详情
        if (this.auditSummaryList.length > 0) {
          this.$nextTick(() => {
            this.handleSummaryRowClick(this.auditSummaryList[0]);
          });
        }
      }).catch(() => {
        this.summaryLoading = false;
      });
    },
    // 汇总行点击事件
    loadAuditDetails() {
      this.detailLoading = true;
      let feedbackCount = 0;
      getAuditDetails(this.detailQueryParams).then(response => {
        this.auditDetailList = response.data.list.map(item => {
          // 为缺陷记录添加前缀，确保ID唯一
          if (item.feedbackDefectList && item.feedbackDefectList.length) {
            item.feedbackDefectList = item.feedbackDefectList.map(defect => {
              return {
                ...defect,
                id: 'defect-' + defect.id // 添加前缀确保ID唯一
              };
            });
          }
          // 只为报工行添加序号
          if (item.feedbackCode) {
            feedbackCount++;
            return {
              ...item,
              tempIndex: feedbackCount
            };
          }
          return item;
        });
        this.detailTotal = response.data.total;
        this.detailLoading = false;
      }).catch(() => {
        this.detailLoading = false;
      });
    },
    handleSummaryRowClick(row) {
      this.detailLoading = true;
      this.detailQueryParams = {
        pageNo: 1,
        pageSize: 10,
        auditId: row.auditId,
        auditItemId: row.id,
      };
      this.loadAuditDetails();
    },
    formatPrincipal(principalStr) {
      if (!principalStr) return '';
      // 1. 按逗号分割成数组
      const principals = principalStr.split(',');
      // 2. 处理每个部分
      return principals.map(item => {
        const trimmed = item.trim();
        // 3. 使用正则表达式提取组号和姓名
        const match = trimmed.match(/^(\[[^\]]+\])\([^\)]+\)([\s\S]*)$/);
        // 4. 如果匹配成功，返回格式化的字符串
        if (match && match.length >= 3) {
          return `${match[1]}${match[2]}`;
        }
        // 5. 如果格式不匹配，返回原始内容
        return trimmed;
      }).join(', '); // 重新组合成字符串
    },

    //执行
    handleExecute() {
      const recordIds = this.form.id;

      this.$modal
        .confirm('确认执行审批？')
        .then(() => {
          return executes({id: recordIds, status: 'APPROVED'}); //审核通过APPROVED 不通过UNAPPROVED
        })
        .then(() => {
          this.getList();
          //this.removeScrollListener();
          this.$modal.msgSuccess('执行成功');
          this.open = false;
        })
        .catch(() => {
        });
    },

    handleReject() {
      const recordIds = this.form.id;

      this.$modal
        .confirm('确认拒审报工？')
        .then(function () {
          return executes({id: recordIds, status: 'UNAPPROVED'}); //审核通过APPROVED 不通过UNAPPROVED
        })
        .then(() => {
          this.getList();
          //this.removeScrollListener();
          this.$modal.msgSuccess('拒审成功');
          this.open = false;
        })
        .catch(() => {
        });
    },
    getProcess() {
      // 初始化工序选项
      this.processOptions = [];
      listProcess().then(response => {
        this.processOptions = response.data.list;
      });
    },
    handleTransfer() {
      // 初始化转审表单
      this.transferForm = {
        id: this.form.id,
        targetAuditUserId: undefined,
        targetAuditUserName: '',
        remark: ''
      };
      // 加载可转审的明细数据
      this.loadTransferDetails();
      this.transferOpen = true;
    },

    /** 加载可转审的明细数据 */
    loadTransferDetails() {
      // 这里可以根据需要过滤，比如只显示未审批的明细
      this.transferDetailList = JSON.parse(JSON.stringify(this.auditDetailList.filter(item => item.feedbackCode)));
    },
    handleUserSelect() {
      this.$refs.userSelect.showFlag = true;
    },
    //人员选择返回
    onUserSelected(obj) {
      if (obj != undefined && obj != null) {
        this.transferForm.targetAuditUserId = obj.id;
      }
    },
    /** 处理明细选择变化 */
    handleTransferSelectionChange(selection) {
      this.selectedTransferDetails = selection;
    },

    /** 提交转审选择 */
    submitTransferSelection() {
      if (this.selectedTransferDetails.length === 0) {
        this.$modal.msgWarning("请至少选择一条明细进行转审");
        return;
      }

      if (!this.transferForm.targetAuditUserId) {
        this.$modal.msgWarning("请选择目标审批人");
        return;
      }

      this.$modal.confirm(`确认将选中的 ${this.selectedTransferDetails.length} 条明细转审给 ${this.transferForm.targetAuditUserName}?`).then(() => {
        this.doTransfer();
      }).catch(() => {}).finally(()=>{
        this.getList();
      });
    },

    /** 执行转审操作 */
    async doTransfer() {
      try {
        // 准备转审数据
        const transferData = {
          sourceAuditId: this.transferForm.id,
          targetAuditUserId: this.transferForm.targetAuditUserId,
          remark: this.transferForm.remark,
          detailIds: this.selectedTransferDetails.map(item => item.id)
        };

        // 调用转审API
        await transferFeedbackAuditDetails(transferData);

        this.$modal.msgSuccess("转审成功");
        this.transferOpen = false;

        // 刷新当前页面数据
        this.loadAuditSummary(this.form.id);
        this.loadAuditDetails();

      } catch (error) {
        console.error("转审操作失败", error);
        this.$modal.msgError("转审操作失败");
      }
    },


  }
};
</script>

<style scoped>
.el-divider {
  margin: 20px 0;
}
</style>
