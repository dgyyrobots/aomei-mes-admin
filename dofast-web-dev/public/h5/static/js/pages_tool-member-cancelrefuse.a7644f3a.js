(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages_tool-member-cancelrefuse"],{"013c":function(t,e,n){"use strict";n("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n("c975"),n("a9e3"),n("ac1f"),n("5319"),n("acd8");var a={type:"scrolldone",target:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},currentTarget:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},detail:{}},o={props:{backgroundTextStyle:{type:String,default:"dark",validator:function(t){return-1!==["dark","light"].indexOf(t)}},backgroundColor:{type:String,default:"#ffffff"},backgroundColorTop:{type:String,default:"#ffffff"},backgroundColorBottom:{type:String,default:"#ffffff"},scrollTop:{type:String,default:""},scrollDuration:{type:Number,default:300},pageStyle:{type:String,default:""},enablePullDownRefresh:{type:[Boolean,String],default:!1},rootFontSize:{type:String,default:""}},created:function(){var t=this,e=getCurrentPages()[0];this.$pageVm=e.$vm||e,uni.onWindowResize((function(e){t.$emit("resize",e)})),this.$pageVm.$on("hook:onPageScroll",(function(e){t.$emit("scroll",e)})),this.$watch("backgroundTextStyle",(function(){t.setBackgroundTextStyle()})),this.$watch((function(){return[t.rootFontSize,t.pageStyle]}),(function(){t.setPageMeta()})),this.$watch((function(){return[t.backgroundColor,t.backgroundColorTop,t.backgroundColorBottom]}),(function(){t.setBackgroundColor()})),this.$watch((function(){return[t.scrollTop,t.scrollDuration]}),(function(){t.pageScrollTo()}))},beforeMount:function(){this.setBackgroundColor(),(this.rootFontSize||this.pageStyle)&&this.setPageMeta(),this.backgroundTextStyle&&this.setBackgroundTextStyle()},mounted:function(){this.scrollTop&&this.pageScrollTo()},methods:{setPullDownRefresh:function(t,e){t.setStyle({pullToRefresh:{support:e,style:"Android"===plus.os.name?"circle":"default"}})},setPageMeta:function(){uni.setPageMeta({pageStyle:this.pageStyle,rootFontSize:this.rootFontSize})},setBackgroundTextStyle:function(){},setBackgroundColor:function(){},pageScrollTo:function(){var t=this,e=String(this.scrollTop);if(-1!==e.indexOf("rpx")&&(e=uni.upx2px(e.replace("rpx",""))),e=parseFloat(e),!isNaN(e)){var n=function n(o){o.scrollTop===e&&(t.$pageVm.$off("hook:onPageScroll",n),t.$emit("scrolldone",a))};uni.pageScrollTo({scrollTop:e,duration:this.scrollDuration,success:function(){t.$pageVm.$on("hook:onPageScroll",n)}})}}}};e.default=o},"24d7":function(t,e,n){"use strict";n.r(e);var a=n("b375"),o=n.n(a);for(var i in a)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return a[t]}))}(i);e["default"]=o.a},"2a10":function(t,e,n){var a=n("cf35");a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var o=n("4f06").default;o("2db16b14",a,!0,{sourceMap:!1,shadowMode:!1})},"2cdd":function(t,e,n){"use strict";n.r(e);var a=n("a1ff"),o=n("24d7");for(var i in o)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return o[t]}))}(i);n("e069");var c=n("f0c5"),r=Object(c["a"])(o["default"],a["b"],a["c"],!1,null,"4ef99c1c",null,!1,a["a"],void 0);e["default"]=r.exports},"6d42":function(t,e,n){"use strict";n.r(e);var a=n("6ee6"),o=n("8f28");for(var i in o)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return o[t]}))}(i);var c=n("f0c5"),r=Object(c["a"])(o["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],void 0);e["default"]=r.exports},"6ee6":function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){}));var a=function(){var t=this.$createElement,e=this._self._c||t;return e("v-uni-view",{staticStyle:{display:"none"}},[this._t("default")],2)},o=[]},"8f28":function(t,e,n){"use strict";n.r(e);var a=n("013c"),o=n.n(a);for(var i in a)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return a[t]}))}(i);e["default"]=o.a},a1ff:function(t,e,n){"use strict";n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return i})),n.d(e,"a",(function(){return a}));var a={pageMeta:n("6d42").default},o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",[n("page-meta",{attrs:{"page-style":t.themeColor}}),n("v-uni-view",{staticClass:"container"},[n("v-uni-view",{staticClass:"cancel-wrap"},[n("v-uni-view",{staticClass:"cancel-img"},[n("v-uni-image",{attrs:{src:t.$util.img("public/uniapp/member/refuse.png")}})],1),n("v-uni-view",{staticClass:"cancel-title"},[t._v("您的申请已拒绝")]),n("v-uni-view",{staticClass:"cancel-reason"},[t._v("拒绝理由："+t._s(t.reason))]),n("v-uni-view",{staticClass:"cancel-btn"},[n("v-uni-button",{attrs:{type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.toIndex.apply(void 0,arguments)}}},[t._v("返回")]),n("v-uni-button",{staticClass:"color-base-bg",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.apply.apply(void 0,arguments)}}},[t._v("重新申请")])],1)],1)],1)],1)},i=[]},b375:function(t,e,n){"use strict";n("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={components:{},data:function(){return{reason:""}},onLoad:function(t){t.back&&(this.back=t.back),uni.getStorageSync("token")?this.getStatus():this.$util.redirectTo("/pages_tool/login/login")},methods:{getStatus:function(){var t=this;this.$api.sendRequest({url:"/membercancel/api/membercancel/info",success:function(e){e.code>=0&&(t.reason=e.data.reason)}})},toIndex:function(){this.$util.redirectTo("/pages/member/index")},apply:function(){this.$util.redirectTo("/pages_tool/member/cancellation")}}};e.default=a},cf35:function(t,e,n){var a=n("24fb");e=a(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.cancel-wrap[data-v-4ef99c1c]{padding-top:%?300?%;text-align:center}.cancel-wrap .cancel-img[data-v-4ef99c1c]{width:%?150?%;height:%?150?%;display:inline-block}.cancel-wrap .cancel-img uni-image[data-v-4ef99c1c]{width:100%;height:100%}.cancel-wrap .cancel-title[data-v-4ef99c1c]{text-align:center;font-size:%?32?%;line-height:%?32?%;margin-top:%?30?%}.cancel-wrap .cancel-reason[data-v-4ef99c1c]{color:#838383;font-size:%?28?%;line-height:%?50?%;margin-top:%?20?%;padding:0 %?75?%}.cancel-wrap .cancel-btn[data-v-4ef99c1c]{display:flex;justify-content:center;align-items:center;width:100%;margin-top:%?173?%}.cancel-wrap .cancel-btn uni-button[data-v-4ef99c1c]{width:%?300?%;height:%?84?%;font-size:%?28?%;line-height:%?84?%;margin:0 %?15?%;border-radius:%?10?%}.cancel-wrap .cancel-btn uni-button[type="primary"][data-v-4ef99c1c]{background-color:unset!important;color:#333;border:%?2?% solid #ddd}.cancel-wrap .cancel-btn uni-button[data-v-4ef99c1c]:nth-child(2){color:#fff}',""]),t.exports=e},e069:function(t,e,n){"use strict";var a=n("2a10"),o=n.n(a);o.a}}]);