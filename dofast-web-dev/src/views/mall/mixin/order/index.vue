<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="销售单编码" prop="saleNo">
        <el-input v-model="queryParams.saleNo" placeholder="请输入销售单编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商城单编码" prop="tradeOrderNo">
        <el-input v-model="queryParams.tradeOrderNo" placeholder="请输入商城订单编码" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入标题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="销售员" prop="salerName">
        <el-input v-model="queryParams.salerName" placeholder="请输入销售员名" size="small"></el-input>
      </el-form-item>
      <el-form-item label="结算方式" prop="settlementMethod">
        <el-select v-model="queryParams.settlementMethod" placeholder="请选择结算方式" clearable size="small"></el-select>
      </el-form-item>
      <el-form-item label="出库单打印" prop="isPrint">
        <el-select v-model="queryParams.isPrint" clearable >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="预计交付时间" prop="estimatedDeliveryTime" label-width="98">
        <el-date-picker v-model="queryParams.estimatedDeliveryTime" style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期"
          end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="订单总金额" prop="price">
        <el-input v-model="queryParams.price" placeholder="请输入订单总金额" clearable @keyup.enter.native="handleQuery" />
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
      <div class="el-form">
        <el-form-item label="订单状态" prop="activeTab" style="width: 100%;white-space: nowrap;">
          <div>
            <template v-for="(tab, i) in this.getDictDatas(DICT_TYPE.TRADE_MIXIN_ORDER_STATUS)">
              <el-tag class="mb-4" v-if="tab.value != activeTab" effect="text" type="info" size="mini" :key="i"
                @click="tabClick(tab)">{{ tab.label }} </el-tag>
              <el-tag class="mb-4" v-if="tab.value == activeTab" effect="dark" size="mini" :key="i">
                {{ tab.label }}
              </el-tag>
            </template>
          </div>
        </el-form-item>
      </div>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <!--      <el-col :span="1.5">-->
      <!--        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['trade:mixin-order:create']">新增 </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['trade:mixin-order:export']">导出 </el-button>-->
      <!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" @sort-change="prso">
      <el-table-column label="订单号" prop="saleNo" width="200px">
        <template v-slot="{ row }">
          <span>{{ row.saleNo }}</span>
          <el-popover placement="top-start" title="相关订单号" width="220" trigger="hover"
            :content="row.tradeOrderNos ? row.tradeOrderNos.join('\n') : ''">
            <el-button type="text" slot="reference">更多</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" width="150px"></el-table-column>
      <el-table-column label="总价" prop="price" width="60px"></el-table-column>
      <el-table-column label="结算方式" prop="settlementMethod" width="90px">
        <template v-slot="{ row }">
          <dict-tag :type="DICT_TYPE.TRADE_MIXIN_SETTLEMENT_METHOD" :value="row.settlementMethod"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column label="收件人信息" prop="address" width="250px">
        <template v-slot="{ row }">
          <div v-html="strs(row.address)"></div>
        </template>
      </el-table-column>
      <el-table-column label="打印状态" align="center" prop="productSalseCount" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-tag type="info" v-if="scope.row.isPrint == '0'">出库单未打印</el-tag><span v-else>出库单已打印</span><br>
          <el-tag type="info" v-if="!scope.row.outboundLabelCount">标签未打印</el-tag><span v-else>标签已打印</span>
        </template>
      </el-table-column>
      <el-table-column label="预计发货时间" prop="estimatedDeliveryTime" width="120px" sortable>
        <template v-slot="{ row }">
          <div>{{ parseTime(row.estimatedDeliveryTime, '{y}-{m}-{d}') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="90px">
        <template v-slot="{ row }">
          <dict-tag :type="DICT_TYPE.TRADE_MIXIN_ORDER_STATUS" :value="row.status"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="170px">
        <template v-slot="{ row }">
          <div>{{ parseTime(row.createTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60px">
        <template v-slot="{ row }">
          <el-button type="text" @click="toMixinOrder(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="销售单编码" prop="saleNo">
          <el-input v-model="form.saleNo" placeholder="请输入销售单编码" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="销售员" prop="saler">
          <el-select v-model="form.saler" placeholder="请选择销售员">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="结算方式" prop="settlementMethod">
          <el-select v-model="form.settlementMethod" placeholder="请选择结算方式">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="预计交付时间" prop="estimatedDeliveryTime">
          <el-date-picker clearable v-model="form.estimatedDeliveryTime" type="date" value-format="timestamp"
            placeholder="选择预计交付时间" />
        </el-form-item>
        <el-form-item label="订单总金额" prop="price">
          <el-input v-model="form.price" placeholder="请输入订单总金额" />
        </el-form-item>
        <el-form-item label="相关商品" prop="goodsList">
          <el-input v-model="form.goodsList" placeholder="请输入相关商品" />
        </el-form-item>
        <el-form-item label="相关图片" prop="pics">
          <el-input v-model="form.pics" placeholder="请输入相关图片" />
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
import { createMixinOrder, updateMixinOrder, deleteMixinOrder, getMixinOrder, getMixinOrderPage, exportMixinOrderExcel } from '@/api/mall/trade/mixinOrder';
import WorkStationTool from '@/views/mes/md/workstation/components/tool.vue';
import WorkStationMachine from '@/views/mes/md/workstation/components/machine.vue';
import Workstationworker from '@/views/mes/md/workstation/components/worker.vue';
import { getOrderList } from '@/api/mall/trade/order.js';
import { getOrderCollectionListByMixinOrderId } from '@/api/mall/trade/orderCollection.js';
import { getOrderRemarkList } from '@/api/mall/trade/orderRemark.js';
import { getWorkorderList } from '@/api/mes/pro/workorder.js';
import { getUser } from '@/api/system/user';
// import {} from '@/api/finance/.js';

export default {
  name: 'MixinOrder',
  props: {
    isMine: {
      type: Boolean,
      default: false,
    },
  },
  components: { Workstationworker, WorkStationMachine, WorkStationTool },
  data() {
    return {
      activeTab: null,
      // 遮罩层
      loading: true,
      current_id: 0,
      current_loading: false,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 销售订单列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        saleNo: null,
        isPrint: null,
        tradeOrderNo: null,
        title: null,
        salerName: null,
        settlementMethod: null,
        estimatedDeliveryTime: [],
        price: '',
        createTime: [],
        sort: 0,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        saler: [{ required: true, message: '销售员不能为空', trigger: 'change' }],
        price: [{ required: true, message: '订单总金额不能为空', trigger: 'blur' }],
      },
      orders: [],
      collections: [],
      remarks: [],
      workorders: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    tabClick(tab) {
      this.activeTab = tab.value;
      this.queryParams.status = tab.value;
      this.getList();
    },
    strs(str) {
      return str.replace(/\n/g, "<br />")
    },
    /** 查询列表 */
    getList() {
      this.current_id = 0;
      this.current_loading = false;
      this.loading = true;
      // 执行查询
      getMixinOrderPage({
        ...this.queryParams,
        ...(this.isMine ? {} : { systemUserId: this.$store.getters.userId }),
      }).then(response => {
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
        saleNo: undefined,
        title: undefined,
        saler: undefined,
        settlementMethod: undefined,
        estimatedDeliveryTime: undefined,
        price: undefined,
        goodsList: undefined,
        pics: undefined,
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
      this.title = '添加销售订单';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getMixinOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改销售订单';
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
          updateMixinOrder(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createMixinOrder(this.form).then(response => {
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
        .confirm('是否确认删除销售订单编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteMixinOrder(id);
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
        .confirm('是否确认导出所有销售订单数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportMixinOrderExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '销售订单.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
    async handleLoadCurrent(item) {
      const id = item.id;
      if (this.current_id == id) {
        this.current_id = 0;
        return;
      }
      this.current_id = id;
      this.current_loading = true;
      this.orders = [];
      this.collections = [];
      this.remarks = [];
      this.workorders = [];
      const [orders, collections, remarks, workorders] = await Promise.all(
        [
          //
          getOrderList.bind(null, { mixinOrderId: id }),
          getOrderCollectionListByMixinOrderId.bind(null, { mixinOrderId: id }),
          getOrderRemarkList.bind(null, { mixin_order_id: id }),
          getWorkorderList.bind(null, { mixinOrderId: id }),
          () =>
            getUser(item.saler).then(({ data: user }) => {
              item.salerName = user.nickname;
              return user;
            }),
        ].map(handle => {
          return handle()
            .then(res => res.data || [])
            .catch(e => []);
        }),
      );
      this.orders = orders;
      this.collections = collections;
      this.remarks = remarks;
      this.workorders = workorders;
      this.current_loading = false;
    },
    toMixinOrder(row) {
      this.$router.push({ name: 'TradeMixinOrderDetail', query: { id: row.id } });
    },
    prso(res) {
      // 预计发货时间排序
      if (res.prop == 'estimatedDeliveryTime') {
        if (res.order == 'ascending') {
          this.queryParams.sort = 1;
        } else if (res.order == 'descending') {
          this.queryParams.sort = 0;
        } else {
          this.queryParams.sort = 1;
        }
      }
      this.getList();
    }
  },
};
</script>
<style>
.mixin-order-card-group>.el-card .el-card__header {
  padding: 5px 10px;
  cursor: pointer;
}

.mixin-order-card-group>.el-card>.el-card__body {
  display: none;
}

.mixin-order-card-group>.el-card>.el-card__body .el-card {
  height: 100%;
}

.mixin-order-card-group>.el-card>.el-card__body .el-card .el-card__body {
  height: 100%;
  overflow-y: auto;
}
</style>
