<script>
import Order from './index.vue';
export default {
  name: 'OrderCollection',
  render(h) {
    return h(Order, { props: { isSelf: true, 'is-self': true } });
  },
};
</script>
