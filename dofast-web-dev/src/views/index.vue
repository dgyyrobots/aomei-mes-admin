<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col> -->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :chart-data="lineChartData3" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <bar-chart :chart-data="lineChartData2" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getOrderMonthCount } from '@/api/mall/trade/order.js';


import { getOrderMonthTotal, getOrderMoneyMonthTotal } from '@/api/channel/order.js';
import PanelGroup from './dashboard/PanelGroup';
import LineChart from './dashboard/LineChart';
import RaddarChart from './dashboard/RaddarChart';
import PieChart from './dashboard/PieChart';
import BarChart from './dashboard/BarChart';
import {getWorkorderMonthCount} from "@/api/mes/pro/workorder";
import {getTaskMonthCount} from "@/api/mes/pro/protask";

const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      lineChartData: {
        previous: [],
        current: [],
        months: [],
      },
      lineChartData2: {
        xse: [],
        yue: [],
      },
      lineChartData3: {
        value: [],
        data: [],
        box: {}
      },
    };
  },
  async created() {
    // getOrderMonthCount('previous');
    // getOrderMonthCount();
    // let data = await getOrderMonthTotal();
    // console.log(data)
    // let data2 = await getOrderMoneyMonthTotal();
    // console.log(data2)
    this.getOrderMoneyMonthTotal();
    this.handleSetLineChartData();
    this.getOrderMonthTotal();
  },
  methods: {
    async handleSetLineChartData(type) {
      const [_previous, _current] = await Promise.all([getWorkorderMonthCount('previous').then(({ data }) => data), getWorkorderMonthCount().then(({ data }) => data)]);
      const maxMonth = new Date().getMonth() + 1;
      const previous = [];
      const current = [];
      const months = [];
      const currentYear = new Date().getFullYear();
      const previousYear = currentYear * 1 - 1 + '';
      for (let i = 0; i < 12; i++) {
        const month = (i + 101).toString().substring(1);
        months.push(MONTHS[i % 12]);
        previous.push(_previous[previousYear + '-' + month] || 0);
        if (i < maxMonth) {
          current.push(_current[currentYear + '-' + month] || 0);
        }
      }
      this.lineChartData = { previous, current, months }
    },
    async getOrderMoneyMonthTotal() {
      // let { data } = await getOrderMoneyMonthTotal();
      let { data } = await getTaskMonthCount('previous');
      let xse = [];
      Object.keys(data).forEach(r => xse[r.slice(-2) - 1] = data[r]);
      let yue = MONTHS;
      this.lineChartData2 = { xse, yue };
    },
    async getOrderMonthTotal() {
      let { data } = await getOrderMonthTotal();
      let value = Object.keys(data).map(item => {
        return { name: item, value: data[item] }
      })
      let box = {};
      Object.keys(data).forEach(item => box[item] = item);
      this.lineChartData3 = { data: Object.keys(data), value, box }
    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
