<template>
  <easy-panel @refresh="getList()">
    <el-table v-if="list && list.length" v-loading="loading" :data="list" :show-header="false" class="order-table">
      <el-table-column>
        <template v-slot="{ row }">
          <el-row type="flex" align="middle">
            <el-col :span="5"> 订单号：{{ row.no }}</el-col>
            <el-col :span="5">下单时间：{{ parseTime(row.createTime) }}</el-col>
            <el-col :span="4">订单来源：
              <dict-tag :type="DICT_TYPE.TERMINAL" :value="row.terminal" v-if="row.type != 30" />
              <div v-else>{{ row.channel_shop_name }}</div>
            </el-col>
            <el-col :span="4">支付方式：
              <dict-tag v-if="row.payChannelCode" :type="DICT_TYPE.PAY_CHANNEL_CODE_TYPE" :value="row.payChannelCode" />
              <span v-else>未支付</span>
            </el-col>
            <!-- TODO 芋艿：待实现 -->
            <el-col :span="6">
              <el-button type="primary" size="small" @click="sendExpress(row)" style="margin-left: auto;display: block;"
                v-if="[TradeOrderStatusEnum.UNDELIVERED.status].includes(row.status)">发货
              </el-button>
              <OrderExpress ref="orderExpress" @success="loadOrder" :type="row.deliveryType"></OrderExpress>
            </el-col>
          </el-row>
          <!-- 订单下的商品 -->
          <el-table :data="row.items" border :show-header="true" :span-method="spanPublicFields.bind(this, row.items)">
            <el-table-column label="商品" prop="goods" header-align="center" width="auto" min-width="300">
              <template v-slot="{ row, $index }">
                <div class="goods-info">
                  <img :src="row.picUrl" />
                  <span class="ellipsis-2" :title="row.spuName">{{ row.spuName }}</span>
                  <!-- TODO @小程：下面是商品属性，想当度一行，放在商品名下面 -->
                  <el-tag size="medium" v-for="property in row.properties" :key="property.propertyId"> {{
                    property.propertyName }}：{{ property.valueName }} </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价(元)/数量" prop="fee" align="center" width="115">
              <template v-slot="{ row }">
                <div>￥{{ (row.originalUnitPrice / 100.0).toFixed(2) }}</div>
                <div>{{ row.count }} 件</div>
              </template>
            </el-table-column>
            <!-- TODO @小程：这里应该是一个订单下，多个商品，只展示订单上的总金额，就是 order.payPrice -->
            <el-table-column label="实付金额(元)" prop="amount" align="center" width="100">
              <template v-slot="{ $index }">
                <div v-if="$index == 0">￥{{ row.payPrice }}</div>
              </template>
            </el-table-column>
            <!-- TODO @小程：这里应该是一个订单下，多个商品，只展示订单上的收件信息；使用 order.receiverXXX 开头的字段 -->
            <el-table-column label="买家/收货人" prop="buyer" header-align="center" width="auto" min-width="300">
              <template v-slot="{ $index }">
                <div v-if="$index == 0">
                  <!-- TODO @芋艿：以后增加一个会员详情界面 -->
                  <div :data-id="row.userId">{{ row.buyer }}</div>
                  <div>{{ row.receiverName }}{{ row.receiverMobile }}</div>
                  <div class="ellipsis-2" :title="row.address">
                    {{ row.receiverAreaName }}
                    {{ row.receiverDetailAddress }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- TODO @小程：这里应该是一个订单下，多个商品，交易状态是统一的；使用 order.status 字段 -->
            <el-table-column label="交易状态" prop="status" align="center" width="100">
              <template v-slot="{ $index }">
                <dict-tag v-if="$index == 0" :type="DICT_TYPE.TRADE_ORDER_STATUS" :value="row.status + ''"></dict-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </easy-panel>
</template>
<script>
import easyPanel from './easy-panel.vue';
import { getOrderList } from '@/api/mall/trade/order.js';
import { TradeOrderStatusEnum } from '@/utils/constants.js';
import OrderExpress from '@/views/mall/trade/order/components/express.vue';
export default {
  props: ['orderId', 'gx'],
  components: {
    easyPanel,
    OrderExpress
  },
  data() {
    return {
      loading: false,
      list: [],
      TradeOrderStatusEnum,
      order: {
        items: [],
        user: {},
      },
    };
  },
  watch: {
    orderId: {
      handler: 'getList',
      immediate: true,
    },
  },
  methods: {
    loadOrder() {
      this.gx();
    },
    sendExpress(row) {
      console.log(row);
      this.$refs.orderExpress.open(row.id, row.items, row);
    },
    getList() {
      if (!this.orderId) {
        this.list = [];
        return;
      }
      getOrderList({
        mixinOrderId: this.orderId,
      }).then(res => {
        this.list = res.data;
      });
    },
    spanPublicFields(rows, { row, column, rowIndex, columnIndex }) {
      if (['buyer', 'amount', 'status'].includes(column.property)) {
        return rowIndex == 0 ? [rows.length, 1] : [0, 0];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .order-table {
  border-bottom: none;

  &::before {
    height: 0;
  }

  .el-table__row {
    .el-table__cell {
      border-bottom: none;

      .cell {
        .el-table {
          .el-table__row {
            >.el-table__cell {
              .goods-info {
                display: flex;

                img {
                  margin-right: 10px;
                  width: 60px;
                  height: 60px;
                  border: 1px solid #e2e2e2;
                }
              }

              .ellipsis-2 {
                display: -webkit-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
                -webkit-line-clamp: 2;
                /* 要显示的行数 */
                -webkit-box-orient: vertical;
                word-break: break-all;
                line-height: 22px !important;
                max-height: 44px !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
