<template>
  <div class="app-container theme-dark">
    <ScaleBox :width="1920" :height="1080" bgc="#000000" :delay="100" :isFlat="false" >
      <div class="home">
        <!-- 顶部标题 -->
        <div class="header">
          <div class="left-info">
            <span class="date">{{ currentDate }}</span>
            <span class="weekday">{{ currentWeekday }}</span>
            <span class="time">{{ currentTime }}</span>
          </div>
          <h1 class="title">车间报工系统</h1>
          <div class="right-info">
            <span>{{ greeting }}</span>
            <span>欢迎您,</span>
            <span>{{ username }}</span>
          </div>
        </div>

        <!-- 按钮导航栏 -->
        <div class="button-nav">
          <!-- <button class="nav-btn">上机登记</button> -->
          <button class="nav-btn" @click="timeCount">计时登记</button>
          <button class="nav-btn" @click="errorCount">异常登记</button>
          <el-dropdown trigger="click" @command="onProCommand">
            <button class="nav-btn red">任务单操作</button>
            <el-dropdown-menu slot="dropdown" class="technological-theme">
              <el-dropdown-item v-if="detail.status === 'NORMAL' || detail.status === 'PAUSED' " @click="updateStatus('STARTED')">开工</el-dropdown-item>
              <el-dropdown-item v-else-if="detail.status === 'STARTED'" @click="updateStatus('PAUSED')">暂停</el-dropdown-item>
              <el-dropdown-item v-if="detail.status === 'STARTED'" @click="updateStatus('FINISHED')">完工</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown trigger="click" @command="onProCommand">
            <button class="nav-btn red">生产操作</button>
            <el-dropdown-menu slot="dropdown" class="technological-theme">
              <el-dropdown-item command="request">生产领料</el-dropdown-item>
              <el-dropdown-item command="loader">生产上料</el-dropdown-item>
              <el-dropdown-item command="report">生产报工</el-dropdown-item>
              <el-dropdown-item command="print">打印条码</el-dropdown-item>
              <el-dropdown-item command="store">成品入库</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <button class="nav-btn" @click="openTimeRegistration">计时登记</button> -->
          <!-- <button class="nav-btn">异常登记</button> -->
          <button class="nav-btn" @click="toQcList">质量管理</button>
          <button class="nav-btn" @click="toDeviceList">设备管理</button>
          <!-- <button class="nav-btn">其他操作</button> -->
          <!-- <button class="nav-btn">帮助</button> -->
        </div>

        <!-- 主要内容区 -->
        <div class="main-content">
          <!-- 左侧面板 -->
          <div class="panel left-panel">
            <div class="left-box box-1">
              <LicenseHistory :data="feedbackInfo" @search="getFeedbackInfo"/>
            </div>
            <div class="left-box box-2">
              <StaffInfo :current="staff" :data="staffInfo"/>
            </div>
          </div>

          <!-- 中间面板 -->
          <div class="panel center-panel">
            <div class="center-box box-1">
              <DashboardGauge :data="syncData" :detail="detail" :status-name="statusName"/>
            </div>
            <div class="center-box box-2">
              <MesIssueLine :data="issueList"/>
            </div>
          </div>

          <!-- 右侧面板 -->
          <div class="panel right-panel">
            <div class="right-box box-1">
              <TaskInfoBox :data="detail"/>
            </div>
            <div class="right-box box-2">
              <EquipmentHistory />
            </div>
            <div class="right-box box-3">
              <EquipmentTime />
            </div>
          </div>
        </div>

        <!-- 对话框组件 -->
        <TimeRegistration ref="timeRegistrationRef"  @success="getDetail"/>
        <!--  -->
        <MesDvMachinery ref="mesDvMachineryRef" :machinery-code="detail.machineryCode"  @success="getDetail"/>
        <!--  -->
        <MesQcIpqc ref="mesQcIpqcRef" :item-code="detail.itemCode"/>
        <!-- 生产上料 -->
        <MesProLoader ref="mesProLoaderRef" :taskCode="detail.taskCode" @success="getDetail"/>
        <!-- 打印条码 -->
        <MesProPrint ref="mesProPrintRef"  @success="getDetail"/>
        <!-- 生产报工 -->
        <MesProReport ref="mesProReportRef"  @success="getDetail"/>
        <!-- 生产领料 -->
        <MesProReq v-bind="detail" :taskId="detail.id" ref="mesProReqRef"  @success="getDetail"/>
        <!-- 成品入库 -->
        <MesProStore ref="mesProStoreRef" :taskCode="detail.taskCode" @success="getDetail"/>
        <!-- 异常登记 -->
        <MesException ref="mesExceptionRef" :task-code="detail.taskCode" @success="getDetail"/>
        <!-- 计时登记 -->
        <MesRegistration ref="mesRegistrationRef" :task-code="detail.taskCode" @success="getDetail"/>
      </div>
    </ScaleBox>
  </div>
</template>

<script>
import 'element-theme-darkplus/lib/index.css'
import { mapGetters } from 'vuex'
import ScaleBox from 'vue2-scale-box'
import TaskInfoBox from './components/TaskInfoBox.vue'
import DashboardGauge from './components/DashboardGauge.vue'
import EquipmentHistory from './components/EquipmentHistory.vue'
import LicenseHistory from './components/LicenseHistory.vue'
import EquipmentTime from './components/EquipmentTime.vue'
import PayInfo from './components/PayInfo.vue'
import StaffInfo from './components/StaffInfo.vue'
import CenterBottom from './components/CenterBottom.vue'
import TimeRegistration from './dialogs/TimeRegistration.vue'
import MesDvMachinery from './dialogs/MesDvMachinery.vue'
import MesQcIpqc from './dialogs/MesQcIpqc.vue'
import MesProLoader from './dialogs/MesProLoader.vue'
import MesProPrint from './dialogs/MesProPrint.vue'
import MesProReport from './dialogs/MesProReport.vue'
import MesProReq from './dialogs/MesProReq.vue'
import MesProStore from './dialogs/MesProStore.vue'
import MesIssueLine from './components/MesIssueLine.vue'
import MesException from './dialogs/MesException.vue'
import MesRegistration from './dialogs/MesRegistration.vue'
import { getProtask, updateProtask } from '@/api/mes/pro/protask.js'
import { getByTeamCodeAndShiftInfo } from '@/api/mes/cal/teammember.js'
import { listFeedback } from '@/api/mes/pro/feedback.js'
import { listIssueline } from '@/api/mes/wm/issueline.js'
import mqttTool from '@/utils/mqttTool.js'

export default {
  components: {
    TaskInfoBox,
    DashboardGauge,
    EquipmentHistory,
    LicenseHistory,
    EquipmentTime,
    PayInfo,
    StaffInfo,
    CenterBottom,
    MesIssueLine,
    MesException,
    MesRegistration,
    TimeRegistration,
    MesDvMachinery,
    MesQcIpqc,
    MesProLoader,
    MesProPrint,
    MesProReport,
    MesProReq,
    MesProStore,
    ScaleBox
  },
  data() {
    return {
      currentDate: '',
      currentTime: '',
      currentWeekday: '',
      greeting: '',
      $timer: null,
      detail: {
        attr1: '',
        taskCode: '',
        status: 'NORMAL',
        mechineryName: '',
        quantity: 0,
        quantityProduced: 0,
        quantityUnquanlify: 0,
        quantityQuanlify: 0,
      },
      staffInfo: [
        [],
        []
      ],
      feedbackInfo: [],
      staff: 0,
      syncData: {
        cl: 0,
        sd: 0,
      },
      issueList: [],
      statusName: '待机'
    }
  },
  computed: {
    // 计算属性可以在这里定义
    ...mapGetters({
      username: 'nickname'
    }),
    statusTopic() {
      const productId = 144;
      const deviceCode = 'FJ01';
      return `/${productId}/${deviceCode}/event/post`;
    },
    propertyTopic() {
      const productId = 144;
      const deviceCode = 'FJ01';
      return `/${productId}/${deviceCode}/ws/service`;
    }
  },
  methods: {
    timeCount() {
      this.$refs.mesRegistrationRef.openDialog(this.detail)
    },
    errorCount() {
      this.$refs.mesExceptionRef.openDialog(this.detail)
    },
    async getDetail() {
      this.unsubscribe()
      const id = this.$route.params.id;
      const res = await getProtask(id);
      this.detail = res.data;
      this.getStaffInfo();
      this.getFeedbackInfo();
      this.subscribe();
      this.getIssueList()
    },
    getIssueList() {
      listIssueline({ taskCode: this.detail.taskCode, pageSize: 100 }).then(res => {
        this.issueList = res.data ? res.data.list : [];
      }).catch(err => {
        console.error('获取问题列表失败:', err);
      });
    },
    async getStaffInfo() {
      const res = await Promise.all([
        getByTeamCodeAndShiftInfo(this.detail.attr1, 0),
        getByTeamCodeAndShiftInfo(this.detail.attr1, 1)
      ])
      this.staffInfo = res.map(({data}) => {
        return data
      });
      console.log(res)
    },
    async getFeedbackInfo(keyword) {
      const res = await listFeedback({taskCode: this.detail.taskCode, pageSize: 100, });
      this.feedbackInfo = res.data ? res.data.list: [];
    },
    subscribe() {
      mqttTool.subscribe(this.propertyTopic)
      mqttTool.subscribe(this.statusTopic)
    },
    unsubscribe() {
      mqttTool.unsubscribe(this.propertyTopic)
      mqttTool.unsubscribe(this.statusTopic)
    },
    toQcList() {
      this.$refs.mesQcIpqcRef.openDialog();
    },
    toDeviceList() {
      this.$refs.mesDvMachineryRef.openDialog();
    },
    onProCommand(command) {
      switch (command) {
        case 'request':
          this.$refs.mesProReqRef.openDialog(this.detail);
          break;
        case 'loader':
          this.$refs.mesProLoaderRef.openDialog(this.detail);
          break;
        case 'report':
          this.$refs.mesProReportRef.openDialog(this.detail);
          break;
        case 'print':
          this.$refs.mesProPrintRef.openDialog(this.detail);
          break;
        case 'store':
          this.$refs.mesProStoreRef.openDialog(this.detail);
          break;
        default:
          console.warn('未知的命令:', command);
      }
    },
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    formatTime(date) {
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    },
    getWeekday(date) {
      const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      return weekArr[date.getDay()]
    },
    getGreeting(hour) {
      if (hour < 6) return '凌晨好!'
      if (hour < 9) return '早上好!'
      if (hour < 12) return '上午好!'
      if (hour < 14) return '中午好!'
      if (hour < 18) return '下午好!'
      return '晚上好!'
    },
    updateStatus(status) {
      const id = this.$route.params.id;
      const params = {
        id: id,
        status: status
      }
      updateProtask(params).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.getDetail();
        } else {
          this.$message.error('操作失败');
        }
      }).catch(err => {
        console.error(err);
        this.$message.error('操作失败');
      });
    },
    updateDateTime() {
      const now = new Date()
      const hour = now.getHours()
      this.currentDate = this.formatDate(now)
      this.currentTime = this.formatTime(now)
      this.currentWeekday = this.getWeekday(now)
      this.greeting = this.getGreeting(now.getHours())
      this.staff = (( hour <= 19 ) && ( hour >= 7 ) ) ? 0 : 1 // 根据时间判断当前班次
    },
    openTimeRegistration() {
      this.$refs.timeRegistrationRef.openDialog()
    },
  },
  created() {
    this.getDetail();
    mqttTool.connect()
    mqttTool.client.on('message', (topic, message) => {
      const data = JSON.parse(message.toString());
      if (topic === this.propertyTopic) {
        this.syncData = data.reduce((acc, item) => {
          acc[item.id] = item.value;
          return acc;
        }, {  });
        console.log(this.syncData)
      }
      if (topic === this.statusTopic) {
        const status = data.reduce((acc, item) => {
          acc[item.id] = item.value;
          return acc;
        }, {});
        if (status.gz) {
          this.statusName = '故障'
        } else if (status.dj) {
          this.statusName = '待机'
        } else if (status.yx) {
          this.statusName = '运行'
        } else {
          this.statusName = '关机'
        }
      }
    });
  },
  mounted() {
    document.documentElement.classList.add("dark")
    this.updateDateTime() // 初始化时间
    this.$timer = setInterval(this.updateDateTime, 100) // 每秒更新一次
  },
  beforeDestroy() {
    document.documentElement.classList.remove("dark")
    this.unsubscribe(); // 取消订阅
    // 清除定时器
    if (this.$timer) {
      clearInterval(this.$timer)
      this.$timer = null
    }
  },
}
</script>

<style lang="scss" scoped>
.app-container{
  width: 100vw;
  height: 100vh;
  background-color: #000;
}
.home {
  width: 1920px;
  height: 1080px;
  position: relative;
  overflow: hidden;
  background-image: url('assets/bigscreen/big_bg1.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(#001529, 0.9);

  .header {
    height: 60px;
    display: grid;
    grid-template-columns: 1.5fr 1fr 1.5fr;
    align-items: center;
    background-image: url('assets/bigscreen/title3.png');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-bottom: 1px solid rgba(#40c4ff, 0.2);

    .left-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      color: #40c4ff;
      font-family: 'Digital-7', monospace;
      text-shadow: 0 0 10px rgba(#40c4ff, 0.5);
      padding-left: 12px;
    }

    .title {
      text-align: center;
      font-weight: bold;
      text-shadow: 0 0 20px rgba(#40c4ff, 0.5);
      color: #40c4ff;
      font-size: 28px;
      margin: 0;
    }

    .right-info {
      text-align: right;
      font-size: 16px;
      color: #00bcd4;
      text-shadow: 0 0 8px #ffe60055;
      padding-right: 24px;
      letter-spacing: 1px;
      span {
        margin-right: 8px;
      }
    }
  }

  /* 按钮导航样式 */
  .button-nav {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 10px 0;
    background-color: rgba(0, 0, 0, 0.2);

    .nav-btn {
      min-width: 90px;
      height: 36px;
      border: none;
      border-radius: 4px;
      background-color: #00bcd4; /* 默认蓝绿色按钮 */
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }

      &.red {
        background-color: #ff5252; /* 红色按钮 */
      }
    }
  }

  /* 主内容区三栏布局 */
  .main-content {
    height: calc(100% - 110px); /* 调整高度，考虑按钮导航的高度 */
    display: flex;
    gap: 10px;
    padding: 6px 12px 12px 12px;

    /* 面板通用样式 */
    .panel {
      border: none; /* 移除红色边框 */
      padding: 0;
      background-color: rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      gap: 10px; /* y轴间隔8px */
    }

    /* 左侧面板 */
    .left-panel {
      width: 28%;

      .left-box {
        width: 100%;

        &.box-1 {
          height: calc((100% - 16px) * 0.64);
        }

        &.box-2 {
          height: calc((100% - 16px) * 0.36);
        }
      }
    }

    /* 中间面板 */
    .center-panel {
      width: 44%;

      .center-box {
        width: 100%;
        &.box-1 {
          height: calc((100% - 8px) * 0.7); /* 总高度减去间隔后的70% */
        }

        &.box-2 {
          height: calc((100% - 8px) * 0.3); /* 总高度减去间隔后的30% */
        }
      }
    }

    /* 右侧面板 */
    .right-panel {
      width: 28%;

      .right-box {
        width: 100%;

        &.box-1 {
          height: calc((100% - 16px) * 0.36); /* 总高度减去间隔后的40% */
        }

        &.box-2 {
          height: calc((100% - 16px) * 0.32); /* 总高度减去间隔后的30% */
        }

        &.box-3 {
          height: calc((100% - 16px) * 0.32); /* 总高度减去间隔后的30% */
        }
      }
    }
  }
}

/* 添加动画 */
@keyframes logoFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8) rotateY(90deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotateY(0deg);
  }
}

@keyframes logoRepeat {
  0%,
  100% {
    transform: scale(1) rotateY(0deg);
  }
  50% {
    transform: scale(1.05) rotateY(10deg);
  }
}
</style>
