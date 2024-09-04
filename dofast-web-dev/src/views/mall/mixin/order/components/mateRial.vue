<template>
  <div>
    <el-table :data="wl">
      <el-table-column label="物料编码" width="120" align="center" key="itemCode" prop="itemCode"> </el-table-column>
      <el-table-column label="物料名称" min-width="120" align="left" key="itemName" prop="itemName" :show-overflow-tooltip="true" />
      <el-table-column label="规格型号" align="left" key="specification" prop="specification" :show-overflow-tooltip="true" />
      <el-table-column label="单位" align="center" key="unitOfMeasure" prop="unitOfMeasure" :show-overflow-tooltip="true" />
      <el-table-column label="物料/产品" align="center" key="itemOrProduct" prop="itemOrProduct" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_item_product" :value="scope.row.itemOrProduct" />
        </template>
      </el-table-column>
      <el-table-column label="所属分类" align="center" key="itemTypeName" prop="itemTypeName" width="120" />
      <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column> -->
    </el-table>
  </div>
</template>
<script>
import { getDetail } from '@/api/mall/trade/mixinOrder.js';
export default {
  props: ['id'],
  dicts: ['sys_yes_no', 'mes_item_product'],
  data() {
    return {
      wl: [],
    };
  },
  async created() {
    let data = await getDetail({ id: this.id });
    this.wl = data.data.mdItemDTOS;
  },
};
</script>
