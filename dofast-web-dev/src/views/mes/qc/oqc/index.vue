<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="检验单编号" prop="oqcCode">
        <el-input v-model="queryParams.oqcCode" placeholder="请输入出货检验单编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户名称" prop="clientName">
        <el-input v-model="queryParams.clientName" placeholder="请输入客户名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="批次号" prop="batchCode">
        <el-input v-model="queryParams.batchCode" placeholder="请输入批次号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="产品物料编码" prop="itemCode">
        <el-input v-model="queryParams.itemCode" placeholder="请输入产品物料编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="产品物料名称" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入产品物料名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="检测结果" prop="checkResult">
        <el-select v-model="queryParams.checkResult" placeholder="请选择检测结果">
          <el-option v-for="dict in dict.type.mes_qc_result" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['qms:oqc:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['qms:oqc:update']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['qms:oqc:delete']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['mes:qc:oqc:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="oqcList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="出货检验单编号" width="150px" align="center" prop="oqcCode">
        <template slot-scope="scope">
          <el-button type="text" @click="handleView(scope.row)" v-hasPermi="['qms:oqc:query']">{{ scope.row.oqcCode }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="验单名称" width="100px" align="center" prop="oqcName" :show-overflow-tooltip="true" />

      <el-table-column label="客户名称" width="100px" align="center" prop="clientName" :show-overflow-tooltip="true" />
      <el-table-column label="批次号" align="center" prop="batchCode" />

      <el-table-column label="产品编码" width="120px" align="center" prop="itemCode" />
      <el-table-column label="产品名称" align="center" prop="itemName" :show-overflow-tooltip="true" />
      <el-table-column label="规格型号" align="center" prop="specification" :show-overflow-tooltip="true" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />

      <el-table-column label="发货数量" align="center" prop="quantityOut" />
      <el-table-column label="检测数量" align="center" prop="quantityCheck" />
      <el-table-column label="不合格数" align="center" prop="quantityUnqualified" />

      <el-table-column label="检测结果" align="center" prop="checkResult">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_qc_result" :value="scope.row.checkResult" />
        </template>
      </el-table-column>
      <el-table-column label="出货日期" align="center" prop="outDate" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.outDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测日期" align="center" prop="inspectDate" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inspectDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测人员" align="center" prop="inspector" />
      <el-table-column label="单据状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="scope.row.status == 'PREPARE'" v-hasPermi="['qms:oqc:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-if="scope.row.status == 'PREPARE'" v-hasPermi="['qms:oqc:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改出货检验单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="检验单编号" prop="oqcCode">
              <el-input v-model="form.oqcCode" placeholder="请输入出货检验单编号" />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view' && form.status == 'PREPARE'"> </el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="检验单名称" prop="oqcName">
              <el-input v-model="form.oqcName" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="产品编码" prop="itemCode">
              <el-input v-if="form.id == null" readonly v-model="form.itemCode" placeholder="请选择产品">
                <el-button slot="append" @click="handleSelectProduct" icon="el-icon-search"></el-button>
              </el-input>
              <!--如果已经保存过，则产品不允许再修改，需要修改就删除重做-->
              <el-input v-else v-model="form.itemCode" />
              <ItemSelect ref="itemSelect" @onSelected="onItemSelected"> </ItemSelect>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="产品名称" prop="itemName">
              <el-input readonly="readonly" v-model="form.itemName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input readonly="readonly" v-model="form.unitOfMeasure" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="规格型号" prop="specification">
              <el-input readonly="readonly" v-model="form.specification" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="客户编号" prop="clientCode">
              <el-input v-model="form.clientCode" readonly placeholder="请输选择客户">
                <el-button slot="append" @click="handleSelectClient" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
            <ClientSelect ref="clientSelect" @onSelected="onClientSelected"> </ClientSelect>
          </el-col>

          <el-col :span="8">
            <el-form-item label="客户名称" prop="clientName">
              <el-input readonly="readonly" v-model="form.clientName" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="批次号" prop="batchCode">
              <el-input v-model="form.batchCode" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="发货数量" prop="quantityOut">
              <el-input-number :min="1" v-model="form.quantityOut" placeholder="请输入发货数量" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检测数量" prop="quantityCheck">
              <el-input-number :min="1" v-model="form.quantityCheck" placeholder="请输入本次检测数量" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不合格数量" prop="quantityUnqualified">
              <el-input-number :min="0" readonly="readonly" v-model="form.quantityUnqualified" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="出货日期" prop="outDate">
              <el-date-picker clearable v-model="form.outDate" type="date" value-format="timestamp" placeholder="请选择出货日期"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检测日期" prop="inspectDate">
              <el-date-picker clearable v-model="form.inspectDate" type="date" value-format="timestamp" placeholder="请选择检测日期"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检测结果" prop="checkResult">
              <el-select v-model="form.checkResult" placeholder="请选择检测结果">
                <el-option v-for="dict in dict.type.mes_qc_result" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-collapse accordion>
          <el-collapse-item title="结果统计">
            <el-row>
              <el-col :span="8">
                <el-form-item label="致命缺陷数量" prop="crQuantity">
                  <el-input readonly="readonly" v-model="form.crQuantity" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="严重缺陷数量" prop="majQuantity">
                  <el-input readonly="readonly" v-model="form.majQuantity" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="轻微缺陷数量" prop="minQuantity">
                  <el-input readonly="readonly" v-model="form.minQuantity" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="致命缺陷率" prop="crQuantity">
                  <el-input readonly="readonly" v-model="form.crRate" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="严重缺陷率" prop="majRate">
                  <el-input readonly="readonly" v-model="form.majRate" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="轻微缺陷率" prop="minRate">
                  <el-input readonly="readonly" v-model="form.minRate" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <el-divider v-if="form.id != null" content-position="center">检测项</el-divider>
      <el-card shadow="always" v-if="form.id != null" class="box-card">
        <Oqcline ref="line" :oqcId="form.id" :optType="optType"></Oqcline>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view' || form.status != 'PREPARE'">返回</el-button>
        <el-button type="primary" @click="submitForm" v-if="form.status == 'PREPARE' && optType != 'view'">保 存</el-button>
        <el-button type="success" @click="handleFinish" v-if="form.status == 'PREPARE' && optType != 'view' && form.id != null">完成</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOqc, getOqc, delOqc, addOqc, updateOqc } from '@/api/mes/qc/oqc';
import ItemSelect from '@/components/itemSelect/single.vue';
import ClientSelect from '@/components/clientSelect/single.vue';
import { genCode } from '@/api/mes/autocode/rule';
import Oqcline from './line.vue';
export default {
  name: 'Oqc',
  dicts: ['mes_order_status', 'mes_qc_result'],
  components: {
    ItemSelect,
    Oqcline,
    ClientSelect,
  },
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
      // 出货检验单表格数据
      oqcList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        oqcCode: null,
        oqcName: null,
        templateId: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        batchCode: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        quantityMinCheck: null,
        quantityMaxUnqualified: null,
        quantityOut: null,
        quantityCheck: null,
        quantityUnqualified: null,
        quantityQuanlified: null,
        crRate: null,
        majRate: null,
        minRate: null,
        crQuantity: null,
        majQuantity: null,
        minQuantity: null,
        checkResult: null,
        outDate: null,
        inspectDate: null,
        inspector: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        oqcCode: [{ required: true, message: '出货检验单编号不能为空', trigger: 'blur' }],
        clientCode: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
        itemCode: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
        quantityOut: [{ required: true, message: '发货数量不能为空', trigger: 'blur' }],
        quantityCheck: [{ required: true, message: '本次检测数量不能为空', trigger: 'blur' }],
        outDate: [{ required: true, message: '请选择出货日期', trigger: 'blur' }],
        inspectDate: [{ required: true, message: '请选择检测日期', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询出货检验单列表 */
    getList() {
      this.loading = true;
      listOqc(this.queryParams).then(response => {
        this.oqcList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
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
        oqcCode: null,
        oqcName: null,
        templateId: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        batchCode: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        quantityMinCheck: null,
        quantityMaxUnqualified: null,
        quantityOut: null,
        quantityCheck: null,
        quantityUnqualified: null,
        quantityQuanlified: null,
        crRate: null,
        majRate: null,
        minRate: null,
        crQuantity: null,
        majQuantity: null,
        minQuantity: null,
        checkResult: null,
        outDate: null,
        inspectDate: null,
        inspector: null,
        status: 'PREPARE',
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.autoGenFlag = false;
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    //查看明细
    handleView(row) {
      this.reset();
      const oqcId = row.id || this.ids;
      getOqc(oqcId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '查看出货检验单信息';
        this.optType = 'view';
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加出货检验单';
      this.optType = 'add';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const oqcId = row.id || this.ids;
      getOqc(oqcId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改出货检验单';
        this.optType = 'edit';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOqc(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addOqc(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    //点击完成
    handleFinish() {
      let that = this;
      if (this.form.checkResult == null) {
        this.$modal.msgError('请选择检测结果！');
        return;
      }

      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$modal.confirm('是否完成出货检验单编制？【完成后将不能更改】').then(function () {
            that.form.status = 'CONFIRMED';
            that.submitForm();
            that.open = false;
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const oqcIds = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除出货检验单编号为"' + oqcIds + '"的数据项？')
        .then(function () {
          return delOqc(oqcIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
    handleSelectProduct() {
      this.$refs.itemSelect.showFlag = true;
    },
    //物料选择弹出框
    onItemSelected(obj) {
      if (obj != undefined && obj != null) {
        this.form.itemId = obj.id;
        this.form.itemCode = obj.itemCode;
        this.form.itemName = obj.itemName;
        this.form.specification = obj.specification;
        this.form.unitOfMeasure = obj.unitOfMeasure;
      }
    },
    handleSelectClient() {
      this.$refs.clientSelect.showFlag = true;
    },
    //客户选择弹出框
    onClientSelected(obj) {
      if (obj != undefined && obj != null) {
        this.form.clientId = obj.id;
        this.form.clientCode = obj.clientCode;
        this.form.clientName = obj.clientName;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'qc/oqc/export',
        {
          ...this.queryParams,
        },
        `oqc_${new Date().getTime()}.xlsx`,
      );
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        genCode('OQC_CODE').then(response => {
          this.form.oqcCode = response;
        });
      } else {
        this.form.oqcCode = null;
      }
    },
  },
};
</script>
