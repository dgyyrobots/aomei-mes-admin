<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user"/>
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user"/>
                用户名称
                <div class="pull-right">{{ user.username }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone"/>
                手机号码
                <div class="pull-right">{{ user.mobile }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email"/>
                用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree"/>
                所属部门
                <div class="pull-right" v-if="user.dept">{{ user.dept.name }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree"/>
                所属岗位
                <div class="pull-right" v-if="user.posts">{{ user.posts.map(post => post.name).join(',') }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples"/>
                所属角色
                <div class="pull-right" v-if="user.roles">{{ user.roles.map(role => role.name).join(',') }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date"/>
                创建日期
                <div class="pull-right">{{ parseTime(user.createTime) }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user"/>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user"/>
            </el-tab-pane>
            <!-- <el-tab-pane label="社交信息" name="userSocial">
              <userSocial :user="user" :getUser="getUser" :setActiveTab="setActiveTab" />
            </el-tab-pane>-->
            <el-tab-pane label="人脸识别" name="faceInfo">
              <div class="face-img-container">
                <el-image
                  v-for="(img, index) in user.userFaceImgs"
                  :key="index"
                  :src="img"
                  alt="Face Image"
                  class="face-img"
                  fit="cover"
                  @error="handleImageError(index)"
                ></el-image>
              </div>
              <userFace :user="user"/>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from './userAvatar';
import userInfo from './userInfo';
import resetPwd from './resetPwd';
import userSocial from './userSocial';
import userFace from './userFace';
import {getUserProfile, getUserFaces} from '@/api/system/user';

export default {
  name: 'Profile',
  components: {userAvatar, userInfo, resetPwd, userSocial, userFace},
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: 'userinfo',
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {

      getUserProfile().then(response => {
        this.user = response.data;
      }).catch(error => {
        console.error('获取用户资料失败:', error);
      });

      // 获取用户人脸数据
      getUserFaces().then(response => {
        if (response.data && Array.isArray(response.data)) {
          this.user.userFaceImgs = response.data;
          console.log('获取用户人脸数据成功:', this.user.userFaceImgs);
        }
      }).catch(error => {
        console.error('获取用户人脸数据失败:', error);
      });
    },
    setActiveTab(activeTab) {
      this.activeTab = activeTab;
    },

    handleImageError(index) {
      console.error(`图片加载失败，索引: ${index}`);
    },
    removeFaceImg(index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.user.userFaceImgs.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }


  },
};
</script>


<style>
.face-img-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 根据需要调整图片之间的间距 */
}

.face-img {
  width: 180px; /* 根据需要调整图片的宽度 */
  height: auto; /* 保持图片的宽高比 */
  border-radius: 4px; /* 可选，为图片添加圆角 */
}
</style>
