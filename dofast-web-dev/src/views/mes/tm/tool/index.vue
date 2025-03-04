<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">

      <el-form-item label="镭射板编码" prop="toolCode">
        <el-input v-model="queryParams.toolCode" placeholder="请输入镭射板编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="镭射板名称" prop="toolName">
        <el-input v-model="queryParams.toolName" placeholder="请输入镭射板名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

<!--      <el-form-item label="工装夹具类型" prop="toolTypeId">
        <el-select v-model="form.toolTypeId" placeholder="请选择类型">
          <el-option v-for="dict in toolTypeOptions" :key="dict.id" :label="dict.toolTypeName"
            :value="dict.id"></el-option>
        </el-select>
      </el-form-item>-->

<!--      <el-form-item label="品牌" label-width="60px" prop="brand">
        <el-input v-model="queryParams.brand" placeholder="请输入品牌" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>-->

      <el-form-item label="型号" label-width="60px" prop="spec">
        <el-input v-model="queryParams.spec" placeholder="请输入型号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="状态" label-width="60px" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="dict in dict.type.mes_tool_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>

    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['tm:tool:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['tm:tool:update']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['tm:tool:delete']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['tm:tool:export']">导出</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleBatchPrint"
                   v-hasPermi="['tm:tool:export']">打印</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="toolList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="镭射板编号" align="center" prop="toolCode">
        <template slot-scope="scope">
          <el-button type="text" @click="handleView(scope.row)" v-hasPermi="['tm:tool:query']">{{ scope.row.toolCode
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="镭射板名称" align="center" prop="toolName" :show-overflow-tooltip="true" />
<!--
      <el-table-column label="品牌" align="center" prop="brand" :show-overflow-tooltip="true" />
-->
      <el-table-column label="品名规格" align="center" prop="spec" :show-overflow-tooltip="true" />
      <el-table-column label="类型" align="center" prop="toolTypeName" />
<!--      <el-table-column label="库存数量" align="center" prop="quantity" />-->
      <el-table-column label="可用数量" align="center" prop="quantityAvail" />
<!--      <el-table-column label="保养维护类型" width="100px" align="center" prop="maintenType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_mainten_type" :value="scope.row.maintenType" />
        </template>
      </el-table-column>
      <el-table-column label="下次保养周期" width="100px" align="center" prop="nextMaintenPeriod" />
      <el-table-column label="下次保养日期" align="center" prop="nextMaintenDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.nextMaintenDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_tool_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['tm:tool:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['tm:tool:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改工装夹具清单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
<!--          <el-col :span="12">
            <el-form-item label="工装夹具类型" prop="toolTypeId">
              <el-select v-model="form.toolTypeId" @change="onToolTypeChanged" placeholder="请选择类型">
                <el-option v-for="dict in toolTypeOptions" :key="dict.id" :label="dict.toolTypeName"
                  :value="dict.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="镭射板编号" prop="toolCode">
              <el-input v-model="form.toolCode" placeholder="请输入镭射板编号" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成"
                         @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view'"> </el-switch>
            </el-form-item>
          </el-col>-->

          <el-col :span="12">
            <el-form-item label="镭射板名称" prop="toolName">
              <el-input v-model="form.toolName" placeholder="请输入镭射板名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
<!--          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="form.brand" placeholder="请输入品牌" />
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="品名规格" prop="spec">
              <el-input v-model="form.spec" placeholder="请输入品名规格" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
          <el-form-item label="数量" prop="quantity">
            <el-input v-if="form.codeFlag == 'Y'" v-model="form.quantity" />
            <el-input-number :min="0" @blur="onQuantityChanged" v-else v-model="form.quantity" placeholder="请输入数量" />
          </el-form-item>
        </el-col>

        </el-row>

        <el-row>
<!--          <el-col :span="12">
            <el-form-item label="可用数量" prop="quantityAvail">
              <el-input v-model="form.quantityAvail" readonly placeholder="请输入可用数量" />
            </el-form-item>
          </el-col>-->
<!--          <el-col :span="12">
            <el-form-item label="保养维护类型" prop="maintenType">
              <el-select v-model="form.maintenType" placeholder="请选择保养维护类型">
                <el-option v-for="dict in dict.type.mes_mainten_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group disabled="disabled" v-model="form.status">
              <el-radio v-for="dict in dict.type.mes_tool_status" :key="dict.value" :label="dict.value">{{ dict.label
                }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        </el-row>

        <!--<el-row>
          <el-col :span="12">
            <el-form-item v-if="form.maintenType == 'REGULAR'" label="下一次保养日期" prop="nextMaintenDate">
              <el-date-picker clearable v-model="form.nextMaintenDate" type="date" value-format="timestamp"
                placeholder="请选择下一次保养日期"> </el-date-picker>
            </el-form-item>
            <el-form-item v-else label="下一次保养周期" prop="nextMaintenPeriod">
              <el-input v-model="form.nextMaintenPeriod" placeholder="请输入下一次保养周期" />
            </el-form-item>
          </el-col>

        </el-row>-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view'">返回</el-button>
        <el-button type="primary" @click="submitForm" v-else>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTool, getTool, delTool, addTool, updateTool } from '@/api/mes/tm/tool';
import { listAllTooltype } from '@/api/mes/tm/tooltype';
import { genCode } from '@/api/mes/autocode/rule';
import {getFeedback, updateFeedback} from "@/api/mes/pro/feedback";
import '@/utils/CLodopfuncs2.js';

export default {
  name: 'Tool',
  dicts: ['mes_tool_status', 'mes_mainten_type'],
  data() {
    return {
      //自动生成编码
      autoGenFlag: false,
      optType: undefined,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 工装夹具清单表格数据
      toolList: [],
      //类型清单
      toolTypeOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        toolCode: null,
        toolName: null,
        brand: null,
        spec: null,
        toolTypeId: null,
        toolTypeCode: null,
        toolTypeName: null,
        quantity: null,
        quantityAvail: null,
        maintenType: null,
        nextMaintenPeriod: null,
        nextMaintenDate: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        toolName: [{ required: true, message: '工装夹具名称不能为空', trigger: 'blur' }],
        /*toolTypeId: [{ required: true, message: '工装夹具类型不能为空', trigger: 'blur' }],*/
        quantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
      },
      selectedRows: [], // 选中行数据
    };
  },
  created() {
    this.getList();
    this.getTypeList();
  },
  methods: {
    /** 查询工装夹具清单列表 */
    getList() {
      this.loading = true;
      listTool(this.queryParams).then(response => {
        this.toolList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    getTypeList() {
      listAllTooltype().then(response => {
        this.toolTypeOptions = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        toolCode: null,
        toolName: null,
        brand: null,
        spec: null,
        toolTypeId: null,
        toolTypeCode: null,
        toolTypeName: null,
        quantity: null,
        quantityAvail: null,
        maintenType: 'REGULAR',
        nextMaintenPeriod: null,
        nextMaintenDate: null,
        status: 'STORE',
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.autoGenFlag = false;
      this.resetForm('form');
    },
    onToolTypeChanged() {
      var types = this.toolTypeOptions.filter(item => {
        if (item.toolTypeId == this.form.toolTypeId) {
          return item;
        }
      });
      if (types !== null && types.length > 0) {
        if (types[0].codeFlag == 'Y') {
          //如果是单独编码，则数量固定为1
          this.form.quantity = 1;
          this.form.quantityAvail = 1;
          this.form.codeFlag = 'Y';
          return;
        }
      }
      this.form.codeFlag = 'N';
    },
    onQuantityChanged() {
      this.form.quantityAvail = this.form.quantity;
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.selectedRows = selection;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加工装夹具清单';
      this.optType = 'add';
    },
    // 查询明细按钮操作
    handleView(row) {
      this.reset();
      const toolId = row.id || this.ids;
      getTool(toolId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '查看工装夹具信息';
        this.optType = 'view';
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const toolId = row.id || this.ids;
      getTool(toolId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改工装夹具清单';
        this.optType = 'edit';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.quantityAvail = this.form.quantity;
            updateTool(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            this.form.quantityAvail = this.form.quantity;
            addTool(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const toolIds = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除工装夹具清单编号为"' + toolIds + '"的数据项？')
        .then(function () {
          return delTool(toolIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'tm/tool/export',
        {
          ...this.queryParams,
        },
        `tool_${new Date().getTime()}.xlsx`,
      );
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        genCode('TOOL_CODE').then(response => {
          this.form.toolCode = response;
        });
      } else {
        this.form.toolCode = null;
      }
    },

    async handleBatchPrint() {
      await this.$modal.confirm('确认批量打印？');
      LODOP.PRINT_INITA(0, 0, 150, 100); // 初始化打印任务，纸张大小为150mm*100mm，单位：像素
      LODOP.SET_PRINT_PAGESIZE(2, "", "", "热敏纸"); // 设置纸张横向
      for (const queryId of this.ids) {
        let obj = {};
        await getTool(queryId).then(response => {
          obj = response.data;
        });
        LODOP.NEWPAGE();
        // 添加整体边框
        LODOP.ADD_PRINT_RECT(8, 5, 150 * 3.71 - 10, 100 * 3.71 - 10, 0, 1); // 整体边框

        // 添加标题及标题边框
        LODOP.SET_PRINT_STYLE("FontSize", 18);
        LODOP.SET_PRINT_STYLE("FontName", "Microsoft YaHei");
        LODOP.SET_PRINT_STYLE("Bold", 1);
        LODOP.SET_PRINT_STYLE("Horient", 2); // 居中
        LODOP.ADD_PRINT_TEXT(13, 0, 150, 30, "镭射板标签");

        // 内容样式及分块边框
        LODOP.SET_PRINT_STYLE("FontSize", 16);
        LODOP.SET_PRINT_STYLE("Bold", 0);
        LODOP.SET_PRINT_STYLE("Horient", 0); // 取消居中

        LODOP.ADD_PRINT_TEXT(70, 15, 120, 35, "条码编号:");
        LODOP.ADD_PRINT_TEXT(70, 120, 280, 35, obj.id); // 内容部分

        LODOP.ADD_PRINT_TEXT(120, 15, 120, 35, "镭射板编号:");
        LODOP.ADD_PRINT_TEXT(120, 120, 280, 35, obj.toolCode);

        LODOP.ADD_PRINT_TEXT(170, 15, 120, 35, "镭射板名称:");
        LODOP.ADD_PRINT_TEXT(170, 120, 280, 35, obj.toolName);

        LODOP.ADD_PRINT_TEXT(220, 15, 120, 35, "合格数量:");
        LODOP.ADD_PRINT_TEXT(220, 120, 280, 35, obj.quantityAvail);

        LODOP.ADD_PRINT_TEXT(270, 15, 120, 35, "单位:");
        LODOP.ADD_PRINT_TEXT(270, 120, 280, 35, '张');

        LODOP.ADD_PRINT_TEXT(320, 15, 120, 35, "日期:");
        LODOP.ADD_PRINT_TEXT(320, 120, 280, 35, new Date(obj.createTime).toISOString().slice(0, 19).replace('T', ' '));

        let jsonQc = {
          "id": obj.id,
          "type": "tool"
        }
        LODOP.ADD_PRINT_BARCODE(220, 390, 170, 170, "QRCode", JSON.stringify(jsonQc));

      }
      LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1); //打印后自动关闭预览窗口
      LODOP.PREVIEW();
      this.$modal.msgSuccess('打印成功');
      this.selectedRows = []; // 清空已选中的行
      this.getList(); // 刷新列表
    },

  },
};
</script>
