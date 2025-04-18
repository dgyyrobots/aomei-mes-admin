<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="检验单编号" prop="iqcCode">
        <el-input v-model="queryParams.iqcCode" placeholder="请输入来料检验单编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="供应商编码" prop="vendorCode">
        <el-input v-model="queryParams.vendorCode" placeholder="请输入供应商编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="供应商名称" prop="vendorName">
        <el-input v-model="queryParams.vendorName" placeholder="请输入供应商名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="供应商批次号" prop="vendorBatch">
        <el-input v-model="queryParams.vendorBatch" placeholder="请输入供应商批次号" clearable @keyup.enter.native="handleQuery" />
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
      <el-form-item label="来料日期" prop="reciveDate">
        <el-date-picker clearable v-model="queryParams.reciveDate" type="date" value-format="timestamp" placeholder="请选择来料日期"> </el-date-picker>
      </el-form-item>
      <el-form-item label="检测日期" prop="inspectDate">
        <el-date-picker clearable v-model="queryParams.inspectDate" type="date" value-format="timestamp" placeholder="请选择检测日期"> </el-date-picker>
      </el-form-item>
      <el-form-item label="检测人员" prop="inspector">
        <el-input v-model="queryParams.inspector" placeholder="请输入检测人员" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['qms:iqc:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['qms:iqc:update']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['qms:iqc:delete']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['qms:iqc:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="iqcList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="来料检验单编号" width="140px" align="center" prop="iqcCode">
        <template slot-scope="scope">
          <el-button type="text" @click="handleView(scope.row)" v-hasPermi="['qms:iqc:query']">{{ scope.row.iqcCode }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="来料检验单名称" width="120px" align="center" prop="iqcName" :show-overflow-tooltip="true" />
      <el-table-column label="供应商简称" width="100px" align="center" prop="vendorNick" :show-overflow-tooltip="true" />
      <el-table-column label="供应商批次号" width="120px" align="center" prop="vendorBatch" />
      <el-table-column label="产品物料编码" width="120px" align="center" prop="itemCode" />
      <el-table-column label="产品物料名称" width="120px" align="center" prop="itemName" :show-overflow-tooltip="true" />
      <el-table-column label="接收数量" width="90px" align="center" prop="quantityRecived" />
      <el-table-column label="检测数量" width="90px" align="center" prop="quantityCheck" />
      <el-table-column label="不合格数" align="center" prop="quantityUnqualified" />
      <el-table-column label="检测结果" align="center" prop="checkResult">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_qc_result" :value="scope.row.checkResult" />
        </template>
      </el-table-column>
      <el-table-column label="来料日期" align="center" prop="reciveDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reciveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测日期" align="center" prop="inspectDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inspectDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测人员" align="center" prop="inspectorName" />
      <el-table-column label="单据状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" v-if="scope.row.status == 'PREPARE'" @click="handleUpdate(scope.row)" v-hasPermi="['qms:iqc:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.status == 'PREPARE'" @click="handleDelete(scope.row)" v-hasPermi="['qms:iqc:delete']">删除</el-button>
<!--          <el-button size="mini" type="text" icon="el-icon-delete" @click="viewReport"> 查看报表 </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改来料检验单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1080px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="检验单编号" prop="iqcCode">
              <el-input v-model="form.iqcCode" placeholder="请输入来料检验单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view' && form.status == 'PREPARE'"> </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="检验单名称" prop="iqcName">
              <el-input v-model="form.iqcName" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="3" align="middle">
            <el-image fit="contain" v-if="form.checkResult == 'ACCEPT'" :src="acceptImg" />
            <el-image fit="contain" v-else-if="form.checkResult == 'REJECT'" :src="rejectImg" />
            <el-image fit="contain" v-else :src="prepareImg" />
          </el-col>
        </el-row>
        <el-divider content-position="center">物料与供应商</el-divider>
        <el-row>

          <el-col :span="8">
            <el-form-item label="采购单信息" prop="itemCode">
              <el-input v-if="form.id == null" v-model="form.itemCode" readonly placeholder="请选择物料">
                <el-button slot="append" @click="handleSelectGoods" icon="el-icon-search"></el-button>
              </el-input>
              <!--如果已经保存过，则产品不允许再修改，需要修改就删除重做-->
              <el-input v-else v-model="form.itemCode"> </el-input>
            </el-form-item>

            <GoodsSelect ref="goodsSelect" @onSelected="onGoodsSelected" ></GoodsSelect>

          </el-col>

          <el-col :span="8">
            <el-form-item label="产品物料编码" prop="itemCode">
              <el-input disabled v-if="form.id == null" v-model="form.itemCode" readonly placeholder="请选择物料">
                <el-button disabled slot="append" @click="handleSelectProduct" icon="el-icon-search"></el-button>
              </el-input>
              <!--如果已经保存过，则产品不允许再修改，需要修改就删除重做-->
              <el-input v-else v-model="form.itemCode"> </el-input>
            </el-form-item>
            <ItemSelect ref="itemSelect" @onSelected="onItemSelected"> </ItemSelect>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品物料名称" prop="itemName">
              <el-input disabled v-model="form.itemName" readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input disabled v-model="form.unitOfMeasure" readonly="readonly" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商编码" prop="vendorCode">
              <el-input v-model="form.vendorCode" readonly placeholder="请选择供应商">
                <el-button slot="append" @click="handleSelectVendor" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
            <VendorSelect ref="vendorSelect" @onSelected="onVendorSelected" />
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商简称" prop="vendorNick">
              <el-input v-model="form.vendorNick" readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商批次号" prop="vendorBatch">
              <el-input v-model="form.vendorBatch" placeholder="请输入供应商批次号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">检测情况</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="本次接收数量" prop="quantityRecived">
              <el-input-number :min="1" v-model="form.quantityRecived" placeholder="请输入本次接收数量" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本次检测数量" prop="quantityCheck">
              <el-input :min="1" v-model="form.quantityCheck" placeholder="请输入本次检测数量" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不合格数量" prop="quantityUnqualified">
              <el-input-number :min="0" v-model="form.quantityUnqualified" placeholder="请输入不合格数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="来料日期" prop="reciveDate">
              <el-date-picker clearable v-model="form.reciveDate" type="date" value-format="timestamp" placeholder="请选择来料日期"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检测日期" prop="inspectDate">
              <el-date-picker clearable v-model="form.inspectDate" type="date" value-format="timestamp" placeholder="请选择检测日期"> </el-date-picker>
            </el-form-item>
          </el-col>
              <!--   检验结果基于物料的检测项       -->
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

        <el-row>
          <el-col :span="24">
            <el-form-item label="附件" prop="adjuncts">
              <file-upload :isShowTips="isShowDelete" v-model="form.adjuncts" :file-type="adjunctTypes" :limit="20" :file-size="100"></file-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-collapse accordion>
          <el-collapse-item title="结果统计">
            <el-row>
              <el-col :span="8">
                <el-form-item label="致命缺陷率" prop="crRate">
                  <el-input v-model="form.crRate" readonly="readonly" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="严重缺陷率" prop="majRate">
                  <el-input v-model="form.majRate" readonly="readonly" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="轻微缺陷率" prop="minRate">
                  <el-input v-model="form.minRate" readonly="readonly" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="致命缺陷数量" prop="crQuantity">
                  <el-input v-model="form.crQuantity" readonly="readonly" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="严重缺陷数量" prop="majQuantity">
                  <el-input v-model="form.majQuantity" readonly="readonly" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="轻微缺陷数量" prop="minQuantity">
                  <el-input v-model="form.minQuantity" readonly="readonly" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-divider v-if="form.iqcId != null" content-position="center">检测项</el-divider>
        <el-card shadow="always" v-if="form.id != null" class="box-card">
          <IqcLine ref="line" :iqcId="form.id" :optType="optType"></IqcLine>
        </el-card>
      </el-form>
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
import { listIqc, getIqc, delIqc, addIqc, updateIqc , updateIqcAdjuncts } from '@/api/mes/qc/iqc';
import ItemSelect from '@/components/itemSelect/single.vue';
import VendorSelect from '@/components/vendorSelect/single.vue';
import IqcLine from './iqcline.vue';
import { genCode } from '@/api/mes/autocode/rule';
import { getReport2 } from '@/api/mes/report/report';
import GoodsSelect from '@/components/purchaseGoods/single.vue';
import FileUpload from "@/components/FileUpload/index3.vue";
import {updateMdItemAdjuncts} from "@/api/mes/md/mdItem";

export default {
  name: 'Iqc',
  dicts: ['mes_qc_result', 'mes_order_status'],
  components: {FileUpload, ItemSelect, VendorSelect, IqcLine , GoodsSelect},
  data() {
    return {
      //自动生成编码
      autoGenFlag: false,
      optType: undefined,
      acceptImg: require('@/assets/images/accept.png'),
      rejectImg: require('@/assets/images/reject.png'),
      prepareImg: require('@/assets/images/prepare.png'),
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
      // 来料检验单表格数据
      iqcList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        iqcCode: null,
        iqcName: null,
        templateId: null,
        vendorId: null,
        vendorCode: null,
        vendorName: null,
        vendorNick: null,
        vendorBatch: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        quantityMinCheck: null,
        quantityMaxUnqualified: null,
        quantityRecived: null,
        quantityCheck: null,
        quantityUnqualified: null,
        crRate: null,
        majRate: null,
        minRate: null,
        crQuantity: null,
        majQuantity: null,
        minQuantity: null,
        checkResult: null,
        reciveDate: null,
        inspectDate: null,
        inspector: null,
        status: null,
        adjuncts: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        iqcCode: [{ required: true, message: '来料检验单编号不能为空', trigger: 'blur' }],
        iqcName: [{ required: true, message: '来料检验单名称不能为空', trigger: 'blur' }],
        vendorCode: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
        itemCode: [{ required: true, message: '物料不能为空', trigger: 'blur' }],
        quantityRecived: [{ required: true, message: '本次接收数量不能为空', trigger: 'blur' }],
        quantityCheck: [{ required: true, message: '本次检测数量不能为空', trigger: 'blur' }],
        reciveDate: [{ required: true, message: '清选择来料日期', trigger: 'blur' }],
        inspectDate: [{ required: true, message: '清选择检验日期', trigger: 'blur' }],
      },
      // 用于管控图片删除按钮
      isShowDelete: true,
      adjunctTypes: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询来料检验单列表 */
    getList() {
      this.loading = true;
      listIqc(this.queryParams).then(response => {
        this.iqcList = response.data.list;
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
        iqcCode: null,
        iqcName: null,
        templateId: null,
        vendorId: null,
        vendorCode: null,
        vendorName: null,
        vendorNick: null,
        vendorBatch: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        quantityMinCheck: null,
        quantityMaxUnqualified: null,
        quantityRecived: null,
        quantityCheck: null,
        quantityUnqualified: null,
        crRate: null,
        majRate: null,
        minRate: null,
        crQuantity: null,
        majQuantity: null,
        minQuantity: null,
        checkResult: null,
        reciveDate: null,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加来料检验单';
      this.form.inspectDate = new Date(); // 追加当前时间展示
      this.optType = 'add';
    },
    //查看明细
    handleView(row) {
      this.reset();
      const iqcId = row.id || this.ids;
      getIqc(iqcId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '查看来料检验单信息';
        this.optType = 'view';
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const iqcId = row.id || this.ids;
      getIqc(iqcId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改来料检验单';
        this.optType = 'edit';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateIqc(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              //this.open = false;
              this.getList();
            });
          } else {
            addIqc(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              //this.open = false;
              this.form.id = response.data;
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
          this.$modal.confirm('是否完成来料检验单编制？【完成后将不能更改】').then(function () {
            that.form.status = 'CONFIRMED';
            that.submitForm();
            that.open = false;
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const iqcIds = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除来料检验单编号为"' + iqcIds + '"的数据项？')
        .then(function () {
          return delIqc(iqcIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'qc/iqc/export',
        {
          ...this.queryParams,
        },
        `iqc_${new Date().getTime()}.xlsx`,
      );
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
    handleSelectVendor() {
      this.$refs.vendorSelect.showFlag = true;
    },
    //供应商选择弹出框
    onVendorSelected(obj) {
      if (obj != undefined && obj != null) {
        this.form.vendorId = obj.id;
        this.form.vendorCode = obj.vendorCode;
        this.form.vendorName = obj.vendorName;
        this.form.vendorNick = obj.vendorNick;
      }
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        genCode('QC_IQC_CODE').then(response => {
          this.form.iqcCode = response;
        });
      } else {
        this.form.iqcCode = null;
      }
    },
    viewReport() {
      var reportName = 'Test';
      getReport2(reportName).then(res => {
        let blob = new Blob([res], { type: 'application/pdf' });
        let href = URL.createObjectURL(blob);
        console.log(href);
        window.open(`/pdf/web/viewer.html?file=${encodeURIComponent(href)}`);
      });
    },
    handleSelectGoods() {
      this.$refs.goodsSelect.showFlag = true;
    },
    //采购选择弹出框
    onGoodsSelected(obj) {
      if (obj != undefined && obj != null) {
        console.log(obj);
        this.form.poNo = obj.poNo;
        this.form.itemCode = obj.goodsNumber;
        this.form.itemName = obj.goodsName;
        this.form.specification = obj.goodsSpecs;
        this.form.unitOfMeasure = obj.company;
        this.form.quantityRecived = obj.receiveNum;
        this.form.reciveDate = obj.createTime;
      }
    },
  },
  'form.adjuncts': {
    handler(newVal, oldVal) {
      /*if(!newVal){
        return;
      }*/
      console.log(newVal, oldVal);
      //if (this.optType !== 'view') {
        this.form.adjuncts = newVal;
        // 开始更新附件
        updateIqcAdjuncts(this.form).then(response => {
          this.$modal.msgSuccess('附件修改成功');
          return;
        });
      //}
    },
  }
};
</script>
