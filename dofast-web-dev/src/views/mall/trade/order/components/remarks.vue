<template>
  <el-dialog title="订单备注" v-if="showFlag" :visible.sync="showFlag" width="500px" center>
    <el-form ref="formRef" :model="form" :rules="rules" @submit="onCommit">
      <el-form-item label="备注类型" props="remarkType">
        <el-select v-model="form.remarkType" placeholder="请选择备注类型">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.TRADE_ORDER_REMARK_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否置顶" prop="isTop">
        <el-radio-group v-model="form.isTop">
          <el-radio :label="true" :key="true">是</el-radio>
          <el-radio :label="false" :key="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注内容" props="content">
        <el-input type="textarea" resize="none" class="!w-120" v-model="form.content" placeholder="请输入备注内容"
          rows="4"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showFlag = false">取消</el-button>
      <el-button type="primary" submit @click="onCommit">确认</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { addOrderRemark, gxOrderRemark } from '@/api/mall/trade/orderRemark.js';

export default {
  data() {
    return {
      showFlag: false,
      order_id: 0,
      form: {
        remarkType: 'other',
        content: '',
        isTop: false,
      },
      rules: {
        content: [{ required: true, message: '请输入备注内容', trigger: 'blur' }],
      },
    };
  },
  methods: {
    open(order_id, order) {
      this.order_id = order_id;
      console.log(order);
      if (order) this.form = {
        ...order,
        remarkType: order.type,
        content: order.remark,
        isTop: order.sortCode == 1 ? true : false
      };
      this.showFlag = true;
    },
    onCommit() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) {
          return;
        }
        if (this.form.id) {
          const { code } = await gxOrderRemark({
            ...this.form,
            remark: this.form.content,
            type: this.form.remarkType,
            sort: 0,
            sortCode: this.form.isTop ? 1 : 0,
            tradeOrderId: this.order_id,
          });
          if (code != 0) {
            return;
          }
        } else {
          const { code } = await addOrderRemark({
            ...this.form,
            remark: this.form.content,
            type: this.form.remarkType,
            sortCode: this.form.isTop ? 1 : 0,
            sort: 0,
            tradeOrderId: this.order_id,
          });
          if (code != 0) {
            return;
          }
        }
        this.form = {
          remarkType: 'other',
          content: '',
          isTop: false,
        },
          this.$emit('success');
        this.showFlag = false;
      });
    },
  },
};
</script>
