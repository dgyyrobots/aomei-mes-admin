<template>
  <div>
    <div>
      <slot name="header">
        <div>
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
          </el-tooltip>
        </div>
      </slot>
    </div>
    <slot>
      <el-empty></el-empty>
    </slot>
  </div>
</template>
<script>
export default {
  methods: {
    refresh() {
      this.$emit('refresh');
    },
  },
};
</script>
