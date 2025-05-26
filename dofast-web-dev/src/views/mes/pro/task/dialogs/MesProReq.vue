<template>
  <!-- 添加或修改生产领料单头对话框 -->
  <el-dialog title="生产领料" :visible.sync="open" width="75%" append-to-body custom-class="cyber-modal" class="mes-pro-dialog">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="领料单编号" prop="issueCode">
              <el-input v-model="form.issueCode" placeholder="请输入领料单编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="form.status == 'PREPARE'"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领料单名称" prop="issueName">
              <el-input v-model="form.issueName" placeholder="请输入领料单名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="领料日期" prop="issueDate">
              <el-date-picker clearable v-model="form.issueDate" type="date" value-format="timestamp" placeholder="请选择领料日期"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="领料仓库">
              <el-cascader
                v-model="warehouseInfo"
                :options="warehouseOptions"
                :props="warehouseProps"
                placeholder="请选择"s
                @change="handleWarehouseChanged"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select v-model="form.status" disabled>
                <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input v-model="form.workorderCode" placeholder="请选择生产工单">
                <el-button slot="append" icon="el-icon-search" @click="handleWorkorderSelect"></el-button>
              </el-input>
            </el-form-item>
            <WorkorderSelect ref="woSelect" @onSelected="onWorkorderSelected" append-to-body main-class="mes-pro-dialog"/>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户编号">
              <el-input v-model="form.clientCode" placeholder="请选择生产工单" :disabled="optType !== 'add'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <el-input v-model="form.clientName" placeholder="请选择生产工单" :disabled="optType !== 'add'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="任务信息" prop="taskCode">
              <el-input v-model="form.taskCode" placeholder="请选择任务信息" disabled>
                <el-button slot="append" icon="el-icon-search" @click="handleTaskSelect"></el-button>
              </el-input>
            </el-form-item>
            <TaskSelectSingle :processCode="cachedProcessCode" :workorderId="form.workorderId" ref="taskSelect" @onSelected="onTaskSelected" append-to-body main-class="mes-pro-dialog"/>
          </el-col>

          <el-col :span="12">
            <el-form-item label="工作站" prop="workstationName">
              <el-input v-model="form.workstationName" placeholder="请选择工作站" disabled>
                <!--                <el-button slot="append" icon="el-icon-search" @click="handleWorkstationSelect"></el-button>-->
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

<!--        <el-row>
          <el-col :span="12">
            <el-form-item label="设备信息" prop="machineryName">
              <el-input v-model="form.machineryName" placeholder="请选择设备信息" disabled>
                <el-button slot="append" icon="el-icon-search" @click="handleMachineryAdd"></el-button>
              </el-input>
            </el-form-item>
            <MachinerySelectSingle ref="machinerySelect" @onSelected="onMachineryAdd"></MachinerySelectSingle>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider v-if="form.id != null" content-position="center">物料信息</el-divider>
      <el-card shadow="always" v-if="form.id != null" class="box-card">
        <Issueline ref="line" :issueId="form.id" :warehouseId="form.warehouseId" :locationId="form.locationId" :areaId="form.areaId" :optType="optType"></Issueline>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view' || form.status != 'PREPARE'">返回</el-button>
        <el-button type="primary" @click="submitForm" v-if="form.status == 'PREPARE' && optType != 'view'">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
</template>
<script>
import Issueline from '@/views/mes/wm/issue/line.vue';
import WorkstationSelect from '@/components/workstationSelect/simpletableSingle.vue';
import WorkorderSelect from '@/components/workorderSelect/single.vue';
import TaskSelectSingle from '@/components/TaskSelect/taskSelectSingle.vue';
import {getTreeList} from '@/api/mes/wm/warehouse';
export default {
  dicts: ['mes_order_status' , 'mes_pro_task_status'],
  props: {
    workorderId: {
      type: [Number, String],
      default: null
    },
    workorderCode: {
      type: String,
      default: ''
    },
    workorderName: {
      type: String,
      default: ''
    },
    clientId: {
      type: [Number, String],
      default: null
    },
    clientCode: {
      type: String,
      default: ''
    },
    clientName: {
      type: String,
      default: ''
    },
    taskId: {
      type: [Number, String],
      default: null
    },
    taskCode: {
      type: String,
      default: ''
    },
    taskName: {
      type: String,
      default: ''
    },
    processCode: {
      type: String,
      default: ''
    },
    processId: {
      type: [Number, String],
      default: null
    },
    processName: {
      type: String,
      default: ''
    },
    workstationId: {
      type: [Number, String],
      default: null
    },
    workstationCode: {
      type: String,
      default: ''
    },
    workstationName: {
      type: String,
      default: ''
    },
  },
  components: { Issueline, WorkstationSelect, WorkorderSelect, TaskSelectSingle },
  data() {
    return {
      optType: 'add',
      cachedProcessCode: null, // 缓存工序编码
      autoGenFlag: true, // 是否自动生成领料单编号
      warehouseInfo: [],
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
      },
      open: false,
      form: {
        id: null,
        issueCode: '',
        issueName: '',
        issueDate: null,
        status: 'PREPARE',
        workorderId: null,
        workorderCode: '',
        workstationName: '',
        taskCode: '',
        clientCode: '',
        clientName: '',
        remark: ''
      },
      // 表单校验
      rules: {
        issueCode: [{required: true, message: '领料单编号不能为空', trigger: 'blur'}],
        issueDate: [{required: true, message: '请指定领出日期', trigger: 'blur'}],
        workorderCode: [{required: true, message: '请指定生产工单', trigger: 'blur'}],
        workorderId: [{required: true, message: '请指定生产工单', trigger: 'blur'}],
        /* taskName: [{required: true, message: '请指定生产任务', trigger: 'blur'}],
         machineryName: [{required: true, message: '请选择设备信息', trigger: 'blur'}],*/
      },
    }
  },
  created() {
    this.getWarehouseList()
  },
  methods: {
    getWarehouseList() {
      getTreeList().then(response => {
        this.warehouseOptions = response.data;
        // 如果是新增页面，并且warehouseInfo是空数组，自动设置默认值
        if (this.optType === 'add' && this.warehouseInfo.length === 0 && this.warehouseOptions.length > 0) {
          this.warehouseInfo = [this.warehouseOptions[0].value, this.warehouseOptions[0].children[0].value, this.warehouseOptions[0].children[0].children[0].value];
        }
      });
    },
    // 取消按钮
    cancel() {
      this.preventingWatch = true; // 禁用watch
      this.open = false;
      this.taskChanceOpen = false;
      this.reset();
      this.preventingWatch = false; // 启用watch
      this.$emit('cancel');
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form);
        } else {
          this.$message.error('请填写完整信息');
        }
      });
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        this.loading = true;
        genCode('ISSUE_CODE').then(response => {
          this.form.issueCode = response;
          this.loading = false;
        });
      } else {
        this.form.issueCode = null;
      }
    },
    //选择生产工单
    handleWorkorderSelect() {
      this.$refs.woSelect.showFlag = true;
    },
    onWorkorderSelected(row) {
      if (row != undefined && row != null) {
        this.form.workorderId = row.id;
        this.form.workorderCode = row.workorderCode;
        this.form.workorderName = row.workorderName;
        this.form.clientId = row.clientId;
        this.form.clientCode = row.clientCode;
        this.form.clientName = row.clientName;
      }
    },
    handleTaskSelect() {
      this.$refs.taskSelect.showFlag = true;
      this.$refs.taskSelect.getList();
    },
    onTaskSelected(row) {
      console.log(row)
      if (row != undefined && row != null) {
        this.form.taskName = row.taskName;
        this.form.taskCode = row.taskCode;
        this.form.taskId = row.id;
        this.form.processCode = row.processCode;
        this.form.processId = row.processId;
        this.form.workstationCode = row.workstationCode;
        this.form.workstationId = row.workstationId;
        this.form.workstationName = row.workstationName;
        console.log(this.form)
      }
    },
    handleWarehouseChanged(value) {
      // 处理仓库变更逻辑
      console.log('Selected warehouse:', value);
    },
    openDialog() {
      this.reset();
      this.open = true;
    },
    reset() {
      this.form = {
        id: null,
        issueCode: null,
        issueName: null,
        workstationId: this.workorderId,
        workstationCode: this.workorderCode,
        workstationName: this.workorderName,
        workorderId: this.workorderId,
        workorderCode: this.workorderCode,
        workorderName: this.workorderName,
        clientId: this.clientId,
        clientCode: this.clientCode,
        clientName: this.clientName,
        taskId: this.taskId,
        taskCode: this.taskCode,
        warehouseId: this.warehouseId,
        warehouseCode: this.warehouseCode,
        warehouseName: this.warehouseName,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        issueDate: null,
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
        machineryName: null,
        machineryCode: null,
        machineryId: null,
      };
      this.taskForm = {};
      this.warehouseInfo = []; // 重置领料仓库信息
      this.autoGenFlag = false;
      this.resetForm('form');
      this.preventingWatch = false; // 启用watch
    }
  }
}
</script>

<style lang="scss">
/* 全局样式，不使用scoped */
.cyber-modal {
  background-color: rgba(0, 21, 41, 0.85) !important;
  backdrop-filter: blur(5px);
}

/* 强制覆盖Element Plus对话框样式 */
.el-dialog__wrapper.mes-pro-dialog {
  .el-dialog {
    background-color: rgba(0, 21, 41, 0.85);
    border: 1px solid #1ecfff;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(30, 207, 255, 0.4);
    margin-top: 8vh !important; /* 确保优先级足够高 */
    .pagination-container{
      background-color: transparent;
    }

    .el-dialog__header {
      color: #1ecfff !important;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
    }

    .el-dialog__title {
      color: #1ecfff !important;
      font-weight: 500;
      letter-spacing: 1px;
      text-shadow: 0 0 8px rgba(30, 207, 255, 0.5);
      font-size: 16px;
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #1ecfff !important;

      &:hover {
        color: #4fdcff !important;
      }
    }
  }
}

/* 修改loading样式 */
.el-loading-mask {
  background-color: rgba(0, 21, 41, 0.7) !important;

  .el-loading-spinner {
    .circular {
      .path {
        stroke: #1ecfff !important;
      }
    }

    .el-loading-text {
      color: #1ecfff !important;
    }
  }
}
</style>