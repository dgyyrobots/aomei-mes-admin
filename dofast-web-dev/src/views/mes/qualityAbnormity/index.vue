<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="工单号" prop="orderNum">
        <el-input v-model="queryParams.orderNum" placeholder="请输入工单号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="物料编码" prop="itemCode">
        <el-input v-model="queryParams.itemCode" placeholder="请输入产品物料编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="物料名称" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入产品物料名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="不良代码" prop="badCode">
        <el-input v-model="queryParams.badCode" placeholder="请输入不良代码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="检测日期" prop="inspectDate">
        <el-date-picker v-model="queryParams.inspectDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>

      <el-form-item label="复检日期" prop="reinspectDate">
        <el-date-picker v-model="queryParams.reinspectDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
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
                   v-hasPermi="['mes:quality-abnormity:create']">新增</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleUpdate" :disabled="single"
                   v-hasPermi="['mes:quality-abnormity:update']">修改</el-button>
      </el-col>

      <el-col :span="1.5">

        <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDelete" :disabled="multiple"
                   v-hasPermi="['mes:quality-abnormity:delete']">删除</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['mes:quality-abnormity:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工单号" align="center" prop="orderNum" />
      <el-table-column label="物料编码" align="center" prop="itemCode" />
      <el-table-column label="物料名称" align="center" prop="itemName" />
      <el-table-column label="检验批次号" align="center" prop="batchesCode" />
      <el-table-column label="检验批次" align="center" prop="batches" />
      <el-table-column label="销售单号" align="center" prop="saleNum" />

      <el-table-column label="到货数量" align="center" prop="quantity" />
      <el-table-column label="不良数量" align="center" prop="badQuantity" />
      <el-table-column label="不良代码" align="center" prop="badCode" />
      <el-table-column label="检测日期" align="center" prop="inspectDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.inspectDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测人员" align="center" prop="inspector" />
      <el-table-column label="不良描述" align="center" prop="badDescription" />
      <el-table-column label="复检日期" align="center" prop="reinspectDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.reinspectDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="复检人员" align="center" prop="reinspector" />
      <el-table-column label="复检结论" align="center" prop="reinspectConclusion" />
      <el-table-column label="检验组" align="center" prop="inspectGroup" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['mes:quality-abnormity:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['mes:quality-abnormity:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="75%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-row>
          <el-col :span="6">
            <el-form-item label="物料编码" prop="itemCode">
              <el-input v-model="form.itemCode" placeholder="请输入物料编码" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="物料名称" prop="itemName">
              <el-input v-model="form.itemName" placeholder="请输入物料名称" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="工单号" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入工单号" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="销售单号" prop="saleNum">
              <el-input v-model="form.saleNum" placeholder="请输入销售单号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="批次" prop="batches">
              <el-input v-model="form.batches" placeholder="请输入检验批次" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="批次号" prop="batchesCode">
              <el-input v-model="form.batchesCode" placeholder="请输入检验批次号" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="到货数量" prop="quantity">
              <el-input v-model="form.quantity" placeholder="请输入到货数量	" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="不良数量" prop="badQuantity">
              <el-input v-model="form.badQuantity" placeholder="请输入不良数量" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
        <el-form-item label="不良描述">
          <editor v-model="form.badDescription" :max-height="150" :height="60" />
        </el-form-item>
        </el-row>
        <el-row>

          <el-col :span="6">
          <el-form-item label="不良代码" prop="badCode">
            <el-input v-model="form.badCode" placeholder="请输入不良代码" />
          </el-form-item>
        </el-col>

          <el-col :span="6">
            <el-form-item label="检测人员" prop="inspector">
              <el-input v-model="form.inspector" placeholder="请输入检测人员" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="检测日期" prop="inspectDate">
              <el-date-picker clearable :style="{ width: '270px' }"  v-model="form.inspectDate" type="date" value-format="timestamp" placeholder="选择检测日期" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="检验组" prop="inspectGroup">
              <el-input v-model="form.inspectGroup" placeholder="请输入检验组" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="复检人员" prop="reinspector">
              <el-input v-model="form.reinspector" placeholder="请输入复检人员" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="复检日期" prop="reinspectDate">
              <el-date-picker  :style="{ width: '270px' }" clearable v-model="form.reinspectDate" type="date" value-format="timestamp" placeholder="选择复检日期" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="复检结论" prop="reinspectConclusion">
              <el-input v-model="form.reinspectConclusion" placeholder="请输入复检结论" />
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createQualityAbnormity, updateQualityAbnormity, deleteQualityAbnormity, getQualityAbnormity, getQualityAbnormityPage, exportQualityAbnormityExcel } from "@/api/mes/qualityAbnormity";
import Editor from '@/components/Editor';

export default {
  name: "QualityAbnormity",
  components: {
    Editor
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
      // 品质异常信息列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        createTime: [],
        itemCode: null,
        itemName: null,
        batchesCode: null,
        batches: null,
        badDescription: null,
        quantity: null,
        badQuantity: null,
        badCode: null,
        inspectDate: [],
        inspector: null,
        reinspectDate: [],
        reinspector: null,
        reinspectConclusion: null,
        orderNum: null,
        saleNum: null,
        inspectGroup: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        quantity: [{ required: true, message: "到货数量不能为空", trigger: "blur" }],
        itemCode: [{ required: true, message: "物料料号不能为空", trigger: "blur" }],
        itemName: [{ required: true, message: "物料名称不能为空", trigger: "blur" }],
        batchesCode: [{ required: true, message: "批次号不能为空", trigger: "blur" }],
        batches: [{ required: true, message: "批次不能为空", trigger: "blur" }],
        badQuantity: [{ required: true, message: "不良数量不能为空", trigger: "blur" }],
        badCode: [{ required: true, message: "不良代码不能为空", trigger: "blur" }],
        orderNum: [{ required: true, message: "工单号不能为空", trigger: "blur" }],
        saleNum: [{ required: true, message: "销售单号不能为空", trigger: "blur" }],
      },
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
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
      getQualityAbnormityPage(this.queryParams).then(response => {
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
        itemCode: undefined,
        itemName: undefined,
        batchesCode: undefined,
        batches: undefined,
        badDescription: undefined,
        quantity: undefined,
        badQuantity: undefined,
        badCode: undefined,
        inspectDate: undefined,
        inspector: undefined,
        reinspectDate: undefined,
        reinspector: undefined,
        reinspectConclusion: undefined,
        orderNum: undefined,
        saleNum: undefined,
        inspectGroup: undefined,
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
      this.title = "添加品质异常信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getQualityAbnormity(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改品质异常信息";
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
          updateQualityAbnormity(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createQualityAbnormity(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除工单号为"' + orderNum + '"的数据项?').then(function() {
          return deleteQualityAbnormity(id);
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
      this.$modal.confirm('是否确认导出所有品质异常信息数据项?').then(() => {
          this.exportLoading = true;
          return exportQualityAbnormityExcel(params);
        }).then(response => {
          this.$download.excel(response, '品质异常信息.xls');
          this.exportLoading = false;
        }).catch(() => {});
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

  }
};
</script>
