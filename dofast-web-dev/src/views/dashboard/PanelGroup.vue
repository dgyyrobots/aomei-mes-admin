<template>
  <div class="panel-group grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 gap-10">
    <div :key="i" class="card-panel-col" v-for="(item, i) in data"
         v-hasPermi="['channel:order:query', 'trade:order:query']">
      <div class="card-panel sm:flex md:flex lg:block !sm:flex-justify-center !md:flex-justify-center"
           @click="handleSetLineChartData(item.type)" :style="{ backgroundColor: item.color }">
        <div class="card-panel-icon-wrapper hidden-xm-and-down hiddens">
          <svg-icon :icon-class="item.icon" class-name="card-panel-icon" />
        </div>
        <div
          class="card-panel-description sm:flex-1 md:flex-1 lg:flex-0 !sm:mx-auto !md:mx-auto !lg:mr-10 !sm:w-full !md:w-full !lg:w-30 !sm:text-center !md:text-center lg:text-left">
          <div class="card-panel-text">
            {{ item.title }}
          </div>
          <count-to v-if="item.type !== 'mineTask'" :start-val="0" :end-val="item.value" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to';
import dataAnalysis from '@/api/dataAnalysis';
export default {
  components: {
    CountTo,
  },
  data() {
    return {
      data: [
        /*   { icon: 'shopping', title: '渠道营业额', value: 0, color: '#7d7efc', span: { xs: 12, sm: 8, lg: 4 } },
           { icon: 'monitor', title: '销售成交额', value: 0, color: '#02cdc6', span: { xs: 12, sm: 8, lg: 4 } },*/
        /*  { icon: 'clipboard', title: '应收款', value: 0, color: '#fb644b', span: { xs: 12, sm: 8, lg: 4 } },
          { icon: 'documentation', title: '应付款', value: 0, color: '#fe840f', span: { xs: 12, sm: 8, lg: 4 } },*/
        /* { icon: 'merchant', title: '客户总数', value: 0, color: '#7d7efc', span: { xs: 12, sm: 8, lg: 4 } },
         { icon: 'pay', title: '供应商数', value: 0, color: '#fb644b', span: { xs: 12, sm: 8, lg: 4 } },*/
        { icon: 'number', title: '物料总数', value: 0, color: '#fe840f', span: { xs: 12, sm: 8, lg: 4 } , type: 'newVisitis'},
        { icon: 'link', title: '工单总数', value: 0, color: '#fe840f', span: { xs: 12, sm: 8, lg: 4 } , type: 'newVisitis'},
        { icon: 'list', title: '委外工单', value: 0, color: '#7d7efc', span: { xs: 12, sm: 8, lg: 4 } , type: 'newVisitis'},
        { icon: 'example', title: '待排产任务', value: 0, color: '#fb644b', span: { xs: 12, sm: 8, lg: 4 } , type: 'newVisitis'},
        { icon: 'example', title: '我的任务', value: 0, color: '#7d7efc', span: { xs: 12, sm: 8, lg: 4 } , type: 'mineTask'},
        /*  { icon: 'list', title: '待发货订单', value: 0, color: '#7d7efc', span: { xs: 12, sm: 8, lg: 4 } },
          { icon: 'example', title: '待出库订单', value: 0, color: '#fb644b', span: { xs: 12, sm: 8, lg: 4 } },*/
      ],
    };
  },
  methods: {
    handleSetLineChartData(type) {
      console.log(type);
      if(type === 'mineTask'){
        this.$router.push({ name: 'myprotask' });
      }else{
        this.$emit('handleSetLineChartData', type);
      }
    },
  },
  created() {
    let ar1 = Object.values(dataAnalysis).map(item => item());
    let a = Promise.all(ar1)
    a.then(res => {
      res.forEach((item, index) => this.data[index].value = item.data);
    })
  }
};
</script>

<style lang="scss" scoped>
@media (min-width: 640px) and (max-width: 1440px) {
  .hiddens {
    display: none;
  }
}

.panel-group {
  // margin-top: 18px;

  .card-panel-col {
    //margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 10px;

    &:hover {
      opacity: 0.9;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      position: absolute;
      right: 0;
      top: 0;
      width: 60px;
      overflow: visible;
      white-space: nowrap;
      font-weight: bold;
      margin: 26px 26px 26px 0;

      .card-panel-text {
        line-height: 18px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
