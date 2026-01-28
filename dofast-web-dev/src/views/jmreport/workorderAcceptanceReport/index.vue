<template>
  <div>
<!--    <doc-alert title="报表" url="" />-->
    <i-frame :src="url" v-if="url" />
  </div>
</template>
<script>
import iFrame from '@/components/IFrame/index.vue';
import { getAccessToken, setToken } from '@/utils/auth';
import { refreshToken } from '@/api/login';

export default {
  name: 'workorderAcceptanceReport',
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
      // this.url = process.env.VUE_APP_BASE_API + '/jmreport/view/1110459412751998976';
      this.url = process.env.VUE_APP_BASE_API + '/jmreport/view/1110459412751998976?token=' + refreshTokenRes.data.accessToken;
    },
  },
};
</script>
