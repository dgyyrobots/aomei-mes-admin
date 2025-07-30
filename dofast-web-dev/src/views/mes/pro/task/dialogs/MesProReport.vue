<template>
    <!-- 报工弹出框 -->
    <el-dialog title="报工" :visible.sync="open" width="960px" append-to-body class="mes-pro-dialog" custom-class="cyber-modal">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="报工类型" prop="feedbackType">
              <el-select v-model="form.feedbackType" placeholder="请选择报工类型">
                <el-option v-for="dict in dict.type.mes_feedback_type" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input disabled v-model="form.workorderCode" placeholder="请选择生产工单"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产任务" prop="taskCode">
              <el-input disabled v-model="form.taskCode" placeholder="请选择生产任务"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品编码" prop="itemCode">
              <el-input disabled v-model="form.itemCode" readonly="readonly"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称" prop="itemName">
              <el-input disabled v-model="form.itemName" readonly="readonly"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input disabled v-model="form.unitOfMeasure" readonly="readonly"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="规格型号" prop="specification">
              <el-input disabled v-model="form.specification" type="textarea" readonly="readonly"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="报工数量" prop="quantityFeedback">
              <el-input readonly="readonly" v-model="form.quantityFeedback"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合格品数量" prop="quantityQualified">
              <el-input-number :min="0" @change="handleQuantityChanged" v-model="form.quantityQualified"
                               placeholder="请输入合格品数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不良品数量" prop="quantityUnquanlified">
              <el-input-number :min="0" @change="handleQuantityChanged" v-model="form.quantityUnquanlified"
                               placeholder="请输入不良品数量"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="报工班组" prop="teamCode">
              <el-input disabled v-model="form.teamCode" placeholder="请输入报工班组"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报工" prop="feedbackTime">
              <el-date-picker disabled clearable v-model="form.feedbackTime" type="date" value-format="timestamp"
                              placeholder="请选择报工"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider>班组成员信息</el-divider>
        <el-row>
          <el-col :span="24">
            <div style="text-align: right; margin-top: 20px;">
              <el-button type="primary" @click="addTeamMember()">新增</el-button>
            </div>
          </el-col>
        </el-row>
        <el-card class="box-card">
          <el-table :data="teamMembers" style="width: 100%">
            <el-table-column prop="id" label="成员ID" width="180"/>
            <el-table-column prop="nickname" label="成员昵称" width="180"/>
            <el-table-column prop="username" label="成员名称" width="180"/>
<!--    <el-table-column prop="position" label="职位"/>-->
            <el-table-column label="岗位">
              <template slot-scope="scope">
                <el-select v-model="scope.row.postIds" multiple placeholder="请选择岗位">
                  <el-option v-for="item in postOptions" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteTeamMember(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <UserSingleSelect ref="userSelect" @onSelected="onUserSelected" main-class="mes-pro-dialog"></UserSingleSelect>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
</template>
<script>
import UserSingleSelect from '@/components/userSelect/single.vue'
import { addFeedback } from '@/api/mes/pro/feedback'
import {getByTeamCodeAndShiftInfo} from '@/api/mes/cal/teammember'
import {listSimplePosts} from "@/api/system/post";
export default {
  dicts: ['mes_order_status', 'mes_workorder_sourcetype', 'mes_pro_task_status', 'mes_feedback_type'],
  components: {
    UserSingleSelect
  },
  data() {
    return {
      open: false,
      row: {
        id: '',
        workorderCode: '',
        workorderName: '',
        taskId: '',
        taskCode: '',
        taskName: '',
        itemId: '',
        itemCode: '',
        itemName: '',
        specification: '',
        unitOfMeasure: '',
        workstationCode: '',
        workstationName: '',
        workstationId: '',
        workorderId: '',
        feedbackStatus: 'N',
        processCode: '',
        processName: '',
        processId: ''
      },
      form: {
        feedbackType: 'N',
        workorderCode: '',
        workorderName: '',
        taskId: '',
        taskCode: '',
        taskName: '',
        itemId: '',
        itemCode: '',
        itemName: '',
        specification: '',
        unitOfMeasure: '',
        workstationCode: '',
        workstationName: '',
        workstationId: '',
        workorderId: '',
        feedbackTime: new Date(),
        feedbackStatus: 'N',
        processCode: '',
        processName: '',
        processId: '',
        quantityFeedback: 0,
        quantityQualified: 0,
        quantityUnquanlified: 0,
        teamCode: ''
      },
      // 表单校验
      rules: {
        taskCode: [{required: true, message: '任务编号不能为空', trigger: 'blur'}],
        taskName: [{required: true, message: '任务名称不能为空', trigger: 'blur'}],
        workorderId: [{required: true, message: '生产工单ID不能为空', trigger: 'blur'}],
        workorderCode: [{required: true, message: '生产工单编号不能为空', trigger: 'blur'}],
        workorderName: [{required: true, message: '工单名称不能为空', trigger: 'blur'}],
        workstationId: [{required: true, message: '工作站ID不能为空', trigger: 'blur'}],
        workstationCode: [{required: true, message: '工作站编号不能为空', trigger: 'blur'}],
        workstationName: [{required: true, message: '工作站名称不能为空', trigger: 'blur'}],
        processId: [{required: true, message: '工序ID不能为空', trigger: 'blur'}],
        itemId: [{required: true, message: '产品物料ID不能为空', trigger: 'blur'}],
        itemCode: [{required: true, message: '产品物料编码不能为空', trigger: 'blur'}],
        itemName: [{required: true, message: '产品物料名称不能为空', trigger: 'blur'}],
        unitOfMeasure: [{required: true, message: '单位不能为空', trigger: 'blur'}],
        quantity: [{required: true, message: '排产数量不能为空', trigger: 'blur'}],
      },
      // 班组成员
      teamMembers: [],
      // 岗位选项
      postOptions: [],
    }
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false
      this.teamMembers = [] // 清空班组成员
      this.reset()
    },
    handleQuantityChanged() {
      this.form.quantityFeedback = this.form.quantityQualified + this.form.quantityUnquanlified
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log('提交表单', this.form)
          this.form.feedbackMemberList = this.teamMembers
          if (this.form.feedbackStatus === 'N') {
            addFeedback(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.$emit('success')
            })
          } else {
            this.$modal.msgError('当前任务已报工!')
            return
          }
        }
      })
    },
    /** 表单重置 */
    reset() {
      this.form = {
        reportFee: undefined,
        id: undefined,
        taskCode: undefined,
        taskName: undefined,
        workorderId: undefined,
        workorderCode: undefined,
        workorderName: undefined,
        workstationId: undefined,
        workstationCode: undefined,
        workstationName: undefined,
        processId: undefined,
        processCode: undefined,
        processName: undefined,
        itemId: undefined,
        itemCode: undefined,
        itemName: undefined,
        specification: undefined,
        unitOfMeasure: undefined,
        quantity: undefined,
        quantityProduced: undefined,
        quantityQuanlify: undefined,
        quantityUnquanlify: undefined,
        quantityChanged: undefined,
        clientId: undefined,
        clientCode: undefined,
        clientName: undefined,
        clientNick: undefined,
        startTime: undefined,
        duration: undefined,
        endTime: undefined,
        colorCode: undefined,
        requestDate: undefined,
        status: undefined,
        remark: undefined,
        attr1: undefined,
        attr2: undefined,
        attr3: undefined,
        attr4: undefined
      }
      this.teamMembers = []
      this.resetForm('form')
    },
    deleteTeamMember(id) {
      // 实现删除班组成员的逻辑
      this.teamMembers = this.teamMembers.filter(member => member.id !== id)
    },
    // 人员选择返回
    onUserSelected(row) {
      console.log(row)
      this.teamMembers.push(row)
    },
    addTeamMember() {
      // 实现新增班组成员的逻辑
      this.$refs.userSelect.showFlag = true
    },
    openDialog(row) {
      this.row = row
      this.title = '报工'
      this.reset()
      console.log(row)
      // if (row.feedbackStatus !== 'N') {
      //   this.$modal.msgError('当前任务已报工!')
      //   return
      // }
      this.form.workorderCode = row.workorderCode
      this.form.workorderName = row.workorderName
      this.form.taskId = row.id
      this.form.taskCode = row.taskCode
      this.form.taskName = row.taskName
      this.form.teamCode = row.attr1
      this.form.itemId = row.itemId
      this.form.itemCode = row.itemCode
      this.form.itemName = row.itemName
      this.form.specification = row.specification
      this.form.unitOfMeasure = row.unitOfMeasure
      this.form.workstationCode = row.workstationCode
      this.form.workstationName = row.workstationName
      this.form.workstationId = row.workstationId
      this.form.workorderId = row.workorderId
      this.form.feedbackTime = new Date()
      this.form.feedbackStatus = row.feedbackStatus
      this.form.processCode = row.processCode
      this.form.processName = row.processName
      this.form.processId = row.processId

      const now = new Date();
      const hour = now.getHours();
      const time = hour >= 7 && hour < 19 ? '0' : '1';
      if(!this.form.shiftInfo) this.form.shiftInfo = time;
      const shiftInfo = this.form.shiftInfo;

      // 基于班组编码获取绑定的人员信息
      getByTeamCodeAndShiftInfo(this.form.teamCode, shiftInfo).then(response => {
        console.log(response)
        for (let i = 0; i < response.data.length; i++) {
          const obj = response.data[i]
          obj.username = obj.userName // 用户名
          obj.nickname = obj.nickName // 昵称
          this.teamMembers.push(obj)
        }
      })
      this.open = true
    },
    getTreeselect() {
      listSimplePosts().then(response => {
        // 处理 postOptions 参数
        this.postOptions = [];
        this.postOptions.push(...response.data);
      });
    },
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
