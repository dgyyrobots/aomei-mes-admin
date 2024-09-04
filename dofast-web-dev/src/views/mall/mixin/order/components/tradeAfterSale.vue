<template>
  <easy-panel>
    <el-form slot="header"></el-form>
    <el-table>
      <el-table-column></el-table-column>
    </el-table>
  </easy-panel>
</template>
<script>
import easyPanel from './easy-panel.vue';

export default {
  props: ['orderId'],
  components: {
    easyPanel,
  },
};
</script>
