<template>
  <el-dialog title="商品选择" v-if="showFlag" :visible.sync="showFlag" :modal="false" width="80%" center>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入商品名称" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商品类型" prop="categoryId">
        <Treeselect v-model="queryParams.categoryId" :options="goodsCategories" :normalizer="normalizer" :show-count="true" :defaultExpandLevel="1" placeholder="请选择商品分类" clearable style="width: 240px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="goodsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="商品" align="left">
        <template v-slot="scope">
          <div class="flex">
            <div class="w-20 max-h-20 mr-2 overflow-hidden inline-block">
              <img :src="scope.row.picUrls[0]" class="w-full" />
            </div>
            <div class="flex-1">
              <div>{{ scope.row.name }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品类型" align="center" key="categoryId" prop="categoryId" :show-overflow-tooltip="true" width="120px">
        <template v-slot="{ row }">
          <dict-tag :options="goodsCategories" :value="row.categoryId" />
        </template>
      </el-table-column>
      <el-table-column label="价格区间" align="center" key="price" prop="price" width="120px">
        <template v-slot="{ row }">
          <div>
            {{ (row.minPrice == row.maxPrice ? [(row.minPrice / 100).toFixed(2)] : [(row.minPrice / 100).toFixed(2), (row.maxPrice / 100).toFixed(2)]).join('~') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160px">
        <template slot-scope="scope">
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
import { getSpuPage } from '@/api/mall/product/spu.js';
import { getProductCategoryList } from '@/api/mall/product/category.js';
import Treeselect from '@riophae/vue-treeselect';

export default {
  name: 'TradeGoodsMultiSelect',
  components: { Treeselect },
  data() {
    return {
      showFlag: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      goodsCategories: [],
      selectedRows: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      goodsList: null,
      // 弹出层标题
      title: '',
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: undefined,
        categoryId: undefined,
      },
      relationQueryParams: {
        idIn: null,
        idNotIn: null,
      },
    };
  },
  created() {
    getProductCategoryList().then(({ data }) => {
      this.goodsCategories = (data || []).map(item => {
        return {
          ...item,
          value: item.id + '',
          label: item.name,
        };
      });
    });
  },
  methods: {
    open(inGoodsIds, notInGoodsIds) {
      this.showFlag = true;
      this.relationQueryParams = {
        idIn: null,
        idNotIn: null,
      };
      if (inGoodsIds) {
        this.relationQueryParams.idIn = inGoodsIds;
      }
      if (notInGoodsIds && notInGoodsIds.length) {
        this.relationQueryParams.idNotIn = notInGoodsIds;
      }
      this.getList();
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      if (this.relationQueryParams.idIn && this.relationQueryParams.idIn.length == 0) {
        this.goodsList = [];
        this.loading = false;
        return;
      }
      getSpuPage({
        ...this.queryParams,
        ...this.relationQueryParams,
      }).then(response => {
        this.goodsList = response.data.list;
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
