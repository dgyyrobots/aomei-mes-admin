<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="异常编号" prop="exceptionCode">
        <el-input v-model="queryParams.exceptionCode" placeholder="请输入异常编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="异常类型" prop="exceptionType">
        <el-select v-model="queryParams.exceptionType" placeholder="请选择异常类型" clearable>
          <el-option v-for="dict in dict.type.mes_exception_type" :key="dict.value" :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>

      <el-form-item label="异常等级" prop="exceptionLevel">
        <el-input v-model="queryParams.exceptionLevel" placeholder="请输入异常等级" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="异常标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入异常标题" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <!--      <el-form-item label="登记时间" prop="registerTime">
              <el-date-picker v-model="queryParams.registerTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
            </el-form-item>

            <el-form-item label="所属工序" prop="processCode">
              <el-input v-model="queryParams.processCode" placeholder="请输入所属工序" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>

            <el-form-item label="关联工单" prop="relatedWorkorder">
              <el-input v-model="queryParams.relatedWorkorder" placeholder="请输入关联工单" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </el-form-item>-->

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['mes:exception:create']">新增
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                   v-hasPermi="['mes:exception:update']">修改
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-search" size="mini" :disabled="single" @click="handleView"
                   v-hasPermi="['mes:exception:query']">查看
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['mes:exception:export']">导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" ref="multipleTable" @row-click="handleRowClick">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column width="130" label="异常编号" align="center" prop="exceptionCode"/>
      <el-table-column width="180" label="异常标题" align="center" prop="title"/>
      <el-table-column label="异常类型" align="center" prop="exceptionType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_exception_type" :value="scope.row.exceptionType"/>
        </template>
      </el-table-column>
      <el-table-column width="130" label="异常子类型" align="center" prop="subclassExceptionName"/>
      <el-table-column fixed="right" width="130" label="异常等级" align="center" prop="exceptionLevelName"/>
      <el-table-column width="180" label="登记时间" align="center" prop="registerTime" >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.registerTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="130" label="登记人" align="center" prop="registerUser"/>
      <el-table-column width="180" label="所属车间" align="center" prop="workshopName"/>
      <el-table-column width="130" label="关联设备" align="center" prop="relatedMachineryName"/>
      <el-table-column width="130" label="关联物料" align="center" prop="relatedMaterial"/>
      <el-table-column width="130" label="关联工单" align="center" prop="relatedWorkorder"/>
      <el-table-column  fixed="right" width="130" label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_exception_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column width="180" label="关闭时间" align="center" prop="closeTime">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.closeTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column  fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['mes:exception:update']">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['mes:exception:delete']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="65%" v-dialogDrag append-to-body :modal-class="modalClass" :class="mainClass">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="异常编号" prop="exceptionCode">
              <el-input v-model="form.exceptionCode" placeholder="请输入异常编号" :disabled="optType !== 'add'"/>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType === 'add'"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="异常标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入异常标题"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="异常类型" prop="exceptionType">
              <el-select v-model="form.exceptionType" placeholder="请选择异常类型">
                <el-option v-for="dict in dict.type.mes_exception_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="异常子类型" prop="subclassExceptionCode">
              <el-select v-model="form.subclassExceptionCode" placeholder="请选择异常子类型" @change="handleSubclassChange">
                <el-option v-for="item in subclassExceptionOptions" :key="item.subclassExceptionCode" :label="item.subclassExceptionName" :value="item.subclassExceptionCode" :data-name="item.subclassExceptionName"></el-option>
              </el-select>
            </el-form-item>

          </el-col>

          <el-col :span="8">
            <el-form-item label="异常等级" prop="exceptionLevelCode">
              <el-select v-model="form.exceptionLevelCode" placeholder="请选择异常等级" @change="handleLevelChange">
                <el-option v-for="item in exceptionLevelOptions" :key="item.levelCode" :label="item.levelName" :value="item.levelCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
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

          <el-col :span="8">
            <el-form-item label="所属工序" prop="processId">
              <el-select v-model="form.processId" placeholder="请选择工序">
                <el-option v-for="item in processOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
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
            <el-form-item label="生产任务" prop="relatedTaskCode">
              <el-input v-model="form.relatedTaskCode" placeholder="请选择生产任务">
                <el-button slot="append" icon="el-icon-search" @click="handleTaskSelect"></el-button>
              </el-input>
            </el-form-item>
            <ProtaskSelect ref="taskSelect" :workorderCode="form.relatedWorkorder" @onSelected="onTaskSelected"></ProtaskSelect>
          </el-col>



        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option v-for="dict in dict.type.mes_exception_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item label="附件" prop="attachments">
              <file-upload :isShowTips="isShowDelete" v-model="form.attachments" :file-type="adjunctTypes" :limit="20" :file-size="100"></file-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-collapse accordion>
          <el-collapse-item title="详情 DETAIL">
            <el-row>
              <el-col :span="24">
                <el-form-item label="预计影响">
                  <el-input type="textarea" :rows="2" placeholder="请输入预计影响" v-model="form.estimatedImpact"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="解决方案">
                  <el-input type="textarea" :rows="2" placeholder="请输入解决方案" v-model="form.solution"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="详细描述">
                  <editor v-model="form.description"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm"  v-if=" optType !== 'view'" >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {createException, updateException, deleteException, getException, getExceptionPage, exportExceptionExcel} from "@/api/mes/exception";
import Editor from '@/components/Editor';
import {genCode} from "@/api/mes/autocode/rule";
import WorkorderSelect from "@/components/workorderSelect/single.vue";
import MachinerySelectSingle from "@/components/machinerySelect/single.vue";
import {listAllWorkshop} from "@/api/mes/md/workshop";
import {listAllProcess} from '@/api/mes/pro/process';
import { getExceptionLevelConfigAllList } from "@/api/mes/exceptionLevelConfig";


import {getSubclassExceptionAllList} from "@/api/mes/subclassException";
import FileUpload from "@/components/FileUpload/index3.vue";
import ProtaskSelect from "@/components/TaskSelect/taskSelectSingle.vue";


export default {
  name: "Exception",
  dicts: ['mes_exception_type', 'mes_exception_status'],
  props: {
    modalClass: {
      type: String,
      default: ''
    },
    mainClass: {
      type: String,
      default: ''
    },
    taskCode: {
      type: String,
      default: ''
    }
  },
  components: {
    ProtaskSelect,
    FileUpload,
    MachinerySelectSingle,
    WorkorderSelect,
    Editor,
  },
  data() {
    return {
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      autoGenFlag: false,
      optType: undefined,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 异常登记列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        exceptionCode: null,
        exceptionType: null,
        subclassExceptionCode: null,
        exceptionLevel: null,
        title: null,
        description: null,
        registerTime: [],
        registerUser: null,
        workshop: null,
        processId: null,
        processCode: null,
        relatedMachinery: null,
        relatedErpMachinery: null,
        relatedMaterial: null,
        relatedWorkorder: null,
        status: null,
        estimatedImpact: null,
        solution: null,
        closeTime: [],
        attachments: null,
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
      rules: {
        exceptionCode: [{required: true, message: "异常编号不能为空", trigger: "blur"}],
        exceptionType: [{required: true, message: "异常类型不能为空", trigger: "change"}],
        exceptionLevel: [{required: true, message: "异常等级不能为空", trigger: "blur"}],
        title: [{required: true, message: "异常标题不能为空", trigger: "blur"}],
        registerTime: [{required: true, message: "登记时间不能为空", trigger: "blur"}],
        registerUser: [{required: true, message: "登记人不能为空", trigger: "blur"}],
      },
      //车间选项
      workshopOptions: [],
      //工序选项
      processOptions: [],
      //子异常
      subclassExceptionOptions: [],
      //预警等级
      exceptionLevelOptions: [],
      isShowDelete: true,
      adjunctTypes: null,
      // 选中数组
      ids: [],
    };
  },
  created() {
    this.getList();
    this.getWorkshops();
    this.getProcess();
    this.getSubException();
    this.getExceptionLevel();
  },
  watch: {
    // 监听异常类型变化
    'form.exceptionType': {
      handler(newVal) {
        if (newVal) {
          this.getSubException();
          this.form.subclassExceptionCode = null;
        }
      },
      immediate: false
    }
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      if (this.taskCode) {
        this.queryParams.relatedTaskCode = this.taskCode
      } else {
        this.queryParams.relatedTaskCode = ''
      }
      // 执行查询
      getExceptionPage(this.queryParams).then(response => {
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
        exceptionCode: undefined,
        exceptionType: undefined,
        subclassExceptionCode: undefined,
        exceptionLevel: undefined,
        title: undefined,
        description: undefined,
        registerTime: undefined,
        registerUser: undefined,
        workshop: undefined,
        processId: undefined,
        processCode: undefined,
        relatedMachinery: undefined,
        relatedErpMachinery: undefined,
        relatedMaterial: undefined,
        relatedWorkorder: undefined,
        status: undefined,
        estimatedImpact: undefined,
        solution: undefined,
        closeTime: undefined,
        attachments: undefined,
        remark: undefined,
        attr1: undefined,
        attr2: undefined,
        attr3: undefined,
        attr4: undefined,
      };
      this.form.relatedTaskCode = this.taskCode || ''
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
      this.title = "添加异常登记";
      this.form.status = 'CONFIRMED';
      this.isShowDelete = true;
      this.optType = 'add';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id|| this.ids;
      getException(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.isShowDelete = true;
        this.optType = 'edit';
        this.title = "修改异常登记";
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
          updateException(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createException(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除异常登记编号为"' + id + '"的数据项?').then(function () {
        return deleteException(id);
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
      this.$modal.confirm('是否确认导出所有异常登记数据项?').then(() => {
        this.exportLoading = true;
        return exportExceptionExcel(params);
      }).then(response => {
        this.$download.excel(response, '异常登记.xls');
        this.exportLoading = false;
      }).catch(() => {
      });
    },
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        this.loading = true;
        genCode('EXCEPTION_CODE').then(response => {
          this.form.exceptionCode = response;
          this.loading = false;
        });
      } else {
        this.form.exceptionCode = null;
      }
    },
    //选择生产工单
    handleWorkorderSelect() {
      this.$refs.woSelect.showFlag = true;
    },
    onWorkorderSelected(row) {
      if (row != undefined && row != null) {
        this.form.relatedWorkorder = row.workorderCode;
        this.form.relatedMaterial = row.productCode;
      }
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
    //查询车间信息
    getWorkshops() {
      listAllWorkshop().then(response => {
        this.workshopOptions = response.data;
      });
    },
    //查询工序信息
    getProcess() {
      listAllProcess().then(response => {
        this.processOptions = response.data;
      });
    },
    getSubException() {
      // subclassExceptionOptions
      getSubclassExceptionAllList({'exceptionType': this.form.exceptionType}).then(response => {
        this.subclassExceptionOptions = response.data;
      });
    },
    // 子异常选择处理
    handleSubclassChange(code) {
      const selected = this.subclassExceptionOptions.find(
        item => item.subclassExceptionCode === code
      );
      if (selected) {
        this.form.subclassExceptionName = selected.subclassExceptionName;
      }
    },
    getExceptionLevel(){
      getExceptionLevelConfigAllList().then(response => {
        this.exceptionLevelOptions = response.data;
        console.log("exceptionLevelOptions: " , this.exceptionLevelOptions);
      });
    },
    // 异常等级选择处理
    handleLevelChange(code) {
      console.log("触发变更: " , code);
      const selected = this.exceptionLevelOptions.find(
        item => item.levelCode === code
      );
      if (selected) {
        this.form.exceptionLevelColor = selected.color;
        this.form.exceptionLevelName = selected.levelName;
      }
      console.log("当前预警颜色: " , this.form.exceptionLevelColor);
      console.log("当前预警名称: " , this.form.exceptionLevelName);
    },
    // 车间选择
    handleworkshopChange(id){
      const selected = this.workshopOptions.find(
        item => item.id === id
      );
      if (selected) {
        this.form.workshopCode = selected.code;
        this.form.workshopName = selected.name;
      }
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.selectedRows = selection;
    },
    handleRowClick(row) {
      // 切换行的选中状态
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleView(){
      this.reset();
      const id = this.ids;
      getException(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.isShowDelete = true;
        this.optType = 'view';
        this.title = "查看异常登记";
      });

    },
    handleTaskSelect() {
      this.$refs.taskSelect.showFlag = true;
      this.$refs.taskSelect.getList();
    },
    onTaskSelected(row) {
      if (row != undefined && row != null) {
        this.form.relatedTaskId = row.id;
        this.form.relatedTaskCode = row.taskCode;
        this.form.workstationId = row.workstationId;
        this.form.workstationCode = row.workstationCode;
        this.form.workstationName = row.workstationName;
        this.form.processId = row.processId;
        this.form.processCode = row.processCode;
        this.form.processName = row.processName;
      }
    },
  }
};
</script>
