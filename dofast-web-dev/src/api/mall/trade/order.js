import request from '@/utils/request';

export function createTradeOrder(data) {
  return request({
    url: '/trade/order/create',
    method: 'post',
    data,
  });
}

// 获得交易订单分页
export function getOrderPage(query) {
  if (query.tasks) {
    query.tasks = query.tasks.split(',');
    query.tasks = query.tasks.filter(item => item);
  } else {
    try { delete query.tasks; } catch { };
  }
  return request({
    url: '/trade/order/page',
    method: 'post',
    // params: query,
    data: query
  });
}

// 获得交易订单分页
export function getOrderList(query) {
  return request({
    url: '/trade/order/list-all',
    method: 'get',
    params: query,
  });
}

// 获得交易订单详情
export function getOrderDetail(id) {
  return request({
    url: '/trade/order/get-detail?id=' + id,
    method: 'get',
  });
}

// 导出订单 Excel
export function exportOrderExcel(query) {
  return request({
    url: '/trade/order/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}

// 点三快递发货
export async function setOrderExpressPassByDot3(data) {
  const { data: bills } = await request({
    url: '/dian3/order/get-way-bill',
    method: 'post',
    data: data,
  });
  if (!bills || bills.length <= 0) {
    throw new Error('电子面单生成失败');
  }
  (data.packages || []).forEach(item => {
    for (let i = 0; i < bills.length; i++) {
      const bill = bills[i];
      if (bill.outerCode == item.outerCode) {
        item.outSid = bill.wayBillCode;
        break;
      }
    }
  });

  return request({
    url: '/channel/order/shop-order-shipment',
    method: 'post',
    data: data,
  });
}

//
export async function setOrderExpressPassByKdbird(data, dot3Data) {
  const { data: bill } = await request({
    url: '/kdn/order/get-way-bill',
    method: 'post',
    data: data,
  });
  if (!bill) {
    throw new Error('电子面单生成失败');
  }
  if (dot3Data) {
    return request({
      url: '/channel/order/shop-order-shipment',
      method: 'post',
      data: {
        ...dot3Data,
        packages: [
          {
            companyCode: data.dot3LogisticCode,
            outSid: bill.order.logisticCode,
            lines: data.commodity.map(({ refOlId, refSkuId, goodsquantity: num }) => ({ refOlId, refSkuId, num })),
          },
        ],
      },
    });
  }
  return request({
    url: '/trade/order/delivery',
    method: 'put',
    data: {
      id: data.order_id,
      // logisticsId: bill.uniquerRequestNumber,
      logisticsId: bill.order.shipperCode,
      logisticsNo: bill.order.logisticCode,
    },
  });
}

// 普通快递发货
export function setOrderExpressPass(data) {
  return request({
    url: '/trade/order/delivery',
    method: 'put',
    data: data,
  });
}

// 虚拟快递发货
export function setOrderExpressPassByDot3Virtual(data) {
  return request({
    url: '/channel/order/virtual-delivery',
    method: 'post',
    data: data,
  });
}

export async function getOrderDeliveryLine(order_id) {
  const { data: order } = await request({
    url: '/trade/order/get-detail?id=' + order_id,
    method: 'get',
  });
  if (order.status == 20) {
    const { data: company } = await request({
      url: '/system/express-company/get?id=' + order.logisticsId,
      method: 'get',
    });
    if (!company) {
      throw new Error('无效的物流公司');
    }
    return request({
      url: '/kdn/order/get-monitor-search',
      method: 'post',
      data: {
        orderCode: order_id,
        shipperCode: company.expressNo,
        customerName: order.receiverMobile.replace(/\d+(\d{4})/, '$1'),
        logisticCode: order.logisticsNo,
      },
    });
  }
  return {
    data: [],
  };
}

export function updateOrderAdjustPrice(order_id, price) {
  return request({
    url: '/trade/order/update-adjust-price',
    method: 'get',
    params: {
      id: order_id,
      adjustPrice: price,
    },
  });
}

export function offlinePay(orderId, bandCard) {
  return request({
    url: '/trade/order/offline-pay',
    method: 'get',
    params: { id: orderId, bandCard },
  });
}

export function closeOrder(orderId) {
  return request({
    url: '/trade/order/close_order?id=' + orderId,
    method: 'put',
  });
}

export function orderComplate(orderId) {
  return request({
    url: '/trade/order/confirm_receipt?id=' + orderId,
    method: 'put',
  });
}

export function setOrderSystemUser({ id, systemUserId, systemUserName }) {
  return request({
    url: `/trade/order/update-system-user?id=${id}&systemUserId=${systemUserId}&systemUserName=${systemUserName}`,
    method: 'put',
  });
}

export function getOrderMonthCount(year) {
  year =
    {
      previous: 'lastYear',
    }[year] || 'thisYear';
  return request({
    url: `/admin-api/trade/order/count-month-money-${year}`,
    method: 'get',
  });
}

export function UpdateShipment(data) {
  return request({
    url: `/trade/order/set-deliver-type`,
    method: 'put',
    data
  });
}
