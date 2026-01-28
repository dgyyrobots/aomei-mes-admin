<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="工单创建时间" prop="queryTime">
        <el-date-picker
          v-model="queryParams.queryTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="工单号" prop="workorderCode">
        <el-input
          v-model="queryParams.workorderCode"
          placeholder="请输入工单信息"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="生产工序" prop="processCode">
        <el-select v-model="queryParams.processCode" placeholder="请选择工序" clearable>
          <el-option v-for="item in processOptions" :key="item.processCode" :label="item.processName" :value="item.processCode"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 树状表格 -->
    <el-table
      v-loading="loading"
      :data="treeData"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      border
      style="width: 100%"
    >
      <!-- 名称列 -->
      <el-table-column prop="name" label="名称" align="left" min-width="250">
        <template slot-scope="scope">
          <span :style="getRowStyle(scope.row)">
            {{ scope.row.name }}
            <!-- 第五级：成员标签 -->
            <el-tag v-if="scope.row.level === 5 && scope.row.type === 'member'" size="mini" type="info" style="margin-left: 8px;">
              {{ scope.row.userName }}
            </el-tag>
          </span>
        </template>
      </el-table-column>

      <!-- 工单信息列 -->
      <el-table-column label="工单信息" align="center" min-width="130">
        <template slot-scope="scope">
          <div v-if="scope.row.level === 1">
            <div>{{ scope.row.workorderCode }}</div>
            <div style="font-size: 12px; color: #909399;">{{ scope.row.processName }}</div>
          </div>
          <div v-else-if="scope.row.level === 3">
            <div>{{ scope.row.machineryName }}</div>
            <div style="font-size: 12px; color: #909399;">{{ scope.row.machineryCode }}</div>
          </div>

          <div v-else-if="scope.row.level === 5 && scope.row.originFeedbackCode">
            <div>{{ scope.row.originFeedbackCode }}</div>
            <div style="font-size: 12px; color: #909399;">来源报工单</div>
          </div>

          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 工序信息列 -->
      <el-table-column label="工序信息" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.level === 1">
            <div>{{ scope.row.processCode }}</div>
            <div style="font-size: 12px; color: #909399;">{{ scope.row.processName }}</div>
          </div>

          <div v-else-if="scope.row.level === 5 && scope.row.processName">
            <div>{{ scope.row.processName }}</div>
            <div style="font-size: 12px; color: #909399;">所属工序</div>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 总投入列 -->
      <el-table-column prop="totalInput" label="总投入" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 1">
            {{ formatNumber(scope.row.totalInput) }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 合格数量列 -->
      <el-table-column label="合格数量" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 1">
            {{ formatNumber(scope.row.totalQualified) }}
          </span>
          <span v-else-if="scope.row.level === 2">
            {{ formatNumber(scope.row.teamTotalQualified) }}
          </span>
          <span v-else-if="scope.row.level === 3">
            {{ formatNumber(scope.row.quantityQualified) }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 不良品列 -->
      <el-table-column label="不良品" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 1">
            {{ formatNumber(scope.row.totalUnQualified) }}
          </span>
          <span v-else-if="scope.row.level === 2">
            {{ formatNumber(scope.row.teamTotalUnQualified) }}
          </span>
          <span v-else-if="scope.row.level === 3">
            {{ formatNumber(scope.row.quantityUnQualified) }}
          </span>
          <span v-else-if="scope.row.level === 5 && scope.row.type === 'defect'">
            {{ formatNumber(scope.row.defectQuantity) }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 合格率列 -->
      <el-table-column prop="passRate" label="合格率" align="center">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.level === 1"
            :type="getRateType(scope.row.passRate)"
            size="small"
          >
            {{ scope.row.passRate }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 批次号列 -->
      <el-table-column label="批次号" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.level === 1">
            <div>{{ scope.row.taskCode }}</div>
            <div style="font-size: 12px; color: #909399;">母批次</div>
          </div>

          <div v-if="scope.row.level === 3">
            <div>{{ scope.row.batchCode }}</div>
            <div style="font-size: 12px; color: #909399;">子批次</div>
          </div>

          <div v-if="scope.row.level === 5 && scope.row.originBatchCode">
            <div>{{ scope.row.originBatchCode }}</div>
            <div style="font-size: 12px; color: #909399;">来源批次</div>
          </div>

        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { teamQualityReport } from '@/api/mes/pro/workorder';
import {listProcess} from "@/api/mes/pro/process";

export default {
  name: 'TeamMemberQualityTreeReport',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 是否展开所有
      isExpandAll: true,
      // 查询参数
      queryParams: {
        queryTime: undefined,
        workorderCode: undefined,
      },
      // 原始数据
      taskList: [],
      // 树形数据
      treeData: [],
      // 统计信息
      totalTasks: 0,
      totalTeams: 0,
      totalFeedbacks: 0,
      overallPassRate: '0.00%',
      // 控制列的显示
      showDefectReason: true,
      // 工序选项
      processOptions: [],
    };
  },
  created() {
    this.setDefaultQueryTime();
    this.getProcess();
    this.getList();
  },
  methods: {
    setDefaultQueryTime() {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const today = new Date();

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };
      this.queryParams.queryTime = [
        formatDate(firstDay),
        formatDate(today)
      ];
    },
    // 获取列表数据
    getList() {
      this.loading = true;
      const params = {};

      if (this.queryParams.queryTime && this.queryParams.queryTime.length === 2) {
        params.beginTime = this.queryParams.queryTime[0];
        params.endTime = this.queryParams.queryTime[1];
      }

      if (this.queryParams.workorderCode) {
        params.workorderCode = this.queryParams.workorderCode;
      }

      if (this.queryParams.processCode) {
        params.processCode = this.queryParams.processCode;
      }

      teamQualityReport(params).then(response => {
        this.taskList = response.data || [];
        this.transformToTreeData();
        this.calculateStatistics();
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },

    // 将原始数据转换为树形数据（五级结构）
    transformToTreeData() {
      this.treeData = [];
      let idCounter = 1;

      this.taskList.forEach((task, taskIndex) => {
        // 第一级：任务单节点
        const taskNode = {
          id: idCounter++,
          level: 1,
          name: `${task.taskCode} - ${task.processName}工序`,
          workorderCode: task.workorderCode,
          taskCode: task.taskCode,
          processCode: task.processCode,
          processName: task.processName,
          totalInput: parseFloat(task.totalInput) || 0,
          totalQualified: parseFloat(task.totalQualified) || 0,
          totalUnQualified: parseFloat(task.totalUnQualified) || 0,
          passRate: task.passRate || '0.00%',
          expanded: this.isExpandAll,
          children: []
        };

        // 第二级：班组节点（按班组成员分组）
        if (task.teamResult && task.teamResult.length > 0) {
          task.teamResult.forEach((team, teamIndex) => {
            const teamNode = {
              id: idCounter++,
              level: 2,
              name: team.displayName || `班组: ${team.teamCode}`,
              teamCode: team.teamCode,
              teamName: team.teamName || team.teamCode,
              memberKey: team.memberKey,
              memberList: team.memberList || [],
              teamTotalQualified: parseFloat(team.teamTotalQualified) || 0,
              teamTotalUnQualified: parseFloat(team.teamTotalUnQualified) || 0,
              expanded: this.isExpandAll,
              children: []
            };

            // 第三级：报工节点
            if (team.feedbackResult && team.feedbackResult.length > 0) {
              team.feedbackResult.forEach((feedback, feedbackIndex) => {
                const feedbackNode = {
                  id: idCounter++,
                  level: 3,
                  name: feedback.feedbackCode,
                  feedbackCode: feedback.feedbackCode,
                  taskCode: feedback.taskCode,
                  workorderCode: feedback.workorderCode,
                  teamCode: feedback.teamCode,
                  machineryName: feedback.machineryName,
                  machineryCode: feedback.machineryCode,
                  quantityQualified: parseFloat(feedback.quantityQualified) || 0,
                  quantityUnQualified: parseFloat(feedback.quantityUnQualified) || 0,
                  batchCode: feedback.batchCode,
                  expanded: this.isExpandAll,
                  children: []
                };

                // 第四级：班组信息节点
                const teamInfoNode = {
                  id: idCounter++,
                  level: 4,
                  name: '班组信息',
                  type: 'team-info',
                  expanded: false,
                  children: []
                };

                // 第四级：缺陷明细节点
                const defectInfoNode = {
                  id: idCounter++,
                  level: 4,
                  name: '缺陷明细',
                  type: 'defect-info',
                  expanded: false,
                  children: []
                };

                // 第五级：班组成员节点（班组信息下）
                if (feedback.teamMemberResult && feedback.teamMemberResult.length > 0) {
                  feedback.teamMemberResult.forEach((member, memberIndex) => {
                    const memberNode = {
                      id: idCounter++,
                      level: 5,
                      name: member.nickName,
                      type: 'member',
                      feedbackId: member.feedbackId,
                      nickName: member.nickName,
                      userName: member.userName,
                      quantity: parseFloat(member.quantity) || 0,
                    };
                    teamInfoNode.children.push(memberNode);
                  });
                } else {
                  teamInfoNode.children.push({
                    id: idCounter++,
                    level: 5,
                    name: '无班组成员数据',
                    type: 'empty',
                    empty: true
                  });
                }

                // 第五级：缺陷详情节点（缺陷明细下）
                if (feedback.defectResult && feedback.defectResult.length > 0) {
                  feedback.defectResult.forEach((defect, defectIndex) => {
                    const defectNode = {
                      id: idCounter++,
                      level: 5,
                      name: defect.defectName || '未知缺陷',
                      type: 'defect',
                      defectCode: defect.defectCode,
                      defectName: defect.defectName,
                      defectQuantity: parseFloat(defect.defectQuantity) || 0,

                      processName: defect.processName,
                      originTeamCode: defect.originTeamCode,
                      originBatchCode: defect.originBatchCode,
                      originFeedbackCode: defect.originFeedbackCode,
                    };
                    defectInfoNode.children.push(defectNode);
                  });
                } else {
                  defectInfoNode.children.push({
                    id: idCounter++,
                    level: 5,
                    name: '无缺陷数据',
                    type: 'empty',
                    empty: true
                  });
                }

                // 将第四级节点添加到报工节点
                feedbackNode.children.push(teamInfoNode, defectInfoNode);
                teamNode.children.push(feedbackNode);
              });
            } else {
              teamNode.children.push({
                id: idCounter++,
                level: 3,
                name: '无报工数据',
                empty: true
              });
            }

            taskNode.children.push(teamNode);
          });
        } else {
          taskNode.children.push({
            id: idCounter++,
            level: 2,
            name: '无班组数据',
            empty: true
          });
        }

        this.treeData.push(taskNode);
      });
    },

    // 计算统计信息
    calculateStatistics() {
      let totalInput = 0;
      let totalQualified = 0;
      let teamCount = 0;
      let feedbackCount = 0;

      this.taskList.forEach(task => {
        totalInput += parseFloat(task.totalInput) || 0;
        totalQualified += parseFloat(task.totalQualified) || 0;

        if (task.teamResult) {
          teamCount += task.teamResult.length;

          task.teamResult.forEach(team => {
            if (team.feedbackResult) {
              feedbackCount += team.feedbackResult.length;
            }
          });
        }
      });

      this.totalTasks = this.taskList.length;
      this.totalTeams = teamCount;
      this.totalFeedbacks = feedbackCount;

      // 计算总合格率
      const overallRate = totalInput > 0 ? (totalQualified / totalInput) * 100 : 0;
      this.overallPassRate = overallRate.toFixed(2) + '%';
    },

    // 获取行样式
    getRowStyle(row) {
      const paddingLeft = (row.level - 1) * 20 + 'px';
      let fontWeight = 'normal';
      let fontStyle = 'normal';

      if (row.level === 1) {
        fontWeight = 'bold';
        fontStyle = 'normal';
      } else if (row.level === 2) {
        fontWeight = '600';
        fontStyle = 'normal';
      } else if (row.level === 3) {
        fontWeight = 'normal';
        fontStyle = 'normal';
      } else if (row.level === 4) {
        fontWeight = 'normal';
        fontStyle = 'normal';
      } else if (row.level === 5) {
        fontWeight = 'normal';
        fontStyle = 'italic';
      }

      return {
        'padding-left': paddingLeft,
        'font-weight': fontWeight,
        'font-style': fontStyle
      };
    },

    // 格式化数字显示
    formatNumber(value) {
      if (value === null || value === undefined) return '0.00';
      const num = typeof value === 'string' ? parseFloat(value) : value;
      return num.toLocaleString('zh-CN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    },

    // 根据合格率获取标签类型
    getRateType(rate) {
      if (!rate || rate === '0.0%' || rate === '0.00%') return 'info';
      const rateValue = parseFloat(rate);
      if (rateValue >= 95) return 'success';
      if (rateValue >= 85) return 'warning';
      return 'danger';
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.queryParams.workorderCode = undefined;
      this.setDefaultQueryTime();
      this.handleQuery();
    },
    //查询工序信息
    getProcess() {
      // 初始化工序选项
      this.processOptions = [];
      listProcess().then(response => {
        this.processOptions = response.data.list;
        console.log(this.processOptions)
      });
    },
  },
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}

:deep(.el-table .level-1) {
  background-color: #f0f9ff;
}

:deep(.el-table .level-2) {
  background-color: #f0f7ff;
}

:deep(.el-table .level-3) {
  background-color: #f9f9f9;
}

:deep(.el-table .level-4) {
  background-color: #f5f5f5;
}

:deep(.el-table .level-5) {
  background-color: #ffffff;
}

:deep(.el-table__row--level-1) {
  background-color: #f0f9ff;
}

:deep(.el-table__row--level-2) {
  background-color: #f0f7ff;
}

:deep(.el-table__row--level-3) {
  background-color: #f9f9f9;
}

:deep(.el-table__row--level-4) {
  background-color: #f5f5f5;
}

:deep(.el-table__row--level-5) {
  background-color: #ffffff;
}

.stat-card {
  text-align: center;
  height: 80px;
}

.stat-item {
  padding: 10px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

/* 不同类型的样式 */
:deep(.el-table .type-member) {
  background-color: #f0fff4;
}

:deep(.el-table .type-defect) {
  background-color: #fff0f0;
}

:deep(.el-table .type-empty) {
  background-color: #fafafa;
  color: #c0c4cc;
}
</style>
