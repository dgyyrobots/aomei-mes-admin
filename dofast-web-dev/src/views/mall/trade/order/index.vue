<template>
  <div class="app-container">
    <doc-alert title="功能开启" url="https://doc.huizhizao.vip/mall/build/" />

    <!-- 搜索工作栏 -->
    <!-- TODO: inline 看看是不是需要; v-show= 那块逻辑还是要的 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="" prop="searchValue" label-width="0">
        <el-input v-model="queryParams.searchValue" style="width: 240px">
          <el-select v-model="queryParams.searchType" slot="prepend" style="width: 120px">
            <el-option v-for="dict in searchTypes" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="来源渠道" prop="channel">
        <el-select v-model="queryParams.channel" placeholder="请选择来源渠道" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.ORDER_FROM_CHANNEL)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺" prop="shopCode">
        <el-select v-model="queryParams.channelShopId" placeholder="请选择店铺" clearable size="small">
          <el-option v-for="shop in shops" :key="shop.id" :label="shop.displayName" :value="shop.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="销售员" prop="systemUserName">
        <el-input v-model="queryParams.systemUserName" placeholder="请输入销售员名" size="small"></el-input>
      </el-form-item>
      <el-form-item label="收货人" prop="receiverName">
        <el-input v-model="queryParams.receiverName" placeholder="请输入收货人" size="small"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="receiverMobile">
        <el-input v-model="queryParams.receiverMobile" placeholder="请输入联系电话" size="small"></el-input>
      </el-form-item>
      <el-form-item label="收货地址" prop="receiverDetailAddress">
        <el-input v-model="queryParams.receiverDetailAddress" placeholder="请输入收货地址" size="small"></el-input>
      </el-form-item>
      <el-form-item label="订单类型" prop="type">
        <el-select v-model="queryParams.type" clearable style="width: 120px">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.TRADE_ORDER_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-select v-model="queryParams.status" clearable style="width: 120px">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.TRADE_ORDER_STATUS)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单来源" prop="terminal">
        <el-select v-model="queryParams.terminal" clearable style="width: 120px">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.TERMINAL)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式" prop="payChannelCode">
        <el-select v-model="queryParams.payChannelCode" clearable style="width: 120px">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.PAY_CHANNEL_CODE_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否转销售单" prop="mixinOrderId" label-width="100px">
        <el-select v-model="queryParams.mixinOrderId" clearable style="width: 120px">
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :picker-options="datePickerOptions" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="发货时间" prop="deliveryTime">
        <el-date-picker v-model="queryParams.deliveryTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :picker-options="datePickerOptions" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="店铺" prop="shopId">
        <el-select v-model="queryParams.shopId" placeholder="请选择店铺" clearable size="small">
          <el-option v-for="shop in shops" :key=shop.id :label="shop.displayName" :value=shop.id />
        </el-select>
      </el-form-item>
      <div class="el-form">
        <el-form-item label="订单任务" prop="tasks" style="width: 100%">
          <div style="width: calc(100vw - 393px)">
            <template v-for="(tag, i) in taskTags">
              <el-tag class="mb-4" v-if="'text' == getSelectStyle(queryParams.tasks, tag.value)" effect="text"
                type="info" size="mini" :key="i" @click="toggleTaskTag(tag)">{{ tag.label }} </el-tag>
              <el-tag class="mb-4" v-if="'primary' == getSelectStyle(queryParams.tasks, tag.value)" effect="dark"
                size="mini" :key="i" @click="toggleTaskTag(tag)">{{ tag.label }} </el-tag>
              <el-tag class="mb-4" v-if="'default' == getSelectStyle(queryParams.tasks, tag.value)" effect="light"
                size="mini" :key="i" @click="toggleTaskTag(tag)">{{ tag.label }} </el-tag>
            </template>
          </div>
        </el-form-item>
      </div>
      <div class="el-form">
        <el-form-item label="订单状态" prop="activeTab" style="width: 100%">
          <div style="width: calc(100vw - 393px)">

            <template v-for="(tab, i) in statusTabs">
              <el-tag class="mb-4" v-if="tab.value != activeTab" effect="text" type="info" size="mini" :key="i"
                @click="tabClick(tab)">{{ tab.label }} </el-tag>
              <el-tag class="mb-4" v-if="tab.value == activeTab" effect="dark" size="mini" :key="i">
                {{ tab.label }}
              </el-tag>
            </template>
          </div>
        </el-form-item>
      </div>
      <el-form-item label-width="0">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['trade:order:create']">新增 </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          :loading="exportLoading" v-hasPermi="['trade:order:query']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- tab切换 -->
    <!-- TODO @小程：看看能不能往上挪 -40px，和【隐藏搜索】【刷新】对齐 -->
    <!--    <el-tabs v-model="activeTab" type="card" @tab-click="tabClick">-->
    <!--      <el-tab-pane v-for="tab in statusTabs" :key="tab.value" :label="tab.label" :name="tab.value">-->
    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" :show-header="false" class="order-table">
      <el-table-column>

        <template v-slot="{ row }">
          <el-row type="flex" align="middle">
            <el-col :span="8">
              订单号：{{ row.no }}
              <el-popover title="支付单号：" :content="row.payOrderId + ''" placement="right" width="200" trigger="click">
                <el-button slot="reference" type="text">更多</el-button>
              </el-popover>
            </el-col>
            <el-col :span="7">下单时间：{{ parseTime(row.createTime) }}</el-col>
            <el-col :span="6" v-if="row.channelShopName">渠道：{{ row.channelShopName }}</el-col>
            <!-- <el-col :span="2">来源：
              <dict-tag :type="DICT_TYPE.TERMINAL" :value="row.terminal" v-if="row.type != 30" />
              <div v-else>{{ row.channel_shop_name }}</div>
            </el-col> -->
            <el-col :span="4">销售员：
              <el-link type="primary" v-if="row.systemUserId">{{ row.systemUserName }}</el-link>
              <span class="text-gray-3 line-through" v-else>未设置</span>
            </el-col>
            <el-col :span="4">客户：
              <el-link type="primary" v-if="row.user.nickname">{{ row.user.nickname }}</el-link>
              <!-- <span class="text-gray-3 line-through" v-else>未设置</span> -->
            </el-col>

            <el-col :span="10" v-if="row.userRemark">昵称：
              <el-link type="primary">{{ row.userRemark }}</el-link>
              <!-- <span class="text-gray-3 line-through" v-else>未设置</span> -->
            </el-col>
            <!--                <el-col :span="4"-->
            <!--                  >支付方式：-->
            <!--                  <dict-tag v-if="row.payChannelCode" :type="DICT_TYPE.PAY_CHANNEL_CODE_TYPE" :value="row.payChannelCode" />-->
            <!--                  <span v-else>未支付</span>-->
            <!--                </el-col>-->
            <el-col :span="6" align="right">
              <el-button type="text" @click="addTask(row.id)"
                v-if="[TradeOrderStatusEnum.UNPAID.status, TradeOrderStatusEnum.UNDELIVERED.status, TradeOrderStatusEnum.DELIVERED.status].includes(row.status)">
                发布任务 </el-button>
              <el-button type="text" @click="goToDetail(row)">详情</el-button>
              <el-button type="text"
                v-if="[TradeOrderStatusEnum.UNDELIVERED.status].includes(row.status) && !row.mixinOrderId"
                @click="createMixinOrder(row)">创建销售单 </el-button>
              <el-button type="text" v-if="row.mixinOrderId" @click="toMixinOrder(row)">销售单详情</el-button>
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
                  <!-- <el-tag size="medium" v-for="property in row.properties" :key="property.propertyId"> {{
                    property.propertyName }}：{{ property.valueName }} </el-tag> -->
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
                <div v-if="$index == 0">￥{{ row.payPrice ? (row.payPrice / 100).toFixed(2) : '0.00' }}</div>
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
                <el-tag v-if="row.mixinOrderId == 0" size="medium">未转销售单</el-tag>
                <dict-tag v-else-if="$index == 0" :type="DICT_TYPE.TRADE_ORDER_STATUS"
                  :value="row.status + ''"></dict-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
    <!--      </el-tab-pane>-->
    <!--    </el-tabs>-->
    <el-dialog title="新建订单" v-if="showFormFlag" :visible.sync="showFormFlag">
      <el-form v-model="form" :rule="rules" ref="form" label-width="80px">
        <el-form-item label="客户" prop="userId">
          <el-select v-model="form.userId" placeholder="请选择客户" @change="resetAddresses">
            <el-option :value="option.id" v-for="option in userOptions" :key="option.id" :label="option.nickname">
              {{ option.nickname }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件人" prop="addressId">
          <el-select v-model="form.addressId" placeholder="请选择收件人">
            <el-option :value="option.id" v-for="option in addressOptions" :key="option.id" :label="option.name">
              {{ option.name }}
              {{ option.mobile }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品信息" prop="items">
          <div>
            <el-button type="success" @click="handleSelectSkus()">添加</el-button>
          </div>
          <el-table :data="form.items">
            <el-table-column label="商品名称" prop="spuName"></el-table-column>
            <el-table-column label="标签名称" prop="name"></el-table-column>
            <el-table-column label="库存数量" prop="stock"></el-table-column>
            <el-table-column label="价格" prop="price"></el-table-column>
            <el-table-column label="数量" fixed="right">

              <template v-slot="{ row, $index }">
                <el-input-number v-model="row.num" :min="0" @input="$event <= 0 && removeItem($index)"
                  style="width: 100px" size="small"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createTradeOrder">确 定</el-button>
        <el-button @click="showFormFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <CreateTask ref="createTask"></CreateTask>
    <SkuSelect ref="skuSelect" @onSelected="setItems($event)"></SkuSelect>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <mixin-order ref="mixinOrder" @success="getList()"></mixin-order>
  </div>
</template>

<script>
import MixinOrder from './components/mixin.vue';
import { getOrderCollectionList } from '@/api/mall/trade/orderCollection';
import { createTradeOrder, getOrderPage, exportOrderExcel } from '@/api/mall/trade/order';
import { datePickerOptions, TradeOrderStatusEnum } from '@/utils/constants';
import { DICT_TYPE, getDictDatas } from '@/utils/dict';
import { getMemberUserList } from '@/api/member/user';
import { getOrderCollectionTypeList, getOrderCollectionTypeSimpleList } from '@/api/mall/trade/orderCollectionType';
import { getAddressListByUserId } from '@/api/member/address';
import SkuSelect from '@/components/skuSelect/multi.vue';
import CreateTask from '@/views/mall/trade/order/components/task.vue';
import { uniq, compact } from 'lodash';
import { getFormRecordList } from '@/api/system/formRecord';
import { getFormList, getFormImages } from '@/api/system/form';
import { getAllShop } from '@/api/channel/shop';
export default {
  name: 'TradeOrder',
  props: {
    isSelf: {
      type: Boolean,
      default: false,
    },
  },
  components: { CreateTask, SkuSelect, MixinOrder },
  data() {
    return {
      taskTags: [],
      userOptions: [],
      addressOptions: [],
      form: {
        userId: '',
        addressId: '',
        items: [],
      },
      showFormFlag: false,
      rules: [],
      TradeOrderStatusEnum,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 交易售后列表
      list: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        searchType: 'no',
        searchValue: '',
        type: null,
        status: null,
        payChannelCode: null,
        tasks: null,
        createTime: [],
        deliveryTime: [],
        mixinOrderId: null,
        channel: '',
        shopId: null,
        receiverMobile: '',
        receiverName: '',
        receiverDetailAddress: '',
        channel: '',
        channelShopId: '',
      },
      shops: [],
      // Tab 筛选
      activeTab: 'all',
      statusTabs: [
        {
          label: '全部',
          value: 'all',
        },
      ],
      // 静态变量
      datePickerOptions: datePickerOptions,
      searchTypes: [
        { label: '订单号', value: 'no' },
        { label: '会员编号', value: 'userId' },
        { label: '会员昵称', value: 'userNickname' },
        { label: '会员手机号', value: 'userMobile' },
        // { label: '收货人姓名', value: 'receiverName' },
        // { label: '收货人手机号码', value: 'receiverMobile' },
      ],
      shops: [],
    };
  },
  created() {
    this.getShops();
    this.getList();
    // 设置 statuses 过滤
    for (const dict of getDictDatas(DICT_TYPE.TRADE_ORDER_STATUS)) {
      this.statusTabs.push({
        label: dict.label,
        value: dict.value,
      });
    }
    getMemberUserList().then(res => {
      this.userOptions = res.data;
    });
    this.getTaskTags();
  },


  methods: {
    getShops() {
      getAllShop().then(res => {
        this.shops = res.data || [];
      });
    },
    async getTaskTags() {
      this.taskTags = [];
      const { data } = await getOrderCollectionTypeSimpleList();
      if (data && data.length) {
        const tags = [];
        data.forEach(({ id, searchTags }) => {
          if (!searchTags) {
            return;
          }
          searchTags.split('\n').forEach(searchTag => {
            const [keys, label] = searchTag.split(':');
            const value = keys.split(',').map(key => {
              return id + ':' + key;
            });
            tags.push({ value, label });
          });
        });
        this.taskTags = tags;
      }
    },
    getShops() {
      getAllShop().then(res => {
        this.shops = res.data || [];
      });
    },
    getSelectStyle(tags, value) {
      if (!tags || tags.length == 0) {
        return 'text';
      }
      let selected = 0;
      for (let i = 0; i < tags.length; i++) {
        if (value.includes(tags[i])) {
          selected++;
        }
      }
      if (selected <= 0) {
        return 'text';
      }

      if (selected == value.length) {
        return 'primary';
      }

      return 'default';
    },
    toggleTaskTag({ value }) {
      if (!this.queryParams.tasks || this.queryParams.tasks.length <= 0) {
        this.queryParams.tasks = [...value];
        this.getList();
        return;
      }
      for (let i = 0; i < value.length; i++) {
        const v = value[i];
        const ti = this.queryParams.tasks.indexOf(v);
        if (ti >= 0) {
          this.queryParams.tasks.splice(ti, 1);
          continue;
        }
        this.queryParams.tasks.push(v);
      }
      this.getList();
    },
    addTask(id) {
      this.$refs.createTask.open(id);
    },
    handleSelectSkus() {
      this.$refs.skuSelect.open(this.form.items);
    },
    setItems(items) {
      this.form.items = this.form.items.concat(
        items.map(item => {
          return {
            ...item,
            num: 1,
          };
        }),
      );
    },
    resetAddresses() {
      this.addressOptions = [];
      this.form.addressId = '';
      getAddressListByUserId(this.form.userId).then(res => {
        this.addressOptions = res.data;
      });
    },
    reset() {
      this.form = {
        userId: '',
        addressId: '',
        items: [],
      };
      this.addressOptions = [];
    },
    handleAdd() {
      // this.reset();
      // this.showFormFlag = true;
      this.$router.push({ name: 'MallTradeOrderCreate' });
    },

    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm('是否要导出全部订单?')
        .then(() => {
          this.exportLoading = true;
          return exportOrderExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '交易订单.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },

    async removeItem(rowIndex) {
      const sure = await this.$modal.confirm('你确定要删除这条商品吗?', '提示').catch(() => false);
      if (sure) {
        this.form.items.splice(rowIndex, 1);
        return;
      }
      this.form.items[rowIndex].num = 1;
    },
    async createTradeOrder() {
      try {
        await this.$refs.form.validate();
        await createTradeOrder({
          addressId: this.form.addressId,
          userId: this.form.userId,
          couponId: '',
          remark: '',
          fromCart: false,
          items: this.form.items.map(item => {
            return {
              skuId: item.id,
              count: item.num,
            };
          }),
        });
        this.getList();
        this.showFormFlag = false;
      } catch (e) {
        console.log(e);
      }
    },
    spanPublicFields(rows, { row, column, rowIndex, columnIndex }) {
      if (['buyer', 'amount', 'status'].includes(column.property)) {
        return rowIndex == 0 ? [rows.length, 1] : [0, 0];
      }
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getOrderPage({
        ...this.queryParams,
        // 不理解这段代码意思
        tasks: this.queryParams.tasks ? this.queryParams.tasks.join(',') : undefined,
        searchType: undefined,
        searchValue: undefined,
        no: this.queryParams.searchType === 'no' ? this.queryParams.searchValue : undefined,
        userId: this.queryParams.searchType === 'userId' ? this.queryParams.searchValue : undefined,
        userNickname: this.queryParams.searchType === 'userNickname' ? this.queryParams.searchValue : undefined,
        userMobile: this.queryParams.searchType === 'userMobile' ? this.queryParams.searchValue : undefined,
        // receiverName: this.queryParams.searchType === 'receiverName' ? this.queryParams.searchValue : undefined,
        // receiverMobile: this.queryParams.searchType === 'receiverMobile' ? this.queryParams.searchValue : undefined,
        systemUserId: this.isSelf ? this.$store.getters.userId : undefined,
      }).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.activeTab = this.queryParams.status ? this.queryParams.status : 'all'; // 处理 tab
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** tab 切换 */
    tabClick(tab) {
      this.activeTab = tab.value;
      this.queryParams.status = tab.value === 'all' ? undefined : tab.value;
      this.getList();
    },
    goToDetail(row) {
      this.$router.push({ name: 'TradeOrderDetail', query: { id: row.id } });
    },
    async createMixinOrder(order) {
      let res = await getOrderCollectionList({ orderId: order.id });
      const tasks = res.data;
      const formIds = uniq(compact(tasks.map(({ formId }) => formId)));
      const recordIds = uniq(compact(tasks.map(({ recordId }) => recordId)));
      const [{ data: forms }, { data: records }] = await Promise.all([getFormList(formIds), getFormRecordList(recordIds)]);
      let tasks2 = tasks.map(task => {
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
      this.$refs.mixinOrder.open(order, tasks2);
    },
    toMixinOrder(row) {
      this.$router.push({ name: 'TradeMixinOrderDetail', query: { id: row.mixinOrderId } });
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
