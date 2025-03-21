<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="queryParams.nickname" placeholder="请输入用户昵称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="queryParams.mobile" placeholder="请输入手机号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="最后登录时间" prop="loginDate" label-width="100px">
        <el-date-picker v-model="queryParams.loginDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd()" :loading="exportLoading"
          v-hasPermi="['member:user:create']">添加 </el-button>
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd('agent')"
          :loading="exportLoading" v-hasPermi="['member:user:create']">添加代理商 </el-button>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['member:user:export']">导出 </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="用户昵称" align="center" prop="nickname" />
      <el-table-column label="头像" align="center" prop="avatar" />
      <el-table-column label="状态" align="center" prop="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.status == 1 ? false : true" />
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="mobile" />
      <el-table-column label="注册 IP" align="center" prop="registerIp" />
      <el-table-column label="最后登录IP" align="center" prop="loginIp" />
      <el-table-column label="最后登录时间" align="center" prop="loginDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.loginDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户等级" align="center" prop="memberLevel" />
      <el-table-column label="店铺编码" align="center" prop="posCode" />
      <el-table-column label="渠道" align="center" prop="refType" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['member:user:update']">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar" v-if="!this.form.id">
          <imageUpload v-model="form.avatar" :limit="1" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!this.form.id">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImageUpload from '@/components/ImageUpload/index.vue';
import { getUser, getUserPage, exportUserExcel, createUser, updateUser } from '@/api/member/user';

export default {
  name: 'User',
  components: { ImageUpload },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 商城用户列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        nickname: null,
        avatar: null,
        status: null,
        mobile: null,
        loginDate: [],
        memberLevel: null,
        posCode: null,
        refType: null,
        createTime: [],
      },
      // 表单参数
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
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      let obj = JSON.parse(JSON.stringify(this.queryParams));
      if (obj.status) obj.status = obj.status == 'true' ? '0' : '1';
      getUserPage(obj).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(refType) {
      this.reset();
      this.form.refType = refType;
      this.open = true;
      this.title = { agent: '添加代理商' }[refType] || '添加商城用户';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getUser(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改商城用户';
      });
    },
    /** 提交按钮 */
    submitForm() {
      console.log('修改确认')
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        console.log('修改内容')
        // 修改的提交
        if (this.form.id != null) {
          delete this.form.password
          delete this.form.avatar
          updateUser(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createUser(this.form).then(response => {
          this.$modal.msgSuccess('新增成功');
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal
        .confirm('是否确认删除商城用户编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteUser(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm('是否确认导出所有商城用户数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportUserExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '商城用户.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
  },
};
</script>
