(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages_promotion-giftcard-use_select"],{"013c":function(t,e,i){"use strict";i("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("c975"),i("a9e3"),i("ac1f"),i("5319"),i("acd8");var o={type:"scrolldone",target:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},currentTarget:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},detail:{}},n={props:{backgroundTextStyle:{type:String,default:"dark",validator:function(t){return-1!==["dark","light"].indexOf(t)}},backgroundColor:{type:String,default:"#ffffff"},backgroundColorTop:{type:String,default:"#ffffff"},backgroundColorBottom:{type:String,default:"#ffffff"},scrollTop:{type:String,default:""},scrollDuration:{type:Number,default:300},pageStyle:{type:String,default:""},enablePullDownRefresh:{type:[Boolean,String],default:!1},rootFontSize:{type:String,default:""}},created:function(){var t=this,e=getCurrentPages()[0];this.$pageVm=e.$vm||e,uni.onWindowResize((function(e){t.$emit("resize",e)})),this.$pageVm.$on("hook:onPageScroll",(function(e){t.$emit("scroll",e)})),this.$watch("backgroundTextStyle",(function(){t.setBackgroundTextStyle()})),this.$watch((function(){return[t.rootFontSize,t.pageStyle]}),(function(){t.setPageMeta()})),this.$watch((function(){return[t.backgroundColor,t.backgroundColorTop,t.backgroundColorBottom]}),(function(){t.setBackgroundColor()})),this.$watch((function(){return[t.scrollTop,t.scrollDuration]}),(function(){t.pageScrollTo()}))},beforeMount:function(){this.setBackgroundColor(),(this.rootFontSize||this.pageStyle)&&this.setPageMeta(),this.backgroundTextStyle&&this.setBackgroundTextStyle()},mounted:function(){this.scrollTop&&this.pageScrollTo()},methods:{setPullDownRefresh:function(t,e){t.setStyle({pullToRefresh:{support:e,style:"Android"===plus.os.name?"circle":"default"}})},setPageMeta:function(){uni.setPageMeta({pageStyle:this.pageStyle,rootFontSize:this.rootFontSize})},setBackgroundTextStyle:function(){},setBackgroundColor:function(){},pageScrollTo:function(){var t=this,e=String(this.scrollTop);if(-1!==e.indexOf("rpx")&&(e=uni.upx2px(e.replace("rpx",""))),e=parseFloat(e),!isNaN(e)){var i=function i(n){n.scrollTop===e&&(t.$pageVm.$off("hook:onPageScroll",i),t.$emit("scrolldone",o))};uni.pageScrollTo({scrollTop:e,duration:this.scrollDuration,success:function(){t.$pageVm.$on("hook:onPageScroll",i)}})}}}};e.default=n},"0c2b":function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return a})),i.d(e,"a",(function(){return o}));var o={pageMeta:i("6d42").default,uniNumberBox:i("533b").default,loadingCover:i("ed27").default,nsLogin:i("3423").default},n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",[i("page-meta",{attrs:{"page-style":t.themeColor}}),i("v-uni-view",{staticClass:"page"},["goods"==t.cardInfo.card_right_type?i("v-uni-view",{staticClass:"goods-list"},["item"==t.cardInfo.card_right_goods_type?i("v-uni-view",{staticClass:"goods-title"},[t._v("本礼品卡包含以下商品")]):t._e(),"all"==t.cardInfo.card_right_goods_type?i("v-uni-view",{staticClass:"goods-title"},[t._v("请在以下商品中任选"+t._s(t.cardInfo.card_right_goods_count)+"件")]):t._e(),t._l(t.cardInfo.card_goods_list,(function(e,o){return i("v-uni-view",{key:o,staticClass:"goods-item"},[i("v-uni-view",{staticClass:"goods-image"},[i("v-uni-image",{attrs:{src:t.$util.img(e.sku_image),mode:"widthFix"},on:{error:function(e){arguments[0]=e=t.$handleEvent(e),t.imageError(o)}}})],1),i("v-uni-view",{staticClass:"goods-info"},[i("v-uni-view",{staticClass:"goods-name"},[t._v(t._s(e.sku_name))]),i("v-uni-view",{staticClass:"goods-num"},[i("v-uni-text",{}),"to_use"==t.cardInfo.status?["item"==t.cardInfo.card_right_goods_type?i("v-uni-text",{},[t._v("x "+t._s(e.total_num))]):i("v-uni-view",[i("uni-number-box",{attrs:{min:t.min,max:t.max,value:e.total_num,size:"small"},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.cartNumChange(e,o)}}})],1)]:t._e()],2)],1)],1)}))],2):t._e()],1),i("v-uni-view",{staticClass:"tab-bar-placeholder"}),"to_use"==t.cardInfo.status?i("v-uni-view",{staticClass:"btn"},[i("v-uni-button",{staticClass:"use-btn",attrs:{type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.toUse()}}},[t._v("确定")])],1):t._e(),i("loading-cover",{ref:"loadingCover"}),i("ns-login",{ref:"login"})],1)},a=[]},"1a33":function(t,e,i){"use strict";i.r(e);var o=i("c2e0"),n=i.n(o);for(var a in o)["default"].indexOf(a)<0&&function(t){i.d(e,t,(function(){return o[t]}))}(a);e["default"]=n.a},"309e":function(t,e,i){var o=i("432c");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var n=i("4f06").default;n("c9f7c064",o,!0,{sourceMap:!1,shadowMode:!1})},"38b1":function(t,e,i){"use strict";i.d(e,"b",(function(){return o})),i.d(e,"c",(function(){return n})),i.d(e,"a",(function(){}));var o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"uni-numbox",class:{small:"small"==t.size}},[i("v-uni-button",{staticClass:"decrease",class:{disabled:t.inputValue<=t.min||t.disabled,small:"small"==t.size},attrs:{type:"default"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t._calcValue("minus")}}},[t._v("-")]),i("v-uni-input",{staticClass:"uni-input uni-numbox__value",class:{small:"small"==t.size},attrs:{disabled:t.disabled||t.inputDisabled,type:"number"},on:{blur:function(e){arguments[0]=e=t.$handleEvent(e),t._onInput.apply(void 0,arguments)}},model:{value:t.inputValue,callback:function(e){t.inputValue=e},expression:"inputValue"}}),i("v-uni-button",{staticClass:"increase",class:{disabled:t.inputValue>=t.max||t.disabled,small:"small"==t.size},attrs:{type:"default"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t._calcValue("plus")}}},[t._v("+")])],1)},n=[]},4136:function(t,e,i){var o=i("24fb");e=o(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.uni-numbox[data-v-4c246f0d]{display:inline-flex;flex-direction:row;justify-content:flex-start;align-items:center;height:%?70?%;position:relative}.uni-numbox.small[data-v-4c246f0d]{height:%?44?%}.uni-numbox[data-v-4c246f0d]:after{content:"";position:absolute;-webkit-transform-origin:center;transform-origin:center;box-sizing:border-box;pointer-events:none;top:-50%;left:-50%;right:-50%;bottom:-50%;border-radius:%?12?%;-webkit-transform:scale(.5);transform:scale(.5)}.uni-numbox__minus[data-v-4c246f0d],\n.uni-numbox__plus[data-v-4c246f0d]{width:%?40?%;height:%?40?%;border-radius:50%;background-size:100% 100%;background-position:50%}.uni-numbox__value[data-v-4c246f0d]{position:relative;background-color:#f8f8f8;width:%?80?%;height:%?40?%;text-align:center;border:1px solid #eee;display:inline-block;line-height:%?36?%;font-weight:700;margin:0;padding:0;vertical-align:top;min-height:0;border-left:none;border-right:none}.uni-numbox__value.small[data-v-4c246f0d]{width:%?60?%;font-size:%?24?%}.uni-numbox__value[data-v-4c246f0d]:after{content:"";position:absolute;-webkit-transform-origin:center;transform-origin:center;box-sizing:border-box;pointer-events:none;top:-50%;left:-50%;right:-50%;bottom:-50%;border-top-width:0;border-bottom-width:0;-webkit-transform:scale(.5);transform:scale(.5)}.uni-numbox--disabled[data-v-4c246f0d]{color:silver}.uni-numbox uni-button[data-v-4c246f0d]{width:%?40?%;height:%?40?%;display:inline-block;box-sizing:initial;border:1px solid #eee;padding:0;margin:0;border-radius:0;background-color:#fff;font-weight:700}.uni-numbox uni-button.disabled[data-v-4c246f0d]{color:#eee;background-color:#f8f8f8!important}.uni-numbox uni-button.decrease[data-v-4c246f0d]{font-size:%?44?%;line-height:%?32?%}.uni-numbox uni-button.increase[data-v-4c246f0d]{font-size:%?32?%;line-height:%?36?%}',""]),t.exports=e},"432c":function(t,e,i){var o=i("24fb");e=o(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.page[data-v-73e7629d]{background:#f6f9ff;min-height:100vh;padding:%?30?%}.goods-list[data-v-73e7629d]{background-color:#fff;padding:%?20?% %?24?%;border-radius:%?18?%;margin-bottom:%?20?%}.goods-list .goods-title[data-v-73e7629d]{text-align:center;width:100%;padding:%?10?% 0;margin-bottom:%?20?%;font-weight:700}.goods-item[data-v-73e7629d]{display:flex;margin-bottom:%?20?%;background:#fbf9fc;padding:%?20?%;border-radius:%?12?%}.goods-item .goods-image[data-v-73e7629d]{width:%?160?%;height:%?160?%;overflow:hidden;border-radius:%?18?%;margin-right:%?20?%}.goods-item .goods-image uni-image[data-v-73e7629d]{width:%?160?%;height:%?160?%;max-height:%?160?%}.goods-item .goods-info[data-v-73e7629d]{width:calc(100% - %?180?%)}.goods-item .goods-info .goods-name[data-v-73e7629d]{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-height:1.5;font-size:%?28?%;font-weight:700;height:%?84?%}.goods-item .goods-info .goods-num[data-v-73e7629d]{display:flex;flex-direction:row;align-items:center;justify-content:space-between;margin-top:%?20?%}.goods-item .goods-info .goods-num uni-text[data-v-73e7629d]{color:#666;font-size:%?24?%}.goods-item .goods-info .goods-num uni-text[data-v-73e7629d]:last-child{color:#333;margin-top:%?35?%;font-weight:700}.btn[data-v-73e7629d]{display:flex;align-items:center;width:100%;justify-content:center;margin-top:%?40?%;position:fixed;bottom:0;left:0;background-color:#fff;padding:%?20?% %?30?%;box-sizing:border-box;padding-bottom:calc(constant(safe-area-inset-bottom) + %?20?%);padding-bottom:calc(env(safe-area-inset-bottom) + %?20?%);z-index:10}.btn uni-button[data-v-73e7629d]{width:100%;margin:0}.btn uni-button[data-v-73e7629d]:nth-child(2){margin-left:%?20?%}.btn .give-btn[data-v-73e7629d]{background-color:var(--giftcard-promotion-aux-color);color:#fff}.btn .use-btn[data-v-73e7629d]{background-color:var(--giftcard-promotion-color)}.tab-bar-placeholder[data-v-73e7629d]{padding-bottom:%?120?%;padding-bottom:calc(constant(safe-area-inset-bottom) + %?120?%);padding-bottom:calc(env(safe-area-inset-bottom) + %?120?%)}',""]),t.exports=e},"533b":function(t,e,i){"use strict";i.r(e);var o=i("38b1"),n=i("1a33");for(var a in n)["default"].indexOf(a)<0&&function(t){i.d(e,t,(function(){return n[t]}))}(a);i("e345");var s=i("f0c5"),r=Object(s["a"])(n["default"],o["b"],o["c"],!1,null,"4c246f0d",null,!1,o["a"],void 0);e["default"]=r.exports},"6d42":function(t,e,i){"use strict";i.r(e);var o=i("6ee6"),n=i("8f28");for(var a in n)["default"].indexOf(a)<0&&function(t){i.d(e,t,(function(){return n[t]}))}(a);var s=i("f0c5"),r=Object(s["a"])(n["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],void 0);e["default"]=r.exports},"6ee6":function(t,e,i){"use strict";i.d(e,"b",(function(){return o})),i.d(e,"c",(function(){return n})),i.d(e,"a",(function(){}));var o=function(){var t=this.$createElement,e=this._self._c||t;return e("v-uni-view",{staticStyle:{display:"none"}},[this._t("default")],2)},n=[]},"8f28":function(t,e,i){"use strict";i.r(e);var o=i("013c"),n=i.n(o);for(var a in o)["default"].indexOf(a)<0&&function(t){i.d(e,t,(function(){return o[t]}))}(a);e["default"]=n.a},9717:function(t,e,i){"use strict";i.r(e);var o=i("0c2b"),n=i("a132");for(var a in n)["default"].indexOf(a)<0&&function(t){i.d(e,t,(function(){return n[t]}))}(a);i("b0d3");var s=i("f0c5"),r=Object(s["a"])(n["default"],o["b"],o["c"],!1,null,"73e7629d",null,!1,o["a"],void 0);e["default"]=r.exports},a132:function(t,e,i){"use strict";i.r(e);var o=i("e3e2"),n=i.n(o);for(var a in o)["default"].indexOf(a)<0&&function(t){i.d(e,t,(function(){return o[t]}))}(a);e["default"]=n.a},b0d3:function(t,e,i){"use strict";var o=i("309e"),n=i.n(o);n.a},c2e0:function(t,e,i){"use strict";i("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("a9e3");var o={name:"UniNumberBox",props:{value:{type:[Number,String],default:1},min:{type:Number,default:0},max:{type:Number,default:100},step:{type:Number,default:1},disabled:{type:Boolean,default:!1},inputDisabled:{type:Boolean,default:!1},modifyFlag:{type:Boolean,default:!1},size:{type:String,default:"default"},index:{type:Number,default:-1}},data:function(){return{inputValue:0}},watch:{value:function(t){this.inputValue=+t},inputValue:function(t,e,i){+t===+e||this.modifyFlag||this.$emit("change",t,i)}},created:function(){this.inputValue=+this.value},methods:{_calcValue:function(t){if(!this.disabled&&!this.modifyFlag){var e=this._getDecimalScale(),i=this.inputValue*e,o=this.step*e;"minus"===t?i-=o:"plus"===t&&(i+=o),i<this.min&&"minus"===t||i>this.max&&"plus"===t?this.$emit("limit",{value:this.inputValue,type:t},this.index):this.inputValue=i/e}},_getDecimalScale:function(){var t=1;return~~this.step!==this.step&&(t=Math.pow(10,(this.step+"").split(".")[1].length)),t},_onInput:function(t){var e=this;setTimeout((function(){var i=t.detail.value;i=+i,i>e.max?(i=e.max,e.$util.showToast({title:"商品库存不足"})):i<e.min&&(e.$util.showToast({title:"商品最少购买"+e.min+"件"}),i=e.min),i||(i=1),e.inputValue=i,e.$forceUpdate()}),0)}}};e.default=o},e345:function(t,e,i){"use strict";var o=i("eae1"),n=i.n(o);n.a},e3e2:function(t,e,i){"use strict";i("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("d3b7"),i("159b"),i("c975"),i("b64b"),i("14d9"),i("e9c4");var o={components:{},data:function(){return{memberCardId:0,cardInfo:[],btnSwitch:!1,shopInfo:null,min:0,goodsList:[],max:0}},computed:{},onLoad:function(t){var e=this;if(t.member_card_id&&(this.memberCardId=t.member_card_id),t.scene){var i=decodeURIComponent(t.scene);i=i.split("&"),i.length&&i.forEach((function(t){-1!=t.indexOf("member_card_id")&&(e.memberCardId=t.split("-")[1])}))}uni.getStorageSync("shop_info")&&(this.shopInfo=JSON.parse(uni.getStorageSync("shop_info")))},onShow:function(){this.getData()},methods:{getData:function(){var t=this;this.$api.sendRequest({url:"/giftcard/api/membercard/detail",data:{member_card_id:this.memberCardId},success:function(e){e.code>=0&&e.data?(t.cardInfo=e.data,t.max=t.cardInfo.card_right_goods_count,t.$refs.loadingCover&&t.$refs.loadingCover.hide()):(t.$util.showToast({title:e.message,mask:!0,duration:2e3}),setTimeout((function(){t.$util.redirectTo("/pages_promotion/giftcard/not_exist")}),1500))},fail:function(e){t.$refs.loadingCover&&t.$refs.loadingCover.hide()}})},cartNumChange:function(t,e){this.cardInfo.card_goods_list[e]["total_num"]=t,this.getGoodsList()},getGoodsList:function(){var t=this,e=0;this.goodsList=[],Object.keys(this.cardInfo.card_goods_list).forEach((function(i){var o=t.cardInfo.card_goods_list[i];o.total_num>0&&(t.goodsList.push({sku_id:o.sku_id,num:o.total_num}),e+=o.total_num)})),e-this.cardInfo.card_right_goods_count<=0?this.max=0:this.max=this.cardInfo.card_right_goods_count},toUse:function(){var t=this;if("balance"==this.cardInfo.card_right_type)this.balanceUse();else{if(this.btnSwitch)return!1;var e={member_card_id:this.memberCardId};if("all"==this.cardInfo.card_right_goods_type){if(0==this.goodsList.length)return this.$util.showToast({title:"请选择商品"}),!1;if(this.max>0)return this.$util.showToast({title:"请选择"+this.cardInfo.card_right_goods_count+"件商品"}),!1;e.goods_sku_list=JSON.stringify(this.goodsList)}this.btnSwitch=!0,uni.setStorage({key:"giftcarduse",data:e,success:function(){t.$util.redirectTo("/pages_promotion/giftcard/card_use"),t.btnSwitch=!1}})}},balanceUse:function(){var t=this;uni.showModal({title:"提示",content:"您确定要使用该储值卡吗？",success:function(e){e.confirm&&t.$api.sendRequest({url:"/giftcard/api/carduse/balanceuse",data:{member_card_id:t.memberCardId},success:function(e){e.code>=0&&t.getData(),t.$util.showToast({title:e.message})}})}})}}};e.default=o},eae1:function(t,e,i){var o=i("4136");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var n=i("4f06").default;n("3cb307b8",o,!0,{sourceMap:!1,shadowMode:!1})}}]);