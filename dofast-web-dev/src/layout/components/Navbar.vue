<template>
  <div class="navbar">
    <div class="hamburger-container logo !static" v-if="showLogo && submenu" style="padding: 0 5px">
      <logo :collapse="!sidebar.opened || !showSubmenu" />
    </div>
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="hamburger-container">
      <search id="header-search" search-position="right" mode="static" class="right-menu-item" />
    </div>

    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- 站内信 -->
        <notify-message class="right-menu-item hover-effect" />

        <el-tooltip content="新手向导" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect">
            <svg-icon icon-class="question" @click="gotoHelp" />
          </div>
        </el-tooltip>

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <span v-if="nickname" class="user-nickname">{{ nickname }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import TopNav from '@/components/TopNav';
import Hamburger from '@/components/Hamburger';
import Screenfull from '@/components/Screenfull';
import SizeSelect from '@/components/SizeSelect';
import Search from '@/components/HeaderSearch';
import RuoYiGit from '@/components/RuoYi/Git';
import RuoYiDoc from '@/components/RuoYi/Doc';
import NotifyMessage from '@/layout/components/Message';
import Logo from '@/layout/components/Sidebar/Logo.vue';
import { getPath } from '@/utils/ruoyi';

export default {
  props: {
    showSubmenu: {
      type: [Boolean, Number],
      default: false,
    },
  },
  components: {
    Breadcrumb,
    Logo,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc,
    NotifyMessage,
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'nickname', 'device']),
    ...mapGetters({
      submenu: 'settings/submenu',
    }),
    ...mapState({
      showLogo: state => state.settings.sidebarLogo,
    }),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val,
        });
      },
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav;
      },
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      this.$modal
        .confirm('确定注销并退出系统吗？', '提示')
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = getPath('/index');
          });
        })
        .catch(() => {});
    },
    gotoHelp() {
      this.$router.push({ name: 'Help' });
    },
  },
};
</script>

<style lang="scss">
@import '~@/assets/styles/mixin.scss';
@import '~@/assets/styles/variables.scss';
.submenu .navbar {
  margin-left: -$base-submenu-sidebar-width + $base-sidebar-width;
}
.submenu.showSubmenu .navbar {
  margin-left: -$base-submenu-sidebar-width;
}
.hideSidebar .submenu .navbar {
  margin-left: -54px;
}
.hideSidebar .submenu.showSubmenu .navbar {
  margin-left: -108px;
}

.submenu .navbar .hamburger-container.logo {
  width: $base-submenu-sidebar-width - $base-sidebar-width;
}
.submenu.showSubmenu .navbar .hamburger-container.logo {
  width: $base-submenu-sidebar-width;
}
.hideSidebar .submenu .navbar .hamburger-container.logo {
  width: 54px;
}
.hideSidebar .submenu.showSubmenu .navbar .hamburger-container.logo {
  width: 108px;
}
</style>
<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu,
  .hamburger-container {
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }
        .user-nickname {
          margin-left: 5px;
          font-size: 14px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
