(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages_promotion-giftcard-order_detail"],{"013c":function(e,t,o){"use strict";o("7a82"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,o("c975"),o("a9e3"),o("ac1f"),o("5319"),o("acd8");var i={type:"scrolldone",target:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},currentTarget:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},detail:{}},a={props:{backgroundTextStyle:{type:String,default:"dark",validator:function(e){return-1!==["dark","light"].indexOf(e)}},backgroundColor:{type:String,default:"#ffffff"},backgroundColorTop:{type:String,default:"#ffffff"},backgroundColorBottom:{type:String,default:"#ffffff"},scrollTop:{type:String,default:""},scrollDuration:{type:Number,default:300},pageStyle:{type:String,default:""},enablePullDownRefresh:{type:[Boolean,String],default:!1},rootFontSize:{type:String,default:""}},created:function(){var e=this,t=getCurrentPages()[0];this.$pageVm=t.$vm||t,uni.onWindowResize((function(t){e.$emit("resize",t)})),this.$pageVm.$on("hook:onPageScroll",(function(t){e.$emit("scroll",t)})),this.$watch("backgroundTextStyle",(function(){e.setBackgroundTextStyle()})),this.$watch((function(){return[e.rootFontSize,e.pageStyle]}),(function(){e.setPageMeta()})),this.$watch((function(){return[e.backgroundColor,e.backgroundColorTop,e.backgroundColorBottom]}),(function(){e.setBackgroundColor()})),this.$watch((function(){return[e.scrollTop,e.scrollDuration]}),(function(){e.pageScrollTo()}))},beforeMount:function(){this.setBackgroundColor(),(this.rootFontSize||this.pageStyle)&&this.setPageMeta(),this.backgroundTextStyle&&this.setBackgroundTextStyle()},mounted:function(){this.scrollTop&&this.pageScrollTo()},methods:{setPullDownRefresh:function(e,t){e.setStyle({pullToRefresh:{support:t,style:"Android"===plus.os.name?"circle":"default"}})},setPageMeta:function(){uni.setPageMeta({pageStyle:this.pageStyle,rootFontSize:this.rootFontSize})},setBackgroundTextStyle:function(){},setBackgroundColor:function(){},pageScrollTo:function(){var e=this,t=String(this.scrollTop);if(-1!==t.indexOf("rpx")&&(t=uni.upx2px(t.replace("rpx",""))),t=parseFloat(t),!isNaN(t)){var o=function o(a){a.scrollTop===t&&(e.$pageVm.$off("hook:onPageScroll",o),e.$emit("scrolldone",i))};uni.pageScrollTo({scrollTop:t,duration:this.scrollDuration,success:function(){e.$pageVm.$on("hook:onPageScroll",o)}})}}}};t.default=a},"01ec":function(e,t,o){"use strict";o("7a82");var i=o("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,o("a9e3"),o("ac1f"),o("466d"),o("d3b7"),o("159b"),o("c975"),o("a434");var a=i(o("4e20")),n=i(o("e540")),s=o("9f73"),r={name:"ns-payment",components:{uniPopup:a.default,nsSwitch:n.default},props:{balanceDeduct:{type:[Number,String],default:""},isBalance:{type:Number,default:0},payMoney:{type:[Number,String],default:0}},data:function(){return{isIphoneX:!1,payIndex:0,payTypeList:[{name:"支付宝支付",icon:"icon-zhifubaozhifu-",type:"alipay"},{name:"微信支付",icon:"icon-weixin1",type:"wechatpay"}],timer:null,payInfo:{},balanceConfig:0,sale:!0}},created:function(e){var t=window.location.href,o=t.match("presale/order_list/order_list"),i=t.match("presale/order_detail/order_detail");(o||i)&&(this.sale=!1),this.isIphoneX=this.$util.uniappIsIPhoneX(),this.getPayType(),this.getBalanceConfig()},methods:{open:function(){this.$refs.choosePaymentPopup.open()},close:function(){this.$refs.choosePaymentPopup.close()},useBalance:function(){this.$emit("useBalance")},confirm:function(){0==this.payTypeList.length&&this.payMoney>0?this.$util.showToast({title:"请选择支付方式！"}):(uni.showLoading({title:"支付中...",mask:!0}),this.$refs.choosePaymentPopup.close(),this.$emit("confirm"),uni.setStorageSync("pay_flag",1))},getPayInfo:function(e){var t=this;this.$api.sendRequest({url:"/api/pay/info",data:{out_trade_no:e},success:function(e){e.code>=0&&e.data?(t.payInfo=e.data,t.pay()):(t.$util.showToast({title:"未获取到支付信息！"}),setTimeout((function(){t.$util.redirectTo("/pages/index/index")}),1500))}})},getBalanceConfig:function(){var e=this;this.$api.sendRequest({url:"/api/pay/getBalanceConfig",data:{},success:function(t){e.balanceConfig=t.data.balance_show}})},getPayType:function(){var e=this;this.$api.sendRequest({url:"/api/pay/type",success:function(t){0==t.code&&(""==t.data.pay_type?e.payTypeList=[]:e.payTypeList.forEach((function(o,i){-1==t.data.pay_type.indexOf(o.type)&&e.payTypeList.splice(i,1)})))}})},pay:function(){var e=this,t=this.payTypeList[this.payIndex];if(t){var o="";o="BlindboxGoodsOrderPayNotify"==this.payInfo.event?"/pages_promotion/blindbox/index?outTradeNo=":"/pages_tool/pay/result?code=",this.$api.sendRequest({url:"/api/pay/pay",data:{out_trade_no:this.payInfo.out_trade_no,pay_type:t.type,return_url:encodeURIComponent(this.$config.h5Domain+o+this.payInfo.out_trade_no)},success:function(o){if(uni.hideLoading(),o.code>=0)switch(t.type){case"alipay":if(e.$util.isWeiXin()){var i=encodeURIComponent(o.data.data);e.$util.redirectTo("/pages_tool/pay/wx_pay",{wx_alipay:i,out_trade_no:e.payInfo.out_trade_no},"","redirectTo")}else location.href=o.data.data,e.checkPayStatus();break;case"wechatpay":if(e.$util.isWeiXin()){if("ios"==uni.getSystemInfoSync().platform)var a=uni.getStorageSync("initUrl");else a=location.href;e.$api.sendRequest({url:"/wechat/api/wechat/jssdkconfig",data:{url:a},success:function(t){var i=new s.Weixin,a=o.data.data;i.init(t.data),i.pay({timestamp:a.timestamp?a.timestamp:a.timeStamp,nonceStr:a.nonceStr,package:a.package,signType:a.signType,paySign:a.paySign},(function(t){"chooseWXPay:ok"==t.errMsg?"BlindboxGoodsOrderPayNotify"==e.payInfo.event?e.$util.redirectTo("/pages_promotion/blindbox/index",{outTradeNo:e.payInfo.out_trade_no},"","redirectTo"):e.$util.redirectTo("/pages_tool/pay/result",{code:e.payInfo.out_trade_no},"","redirectTo"):e.$util.showToast({title:t.errMsg})}),(function(t){e.$util.showToast({title:"您已取消支付"}),setTimeout((function(){e.$util.redirectTo("/pages_tool/pay/result",{code:e.payInfo.out_trade_no},"redirectTo")}),2e3)}))}})}else location.href=o.data.url,e.checkPayStatus();break}else e.$util.showToast({title:o.message})},fail:function(t){uni.hideLoading(),e.$util.showToast({title:"request:fail"})}})}},checkPayStatus:function(){var e=this;this.timer=setInterval((function(){e.$api.sendRequest({url:"/api/pay/status",data:{out_trade_no:e.payInfo.out_trade_no},success:function(t){0==t.code?2==t.data.pay_status&&(clearInterval(e.timer),e.$util.redirectTo("/pages_tool/pay/result",{code:e.payInfo.out_trade_no},"","redirectTo")):clearInterval(e.timer)}})}),1e3)}},deactivated:function(){clearInterval(this.timer)}};t.default=r},"0548":function(e,t,o){"use strict";var i=o("c678"),a=o.n(i);a.a},1797:function(e,t,o){var i=o("5f84");i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var a=o("4f06").default;a("5b53799a",i,!0,{sourceMap:!1,shadowMode:!1})},"17fd":function(e,t,o){"use strict";o.r(t);var i=o("01ec"),a=o.n(i);for(var n in i)["default"].indexOf(n)<0&&function(e){o.d(t,e,(function(){return i[e]}))}(n);t["default"]=a.a},2413:function(e,t,o){"use strict";o("7a82");var i=o("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,o("d3b7"),o("159b"),o("c975");var a=i(o("4e20")),n={components:{uniPopup:a.default},data:function(){return{isIphoneX:!1,orderId:"",orderDetail:"all",goodsOpen:!0}},onLoad:function(e){var t=this;if(e.order_id&&(this.orderId=e.order_id),e.scene){var o=decodeURIComponent(e.scene);o=o.split("&"),o.length&&o.forEach((function(e){-1!=e.indexOf("order_id")&&(t.orderId=e.split("-")[1])}))}this.getData()},onShow:function(){this.isIphoneX=this.$util.uniappIsIPhoneX()},methods:{getData:function(){var e=this;this.$api.sendRequest({url:"/giftcard/api/order/detail",data:{order_id:this.orderId},success:function(t){t.code>=0?(e.orderDetail=t.data,setTimeout((function(){e.$refs.loadingCover&&e.$refs.loadingCover.hide()}),300)):(e.$util.showToast({title:t.message}),setTimeout((function(){e.$util.redirectTo("/pages_promotion/giftcard/order_list")}),1500))},fail:function(t){e.$refs.loadingCover&&e.$refs.loadingCover.hide()}})},openChoosePayment:function(){uni.getStorageSync("token")?(uni.setStorageSync("paySource","giftcard"),this.$refs.choosePaymentPopup.open()):this.$util.showToast({title:"您尚未登录，请先登录"})},gotoBuy:function(){this.$refs.choosePaymentPopup.getPayInfo(this.orderDetail.out_trade_no)},imageError:function(e){this.orderDetail.order_goods_list[e].sku_image=this.$util.getDefaultImage().goods,this.$forceUpdate()},toCardInfo:function(){this.orderDetail.card_list.length>0?this.$util.redirectTo("/pages_promotion/giftcard/card_info",{member_card_id:this.orderDetail.card_list[0]["member_card_id"]}):this.$util.showToast({title:"礼品卡不存在或已送出"})},closeOrder:function(e){var t=this;uni.showModal({title:"提示",content:"您确定要关闭该订单吗？",success:function(o){o.confirm&&t.$api.sendRequest({url:"/giftcard/api/order/close",data:{order_id:e},success:function(e){e.code>=0?t.getData():t.$util.showToast({title:e.message})}})}})}}};t.default=n},3093:function(e,t,o){var i=o("24fb");t=i(!1),t.push([e.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.popup[data-v-7ed6e92e]{width:75vw;background:#fff;border-top-left-radius:%?10?%;border-top-right-radius:%?10?%}.popup .popup-header[data-v-7ed6e92e]{display:flex;border-bottom:%?2?% solid #eee;position:relative;padding:%?40?%}.popup .popup-header .tit[data-v-7ed6e92e]{flex:1;font-size:%?32?%;line-height:1;text-align:center}.popup .popup-header .iconfont[data-v-7ed6e92e]{line-height:1;position:absolute;right:%?30?%;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);color:#909399;font-size:%?32?%}.popup .popup-body[data-v-7ed6e92e]{height:calc(100% - %?250?%)}.popup .popup-body.safe-area[data-v-7ed6e92e]{height:calc(100% - %?270?%)}.popup .popup-footer[data-v-7ed6e92e]{height:%?100?%}.popup .popup-footer .confirm-btn[data-v-7ed6e92e]{height:%?72?%;line-height:%?72?%;color:#fff;text-align:center;margin:%?20?% %?30?% 0;border-radius:%?10?%;font-size:%?28?%}.popup .popup-footer.bottom-safe-area[data-v-7ed6e92e]{padding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom)}.choose-payment-popup .payment-item[data-v-7ed6e92e]{display:flex;align-items:center;justify-content:space-between;height:%?90?%;margin:0 %?30?%;border-bottom:%?2?% solid #eee;padding:%?20?% 0}.choose-payment-popup .payment-item[data-v-7ed6e92e]:nth-child(2){padding-top:0}.choose-payment-popup .payment-item[data-v-7ed6e92e]:last-child{border-bottom:none}.choose-payment-popup .payment-item .iconfont[data-v-7ed6e92e]{font-size:%?64?%}.choose-payment-popup .payment-item .icon-yue[data-v-7ed6e92e]{color:#faa218}.choose-payment-popup .payment-item .icon-weixin1[data-v-7ed6e92e]{color:#24af41}.choose-payment-popup .payment-item .icon-zhifubaozhifu-[data-v-7ed6e92e]{color:#00a0e9}.choose-payment-popup .payment-item .icon-checkboxblank[data-v-7ed6e92e]{font-size:%?40?%;color:#eee}.choose-payment-popup .payment-item .icon-yuan_checked[data-v-7ed6e92e]{font-size:%?40?%}.choose-payment-popup .payment-item .name[data-v-7ed6e92e]{margin-left:%?20?%;font-size:%?28?%;flex:1}.choose-payment-popup .payment-item .info-wrap[data-v-7ed6e92e]{flex:1;margin-left:%?20?%}.choose-payment-popup .payment-item .info-wrap .name[data-v-7ed6e92e]{margin-left:0;font-size:%?28?%;flex:1}.choose-payment-popup .payment-item .info-wrap .money[data-v-7ed6e92e]{color:#909399;font-size:%?24?%}.choose-payment-popup .payment-item .box[data-v-7ed6e92e]{flex:1;padding:0 %?10?%;line-height:inherit;text-align:right}.choose-payment-popup .payment-item .box uni-input[data-v-7ed6e92e]{font-size:%?24?%!important}.choose-payment-popup .payment-item.set-pay-password[data-v-7ed6e92e]{height:auto}.choose-payment-popup .payment-item.set-pay-password .box[data-v-7ed6e92e]{font-size:%?24?%!important}.choose-payment-popup .pay-money[data-v-7ed6e92e]{text-align:center;padding:%?20?% 0 %?40?% 0;background-color:#fff;font-weight:700;margin-top:%?30?%;line-height:1}.choose-payment-popup .pay-money .unit[data-v-7ed6e92e]{margin-right:%?4?%;font-size:%?24?%}.choose-payment-popup .pay-money .money[data-v-7ed6e92e]{font-size:%?32?%}.empty[data-v-7ed6e92e]{width:100%;text-align:center;padding:%?40?% 0;color:#606266;font-size:%?24?%}',""]),e.exports=t},4399:function(e,t,o){"use strict";var i=o("1797"),a=o.n(i);a.a},"53e9":function(e,t,o){"use strict";o.r(t);var i=o("8b4f"),a=o.n(i);for(var n in i)["default"].indexOf(n)<0&&function(e){o.d(t,e,(function(){return i[e]}))}(n);t["default"]=a.a},"5f47":function(e,t,o){"use strict";o.r(t);var i=o("8b6b"),a=o("9d27");for(var n in a)["default"].indexOf(n)<0&&function(e){o.d(t,e,(function(){return a[e]}))}(n);o("802e");var s=o("f0c5"),r=Object(s["a"])(a["default"],i["b"],i["c"],!1,null,"ceb3c5d6",null,!1,i["a"],void 0);t["default"]=r.exports},"5f84":function(e,t,o){var i=o("24fb");t=i(!1),t.push([e.i,'.weui-switch[data-v-eb8d2e58]{display:block;position:relative;width:%?94?%;height:%?45?%;outline:0;border-radius:%?30?%;border:%?2?% solid;border-color:#dfdfdf;transition:background-color .1s,border .1s}.weui-switch .bgview[data-v-eb8d2e58]{content:" ";position:absolute;top:0;left:0;width:%?94?%;height:%?45?%;border-radius:%?30?%;transition:-webkit-transform .35s cubic-bezier(.45,1,.4,1);transition:transform .35s cubic-bezier(.45,1,.4,1);transition:transform .35s cubic-bezier(.45,1,.4,1),-webkit-transform .35s cubic-bezier(.45,1,.4,1)}.weui-switch .spotview[data-v-eb8d2e58]{content:" ";position:absolute;top:%?2?%;left:%?4?%;width:%?40?%;height:%?40?%;border-radius:50%;background-color:#fff;box-shadow:0 %?2?% %?6?% rgba(0,0,0,.4);transition:-webkit-transform .35s cubic-bezier(.4,.4,.25,1.35);transition:transform .35s cubic-bezier(.4,.4,.25,1.35);transition:transform .35s cubic-bezier(.4,.4,.25,1.35),-webkit-transform .35s cubic-bezier(.4,.4,.25,1.35)}.weui-switch-on[data-v-eb8d2e58]{border-color:#6f6f6f}.weui-switch-on .bgview[data-v-eb8d2e58]{border-color:#1aad19}.weui-switch-on .spotview[data-v-eb8d2e58]{-webkit-transform:translateX(%?48?%);transform:translateX(%?48?%)}',""]),e.exports=t},"6d42":function(e,t,o){"use strict";o.r(t);var i=o("6ee6"),a=o("8f28");for(var n in a)["default"].indexOf(n)<0&&function(e){o.d(t,e,(function(){return a[e]}))}(n);var s=o("f0c5"),r=Object(s["a"])(a["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],void 0);t["default"]=r.exports},"6e41":function(e,t,o){"use strict";o.d(t,"b",(function(){return a})),o.d(t,"c",(function(){return n})),o.d(t,"a",(function(){return i}));var i={uniPopup:o("4e20").default,nsSwitch:o("e540").default},a=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("v-uni-view",[o("uni-popup",{ref:"choosePaymentPopup",attrs:{type:"center","mask-click":!1}},[o("v-uni-view",{staticClass:"choose-payment-popup popup",on:{touchmove:function(t){t.preventDefault(),t.stopPropagation(),arguments[0]=t=e.$handleEvent(t)}}},[o("v-uni-view",{staticClass:"popup-header"},[o("v-uni-text",{staticClass:"tit"},[e._v("支付方式")]),o("v-uni-text",{staticClass:"iconfont icon-close",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.close()}}})],1),o("v-uni-scroll-view",{staticClass:"popup-body",class:{"safe-area":e.isIphoneX},attrs:{"scroll-y":"true"}},[o("v-uni-view",{staticClass:"pay-money"},[o("v-uni-text",{staticClass:"money"},[e._v("支付金额"+e._s(e._f("moneyFormat")(e.payMoney))+"元")])],1),e.balanceDeduct>0&&1==e.balanceConfig&&e.sale?o("v-uni-view",{staticClass:"payment-item"},[o("v-uni-view",{staticClass:"iconfont icon-yue"}),o("v-uni-view",{staticClass:"info-wrap"},[o("v-uni-text",{staticClass:"name"},[e._v("余额抵扣")]),o("v-uni-view",{staticClass:"money"},[e._v("可用¥"+e._s(e.balanceDeduct))])],1),o("ns-switch",{staticClass:"balance-switch",attrs:{checked:1==e.isBalance},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.useBalance.apply(void 0,arguments)}}})],1):e._e(),e.payMoney>0?[e.payTypeList.length?e._l(e.payTypeList,(function(t,i){return o("v-uni-view",{key:i,staticClass:"payment-item",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.payIndex=i}}},[o("v-uni-view",{staticClass:"iconfont",class:t.icon}),o("v-uni-text",{staticClass:"name"},[e._v(e._s(t.name))]),o("v-uni-text",{staticClass:"iconfont",class:e.payIndex==i?"icon-yuan_checked color-base-text":"icon-checkboxblank"})],1)})):[o("v-uni-view",{staticClass:"empty"},[e._v("平台尚未配置支付方式！")])]]:e._e()],2),o("v-uni-view",{staticClass:"popup-footer",class:{"bottom-safe-area":e.isIphoneX}},[o("v-uni-view",{staticClass:"confirm-btn color-base-bg",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.confirm()}}},[e._v("确认支付")])],1)],1)],1)],1)},n=[]},"6ee6":function(e,t,o){"use strict";o.d(t,"b",(function(){return i})),o.d(t,"c",(function(){return a})),o.d(t,"a",(function(){}));var i=function(){var e=this.$createElement,t=this._self._c||e;return t("v-uni-view",{staticStyle:{display:"none"}},[this._t("default")],2)},a=[]},"802e":function(e,t,o){"use strict";var i=o("ce39"),a=o.n(i);a.a},"8b4f":function(e,t,o){"use strict";o("7a82"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i={name:"nsSwitch",props:{checked:{type:Boolean,default:!1}},methods:{change:function(){this.$emit("change")}}};t.default=i},"8b6b":function(e,t,o){"use strict";o.d(t,"b",(function(){return a})),o.d(t,"c",(function(){return n})),o.d(t,"a",(function(){return i}));var i={pageMeta:o("6d42").default,nsPayment:o("8c1e").default,loadingCover:o("ed27").default},a=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("v-uni-view",[o("page-meta",{attrs:{"page-style":e.themeColor}}),o("v-uni-view",{staticClass:"order-container",class:{"safe-area":e.isIphoneX}},[o("v-uni-view",{staticClass:"site-wrap"},[o("v-uni-view",{staticClass:"site-body"},[o("v-uni-view",{staticClass:"card-head"},[o("v-uni-image",{attrs:{src:e.$util.img("balance"==e.orderDetail.card_right_type?"public/uniapp/giftcard/order-icon-recharge.png":"public/uniapp/giftcard/order-icon-gift.png"),mode:"widthFix"}}),o("v-uni-text",[e._v(e._s("balance"==e.orderDetail.card_right_type?"储值卡":"礼品卡"))]),o("v-uni-view",{staticClass:"order-status"},[e._v(e._s(e.orderDetail.order_status_name))])],1),o("v-uni-view",{staticClass:"giftcard-wrap",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.toCardInfo()}}},[o("v-uni-view",{staticClass:"card-img"},[o("v-uni-image",{attrs:{src:e.orderDetail.card_cover?e.$util.img(e.orderDetail.card_cover):e.$util.img("public/uniapp/giftcard/default_card.png"),mode:"aspectFill"}})],1),o("v-uni-view",{staticClass:"goods-info"},[o("v-uni-view",{staticClass:"goods-name"},[e._v(e._s(e.orderDetail.order_name))]),o("v-uni-view",{staticClass:"goods-price price-font"},[e._v("￥"+e._s(e.orderDetail.goods_money))])],1)],1),o("v-uni-view",{staticClass:"order-content"},[o("v-uni-view",{staticClass:"content-item"},[o("v-uni-view",{staticClass:"label"},[e._v("订单号")]),o("v-uni-view",{staticClass:"value"},[e._v(e._s(e.orderDetail.order_no))])],1),o("v-uni-view",{staticClass:"content-item"},[o("v-uni-view",{staticClass:"label"},[e._v("下单时间")]),o("v-uni-view",{staticClass:"value"},[e._v(e._s(e.$util.timeStampTurnTime(e.orderDetail.create_time)))])],1),o("v-uni-view",{staticClass:"content-item"},[o("v-uni-view",{staticClass:"label"},[e._v("买家留言")]),o("v-uni-view",{staticClass:"value"},[e._v(e._s(e.orderDetail.buyer_message?e.orderDetail.buyer_message:"无"))])],1),o("v-uni-view",{staticClass:"content-item"},[o("v-uni-view",{staticClass:"label"},[e._v("购买数量")]),o("v-uni-view",{staticClass:"value"},[e._v(e._s(e.orderDetail.num))])],1),o("v-uni-view",{staticClass:"content-item"},[o("v-uni-view",{staticClass:"label"},[e._v("订单金额")]),o("v-uni-view",{staticClass:"value"},[e._v("￥"+e._s(e.orderDetail.order_money))])],1)],1),"topay"==e.orderDetail.order_status?o("v-uni-view",{staticClass:"button"},[o("v-uni-view",{staticClass:"button-left"},[o("v-uni-button",{attrs:{size:"mini"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.closeOrder(e.orderDetail.order_id)}}},[e._v("关闭订单")])],1),o("v-uni-view",{staticClass:"button-right"},[o("v-uni-button",{attrs:{size:"mini",type:"primary"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.openChoosePayment()}}},[e._v("立即支付")])],1)],1):e._e(),"complete"==e.orderDetail.order_status?o("v-uni-view",{staticClass:"button"},[o("v-uni-view",{staticClass:"button-right"},[o("v-uni-button",{attrs:{size:"mini",type:"primary"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.$util.redirectTo("/pages_promotion/giftcard/list",{order_id:e.orderDetail.order_id})}}},[e._v("查看卡包")])],1)],1):e._e()],1)],1),o("v-uni-view",{staticClass:"tab-bar-placeholder"}),o("ns-payment",{ref:"choosePaymentPopup",attrs:{payMoney:e.orderDetail.pay_money,isBalance:e.orderDetail&&e.orderDetail.giftcard_info&&"balance"!=e.orderDetail.giftcard_info.card_right_type?1:0},on:{confirm:function(t){arguments[0]=t=e.$handleEvent(t),e.gotoBuy()}}}),o("loading-cover",{ref:"loadingCover"})],1)],1)},n=[]},"8c1e":function(e,t,o){"use strict";o.r(t);var i=o("6e41"),a=o("17fd");for(var n in a)["default"].indexOf(n)<0&&function(e){o.d(t,e,(function(){return a[e]}))}(n);o("0548");var s=o("f0c5"),r=Object(s["a"])(a["default"],i["b"],i["c"],!1,null,"7ed6e92e",null,!1,i["a"],void 0);t["default"]=r.exports},"8f28":function(e,t,o){"use strict";o.r(t);var i=o("013c"),a=o.n(i);for(var n in i)["default"].indexOf(n)<0&&function(e){o.d(t,e,(function(){return i[e]}))}(n);t["default"]=a.a},"9d27":function(e,t,o){"use strict";o.r(t);var i=o("2413"),a=o.n(i);for(var n in i)["default"].indexOf(n)<0&&function(e){o.d(t,e,(function(){return i[e]}))}(n);t["default"]=a.a},bb7d:function(e,t,o){var i=o("24fb");t=i(!1),t.push([e.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.site-wrap[data-v-ceb3c5d6]{margin:0 %?24?% 0;border-radius:0;background:#fff;padding:%?30?% %?30?%;border-radius:%?16?%;padding:%?30?% 0 %?1?%}.site-wrap .site-body[data-v-ceb3c5d6]{margin:0 %?30?%}.order-container[data-v-ceb3c5d6]{padding-bottom:%?160?%;background-color:#fff;min-height:100vh;box-sizing:border-box}.order-container.safe-area[data-v-ceb3c5d6]{padding-bottom:%?188?%}.card-head[data-v-ceb3c5d6]{display:flex;align-items:center;margin-bottom:%?20?%;position:relative}.card-head uni-image[data-v-ceb3c5d6]{width:%?34?%;max-height:%?28?%;margin-right:%?10?%}.card-head uni-text[data-v-ceb3c5d6]{font-size:%?24?%;font-weight:700}.card-head .order-status[data-v-ceb3c5d6]{position:absolute;right:0;color:var(--giftcard-promotion-color)}.giftcard-wrap[data-v-ceb3c5d6]{display:flex;padding-bottom:%?30?%}.giftcard-wrap .card-img[data-v-ceb3c5d6]{width:%?270?%;height:%?164?%;max-height:%?164?%;border-radius:%?18?%;overflow:hidden}.giftcard-wrap .card-img uni-image[data-v-ceb3c5d6]{width:100%;height:100%}.giftcard-wrap .goods-info[data-v-ceb3c5d6]{display:flex;flex-direction:column;margin-left:%?30?%;width:calc(100% - %?300?%);height:%?164?%;position:relative}.giftcard-wrap .goods-info .goods-name[data-v-ceb3c5d6]{font-weight:700;font-size:%?30?%;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-height:1.5}.giftcard-wrap .goods-info .goods-price[data-v-ceb3c5d6]{position:absolute;color:var(--price-color);bottom:0;left:0;font-size:%?32?%}.goods-list[data-v-ceb3c5d6]{border-top:%?0?% solid #f0f0f0;padding:%?30?% 0;display:flex}.goods-list .goods-left[data-v-ceb3c5d6]{display:flex;width:calc(100% - %?108?%);overflow:hidden;white-space:nowrap;position:relative;align-items:center}.goods-list .goods-left uni-image[data-v-ceb3c5d6]{width:%?108?%;max-height:%?108?%;margin-right:%?22?%;flex-shrink:0;border-radius:%?16?%}.goods-list .goods-left[data-v-ceb3c5d6]:after{content:" ";box-shadow:%?-4?% 0 %?24?% rgba(0,0,0,.8);width:%?1?%;height:%?80?%;right:%?-1?%;top:%?14?%;position:absolute;background:hsla(0,0%,100%,0)}.goods-list .goods-more[data-v-ceb3c5d6]{width:%?108?%;height:%?108?%;display:flex;align-items:center;justify-content:center;font-size:%?26?%;position:relative}.goods-list .goods-more uni-text[data-v-ceb3c5d6]{font-size:%?28?%;line-height:1}.goods-list.goodsOpen[data-v-ceb3c5d6]{flex-direction:column;position:relative}.goods-list.goodsOpen .btn[data-v-ceb3c5d6]{position:absolute;right:%?20?%;top:%?50?%;font-size:%?26?%;display:flex;align-items:baseline}.goods-list.goodsOpen .btn uni-text[data-v-ceb3c5d6]{line-height:1.1;font-size:%?24?%;margin-left:%?8?%}.goods-list .goods-item[data-v-ceb3c5d6]{display:flex;margin-bottom:%?20?%}.goods-list .goods-item .goods-image[data-v-ceb3c5d6]{width:%?108?%;height:%?108?%;overflow:hidden;border-radius:%?18?%;margin-right:%?20?%}.goods-list .goods-item .goods-image uni-image[data-v-ceb3c5d6]{width:%?108?%;height:%?108?%;max-height:%?108?%}.goods-list .goods-item .goods-info[data-v-ceb3c5d6]{width:calc(100% - %?128?%)}.goods-list .goods-item .goods-info .goods-name[data-v-ceb3c5d6]{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;line-height:1.5;font-size:%?28?%}.goods-list .goods-item .goods-info .goods-num[data-v-ceb3c5d6]{margin-top:%?20?%}.goods-list .goods-item .goods-info .goods-num uni-text[data-v-ceb3c5d6]{color:#666;font-size:%?24?%}.goods-list .goods-item .goods-info .goods-num uni-text .num[data-v-ceb3c5d6]{margin-left:%?50?%}.order-content[data-v-ceb3c5d6]{padding:%?20?% 0;border-top:%?2?% solid #f0f0f0}.order-content .content-item[data-v-ceb3c5d6]{display:flex;justify-content:space-between;align-items:baseline;padding:%?10?% 0}.order-content .content-item .label[data-v-ceb3c5d6]{color:#888}.order-content .content-item .value[data-v-ceb3c5d6]{width:calc(100% - %?150?%);text-align:right}.button[data-v-ceb3c5d6]{background-color:#fff;position:fixed;bottom:0;left:0;padding:%?20?% %?30?% %?20?%;box-sizing:border-box;display:flex;align-items:center;flex-direction:column;justify-content:center;width:100%}.button .button-left[data-v-ceb3c5d6]{width:100%;margin-bottom:%?20?%}.button .button-left uni-button[data-v-ceb3c5d6]{background-color:#fff;border:%?2?% solid #979797;color:#666}.button .button-right[data-v-ceb3c5d6]{width:100%}.button .button-right uni-button[data-v-ceb3c5d6]{border:%?2?% solid var(--giftcard-promotion-color);color:#fff;background-color:var(--giftcard-promotion-color)}.button uni-button[data-v-ceb3c5d6]{height:%?80?%;border-radius:%?6?%;line-height:1;display:flex;align-items:center;justify-content:center}.tab-bar-placeholder[data-v-ceb3c5d6]{padding-bottom:calc(constant(safe-area-inset-bottom) + %?220?%);padding-bottom:calc(env(safe-area-inset-bottom) + %?220?%)}',""]),e.exports=t},c62f:function(e,t,o){"use strict";o.d(t,"b",(function(){return i})),o.d(t,"c",(function(){return a})),o.d(t,"a",(function(){}));var i=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("v-uni-view",[o("v-uni-view",{staticClass:"weui-switch",class:{"weui-switch-on":e.checked,"color-base-border":e.checked},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.change()}}},[o("v-uni-view",{staticClass:"bgview",class:{"color-base-bg":e.checked}}),o("v-uni-view",{staticClass:"spotview"})],1)],1)},a=[]},c678:function(e,t,o){var i=o("3093");i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var a=o("4f06").default;a("e6fdd328",i,!0,{sourceMap:!1,shadowMode:!1})},ce39:function(e,t,o){var i=o("bb7d");i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var a=o("4f06").default;a("67ec40a0",i,!0,{sourceMap:!1,shadowMode:!1})},e540:function(e,t,o){"use strict";o.r(t);var i=o("c62f"),a=o("53e9");for(var n in a)["default"].indexOf(n)<0&&function(e){o.d(t,e,(function(){return a[e]}))}(n);o("4399");var s=o("f0c5"),r=Object(s["a"])(a["default"],i["b"],i["c"],!1,null,"eb8d2e58",null,!1,i["a"],void 0);t["default"]=r.exports}}]);