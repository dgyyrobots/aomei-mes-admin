<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="拼团名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入拼团名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商品 SPU ID" prop="spuId" label-width="90">
        <el-input v-model="queryParams.spuId" placeholder="请输入商品 SPU ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="总限购数量" prop="totalLimitCount" label-width="82">
        <el-input v-model="queryParams.totalLimitCount" placeholder="请输入总限购数量" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="单次限购数量" prop="singleLimitCount" label-width="96">
        <el-input v-model="queryParams.singleLimitCount" placeholder="请输入单次限购数量" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="queryParams.startTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="queryParams.endTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="购买人数" prop="userSize">
        <el-input v-model="queryParams.userSize" placeholder="请输入购买人数" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="虚拟成团" prop="virtualGroup">
        <el-input v-model="queryParams.virtualGroup" placeholder="请输入虚拟成团" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="活动状态" prop="status">
        <!-- ：0开启 1关闭 -->
        <el-select v-model="queryParams.status" placeholder="请选择活动状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <!-- （小时） -->
      <el-form-item label="限制时长" prop="limitDuration">
        <el-input v-model="queryParams.limitDuration" placeholder="请输入限制时长（小时）" clearable
          @keyup.enter.native="handleQuery" />
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
          v-hasPermi="['promotion:combination-activity:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['promotion:combination-activity:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="活动编号" align="center" prop="id" />
      <el-table-column label="拼团名称" align="center" prop="name" />
      <el-table-column label="商品 SPU ID" align="center" prop="spuId" />
      <el-table-column label="总限购数量" align="center" prop="totalLimitCount" />
      <el-table-column label="单次限购数量" align="center" prop="singleLimitCount" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买人数" align="center" prop="userSize" />
      <el-table-column label="虚拟成团" align="center" prop="virtualGroup" />
      <el-table-column label="活动状态：0开启 1关闭" align="center" prop="status" />
      <el-table-column label="限制时长（小时）" align="center" prop="limitDuration" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['promotion:combination-activity:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['promotion:combination-activity:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="拼团名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入拼团名称" />
        </el-form-item>
        <el-form-item label="商品 SPU ID" prop="spuId">
          <el-input v-model="form.spuId" placeholder="请输入商品 SPU ID" />
        </el-form-item>
        <el-form-item label="总限购数量" prop="totalLimitCount">
          <el-input v-model="form.totalLimitCount" placeholder="请输入总限购数量" />
        </el-form-item>
        <el-form-item label="单次限购数量" prop="singleLimitCount">
          <el-input v-model="form.singleLimitCount" placeholder="请输入单次限购数量" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable v-model="form.startTime" type="date" value-format="timestamp" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable v-model="form.endTime" type="date" value-format="timestamp" placeholder="选择结束时间" />
        </el-form-item>
        <el-form-item label="购买人数" prop="userSize">
          <el-input v-model="form.userSize" placeholder="请输入购买人数" />
        </el-form-item>
        <el-form-item label="虚拟成团" prop="virtualGroup">
          <el-input v-model="form.virtualGroup" placeholder="请输入虚拟成团" />
        </el-form-item>
        <el-form-item label="活动状态：0开启 1关闭" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="限制时长（小时）" prop="limitDuration">
          <el-input v-model="form.limitDuration" placeholder="请输入限制时长（小时）" />
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
import { createCombinationActivity, updateCombinationActivity, deleteCombinationActivity, getCombinationActivity, getCombinationActivityPage, exportCombinationActivityExcel } from "@/api/promotion/combinationActivity";

export default {
  name: "CombinationActivity",
  components: {
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
      // 拼团活动列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        spuId: null,
        totalLimitCount: null,
        singleLimitCount: null,
        startTime: [],
        endTime: [],
        userSize: null,
        virtualGroup: null,
        status: null,
        limitDuration: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "拼团名称不能为空", trigger: "blur" }],
        spuId: [{ required: true, message: "商品 SPU ID不能为空", trigger: "blur" }],
        totalLimitCount: [{ required: true, message: "总限购数量不能为空", trigger: "blur" }],
        singleLimitCount: [{ required: true, message: "单次限购数量不能为空", trigger: "blur" }],
        startTime: [{ required: true, message: "开始时间不能为空", trigger: "blur" }],
        endTime: [{ required: true, message: "结束时间不能为空", trigger: "blur" }],
        virtualGroup: [{ required: true, message: "虚拟成团不能为空", trigger: "blur" }],
        status: [{ required: true, message: "活动状态：0开启 1关闭不能为空", trigger: "blur" }],
        limitDuration: [{ required: true, message: "限制时长（小时）不能为空", trigger: "blur" }],
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
      getCombinationActivityPage(this.queryParams).then(response => {
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
        name: undefined,
        spuId: undefined,
        totalLimitCount: undefined,
        singleLimitCount: undefined,
        startTime: undefined,
        endTime: undefined,
        userSize: undefined,
        virtualGroup: undefined,
        status: undefined,
        limitDuration: undefined,
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
      this.title = "添加拼团活动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getCombinationActivity(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改拼团活动";
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
          updateCombinationActivity(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCombinationActivity(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除拼团活动编号为"' + id + '"的数据项?').then(function () {
        return deleteCombinationActivity(id);
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
      this.$modal.confirm('是否确认导出所有拼团活动数据项?').then(() => {
        this.exportLoading = true;
        return exportCombinationActivityExcel(params);
      }).then(response => {
        this.$download.excel(response, '拼团活动.xls');
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
