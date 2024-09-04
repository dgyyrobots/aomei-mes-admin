<template>
  <div style="padding: 0 15px" @click="toggleClick">
    <svg t="1685775766735" :class="{ 'is-active': isActive }" class="hamburger" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2729" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
      <path
        d="M921.6 853.33333333v68.26666667H102.4v-68.26666667h819.2zM170.66666667 283.06773333L399.59893333 512 170.66666667 740.93226667l-48.26453334-48.26453334L303.06986667 512l-180.66773334-180.66773333L170.66666667 283.06773333zM921.6 614.4v68.26666667H477.86666667v-68.26666667h443.73333333z m0-273.06666667v68.26666667H477.86666667v-68.26666667h443.73333333z m0-238.93333333v68.26666667H102.4V102.4h819.2z"
        fill="#515151"
        p-id="2730"
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick');
    },
  },
};
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
