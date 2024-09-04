<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'DofastDoc',
  data() {
    return {
      url: 'https://doc.huizhizao.vip/',
    };
  },
  methods: {
    goto() {
      window.open(this.url);
    },
  },
};
</script>
