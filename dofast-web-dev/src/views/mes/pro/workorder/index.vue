<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单编码" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入工单编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工单名称" prop="workorderName">
        <el-input v-model="queryParams.workorderName" placeholder="请输入工单名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="母工单号" prop="sourceCode">
        <el-input v-model="queryParams.sourceCode" placeholder="请输入母工单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="产品编号" prop="productCode">
        <el-input v-model="queryParams.productCode" placeholder="请输入产品编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="queryParams.productName" placeholder="请输入产品名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="单据状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择单据状态" clearable>
          <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="客户编码" prop="clientCode">
              <el-input v-model="queryParams.clientCode" placeholder="请输入客户编码" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="客户名称" prop="clientName">
              <el-input v-model="queryParams.clientName" placeholder="请输入客户名称" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="生产方" prop="isOut">
              <el-radio-group v-model="queryParams.isOut">
                <el-radio :key="false" :label="false">自产</el-radio>
                <el-radio :key="true" :label="true">委外</el-radio>
              </el-radio-group>
            </el-form-item>-->
      <el-form-item label="需求日期" prop="requestDate">
        <el-date-picker clearable v-model="queryParams.requestDate" type="date" value-format="timestamp"
          placeholder="请选择需求日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['pro:workorder:create']">新增 </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['pro:workorder:update']">修改 </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['pro:workorder:delete']">删除 </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['pro:feedback:export']">导出 </el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-edit" size="mini" @click="handleCirculation"
                   v-hasPermi="['pro:feedback:update']">流转卡 </el-button>
      </el-col>-->

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workorderList" row-key="id" default-expand-all
      :tree-props="{ children: 'workorderDOList' }" @selection-change="handleSelectionChange" ref="multipleTable" @row-click="handleRowClick">
      <!-- hasChildren: 'hasChildren' -->

      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="工单编码" width="180" prop="workorderCode">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleView(scope.row)" v-hasPermi="['pro:workorder:query']">
            {{ scope.row.workorderCode }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="工单名称" width="200" align="center" prop="workorderName" :show-overflow-tooltip="true" />
      <el-table-column label="工单来源" align="center" prop="orderSource">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_workorder_sourcetype" :value="scope.row.orderSource" />
        </template>
      </el-table-column>
      <el-table-column label="母工单号" width="180" align="center" prop="sourceCode" />
      <el-table-column label="产品编号" width="120" align="center" prop="productCode" />
      <el-table-column label="产品名称" width="200" align="center" prop="productName" :show-overflow-tooltip="true" />
      <el-table-column label="规格型号" align="center" prop="productSpc" :show-overflow-tooltip="true" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="工单数量" align="center" prop="quantity" />
      <el-table-column label="调整数量" align="center" prop="quantityChanged" />
      <el-table-column label="已生产数量" align="center" width="100px" prop="quantityProduced" />
      <el-table-column label="批次号" align="center" width="100px" prop="batchCode" />
      <el-table-column label="客户编码" align="center" prop="clientCode" />
      <el-table-column label="客户名称" align="center" prop="clientName" :show-overflow-tooltip="true" />
      <el-table-column label="需求日期" align="center" prop="requestDate" width="180" fixed="right">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.requestDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打印状态" align="center" prop="isReport" class-name="small-padding fixed-width" fixed="right"
        width="110">
        <template v-slot="scope">
          <el-tag type="info" v-if="!scope.row.isPrint">未打印</el-tag>
          <span v-else>打印{{ scope.row.isPrint }}次</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="status" fixed="right">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-printer" :disabled="!handleCanPrint(scope.row)"
            @click="handlePrint(scope.row)">打印 </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" v-if="scope.row.status == 'PREPARE'"
            @click="handleUpdate(scope.row)" v-hasPermi="['pro:workorder:update']">修改 </el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" v-if="scope.row.status == 'CONFIRMED'"
            @click="handleAdd(scope.row)" v-hasPermi="['pro:workorder:create']">新增 </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.status == 'PREPARE'"
            @click="handleDelete(scope.row)" v-hasPermi="['pro:workorder:delete']">删除 </el-button>


        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改生产工单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="工单编号" prop="workorderCode">
              <el-input v-model="form.workorderCode" placeholder="请输入工单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成"
                @change="handleAutoGenChange(autoGenFlag)"
                v-if="optType != 'view' && form.status == 'PREPARE'"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单名称" prop="workorderName">
              <el-input v-model="form.workorderName" placeholder="请输入工单名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="生产方" prop="isOut">
              <el-radio-group v-model="form.isOut">
                <el-radio :key="false" :label="false">自产</el-radio>
                <el-radio :key="true" :label="true">委外</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源类型" prop="orderSource">
<!--              <el-radio-group v-model="form.orderSource" disabled v-if="optType == 'view'">
                <el-radio v-for="dict in dict.type.mes_workorder_sourcetype" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
              <el-radio-group v-model="form.orderSource" v-else>
                <el-radio v-for="dict in dict.type.mes_workorder_sourcetype" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>-->

              <el-select v-model="form.orderSource" placeholder="请选择来源类型">
                <el-option v-for="dict in dict.type.mes_workorder_sourcetype" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.orderSource == '2'">
            <el-form-item label="订单编号" prop="sourceCode">
              <el-input v-model="form.sourceCode" placeholder="请输入订单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select v-model="form.status" disabled placeholder="请选择单据状态">
                <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="工艺版本" prop="status">
              <el-select v-model="form.routeCode" placeholder="请选择工艺版本">
                <el-option
                  v-for="item in form.routeList"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品编号" prop="productCode">
              <el-input v-model="form.productCode" placeholder="请选择产品">
                <el-button slot="append" @click="handleSelectProduct" icon="el-icon-search"></el-button>
              </el-input>
              <ItemSelect ref="itemSelect" @onSelected="onItemSelected"></ItemSelect>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请选择产品" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="productSpc">
              <el-input v-model="form.productSpc" placeholder="请输入规格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input v-model="form.unitOfMeasure" placeholder="请选择产品" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="工单数量" prop="quantity">
              <el-input-number :min="1" v-model="form.quantity" placeholder="请输入生产数量" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求日期" prop="requestDate">
              <el-date-picker clearable v-model="form.requestDate" type="date" value-format="timestamp"
                placeholder="请选择需求日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批次号" prop="batchCode">
              <el-input v-model="form.batchCode" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.orderSource == '2'">
          <el-col :span="12">
            <el-form-item label="客户编码" prop="clientCode">
              <el-input v-model="form.clientCode" placeholder="请输入客户编码">
                <el-button slot="append" @click="handleSelectClient" icon="el-icon-search"></el-button>
              </el-input>
              <ClientSelect ref="clientSelect" @onSelected="onClientSelected"></ClientSelect>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="clientName">
              <el-input v-model="form.clientName" readonly="readonly" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
          <el-col></el-col>
        </el-row>
        <el-row>
          <el-col></el-col>
          <el-col></el-col>
          <el-col></el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="adjuncts">
              <file-upload :isShowTips="isShowDelete" v-model="form.adjuncts" :file-type="adjunctTypes" :limit="20" :file-size="100"></file-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tabs type="border-card" v-if="form.id != null">
        <el-tab-pane label="BOM组成">
          <Workorderbom ref="bomlist" :optType="optType" :workorder="form" @handleAddSub="handleSubAdd"></Workorderbom>
        </el-tab-pane>
<!--        <el-tab-pane label="物料需求" v-if="form.parentId == 0">
          <WorkorderItemList :workorder="form"></WorkorderItemList>
        </el-tab-pane>-->
        <el-tab-pane label="快捷排产" v-if="form.status == 'CONFIRMED'">
          <el-steps :active="activeProcess" v-if="form.id != null" align-center simple>
            <el-step v-for="(item, index) in processOptions" :key="index" :title="item.processName"
              @click.native="handleStepClick(index)"></el-step>
          </el-steps>
          <template v-for="(item, index) in processOptions">
            <el-card :key="index" v-if="activeProcess == index">
              <ProTask :workorderId="form.id" :workorderName = "form.workorderName" :workorderCode="form.workorderCode" :processId="item.processId" :colorCode="item.colorCode" :optType="optType">
              </ProTask>
            </el-card>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view' || form.status != 'PREPARE'">返回</el-button>
        <el-button type="primary" @click="submitForm" v-if="form.status == 'PREPARE' && optType != 'view'">确 定
        </el-button>
        <el-button type="success" @click="handleFinish"
          v-if="form.status == 'PREPARE' && optType != 'view' && form.id != null">完成 </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createPrintLog } from "@/api/report/printLog";
import { listProductprocess } from '@/api/mes/pro/routeprocess';
import { getRouteCodeByItemCode } from '@/api/mes/pro/proroute';
import ProTask from '../schedule/proTask.vue';
import { listWorkorder, getWorkorder, delWorkorder, addWorkorder, updateWorkorder , updateWorkorderAdjuncts } from '@/api/mes/pro/workorder';
import Workorderbom from './bom/bom.vue';
import WorkorderItemList from './items/item.vue';
import ItemSelect from '@/components/itemSelect/single.vue';
import ClientSelect from '@/components/clientSelect/single.vue';
import { genCode } from '@/api/mes/autocode/rule';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import FileUpload from '@/components/FileUpload/index3.vue';
import { getConfigKey } from '@/api/system/config';
import { SystemConfigKeys } from '@/utils/constants';
import { getAccessToken } from '@/utils/auth';
import '@/utils/CLodopfuncs2.js';

export default {
  name: 'Workorder',
  dicts: ['mes_order_status', 'mes_workorder_sourcetype'],
  props: {
    isMine: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    FileUpload,
    Treeselect,
    ItemSelect,
    ClientSelect,
    Workorderbom,
    WorkorderItemList,
    ProTask,
  },
  data() {
    return {
      //当前生产工单中产品对应的工序列表
      processOptions: [],
      activeProcess: 0,
      adjunctTypes: null,
      //自动生成编码
      autoGenFlag: false,
      optType: undefined,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 非单个禁用
      single: true,
      // 总条数
      total: 0,
      // 非多个禁用
      multiple: true,
      // 生产工单表格数据
      workorderList: [],
      // 生产工单树选项
      workorderOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
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
        ancestors: null,
        status: null,
        isOut: null,

      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        workorderCode: [{required: true, message: '工单编码不能为空', trigger: 'blur'}],
        workorderName: [{required: true, message: '工单名称不能为空', trigger: 'blur'}],
        orderSource: [{required: true, message: '来源类型不能为空', trigger: 'blur'}],
        productId: [{required: true, message: '产品不能为空', trigger: 'blur'}],
        productSpc: [{required: true, message: '规格型号不能为空', trigger: 'blur'}],
        productCode: [{required: true, message: '产品编号不能为空', trigger: 'blur'}],
        productName: [{required: true, message: '产品名称不能为空', trigger: 'blur'}],
        quantity: [{required: true, message: '生产数量不能为空', trigger: 'blur'}],
        requestDate: [{required: true, message: '需求日期不能为空', trigger: 'blur'}],
      },
      printReportIds: {
        level0: '',
        level1: '',
      },
      isShowDelete: true,
      ids: [],
      // 行选中项
      selectionObj: {},
    };
  },
  created() {
    this.getList();
    getConfigKey(SystemConfigKeys.mixin_order_report).then(({data}) => {
      this.printReportIds.level0 = data ? data.value : '';
    });
    getConfigKey(SystemConfigKeys.work_order_report).then(({data}) => {
      this.printReportIds.level1 = data ? data.value : '';
    });
  },
  methods: {
    getProcess() {
      console.log(this.form);
      listProductprocess(this.form.id).then(response => {
        this.processOptions = response.data;
      });
    },
    //Step点击
    handleStepClick(index) {
      this.activeProcess = index;
    },
    /** 查询生产工单列表 */
    getList() {
      this.loading = true;
      listWorkorder({
        ...this.queryParams,
        ...(this.isMine ? {} : {isMine: 1}),
      }).then(response => {
        // this.workorderList = this.handleTree(response.data.list, 'id', 'parentId');
        this.workorderList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 转换生产工单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.workorderName,
        children: node.children,
      };
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
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
        status: 'PREPARE',
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        adjuncts: '',
        isOut: false,
      };
      this.autoGenFlag = false;
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    //从BOM行中直接新增
    handleSubAdd(row) {
      this.open = false;
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form = row;
        this.form.parentId = row.id;
        this.form.id = null;
        this.form.workorderCode = null;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = '添加生产工单';
      this.optType = 'add';
    },
    handleCanPrint(row) {
      if (row) {
        if (row.parentId <= 0) {
          return this.printReportIds.level0;
        } else {
          return this.printReportIds.level1;
        }
      }
      return false;
    },
    async handlePrint(row) {
      await this.$modal.confirm('确认打印？')
      let datas = await createPrintLog({printName: this.$store.state.user.nickname, printType: this.$route.meta.title + '-工单编码', printCode: row.workorderCode});
      if (!datas.data) {
        this.$message.error(datas.msg);
        return
      }
      const id = this.handleCanPrint(row);
      if (id) {
        window.open(`${process.env.VUE_APP_BASE_API}/jmreport/view/${id}?token=${getAccessToken()}&workorderId=${row.id}`);
      }
    },
    /** 新增按钮操作 */
    async handleAdd(row) {
      this.reset();
      this.getTreeselect();
      let timeout = 0;
      if (row != null && row.id) {
        this.form.parentId = row.id;
        this.form.orderSource = row.orderSource;
        this.form.sourceCode = row.sourceCode;
        this.form.clientId = row.clientId;
        this.form.clientCode = row.clientCode;
        this.form.clientName = row.clientName;
        this.form.mixinOrderId = row.mixinOrderId;
        const confirm = await this.$modal
          .confirm('是否将工单附件带入?', '提示', {
            cancelButtonText: '否',
            confirmButtonText: '是',
          })
          .catch(() => false);
        if (confirm) {
          this.form.adjuncts = row.adjuncts;
        }
        timeout = 300;
      } else {
        this.form.parentId = 0;
      }
      this.isShowDelete = true;
      this.title = '添加生产工单';
      this.optType = 'add';
      setTimeout(() => {
        this.open = true;
      }, timeout);
    },
    // 查询明细按钮操作
    async handleView(row) {
      this.reset();
      this.getTreeselect();
      const workorderId = row.id || this.id;
      await getWorkorder(workorderId).then(response => {
        this.form = response.data;
        console.log(this.form)
        this.getProcess();
        // 根据当前选中的物料, 获取工艺路线编号
        /*this.initRouteList(this.form.productCode);
        console.log("AAA: " + this.form.routeList);*/
        /*this.open = true;
        this.title = '查看工单信息';
        this.optType = 'view';*/
      });
      await getRouteCodeByItemCode(this.form.productCode).then(response => {
        console.log(response.data);
        this.form.routeList = response.data;
        this.open = true;
        this.isShowDelete = true;
        this.title = '查看工单信息';
        this.optType = 'view';
      });
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      // 若当前选中行为已确认, 禁止修改
      if(this.selectionObj[0].status != 'PREPARE'){
        this.$modal.msgError('已确认的工单禁止修改');
        return;
      }

      if (row != null) {
        this.form.parentId = row.id;
      }
      let id = row.id || this.ids[0];
      await getWorkorder(id).then(response => {
        this.form = response.data;
        // 根据当前选中的物料, 获取工艺路线编号
        /*  this.initRouteList(this.form.productCode)
        console.log("BBB: " + this.form.routeList);*/
        this.getProcess();
      });
      await getRouteCodeByItemCode(this.form.productCode).then(response => {
        console.log(response.data);
        this.form.routeList = response.data;
        this.open = true;
        this.title = '修改生产工单';
        this.optType = 'edit';
      });
      this.isShowDelete = true;
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWorkorder(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              //this.open = false;
              this.$refs['bomlist'].getList();
              this.getList();
            });
          } else {
            addWorkorder(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              //this.open = false;
              this.form.id = response.data;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除生产工单编号为"' + row.id + '"的数据项？')
        .then(function () {
          return delWorkorder(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {
        });
    },
    handleSelectProduct() {
      this.$refs.itemSelect.showFlag = true;
    },
    handleSelectClient() {
      this.$refs.clientSelect.showFlag = true;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'mes/pro/workorder/export',
        {
          ...this.queryParams,
        },
        `workorder_${new Date().getTime()}.xlsx`,
      );
    },
    handleFinish() {
      let that = this;
      this.$modal.confirm('是否完成工单编制？【完成后将不能更改】').then(function () {
        that.form.status = 'CONFIRMED';
        that.submitForm();
      });
    },
    //物料选择弹出框
    onItemSelected(obj) {
      if (obj != undefined && obj != null) {
        this.form.productId = obj.id;
        this.form.productCode = obj.itemCode;
        this.form.productName = obj.itemName;
        // this.form.productSpc = obj.specification;
        this.form.unitOfMeasure = obj.unitOfMeasure;
        // 根据当前选中的物料, 获取工艺路线编号
        this.initRouteList(obj.itemCode);
        console.log("CCC: " + this.form.routeList);
      }
    },
    //客户选择弹出框
    onClientSelected(obj) {
      if (obj != undefined && obj != null) {
        this.form.clientId = obj.id;
        this.form.clientCode = obj.clientCode;
        this.form.clientName = obj.clientName;
      }
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
    handleCirculation(row){
      // 获取当前选中Id
      let id = row.id;
      // TODO: 根据当前的Id获取工单信息

      LODOP.PRINT_INIT("流转卡打印");

      // 页面设置
      LODOP.SET_PRINT_PAGESIZE(1, 2100, 2970, "A4");

      // 标题部分（根据需要调整位置和大小）
      LODOP.ADD_PRINT_TEXT(20, 200, 400, 30, "江苏澳美镭射包装材料有限公司");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

      // 表格框架
      LODOP.ADD_PRINT_RECT(60, 50, 700, 900, 0, 1);

      // 表格内容（根据表头信息，构建表格的每一行）

      // 第一行标题
      LODOP.ADD_PRINT_TEXT(70, 60, 200, 20, "流转卡编号");
      LODOP.ADD_PRINT_TEXT(70, 260, 200, 20, "母工单号+X张（X张是要打印的张数）");

      // 第二行标题
      LODOP.ADD_PRINT_TEXT(100, 60, 200, 20, "工单号");
      LODOP.ADD_PRINT_TEXT(100, 260, 200, 20, "母工单单号");

      // 第三行标题
      LODOP.ADD_PRINT_TEXT(130, 60, 200, 20, "产品类型");
      LODOP.ADD_PRINT_TEXT(130, 260, 200, 20, "料号对应的产品分类说明");

// 添加更多工序信息
// 重复上述步骤，为其他工序添加信息

// 预览
      LODOP.PREVIEW();


    },
    handleRowClick(row) {
      // 切换行的选中状态
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectionObj = selection; // 选中项
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
  },
  watch: {
    'form.adjuncts': {
      handler(newVal, oldVal) {
       /* if (newVal == this.form.adjuncts) {
          return;
        }*/
        //若当前为修改页面， 则图片更改就进行数据的更新
        if (this.optType == 'edit' || this.optType == 'view') {
          this.form.adjuncts = newVal;
          // 开始更新工单附件
          updateWorkorderAdjuncts(this.form).then(response => {
            //this.$modal.msgSuccess('附件修改成功');
            return;
          });
        }

      }
    }
  },
};
</script>
<style>
.el-tabs__content {
  padding: 0 !important;
}

.el-tabs--border-card>.el-tabs__content {
  padding: 0 !important;
}
</style>
