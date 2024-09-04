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
    order() {
        return request({
            url: '/channel/order/day-total-money',
            method: 'get',
        });
    },
    mixinOrder() {
        return request({
            url: '/trade/mixin-order/day-total-money',
            method: 'get',
        });
    },
    ysp() {
        return new Promise((rej, res) => {
            rej({ data: 0 })
        })
    },
    yfk() {
        return new Promise((rej, res) => {
            rej({ data: 0 })
        })
    },
    user() {
        return request({
            url: '/member/user/count-all',
            method: 'get',
        });
    },
    mdVendor() {
        return request({
            url: '/mes/md-vendor/count-all',
            method: 'get',
        });
    },
    mdItem() {
        return request({
            url: '/mes/md-item/count-all',
            method: 'get',
        });
    },
    workorder() {
        return request({
            url: '/mes/pro/workorder/count-all',
            method: 'get',
        });
    },
    workorderOut() {
        return request({
            url: '/mes/pro/workorder/count-out-all',
            method: 'get',
        });
    },
    waitProduce() {
        return request({
            url: '/mes/pro/task/count-wait-produce',
            method: 'get',
        });
    },
    countWait() {
        return request({
            url: '/trade/order/count-wait-delivery',
            method: 'get',
        });
    },
    product() {
        return request({
            url: '/wms/product-produce/count-wait',
            method: 'get',
        });
    },

}