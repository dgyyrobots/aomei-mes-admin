<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="登记编码" prop="registrationCode">
        <el-input v-model="queryParams.registrationCode" placeholder="请输入登记编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="登记名称" prop="registrationName">
        <el-input v-model="queryParams.registrationName" placeholder="请输入登记名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="登记类型" prop="registrationType">
        <el-select v-model="queryParams.registrationType" placeholder="请选择登记类型" clearable>
          <el-option v-for="dict in dict.type.mes_registration_type" :key="dict.value" :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="起始时间" prop="startTime">
        <el-date-picker v-model="queryParams.startTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']"/>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="queryParams.endTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']"/>
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
                   v-hasPermi="['mes:registration:create']">新增
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                   v-hasPermi="['mes:registration:update']">修改
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-search" size="mini" :disabled="single" @click="handleView"
                   v-hasPermi="['mes:registration:query']">查看
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-circle-check" size="mini" @click="handleFinsh"
                   v-hasPermi="['mes:registration:update']">完成
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['mes:registration:export']">导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" ref="multipleTable" @row-click="handleRowClick">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column width="150" label="登记编码" align="center" prop="registrationCode"/>
      <el-table-column width="180" label="登记名称" align="center" prop="registrationName"/>
      <el-table-column label="登记类型" align="center" prop="registrationType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_registration_type" :value="scope.row.registrationType"/>
        </template>
      </el-table-column>
      <el-table-column width="180" label="所属车间" align="center" prop="workshopName"/>
      <el-table-column width="180" label="关联设备" align="center" prop="relatedMachineryName"/>
      <el-table-column width="180" label="关联工单" align="center" prop="relatedWorkorder"/>
      <el-table-column width="180" label="关联物料" align="center" prop="relatedMaterialCode"/>
      <el-table-column width="180" label="关联物料名称" align="center" prop="relatedMaterialName" :show-overflow-tooltip="true" />
      <el-table-column fixed="right" width="120" label="历经时间(分钟)" align="center" prop="durationTime"/>
      <el-table-column fixed="right" width="180" label="起始时间" align="center" prop="startTime">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="180" label="结束时间" align="center" prop="endTime">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column  fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['mes:registration:update']">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['mes:registration:delete']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="65%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">

        <el-row>
          <el-col :span="8">
            <el-form-item label="登记编码" prop="registrationCode">
              <el-input v-model="form.registrationCode" placeholder="请输入登记编码" :disabled="optType !== 'add'"/>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType === 'add'"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="登记名称" prop="registrationName">
              <el-input v-model="form.registrationName" placeholder="请输入登记名称"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="登记类型" prop="registrationType">
              <el-select v-model="form.registrationType" placeholder="请选择登记类型">
                <el-option v-for="dict in dict.type.mes_registration_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="所在车间" prop="workshopId">
              <el-select v-model="form.workshopId" placeholder="请选择车间" @change="handleworkshopChange">
                <el-option v-for="item in workshopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="设备信息" prop="relatedMachineryName">
              <el-input v-model="form.relatedMachineryName" placeholder="请选择关联设备" disabled>
                <el-button slot="append" icon="el-icon-search" @click="handleMachineryAdd"></el-button>
              </el-input>
            </el-form-item>
            <MachinerySelectSingle :workshopId="form.workshopId" ref="machinerySelect" @onSelected="onMachineryAdd"></MachinerySelectSingle>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="关联工单" prop="relatedWorkorder">
              <el-input v-model="form.relatedWorkorder" placeholder="请选择关联工单">
                <el-button slot="append" icon="el-icon-search" @click="handleWorkorderSelect"></el-button>
              </el-input>
            </el-form-item>
            <WorkorderSelect ref="woSelect" @onSelected="onWorkorderSelected"></WorkorderSelect>
          </el-col>

          <el-col :span="8">
            <el-form-item label="关联物料" prop="relatedMaterial">
              <el-input disabled v-model="form.relatedMaterial" placeholder="请输入关联物料"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="起始时间" prop="startTime">
              <el-date-picker disabled clearable v-model="form.startTime" type="datetime"  placeholder="选择起始时间"/>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker disabled clearable v-model="form.endTime" type="datetime" placeholder="选择结束时间"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" rows="6"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="optType !== 'view'">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {createRegistration, updateRegistration, deleteRegistration, getRegistration, getRegistrationPage, exportRegistrationExcel , finshRegistration} from "@/api/mes/registration";
import {genCode} from "@/api/mes/autocode/rule";
import MachinerySelectSingle from "@/components/machinerySelect/single.vue";
import WorkorderSelect from "@/components/workorderSelect/single.vue";
import {listAllWorkshop} from "@/api/mes/md/workshop";

export default {
  name: "Registration",
  components: {
    WorkorderSelect,
    MachinerySelectSingle
  },
  dicts: ['mes_registration_type',],
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
      // 计时登记列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        registrationCode: null,
        registrationName: null,
        registrationType: null,
        startTime: [],
        endTime: [],
        workshopId: null,
        workshopName: null,
        workshopCode: null,
        relatedMachineryCode: null,
        relatedMachineryName: null,
        relatedErpMachineryCode: null,
        relatedWorkorder: null,
        relatedMaterialCode: null,
        relatedMaterialName: null,
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //车间选项
      workshopOptions: [],
      autoGenFlag: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      optType: undefined,
    };
  },
  created() {
    this.getList();
    this.getWorkshops();

  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getRegistrationPage(this.queryParams).then(response => {
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
        registrationCode: undefined,
        registrationName: undefined,
        registrationType: undefined,
        startTime: undefined,
        endTime: undefined,
        workshopId: undefined,
        workshopName: undefined,
        workshopCode: undefined,
        relatedMachineryCode: undefined,
        relatedMachineryName: undefined,
        relatedErpMachineryCode: undefined,
        relatedWorkorder: undefined,
        relatedMaterialCode: undefined,
        relatedMaterialName: undefined,
        remark: undefined,
        attr1: undefined,
        attr2: undefined,
        attr3: undefined,
        attr4: undefined,
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
      // 获取当前时间
      this.form.startTime = new Date().getTime();
      this.title = "添加计时登记";
      this.optType = 'add';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRegistration(Number(id)).then(response => {
        this.form = response.data;
        this.open = true;
        this.optType = 'edit';
        this.title = "修改计时登记";
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
          updateRegistration(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createRegistration(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除计时登记编号为"' + id + '"的数据项?').then(function () {
        return deleteRegistration(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有计时登记数据项?').then(() => {
        this.exportLoading = true;
        return exportRegistrationExcel(params);
      }).then(response => {
        this.$download.excel(response, '计时登记.xls');
        this.exportLoading = false;
      }).catch(() => {
      });
    },
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        this.loading = true;
        genCode('REGISTRATION_CODE').then(response => {
          this.form.registrationCode = response;
          this.loading = false;
        });
      } else {
        this.form.registrationCode = null;
      }
    },
    //选择生产工单
    handleWorkorderSelect() {
      this.$refs.woSelect.showFlag = true;
    },
    onWorkorderSelected(row) {
      if (row != undefined && row != null) {
        this.form.relatedWorkorder = row.workorderCode;
        this.form.relatedMaterialCode = row.productCode;
        this.form.relatedMaterialName = row.productName;
      }
    },

    //查询车间信息
    getWorkshops() {
      listAllWorkshop().then(response => {
        this.workshopOptions = response.data;
      });
    },
    // 车间选择
    handleworkshopChange(id) {
      const selected = this.workshopOptions.find(
        item => item.id === id
      );
      if (selected) {
        this.form.workshopCode = selected.code;
        this.form.workshopName = selected.name;
      }
    },
    handleFinsh(row){
      this.reset();
      let id = row.id || this.ids;
      // array转为number
      this.$modal.confirm('是否完成当前计时登记?').then(() => {
        finshRegistration(Number(id));
        this.getList();
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.selectedRows = selection;
    },
    // 选择设备
    handleMachineryAdd() {
      this.$refs.machinerySelect.showFlag = true;
    },
    onMachineryAdd(rows) {
      if (rows) {
        // 更新表单数据
        this.form.relatedMachineryCode = rows.machineryCode
        this.form.relatedMachineryName = rows.machineryName
        this.form.relatedErpMachinery = rows.erpMachineryCode
      } else {
        this.form.relatedMachineryCode = ''
        this.form.relatedMachineryName = ''
        this.form.relatedErpMachinery  = ''
      }
    },
    handleRowClick(row) {
      // 切换行的选中状态
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleView(row){
      this.reset();
      const id = row.id || this.ids;
      getRegistration(Number(id)).then(response => {
        this.form = response.data;
        this.open = true;
        this.optType = 'view';
        this.title = "查看计时登记";
      });
    }
  }
};
</script>
