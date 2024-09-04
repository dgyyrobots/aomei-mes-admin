<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: 'horizontal',
    },
  },
  render(h, context) {
    const { icon, title, mode } = context.props;
    const vnodes = [];

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon} />);
    }

    if (title) {
      const titleVNode =
        title.length > 5 ? (
          <span slot="title" title={title}>
            {title}
          </span>
        ) : (
          <span slot="title">{title}</span>
        );

      if (mode == 'vertical') {
        vnodes.push(<div slot="title">{titleVNode}</div>);
      } else {
        vnodes.push(titleVNode);
      }
    }
    return vnodes;
  },
};
</script>
