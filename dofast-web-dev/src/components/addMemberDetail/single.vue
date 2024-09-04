<template>
  <el-dialog title="添加用户" :visible.sync="showFlag" width="500px" v-dialogDrag append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入用户昵称" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <imageUpload v-model="form.avatar" :limit="1" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" :maxlength="11" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="showFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ImageUpload from '@/components/ImageUpload/index.vue';
import { createUser, getUser } from '@/api/member/user';

export default {
  components: { ImageUpload },
  data() {
    return {
      showFlag: false,
      form: {},
      // 表单校验
      rules: {
        nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
        // avatar: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        // password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      },
    };
  },
  methods: {
    open() {
      this.reset();
      this.showFlag = true;
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        nickname: undefined,
        avatar: undefined,
        status: undefined,
        mobile: undefined,
        password: undefined,
        registerIp: undefined,
        loginIp: undefined,
        loginDate: undefined,
        memberLevel: undefined,
        posCode: undefined,
        refType: undefined,
      };
      this.resetForm('form');
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        // 添加的提交
        createUser(this.form)
          .then(response => {
            this.$modal.msgSuccess('新增成功');
            return getUser(response.data);
          })
          .then(response => {
            this.$emit('onCreated', response.data);
            this.showFlag = false;
          });
      });
    },
  },
};
</script>
