(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages_tool-member-cancelstatus"],{"013c":function(t,e,a){"use strict";a("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,a("c975"),a("a9e3"),a("ac1f"),a("5319"),a("acd8");var n={type:"scrolldone",target:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},currentTarget:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},detail:{}},o={props:{backgroundTextStyle:{type:String,default:"dark",validator:function(t){return-1!==["dark","light"].indexOf(t)}},backgroundColor:{type:String,default:"#ffffff"},backgroundColorTop:{type:String,default:"#ffffff"},backgroundColorBottom:{type:String,default:"#ffffff"},scrollTop:{type:String,default:""},scrollDuration:{type:Number,default:300},pageStyle:{type:String,default:""},enablePullDownRefresh:{type:[Boolean,String],default:!1},rootFontSize:{type:String,default:""}},created:function(){var t=this,e=getCurrentPages()[0];this.$pageVm=e.$vm||e,uni.onWindowResize((function(e){t.$emit("resize",e)})),this.$pageVm.$on("hook:onPageScroll",(function(e){t.$emit("scroll",e)})),this.$watch("backgroundTextStyle",(function(){t.setBackgroundTextStyle()})),this.$watch((function(){return[t.rootFontSize,t.pageStyle]}),(function(){t.setPageMeta()})),this.$watch((function(){return[t.backgroundColor,t.backgroundColorTop,t.backgroundColorBottom]}),(function(){t.setBackgroundColor()})),this.$watch((function(){return[t.scrollTop,t.scrollDuration]}),(function(){t.pageScrollTo()}))},beforeMount:function(){this.setBackgroundColor(),(this.rootFontSize||this.pageStyle)&&this.setPageMeta(),this.backgroundTextStyle&&this.setBackgroundTextStyle()},mounted:function(){this.scrollTop&&this.pageScrollTo()},methods:{setPullDownRefresh:function(t,e){t.setStyle({pullToRefresh:{support:e,style:"Android"===plus.os.name?"circle":"default"}})},setPageMeta:function(){uni.setPageMeta({pageStyle:this.pageStyle,rootFontSize:this.rootFontSize})},setBackgroundTextStyle:function(){},setBackgroundColor:function(){},pageScrollTo:function(){var t=this,e=String(this.scrollTop);if(-1!==e.indexOf("rpx")&&(e=uni.upx2px(e.replace("rpx",""))),e=parseFloat(e),!isNaN(e)){var a=function a(o){o.scrollTop===e&&(t.$pageVm.$off("hook:onPageScroll",a),t.$emit("scrolldone",n))};uni.pageScrollTo({scrollTop:e,duration:this.scrollDuration,success:function(){t.$pageVm.$on("hook:onPageScroll",a)}})}}}};e.default=o},4440:function(t,e,a){"use strict";a.r(e);var n=a("be1a5"),o=a("4768");for(var s in o)["default"].indexOf(s)<0&&function(t){a.d(e,t,(function(){return o[t]}))}(s);a("caa5");var c=a("f0c5"),i=Object(c["a"])(o["default"],n["b"],n["c"],!1,null,"982ef59c",null,!1,n["a"],void 0);e["default"]=i.exports},4768:function(t,e,a){"use strict";a.r(e);var n=a("c7e4"),o=a.n(n);for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,(function(){return n[t]}))}(s);e["default"]=o.a},"6adf":function(t,e,a){var n=a("24fb");e=n(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.cancelstatus-wrap .cancelstatus-block[data-v-982ef59c]{padding:%?50?%}.cancelstatus-wrap .cancelstatus-box[data-v-982ef59c]{position:relative;display:flex;height:%?200?%}.cancelstatus-wrap .cancelstatus-box .cancelstatus-box-sort[data-v-982ef59c]{width:%?36?%;height:%?36?%;text-align:center;line-height:%?36?%;border-radius:50%;color:#fff;margin-right:%?17?%;font-size:%?24?%}.cancelstatus-wrap .cancelstatus-box .opacity[data-v-982ef59c]{opacity:1}.cancelstatus-wrap .cancelstatus-box .opacity-4[data-v-982ef59c]{opacity:.4}.cancelstatus-wrap .cancelstatus-box .cancelstatus-box-name[data-v-982ef59c]{font-size:%?32?%;line-height:%?32?%;margin-top:%?3?%}.cancelstatus-wrap .cancelstatus-box .cancelstatus-box-info[data-v-982ef59c]{margin-top:%?15?%;color:#666;font-size:%?28?%}.cancelstatus-wrap .cancelstatus-box .cancelstatus-box-line[data-v-982ef59c]{position:absolute;width:%?2?%;height:%?164?%;top:%?36?%;left:%?18?%}.cancelstatus-wrap .cancelstatus-box.cancelstatus-box-last[data-v-982ef59c]{height:%?80?%}.cancelstatus-wrap .cancelstatus-btn[data-v-982ef59c]{display:flex;justify-content:center;align-items:center;position:fixed;bottom:0;width:100%;height:%?150?%}.cancelstatus-wrap .cancelstatus-btn uni-button[data-v-982ef59c]{width:%?300?%;height:%?80?%;font-size:%?28?%;line-height:%?80?%;margin:0 %?15?%;border-radius:%?10?%}.cancelstatus-wrap .cancelstatus-btn uni-button[type="primary"][data-v-982ef59c]{background-color:unset!important;color:#333;border:%?2?% solid #ddd}.cancelstatus-wrap .cancelstatus-btn uni-button[data-v-982ef59c]:nth-child(2){color:#fff}',""]),t.exports=e},"6d42":function(t,e,a){"use strict";a.r(e);var n=a("6ee6"),o=a("8f28");for(var s in o)["default"].indexOf(s)<0&&function(t){a.d(e,t,(function(){return o[t]}))}(s);var c=a("f0c5"),i=Object(c["a"])(o["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],void 0);e["default"]=i.exports},"6ee6":function(t,e,a){"use strict";a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return o})),a.d(e,"a",(function(){}));var n=function(){var t=this.$createElement,e=this._self._c||t;return e("v-uni-view",{staticStyle:{display:"none"}},[this._t("default")],2)},o=[]},"8f28":function(t,e,a){"use strict";a.r(e);var n=a("013c"),o=a.n(n);for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(e,t,(function(){return n[t]}))}(s);e["default"]=o.a},be1a5:function(t,e,a){"use strict";a.d(e,"b",(function(){return o})),a.d(e,"c",(function(){return s})),a.d(e,"a",(function(){return n}));var n={pageMeta:a("6d42").default},o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",[a("page-meta",{attrs:{"page-style":t.themeColor}}),a("v-uni-view",{staticClass:"container"},[a("v-uni-view",{staticClass:"cancelstatus-wrap"},[a("v-uni-view",{staticClass:"cancelstatus-block"},[a("v-uni-view",{staticClass:"cancelstatus-box"},[a("v-uni-view",{staticClass:"cancelstatus-box-sort color-base-bg"},[t._v("1")]),a("v-uni-view",{staticClass:"cancelstatus-box-con"},[a("v-uni-view",{staticClass:"cancelstatus-box-name"},[t._v("提交申请")]),a("v-uni-view",{staticClass:"cancelstatus-box-info"},[t._v("您已提交申请，请耐心等待~")])],1),a("v-uni-view",{staticClass:"cancelstatus-box-line color-base-bg"})],1),a("v-uni-view",{staticClass:"cancelstatus-box"},[a("v-uni-view",{staticClass:"cancelstatus-box-sort color-base-bg"},[t._v("2")]),a("v-uni-view",{staticClass:"cancelstatus-box-con"},[a("v-uni-view",{staticClass:"cancelstatus-box-name"},[t._v("等待审核")]),a("v-uni-view",{staticClass:"cancelstatus-box-info"},[t._v("等待审核中，审核通过后您的账号将直接被删除")])],1),a("v-uni-view",{staticClass:"cancelstatus-box-line color-base-bg"})],1),a("v-uni-view",{staticClass:"cancelstatus-box cancelstatus-box-last"},[a("v-uni-view",{staticClass:"cancelstatus-box-sort color-base-bg opacity",class:{"opacity-4":1==t.condition}},[t._v("3")]),a("v-uni-view",{staticClass:"cancelstatus-box-con"},[a("v-uni-view",{staticClass:"cancelstatus-box-name"},[t._v("审核通过，注销完成")]),a("v-uni-view",{staticClass:"cancelstatus-box-info"},[t._v("您已成功注销账号，期待下一次与您相遇")])],1)],1)],1),"1"==t.condition?a("v-uni-view",{staticClass:"cancelstatus-btn"},[a("v-uni-button",{attrs:{type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.back.apply(void 0,arguments)}}},[t._v("返回")]),1!=t.state?a("v-uni-button",{staticClass:"color-base-bg",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.revoke.apply(void 0,arguments)}}},[t._v("撤销申请")]):t._e()],1):t._e()],1)],1)],1)},s=[]},c7e4:function(t,e,a){"use strict";a("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={data:function(){return{state:0,condition:""}},onLoad:function(t){uni.getStorageSync("token")?this.getStatus():this.$util.redirectTo("/pages_tool/login/login"),this.condition=t.condition},onShow:function(){this.getStatus()},methods:{getStatus:function(){var t=this;this.$api.sendRequest({url:"/membercancel/api/membercancel/info",success:function(e){e.code>=0&&e.data&&(t.state=e.data.status,-1==t.state&&t.$util.redirectTo("/pages_tool/member/cancelrefuse")),-1==e.code&&(uni.setStorageSync("token",""),t.$util.redirectTo("/pages/index/index"))}})},back:function(){this.$util.redirectTo("/pages/member/index")},revoke:function(){var t=this;uni.showModal({title:"风险提示",content:"确定要撤销申请吗？",confirmColor:"#000000",success:function(e){e.confirm&&t.$api.sendRequest({url:"/membercancel/api/membercancel/cancelApply",success:function(e){e.code>=0&&t.$util.redirectTo("/pages/member/index")}})}})}}};e.default=n},caa5:function(t,e,a){"use strict";var n=a("fa82"),o=a.n(n);o.a},fa82:function(t,e,a){var n=a("6adf");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var o=a("4f06").default;o("bfa197b6",n,!0,{sourceMap:!1,shadowMode:!1})}}]);