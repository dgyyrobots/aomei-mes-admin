<template>
  <div>
    <doc-alert title="报表设计器" url="https://doc.huizhizao.vip/report/" />
    <i-frame :src="url" v-if="url" />
  </div>
</template>
<script>
import iFrame from '@/components/IFrame/index';
import { getAccessToken, setToken } from '@/utils/auth';
import { refreshToken } from '@/api/login';

export default {
  name: 'JimuReport',
  components: { iFrame },
  data() {
    return {
      url: '',
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const refreshTokenRes = await refreshToken();
      setToken(refreshTokenRes.data);
      this.url = process.env.VUE_APP_BASE_API + '/jmreport/list?token=' + getAccessToken();
      console.log(this.url);
      setTimeout(() => {
        this.init();
      }, 1800 * 1000);
    },
  },
};
</script>
