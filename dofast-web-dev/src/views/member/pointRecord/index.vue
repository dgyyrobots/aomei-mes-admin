<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户编号" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入用户编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="业务编码" prop="bizId">
        <el-input v-model="queryParams.bizId" placeholder="请输入业务编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="业务类型" prop="bizType">
        <el-select v-model="queryParams.bizType" placeholder="请选择业务类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="积分标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入积分标题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="积分" prop="point">
        <el-input v-model="queryParams.point" placeholder="请输入积分" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="变动后的积分" prop="totalPoint" label-width="96px">
        <el-input v-model="queryParams.totalPoint" placeholder="请输入变动后的积分" clearable @keyup.enter.native="handleQuery" />
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['member:point-record:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['member:point-record:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="自增主键" align="center" prop="id" />
      <el-table-column label="用户编号" align="center" prop="userId" />
      <el-table-column label="业务编码" align="center" prop="bizId" />
      <el-table-column label="业务类型" align="center" prop="bizType" />
      <el-table-column label="积分标题" align="center" prop="title" />
      <el-table-column label="积分描述" align="center" prop="description" />
      <el-table-column label="积分" align="center" prop="point" />
      <el-table-column label="变动后的积分" align="center" prop="totalPoint" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['member:point-record:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['member:point-record:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户编号" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户编号" />
        </el-form-item>
        <el-form-item label="业务编码" prop="bizId">
          <el-input v-model="form.bizId" placeholder="请输入业务编码" />
        </el-form-item>
        <el-form-item label="业务类型" prop="bizType">
          <el-select v-model="form.bizType" placeholder="请选择业务类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="积分标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入积分标题" />
        </el-form-item>
        <el-form-item label="积分描述">
          <editor v-model="form.description" :min-height="192" />
        </el-form-item>
        <el-form-item label="积分" prop="point">
          <el-input v-model="form.point" placeholder="请输入积分" />
        </el-form-item>
        <el-form-item label="变动后的积分" prop="totalPoint">
          <el-input v-model="form.totalPoint" placeholder="请输入变动后的积分" />
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
import { createPointRecord, updatePointRecord, deletePointRecord, getPointRecord, getPointRecordPage, exportPointRecordExcel } from "@/api/member/pointRecord";
import Editor from '@/components/Editor';

export default {
  name: "PointRecord",
  components: {
    Editor,
  },
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
      // 会员积分列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        userId: null,
        bizId: null,
        bizType: null,
        title: null,
        description: null,
        point: null,
        totalPoint: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [{ required: true, message: "用户编号不能为空", trigger: "blur" }],
        bizId: [{ required: true, message: "业务编码不能为空", trigger: "blur" }],
        bizType: [{ required: true, message: "业务类型不能为空", trigger: "change" }],
        title: [{ required: true, message: "积分标题不能为空", trigger: "blur" }],
        point: [{ required: true, message: "积分不能为空", trigger: "blur" }],
        totalPoint: [{ required: true, message: "变动后的积分不能为空", trigger: "blur" }],
      }
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
      getPointRecordPage(this.queryParams).then(response => {
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
        userId: undefined,
        bizId: undefined,
        bizType: undefined,
        title: undefined,
        description: undefined,
        point: undefined,
        totalPoint: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加会员积分";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getPointRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改会员积分";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updatePointRecord(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createPointRecord(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除会员积分编号为"' + id + '"的数据项?').then(function () {
        return deletePointRecord(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有会员积分数据项?').then(() => {
        this.exportLoading = true;
        return exportPointRecordExcel(params);
      }).then(response => {
        this.$download.excel(response, '会员积分.xls');
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
