<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="任务编号" prop="taskCode">
        <el-input v-model="queryParams.taskCode" placeholder="请输入任务编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="queryParams.taskName" placeholder="请输入任务名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="生产工单ID" prop="workorderId">
        <el-input v-model="queryParams.workorderId" placeholder="请输入生产工单ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="生产工单编号" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入生产工单编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工单名称" prop="workorderName">
        <el-input v-model="queryParams.workorderName" placeholder="请输入工单名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工作站ID" prop="workstationId">
        <el-input v-model="queryParams.workstationId" placeholder="请输入工作站ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工作站编号" prop="workstationCode">
        <el-input v-model="queryParams.workstationCode" placeholder="请输入工作站编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工作站名称" prop="workstationName">
        <el-input v-model="queryParams.workstationName" placeholder="请输入工作站名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工序ID" prop="processId">
        <el-input v-model="queryParams.processId" placeholder="请输入工序ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工序编码" prop="processCode">
        <el-input v-model="queryParams.processCode" placeholder="请输入工序编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工序名称" prop="processName">
        <el-input v-model="queryParams.processName" placeholder="请输入工序名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="产品物料ID" prop="itemId">
        <el-input v-model="queryParams.itemId" placeholder="请输入产品物料ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="产品物料编码" prop="itemCode">
        <el-input v-model="queryParams.itemCode" placeholder="请输入产品物料编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="产品物料名称" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入产品物料名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="规格型号" prop="specification">
        <el-input v-model="queryParams.specification" placeholder="请输入规格型号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="单位" prop="unitOfMeasure">
        <el-input v-model="queryParams.unitOfMeasure" placeholder="请输入单位" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="排产数量" prop="quantity">
        <el-input v-model="queryParams.quantity" placeholder="请输入排产数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="已生产数量" prop="quantityProduced">
        <el-input v-model="queryParams.quantityProduced" placeholder="请输入已生产数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="合格品数量" prop="quantityQuanlify">
        <el-input v-model="queryParams.quantityQuanlify" placeholder="请输入合格品数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="不良品数量" prop="quantityUnquanlify">
        <el-input v-model="queryParams.quantityUnquanlify" placeholder="请输入不良品数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="调整数量" prop="quantityChanged">
        <el-input v-model="queryParams.quantityChanged" placeholder="请输入调整数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户ID" prop="clientId">
        <el-input v-model="queryParams.clientId" placeholder="请输入客户ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户编码" prop="clientCode">
        <el-input v-model="queryParams.clientCode" placeholder="请输入客户编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户名称" prop="clientName">
        <el-input v-model="queryParams.clientName" placeholder="请输入客户名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户简称" prop="clientNick">
        <el-input v-model="queryParams.clientNick" placeholder="请输入客户简称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="开始生产时间" prop="startTime">
        <el-date-picker v-model="queryParams.startTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="生产时长" prop="duration">
        <el-input v-model="queryParams.duration" placeholder="请输入生产时长" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="完成生产时间" prop="endTime">
        <el-date-picker v-model="queryParams.endTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="甘特图显示颜色" prop="colorCode">
        <el-input v-model="queryParams.colorCode" placeholder="请输入甘特图显示颜色" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="需求日期" prop="requestDate">
        <el-date-picker v-model="queryParams.requestDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="生产状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择生产状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="queryParams.remark" placeholder="请输入备注" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="预留字段1" prop="attr1">
        <el-input v-model="queryParams.attr1" placeholder="请输入预留字段1" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="预留字段2" prop="attr2">
        <el-input v-model="queryParams.attr2" placeholder="请输入预留字段2" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="预留字段3" prop="attr3">
        <el-input v-model="queryParams.attr3" placeholder="请输入预留字段3" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="预留字段4" prop="attr4">
        <el-input v-model="queryParams.attr4" placeholder="请输入预留字段4" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="任务ID" align="center" prop="id" />
      <el-table-column label="任务编号" align="center" prop="taskCode" />
      <el-table-column label="任务名称" align="center" prop="taskName" />
      <el-table-column label="生产工单ID" align="center" prop="workorderId" />
      <el-table-column label="生产工单编号" align="center" prop="workorderCode" />
      <el-table-column label="工单名称" align="center" prop="workorderName" />
      <el-table-column label="工作站ID" align="center" prop="workstationId" />
      <el-table-column label="工作站编号" align="center" prop="workstationCode" />
      <el-table-column label="工作站名称" align="center" prop="workstationName" />
      <el-table-column label="工序ID" align="center" prop="processId" />
      <el-table-column label="工序编码" align="center" prop="processCode" />
      <el-table-column label="工序名称" align="center" prop="processName" />
      <el-table-column label="产品物料ID" align="center" prop="itemId" />
      <el-table-column label="产品物料编码" align="center" prop="itemCode" />
      <el-table-column label="产品物料名称" align="center" prop="itemName" />
      <el-table-column label="规格型号" align="center" prop="specification" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="排产数量" align="center" prop="quantity" />
      <el-table-column label="已生产数量" align="center" prop="quantityProduced" />
      <el-table-column label="合格品数量" align="center" prop="quantityQuanlify" />
      <el-table-column label="不良品数量" align="center" prop="quantityUnquanlify" />
      <el-table-column label="调整数量" align="center" prop="quantityChanged" />
      <el-table-column label="客户ID" align="center" prop="clientId" />
      <el-table-column label="客户编码" align="center" prop="clientCode" />
      <el-table-column label="客户名称" align="center" prop="clientName" />
      <el-table-column label="客户简称" align="center" prop="clientNick" />
      <el-table-column label="开始生产时间" align="center" prop="startTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产时长" align="center" prop="duration" />
      <el-table-column label="完成生产时间" align="center" prop="endTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="甘特图显示颜色" align="center" prop="colorCode" />
      <el-table-column label="需求日期" align="center" prop="requestDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.requestDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产状态" align="center" prop="status" />
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
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pro:task:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pro:task:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="任务编号" prop="taskCode">
          <el-input v-model="form.taskCode" placeholder="请输入任务编号" />
        </el-form-item>
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="生产工单ID" prop="workorderId">
          <el-input v-model="form.workorderId" placeholder="请输入生产工单ID" />
        </el-form-item>
        <el-form-item label="生产工单编号" prop="workorderCode">
          <el-input v-model="form.workorderCode" placeholder="请输入生产工单编号" />
        </el-form-item>
        <el-form-item label="工单名称" prop="workorderName">
          <el-input v-model="form.workorderName" placeholder="请输入工单名称" />
        </el-form-item>
        <el-form-item label="工作站ID" prop="workstationId">
          <el-input v-model="form.workstationId" placeholder="请输入工作站ID" />
        </el-form-item>
        <el-form-item label="工作站编号" prop="workstationCode">
          <el-input v-model="form.workstationCode" placeholder="请输入工作站编号" />
        </el-form-item>
        <el-form-item label="工作站名称" prop="workstationName">
          <el-input v-model="form.workstationName" placeholder="请输入工作站名称" />
        </el-form-item>
        <el-form-item label="工序ID" prop="processId">
          <el-input v-model="form.processId" placeholder="请输入工序ID" />
        </el-form-item>
        <el-form-item label="工序编码" prop="processCode">
          <el-input v-model="form.processCode" placeholder="请输入工序编码" />
        </el-form-item>
        <el-form-item label="工序名称" prop="processName">
          <el-input v-model="form.processName" placeholder="请输入工序名称" />
        </el-form-item>
        <el-form-item label="产品物料ID" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入产品物料ID" />
        </el-form-item>
        <el-form-item label="产品物料编码" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="请输入产品物料编码" />
        </el-form-item>
        <el-form-item label="产品物料名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入产品物料名称" />
        </el-form-item>
        <el-form-item label="规格型号" prop="specification">
          <el-input v-model="form.specification" placeholder="请输入规格型号" />
        </el-form-item>
        <el-form-item label="单位" prop="unitOfMeasure">
          <el-input v-model="form.unitOfMeasure" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="排产数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入排产数量" />
        </el-form-item>
        <el-form-item label="已生产数量" prop="quantityProduced">
          <el-input v-model="form.quantityProduced" placeholder="请输入已生产数量" />
        </el-form-item>
        <el-form-item label="合格品数量" prop="quantityQuanlify">
          <el-input v-model="form.quantityQuanlify" placeholder="请输入合格品数量" />
        </el-form-item>
        <el-form-item label="不良品数量" prop="quantityUnquanlify">
          <el-input v-model="form.quantityUnquanlify" placeholder="请输入不良品数量" />
        </el-form-item>
        <el-form-item label="调整数量" prop="quantityChanged">
          <el-input v-model="form.quantityChanged" placeholder="请输入调整数量" />
        </el-form-item>
        <el-form-item label="客户ID" prop="clientId">
          <el-input v-model="form.clientId" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="客户编码" prop="clientCode">
          <el-input v-model="form.clientCode" placeholder="请输入客户编码" />
        </el-form-item>
        <el-form-item label="客户名称" prop="clientName">
          <el-input v-model="form.clientName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="客户简称" prop="clientNick">
          <el-input v-model="form.clientNick" placeholder="请输入客户简称" />
        </el-form-item>
        <el-form-item label="开始生产时间" prop="startTime">
          <el-date-picker clearable v-model="form.startTime" type="date" value-format="timestamp" placeholder="选择开始生产时间" />
        </el-form-item>
        <el-form-item label="生产时长" prop="duration">
          <el-input v-model="form.duration" placeholder="请输入生产时长" />
        </el-form-item>
        <el-form-item label="完成生产时间" prop="endTime">
          <el-date-picker clearable v-model="form.endTime" type="date" value-format="timestamp" placeholder="选择完成生产时间" />
        </el-form-item>
        <el-form-item label="甘特图显示颜色" prop="colorCode">
          <el-input v-model="form.colorCode" placeholder="请输入甘特图显示颜色" />
        </el-form-item>
        <el-form-item label="需求日期" prop="requestDate">
          <el-date-picker clearable v-model="form.requestDate" type="date" value-format="timestamp" placeholder="选择需求日期" />
        </el-form-item>
        <el-form-item label="生产状态" prop="status">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createTask, updateTask, deleteTask, getTask, getTaskPage, exportTaskExcel } from '@/api/mes/pro/protask';

export default {
  name: 'Task',
  components: {},
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
      // 生产任务列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        taskCode: [{ required: true, message: '任务编号不能为空', trigger: 'blur' }],
        taskName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
        workorderId: [{ required: true, message: '生产工单ID不能为空', trigger: 'blur' }],
        workorderCode: [{ required: true, message: '生产工单编号不能为空', trigger: 'blur' }],
        workorderName: [{ required: true, message: '工单名称不能为空', trigger: 'blur' }],
        workstationId: [{ required: true, message: '工作站ID不能为空', trigger: 'blur' }],
        workstationCode: [{ required: true, message: '工作站编号不能为空', trigger: 'blur' }],
        workstationName: [{ required: true, message: '工作站名称不能为空', trigger: 'blur' }],
        processId: [{ required: true, message: '工序ID不能为空', trigger: 'blur' }],
        itemId: [{ required: true, message: '产品物料ID不能为空', trigger: 'blur' }],
        itemCode: [{ required: true, message: '产品物料编码不能为空', trigger: 'blur' }],
        itemName: [{ required: true, message: '产品物料名称不能为空', trigger: 'blur' }],
        unitOfMeasure: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
        quantity: [{ required: true, message: '排产数量不能为空', trigger: 'blur' }],
      },
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
      getTaskPage(this.queryParams).then(response => {
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
        createTask(this.form).then(response => {
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
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
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
        .catch(() => {});
    },
  },
};
</script>
