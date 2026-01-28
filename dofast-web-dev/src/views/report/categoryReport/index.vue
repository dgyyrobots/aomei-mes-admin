<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="报工时间" prop="queryTime">
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
      <!-- 名称/代码列 -->
      <el-table-column prop="name" label="产品名称" align="left">
        <template slot-scope="scope">
          <span v-if="scope.row.level !== 3" :style="getRowStyle(scope.row)">
            {{ scope.row.name }}
            <el-tag v-if="scope.row.level === 1" size="mini" style="margin-left: 8px;">
              {{ scope.row.itemPrefix }}
            </el-tag>
            <el-tag v-if="scope.row.level === 3" size="mini" style="margin-left: 8px;">
              {{ scope.row.processName || scope.row.name }}
            </el-tag>
<!--            <el-tag v-else-if="scope.row.level === 4 && scope.row.workorderCode" size="mini" type="info" style="margin-left: 8px;">
              {{ scope.row.workorderCode }}
            </el-tag>-->
          </span>
          <span v-else>
            {{ scope.row.processName }}
          </span>

        </template>
      </el-table-column>

      <!-- 工序流程列 -->
      <el-table-column prop="standardProcessFlowStr" label="工序流程"  align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 1">
            {{ scope.row.standardProcessFlowStr }}
          </span>
<!--          <span v-else-if="scope.row.level === 3">
            {{ scope.row.processName || scope.row.name }}
          </span>-->
          <span v-else>-</span>
        </template>
      </el-table-column>



      <!-- 总投入列 -->
      <el-table-column prop="totalInput" label="总投入" align="center">
        <template slot-scope="scope">
          <span v-if="shouldShowTotalInput(scope.row)">
            {{ formatNumber(getDisplayTotalInput(scope.row)) }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="投入单位" width="100"  align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 1 && scope.row.matchedProcesstotalInput">米</span>
          <span v-else-if="scope.row.level === 3 && scope.row.totalInput">米</span>
          <span v-else-if="scope.row.level === 4 && scope.row.quantity">米</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 总产出列 -->
      <el-table-column prop="totalQualified" label="总产出(合格)"  align="center">
        <template slot-scope="scope">
          <span v-if="shouldShowTotalQualified(scope.row)">
            {{ formatNumber(getDisplayTotalQualified(scope.row)) }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="产出单位" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 1 && scope.row.matchedProcesstotalInput">米</span>
          <span v-else-if="scope.row.level === 3 && scope.row.totalInput">米</span>
          <span v-else-if="scope.row.level === 4 && scope.row.quantity">米</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 合格率列 -->
      <el-table-column prop="qualifiedRate" label="合格率"  align="center">
        <template slot-scope="scope">
          <el-tag
            v-if="shouldShowQualifiedRate(scope.row)"
            :type="getRateType(getDisplayQualifiedRate(scope.row))"
            size="small"
          >
            {{ getDisplayQualifiedRate(scope.row) }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>


      <!-- 不合格数量列 -->
<!--      <el-table-column prop="quantityUnquanlify" label="不合格数量"  align="center" v-if="showUnqualifiedColumn">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 4 && scope.row.quantityUnquanlify !== undefined">
            {{ formatNumber(scope.row.quantityUnquanlify) }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>-->

    </el-table>
  </div>
</template>

<script>
import { productQualityReport , teamQualityReport} from '@/api/mes/pro/workorder';

export default {
  name: 'ProductQualityTreeReport',
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
      },
      // 原始品类列表数据
      categoryList: [],
      // 树形数据
      treeData: [],
      // 控制列的显示
      showProductInfoColumn: true,
      showTaskInfoColumn: true,
      showUnqualifiedColumn: true,
    };
  },
  computed: {
    // 总产品数
    totalProducts() {
      return this.categoryList.reduce((total, category) => total + (category.productCount || 0), 0);
    },
    // 总工单数
    totalWorkorders() {
      return this.categoryList.reduce((total, category) => total + (category.workorderCount || 0), 0);
    }
  },
  created() {
    this.setDefaultQueryTime();
    this.getList();
  },
  methods: {
    setDefaultQueryTime() {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const today = new Date();

      // 格式化为 yyyy-MM-dd HH:mm:ss
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

      productQualityReport(params).then(response => {
        this.categoryList = response.data || [];
        this.transformToTreeData();
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });

    },

    // 将原始数据转换为树形数据
    transformToTreeData() {
      this.treeData = [];
      let idCounter = 1;

      this.categoryList.forEach((category, categoryIndex) => {
        // 品类节点
        const categoryNode = {
          id: idCounter++,
          level: 1,
          name: category.categoryName,
          categoryName: category.categoryName,
          itemPrefix: category.itemPrefix,
          standardProcessFlow: category.standardProcessFlow,
          standardProcessFlowStr: category.standardProcessFlowStr,
          totalQualifiedRate: category.totalQualifiedRate,
          productCount: category.productCount,
          workorderCount: category.workorderCount,
          matchedProcesstotalInput: category.matchedProcesstotalInput,
          matchedProcesstotalQualified: category.matchedProcesstotalQualified,
          expanded: this.isExpandAll,
          children: []
        };

        // 匹配工序统计节点
        const matchedStatsNode = {
          id: idCounter++,
          level: 2,
          name: '匹配工序统计',
          type: 'matched',
          expanded: this.isExpandAll,
          children: []
        };

        // 添加匹配工序详情
        if (category.matchedProcessStats && Object.keys(category.matchedProcessStats).length > 0) {
          Object.entries(category.matchedProcessStats).forEach(([processCode, stats]) => {
            console.log("AAA");
            console.log("category.matchedProcessStats" , category.matchedProcessStats);
            console.log("AAA");

            const processNode = {
              id: idCounter++,
              level: 3,
              name: processCode,
              processCode: processCode,
              processName: stats.workorderProcessData ? Object.values(stats.workorderProcessData)[0]?.processName : '',
              qualifiedRate: stats.qualifiedRate,
              totalInput: parseFloat(stats.totalInput) || 0,
              totalQualified: parseFloat(stats.totalQualified) || 0,
              count: stats.count,
              expanded: this.isExpandAll,
              children: []
            };

            // 添加第四级：工单信息
            if (stats.workorders && stats.workorders.length > 0) {
              stats.workorders.forEach(workorder => {

                const workorderData = stats.workorderProcessData && stats.workorderProcessData;
                const task = workorderData ? workorderData.task : null;

                // 查找对应的任务数据
                const workorderMap = new Map(Object.entries(stats.workorderProcessData))
                const workorderDetail =  workorderMap.get(workorder.workorderCode);

                const workorderNode = {
                  id: idCounter++,
                  level: 4,
                  name: workorder.workorderName || workorder.workorderCode,
                  workorderCode: workorder.workorderCode,
                  workorderName: workorder.workorderName,
                  productName: workorder.productName,
                  productSpc: workorder.productSpc,
                  productCode: workorder.productCode,
                  // 任务信息
                  taskCode: task ? task.taskCode : '',
                  machineryName: task ? task.machineryName : '',
                  processName: workorderData ? workorderData.processName : '',
                  // 数量信息
                  quantity: workorderDetail && workorderDetail.input ? parseFloat(workorderDetail.input) : 0,
                  //quantityProduced: task ? parseFloat(task.quantityProduced) : 0,
                  quantityQuanlify: workorderDetail && workorderDetail.qualified ? parseFloat(workorderDetail.qualified) : 0,
                  //quantityUnquanlify: task ? parseFloat(task.quantityUnquanlify) : 0,
                  // 计算工单级别的合格率
                  // qualifiedRate: workorderDetail && workorderDetail.qualified ? ((parseFloat(workorderDetail.qualified) / parseFloat(workorderDetail.input)) * 100).toFixed(2) + '%' : '0.00%'
                  qualifiedRate: workorderDetail && workorderDetail.qualifiedRate ? ( workorderDetail.qualifiedRate  * 100).toFixed(2) + '%' : '0.00%'


                };
                console.log("四级菜单: " + workorderNode);
                console.log(workorderNode);

                processNode.children.push(workorderNode);
              });
            } else {
              processNode.children.push({
                id: idCounter++,
                level: 4,
                name: '无工单数据',
                empty: true
              });
            }

            matchedStatsNode.children.push(processNode);
          });
        } else {
          matchedStatsNode.children.push({
            id: idCounter++,
            level: 3,
            name: '无匹配工序数据',
            empty: true
          });
        }

        // 未匹配工序统计节点
        const unmatchedStatsNode = {
          id: idCounter++,
          level: 2,
          name: '未匹配工序统计',
          type: 'unmatched',
          expanded: this.isExpandAll,
          children: []
        };

        // 添加未匹配工序详情
        if (category.unmatchedProcessStats && Object.keys(category.unmatchedProcessStats).length > 0) {
          Object.entries(category.unmatchedProcessStats).forEach(([processCode, stats]) => {
            const processNode = {
              id: idCounter++,
              level: 3,
              name: processCode,
              processCode: processCode,
              processName: stats.workorderProcessData ? Object.values(stats.workorderProcessData)[0]?.processName : '',
              qualifiedRate: stats.qualifiedRate,
              totalInput: parseFloat(stats.totalInput) || 0,
              totalQualified: parseFloat(stats.totalQualified) || 0,
              count: stats.count,
              expanded: this.isExpandAll,
              children: []
            };


            // 添加第四级：工单信息
            if (stats.workorders && stats.workorders.length > 0) {
              stats.workorders.forEach(workorder => {
                // 查找对应的任务数据
                const workorderData = stats.workorderProcessData && stats.workorderProcessData[workorder.workorderCode];
                const task = workorderData ? workorderData.task : null;

                // 查找对应的任务数据
                const workorderMap = new Map(Object.entries(stats.workorderProcessData))
                const workorderDetail =  workorderMap.get(workorder.workorderCode);

                const workorderNode = {
                  id: idCounter++,
                  level: 4,
                  name: workorder.workorderName || workorder.workorderCode,
                  workorderCode: workorder.workorderCode,
                  workorderName: workorder.workorderName,
                  productName: workorder.productName,
                  productSpc: workorder.productSpc,
                  productCode: workorder.productCode,
                  // 任务信息
                  taskCode: task ? task.taskCode : '',
                  machineryName: task ? task.machineryName : '',
                  processName: workorderData ? workorderData.processName : '',
                  // 数量信息
                  quantity: workorderDetail && workorderDetail.input ? parseFloat(workorderDetail.input) : 0,
                  //quantityProduced: task ? parseFloat(task.quantityProduced) : 0,
                  quantityQuanlify: workorderDetail && workorderDetail.qualified ? parseFloat(workorderDetail.qualified) : 0,
                  //quantityUnquanlify: task ? parseFloat(task.quantityUnquanlify) : 0,

                  // 计算工单级别的合格率
                  // qualifiedRate: workorderDetail && workorderDetail.qualified && workorderDetail.input ? ((parseFloat(workorderDetail.qualified) / parseFloat(workorderDetail.input)) * 100).toFixed(2) + '%' : '0.00%'

                  qualifiedRate: workorderDetail && workorderDetail.qualifiedRate ? ( workorderDetail.qualifiedRate  * 100).toFixed(2)  + '%' : '0.00%'
                };

                processNode.children.push(workorderNode);
              });
            } else {
              processNode.children.push({
                id: idCounter++,
                level: 4,
                name: '无工单数据',
                empty: true
              });
            }

            unmatchedStatsNode.children.push(processNode);
          });
        } else {
          unmatchedStatsNode.children.push({
            id: idCounter++,
            level: 3,
            name: '无未匹配工序数据',
            empty: true
          });
        }

        // 将子节点添加到品类节点
        categoryNode.children.push(matchedStatsNode, unmatchedStatsNode);
        this.treeData.push(categoryNode);
      });
    },

    // 获取行样式
    getRowStyle(row) {
      const paddingLeft = (row.level - 1) * 20 + 'px';
      let fontWeight = 'normal';
      let fontStyle = 'normal';

      if (row.level === 1) {
        fontWeight = 'bold';
      } else if (row.level === 2) {
        fontWeight = '600';
      } else if (row.level === 4) {
        fontStyle = 'italic';
      }

      return {
        'padding-left': paddingLeft,
        'font-weight': fontWeight,
        'font-style': fontStyle
      };
    },

    // 切换行展开状态
    toggleRow(row) {
      row.expanded = !row.expanded;
      this.$set(this.treeData, this.treeData.indexOf(row), { ...row });
    },

    // 切换全部展开/折叠
    toggleExpandAll() {
      this.isExpandAll = !this.isExpandAll;
      this.updateAllRowsExpanded(this.isExpandAll);
    },

    // 更新所有行的展开状态
    updateAllRowsExpanded(expanded) {
      const updateExpanded = (nodes) => {
        nodes.forEach(node => {
          if (node.children && node.children.length > 0) {
            node.expanded = expanded;
            updateExpanded(node.children);
          }
        });
      };
      updateExpanded(this.treeData);
      this.treeData = [...this.treeData];
    },

    // 检查是否有子节点
    hasChildren(row) {
      return row.children && row.children.length > 0;
    },

    // 格式化数字显示
    formatNumber(value) {
      if (value === null || value === undefined) return '0.00';
      const num = typeof value === 'string' ? parseFloat(value) : value;
      return num.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },

    // 根据合格率获取标签类型
    getRateType(rate) {
      if (!rate || rate === '0.00%') return 'info';
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
      this.setDefaultQueryTime();
      this.handleQuery();
    },

    // 判断是否显示合格率
    shouldShowQualifiedRate(row) {
      return (row.level === 1 && row.totalQualifiedRate) ||
        (row.level === 3 && row.qualifiedRate && !row.empty) ||
        (row.level === 4 && row.qualifiedRate && !row.empty);
    },

    // 获取显示的合格率值
    getDisplayQualifiedRate(row) {
      if (row.level === 1) {
        return row.totalQualifiedRate;
      } else if ((row.level === 3 || row.level === 4) && !row.empty) {
        return row.qualifiedRate ? row.qualifiedRate : '0.00%';
      }
      return null;
    },

    // 判断是否显示总投入
    shouldShowTotalInput(row) {
      return (row.level === 1 && row.matchedProcesstotalInput !== undefined) ||
        (row.level === 3 && row.totalInput !== undefined && !row.empty) ||
        (row.level === 4 && row.quantity !== undefined && !row.empty);
    },

    // 获取显示的总投入值
    getDisplayTotalInput(row) {
      if (row.level === 1) {
        return row.matchedProcesstotalInput;
      } else if (row.level === 3) {
        return row.totalInput;
      } else if (row.level === 4) {
        return row.quantity;
      }
      return null;
    },

    // 判断是否显示总合格
    shouldShowTotalQualified(row) {
      return (row.level === 1 && row.matchedProcesstotalQualified !== undefined) ||
        (row.level === 3 && row.totalQualified !== undefined && !row.empty) ||
        (row.level === 4 && row.quantityQuanlify !== undefined && !row.empty);
    },

    // 获取显示的总合格值
    getDisplayTotalQualified(row) {
      if (row.level === 1) {
        return row.matchedProcesstotalQualified;
      } else if (row.level === 3) {
        return row.totalQualified;
      } else if (row.level === 4) {
        return row.quantityQuanlify;
      }
      return null;
    }
  },
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.stat-card {
  text-align: center;
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

:deep(.el-table .level-1) {
  background-color: #f0f7ff;
}

:deep(.el-table .level-2) {
  background-color: #f9f9f9;
}

:deep(.el-table .level-3) {
  background-color: #f5f5f5;
}

:deep(.el-table .level-4) {
  background-color: #ffffff;
}

:deep(.el-table__row--level-1) {
  background-color: #f0f7ff;
}

:deep(.el-table__row--level-2) {
  background-color: #f9f9f9;
}

:deep(.el-table__row--level-3) {
  background-color: #f5f5f5;
}

:deep(.el-table__row--level-4) {
  background-color: #ffffff;
}
</style>
