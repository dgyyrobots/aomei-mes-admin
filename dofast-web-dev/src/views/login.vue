<template xmlns="">
  <div class="container">
    <div class="logo" :style="{ backgroundImage: `url(${logoImage})` , width: '500px', height: '120px'}"></div>
    <!-- 登录区域 -->
    <div class="content">
      <!-- 配图 -->
      <div class="pic"></div>
      <!-- 表单 -->
      <div class="field">
        <!-- [移动端]标题 -->
        <h2 class="mobile-title">
          <h3 class="title"></h3>
        </h2>

        <!-- 表单 -->
        <div class="form-cont">
          <el-tabs class="form" v-model="loginForm.loginType" style="float: none">
            <el-tab-pane label="账号密码登录" name="uname"></el-tab-pane>
            <!--            <el-tab-pane label="短信验证码登录" name="sms"></el-tab-pane>-->
          </el-tabs>
          <div>
            <el-form ref="loginForm" :model="loginForm" :rules="LoginRules" class="login-form">
              <el-form-item prop="tenantName" v-if="tenantEnable">
                <el-input v-model="loginForm.tenantName" type="text" auto-complete="off" placeholder="租户">
                  <svg-icon slot="prefix" icon-class="tree" class="el-input__icon input-icon" />
                </el-input>
              </el-form-item>
              <!-- 账号密码登录 -->
              <div v-if="loginForm.loginType === 'uname'">
                <el-form-item prop="username">
                  <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                    <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                            @keyup.enter.native="getCode">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                  </el-input>
                </el-form-item>
                <el-checkbox v-model="loginForm.rememberMe" style="margin: 0 0 25px 0">记住密码</el-checkbox>
              </div>

              <!-- 短信验证码登录 -->
              <!--              <div v-if="loginForm.loginType === 'sms'">
                              <el-form-item prop="mobile">
                                <el-input v-model="loginForm.mobile" type="text" auto-complete="off" placeholder="请输入手机号">
                                  <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
                                </el-input>
                              </el-form-item>
                              <el-form-item prop="mobileCode">
                                <el-input v-model="loginForm.mobileCode" type="text" auto-complete="off" placeholder="短信验证码"
                                  class="sms-login-mobile-code-prefix" @keyup.enter.native="handleLogin">
                                  <template>
                                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                                  </template>
                                  <template slot="append">
                                    <span v-if="mobileCodeTimer <= 0" class="getMobileCode" @click="getSmsCode"
                                      style="cursor: pointer">获取验证码</span>
                                    <span v-if="mobileCodeTimer > 0" class="getMobileCode">{{ mobileCodeTimer }}秒后可重新获取</span>
                                  </template>
                                </el-input>
                              </el-form-item>
                            </div>-->

              <!-- 下方的登录按钮 -->
              <el-form-item style="width: 100%">
                <el-button :loading="loading" size="medium" type="primary" style="width: 100%"
                           @click.native.prevent="getCode">
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </el-form-item>

              <!--  社交登录 -->
              <!--              <el-form-item style="width: 100%">
                              <div class="oauth-login" style="display: flex">
                                <div class="oauth-login-item" v-for="item in SysUserSocialTypeEnum" :key="item.type"
                                  @click="doSocialLogin(item)">
                                  <img src="@/assets/logo/OzMrzn.png" v-if="item.title == '企业微信'" height="25px" width="25px" alt="登录" />
                                  <img src="@/assets/logo/OzMDRs.png" v-if="item.title == '钉钉'" height="25px" width="25px" alt="登录" />
                                  <span>{{ item.title }}</span>
                                </div>
                              </div>
                            </el-form-item>-->
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <!-- 图形验证码 -->
    <Verify ref="verify" :captcha-type="'blockPuzzle'" :img-size="{ width: '400px', height: '200px' }"
            @success="handleLogin" />

    <!-- footer -->
    <div class="footer">Copyright © 2020-2023 huizhizao.vip All Rights Reserved.</div>
  </div>
</template>

<script>
import { sendSmsCode, socialAuthRedirect } from '@/api/login';
import { getTenantIdByName } from '@/api/system/tenant';
import { SystemUserSocialTypeEnum } from '@/utils/constants';
import { getCaptchaEnable, getTenantEnable } from '@/utils/ruoyi';
import { getPassword, getRememberMe, getTenantName, getUsername, removePassword, removeRememberMe, removeTenantName, removeUsername, setPassword, setRememberMe, setTenantId, setTenantName, setUsername } from '@/utils/auth';

import Verify from '@/components/Verifition/Verify';
import { resetUserPwd } from '@/api/system/user';
import { getTenantIdByDomainPromise } from '@/api/system/tenant';
import logoImage from '../assets/logo/login-logo1.jpg';

export default {
  name: 'Login',
  components: {
    Verify,
  },
  data() {
    return {
      logoImage,
      codeUrl: '',
      captchaEnable: true,
      tenantEnable: false,
      mobileCodeTimer: 0,
      loginForm: {
        loginType: 'uname',
        username: '',
        password: '',
        captchaVerification: '',
        mobile: '',
        mobileCode: '',
        rememberMe: false,
        tenantName: '江苏澳美',
      },
      scene: 21,
      loading: false,
      redirect: undefined,
      // 枚举
      SysUserSocialTypeEnum: SystemUserSocialTypeEnum,
    };
  },
  computed: {
    LoginRules() {
      return {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        mobile: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          {
            validator: function (rule, value, callback) {
              if (/^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/.test(value) === false) {
                callback(new Error('手机号格式错误'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        tenantName: !this.tenantEnable
          ? [{ required: true, trigger: 'blur', message: '租户不能为空' }]
          : [
            { required: true, trigger: 'blur', message: '租户不能为空' },
            {
              validator: (rule, value, callback) => {
                getTenantIdByName(value).then(res => {
                  const tenantId = res.data;
                  if (tenantId && tenantId >= 0) {
                    // 设置租户
                    setTenantId(tenantId);
                    callback();
                  } else {
                    callback('租户不存在');
                  }
                });
              },
              trigger: 'blur',
            },
          ],
      };
    },
  },
  created() {
    getTenantIdByDomainPromise
      .catch(() => ({}))
      .then(res => {
        if (res && res.data && res.data.id) {
          this.tenantEnable = false;
          setTenantId(res.data.id);
          setTenantName(res.data.systemName || res.data.name);
          this.logoImage = res.data.logo;
          this.$meta().refresh();
        } else {
          this.tenantEnable = true;
        }
      });
    const searchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(searchParams.entries());
    if (params != null) {
      if (params.token != null) {
        localStorage.setItem('ACCESS_TOKEN', params.token);
        location.reload();
      }
    }
    // 租户开关
    // this.tenantEnable = getTenantEnable();
    // if (this.tenantEnable) {
    //   getTenantIdByName(this.loginForm.tenantName).then(res => {
    //     // 设置租户
    //     const tenantId = res.data;
    //     if (tenantId && tenantId >= 0) {
    //       setTenantId(tenantId);
    //     }
    //   });
    // }
    // 验证码开关
    //this.captchaEnable = getCaptchaEnable();
    this.captchaEnable = false;
    this.tenantName = '江苏澳美';
    // 重定向地址
    this.redirect = this.$route.query.redirect ? decodeURIComponent(this.$route.query.redirect) : undefined;
    this.getCookie();
  },
  methods: {
    getCode() {
      console.log(this.captchaEnable);
      // 情况一，未开启：则直接登录
      if (!this.captchaEnable) {
        this.handleLogin({});
        return;
      }

      // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
      // 弹出验证码
      // this.$refs.verify.show();
      // 不喜欢验证码
      this.handleLogin({});
      return;
    },
    getCookie() {
      const username = getUsername();
      const password = getPassword();
      const rememberMe = getRememberMe();
      const tenantName = getTenantName();
      this.loginForm = {
        ...this.loginForm,
        username: username ? username : this.loginForm.username,
        password: password ? password : this.loginForm.password,
        rememberMe: rememberMe ? getRememberMe() : false,
        tenantName: tenantName ? tenantName : this.loginForm.tenantName,
      };
    },
    handleLogin(captchaParams) {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // 设置 Cookie
          if (this.loginForm.rememberMe) {
            setUsername(this.loginForm.username);
            setPassword(this.loginForm.password);
            setRememberMe(this.loginForm.rememberMe);
          } else {
            removeUsername();
            removePassword();
            removeRememberMe();
          }
          if (this.tenantEnable) {
            if (this.loginForm.rememberMe) {
              setTenantName(this.loginForm.tenantName);
            } else {
              removeTenantName();
            }
          }
          this.loginForm.captchaVerification = captchaParams.captchaVerification;
          // 发起登陆
          // console.log("发起登录", this.loginForm);
          this.$store
            .dispatch(this.loginForm.loginType === 'sms' ? 'SmsLogin' : 'Login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' }).catch(() => { });
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    async doSocialLogin(socialTypeEnum) {
      // 设置登录中
      this.loading = true;
      let tenant = false;
      if (this.tenantEnable) {
        await this.$prompt('请输入租户名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(async ({ value }) => {
            await getTenantIdByName(value).then(res => {
              const tenantId = res.data;
              tenant = true;
              if (tenantId && tenantId >= 0) {
                setTenantId(tenantId);
              }
            });
          })
          .catch(() => {
            // 取消登录按钮 loading状态
            this.loading = false;

            return false;
          });
      } else {
        tenant = true;
      }
      if (tenant) {
        // 计算 redirectUri
        const redirectUri = location.origin + '/social-login?' + encodeURIComponent('type=' + socialTypeEnum.type + '&redirect=' + (this.redirect || '/')); // 重定向不能丢
        // const redirectUri = 'http://127.0.0.1:48080/api/gitee/callback';
        // const redirectUri = 'http://127.0.0.1:48080/api/dingtalk/callback';
        // 进行跳转
        socialAuthRedirect(socialTypeEnum.type, encodeURIComponent(redirectUri)).then(res => {
          // console.log(res.url);
          window.location.href = res.data;
        });
      }
    },
    /** ========== 以下为升级短信登录 ========== */
    getSmsCode() {
      if (this.mobileCodeTimer > 0) return;
      this.$refs.loginForm.validate(valid => {
        if (!valid) return;
        sendSmsCode(this.loginForm.mobile, this.scene, this.loginForm.uuid, this.loginForm.code).then(res => {
          this.$modal.msgSuccess('获取验证码成功');
          this.mobileCodeTimer = 60;
          let msgTimer = setInterval(() => {
            this.mobileCodeTimer = this.mobileCodeTimer - 1;
            if (this.mobileCodeTimer <= 0) {
              clearInterval(msgTimer);
            }
          }, 1000);
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/login.scss';

.oauth-login {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.oauth-login-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.oauth-login-item img {
  height: 25px;
  width: 25px;
}

.oauth-login-item span:hover {
  text-decoration: underline red;
  color: red;
}

.sms-login-mobile-code-prefix {
  :deep(.el-input__prefix) {
    top: 22%;
  }
}
</style>
