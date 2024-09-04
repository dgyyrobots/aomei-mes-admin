<template>
  <el-dialog title="打印发货单" v-if="showFlag" :visible.sync="showFlag" width="900px" center> </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      showFlag: false,
      order_id: 0,
    };
  },
  methods: {
    open(order_id) {
      this.order_id = order_id;
      this.showFlag = true;
    },
  },
};
</script>
