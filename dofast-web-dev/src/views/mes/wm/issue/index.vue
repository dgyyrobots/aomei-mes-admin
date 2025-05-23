<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="领料单编号" prop="issueCode">
        <el-input v-model="queryParams.issueCode" placeholder="请输入领料单编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="领料单名称" prop="issueName">
        <el-input v-model="queryParams.issueName" placeholder="请输入领料单名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="领料日期" prop="issueDate">
        <el-date-picker clearable v-model="queryParams.issueDate" type="date" value-format="timestamp" placeholder="请选择领料日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="任务单号" prop="taskCode">
        <el-input v-model="queryParams.taskCode" placeholder="请输入任务单号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="生产工序" prop="processCode">
        <el-select @change="val => { handleProcessChange(val) }" v-model="queryParams.processCode" placeholder="请选择生产工序" clearable>
          <el-option v-for="item in processOptions" :key="item.processCode" :label="item.processName" :value="item.processCode"/>
        </el-select>
      </el-form-item>


      <el-form-item label="单据状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择单据状态" clearable>
          <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['wms:issue-header:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['wms:issue-header:update']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['wms:issue-header:delete']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['mes:wm:issueheader:export']">导出</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-download" size="mini" :disabled="single" @click="handleChanceTask" v-hasPermi="['wms:issue-header:update']">完成</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-download" size="mini" :disabled="single" @click="handleFinsh" v-hasPermi="['wms:issue-header:update']">完成</el-button>
      </el-col>

      <!--      <el-col :span="1.5">
              <el-button type="warning" plain icon="el-icon-download" size="mini" :disabled="single"  @click="handleFeeding" v-hasPermi="['wms:issue-header:create']">扫码上料</el-button>
            </el-col>-->

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="issueheaderList" @selection-change="handleSelectionChange" ref="multipleTable" @row-click="handleRowClick">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="领料单编号" align="center" width="150px" prop="issueCode">
        <template slot-scope="scope">
          <el-button type="text" @click="handleView(scope.row)" v-hasPermi="['wms:issue-header:query']">
            {{ scope.row.issueCode }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column disabled label="领料单名称" align="center" prop="issueName" :show-overflow-tooltip="true"/>
      <el-table-column label="生产工单" align="center" prop="workorderCode"/>
      <el-table-column label="生产工序" align="center" prop="processName"/>
      <el-table-column label="生产任务" align="center" prop="taskCode"/>
      <el-table-column label="领料日期" align="center" prop="issueDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.issueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column width="220" fixed="right"  label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.status == 'PREPARE' || scope.row.status == 'CONFIRMED'" @click="handleExecute(scope.row)" v-hasPermi="['wms:issue-header:update']">执行上料</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" v-if="scope.row.status == 'PREPARE' || scope.row.status == 'CONFIRMED' " @click="handleUpdate(scope.row)" v-hasPermi="['wms:issue-header:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.status == 'PREPARE'" @click="handleDelete(scope.row)" v-hasPermi="['wms:issue-header:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList"/>

    <!-- 添加或修改生产领料单头对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="75%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="领料单编号" prop="issueCode">
              <el-input v-model="form.issueCode" placeholder="请输入领料单编号" :disabled="optType !== 'add'"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view' && form.status == 'PREPARE'"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领料单名称" prop="issueName">
              <el-input v-model="form.issueName" placeholder="请输入领料单名称" :disabled="optType !== 'add'"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="领料日期" prop="issueDate">
              <el-date-picker clearable v-model="form.issueDate" type="date" value-format="timestamp" placeholder="请选择领料日期" :disabled="optType !== 'add'"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="领料仓库">
              <el-cascader
                v-model="warehouseInfo"
                :options="warehouseOptions"
                :props="warehouseProps"
                placeholder="请选择"s
                @change="handleWarehouseChanged"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select v-model="form.status" disabled>
                <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input v-model="form.workorderCode" placeholder="请选择生产工单">
                <el-button slot="append" icon="el-icon-search" @click="handleWorkorderSelect"></el-button>
              </el-input>
            </el-form-item>
            <WorkorderSelect ref="woSelect" @onSelected="onWorkorderSelected"></WorkorderSelect>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户编号">
              <el-input v-model="form.clientCode" placeholder="请选择生产工单" :disabled="optType !== 'add'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <el-input v-model="form.clientName" placeholder="请选择生产工单" :disabled="optType !== 'add'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="任务信息" prop="taskCode">
              <el-input v-model="form.taskCode" placeholder="请选择任务信息" disabled>
                <el-button slot="append" icon="el-icon-search" @click="handleTaskSelect"></el-button>
              </el-input>
            </el-form-item>
            <TaskSelectSingle  :processCode="cachedProcessCode" :workorderId="form.workorderId" ref="taskSelect" @onSelected="onTaskSelected"></TaskSelectSingle>
          </el-col>

          <el-col :span="12">
            <el-form-item label="工作站" prop="workstationName">
              <el-input v-model="form.workstationName" placeholder="请选择工作站" disabled>
                <!--                <el-button slot="append" icon="el-icon-search" @click="handleWorkstationSelect"></el-button>-->
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

<!--        <el-row>
          <el-col :span="12">
            <el-form-item label="设备信息" prop="machineryName">
              <el-input v-model="form.machineryName" placeholder="请选择设备信息" disabled>
                <el-button slot="append" icon="el-icon-search" @click="handleMachineryAdd"></el-button>
              </el-input>
            </el-form-item>
            <MachinerySelectSingle ref="machinerySelect" @onSelected="onMachineryAdd"></MachinerySelectSingle>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider v-if="form.id != null" content-position="center">物料信息</el-divider>
      <el-card shadow="always" v-if="form.id != null" class="box-card">
        <Issueline ref="line" :issueId="form.id" :warehouseId="form.warehouseId" :locationId="form.locationId" :areaId="form.areaId" :optType="optType"></Issueline>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view' || form.status != 'PREPARE'">返回</el-button>
        <el-button type="primary" @click="submitForm" v-if="form.status == 'PREPARE' && optType != 'view'">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="taskChanceOpen" width="75%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="领料单编号" prop="issueCode">
              <el-input disabled v-model="form.issueCode" placeholder="请输入领料单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch disabled v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view' && form.status == 'PREPARE'"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领料单名称" prop="issueName">
              <el-input disabled v-model="form.issueName" placeholder="请输入领料单名称" :disabled="optType !== 'add'"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="任务信息" prop="taskCode">
              <el-input v-model="form.taskCode" placeholder="请选择任务信息" disabled>
                <el-button disabled slot="append" icon="el-icon-search" ></el-button>
              </el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view' || form.status != 'PREPARE'">返回</el-button>
        <el-button type="primary" @click="submitForm" v-if="form.status == 'PREPARE' && optType != 'view'">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 摄像头预览弹出框 -->
    <el-dialog title="摄像头预览" :visible.sync="cameraPreviewVisible" width="50%" v-dialogDrag append-to-body>
      <div>
        <video ref="videoCameraPreview" autoplay playsinline style="width: 100%; height: auto;"></video>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cameraPreviewVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {listIssueheader, getIssueheader, delIssueheader, addIssueheader, updateIssueheader, updateIssueMachinery, execute, finshIssueHeader} from '@/api/mes/wm/issueheader';
import WorkstationSelect from '@/components/workstationSelect/simpletableSingle.vue';
import WorkorderSelect from '@/components/workorderSelect/single.vue';
import TaskSelectSingle from "@/components/TaskSelect/taskSelectSingle.vue";
import {getTreeList} from '@/api/mes/wm/warehouse';
import {genCode} from '@/api/mes/autocode/rule';
import Issueline from './line.vue';
import {deleteGoods, getStockInfoByPurchaseId} from "@/api/purchase/goods";
import {createFeedLine, getByIssueId, createFeedLineList, createFeedLineListByIssueId} from "@/api/wms/feedLine";
import jsQR from "jsqr";
import MachinerySelectSingle from '@/components/machinerySelect/single.vue';
import {listProcess} from '@/api/mes/pro/process';
import ProtaskSelect from "@/components/TaskSelect/taskSelectSingle.vue";
import {finshAllocatedHeader} from "@/api/wms/allocatedHeader";


export default {
  name: 'Issue',
  dicts: ['mes_order_status'],
  components: {ProtaskSelect, MachinerySelectSingle, Issueline, WorkstationSelect, WorkorderSelect, TaskSelectSingle},
  data() {
    return {
      autoGenFlag: false,
      optType: undefined,
      warehouseInfo: [],
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
      },
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
      // 生产领料单头表格数据
      issueheaderList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      taskChanceOpen: false,
      feedingOpen: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        issueCode: null,
        issueName: null,
        workstationId: null,
        workstationCode: null,
        workorderId: null,
        workorderCode: null,
        taskId: null,
        taskCode: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        issueDate: null,
        status: null,
      },
      // 表单参数
      form: {
        machineryCode: null,
        machineryName: null,
        machineryId: null,
      },
      // 表单校验
      rules: {
        issueCode: [{required: true, message: '领料单编号不能为空', trigger: 'blur'}],
        issueDate: [{required: true, message: '请指定领出日期', trigger: 'blur'}],
        workorderCode: [{required: true, message: '请指定生产工单', trigger: 'blur'}],
        workorderId: [{required: true, message: '请指定生产工单', trigger: 'blur'}],
        /* taskName: [{required: true, message: '请指定生产任务', trigger: 'blur'}],
         machineryName: [{required: true, message: '请选择设备信息', trigger: 'blur'}],*/
      },
      //摄像头配置
      targetCameraId: null,
      videoWidth: 640,
      videoHeight: 480,
      cameraPreviewVisible: false, // 控制摄像头弹出框
      scanResult: '', // 存储扫描结果
      purchaseId: '', // 采购单ID
      feedLineList: [], // 上料明细数据
      processOptions: [], // 工序选项
      preventingWatch: false, // 防止重复监听
      cachedProcessCode: null // 缓存工序编码
    };
  },
  created() {
    // 从 localStorage 恢复
    this.queryParams.processCode = this.cachedProcessCode = localStorage.getItem('cachedProcessCode');
    console.log("读取缓存: ", this.queryParams.processCode  , this.cachedProcessCode);
    this.getList();
    this.getWarehouseList();
    // 初始化工序选项
    this.processOptions = [];
    listProcess().then(response => {
      this.processOptions = response.data.list;
      console.log(this.processOptions)
    });

  },
  watch: {
    cameraPreviewVisible(newVal) {
      if (!newVal) {
        this.stopScanning();
      }
    },
    // 监听设备变更
    /*'form.machineryCode': {
      handler(newVal) {
        if(!newVal){
          return;
        }
        if (this.preventingWatch) {
          return;
        }
        if (this.optType === 'edit') {
          this.form.machineryCode = newVal;
          updateIssueMachinery(this.form).then(response => {
            this.$message.success('设备信息修改成功');
          }).catch(error => {
            console.error('设备信息修改失败:', error);
            this.$message.error('设备信息修改失败');
          });
        }
      }
    }*/
  },
  methods: {
    /** 查询生产领料单头列表 */
    getList() {
      this.loading = true;
      listIssueheader(this.queryParams).then(response => {
        console.log(response.data)
        this.issueheaderList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    getWarehouseList() {
      getTreeList().then(response => {
        this.warehouseOptions = response.data;
        // 如果是新增页面，并且warehouseInfo是空数组，自动设置默认值
        if (this.optType === 'add' && this.warehouseInfo.length === 0 && this.warehouseOptions.length > 0) {
          this.warehouseInfo = [this.warehouseOptions[0].value, this.warehouseOptions[0].children[0].value, this.warehouseOptions[0].children[0].children[0].value];
        }
      });
    },
    // 取消按钮
    cancel() {
      this.preventingWatch = true; // 禁用watch
      this.open = false;
      this.taskChanceOpen = false;
      this.reset();
      this.preventingWatch = false; // 启用watch
    },
    feedCancel() {
      this.feedingOpen = false;
      this.reset();
    },
    // 表单重置
    /** 表单重置 */
    reset() {
      this.form = {
        id: null,
        issueCode: null,
        issueName: null,
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        workorderId: null,
        workorderCode: null,
        workorderName: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        taskId: null,
        taskCode: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        issueDate: null,
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
        machineryName: null,
        machineryCode: null,
        machineryId: null,
      };
      this.warehouseInfo = []; // 重置领料仓库信息
      this.autoGenFlag = false;
      this.resetForm('form');
      this.preventingWatch = false; // 启用watch
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
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.warehouseInfo = [];
      this.title = '添加生产领料单';
      this.optType = 'add';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getIssueheader(id).then(response => {
        this.form = response.data;
        console.log(this.form)
        // 设置领料仓库信息
        this.warehouseInfo = [
          response.data.warehouseId,
          response.data.locationId,
          response.data.areaId
        ];
        this.open = true;
        this.title = "修改生产领料单";
        this.optType = 'edit';
        this.preventingWatch = false; // 启用watch
      });
    },
    // 查询明细按钮操作
    handleView(row) {
      this.reset();
      const issueIds = row.id;
      getIssueheader(issueIds).then(response => {
        this.form = response.data;
        // 设置领料仓库信息
        this.warehouseInfo = [
          response.data.warehouseId,
          response.data.locationId,
          response.data.areaId
        ];
        /*this.warehouseInfo[0] = response.data.warehouseId;
        this.warehouseInfo[1] = response.data.locationId;
        this.warehouseInfo[2] = response.data.areaId;*/
        this.open = true;
        this.title = '查看领料单信息';
        this.optType = 'view';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            console.log(this.form)
            if (this.form.taskCode == null || this.form.taskCode == undefined || this.form.taskCode == '') {
              this.$modal.msgError('请选择生产任务');
              return;
            }
            /*if (this.form.machineryName == null || this.form.machineryName == undefined || this.form.machineryName == '') {
              this.$modal.msgError('请选择生产设备');
              return;
            }*/
            updateIssueheader(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addIssueheader(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    //执行出库
    handleExecute(row) {
      const issueIds = row.id || this.ids;
      this.$modal
        .confirm('确认执行出库？')
        .then(function () {
          return execute(issueIds); //执行入库
        })
        .then(() => {
          /*// 追加上料记录
          createFeedLineListByIssueId(issueIds).then(response => {
            console.log(response.data);
          });*/
          this.getList();
          this.$modal.msgSuccess('出库成功');
        })
        .catch(() => {
        });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除编号为"' + id + '"的数据项?')
        .then(function () {
          return delIssueheader(id);
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
        'wm/issueheader/export',
        {
          ...this.queryParams,
        },
        `issueheader_${new Date().getTime()}.xlsx`,
      );
    },
    //选择默认的仓库、库区、库位
    handleWarehouseChanged(obj) {
      if (obj !== null) {
        this.form.warehouseId = obj[0]; // 仓库
        this.form.locationId = obj[1]; // 库区
        this.form.areaId = obj[2]; // 库位
      } else {
        this.form.warehouseId = null;
        this.form.locationId = null;
        this.form.areaId = null;
      }
    },
    //选择工作站
    handleWorkstationSelect() {
      this.$refs.wsSelect.showFlag = true;
    },
    onWorkstationSelected(row) {
      if (row != undefined && row != null) {
        this.form.workstationId = row.id;
        this.form.workstationCode = row.workstationCode;
        this.form.workstationName = row.workstationName;
        this.form.requestDate = row.requestDate;
        this.$refs.form.validateField('workstationName')
      }
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
        this.form.clientId = row.clientId;
        this.form.clientCode = row.clientCode;
        this.form.clientName = row.clientName;
      }
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        this.loading = true;
        genCode('ISSUE_CODE').then(response => {
          this.form.issueCode = response;
          this.loading = false;
        });
      } else {
        this.form.issueCode = null;
      }
    },
    // 开始进行扫码上料
    handleFeeding(row) {
      // 根据当前选中的Id获取对于数据
      const issueId = row.id || this.ids;
      /* if (!issueId) {
         this.$modal.msgError('请先选择领料单');
         return;
       }
       console.log("选中行状态: " + row.status);
       if (row.status != 'CONFIRMED') {
         this.$modal.msgError('请先确认领料单');
         return;
       }*/
      getIssueheader(issueId).then(response => {
        this.form = response.data;
        console.log(this.form);
        this.warehouseInfo[0] = response.data.warehouseId;
        this.warehouseInfo[1] = response.data.locationId;
        this.warehouseInfo[2] = response.data.areaId;
      });
      getByIssueId(issueId).then(response => {
        this.feedLineList = response.data; // 获取到数据
        this.feedingOpen = true;
        this.title = '扫码上料';
        this.optType = 'edit';
      });
    },
    handleTaskSelect() {
      this.$refs.taskSelect.showFlag = true;
      this.$refs.taskSelect.getList();
    },
    onTaskSelected(row) {
      console.log(row)
      if (row != undefined && row != null) {
        this.form.taskName = row.taskName;
        this.form.taskCode = row.taskCode;
        this.form.taskId = row.id;
        this.form.processCode = row.processCode;
        this.form.processId = row.processId;
        this.form.workstationCode = row.workstationCode;
        this.form.workstationId = row.workstationId;
        this.form.workstationName = row.workstationName;
        console.log(this.form)
      }
    },
    handleFeedDelete() {
      const ids = this.ids;
      this.feedLineList = this.feedLineList.filter(item => {
        return !ids.includes(item.id) || item.status === 'Y';
      });
    },
    // 完成扫码上料
    feedSubmitForm() {
      let finList = [];
      let obj = {};
      if (!this.form.workstationId) {
        this.$message.error(`请选择任务单!`);
      }
      for (let i = 0; i < this.feedLineList.length; i++) {
        if (this.feedLineList[i].status == 'Y') {
          return;
        }
        obj.issueId = this.form.id;
        obj.workorderCode = this.form.workorderCode;
        obj.taskCode = this.form.taskCode;
        obj.taskName = this.form.taskName;
        obj.processCode = this.form.processCode;
        obj.processId = this.form.processId;
        obj.workstationCode = this.form.workstationCode;
        obj.workstationId = this.form.workstationId;
        obj.workstationName = this.form.workstationName;
        obj.materialStockId = this.feedLineList[i].id;
        obj.itemId = this.feedLineList[i].itemId;
        obj.itemCode = this.feedLineList[i].itemCode;
        obj.itemName = this.feedLineList[i].itemName;
        obj.specification = this.feedLineList[i].specification;
        obj.unitOfMeasure = this.feedLineList[i].unitOfMeasure;
        obj.quantity = this.feedLineList[i].quantityIssued;
        obj.batchCode = this.feedLineList[i].batchCode;
        obj.warehouseId = this.feedLineList[i].warehouseId;
        obj.warehouseName = this.form.warehouseName;
        obj.warehouseCode = this.feedLineList[i].warehouseCode;
        obj.locationId = this.feedLineList[i].locationId;
        obj.locationCode = this.feedLineList[i].locationCode;
        obj.locationName = this.feedLineList[i].locationName;
        obj.areaId = this.feedLineList[i].areaId;
        obj.areaCode = this.feedLineList[i].areaCode;
        obj.areaName = this.feedLineList[i].areaName;
        obj.machineryName = this.feedLineList[i].machineryName;
        obj.machineryCode = this.feedLineList[i].machineryCode;
        obj.machineryId = this.feedLineList[i].machineryId;
        obj.barcodeNumber = this.feedLineList[i].barcodeNumber;
        finList.push(obj);
      }
      console.log("上料详情数据: " , finList);
      createFeedLineList(finList).then(response => {
        this.$modal.msgSuccess("上料成功");
        this.feedingOpen = false;
        this.getList();
      });
    },
    /*handleMachineryAdd() {
      this.$refs.machinerySelect.showFlag = true;
    },
    //设备资源选择回调
    onMachineryAdd(rows) {
      if (rows != undefined && rows != null) {
        this.form.machineryCode = rows.machineryCode;
        this.form.machineryName = rows.machineryName;
        this.form.machineryId = rows.id;
        console.log(this.form.machineryName);
        console.log(this.form.machineryCode);
      }
    },*/
    handleRowClick(row) {
      // 切换行的选中状态
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleFinsh(row){
      this.reset();
      const ids = row.id || this.ids;
      this.loading = true;
      // 完成
      finshIssueHeader(ids).then(response => {
        this.$modal.msgSuccess("成功");
        this.open = false;
        this.loading = false;
        this.getList();
      });
    },
    handleProcessChange(val) {
      console.log("触发缓存: ", val);
      if (val) {
        localStorage.setItem('cachedProcessCode', val);
        this.cachedProcessCode = val;
      } else {
        localStorage.removeItem('cachedProcessCode');
        this.cachedProcessCode = null;
      }
    },
    handleChanceTask(){
      this.reset();
      this.taskChanceOpen = true;
      this.title = '修改任务单';
    },
  },
  activated() {
    // 当从缓存中重新激活组件时，可以在此更新数据
    this.getList();
  }
};
</script>
