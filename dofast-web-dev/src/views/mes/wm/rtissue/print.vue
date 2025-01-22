<template>
  <div>
    <!-- 打印状态提示 -->
    <el-dialog :visible.sync="loading" title="正在打印">
      <p>{{ progressMessage }}</p>
      <el-progress
        :percentage="progressPercentage"
        :text-inside="true"
        status="success"
      ></el-progress>
    </el-dialog>

    <!-- 隐藏 iframe 容器 -->
    <div ref="iframeContainer" style="display: none;"></div>
  </div>
</template>

<script>
export default {
  name: "Print",
  props: {
    url: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    idList: {
      type: Array,
      required: true,
    },
    templateId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false, // 控制加载状态
      progressMessage: "", // 显示当前进度
      progressPercentage: 0, // 打印进度
    };
  },
  mounted() {
    this.printData();
  },
  methods: {
    async printData() {
      if (!this.idList || this.idList.length === 0) {
        this.$message.error("没有可打印的数据！");
        this.$emit("close");
        return;
      }

      // 设置加载状态
      this.loading = true;
      this.progressPercentage = 0;
      this.progressMessage = "准备开始打印...";

      // 获取 iframe 容器
      const container = this.$refs.iframeContainer;

      try {
        for (let i = 0; i < this.idList.length; i++) {
          const id = this.idList[i];
          const iframe = document.createElement("iframe");
          iframe.src = `${this.url}${this.templateId}?token=${this.token}&id=${id}`;
          console.log(iframe.src);
          // 创建一个 Promise 等待 iframe 加载和打印完成
          await new Promise((resolve, reject) => {
            iframe.onload = () => {
              try {
                iframe.contentWindow.print();
                resolve();
              } catch (error) {
                reject(error);
              }
            };
            iframe.onerror = () => reject(new Error("无法加载打印页面"));
          });

          // 更新进度条和提示信息
          this.progressPercentage = Math.round(
            ((i + 1) / this.idList.length) * 100
          );
          this.progressMessage = `正在打印第 ${i + 1} / ${this.idList.length} 条记录...`;
          container.appendChild(iframe);
        }

        this.$message.success("打印完成！");
      } catch (error) {
        this.$message.error("打印失败，请检查网络或模板配置！");
      } finally {
        this.$emit("close"); // 关闭组件
        this.loading = false;

        // 定时清理 iframe，避免影响性能
        setTimeout(() => {
          container.innerHTML = "";
        }, 30000); // 30 秒后清理
      }
    },
  },
};
</script>

<style scoped>

</style>
