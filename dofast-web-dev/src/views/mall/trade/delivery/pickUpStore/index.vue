<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="门店名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入门店名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="门店简介" prop="introduction">
        <el-input v-model="queryParams.introduction" placeholder="请输入门店简介" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="门店手机" prop="phone">
        <el-input v-model="queryParams.phone" placeholder="请输入门店手机" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="区域编号" prop="areaId">
        <el-input v-model="queryParams.areaId" placeholder="请输入区域编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="门店详细地址" prop="detailAddress">
        <el-input v-model="queryParams.detailAddress" placeholder="请输入门店详细地址" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="门店 logo" prop="logo">
        <el-input v-model="queryParams.logo" placeholder="请输入门店 logo" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="营业开始时间" prop="openingTime" label-width="96px">
        <el-date-picker v-model="queryParams.openingTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="营业结束时间" prop="closingTime" label-width="96px">
        <el-date-picker v-model="queryParams.closingTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <!-- <el-form-item label="纬度" prop="latitude">
        <el-input v-model="queryParams.latitude" placeholder="请输入纬度" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input v-model="queryParams.longitude" placeholder="请输入经度" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="门店状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择门店状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
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
          v-hasPermi="['trade:delivery-pick-up-store:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['trade:delivery-pick-up-store:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="门店名称" align="center" prop="name" />
      <el-table-column label="门店简介" align="center" prop="introduction" />
      <el-table-column label="门店手机" align="center" prop="phone" />
      <el-table-column label="区域编号" align="center" prop="areaId" />
      <el-table-column label="门店详细地址" align="center" prop="detailAddress" />
      <el-table-column label="门店 logo" align="center" prop="logo" />
      <el-table-column label="营业开始时间" align="center" prop="openingTime" />
      <el-table-column label="营业结束时间" align="center" prop="closingTime" />
      <el-table-column label="纬度" align="center" prop="latitude" />
      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="门店状态" align="center" prop="status" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['trade:delivery-pick-up-store:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['trade:delivery-pick-up-store:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="门店简介" prop="introduction">
          <el-input v-model="form.introduction" placeholder="请输入门店简介" />
        </el-form-item>
        <el-form-item label="门店手机" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入门店手机" />
        </el-form-item>
        <el-form-item label="区域编号" prop="areaId">
          <el-input v-model="form.areaId" placeholder="请输入区域编号" />
        </el-form-item>
        <el-form-item label="门店详细地址" prop="detailAddress">
          <el-input v-model="form.detailAddress" placeholder="请输入门店详细地址" />
        </el-form-item>
        <el-form-item label="门店 logo" prop="logo">
          <el-input v-model="form.logo" placeholder="请输入门店 logo" />
        </el-form-item>
        <el-form-item label="营业开始时间" prop="openingTime">
          <el-date-picker clearable v-model="form.openingTime" type="date" value-format="timestamp"
            placeholder="选择营业开始时间" />
        </el-form-item>
        <el-form-item label="营业结束时间" prop="closingTime">
          <el-date-picker clearable v-model="form.closingTime" type="date" value-format="timestamp"
            placeholder="选择营业结束时间" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="门店状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
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
import { createDeliveryPickUpStore, updateDeliveryPickUpStore, deleteDeliveryPickUpStore, getDeliveryPickUpStore, getDeliveryPickUpStorePage, exportDeliveryPickUpStoreExcel } from "@/api/trade/deliveryPickUpStore";

export default {
  name: "PickUpStore",
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
      // 自提门店列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        introduction: null,
        phone: null,
        areaId: null,
        detailAddress: null,
        logo: null,
        openingTime: [],
        closingTime: [],
        latitude: null,
        longitude: null,
        status: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "门店名称不能为空", trigger: "blur" }],
        phone: [{ required: true, message: "门店手机不能为空", trigger: "blur" }],
        areaId: [{ required: true, message: "区域编号不能为空", trigger: "blur" }],
        detailAddress: [{ required: true, message: "门店详细地址不能为空", trigger: "blur" }],
        logo: [{ required: true, message: "门店 logo不能为空", trigger: "blur" }],
        openingTime: [{ required: true, message: "营业开始时间不能为空", trigger: "blur" }],
        closingTime: [{ required: true, message: "营业结束时间不能为空", trigger: "blur" }],
        latitude: [{ required: true, message: "纬度不能为空", trigger: "blur" }],
        longitude: [{ required: true, message: "经度不能为空", trigger: "blur" }],
        status: [{ required: true, message: "门店状态不能为空", trigger: "blur" }],
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
      getDeliveryPickUpStorePage(this.queryParams).then(response => {
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
        name: undefined,
        introduction: undefined,
        phone: undefined,
        areaId: undefined,
        detailAddress: undefined,
        logo: undefined,
        openingTime: undefined,
        closingTime: undefined,
        latitude: undefined,
        longitude: undefined,
        status: undefined,
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
      this.title = "添加自提门店";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getDeliveryPickUpStore(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改自提门店";
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
          updateDeliveryPickUpStore(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createDeliveryPickUpStore(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除自提门店编号为"' + id + '"的数据项?').then(function () {
        return deleteDeliveryPickUpStore(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有自提门店数据项?').then(() => {
        this.exportLoading = true;
        return exportDeliveryPickUpStoreExcel(params);
      }).then(response => {
        this.$download.excel(response, '自提门店.xls');
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
