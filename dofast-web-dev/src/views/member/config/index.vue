<template>
  <div class="app-container">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" v-loading="formLoading">
      <el-form-item label="hideId" v-show="false">
        <el-input v-model="formData.id" />
      </el-form-item>

      <el-tabs>
        <el-tab-pane label="积分">
          <el-form-item label="积分抵扣" prop="pointTradeDeductEnable">
            <el-switch v-model="formData.pointTradeDeductEnable" style="user-select: none" />
            下单积分是否抵用订单金额
          </el-form-item>
          <el-form-item label="积分抵扣" prop="pointTradeDeductUnitPrice">
            <el-input-number v-model="formData.pointTradeDeductUnitPrice" placeholder="请输入积分抵扣金额" :precision="2" />
            积分抵用比例(1 积分抵多少金额)，单位：元
          </el-form-item>
          <el-form-item label="积分抵扣最大值" prop="pointTradeDeductMaxPrice">
            <el-input-number v-model="formData.pointTradeDeductMaxPrice" placeholder="请输入积分抵扣最大值" />
            单次下单积分使用上限，0 不限制
          </el-form-item>
          <el-form-item label="1 元赠送多少分" prop="pointTradeGivePoint">
            <el-input-number v-model="formData.pointTradeGivePoint" placeholder="请输入 1 元赠送多少积分" />
            下单支付金额按比例赠送积分（实际支付 1 元赠送多少积分）
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { updateConfig, getConfig } from "@/api/member/config";

export default {
  name: "Config",
  data() {
    return {
      dialogVisible: false,
      formLoading: false,
      formData: {
        id: undefined,
        pointTradeDeductEnable: true,
        pointTradeDeductUnitPrice: 0,
        pointTradeDeductMaxPrice: 0,
        pointTradeGivePoint: 0
      },
      formRules: {},
    };
  },
  created() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      try {
        const data = await getConfig()
        if (data.code) {
          return
        }
        data.data.pointTradeDeductUnitPrice = (data.data.pointTradeDeductUnitPrice / 100).toFixed(2);
        this.formData = data.data
      } finally {
      }
    },
    async onSubmit() {
      if (!this.$refs.formRef) return
      const valid = await this.$refs.formRef.validate()
      if (!valid) return
      // 提交请求
      this.formLoading = true
      try {
        const data = this.formData;
        data.pointTradeDeductUnitPrice = Math.round(data.pointTradeDeductUnitPrice * 100);
        await updateConfig(data);
        this.$message.success('保存成功');
        this.getConfig();
        this.dialogVisible = false;
      } finally {
        this.formLoading = false;
      }
    }
  }
};
</script>
