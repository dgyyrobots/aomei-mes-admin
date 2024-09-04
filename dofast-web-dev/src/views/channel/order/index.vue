<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="来源渠道" prop="channel">
        <el-select v-model="queryParams.channel" placeholder="请选择来源渠道" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.ORDER_FROM_CHANNEL)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺" prop="shopCode">
        <el-select v-model="queryParams.shopCode" placeholder="请选择店铺" clearable size="small">
          <el-option v-for="shop in shops" :key="shop.id" :label="shop.displayName" :value="shop.shopCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户信息" prop="customKeyword">
        <el-input v-model="queryParams.customKeyword" placeholder="请输入用户手机号/昵称" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" placeholder="请选择订单状态" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.DIAN3_ORDER_STATUS)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间" prop="orderTime">
        <el-date-picker v-model="queryParams.orderTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
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
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['channel:order:export']">导出 </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" :span-method="spanColOne" border stripe>
      <el-table-column label="商品" align="left" :resizable="false">
        <template #header>
          <div>
            <span>订单信息和商品明细</span>
            <span class="fr">单价/数量</span>
          </div>
        </template>
        <template v-slot="{ row: order }">
          <el-row type="flex" align="middle">
            <el-col :span="5"> 订单号：{{ order.refOid }}</el-col>
            <el-col :span="5">下单时间：{{ parseTime(order.orderTime) }}</el-col>
            <el-col :span="5" :offset="2">
              <dict-tag :type="DICT_TYPE.ORDER_FROM_CHANNEL" :value="order.refType" />{{ order.openSellerNick }}
            </el-col>
            <el-col :span="2">订单状态:
              <dict-tag :type="DICT_TYPE.DIAN3_ORDER_STATUS" :value="order.status" />
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="text" :disabled="['CANCEL', 'CLOSE'].includes(order.status)"
                @click="openTradeConvert(order)" v-if="canTranslate(order)">审核认领 </el-button>
              <el-button type="text" @click="openTrade(order)" v-else-if="order.tradeOrderId">已审核详情</el-button>
              <el-button type="text" @click="goToDetail(order)">订单详情</el-button>
            </el-col>
          </el-row>
          <el-table :data="order.orderGoodsDOList || []" :show-header="false" class="w-full" border>
            <el-table-column label="商品/单价/数量" align="right">
              <template v-slot="{ row, $index }">
                <div class="goods-info flex flex-items-center">
                  <div class="w-24 h-24 overflow-hidden grayscale-80" v-if="['CANCEL', 'CLOSE'].includes(order.status)">
                    <img :src="row.picUrl" class="w-full" />
                  </div>
                  <div class="w-24 h-24 overflow-hidden" v-else>
                    <img :src="row.picUrl" class="w-full" />
                  </div>
                  <div class="ellipsis-2 ml-2 flex-1 text-left text-gray-400"
                    v-if="['CANCEL', 'CLOSE'].includes(order.status)" :title="row.title">{{ row.title }}{{ row.standards
                      && row.standards != row.title ? `(${row.standards})` : '' }}</div>
                  <div class="ellipsis-2 ml-2 flex-1 text-left" v-else :title="row.title">{{ row.title }}{{ row.standards
                    && row.standards != row.title ? `(${row.standards})` : '' }}</div>
                  <!-- TODO @小程：下面是商品属性，想当度一行，放在商品名下面 -->
                  <div class="w-32">{{ row.price }}元 x {{ row.num }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实付金额" align="center" prop="totalFee" width="100px"
              :formatter="(_0, _1, value) => `${value}元`" />
            <el-table-column label="买家/收货人" align="center" prop="" width="260px">
              <template>
                <div><span>买家:</span>{{ order.openBuyerNick }}</div>
                <div class="break-keep text-ellipsis"><span>收货人:</span>{{ order.receiverId }}</div>
                <div>
                  {{ order.receiverState }} / {{ order.receiverCity }} / {{ order.receiverDistrict }} /
                  {{ order.receiverTown }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="订单状态" align="status" width="90px">
              <template v-slot="{ row }">
                <div>
                  <dict-tag :type="DICT_TYPE.DIAN3_ORDER_STATUS" :value="row.status" />
                  <br />
                  <dict-tag :type="DICT_TYPE.DIAN3_SUB_REFUND_STATUS" :value="row.refundStatus" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="实付金额" align="center" width="100px" :resizable="false" />
      <el-table-column label="买家/收货人" align="center" width="260px" :resizable="false" />
      <el-table-column label="订单状态" align="center" width="100px" :resizable="false" />
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <ToMiniOrder ref="toMiniOrderRef" @success="getList()" />
  </div>
</template>

<script>
import DictTag from '@/components/DictTag/index.vue';
import ToMiniOrder from './toMiniOrder.vue';
import { getOrderPage, exportOrderExcel } from '@/api/channel/order';
import { getAllShop } from '@/api/channel/shop';

export default {
  name: 'ChannelOrder',
  components: { ToMiniOrder, DictTag },
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
      // 主订单列表
      list: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        channel: '',
        customKeyword: '',
        goodsKeyword: '',
        orderNo: '',
        orderStatus: '',
        shopCode: '',
        orderTime: '',
      },
      shops: [],
    };
  },
  created() {
    this.getShops();
    this.getList();
  },
  methods: {
    canTranslate(order) {
      return !order.isTranslate;
      // return !(order.isTranslate || ['CANCEL', 'CLOSE'].includes(order.status));
    },
    spanColOne({ columnIndex }) {
      return columnIndex ? [0, 0] : [1, 7];
    },
    getShops() {
      getAllShop().then(res => {
        this.shops = res.data || [];
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getOrderPage({
        ...this.queryParams,
        orderTime: undefined,
        startOrderTime: this.queryParams.orderTime[0],
        endOrderTime: this.queryParams.orderTime[1],
      }).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
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
    /** 发货按钮操作 */
    handleShip(row) {
      const id = row.id;
      this.$modal
        .confirm('是否确认删除主订单编号为"' + id + '"的数据项?')
        .then(function () {
          // return deleteOrder(id);
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
        .confirm('是否确认导出所有主订单数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportOrderExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '主订单.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
    goToDetail(row) {
      this.$router.push({ name: 'ChannelOrderDetail', query: { id: row.id } });
    },
    openTrade(row) {
      this.$router.push({ name: 'TradeOrderDetail', query: { id: row.tradeOrderId } });
    },
    openTradeConvert(row) {
      this.$refs.toMiniOrderRef.open(row.id, row);
    },
  },
};
</script>
