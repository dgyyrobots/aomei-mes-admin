(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages_promotion-blindbox-my_box"],{"013c":function(t,e,o){"use strict";o("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,o("c975"),o("a9e3"),o("ac1f"),o("5319"),o("acd8");var i={type:"scrolldone",target:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},currentTarget:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},detail:{}},n={props:{backgroundTextStyle:{type:String,default:"dark",validator:function(t){return-1!==["dark","light"].indexOf(t)}},backgroundColor:{type:String,default:"#ffffff"},backgroundColorTop:{type:String,default:"#ffffff"},backgroundColorBottom:{type:String,default:"#ffffff"},scrollTop:{type:String,default:""},scrollDuration:{type:Number,default:300},pageStyle:{type:String,default:""},enablePullDownRefresh:{type:[Boolean,String],default:!1},rootFontSize:{type:String,default:""}},created:function(){var t=this,e=getCurrentPages()[0];this.$pageVm=e.$vm||e,uni.onWindowResize((function(e){t.$emit("resize",e)})),this.$pageVm.$on("hook:onPageScroll",(function(e){t.$emit("scroll",e)})),this.$watch("backgroundTextStyle",(function(){t.setBackgroundTextStyle()})),this.$watch((function(){return[t.rootFontSize,t.pageStyle]}),(function(){t.setPageMeta()})),this.$watch((function(){return[t.backgroundColor,t.backgroundColorTop,t.backgroundColorBottom]}),(function(){t.setBackgroundColor()})),this.$watch((function(){return[t.scrollTop,t.scrollDuration]}),(function(){t.pageScrollTo()}))},beforeMount:function(){this.setBackgroundColor(),(this.rootFontSize||this.pageStyle)&&this.setPageMeta(),this.backgroundTextStyle&&this.setBackgroundTextStyle()},mounted:function(){this.scrollTop&&this.pageScrollTo()},methods:{setPullDownRefresh:function(t,e){t.setStyle({pullToRefresh:{support:e,style:"Android"===plus.os.name?"circle":"default"}})},setPageMeta:function(){uni.setPageMeta({pageStyle:this.pageStyle,rootFontSize:this.rootFontSize})},setBackgroundTextStyle:function(){},setBackgroundColor:function(){},pageScrollTo:function(){var t=this,e=String(this.scrollTop);if(-1!==e.indexOf("rpx")&&(e=uni.upx2px(e.replace("rpx",""))),e=parseFloat(e),!isNaN(e)){var o=function o(n){n.scrollTop===e&&(t.$pageVm.$off("hook:onPageScroll",o),t.$emit("scrolldone",i))};uni.pageScrollTo({scrollTop:e,duration:this.scrollDuration,success:function(){t.$pageVm.$on("hook:onPageScroll",o)}})}}}};e.default=n},"44c7":function(t,e,o){"use strict";o("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,o("99af");var i={data:function(){return{boxStatusList:[{id:"",name:"全部"},{id:"1",name:"进行中"},{id:"2",name:"已结束"}],boxStatus:"",token:null,blindbox:[],state:1,showEmpty:!1,isIphoneX:!1}},onShow:function(){var t=this;setTimeout((function(){if(t.addonIsExist&&!t.addonIsExist.blindbox)return t.$util.showToast({title:"商家未开启盲盒",mask:!0,duration:2e3}),void setTimeout((function(){t.$util.redirectTo("/pages/index/index")}),2e3)}),1e3),uni.getStorageSync("token")?(this.token=uni.getStorageSync("token"),this.$refs.mescroll&&this.$refs.mescroll.refresh()):setTimeout((function(){t.$refs.login.open("/pages_promotion/blindbox/my_box")}))},onLoad:function(){this.isIphoneX=this.$util.uniappIsIPhoneX()},methods:{getbox:function(t){var e=this;this.showEmpty=!1,this.$api.sendRequest({url:"/blindbox/api/blindbox/myblindbox",data:{status:this.boxStatus,page:t.num,page_size:t.size},success:function(o){e.showEmpty=!0;var i=[];0==o.code&&o.data?i=o.data.list:e.$util.showToast({title:o.message}),t.endSuccess(i.length),1==t.num&&(e.blindbox=[]),e.blindbox=e.blindbox.concat(i),e.$refs.loadingCover&&e.$refs.loadingCover.hide()}})},categoryChange:function(t){this.boxStatus=t,this.$refs.mescroll.refresh()},toMyprize:function(t){this.$util.redirectTo("/pages_promotion/blindbox/my_prize",{blindbox_id:t.blindbox_id})},errorImg:function(){this.blindbox.blindbox_images=this.$util.getDefaultImage().goods}},watch:{storeToken:function(t,e){t&&(this.token=t,this.$refs.mescroll.refresh())}}};e.default=i},6177:function(t,e,o){var i=o("cc8a");i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var n=o("4f06").default;n("53df08fc",i,!0,{sourceMap:!1,shadowMode:!1})},"6d42":function(t,e,o){"use strict";o.r(e);var i=o("6ee6"),n=o("8f28");for(var s in n)["default"].indexOf(s)<0&&function(t){o.d(e,t,(function(){return n[t]}))}(s);var a=o("f0c5"),l=Object(a["a"])(n["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],void 0);e["default"]=l.exports},"6ee6":function(t,e,o){"use strict";o.d(e,"b",(function(){return i})),o.d(e,"c",(function(){return n})),o.d(e,"a",(function(){}));var i=function(){var t=this.$createElement,e=this._self._c||t;return e("v-uni-view",{staticStyle:{display:"none"}},[this._t("default")],2)},n=[]},7270:function(t,e,o){"use strict";o.r(e);var i=o("44c7"),n=o.n(i);for(var s in i)["default"].indexOf(s)<0&&function(t){o.d(e,t,(function(){return i[t]}))}(s);e["default"]=n.a},"8f28":function(t,e,o){"use strict";o.r(e);var i=o("013c"),n=o.n(i);for(var s in i)["default"].indexOf(s)<0&&function(t){o.d(e,t,(function(){return i[t]}))}(s);e["default"]=n.a},ca99:function(t,e,o){"use strict";o.d(e,"b",(function(){return n})),o.d(e,"c",(function(){return s})),o.d(e,"a",(function(){return i}));var i={pageMeta:o("6d42").default,nsEmpty:o("7fc0").default,nsLogin:o("3423").default,loadingCover:o("ed27").default},n=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-uni-view",[o("page-meta",{attrs:{"page-style":t.themeColor}}),o("v-uni-view",{staticClass:"my_box",class:t.isIphoneX?"iphone-x":""},[t.token?o("v-uni-view",{staticClass:"my_box_category"},t._l(t.boxStatusList,(function(e,i){return o("v-uni-view",{key:i,staticClass:"category-item",on:{click:function(o){arguments[0]=o=t.$handleEvent(o),t.categoryChange(e.id)}}},[o("v-uni-view",{staticClass:"item-con",class:e.id==t.boxStatus?"active color-base-text color-base-bg-before acts":""},[t._v(t._s(e.name))])],1)})),1):t._e(),t.token?o("mescroll-uni",{ref:"mescroll",attrs:{top:"90"},on:{getData:function(e){arguments[0]=e=t.$handleEvent(e),t.getbox.apply(void 0,arguments)}}},[o("template",{attrs:{slot:"list"},slot:"list"},[t.blindbox.length>0?o("v-uni-view",{staticClass:"item"},t._l(t.blindbox,(function(e,i){return o("v-uni-view",{key:i,staticClass:"goods-list"},[o("v-uni-view",{staticClass:"list-body"},[o("v-uni-view",{staticClass:"list-body-img"},[""!=e.blindbox_images?o("v-uni-image",{attrs:{src:t.$util.img(e.blindbox_images),mode:"aspectFit"},on:{error:function(e){arguments[0]=e=t.$handleEvent(e),t.errorImg()}}}):o("v-uni-image",{attrs:{src:t.$util.img("public/uniapp/blindbox/default.png")}})],1),o("v-uni-view",{staticClass:"shop-content"},[o("v-uni-view",{staticClass:"shop-title"},[t._v(t._s(e.blindbox_name))]),1==e.blindbox_status?o("v-uni-view",{staticClass:"statusing font-size-tag"},[t._v("进行中")]):t._e(),2==e.blindbox_status?o("v-uni-view",{staticClass:"statused font-size-tag color-tip"},[t._v("已结束")]):t._e(),o("v-uni-view",{staticClass:"font-size-tag ul"},[o("v-uni-text",{staticClass:"li"}),o("v-uni-text",{staticClass:"color-tip lititle"},[t._v("盲盒次数："),o("v-uni-text",{staticClass:"color-title"},[t._v("可拆"+t._s(e.blindbox_count)+"次，剩余"),o("v-uni-text",{staticClass:"color-base-text"},[t._v(t._s(e.blindbox_inventory))]),t._v("次")],1)],1)],1),o("v-uni-view",{staticClass:"font-size-tag ul"},[o("v-uni-text",{staticClass:"li-two"}),o("v-uni-text",{staticClass:"color-tip lititle"},[t._v("我的次数："),o("v-uni-text",{staticClass:"color-title"},[t._v("已拆"),o("v-uni-text",{staticClass:"color-base-text"},[t._v(t._s(e.buy_num))]),t._v("次")],1)],1)],1)],1)],1),o("v-uni-view",{staticClass:"my-prize-box"},[o("v-uni-text",{staticClass:"color-tip prize-time font-size-tag"},[t._v("结束时间："+t._s(t.$util.timeStampTurnTime(e.end_time)))]),o("v-uni-text",{staticClass:"color-base-text my-prize",on:{click:function(o){arguments[0]=o=t.$handleEvent(o),t.toMyprize(e)}}},[t._v("我的奖品"),o("v-uni-text",{staticClass:"iconfont icon-right font-size-sub toprizeicon"})],1)],1)],1)})),1):o("v-uni-view",[o("ns-empty",{attrs:{isIndex:!1,text:"暂无数据"}})],1)],1)],2):t._e(),o("ns-login",{ref:"ns-login"}),o("loading-cover",{ref:"loadingCover"})],1)],1)},s=[]},cc8a:function(t,e,o){var i=o("24fb");e=i(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.my_box .my_box_category[data-v-787d6dfc]{width:100%;height:%?88?%;display:flex;justify-content:space-around;background-color:#fff;position:fixed;top:0;z-index:999;box-sizing:border-box}.my_box .my_box_category .category-item[data-v-787d6dfc]{width:%?100?%;text-align:center}.my_box .my_box_category .category-item .item-con[data-v-787d6dfc]{display:inline-block;height:%?88?%;font-size:%?30?%;position:relative;line-height:%?88?%}.my_box .my_box_category .category-item .acts[data-v-787d6dfc]{font-weight:700}.my_box .my_box_category .category-item .item-con.active[data-v-787d6dfc]:after{content:"";display:block;text-align:center;width:100%;height:%?4?%;border-radius:%?6?%;position:absolute;left:0;bottom:0}.my_box .my_box_category .category-item[data-v-787d6dfc]:last-of-type{margin-right:0}.my_box .goods-list[data-v-787d6dfc]{margin:%?20?% %?30?%;background-color:#fff;border-radius:%?10?%;padding:%?30?%}.my_box .goods-list .list-body[data-v-787d6dfc]{display:flex;justify-content:space-between}.my_box .goods-list .list-body .list-body-img[data-v-787d6dfc]{display:flex;align-items:center;justify-content:center;background-color:#fff;width:%?232?%;height:%?232?%;margin-right:%?20?%}.my_box .goods-list .list-body .list-body-img uni-image[data-v-787d6dfc]{width:100%;height:100%}.my_box .goods-list .list-body .shop-content[data-v-787d6dfc]{display:flex;flex-direction:column;justify-content:space-between;flex:1}.my_box .goods-list .list-body .shop-content .shop-title[data-v-787d6dfc]{margin-top:%?-8?%;height:%?84?%;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-word;line-height:%?42?%;color:#303133}.my_box .goods-list .list-body .shop-content .statusing[data-v-787d6dfc]{color:#03bd04;border:%?2?% solid #03bd04;border-radius:%?6?%;padding:%?6?% 0;line-height:1;width:%?104?%;text-align:center}.my_box .goods-list .list-body .shop-content .status[data-v-787d6dfc]{border:%?2?% solid #909399;border-radius:%?6?%;padding:%?6?% 0;line-height:1;width:%?104?%;text-align:center}.my_box .goods-list .list-body .shop-content .statused[data-v-787d6dfc]{border:%?2?% solid #909399;border-radius:%?6?%;padding:%?6?% 0;line-height:1;width:%?104?%;text-align:center}.my_box .goods-list .list-body .shop-content .box-price[data-v-787d6dfc]{line-height:1;font-size:%?40?%}.my_box .goods-list .list-body .shop-content .box-price .box-price-icon[data-v-787d6dfc]{margin-right:%?6?%;font-size:%?24?%}.my_box .goods-list .list-body .shop-content .ul[data-v-787d6dfc]{display:flex;align-items:center}.my_box .goods-list .list-body .shop-content .ul .li[data-v-787d6dfc]{display:inline-block;background-color:#ff4544;width:%?6?%;height:%?6?%;border-radius:50%;margin-right:%?10?%}.my_box .goods-list .list-body .shop-content .ul .lititle[data-v-787d6dfc]{white-space:nowrap}.my_box .goods-list .list-body .shop-content .ul .li-two[data-v-787d6dfc]{display:inline-block;background-color:#4470ff;width:%?6?%;height:%?6?%;border-radius:50%;margin-right:%?10?%}.my_box .goods-list .my-prize-box[data-v-787d6dfc]{border-top:%?2?% solid #eee;margin-top:%?20?%;padding-top:%?20?%;display:flex;justify-content:space-between;align-items:center}.my_box .goods-list .my-prize-box .toprizeicon[data-v-787d6dfc]{margin-left:%?10?%}',""]),t.exports=e},cec6:function(t,e,o){"use strict";var i=o("6177"),n=o.n(i);n.a},efa4:function(t,e,o){"use strict";o.r(e);var i=o("ca99"),n=o("7270");for(var s in n)["default"].indexOf(s)<0&&function(t){o.d(e,t,(function(){return n[t]}))}(s);o("cec6");var a=o("f0c5"),l=Object(a["a"])(n["default"],i["b"],i["c"],!1,null,"787d6dfc",null,!1,i["a"],void 0);e["default"]=l.exports}}]);