<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="系列编码" prop="serialNumber">
        <el-input v-model="queryParams.serialNumber" placeholder="请输入系列编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="编码" prop="sn">
        <el-input v-model="queryParams.sn" placeholder="请输入编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="所属公司" prop="company">
        <el-select v-model="queryParams.company" placeholder="请选择所属公司" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称" prop="customer">
        <el-select v-model="queryParams.customer" placeholder="请选择客户名称" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="合同名称" prop="contract">
        <el-select v-model="queryParams.contract" placeholder="请选择合同名称" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-select v-model="queryParams.contact" placeholder="请选择联系人" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-select v-model="queryParams.address" placeholder="请选择联系地址" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="money">
        <el-input v-model="queryParams.money" placeholder="请输入金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="类别" prop="kind">
        <el-select v-model="queryParams.kind" placeholder="请选择类别" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.CASH_INVOICE_KIND)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="种类" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择种类" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="销售类型" prop="saleType">
        <el-select v-model="queryParams.saleType" placeholder="请选择销售类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="税率" prop="taxRate">
        <el-input v-model="queryParams.taxRate" placeholder="请输入税率" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="发票抬头" prop="invoiceTitle">
        <el-input v-model="queryParams.invoiceTitle" placeholder="请输入发票抬头" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="税号" prop="taxNumber">
        <el-input v-model="queryParams.taxNumber" placeholder="请输入税号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="注册地址" prop="registedAddress">
        <el-input v-model="queryParams.registedAddress" placeholder="请输入注册地址" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="queryParams.phone" placeholder="请输入电话" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="开户行" prop="bankName">
        <el-input v-model="queryParams.bankName" placeholder="请输入开户行" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="银行账户" prop="bankAccount">
        <el-input v-model="queryParams.bankAccount" placeholder="请输入银行账户" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="快递名称" prop="express">
        <el-input v-model="queryParams.express" placeholder="请输入快递名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="快递单号" prop="waybill">
        <el-input v-model="queryParams.waybill" placeholder="请输入快递单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="发送方式" prop="sendway">
        <el-input v-model="queryParams.sendway" placeholder="请输入发送方式" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="发送账户" prop="sendAccount">
        <el-input v-model="queryParams.sendAccount" placeholder="请输入发送账户" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="子状态" prop="subStatus">
        <el-select v-model="queryParams.subStatus" placeholder="请选择子状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="queryParams.desc" placeholder="请输入描述" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="收件人" prop="receivedBy">
        <el-input v-model="queryParams.receivedBy" placeholder="请输入收件人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="收件日期" prop="receivedDate">
        <el-date-picker v-model="queryParams.receivedDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="签收人" prop="checkedBy">
        <el-input v-model="queryParams.checkedBy" placeholder="请输入签收人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="签收日期" prop="checkedDate">
        <el-date-picker v-model="queryParams.checkedDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="打印经手人" prop="drawnBy" label-width="82">
        <el-input v-model="queryParams.drawnBy" placeholder="请输入打印经手人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="打印时间" prop="drawnDate">
        <el-date-picker v-model="queryParams.drawnDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="快递人" prop="expressedBy">
        <el-input v-model="queryParams.expressedBy" placeholder="请输入快递人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="快递日期" prop="expressedDate">
        <el-date-picker v-model="queryParams.expressedDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="发票退款人" prop="taxRefundedBy" label-width="82">
        <el-input v-model="queryParams.taxRefundedBy" placeholder="请输入发票退款人" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="发票退款日期" prop="taxRefundedDate" label-width="96">
        <el-date-picker v-model="queryParams.taxRefundedDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <!-- <el-form-item label="租户id" prop="tenandId">
        <el-input v-model="queryParams.tenandId" placeholder="请输入租户id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['finance:cash-invoice:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['finance:cash-invoice:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="发票信息id" align="center" prop="id" />
      <el-table-column label="系列编码" align="center" prop="serialNumber" />
      <el-table-column label="编码" align="center" prop="sn" />
      <el-table-column label="所属公司" align="center" prop="company" />
      <el-table-column label="客户名称" align="center" prop="customer" />
      <el-table-column label="合同名称" align="center" prop="contract" />
      <el-table-column label="联系人" align="center" prop="contact" />
      <el-table-column label="联系地址" align="center" prop="address" />
      <el-table-column label="金额" align="center" prop="money" />
      <el-table-column label="类别" align="center" prop="kind">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.CASH_INVOICE_KIND" :value="scope.row.kind" />
        </template>
      </el-table-column>
      <el-table-column label="种类" align="center" prop="type" />
      <el-table-column label="销售类型" align="center" prop="saleType" />
      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column label="发票抬头" align="center" prop="invoiceTitle" />
      <el-table-column label="税号" align="center" prop="taxNumber" />
      <el-table-column label="注册地址" align="center" prop="registedAddress" />
      <el-table-column label="电话" align="center" prop="phone" />
      <el-table-column label="开户行" align="center" prop="bankName" />
      <el-table-column label="银行账户" align="center" prop="bankAccount" />
      <el-table-column label="快递名称" align="center" prop="express" />
      <el-table-column label="快递单号" align="center" prop="waybill" />
      <el-table-column label="发送方式" align="center" prop="sendway" />
      <el-table-column label="发送账户" align="center" prop="sendAccount" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="子状态" align="center" prop="subStatus" />
      <el-table-column label="描述" align="center" prop="desc" />
      <el-table-column label="收件人" align="center" prop="receivedBy" />
      <el-table-column label="收件日期" align="center" prop="receivedDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.receivedDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签收人" align="center" prop="checkedBy" />
      <el-table-column label="签收日期" align="center" prop="checkedDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.checkedDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打印经手人" align="center" prop="drawnBy" />
      <el-table-column label="打印时间" align="center" prop="drawnDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.drawnDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="快递人" align="center" prop="expressedBy" />
      <el-table-column label="快递日期" align="center" prop="expressedDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.expressedDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票退款人" align="center" prop="taxRefundedBy" />
      <el-table-column label="发票退款日期" align="center" prop="taxRefundedDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.taxRefundedDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户id" align="center" prop="tenandId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['finance:cash-invoice:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['finance:cash-invoice:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="系列编码" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="请输入系列编码" />
        </el-form-item>
        <el-form-item label="编码" prop="sn">
          <el-input v-model="form.sn" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="所属公司" prop="company">
          <el-select v-model="form.company" placeholder="请选择所属公司">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="customer">
          <el-select v-model="form.customer" placeholder="请选择客户名称">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="合同名称" prop="contract">
          <el-select v-model="form.contract" placeholder="请选择合同名称">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-select v-model="form.contact" placeholder="请选择联系人">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-select v-model="form.address" placeholder="请选择联系地址">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="类别" prop="kind">
          <el-select v-model="form.kind" placeholder="请选择类别">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.CASH_INVOICE_KIND)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="种类" prop="type">
          <el-select v-model="form.type" placeholder="请选择种类">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="销售类型" prop="saleType">
          <el-select v-model="form.saleType" placeholder="请选择销售类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="税率" prop="taxRate">
          <el-input v-model="form.taxRate" placeholder="请输入税率" />
        </el-form-item>
        <el-form-item label="发票抬头" prop="invoiceTitle">
          <el-input v-model="form.invoiceTitle" placeholder="请输入发票抬头" />
        </el-form-item>
        <el-form-item label="税号" prop="taxNumber">
          <el-input v-model="form.taxNumber" placeholder="请输入税号" />
        </el-form-item>
        <el-form-item label="注册地址" prop="registedAddress">
          <el-input v-model="form.registedAddress" placeholder="请输入注册地址" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="开户行" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入开户行" />
        </el-form-item>
        <el-form-item label="银行账户" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入银行账户" />
        </el-form-item>
        <el-form-item label="快递名称" prop="express">
          <el-input v-model="form.express" placeholder="请输入快递名称" />
        </el-form-item>
        <el-form-item label="快递单号" prop="waybill">
          <el-input v-model="form.waybill" placeholder="请输入快递单号" />
        </el-form-item>
        <el-form-item label="发送方式" prop="sendway">
          <el-input v-model="form.sendway" placeholder="请输入发送方式" />
        </el-form-item>
        <el-form-item label="发送账户" prop="sendAccount">
          <el-input v-model="form.sendAccount" placeholder="请输入发送账户" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="子状态" prop="subStatus">
          <el-radio-group v-model="form.subStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="收件人" prop="receivedBy">
          <el-input v-model="form.receivedBy" placeholder="请输入收件人" />
        </el-form-item>
        <el-form-item label="收件日期" prop="receivedDate">
          <el-date-picker clearable v-model="form.receivedDate" type="date" value-format="timestamp"
            placeholder="选择收件日期" />
        </el-form-item>
        <el-form-item label="签收人" prop="checkedBy">
          <el-input v-model="form.checkedBy" placeholder="请输入签收人" />
        </el-form-item>
        <el-form-item label="签收日期" prop="checkedDate">
          <el-date-picker clearable v-model="form.checkedDate" type="date" value-format="timestamp"
            placeholder="选择签收日期" />
        </el-form-item>
        <el-form-item label="打印经手人" prop="drawnBy">
          <el-input v-model="form.drawnBy" placeholder="请输入打印经手人" />
        </el-form-item>
        <el-form-item label="打印时间" prop="drawnDate">
          <el-date-picker clearable v-model="form.drawnDate" type="date" value-format="timestamp" placeholder="选择打印时间" />
        </el-form-item>
        <el-form-item label="快递人" prop="expressedBy">
          <el-input v-model="form.expressedBy" placeholder="请输入快递人" />
        </el-form-item>
        <el-form-item label="快递日期" prop="expressedDate">
          <el-date-picker clearable v-model="form.expressedDate" type="date" value-format="timestamp"
            placeholder="选择快递日期" />
        </el-form-item>
        <el-form-item label="发票退款人" prop="taxRefundedBy">
          <el-input v-model="form.taxRefundedBy" placeholder="请输入发票退款人" />
        </el-form-item>
        <el-form-item label="发票退款日期" prop="taxRefundedDate">
          <el-date-picker clearable v-model="form.taxRefundedDate" type="date" value-format="timestamp"
            placeholder="选择发票退款日期" />
        </el-form-item>
        <el-form-item label="租户id" prop="tenandId">
          <el-input v-model="form.tenandId" placeholder="请输入租户id" />
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
import { createCashInvoice, updateCashInvoice, deleteCashInvoice, getCashInvoice, getCashInvoicePage, exportCashInvoiceExcel } from '@/api/finance/cashInvoice';

export default {
  name: 'CashInvoice',
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
      // 发票信息列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        serialNumber: null,
        sn: null,
        company: null,
        customer: null,
        contract: null,
        contact: null,
        address: null,
        money: null,
        kind: null,
        type: null,
        saleType: null,
        taxRate: null,
        invoiceTitle: null,
        taxNumber: null,
        registedAddress: null,
        phone: null,
        bankName: null,
        bankAccount: null,
        express: null,
        waybill: null,
        sendway: null,
        sendAccount: null,
        status: null,
        subStatus: null,
        desc: null,
        receivedBy: null,
        receivedDate: [],
        checkedBy: null,
        checkedDate: [],
        drawnBy: null,
        drawnDate: [],
        expressedBy: null,
        expressedDate: [],
        taxRefundedBy: null,
        taxRefundedDate: [],
        createTime: [],
        tenandId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        serialNumber: [{ required: true, message: '系列编码不能为空', trigger: 'blur' }],
        sn: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
        company: [{ required: true, message: '所属公司不能为空', trigger: 'change' }],
        customer: [{ required: true, message: '客户名称不能为空', trigger: 'change' }],
        contract: [{ required: true, message: '合同名称不能为空', trigger: 'change' }],
        contact: [{ required: true, message: '联系人不能为空', trigger: 'change' }],
        address: [{ required: true, message: '联系地址不能为空', trigger: 'change' }],
        money: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
        kind: [{ required: true, message: '类别不能为空', trigger: 'change' }],
        type: [{ required: true, message: '种类不能为空', trigger: 'change' }],
        saleType: [{ required: true, message: '销售类型不能为空', trigger: 'change' }],
        taxRate: [{ required: true, message: '税率不能为空', trigger: 'blur' }],
        invoiceTitle: [{ required: true, message: '发票抬头不能为空', trigger: 'blur' }],
        taxNumber: [{ required: true, message: '税号不能为空', trigger: 'blur' }],
        registedAddress: [{ required: true, message: '注册地址不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
        bankName: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
        bankAccount: [{ required: true, message: '银行账户不能为空', trigger: 'blur' }],
        express: [{ required: true, message: '快递名称不能为空', trigger: 'blur' }],
        waybill: [{ required: true, message: '快递单号不能为空', trigger: 'blur' }],
        sendway: [{ required: true, message: '发送方式不能为空', trigger: 'blur' }],
        sendAccount: [{ required: true, message: '发送账户不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        subStatus: [{ required: true, message: '子状态不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
        receivedBy: [{ required: true, message: '收件人不能为空', trigger: 'blur' }],
        receivedDate: [{ required: true, message: '收件日期不能为空', trigger: 'blur' }],
        checkedBy: [{ required: true, message: '签收人不能为空', trigger: 'blur' }],
        checkedDate: [{ required: true, message: '签收日期不能为空', trigger: 'blur' }],
        drawnBy: [{ required: true, message: '打印经手人不能为空', trigger: 'blur' }],
        drawnDate: [{ required: true, message: '打印时间不能为空', trigger: 'blur' }],
        expressedBy: [{ required: true, message: '快递人不能为空', trigger: 'blur' }],
        expressedDate: [{ required: true, message: '快递日期不能为空', trigger: 'blur' }],
        taxRefundedBy: [{ required: true, message: '发票退款人不能为空', trigger: 'blur' }],
        taxRefundedDate: [{ required: true, message: '发票退款日期不能为空', trigger: 'blur' }],
        tenandId: [{ required: true, message: '租户id不能为空', trigger: 'blur' }],
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
      getCashInvoicePage(this.queryParams).then(response => {
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
        serialNumber: undefined,
        sn: undefined,
        company: undefined,
        customer: undefined,
        contract: undefined,
        contact: undefined,
        address: undefined,
        money: undefined,
        kind: undefined,
        type: undefined,
        saleType: undefined,
        taxRate: undefined,
        invoiceTitle: undefined,
        taxNumber: undefined,
        registedAddress: undefined,
        phone: undefined,
        bankName: undefined,
        bankAccount: undefined,
        express: undefined,
        waybill: undefined,
        sendway: undefined,
        sendAccount: undefined,
        status: undefined,
        subStatus: undefined,
        desc: undefined,
        receivedBy: undefined,
        receivedDate: undefined,
        checkedBy: undefined,
        checkedDate: undefined,
        drawnBy: undefined,
        drawnDate: undefined,
        expressedBy: undefined,
        expressedDate: undefined,
        taxRefundedBy: undefined,
        taxRefundedDate: undefined,
        tenandId: undefined,
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
      this.title = '添加发票信息';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getCashInvoice(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改发票信息';
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
          updateCashInvoice(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCashInvoice(this.form).then(response => {
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
        .confirm('是否确认删除发票信息编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteCashInvoice(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm('是否确认导出所有发票信息数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportCashInvoiceExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '发票信息.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
  },
};
</script>
