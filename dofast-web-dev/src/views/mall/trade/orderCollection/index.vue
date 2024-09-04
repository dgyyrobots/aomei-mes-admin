<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="任务类型" prop="typeId">
        <el-select v-model="queryParams.typeId" placeholder="请选择任务类型" clearable @keyup.enter.native="handleQuery">
          <el-option v-for="opt in collectionTypes" :value="opt.id" :label="opt.name" :key="opt.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单号" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入订单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="记录者" prop="recorder">
        <el-input v-model="queryParams.recorder" placeholder="请输入记录者手机号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.TRADE_ORDER_COLLECTION_STATUS)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="记录时间" prop="recordTime">
        <el-date-picker v-model="queryParams.recordTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['trade:order-collection:create']">新增 </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['trade:order-collection:export']">导出 </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="任务类型" align="center" prop="typeName" />
      <el-table-column label="订单" align="center" prop="orderNo">
        <template v-slot="scope">
          <el-link underline @click="$router.push({ name: 'TradeOrderDetail', query: { id: scope.row.orderId } })">
            {{ scope.row.orderNo }}
          </el-link>
        </template>
      </el-table-column>
      <!--      <el-table-column label="记录者" align="center" prop="recorder" />-->
      <el-table-column label="记录" align="center" prop="recordId" width="180">
        <template v-slot="scope">
          <el-link size="mini" type="scope.row.recordId?'primary': 'default'" icon="el-icon-edit" @click="handleUpdateRecord(scope.row)" v-hasPermi="['trade:order-collection:update']">
            {{ scope.row.recordId ? '已记录' : '未记录' }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="记录时间" align="center" prop="recordTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.recordTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.TRADE_ORDER_COLLECTION_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250px">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-eye" @click="handleUpdate(scope.row)" v-hasPermi="['trade:order-collection:delete']">查看 </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdateStatus(scope.row, 'published')" v-hasPermi="['trade:order-collection:update']" v-if="['created'].includes(scope.row.status)">发布 </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdateStatus(scope.row, 'pause')" v-hasPermi="['trade:order-collection:update']" v-if="['published', 'uncollected', 'collected'].includes(scope.row.status)">暂停 </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdateStatus(scope.row, 'applied')" v-hasPermi="['trade:order-collection:update']" v-if="['collected'].includes(scope.row.status)">完成 </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdateStatus(scope.row, 'published')" v-hasPermi="['trade:order-collection:update']" v-if="['pause'].includes(scope.row.status)">启用 </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdateStatus(scope.row, 'expired')" v-hasPermi="['trade:order-collection:update']" v-if="!['cancelled', 'expired'].includes(scope.row.status)">作废 </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['trade:order-collection:delete']">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="任务类型" prop="typeId">
          <el-select v-model="form.typeId" placeholder="请选择任务类型" clearable @keyup.enter.native="handleQuery" :disabled="!!form.id">
            <el-option v-for="opt in collectionTypes" :value="opt.id" :label="opt.name" :key="opt.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单" prop="orderId">
          <div v-if="form.id">{{ form.orderNo }}</div>
          <el-input :value="form.orderId ? form.orderNo : ''" placeholder="请选择订单" readonly v-else>
            <el-button slot="append" @click="handleSelectOrder()" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="记录者" prop="recorder">
          <div v-if="form.id">记录者修改请走流程</div>
          <el-input :value="form.recorder ? form.recorderName : ''" placeholder="请选择记录者" readonly v-else>
            <el-button slot="append" @click="handleSelectRecorder()" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <TradeOrderSelect ref="orderSelect" @onSelected="setOrder"></TradeOrderSelect>
    <MemberSelect ref="memberSelect" @onSelected="setRecorder"></MemberSelect>
    <RecordDialog ref="remarkDialog" @success="setRecord"></RecordDialog>
  </div>
</template>

<script>
import { updateOrderCollectionStatus, createOrderCollection, updateOrderCollection, deleteOrderCollection, getOrderCollection, getOrderCollectionPage, exportOrderCollectionExcel } from '@/api/mall/trade/orderCollection';
import { getOrderCollectionTypeSimpleList } from '@/api/mall/trade/orderCollectionType';
import TradeOrderSelect from '@/components/tradeOrderSelect/single.vue';
import MemberSelect from '@/components/memberSelect/single.vue';
import RecordDialog from './record.vue';

export default {
  name: 'OrderCollection',
  components: { TradeOrderSelect, MemberSelect, RecordDialog },
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
      // 采集任务列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        typeId: null,
        orderId: null,
        orderNo: null,
        recordId: null,
        recorder: null,
        recorderName: null,
        recordTime: [],
        status: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      collectionTypes: [],
      // 表单校验
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        typeId: [{ required: true, message: '任务类型不能为空', trigger: 'blur' }],
        orderId: [{ required: true, message: '订单不能为空', trigger: 'blur' }],
      },
      currentRow: null,
    };
  },
  created() {
    this.getList();
    getOrderCollectionTypeSimpleList().then(res => {
      this.collectionTypes = res.data;
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getOrderCollectionPage(this.queryParams).then(response => {
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
        typeId: undefined,
        orderId: undefined,
        orderNo: undefined,
        recordId: undefined,
        recorder: undefined,
        recorderName: undefined,
        recordTime: undefined,
        status: undefined,
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
      this.title = '添加采集任务';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getOrderCollection(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '查看采集任务';
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
          updateOrderCollection(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createOrderCollection(this.form).then(response => {
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
        .confirm('是否确认删除采集任务编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteOrderCollection(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
    async handleUpdateStatus(row, status) {
      let title = {
        published: '你确定要发布这条任务吗?',
        expired: '你确定要作废这条任务吗?',
        pause: '你确定要暂停这条任务吗?',
        applied: '你确定要接受这条订单吗?',
      }[status];
      if (status == 'published' && row.status == 'pause') {
        title = '你确定要重启这条任务吗';
      }
      await this.$modal.confirm(title);
      await updateOrderCollectionStatus(row.id, status);
      this.getList();
    },
    handleUpdateRecord(row) {
      this.currentRow = row;
      this.$refs.remarkDialog.open(row);
    },
    setRecord(data) {
      console.log(data);
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm('是否确认导出所有采集任务数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportOrderCollectionExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '采集任务.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    handleSelectRecorder() {
      this.$refs.memberSelect.showFlag = true;
    },
    handleSelectOrder() {
      this.$refs.orderSelect.open();
    },
    setRecorder(recorder) {
      this.form.recorder = recorder.id;
      this.form.recorderName = recorder.nickname;
    },
    setOrder(order) {
      this.form.orderId = order.id;
      this.form.orderNo = order.no;
    },
  },
};
</script>
