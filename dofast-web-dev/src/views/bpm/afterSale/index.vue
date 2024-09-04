<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="关联业务" prop="associatedBusiness">
        <el-input v-model="queryParams.associatedBusiness" placeholder="请输入关联业务" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="业务数据" prop="businessData">
        <el-input v-model="queryParams.businessData" placeholder="请输入业务数据" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="关联对象" prop="associatedObjects">
        <el-input v-model="queryParams.associatedObjects" placeholder="请输入关联对象" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="对象名称" prop="objectName">
        <el-input v-model="queryParams.objectName" placeholder="请输入对象名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="关联店铺" prop="associatedStores">
        <el-input v-model="queryParams.associatedStores" placeholder="请输入关联店铺" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="关联仓库" prop="associatedRepository">
        <el-input v-model="queryParams.associatedRepository" placeholder="请输入关联仓库" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="关联金额" prop="associatedAmounts">
        <el-input v-model="queryParams.associatedAmounts" placeholder="请输入关联金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        <el-input v-model="queryParams.priority" placeholder="请输入优先级" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="添加抄送" prop="addCopy">
        <el-input v-model="queryParams.addCopy" placeholder="请输入添加抄送" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->

      <el-form-item label="截止时间" prop="deadline">
        <el-input v-model="queryParams.deadline" placeholder="请输入截止时间" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="标记" prop="remark">
        <el-input v-model="queryParams.remark" placeholder="请输入标记" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="事务类别" prop="transactionCategory">
        <el-input v-model="queryParams.transactionCategory" placeholder="请输入事务类别" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="事务标题" prop="transactionTitle">
        <el-input v-model="queryParams.transactionTitle" placeholder="请输入事务标题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="主要负责人" prop="mainPersonResponsible">
        <el-input v-model="queryParams.mainPersonResponsible" placeholder="请输入主要负责人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="图片" prop="picture">
        <el-input v-model="queryParams.picture" placeholder="请输入图片" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="售后结果" prop="result">
        <el-input v-model="queryParams.result" placeholder="请输入售后结果" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="流程实例的编号" prop="processInstanceId">
        <el-input v-model="queryParams.processInstanceId" placeholder="请输入流程实例的编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <!-- <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['bpm:after-sale:create']">新建</el-button> -->
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['bpm:after-sale:create']">发起售后</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['bpm:after-sale:export']">导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <!-- <el-table-column label="售后表单主键" align="center" prop="id" /> -->
      <el-table-column label="事务标题" align="center" prop="transactionTitle" />
      <el-table-column label="事务类别" align="center" prop="transactionCategory">
        <!-- <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.TRADE_AFTER_SALE_TYPE" :value="scope.row.transactionCategory" />
        </template> -->
      </el-table-column>

      <el-table-column label="主要负责人" align="center" prop="mainPersonResponsible" />
      <el-table-column label="关联业务" align="center" prop="associatedBusiness" />
      <el-table-column label="业务数据" align="center" prop="businessData" />
      <!-- <el-table-column label="关联对象" align="center" prop="associatedObjects" />
      <el-table-column label="对象名称" align="center" prop="objectName" />
      <el-table-column label="关联店铺" align="center" prop="associatedStores" />
      <el-table-column label="关联仓库" align="center" prop="associatedRepository" />
      <el-table-column label="关联金额" align="center" prop="associatedAmounts" /> -->
      <!-- <el-table-column label="事务类别" align="center" prop="transactionCategory" /> -->
      <el-table-column label="优先级" align="center" prop="priority" />
      <!-- <el-table-column label="添加抄送" align="center" prop="addCopy" /> -->
      <el-table-column label="截止时间" align="center" prop="deadline" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.deadline) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="标记" align="center" prop="remark" /> -->

      <!-- <el-table-column label="事务内容" align="center" prop="transactionContent" /> -->
      <el-table-column label="申请时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="图片" align="center" prop="picture">
        <template v-slot="scope">
          <template v-if="scope.row.picture">
            <template v-for="(item, index) in  scope.row.picture.split(',')">
              <input type="image" :src="item" alt="" :key="index" style="width: 50px;height: 50px;">
            </template>
          </template>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="售后结果" align="center" prop="result" /> -->
      <!-- <el-table-column label="状态" align="center" prop="result"> -->
      <!-- <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT" :value="scope.row.result" />
        </template> -->
      <!-- </el-table-column> -->
      <!-- <el-table-column label="流程实例的编号" align="center" prop="processInstanceId" /> -->
      <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="300px">
        <template v-slot="scope">
          <!-- v-if="scope.row.result === 1" -->
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleCancel(scope.row)" v-hasPermi="['bpm:after-sale:create']">取消售后</el-button>
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)" v-hasPermi="['bpm:after-sale:query']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleProcessDetail(scope.row)">审批进度</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['bpm:after-sale:update']">修改</el-button> -->
          <!-- v-if="scope.row.result !== 1" -->
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['bpm:after-sale:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <!-- <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="事务类别" prop="transactionCategory">
          <el-input v-model="form.transactionCategory" placeholder="请输入事务类别" />
        </el-form-item>
        <el-form-item label="主要负责人" prop="mainPersonResponsible">
          <el-input v-model="form.mainPersonResponsible" placeholder="请输入主要负责人" />
        </el-form-item>
        <el-form-item label="事务标题" prop="transactionTitle">
          <el-input v-model="form.transactionTitle" placeholder="请输入事务标题" />
        </el-form-item>
        <el-form-item label="事务内容">
          <editor v-model="form.transactionContent" :min-height="192" />
        </el-form-item> -->

      <!-- <el-form-item label="关联业务" prop="associatedBusiness">
          <el-input v-model="form.associatedBusiness" placeholder="请输入关联业务" />
        </el-form-item>
        <el-form-item label="业务数据" prop="businessData">
          <el-input v-model="form.businessData" placeholder="请输入业务数据" />
        </el-form-item>
        <el-form-item label="关联对象" prop="associatedObjects">
          <el-input v-model="form.associatedObjects" placeholder="请输入关联对象" />
        </el-form-item>
        <el-form-item label="对象名称" prop="objectName">
          <el-input v-model="form.objectName" placeholder="请输入对象名称" />
        </el-form-item>
        <el-form-item label="关联店铺" prop="associatedStores">
          <el-input v-model="form.associatedStores" placeholder="请输入关联店铺" />
        </el-form-item>
        <el-form-item label="关联仓库" prop="associatedRepository">
          <el-input v-model="form.associatedRepository" placeholder="请输入关联仓库" />
        </el-form-item>
        <el-form-item label="关联金额" prop="associatedAmounts">
          <el-input v-model="form.associatedAmounts" placeholder="请输入关联金额" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input v-model="form.priority" placeholder="请输入优先级" />
        </el-form-item>
        <el-form-item label="添加抄送" prop="addCopy">
          <el-input v-model="form.addCopy" placeholder="请输入添加抄送" />
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-input v-model="form.deadline" placeholder="请输入截止时间" />
        </el-form-item>
        <el-form-item label="标记" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入标记" />
        </el-form-item>
        <el-form-item label="图片" prop="picture">
          <el-input v-model="form.picture" placeholder="请输入图片" />
        </el-form-item>
        <el-form-item label="售后结果" prop="result">
          <el-input v-model="form.result" placeholder="请输入售后结果" />
        </el-form-item>
        <el-form-item label="流程实例的编号" prop="processInstanceId">
          <el-input v-model="form.processInstanceId" placeholder="请输入流程实例的编号" />
        </el-form-item> -->
      <!-- </el-form> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createAfterSale, updateAfterSale, deleteAfterSale, getAfterSale, getAfterSalePage, exportAfterSaleExcel } from '@/api/bpm/afterSale';
import Editor from '@/components/Editor';
import { cancelProcessInstance } from '@/api/bpm/processInstance';
import { getDictDatas, DICT_TYPE } from '@/utils/dict';
export default {
  name: 'AfterSale',
  components: {
    Editor,
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
      // 售后流程表单列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        associatedBusiness: null,
        businessData: null,
        associatedObjects: null,
        objectName: null,
        associatedStores: null,
        associatedRepository: null,
        associatedAmounts: null,
        transactionCategory: null,
        priority: null,
        addCopy: null,
        mainPersonResponsible: null,
        deadline: null,
        remark: null,
        transactionTitle: null,
        transactionContent: null,
        picture: null,
        result: null,
        processInstanceId: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        transactionCategory: [{ required: true, message: '事务类别不能为空', trigger: 'blur' }],
        mainPersonResponsible: [{ required: true, message: '主要负责人不能为空', trigger: 'blur' }],
        transactionTitle: [{ required: true, message: '事务标题不能为空', trigger: 'blur' }],
        transactionContent: [{ required: true, message: '事务内容不能为空', trigger: 'blur' }],
        result: [{ required: true, message: '售后结果不能为空', trigger: 'blur' }],
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
      getAfterSalePage(this.queryParams).then(response => {
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
        associatedBusiness: undefined,
        businessData: undefined,
        associatedObjects: undefined,
        objectName: undefined,
        associatedStores: undefined,
        associatedRepository: undefined,
        associatedAmounts: undefined,
        transactionCategory: undefined,
        priority: undefined,
        addCopy: undefined,
        mainPersonResponsible: undefined,
        deadline: undefined,
        remark: undefined,
        transactionTitle: undefined,
        transactionContent: undefined,
        picture: undefined,
        result: undefined,
        processInstanceId: undefined,
      };
      this.resetForm('form');
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.$router.push({ name: 'BpmAfterSaleeDetail', query: { id: row.id } });
    },
    /** 查看审批进度的操作 */
    handleProcessDetail(row) {
      this.$router.push({ name: 'BpmProcessInstanceDetail', query: { id: row.processInstanceId } });
    },
    /** 取消流程 */
    handleCancel(row) {
      const id = row.processInstanceId;
      this.$prompt('请输入取消原因？', '取消流程', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // 判断非空，且非空格
        inputErrorMessage: '取消原因不能为空',
      })
        .then(({ value }) => {
          return cancelProcessInstance(id, value);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('取消成功');
        });
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
      this.$router.push({ name: 'BpmAfterSaleCreate' });
      // this.reset();
      // this.open = true;
      // this.title = "添加售后流程表单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getAfterSale(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改售后流程表单';
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
          updateAfterSale(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createAfterSale(this.form).then(response => {
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
        .confirm('是否确认删除售后流程表单编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteAfterSale(id);
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
        .confirm('是否确认导出所有售后流程表单数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportAfterSaleExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '售后流程表单.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
