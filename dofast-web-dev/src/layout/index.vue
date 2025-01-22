<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar v-if="!sidebar.hide" class="sidebar-container" :class="{ showSubmenu }" @submenu="showSubmenu = $event" />
    <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide, submenu, showSubmenu }" class="main-container">
      <div class="h-1px mt--1px"></div>
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar :show-submenu="showSubmenu" />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel max-width="300px">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel';
import {
  AppMain, Navbar, Settings, Sidebar, TagsView } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import { mapState, mapGetters } from 'vuex';
import variables from '@/assets/styles/variables.scss';

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
  },
  data() {
    return {
      showSubmenu: false,
    };
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      theme: state => state.settings.theme,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
    }),
    ...mapGetters({
      sideTheme: 'settings/sideTheme',
      submenu: 'settings/submenu',
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      };
    },
    variables() {
      return variables;
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
@import '~@/assets/styles/variables.scss';

.hideSidebar .submenu.showSubmenu .fixed-header {
  width: calc(100% - 108px);
}
.submenu .fixed-header {
  width: calc(100% - #{$base-submenu-sidebar-width - $base-sidebar-width});
  z-index: 1002;
}
.submenu.showSubmenu .fixed-header {
  width: calc(100% - #{$base-submenu-sidebar-width});
  z-index: 1002;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: calc(100%);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
