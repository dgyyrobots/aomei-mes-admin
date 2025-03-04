<template>
  <div v-loading="loading" :style="'height:' + height">
    <iframe id="testIframe" :src="src" frameborder="no" style="width: 100%; height: 100%" scrolling="auto" />
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 94.5 + 'px;',
      loading: true,
      url: this.src,
    };
  },
  mounted: function () {
    var that = this;
    this.iframe = document.getElementById('testIframe');
    this.iframe.onload = function () {
      let param = {
        userName: "AAA"
      }
      this.iframe.contentWindow.postMessage(param, '*')
    }

    setTimeout(() => {
      this.loading = false;
    }, 300);
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 94.5 + 'px;';
    };
  },
};
</script>
