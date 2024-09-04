<template>
  <div
    :class="{ 'has-logo': showLogo, submenu }"
    :style="{
      backgroundColor: sideTheme === 'theme-dark' ? (submenu ? variables.menu500Background : variables.menuBackground) : variables.menuLightBackground,
    }"
  >
    <logo v-if="showLogo && !submenu" :collapse="isCollapse" />
    <el-scrollbar
      :class="sideTheme"
      wrap-class="scrollbar-wrapper"
      :key="1"
      :style="{
        backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : submenu ? variables.menuLight500Background : variables.menuLightBackground,
      }"
    >
      <el-menu
        :default-active="mainActiveMenu"
        :collapse="isCollapse"
        :background-color="sideTheme === 'theme-dark' ? variables.menuBackground : submenu ? variables.menuLight500Background : variables.menuLightBackground"
        :text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 根据 sidebarRouters 路由，生成菜单 -->
        <sidebar-item
          v-for="(route, index) in sidebarMainRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
          :to-event="submenu && route.nodes && (route.nodes.length > 1 || (route.nodes.length == 1 && route.redirect))"
          @click="setExtendRoutes(route.nodes, route.path)"
          :mode="submenu ? 'vertical' : 'horizontal'"
        />
      </el-menu>
    </el-scrollbar>
    <el-scrollbar class="submenu-menu" :class="sideTheme" v-if="submenu" v-show="showExtendMenu" wrap-class="scrollbar-wrapper" :key="2">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="sideTheme === 'theme-dark' ? variables.menu500Background : variables.menuLightBackground"
        :text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 根据 sidebarRouters 路由，生成菜单 -->
        <sidebar-item v-for="(route, index) in sidebarExtendRouters" :key="route.path + index" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/assets/styles/variables.scss';

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      sidebarExtendRouters: [],
    };
  },
  computed: {
    ...mapState(['settings']),
    ...mapGetters({
      sidebarRouters: 'sidebarRouters',
      sidebar: 'sidebar',
      submenu: 'settings/submenu',
      sideTheme: 'settings/sideTheme',
    }),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    mainActiveMenu() {
      const route = this.$route;
      const { meta, path, matched } = route;
      // if set path, the sidebar will highlight the path you set
      if (this.submenu) {
        if (matched?.length) {
          this.$nextTick(() => {
            for (let i = 0; i < this.sidebarMainRouters.length; i++) {
              const menu = this.sidebarMainRouters[i];
              if (menu.name == matched[0].name) {
                this.setExtendRoutes(menu.nodes, menu.path);
                return;
              }
            }
            this.setExtendRoutes([]);
          });
          return matched[0].path;
        }
      }
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    sidebarMainRouters() {
      if (this.submenu) {
        return this.sidebarRouters
          .filter(item => {
            return typeof item.parentId === 'undefined' || item.parentId <= 0;
          })
          .map(item => {
            if (item.redirect && item.children.length == 1) {
              return item;
            }
            return {
              ...item,
              alwaysShow: false,
              nodes: item.children,
              children: [],
            };
          });
      }
      return this.sidebarRouters;
    },
    showExtendMenu() {
      return (
        this.sidebarExtendRouters &&
        this.sidebarExtendRouters.filter(item => {
          return item.meta;
        }).length
      );
    },
  },
  methods: {
    setExtendRoutes(routes, parentPath) {
      routes = routes || [];
      this.sidebarExtendRouters = routes
        .filter(item => {
          return item.visible;
        })
        .map(item => {
          return {
            ...item,
            path: [parentPath, item.path].join('/'),
          };
        });
      this.$emit('submenu', this.showExtendMenu);
    },
  },
};
</script>
