<template>
  <div class="dashboard-gauge">
    <div ref="gaugeRef" class="gauge-echart"></div>
    <!-- 文本和按钮叠加层 -->
    <div class="gauge-overlay">
      <div class="detail-text">{{ detail.machineryName }}</div>
      <div class="detail-button">当前产量清零</div>
      <!-- <div class="target-text">
        <el-icon class="no-inherit" color="#ff5555" />
        <span>预警数量： 3000</span>
      </div> -->
    </div>
    <!-- 左上 -->
    <div class="gauge-label gauge-label-topleft">
      <div class="gauge-value yellow">{{ detail.quantityUnquanlify }}</div>
      <div class="gauge-desc">剔废数量</div>
      <svg class="gauge-fold-line" height="24" width="80">
        <polyline points="0,6 40,6 70,22" style="fill: none; stroke: #1ecfff; stroke-width: 2" />
      </svg>
    </div>
    <!-- 左下 -->
    <div class="gauge-label gauge-label-bottomleft">
      <div class="gauge-value yellow">{{ speed }}</div>
      <div class="gauge-desc">当前速度</div>
      <svg class="gauge-fold-line" height="24" width="80">
        <polyline points="0,18 40,18 70,2" style="fill: none; stroke: #1ecfff; stroke-width: 2" />
      </svg>
    </div>
    <!-- 右上 -->
    <div class="gauge-label gauge-label-topright">
      <div class="gauge-value yellow">{{ detail.quantityQuanlify }}</div>
      <div class="gauge-desc">正常产量</div>
      <svg class="gauge-fold-line" height="24" width="80">
        <polyline points="80,6 40,6 10,22" style="fill: none; stroke: #1ecfff; stroke-width: 2" />
      </svg>
    </div>
    <!-- 右下 -->
    <div class="gauge-label gauge-label-bottomright">
      <div class="gauge-value yellow">{{ overVersion }}</div>
      <div class="gauge-desc">过版数量</div>
      <svg class="gauge-fold-line" height="24" width="80">
        <polyline points="80,18 40,18 10,2" style="fill: none; stroke: #1ecfff; stroke-width: 2" />
      </svg>
    </div>
    <!-- 顶部左侧：顺产换板 + el-switch -->
    <div class="top-abs top-left">
      <span class="switch-label">顺序换板：</span>
      <el-switch v-model="switchValue" active-color="#22e222" inactive-color="#444" size="small"
        style="--el-switch-on-color: #22e222; --el-switch-off-color: #444" />
    </div>
    <!-- 顶部右侧：黄色圆点 + 空转 -->
    <div class="top-abs top-right" :class="statusColor">
      <span class="dot"></span>
      <span class="dot-label">{{ statusName }}</span>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    statusName: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    detail: {
      type: Object,
      default() {
        return {
          machineryName: '',
          quantity: 0,
          quantityProduced: 0,
          quantityUnquanlify: 0,
          quantityQuanlify: 0,
        }
      },
    },
  },
  data() {
    return {
      switchValue: true,
      speed: 0,
      produced: 0,
      overVersion: 0
    }
  },
  computed: {
    percent() {
      const { quantity, quantityQuanlify } = this.detail
      if (!quantity || !quantityQuanlify) {
        return 0
      }
      return Math.min((quantityQuanlify / quantity) * 100, 100)
    },
    statusColor() {
      return {
        '故障': 'red',
        '待机': 'orange',
        '运行': 'green',
        '未知': 'blue'
      }[this.statusName] || ''
    }
  },
  watch: {
    data: {
      handler(newData) {
        this.speed = newData.sd || 0
        this.produced = newData.cl || 0
        if (this.chart) {
          this.initChart()
        }
      },
      deep: true,
    },
    'detail.machineryName': {
      handler(newName) {
        console.log("触发设备变更: ", newName);
        this.detail.machineryName = newName;
        console.log("this.detail.machineryName", this.detail.machineryName);
        this.initChart();
      },
      deep: true,
    },
  },
  mounted() {
    this.chart = echarts.init(this.$refs.gaugeRef)
    this.initChart()
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    initChart() {
      const newData = {
        value: this.percent,
        name: '当前产量',
        max: 100,
      }

      const option = {
        title: [
          {
            text: newData.name,
            x: '50%',
            y: '30%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '16',
              fontFamily: 'SourceHanSansCN-Medium',
              color: '#ffff99',
            },
          },
          {
            text: this.produced.toString(),
            x: '50%',
            y: '39%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '40',
              fontFamily: 'Digital-7',
              color: '#ffffff',
            },
          },
        ],
        angleAxis: {
          show: false,
          max: (newData.max * 360) / 270,
          type: 'value',
          startAngle: 225,
          splitLine: {
            show: false,
          },
        },
        barMaxWidth: 18,
        radiusAxis: {
          show: false,
          type: 'category',
        },
        polar: {
          center: ['50%', '50%'],
          radius: '120%',
        },
        series: [
          // 最外层圆环形
          {
            type: 'gauge',
            radius: '84%',
            center: ['50%', '50%'],
            splitNumber: 10,
            max: 100,
            startAngle: 225,
            endAngle: -45,
            z: 99,
            axisLine: {
              lineStyle: {
                width: 1,
                color: [[1, 'rgba(255,255,255,0)']],
              },
              detail: {
                formatter: '{value}',
              },
              data: [
                {
                  value: 50,
                  name: 'SCORE',
                },
              ],
            },
            axisTick: {
              show: true,
              splitNumber: 5,
              lineStyle: {
                color: 'rgba(203, 126, 210, 1)',
                width: 1,
              },
              length: 20,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            title: {
              show: false,
            },
          },
          {
            type: 'bar',
            data: [
              {
                value: 85, // 展示85%的进度
              },
            ],
            itemStyle: {
              borderRadius: '90%',
              opacity: 1,
              color: {
                type: 'linear',
                x: 1,
                y: 0,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(211, 210, 253, 0.2)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(248, 190, 249, 1)',
                  },
                ],
                global: false,
              },
            },
            barGap: '-100%',
            coordinateSystem: 'polar',
            roundCap: true,
            z: 3,
          },
          {
            type: 'bar',
            data: [
              {
                value: newData.max,
                itemStyle: {
                  color: 'rgba(223, 210, 252, 1)',
                  opacity: 0.2,
                  borderWidth: 0,
                },
              },
            ],
            barGap: '-100%',
            coordinateSystem: 'polar',
            roundCap: true,
            z: 6,
          },
          {
            name: '数量',
            type: 'pie',
            animation: false,
            hoverAnimation: false,
            clockwise: false,
            radius: '50%',
            center: ['50%', '50%'],
            data: [10],
            itemStyle: {
              normal: {
                color: 'rgba(101, 106, 197, 0.5)',
              },
            },
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '14',
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
          },
          {
            name: '数量',
            type: 'pie',
            z: -1,
            animation: false,
            hoverAnimation: false,
            clockwise: false,
            radius: '90%',
            center: ['50%', '50%'],
            data: [10],
            itemStyle: {
              normal: {
                color: 'rgba(101, 106, 197, 0.3)',
              },
            },
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '14',
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
          },
          {
            name: '数量',
            type: 'pie',
            z: -1,
            animation: false,
            hoverAnimation: false,
            clockwise: false,
            radius: '100%',
            center: ['50%', '50%'],
            data: [10],
            itemStyle: {
              normal: {
                color: 'rgba(101, 106, 197, 0.2)',
              },
            },
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '14',
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
          },
        ],
      }
      this.chart.setOption(option)
    },
  },
}
</script>

<style scoped>
.dashboard-gauge {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-echart {
  width: 600px;
  height: 460px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.gauge-overlay {
  position: absolute;
  width: 300px;
  height: 200px;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 4;
  pointer-events: none;
}

.detail-text {
  color: #bbbbff;
  font-size: 14px;
  background-color: rgba(30, 144, 255, 0.1);
  padding: 5px 10px;
  border-radius: 2px;
  border: 1px solid #3a7afe;
  margin-top: 75px;
}

.detail-button {
  color: #ffffff;
  font-size: 14px;
  background-color: #6583fd;
  padding: 6px 15px;
  border-radius: 3px;
  cursor: pointer;
  pointer-events: auto;
  margin-top: 5px;
}

.target-text {
  color: #ff5555;
  font-size: 14px;
  background-color: #4a4d90;
  padding: 5px 10px;
  border-radius: 2px;
  border: 1px solid #9eadfb;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.gauge-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
}

.gauge-label .gauge-value {
  color: #ffe600;
  font-size: 32px;
  font-weight: bold;
  text-shadow: 0 0 8px #ffe60088;
}

.gauge-label .gauge-desc {
  color: #1ecfff;
  font-size: 16px;
  margin-bottom: 2px;
}

.gauge-label .gauge-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #1ecfff 60%, #1ecfff00 100%);
  margin-top: 2px;
}

.gauge-label .gauge-line.right {
  background: linear-gradient(270deg, #1ecfff 60%, #1ecfff00 100%);
}

.gauge-label-topleft {
  left: 68px;
  top: 60px;
  align-items: flex-start;
}

.gauge-label-bottomleft {
  left: 68px;
  bottom: 60px;
  align-items: flex-start;
}

.gauge-label-topright {
  right: 68px;
  top: 60px;
  align-items: flex-end;
}

.gauge-label-bottomright {
  right: 68px;
  bottom: 60px;
  align-items: flex-end;
}

.top-abs {
  position: absolute;
  top: 10px;
  z-index: 10;
  display: flex;
  align-items: center;
}

.top-left {
  left: 18px;
}

.top-right {
  right: 32px;
}

.switch-label {
  color: #fff;
  font-size: 15px;
  margin-right: 6px;
  letter-spacing: 1px;
  text-shadow: 0 0 4px #000;
}

.dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffe600;

  box-shadow: 0 0 8px #ffe60088;
}

.dot-label {
  color: #ffe600;
  font-size: 16px;
  font-weight: 600;
  margin-left: 16px;
  letter-spacing: 1px;
  text-shadow: 0 0 4px #000;
}
.red{
  .dot{
    background: #ff5555;
  }
  .dot-lable{
    color: #ff5555;
  }
}
.orange{
  .dot{
    background: #ff8800;
  }
  .dot-lable{
    color: #ff8800;
  }
}
.green{
  .dot{
    background: #22e222;
  }
  .dot-lable{
    color: #22e222;
  }
}
.blue{
  .dot{
    background: #1ecfff;
  }
  .dot-lable{
    color: #1ecfff;
  }
}
</style>
