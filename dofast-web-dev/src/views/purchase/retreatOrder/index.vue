<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="仓退单编号" prop="retreatCode">
        <el-input v-model="queryParams.retreatCode" placeholder="请输入仓退单编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="供应商" prop="vendorName">
        <el-input v-model="queryParams.vendorName" placeholder="请输入供应商" clearable @keyup.enter.native="handleQuery"/>
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
                   v-hasPermi="['purchase:order:create']">新增</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['purchase:order:create']">退货</el-button>
      </el-col>

<!--      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['purchase:order:export']">导出</el-button>
      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column label="仓退单编号" align="center" prop="retreatCode" />
      <el-table-column label="仓退单名称" align="center" prop="retreatName" />
      <el-table-column label="供应商编号" align="center" prop="vendorName" />
      <el-table-column label="申请人员" align="center" prop="retreatUser" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['purchase:order:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['purchase:order:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="仓退单编号" prop="retreatCode">
          <el-input v-model="form.retreatCode" placeholder="请输入仓退单编号" />
        </el-form-item>
        <el-form-item label="仓退单名称" prop="retreatName">
          <el-input v-model="form.retreatName" placeholder="请输入仓退单名称" />
        </el-form-item>
        <el-form-item label="供应商编号" prop="vendorName">
          <el-input v-model="form.vendorName" placeholder="请输入供应商编号" />
        </el-form-item>
        <el-form-item label="申请人员" prop="retreatUser">
          <el-input v-model="form.retreatUser" placeholder="请输入申请人员" />
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
import { createOrder, updateOrder, deleteOrder, getOrder, getOrderPage, exportOrderExcel , retreat } from "@/api/purchase/retreatOrder";
import {receiving} from "@/api/purchase/goods";

export default {
  name: "Order",
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
      // ERP仓退单列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      selectedRows: [], // 选中行
      single: false, // 单选
      multiple: false, // 多选
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        retreatCode: null,
        retreatName: null,
        vendorName: null,
        retreatUser: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
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
      getOrderPage(this.queryParams).then(response => {
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
        retreatCode: undefined,
        retreatName: undefined,
        vendorName: undefined,
        retreatUser: undefined,
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
      this.title = "添加ERP仓退单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改ERP仓退单";
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
          updateOrder(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createOrder(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除ERP仓退单编号为"' + id + '"的数据项?').then(function() {
          return deleteOrder(id);
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
      this.$modal.confirm('是否确认导出所有ERP仓退单数据项?').then(() => {
          this.exportLoading = true;
          return exportOrderExcel(params);
        }).then(response => {
          this.$download.excel(response, 'ERP仓退单.xls');
          this.exportLoading = false;
        }).catch(() => {});
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectedRows = selection;
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 执行ERP仓退
    handleRetreat(row){
      // 仅允许选中一行
      if (this.selectedRows.length > 1) {
        this.$modal.msgError("仅允许选中一行");
        return;
      }

      // 获取当前行
      if (this.selectedRows[0].status != 'N') {
        this.$modal.msgError("当前单据已执行仓退!");
        return;
      }

      this.$confirm('确定仓退吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        retreat(obj).then(response => {
          if (response != "success") {
            this.$message.error("仓退失败, 请联系系统管理员, 问题如下: " + response);
            return;
          }
          this.loading = false;
          this.getList();
          this.index = 1;
          this.$message.success('仓退成功');
        });
      });

    }

  }
};
</script>
