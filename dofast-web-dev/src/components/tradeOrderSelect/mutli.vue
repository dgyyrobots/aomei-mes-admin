<template>
  <el-dialog title="订单选择" v-if="showFlag" :visible.sync="showFlag" :modal="false" width="80%" center>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单编号" prop="no">
        <el-input v-model="queryParams.no" placeholder="请输入订单编号" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="收件手机" prop="receiverMobile">
        <el-input v-model="queryParams.receiverMobile" placeholder="请输入收件人手机号" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="订单编号" align="center" key="no" prop="no" width="185px" />
      <el-table-column label="用户编号" align="center" key="userId" prop="userId" :show-overflow-tooltip="true" width="80px" />
      <el-table-column label="收件人手机号" align="center" key="receiverMobile" prop="receiverMobile" width="120px" />
      <el-table-column label="收件人" align="center" key="receiverName" prop="receiverName" :show-overflow-tooltip="true" width="120px" />
      <el-table-column label="收件地址" align="center" key="receiverAreaName" prop="receiverAreaName" :show-overflow-tooltip="true" width="180px" />
      <el-table-column label="状态" align="center" key="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.TRADE_ORDER_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmSelect">确 定</el-button>
      <el-button @click="showFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getOrderPage } from '@/api/mall/trade/order.js';
import { uniq, compact } from 'lodash';

export default {
  name: 'TradeOrderMultiSelect',
  components: {},
  data() {
    return {
      showFlag: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      selectedRows: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      orderList: null,
      // 弹出层标题
      title: '',
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        receiverMobile: '',
        no: '',
      },
      relationQueryParams: {
        userIdIn: null,
        userIdNotIn: null,
        receiverMobileIn: null,
        receiverMobileNotIn: null,
      },
    };
  },
  created() {},
  methods: {
    open(orders, relation) {
      this.showFlag = true;
      this.relationQueryParams = {};
      if (orders) {
        const ids = uniq(compact(orders.map(({ id }) => id)));
        const userIds = uniq(compact(orders.map(({ userId }) => userId)));
        const receiverMobiles = uniq(compact(orders.map(({ receiverMobile }) => receiverMobile)));
        this.relationQueryParams[relation ? 'userIdIn' : 'userIdNotIn'] = userIds.length ? userIds.join(',') : null;
        this.relationQueryParams[relation ? 'receiverMobileIn' : 'receiverMobileNotIn'] = receiverMobiles.length ? receiverMobiles.join(',') : null;
        this.relationQueryParams.idNotIn = ids.length ? ids.join(',') : null;
      }
      this.getList();
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getOrderPage({
        ...this.queryParams,
        ...this.relationQueryParams,
      }).then(response => {
        this.orderList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.selectedRows = selection;
      this.multiple = !selection.length;
    },
    //确定选中
    confirmSelect() {
      if (this.selectedRows == null || this.selectedRows.size == 0) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '请至少选择一条数据!',
        });
        return;
      }
      this.$emit('onSelected', this.selectedRows);
      this.showFlag = false;
    },
  },
};
</script>
