<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="报工类型" prop="feedbackType">
        <el-select v-model="queryParams.feedbackType" placeholder="请选择报工类型" clearable>
          <el-option v-for="dict in dict.type.mes_feedback_type" :key="dict.value" :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="工作站名称" prop="workstationName">
        <el-input v-model="queryParams.workstationName" placeholder="请输入工作站名称" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产工单编号" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入生产工单编号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="产品物料编码" prop="itemCode">
        <el-input v-model="queryParams.itemCode" placeholder="请输入产品物料编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="产品物料名称" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入产品物料名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="报工人" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入报工人名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="记录人" prop="recordUser">
        <el-input v-model="queryParams.recordUser" placeholder="请输入记录人" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['pro:feedback:create']">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                   v-hasPermi="['pro:feedback:update']">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                   v-hasPermi="['pro:feedback:delete']">删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" :disabled="single" size="mini" @click="handlePrint"
                   v-hasPermi="['pro:feedback:create']"> 打印
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-success" size="mini" @click="warehousing">入库</el-button>
      </el-col>

      <el-col :span="1.5"><!--v-hasPermi="['pro:feedback:split']"-->
        <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="single" @click="split">拆分</el-button>
      </el-col>


      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="feedbackList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="报工类型" align="center" prop="feedbackType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_feedback_type" :value="scope.row.feedbackType"/>
        </template>
      </el-table-column>
      <el-table-column label="工作站" width="120px" align="center" prop="workstationName"/>
      <el-table-column label="生产工单编号" width="150px" align="center" prop="workorderCode"/>
      <el-table-column label="产品物料编码" width="120px" align="center" prop="itemCode"/>
      <el-table-column label="产品物料名称" width="150px" align="center" prop="itemName"/>
      <el-table-column label="规格型号" align="center" prop="specification"/>
      <el-table-column label="报工数量" align="center" prop="quantityFeedback"/>
      <el-table-column label="报工人" align="center" prop="nickName"/>
      <el-table-column label="报工价格" align="center" prop="reportFee"/>
      <el-table-column label="报工时间" align="center" prop="feedbackTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.feedbackTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="recordNick">
        <!-- <template slot-scope="scope">
          {{ scope.row.recordNick ? scope.row.recordNick : $store.state.user.nickname }}
        </template> -->
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-query" @click="handleView(scope.row)"
                     v-hasPermi="['pro:feedback:query']">查看
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['pro:feedback:update']" v-if="scope.row.status == 'PREPARE'">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['pro:feedback:delete']" v-if="scope.row.status == 'PREPARE'">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 添加或修改生产报工记录对话框 -->
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
              <el-input v-model="form.workorderCode" placeholder="请选择生产工单">
                <el-button slot="append" icon="el-icon-search" @click="handleWorkorderSelect"></el-button>
              </el-input>
            </el-form-item>
            <WorkorderSelect ref="woSelect" @onSelected="onWorkorderSelected"></WorkorderSelect>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产任务" prop="taskCode">
              <el-input v-model="form.taskCode" placeholder="请选择生产任务">
                <el-button slot="append" icon="el-icon-search" @click="handleTaskSelect"></el-button>
              </el-input>
            </el-form-item>
            <ProtaskSelect ref="taskSelect" :workorderId="form.workorderId" @onSelected="onTaskSelected"></ProtaskSelect>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品编码" prop="itemCode">
              <el-input v-model="form.itemCode" readonly="readonly"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称" prop="itemName">
              <el-input v-model="form.itemName" readonly="readonly"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input v-model="form.unitOfMeasure" readonly="readonly"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="规格型号" prop="specification">
              <el-input v-model="form.specification" type="textarea" readonly="readonly"/>
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
        <!--        <el-row>
                  <el-col :span="8">
                    <el-form-item label="报工人" prop="nickName">
                      <el-input v-model="form.nickName" placeholder="请选择报工人">
                        <el-button slot="append" @click="handleUserSelect" icon="el-icon-search"></el-button>
                      </el-input>
                    </el-form-item>
                    <UserSingleSelect ref="userSelect" @onSelected="onUserSelected"></UserSingleSelect>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="报工时间" prop="feedbackTime">
                      <el-date-picker clearable v-model="form.feedbackTime" type="date" value-format="timestamp"
                                      placeholder="请选择报工时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="审核人" prop="recordNick">
                      <el-input v-model="form.recordNick" placeholder="请选择审核人">
                        <el-button slot="append" @click="handleUser2Select" icon="el-icon-search"></el-button>
                      </el-input>
                    </el-form-item>
                    <UserSingleSelect ref="user2Select" @onSelected="onUser2Selected"></UserSingleSelect>
                  </el-col>
                </el-row>-->
        <el-row>

          <el-col :span="8">
            <el-form-item label="报工班组" prop="teamCode">
              <el-input v-model="form.teamCode" placeholder="请输入报工班组"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报工时间" prop="feedbackTime">
              <el-date-picker clearable v-model="form.feedbackTime" type="date" value-format="timestamp"
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

<!--        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view' || form.status != 'PREPARE'">返回</el-button>
        <el-button type="primary" @click="submitForm" v-if="form.status == 'PREPARE' && optType != 'view'">保 存
        </el-button>
        <el-button type="primary" @click="handleSubmit" v-if="form.status == 'PREPARE' && optType != 'view'">提交审批
        </el-button>
        <el-button type="success" @click="handleExecute" v-if="form.status == 'APPROVING' && form.id != null">审批通过
        </el-button>
        <el-button type="danger" @click="handleReject" v-if="form.status == 'APPROVING' && form.id != null">审批不通过
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!--  入库  -->
    <el-dialog :title="title" :visible.sync="wareOpen" width="75%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="wareForm" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="报工单" prop="id">
              <el-input v-model="wareForm.id" placeholder="请扫描报工单" @blur="handleBlur"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" round @click="getCameraInfo()">摄像头</el-button>
          </el-col>
          <!--          <el-col :span="12">
                      <el-form-item label="仓库信息" prop="goodsNumber">
                        <el-cascader v-model="wareForm.wareHouse" :options="warehouseOptions" :props="warehouseProps" @change="handleWarehouseChanged"></el-cascader>
                      </el-form-item>
                    </el-col>-->
        </el-row>

        <!-- 设置el-table的高度 -->
        <el-table v-loading="loading" :data="wareList" height="500">
          <el-table-column label="产品编号" align="center" prop="itemCode"/>
          <el-table-column label="产品名称" align="center" prop="itemName"/>
          <el-table-column label="工单号" align="center" prop="workorderCode"/>
          <el-table-column label="生产车间" align="center" prop="workstationName"/>
          <el-table-column label="任务单号" align="center" prop="taskCode"/>
          <el-table-column label="合格数量" align="center" prop="quantityQualified"/>
          <el-table-column label="产品单位" align="center" prop="unitOfMeasure"/>
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div>
        <video ref="videoCamera" style="display: none;"></video>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitWareForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 摄像头预览弹出框 -->
    <el-dialog title="摄像头预览" :visible.sync="cameraPreviewVisible" width="50%" v-dialogDrag append-to-body>
      <div> <!--v-if="cameraPreviewVisible"-->
        <video ref="videoCameraPreview" autoplay playsinline style="width: 100%; height: auto;"></video>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cameraPreviewVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 拆分弹出框 -->
    <el-dialog :title="'拆分详情'" :visible.sync="splitDialogVisible" width="50%" v-dialogDrag append-to-body>
      <el-form ref="splitForm" :model="splitForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报工单号" prop="workorderCode">
              <el-input disabled v-model="splitForm.workorderCode" placeholder="请输入报工单号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品物料编码" prop="itemCode">
              <el-input disabled v-model="splitForm.itemCode" placeholder="请输入产品物料编码"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入库数量" prop="quantityFeedback">
              <el-input disabled v-model="splitForm.quantityFeedback" placeholder="请输入入库数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库单位" prop="unitOfMeasure">
              <el-input disabled v-model="splitForm.unitOfMeasure" placeholder="请输入入库单位"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div style="text-align: right; margin-top: 20px;">
        <el-button type="primary" @click="addSplitDetail">新增</el-button>
      </div>

      <!-- 拆分表格 -->
      <el-table :data="splitDetails" style="width: 100%;" max-height="400">
        <el-table-column prop="workorderCode" label="报工单号" width="180"/>
        <el-table-column prop="itemCode" label="物料料号" width="180"/>
        <el-table-column prop="unitOfMeasure" label="物料单位" width="180"/>
        <el-table-column prop="quantity" label="数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.quantity" type="number" placeholder="请输入数量"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="removeSplitDetail(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="splitDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSplit">确定拆分</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {listFeedback, getFeedback, delFeedback, addFeedback, updateFeedback, execute, executes, startWareHousing} from '@/api/mes/pro/feedback';
import WorkorderSelect from '@/components/workorderSelect/single.vue';
import WorkstationSelect from '@/components/workstationSelect/simpletableSingle.vue';
import UserSingleSelect from '@/components/userSelect/single.vue';
import ProtaskSelect from '@/components/TaskSelect/taskSelectSingle.vue';
import {getConfigKey} from '@/api/system/config';
import {getAccessToken} from '@/utils/auth';
import {getTreeList} from '@/api/mes/wm/warehouse';
import {createPrintLog, getPrintLogPage} from "@/api/report/printLog";
import jsQR from "jsqr";
import { getTeammemberByTeamCode } from '@/api/mes/cal/teammember';

export default {
  name: 'Feedback',
  components: {WorkorderSelect, WorkstationSelect, UserSingleSelect, ProtaskSelect},
  dicts: ['mes_order_status', 'mes_feedback_type'],
  data() {
    return {
      optType: undefined,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 生产报工记录表格数据
      feedbackList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 入库弹出层
      wareOpen: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        feedbackType: null,
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        workorderId: null,
        workorderCode: null,
        workorderName: null,
        taskId: null,
        taskCode: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        unitOfMeasure: null,
        specification: null,
        quantity: null,
        quantityFeedback: null,
        quantityQualified: null,
        quantityUnquanlified: null,
        userName: null,
        nickName: null,
        feedbackChannel: null,
        feedbackTime: null,
        recordUser: null,
        recordNick: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        feedbackType: [{required: true, message: '报工类型不能为空', trigger: 'change'}],
        taskCode: [{required: true, message: '请选择生产任务', trigger: 'blur'}],
        workorderCode: [{required: true, message: '生产工单不能为空', trigger: 'blur'}],
        quantityQualified: [{required: true, message: '请输入合格品数量', trigger: 'blur'}],
        quantityUnquanlified: [{required: true, message: '请输入不合格品数量', trigger: 'blur'}],
        nickName: [{required: true, message: '请选择报工人', trigger: 'blur'}],
        feedbackTime: [{required: true, message: '请选择报工时间', trigger: 'blur'}],
      },
      // 仓库数据
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
      },
      //摄像头配置
      targetCameraId: null,
      videoWidth: 640,
      videoHeight: 480,
      cameraPreviewVisible: false, // 控制摄像头弹出框
      scanResult: '', // 存储扫描结果
      // 入库表单参数
      wareForm: {},
      // 准备入库的产成品明细
      wareList: [],
      // 拆分弹出框是否可见
      splitDialogVisible: false,
      // 拆分表单数据
      splitForm: {
        workorderCode: '',
        itemCode: '',
        quantityFeedback: '',
        unitOfMeasure: ''
      },
      selectedRows: [], // 选中行数据
      // 拆分详情列表
      splitDetails: [],
      teamMembers: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询生产报工记录列表 */
    getList() {
      this.loading = true;
      listFeedback(this.queryParams).then(response => {
        this.feedbackList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.wareOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        feedbackType: null,
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        processId: null,
        processCode: null,
        processName: null,
        workorderId: null,
        workorderCode: null,
        workorderName: null,
        taskId: null,
        taskCode: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        quantity: null,
        quantityFeedback: null,
        quantityQualified: null,
        quantityUnquanlified: null,
        userName: null,
        nickName: null,
        feedbackChannel: null,
        feedbackTime: null,
        recordUser: null,
        recordNick: null,
        status: 'PREPARE',
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.resetForm('form');
    },
    handleQuantityChanged() {
      this.form.quantityFeedback = this.form.quantityQualified + this.form.quantityUnquanlified;
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.selectedRows = selection;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.form.feedbackTime = new Date(); // 追加当前时间展示
      this.title = '添加生产报工记录';
      this.optType = 'add';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recordId = row.id || this.ids;
      getFeedback(recordId).then(response => {
        this.form = response.data;
        console.log(this.form);
        for(let i=0;i<this.form.memberList.length;i++){
           this.form.memberList[i].nickname = this.form.memberList[i].nickName;
          this.form.memberList[i].username = this.form.memberList[i].userName;
        }
        this.teamMembers = this.form.memberList;
        this.open = true;
        this.title = '修改生产报工记录';
        this.optType = 'edit';
      });
    },
    // 查询明细按钮操作
    handleView(row) {
      this.reset();
      const recordId = row.id || this.ids;
      getFeedback(recordId).then(response => {
        // 在此处更改 审核人
        // response.data.recordNick = response.data.recordNick ? response.data.recordNick : this.$store.state.user.nickname;
        this.form = response.data;
        this.open = true;
        this.title = '查看生产报工单信息';
        this.optType = 'view';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.feedbackMemberList = this.teamMembers;
          if (this.form.id != null) {
            updateFeedback(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addFeedback(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleSubmit() {
      this.form.status = 'APPROVING';
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFeedback(this.form).then(response => {
              this.$modal.msgSuccess('提交成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    //执行
    handleExecute() {
      const recordIds = this.form.id;
      this.$modal
        .confirm('确认执行报工？')
        .then(function () {
          return executes({id: recordIds, status: 'APPROVED'}); //审核通过APPROVED 不通过UNAPPROVED
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('执行成功');
          this.open = false;
        })
        .catch(() => {
        });
    },
    // 审核不通过
    handleReject() {
      const recordIds = this.form.id;
      this.$modal
        .confirm('确认拒审报工？')
        .then(function () {
          return executes({id: recordIds, status: 'UNAPPROVED'}); //审核通过APPROVED 不通过UNAPPROVED
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('拒审成功');
          this.open = false;
        })
        .catch(() => {
        });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const recordIds = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除生产报工记录编号为"' + recordIds + '"的数据项？')
        .then(function () {
          return delFeedback(recordIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'pro/feedback/export',
        {
          ...this.queryParams,
        },
        `feedback_${new Date().getTime()}.xlsx`,
      );
    },
    //选择生产工单
    handleWorkorderSelect() {
      this.$refs.woSelect.showFlag = true;
    },
    onWorkorderSelected(row) {
      if (row != undefined && row != null) {
        this.form.workorderId = row.id;
        this.form.workorderCode = row.workorderCode;
        this.form.workorderName = row.workorderName;
        this.form.itemId = row.productId;
        this.form.itemCode = row.productCode;
        this.form.itemName = row.productName;
        this.form.specification = row.productSpc;
        this.form.unitOfMeasure = row.unitOfMeasure;
      }
    },
    handleTaskSelect() {
      this.$refs.taskSelect.showFlag = true;
      this.$refs.taskSelect.getList();
    },
    onTaskSelected(row) {
      if (row != undefined && row != null) {
        console.log(row);
        this.form.taskId = row.id;
        this.form.taskCode = row.taskCode;
        this.form.taskName = row.taskName;
        this.form.workstationId = row.workstationId;
        this.form.workstationCode = row.workstationCode;
        this.form.workstationName = row.workstationName;
        this.form.processId = row.processId;
        this.form.processCode = row.processCode;
        this.form.processName = row.processName;
        this.form.teamCode = row.attr1;
      }
      if(this.form.teamCode){
        // 基于当前班组编码获取班组人员
        getTeammemberByTeamCode(this.form.teamCode).then(response => {
          console.log(response);
          for(let i=0;i<response.data.length;i++){
            let obj = response.data[i];
            obj.username = obj.userName; // 用户名
            obj.nickname = obj.nickName; // 昵称
            this.teamMembers.push(obj);
          }
        });
      }
    },
//点击人员选择按钮
    handleUserSelect() {
      this.$refs.userSelect.showFlag = true;
    },
    //人员选择返回
    onUserSelected(row) {
      console.log(row);
      this.teamMembers.push(row);
    },
    //点击人员选择按钮
    handleUser2Select() {
      this.$refs.user2Select.showFlag = true;
    },
    //人员选择返回
    onUser2Selected(row) {
      this.form.recordUser = row.username;
      this.form.recordNick = row.nickname;
    },
    // 打印按钮
    async handlePrint(row) {
      const recordId = row.id || this.ids;
      let status = row.status;
      /*if(status !='FINISHED'){
        this.$modal.msgError('只有完成状态才能打印');
      }*/

      await this.$modal.confirm('确认打印？')
      let datas = await createPrintLog({printName: this.$store.state.user.nickname, printType: this.$route.meta.title + '-报工单号', printCode: '报工单'});
      if (!datas.data) {
        this.$message.error(datas.msg);
        return
      }
      // 测试打印功能
      let res = await getConfigKey('CP2');
      if (!res.data && res.code == 0) {
        this.$message.error('请先配置产成品标签id');
        return
      }
      let id = res.data.value;
      console.log(this.$route.query.id);
      if (id) {
        window.open(`${process.env.VUE_APP_BASE_API}/jmreport/view/${id}?token=${getAccessToken()}&id=${this.ids[0]}`);
        //this.getDetail()
      }
    },
    // 初始化仓库数据
    getWarehouseList() {
      getTreeList().then(response => {
        this.warehouseOptions = response.data;
      });
    },
    // 开始入库
    warehousing() {
      // 初始化仓库信息
      // 弹出框
      this.wareOpen = true;
      this.title = '产成品入库';
      this.getWarehouseList();
    },
    async getCameraInfo() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        const specificCamera = videoDevices.find(device => device.label === 'GC8034');
        if (specificCamera) {
          this.targetCameraId = specificCamera.deviceId;
          console.log('找到指定摄像头:', specificCamera);
        } else {
          const defaultCamera = videoDevices[0];
          if (defaultCamera) {
            this.targetCameraId = defaultCamera.deviceId;
            console.log('使用默认摄像头:', defaultCamera);
          } else {
            console.log('未找到任何可用的摄像头');
            this.$notify({
              title: '错误',
              message: '未找到任何可用的摄像头',
              type: 'error'
            });
            return;
          }
        }
        this.showCameraPreview();
      } catch (error) {
        console.error('获取摄像头信息失败:', error);
        this.$notify({
          title: '错误',
          message: '获取摄像头信息失败',
          type: 'error'
        });
      }
    },

    startScanning() {
      const deviceId = this.targetCameraId || undefined;
      const constraints = {
        audio: false,
        video: {
          width: this.videoWidth,
          height: this.videoHeight,
          deviceId: {exact: deviceId}
        }
      };

      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        this.$refs.videoCameraPreview.srcObject = stream;
        this.$refs.videoCameraPreview.onloadedmetadata = () => {
          this.$refs.videoCameraPreview.play();
          this.loading = false;
          this.scanQRCode();
        };
      }).catch(err => {
        console.error("无法打开摄像头: ", err);
        this.$notify({
          title: '警告',
          message: '没有开启摄像头权限或浏览器版本不兼容.',
          type: 'warning'
        });
        this.cameraPreviewVisible = false;
      });
    },
    // 扫描二维码
    scanQRCode() {
      const that = this;
      const video = this.$refs.videoCameraPreview;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // 将视频流绘制到 canvas 上
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          // 获取 canvas 的图像数据
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          // 使用 jsQR 解码图像数据
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          if (code) {
            console.log('QR Code scanned:', code.data);
            //this.stopScanning();
            // 处理扫描到的二维码数据
            // let fin = null;// 最终扫描的数据
            if (code.data) {
              // 关闭当前的摄像头预览弹出框
              that.cameraPreviewVisible = false;
              try {
                // 替换中文引号为英文引号，并解析 JSON
                code.data = code.data.replace(/“/g, '"').replace(/”/g, '"').replace(/：/g, ':').replace(/，/g, ',');
                // 移除零宽度非换行空格字符
                code.data = code.data.replace(/\uFEFF/g, '');
                // 直接解析 JSON 字符串
                const data = JSON.parse(code.data);
                // 检查是否包含 po_no 属性
                if (data && data.id) {
                  that.wareForm.id = data.id;
                } else {
                  console.log("data is undefined");
                }
              } catch (error) {
                console.error('解析 JSON 出错:', error);
                that.$message.error('扫描结果不是有效的 JSON 字符串');
              }
              that.handleBlur(); // 基于当前的采购单获取所有的物料数据
              that.stopScanning();
            }
          }
        }
        requestAnimationFrame(tick);
      }

      tick();
    },
    // 停止扫描二维码
    stopScanning() {
      const stream = this.$refs.videoCameraPreview.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    },
    // 显示摄像头预览弹出框
    showCameraPreview() {
      this.cameraPreviewVisible = true;
      this.startScanning();
    },
    handleBlur() {
      // 获取当前的采购单数据
      console.log(this.wareForm.id);
      let idStr = this.wareForm.id.toString();
      if (this.wareForm.id && (idStr.includes('{') || idStr.includes('[') || idStr.includes('}') || idStr.includes(']')) && !idStr.includes('"')) {
        idStr = idStr.trim();
        // 清理文本框内容的多余空格，并格式化为标准 JSON 格式
        idStr = idStr
          // 去除字段名和字段值之间的多余空格
          .replace(/\s*[:]\s*/g, ':')
          .replace(/\s*,\s*/g, ',')
          .replace(/\s*{\s*/g, '{')
          .replace(/\s*}\s*/g, '}')
          .replace(/\s*\[\s*/g, '[')
          .replace(/\s*\]\s*/g, ']');
        // 给键和字符串值加上双引号
        let formattedData = idStr
          // 给所有键名加双引号
          .replace(/([a-zA-Z0-9_]+)(?=\s*[:])/g, '"$1"')
          // 给字符串值加双引号，排除数字和其他非字符串类型的值
          .replace(/(:\s*)([a-zA-Z\u4e00-\u9fa5_-]+)(?=\s*,|\s*\})/g, '$1"$2"');
        // Step 2: 处理数字和标识符类型的字符串，如 AMCG86-241030001 和 20241106805-01，需给它们加上双引号
        formattedData = formattedData.replace(/(:\s*)([A-Za-z0-9-]+)(?=\s*,|\s*\})/g, '$1"$2"');

        try {
          // Step 3: 使用 JSON.parse 转换为对象
          const parsedData = JSON.parse(formattedData);
          // Step 4: 使用 JSON.stringify 格式化为标准 JSON 字符串
          const data = JSON.stringify(parsedData, null, 2);
          const transedData = JSON.parse(data);
          // 检查是否包含id属性
          if (transedData) {
            if (!transedData.type) {
              this.$message.error('扫描结果不是有效成品条码!');
            }
            // 更新 wareForm.poNo
            this.wareForm.id = transedData.id;
          }
        } catch (error) {
          this.$message.error('扫描结果不是有效的 JSON 字符串');
        }
      }
      getFeedback(this.wareForm.id).then(response => {
        let obj = response.data;
        let id = obj.id;
        /*this.wareList = this.wareList.filter(item => {
          return !id.includes(item.id);
        });*/
        console.log(obj);
        // 追加报工入库明细
        this.wareList.push(obj);
      });

    },
    //选择默认的仓库、库区、库位
    handleWarehouseChanged(obj) {
      if (obj != null) {
        this.wareForm.warehouseId = obj[0]; // 仓库
        this.wareForm.locationId = obj[1];// 库区
        this.wareForm.areaId = obj[2]; // 库位
      }
    },

    submitWareForm() {
      /* if (!this.wareForm.wareHouse) {
         this.$message.error('请选择要入库的位置!');
         return;
       }*/
      // TODO 校验表单数据
      let obj = {
        "wareList": this.wareList,
      }
      startWareHousing(obj).then(response => {
        this.wareOpen = false;
        this.$message.success('入库成功');
      });
      // TODO 调用入库接口
      // TODO 关闭弹出框
      // TODO 刷新列表
    },
    // 显示拆分弹出框
    split() {
      // 检查 selectedRows 是否已定义且非空
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.warning('请选择至少一项进行拆分');
        return;
      }

      const firstRow = this.selectedRows[0]; // 安全访问第一行
      this.splitForm = {
        workorderCode: firstRow.workorderCode,
        itemCode: firstRow.itemCode,
        quantityFeedback: firstRow.quantityFeedback,
        unitOfMeasure: firstRow.unitOfMeasure
      };

      this.splitDetails = this.selectedRows.map(row => ({
        workorderCode: row.workorderCode,
        itemCode: row.itemCode,
        unitOfMeasure: row.unitOfMeasure,
        quantity: '' // 用户需要填写的数量
      }));
      this.splitDialogVisible = true;
    },
    // 新增拆分行
    addSplitDetail() {
      const newRow = {
        workorderCode: this.splitForm.workorderCode,
        itemCode: this.splitForm.itemCode,
        unitOfMeasure: this.splitForm.unitOfMeasure,
        quantity: ''
      };
      this.splitDetails.push(newRow);
    },
    // 删除拆分行
    removeSplitDetail(index) {
      this.splitDetails.splice(index, 1);
    },
    // 提交拆分
    submitSplit() {
      // 校验拆分详情中的数量总和是否小于等于报工数量
      let totalQuantity = this.splitDetails.reduce((sum, detail) => {
        return sum + (parseFloat(detail.quantity) || 0);
      }, 0);

      if (totalQuantity > parseFloat(this.splitForm.quantityFeedback)) {
        this.$message.error('拆分数量总和不能超过报工数量');
        return;
      }

      // 校验拆分行的数量是否为空或0
      for (let detail of this.splitDetails) {
        if (!detail.quantity || parseFloat(detail.quantity) === 0) {
          this.$message.error('拆分行的数量禁止为空或0');
          return;
        }
      }
      // 这里添加提交拆分逻辑
      this.splitDialogVisible = false;
      this.$message.success('拆分成功');
    },
    addTeamMember() {
      // 实现新增班组成员的逻辑
      //this.userSelectVisible = true;
      this.$refs.userSelect.showFlag = true;
    },
    deleteTeamMember(id) {
      // 实现删除班组成员的逻辑
      this.teamMembers = this.teamMembers.filter(member => member.id !== id);
    },

  },

};
</script>
