<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="物料编码" prop="itemCode">
        <el-input v-model="queryParams.itemCode" placeholder="请输入产品物料编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="物料名称" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入产品物料名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="批次号" prop="batchesCode">
        <el-input v-model="queryParams.batchesCode" placeholder="请输入检验批次号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="批次" prop="batches">
        <el-input v-model="queryParams.batches" placeholder="请输入检验批次" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="不良发生时间" prop="badTime">
        <el-date-picker v-model="queryParams.badTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
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
                   v-hasPermi="['mes:defective-info:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['mes:defective-info:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleUpdate" :disabled="single"
                   v-hasPermi="['mes:defective-info:update']">修改</el-button>
      </el-col>

      <el-col :span="1.5">

        <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDelete" :disabled="multiple"
                   v-hasPermi="['mes:defective-info:delete']">删除</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="物料编码" align="center" prop="itemCode" />
      <el-table-column label="物料名称" align="center" prop="itemName" />
      <el-table-column label="批次号" align="center" prop="batchesCode" />
      <el-table-column label="批次" align="center" prop="batches" />
      <el-table-column label="不良描述" align="center" prop="badDescription" />
      <el-table-column label="到货数量" align="center" prop="quantity" />
      <el-table-column label="不良数量" align="center" prop="badQuantity" />
      <el-table-column label="抽检数量" align="center" prop="inspectQty" />
      <el-table-column label="故障码名称" align="center" prop="errorCodeName" />
      <el-table-column label="不良发生时间" align="center" prop="badTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.badTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="录入人" align="center" prop="entryPerson" />
      <el-table-column label="录入时间" align="center" prop="entryTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.entryTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="复判人" align="center" prop="reinspector" />
      <el-table-column label="复检日期" align="center" prop="reinspectDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.reinspectDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检验组" align="center" prop="inspectGroup" />
      <el-table-column label="执行状态" align="center" prop="excuteState" />
      <el-table-column label="执行状态代码" align="center" prop="excuteCode" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['mes:defective-info:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['mes:defective-info:delete']">删除</el-button>
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
            <el-form-item label="批次号" prop="batchesCode">
              <el-input v-model="form.batchesCode" placeholder="请输入检验批次号" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="物料料号" prop="itemCode">
              <el-input v-model="form.itemCode" placeholder="请输入物料编码" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="物料名称" prop="itemName">
              <el-input v-model="form.itemName" placeholder="请输入物料名称" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="检验批次" prop="batches">
              <el-input v-model="form.batches" placeholder="请输入检验批次" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="不良描述">
          <editor v-model="form.badDescription" :max-height="150" :height="60"/>
        </el-form-item>


        <el-row>
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

          <el-col :span="6">
            <el-form-item label="抽检数量" prop="inspectQty">
              <el-input v-model="form.inspectQty" placeholder="请输入抽检数量" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="故障码" prop="errorCodeName">
              <el-input v-model="form.errorCodeName" placeholder="请输入故障码名称" />
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>

          <el-col :span="6">
            <el-form-item label="录入人" prop="entryPerson">
              <el-input v-model="form.entryPerson" placeholder="请输入录入人" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="录入时间" prop="entryTime">
              <el-date-picker clearable v-model="form.entryTime" type="date" value-format="timestamp" placeholder="选择录入时间" :style="{ width: '270px' }" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="复判人" prop="reinspector">
              <el-input v-model="form.reinspector" placeholder="请输入复判人" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="不良时间" prop="badTime">
              <el-date-picker clearable v-model="form.badTime" type="date" value-format="timestamp" placeholder="选择不良发生时间" :style="{ width: '270px' }"  />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="6">
            <el-form-item label="复检日期" prop="reinspectDate">
              <el-date-picker clearable v-model="form.reinspectDate" type="date" value-format="timestamp" placeholder="选择复检日期" :style="{ width: '270px' }"  />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="复检结论" prop="reinspectConclusion">
              <el-input v-model="form.reinspectConclusion" placeholder="请输入复检结论" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="检验组" prop="inspectGroup">
              <el-input v-model="form.inspectGroup" placeholder="请输入检验组" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="执行状态" prop="excuteState">
              <el-input v-model="form.excuteState" placeholder="请输入执行状态" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="6">
            <el-form-item label="执行状态码" prop="excuteCode">
              <el-input v-model="form.excuteCode" placeholder="请输入执行状态代码" />
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
import { createDefectiveInfo, updateDefectiveInfo, deleteDefectiveInfo, getDefectiveInfo, getDefectiveInfoPage, exportDefectiveInfoExcel } from "@/api/mes/defectiveInfo";
import Editor from '@/components/Editor';

export default {
  name: "DefectiveInfo",
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
      // 不良品信息管理列表
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
        inspectQty: null,
        errorCodeName: null,
        badTime: [],
        entryPerson: null,
        entryTime: [],
        reinspector: null,
        reinspectDate: [],
        reinspectConclusion: null,
        inspectGroup: null,
        excuteState: null,
        excuteCode: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        quantity: [{ required: true, message: "到货数量不能为空", trigger: "blur" }],
        itemCode: [{ required: true, message: "物料代码不能为空", trigger: "blur" }],
        itemName: [{ required: true, message: "物料名称不能为空", trigger: "blur" }],
        batchesCode: [{ required: true, message: "检验批次号不能为空", trigger: "blur" }],
        batches: [{ required: true, message: "检验批次不能为空", trigger: "blur" }],
        badDescription: [{ required: true, message: "不良描述不能为空", trigger: "blur" }],
        badQuantity: [{ required: true, message: "不良数量不能为空", trigger: "blur" }],
        inspectQty: [{ required: true, message: "抽检数量不能为空", trigger: "blur" }],
        errorCodeName: [{ required: true, message: "故障码名称不能为空", trigger: "blur" }],
        entryPerson: [{ required: true, message: "录入人不能为空", trigger: "blur" }],
        reinspector: [{ required: true, message: "复判人不能为空", trigger: "blur" }],
        reinspectConclusion: [{ required: true, message: "复检结论不能为空", trigger: "blur" }],
        inspectGroup: [{ required: true, message: "检验组不能为空", trigger: "blur" }],
        excuteState: [{ required: true, message: "执行状态不能为空", trigger: "blur" }],
        excuteCode: [{ required: true, message: "执行编码不能为空", trigger: "blur" }],
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
      getDefectiveInfoPage(this.queryParams).then(response => {
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
        inspectQty: undefined,
        errorCodeName: undefined,
        badTime: undefined,
        entryPerson: undefined,
        entryTime: undefined,
        reinspector: undefined,
        reinspectDate: undefined,
        reinspectConclusion: undefined,
        inspectGroup: undefined,
        excuteState: undefined,
        excuteCode: undefined,
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
      this.title = "添加不良品信息管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getDefectiveInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改不良品信息管理";
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
          updateDefectiveInfo(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createDefectiveInfo(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除不良品信息管理编号为"' + id + '"的数据项?').then(function() {
          return deleteDefectiveInfo(id);
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
      this.$modal.confirm('是否确认导出所有不良品信息管理数据项?').then(() => {
          this.exportLoading = true;
          return exportDefectiveInfoExcel(params);
        }).then(response => {
          this.$download.excel(response, '不良品信息管理.xls');
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
