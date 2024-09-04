<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单号" prop="refOid">
        <el-input v-model="queryParams.refOid" placeholder="请输入相关单ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="店铺编码" prop="posCode">
        <el-input v-model="queryParams.posCode" placeholder="请输入店铺编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="queryParams.mobile" placeholder="请输入手机号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="渠道" prop="refType">
        <el-select v-model="queryParams.refType" placeholder="请选择渠道" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.ORDER_FROM_CHANNEL)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="收货人省" prop="receiverState">
        <el-input v-model="queryParams.receiverState" placeholder="请输入收货人省" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="收货人市" prop="receiverCity">
        <el-input v-model="queryParams.receiverCity" placeholder="请输入收货人市" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="收件区县" prop="receiverDistrict">
        <el-input v-model="queryParams.receiverDistrict" placeholder="请输入收件人区/县" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="买家昵称" prop="openBuyerNick">
        <el-input v-model="queryParams.openBuyerNick" placeholder="请输入买家昵称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="买家Id" prop="openBuyerId">
        <el-input v-model="queryParams.openBuyerId" placeholder="请输入买家昵称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="queryParams.remark" placeholder="请输入备注" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['channel:customer:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['channel:customer:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="订单ID" align="center" prop="id" />
      <el-table-column label="订单号" align="center" prop="refOid" />
      <el-table-column label="店铺编码" align="center" prop="posCode" />
      <el-table-column label="手机号" align="center" prop="mobile" />
      <el-table-column label="渠道" align="center" prop="refType">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.ORDER_FROM_CHANNEL" :value="scope.row.refType" />
        </template>
      </el-table-column>
      <el-table-column label="收货人省" align="center" prop="receiverState" />
      <el-table-column label="收货人市" align="center" prop="receiverCity" />
      <el-table-column label="收件区县" align="center" prop="receiverDistrict" />
      <el-table-column label="收货人镇" align="center" prop="receiverTown" />
      <el-table-column label="买家昵称" align="center" prop="openBuyerNick" />
      <el-table-column label="买家id" align="center" prop="openBuyerId" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['channel:customer:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['channel:customer:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="相关单ID" prop="refOid">
          <el-input v-model="form.refOid" placeholder="请输入相关单ID" />
        </el-form-item>
        <el-form-item label="店铺编码" prop="posCode">
          <el-input v-model="form.posCode" placeholder="请输入店铺编码" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="渠道" prop="refType">
          <el-select v-model="form.refType" placeholder="请选择渠道">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.ORDER_FROM_CHANNEL)" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货人国家" prop="receiverCountry">
          <el-input v-model="form.receiverCountry" placeholder="请输入收货人国家" />
        </el-form-item>
        <el-form-item label="收货人省" prop="receiverState">
          <el-input v-model="form.receiverState" placeholder="请输入收货人省" />
        </el-form-item>
        <el-form-item label="收货人市" prop="receiverCity">
          <el-input v-model="form.receiverCity" placeholder="请输入收货人市" />
        </el-form-item>
        <el-form-item label="收件人区/县" prop="receiverDistrict">
          <el-input v-model="form.receiverDistrict" placeholder="请输入收件人区/县" />
        </el-form-item>
        <el-form-item label="收货人镇" prop="receiverTown">
          <el-input v-model="form.receiverTown" placeholder="请输入收货人镇" />
        </el-form-item>
        <el-form-item label="收货人ID字段，可用于区分多个订单是否属于同一个收货人" prop="receiverId">
          <el-input v-model="form.receiverId" placeholder="请输入收货人ID字段，可用于区分多个订单是否属于同一个收货人" />
        </el-form-item>
        <el-form-item label="买家昵称" prop="openBuyerNick">
          <el-input v-model="form.openBuyerNick" placeholder="请输入买家昵称" />
        </el-form-item>
        <el-form-item label="买家昵称" prop="openBuyerId">
          <el-input v-model="form.openBuyerId" placeholder="请输入买家昵称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="关联收货地址ID" prop="addressId">
          <el-input v-model="form.addressId" placeholder="请输入关联收货地址ID" />
        </el-form-item>
        <el-form-item label="关联用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入关联用户ID" />
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
import { createCustomer, updateCustomer, deleteCustomer, getCustomer, getCustomerPage, exportCustomerExcel } from '@/api/channel/customer';

export default {
  name: 'Customer',
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
      // 交易客户列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        refOid: null,
        posCode: null,
        mobile: null,
        refType: null,
        receiverCountry: null,
        receiverState: null,
        receiverCity: null,
        receiverDistrict: null,
        receiverTown: null,
        receiverId: null,
        openBuyerNick: null,
        openBuyerId: null,
        createTime: [],
        remark: null,
        addressId: null,
        userId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        refOid: [{ required: true, message: '相关单ID不能为空', trigger: 'blur' }],
        posCode: [{ required: true, message: '店铺编码不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        refType: [{ required: true, message: '渠道不能为空', trigger: 'change' }],
        receiverCountry: [{ required: true, message: '收货人国家不能为空', trigger: 'blur' }],
        receiverState: [{ required: true, message: '收货人省不能为空', trigger: 'blur' }],
        receiverCity: [{ required: true, message: '收货人市不能为空', trigger: 'blur' }],
        receiverDistrict: [{ required: true, message: '收件人区/县不能为空', trigger: 'blur' }],
        receiverTown: [{ required: true, message: '收货人镇不能为空', trigger: 'blur' }],
        receiverId: [{ required: true, message: '收货人ID字段，可用于区分多个订单是否属于同一个收货人不能为空', trigger: 'blur' }],
        openBuyerNick: [{ required: true, message: '买家昵称不能为空', trigger: 'blur' }],
        openBuyerId: [{ required: true, message: '买家昵称不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
        // addressId: [{ required: true, message: "关联收货地址ID不能为空", trigger: "blur" }],
        // userId: [{ required: true, message: "关联用户ID不能为空", trigger: "blur" }],
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
      getCustomerPage(this.queryParams).then(response => {
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
        refOid: undefined,
        posCode: undefined,
        mobile: undefined,
        refType: undefined,
        receiverCountry: undefined,
        receiverState: undefined,
        receiverCity: undefined,
        receiverDistrict: undefined,
        receiverTown: undefined,
        receiverId: undefined,
        openBuyerNick: undefined,
        openBuyerId: undefined,
        remark: undefined,
        addressId: undefined,
        userId: undefined,
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
      this.title = '添加交易客户';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getCustomer(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改交易客户';
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
          updateCustomer(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCustomer(this.form).then(response => {
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
        .confirm('是否确认删除交易客户编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteCustomer(id);
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
        .confirm('是否确认导出所有交易客户数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportCustomerExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '交易客户.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
