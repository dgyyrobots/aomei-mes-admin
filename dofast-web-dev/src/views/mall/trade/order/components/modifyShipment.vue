<template>
    <el-dialog title="修改发货方式" v-if="showFlag" :visible.sync="showFlag" width="900px" center>
        配送方式：<el-radio-group v-model="deliveryType" style="margin: 0 auto;">
            <el-radio v-for="(dict, i) in this.getDictDatas(DICT_TYPE.TRADE_DELIVERY_TYPE)" :label="dict.value" :key="i"> {{
                dict.label }}</el-radio>
        </el-radio-group>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addTicket">确 定</el-button>
            <el-button @click="showFlag = false">取 消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { UpdateShipment } from '@/api/mall/trade/order.js';
export default {
    data() {
        return {
            showFlag: false,
            order_id: 0,
            deliveryType: ''
        };
    },
    methods: {
        open(order_id, deliveryType) {
            this.order_id = order_id;
            this.showFlag = true;
            this.deliveryType = deliveryType + '';
        },
        async addTicket() {
            let data = await UpdateShipment({ id: this.order_id, deliveryType: this.deliveryType * 1 });
            if (data.code == 0 && data.data) {
                this.$modal.msgSuccess('修改发货方式成功');
                this.$emit('success');
                this.showFlag = false;
            }
        }
    },
};
</script>
