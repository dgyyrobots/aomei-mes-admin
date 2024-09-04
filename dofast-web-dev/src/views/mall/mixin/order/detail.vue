<template>
  <el-row>
    <el-col :span="action == 'detail' ? 24 : 16">
      <div class="app-container">
        <el-descriptions title="基础信息" :column="3">
          <el-descriptions-item label="订单号" :span="1">{{ order.saleNo }}</el-descriptions-item>
          <el-descriptions-item label="标题" :span="2">{{ order.title }}</el-descriptions-item>
          <el-descriptions-item label="收件地址" :span="3">{{ order.address }}</el-descriptions-item>
          <el-descriptions-item label="总价">￥{{ order.price ? order.price.toFixed(2) : '0.00' }}</el-descriptions-item>
          <el-descriptions-item label="结算方式">
            <dict-tag :type="DICT_TYPE.TRADE_MIXIN_SETTLEMENT_METHOD" :value="order.settlementMethod" />
          </el-descriptions-item>
          <el-descriptions-item label="预计发货">{{ parseTime(order.estimatedDeliveryTime, '{y}-{m}-{d}') }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="1">{{ parseTime(order.createTime, '{y}-{m}-{d}')
            }}</el-descriptions-item>
          <el-descriptions-item label="销售员" :span="2">{{ order.salerName }}</el-descriptions-item>
          <el-descriptions-item label="发货单打印次数">: {{ deliver_form }}</el-descriptions-item>
          <el-descriptions-item label="发货标签打印次数">: {{ deliver_tag_form }}</el-descriptions-item>
        </el-descriptions>
        <div class="mb-5" v-if="action == 'detail'">
          <el-button type="primary" @click="toWorkorder">审单转工单</el-button>
          <el-button type="primary" @click="toWorkorder6" v-if="order.status == 'CREATED'">审单</el-button>
          <el-button type="primary" @click="toWorkorder2" v-if="order.status == 'PASSED'">退工单</el-button>
          <el-button type="primary" @click="toWorkorder3">关闭</el-button>
          <el-button type="primary" @click="toWorkorder4(order)">打印发货单</el-button>
          <el-button type="primary" @click="toWorkorder5(order)">打印发货标签</el-button>
        </div>
        <div class="mb-5" v-else>
          <el-button @click="action = 'detail'">取消</el-button>
        </div>
        <div class="bg-white" style="margin: 0 -15px -15px -15px">
          <el-tabs type="border-card">
            <el-tab-pane v-for="(tab, i) in tabs" :key="i" :lazy="true" :name="i + ''" :label="tab.label">
              <template v-if="tab.component == 'images'">
                <div class="flex" style="flex-wrap: wrap; padding: 15px;">
                  <template v-for="(item, i) in order.pics">
                    <div :key="i" v-if="(item.url || item)"
                      class="w-60 h-60 border border-solid border-gray overflow-hidden mr-2 mb-2 flex flex-center flex-col"
                      :style="`background-image: url(${item.url || item});background-size: cover;`">
                      <i class="el-icon-document text-5xl"></i>
                      <!-- :href="(item.url || item)" -->
                      <el-link @click.stop="xinyetiaozhuan(item.url || item)" class="mt-2">{{
      (item.url ||
        item).split('.').pop().toUpperCase()
    }}(点击下载)</el-link>
                    </div>
                  </template>
                </div>
                <!-- <template v-for="(pic, i) in order.pics">
                  <div class="group-item cursor-pointer w-56 h-36 overflow-hidden relative inline-block mr-5 mb-5"
                    :key="i" v-if="pic.substr(-3) != 'zip'">
                    <img :src="pic.url" class="w-full" />
                    <div class="flex-center inset-0 absolute group-item-hover-visible bg-gray-4 bg-opacity-50">
                      <div class="p-2" @click="
                        doPreview(
                          i,
                          (order.pics || []).map(({ url }) => url),
                        )
                        ">
                        <i class="el-icon-view c-white text-10"></i>
                      </div>
                      <div class="p-2" v-if="action == 'workorder'" @click="addToAdjuncts(pic.url)">
                        <i class="el-icon-plus c-white text-10"></i>
                      </div>
                    </div>
                  </div>
                </template> -->
                <el-empty v-if="!order.pics || order.pics.length <= 0"></el-empty>
                <!-- <div class="flex" style="flex-wrap: wrap;">
                  <template v-for="(item, i) in order.pics">
                    <div :key="i" v-if="item.substr(-3) == 'zip'"
                      class="w-60 h-60 border border-solid border-gray overflow-hidden mr-2 mb-2 flex flex-center flex-col">
                      <i class="el-icon-document text-5xl"></i>
                      <el-link :href="item" class="mt-2">{{ item.split('.').pop().toUpperCase() }}(点击下载)</el-link>
                    </div>
                  </template>
                </div> -->
              </template>
              <component :is="tab.component" :order-id="order ? order.id : ''" :action="action" @preview="doPreview"
                :gx="getDetail" @plus="addToAdjuncts" :wl="order.wl" :id="$route.query.id" :soucecode="order.saleNo"
                v-else></component>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <image-preview :z-index="9999" :initial-index="previewCurrent" v-if="previewShow"
        :on-close="() => (previewShow = false)" :url-list="previewImageList"></image-preview>
    </el-col>
    <el-col :span="action == 'detail' ? 0 : 8" v-if="action != 'detail'" class="min-h-full">
      <add-workorder ref="addWorkorder" @cancel="action = 'detail'" :id="order.id"
        @success="action = 'detail'"></add-workorder>
    </el-col>
  </el-row>
</template>

<script>
import '@/utils/CLodopfuncs2.js';
import { uniq, compact } from 'lodash';
import { getMixinOrder,updatePrintStat } from '@/api/mall/trade/mixinOrder.js';
import AddWorkorder from '@/views/mall/mixin/order/components/addWorkorder.vue';
import TradeOrderPanel from '@/views/mall/mixin/order/components/tradeOrderPanel.vue';
import TradeRemark from '@/views/mall/mixin/order/components/tradeRemark.vue';
import TradeCollection from '@/views/mall/mixin/order/components/tradeCollection.vue';
import TradeWorkorder from '@/views/mall/mixin/order/components/tradeWorkorder.vue';
import TradeSchedule from '@/views/mall/mixin/order/components/tradeSchedule.vue';
import TradeFinance from '@/views/mall/mixin/order/components/tradeFinance.vue';
import TradeAfterSale from '@/views/mall/mixin/order/components/tradeAfterSale.vue';
import TradeLogs from '@/views/mall/mixin/order/components/tradeLogs.vue';
import mateRial from '@/views/mall/mixin/order/components/mateRial.vue';
import productionTasks from '@/views/mall/mixin/order/components/productionTasks.vue';
import { getSpuList } from '@/api/mall/product/spu';
import { getProductCategoryList } from '@/api/mall/product/category';
import TradeCollectionImage from '@/views/mall/mixin/order/components/TradeCollectionImage.vue';
import ImagePreview from 'element-ui/packages/image/src/image-viewer.vue';
import { updateStat } from '@/api/mall/trade/mixinOrder';
import { createPrintLog, getPrintLogPage } from "@/api/report/printLog";
import { getConfigKey } from '@/api/system/config';
import { SystemConfigKeys } from '@/utils/constants';
import { getWorkorderList } from '@/api/mes/pro/workorder';
import { getAccessToken } from '@/utils/auth';
export default {
  components: { AddWorkorder, ImagePreview },
  data() {
    return {
      printReportIds: {
        level0: '',
        level1: '',
      },
      previewCurrent: 0,
      previewShow: false,
      previewImageList: [],
      goodsCategories: [],
      action: 'detail',
      tabs: [
        { component: 'images', label: '产品资料' },
        { component: TradeCollectionImage, label: '设计资料' },
        { component: TradeCollection, label: '设计任务' },
        { component: TradeOrderPanel, label: '渠道订单' },
        { component: TradeRemark, label: '备注' },
        { component: mateRial, label: '物料' },
        { component: TradeWorkorder, label: '生产工单' },
        { component: productionTasks, label: '生产任务' },
        { component: TradeSchedule, label: '生产排班' },
        { component: TradeFinance, label: '财务' },
        { component: TradeAfterSale, label: '售后' },
        { component: TradeLogs, label: '日志' },
      ],
      workerForm: {},
      order: {},
      deliver_form: 0,
      deliver_tag_form: 0
    };
  },
  created() {
    getConfigKey(SystemConfigKeys.mixin_order_report).then(({ data }) => {
      this.printReportIds.level0 = data ? data.value : '';
    });
    getConfigKey(SystemConfigKeys.work_order_report).then(({ data }) => {
      this.printReportIds.level1 = data ? data.value : '';
    });
    this.getDetail();
    getProductCategoryList().then(({ data }) => {
      this.goodsCategories = (data || []).map(item => {
        return {
          ...item,
          value: item.id + '',
          label: item.name,
        };
      });
    });
  },
  activated() {
    this.getDetail();
  },
  methods: {
    xinyetiaozhuan(url) {
      window.open(url)
    },
    doPreview(i, images) {
      this.previewCurrent = i;
      this.previewImageList = images;
      this.$nextTick(() => {
        this.previewShow = true;
      });
    },
    async getDetail() {
      this.order = {};
      if (this.$route.query.id) {
        const res = await getMixinOrder(this.$route.query.id);
        if (res.data) {
          const goodsList = res.data.goodsList ? JSON.parse(res.data.goodsList) : [];
          res.data.pics = res.data.pics ? JSON.parse(res.data.pics) : [];
          res.data.goodsList = [];
          this.order = res.data;
          const spuIds = uniq(compact(goodsList.map(({ spuId }) => spuId)));
          const { data: spus } = await getSpuList(spuIds);
          this.order.goodsList = goodsList.map(goods => {
            const spuList = spus.filter(spu => spu.id == goods.spuId);
            return {
              ...goods,
              spu: spuList.length ? spuList[0] : null,
            };
          });
        }
      }
      let da = await getWorkorderList({
        mixinOrderId: this.order.id,
      })
      let dada = da.data[0];
      let deliver_form = await getPrintLogPage({ pageNo: 1, printType: '销售订单详情-工单编码', printCode: dada.workorderCode })
      let deliver_tag_form = await getPrintLogPage({ pageNo: 1, printType: '销售订单详情-订单号', printCode: this.order.saleNo })
      this.deliver_form = deliver_form.data.total;
      this.deliver_tag_form = deliver_tag_form.data.total;
    },
    toWorkorder() {
      this.action = 'workorder';
      this.$nextTick(() => {
        this.$refs.addWorkorder.open(this.order);
      });
    },
    // 此处可优化
    async toWorkorder2() {
      await this.$modal.confirm(`确认将该订单改为待审核?`).then(async e => {
        let data = await updateStat({ id: this.order.id, state: 0 });
        if (data.data) {
          // this.order.status = 'CREATED';
          this.$modal.msgSuccess('修改成功');
        }
      });
    },
    async toWorkorder6() {
      await this.$modal.confirm(`确认将该订单改为已审核?`).then(async e => {
        let data = await updateStat({ id: this.order.id, state: 1 })
        if (data.data) {
          // this.order.status = 'CREATED';
          this.$modal.msgSuccess('修改成功');
        }
      });
    },
    async toWorkorder3() {
      await this.$modal.confirm(`确认关闭该订单?`).then(async e => {

      });
    },
    async addToAdjuncts(url) {
      await this.$modal.confirm('你确认要把这张图片添加到工单附件里吗?', '提示');
      this.$refs.addWorkorder.addAdjunct(url);
    },
    handleCanPrint(row) {
      if (row) {
        if (row.parentId <= 0) {
          return this.printReportIds.level0;
        } else {
          return this.printReportIds.level1;
        }
      }
      return false;
    },
    async toWorkorder4(row) {
      await this.$modal.confirm('确认打印？')
      let da = await getWorkorderList({
        mixinOrderId: row.id,
      })
      let data = da.data[0];
      let datas = await createPrintLog({ printName: this.$store.state.user.nickname, printType: this.$route.meta.title + '-工单编码', printCode:  row.saleNo });
      let datas1 = await updatePrintStat({ id: row.id });
      if (!datas.data) {
        this.$message.error(datas.msg);
        return
      }
      const id = this.handleCanPrint(data);
      if (id) {
        window.open(`${process.env.VUE_APP_BASE_API}/jmreport/view/${id}?token=${getAccessToken()}&workorderId=${data.id}`);
        this.getDetail()
      }
    },
    async toWorkorder5(row) {
      await this.$modal.confirm('确认打印？')
      let datas = await createPrintLog({ printName: this.$store.state.user.nickname, printType: this.$route.meta.title + '-订单号', printCode: row.saleNo });
      if (!datas.data) {
        this.$message.error(datas.msg);
        return
      }
      let arr1 = row.title.split('\n');
      let arr = row.address.split('\n');
      LODOP.PRINT_INITA(0, 0, 500, 1000, "发货标签");
      LODOP.ADD_PRINT_BARCODE(50, 40, 480, 60, "Code39", row.saleNo);
      LODOP.ADD_PRINT_TEXT(131, 40, 360, 49, arr1[0]);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
      LODOP.SET_PRINT_STYLEA(0, "Horient", 2);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.ADD_PRINT_TEXT(250, 40, 360, 200, `${arr[1]}\r\n${arr[2]}\r\n${arr[3]}`);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
      LODOP.SET_PRINT_STYLEA(0, "Horient", 2);
      LODOP.PREVIEW()
      // let res = await getConfigKey('YL2');
      // if (!res.data && res.code == 0) {
      //   this.$message.error('请先配置发货标签id');
      //   return
      // }
      // let id = res.data.value;
      // if (id) {
      //   window.open(`${process.env.VUE_APP_BASE_API}/jmreport/view/${id}?token=${getAccessToken()}&saleId=${this.$route.query.id}`);
      //   this.getDetail()
      // }
    }
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
