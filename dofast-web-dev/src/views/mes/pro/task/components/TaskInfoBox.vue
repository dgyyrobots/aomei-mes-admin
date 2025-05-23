<template>
  <Card class="task-info-box" title="任务单信息">
    <div class="info-list">
      <div class="row">
        <span class="label">生产工单：</span>
        <span class="value">{{ data.taskCode }}</span>
        <span class="highlight">[{{ data.parentBatchCode }}]</span>
        <span class="normal">[正常工单]</span>
      </div>
      <div class="row">
        <span class="label">任务名称：</span>
        <span class="value text-ellipsis overflow-hidden whitespace-nowrap">{{ data.taskName }}</span>
      </div>
      <div class="row">
        <span class="label">工&nbsp;&nbsp;&nbsp;&nbsp;序：</span>
        <span class="value text-ellipsis overflow-hidden whitespace-nowrap">{{ data.processName }}</span>
      </div>
      <div class="row">
        <span class="label">产&nbsp;&nbsp;&nbsp;&nbsp;品：</span>
        <span class="value text-ellipsis overflow-hidden whitespace-nowrap">{{ data.itemName }} [{{  data.itemCode }}]</span>
      </div>
      <div class="row">
        <span class="label">计划时间：</span>
        <span class="value text-ellipsis overflow-hidden whitespace-nowrap">{{ parseTime(data.startTime) }} —— {{ parseTime(parseTime) }}</span>
      </div>
      <div class="row">
        <span class="label">实际开始：</span>
        <span class="value">{{ parseTime(data.actualStartTime) }} [计划数量：{{ data.quantity }}{{ data.unitOfMeasure }}]</span>
      </div>
      <div class="row">
        <span class="label">超&nbsp;&nbsp;&nbsp;&nbsp;时：</span>
        <span class="value">0.00 (小时)</span>
      </div>
    </div>
    <div class="progress-row">
      <div class="progress-bar-bg">
        <div class="progress-bar" :style="{ width: percent }"></div>
      </div>
      <span class="progress-percent">{{ percent }}</span>
    </div>
    <div class="footer">
      <span class="done">
        已完成：
        <span class="done-num">{{ data.quantityProduced }}</span>
        {{ data.unitOfMeasure }}
      </span>
      <span class="remain">
        未完成：
        <span class="remain-num">{{ data.quantity - data.quantityProduced }}</span>
        {{ data.unitOfMeasure }}
      </span>
    </div>
  </Card>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'TaskInfoBox',
  props: {
    data: {
      type: Object,
      default: () => ({
        taskCode: '',
        taskName: '',
        itemCode: '',
        itemName: '',
      }),
    }
  },
  components: {
    Card,
  },
  data() {
    return {
      // 这里可以定义一些数据
    }
  },
  computed: {
    // 这里可以定义一些计算属性
    percent() {
      const { quantityProduced, quantity } = this.data
      if (!quantity || !quantityProduced) {
        return '0%'
      }
      const percent = (quantityProduced / quantity) * 100
      return `${percent.toFixed(2)}%`
    }
  },
  methods: {
    // 这里可以定义一些方法
  },
}
</script>

<style scoped>
.task-info-box {
  width: 100%;
  height: 100%;
  /* background: rgba(10, 30, 60, 0.85); */
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.info-list {
  flex: 1;
  font-size: 14px;
}
.row {
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.label {
  color: #b6eaff;
  min-width: 80px;
  display: block;
}
.value {
  color: #fff;
  margin-right: 6px;
  flex: 1
}
.highlight {
  color: #ffe600;
  margin: 0 4px;
}
.normal {
  color: #b6eaff;
  margin-left: 4px;
}
.progress-row {
  display: flex;
  align-items: center;
  margin: 6px 0 2px 0;
}
.progress-bar-bg {
  flex: 1;
  height: 6px;
  background: #1ecfff33;
  margin-right: 8px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1ecfff 0%, #00eaff 100%);
}
.progress-percent {
  color: #1ecfff;
  font-size: 13px;
  min-width: 48px;
  text-align: right;
}
.footer {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin-top: auto;
  padding-top: 8px;
}
.done {
  color: #1ecfff;
}
.done-num {
  color: #3fd0ff;
  font-weight: bold;
  font-size: 18px;
}
.remain {
  color: #ffe600;
}
.remain-num {
  color: #ffe600;
  font-weight: bold;
  font-size: 18px;
}
</style>
