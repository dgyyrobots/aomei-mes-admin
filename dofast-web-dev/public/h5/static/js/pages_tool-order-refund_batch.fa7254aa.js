(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages_tool-order-refund_batch"],{"0068":function(e,t,o){"use strict";o.r(t);var i=o("d20d"),n=o.n(i);for(var a in i)["default"].indexOf(a)<0&&function(e){o.d(t,e,(function(){return i[e]}))}(a);t["default"]=n.a},"013c":function(e,t,o){"use strict";o("7a82"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,o("c975"),o("a9e3"),o("ac1f"),o("5319"),o("acd8");var i={type:"scrolldone",target:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},currentTarget:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},detail:{}},n={props:{backgroundTextStyle:{type:String,default:"dark",validator:function(e){return-1!==["dark","light"].indexOf(e)}},backgroundColor:{type:String,default:"#ffffff"},backgroundColorTop:{type:String,default:"#ffffff"},backgroundColorBottom:{type:String,default:"#ffffff"},scrollTop:{type:String,default:""},scrollDuration:{type:Number,default:300},pageStyle:{type:String,default:""},enablePullDownRefresh:{type:[Boolean,String],default:!1},rootFontSize:{type:String,default:""}},created:function(){var e=this,t=getCurrentPages()[0];this.$pageVm=t.$vm||t,uni.onWindowResize((function(t){e.$emit("resize",t)})),this.$pageVm.$on("hook:onPageScroll",(function(t){e.$emit("scroll",t)})),this.$watch("backgroundTextStyle",(function(){e.setBackgroundTextStyle()})),this.$watch((function(){return[e.rootFontSize,e.pageStyle]}),(function(){e.setPageMeta()})),this.$watch((function(){return[e.backgroundColor,e.backgroundColorTop,e.backgroundColorBottom]}),(function(){e.setBackgroundColor()})),this.$watch((function(){return[e.scrollTop,e.scrollDuration]}),(function(){e.pageScrollTo()}))},beforeMount:function(){this.setBackgroundColor(),(this.rootFontSize||this.pageStyle)&&this.setPageMeta(),this.backgroundTextStyle&&this.setBackgroundTextStyle()},mounted:function(){this.scrollTop&&this.pageScrollTo()},methods:{setPullDownRefresh:function(e,t){e.setStyle({pullToRefresh:{support:t,style:"Android"===plus.os.name?"circle":"default"}})},setPageMeta:function(){uni.setPageMeta({pageStyle:this.pageStyle,rootFontSize:this.rootFontSize})},setBackgroundTextStyle:function(){},setBackgroundColor:function(){},pageScrollTo:function(){var e=this,t=String(this.scrollTop);if(-1!==t.indexOf("rpx")&&(t=uni.upx2px(t.replace("rpx",""))),t=parseFloat(t),!isNaN(t)){var o=function o(n){n.scrollTop===t&&(e.$pageVm.$off("hook:onPageScroll",o),e.$emit("scrolldone",i))};uni.pageScrollTo({scrollTop:t,duration:this.scrollDuration,success:function(){e.$pageVm.$on("hook:onPageScroll",o)}})}}}};t.default=n},"2d43":function(e,t,o){var i=o("24fb");t=i(!1),t.push([e.i,"[data-v-3581e736] .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box{background:none;max-height:unset!important;overflow-y:hidden!important}[data-v-3581e736] .uni-popup__wrapper{border-radius:%?20?% %?20?% 0 0}[data-v-3581e736] .uni-popup{z-index:8}.sub-btn[data-v-3581e736]{padding-top:%?20?%;background-color:#fff}",""]),e.exports=t},"2e88":function(e,t,o){"use strict";var i=o("bf5c"),n=o.n(i);n.a},"37c4":function(e,t,o){var i=o("b34b");i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var n=o("4f06").default;n("67577484",i,!0,{sourceMap:!1,shadowMode:!1})},"6d42":function(e,t,o){"use strict";o.r(t);var i=o("6ee6"),n=o("8f28");for(var a in n)["default"].indexOf(a)<0&&function(e){o.d(t,e,(function(){return n[e]}))}(a);var r=o("f0c5"),s=Object(r["a"])(n["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],void 0);t["default"]=s.exports},"6ee6":function(e,t,o){"use strict";o.d(t,"b",(function(){return i})),o.d(t,"c",(function(){return n})),o.d(t,"a",(function(){}));var i=function(){var e=this.$createElement,t=this._self._c||e;return t("v-uni-view",{staticStyle:{display:"none"}},[this._t("default")],2)},n=[]},"8cac":function(e,t,o){"use strict";o.r(t);var i=o("d697"),n=o("0068");for(var a in n)["default"].indexOf(a)<0&&function(e){o.d(t,e,(function(){return n[e]}))}(a);o("9c43"),o("2e88");var r=o("f0c5"),s=Object(r["a"])(n["default"],i["b"],i["c"],!1,null,"3581e736",null,!1,i["a"],void 0);t["default"]=s.exports},"8f28":function(e,t,o){"use strict";o.r(t);var i=o("013c"),n=o.n(i);for(var a in i)["default"].indexOf(a)<0&&function(e){o.d(t,e,(function(){return i[e]}))}(a);t["default"]=n.a},"9c43":function(e,t,o){"use strict";var i=o("37c4"),n=o.n(i);n.a},b34b:function(e,t,o){var i=o("24fb");t=i(!1),t.push([e.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.refund-container[data-v-3581e736]{width:100vw;height:100vh}.align-right[data-v-3581e736]{text-align:right}.goods-wrap[data-v-3581e736]{margin:%?20?% %?30?%;padding:%?30?%;border-radius:%?10?%;background:#fff;display:flex;position:relative}.goods-wrap .goods-img[data-v-3581e736]{width:%?180?%;height:%?180?%;margin-right:%?20?%;border-radius:%?10?%;overflow:hidden}.goods-wrap .goods-img uni-image[data-v-3581e736]{width:100%;height:100%}.goods-wrap .goods-info[data-v-3581e736]{flex:1;position:relative;max-width:calc(100% - %?200?%)}.goods-wrap .goods-info .goods-name[data-v-3581e736]{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;line-height:1.5;font-size:%?28?%}.refund-option[data-v-3581e736]{margin:%?20?% %?30?%;border-radius:%?10?%;background:#fff}.refund-option .option-item[data-v-3581e736]{padding:%?20?%;display:flex;position:relative}.refund-option .option-item uni-view[data-v-3581e736]{flex:1}.refund-option .option-item uni-view uni-text[data-v-3581e736]{display:block}.refund-option .option-item .icon-right[data-v-3581e736]{position:absolute;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);color:#ddd;right:%?20?%}.refund-option .option-item[data-v-3581e736]:last-of-type{border-top:%?2?% solid #f2f2f2}.refund-form[data-v-3581e736]{margin:%?20?% %?30?%;padding:%?20?%;border-radius:%?10?%;background:#fff}.refund-form .item-wrap[data-v-3581e736]{display:flex;position:relative;line-height:%?80?%}.refund-form .item-wrap .label[data-v-3581e736]{width:%?142?%;padding-right:%?5?%;line-height:%?80?%}.refund-form .item-wrap .cont[data-v-3581e736]{flex:1;line-height:%?80?%;text-align:right}.refund-form .item-wrap .cont .refund-desc[data-v-3581e736]{font-size:%?28?%;width:100%;line-height:1;min-height:%?80?%}.refund-form .item-wrap .cont.reason[data-v-3581e736]{padding-right:%?40?%}.refund-form .item-wrap .label.active[data-v-3581e736]{width:100%}.refund-form .item-wrap .icon-right[data-v-3581e736]{position:absolute;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);color:#ddd;right:0}.textarea-box[data-v-3581e736]{position:relative}.textarea-box .mark[data-v-3581e736]{width:100%;height:100%;position:absolute;left:0;bottom:0;background:red}.newText[data-v-3581e736]{width:100%;min-height:%?200?%;border-radius:%?10?%;box-sizing:border-box;margin-top:%?10?%}.sub-btn[data-v-3581e736]{position:fixed;width:100%;height:%?100?%;line-height:%?100?%;text-align:center;color:#fff;bottom:0}.sub-btn.safe-area[data-v-3581e736]{margin-bottom:%?48?%!important}.popup[data-v-3581e736]{width:100vw;background:#fff;border-top-left-radius:%?24?%;border-top-right-radius:%?24?%}.popup .popup-header[data-v-3581e736]{height:%?90?%;display:flex;align-items:center;padding:0 %?30?%}.popup .popup-header > uni-view[data-v-3581e736]{flex:1;line-height:1}.popup .popup-header .tit[data-v-3581e736]{font-size:%?32?%;font-weight:600}.popup .popup-header .vice-tit[data-v-3581e736]{margin-right:%?20?%}.popup .popup-footer[data-v-3581e736]{height:%?140?%}.popup .popup-footer .confirm-btn[data-v-3581e736]{height:%?80?%;line-height:%?80?%;color:#fff;text-align:center;margin:%?20?%;border-radius:%?10?%}.popup .popup-footer .confirm-btn.color-base-bg[data-v-3581e736]{color:var(--btn-text-color)}.popup .popup-footer.bottom-safe-area[data-v-3581e736]{padding-bottom:%?48?%}.refund-reason-popup[data-v-3581e736]{height:50vh;display:flex;flex-direction:column}.refund-reason-popup .icon-close[data-v-3581e736]{font-size:%?40?%}.refund-reason-popup .popup-body[data-v-3581e736]{flex:1}.refund-reason-popup .popup-body .scroll-view[data-v-3581e736]{height:100%}.refund-reason-popup .popup-body .item[data-v-3581e736]{display:flex;padding:0 %?30?%;position:relative;height:%?70?%;line-height:%?70?%}.refund-reason-popup .popup-body .item .reason[data-v-3581e736]{flex:1;height:%?70?%;line-height:%?70?%}.refund-reason-popup .popup-body .item > .iconfont[data-v-3581e736]{font-size:%?40?%;position:absolute;top:50%;right:%?30?%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.refund-reason-popup .popup-body .item > .icon-yuan_checkbox[data-v-3581e736]{color:#909399}',""]),e.exports=t},bf5c:function(e,t,o){var i=o("2d43");i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var n=o("4f06").default;n("7819491c",i,!0,{sourceMap:!1,shadowMode:!1})},d20d:function(e,t,o){"use strict";(function(e){o("7a82");var i=o("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=i(o("4e20")),a={components:{uniPopup:n.default},data:function(){return{order_goods_id:"",refund_type:"",refund_reason:"",refund_remark:"",isIphoneX:!1,refund_data:{refund_type:[],order_goods_info:{sku_image:""}},isSub:!1,showText:!1}},onLoad:function(e){e.order_goods_id&&(this.order_goods_id=e.order_goods_id),e.refund_type&&(this.refund_type=e.refund_type)},onShow:function(){this.isIphoneX=this.$util.uniappIsIPhoneX(),uni.getStorageSync("token")?this.getRefundData():this.$util.redirectTo("/pages_tool/login/login",{back:"/pages_tool/order/refund?order_goods_id="+this.order_goods_id})},methods:{openPopup:function(e){this.$refs[e].open()},closePopup:function(e){this.$refs[e].close()},textBlur:function(){uni.pageScrollTo({scrollTop:0,duration:0})},selectRefundType:function(e){this.refund_type=e},getRefundData:function(){var e=this;this.$api.sendRequest({url:"/api/orderrefund/refundDataBatch",data:{order_goods_ids:this.order_goods_id},success:function(t){t.code>=0?(e.refund_data=t.data,e.$refs.loadingCover&&e.$refs.loadingCover.hide()):(e.$util.showToast({title:"未获取到该订单项退款信息"}),setTimeout((function(){e.$util.redirectTo("/pages/order/list")}),1e3))},fail:function(t){e.$refs.loadingCover&&e.$refs.loadingCover.hide()}})},submit:function(){var e=this;if(this.verify()){if(this.isSub)return;this.isSub=!0,this.$api.sendRequest({url:"/api/orderrefund/refund",data:{order_goods_ids:this.order_goods_id,refund_type:this.refund_type,refund_reason:this.refund_reason,refund_remark:this.refund_remark},success:function(t){e.$util.showToast({title:t.message}),t.code>=0?uni.removeStorage({key:"refund_goods_data",success:function(t){e.$util.redirectTo("/pages_tool/order/activist")}}):e.isSub=!1},fail:function(t){e.isSub=!1}})}},verify:function(){return""!=this.refund_reason||(this.$util.showToast({title:"请选择退款原因"}),!1)},changeReason:function(e){this.refund_reason=e},change:function(e){e&&(this.showText=e.show)},subscribeMessage:function(t){this.$api.sendRequest({url:"/weapp/api/weapp/messagetmplids",data:{keywords:"ORDER_REFUND_AGREE,ORDER_REFUND_REFUSE"},success:function(o){0==o.code&&o.data.length?uni.requestSubscribeMessage({tmplIds:o.data,fail:function(t){e("log","fail",t," at pages_tool/order/refund_batch.vue:258")},complete:function(){t()}}):t()},fail:function(e){t()}})}}};t.default=a}).call(this,o("0de9")["log"])},d697:function(e,t,o){"use strict";o.d(t,"b",(function(){return n})),o.d(t,"c",(function(){return a})),o.d(t,"a",(function(){return i}));var i={pageMeta:o("6d42").default,uniPopup:o("4e20").default,loadingCover:o("ed27").default},n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("v-uni-view",[o("page-meta",{attrs:{"page-style":e.themeColor}}),o("v-uni-view",[o("v-uni-view",[o("v-uni-scroll-view",{staticClass:"refund-container",attrs:{"scroll-y":"true"}},[e._l(e.refund_data.order_goods_info,(function(t,i){return o("v-uni-view",{key:i,staticClass:"goods-wrap"},[o("v-uni-view",{staticClass:"goods-img"},[o("v-uni-image",{attrs:{src:e.$util.img(t.sku_image,{size:"mid"}),mode:"aspectFill","lazy-load":!0},on:{error:function(o){arguments[0]=o=e.$handleEvent(o),t.sku_image=e.$util.getDefaultImage().goods}}})],1),o("v-uni-view",{staticClass:"goods-info"},[o("v-uni-view",{staticClass:"goods-name"},[e._v(e._s(t.sku_name))])],1)],1)})),o("v-uni-view",[o("v-uni-view",{staticClass:"refund-form"},[o("v-uni-view",{staticClass:"item-wrap",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.openPopup("refundReasonPopup")}}},[o("v-uni-view",{staticClass:"label"},[e._v("退款原因：")]),o("v-uni-view",{staticClass:"cont reason"},[e.refund_reason.length?o("v-uni-text",{staticClass:"color-tip"},[e._v(e._s(e.refund_reason))]):o("v-uni-text",{staticClass:"color-tip"},[e._v("请选择")])],1),o("v-uni-text",{staticClass:"iconfont icon-right"})],1),o("v-uni-view",{staticClass:"item-wrap"},[o("v-uni-view",{staticClass:"label"},[e._v("退款方式：")]),1==e.refund_type?o("v-uni-view",{staticClass:"cont color-base-text"},[e._v("退款无需退货")]):o("v-uni-view",{staticClass:"cont color-base-text"},[e._v("退货退款")])],1),o("v-uni-view",{staticClass:"item-wrap"},[o("v-uni-view",{staticClass:"label"},[e._v("退款金额：")]),o("v-uni-view",{staticClass:"cont color-base-text"},[e._v(e._s(e.$lang("common.currencySymbol"))+e._s(e.refund_data.refund_money))])],1)],1),o("v-uni-view",{staticClass:"refund-form"},[o("v-uni-view",{staticClass:"item-wrap"},[o("v-uni-view",{staticClass:"label active"},[e._v("退款说明")])],1),o("v-uni-textarea",{staticClass:"newText",attrs:{placeholder:"请输入退款说明(选填)","placeholder-class":"color-tip font-size-tag","auto-height":!0},on:{blur:function(t){arguments[0]=t=e.$handleEvent(t),e.textBlur()}},model:{value:e.refund_remark,callback:function(t){e.refund_remark=t},expression:"refund_remark"}})],1),o("v-uni-view",{staticClass:"sub-btn",class:{"safe-area":e.isIphoneX},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.submit.apply(void 0,arguments)}}},[o("v-uni-button",{attrs:{type:"primary"}},[e._v(e._s(e.$lang("common.submit")))])],1)],1),o("uni-popup",{ref:"refundReasonPopup",attrs:{type:"bottom"},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.change()}}},[o("v-uni-view",{staticClass:"refund-reason-popup popup"},[o("v-uni-view",{staticClass:"popup-header"},[o("v-uni-view",[o("v-uni-text",{staticClass:"tit"},[e._v("退款原因")])],1),o("v-uni-view",{staticClass:"align-right",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.closePopup("refundReasonPopup")}}},[o("v-uni-text",{staticClass:"iconfont icon-close"})],1)],1),o("v-uni-view",{staticClass:"popup-body"},[o("v-uni-scroll-view",{staticClass:"scroll-view",class:{"safe-area":e.isIphoneX},attrs:{"scroll-y":"true"}},[o("v-uni-view",{staticClass:"reason-list"},e._l(e.refund_data.refund_reason_type,(function(t,i){return o("v-uni-view",{key:i,staticClass:"item",on:{click:function(o){arguments[0]=o=e.$handleEvent(o),e.changeReason(t)}}},[o("v-uni-view",{staticClass:"reason"},[e._v(e._s(t))]),o("v-uni-view",{staticClass:"iconfont",class:e.refund_reason==t?"icon-yuan_checked color-base-text":"icon-yuan_checkbox"})],1)})),1)],1)],1),o("v-uni-view",{staticClass:"popup-footer",class:{"bottom-safe-area":e.isIphoneX}},[o("v-uni-view",{staticClass:"confirm-btn color-base-bg",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.closePopup("refundReasonPopup")}}},[e._v("确定")])],1)],1)],1)],2),o("loading-cover",{ref:"loadingCover"})],1)],1)],1)},a=[]}}]);