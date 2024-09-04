<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物料编码" prop="itemCode">
        <el-input v-model="queryParams.itemCode" placeholder="请输入物料编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="物料SN" prop="itenSn">
        <el-input v-model="queryParams.itenSn" placeholder="请输入物料SN" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="物料名称" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入物料名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-input v-model="queryParams.state" placeholder="请输入状态" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="仓库编号" prop="whCode">
        <el-input v-model="queryParams.whCode" placeholder="请输入仓库编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="冻结时间" prop="freezeTime">
        <el-date-picker v-model="queryParams.freezeTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>

      <el-form-item label="解冻时间" prop="thawTime">
        <el-date-picker v-model="queryParams.thawTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
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
                   v-hasPermi="['mes:freeze-info:create']">新增</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleUpdate" :disabled="single"
                   v-hasPermi="['mes:freeze-info:update']">修改</el-button>
      </el-col>

      <el-col :span="1.5">

        <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDelete" :disabled="multiple"
                   v-hasPermi="['mes:freeze-info:delete']">删除</el-button>
      </el-col>


      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['mes:freeze-info:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="物料编码" align="center" prop="itemCode" />
      <el-table-column label="物料SN" align="center" prop="itenSn" />
      <el-table-column label="物料名称" align="center" prop="itemName" />
      <el-table-column label="物料数量" align="center" prop="itenQty" />
      <el-table-column label="状态" align="center" prop="state" />
      <el-table-column label="仓库编号" align="center" prop="whCode" />
      <el-table-column label="库位" align="center" prop="storageCode" />
      <el-table-column label="冻结时间" align="center" prop="freezeTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.freezeTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="解冻时间" align="center" prop="thawTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.thawTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['mes:freeze-info:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['mes:freeze-info:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="75%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-row>
          <el-col :span="6">
            <el-form-item label="物料编码" prop="itemCode">
              <el-input v-model="form.itemCode" placeholder="请输入物料编码" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="物料名称" prop="itemName">
              <el-input v-model="form.itemName" placeholder="请输入物料名称" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="物料数量" prop="itenQty">
              <el-input v-model="form.itenQty" placeholder="请输入产品物料数量" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
          <el-form-item label="物料SN" prop="itenSn">
            <el-input v-model="form.itenSn" placeholder="请输入产品物料SN" />
          </el-form-item>
          </el-col>

        </el-row>


        <el-row>
          <el-col :span="6">
            <el-form-item label="仓库编号" prop="whCode">
              <el-input v-model="form.whCode" placeholder="请输入仓库编号" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="库位" prop="storageCode">
              <el-input v-model="form.storageCode" placeholder="请输入库位" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="状态" prop="state">
              <el-input v-model="form.state" placeholder="请输入状态(1-解冻, 2-冻结)" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="冻结人员" prop="freezer">
              <el-input v-model="form.freezer" placeholder="请输入冻结人员" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="6">
            <el-form-item label="冻结时间" prop="freezeTime">
              <el-date-picker clearable v-model="form.freezeTime" type="date" value-format="timestamp" placeholder="选择冻结时间" :style="{ width: '270px' }" />
            </el-form-item>
          </el-col>


          <el-col :span="6">
            <el-form-item label="冻结原因" prop="freezer">
              <el-input v-model="form.freezeMemo" placeholder="请输入冻结原因" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="解冻人员" prop="thawPerson">
              <el-input v-model="form.thawPerson" placeholder="请输入解冻人员" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="解冻时间" prop="thawTime">
              <el-date-picker clearable v-model="form.thawTime" type="date" value-format="timestamp" placeholder="选择解冻时间" :style="{ width: '270px' }"  />
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="6">
            <el-form-item label="解冻原因" prop="thawMemo">
              <el-input v-model="form.thawMemo" placeholder="请输入解冻原因" />
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
import { createFreezeInfo, updateFreezeInfo, deleteFreezeInfo, getFreezeInfo, getFreezeInfoPage, exportFreezeInfoExcel } from "@/api/mes/freezeInfo";

export default {
  name: "FreezeInfo",
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
      // 产品冻结信息列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        createTime: [],
        itemCode: null,
        itemName: null,
        itenQty: null,
        state: null,
        whCode: null,
        storageCode: null,
        freezeMemo: null,
        freezer: null,
        freezeTime: [],
        thawPerson: null,
        thawMemo: null,
        thawTime: [],
        itenSn: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemCode: [{ required: true, message: "物料编号不能为空", trigger: "blur" }],
        itenQty: [{ required: true, message: "冻结数量不能为空", trigger: "blur" }],
        state: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        whCode: [{ required: true, message: "仓库编号不能为空", trigger: "blur" }],
        storageCode: [{ required: true, message: "库位不能为空", trigger: "blur" }],
        freezeMemo: [{ required: true, message: "冻结原因不能为空", trigger: "blur" }],
        freezer: [{ required: true, message: "冻结人员不能为空", trigger: "blur" }],
        thawPerson: [{ required: true, message: "解冻人员不能为空", trigger: "blur" }],
        thawMemo: [{ required: true, message: "解冻原因不能为空", trigger: "blur" }],
        itenSn: [{ required: true, message: "物料SN不能为空", trigger: "blur" }],
      },
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
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
      getFreezeInfoPage(this.queryParams).then(response => {
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
        itemCode: undefined,
        itemName: undefined,
        itenQty: undefined,
        state: undefined,
        whCode: undefined,
        storageCode: undefined,
        freezeMemo: undefined,
        freezer: undefined,
        freezeTime: undefined,
        thawPerson: undefined,
        thawMemo: undefined,
        thawTime: undefined,
        itenSn: undefined,
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
      this.title = "添加产品冻结信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getFreezeInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改产品冻结信息";
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
          updateFreezeInfo(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createFreezeInfo(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除产品冻结信息编号为"' + id + '"的数据项?').then(function() {
          return deleteFreezeInfo(id);
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
      this.$modal.confirm('是否确认导出所有产品冻结信息数据项?').then(() => {
          this.exportLoading = true;
          return exportFreezeInfoExcel(params);
        }).then(response => {
          this.$download.excel(response, '产品冻结信息.xls');
          this.exportLoading = false;
        }).catch(() => {});
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
  }
};
</script>
