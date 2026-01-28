<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="维修单编号" prop="repairCode">
        <el-input v-model="queryParams.repairCode" placeholder="请输入维修单编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="维修单名称" prop="repairName">
        <el-input v-model="queryParams.repairName" placeholder="请输入维修单名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="设备编码" prop="machineryCode">
        <el-input v-model="queryParams.machineryCode" placeholder="请输入设备编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="设备名称" prop="machineryName">
        <el-input v-model="queryParams.machineryName" placeholder="请输入设备名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="维修结果" prop="repairResult">
        <el-select v-model="queryParams.repairResult" placeholder="请选择维修结果" clearable>
          <el-option v-for="dict in dict.type.mes_repair_result" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="单据状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择单据状态" clearable>
          <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['cmms:dv-repair:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['cmms:dv-repair:update']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['cmms:dv-repair:delete']">删除</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="multiple" @click="finish"  v-hasPermi="['cmms:dv-repair:confirm']">完成</el-button>
      </el-col>



      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="repairList" @selection-change="handleSelectionChange"  ref="multipleTable" @row-click="handleRowClick">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="维修单编号" width="120px" align="center" prop="repairCode" />
      <el-table-column label="维修单名称" width="150px" align="center" prop="repairName" :show-overflow-tooltip="true" />
      <el-table-column label="设备名称" align="center" prop="machineryName" />
      <el-table-column label="报修日期" align="center" prop="requireDate" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.requireDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="维修完成日期" align="center" prop="finishDate" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.finishDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="验收日期" align="center" prop="confirmDate" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.confirmDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修结果" align="center" prop="repairResult">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_repair_result" :value="scope.row.repairResult" />
        </template>
      </el-table-column>
      <el-table-column label="维修人员" align="center" prop="acceptedBy" />
      <el-table-column label="验收人员" align="center" prop="confirmBy" />
      <el-table-column label="单据状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['cmms:dv-repair:update']" v-if="scope.row.status == 'PREPARE'">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['cmms:dv-repair:delete']" v-if="scope.row.status == 'PREPARE'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改设备维修单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="维修单编号" prop="repairCode">
              <el-input v-model="form.repairCode" placeholder="请输入维修单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType === 'add'"> </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修单名称" prop="repairName">
              <el-input v-model="form.repairName" placeholder="请输入维修单名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="维修类型" prop="repairType">
              <el-select v-model="form.repairType" placeholder="请选择维修类型">
                <el-option v-for="dict in dict.type.mes_repair_type" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="设备编号" prop="machineryCode">
              <el-input v-model="form.machineryCode" placeholder="请选择设备" disabled>
                <el-button style="border-color: #46a6ff; background-color: #46a6ff; color: white" slot="append" @click="handleMachineryAdd" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
            <MachinerySelectSingle ref="machinerySelect" @onSelected="onMachineryAdd"></MachinerySelectSingle>
          </el-col>

          <el-col :span="8">
            <el-form-item label="设备名称" prop="machineryName">
              <el-input v-model="form.machineryName" placeholder="请选择设备" disabled />
            </el-form-item>
          </el-col>


        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="品牌" prop="machineryBrand">
              <el-input v-model="form.machineryBrand" placeholder="请选择设备" disabled />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="报修日期" prop="requireDate">
              <el-date-picker clearable v-model="form.requireDate" style="width: 187px" type="datetime" value-format="timestamp" placeholder="请选择报修日期"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="维修完成日期">
              <el-date-picker clearable v-model="form.finishDate" style="width: 187px" type="datetime" value-format="timestamp" placeholder="请选择维修完成日期"> </el-date-picker>
            </el-form-item>
          </el-col>


        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="验收日期" v-if="form.status == 'FINISHED' || form.status == 'APPROVED' || form.status == 'UNAPPROVED' " prop="confirmDate">
              <el-date-picker clearable v-model="form.confirmDate" style="width: 187px" type="datetime" value-format="timestamp" placeholder="请选择验收日期"> </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="维修结果"  >
              <el-radio-group v-model="form.repairResult">
                <el-radio v-for="dict in dict.type.mes_repair_result" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="维修人员" prop="acceptedBy" v-if="form.status == 'APPROVED' || form.status == 'UNAPPROVED' || form.status == 'FINISHED'  ">
              <el-input v-model="form.acceptedBy" readonly="readonly" />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="验收人员" prop="confirmBy" v-if="form.status == 'APPROVED' || form.status == 'UNAPPROVED' || form.status == 'FINISHED' ">
              <el-input v-model="form.confirmBy" readonly="readonly" />
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
      </el-form>
      <!--   repairId   -->
      <el-divider v-if="form.id != null" content-position="center">维修内容</el-divider>
      <el-card shadow="always" v-if="form.id != null" class="box-card">
        <Repairline ref="line" :repairId="form.id" :optType="optType" :parentStatus="form.status"></Repairline>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="form.status == 'PREPARE' && optType != 'view'" @click="submitForm" v-hasPermi="['cmms:dv-repair:update']">保 存</el-button>
        <el-button type="primary" v-if="form.status == 'PREPARE' && optType != 'view'" @click="submitConfirm" v-hasPermi="['cmms:dv-repair:update']">提 交</el-button>
<!--        <el-button type="primary" v-if="form.status == 'APPROVING' && optType != 'view'" @click="finish" v-hasPermi="['cmms:dv-repair:confirm']">完成维修</el-button>-->
<!--        <el-button type="success" v-if="form.status == 'FINISHED' && optType != 'view'" @click="confirm" v-hasPermi="['cmms:dv-repair:confirm']">验收通过</el-button>
        <el-button type="danger" v-if="form.status == 'FINISHED' && optType != 'view'" @click="unconfirm" v-hasPermi="['cmms:dv-repair:confirm']">不通过</el-button>-->
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRepair, getRepair, delRepair, addRepair, updateRepair , finshRepair } from '@/api/mes/dv/repair';
import MachinerySelectSingle from '@/components/machinerySelect/single.vue';
import Repairline from './line.vue';
import { genCode } from '@/api/mes/autocode/rule';
import {getFeedback, initWarehouse, updateFeedback} from "@/api/mes/pro/feedback";
import {toBoolean} from "vue-qr/src/packages/util";
export default {
  name: 'Repair',
  dicts: ['mes_repair_result', 'mes_order_status' , 'mes_repair_type'],
  components: { Repairline, MachinerySelectSingle },
  data() {
    return {
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
      // 设备维修单表格数据
      repairList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        repairCode: null,
        repairName: null,
        machineryId: null,
        machineryCode: null,
        machineryName: null,
        machineryBrand: null,
        machinerySpec: null,
        machineryTypeId: null,
        requireDate: null,
        finishDate: null,
        confirmDate: null,
        repairResult: null,
        acceptedBy: null,
        confirmBy: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        repairType: [{required: true, message: '报工类型不能为空', trigger: 'change'}],
        repairCode: [{ required: true, message: '维修单编号不能为空', trigger: 'blur' }],
        machineryId: [{ required: true, message: '设备ID不能为空', trigger: 'blur' }],
        machineryCode: [{ required: true, message: '设备编码不能为空', trigger: 'blur' }],
        machineryName: [{ required: true, message: '设备名称不能为空', trigger: 'blur' }],
        requireDate: [{ required: true, message: '请选择报修日期', trigger: 'blur' }],
      },
      // 多选框选择项
      selectedRows: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询设备维修单列表 */
    getList() {
      this.loading = true;
      listRepair(this.queryParams).then(response => {
        this.repairList = response.data.list;
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
        repairId: null,
        repairCode: null,
        repairName: null,
        machineryId: null,
        machineryCode: null,
        machineryName: null,
        machineryBrand: null,
        machinerySpec: null,
        machineryTypeId: null,
        requireDate: null,
        finishDate: null,
        confirmDate: null,
        repairResult: '',
        acceptedBy: null,
        confirmBy: null,
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
        repairType: null,
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
      this.ids = selection.map(item => item.id);// repairId
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.selectedRows = selection;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.optType = 'add';
      this.title = '添加设备维修单';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.optType = 'edit';
      const repairId = row.id || this.ids;
      getRepair(repairId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改设备维修单';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log("this.form " , this.form);
          if (this.form.id != null) {
            updateRepair(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addRepair(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    submitConfirm() {
      if (!this.form.repairResult) {
        this.$modal.msgWarning('请先选择维修结果');
        return;
      }

      this.form.status = 'APPROVING';
      this.$refs['form'].validate(valid => {
        this.loading = true;
        if (valid) {
          if(!this.form.id){
            this.$modal.msgError('当前单据未保存, 请先点击保存按钮!');
            // 重置状态
            this.form.status = 'PREPARE';
            this.optType = 'add';
            this.loading = false;
            return;
          }

          if (this.form.id) {
            this.form.feedbackMemberList = this.teamMembers;
            updateRepair(this.form).then(async response => {
              this.$modal.msgSuccess('完成提交!');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const repairIds = row.id || this.ids;
      // 若当前选中行状态不为PREPARE, 禁止删除
      if (row.status !== 'PREPARE') {
        this.$modal.msgError('不允许删除非草稿的单据!');
        return;
      }
      this.$modal
        .confirm('是否确认删除设备维修单编号为"' + repairIds + '"的数据项？')
        .then(function () {
          return delRepair(repairIds);
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
        'dv/repair/export',
        {
          ...this.queryParams,
        },
        `repair_${new Date().getTime()}.xlsx`,
      );
    },
    //设备资源选择弹出
    handleMachineryAdd() {
      this.$refs.machinerySelect.showFlag = true;
    },
    //设备资源选择回调
    onMachineryAdd(row) {
      console.log("row: " , row);
      this.form.machineryId = row.id;
      this.form.machineryTypeId = row.machineryTypeId;
      this.form.machineryCode = row.machineryCode;
      this.form.machineryName = row.machineryName;
      this.form.machineryBrand = row.machineryBrand;
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        genCode('REPAIR_CODE').then(response => {
          this.form.repairCode = response;
        });
      } else {
        this.form.repairCode = null;
      }
    },
    finish(){
      this.form.status = 'FINISHED';
      // 循环selectedRows, 若有一行的状态不为APPROVING, 且没有维修结果(repairResult), 则提示用户
      for (let i = 0; i < this.selectedRows.length; i++) {
        const row = this.selectedRows[i];
        if (row.status === 'FINISHED'){
          this.$modal.msgError('当前单据已审核!');
          return;
        }

        if (row.status !== 'APPROVING' || !row.repairResult) {
          this.$modal.msgWarning("第" + (i+1) + "行请先完成维修!");
          return;
        }
      }
      const ids = this.selectedRows.map(item => item.id);
      console.log("选中的Ids" , ids);

      this.$modal.confirm('是否确认验收设备维修单编号为"' + ids + '"的数据项？')
        .then(function () {
          return finshRepair(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('完成审核');
        })
        .catch(() => {});
    },

    confirm(){
      this.form.status = 'APPROVED';
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id) {
            if(!this.form.repairResult){
              this.$modal.msgWarning('请选择验收结果');
            }
            // this.form.repairResult = "验收通过";
            updateRepair(this.form).then(async response => {
              this.$modal.msgSuccess('验收通过');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    unconfirm(){
      this.form.status = 'UNAPPROVED';
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id) {
            // this.form.repairResult = "验收不通过";
            if(!this.form.repairResult){
              this.$modal.msgWarning('请选择验收结果');
            }
            updateRepair(this.form).then(async response => {
              this.$modal.msgSuccess('验收不通过');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleRowClick(row) {
      // 切换行的选中状态
      this.$refs.multipleTable.toggleRowSelection(row);
    },
  },
};
</script>
