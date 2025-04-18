<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="设备名称" prop="machineryName">
        <el-input v-model="queryParams.machineryName" placeholder="请输入设备名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
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
                   v-hasPermi="['mes:electroplate-log:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['mes:electroplate-log:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="设备名称" align="center" prop="machineryName" />
      <el-table-column label="设备编码" align="center" prop="machineryCode" />
      <el-table-column label="比例" align="center" prop="proportion" />
      <el-table-column label="温度" align="center" prop="temperature" />
      <el-table-column label="PH值" align="center" prop="phValue" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['mes:electroplate-log:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['mes:electroplate-log:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="60%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
<!--            <el-form-item label="设备名称" prop="machineryName">
              <el-input v-model="form.machineryName" placeholder="请输入设备名称" />
            </el-form-item>-->

              <el-form-item label="设备信息" prop="machineryCode">
                <el-input v-model="form.machineryName" placeholder="请选择设备信息" disabled>
                  <el-button slot="append" icon="el-icon-search" @click="handleMachineryAdd"></el-button>
                </el-input>
              </el-form-item>
              <MachinerySelectSingle ref="machinerySelect" :machinery-type-id="defaultTypeId" @onSelected="onMachineryAdd"></MachinerySelectSingle>

          </el-col>

          <el-col :span="8">
            <el-form-item label="比例" prop="proportion">
              <el-input v-model="form.proportion" placeholder="请输入比例" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="温度" prop="temperature">
              <el-input v-model="form.temperature" placeholder="请输入温度" />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="PH值" prop="phValue">
              <el-input v-model="form.phValue" placeholder="请输入PH值" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createElectroplateLog, updateElectroplateLog, deleteElectroplateLog, getElectroplateLog, getElectroplateLogPage, exportElectroplateLogExcel } from "@/api/mes/electroplateLog";
import MachinerySelectSingle from "@/components/machinerySelect/single.vue";

export default {
  name: "ElectroplateLog",
  components: {
    MachinerySelectSingle
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
      // 制版房记录列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        machineryId: null,
        machineryCode: null,
        machineryName: null,
        proportion: null,
        temperature: null,
        phValue: null,
        remark: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        machineryId: [{ required: true, message: "设备ID不能为空", trigger: "blur" }],
        machineryCode: [{ required: true, message: "设备编码不能为空", trigger: "blur" }],
      },
      defaultTypeId: 8
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
      getElectroplateLogPage(this.queryParams).then(response => {
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
        machineryId: undefined,
        machineryCode: undefined,
        machineryName: undefined,
        proportion: undefined,
        temperature: undefined,
        phValue: undefined,
        remark: undefined,
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
      this.title = "添加制版房记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getElectroplateLog(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改制版房记录";
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
          updateElectroplateLog(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createElectroplateLog(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除制版房记录编号为"' + id + '"的数据项?').then(function() {
          return deleteElectroplateLog(id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有制版房记录数据项?').then(() => {
          this.exportLoading = true;
          return exportElectroplateLogExcel(params);
        }).then(response => {
          this.$download.excel(response, '制版房记录.xls');
          this.exportLoading = false;
        }).catch(() => {});
    },
    handleMachineryAdd() {
      this.$refs.machinerySelect.showFlag = true;
    },
    //设备资源选择回调
    onMachineryAdd(rows) {
      if (rows != undefined && rows != null) {
        this.form.machineryCode = rows.machineryCode;
        this.form.machineryName = rows.machineryName;
        this.form.machineryId = rows.id;
      }
    },

  }
};
</script>
