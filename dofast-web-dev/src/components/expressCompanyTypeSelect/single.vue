<!-- <template>
  <el-dialog title="选择快递公司" v-if="showFlag" :visible.sync="showFlag" :modal="false" width="800px" center>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="仓库名称" prop="companyName">
        <el-input v-model="queryParams.companyName" placeholder="请输入仓库名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="warehouseList" @current-change="handleCurrent" @row-dblclick="handleRowDbClick">
      <el-table-column width="55" align="center">
        <template v-slot="scope">
          <el-radio v-model="selectedWarehouseId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ '' }}</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="仓库名称" width="180" prop="warehouseName"> </el-table-column>
      <el-table-column label="地址" width="200" align="location" prop="localtion" :show-overflow-tooltip="true" />
      <el-table-column label="发货员" align="center" prop="send_name"></el-table-column>
      <el-table-column label="发货员手机号" width="140" align="center" prop="send_mobile" />
      <el-table-column label="发货员固定电话" width="120" align="center" prop="send_phone" />
      <el-table-column label="发货省市区县" width="120" align="center">
        <template v-slot="scope">
          <div>
            {{ scope.row.send_state }}
            {{ scope.row.send_city }}
            {{ scope.row.send_district }}
            {{ scope.row.send_street }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发货地址" width="120" align="center" prop="send_detail" />
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmSelect">确 定</el-button>
      <el-button @click="showFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getExpressCompanyPage } from '@/api/system/expressCompany.js';
export default {
  name: 'WarehouseAddressSelectSingle',
  components: {},
  dicts: [],
  data() {
    return {
      showFlag: false,
      // 遮罩层
      loading: true,
      // 选中数组
      selectedWarehouseId: undefined,
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
      warehouseList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      //   open: false,
      // 查询参数
      queryParams: {
        companyName: '',
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
    /** 查询生产工单列表 */
    getList() {
      this.loading = true;
      getExpressCompanyPage(this.queryParams).then(response => {
        this.warehouseList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
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
      if (this.selectedWarehouseId == null || this.selectedWarehouseId == 0) {
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
      const row = { ...this.selectedRows, name: this.selectedRows.warehouseName };
      this.$emit('onSelected', row);
      this.showFlag = false;
    },
  },
};
</script> -->
