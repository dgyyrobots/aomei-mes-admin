<template>
  <div>
    <i-frame :src="url" v-if="url" />
  </div>
</template>
<script>
import iFrame from '@/components/IFrame/index';
import { getAccessToken, setToken } from '@/utils/auth';
import { refreshToken } from '@/api/login';

export default {
  name: 'feedbackReport',
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
      this.url = process.env.VUE_APP_BASE_API + '/jmreport/view/1103164255648673792';
      console.log(this.url);
      setTimeout(() => {
        this.init();
      }, 1800 * 1000);
    },
  },
};
</script>
