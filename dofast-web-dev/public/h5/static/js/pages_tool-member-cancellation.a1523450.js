(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages_tool-member-cancellation"],{"013c":function(e,t,n){"use strict";n("7a82"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n("c975"),n("a9e3"),n("ac1f"),n("5319"),n("acd8");var a={type:"scrolldone",target:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},currentTarget:{id:"",offsetLeft:0,offsetTop:0,dataset:{}},detail:{}},r={props:{backgroundTextStyle:{type:String,default:"dark",validator:function(e){return-1!==["dark","light"].indexOf(e)}},backgroundColor:{type:String,default:"#ffffff"},backgroundColorTop:{type:String,default:"#ffffff"},backgroundColorBottom:{type:String,default:"#ffffff"},scrollTop:{type:String,default:""},scrollDuration:{type:Number,default:300},pageStyle:{type:String,default:""},enablePullDownRefresh:{type:[Boolean,String],default:!1},rootFontSize:{type:String,default:""}},created:function(){var e=this,t=getCurrentPages()[0];this.$pageVm=t.$vm||t,uni.onWindowResize((function(t){e.$emit("resize",t)})),this.$pageVm.$on("hook:onPageScroll",(function(t){e.$emit("scroll",t)})),this.$watch("backgroundTextStyle",(function(){e.setBackgroundTextStyle()})),this.$watch((function(){return[e.rootFontSize,e.pageStyle]}),(function(){e.setPageMeta()})),this.$watch((function(){return[e.backgroundColor,e.backgroundColorTop,e.backgroundColorBottom]}),(function(){e.setBackgroundColor()})),this.$watch((function(){return[e.scrollTop,e.scrollDuration]}),(function(){e.pageScrollTo()}))},beforeMount:function(){this.setBackgroundColor(),(this.rootFontSize||this.pageStyle)&&this.setPageMeta(),this.backgroundTextStyle&&this.setBackgroundTextStyle()},mounted:function(){this.scrollTop&&this.pageScrollTo()},methods:{setPullDownRefresh:function(e,t){e.setStyle({pullToRefresh:{support:t,style:"Android"===plus.os.name?"circle":"default"}})},setPageMeta:function(){uni.setPageMeta({pageStyle:this.pageStyle,rootFontSize:this.rootFontSize})},setBackgroundTextStyle:function(){},setBackgroundColor:function(){},pageScrollTo:function(){var e=this,t=String(this.scrollTop);if(-1!==t.indexOf("rpx")&&(t=uni.upx2px(t.replace("rpx",""))),t=parseFloat(t),!isNaN(t)){var n=function n(r){r.scrollTop===t&&(e.$pageVm.$off("hook:onPageScroll",n),e.$emit("scrolldone",a))};uni.pageScrollTo({scrollTop:t,duration:this.scrollDuration,success:function(){e.$pageVm.$on("hook:onPageScroll",n)}})}}}};t.default=r},"039f":function(e,t,n){"use strict";n("7a82");var a=n("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a(n("1247")),o={data:function(){return{agreement:{},isSelect:!1}},onLoad:function(e){e.back&&(this.back=e.back),uni.getStorageSync("token")?this.getCancelAgreement():this.$util.redirectTo("/pages_tool/login/login")},methods:{getCancelAgreement:function(){var e=this;this.$api.sendRequest({url:"/membercancel/api/membercancel/agreement",success:function(t){t.code>=0&&(e.agreement=t.data,e.agreement.content&&(e.agreement.content=(0,r.default)(e.agreement.content)))}})},changeSelect:function(){this.isSelect=1!=this.isSelect},next:function(){this.isSelect?this.$util.redirectTo("/pages_tool/member/assets"):this.$util.showToast({title:"请先勾选同意协议"})}}};t.default=o},"085a":function(e,t,n){"use strict";n.r(t);var a=n("039f"),r=n.n(a);for(var o in a)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return a[e]}))}(o);t["default"]=r.a},1247:function(e,t,n){"use strict";(function(e){n("7a82");var a=n("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n("c975"),n("ac1f"),n("466d"),n("5319"),n("4d63"),n("c607"),n("2c3e"),n("25f0"),n("14d9"),n("13d5"),n("d3b7"),n("3c65");var r=a(n("9fff")),o=/^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,i=/^<\/([-A-Za-z0-9_]+)[^>]*>/,c=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,l=p("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"),s=p("a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video"),u=p("abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"),d=p("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"),f=p("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"),g=p("script,style");function p(e){for(var t={},n=e.split(","),a=0;a<n.length;a++)t[n[a]]=!0;return t}var h=function(t){t=function(e){return e.replace(/<\?xml.*\?>\n/,"").replace(/<!doctype.*>\n/,"").replace(/<!DOCTYPE.*>\n/,"")}(t),t=function(e){return e=e.replace(/<!--[\s\S]*-->/gi,""),e}(t),t=function(e){var t='<img style="width:100% !important;display:block;max-width: '.concat("100%",' !important;"');return e=e.replace(/\\/g,"").replace(/<img/g,t),e=e.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,(function(e,n){return t+' src="'+r.default.img(n)+'"/>'})),e}(t),t=function(e){return e=e.replace(/style\s*=\s*["][^>]*;[^"]?/gi,(function(e,t){return e=e.replace(/[:](\s?)[\s\S]*/gi,(function(e,t){return e.replace(/"/g,"'")})),e})),e}(t);var n=[],a={node:"root",children:[]};return function(e,t){var n,a,r,p=[],h=e;p.last=function(){return this[this.length-1]};while(e){if(a=!0,p.last()&&g[p.last()])e=e.replace(new RegExp("([\\s\\S]*?)</"+p.last()+"[^>]*>"),(function(e,n){return n=n.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g,"$1$2"),t.chars&&t.chars(n),""})),b("",p.last());else if(0==e.indexOf("\x3c!--")?(n=e.indexOf("--\x3e"),n>=0&&(t.comment&&t.comment(e.substring(4,n)),e=e.substring(n+3),a=!1)):0==e.indexOf("</")?(r=e.match(i),r&&(e=e.substring(r[0].length),r[0].replace(i,b),a=!1)):0==e.indexOf("<")&&(r=e.match(o),r&&(e=e.substring(r[0].length),r[0].replace(o,v),a=!1)),a){n=e.indexOf("<");var m=n<0?e:e.substring(0,n);e=n<0?"":e.substring(n),t.chars&&t.chars(m)}if(e==h)throw"Parse Error: "+e;h=e}function v(e,n,a,r){if(n=n.toLowerCase(),s[n])while(p.last()&&u[p.last()])b("",p.last());if(d[n]&&p.last()==n&&b("",n),r=l[n]||!!r,r||p.push(n),t.start){var o=[];a.replace(c,(function(e,t){var n=arguments[2]?arguments[2]:arguments[3]?arguments[3]:arguments[4]?arguments[4]:f[t]?t:"";o.push({name:t,value:n,escaped:n.replace(/(^|[^\\])"/g,'$1\\"')})})),t.start&&t.start(n,o,r)}}function b(e,n){if(n){for(a=p.length-1;a>=0;a--)if(p[a]==n)break}else var a=0;if(a>=0){for(var r=p.length-1;r>=a;r--)t.end&&t.end(p[r]);p.length=a}}b()}(t,{start:function(e,t,r){var o={name:e};if(0!==t.length&&(o.attrs=function(e){return e.reduce((function(e,t){var n=t.value,a=t.name;return e[a]?e[a]=e[a]+" "+n:e[a]=n,e}),{})}(t)),r){var i=n[0]||a;i.children||(i.children=[]),i.children.push(o)}else n.unshift(o)},end:function(t){var r=n.shift();if(r.name!==t&&e("error","invalid state: mismatch end tag"," at common/js/html-parser.js:354"),0===n.length)a.children.push(r);else{var o=n[0];o.children||(o.children=[]),o.children.push(r)}},chars:function(e){var t={type:"text",text:e};if(0===n.length)a.children.push(t);else{var r=n[0];r.children||(r.children=[]),r.children.push(t)}},comment:function(e){var t={node:"comment",text:e},a=n[0];a.children||(a.children=[]),a.children.push(t)}}),a.children};t.default=h}).call(this,n("0de9")["log"])},1517:function(e,t,n){var a=n("8ace");a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var r=n("4f06").default;r("6cd77d48",a,!0,{sourceMap:!1,shadowMode:!1})},"6d42":function(e,t,n){"use strict";n.r(t);var a=n("6ee6"),r=n("8f28");for(var o in r)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return r[e]}))}(o);var i=n("f0c5"),c=Object(i["a"])(r["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],void 0);t["default"]=c.exports},"6ee6":function(e,t,n){"use strict";n.d(t,"b",(function(){return a})),n.d(t,"c",(function(){return r})),n.d(t,"a",(function(){}));var a=function(){var e=this.$createElement,t=this._self._c||e;return t("v-uni-view",{staticStyle:{display:"none"}},[this._t("default")],2)},r=[]},7679:function(e,t,n){"use strict";var a=n("1517"),r=n.n(a);r.a},"8ace":function(e,t,n){var a=n("24fb");t=a(!1),t.push([e.i,'@charset "UTF-8";\n/**\n * 你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n * 建议使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n */.agreement-box .align-center[data-v-7c51d707]{text-align:center}.agreement-box .agreement-intro[data-v-7c51d707]{height:calc(100vh - %?210?%);padding-top:%?40?%;padding-left:%?40?%;padding-right:%?40?%;box-sizing:border-box;overflow-y:auto}.agreement-box .agreement-intro .agreement-title[data-v-7c51d707]{font-size:%?32?%;line-height:%?60?%;margin-bottom:%?10?%}.agreement-box .agreement-intro .agreement-content[data-v-7c51d707]{font-size:%?24?%;line-height:%?44?%}.agreement-box .agreement-btn[data-v-7c51d707]{position:fixed;width:100%;height:%?210?%;bottom:0;padding-top:%?16?%;box-sizing:border-box;text-align:center}.agreement-box .agreement-btn .agreement-btn-select[data-v-7c51d707]{display:flex;justify-content:center;align-items:center}.agreement-box .agreement-btn .agreement-btn-select .iconfont[data-v-7c51d707]{color:#838383}.agreement-box .agreement-btn .agreement-text[data-v-7c51d707]{font-size:%?28?%;color:#838383;margin-left:%?10?%}.agreement-box .agreement-btn uni-button[data-v-7c51d707]{display:inline-block;margin-top:%?20?%;color:var(--btn-text-color);font-size:%?28?%;width:%?300?%;height:%?80?%;line-height:%?80?%}',""]),e.exports=t},"8f28":function(e,t,n){"use strict";n.r(t);var a=n("013c"),r=n.n(a);for(var o in a)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return a[e]}))}(o);t["default"]=r.a},"92e0":function(e,t,n){"use strict";n.r(t);var a=n("c496"),r=n("085a");for(var o in r)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return r[e]}))}(o);n("7679");var i=n("f0c5"),c=Object(i["a"])(r["default"],a["b"],a["c"],!1,null,"7c51d707",null,!1,a["a"],void 0);t["default"]=c.exports},c496:function(e,t,n){"use strict";n.d(t,"b",(function(){return r})),n.d(t,"c",(function(){return o})),n.d(t,"a",(function(){return a}));var a={pageMeta:n("6d42").default},r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-uni-view",[n("page-meta",{attrs:{"page-style":e.themeColor}}),n("v-uni-view",{staticClass:"container"},[n("v-uni-view",{staticClass:"agreement-box"},[n("v-uni-view",{staticClass:"agreement-intro"},[n("v-uni-view",{staticClass:"align-center agreement-title"},[e._v(e._s(e.agreement.title))]),n("v-uni-rich-text",{staticClass:"agreement-content",attrs:{nodes:e.agreement.content}})],1),n("v-uni-view",{staticClass:"agreement-btn"},[n("v-uni-view",{staticClass:"align-center agreement-btn-select"},[e.isSelect?n("v-uni-text",{staticClass:"iconfont icon-dui color-base-text",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.changeSelect.apply(void 0,arguments)}}}):n("v-uni-text",{staticClass:"iconfont icon-yuan_checkbox",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.changeSelect.apply(void 0,arguments)}}}),n("v-uni-text",{staticClass:"agreement-text",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.changeSelect.apply(void 0,arguments)}}},[e._v("勾选即表示您已阅读并同意本协议")])],1),n("v-uni-button",{staticClass:"btn color-base-bg",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.next.apply(void 0,arguments)}}},[e._v("下一步")])],1)],1)],1)],1)},o=[]}}]);