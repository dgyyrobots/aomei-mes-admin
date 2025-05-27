<template>
  <!-- 添加或修改生产领料单头对话框 -->
  <el-dialog title="成品入库" :visible.sync="open" width="75%" append-to-body class="mes-pro-dialog" custom-class="cyber-modal">
    <el-table v-loading="loading" :data="feedbackList">
      <el-table-column label="工作站" width="180px" align="center" prop="workstationName"/>
      <el-table-column label="报工单号" width="210px" align="center" prop="feedbackCode"/>
      <el-table-column label="生产工单编号" width="150px" align="center" prop="workorderCode"/>
      <el-table-column label="产品物料名称" width="150px" align="center" prop="itemName" :show-overflow-tooltip="true"/>
      <el-table-column label="规格型号" align="center" prop="specification" :show-overflow-tooltip="true"/>
      <el-table-column label="生产工序" align="center" prop="processName"/>
      <el-table-column label="报工数量" align="center" prop="quantityFeedback"/>
      <el-table-column label="报工人" align="center" prop="nickName"/>
      <el-table-column label="报工时间" align="center" prop="feedbackTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.feedbackTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column width="130"  label="ERP报工状态" align="center" prop="erpFeedbackStatus">
        <template v-slot="scope">
          <span v-if="scope.row.erpFeedbackStatus === 'N'">未同步</span>
          <span v-else>已同步</span>
        </template>
      </el-table-column>
      <el-table-column width="130"  label="ERP入库状态" align="center" prop="erpWarehousingStatus">
        <template v-slot="scope">
          <span v-if="scope.row.erpWarehousingStatus === 'N'">未同步</span>
          <span v-else>已同步</span>
        </template>
      </el-table-column>

      <el-table-column width="150" label="来源单号" :show-overflow-tooltip="true" align="center" prop="originCode"/>

      <el-table-column width="150" fixed="right" label="批次号" align="center" prop="batchCode"/>

      <el-table-column  fixed="right" label="操作" align="center" width="190px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-query" @click="handleStore(scope.row)" v-if="scope.row.status === 'FINISHED' || scope.row.status === 'PRINTED'">入库</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList"/>
  </el-dialog>
</template>
<script>
import { listFeedback, checkProcess, startWareHousing } from '@/api/mes/pro/feedback'
export default {
  dicts: ['mes_order_status', 'mes_feedback_type', 'mes_shift_info', 'mes_pro_task_status', 'sys_yes_no'],
  props: {
    taskCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      open: false,
      loading: false,
      total: 0,
      queryParams: {
        pageNo: 1,
        pageSize: 10
      },
      feedbackList: []
    }
  },
  methods: {
    /** 查询生产报工记录列表 */
    getList() {
      this.loading = true
      listFeedback({ ...this.queryParams, taskCode: this.taskCode }).then(response => {
        this.feedbackList = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    openDialog() {
      this.open = true
      this.getList()
    },
    async handleStore(row) {
      console.log(row)
      const response = await checkProcess(row.id)
      console.log('response: ', response)
      if (!response.data.process && response.data.taskStatus === 'FINISHED') { // 末工序且设置为'已完成'
        // 追加判定
        try {
          const yes = await this.$modal.confirm('当前任务单确认完成吗? 任务单: ' + response.data.taskCode + ' , 计划数量: ' + response.data.planQuantity + ', 总报工合格数: ' + response.data.qualityQuantity).catch(() => null)
          if (!yes) {
            return
          }
          this.loading = true
          await startWareHousing({ wareList: [row] })
          this.loading = false
          this.$modal.msgSuccess('入库成功')
        } catch (e) {
          this.loading = false
          console.error('入库失败:', e)
          this.$message.error(`入库失败`)
        }
      } else {
        try {
          const yes = this.$modal.confirm('确认入库这条报工单？').catch(() => null)
          if (!yes) {
            return
          }
          this.loading = true
          await startWareHousing({ wareList: [row] })
          this.$modal.msgSuccess('入库成功')
          this.getList()
          this.loading = false
        } catch (e) {
          this.loading = false
          console.error('入库失败:', e)
          this.$message.error(`入库失败`)
        }
      }
    }
  }
}
</script>
<style lang="scss">
/* 全局样式，不使用scoped */
.cyber-modal {
  background-color: rgba(0, 21, 41, 0.85) !important;
  backdrop-filter: blur(5px);
}

/* 强制覆盖Element Plus对话框样式 */
.el-dialog__wrapper.mes-pro-dialog {
  .el-dialog {
    background-color: rgba(0, 21, 41, 0.85);
    border: 1px solid #1ecfff;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(30, 207, 255, 0.4);
    margin-top: 8vh !important; /* 确保优先级足够高 */
    .pagination-container{
      background-color: transparent;
    }

    .el-dialog__header {
      color: #1ecfff !important;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
    }

    .el-dialog__title {
      color: #1ecfff !important;
      font-weight: 500;
      letter-spacing: 1px;
      text-shadow: 0 0 8px rgba(30, 207, 255, 0.5);
      font-size: 16px;
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #1ecfff !important;

      &:hover {
        color: #4fdcff !important;
      }
    }
  }
}

/* 修改loading样式 */
.el-loading-mask {
  background-color: rgba(0, 21, 41, 0.7) !important;

  .el-loading-spinner {
    .circular {
      .path {
        stroke: #1ecfff !important;
      }
    }

    .el-loading-text {
      color: #1ecfff !important;
    }
  }
}
</style>
