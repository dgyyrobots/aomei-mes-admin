<template>
  <!-- 添加或修改生产领料单头对话框 -->
  <el-dialog title="生产报工" :visible.sync="open" width="75%" append-to-body>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      open: false
    }
  },
  methods: {
    openDialog() {
      this.open = true;
    },
  }
}
</script>
