<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="任务编号" prop="taskCode">
        <el-input v-model="queryParams.taskCode" placeholder="请输入任编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="queryParams.taskName" placeholder="请输入任务名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工单名称" prop="workorderName">
        <el-input v-model="queryParams.workorderName" placeholder="请输入工单名称" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="规格型号" prop="specification">
        <el-input v-model="queryParams.specification" placeholder="请输入规格型号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="客户名称" prop="clientName">
        <el-input v-model="queryParams.clientName" placeholder="请输入客户名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="queryParams.startTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"/>
      </el-form-item>
      <el-form-item label="生产时长" prop="duration">
        <el-input v-model="queryParams.duration" placeholder="请输入生产时长" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="dict in  dict.type.mes_pro_task_status" :key="dict.value" :label="dict.label"
                     :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="打印状态" prop="isPrint">
        <el-select v-model="queryParams.isPrint" placeholder="请选择状态" clearable>
          <el-option label="已打印" :value="1"></el-option>
          <el-option label="未打印" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="完成时间" prop="endTime">
        <el-date-picker v-model="queryParams.endTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"/>
      </el-form-item>

      <el-form-item label="需求日期" prop="requestDate">
        <el-date-picker v-model="queryParams.requestDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"/>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="queryParams.remark" placeholder="请输入备注" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
      <!-- <div class="el-form">
        <el-form-item label="订单状态" prop="activeTab" style="width: 100%">
          <div style="width: calc(100vw - 393px)">
            <template v-for="(tab, i) in statusTabs">
              <el-tag class="mb-4" v-if="tab.value != activeTab" effect="text" type="info" size="mini" :key="i"
                @click="tabClick(tab)">{{ tab.label }} </el-tag>
              <el-tag class="mb-4" v-if="tab.value == activeTab" effect="dark" size="mini" :key="i">
                {{ tab.label }}
              </el-tag>
            </template>
</div>
</el-form-item>
</div> -->
    </el-form>
    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-row :gutter="10">
      <el-col :span="4" v-for="item in list" :key="item.id" class="mb-5 cursor-pointer" @click.native="jumpDashboard(item)">
        <el-descriptions :column="1" :title="item.taskCode" class="pointer-events-none p-5" :style="getStatusColor(item.status)">
          <el-descriptions-item label="任务名称">
            <div>
              <div class="text-ellipsis overflow-hidden" style="height: 22px;">{{ item.workorderName }} </div>
              <div class="text-ellipsis overflow-hidden" style="height: 44px;">{{ item.taskName }}</div>
            </div>
          </el-descriptions-item>
          <template v-if="item.status === 'NORMAL'">
            <el-descriptions-item label="计划开工时间">{{ parseTime(item.startTime) }}</el-descriptions-item>
            <el-descriptions-item label="计划完工时间">{{ parseTime(item.endTime) }}</el-descriptions-item>
          </template>
          <template v-else>
            <el-descriptions-item label="开工时间">{{ parseTime(item.startTime) }}</el-descriptions-item>
            <el-descriptions-item label="完工时间">{{ parseTime(item.endTime) }}</el-descriptions-item>
          </template>
          <el-descriptions-item label="排产数量">{{ item.quantity }}</el-descriptions-item>
          <el-descriptions-item label="工序">{{ item.processName }}</el-descriptions-item>
          <el-descriptions-item label="任务状态">
            <el-popover placement="top-start" title="生产时间" width="220" trigger="hover">
              <div>计划时间:{{ parseTime(item.startTime) }}</div>
              <div>开始时间:{{ parseTime(item.actualStartTime) }}</div>
              <div>完工时间:{{ parseTime(item.actualEndTime) }}</div>
              <dict-tag style="cursor: pointer;" slot="reference" :type="DICT_TYPE.MES_PRO_TASK_STATUS" :value="item.status" />
            </el-popover>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
    <!--    <el-dialog v-if="open" :visible.sync="open" width="750px">
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item prop="quantity" label="报工总数量">
              <el-input-number v-model="form.quantity" />
            </el-form-item>
            <el-form-item prop="nickName" label="报工人">
              <el-input v-model="form.nickName" placeholder="请输入报工人姓名" />
            </el-form-item>
            <el-form-item prop="reportFee" label="报工价格">
              <el-input v-model="form.reportFee" placeholder="请输入报工价格" />
            </el-form-item>
            <el-form-item prop="quantityQualify" label="合格品数量">
              <el-input-number v-model="form.quantityQualify" />
            </el-form-item>
            <el-form-item prop="quantityUnqualify" label="不良品数量">
              <el-input-number v-model="form.quantityUnqualify" />
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button type="primary" @click="submitForm">提交 </el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>-->
    <!-- 报工弹出框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="报工类型" prop="feedbackType">
              <el-select v-model="form.feedbackType" placeholder="请选择报工类型">
                <el-option v-for="dict in dict.type.mes_feedback_type" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input disabled v-model="form.workorderCode" placeholder="请选择生产工单"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产任务" prop="taskCode">
              <el-input disabled v-model="form.taskCode" placeholder="请选择生产任务"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品编码" prop="itemCode">
              <el-input disabled v-model="form.itemCode" readonly="readonly"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称" prop="itemName">
              <el-input disabled v-model="form.itemName" readonly="readonly"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input disabled v-model="form.unitOfMeasure" readonly="readonly"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="规格型号" prop="specification">
              <el-input disabled v-model="form.specification" type="textarea" readonly="readonly"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="报工数量" prop="quantityFeedback">
              <el-input readonly="readonly" v-model="form.quantityFeedback"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合格品数量" prop="quantityQualified">
              <el-input-number :min="0" @change="handleQuantityChanged" v-model="form.quantityQualified"
                               placeholder="请输入合格品数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不良品数量" prop="quantityUnquanlified">
              <el-input-number :min="0" @change="handleQuantityChanged" v-model="form.quantityUnquanlified"
                               placeholder="请输入不良品数量"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="报工班组" prop="teamCode">
              <el-input disabled v-model="form.teamCode" placeholder="请输入报工班组"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报工时间" prop="feedbackTime">
              <el-date-picker disabled clearable v-model="form.feedbackTime" type="date" value-format="timestamp"
                              placeholder="请选择报工时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider>班组成员信息</el-divider>
        <el-row>
          <el-col :span="24">
            <div style="text-align: right; margin-top: 20px;">
              <el-button type="primary" @click="addTeamMember()">新增</el-button>
            </div>
          </el-col>
        </el-row>
        <el-card class="box-card">
          <el-table :data="teamMembers" style="width: 100%">
            <el-table-column prop="id" label="成员ID" width="180"/>
            <el-table-column prop="nickname" label="成员昵称" width="180"/>
            <el-table-column prop="username" label="成员名称" width="180"/>
            <el-table-column prop="position" label="职位"/>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteTeamMember(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <UserSingleSelect ref="userSelect" @onSelected="onUserSelected"></UserSingleSelect>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改生产工单对话框 -->
    <el-dialog :title="title2" :visible.sync="open2" width="960px" append-to-body>
      <el-form ref="form2" :model="form2" :rules="rules2" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="工单编号" prop="workorderCode">
              <el-input v-model="form2.workorderCode" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务名称" prop="taskName">
              <el-input v-model="form2.taskName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格型号" prop="specification">
              <el-input v-model="form2.specification" placeholder="请输入规格" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="任务编号" prop="taskCode">
              <el-input v-model="form2.taskCode" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="工序编号" prop="processCode">
              <el-input v-model="form2.processCode" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求日期" prop="requestDate">
              <el-date-picker clearable v-model="form2.requestDate" type="date" value-format="timestamp"
                              placeholder="请选择需求日期" disabled></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="form2.status == 'NORMAL' ? '计划开工时间' : '开工时间'" prop="startTime" label-width="110"
                          style="transform:translateX('20px');">
              <el-date-picker clearable v-model="form2.startTime" type="date" value-format="timestamp"
                              disabled></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="form2.status != 'FINISHED' ? '计划完工时间' : '完工时间'" prop="endTime" label-width="110"
                          style=" transform:translateX('20px');">
              <el-date-picker clearable v-model="form2.endTime" type="date" value-format="timestamp"
                              placeholder="请选择需求日期" disabled></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="计划报工" prop="quantity">
              <el-input v-model="form2.quantity" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报工" prop="quantityProduced">
              <el-input v-model="form2.quantityProduced" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合格" prop="quantityQuanlify">
              <el-input v-model="form2.quantityQuanlify" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="不合格" prop="quantityUnquanlify">
              <el-input v-model="form2.quantityUnquanlify" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form2.remark" type="textarea"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!-- <el-form-item label="附件" prop="adjuncts">
              <file-upload v-model="form2.adjuncts" :isShowTip="false" :isShowTips="false"></file-upload>
            </el-form-item> -->
            <el-form-item label="附件" prop="adjuncts">
              <file-upload v-model="form2.adjuncts" :isShowTips="false" :isShowTip="false"></file-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <el-tabs type="border-card" v-if="form2.id != null">
        <el-tab-pane label="BOM组成">
          <Workorderbom ref="bomlist" :optType="optType" :workorder="form2" @handleAddSub="handleSubAdd"></Workorderbom>
        </el-tab-pane>
        <el-tab-pane label="物料需求" v-if="form2.parentId == 0">
          <WorkorderItemList :workorder="form2"></WorkorderItemList>
        </el-tab-pane>
      </el-tabs> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm2">确 定
        </el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {createPrintLog} from "@/api/report/printLog";
import {listWorkorder, getWorkorder, delWorkorder, addWorkorder, updateWorkorder} from '@/api/mes/pro/workorder';
import {getTaskPage, create, create2, getProtask, updateTasks} from '@/api/mes/pro/protask';
import {updateProtask, updateTasksPrint} from '@/api/mes/pro/protask';
import {addFeedback, addFeedback as updateTask, updateFeedback} from '@/api/mes/pro/feedback';
import {getAccessToken} from '@/utils/auth';
import {getConfigKey} from '@/api/system/config';
import {genCode} from '@/api/mes/autocode/rule';
import FileUpload from '@/components/FileUpload/index3.vue';
import Workorderbom from '../workorder/bom/bom.vue';
import WorkorderItemList from '../workorder/items/item.vue';
import WorkorderSelect from '@/components/workorderSelect/single.vue';
import ProtaskSelect from '@/components/TaskSelect/taskSelectSingle.vue';
import UserSingleSelect from '@/components/userSelect/single.vue';
import {getTeammemberByTeamCode} from "@/api/mes/cal/teammember";

export default {
  name: 'Task',
  dicts: ['mes_order_status', 'mes_workorder_sourcetype', 'mes_pro_task_status', 'mes_feedback_type'],
  components: {
    FileUpload,
    Workorderbom,
    WorkorderItemList,
    WorkorderSelect,
    ProtaskSelect,
    UserSingleSelect,
  },
  data() {
    return {
      fag: null,
      date: '',
      activeTab: 'all',
      statusTabs: [
        {
          label: '未完工',
          value: 0,
        },
        {
          label: '已完工',
          value: 1,
        },
        {
          label: '全部',
          value: 'all',
        }
      ],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 生产任务列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        isOver: null,
        isPrint: null,
        pageNo: 1,
        pageSize: 10,
        taskCode: null,
        taskName: null,
        workorderId: null,
        workorderCode: null,
        workorderName: null,
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        processId: null,
        processCode: null,
        processName: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        quantity: null,
        quantityProduced: null,
        quantityQuanlify: null,
        quantityUnquanlify: null,
        quantityChanged: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        clientNick: null,
        startTime: [],
        duration: null,
        endTime: [],
        colorCode: null,
        requestDate: [],
        status: null,
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createTime: []
      },
      // 表单参数
      form: {
        quantityFeedback: 0,
        quantityQualified: 0,
        quantityUnquanlified: 0,
      },
      // 表单校验
      rules: {
        taskCode: [{required: true, message: '任务编号不能为空', trigger: 'blur'}],
        taskName: [{required: true, message: '任务名称不能为空', trigger: 'blur'}],
        workorderId: [{required: true, message: '生产工单ID不能为空', trigger: 'blur'}],
        workorderCode: [{required: true, message: '生产工单编号不能为空', trigger: 'blur'}],
        workorderName: [{required: true, message: '工单名称不能为空', trigger: 'blur'}],
        workstationId: [{required: true, message: '工作站ID不能为空', trigger: 'blur'}],
        workstationCode: [{required: true, message: '工作站编号不能为空', trigger: 'blur'}],
        workstationName: [{required: true, message: '工作站名称不能为空', trigger: 'blur'}],
        processId: [{required: true, message: '工序ID不能为空', trigger: 'blur'}],
        itemId: [{required: true, message: '产品物料ID不能为空', trigger: 'blur'}],
        itemCode: [{required: true, message: '产品物料编码不能为空', trigger: 'blur'}],
        itemName: [{required: true, message: '产品物料名称不能为空', trigger: 'blur'}],
        unitOfMeasure: [{required: true, message: '单位不能为空', trigger: 'blur'}],
        quantity: [{required: true, message: '排产数量不能为空', trigger: 'blur'}],
      },
      row: '',
      autoGenFlag: '',
      // 生产工单树选项
      workorderOptions: [],
      // 表单参数
      form2: {
        remark: ''
      },
      open2: false,
      title2: '',
      optType: undefined,
      rules2: {
        // workorderCode: [{ required: true, message: '工单编码不能为空', trigger: 'blur' }],
        // workorderName: [{ required: true, message: '工单名称不能为空', trigger: 'blur' }],
        // orderSource: [{ required: true, message: '来源类型不能为空', trigger: 'blur' }],
        // productId: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
        // productSpc: [{ required: true, message: '规格型号不能为空', trigger: 'blur' }],
        // productCode: [{ required: true, message: '产品编号不能为空', trigger: 'blur' }],
        // productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
        // quantity: [{ required: true, message: '生产数量不能为空', trigger: 'blur' }],
        // requestDate: [{ required: true, message: '需求日期不能为空', trigger: 'blur' }],
      },
      adjunctTypes: null,
      teamMembers: [],
    };
  },
  created() {
    this.date = +new Date();
    this.getList();
    getConfigKey('YL1').then(res => {
      if (res.data && res.data.value) {
        this.fag = true;
      }
    })
  },
  methods: {
    getStatusColor(status) {
      return {
        PAUSE: 'background-color: #f39c12;color: #FFF;;border-radius: 12px;',
        STARTED: 'background-color: #2ed573;color: #FFF;;border-radius: 12px;',
        NORMAL: 'background-color: #FF7F50;color: #FFF;border-radius: 12px;',
        FINISHED: 'background-color: #bdc3c7;color: #000;;border-radius: 12px;'
      }[status] || 'opacity:0.5'
    },
    tabClick(tab) {
      this.activeTab = tab.value;
      this.queryParams.isOver = tab.value === 'all' ? undefined : tab.value;
      this.getList();
    },
    handleFinish() {
      let that = this;
      this.$modal.confirm('是否完成工单编制？【完成后将不能更改】').then(function () {
        that.form2.status = 'CONFIRMED';
        that.submitForm2();
      });
    },
    submitForm2() {
      this.$refs['form2'].validate(valid => {
        if (valid) {
          if (this.form2.id != null) {
            updateTasks(this.form2).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open2 = false;
              // 只允许修改备注不需要更新bom
              // this.$refs['bomlist'].getList();
              this.getList();
            });
          } else {
            addWorkorder(this.form2).then(response => {
              this.$modal.msgSuccess('新增成功');
              //this.open = false;
              this.form2.id = response.data;
              this.getList();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel2() {
      this.open2 = false;
      this.reset2();
    },
    //从BOM行中直接新增
    handleSubAdd(row) {
      this.open = false;
      this.reset2();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form2 = row;
        this.form2.parentId = row.id;
        this.form2.id = null;
        this.form2.workorderCode = null;
      } else {
        this.form2.parentId = 0;
      }
      this.open2 = true;
      this.title2 = '添加生产工单';
      this.optType = 'add';
    },
    //客户选择弹出框
    onClientSelected(obj) {
      if (obj != undefined && obj != null) {
        this.form2.clientId = obj.id;
        this.form2.clientCode = obj.clientCode;
        this.form2.clientName = obj.clientName;
      }
    },
    handleSelectClient() {
      this.$refs.clientSelect.showFlag = true;
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        genCode('WORKORDER_CODE').then(response => {
          this.form.workorderCode = response;
        });
      } else {
        this.form.workorderCode = null;
      }
    },
    /** 查询生产工单下拉树结构 */
    getTreeselect() {
      listWorkorder().then(response => {
        this.workorderOptions = [];
        const data = {id: 0, workorderName: '顶级节点', children: []};
        data.children = this.handleTree(response.data.list, 'id', 'parentId');
        this.workorderOptions.push(data);
      });
    },
    // 查询明细按钮操作
    handleView(row) {
      this.reset();
      this.getTreeselect();
      getProtask(row.id).then(async response => {
        let das = await getWorkorder(response.data.workorderId);
        response.data.adjuncts = das.data.adjuncts;
        this.form2 = response.data;
        this.open2 = true;
        this.title2 = '查看任务信息';
        this.optType = 'view';
      });
    },
    reset2() {
      this.form2 = {
        id: null,
        workorderCode: null,
        workorderName: null,
        orderSource: null,
        sourceCode: null,
        productId: null,
        productCode: null,
        productName: null,
        productSpc: null,
        unitOfMeasure: null,
        quantity: null,
        quantityProduced: null,
        quantityChanged: null,
        quantityScheduled: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        requestDate: null,
        parentId: null,
        status: '',
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        adjuncts: '',
        isOut: false,
      };
      this.autoGenFlag = false;
      this.resetForm('form2');
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getTaskPage(this.queryParams).then(response => {
        console.log(response.data);
        if(!response.data){
          this.loading = false;
          return;
        }
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
        return;
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
        reportFee: undefined,
        id: undefined,
        taskCode: undefined,
        taskName: undefined,
        workorderId: undefined,
        workorderCode: undefined,
        workorderName: undefined,
        workstationId: undefined,
        workstationCode: undefined,
        workstationName: undefined,
        processId: undefined,
        processCode: undefined,
        processName: undefined,
        itemId: undefined,
        itemCode: undefined,
        itemName: undefined,
        specification: undefined,
        unitOfMeasure: undefined,
        quantity: undefined,
        quantityProduced: undefined,
        quantityQuanlify: undefined,
        quantityUnquanlify: undefined,
        quantityChanged: undefined,
        clientId: undefined,
        clientCode: undefined,
        clientName: undefined,
        clientNick: undefined,
        startTime: undefined,
        duration: undefined,
        endTime: undefined,
        colorCode: undefined,
        requestDate: undefined,
        status: undefined,
        remark: undefined,
        attr1: undefined,
        attr2: undefined,
        attr3: undefined,
        attr4: undefined,
      };
      this.teamMembers = [];
      this.resetForm('form');
    },
    jumpDashboard(item) {
      // this.$router.push({ name: 'MesProTaskDetail', params: { id: item.id } });
      window.open(`${location.origin}/mes/pro/protask/${item.id}`, '_blank');
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
    async handleUpdateStatus(row, status, message) {
      await this.$modal.confirm(message);
      await updateProtask({id: row.id, status});
      this.getList();
    },
    async handleUpdateCount(row) {
      this.row = row
      this.title = '报工';
      this.reset();
      console.log(row);
      if (row.feedbackStatus != "N") {
        this.$modal.msgError('当前任务已报工!');
        return;
      }
      this.form.workorderCode = row.workorderCode;
      this.form.workorderName = row.workorderName;
      this.form.taskId = row.id;
      this.form.taskCode = row.taskCode;
      this.form.taskName = row.taskName;
      this.form.teamCode = row.attr1;
      this.form.itemId = row.itemId;
      this.form.itemCode = row.itemCode;
      this.form.itemName = row.itemName;
      this.form.specification = row.specification;
      this.form.unitOfMeasure = row.unitOfMeasure;
      this.form.workstationCode = row.workstationCode;
      this.form.workstationName = row.workstationName;
      this.form.workstationId = row.workstationId;
      this.form.workorderId = row.workorderId;
      this.form.feedbackTime = new Date();
      this.form.feedbackStatus = row.feedbackStatus;
      this.form.processCode = row.processCode;
      this.form.processName = row.processName;
      this.form.processId = row.processId;
      // 基于班组编码获取绑定的人员信息
      getTeammemberByTeamCode(this.form.teamCode).then(response => {
        console.log(response);
        for (let i = 0; i < response.data.length; i++) {
          let obj = response.data[i];
          obj.username = obj.userName; // 用户名
          obj.nickname = obj.nickName; // 昵称
          this.teamMembers.push(obj);
        }
      });
      this.open = true;
    },
    async handlePrint(row) {
      await this.$modal.confirm('确认打印？')
      let datas = await createPrintLog({printName: this.$store.state.user.nickname, printType: this.$route.meta.title + '-任务编号', printCode: row.taskCode});
      if (!datas.data) {
        this.$message.error(datas.msg);
        return
      }
      let {data} = await getConfigKey('REPORT_WORKORDER');
      window.open(`${process.env.VUE_APP_BASE_API}/jmreport/view/${data.value}?token=${getAccessToken()}&workorderId=${row.workorderId}`);
      let datas1 = await updateTasksPrint({id: row.id});
      this.getList();
    },
    /** 提交按钮 */
    submitForm() {
      /*this.$refs['form'].validate(valid => {
        this.form.feedbackType = 'SELF';
        this.form.reportFee = this.form.reportFee * 1;
        // delete this.form.reportFee;
        if (!valid) {
          return;
        }
        // 修改的提交
        updateTask(Object.assign(this.form, this.row)).then(response => {
          this.$modal.msgSuccess('修改成功');
          this.open = false;
          this.getList();
        });
        return;
      });*/
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log('提交表单', this.form);
          this.form.feedbackMemberList = this.teamMembers;
          if (this.form.feedbackStatus === "N") {
            addFeedback(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          } else {
            this.$modal.msgError('当前任务已报工!');
            return;
          }
        }
      });
    },
    handleUpdate(row) {
      this.reset();
      const recordId = row.id || this.ids;
      getFeedback(recordId).then(response => {
        this.form = response.data;
        this.teamMembers = this.form.memberList;
        this.open = true;
        this.title = '修改生产报工记录';
      });
    },
    handleQuantityChanged() {
      this.form.quantityFeedback = this.form.quantityQualified + this.form.quantityUnquanlified;
    },
    addTeamMember() {
      // 实现新增班组成员的逻辑
      this.$refs.userSelect.showFlag = true;
    },
    deleteTeamMember(id) {
      // 实现删除班组成员的逻辑
      this.teamMembers = this.teamMembers.filter(member => member.id !== id);
    },
    //人员选择返回
    onUserSelected(row) {
      console.log(row);
      this.teamMembers.push(row);
    },
    //  async yjbg(row) {
    //   await this.$modal.confirm(`确认一键报工?`).then(async () => {
    //      row.taskId = row.id;
    // let data = await create(row);
    // data.data.userName = this.$store.state.user.nickname;
    // data.data.nickName = this.$store.state.user.nickname;
    // data.data.feedbackTime = +new Date();
    // let data2 = await create2(data.data);
    //      row.userName = this.$store.state.user.username;
    //      row.nickName = this.$store.state.user.nickname;
    //      row.feedbackTime = +new Date();
    //      let data2 = await create2(row);
    //     if (data2.code == 0) {
    //       this.$modal.msgSuccess('报工成功');
    //       // 更新列表数据
    //       this.getList();
    //     }
    //   })
    //   }
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  :deep() {
    .el-descriptions__body{
      background-color: transparent;
    }
  }
}
</style>
