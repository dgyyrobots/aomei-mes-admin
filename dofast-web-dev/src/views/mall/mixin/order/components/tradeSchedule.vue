<template>
  <easy-panel></easy-panel>
</template>
<script>
import easyPanel from './easy-panel.vue';

export default {
  props: ['orderId'],
  components: {
    easyPanel,
  },
};
</script>
