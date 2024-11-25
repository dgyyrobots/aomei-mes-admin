<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="调拨单号" prop="allocatedCode">
        <el-input v-model="queryParams.allocatedCode" placeholder="请输入调拨单编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="调拨单名称" prop="allocatedName">
        <el-input v-model="queryParams.allocatedName" placeholder="请输入调拨单名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工单编码" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入生产工单编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="调拨日期" prop="allocatedDate">
        <el-date-picker v-model="queryParams.allocatedDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']"/>
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
                   v-hasPermi="['wms:allocated-header:create']">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['wms:allocated-header:export']">导出
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleFinsh" :disabled="single"
                   v-hasPermi="['wms:allocated-header:create']">完成
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="调拨单编号" align="center" prop="allocatedCode"/>
      <el-table-column label="调拨单名称" align="center" prop="allocatedName"/>
      <el-table-column label="生产工单" align="center" prop="workorderCode"/>
      <el-table-column label="客户编码" align="center" prop="clientCode"/>
      <el-table-column label="客户名称" align="center" prop="clientName"/>
      <el-table-column label="调拨日期" align="center" prop="allocatedDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.allocatedDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_allocated_status" :value="scope.row.status"/>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.status == 'PREPARE'" @click="handleExecute(scope.row)" v-hasPermi="['wms:issue-header:update']">执行领出</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['wms:allocated-header:update']">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['wms:allocated-header:delete']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="960px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨单编号" prop="allocatedCode">
              <el-input :disabled="isEdit" v-model="form.allocatedCode" placeholder="请输入调拨单编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view' && form.status == 'PREPARE'"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调拨单名称" prop="allocatedName">
              <el-input v-model="form.allocatedName" placeholder="请输入调拨单名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨日期" prop="allocatedDate">
              <el-date-picker clearable v-model="form.allocatedDate" type="date" value-format="timestamp" placeholder="选择调拨日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料仓库">
              <el-cascader
                v-model="warehouseInfo"
                :options="warehouseOptions"
                :props="warehouseProps"
                placeholder="请选择"
                @change="handleWarehouseChanged"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select v-model="form.status" disabled>
                <el-option v-for="dict in dict.type.wms_allocated_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
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
            <el-form-item label="生产任务" prop="taskCode">
              <el-input v-model="form.taskCode" placeholder="请选择生产任务">
                <el-button slot="append" icon="el-icon-search" @click="handleTaskSelect"></el-button>
              </el-input>
            </el-form-item>
            <ProtaskSelect ref="taskSelect" :workorderId="form.workorderId" @onSelected="onTaskSelected"></ProtaskSelect>
          </el-col>

          <el-col :span="8">
            <el-form-item label="客户编号">
              <el-input v-model="form.clientCode" placeholder="请选择生产工单"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider content-position="center">物料信息</el-divider>
      <el-card shadow="always" class="box-card">
        <!--追加工单BOM信息-->
        <el-table v-loading="bomLoadding" max-height="250" :data="bomList" @selection-change="handleBomSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column width="150" label="物料编码" align="center" prop="itemCode"/>
          <el-table-column width="150" label="物料名称" :show-overflow-tooltip="true" align="center" prop="itemName"/>
          <el-table-column width="100" label="单位" align="center" prop="unitOfMeasure"/>
          <el-table-column width="100" label="调拨数量" align="center" prop="quantityAllocated"/>
          <el-table-column width="100" label="批次号" align="center" prop="batchCode"/>
          <el-table-column width="100" label="库存数量" align="center" prop="quantityOnhand"/>
          <el-table-column width="100" label="仓库名称" align="center" prop="warehouseName"/>
          <el-table-column width="130" label="库区名称" align="center" prop="locationName"/>
          <el-table-column width="100" label="库位名称" align="center" prop="areaName"/>
        </el-table>

      </el-card>

      <el-divider content-position="center">调拨信息</el-divider>
      <el-card shadow="always" class="box-card">
        <!--追加工单BOM信息-->
        <el-table v-loading="bomLoadding" max-height="250" :data="allocatedList" row-key="itemCode">
          <el-table-column width="150" label="物料编码" align="center" prop="itemCode"/>
          <el-table-column width="150" label="物料名称" :show-overflow-tooltip="true" align="center" prop="itemName"/>
          <el-table-column width="100" label="单位" align="center" prop="unitOfMeasure"/>
<!--          <el-table-column width="100" label="调拨数量" align="center" prop="quantityAllocated"/>-->
          <el-table-column width="100" label="调拨数量" align="center" prop="quantityAllocated">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.quantityAllocated"
                type="number"
                placeholder="请输入数量"
                @blur="handleQuantityChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column width="100" label="批次号" align="center" prop="batchCode"/>
          <el-table-column width="100" label="库存数量" align="center" prop="quantityOnhand"/>
          <el-table-column width="100" label="仓库名称" align="center" prop="warehouseName"/>
          <el-table-column width="130" label="库区名称" align="center" prop="locationName"/>
          <el-table-column width="100" label="库位名称" align="center" prop="areaName"/>
        </el-table>

      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--执行出库-->
    <el-dialog :title="'执行出库'" :visible.sync="executeDialogVisible" width="960px" v-dialogDrag append-to-body>
      <el-form ref="executeForm" :model="executeForm" label-width="100px">
        <!-- 这里添加与新增页面一致的表单项，但设置为禁用或只读 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨单编号" prop="allocatedCode">
              <el-input v-model="executeForm.allocatedCode" disabled placeholder="请输入调拨单编号"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="调拨单名称" prop="allocatedName">
              <el-input v-model="executeForm.allocatedName" disabled placeholder="请输入调拨单名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨日期" prop="allocatedDate">
              <el-date-picker clearable v-model="executeForm.allocatedDate" disabled type="date" value-format="timestamp" placeholder="选择调拨日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料仓库">
              <el-cascader disabled v-model="warehouseInfo" :options="warehouseOptions" :props="warehouseProps" @change="handleWarehouseChanged"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select disabled v-model="executeForm.status" disabled>
                <el-option v-for="dict in dict.type.wms_allocated_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>

          <el-col :span="8">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input disabled v-model="executeForm.workorderCode" placeholder="请选择生产工单">
                <el-button disabled slot="append" icon="el-icon-search" @click="handleWorkorderSelect"></el-button>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="生产任务" prop="taskCode">
              <el-input disabled v-model="executeForm.taskCode" placeholder="请选择生产任务">
                <el-button disabled slot="append" icon="el-icon-search" @click="handleTaskSelect"></el-button>
              </el-input>
            </el-form-item>
            <ProtaskSelect ref="taskSelect" :workorderId="executeForm.workorderId" @onSelected="onExecuteTaskSelected"></ProtaskSelect>
          </el-col>

          <el-col :span="8">
            <el-form-item label="客户编号">
              <el-input disabled v-model="executeForm.clientCode" placeholder="请选择生产工单"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input disabled v-model="executeForm.remark" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">BOM信息</el-divider>
        <!-- 物料信息列表，隐藏单选框 -->
        <el-table v-loading="bomLoadding" max-height="200" :data="bomList" style="width: 100%">
          <el-table-column width="150" label="物料编码" align="center" prop="itemCode"/>
          <el-table-column width="150" label="物料名称" :show-overflow-tooltip="true" align="center" prop="itemName"/>
          <el-table-column width="100" label="单位" align="center" prop="unitOfMeasure"/>
          <el-table-column width="100" label="调拨数量" align="center" prop="quantityAllocated"/>
          <el-table-column width="100" label="批次号" align="center" prop="batchCode"/>
          <el-table-column width="100" label="库存数量" align="center" prop="quantityOnhand"/>
          <el-table-column width="100" label="仓库名称" align="center" prop="warehouseName"/>
          <el-table-column width="130" label="库区名称" align="center" prop="locationName"/>
          <el-table-column width="100" label="库位名称" align="center" prop="areaName"/>

        </el-table>

        <el-divider content-position="center">调拨信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="8">
            <el-form-item label="单据信息" prop="purchaseId">
              <el-input v-model="purchaseId" placeholder="请输入单据信息"/>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-button type="primary" round @click="getCameraInfo()">摄像头</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="allocatedHandleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="allocatedMultiple" @click="allocatedHandleDelete">删除</el-button>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="allocatedList" @selection-change="allocatedHandleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column width="150" label="物料编码" align="center" prop="itemCode"/>
          <el-table-column width="150" label="物料名称" :show-overflow-tooltip="true" align="center" prop="itemName"/>
          <el-table-column width="100" label="单位" align="center" prop="unitOfMeasure"/>
          <el-table-column width="100" label="调拨数量" align="center" prop="quantityAllocated"/>
          <el-table-column width="100" label="批次号" align="center" prop="batchCode"/>
          <el-table-column width="100" label="库存数量" align="center" prop="quantityOnhand"/>
          <el-table-column width="100" label="仓库名称" align="center" prop="warehouseName"/>
          <el-table-column width="130" label="库区名称" align="center" prop="locationName"/>
          <el-table-column width="100" label="库位名称" align="center" prop="areaName"/>
        </el-table>


      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="executeDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="executeAllocated">确 定</el-button>
  </span>
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
import {createAllocatedHeader, updateAllocatedHeader, deleteAllocatedHeader, getAllocatedHeader, getAllocatedHeaderPage, exportAllocatedHeaderExcel, initBomInfo, execute, finshAllocatedHeader} from "@/api/wms/allocatedHeader";
import {genCode} from '@/api/mes/autocode/rule';
import WorkstationSelect from '@/components/workstationSelect/simpletableSingle.vue';
import WorkorderSelect from '@/components/workorderSelect/single.vue';
import {getTreeList} from '@/api/mes/wm/warehouse';
import {getGoods} from '@/api/purchase/goods';
import {getStockInfoByPurchaseId} from "@/api/purchase/goods";
import jsQR from "jsqr";
import ProtaskSelect from '@/components/TaskSelect/taskSelectSingle.vue';


export default {
  name: "AllocatedHeader",
  dicts: ['wms_allocated_status'],
  components: {
    ProtaskSelect,
    WorkorderSelect
  },
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
      // 遮罩层a
      loading: true,
      bomLoadding: false,
      // 选中数组
      ids: [],
      allocatedIds: [],
      // 非单个禁用
      single: true,
      allocatedSingle: true,
      // 非多个禁用
      multiple: true,
      allocatedMultiple: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 调拨单头列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        allocatedCode: null,
        allocatedName: null,
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        workorderId: null,
        workorderCode: null,
        taskId: null,
        taskCode: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        clientNick: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        allocatedDate: [],
        status: null,
        remark: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      bomList: [], // 存储工单BOM信息
      allocatedList: [], // 存储调拨信息
      // 表单校验
      rules: {
        allocatedCode: [{required: true, message: "调拨单编号不能为空", trigger: "blur"}],
        allocatedName: [{required: true, message: "调拨单名称不能为空", trigger: "blur"}],
        workorderCode: [{required: true, message: '请指定生产工单', trigger: 'blur'}],
        warehouseId: [{required: true, message: '请指定调入仓库', trigger: 'blur'}],
        locationId: [{required: true, message: '请指定调入库区', trigger: 'blur'}],
        areaId: [{required: true, message: '请指定调入库位', trigger: 'blur'}],
      },
      executeDialogVisible: false,
      executeForm: {},
      purchaseId: null,
      //摄像头配置
      targetCameraId: null,
      videoWidth: 640,
      videoHeight: 480,
      cameraPreviewVisible: false, // 控制摄像头弹出框
      scanResult: '', // 存储扫描结果
    };
  },
  computed: {
    isEdit() {
      return this.optType === 'edit';
    }
  },
  created() {
    this.getList();
    this.getWarehouseList();

  },
  watch: {
    cameraPreviewVisible(newVal) {
      if (!newVal) {
        this.stopScanning();
      }
    }
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getAllocatedHeaderPage(this.queryParams).then(response => {
        this.list = response.data.list;
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
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.bomList = []; // 清空BOM信息
      this.allocatedList = []; // 清空调拨信息
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: null,
        allocatedCode: null,
        allocatedName: null,
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        workorderId: null,
        workorderCode: null,
        taskId: null,
        taskCode: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        clientNick: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        allocatedDate: null,
        status: 'PREPARE',
        remark: null,
        bomList: [],
      };
      this.autoGenFlag = false;
      this.bomList = [];
      this.warehouseInfo = []; // 重置领料仓库信息
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
      this.title = "添加调拨单";
      this.optType = 'add';
      this.warehouseInfo = [];
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getAllocatedHeader(id).then(response => {
        this.form = response.data;
        // 设置领料仓库信息
        this.warehouseInfo = [
          response.data.warehouseId,
          response.data.locationId,
          response.data.areaId
        ];
        this.bomList = response.data.bomList; // 获取BOM信息
        this.open = true;
        this.title = "修改调拨单";
        this.optType = 'edit';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        if(this.form.warehouseId == null || this.form.locationId == null || this.form.areaId == null){
          this.$modal.msgError("请选择调拨仓库、库区、库位信息！");
          return;
        }
        if (this.allocatedList.length === 0) {
          this.$modal.msgError("请选择需要调拨的BOM信息");
          return;
        }
        this.form.bomList = this.allocatedList.map(item => ({
          ...item, quantityAllocated: parseFloat(item.quantityAllocated)
        }));

        // 修改的提交
        //this.form.bomList = this.allocatedList;
        console.log(this.form);
        if (this.form.id != null) {
          console.log("修改参数: "+ this.form);
          console.log(this.form);
          updateAllocatedHeader(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });

          return;
        }
        this.form.bomList = this.allocatedList; // 追加选中的需要调拨的Bom信息
        console.log(this.form);
        // 添加的提交
        createAllocatedHeader(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });

      });

    },
    //执行出库-原
    /*handleExecute(row) {
      const allocatedIds = row.id || this.ids;
      this.$modal
        .confirm('确认执行出库？')
        .then(function () {
          return execute(allocatedIds); //执行入库
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('出库成功');
        })
        .catch(() => {
        });
    },*/
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除调拨单头编号为"' + id + '"的数据项?').then(function () {
        return deleteAllocatedHeader(id);
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
      this.$modal.confirm('是否确认导出所有调拨单头数据项?').then(() => {
        this.exportLoading = true;
        return exportAllocatedHeaderExcel(params);
      }).then(response => {
        this.$download.excel(response, '调拨单头.xls');
        this.exportLoading = false;
      }).catch(() => {
      });
    },
    //选择默认的仓库、库区、库位
    handleWarehouseChanged(value) {
      if (value !== null) {
        this.form.warehouseId = value[0]; // 仓库
        this.form.locationId = value[1]; // 库区
        this.form.areaId = value[2]; // 库位
      } else {
        this.form.warehouseId = null;
        this.form.locationId = null;
        this.form.areaId = null;
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
      this.bomLoadding = true;
      // 追加工单BOM信息
      initBomInfo(this.form.workorderCode).then(response => {
        this.bomList = response.data;
        this.bomLoadding = false;
      });

    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        debugger;
        console.log("AAA");
        genCode('ALLOCATED_CODE').then(response => {
          this.form.allocatedCode = response;
        });
      } else {
        this.form.allocatedCode = null;
      }
    },

    // 完成
    handleFinsh(row) {
      this.reset();
      const allocatedId = row.id || this.ids;
      console.log(allocatedId);
      // 完成
      finshAllocatedHeader(allocatedId).then(response => {
        this.$modal.msgSuccess("成功");
        this.open = false;
        this.getList();
      });
    },
    handleBomSelectionChange(selection) {
      //this.allocatedList = selection; // 存储选中的bomList项
      this.allocatedList = selection.map(item => ({ ...item }));
    },
    // 执行出库的弹出框方法
    handleExecute(row) {
      this.openExecuteDialog(row.id);
    },

    openExecuteDialog(allocatedId) {
      this.executeForm.id = allocatedId; // 传递需要执行出库的调拨单ID
      this.$nextTick(() => {
        this.$refs.executeForm.resetFields(); // 重置表单
      });
      getAllocatedHeader(allocatedId).then(response => {
        this.executeForm = response.data;
        console.log(this.executeForm);
        console.log(this.warehouseInfo);
        // 设置领料仓库信息
        this.warehouseInfo = [
          response.data.warehouseId,
          response.data.locationId,
          response.data.areaId
        ];
        this.warehouseInfo[0] = response.data.warehouseId;
        this.warehouseInfo[1] = response.data.locationId;
        this.warehouseInfo[2] = response.data.areaId;
        this.bomList = response.data.bomList; // 获取BOM信息
        this.executeDialogVisible = true; // 控制弹出框显示
      });

    },
    // 新增调拨数据
    allocatedHandleAdd() {
      if (!this.purchaseId.includes('{') || !this.purchaseId.includes('}')) {
        this.$message.error('请扫描正确的单据信息!');
        return;
      }
        this.handleBlur();
    },
    // 删除调拨数据
    allocatedHandleDelete() {

    },
    allocatedHandleSelectionChange() {
      this.allocatedIds = selection.map(item => item.id);
      this.allocatedSingle = selection.length !== 1;
      this.allocatedMultiple = !selection.length;
    },
    handleBlur(type) {
      let finType = '';
      if(type){
        finType = type;
      }
      // 获取当前的单据Id
      console.log(this.purchaseId);
      // 基于当前的采购单获取所有的物料数据
      if (!this.purchaseId) {
        return;
      }
      if (isNaN(this.purchaseId)) {
        if (this.purchaseId && (this.purchaseId.includes('{') || this.purchaseId.includes('[') || this.purchaseId.includes('}') || this.purchaseId.includes(']')) && !this.purchaseId.includes('"')) {
          this.purchaseId = this.purchaseId.trim();
          // 清理文本框内容的多余空格，并格式化为标准 JSON 格式
          this.purchaseId = this.purchaseId
            // 去除字段名和字段值之间的多余空格
            .replace(/\s*[:]\s*/g, ':')
            .replace(/\s*,\s*/g, ',')
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*\[\s*/g, '[')
            .replace(/\s*\]\s*/g, ']');
          // 给键和字符串值加上双引号
          let formattedData = this.purchaseId
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
            // 检查是否包含 id 属性
            if (transedData) {
              // 更新 purchaseId
              this.purchaseId = transedData.id;
              finType = transedData.type;
            }
          } catch (error) {
            this.$message.error('扫描结果不是有效的 JSON 字符串');
          }
        }
      }
      console.log("开始获取单身信息");
      // 获取当前采购单身信息
      let obj = {
        'id': this.purchaseId,
        'type': finType
      }
      getStockInfoByPurchaseId(obj).then(response => {
        console.log(response.data);
        let obj = response.data;
        obj.quantityAllocated = obj.quantityOnhand
        const isItemCodeExists = this.allocatedList.some(item => item.itemCode === obj.itemCode);
        // 如果物料Id不存在，则添加到this.allocatedList
        if (!isItemCodeExists) {
          this.allocatedList.push(obj);
        } else {
          this.$message.error(`物料唯一码已存在，请勿添加重复项。`);
        }
      });
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
    }
    ,

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
    }
    ,
    scanQRCode() {
      const that = this;
      const video = this.$refs.videoCameraPreview;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      let type = '';
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
                // 检查是否包含 id 属性
                if (data && data.id) {
                  that.purchaseId = data.id;
                  type = data.type;
                } else {
                  console.log("data.id is undefined");
                }
              } catch (error) {
                console.error('解析 JSON 出错:', error);
                that.$message.error('扫描结果不是有效的 JSON 字符串');
              }
              that.handleBlur(type); // 基于当前的采购单获取所有的物料数据
              that.stopScanning();
            }
          }
        }
        requestAnimationFrame(tick);
      }

      tick();
    }
    ,
    // 停止扫描二维码
    stopScanning() {
      const stream = this.$refs.videoCameraPreview.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
    ,
    // 显示摄像头预览弹出框
    showCameraPreview() {
      this.cameraPreviewVisible = true;
      this.startScanning();
    },
    executeAllocated() {
      // 检查allocatedList和bomList是否有匹配的物料编码
      this.allocatedList.forEach(allocatedItem => {
        // 查找bomList中是否存在相同的物料编码
        const bomItem = this.bomList.find(item => item.itemCode === allocatedItem.itemCode);
        if (!bomItem) {
          this.$message.error(`物料编码 ${allocatedItem.itemCode} 在BOM信息中不存在`);
          return;
        }
        // 检查调拨数量是否不超过库存数量
        // 先禁用, 此处没考虑单位换算问题
        /*if (allocatedItem.quantityAllocated > bomItem.quantityOnhand) {
          this.$message.error(`物料编码 ${allocatedItem.itemCode} 的调拨数量超过了库存数量`);
          return;
        }*/
      });

      // 如果所有校验都通过，执行调拨出库操作
      if (this.allocatedList.every(item => {
        const bomItem = this.bomList.find(bom => bom.itemCode === item.itemCode);
        return bomItem;
      })) {
        console.log("执行调拨出库操作");
        console.log(this.executeForm.id)
        execute(this.executeForm.id).then(() => {
          this.getList();
          this.$modal.msgSuccess('出库成功');
          this.executeDialogVisible = false;
        });
      } else {
        this.$message.error('请检查调拨信息，确保所有物料编码和数量正确');
      }
    },
    handleQuantityChange(row) {
      console.log(row);
      const quantity = parseFloat(row.quantityAllocated);
      if (isNaN(quantity) || quantity <= 0) {
        this.$message.error('调拨数量必须为大于0的正数');
        // 重置输入框的值
        row.quantityAllocated = ''; // 或者设置为上一次的有效值
        return;
      }
      // 找到对应的索引并更新数据
      const index = this.allocatedList.findIndex(item => item.itemCode === row.itemCode);
      if (index !== -1) {
        this.$set(this.allocatedList, index, { ...this.allocatedList[index], quantityAllocated: quantity });
      }
    },
    handleTaskSelect() {
      this.$refs.taskSelect.showFlag = true;
      this.$refs.taskSelect.getList();
    },
    onTaskSelected(row) {
      if (row != undefined && row != null) {
        this.form.taskId = row.id;
        this.form.taskCode = row.taskCode;
        this.form.taskName = row.taskName;
        this.form.workstationId = row.workstationId;
        this.form.workstationCode = row.workstationCode;
        this.form.workstationName = row.workstationName;
        this.form.processId = row.processId;
        this.form.processCode = row.processCode;
        this.form.processName = row.processName;
      }
    },
    onExecuteTaskSelected(row) {
      if (row != undefined && row != null) {
        this.executeForm.taskId = row.id;
        this.executeForm.taskCode = row.taskCode;
        this.executeForm.taskName = row.taskName;
        this.executeForm.workstationId = row.workstationId;
        this.executeForm.workstationCode = row.workstationCode;
        this.executeForm.workstationName = row.workstationName;
        this.executeForm.processId = row.processId;
        this.executeForm.processCode = row.processCode;
        this.executeForm.processName = row.processName;
      }
    }

  }
};
</script>
