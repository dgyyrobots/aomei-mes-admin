<template>
  <div>
    <doc-alert title="报表" url="" />
    <i-frame :src="url" v-if="url" />
  </div>
</template>
<script>
import iFrame from '@/components/IFrame/index';
import { getAccessToken, setToken } from '@/utils/auth';
import { refreshToken } from '@/api/login';

export default {
  name: '1069128964885643264',
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
      this.url = process.env.VUE_APP_BASE_API + '/jmreport/view/1069128964885643264';
      console.log(this.url);
      setTimeout(() => {
        this.init();
      }, 1800 * 1000);
    },
  },
};
</script>
