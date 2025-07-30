<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="报工单编号" prop="feedbackCode">
        <el-input v-model="queryParams.feedbackCode" placeholder="请输入报工单编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工作站ID" prop="workstationId">
        <el-input v-model="queryParams.workstationId" placeholder="请输入工作站ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工作站编号" prop="workstationCode">
        <el-input v-model="queryParams.workstationCode" placeholder="请输入工作站编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工作站名称" prop="workstationName">
        <el-input v-model="queryParams.workstationName" placeholder="请输入工作站名称" clearable @keyup.enter.native="handleQuery"/>
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
      <el-form-item label="工序编码" prop="processCode">
        <el-input v-model="queryParams.processCode" placeholder="请输入工序编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工序名称" prop="processName">
        <el-input v-model="queryParams.processName" placeholder="请输入工序名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产任务ID" prop="taskId">
        <el-input v-model="queryParams.taskId" placeholder="请输入生产任务ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产任务编号" prop="taskCode">
        <el-input v-model="queryParams.taskCode" placeholder="请输入生产任务编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="产品物料ID" prop="itemId">
        <el-input v-model="queryParams.itemId" placeholder="请输入产品物料ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="产品物料编码" prop="itemCode">
        <el-input v-model="queryParams.itemCode" placeholder="请输入产品物料编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="产品物料名称" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入产品物料名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="单位" prop="unitOfMeasure">
        <el-input v-model="queryParams.unitOfMeasure" placeholder="请输入单位" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="规格型号" prop="specification">
        <el-input v-model="queryParams.specification" placeholder="请输入规格型号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="本次报工数量" prop="quantityFeedback">
        <el-input v-model="queryParams.quantityFeedback" placeholder="请输入本次报工数量" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="合格品数量" prop="quantityQualified">
        <el-input v-model="queryParams.quantityQualified" placeholder="请输入合格品数量" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="不良品数量" prop="quantityUnquanlified">
        <el-input v-model="queryParams.quantityUnquanlified" placeholder="请输入不良品数量" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="报工用户名" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入报工用户名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入昵称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="批次号" prop="batchCode">
        <el-input v-model="queryParams.batchCode" placeholder="请输入批次号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="ERP批次号" prop="erpBatchCode">
        <el-input v-model="queryParams.erpBatchCode" placeholder="请输入ERP批次号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产设备名称" prop="machineryName">
        <el-input v-model="queryParams.machineryName" placeholder="请输入生产设备名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产设备编码" prop="machineryCode">
        <el-input v-model="queryParams.machineryCode" placeholder="请输入生产设备编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产设备ID" prop="machineryId">
        <el-input v-model="queryParams.machineryId" placeholder="请输入生产设备ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="ERP报工单(用于撤销)" prop="erpFeedback">
        <el-input v-model="queryParams.erpFeedback" placeholder="请输入ERP报工单(用于撤销)" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="ERP报工标识" prop="erpFeedbackStatus">
        <el-select v-model="queryParams.erpFeedbackStatus" placeholder="请选择ERP报工标识" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="ERP入库标识" prop="erpWarehousingStatus">
        <el-select v-model="queryParams.erpWarehousingStatus" placeholder="请选择ERP入库标识" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="转换数量" prop="conversionQuantity">
        <el-input v-model="queryParams.conversionQuantity" placeholder="请输入转换数量" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="转换单位" prop="conversionUnit">
        <el-input v-model="queryParams.conversionUnit" placeholder="请输入转换单位" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="转换不合格数量" prop="conversionQuantityUnquanlified">
        <el-input v-model="queryParams.conversionQuantityUnquanlified" placeholder="请输入转换不合格数量" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
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
                   v-hasPermi="['pro:feedback-warehousing-log:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['pro:feedback-warehousing-log:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="记录ID" align="center" prop="id" />
      <el-table-column label="报工单编号" align="center" prop="feedbackCode" />
      <el-table-column label="工作站ID" align="center" prop="workstationId" />
      <el-table-column label="工作站编号" align="center" prop="workstationCode" />
      <el-table-column label="工作站名称" align="center" prop="workstationName" />
      <el-table-column label="生产工单ID" align="center" prop="workorderId" />
      <el-table-column label="生产工单编号" align="center" prop="workorderCode" />
      <el-table-column label="生产工单名称" align="center" prop="workorderName" />
      <el-table-column label="工序ID" align="center" prop="processId" />
      <el-table-column label="工序编码" align="center" prop="processCode" />
      <el-table-column label="工序名称" align="center" prop="processName" />
      <el-table-column label="生产任务ID" align="center" prop="taskId" />
      <el-table-column label="生产任务编号" align="center" prop="taskCode" />
      <el-table-column label="产品物料ID" align="center" prop="itemId" />
      <el-table-column label="产品物料编码" align="center" prop="itemCode" />
      <el-table-column label="产品物料名称" align="center" prop="itemName" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="规格型号" align="center" prop="specification" />
      <el-table-column label="本次报工数量" align="center" prop="quantityFeedback" />
      <el-table-column label="合格品数量" align="center" prop="quantityQualified" />
      <el-table-column label="不良品数量" align="center" prop="quantityUnquanlified" />
      <el-table-column label="报工用户名" align="center" prop="userName" />
      <el-table-column label="昵称" align="center" prop="nickName" />
      <el-table-column label="批次号" align="center" prop="batchCode" />
      <el-table-column label="ERP批次号" align="center" prop="erpBatchCode" />
      <el-table-column label="生产设备名称" align="center" prop="machineryName" />
      <el-table-column label="生产设备编码" align="center" prop="machineryCode" />
      <el-table-column label="生产设备ID" align="center" prop="machineryId" />
      <el-table-column label="ERP报工单(用于撤销)" align="center" prop="erpFeedback" />
      <el-table-column label="ERP报工标识" align="center" prop="erpFeedbackStatus" />
      <el-table-column label="ERP入库标识" align="center" prop="erpWarehousingStatus" />
      <el-table-column label="转换数量" align="center" prop="conversionQuantity" />
      <el-table-column label="转换单位" align="center" prop="conversionUnit" />
      <el-table-column label="转换不合格数量" align="center" prop="conversionQuantityUnquanlified" />
      <el-table-column label="状态" align="center" prop="status" />
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
                     v-hasPermi="['pro:feedback-warehousing-log:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['pro:feedback-warehousing-log:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="报工单编号" prop="feedbackCode">
          <el-input v-model="form.feedbackCode" placeholder="请输入报工单编号" />
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
        <el-form-item label="工序编码" prop="processCode">
          <el-input v-model="form.processCode" placeholder="请输入工序编码" />
        </el-form-item>
        <el-form-item label="工序名称" prop="processName">
          <el-input v-model="form.processName" placeholder="请输入工序名称" />
        </el-form-item>
        <el-form-item label="生产任务ID" prop="taskId">
          <el-input v-model="form.taskId" placeholder="请输入生产任务ID" />
        </el-form-item>
        <el-form-item label="生产任务编号" prop="taskCode">
          <el-input v-model="form.taskCode" placeholder="请输入生产任务编号" />
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
        <el-form-item label="单位" prop="unitOfMeasure">
          <el-input v-model="form.unitOfMeasure" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="规格型号" prop="specification">
          <el-input v-model="form.specification" placeholder="请输入规格型号" />
        </el-form-item>
        <el-form-item label="本次报工数量" prop="quantityFeedback">
          <el-input v-model="form.quantityFeedback" placeholder="请输入本次报工数量" />
        </el-form-item>
        <el-form-item label="合格品数量" prop="quantityQualified">
          <el-input v-model="form.quantityQualified" placeholder="请输入合格品数量" />
        </el-form-item>
        <el-form-item label="不良品数量" prop="quantityUnquanlified">
          <el-input v-model="form.quantityUnquanlified" placeholder="请输入不良品数量" />
        </el-form-item>
        <el-form-item label="报工用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入报工用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="批次号" prop="batchCode">
          <el-input v-model="form.batchCode" placeholder="请输入批次号" />
        </el-form-item>
        <el-form-item label="ERP批次号" prop="erpBatchCode">
          <el-input v-model="form.erpBatchCode" placeholder="请输入ERP批次号" />
        </el-form-item>
        <el-form-item label="生产设备名称" prop="machineryName">
          <el-input v-model="form.machineryName" placeholder="请输入生产设备名称" />
        </el-form-item>
        <el-form-item label="生产设备编码" prop="machineryCode">
          <el-input v-model="form.machineryCode" placeholder="请输入生产设备编码" />
        </el-form-item>
        <el-form-item label="生产设备ID" prop="machineryId">
          <el-input v-model="form.machineryId" placeholder="请输入生产设备ID" />
        </el-form-item>
        <el-form-item label="ERP报工单(用于撤销)" prop="erpFeedback">
          <el-input v-model="form.erpFeedback" placeholder="请输入ERP报工单(用于撤销)" />
        </el-form-item>
        <el-form-item label="ERP报工标识" prop="erpFeedbackStatus">
          <el-radio-group v-model="form.erpFeedbackStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="ERP入库标识" prop="erpWarehousingStatus">
          <el-radio-group v-model="form.erpWarehousingStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转换数量" prop="conversionQuantity">
          <el-input v-model="form.conversionQuantity" placeholder="请输入转换数量" />
        </el-form-item>
        <el-form-item label="转换单位" prop="conversionUnit">
          <el-input v-model="form.conversionUnit" placeholder="请输入转换单位" />
        </el-form-item>
        <el-form-item label="转换不合格数量" prop="conversionQuantityUnquanlified">
          <el-input v-model="form.conversionQuantityUnquanlified" placeholder="请输入转换不合格数量" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
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
import { createFeedbackWarehousingLog, updateFeedbackWarehousingLog, deleteFeedbackWarehousingLog, getFeedbackWarehousingLog, getFeedbackWarehousingLogPage, exportFeedbackWarehousingLogExcel } from "@/api/pro/feedbackWarehousingLog";

export default {
  name: "FeedbackWarehousingLog",
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
      // 报工入库日志列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        feedbackCode: null,
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        workorderId: null,
        workorderCode: null,
        workorderName: null,
        processId: null,
        processCode: null,
        processName: null,
        taskId: null,
        taskCode: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        unitOfMeasure: null,
        specification: null,
        quantityFeedback: null,
        quantityQualified: null,
        quantityUnquanlified: null,
        userName: null,
        nickName: null,
        batchCode: null,
        erpBatchCode: null,
        machineryName: null,
        machineryCode: null,
        machineryId: null,
        erpFeedback: null,
        erpFeedbackStatus: null,
        erpWarehousingStatus: null,
        conversionQuantity: null,
        conversionUnit: null,
        conversionQuantityUnquanlified: null,
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
        itemId: [{ required: true, message: "产品物料ID不能为空", trigger: "blur" }],
        itemCode: [{ required: true, message: "产品物料编码不能为空", trigger: "blur" }],
        itemName: [{ required: true, message: "产品物料名称不能为空", trigger: "blur" }],
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
      getFeedbackWarehousingLogPage(this.queryParams).then(response => {
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
        feedbackCode: undefined,
        workstationId: undefined,
        workstationCode: undefined,
        workstationName: undefined,
        workorderId: undefined,
        workorderCode: undefined,
        workorderName: undefined,
        processId: undefined,
        processCode: undefined,
        processName: undefined,
        taskId: undefined,
        taskCode: undefined,
        itemId: undefined,
        itemCode: undefined,
        itemName: undefined,
        unitOfMeasure: undefined,
        specification: undefined,
        quantityFeedback: undefined,
        quantityQualified: undefined,
        quantityUnquanlified: undefined,
        userName: undefined,
        nickName: undefined,
        batchCode: undefined,
        erpBatchCode: undefined,
        machineryName: undefined,
        machineryCode: undefined,
        machineryId: undefined,
        erpFeedback: undefined,
        erpFeedbackStatus: undefined,
        erpWarehousingStatus: undefined,
        conversionQuantity: undefined,
        conversionUnit: undefined,
        conversionQuantityUnquanlified: undefined,
        status: undefined,
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
      this.title = "添加报工入库日志";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getFeedbackWarehousingLog(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改报工入库日志";
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
          updateFeedbackWarehousingLog(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createFeedbackWarehousingLog(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除报工入库日志编号为"' + id + '"的数据项?').then(function() {
          return deleteFeedbackWarehousingLog(id);
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
      this.$modal.confirm('是否确认导出所有报工入库日志数据项?').then(() => {
          this.exportLoading = true;
          return exportFeedbackWarehousingLogExcel(params);
        }).then(response => {
          this.$download.excel(response, '报工入库日志.xls');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
