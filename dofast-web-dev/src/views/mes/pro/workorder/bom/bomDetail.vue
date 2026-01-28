<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单编码" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入工单编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="工单名称" prop="workorderName">
        <el-input v-model="queryParams.workorderName" placeholder="请输入工单名称" clearable @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="来源单据" prop="sourceCode">
        <el-input v-model="queryParams.sourceCode" placeholder="请输入来源单据" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="产品编号" prop="productCode">
        <el-input v-model="queryParams.productCode" placeholder="请输入产品编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="queryParams.productName" placeholder="请输入产品名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="客户编码" prop="clientCode">
        <el-input v-model="queryParams.clientCode" placeholder="请输入客户编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="客户名称" prop="clientName">
        <el-input v-model="queryParams.clientName" placeholder="请输入客户名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="需求日期" prop="requestDate">
        <el-date-picker clearable v-model="queryParams.requestDate" type="date" value-format="timestamp" placeholder="请选择需求日期"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="workorderList" row-key="id" default-expand-all :tree-props="{ children: 'workorderBomList' }" :row-class-name="tableRowClassName" style="width: 100%; margin-bottom: 20px;" stripe border>
      <el-table-column label="编码" width="180">
        <template slot-scope="scope">
            <span v-if="scope.row.rowType === 'workorder'">
              <el-button size="mini" type="text" @click="handleView(scope.row)">
                {{ scope.row.workorderCode }}
              </el-button>
            </span>
          <span v-else>{{ scope.row.itemCode }}</span>
        </template>
      </el-table-column>

      <el-table-column label="名称" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.rowType === 'workorder' ? scope.row.workorderName : scope.row.itemName }}
        </template>
      </el-table-column>


      <el-table-column label="规格" width="200" :show-overflow-tooltip="true" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productSpc || scope.row.specification }}
        </template>
      </el-table-column>

      <el-table-column label="单位" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.unitOfMeasure }}
        </template>
      </el-table-column>

      <el-table-column label="数量" width="120" align="center">
        <template slot-scope="scope">
            <span v-if="scope.row.rowType === 'workorder'">
              {{ formatNumber(scope.row.quantity) }}
            </span>
          <span v-else>
              {{ formatNumber(scope.row.planQuantity) }}
            </span>
        </template>
      </el-table-column>

      <el-table-column label="实际数量" width="120" align="center">
        <template slot-scope="scope">
            <span v-if="scope.row.rowType === 'workorder'">
              {{ formatNumber(scope.row.quantityProduced) }}
            </span>
          <span v-else>
              {{ formatNumber(scope.row.actualQuantity) }}
            </span>
        </template>
      </el-table-column>

      <el-table-column label="完成率" width="100" align="center">
        <template slot-scope="scope">
            <span v-if="scope.row.rowType === 'workorder' && scope.row.quantity > 0">
              {{ ((scope.row.quantityProduced / scope.row.quantity) * 100).toFixed(1) }}%
            </span>
          <span v-else-if="scope.row.planQuantity > 0">
              {{ ((scope.row.actualQuantity / scope.row.planQuantity) * 100).toFixed(1) }}%
            </span>
        </template>
      </el-table-column>

      <el-table-column label="领用仓库" width="150">
        <template slot-scope="scope">
            <span v-if="scope.row.rowType === 'bom'">
              {{ scope.row.locationName }}
            </span>
        </template>
      </el-table-column>

      <el-table-column label="需求日期" width="120" align="center">
        <template slot-scope="scope">
            <span v-if="scope.row.requestDate">
              {{ parseTime(scope.row.requestDate, '{y}-{m}-{d}') }}
            </span>
        </template>
      </el-table-column>
dd
      <el-table-column label="排产状态" align="center" prop="status" fixed="right">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status" />
        </template>
      </el-table-column>

    </el-table>

    <div class="footer">
      <div class="summary">
        显示 {{ workorderList.length }} 条工单，共 {{ summary.totalBomItems }} 项BOM物料
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import {listWorkorder, getWorkorder, addWorkorder, updateWorkorder, delWorkorder, listWorkorderSummaryBom} from '@/api/mes/pro/workorder';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'bomDetail',
  dicts: ['mes_order_status', 'mes_workorder_sourcetype'],
  props: {
    isMine: {
      type: Boolean,
      default: false,
    },
  },
  components: { Treeselect },
  data() {
    return {
      loading: true,
      showSearch: true,
      total: 0,
      workorderList: [],
      workorderOptions: [],
      processOptions: [],
      title: '',
      open: false,
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        workorderCode: null,
        workorderName: null,
        sourceCode: null,
        productCode: null,
        productName: null,
        clientCode: null,
        clientName: null,
        requestDate: null,
      },
      form: {},
      optType: undefined,
      activeProcess: 0,
      summary: {
        totalWorkorders: 0,
        finishedWorkorders: 0,
        totalBomItems: 0,
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listWorkorderSummaryBom({
        ...this.queryParams
      }).then((response) => {

        const list = response.data.list || [];

        // 递归遍历树结构，标记类型
        const markRowType = (rows) => {
          return rows.map(row => {
            // 判断是否为工单行（非BOM子项）
            if (row.workorderCode && !row.itemCode) {
              row.rowType = 'workorder';
            } else if (row.workorderCode && row.itemCode) {
              row.rowType = 'bom';
            }
            // 递归处理子项
            if (row.workorderBomList && row.workorderBomList.length > 0) {
              row.workorderBomList = markRowType(row.workorderBomList);
            }
            return row;
          });
        };

        this.workorderList = markRowType(list);
        this.total = response.data.total;
        this.calculateSummary();
        this.loading = false;
      });
    },
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    handleView(row) {
      /* 与原来一致 */
    },
    handleUpdate(row) {
      /* 与原来一致 */
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.workorderCode) {
        return 'workorder-row';
      } else {
        return 'bom-row';
      }
    },
    formatNumber(num) {
      if (num === null || num === undefined) return '-';
      return Number(num).toLocaleString();
    },
    statusClass(status) {
      return status === 'CONFIRMED' ? 'status-confirmed' :
        status === 'FINISHED' ? 'status-finished' : '';
    },
    statusText(status) {
      return status === 'CONFIRMED' ? '已确认' : status === 'FINISHED' ? '已完成' : status;
    },
    calculateSummary() {
      this.summary.totalWorkorders = this.workorderList.length;
      this.summary.finishedWorkorders = this.workorderList.filter(
        item => item.status === 'FINISHED'
      ).length;

      this.summary.totalBomItems = this.workorderList.reduce((total, workorder) => {
        return total + (workorder.workorderBomList ? workorder.workorderBomList.length : 0);
      }, 0);
    },
    parseTime(timestamp, format) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return format
        .replace('{y}', year)
        .replace('{m}', month)
        .replace('{d}', day);
    },



  },
};
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
}

body {
  background-color: #f5f7fa;
  color: #333;
  padding: 20px;
}

.app-container {
  max-width: 1600px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.header h1 {
  color: #303133;
  font-size: 24px;
  font-weight: 500;
}

.header-info {
  display: flex;
  gap: 20px;
}

.info-card {
  background: #f5f7fa;
  padding: 10px 15px;
  border-radius: 4px;
  text-align: center;
  min-width: 120px;
}

.info-card h3 {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.info-card .value {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.search-container {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 10px;
}

.search-item {
  flex: 1;
  min-width: 200px;
}

.search-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.workorder-row {
  background-color: #f0f9eb;
}

.bom-row {
  background-color: #f5f7fa;
}

.el-table ::v-deep .el-table__row.bom-row .el-table__cell {
  padding-left: 40px !important;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-confirmed {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-finished {
  background-color: #f6ffed;
  color: #52c41a;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.summary {
  font-size: 14px;
  color: #606266;
}

@media (max-width: 768px) {
  .search-row {
    flex-direction: column;
  }

  .search-item {
    min-width: 100%;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .header-info {
    width: 100%;
    justify-content: space-between;
  }
}

</style>
