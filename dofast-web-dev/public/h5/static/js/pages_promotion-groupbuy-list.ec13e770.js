(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages_promotion-groupbuy-list"],{"013c":function(t,e,i){"use strict";i("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("c975"),i("a9e3"),i("ac1f"),i("5319"),i("acd8");var o={type:"scrolldone",target:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},currentTarget:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},detail:{}},a={props:{backgroundTextStyle:{type:String,default:"dark",validator:function(t){return-1!==["dark","light"].indexOf(t)}},backgroundColor:{type:String,default:"#ffffff"},backgroundColorTop:{type:String,default:"#ffffff"},backgroundColorBottom:{type:String,default:"#ffffff"},scrollTop:{type:String,default:""},scrollDuration:{type:Number,default:300},pageStyle:{type:String,default:""},enablePullDownRefresh:{type:[Boolean,String],default:!1},rootFontSize:{type:String,default:""}},created:function(){var t=this,e=getCurrentPages()[0];this.$pageVm=e.$vm||e,uni.onWindowResize((function(e){t.$emit("resize",e)})),this.$pageVm.$on("hook:onPageScroll",(function(e){t.$emit("scroll",e)})),this.$watch("backgroundTextStyle",(function(){t.setBackgroundTextStyle()})),this.$watch((function(){return[t.rootFontSize,t.pageStyle]}),(function(){t.setPageMeta()})),this.$watch((function(){return[t.backgroundColor,t.backgroundColorTop,t.backgroundColorBottom]}),(function(){t.setBackgroundColor()})),this.$watch((function(){return[t.scrollTop,t.scrollDuration]}),(function(){t.pageScrollTo()}))},beforeMount:function(){this.setBackgroundColor(),(this.rootFontSize||this.pageStyle)&&this.setPageMeta(),this.backgroundTextStyle&&this.setBackgroundTextStyle()},mounted:function(){this.scrollTop&&this.pageScrollTo()},methods:{setPullDownRefresh:function(t,e){t.setStyle({pullToRefresh:{support:e,style:"Android"===plus.os.name?"circle":"default"}})},setPageMeta:function(){uni.setPageMeta({pageStyle:this.pageStyle,rootFontSize:this.rootFontSize})},setBackgroundTextStyle:function(){},setBackgroundColor:function(){},pageScrollTo:function(){var t=this,e=String(this.scrollTop);if(-1!==e.indexOf("rpx")&&(e=uni.upx2px(e.replace("rpx",""))),e=parseFloat(e),!isNaN(e)){var i=function i(a){a.scrollTop===e&&(t.$pageVm.$off("hook:onPageScroll",i),t.$emit("scrolldone",o))};uni.pageScrollTo({scrollTop:e,duration:this.scrollDuration,success:function(){t.$pageVm.$on("hook:onPageScroll",i)}})}}}};e.default=a},"086f":function(t,e,i){"use strict";var o=i("7ea0"),a=i.n(o);a.a},"1fba":function(t,e,i){"use strict";var o=i("5851"),a=i.n(o);a.a},"1fcc":function(t,e,i){"use strict";i("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o={name:"UniTag",props:{type:{type:String,default:"default"},size:{type:String,default:"normal"},text:{type:String,default:""},disabled:{type:[String,Boolean],defalut:!1},inverted:{type:[String,Boolean],defalut:!1},circle:{type:[String,Boolean],defalut:!1},mark:{type:[String,Boolean],defalut:!1}},methods:{onClick:function(){!0!==this.disabled&&"true"!==this.disabled&&this.$emit("click")}}};e.default=o},"21c2":function(t,e,i){"use strict";i.d(e,"b",(function(){return o})),i.d(e,"c",(function(){return a})),i.d(e,"a",(function(){}));var o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.advList.length?i("v-uni-view",{class:["container-box",t.className]},[t.advList.length>1?i("v-uni-swiper",{staticClass:"item-wrap",style:{height:t.swiperHeight+"px"},attrs:{"indicator-dots":t.advList.length>1,"indicator-active-color":"#ffffff",autoplay:!0,interval:3e3,duration:1e3,current:t.currentIndex},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.changeSwiper.apply(void 0,arguments)}}},t._l(t.advList,(function(e,o){return i("v-uni-swiper-item",{key:o,on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.jumppage(e.adv_url)}}},[i("v-uni-view",{staticClass:"image-box"},[i("v-uni-image",{attrs:{src:t.$util.img(e.adv_image),mode:"widthFix",id:"content-wrap"+o}})],1)],1)})),1):i("v-uni-view",{staticClass:"container-box item-wrap"},[i("v-uni-image",{attrs:{src:t.$util.img(t.advList[0]["adv_image"]),mode:"widthFix","lazy-load":"true"},on:{load:function(e){arguments[0]=e=t.$handleEvent(e),t.imageLoad.apply(void 0,arguments)},click:function(e){arguments[0]=e=t.$handleEvent(e),t.jumppage(t.advList[0].adv_url)}}})],1)],1):t._e()},a=[]},"2d2f":function(t,e,i){"use strict";i("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("ac1f");var o={name:"ns-advert",props:{keyword:{type:String},className:{type:String}},data:function(){return{advList:[],isImage:!1,swiperHeight:150,currentIndex:0}},created:function(){this.getAdvList()},methods:{getAdvList:function(){var t=this;this.$api.sendRequest({url:"/api/adv/detail",data:{keyword:this.keyword},success:function(e){if(0==e.code){var i=e.data.adv_list;for(var o in i)i[o].adv_url&&(i[o].adv_url=JSON.parse(i[o].adv_url));t.advList=e.data.adv_list,t.$nextTick((function(){t.setSwiperHeight()}))}}})},jumppage:function(t){this.$util.diyRedirectTo(t)},imageLoad:function(t){this.isImage=!0},changeSwiper:function(t){var e=this;this.currentIndex=t.detail.current,this.$nextTick((function(){e.setSwiperHeight()}))},setSwiperHeight:function(){var t=this;this.advList.length>1&&setTimeout((function(){var e="#content-wrap"+t.currentIndex,i=uni.createSelectorQuery().in(t);i.select(e).boundingClientRect(),i.exec((function(e){e&&e[0]&&(t.swiperHeight=e[0].height)}))}),10)}}};e.default=o},3424:function(t,e,i){var o=i("24fb");e=o(!1),e.push([t.i,".uni-tag[data-v-bba9daf8]{box-sizing:border-box;padding:0 %?32?%;height:%?60?%;line-height:calc(%?60?% - 2px);font-size:%?28?%;display:inline-flex;align-items:center;color:#333;border-radius:%?6?%;background-color:#f8f8f8;border:1px solid #f8f8f8}.uni-tag--circle[data-v-bba9daf8]{border-radius:%?30?%}.uni-tag--mark[data-v-bba9daf8]{border-radius:0 %?30?% %?30?% 0}.uni-tag--disabled[data-v-bba9daf8]{opacity:.5}.uni-tag--small[data-v-bba9daf8]{height:%?40?%;padding:0 %?16?%;line-height:calc(%?40?% - 2px);font-size:%?24?%}.uni-tag--primary[data-v-bba9daf8]{color:#fff;background-color:#007aff;border:1px solid #007aff}.uni-tag--primary.uni-tag--inverted[data-v-bba9daf8]{color:#007aff;background-color:#fff;border:1px solid #007aff}.uni-tag--success[data-v-bba9daf8]{color:#fff;background-color:#4cd964;border:1px solid #4cd964}.uni-tag--success.uni-tag--inverted[data-v-bba9daf8]{color:#4cd964;background-color:#fff;border:1px solid #4cd964}.uni-tag--warning[data-v-bba9daf8]{color:#fff;background-color:#f0ad4e;border:1px solid #f0ad4e}.uni-tag--warning.uni-tag--inverted[data-v-bba9daf8]{color:#f0ad4e;background-color:#fff;border:1px solid #f0ad4e}.uni-tag--error[data-v-bba9daf8]{color:#fff;background-color:#dd524d;border:1px solid #dd524d}.uni-tag--error.uni-tag--inverted[data-v-bba9daf8]{color:#dd524d;background-color:#fff;border:1px solid #dd524d}.uni-tag--inverted[data-v-bba9daf8]{color:#333;background-color:#fff;border:1px solid #f8f8f8}",""]),t.exports=e},5851:function(t,e,i){var o=i("795f");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var a=i("4f06").default;a("2f89dd41",o,!0,{sourceMap:!1,shadowMode:!1})},"5d94":function(t,e,i){"use strict";i.r(e);var o=i("fadb"),a=i("7376");for(var n in a)["default"].indexOf(n)<0&&function(t){i.d(e,t,(function(){return a[t]}))}(n);i("086f"),i("7b38");var r=i("f0c5"),d=Object(r["a"])(a["default"],o["b"],o["c"],!1,null,"1e42d2f1",null,!1,o["a"],void 0);e["default"]=d.exports},"5dcc":function(t,e,i){"use strict";i.r(e);var o=i("1fcc"),a=i.n(o);for(var n in o)["default"].indexOf(n)<0&&function(t){i.d(e,t,(function(){return o[t]}))}(n);e["default"]=a.a},"6ca1":function(t,e,i){"use strict";i.r(e);var o=i("2d2f"),a=i.n(o);for(var n in o)["default"].indexOf(n)<0&&function(t){i.d(e,t,(function(){return o[t]}))}(n);e["default"]=a.a},"6d42":function(t,e,i){"use strict";i.r(e);var o=i("6ee6"),a=i("8f28");for(var n in a)["default"].indexOf(n)<0&&function(t){i.d(e,t,(function(){return a[t]}))}(n);var r=i("f0c5"),d=Object(r["a"])(a["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],void 0);e["default"]=d.exports},"6ee6":function(t,e,i){"use strict";i.d(e,"b",(function(){return o})),i.d(e,"c",(function(){return a})),i.d(e,"a",(function(){}));var o=function(){var t=this.$createElement,e=this._self._c||t;return e("v-uni-view",{staticStyle:{display:"none"}},[this._t("default")],2)},a=[]},"72dc":function(t,e,i){"use strict";var o=i("7753"),a=i.n(o);a.a},7376:function(t,e,i){"use strict";i.r(e);var o=i("b91b"),a=i.n(o);for(var n in o)["default"].indexOf(n)<0&&function(t){i.d(e,t,(function(){return o[t]}))}(n);e["default"]=a.a},7753:function(t,e,i){var o=i("3424");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var a=i("4f06").default;a("3473dd3c",o,!0,{sourceMap:!1,shadowMode:!1})},"795f":function(t,e,i){var o=i("24fb");e=o(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.container-box[data-v-2add5f21]{width:100%}.container-box .item-wrap[data-v-2add5f21]{border-radius:%?10?%}.container-box .item-wrap .image-box[data-v-2add5f21]{border-radius:%?10?%}.container-box .item-wrap uni-image[data-v-2add5f21]{width:100%;height:auto;border-radius:%?10?%;will-change:transform}',""]),t.exports=e},"7b38":function(t,e,i){"use strict";var o=i("948c"),a=i.n(o);a.a},"7ea0":function(t,e,i){var o=i("a7fa");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var a=i("4f06").default;a("6e35705d",o,!0,{sourceMap:!1,shadowMode:!1})},"8e16":function(t,e,i){var o=i("24fb");e=o(!1),e.push([t.i,".ns-adv[data-v-1e42d2f1] uni-image{width:100%}",""]),t.exports=e},"8f28":function(t,e,i){"use strict";i.r(e);var o=i("013c"),a=i.n(o);for(var n in o)["default"].indexOf(n)<0&&function(t){i.d(e,t,(function(){return o[t]}))}(n);e["default"]=a.a},"948c":function(t,e,i){var o=i("8e16");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var a=i("4f06").default;a("3f1acc9e",o,!0,{sourceMap:!1,shadowMode:!1})},9492:function(t,e,i){"use strict";i.d(e,"b",(function(){return o})),i.d(e,"c",(function(){return a})),i.d(e,"a",(function(){}));var o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.text?i("v-uni-view",{staticClass:"uni-tag",class:[!0===t.disabled||"true"===t.disabled?"uni-tag--disabled":"",!0===t.inverted||"true"===t.inverted?"uni-tag--inverted":"",!0===t.circle||"true"===t.circle?"uni-tag--circle":"",!0===t.mark||"true"===t.mark?"uni-tag--mark":"","uni-tag--"+t.size,"uni-tag--"+t.type],on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.onClick()}}},[t._v(t._s(t.text))]):t._e()},a=[]},"94e2":function(t,e,i){"use strict";i.r(e);var o=i("21c2"),a=i("6ca1");for(var n in a)["default"].indexOf(n)<0&&function(t){i.d(e,t,(function(){return a[t]}))}(n);i("1fba");var r=i("f0c5"),d=Object(r["a"])(a["default"],o["b"],o["c"],!1,null,"2add5f21",null,!1,o["a"],void 0);e["default"]=d.exports},a7fa:function(t,e,i){var o=i("24fb");e=o(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.ns-adv[data-v-1e42d2f1]{margin:0;border-radius:%?10?%;overflow:hidden;line-height:1}.ns-adv uni-image[data-v-1e42d2f1]{width:100%}.page[data-v-1e42d2f1]{width:100%;min-height:100vh;background:var(--groupby-promotion-color)}.lineheight-clear[data-v-1e42d2f1]{line-height:1!important;color:#888;margin-top:%?10?%;font-size:%?24?%}.goods-list.single-column .goods-item[data-v-1e42d2f1]{padding:%?26?%;background:#fff;margin:%?20?% %?30?%;border-radius:%?26?%;display:flex;position:relative}.goods-list.single-column .goods-item .goods-img[data-v-1e42d2f1]{width:%?200?%;height:%?200?%;overflow:hidden;border-radius:%?10?%;margin-right:%?20?%}.goods-list.single-column .goods-item .goods-img uni-image[data-v-1e42d2f1]{width:100%;height:100%}.goods-list.single-column .goods-item .goods-tag[data-v-1e42d2f1]{color:#fff;line-height:1;padding:%?8?% %?12?%;position:absolute;border-top-left-radius:%?10?%;border-bottom-right-radius:%?10?%;top:%?26?%;left:%?26?%;font-size:%?22?%}.goods-list.single-column .goods-item .info-wrap[data-v-1e42d2f1]{flex:1;display:flex;flex-direction:column;width:calc(100% - %?220?%)}.goods-list.single-column .goods-item .name-wrap[data-v-1e42d2f1]{flex:1}.goods-list.single-column .goods-item .name-wrap .name-label[data-v-1e42d2f1]{border:0;border-radius:%?8?%;margin-right:%?8?%;padding:0 8px;background:linear-gradient(270deg,var(--groupby-promotion-color),var(--groupby-promotion-aux-color));color:#fff;font-size:%?24?%}.goods-list.single-column .goods-item .goods-name[data-v-1e42d2f1]{font-size:%?28?%;line-height:1.3;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;height:%?80?%;width:100%;word-wrap:break-word;font-size:%?30?%;font-weight:700}.goods-list.single-column .goods-item .pintuan-info uni-text[data-v-1e42d2f1]{line-height:1;margin-right:%?20?%;border:1px solid #fff;font-size:%?24?%;color:var(--groupby-color)}.goods-list.single-column .goods-item .discount-price[data-v-1e42d2f1]{display:inline-block;font-weight:700;line-height:1;margin-top:%?10?%;color:var(--price-color)}.goods-list.single-column .goods-item .discount-price .unit[data-v-1e42d2f1]{margin-right:%?6?%}.goods-list.single-column .goods-item .discount-price .txt[data-v-1e42d2f1]{font-weight:400}.goods-list.single-column .goods-item .delete-price[data-v-1e42d2f1]{text-decoration:line-through}.goods-list.single-column .goods-item .delete-price .unit[data-v-1e42d2f1]{margin-right:%?6?%}.goods-list.single-column .goods-item .delete-price .txt[data-v-1e42d2f1]{text-decoration:none}.goods-list.single-column .goods-item .pro-info[data-v-1e42d2f1]{position:relative;line-height:1}.goods-list.single-column .goods-item .pro-info > uni-view[data-v-1e42d2f1]{line-height:1}.goods-list.single-column .goods-item .pro-info > uni-view uni-button[data-v-1e42d2f1]{color:#fff;background-color:var(--groupby-promotion-color);border-radius:%?60?%}.goods-list.single-column .goods-item .pro-info > uni-view[data-v-1e42d2f1]:nth-child(2){position:absolute;right:0;bottom:0;font-weight:700}.goods-list.single-column .goods-item .member-price-tag[data-v-1e42d2f1]{display:inline-block;width:%?60?%;line-height:1;margin-left:%?6?%}.goods-list.single-column .goods-item .member-price-tag uni-image[data-v-1e42d2f1]{width:100%}',""]),t.exports=e},b91b:function(t,e,i){"use strict";i("7a82");var o=i("4ea4").default;Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=o(i("c7eb")),n=o(i("1da1"));i("d3b7"),i("159b"),i("c975"),i("99af");var r=o(i("bd78")),d={components:{uniTag:r.default},data:function(){return{dataList:[],memberId:0,mpShareData:null,bgColor:""}},onLoad:function(t){var e=this;if(this.$util.getMemberId().then((function(t){e.memberId=t})).catch((function(t){})),t.source_member&&uni.setStorageSync("source_member",t.source_member),t.scene){var i=decodeURIComponent(t.scene);i=i.split("&"),i.length&&i.forEach((function(t){-1!=t.indexOf("sku_id")&&(e.skuId=t.split("-")[1]),-1!=t.indexOf("m")&&uni.setStorageSync("source_member",t.split("-")[1]),-1!=t.indexOf("is_test")&&uni.setStorageSync("is_test",1)}))}},onShow:function(){var t=this;return(0,n.default)((0,a.default)().mark((function e(){return(0,a.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return setTimeout((function(){if(t.addonIsExist&&!t.addonIsExist.groupbuy)return t.$util.showToast({title:"商家未开启团购",mask:!0,duration:2e3}),void setTimeout((function(){t.$util.redirectTo("/pages/index/index")}),2e3)}),1e3),uni.getStorageSync("token")&&uni.getStorageSync("source_member")&&t.$util.onSourceMember(uni.getStorageSync("source_member")),e.next=4,t.getZoneConfig();case 4:case"end":return e.stop()}}),e)})))()},onShareAppMessage:function(){return this.mpShareData.appMessage},onShareTimeline:function(){return this.mpShareData.timeLine},methods:{getZoneConfig:function(){var t=this;return(0,n.default)((0,a.default)().mark((function e(){var i,o;return(0,a.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$api.sendRequest({url:"/api/config/promotionZoneConfig",data:{name:"groupbuy"},async:!1});case 2:i=e.sent,o=i.data,o&&(t.bgColor=o.bg_color);case 5:case"end":return e.stop()}}),e)})))()},getData:function(t){var e=this;this.$api.sendRequest({url:"/groupbuy/api/goods/page",data:{page_size:t.size,page:t.num},success:function(i){var o=[],a=i.message;0==i.code&&i.data?o=i.data.list:e.$util.showToast({title:a}),t.endSuccess(o.length),1==t.num&&(e.dataList=[]),e.dataList=e.dataList.concat(o),e.$refs.loadingCover&&e.$refs.loadingCover.hide()},fail:function(){t.endErr(),this.$refs.loadingCover&&this.$refs.loadingCover.hide()}})},toDetail:function(t){this.$util.redirectTo("/pages_promotion/groupbuy/detail",{groupbuy_id:t.groupbuy_id})},imgError:function(t){this.dataList[t].goods_image=this.$util.getDefaultImage().goods,this.$forceUpdate()},goodsImg:function(t){var e=t.split(",");return e[0]?this.$util.img(e[0],{size:"mid"}):this.$util.getDefaultImage().goods},goodsTag:function(t){return t.label_name||""}}};e.default=d},bd78:function(t,e,i){"use strict";i.r(e);var o=i("9492"),a=i("5dcc");for(var n in a)["default"].indexOf(n)<0&&function(t){i.d(e,t,(function(){return a[t]}))}(n);i("72dc");var r=i("f0c5"),d=Object(r["a"])(a["default"],o["b"],o["c"],!1,null,"bba9daf8",null,!1,o["a"],void 0);e["default"]=d.exports},fadb:function(t,e,i){"use strict";i.d(e,"b",(function(){return a})),i.d(e,"c",(function(){return n})),i.d(e,"a",(function(){return o}));var o={pageMeta:i("6d42").default,nsAdv:i("94e2").default,nsEmpty:i("7fc0").default,loadingCover:i("ed27").default},a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",[i("page-meta",{attrs:{"page-style":t.themeColor}}),i("v-uni-view",{staticClass:"page",style:{background:t.bgColor}},[t.addonIsExist.groupbuy?i("mescroll-uni",{ref:"mescroll",attrs:{size:10},on:{getData:function(e){arguments[0]=e=t.$handleEvent(e),t.getData.apply(void 0,arguments)}}},[i("template",{attrs:{slot:"list"},slot:"list"},[i("v-uni-view",{staticClass:"ns-adv"},[i("ns-adv",{attrs:{keyword:"NS_GROUPBUY"}})],1),t.dataList.length?i("v-uni-view",{staticClass:"goods-list single-column"},t._l(t.dataList,(function(e,o){return i("v-uni-view",{key:o,staticClass:"goods-item margin-bottom"},[i("v-uni-view",{staticClass:"goods-img",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.toDetail(e)}}},[i("v-uni-image",{attrs:{src:t.goodsImg(e.goods_image),mode:"widthFix"},on:{error:function(e){arguments[0]=e=t.$handleEvent(e),t.imgError(o)}}}),""!=t.goodsTag(e)?i("v-uni-view",{staticClass:"color-base-bg goods-tag"},[t._v(t._s(t.goodsTag(e)))]):t._e()],1),i("v-uni-view",{staticClass:"info-wrap"},[i("v-uni-view",{staticClass:"name-wrap"},[i("v-uni-view",{staticClass:"goods-name",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.toDetail(e)}}},[t._v(t._s(e.goods_name))]),i("v-uni-view",{staticClass:"introduction font-size-activity-tag color-tip"},[t._v("库存"+t._s(e.goods_stock)+"件")])],1),i("v-uni-view",{staticClass:"lineheight-clear"},[t._v("原价："),i("v-uni-text",{staticClass:"delete-price font-size-activity-tag color-tip price-font"},[i("v-uni-text",{staticClass:"unit"},[t._v(t._s(t.$lang("common.currencySymbol")))]),t._v(t._s(e.price))],1)],1),i("v-uni-view",{staticClass:"pro-info"},[i("v-uni-view",{staticClass:"discount-price"},[i("v-uni-text",{staticClass:"unit price-style small"},[t._v(t._s(t.$lang("common.currencySymbol")))]),i("v-uni-text",{staticClass:"price price-style large"},[t._v(t._s(parseFloat(e.groupbuy_price).toFixed(2).split(".")[0]))]),i("v-uni-text",{staticClass:"unit price-style small"},[t._v("."+t._s(parseFloat(e.groupbuy_price).toFixed(2).split(".")[1]))])],1),i("v-uni-view",{on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.toDetail(e)}}},[i("v-uni-button",{attrs:{type:"primary",size:"mini"}},[t._v("去团购")])],1)],1)],1)],1)})),1):t._e(),0==t.dataList.length?i("v-uni-view",[i("ns-empty",{attrs:{text:"暂无团购",textColor:"#fff",isIndex:!1}})],1):t._e()],1)],2):t._e(),i("loading-cover",{ref:"loadingCover"})],1)],1)},n=[]}}]);