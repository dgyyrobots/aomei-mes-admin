(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages_promotion-pintuan-share"],{"013c":function(t,i,e){"use strict";e("7a82"),Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0,e("c975"),e("a9e3"),e("ac1f"),e("5319"),e("acd8");var n={type:"scrolldone",target:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},currentTarget:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},detail:{}},a={props:{backgroundTextStyle:{type:String,default:"dark",validator:function(t){return-1!==["dark","light"].indexOf(t)}},backgroundColor:{type:String,default:"#ffffff"},backgroundColorTop:{type:String,default:"#ffffff"},backgroundColorBottom:{type:String,default:"#ffffff"},scrollTop:{type:String,default:""},scrollDuration:{type:Number,default:300},pageStyle:{type:String,default:""},enablePullDownRefresh:{type:[Boolean,String],default:!1},rootFontSize:{type:String,default:""}},created:function(){var t=this,i=getCurrentPages()[0];this.$pageVm=i.$vm||i,uni.onWindowResize((function(i){t.$emit("resize",i)})),this.$pageVm.$on("hook:onPageScroll",(function(i){t.$emit("scroll",i)})),this.$watch("backgroundTextStyle",(function(){t.setBackgroundTextStyle()})),this.$watch((function(){return[t.rootFontSize,t.pageStyle]}),(function(){t.setPageMeta()})),this.$watch((function(){return[t.backgroundColor,t.backgroundColorTop,t.backgroundColorBottom]}),(function(){t.setBackgroundColor()})),this.$watch((function(){return[t.scrollTop,t.scrollDuration]}),(function(){t.pageScrollTo()}))},beforeMount:function(){this.setBackgroundColor(),(this.rootFontSize||this.pageStyle)&&this.setPageMeta(),this.backgroundTextStyle&&this.setBackgroundTextStyle()},mounted:function(){this.scrollTop&&this.pageScrollTo()},methods:{setPullDownRefresh:function(t,i){t.setStyle({pullToRefresh:{support:i,style:"Android"===plus.os.name?"circle":"default"}})},setPageMeta:function(){uni.setPageMeta({pageStyle:this.pageStyle,rootFontSize:this.rootFontSize})},setBackgroundTextStyle:function(){},setBackgroundColor:function(){},pageScrollTo:function(){var t=this,i=String(this.scrollTop);if(-1!==i.indexOf("rpx")&&(i=uni.upx2px(i.replace("rpx",""))),i=parseFloat(i),!isNaN(i)){var e=function e(a){a.scrollTop===i&&(t.$pageVm.$off("hook:onPageScroll",e),t.$emit("scrolldone",n))};uni.pageScrollTo({scrollTop:i,duration:this.scrollDuration,success:function(){t.$pageVm.$on("hook:onPageScroll",e)}})}}}};i.default=a},1428:function(t,i,e){"use strict";var n=e("1d3c"),a=e.n(n);a.a},"1d3c":function(t,i,e){var n=e("550a");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var a=e("4f06").default;a("11c2e8c6",n,!0,{sourceMap:!1,shadowMode:!1})},3772:function(t,i,e){"use strict";var n=e("639f"),a=e.n(n);a.a},"3bbb":function(t,i,e){"use strict";e("7a82"),Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0,e("a9e3");var n={name:"UniCountDown",props:{showDay:{type:Boolean,default:!0},showColon:{type:Boolean,default:!0},backgroundColor:{type:String,default:"#FFFFFF"},backgroundColorClass:{type:String,default:""},borderColor:{type:String,default:"#000000"},borderColorClass:{type:String,default:""},color:{type:String,default:"#000000"},colorClass:{type:String,default:""},splitorColor:{type:String,default:"#000000"},splitorColorClass:{type:String,default:""},day:{type:[Number,String],default:0},hour:{type:[Number,String],default:0},minute:{type:[Number,String],default:0},second:{type:[Number,String],default:0}},data:function(){return{timer:null,d:"00",h:"00",i:"00",s:"00",leftTime:0,seconds:0}},mounted:function(t){var i=this;this.seconds=this.toSeconds(this.day,this.hour,this.minute,this.second),this.countDown(),this.timer=setInterval((function(){i.seconds--,i.seconds<0?i.timeUp():i.countDown()}),1e3)},watch:{day:function(t){var i=this;this.timeUp(),this.seconds=this.toSeconds(this.day,this.hour,this.minute,this.second),this.countDown(),this.timer=setInterval((function(){i.seconds--,i.seconds<0?i.timeUp():i.countDown()}),1e3)},hour:function(t){var i=this;this.timeUp(),this.seconds=this.toSeconds(this.day,this.hour,this.minute,this.second),this.countDown(),this.timer=setInterval((function(){i.seconds--,i.seconds<0?i.timeUp():i.countDown()}),1e3)},minute:function(t){var i=this;this.timeUp(),this.seconds=this.toSeconds(this.day,this.hour,this.minute,this.second),this.countDown(),this.timer=setInterval((function(){i.seconds--,i.seconds<0?i.timeUp():i.countDown()}),1e3)},second:function(t){var i=this;this.timeUp(),this.seconds=this.toSeconds(this.day,this.hour,this.minute,this.second),this.countDown(),this.timer=setInterval((function(){i.seconds--,i.seconds<0?i.timeUp():i.countDown()}),1e3)}},beforeDestroy:function(){clearInterval(this.timer)},methods:{toSeconds:function(t,i,e,n){return t=Number(t),i=Number(i),e=Number(e),n=Number(n),60*t*60*24+60*i*60+60*e+n},timeUp:function(){clearInterval(this.timer),this.$emit("timeup")},countDown:function(){var t=this.seconds,i=0,e=0,n=0,a=0;t>0?(i=Math.floor(t/86400),e=Math.floor(t/3600)-24*i,n=Math.floor(t/60)-24*i*60-60*e,a=Math.floor(t)-24*i*60*60-60*e*60-60*n):this.timeUp(),i<10&&(i="0"+i),e<10&&(e="0"+e),n<10&&(n="0"+n),a<10&&(a="0"+a),this.d=i,this.h=e,this.i=n,this.s=a}}};i.default=n},"4a2d":function(t,i,e){"use strict";e.r(i);var n=e("76c5"),a=e("93e5");for(var o in a)["default"].indexOf(o)<0&&function(t){e.d(i,t,(function(){return a[t]}))}(o);e("9ffa"),e("3772");var s=e("f0c5"),r=Object(s["a"])(a["default"],n["b"],n["c"],!1,null,"6c06c9be",null,!1,n["a"],void 0);i["default"]=r.exports},"550a":function(t,i,e){var n=e("24fb");i=n(!1),i.push([t.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.uni-countdown[data-v-124a8622]{padding:%?2?% 0;display:inline-flex;flex-wrap:nowrap;justify-content:center}.uni-countdown__splitor[data-v-124a8622]{justify-content:center;line-height:%?44?%;padding:0 %?5?%;font-size:%?24?%}.uni-countdown__splitor.day[data-v-124a8622]{line-height:%?50?%}.uni-countdown__number[data-v-124a8622]{line-height:%?44?%;justify-content:center;height:%?44?%;border-radius:%?6?%;margin:0 %?5?%;font-size:%?28?%;border:%?2?% solid #000;font-size:%?24?%;padding:0 %?10?%}',""]),t.exports=i},"639f":function(t,i,e){var n=e("e4b4");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var a=e("4f06").default;a("947e7964",n,!0,{sourceMap:!1,shadowMode:!1})},"667f":function(t,i,e){var n=e("e0b9");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var a=e("4f06").default;a("7d7863ac",n,!0,{sourceMap:!1,shadowMode:!1})},"6be9":function(t,i,e){"use strict";e.r(i);var n=e("3bbb"),a=e.n(n);for(var o in n)["default"].indexOf(o)<0&&function(t){e.d(i,t,(function(){return n[t]}))}(o);i["default"]=a.a},"6d42":function(t,i,e){"use strict";e.r(i);var n=e("6ee6"),a=e("8f28");for(var o in a)["default"].indexOf(o)<0&&function(t){e.d(i,t,(function(){return a[t]}))}(o);var s=e("f0c5"),r=Object(s["a"])(a["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],void 0);i["default"]=r.exports},"6ee6":function(t,i,e){"use strict";e.d(i,"b",(function(){return n})),e.d(i,"c",(function(){return a})),e.d(i,"a",(function(){}));var n=function(){var t=this.$createElement,i=this._self._c||t;return i("v-uni-view",{staticStyle:{display:"none"}},[this._t("default")],2)},a=[]},"76c5":function(t,i,e){"use strict";e.d(i,"b",(function(){return a})),e.d(i,"c",(function(){return o})),e.d(i,"a",(function(){return n}));var n={pageMeta:e("6d42").default,uniCountDown:e("8190").default,loadingCover:e("ed27").default,uniPopup:e("4e20").default},a=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("v-uni-view",[e("page-meta",{attrs:{"page-style":t.themeColor}}),e("v-uni-view",{staticClass:"page"},[e("v-uni-view",{staticClass:"pintuan-wrap"},[e("v-uni-view",{staticClass:"pintuan-list"},[e("v-uni-view",{staticClass:"pintuan-bg"}),e("v-uni-view",{staticClass:"list-item",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.toPintuanDetail(t.groupDetail.pintuan_goods_id)}}},[e("v-uni-view",{staticClass:"item-image"},[e("v-uni-image",{attrs:{src:t.$util.img(t.groupDetail.sku_image,{size:"big"}),mode:"widthFix"},on:{error:function(i){arguments[0]=i=t.$handleEvent(i),t.imageError()}}})],1),e("v-uni-view",{staticClass:"item-desc"},[e("v-uni-view",{staticClass:"desc-title"},[t._v(t._s(t.groupDetail.sku_name))]),e("v-uni-view",{staticClass:"pintuan-num"},[e("v-uni-text",{staticClass:"color-base-border"},[t._v(t._s(t.groupDetail.pintuan_num)+"人团")]),e("v-uni-text",{staticClass:"color-base-text color-base-bg-light"},[t._v("已成团"+t._s(t.groupDetail.group_num)+"件")])],1),e("v-uni-view",{staticClass:"color-tip"},[e("v-uni-text",{staticClass:"color-base-text font-size-toolbar margin-right price-style large"},[e("v-uni-text",{staticClass:"font-size-tag price-btn price-style small"},[t._v("￥")]),t._v(t._s(t.groupDetail.order_money))],1),e("v-uni-text",{staticClass:"old-price font-size-tag price-font"},[t._v("￥"+t._s(t.groupDetail.discount_price))])],1)],1)],1)],1),e("v-uni-view",{staticClass:"pintuan-clustering"},[2==t.groupDetail.pintuan_status?[e("v-uni-view",{staticClass:"tips countdown"},[e("v-uni-view",{staticClass:"tips-title"},[t._v("还差"),e("v-uni-text",{staticClass:"color-base-text"},[t._v(t._s(t.kill))]),t._v("人成团")],1),t._v("距结束还剩"),t.groupDetail.timeMachine?e("uni-count-down",{attrs:{day:t.groupDetail.timeMachine.d,hour:t.groupDetail.timeMachine.h,minute:t.groupDetail.timeMachine.i,second:t.groupDetail.timeMachine.s,color:"#fff",splitorColor:"#333 !important",backgroundColor:"#000"}}):t._e()],1)]:3==t.groupDetail.pintuan_status?e("v-uni-view",{staticClass:"tips text"},[e("v-uni-text",[t._v("恭喜您，拼团成功")])],1):1==t.groupDetail.pintuan_status?e("v-uni-view",{staticClass:"tips text"},[e("v-uni-text",[t._v("很遗憾，拼团失败")])],1):1!=t.groupDetail.status?e("v-uni-view",{staticClass:"tips text"},[e("v-uni-text",[t._v("活动已结束，很遗憾拼团失败")])],1):t._e(),t.groupDetail&&t.groupDetail.member_list?e("v-uni-view",{staticClass:"headimg-group"},[t._l(t.groupDetail.member_list,(function(i,n){return n<5?e("v-uni-view",{key:n,staticClass:"group-member"},[t.groupDetail.head_id==i.member_id?e("v-uni-view",{staticClass:"mark ns-gradient-promotionpages-pintuan-share-share"},[t._v("团长")]):t._e(),e("v-uni-view",{staticClass:"member-face"},[e("v-uni-image",{attrs:{src:i.member_img?t.$util.img(i.member_img):t.$util.img("public/uniapp/common/default_headimg.png"),mode:"aspectFill"}})],1)],1):t._e()})),t._l(t.kill,(function(i){return 3!=t.groupDetail.pintuan_status?e("v-uni-view",{staticClass:"group-member"},[e("v-uni-view",{staticClass:"member-face"},[e("v-uni-image",{attrs:{src:t.groupDetail.member_list&&t.groupDetail.member_list.length<5?t.$util.img("public/uniapp/common/spelling_who.png"):t.$util.img("public/uniapp/common/spelling_who_omit.png"),mode:"aspectFill"}})],1)],1):t._e()}))],2):t._e(),1!=t.groupDetail.status?e("v-uni-view",{staticClass:"pintuan-btn-box"},[3==t.groupDetail.pintuan_status?e("v-uni-button",{staticClass:"one_btn pintuan-btn",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.orderDetail(t.groupDetail)}}},[t._v("查看订单")]):e("v-uni-button",{staticClass:"disabled"},[t._v("活动已结束")])],1):2==t.groupDetail.pintuan_status?e("v-uni-view",{staticClass:"pintuan-btn-box"},[e("v-uni-button",{staticClass:"pintuan-btn",attrs:{type:"primary"},on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.openSharePopup.apply(void 0,arguments)}}},[t._v("邀请好友参团")]),e("v-uni-button",{staticClass:"one_btn pintuan-btn",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.orderDetail(t.groupDetail)}}},[t._v("查看订单")])],1):1==t.groupDetail.pintuan_status||3==t.groupDetail.pintuan_status?e("v-uni-view",{staticClass:"pintuan-btn-box"},[e("v-uni-button",{staticClass:"pintuan-btn",attrs:{type:"primary"},on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.$util.redirectTo("/pages_promotion/pintuan/list")}}},[t._v("再次发起拼团")]),3==t.groupDetail.pintuan_status?e("v-uni-button",{staticClass:"one_btn pintuan-btn",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.orderDetail(t.groupDetail)}}},[t._v("查看订单")]):t._e()],1):t._e()],2),e("v-uni-view",{staticClass:"pintuan-playing"},[e("v-uni-view",{staticClass:"pintuan-step-title"},[t._v("拼团玩法")]),e("v-uni-view",{staticClass:"pintuan-step-list"},[e("v-uni-view",{staticClass:"pintuan-step"},[e("v-uni-view",{staticClass:"step-img"},[e("v-uni-image",{attrs:{src:t.$util.img("public/uniapp/pintuan/pintuan-step-1.png")}})],1),e("v-uni-view",{staticClass:"step-text"},[e("v-uni-view",[t._v("支付开团")]),e("v-uni-view",[t._v("或参团")])],1)],1),e("v-uni-view",{staticClass:"pintuan-step-point"},[e("v-uni-view"),e("v-uni-view"),e("v-uni-view")],1),e("v-uni-view",{staticClass:"pintuan-step"},[e("v-uni-view",{staticClass:"step-img"},[e("v-uni-image",{attrs:{src:t.$util.img("public/uniapp/pintuan/pintuan-step-2.png")}})],1),e("v-uni-view",{staticClass:"step-text"},[e("v-uni-view",[t._v("邀请好友")]),e("v-uni-view",[t._v("参团")])],1)],1),e("v-uni-view",{staticClass:"pintuan-step-point"},[e("v-uni-view"),e("v-uni-view"),e("v-uni-view")],1),e("v-uni-view",{staticClass:"pintuan-step"},[e("v-uni-view",{staticClass:"step-img"},[e("v-uni-image",{attrs:{src:t.$util.img("public/uniapp/pintuan/pintuan-step-3.png")}})],1),e("v-uni-view",{staticClass:"step-text"},[e("v-uni-view",[t._v("达到拼团")]),e("v-uni-view",[t._v("人数")])],1)],1),e("v-uni-view",{staticClass:"pintuan-step-point"},[e("v-uni-view"),e("v-uni-view"),e("v-uni-view")],1),e("v-uni-view",{staticClass:"pintuan-step"},[e("v-uni-view",{staticClass:"step-img"},[e("v-uni-image",{attrs:{src:t.$util.img("public/uniapp/pintuan/pintuan-step-4.png")}})],1),e("v-uni-view",{staticClass:"step-text"},[e("v-uni-view",[t._v("组团成功")]),e("v-uni-view",[t._v("等待发货")])],1)],1)],1)],1)],1),e("loading-cover",{ref:"loadingCover"}),e("v-uni-view",{staticClass:"fixed-box",style:{height:t.fixBtnShow?"330rpx":"120rpx"}},[t.fixBtnShow?e("v-uni-view",{staticClass:"btn-item",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.$util.redirectTo("/pages/index/index")}}},[e("v-uni-text",{staticClass:"iconfont icon-shouye1"}),e("v-uni-view",[t._v("首页")])],1):t._e(),t.fixBtnShow?e("v-uni-view",{staticClass:"btn-item",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.$util.redirectTo("/pages/member/index")}}},[e("v-uni-text",{staticClass:"iconfont icon-yonghu"}),e("v-uni-view",[t._v("我的")])],1):t._e(),t.fixBtnShow?e("v-uni-view",{staticClass:"btn-item icon-xiala",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.fixBtnShow?t.fixBtnShow=!1:t.fixBtnShow=!0}}},[e("v-uni-text",{staticClass:"iconfont icon-unfold"})],1):e("v-uni-view",{staticClass:"btn-item switch",class:{show:t.fixBtnShow},on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.fixBtnShow?t.fixBtnShow=!1:t.fixBtnShow=!0}}},[e("v-uni-view",{},[t._v("快捷")]),e("v-uni-view",[t._v("导航")])],1)],1),e("v-uni-view",{on:{touchmove:function(i){i.preventDefault(),i.stopPropagation(),arguments[0]=i=t.$handleEvent(i)}}},[e("uni-popup",{ref:"sharePopup",staticClass:"share-popup",attrs:{type:"bottom"}},[e("v-uni-view",[e("v-uni-view",{staticClass:"share-title"},[t._v("分享")]),e("v-uni-view",{staticClass:"share-content"},[e("v-uni-view",{staticClass:"share-box",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.copyUrl.apply(void 0,arguments)}}},[e("v-uni-button",{staticClass:"share-btn",attrs:{plain:!0}},[e("v-uni-view",{staticClass:"iconfont icon-fuzhilianjie"}),e("v-uni-text",[t._v("复制链接")])],1)],1),e("v-uni-view",{staticClass:"share-box",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.openPosterPopup.apply(void 0,arguments)}}},[e("v-uni-button",{staticClass:"share-btn",attrs:{plain:!0}},[e("v-uni-view",{staticClass:"iconfont icon-pengyouquan"}),e("v-uni-text",[t._v("生成分享海报")])],1)],1)],1),e("v-uni-view",{staticClass:"share-footer",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.closeSharePopup.apply(void 0,arguments)}}},[e("v-uni-text",[t._v("取消分享")])],1)],1)],1),e("v-uni-view",{staticClass:"poster-layer",on:{touchmove:function(i){i.preventDefault(),i.stopPropagation(),arguments[0]=i=t.$handleEvent(i)}}},[e("uni-popup",{ref:"posterPopup",attrs:{type:"center"}},["-1"!=t.poster?[e("v-uni-view",{staticClass:"poster-wrap"},[e("v-uni-view",{staticClass:"image-wrap"},[e("v-uni-image",{attrs:{src:t.$util.img(t.poster),"show-menu-by-longpress":!0,mode:"widthFix"}}),e("v-uni-view",{staticClass:"close iconfont icon-close",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.closePosterPopup()}}})],1),e("v-uni-view",{staticClass:"save-btn"},[t._v("长按图片进行保存")])],1)]:t._e()],2)],1)],1)],1)],1)},o=[]},8190:function(t,i,e){"use strict";e.r(i);var n=e("becd"),a=e("6be9");for(var o in a)["default"].indexOf(o)<0&&function(t){e.d(i,t,(function(){return a[t]}))}(o);e("1428");var s=e("f0c5"),r=Object(s["a"])(a["default"],n["b"],n["c"],!1,null,"124a8622",null,!1,n["a"],void 0);i["default"]=r.exports},"831a":function(t,i,e){"use strict";e("7a82");var n=e("4ea4").default;Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0,e("14d9"),e("99af"),e("4de4"),e("d3b7"),e("e25e"),e("e9c4");var a=n(e("8190")),o={components:{uniCountDown:a.default},data:function(){return{id:0,groupDetail:{sku_image:""},kill:0,memberId:0,poster:"-1",posterMsg:"",posterHeight:0,interval:null,intervalNum:0,fixBtnShow:!1,shareImg:""}},onLoad:function(t){var i=this,e=this;setTimeout((function(){if(i.addonIsExist&&!i.addonIsExist.pintuan)return i.$util.showToast({title:"商家未开启拼团返利",mask:!0,duration:2e3}),void setTimeout((function(){i.$util.redirectTo("/pages/index/index")}),2e3)}),1e3),this.id=t.id,this.interval=setInterval((function(){e.getGroupDetail(),e.intervalNum++,e.intervalNum>5&&clearInterval(e.interval)}),1e3),this.$util.getMemberId().then((function(t){i.memberId=t,i.groupDetail.pintuan_id&&i.setPublicShare()}))},methods:{getGroupDetail:function(){var t=this;this.$api.sendRequest({url:"/pintuan/api/order/detail",data:{id:this.id},success:function(i){if(0==i.code){i.data.member_list;for(var e=[],n=0;n<i.data.pintuan_num-i.data.member_list.length;n++){e.push("")}i.data.pintuan_status&&clearInterval(t.interval),t.kill=i.data.pintuan_num-i.data.pintuan_count,i.data.member_list=i.data.member_list.concat(e),i.data.group_end_time>i.timestamp?i.data.timeMachine=t.$util.countDown(i.data.group_end_time-i.timestamp):i.data.timeMachine=null,t.groupDetail=i.data,t.groupDetail.member_list=t.groupDetail.member_list.filter((function(t,i){return t})),t.setPublicShare()}else t.$util.showToast({title:i.message});t.$refs.loadingCover&&t.$refs.loadingCover.hide()},fail:function(i){t.$refs.loadingCover&&t.$refs.loadingCover.hide()}})},toPintuanDetail:function(t){this.$util.redirectTo("/pages_promotion/pintuan/detail",{pintuan_id:this.groupDetail.pintuan_id})},toDetail:function(t,i){this.$util.redirectTo("/pages_promotion/pintuan/detail",{pintuan_id:this.groupDetail.pintuan_id,group_id:i})},imageError:function(){this.groupDetail.sku_image=this.$util.getDefaultImage().goods,this.$forceUpdate()},openSharePopup:function(){this.$refs.sharePopup.open()},closeSharePopup:function(){this.$refs.sharePopup.close()},copyUrl:function(){var t=this,i=this.$config.h5Domain+"/pages_promotion/pintuan/detail?pintuan_id="+this.groupDetail.pintuan_id+"&group_id="+this.groupDetail.group_id;this.memberId&&(i+="&source_member="+this.memberId),this.$util.copy(i,(function(){t.closeSharePopup()}))},orderDetail:function(t){switch(parseInt(t.order_type)){case 2:this.$util.redirectTo("/pages/order/detail_pickup",{order_id:t.order_id});break;case 3:this.$util.redirectTo("/pages/order/detail_local_delivery",{order_id:t.order_id});break;case 4:this.$util.redirectTo("/pages_tool/order/detail_virtual",{order_id:t.order_id});break;default:this.$util.redirectTo("/pages/order/detail",{order_id:t.order_id});break}},setPublicShare:function(){var t=this.$config.h5Domain+"/pages_promotion/pintuan/detail?pintuan_id="+this.groupDetail.pintuan_id+"&group_id="+this.groupDetail.group_id;this.memberId&&(t+="&source_member="+this.memberId),this.$util.setPublicShare({title:this.groupDetail.sku_name,desc:"还差"+(this.groupDetail.pintuan_num-this.groupDetail.pintuan_count)+"人就拼团成功了",link:t,imgUrl:this.groupDetail.sku_image})},openPosterPopup:function(){this.getGoodsPoster(),this.$refs.sharePopup.close()},closePosterPopup:function(){this.$refs.posterPopup.close()},getGoodsPoster:function(){var t=this;uni.showLoading({title:"海报生成中..."});var i={id:this.groupDetail.pintuan_id,group_id:this.groupDetail.group_id};this.$api.sendRequest({url:"/pintuan/api/goods/poster",data:{page:"/pages_promotion/pintuan/detail",qrcode_param:JSON.stringify(i)},success:function(i){0==i.code?(t.poster=i.data.path+"?time="+(new Date).getTime(),t.$refs.posterPopup.open()):(t.posterMsg=i.message,t.$util.showToast({title:t.posterMsg})),uni.hideLoading()},fail:function(t){uni.hideLoading()}})},getShareImg:function(){var t=this,i={id:this.groupDetail.pintuan_id};this.$api.sendRequest({url:"/pintuan/api/goods/shareimg",data:{page:"/pages_promotion/pintuan/detail",qrcode_param:JSON.stringify(i)},success:function(i){0==i.code&&(t.shareImg=i.data.path)}})}},onShareAppMessage:function(t){var i="/pages_promotion/pintuan/detail?pintuan_id="+this.groupDetail.pintuan_id+"&group_id="+this.groupDetail.group_id;return this.memberId&&(i+="&source_member="+this.memberId),{title:"还差"+(this.groupDetail.pintuan_num-this.groupDetail.pintuan_count)+"人拼团成功，"+this.groupDetail.sku_name,imageUrl:this.shareImg?this.$util.img(this.shareImg):this.$util.img(this.groupDetail.sku_image,{size:"big"}),path:i,success:function(t){},fail:function(t){}}}};i.default=o},"8f28":function(t,i,e){"use strict";e.r(i);var n=e("013c"),a=e.n(n);for(var o in n)["default"].indexOf(o)<0&&function(t){e.d(i,t,(function(){return n[t]}))}(o);i["default"]=a.a},"93e5":function(t,i,e){"use strict";e.r(i);var n=e("831a"),a=e.n(n);for(var o in n)["default"].indexOf(o)<0&&function(t){e.d(i,t,(function(){return n[t]}))}(o);i["default"]=a.a},"9ffa":function(t,i,e){"use strict";var n=e("667f"),a=e.n(n);a.a},becd:function(t,i,e){"use strict";e.d(i,"b",(function(){return n})),e.d(i,"c",(function(){return a})),e.d(i,"a",(function(){}));var n=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("v-uni-view",{staticClass:"uni-countdown"},[t.showDay&&t.d>0?e("v-uni-view",{staticClass:"uni-countdown__number",class:[t.backgroundColorClass,t.colorClass,t.borderColorClass],style:{borderColor:t.borderColor,color:t.color,background:t.backgroundColor}},[t._v(t._s(t.d))]):t._e(),t.showDay&&t.d>0?e("v-uni-view",{staticClass:"uni-countdown__splitor day",class:t.splitorColorClass,style:{color:t.splitorColor}},[t._v(t._s((t.showColon,"天")))]):t._e(),e("v-uni-view",{staticClass:"uni-countdown__number",class:[t.backgroundColorClass,t.colorClass,t.borderColorClass],style:{borderColor:t.borderColor,color:t.color,background:t.backgroundColor}},[t._v(t._s(t.h))]),e("v-uni-view",{staticClass:"uni-countdown__splitor",class:t.splitorColorClass,style:{color:t.splitorColor}},[t._v(t._s(t.showColon?":":"时"))]),e("v-uni-view",{staticClass:"uni-countdown__number",class:[t.backgroundColorClass,t.colorClass,t.borderColorClass],style:{borderColor:t.borderColor,color:t.color,background:t.backgroundColor}},[t._v(t._s(t.i))]),e("v-uni-view",{staticClass:"uni-countdown__splitor",class:t.splitorColorClass,style:{color:t.splitorColor}},[t._v(t._s(t.showColon?":":"分"))]),e("v-uni-view",{staticClass:"uni-countdown__number",class:[t.backgroundColorClass,t.colorClass,t.borderColorClass],style:{borderColor:t.borderColor,color:t.color,background:t.backgroundColor}},[t._v(t._s(t.s))]),t.showColon?t._e():e("v-uni-view",{staticClass:"uni-countdown__splitor",class:t.splitorColorClass,style:{color:t.splitorColor}},[t._v("秒")])],1)},a=[]},e0b9:function(t,i,e){var n=e("24fb");i=n(!1),i.push([t.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.page[data-v-6c06c9be]{background:#f3f3f3;min-height:100vh}.pintuan-wrap .pintuan-list[data-v-6c06c9be]{position:relative;height:%?360?%}.pintuan-wrap .pintuan-list .pintuan-bg[data-v-6c06c9be]{width:100%;background-color:var(--pintuan-promotion-color);height:%?220?%}.pintuan-wrap .pintuan-list .list-item[data-v-6c06c9be]{position:absolute;top:%?90?%;display:flex;margin:0 %?24?%;padding:%?30?%;width:calc(100% - %?48?%);height:%?264?%;border-radius:%?18?%;box-sizing:border-box;background-color:#fff}.pintuan-wrap .pintuan-list .list-item .item-image[data-v-6c06c9be]{overflow:hidden;margin-right:%?34?%;width:%?192?%;height:%?192?%;border-radius:%?10?%}.pintuan-wrap .pintuan-list .list-item .item-image uni-image[data-v-6c06c9be]{width:100%;height:100%}.pintuan-wrap .pintuan-list .list-item .item-desc[data-v-6c06c9be]{flex:1;display:flex;flex-direction:column;width:calc(100% - %?226?%);position:relative}.pintuan-wrap .pintuan-list .list-item .item-desc .desc-title[data-v-6c06c9be]{overflow:hidden;font-size:%?30?%;font-weight:700;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:%?42?%;color:#303133;word-wrap:break-word}.pintuan-wrap .pintuan-list .list-item .item-desc .pintuan-num[data-v-6c06c9be]{display:flex;align-items:center;line-height:1;margin-top:%?10?%}.pintuan-wrap .pintuan-list .list-item .item-desc .pintuan-num uni-text[data-v-6c06c9be]{display:flex;align-items:center;justify-content:center;border:0;padding:%?6?%;margin-right:%?24?%;font-size:%?24?%;border-radius:%?4?%}.pintuan-wrap .pintuan-list .list-item .item-desc .pintuan-num uni-text[data-v-6c06c9be]:nth-child(1){background:linear-gradient(270deg,var(--pintuan-promotion-color),var(--pintuan-promotion-aux-color));color:#fff;font-size:%?20?%}.pintuan-wrap .pintuan-list .list-item .item-desc .color-tip[data-v-6c06c9be]{line-height:1;position:absolute;bottom:%?10?%}.pintuan-wrap .pintuan-list .list-item .item-desc .color-tip .price-btn[data-v-6c06c9be]{margin-right:%?4?%}.pintuan-wrap .pintuan-list .list-item .item-desc .color-tip .old-price[data-v-6c06c9be]{text-decoration:line-through}.pintuan-wrap .pintuan-list .list-item .item-desc .color-tip .large[data-v-6c06c9be]{font-weight:700}.pintuan-wrap .pintuan-clustering[data-v-6c06c9be]{padding:%?50?% 0 %?46?%;margin:%?20?% %?24?%;background-color:#fff;border-radius:%?18?%}.pintuan-wrap .pintuan-clustering .tips[data-v-6c06c9be]{font-size:%?28?%;text-align:center}.pintuan-wrap .pintuan-clustering .tips .tips-title[data-v-6c06c9be]{line-height:1;margin-bottom:%?20?%;font-size:%?36?%;font-weight:700}.pintuan-wrap .pintuan-clustering .tips.text[data-v-6c06c9be]{font-size:%?36?%;font-weight:700}.pintuan-wrap .headimg-group[data-v-6c06c9be]{padding-top:%?30?%;padding-bottom:%?40?%;background-color:#fff;line-height:1;text-align:center}.pintuan-wrap .headimg-group .group-member[data-v-6c06c9be],\n.pintuan-wrap .headimg-group .group-image[data-v-6c06c9be]{position:relative;width:%?90?%;height:%?90?%;margin:0 %?20?% %?20?% 0;display:inline-block}.pintuan-wrap .headimg-group .group-member .member-face[data-v-6c06c9be],\n.pintuan-wrap .headimg-group .group-image .member-face[data-v-6c06c9be]{width:%?90?%;height:%?90?%;border-radius:50%;overflow:hidden;line-height:1}.pintuan-wrap .headimg-group .group-member .mark[data-v-6c06c9be],\n.pintuan-wrap .headimg-group .group-image .mark[data-v-6c06c9be]{white-space:nowrap;position:absolute;z-index:5;color:#fff;line-height:1;font-size:%?24?%;padding:%?4?% %?10?%;border-radius:%?28?%;left:50%;bottom:%?-14?%;-webkit-transform:translate(-50%,-20%);transform:translate(-50%,-20%);background-color:var(--main-color)}.pintuan-wrap .headimg-group .group-image .member-face[data-v-6c06c9be]{width:%?82?%;height:%?82?%;border:%?4?% solid}.pintuan-wrap .headimg-group uni-image[data-v-6c06c9be]{width:100%;height:100%}.pintuan-wrap .pintuan-btn[data-v-6c06c9be]{width:%?560?%;height:%?84?%;line-height:%?84?%;margin:%?22?% auto 0;font-size:%?32?%}.pintuan-playing[data-v-6c06c9be]{margin:%?8?% %?24?% 0;width:calc(100% - %?48?%);border-radius:%?18?%;overflow:hidden;background-color:#fff}.pintuan-playing .pintuan-step-title[data-v-6c06c9be]{display:flex;align-items:center;justify-content:center;font-size:%?36?%;color:#222;padding:%?36?% 0 0;font-weight:700}.pintuan-playing .pintuan-step-title[data-v-6c06c9be]::before{content:"";background-color:#222;width:%?20?%;height:%?5?%;display:block;margin-right:%?10?%}.pintuan-playing .pintuan-step-title[data-v-6c06c9be]::after{content:"";background-color:#222;width:%?20?%;height:%?5?%;display:block;margin-left:%?10?%}.pintuan-playing .pintuan-step-list[data-v-6c06c9be]{display:flex;justify-content:space-around;padding:%?40?% %?24?%}.pintuan-playing .pintuan-step-list .pintuan-step[data-v-6c06c9be]{text-align:center}.pintuan-playing .pintuan-step-list .pintuan-step .step-img[data-v-6c06c9be]{width:%?64?%;height:%?64?%;margin:0 auto}.pintuan-playing .pintuan-step-list .pintuan-step .step-img uni-image[data-v-6c06c9be]{width:100%;height:100%}.pintuan-playing .pintuan-step-list .pintuan-step .step-text[data-v-6c06c9be]{margin-top:%?6?%}.pintuan-playing .pintuan-step-list .pintuan-step .step-text > uni-view[data-v-6c06c9be]{line-height:1.3;font-size:%?26?%}.pintuan-playing .pintuan-step-list .pintuan-step-point[data-v-6c06c9be]{display:flex;flex-direction:row;align-items:center;padding:0 %?14?%}.pintuan-playing .pintuan-step-list .pintuan-step-point > uni-view[data-v-6c06c9be]{width:%?10?%;height:%?10?%;border-radius:50%;background-color:#ff8f90}.pintuan-playing .pintuan-step-list .pintuan-step-point > uni-view[data-v-6c06c9be]:first-child{margin-right:%?10?%;background-color:#ffe0e1}.pintuan-playing .pintuan-step-list .pintuan-step-point > uni-view[data-v-6c06c9be]:last-child{margin-left:%?10?%;background-color:#f94547}uni-button.one_btn[data-v-6c06c9be]{background-color:#fff;border:%?2?% solid #ccc;color:#909399}.share-btn[data-v-6c06c9be]{margin-top:%?20?%;background-color:#fff;border:1px solid}.share-popup .share-title[data-v-6c06c9be],\n.uni-popup__wrapper-box .share-title[data-v-6c06c9be]{line-height:%?60?%;font-size:%?32?%;padding:%?15?% 0;text-align:center}.share-popup .share-content[data-v-6c06c9be],\n.uni-popup__wrapper-box .share-content[data-v-6c06c9be]{display:flex;display:-webkit-flex;-webkit-flex-wrap:wrap;-moz-flex-wrap:wrap;-ms-flex-wrap:wrap;-o-flex-wrap:wrap;flex-wrap:wrap;padding:%?15?%}.share-popup .share-content .share-box[data-v-6c06c9be],\n.uni-popup__wrapper-box .share-content .share-box[data-v-6c06c9be]{flex:1;text-align:center}.share-popup .share-content .share-box .share-btn[data-v-6c06c9be],\n.uni-popup__wrapper-box .share-content .share-box .share-btn[data-v-6c06c9be]{margin:0;padding:0;border:none;line-height:1;height:auto;background:unset}.share-popup .share-content .share-box .share-btn uni-text[data-v-6c06c9be],\n.uni-popup__wrapper-box .share-content .share-box .share-btn uni-text[data-v-6c06c9be]{margin-top:%?20?%;font-size:%?24?%;display:block;color:#303133}.share-popup .share-content .share-box .iconfont[data-v-6c06c9be],\n.uni-popup__wrapper-box .share-content .share-box .iconfont[data-v-6c06c9be]{font-size:%?80?%;line-height:normal}.share-popup .share-content .share-box .icon-fuzhilianjie[data-v-6c06c9be],\n.share-popup .share-content .share-box .icon-pengyouquan[data-v-6c06c9be],\n.share-popup .share-content .share-box .icon-haowuquan[data-v-6c06c9be],\n.share-popup .share-content .share-box .icon-share-friend[data-v-6c06c9be],\n.uni-popup__wrapper-box .share-content .share-box .icon-fuzhilianjie[data-v-6c06c9be],\n.uni-popup__wrapper-box .share-content .share-box .icon-pengyouquan[data-v-6c06c9be],\n.uni-popup__wrapper-box .share-content .share-box .icon-haowuquan[data-v-6c06c9be],\n.uni-popup__wrapper-box .share-content .share-box .icon-share-friend[data-v-6c06c9be]{color:#07c160}.share-popup .share-footer[data-v-6c06c9be],\n.uni-popup__wrapper-box .share-footer[data-v-6c06c9be]{height:%?90?%;line-height:%?90?%;border-top:%?2?% #f5f5f5 solid;text-align:center;color:#666}.poster-layer[data-v-6c06c9be] .uni-popup__wrapper.center{width:100vw!important;height:100vh!important;background:none!important}.poster-layer[data-v-6c06c9be] .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box{max-width:100vw!important;max-height:100vh!important;background:none!important;width:100vw;height:100vh}.poster-layer .poster-wrap[data-v-6c06c9be]{display:flex;align-items:center;justify-content:center;width:100vw;height:100vh;flex-direction:column}.poster-layer .generate-poster[data-v-6c06c9be]{padding:%?40?% 0}.poster-layer .generate-poster .iconfont[data-v-6c06c9be]{font-size:%?80?%;color:#07c160;line-height:normal}.poster-layer .generate-poster > uni-view[data-v-6c06c9be]{text-align:center}.poster-layer .generate-poster > uni-view[data-v-6c06c9be]:last-child{margin-top:%?20?%}.poster-layer .image-wrap[data-v-6c06c9be]{width:80%;position:relative}.poster-layer .image-wrap uni-image[data-v-6c06c9be]{width:100%;line-height:1;border-radius:%?10?%;overflow:hidden}.poster-layer .msg[data-v-6c06c9be]{padding:%?40?%}.poster-layer .save-btn[data-v-6c06c9be]{text-align:center;height:%?80?%;line-height:%?80?%;background-color:var(--base-color);border-radius:%?10?%;width:80%;color:#fff;margin-top:%?30?%}.poster-layer .save-text[data-v-6c06c9be]{color:#fff;margin-top:%?10?%}.poster-layer .close[data-v-6c06c9be]{position:absolute;top:0;right:%?20?%;width:%?40?%;height:%?80?%;font-size:%?50?%;color:#999}.fixed-box[data-v-6c06c9be]{position:fixed;right:%?20?%;bottom:%?300?%;z-index:10;background:#fff;box-shadow:%?2?% %?2?% %?22?% rgba(0,0,0,.3);border-radius:%?120?%;padding:%?20?% 0;display:flex;justify-content:center;flex-direction:column;width:%?120?%;box-sizing:border-box;transition:.3s;overflow:hidden}.fixed-box .btn-item[data-v-6c06c9be]{display:flex;justify-content:center;text-align:center;flex-direction:column;line-height:1;margin:%?14?% 0;transition:.1s}.fixed-box .btn-item uni-text[data-v-6c06c9be]{font-size:%?44?%;font-weight:700}.fixed-box .btn-item uni-view[data-v-6c06c9be]{font-size:%?26?%;font-weight:700}.fixed-box .btn-item.show[data-v-6c06c9be]{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.fixed-box .btn-item.icon-xiala[data-v-6c06c9be]{margin:0;margin-top:%?0.1?%}',""]),t.exports=i},e4b4:function(t,i,e){var n=e("24fb");i=n(!1),i.push([t.i,".countdown[data-v-6c06c9be] .uni-countdown{margin-left:%?10?%}.countdown[data-v-6c06c9be] .uni-countdown__number{min-width:%?32?%;height:%?32?%;text-align:center;line-height:%?32?%;border-radius:4px;display:inline-block;padding:%?4?%;margin:0;border:none}.countdown[data-v-6c06c9be] .uni-countdown__splitor{width:%?10?%;height:%?32?%;line-height:%?36?%;text-align:center;display:inline-block}.countdown[data-v-6c06c9be] .uni-countdown__splitor.day{width:auto}",""]),t.exports=i}}]);