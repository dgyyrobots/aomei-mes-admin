<template>
  <div class="app-container order-detail-page">
    <!-- 订单信息 -->
    <el-descriptions title="商城订单信息" v-if="order.tradeOrderId">
      <el-descriptions-item label-class-name="no-colon">
        <el-button type="primary" size="small" @click="toTradeOrder()">前往</el-button>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="订单信息" border label-style="width: 90px;">
      <el-descriptions-item label="买家留言" size="large" :span="3">{{ order.userRemark }}</el-descriptions-item>
      <el-descriptions-item label="商家备注" :span="3">{{ order.remark }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions>
      <el-descriptions-item label="订单标记">
        <dict-tag :type="DICT_TYPE.DIAN3_ORDER_FLAG" :value="order.flag" />
        <!--        {{ order.flag }}-->
      </el-descriptions-item>
      <el-descriptions-item label="订单号">{{ order.no }}</el-descriptions-item>
      <!-- <el-descriptions-item label="配送方式">物流配送</el-descriptions-item> -->
      <!-- TODO 芋艿：待实现 -->
      <!-- <el-descriptions-item label="营销活动">物流配送</el-descriptions-item> -->
      <!-- TODO 芋艿：待实现 -->
      <el-descriptions-item label="订单来源">
        <dict-tag :type="DICT_TYPE.ORDER_FROM_CHANNEL" :value="order.channel" />
        -
        <span>{{ order.channel_shop_name }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="订单类型">
        <dict-tag :type="DICT_TYPE.DIAN3_ORDER_TYPE" :value="order.type" />
      </el-descriptions-item>
      <el-descriptions-item label="订单类型" v-if="order.mark2 && order.mark2.length">
        <dict-tag :type="DICT_TYPE.DIAN3_ORDER_MARK" :value="order.mark2" />
      </el-descriptions-item>
      <el-descriptions-item label="交易类型">
        <dict-tag :type="DICT_TYPE.DIAN3_BUSINESS_TYPE" :value="order.businessType" />
      </el-descriptions-item>
      <!-- <el-descriptions-item label="收货人">{{ order.receiverName }}</el-descriptions-item> -->
      <!-- <el-descriptions-item label="联系电话">{{ order.receiverMobile }}</el-descriptions-item> -->
      <el-descriptions-item label="买家">{{ order.user.nickname }}</el-descriptions-item>
      <el-descriptions-item label="收货地址">
        {{ order.receiverAreaName }} &nbsp; {{ order.receiverDetailAddress }} &nbsp;
        <el-link v-clipboard:copy="order.receiverAreaName + ' ' + order.receiverDetailAddress" v-clipboard:success="clipboardSuccess" icon="el-icon-document-copy" type="primary" />
      </el-descriptions-item>
    </el-descriptions>

    <!-- 订单状态 -->
    <el-descriptions title="订单状态" :column="1">
      <el-descriptions-item label="订单状态">
        <dict-tag :type="DICT_TYPE.DIAN3_ORDER_STATUS" :value="order.status" />
      </el-descriptions-item>
      <el-descriptions-item label-class-name="no-colon">
        <!-- <el-button type="primary" size="small">备注</el-button>
        <el-button type="primary" size="small">转为商城订单</el-button> -->
      </el-descriptions-item>
      <el-descriptions-item label="提醒" label-style="color: red">
        买家付款成功后，货款将直接进入您的商户号（微信、支付宝）<br />
        请及时关注你发出的包裹状态，确保可以配送至买家手中 <br />
        如果买家表示没收到货或货物有问题，请及时联系买家处理，友好协商
      </el-descriptions-item>
    </el-descriptions>

    <!-- 物流信息 TODO -->

    <!-- 商品信息 -->
    <el-descriptions title="商品信息" :column="6">
      <el-descriptions-item labelClassName="no-colon">
        <el-table :data="order.items" border>
          <el-table-column prop="title" label="商品" width="700">
            <template v-slot="{ row }">
              {{ row.title }}
              <el-tag v-if="row.standards && row.standards != row.title"> {{ row.standards }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="原价(元)" width="180">
            <template v-slot="{ row }"> ￥{{ row.price.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="sellPrice" label="售价(元)" width="180">
            <template v-slot="{ row }"> ￥{{ row.sellPrice.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="num" label="数量" width="180" />
          <el-table-column prop="totalSellPrice" label="小计（元）" width="180">
            <template v-slot="{ row }"> ￥{{ row.totalSellPrice.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="refundStatus" label="退款状态">
            <template v-slot="{ row }">
              <dict-tag :type="DICT_TYPE.DIAN3_SUB_REFUND_STATUS" :value="row.refundStatus" />
            </template>
          </el-table-column>
        </el-table>
      </el-descriptions-item>
      <el-descriptions-item v-for="(item, index) in 5" label-class-name="no-colon" :key="item" />

      <el-descriptions-item label="原价合计">￥{{ order.totalPrice.toFixed(2) }}</el-descriptions-item>
      <el-descriptions-item label="售价合计">￥{{ order.totalSellPrice.toFixed(2) }}</el-descriptions-item>
      <el-descriptions-item label="运费金额">￥{{ order.postFee.toFixed(2) }}</el-descriptions-item>
      <el-descriptions-item label="服务费"> ￥{{ order.serviceFee.toFixed(2) }}</el-descriptions-item>
      <el-descriptions-item label="优惠金额"> ￥{{ order.discountFee.toFixed(2) }}</el-descriptions-item>
      <!-- 占位 -->
      <el-descriptions-item v-for="(item, index) in 1" label-class-name="no-colon" :key="item" />
      <!-- 占位 -->
      <el-descriptions-item label="应收金额">￥{{ order.totalFee.toFixed(2) }}</el-descriptions-item>
      <el-descriptions-item label="实付金额">￥{{ order.payment.toFixed(2) }}</el-descriptions-item>
      <el-descriptions-item label="实收金额">￥{{ order.receivedPayment.toFixed(2) }}</el-descriptions-item>
    </el-descriptions>

    <template v-for="(group, index) in detailGroups">
      <el-descriptions v-bind="group.groupProps" :key="`group_${index}`" :title="group.title">
        <!-- 订单操作日志 -->
        <el-descriptions-item v-if="group.key === 'orderTimes'" labelClassName="no-colon">
          <el-timeline>
            <el-timeline-item v-for="(activity, index) in detailInfo[group.key]" :key="index" v-if="activity.show !== false" :timestamp="parseTime(activity.timestamp)">
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-descriptions-item>

        <!-- 物流信息 -->
        <el-descriptions-item v-if="group.key === 'expressInfo' && !!orderDetail.shippingTime" labelClassName="no-colon">
          <el-tabs type="card">
            <!-- 循环包裹物流信息 -->
            <el-tab-pane v-for="(pkgInfo, pInIdx) in detailInfo[group.key]" :key="`pkgInfo_${pInIdx}`" :label="pkgInfo.label">
              <!-- 包裹详情 -->
              <el-descriptions>
                <el-descriptions-item v-for="(pkgChild, pkgCIdx) in group.children" v-bind="pkgChild.childProps" :key="`pkgChild_${pkgCIdx}`" :label="pkgChild.label">
                  <!-- 包裹商品列表 -->
                  <template v-if="pkgChild.valueKey === 'goodsList' && pkgInfo[pkgChild.valueKey]">
                    <div v-for="(goodInfo, goodInfoIdx) in pkgInfo[pkgChild.valueKey]" :key="`goodInfo_${goodInfoIdx}`" style="display: flex">
                      <el-image style="width: 100px; height: 100px; flex: none" :src="goodInfo.imgUrl"></el-image>
                      <el-descriptions :column="1">
                        <el-descriptions-item labelClassName="no-colon">{{ goodInfo.name }}</el-descriptions-item>
                        <el-descriptions-item label="数量">{{ goodInfo.count }}</el-descriptions-item>
                      </el-descriptions>
                    </div>
                  </template>

                  <!-- 包裹物流详情 -->
                  <el-timeline v-else-if="pkgChild.valueKey === 'wlxq'">
                    <el-timeline-item v-for="(activity, index) in pkgInfo[pkgChild.valueKey]" :key="index" :timestamp="activity.timestamp">
                      {{ activity.content }}
                    </el-timeline-item>
                  </el-timeline>

                  <template v-else-if="pkgChild.valueKey === 'wlgs'">
                    <dict-tag :type="DICT_TYPE.SYSTEM_LOGISTICS_PARTNER_CODE" :value="pkgInfo[pkgChild.valueKey]"></dict-tag>
                  </template>
                  <template v-else>
                    {{ pkgInfo[pkgChild.valueKey] }}
                  </template>
                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>
          </el-tabs>
        </el-descriptions-item>
      </el-descriptions>
    </template>
  </div>
</template>

<script>
import { getOrder as getOrderDetail } from '@/api/channel/order';
import { getOrderGoodsListByOrderId } from '@/api/channel/orderGoods';
import { getAreaIdByNames } from '@/api/system/area.js';

export default {
  name: 'TradeOrderDetail',
  data() {
    return {
      detailGroups: [
        {
          title: '物流信息',
          key: 'expressInfo',
          children: [
            { label: '发货时间', valueKey: 'fhsj' },
            { label: '物流公司', valueKey: 'wlgs' },
            { label: '运单号', valueKey: 'ydh' },
            // { label: '物流状态', valueKey: 'wlzt', childProps: { span: 3 } },
            // { label: '物流详情', valueKey: 'wlxq' },
          ],
        },
        {
          title: '订单时间',
          key: 'orderTimes',
        },
      ],
      orderDetail: {
        items: [],
        user: {},
      },
      orderGoods: [],
    };
  },
  computed: {
    order() {
      return {
        ...this.orderDetail,
        items: this.orderGoods,
      };
    },
    detailInfo() {
      return {
        expressInfo: [
          // 物流信息
          {
            label: '包裹1',
            name: 'bg1',
            fhsj: this.parseTime(this.orderDetail.shippingTime), // '2022-11-03 16:50:45',
            wlgs: this.orderDetail.logisticsPartnerCode,
            ydh: this.orderDetail.logisticsOrderNo,
            wlzt: '',
            wlxq: [
              // {
              //   content: '正在派送途中,请您准备签收(派件人:王涛,电话:13854563814)',
              //   timestamp: '2018-04-15 15:00:16',
              // },
              // {
              //   content: '快件到达 【烟台龙口东江村委营业点】',
              //   timestamp: '2018-04-13 14:54:19',
              // },
              // {
              //   content: '快件已发车',
              //   timestamp: '2018-04-11 12:55:52',
              // },
              // {
              //   content: '快件已发车',
              //   timestamp: '2018-04-11 12:55:52',
              // },
              // {
              //   content: '快件已发车',
              //   timestamp: '2018-04-11 12:55:52',
              // },
            ],
          },
        ],
        orderTimes: [
          { content: '同步时间', timestamp: this.orderDetail.createTime, show: !!this.orderDetail.createTime },
          { content: '下单时间', timestamp: this.orderDetail.orderTime, show: !!this.orderDetail.orderTime },
          { content: '支付时间', timestamp: this.orderDetail.payTime, show: !!this.orderDetail.payTime },
          { content: '预计发货时间', timestamp: this.orderDetail.deliveryTime, show: !!this.orderDetail.deliveryTime },
          {
            content: '最晚发货时间',
            timestamp: this.orderDetail.latestDeliveryTime,
            show: !!this.orderDetail.latestDeliveryTime,
          },
          { content: '发货时间', timestamp: this.orderDetail.shippingTime, show: !!this.orderDetail.shippingTime },
          { content: '完成时间', timestamp: this.orderDetail.finishTime, show: !!this.orderDetail.finishTime },
        ],
        // orderLog: [
        //   // 订单操作日志
        //   {
        //     content: '买家【乌鸦】关闭了订单',
        //     timestamp: '2018-04-15 15:00:16',
        //   },
        //   {
        //     content: '买家【乌鸦】下单了',
        //     timestamp: '2018-04-15 15:00:16',
        //   },
        // ],
        goodsInfo: [], // 商品详情tableData
      };
    },
  },
  created() {
    this.$watch(
      () => this.$route.query.id,
      v => {
        if (v) {
          this.getDetail();
        }
      },
      { immediate: true },
    );
  },
  methods: {
    toTradeOrder() {
      this.$router.push({ name: 'TradeOrderDetail', query: { id: this.order.tradeOrderId } });
    },
    getDetail() {
      this.orderDetail = {
        items: [],
        user: {},
      };
      this.orderGoods = [];
      if (this.$route.query.id <= 0) {
        return;
      }
      getOrderDetail(this.$route.query.id).then(({ data }) => {
        if (!data) {
          return;
        }
        getOrderGoodsListByOrderId(data.refOid).then(({ data }) => {
          this.orderGoods = (data || []).map(item => {
            return {
              ...item,
            };
          });
        });
        this.orderDetail = {
          ...data,
          id: data.id,
          isTranslate: data.isTranslate,
          trade_order_id: data.trade_order_id,
          channel_order_id: data.id,
          no: data.refOid,
          channel_order_no: data.refOid,
          createTime: data.createTime,
          // type: 30,
          type: data.type,
          mark2: JSON.parse(data.mark2),
          channel: data.refType,
          channel_shop_id: data.posCode,
          channel_shop_name: data.openSellerNick,
          terminal: 10,
          userId: data.openBuyerId,
          userIp: '',
          userRemark: data.buyerMemo,
          status: data.status,
          productCount: 0,
          orderTime: data.orderTime,
          finishTime: data.finishTime,
          cancelTime: data.status == 'CANCEL' ? data.modifyTime : null,
          cancelType: null,
          remark: data.sellerMemo,
          payOrderId: null,
          payed: data.payTime > 0,
          payTime: data.payTime,
          payChannelCode: '',
          originalPrice: data.totalPrice * 100,
          orderPrice: data.totalSellPrice * 100,
          discountPrice: data.discountFee * 100,
          deliveryPrice: data.postFee * 100,
          adjustPrice: 0,
          payPrice: data.payment * 100,
          tenantId: data.tenantId,
          deliveryTemplateId: null,
          logisticsId: data.logisticsPartnerCode,
          logisticsNo: data.logisticsOrderNo,
          deliveryStatus: 0,
          deliveryTime: data.shippingTime,
          receiveTime: null,
          receiverName: data.receiverName,
          receiverMobile: data.receiverMobile,
          receiverAreaId: getAreaIdByNames([data.receiverState, data.receiverCity, data.receiverDistrict]),
          receiverPostCode: 0,
          receiverDetailAddress: data.receiverTown + (data.receiverDetailAddress || ''),
          afterSaleStatus: data.refundStatus,
          refundPrice: 0,
          couponId: null,
          couponPrice: 0,
          pointPrice: 0,
          receiverAreaName: [data.receiverState, data.receiverCity, data.receiverDistrict, data.receiverTown].join(' '),
          items: [],
          user: {
            id: data.openBuyerId,
            nickname: data.openBuyerNick,
            avatar: null,
          },
        };
      });
    },
    clipboardSuccess() {
      this.$modal.msgSuccess('复制成功');
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-descriptions) {
  &:not(:nth-child(1)) {
    margin-top: 20px;
  }

  .el-descriptions__title {
    display: flex;
    align-items: center;

    &::before {
      content: '';
      display: inline-block;
      margin-right: 10px;
      width: 3px;
      height: 20px;
      background-color: #409eff;
    }
  }

  .el-descriptions-item__container {
    margin: 0 10px;

    .no-colon {
      margin: 0;

      &::after {
        content: '';
      }
    }
  }
}
</style>
