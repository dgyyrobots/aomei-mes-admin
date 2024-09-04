<template>
  <div class="app-container">
    <!-- @selection-change="handleSelectionChange" -->
    <el-table v-loading="loading" :data="productBomList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="物料编号" width="120" align="center" prop="itemCode" />
      <el-table-column label="物料名称" width="200" align="center" prop="itemName" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="规格型号" align="center" prop="specification" :show-overflow-tooltip="true" /> -->
      <!-- <el-table-column label="单位" align="center" prop="unitOfMeasure" /> -->
      <!-- <el-table-column label="物料/产品" align="center" prop="itemOrProduct">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_item_product" :value="scope.row.itemOrProduct" />
        </template>
      </el-table-column> -->
      <el-table-column label="数量" align="center" prop="num" />
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { listItems, mixinItems } from '@/api/mes/pro/workorder';
import { getDetail } from '@/api/mall/trade/mixinOrder.js';
export default {
  name: 'WorkorderItemList',
  dicts: ['mes_item_product'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 物料需求
      productBomList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        saleId: null,
        // productId: null,
        // productCode: null,
        // productName: null,
        // productSpc: null,
        // unitOfMeasure: null,
        // itemOrProduct: null,
        // quantity: null,
      },
    };
  },
  props: {
    optType: undefined,
    workorder: undefined,
  },
  async created() {
    // let data = await getDetail({ id: this.workorder.mixinOrderId });
    // console.log(data.data.mdItemDTOS);
    // this.productBomList = data.data.mdItemDTOS;
    //  this.loading = false;
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.queryParams.saleId = this.workorder.mixinOrderId;
      mixinItems(this.queryParams).then(response => {
        this.productBomList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
  },
};
</script>
