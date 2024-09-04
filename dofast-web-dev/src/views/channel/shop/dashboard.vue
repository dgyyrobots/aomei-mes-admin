<template>
  <el-container class="absolute inset-0 overflow-hidden" index="0">
    <el-header height="auto" class="!px-6 !pt-6">
      <el-row :gutter="20">
        <el-col v-bind="{ lg: 8, sm: 24 }" v-for="(total, i) in main_totals" :key="i" class="mb-6">
          <el-card class="rounded-2">
            <div class="flex">
              <div class="text-center p-3 rounded-5 bg-blue-100">
                <img :src="total.icon" alt="" class="w-14" />
              </div>
              <div class="flex flex-col ml-4 justify-between">
                <div>{{ total.title }}</div>
                <div>{{ total.value }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-header>
    <el-header class="!p-0 !m-0">
      <el-menu mode="horizontal" class="!px-5">
        <el-menu-item>店铺订单</el-menu-item>
      </el-menu>
    </el-header>
    <el-container class="overflow-hidden">
      <el-aside class="!p-0 !m-0 !bg-white">
        <el-menu class="min-h-full">
          <el-menu-item @click="showShopTotal()">全部订单</el-menu-item>
          <el-submenu v-for="(channel, i) in channel_shop_tree" :key="i" :index="channel.key">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ channel.label }}</span>
            </template>
            <el-menu-item v-for="shop in channel.children" :index="[channel.value, shop.id].join('-')" :key="shop.id" @click="showShopTotal(shop)">{{ shop.displayName }}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-card class="mb-5" :body-style="{ paddingBottom: 0 }">
          <template #header>
            <div>数据概览</div>
          </template>
          <el-row :gutter="20">
            <el-col v-bind="{ lg: 6, md: 12, xs: 24 }" v-for="(total, i) in shop_totals" :key="i" class="mb-7">
              <el-card>
                <div>{{ total.title }}</div>
                <div class="font-500 mt-3">
                  <span class="text-6">{{ total.value }}</span>
                  <span class="text-3">{{ total.unit }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <template #header>
            <div>订单累计同步概况</div>
          </template>
          <LineChart :chart-data="shop_day_total_value"></LineChart>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import DefaultIcon from '@/assets/images/order_reminder.svg';
import { getAllShop } from '@/api/channel/shop.js';
import { getTotal, getShopTotal, getShopDayTotal } from '@/api/channel/order.js';
import LineChart from './LineChart.vue';

export default {
  components: { LineChart },
  data() {
    return {
      main_total_value: {},
      shop_total_value: {},
      shop_day_total_value: [],
      shops: [],
    };
  },
  computed: {
    main_totals() {
      return [
        { icon: DefaultIcon, title: '今日同步', value: this.main_total_value.todayOrderCount || 0 },
        { icon: DefaultIcon, title: '昨日同步', value: this.main_total_value.yestdayOrderCount || 0 },
        { icon: DefaultIcon, title: '累计同步', value: this.main_total_value.orderCount || 0 },
      ];
    },
    shop_totals() {
      console.log(this.shop_total_value);
      return [
        { unit: '单', title: '今日同步', value: this.shop_total_value.todayOrderCount || 0 },
        { unit: '', title: '昨日同步', value: this.shop_total_value.yestdayOrderCount || 0 },
        { unit: '', title: '累计同步', value: this.shop_total_value.orderCount || 0 },
        { unit: '', title: '累计同步金额', value: this.shop_total_value.orderMoneyCount || 0 },
      ];
    },
    channel_shop_tree() {
      const exist_channels = this.shops.map(({ channel }) => channel);
      const channels = this.getDictDatas(this.DICT_TYPE.ORDER_FROM_CHANNEL)
        .filter(({ value }) => exist_channels.includes(value))
        .map(channel => {
          return {
            label: channel.label,
            key: channel.value,
            children: this.shops.filter(shop => shop.channel == channel.value),
          };
        });
      return channels;
    },
  },
  created() {
    this.getShops(0);
    this.getTotal();
    this.getShopTotal(0);
    this.getShopDayTotal(0);
  },
  methods: {
    async getShops() {
      this.shops = [];
      const { data } = await getAllShop();
      this.shops = data || [];
    },
    async getTotal() {
      this.main_total_value = {};
      const { data } = await getTotal();
      console.log(data);
      this.main_total_value = data || {};
    },
    async getShopTotal(shopId) {
      this.shop_total_value = {};
      const { data } = await getShopTotal(shopId);
      console.log(data);
      this.shop_total_value = data || {};
    },
    async getShopDayTotal(shopId) {
      this.shop_day_total_value = [];
      const { data } = await getShopDayTotal(shopId);
      this.shop_day_total_value = data || [];
    },
    showShopTotal(item) {
      this.getShopTotal(item ? item.id : 0);
      this.getShopDayTotal(item ? item.id : 0);
    },
  },
};
</script>
