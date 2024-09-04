<template>
  <div class="app-container order-detail-page">
    <el-row>
      <el-col :span="18" :xs="24" class="overflow-x-hidden">
        <!-- 订单信息 -->
        <el-descriptions title="订单信息">
          <template #extra>
            <div v-if="order.systemUserId" class="mx-5">
              <span class="h2 mr-2">销售员:</span>
              <span class="text-blue-500" @click="changeSystemUser()">{{ order.systemUserName }}</span>
            </div>
            <el-link class="mr-5" v-else @click="changeSystemUser()"> 设置销售员</el-link>
            <UserSelect ref="userSelect" @onSelected="setSystemUser($event)" />
          </template>
          <el-descriptions-item label="订单号">{{ order.no }}</el-descriptions-item>
          <el-descriptions-item label="配送方式">{{ getDictDataLabel(DICT_TYPE.TRADE_DELIVERY_TYPE, order.deliveryType)
          }}</el-descriptions-item>
          <!-- TODO 芋艿：待实现 -->
          <el-descriptions-item label="营销活动">物流配送</el-descriptions-item>
          <!-- TODO 芋艿：待实现 -->
          <el-descriptions-item label="订单类型">
            <dict-tag :type="DICT_TYPE.TRADE_ORDER_TYPE" :value="order.type" />
          </el-descriptions-item>
          <el-descriptions-item label="收货人">{{ order.receiverName }}</el-descriptions-item>
          <el-descriptions-item label="买家留言">{{ order.userRemark }}</el-descriptions-item>
          <el-descriptions-item label="订单来源">
            <dict-tag :type="DICT_TYPE.TERMINAL" :value="order.terminal" />
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ order.receiverMobile }}</el-descriptions-item>
          <el-descriptions-item label="商家备注">{{ order.remark }}</el-descriptions-item>
          <el-descriptions-item label="支付单号">{{ order.payOrderId }}</el-descriptions-item>
          <el-descriptions-item label="付款方式">
            <dict-tag :type="DICT_TYPE.PAY_CHANNEL_CODE_TYPE" :value="order.payChannelCode" />
          </el-descriptions-item>
          <el-descriptions-item label="买家">{{ order.user ? order.user.nickname : '' }}</el-descriptions-item>
          <!-- TODO 芋艿：待实现：跳转会员 -->
          <el-descriptions-item label="收货地址">
            {{ order.receiverAreaName }} &nbsp; {{ order.receiverDetailAddress }} &nbsp;
            <el-link v-clipboard:copy="order.receiverAreaName + ' ' + order.receiverDetailAddress"
              v-clipboard:success="clipboardSuccess" icon="el-icon-document-copy" type="primary" />
          </el-descriptions-item>
          <template v-if='(order.deliveryType != 1 && order.deliveryType != 4)'>
            <el-descriptions-item label="自提(配送)电话/物流单号">{{ order.logisticsNo }}</el-descriptions-item>
          </template>
        </el-descriptions>

        <!-- 订单状态 -->
        <el-descriptions title="订单状态" :column="1">
          <el-descriptions-item label="订单状态">
            <dict-tag :type="DICT_TYPE.TRADE_ORDER_STATUS" :value="order.status" />
          </el-descriptions-item>
          <el-descriptions-item label-class-name="no-colon">
            <!-- TODO 芋艿：待实现 -->
            <el-button type="primary" size="small" @click="changePrice"
              v-if="!order.channel && [TradeOrderStatusEnum.UNPAID.status].includes(order.status)">调整价格 </el-button>
            <!-- TODO 芋艿：待实现 -->
            <el-button type="primary" size="small" @click="closeOrder"
              v-if="!order.channel && [TradeOrderStatusEnum.UNPAID.status].includes(order.status)">关闭订单 </el-button>
            <!-- TODO 芋艿：待实现 -->
            <el-button type="primary" size="small" @click="dialogVisible = true"
              v-if="[TradeOrderStatusEnum.UNPAID.status].includes(order.status)">线下付款 </el-button>
            <!-- <el-popover style="margin: 0 10px;" placement="bottom" width="200" trigger="click" @show='codeShow'
              @hide="codeHide" v-if="!order.channel && [TradeOrderStatusEnum.UNPAID.status].includes(order.status)">
              <img src="https://img1.baidu.com/it/u=1486134966,661096340&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500"
                alt="" style="width: 173px;height: 173px;">
              <el-button slot="reference" type="primary" size="small">在线付款</el-button>
            </el-popover> -->
            <el-button type="primary" size="small" @click="shouyin"
              v-if="[TradeOrderStatusEnum.UNPAID.status].includes(order.status)">在线付款 </el-button>
            <!-- TODO 芋艿：待实现 -->
            <el-button type="primary" size="small" @click="changeAddress"
              v-if="[TradeOrderStatusEnum.UNPAID.status, TradeOrderStatusEnum.UNDELIVERED.status].includes(order.status)">
              修改地址 </el-button>
            <OrderAddress ref="orderAddress" @success="loadOrder"></OrderAddress>
            <!-- TODO 芋艿：待实现 -->
            <el-button type="primary" size="small" @click="modifyShipment"
              v-if="[TradeOrderStatusEnum.UNDELIVERED.status].includes(order.status)">修改发货方式 </el-button>
            <ModifyShipment ref="modifyShipment" @success="loadOrder"></ModifyShipment>
            <el-button type="primary" size="small" @click="sendExpress"
              v-if="[TradeOrderStatusEnum.UNDELIVERED.status].includes(order.status)">发货 </el-button>
            <OrderExpress ref="orderExpress" @success="loadOrder" :type="order.deliveryType"></OrderExpress>
            <!-- TODO 芋艿：待实现 -->
            <el-button type="primary" size="small" @click="printExpressWaybill"
              v-if="[TradeOrderStatusEnum.DELIVERED.status].includes(order.status)">打印电子面单 </el-button>
            <OrderExpressWaybill ref="orderExpressWaybill"></OrderExpressWaybill>
            <!-- TODO 芋艿：待实现 -->
            <el-button type="primary" size="small" @click="printExpressInvoice"
              v-if="[TradeOrderStatusEnum.DELIVERED.status].includes(order.status)">打印发货单 </el-button>
            <OrderExpressInvoice ref="orderExpressInvoice"></OrderExpressInvoice>
            <!-- TODO 芋艿：待实现 -->
            <el-button type="primary" size="small" @click="sureExpressArrival"
              v-if="[TradeOrderStatusEnum.DELIVERED.status].includes(order.status)">确认收货 </el-button>
            <el-button type="primary" size="small" @click="createMixinOrder(order, tasks)"
              v-if="[TradeOrderStatusEnum.UNDELIVERED.status].includes(order.status) && !order.mixinOrderId"> 创建销售单
            </el-button>
            <!-- TODO 芋艿：待实现 -->
            <el-button type="primary" size="small" @click="addTask"
              v-if="[TradeOrderStatusEnum.UNPAID.status, TradeOrderStatusEnum.UNDELIVERED.status, TradeOrderStatusEnum.DELIVERED.status].includes(order.status)">
              发布任务 </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="提醒" label-style="color: red">
            买家付款成功后，货款将直接进入您的商户号（微信、支付宝）<br />
            请及时关注你发出的包裹状态，确保可以配送至买家手中 <br />
            如果买家表示没收到货或货物有问题，请及时联系买家处理，友好协商
          </el-descriptions-item>
        </el-descriptions>

        <!-- 物流信息 TODO -->

        <!-- 商品信息 -->
        <div class="relative overflow-x-auto max-width-full">
          <el-descriptions title="商品信息" :column="6">
            <el-descriptions-item :span="6" label-class-name="no-colon">
              <el-table :data="order.items" border class="min-w-full">
                <el-table-column prop="spuName" label="商品">
                  <template v-slot="{ row }">
                    {{ row.spuName }}
                    <el-tag size="medium" v-for="property in row.properties" :key="property.propertyId"> {{
                      property.propertyName }}：{{ property.valueName }} </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="originalUnitPrice" label="单价(元)" width="120">
                  <template v-slot="{ row }"> ￥{{ (row.originalUnitPrice / 100.0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="count" label="数量" width="60" />
                <el-table-column prop="originalPrice" label="小计（元）" width="120">
                  <template v-slot="{ row }"> ￥{{ (row.originalPrice / 100.0).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="afterSaleStatus" label="退款状态" width="120">
                  <template v-slot="{ row }">
                    <dict-tag :type="DICT_TYPE.TRADE_ORDER_ITEM_AFTER_SALE_STATUS" :value="row.afterSaleStatus" />
                  </template>
                </el-table-column>
              </el-table>
            </el-descriptions-item>
            <!-- 占位 -->
            <el-descriptions-item label="商品总额">￥{{ (order.originalPrice / 100.0).toFixed(2) }} </el-descriptions-item>
            <el-descriptions-item label="运费金额">￥{{ (order.deliveryPrice / 100.0).toFixed(2) }} </el-descriptions-item>
            <el-descriptions-item label="订单调价">￥{{ (order.adjustPrice / 100.0).toFixed(2) }}</el-descriptions-item>
            <el-descriptions-item label="商品优惠" label-style="color: red"> ￥{{ ((order.originalPrice - order.originalPrice)
              / 100.0).toFixed(2) }} </el-descriptions-item>
            <el-descriptions-item label="订单优惠" label-style="color: red"> ￥{{ (order.discountPrice / 100.0).toFixed(2) }}
            </el-descriptions-item>
            <el-descriptions-item label="积分抵扣" label-style="color: red"> ￥{{ (order.pointPrice / 100.0).toFixed(2) }}
            </el-descriptions-item>
            <el-descriptions-item v-for="(item, index) in 5" label-class-name="no-colon" :key="item" />
            <!-- 占位 -->
            <el-descriptions-item label="应付金额"> ￥{{ (order.payPrice / 100.0).toFixed(2) }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <template v-for="(group, index) in detailGroups">
          <el-descriptions v-bind="group.groupProps" :key="`group_${index}`" :title="group.title">
            <!-- 订单操作日志 -->
            <el-descriptions-item v-if="group.key === 'orderLog'" labelClassName="no-colon">
              <el-timeline>
                <el-timeline-item v-for="(activity, index) in detailInfo[group.key]" :key="index"
                  :timestamp="activity.timestamp">
                  {{ activity.content }}
                </el-timeline-item>
              </el-timeline>
            </el-descriptions-item>

            <!-- 物流信息 -->
            <el-descriptions-item v-if="group.key === 'expressInfo'" labelClassName="no-colon">
              <el-tabs type="card">
                <!-- 循环包裹物流信息 -->
                <el-tab-pane v-for="(pkgInfo, pInIdx) in detailInfo[group.key]" :key="`pkgInfo_${pInIdx}`"
                  :label="pkgInfo.label">
                  <!-- 包裹详情 -->
                  <el-descriptions>
                    <el-descriptions-item v-for="(pkgChild, pkgCIdx) in group.children" v-bind="pkgChild.childProps"
                      :key="`pkgChild_${pkgCIdx}`" :label="pkgChild.label">
                      <!-- 包裹商品列表 -->
                      <template v-if="pkgChild.valueKey === 'goodsList' && pkgInfo[pkgChild.valueKey]">
                        <div v-for="(goodInfo, goodInfoIdx) in pkgInfo[pkgChild.valueKey]"
                          :key="`goodInfo_${goodInfoIdx}`" style="display: flex">
                          <el-image style="width: 100px; height: 100px; flex: none" :src="goodInfo.imgUrl"></el-image>
                          <el-descriptions :column="1">
                            <el-descriptions-item labelClassName="no-colon">{{ goodInfo.name }}</el-descriptions-item>
                            <el-descriptions-item label="数量">{{ goodInfo.count }}</el-descriptions-item>
                          </el-descriptions>
                        </div>
                      </template>

                      <!-- 包裹物流详情 -->
                      <el-timeline v-else-if="pkgChild.valueKey === 'wlxq'">
                        <el-timeline-item v-for="(activity, index) in pkgInfo[pkgChild.valueKey]" :key="index"
                          :timestamp="activity.timestamp">
                          {{ activity.content }}
                        </el-timeline-item>
                      </el-timeline>

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
        <el-descriptions title="订单任务" :column="3">
          <template v-for="task in tasks">
            <el-descriptions-item label="任务类型">
              {{ task.typeName }}
            </el-descriptions-item>
            <el-descriptions-item label="任务状态">
              <dict-tag :type="DICT_TYPE.TRADE_ORDER_COLLECTION_STATUS" :value="task.status"></dict-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ parseTime(task.createTime) }}
            </el-descriptions-item>
            <el-descriptions-item label-class-name="no-colon">
              <el-button type="primary" @click="openTask(task)">查看任务</el-button>
              <el-button type="primary" @click="updateTaskRemark(task)">修改任务</el-button>
            </el-descriptions-item>
            <!--            <el-descriptions-item label="任务名称">-->
            <!--              {{ task.name }}-->
            <!--            </el-descriptions-item>-->


            <el-descriptions-item :span="2" label-class-name="no-colon"></el-descriptions-item>
            <el-descriptions-item :span="3" label-class-name="no-colon">
              <div class="flex-1">
                <template v-for="field in task.fields" v-if="task.recordId">
                  <div class="flex" v-if="field.type == 'OneImgField'">
                    <div class="flex" v-for="(item, i) in task.record[field.field]" :key="i">
                      <div class="w-60 h-60 overflow-hidden mr-2" v-if="item.image">
                        <el-image :src="item.image" class="w-full" fit="cover" :preview-src-list="[item.image]" />
                        <div class="flex-1">{{ item.remark }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-if="field.type == 'TwoImgField'">
                    <div class="flex" v-for="(item, i) in task.record[field.field]" :key="i">
                      <div class="w-60 h-60 overflow-hidden mr-2" v-if="item.mark_image">
                        <el-image :src="item.mark_image" class="w-full" fit="cover"
                          :preview-src-list="[item.mark_image]" />
                      </div>
                      <div class="w-60 h-60 overflow-hidden mr-2" v-if="item.result_image">
                        <el-image :src="item.result_image" class="w-full" fit="cover"
                          :preview-src-list="[item.result_image]" />
                      </div>
                      <div class="flex-1">
                        <div>{{ item.result }}</div>
                        <div>{{ item.remark }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-if="field.type == 'File' && task.record[field.field]" style="display: flex;">
                    <div class="flex" v-for="(item, i) in task.record[field.field].split(',')" :key="i">
                      <div
                        class="w-60 h-60 border border-solid border-gray overflow-hidden mr-2 mb-2 flex flex-center flex-col"
                        v-if="item">
                        <i class="el-icon-document text-5xl"></i>
                        <el-link :href="item" class="mt-2">{{ item.split('.').pop().toUpperCase() }}(点击下载)</el-link>
                      </div>
                    </div>
                  </div>
                  <div class="h-5"></div>
                </template>
                <el-divider>
                  <!-- <el-button type="text" class="text-gray-300" @click="updateTaskRemark(task)">
                    <i class="el-icon-top"></i>
                    任务信息(点击修改任务记录)
                    <i class="el-icon-top"></i>
                  </el-button> -->
                </el-divider>
              </div>
            </el-descriptions-item>
          </template>
        </el-descriptions>
        <el-empty description="暂无订单任务" v-if="!tasks || tasks.length <= 0"></el-empty>
      </el-col>
      <el-col :span="6" :xs="24">
        <el-descriptions title="订单备注">
          <template #extra>
            <el-button type="primary" size="small" @click="openRemarks">备注</el-button>
          </template>
        </el-descriptions>
        <el-timeline v-if="remarks && remarks.length">
          <el-timeline-item center :timestamp="parseTime(remark.createTime)" placement="top" v-for="remark in remarks"
            :key="remark.id">
            <div class="mb-2">{{ remark.remark }}</div>
            <dict-tag :type="DICT_TYPE.TRADE_ORDER_REMARK_TYPE" :value="remark.type" />
            <!--            <span class="static ml-2">-->
            <!--              <el-tag>{{ remark.creator || '&nbsp;' }}</el-tag>-->
            <!--            </span>-->
            <span class="static ml-2">
              <el-tag :effect="remark.sortCode > 0 ? 'dark' : 'plain'" @click="toggleTop(remark)">置顶</el-tag>
            </span>
            <span class="static ml-2">
              <el-tag :effect="'dark'" @click="openRemarkss(remark)" style="cursor: pointer;">编辑</el-tag>
            </span>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无订单内部备注" :image-size="132"></el-empty>
      </el-col>
    </el-row>
    <CreateTask ref="createTask" @saved="getOrderCollectionList()"></CreateTask>
    <OrderRemarks ref="orderRemarks" @success="getOrderRemarks()"></OrderRemarks>
    <TaskRecord ref="remarkDialog" @saved="getOrderCollectionList()" />
    <el-dialog title="查看任务" v-if="showTask" :visible.sync="showTask">
      <el-form v-if="currentTask">
        <el-form-item label="任务类型">
          <el-select v-model="currentTask.typeId" placeholder="请选择任务类型" disabled>
            <el-option v-for="opt in collectionTypes" :value="opt.id" :label="opt.name" :key="opt.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="请选择银行账户" :visible.sync="dialogVisible" width="500px" v-dialogDrag center append-to-body>
      <div style="text-align: center;">
        <el-select v-model="bankCard" placeholder="请选择银行账户">
          <el-option v-for="dict in zh" :key="dict.id" :label="dict.title + dict.account" :value="dict.id + ''" />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="offlinePay">确 定</el-button>
      </span>
    </el-dialog>
    <mixin-order ref="mixinOrder" @success="loadOrder(true)"></mixin-order>
    <div class="!w-240px"></div>
  </div>
</template>

<script>
import '@/utils/CLodopfuncs2.js';
import { getOrderDetail, setOrderSystemUser, getOrderDeliveryLine, updateOrderAdjustPrice, offlinePay, closeOrder, orderComplate } from '@/api/mall/trade/order';
import { getOrderRemarkList, toggleTopRemark } from '@/api/mall/trade/orderRemark';
import { getElectronConfig } from '@/api/mall/trade/electronicsheetPackage';
import { getExpressCompany } from '@/api/system/expressCompany';
import { getOrderCollectionList } from '@/api/mall/trade/orderCollection';
import { getFormList, getFormImages } from '@/api/system/form';
import { getFormRecordList } from '@/api/system/formRecord';
import OrderRemarks from './components/remarks.vue';
import OrderExpress from './components/express.vue';
import OrderAddress from './components/address.vue';
import OrderExpressWaybill from './components/expressWaybill.vue';
import OrderExpressInvoice from './components/expressInvoice.vue';
import ModifyShipment from './components/modifyShipment.vue';
import TaskRecord from '../orderCollection/record.vue';
import CreateTask from './components/task.vue';
import UserSelect from '@/components/userSelect/single.vue';
import { TradeOrderStatusEnum } from '@/utils/constants.js';
import { MessageBox } from 'element-ui';
import { uniq, compact } from 'lodash';
import { getOrderCollectionTypeSimpleList } from '@/api/mall/trade/orderCollectionType';
import MixinOrder from '@/views/mall/trade/order/components/mixin.vue';
import { getCashDepositorPage } from '@/api/finance/cashDepositor';
export default {
  name: 'TradeOrderDetail',
  components: {
    MixinOrder,
    UserSelect,
    OrderRemarks,
    OrderExpress,
    OrderAddress,
    OrderExpressWaybill,
    OrderExpressInvoice,
    CreateTask,
    TaskRecord,
    ModifyShipment
  },
  data() {
    return {
      print_info: [{
        'RET': 100,
        'MSG': '成功',
        '停水单': '停水通知单',
        '公司名称': '客户编码：123456789',
        '地址': '地址：测试测试测试测试测试测试',
        '内容': '\n\t\t    经查，您户已有2个月以上（含2个月）未缴水费共计30.06元,表身号:。现我公司按照《城市供水条例》及我公司与您签订的《供水合同》的相关规定，对您户暂停供水，因停水给您带来的不便之处，敬请谅解。缴清水费后，请您在工作时间与电话（                ）联系，给予复水。（温馨提示：未登记或已变更移动电话的用户，请及时与我司联系，以便于及时收到我司水费短信提醒。办公室电话：123456）\n\t\t ',
        '客户名称': '测试测试测试测试测试测试',
        '日期': '2023年01月05日',
        '是否打印维护': 0,
        '鸣谢': '请予合作，谢谢！'
      }, {
        'RET': 100,
        'MSG': '成功',
        '停水单': '停水通知单',
        '公司名称': '客户编码：123456789',
        '地址': '地址：测试测试测试测试测试测试',
        '内容': '\n\t\t    经查，您户已有2个月以上（含2个月）未缴水费共计176.34元,表身号:。现我公司按照《城市供水条例》及我公司与您签订的《供水合同》的相关规定，对您户暂停供水，因停水给您带来的不便之处，敬请谅解。缴清水费后，请您在工作时间与电话（                ）联系，给予复水。（温馨提示：未登记或已变更移动电话的用户，请及时与我司联系，以便于及时收到我司水费短信提醒。办公室电话：123456）\n\t\t ',
        '客户名称': '测试测试测试测试测试测试',
        '日期': '2023年01月05日',
        '是否打印维护': 0,
        '鸣谢': '请予合作，谢谢！'
      }],
      bankCard: '',
      zh: [],
      dialogVisible: false,
      collectionTypes: [],
      TradeOrderStatusEnum,
      tasks: [],
      detailInfo: {
        expressInfo: [
          // 物流信息
          // {
          //   label: '包裹1',
          //   name: '',
          //   fhsj: '',
          //   wlgs: '',
          //   ydh: '',
          //   wlzt: '',
          //   wlxq: [
          //     // {
          //     //   content: '正在派送途中,请您准备签收(派件人:王涛,电话:13854563814)',
          //     //   timestamp: '2018-04-15 15:00:16',
          //     // },
          //     // {
          //     //   content: '快件到达 【烟台龙口东江村委营业点】',
          //     //   timestamp: '2018-04-13 14:54:19',
          //     // },
          //     // {
          //     //   content: '快件已发车',
          //     //   timestamp: '2018-04-11 12:55:52',
          //     // },
          //     // {
          //     //   content: '快件已发车',
          //     //   timestamp: '2018-04-11 12:55:52',
          //     // },
          //     // {
          //     //   content: '快件已发车',
          //     //   timestamp: '2018-04-11 12:55:52',
          //     // },
          //   ],
          // },
        ],
        orderLog: [
          // 订单操作日志
          // {
          //   content: '买家【乌鸦】关闭了订单',
          //   timestamp: '2018-04-15 15:00:16',
          // },
          // {
          //   content: '买家【乌鸦】下单了',
          //   timestamp: '2018-04-15 15:00:16',
          // },
        ],
        goodsInfo: [], // 商品详情tableData
      },
      order: {
        items: [],
        user: {},
      },
      remarks: [],
      currentTask: null,
      showTask: false,
    };
  },
  computed: {
    detailGroups() {
      const detailFields = [
        {
          title: '物流信息',
          key: 'expressInfo',
          children: [
            { label: '发货时间', valueKey: 'fhsj' },
            { label: '物流公司', valueKey: 'wlgs' },
            { label: '运单号', valueKey: 'ydh' },
            { label: '物流状态', valueKey: 'wlzt', childProps: { span: 3 } },
            { label: '物流详情', valueKey: 'wlxq' },
          ],
        },
        {
          title: '订单操作日志',
          key: 'orderLog',
        },
      ];
      if (this.detailInfo.expressInfo && this.detailInfo.expressInfo.length) {
        if (![TradeOrderStatusEnum.DELIVERED.status].includes(this.order.status)) {
          detailFields[0].children.pop();
        }
      } else {
        detailFields.shift();
      }
      return detailFields;
    },
  },
  created() {
    // 获取可选择账号
    getCashDepositorPage({ pageSize: 100 }).then(res => {
      this.zh = res.data.list;
    })
    this.loadOrder();
    getOrderCollectionTypeSimpleList().then(res => {
      this.collectionTypes = res.data;
    });
  },
  activated() {
    this.bankCard = ''
    this.loadOrder();
  },
  methods: {
    modifyShipment() {
      this.$refs.modifyShipment.open(this.order.id, this.order.deliveryType);
    },
    print_f() {
      if (this.print_info.length > 0) {
        var LODOP = getLodop()
        var totalPrint = 0 // 第几个
        // 如果有预设的打印机名称，则设置，否则使用本机默认打印机
        if (!this.isEmpty(this.print_info[0].打印机名称)) {
          LODOP.SET_PRINT_MODE('WINDOW_DEFPRINTER', this.print_info[0].打印机名称)
        }
        // 循环打印
        for (var i = 0; i < this.print_info.length; i++) {
          totalPrint++
          if (totalPrint % 2 == 1) { // 节约用纸,2个信息为一张
            LODOP.PRINT_INIT('快递单') // 打印初始化
            LODOP.SET_PRINT_PAGESIZE(3, 0, 0, '148.5mm') // 设定纸张大小:纵向，宽为0，高为0，纸张类型为148.5mm，
            LODOP.ADD_PRINT_TEXT(31, 312, 228, 35, this.isEmpty(this.print_info[i].停水单) ? '' : this.print_info[i].停水单) // 增加纯文本项:距离顶部31mm,距离左边312，宽度228，高度35
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 18) // 设置第0个内容项字体为18号字体
            LODOP.ADD_PRINT_TEXT(87, 73, 657, 25, this.isEmpty(this.print_info[i].客户名称) ? '' : this.print_info[i].客户名称)
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
            LODOP.ADD_PRINT_TEXT(138, 74, 646, 189, this.isEmpty(this.print_info[i].内容) ? '' : this.print_info[i].内容)
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
            LODOP.ADD_PRINT_TEXT(327, 372, 346, 30, this.isEmpty(this.print_info[i].公司名称) ? '' : this.print_info[i].公司名称)
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
            LODOP.ADD_PRINT_TEXT(376, 472, 248, 30, this.isEmpty(this.print_info[i].日期) ? '' : this.print_info[i].日期)
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
            LODOP.ADD_PRINT_TEXT(113, 74, 657, 25, this.isEmpty(this.print_info[i].地址) ? '' : this.print_info[i].地址)
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
            if (totalPrint == this.print_info.length) { // 如果已经是最后一份，则终止此循环
              // LODOP.PRINT()
              LODOP.PREVIEW() // 为防止真正打印，采用预览模式,预览模式只能预览一页，无法翻页，切会弹出‘有窗口已打开，先关闭它’提示
            }
          } else {
            var toppx = 500 // 距离顶部,同一张的第二个信息
            LODOP.ADD_PRINT_TEXT(31 + toppx, 312, 228, 35, this.isEmpty(this.print_info[i].停水单) ? '' : this.print_info[i].停水单)
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 18)
            LODOP.ADD_PRINT_TEXT(87 + toppx, 73, 657, 25, this.isEmpty(this.print_info[i].客户名称) ? '' : this.print_info[i].客户名称)
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
            LODOP.ADD_PRINT_TEXT(138 + toppx, 74, 646, 189, this.isEmpty(this.print_info[i].内容) ? '' : this.print_info[i].内容)
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
            LODOP.ADD_PRINT_TEXT(327 + toppx, 372, 346, 30, this.isEmpty(this.print_info[i].公司名称) ? '' : this.print_info[i].公司名称)
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
            LODOP.ADD_PRINT_TEXT(376 + toppx, 472, 248, 30, this.isEmpty(this.print_info[i].日期) ? '' : this.print_info[i].日期)
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
            LODOP.ADD_PRINT_TEXT(113 + toppx, 74, 657, 25, this.isEmpty(this.print_info[i].地址) ? '' : this.print_info[i].地址)
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
            // LODOP.PRINT()
            LODOP.PREVIEW()// 为防止真正打印，采用预览模式
          }
        }
      }
    },
    // 是否为空转换
    isEmpty(data) {
      if (data && data.length > 0) {
        return false
      } else {
        return true
      }
    },
    shouyin() {
      this.$router.push({
        name: 'PayOrderSubmit',
        query: {
          id: this.order.payOrderId,
        },
      });
    },
    codeShow() {
      console.log('二维码显示')
    },
    codeHide() {
      console.log('二维码隐藏')
    },
    createMixinOrder(order, tasks) {
      console.log(tasks);
      this.$refs.mixinOrder.open(order, tasks);
    },
    openTask(task) {
      this.currentTask = task;
      this.showTask = true;
    },
    async toggleTop(remark) {
      const loading = this.$loading();
      try {
        await toggleTopRemark(remark.id);
        await this.getOrderRemarks();
      } catch (e) {
      } finally {
        loading.close();
      }
    },
    async loadOrder(justBase = false) {
      if (!justBase) {
        this.getOrderRemarks();
        this.getOrderCollectionList();
      }
      const res = await getOrderDetail(this.$route.query.id);
      this.order = res.data;
      const orderLog = [];
      if (res.data.createTime) {
        orderLog.push({
          content: '创建时间',
          timestamp: this.parseTime(res.data.createTime),
        });
      }
      if (res.data.payTime) {
        orderLog.push({
          content: '支付时间',
          timestamp: this.parseTime(res.data.payTime),
        });
      }
      if (res.data.deliveryTime) {
        orderLog.push({
          content: '发货时间',
          timestamp: this.parseTime(res.data.deliveryTime),
        });
      }
      if (res.data.receiveTime) {
        orderLog.push({
          content: '到货时间',
          timestamp: this.parseTime(res.data.receiveTime),
        });
      }
      if (res.data.updateTime) {
        orderLog.push({
          content: '更新时间',
          timestamp: this.parseTime(res.data.updateTime),
        });
      }
      if (res.data.cancelTime) {
        orderLog.push({
          content: '取消时间',
          timestamp: this.parseTime(res.data.cancelTime),
        });
      }
      if (res.data.finishTime) {
        orderLog.push({
          content: '完成时间',
          timestamp: this.parseTime(res.data.payTime),
        });
      }
      this.detailInfo.orderLog = orderLog;
      if (!justBase && res.data.logisticsId) {
        const { data: company } = await getExpressCompany(res.data.logisticsId);
        if (company && (res.data.deliveryType == 1 || res.data.deliveryType == 4)) {
          this.detailInfo.expressInfo = [
            {
              label: '包裹1',
              name: company.companyName,
              fhsj: this.parseTime(res.data.deliveryTime),
              wlgs: company.companyName,
              ydh: res.data.logisticsNo,
              wlzt: '',
              wlxq: [],
            },
          ];
          this.getOrderDeliveryLine();
        }
      }
    },
    getOrderCollectionList() {
      getOrderCollectionList({ orderId: this.$route.query.id }).then(async res => {
        const tasks = res.data;
        const formIds = uniq(compact(tasks.map(({ formId }) => formId)));
        const recordIds = uniq(compact(tasks.map(({ recordId }) => recordId)));
        const [{ data: forms }, { data: records }] = await Promise.all([getFormList(formIds), getFormRecordList(recordIds)]);
        this.tasks = tasks.map(task => {
          let fields = [];
          let record = {};
          for (let i = 0; i < forms.length; i++) {
            if (forms[i].id == task.formId) {
              fields = forms[i].fields;
              break;
            }
          }
          for (let i = 0; i < records.length; i++) {
            if (records[i].id == task.recordId) {
              record = JSON.parse(records[i].value);
              break;
            }
          }
          return {
            ...task,
            fields,
            record,
          };
        });
      });
    },
    getOrderDeliveryLine() {
      getOrderDeliveryLine(this.$route.query.id).then(res => {
        this.detailInfo.expressInfo[0].wlzt = this.getDictDataLabel(this.DICT_TYPE.KDBIRD_LOGISTIC_STATE_EX, res.data?.stateEx || '-1'); // res.data;
        this.detailInfo.expressInfo[0].wlxq = (res.data?.traces || []).map(item => {
          return {
            timestamp: item.acceptTime,
            content: item.acceptStation,
          };
        });
      });
    },
    getOrderRemarks() {
      getOrderRemarkList({ trade_order_id: this.$route.query.id }).then(({ data }) => {
        this.remarks = data;
      });
    },
    clipboardSuccess() {
      this.$modal.msgSuccess('复制成功');
    },
    changePrice() {
      MessageBox.prompt('请输入要调整的价格结果', '提示', {
        customClass: '!w-240px',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'number',
        inputPattern: /\d+(\.\d+)?/,
        inputErrorMessage: '请输入正确的价格',
      })
        .then(async ({ value }) => {
          await updateOrderAdjustPrice(this.order.id, value);
          this.loadOrder(true);
        })
        .catch(() => { });
    },
    async closeOrder() {
      let text = '你确认要关闭订单吗?';
      if (![TradeOrderStatusEnum.UNPAID.status].includes(this.order.status)) {
        text = '关闭订单后余额自动退回, 你确认要关闭订单吗?';
      }
      await this.$modal.confirm(text, '提示');
      await closeOrder(this.order.id);
      this.loadOrder();
    },
    async sureExpressArrival() {
      await this.$modal.confirm('你确认订单已到货吗?', '提示');
      await orderComplate(this.order.id);
      this.loadOrder();
    },
    async offlinePay() {
      if (!this.bankCard) return this.$message.error('请选择银行账户');
      // await this.$modal.confirm('你确认订单已线下付款吗?', '提示');
      await offlinePay(this.order.id, this.bankCard);
      this.dialogVisible = false;
      this.loadOrder();
    },
    addTask() {
      this.$refs.createTask.open(this.order.id);
    },
    openRemarks() {
      this.$refs.orderRemarks.open(this.order.id);
    },
    openRemarkss(order) {
      this.$refs.orderRemarks.open(this.order.id, order);
    },
    sendExpress() {
      console.log(this.order)
      this.$refs.orderExpress.open(this.order.id, this.order.items, this.order);
    },
    changeAddress() {
      this.$refs.orderAddress.open(this.order.id);
    },
    async printExpressWaybill() {
      // 电子面单打印组件
      // this.$refs.orderExpressWaybill.open(this.order.id, this.order.items, this.order);
      // this.print_f();
      const electronConfig = await getElectronConfig(this.order.no);
      const htmlText = electronConfig.data;
      LODOP.NewPage();
      LODOP.ADD_PRINT_HTM(0, 0, "100%", "100%", htmlText);
      return;
      this.$modal
        .confirm('你确认要打印电子面单吗?', '提示')
        .then(async ret => {
          const electronConfig = await getElectronConfig([this.order.logisticsNo]);
          console.log(electronConfig);
        })
        .catch(() => { });
    },
    printExpressInvoice() {
      this.$refs.orderExpressInvoice.open(this.order.id);
    },
    updateTaskRemark(task) {
      this.$refs.remarkDialog.open(task);
    },
    async changeSystemUser() {
      if (this.order.systemUserId) {
        await this.$modal.confirm('销售员已设置,你确定要更换吗?');
      }
      this.$refs.userSelect.open();
    },
    async setSystemUser(user) {
      await setOrderSystemUser({ id: this.order.id, systemUserId: user.id, systemUserName: user.nickname });
      this.loadOrder(true);
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
