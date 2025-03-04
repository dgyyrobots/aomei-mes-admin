<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="制版领料单编号" prop="issueCode">
        <el-input v-model="queryParams.issueCode" placeholder="请输入制版领料单编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="制版领料单名称" prop="issueName">
        <el-input v-model="queryParams.issueName" placeholder="请输入制版领料单名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="领料日期" prop="issueDate">
        <el-date-picker v-model="queryParams.issueDate" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
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
                   v-hasPermi="['wms:electroform-header:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['wms:electroform-header:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="制版领料单编号" align="center" prop="issueCode" />
      <el-table-column label="制版领料单名称" align="center" prop="issueName" />
      <el-table-column label="生产设备编码" align="center" prop="machineryCode" />
      <el-table-column label="生产设备名称" align="center" prop="machineryName" />
      <el-table-column label="领料日期" align="center" prop="issueDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.issueDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="status" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['wms:electroform-header:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['wms:electroform-header:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="960px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">

        <el-row>
          <el-col :span="8">
            <el-form-item label="领料单编号" prop="issueCode">
              <el-input v-model="form.issueCode" placeholder="请输入领料单编号" :disabled="optType !== 'add'"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view'"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领料单名称" prop="issueName">
              <el-input v-model="form.issueName" placeholder="请输入领料单名称" :disabled="optType !== 'add'"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="8">
            <el-form-item label="设备信息" prop="machineryCode">
              <el-input v-model="form.machineryName" placeholder="请选择设备信息" disabled>
                <el-button slot="append" icon="el-icon-search" @click="handleMachineryAdd"></el-button>
              </el-input>
            </el-form-item>
            <MachinerySelectSingle ref="machinerySelect" :machinery-type-id="defaultTypeId" @onSelected="onMachineryAdd"></MachinerySelectSingle>
          </el-col>

          <el-col :span="8">
            <el-form-item label="领料日期" prop="issueDate">
              <el-date-picker clearable v-model="form.issueDate" type="date" value-format="timestamp" placeholder="选择领料日期" />
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
      <el-card shadow="always" v-if="form.id != null" class="box-card">
        <Electroline ref="line" :issueId="form.id" :warehouseId="form.warehouseId" :locationId="form.locationId" :areaId="form.areaId" :optType="optType"></Electroline>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createElectroformHeader, updateElectroformHeader, deleteElectroformHeader, getElectroformHeader, getElectroformHeaderPage, exportElectroformHeaderExcel } from "@/api/wms/electroformHeader";
import MachinerySelectSingle from "@/components/machinerySelect/single.vue";
import {genCode} from '@/api/mes/autocode/rule';
import Electroline from "@/views/mes/electroplate/electroformHeader/line.vue";

export default {
  name: "ElectroformHeader",
  components: {
    Electroline,
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
      // 制版房领料单头列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        issueCode: null,
        issueName: null,
        issueDate: [],
        status: null,
        createTime: [],
        machineryName: null,
        machineryCode: null,
        machineryId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        issueCode: [{ required: true, message: "制版领料单编号不能为空", trigger: "blur" }],
        issueName: [{ required: true, message: "制版领料单名称不能为空", trigger: "blur" }],
      },
      optType: undefined,
      autoGenFlag: false,
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
      getElectroformHeaderPage(this.queryParams).then(response => {
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
        issueCode: undefined,
        issueName: undefined,
        issueDate: undefined,
        status: undefined,
        machineryName: undefined,
        machineryCode: undefined,
        machineryId: undefined,
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
      this.title = "添加制版房领料单头";
      this.optType = 'add';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getElectroformHeader(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改制版房领料单头";
        this.optType = 'edit';
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
          updateElectroformHeader(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createElectroformHeader(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除制版房领料单头编号为"' + id + '"的数据项?').then(function() {
          return deleteElectroformHeader(id);
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
      this.$modal.confirm('是否确认导出所有制版房领料单头数据项?').then(() => {
          this.exportLoading = true;
          return exportElectroformHeaderExcel(params);
        }).then(response => {
          this.$download.excel(response, '制版房领料单头.xls');
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
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        genCode('ELECTRO_CODE').then(response => {
          this.form.issueCode = response;
        });
      } else {
        this.form.issueCode = null;
      }
    },

  }
};
</script>
