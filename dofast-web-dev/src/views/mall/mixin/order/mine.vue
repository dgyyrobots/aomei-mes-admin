<script>
import Order from './index.vue';

export default {
  render(h) {
    return h(Order, { props: { isMine: true, 'is-mine': true } });
  },
};
</script>
