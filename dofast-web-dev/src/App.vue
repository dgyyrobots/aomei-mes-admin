<template>
  <div id="app">

    <router-view />
    <theme-picker />
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker';
import { getTenantName, setTenantId, setTenantName } from '@/utils/auth';
import { getTenantIdByDomainPromise } from '@/api/system/tenant';

export default {
  name: 'App',
  components: { ThemePicker },
  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: title => {
        const tenantName = getTenantName() || process.env.VUE_APP_TITLE;
        return title ? `${title} - ${tenantName}` : tenantName;
      },
    };
  },
  created() {
    getTenantIdByDomainPromise.then(res => {
      if (res && res.data && res.data.id) {
        setTenantId(res.data.id);
        setTenantName(res.data.systemName || res.data.name);
        this.$meta().refresh();
      }
    });
  },
};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
