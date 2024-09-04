<template>
  <el-dialog title="选择商品" v-if="showFlag" :visible.sync="showFlag" modal width="1000px">
    <!--    <el-form inline label-width="90px">-->
    <!--      <el-form-item label="商品分类">-->
    <!--        <el-input v-model="queryParams.category_id"></el-input>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="商品名称">-->
    <!--        <el-input v-model="queryParams.spuName"></el-input>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="商品名称">-->
    <!--        <el-input v-model="queryParams.spuName"></el-input>-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->
    <el-row>
      <el-col :span="6">
        <el-tree :data="categories" :props="{ label: 'name' }" node-key="id" @node-click="handleCategorySelect($event)"></el-tree>
      </el-col>
      <el-col :span="6">
        <el-tree :data="spus" :props="{ label: 'name' }" node-key="id" @node-click="handleSpuSelect($event)"></el-tree>
      </el-col>
      <el-col :span="12">
        <el-table ref="table" :data="list" border @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="商品名称" prop="spuName"></el-table-column>
          <el-table-column label="标签名称" prop="name"></el-table-column>
          <el-table-column label="库存数量" prop="stock"></el-table-column>
          <el-table-column label="价格" prop="price"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmSelect">确 定</el-button>
      <el-button @click="showFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getSkuOptionList } from '@/api/mall/product/sku';
import { getSpuSimpleList } from '@/api/mall/product/spu';
import { getProductCategoryList } from '@/api/mall/product/category';

export default {
  data() {
    return {
      showFlag: false,
      categories: [],
      spus: [],
      queryParams: {
        // pageNo: 1,
        // pageSize: 10,
        // category_id: '',
        // spuName: '',
      },
      list: [],
      selectedRows: null,
      ignoreIds: [],
    };
  },
  created() {
    getProductCategoryList().then(res => {
      this.categories = this.handleTree(res.data);
    });
    getSpuSimpleList().then(res => {
      this.spus = res.data;
    });
  },
  methods: {
    open(items) {
      this.showFlag = true;
      this.ignoreIds = items.map(({ id }) => id);
      this.selectedRows = null;
      this.getList();
      this.$nextTick(() => {
        this.$refs.table.clearSelection();
      });
    },

    getList() {
      getSkuOptionList().then(res => {
        this.list = res.data.filter(({ id }) => !this.ignoreIds.includes(id));
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectedRows = selection;
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
    handleCategorySelect(row) {
      getSpuSimpleList().then(res => {
        this.spus = res.data.filter(({ categoryId }) => {
          return categoryId == row.id;
        });
      });
    },
    handleSpuSelect(row) {
      getSkuOptionList().then(res => {
        this.list = res.data.filter(({ id, spuId }) => {
          return !this.ignoreIds.includes(id) && row.id == spuId;
        });
      });
    },
  },
};
</script>
