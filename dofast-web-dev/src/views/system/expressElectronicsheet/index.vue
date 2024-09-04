<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模板名称" prop="templateName">
        <el-input v-model="queryParams.templateName" placeholder="请输入模板名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="物流公司id" prop="companyId">
        <el-input v-model="queryParams.companyId" placeholder="请输入物流公司id" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="物流公司名称" prop="companyName">
        <el-input v-model="queryParams.companyName" placeholder="请输入物流公司名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="编码" prop="expressNo">
        <el-input v-model="queryParams.expressNo" placeholder="请输入编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="CustomerName" prop="customerName">
        <el-input v-model="queryParams.customerName" placeholder="请输入CustomerName" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="CustomerPwd" prop="customerPwd">
        <el-input v-model="queryParams.customerPwd" placeholder="请输入CustomerPwd" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="SendSite" prop="sendSite">
        <el-input v-model="queryParams.sendSite" placeholder="请输入SendSite" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="SendStaff" prop="sendStaff">
        <el-input v-model="queryParams.sendStaff" placeholder="请输入SendStaff" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="MonthCode" prop="monthCode">
        <el-input v-model="queryParams.monthCode" placeholder="请输入MonthCode" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="邮费支付方式（1现付 2到付 3月结）" prop="postagePaymentMethod">
        <el-input v-model="queryParams.postagePaymentMethod" placeholder="请输入邮费支付方式（1现付 2到付 3月结）" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="快递员上门揽件（0否 1是）" prop="isNotice">
        <el-input v-model="queryParams.isNotice" placeholder="请输入快递员上门揽件（0否 1是）" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态（0正常 -1不使用）" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态（0正常 -1不使用）" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否默认（0否 1是）" prop="isDefault">
        <el-input v-model="queryParams.isDefault" placeholder="请输入是否默认（0否 1是）" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="模板风格" prop="printStyle">
        <el-input v-model="queryParams.printStyle" placeholder="请输入模板风格" clearable @keyup.enter.native="handleQuery"/>
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
                   v-hasPermi="['system:express-electronicsheet:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['system:express-electronicsheet:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="自增编码id" align="center" prop="id" />
      <el-table-column label="模板名称" align="center" prop="templateName" />
      <el-table-column label="物流公司名称" align="center" prop="companyName" />
      <el-table-column label="编码" align="center" prop="expressNo" />
      <el-table-column label="CustomerName" align="center" prop="customerName" />
      <el-table-column label="CustomerPwd" align="center" prop="customerPwd" />
      <el-table-column label="MonthCode" align="center" prop="monthCode" />
      <el-table-column label="邮费支付方式（1现付 2到付 3月结）" align="center" prop="postagePaymentMethod" />
      <el-table-column label="状态（0正常 -1不使用）" align="center" prop="status" />
      <el-table-column label="是否默认（0否 1是）" align="center" prop="isDefault" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:express-electronicsheet:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:express-electronicsheet:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="form.templateName" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="物流公司id" prop="companyId">
          <el-input v-model="form.companyId" placeholder="请输入物流公司id" />
        </el-form-item>
        <el-form-item label="物流公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入物流公司名称" />
        </el-form-item>
        <el-form-item label="编码" prop="expressNo">
          <el-input v-model="form.expressNo" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="CustomerName" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入CustomerName" />
        </el-form-item>
        <el-form-item label="CustomerPwd" prop="customerPwd">
          <el-input v-model="form.customerPwd" placeholder="请输入CustomerPwd" />
        </el-form-item>
        <el-form-item label="SendSite" prop="sendSite">
          <el-input v-model="form.sendSite" placeholder="请输入SendSite" />
        </el-form-item>
        <el-form-item label="SendStaff" prop="sendStaff">
          <el-input v-model="form.sendStaff" placeholder="请输入SendStaff" />
        </el-form-item>
        <el-form-item label="MonthCode" prop="monthCode">
          <el-input v-model="form.monthCode" placeholder="请输入MonthCode" />
        </el-form-item>
        <el-form-item label="邮费支付方式（1现付 2到付 3月结）" prop="postagePaymentMethod">
          <el-input v-model="form.postagePaymentMethod" placeholder="请输入邮费支付方式（1现付 2到付 3月结）" />
        </el-form-item>
        <el-form-item label="快递员上门揽件（0否 1是）" prop="isNotice">
          <el-input v-model="form.isNotice" placeholder="请输入快递员上门揽件（0否 1是）" />
        </el-form-item>
        <el-form-item label="状态（0正常 -1不使用）" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否默认（0否 1是）" prop="isDefault">
          <el-input v-model="form.isDefault" placeholder="请输入是否默认（0否 1是）" />
        </el-form-item>
        <el-form-item label="模板风格" prop="printStyle">
          <el-input v-model="form.printStyle" placeholder="请输入模板风格" />
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
import { createExpressElectronicsheet, updateExpressElectronicsheet, deleteExpressElectronicsheet, getExpressElectronicsheet, getExpressElectronicsheetPage, exportExpressElectronicsheetExcel } from "@/api/system/expressElectronicsheet";

export default {
  name: "ExpressElectronicsheet",
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
      // 电子面单列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        templateName: null,
        companyId: null,
        companyName: null,
        expressNo: null,
        customerName: null,
        customerPwd: null,
        sendSite: null,
        sendStaff: null,
        monthCode: null,
        postagePaymentMethod: null,
        isNotice: null,
        status: null,
        isDefault: null,
        printStyle: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        templateName: [{ required: true, message: "模板名称不能为空", trigger: "blur" }],
        companyId: [{ required: true, message: "物流公司id不能为空", trigger: "blur" }],
        companyName: [{ required: true, message: "物流公司名称不能为空", trigger: "blur" }],
        expressNo: [{ required: true, message: "编码不能为空", trigger: "blur" }],
        customerName: [{ required: true, message: "CustomerName不能为空", trigger: "blur" }],
        customerPwd: [{ required: true, message: "CustomerPwd不能为空", trigger: "blur" }],
        sendSite: [{ required: true, message: "SendSite不能为空", trigger: "blur" }],
        sendStaff: [{ required: true, message: "SendStaff不能为空", trigger: "blur" }],
        monthCode: [{ required: true, message: "MonthCode不能为空", trigger: "blur" }],
        postagePaymentMethod: [{ required: true, message: "邮费支付方式（1现付 2到付 3月结）不能为空", trigger: "blur" }],
        isNotice: [{ required: true, message: "快递员上门揽件（0否 1是）不能为空", trigger: "blur" }],
        status: [{ required: true, message: "状态（0正常 -1不使用）不能为空", trigger: "blur" }],
        isDefault: [{ required: true, message: "是否默认（0否 1是）不能为空", trigger: "blur" }],
        printStyle: [{ required: true, message: "模板风格不能为空", trigger: "blur" }],
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
      getExpressElectronicsheetPage(this.queryParams).then(response => {
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
        templateName: undefined,
        companyId: undefined,
        companyName: undefined,
        expressNo: undefined,
        customerName: undefined,
        customerPwd: undefined,
        sendSite: undefined,
        sendStaff: undefined,
        monthCode: undefined,
        postagePaymentMethod: undefined,
        isNotice: undefined,
        status: undefined,
        isDefault: undefined,
        printStyle: undefined,
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
      this.title = "添加电子面单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getExpressElectronicsheet(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改电子面单";
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
          updateExpressElectronicsheet(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createExpressElectronicsheet(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除电子面单编号为"' + id + '"的数据项?').then(function() {
          return deleteExpressElectronicsheet(id);
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
      this.$modal.confirm('是否确认导出所有电子面单数据项?').then(() => {
          this.exportLoading = true;
          return exportExpressElectronicsheetExcel(params);
        }).then(response => {
          this.$download.excel(response, '电子面单.xls');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
