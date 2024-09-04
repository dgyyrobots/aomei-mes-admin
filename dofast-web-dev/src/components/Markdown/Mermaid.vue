<template>
  <div v-html="html"></div>
</template>
<script>
import mermaid from 'mermaid';
let i = 0;
export default {
  props: {
    nodes: {
      type: [Array, String],
      default: '',
    },
    options: {
      type: Object,
      default() {
        return {
          securityLevel: 'loose',
          startOnLoad: false,
          theme: 'default',
        };
      },
    },
  },
  computed: {
    node_id() {
      return 'mermaid_' + i++;
    },
  },
  data() {
    return {
      html: '',
    };
  },
  watch: {
    nodes: {
      async handler(nodes) {
        console.log(mermaid);
        if (nodes && nodes.length) {
          mermaid.init(this.options);
          const result = await mermaid.render(this.node_id, nodes);
          this.html = result;
          console.log(this.$el);
          return;
        }
        this.html = '';
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
