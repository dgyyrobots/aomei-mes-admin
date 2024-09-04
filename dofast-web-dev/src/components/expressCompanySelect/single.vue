<template>
  <el-dialog title="选择快递公司" v-if="showFlag" :visible.sync="showFlag" :modal="false" width="800px" center>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="渠道平台" name="dot3">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
          <el-form-item label="快递公司名称" prop="companyName" label-width="120px">
            <el-input v-model="queryParams.companyName" placeholder="请输入快递公司名称" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="expressCompanyList" @current-change="handleCurrent" @row-dblclick="handleRowDbClick">
          <el-table-column width="55" align="center">
            <template v-slot="scope">
              <el-radio v-model="selectedExpressCompanyId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ '' }}</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="快递公司" width="180" prop="logisticsName"> </el-table-column>
          <el-table-column label="电子面单平台" width="120" align="center">
            <template v-slot="{ row }">
              <div>{{ row.ewPlatformType ? row.ewPlatformType : '' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="快递公司名称" width="180" prop="name"> </el-table-column>
          <el-table-column label="快递公司编码" width="200" align="code" prop="code" :show-overflow-tooltip="true" />
          <el-table-column label="物流单打印模板" align="center">
            <template v-slot="{ row }">
              <a :href="row.printTemplate.standardTemplateUrl" target="__blank" v-if="row.printTemplate">{{ row.printTemplate.name }}</a>
              <div v-else>暂无模版</div>
            </template>
          </el-table-column>
          <el-table-column label="绑定网点名称" width="140" align="center">
            <template v-slot="{ row }">
              <div>{{ row.authInfo ? row.authInfo.branchName : '' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="绑定网点地址" width="120" align="center">
            <template v-slot="{ row }">
              <div>{{ row.authInfo ? row.authInfo.branchAddress : '' }}</div>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>
      <el-tab-pane label="系统维护" name="system">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
          <el-form-item label="快递公司名称" prop="companyName" label-width="120px">
            <el-input v-model="queryParams.companyName" placeholder="请输入快递公司名称" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="expressCompanyList" @current-change="handleCurrent" @row-dblclick="handleRowDbClick">
          <el-table-column width="55" align="center">
            <template v-slot="scope">
              <el-radio v-model="selectedExpressCompanyId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ '' }}</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="物流公司编号" align="center" prop="id" />
          <el-table-column label="物流公司名称" align="center" prop="companyName" />
          <el-table-column label="物流公司网址" align="center" prop="logo" />
          <!-- <el-table-column label="排序" align="center" prop="sort" /> -->
          <el-table-column label="是否支持电子面单" align="center" prop="supportElectronicSheet">
            <template v-slot="scope">
              <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.supportElectronicSheet" />
            </template>
          </el-table-column>
          <!-- <el-table-column label="电子面单打印风格" align="center" prop="printStyle" /> -->
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmSelect">确 定</el-button>
      <el-button @click="showFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getExpressCompanyPage, getDot3ExpressCompanyPage } from '@/api/system/expressCompany.js';
export default {
  name: 'ExpressCompanySelectSingle',
  components: {},
  dicts: [],
  data() {
    return {
      activeName: 'dot3',
      showFlag: false,
      // 遮罩层
      loading: true,
      // 选中数组
      selectedExpressCompanyId: undefined,
      selectedRows: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 生产工单表格数据
      expressCompanyList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      //   open: false,
      // 查询参数
      queryParams: {
        companyName: null,
        pageNo: 1,
        pageSize: 10,
      },
      order_id: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    open(order_id) {
      this.order_id = order_id;
      this.showFlag = true;
    },
    handleClick(tab) {
      console.log(tab);
      this.activeName = tab.name;
      this.selectedRows = [];
      this.getList();
    },
    /** 查询生产工单列表 */
    getList() {
      this.loading = true;
      this.expressCompanyList = [];
      if (this.activeName == 'dot3') {
        const currentTotal = this.queryParams.pageSize * (this.queryParams.pageNo - 1);
        getDot3ExpressCompanyPage({ ...this.queryParams, name: this.queryParams.companyName }).then(res => {
          this.expressCompanyList = res.data; //res.content;
          this.total = 0; // res.hasNext ? currentTotal + this.queryParams.pageSize + 1 : currentTotal + res.content.length;
          this.loading = false;
        });
      } else {
        getExpressCompanyPage(this.queryParams).then(response => {
          this.expressCompanyList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    handleCurrent(row) {
      if (row) {
        this.selectedRows = row;
      }
    },
    // 单选选中数据
    handleRowChange(row) {
      if (row) {
        this.selectedRows = row;
      }
    },
    //双击选中
    handleRowDbClick(row) {
      if (row) {
        this.selectedRows = row;
        this.onSelected();
      }
    },
    //确定选中
    confirmSelect() {
      if (this.selectedExpressCompanyId == null || this.selectedExpressCompanyId == 0) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '请至少选择一条数据!',
        });
        return;
      }
      this.onSelected();
    },
    onSelected() {
      const row = this.activeName == 'dot3' ? { ...this.selectedRows } : { ...this.selectedRows, name: this.selectedRows.companyName };
      this.$emit('onSelected', row);
      this.showFlag = false;
    },
  },
};
</script>
