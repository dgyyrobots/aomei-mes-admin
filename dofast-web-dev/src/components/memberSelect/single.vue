<template>
  <div>
    <el-dialog title="人员选择" v-if="showFlag" :visible.sync="showFlag" :modal="true" width="900px" center>
      <el-row :gutter="20">
        <!--用户数据-->
        <el-col :span="24" :xs="24">
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-form-item label="用户名称" prop="nickname">
              <el-input v-model="queryParams.nickname" placeholder="请输入用户名称" clearable style="width: 220px"
                @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="queryParams.mobile" placeholder="请输入手机号码" clearable style="width: 220px"
                @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
            </el-form-item>
          </el-form>
          <el-table v-loading="loading" :data="userList" @current-change="handleCurrent" @row-dblclick="handleRowDbClick">
            <el-table-column width="55" align="center">
              <template v-slot="scope">
                <el-radio v-model="selectedId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ '' }}
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column label="用户昵称" align="center" key="nickname" prop="nickname" :show-overflow-tooltip="true" />
            <el-table-column label="手机号码" align="center" key="mobile" prop="mobile" width="120" />
            <el-table-column label="状态" align="center" key="status" width="60px">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
                  @change="handleStatusChange(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="180px">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
            @pagination="getList" />
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
        <el-button @click="showFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <AddMemberDetail ref="addMember" @onCreated="handleRowDbClick($event)"></AddMemberDetail>
  </div>
</template>

<script>
import { getUserPage } from '@/api/member/user';
import AddMemberDetail from '@/components/addMemberDetail/single.vue';

export default {
  name: 'UserSingleSelect',
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  components: { AddMemberDetail },
  data() {
    return {
      showFlag: false,
      // 遮罩层
      loading: true,
      // 选中数组
      selectedId: null,
      selectedRow: null,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,

      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        nickname: undefined,
        mobile: undefined,
        status: undefined,
        deptId: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getUserPage(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.userList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm('queryForm');
      this.handleQuery();
    },
    handleCurrent(row) {
      if (row) {
        this.selectedRow = row;
      }
    },
    //行双击选中
    handleRowDbClick(row) {
      if (row) {
        this.selectedRow = row;
        this.$emit('onSelected', this.selectedRow);
        this.showFlag = false;
      }
    },
    // 单选选中数据
    handleRowChange(row) {
      if (row) {
        this.selectedRow = row;
      }
    },
    handleAdd() {
      this.$refs.addMember.open();
    },
    //确定选中
    confirmSelect() {
      if (this.selectedId == null || this.selectedId == 0) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '请至少选择一条数据!',
        });
        return;
      }
      this.$emit('onSelected', this.selectedRow);
      this.showFlag = false;
    },
  },
};
</script>
