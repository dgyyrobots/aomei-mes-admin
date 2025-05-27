<template>
  <!-- 添加或修改生产领料单头对话框 -->
  <!-- <el-dialog title="生产上料" :visible.sync="open" width="75%" append-to-body>
  </el-dialog> -->
  <div></div>
</template>
<script>
import { listFeedback, getFeedback, updatePrintStatus } from '@/api/mes/pro/feedback';

export default {
  props: {},
  data() {
    return {
    }
  },
  methods: {
    async openDialog(row) {
      const {data: {list: selectedRows}} = await listFeedback({ page: 1, pageSize: 100, taskCode: row.taskCode});
      const ids = selectedRows.map(item => item.id);
      for (let i = 0; i < selectedRows.length; i++) {
        let status = selectedRows[i].status;
        if (status === 'PREPARE' || status === 'APPROVING') {
          this.$message.error('第' + (i + 1) + '行选中的报工单未完成');
          return;
        }
      }
      console.log("当前行信息: ", selectedRows);
      await this.$modal.confirm('确认批量打印？');
      LODOP.PRINT_INITA(0, 0, 150, 100); // 初始化打印任务，纸张大小为150mm*100mm，单位：像素
      LODOP.SET_PRINT_PAGESIZE(2, "", "", "热敏纸"); // 设置纸张横向
      for (const queryId of ids) {
        const {data: obj} = await getFeedback(queryId)
        LODOP.NEWPAGE();
        // 添加整体边框
        LODOP.ADD_PRINT_RECT(8, 5, 150 * 3.71 - 10, 100 * 3.71 - 10, 0, 1); // 整体边框

        // 添加标题及标题边框
        LODOP.SET_PRINT_STYLE("FontSize", 18);
        LODOP.SET_PRINT_STYLE("FontName", "Microsoft YaHei");
        LODOP.SET_PRINT_STYLE("Bold", 1);
        LODOP.SET_PRINT_STYLE("Horient", 2); // 居中
        LODOP.ADD_PRINT_TEXT(13, 0, 150, 30, "产成品标签");

        // 内容样式及分块边框
        LODOP.SET_PRINT_STYLE("FontSize", 14);
        LODOP.SET_PRINT_STYLE("Bold", 0);
        LODOP.SET_PRINT_STYLE("Horient", 0); // 取消居中

        LODOP.ADD_PRINT_TEXT(65, 15, 120, 35, "条码编号:");
        LODOP.ADD_PRINT_TEXT(65, 120, 280, 35, obj.id); // 内容部分

        LODOP.ADD_PRINT_TEXT(110, 15, 120, 35, "生产车间:");
        LODOP.ADD_PRINT_TEXT(110, 120, 280, 35, obj.workstationName);

        LODOP.ADD_PRINT_TEXT(155, 15, 120, 35, "物料名称:");
        LODOP.ADD_PRINT_TEXT(155, 120, 280, 35, obj.itemName);

        LODOP.ADD_PRINT_TEXT(200, 15, 120, 35, "工单号:");
        LODOP.ADD_PRINT_TEXT(200, 120, 280, 35, obj.workorderCode);

        LODOP.ADD_PRINT_TEXT(245, 15, 120, 35, "合格数量:");
        if(obj.machineryCode === 'AMSB-BF202401'){
          // 分切工序中, 剥离复卷机产成品单位为"米"
          LODOP.ADD_PRINT_TEXT(245, 120, 280, 35, obj.quantityQualified + '米');
        }else{
          LODOP.ADD_PRINT_TEXT(245, 120, 280, 35, obj.quantityQualified + obj.unitOfMeasure);
        }

        LODOP.ADD_PRINT_TEXT(290, 15, 120, 35, "批次号:");
        LODOP.ADD_PRINT_TEXT(290, 120, 280, 35, obj.batchCode);

        LODOP.ADD_PRINT_TEXT(335, 15, 120, 35, "日期:");
        LODOP.ADD_PRINT_TEXT(335, 120, 280, 35, new Date(obj.feedbackTime).toISOString().slice(0, 19).replace('T', ' '));

        let jsonQc = {
          "id": obj.id,
          "type": "feedback"
        }
        LODOP.ADD_PRINT_BARCODE(220, 390, 170, 170, "QRCode", JSON.stringify(jsonQc));

      }
      LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1); //打印后自动关闭预览窗口
      LODOP.PREVIEW();

      for (const queryId of this.ids) {
        await updatePrintStatus(queryId);
      }

      this.$modal.msgSuccess('批量打印成功');
    },
  }
}
</script>
