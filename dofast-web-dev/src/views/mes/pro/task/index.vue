<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="任务编号" prop="taskCode">
        <el-input v-model="queryParams.taskCode" placeholder="请输入任务编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="queryParams.taskName" placeholder="请输入任务名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产工单号" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入生产工单编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工作站名称" prop="workstationName">
        <el-input v-model="queryParams.workstationName" placeholder="请输入工作站名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="所属工序" prop="processId">
        <el-select v-model="queryParams.processId" placeholder="请选择工序">
          <el-option v-for="item in processOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="产品编码" prop="itemCode">
        <el-input v-model="queryParams.itemCode" placeholder="请输入产品物料编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>


      <!--      <el-form-item label="开始生产时间" prop="startTime">
              <el-date-picker v-model="queryParams.startTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
            </el-form-item>

            <el-form-item label="需求日期" prop="requestDate">
              <el-date-picker v-model="queryParams.requestDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
            </el-form-item>-->
      <el-form-item label="生产状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择生产状态" clearable size="small">
          <el-option v-for="dict in dict.type.mes_pro_task_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pro:task:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['pro:task:export']">导出</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-star-off" size="mini" :disabled="single" @click="handleSend" v-hasPermi="['pro:task:export']">派工</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" ref="multipleTable" @row-click="handleRowClick">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column fixed label="任务编号" min-width="150" align="center" prop="taskCode"/>
      <el-table-column label="任务名称" min-width="150" :show-overflow-tooltip="true" align="center" prop="taskName"/>
      <el-table-column label="生产工单号" min-width="150" :show-overflow-tooltip="true" align="center" prop="workorderCode"/>

      <el-table-column label="工单名称" min-width="150" align="center" prop="workorderName"/>
      <el-table-column label="工作站名称" min-width="150" align="center" prop="workstationName"/>
      <el-table-column label="工序名称" min-width="150" align="center" prop="processName"/>
      <el-table-column label="产品编码" min-width="150" align="center" prop="itemCode"/>
      <el-table-column label="产品名称" min-width="150" :show-overflow-tooltip="true" align="center" prop="itemName"/>
      <el-table-column label="排产数量" min-width="100" align="center" prop="quantity"/>
      <el-table-column label="单位" align="center" prop="unitOfMeasure"/>
      <el-table-column label="设备编号"  min-width="100" align="center" prop="machineryCode"/>
      <el-table-column label="设备名称"  min-width="120" align="center" prop="machineryName"/>
      <el-table-column label="已生产数量" min-width="100" align="center" prop="quantityProduced"/>
      <el-table-column label="合格品数量" min-width="100" align="center" prop="quantityQuanlify"/>
      <el-table-column label="不良品数量" min-width="100" align="center" prop="quantityUnquanlify"/>
      <el-table-column label="调整数量" min-width="100" align="center" prop="quantityChanged"/>
      <el-table-column label="客户名称" min-width="100" :show-overflow-tooltip="true" align="center" prop="clientName"/>
      <el-table-column label="开始生产时间" align="center" prop="startTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成生产时间" align="center" prop="endTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="需求日期" align="center" prop="requestDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.requestDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产状态" align="center" prop="status"/>
      <el-table-column fixed="right"  label="派工状态" align="center" prop="taskStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pro_task_status" :value="scope.row.taskStatus" />
        </template>
      </el-table-column>
      <el-table-column  width="150" fixed="right"  label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pro:task:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pro:task:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="1080px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input v-model="form.workorderCode" placeholder="请选择生产工单" disabled>
                <el-button slot="append" icon="el-icon-search" @click="handleWorkorderSelect"></el-button>
              </el-input>
            </el-form-item>
            <WorkorderSelect ref="woSelect" @onSelected="onWorkorderSelected"></WorkorderSelect>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称" prop="processName">
              <el-select v-model="form.processName" placeholder="请选择工序" @change="processChange">
                <el-option v-for="item in workOrderProcessOptions" :key="item.processCode" :label="item.processName" :value="item.processCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row :gutter="20">
          <el-col :span="12">

            <el-form-item label="工作站" prop="workstationName">
              <el-input v-model="form.workstationName" placeholder="请选择工作站" disabled>
                <el-button slot="append" icon="el-icon-search" @click="handleWorkstationSelect"></el-button>
              </el-input>
            </el-form-item>
            <WorkstationSelect ref="wsSelect" @onSelected="onWorkstationSelected">
            </WorkstationSelect>

          </el-col>

          <el-col :span="5">
            <el-form-item label="甘特图显示颜色" prop="colorCode">
              <el-color-picker v-model="form.colorCode"></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-input v-model="form.colorCode" maxlength="7" disabled placeholder="请输入颜色编码在左侧选择颜色"/>
          </el-col>


        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品编码" prop="itemCode">
              <!--              <el-input v-model="form.itemCode" readonly="readonly" placeholder="请选择产品编码">
                              <el-button slot="append" @click="handleSelectProduct" icon="el-icon-search"></el-button>
                            </el-input>-->
              <el-input v-model="form.itemCode" disabled placeholder="请输入产品编码"/>

            </el-form-item>
            <ItemSelect ref="itemSelect" @onSelected="onItemSelected"></ItemSelect>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品名称" prop="itemName">
              <el-input v-model="form.itemName" disabled placeholder="请输入产品物料名称"/>
            </el-form-item>
          </el-col>

        </el-row>


        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排产数量" prop="quantity">
              <el-input v-model="form.quantity" placeholder="请输入排产数量"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input v-model="form.unitOfMeasure" disabled placeholder="请输入单位"/>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户编码" prop="clientCode">
              <el-input v-model="form.clientCode" disabled placeholder="请输入客户编码"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="客户名称" prop="clientName">
              <el-input v-model="form.clientName" disabled placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker clearable v-model="form.startTime" @change="calculateEndTime" type="datetime"
                              value-format="timestamp" placeholder="请选择开始生产时间"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">

            <el-form-item label="生产时长" prop="duration">
              <el-input-number :min="1" :precision="0" :step="1" v-model="form.duration" @change="calculateEndTime"
                               placeholder="请输入生产时长"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="完成时间" prop="endTime">
              <el-date-picker clearable disabled v-model="form.endTime" type="datetime"
                              value-format="timestamp"></el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="20">


          <el-col :span="12">
            <el-form-item label="需求日期" prop="requestDate">
              <el-date-picker clearable v-model="form.requestDate" type="date" value-format="timestamp" placeholder="选择需求日期"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model="form.remark"
                placeholder="请输入备注"
                resizable
              />
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="title" :visible.sync="sendOpen" width="1080px" v-dialogDrag append-to-body>

      <el-form ref="sendForm" :model="sendForm" :rules="rules" label-width="120px">

        <el-divider>生产班组</el-divider>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="班组编号" prop="teamCode">
              <el-input v-model="sendForm.teamCode" placeholder="请选择班组" disabled>
                <el-button slot="append" icon="el-icon-search" @click="handleTeamSelect"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班组名称" prop="teamName">
              <el-input v-model="sendForm.teamName" disabled placeholder="请输入班组名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班组类型" prop="calendarType">
              <el-select v-model="sendForm.calendarType" disabled placeholder="请选择班组类型">
                <el-option v-for="dict in dict.type.mes_calendar_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="机台负责人" prop="principalName">
              <el-input v-model="sendForm.principalName" disabled placeholder="请输入机台负责人"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="设备列表">
              <el-select v-model="sendForm.machineryCodes" multiple placeholder="请选择">
                <el-option v-for="item in machineryCodesOptions" :key="item.machineryCode" :label="item.machineryName" :value="item.machineryCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendSubmitForm">确认派工</el-button>
        <el-button @click="sendCancel">取 消</el-button>
      </div>


    </el-dialog>


    <el-dialog :title="teamTitle" :visible.sync="teamOpen" width="800" v-dialogDrag append-to-body custom-class="my-dialog-class">
      <el-table :data="teamList">
        <el-table-column label="班组ID" width="80" align="center">
          <template slot-scope="scope">
            <el-radio
              v-model="selectedTeamId"
              :label="scope.row.id"
              @change="handleTeamRadioChange(scope.row)">
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="班组编号" align="center" prop="teamCode"/>
        <el-table-column label="班组名称" align="center" prop="teamName"/>
        <el-table-column label="班组类型" align="center" prop="calendarType">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.mes_calendar_type" :value="scope.row.calendarType"/>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="teamTotal > 0" :total="teamTotal" :page.sync="teamQueryParams.pageNo" :limit.sync="teamQueryParams.pageSize" @pagination="getTeamList"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="teamSubmitForm">确 定</el-button>
        <el-button @click="teamCancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {addProtask, updateTask, deleteTask, getTask, getTaskPage, listProtask, exportTaskExcel, updateTeamById} from '@/api/mes/pro/protask';
import {getListByProcessCode} from '@/api/mes/dv/machinery';
import {listAllProcess} from '@/api/mes/pro/process';
import WorkstationSelect from '@/components/workstationSelect/simpletableSingle.vue';
import WorkorderSelect from '@/components/workorderSelect/single.vue';
import {listProductprocess} from '@/api/mes/pro/routeprocess';
import ItemSelect from '@/components/itemSelect/single.vue';
import {listTeam, getTeam, delTeam, listAllTeam, addTeam, updateTeam} from '@/api/mes/cal/team';
import UserSingleSelect from '@/components/userSelect/single.vue';
import {listSimplePosts} from "@/api/system/post";

export default {
  name: 'Task',

  components: {UserSingleSelect, ItemSelect, WorkorderSelect, WorkstationSelect},

  dicts: ['pro_task_status', 'mes_calendar_type'], // 生产任务状态字典
  data() {
    return {
      // 遮罩层
      loading: true,
      teamLoading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 班组总条数
      teamTotal: 0,
      // 生产任务列表
      list: [],
      // 班组列表
      teamList: [],
      // 弹出层标题
      title: '',
      sendTitle: '',
      teamTitle: '',
      // 是否显示弹出层
      open: false,
      sendOpen: false,
      teamOpen: false,
      // 选中数组
      ids: [],
      selectedTeamId: null,
      selectedTeamDetails: [], // 存储选中的班组详细信息
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 查询参数
      queryParams: {
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
        createTime: [],
      },
      teamQueryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      sendForm: {},
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
      //工序选项
      processOptions: [],
      workOrderProcessOptions: [],
      // 行选中项
      selectionObj: {},
      // 设备选项
      machineryCodesOptions: [],
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
      listProtask(this.queryParams).then(response => {
        console.log(response.data.list);
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
      this.resetForm('form');
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
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加生产任务';
    },
    /*** 派工按钮操作 */
    async handleSend(row) {
      this.sendTitle = '派工';
      console.log("当前选中行: " , this.selectionObj[0]);
      this.getTreeselect(this.selectionObj[0].processCode);
      if (this.selectionObj[0].attr1) {
       await listTeam({teamCode: this.selectionObj[0].attr1}).then(response => {
          console.log("当前返回信息: " , response);
          if (response.data.list) {
            const teamInfo = response.data.list[0];
            console.log(teamInfo);
            this.sendForm.teamCode = teamInfo.teamCode;
            this.sendForm.teamName = teamInfo.teamName;
            this.sendForm.calendarType = teamInfo.calendarType;
            this.sendForm.principalName = teamInfo.principalName;
            if(this.selectionObj[0].machineryCodes){
              const machineryCodesString = this.selectionObj[0].machineryCodes.replace("[", '').replace("]", '').replace(/\s*/g,''); // 清理字符
              if (machineryCodesString) {
                this.sendForm.machineryCodes = machineryCodesString.split(',').map(String); // 转换为数组
              }
            }
          }
        }).catch(error => {
          console.error('获取班组信息失败:', error);
        });
      } else {
        this.sendForm = {
          taskId: null,
          teamId: null,
          teamCode: null,
          teamName: null,
          principalName: null,
        };
      }
      this.sendOpen = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getTask(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改生产任务';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateTask(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        addProtask(this.form).then(response => {
          this.$modal.msgSuccess('新增成功');
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal
        .confirm('是否确认删除生产任务编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteTask(id);
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
      // 处理查询参数
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm('是否确认导出所有生产任务数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportTaskExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '生产任务.xls');
          this.exportLoading = false;
        })
        .catch(() => {
        });
    },
    //查询工序信息
    getProcess() {
      listAllProcess().then(response => {
        this.processOptions = response.data;
      });
    },
    // 弹出工作站选择框
    handleWorkstationSelect() {
      this.$refs.wsSelect.showFlag = true;
    },
    // 回显工作站信息
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
        this.form.clientNick = row.clientNick;
        this.form.itemCode = row.productCode; // 产品编码
        this.form.itemName = row.productName; // 产品名称
        this.form.specification = row.specification; // 规格
        this.form.unitOfMeasure = row.unitOfMeasure; // 单位
        this.form.quantity = row.quantity; // 需求数量
      }
      // 基于当前工单, 获取其工单下的所有工序信息, 并展示在工序下拉框中
      listProductprocess(this.form.workorderId).then(response => {
        console.log(response.data);
        this.workOrderProcessOptions = response.data;
      });
    },
    processChange(value) {
      // TODO: 根据当前的工序ID初始化当前任务的工序名称, 工序编码
      const selectedProcess = this.workOrderProcessOptions.find(item => item.processCode === value);
      if (selectedProcess) {
        this.form.processName = selectedProcess.processName;
        this.form.processCode = selectedProcess.processCode;
        this.form.processId = selectedProcess.id;
      }
    },
    // 弹出物料选择框
    handleSelectProduct() {
      this.$refs.itemSelect.showFlag = true;
    },
    //物料选择弹出框
    onItemSelected(obj) {
      if (obj != undefined && obj != null) {
        this.form.itemId = obj.id;
        this.form.itemCode = obj.itemCode;
        this.form.itemName = obj.itemName;
        this.form.specification = obj.specification;
        this.form.unitOfMeasure = obj.unitOfMeasure;
      }
    },
    //计算结束时间
    calculateEndTime(i) {
      if (this.form.startTime) {
        this.form.endTime = this.form.startTime + 3600000 * this.form.duration;
      }
      return;
      if (this.form.startTime != null && this.form.duration != null) {
        let parts = this.form.startTime.split(' ');
        let startDate = new Date(parts[0]);
        startDate = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate() + ' ' + parts[1].split(':')[0] + ':' + '00' + ':' + '00';
        this.form.startTime = startDate;
        startDate = Date.parse(new Date(startDate)) / 1000;
        // console.log(startDate)
        this.startTime = startDate
        startDate += 3600 * 8 * this.form.duration; //这里以8小时为一个单位
        let endDate = new Date(parseInt(startDate) * 1000);
        this.form.endTime = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate() + ' ' + endDate.getHours() + ':' + endDate.getMinutes() + ':' + endDate.getSeconds();
        // console.log(startDate);
        this.endTime = startDate
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectionObj = selection; // 选中项
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 弹出班组选择框
    handleTeamSelect() {
      this.teamOpen = true;
      this.teamTitle = '班组信息';
      this.getTeamList();
    },
    getTeamList() {
      // 获取班组信息
      this.teamLoading = true;
      listTeam(this.teamQueryParams).then(response => {
        this.teamList = response.data.list;
        this.teamTotal = response.data.total;
        this.teamLoading = false;
      });
    },
    handleTeamRadioChange(row) {
      this.selectedTeamDetails = [row]; // 更新选中的班组详细信息为当前选中的行
    },
    teamSubmitForm() {
      if (this.selectedTeamDetails.length > 0) {
        // 将选中的班组详细信息赋值给 sendForm 对象
        const team = this.selectedTeamDetails[0];
        this.sendForm.teamId = team.id;
        this.sendForm.teamCode = team.teamCode;
        this.sendForm.teamName = team.teamName;
        this.sendForm.principalName = team.principalName;
        this.sendForm.calendarType = team.calendarType;
        // 关闭班组选择对话框
        this.teamOpen = false;
      } else {
        this.$message.warning('请选择一个班组');
      }
    },
    teamCancel() {
      // 关闭班组选择对话框
      this.teamOpen = false;
    },
    // 提交派工
    sendSubmitForm() {
      // 修改当前单据状态
      console.log(this.sendForm);
      this.sendForm.taskId = this.ids[0];
      updateTeamById(this.sendForm).then(response => {
        this.$message.success('派工成功');
        this.sendOpen = false;
        this.getList();
        // 清空派工弹出框数据
        this.sendForm = {
          taskId: null,
          teamId: null,
          teamCode: null,
          teamName: null,
          principalName: null,
        };
      });

    },
    //取消派工
    sendCancel() {
      this.sendOpen = false;
      this.sendForm = {
        taskId: null,
        teamId: null,
        teamCode: null,
        teamName: null,
        principalName: null,
      };
      this.getList();
      this.machineryCodesOptions = [];
    },
    handleRowClick(row) {
      // 切换行的选中状态
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleMachineryCodesChange(row){
      console.log('row.machineryCodes');
    },
    getTreeselect(processCode) {
      getListByProcessCode({"processCode":processCode}).then(response => {
        // 处理 postOptions 参数
        this.machineryCodesOptions = [];
        this.machineryCodesOptions.push(...response.data);
      });
    },

  },
};
</script>
<style>
.my-dialog-class {
  margin: 0 auto; /* 居中显示 */
  position: fixed; /* 或 absolute，根据您的布局需求 */
  left: 50%;
  transform: translateX(-50%);
}
</style>
