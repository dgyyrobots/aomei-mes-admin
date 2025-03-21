<template>
  <div>
    <doc-alert title="大屏设计器" url="https://doc.huizhizao.vip/report/screen/" />
    <i-frame :src="url" v-if="url" />
  </div>
</template>
<script>
import iFrame from '@/components/IFrame/index';
import { refreshToken } from '@/api/login';
import { getAccessToken, getTenantId, setGoView, setToken } from '@/utils/auth';

export default {
  name: 'GoView',
  components: { iFrame },
  data() {
    return {
      url: '/goview/',
    };
  },
  async created() {
    await this.init();
    setGoView(
      {
        nickName: this.$store.getters.nickname,
        tokenName: 'Authorization',
        userId: this.$store.getters.userId,
        userName: this.$store.getters.name,
        userToken: getAccessToken(),
      },
      {
        tenantId: getTenantId(),
      },
    );
    //this.url = process.env.VUE_APP_BASE_API.replace(/(.*)(\/prod-api)/i, '$1') + '/goview/'
  },
  methods: {
    async init() {
      setGoView(
        {
          nickName: this.$store.getters.nickname,
          tokenName: 'Authorization',
          userId: this.$store.getters.userId,
          userName: this.$store.getters.name,
          userToken: getAccessToken(),
        },
        {
          tenantId: getTenantId(),
        },
      );
      const refreshTokenRes = await refreshToken();
      setToken(refreshTokenRes.data);
      setTimeout(() => {
        this.init();
      }, 1800 * 1000);
    },
  },
};
</script>
