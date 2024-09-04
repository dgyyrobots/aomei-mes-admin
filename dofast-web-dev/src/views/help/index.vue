<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane :label="item.title" v-for="(item, i) in data" :key="i">
        <div class="flow-container">
          <Mermaid :nodes="item.markdown"></Mermaid>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Mermaid from '@/components/Markdown/Mermaid.vue';

export default {
  components: {
    Mermaid,
  },
  data() {
    return {
      data: [
        {
          title: '销售业务',
          markdown: `
            graph LR;
                quotation[报价单]-->order[销售订单];
                order-->sales_slip[销售单];
                sales_slip-->accounts_receivable;
                refund_order[销售退货单]-->accounts_receivable[应收账款];
                accounts_receivable-->receipt[收款单];
                receipt-->total_reconciled[客户对账统计];
                receipt-->list_econciled[客户对账明细];
                receipt-->total_unreconciled[未收款对账统计];
            `,
        },
        {
          title: '产品定制交付',
          markdown: `
            flowchart LR
               a(测量)--> b(设计) --> c(拆单)--> d(审单)--> e(排产)-->f(质检)--> g(发货)-->  h(安装)--> i(售后);
            `,
        },
        {
          title: '采购业务',
          markdown: `
            graph LR;
                采购计划-->采购订单-->采购单-->应付账款-->付款单-->供应商对账统计;
                采购退货单-->应付账款;
                付款单-->供应商对账流水;
                付款单-->供应商对账明细;
            `,
        },
        {
          title: '库存业务',
          markdown: `
            flowchart LR;
                uninstock_slip[待入库单]-->instock_slip[入库单];
                unoutstock_slip[待出库单]-->outstock_slip[出库单];
                subgraph 库内查询
                    direction TB
                    stock[库存查询];
                    sku[序列号查询];
                    expire[批号保质期查询];
                    inout[出入库流水];
                end
                instock_slip-->库内查询;
                outstock_slip-->库内查询;
                盘点单---调拨单-->库内查询;
                组装拆卸单---报损单-->库内查询;
            `,
        },
        {
          title: '生产业务',
          markdown: `
            flowchart LR;
                style dash stroke-dasharray: 5 5;
                生产计划 --- 生产工单;
                生产计划 --- 委外工单;
                物料工序 ==> 生产工单;
                物料工序 ==> 委外工单;
                委外工单 --> 物料出库
                物料出库 --> 委外质检验收[质检验收]
                委外质检验收-->委外成品入库[成品入库]
                委外成品入库-->完工;
                物料出库==>dash(退库);
                生产加工-->领料-->工序回报-->内部质检验收[质检验收]-->内部成品入库[成品入库]-->完工;
                subgraph 内部生产
                    用料;
                    退料;
                    采购订单;
                end
                领料==>仓储;

            `,
        },
        {
          title: '财务业务',
          markdown: `
            graph LR;
                accounts_receivable[应收账款]-->received_slip[收款单];
                received_slip-->accounts[资金流水];
                accounts_payable[应付账款]-->paid_slip[付款单];
                paid_slip-->accounts;
                accounts_normal_in[日常收入]-->accounts;
                accounts_normal_out[日常支出]-->accounts;
                accounts_normal_exchange[账户互转]-->accounts;
                accounts_wipe_out[费用报销]-->accounts;
                accounts-->total_reconciled[客户对账统计];
                total_reconciled---total_supplier_reconciled[供应商对账统计];
                accounts-->total_normal_reconciled[日常对账统计];
                total_normal_reconciled---total_profit[利润统计];
            `,
        },
      ],
    };
  },
};
</script>
<style scoped>
.flow-container {
  padding: 50px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
