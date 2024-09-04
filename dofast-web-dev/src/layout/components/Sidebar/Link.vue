<template>
  <component :is="type" v-bind="linkProps(to)" @click.native="onClick">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate';

export default {
  props: {
    to: {
      type: String,
      required: true,
    },
    toEvent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.to);
    },
    type() {
      if (this.isExternal || this.toEvent) {
        return 'a';
      }
      return 'router-link';
    },
  },
  methods: {
    onClick(e) {
      if (this.toEvent) {
        console.log(e);
        if (e) {
          e.preventDefault?.();
          e.stopPropagation?.();
        }
        this.$emit('click', to);
      }
    },
    linkProps(to) {
      if (this.toEvent) {
        return {
          href: 'javascript:void(0)',
        };
      }
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener',
        };
      }
      return {
        to: to,
      };
    },
  },
};
</script>
