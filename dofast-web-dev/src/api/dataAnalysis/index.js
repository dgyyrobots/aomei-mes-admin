// 'dataAnalysis': {
//     // 渠道营业
//     order: () => vm.$u.get(config.adminPath + '/channel/order/day-total-money'),
//         // 销售成交额
//         mixinOrder: () => vm.$u.get(config.adminPath + '/trade/mixin-order/day-total-money'),
//             // 客户数
//             user: () => vm.$u.get(config.adminPath + '/member/user/count-all'),
//                 // 供应商总数
//                 mdVendor: () => vm.$u.get(config.adminPath + '/mes/md-vendor/count-all'),
//                     // 物料总数
//                     mdItem: () => vm.$u.get(config.adminPath + '/mes/md-item/count-all'),
//                         // 工单总数
//                         workorder: () => vm.$u.get(config.adminPath + '/mes/pro/workorder/count-all'),
//                             // 委外工单
//                             workorderOut: () => vm.$u.get(config.adminPath + '/mes/pro/workorder/count-out-all'),
//                                 // 待发货订单
//                                 countWait: () => vm.$u.get(config.adminPath + '/trade/order/count-wait-delivery'),
//                                     // 待出库订单
//                                     product: () => vm.$u.get(config.adminPath + '/wms/product-produce/count-wait'),
//                                         // 待排产
//                                         waitProduce: () => vm.$u.get(config.adminPath + '/mes/pro/task/count-wait-produce'),
// 			// 应收款
// 			// 应付款
// 		},
// 首页数据汇总
import request from '@/utils/request';
export default {
    // 渠道营业额
    /*order() {
        return request({
            url: '/channel/order/day-total-money',
            method: 'get',
        });
    },*/
  // 销售成交额
    /*mixinOrder() {
        return request({
            url: '/trade/mixin-order/day-total-money',
            method: 'get',
        });
    },*/
  // 应收款
    /*ysp() {
        return new Promise((rej, res) => {
            rej({ data: 0 })
        })
    },*/
  // 应付款
  /*  yfk() {
        return new Promise((rej, res) => {
            rej({ data: 0 })
        })
    },*/
  // 客户数量
    /*user() {
        return request({
            url: '/member/user/count-all',
            method: 'get',
        });
    },*/
  // 供应商
  /*mdVendor() {
        return request({
            url: '/mes/md-vendor/count-all',
            method: 'get',
        });
    },*/
  // 物料数量
    mdItem() {
        return request({
            url: '/mes/md-item/count-all',
            method: 'get',
        });
    },
  // 工单数量
    workorder() {
        return request({
            url: '/mes/pro/workorder/count-all',
            method: 'get',
        });
    },
  // 委外工单
    workorderOut() {
        return request({
            url: '/mes/pro/workorder/count-out-all',
            method: 'get',
        });
    },
  // 等待排产数量
    waitProduce() {
        return request({
            url: '/mes/pro/task/count-wait-produce',
            method: 'get',
        });
    },
  // 待发货订单
    /*countWait() {
        return request({
            url: '/trade/order/count-wait-delivery',
            method: 'get',
        });
    },*/
  // 等待出库订单
   /* product() {
        return request({
            url: '/wms/product-produce/count-wait',
            method: 'get',
        });
    },*/

}
