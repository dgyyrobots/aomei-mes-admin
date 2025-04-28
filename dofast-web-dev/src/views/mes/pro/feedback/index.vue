<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="报工类型" prop="feedbackType">
        <el-select v-model="queryParams.feedbackType" placeholder="请选择报工类型" clearable>
          <el-option v-for="dict in dict.type.mes_feedback_type" :key="dict.value" :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="工作站名称" prop="workstationName">
        <el-input v-model="queryParams.workstationName" placeholder="请输入工作站名称" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产工单编号" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入生产工单编号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="报工单号" prop="feedbackCode">
        <el-input v-model="queryParams.feedbackCode" placeholder="请输入报工单号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="产品物料编码" prop="itemCode">
        <el-input v-model="queryParams.itemCode" placeholder="请输入产品物料编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="产品物料名称" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入产品物料名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产工序" prop="processCode">
        <el-select @change="val => { handleProcessChange(val) }" v-model="queryParams.processCode" placeholder="请选择生产工序" clearable>
          <el-option v-for="item in processOptions" :key="item.processCode" :label="item.processName" :value="item.processCode"/>
        </el-select>
      </el-form-item>


      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label"
                     :value="dict.value"/>
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
                   v-hasPermi="['pro:feedback:create']">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                   v-hasPermi="['pro:feedback:update']">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                   v-hasPermi="['pro:feedback:delete']">删除
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" :disabled="multiple" size="mini" @click="handleBatchPrint"
                   v-hasPermi="['pro:feedback:create']"> 批量打印
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-success" size="mini" :disabled="single" @click="warehousing" v-hasPermi="['pro:feedback:warehousing']">入库</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="single" @click="split" v-hasPermi="['pro:feedback:split']">拆分</el-button>
      </el-col>

      <el-col :span="1.5"><!---->
        <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="single" @click="cancelReport" v-hasPermi="['pro:feedback:reFeedback']">撤销报工</el-button>
      </el-col>

      <el-col :span="1.5"><!--"-->
        <el-button type="warning" plain icon="el-icon-merge" size="mini" :disabled="multiple" v-hasPermi="['pro:feedback:merge']" @click="handleMerge">合并</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="feedbackList" @selection-change="handleSelectionChange" ref="multipleTable" @row-click="handleRowClick">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="报工类型" align="center" prop="feedbackType">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.mes_feedback_type" :value="scope.row.feedbackType"/>
              </template>
            </el-table-column>-->
      <el-table-column label="工作站" width="180px" align="center" prop="workstationName"/>
      <el-table-column label="报工单号" width="210px" align="center" prop="feedbackCode"/>
      <el-table-column label="生产工单编号" width="150px" align="center" prop="workorderCode"/>
      <!--      <el-table-column label="产品物料编码" width="120px" align="center" prop="itemCode"/>-->
      <el-table-column label="产品物料名称" width="150px" align="center" prop="itemName" :show-overflow-tooltip="true"/>
      <el-table-column label="规格型号" align="center" prop="specification" :show-overflow-tooltip="true"/>
      <el-table-column label="生产工序" align="center" prop="processName"/>
      <el-table-column fixed="right" label="报工数量" align="center" prop="quantityFeedback"/>
      <el-table-column fixed="right" label="报工人" align="center" prop="nickName"/>
      <el-table-column fixed="right" label="报工时间" align="center" prop="feedbackTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.feedbackTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="190px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-query" @click="handleView(scope.row)"
                     v-hasPermi="['pro:feedback:query']">查看
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['pro:feedback:update']" v-if="scope.row.status == 'PREPARE'">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['pro:feedback:delete']" v-if="scope.row.status == 'PREPARE'">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 添加或修改生产报工记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
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
              <el-input v-model="form.workorderCode" placeholder="请选择生产工单">
                <el-button slot="append" icon="el-icon-search" @click="handleWorkorderSelect"></el-button>
              </el-input>
            </el-form-item>
            <WorkorderSelect ref="woSelect" @onSelected="onWorkorderSelected"></WorkorderSelect>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产任务" prop="taskCode">
              <el-input v-model="form.taskCode" placeholder="请选择生产任务">
                <el-button slot="append" icon="el-icon-search" @click="handleTaskSelect"></el-button>
              </el-input>
            </el-form-item>
            <ProtaskSelect ref="taskSelect" :workorderId="form.workorderId" @onSelected="onTaskSelected"></ProtaskSelect>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品编码" prop="itemCode">
              <el-input v-model="form.itemCode" readonly="readonly"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称" prop="itemName">
              <el-input v-model="form.itemName" readonly="readonly"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input v-model="form.unitOfMeasure" readonly="readonly"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="规格型号" prop="specification">
              <el-input v-model="form.specification" type="textarea" readonly="readonly"/>
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
        <!--        <el-row>
                  <el-col :span="8">
                    <el-form-item label="报工人" prop="nickName">
                      <el-input v-model="form.nickName" placeholder="请选择报工人">
                        <el-button slot="append" @click="handleUserSelect" icon="el-icon-search"></el-button>
                      </el-input>
                    </el-form-item>
                    <UserSingleSelect ref="userSelect" @onSelected="onUserSelected"></UserSingleSelect>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="报工时间" prop="feedbackTime">
                      <el-date-picker clearable v-model="form.feedbackTime" type="date" value-format="timestamp"
                                      placeholder="请选择报工时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="审核人" prop="recordNick">
                      <el-input v-model="form.recordNick" placeholder="请选择审核人">
                        <el-button slot="append" @click="handleUser2Select" icon="el-icon-search"></el-button>
                      </el-input>
                    </el-form-item>
                    <UserSingleSelect ref="user2Select" @onSelected="onUser2Selected"></UserSingleSelect>
                  </el-col>
                </el-row>-->
        <el-row>

          <el-col :span="8">
            <el-form-item label="报工班组" prop="teamCode">
              <el-input v-model="form.teamCode" disabled placeholder="请输入报工班组"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="班组负责人" prop="principalName">
              <el-input v-model="form.principalName" placeholder="请选择班组负责人" disabled>
                <el-button slot="append" icon="el-icon-search" @click="handleUser2Select"></el-button>
              </el-input>
            </el-form-item>
            <UserSingleSelect ref="user2Select" @onSelected="onUser2Selected"></UserSingleSelect>
          </el-col>

          <el-col :span="8">
            <el-form-item label="报工时间" prop="feedbackTime">
              <el-date-picker style="width: 100%" clearable v-model="form.feedbackTime" type="date" value-format="timestamp"
                              placeholder="请选择报工时间"></el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>

          <el-col :span="8">
            <el-form-item label="班次信息" prop="shiftInfo">
              <el-select v-model="form.shiftInfo" placeholder="请选择班次信息" @change="handleShiftChange">
                <el-option v-for="dict in dict.type.mes_shift_info" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="设备信息" prop="machineryName">
              <el-input v-model="form.machineryName" placeholder="请选择设备信息" disabled>
                <el-button slot="append" icon="el-icon-search" @click="handleMachineryAdd"></el-button>
              </el-input>
            </el-form-item>
            <MachinerySelectSingle ref="machinerySelect" @onSelected="onMachineryAdd"></MachinerySelectSingle>
          </el-col>

          <el-col :span="8">
            <el-form-item v-if=" form.status == 'APPROVING' " label="仓库信息">
              <el-cascader v-model="wareHouse" :options="warehouseOptions" :props="warehouseProps" @change="handleWarehouseChanged"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>

        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="班组成员信息" name="1">
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
                <!--            <el-table-column prop="position" label="职位"/>-->
                <el-table-column label="岗位">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.postIds"
                      multiple
                      placeholder="请选择岗位"
                      @change="handlePostChange(scope.row)"
                    >
                      <el-option
                        v-for="item in postOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
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
          </el-collapse-item>

          <el-collapse-item title="机长自检" name="2">
            <el-card class="box-card">
              <el-table :data="processDefectList" max-height="420px" style="width: 100%; height: 420px">
                <el-table-column prop="index" label="序号" width="180"/>
                <el-table-column prop="defectName" label="缺陷项名称" width="240"/>
                <el-table-column label="起始米数" width="205">
                  <template slot-scope="scope">
                    <el-input
                      v-model.number="scope.row.startMeter"
                      placeholder="请输入起始米数"
                      type="number"
                      @input="handleStartMeterInput(scope.$index, $event)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="结束米数" width="205">
                  <template slot-scope="scope">
                    <el-input
                      v-model.number="scope.row.endMeter"
                      placeholder="请输入结束米数"
                      type="number"
                      @input="handleEndMeterInput(scope.$index, $event)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="缺陷米数" width="205">
                  <template slot-scope="scope">
                    <el-input
                      v-model.number="scope.row.defectMeter"
                      placeholder="请输入缺陷米数"
                      type="number"
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-collapse-item>
        </el-collapse>

        <UserSingleSelect ref="userSelect" @onSelected="onUserSelected"></UserSingleSelect>

        <!--        <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
                    </el-form-item>
                  </el-col>
                </el-row>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view' || form.status != 'PREPARE'">返回</el-button>
        <el-button type="primary" @click="submitForm" v-if="form.status == 'PREPARE' && optType != 'view'">保 存
        </el-button>
        <el-button type="primary" @click="handleSubmit" v-if="form.status == 'PREPARE' && optType != 'view'" v-hasPermi="['pro:feedback:submit']">提交审批
        </el-button>
        <el-button type="success" @click="handleExecute" v-if="form.status == 'APPROVING' && form.id != null" v-hasPermi="['pro:feedback:approval']">审批通过
        </el-button>
        <el-button type="danger" @click="handleReject" v-if="form.status == 'APPROVING' && form.id != null" v-hasPermi="['pro:feedback:approval']">审批不通过
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!--  入库--报废  -->
<!--    <el-dialog :title="title" :visible.sync="wareOpen" width="75%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="wareForm" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="报工单" prop="id">
              <el-input v-model="wareForm.id" placeholder="请扫描报工单" @blur="handleBlur"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" round @click="getCameraInfo()">摄像头</el-button>
          </el-col>

        </el-row>

        &lt;!&ndash; 设置el-table的高度 &ndash;&gt;
        <el-table v-loading="loading" :data="wareList" height="500">
          <el-table-column label="产品编号" align="center" prop="itemCode"/>
          <el-table-column label="产品名称" align="center" prop="itemName"/>
          <el-table-column label="工单号" align="center" prop="workorderCode"/>
          <el-table-column label="生产车间" align="center" prop="workstationName"/>
          <el-table-column label="任务单号" align="center" prop="taskCode"/>
          <el-table-column label="合格数量" align="center" prop="quantityQualified"/>
          <el-table-column label="产品单位" align="center" prop="unitOfMeasure"/>
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div>
        <video ref="videoCamera" style="display: none;"></video>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitWareForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>-->

    <!-- 摄像头预览弹出框 -->
    <el-dialog title="摄像头预览" :visible.sync="cameraPreviewVisible" width="50%" v-dialogDrag append-to-body>
      <div> <!--v-if="cameraPreviewVisible"-->
        <video ref="videoCameraPreview" autoplay playsinline style="width: 100%; height: auto;"></video>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cameraPreviewVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 拆分弹出框 -->
    <el-dialog :title="'拆分详情'" :visible.sync="splitDialogVisible" width="50%" v-dialogDrag append-to-body>
      <el-form ref="splitForm" :model="splitForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报工单号" prop="workorderCode">
              <el-input disabled v-model="splitForm.workorderCode" placeholder="请输入报工单号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品物料编码" prop="itemCode">
              <el-input disabled v-model="splitForm.itemCode" placeholder="请输入产品物料编码"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入库数量" prop="quantityFeedback">
              <el-input disabled v-model="splitForm.quantityFeedback" placeholder="请输入报工数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库单位" prop="unitOfMeasure">
              <el-input disabled v-model="splitForm.unitOfMeasure" placeholder="请输入入库单位"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div style="text-align: right; margin-top: 20px;">
        <el-button type="primary" @click="addSplitDetailByQuantity">按数量拆分</el-button>
        <el-button type="primary" @click="addSplitDetail">新增</el-button>
      </div>

      <!-- 拆分表格 -->
      <el-table :data="splitDetails" style="width: 100%;" max-height="400">
        <el-table-column prop="workorderCode" label="工单号" width="180"/>
        <el-table-column prop="itemCode" label="物料料号" width="180"/>
        <el-table-column prop="unitOfMeasure" label="物料单位" width="180"/>
        <el-table-column prop="quantity" label="数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.quantity" type="number" placeholder="请输入数量"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="removeSplitDetail(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="splitDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSplit">确定拆分</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {listFeedback, getFeedback, delFeedback, addFeedback, updateFeedback, execute, executes, startWareHousing, splitFeedback, checkWarehousing, reFeedback, mergeFeedback, initWarehouse} from '@/api/mes/pro/feedback';
import WorkorderSelect from '@/components/workorderSelect/single.vue';
import WorkstationSelect from '@/components/workstationSelect/simpletableSingle.vue';
import UserSingleSelect from '@/components/userSelect/single.vue';
import ProtaskSelect from '@/components/TaskSelect/taskSelectSingle.vue';
import {getConfigKey} from '@/api/system/config';
import {getAccessToken} from '@/utils/auth';
import {getTreeList} from '@/api/mes/wm/warehouse';
import {createPrintLog, getPrintLogPage} from "@/api/report/printLog";
import jsQR from "jsqr";
import {getByTeamCodeAndShiftInfo, getTeammemberByTeamCode} from '@/api/mes/cal/teammember';
import {listTeam} from "@/api/mes/cal/team";
import '@/utils/CLodopfuncs2.js';
import {getByCode} from '@/api/mes/pro/processDefect';
import {getQcdefectByCode} from '@/api/mes/qc/qcdefect';
import {listProcess} from "@/api/mes/pro/process";
import {getQcindexByProcessCode} from '@/api/mes/qc/qcindex';
import MachinerySelectSingle from "@/components/machinerySelect/single.vue";
import {listSimplePosts} from "@/api/system/post";

export default {
  name: 'Feedback',
  components: {MachinerySelectSingle, WorkorderSelect, WorkstationSelect, UserSingleSelect, ProtaskSelect},
  dicts: ['mes_order_status', 'mes_feedback_type', 'mes_shift_info'],
  data() {
    return {
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
      // 生产报工记录表格数据
      feedbackList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 入库弹出层
      wareOpen: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        feedbackType: null,
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        workorderId: null,
        workorderCode: null,
        workorderName: null,
        taskId: null,
        taskCode: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        unitOfMeasure: null,
        specification: null,
        quantity: null,
        quantityFeedback: null,
        quantityQualified: null,
        quantityUnquanlified: null,
        userName: null,
        nickName: null,
        feedbackChannel: null,
        feedbackTime: null,
        recordUser: null,
        recordNick: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        feedbackType: [{required: true, message: '报工类型不能为空', trigger: 'change'}],
        taskCode: [{required: true, message: '请选择生产任务', trigger: 'blur'}],
        workorderCode: [{required: true, message: '生产工单不能为空', trigger: 'blur'}],
        quantityQualified: [{required: true, message: '请输入合格品数量', trigger: 'blur'}],
        quantityUnquanlified: [{required: true, message: '请输入不合格品数量', trigger: 'blur'}],
        nickName: [{required: true, message: '请选择报工人', trigger: 'blur'}],
        feedbackTime: [{required: true, message: '请选择报工时间', trigger: 'blur'}],
      },
      // 仓库数据
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
      },
      //摄像头配置
      targetCameraId: null,
      videoWidth: 640,
      videoHeight: 480,
      cameraPreviewVisible: false, // 控制摄像头弹出框
      scanResult: '', // 存储扫描结果
      // 入库表单参数
      wareForm: {},
      // 准备入库的产成品明细
      wareList: [],
      // 拆分弹出框是否可见
      splitDialogVisible: false,
      // 拆分表单数据
      splitForm: {
        workorderCode: '',
        itemCode: '',
        quantityFeedback: '',
        unitOfMeasure: ''
      },
      selectedRows: [], // 选中行数据
      // 拆分详情列表
      splitDetails: [],
      teamMembers: [],
      // 缺陷列表
      processDefectList: [],
      // 测试缺陷级联选择器
      cascaderOptions: [],
      cascaderProps: {
        value: 'value',
        label: 'label',
        children: 'children',
        multiple: true,
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      upperLimit: 100,  // 米数区间的上限
      lowerLimit: 5000, // 米数区间的下限
      step: 100,        // 步长
      loadingMore: false, // 控制加载更多的状态
      currentMaxLimit: 5000,  // 当前加载的最大下限
      loadingStatus: {},
      processOptions: [], // 工序选项
      activeName: '1',
      qcIndexList: [], // 机长自检列表
      wareHouse: [], // 仓库信息
      // 岗位选项
      postOptions: [],
    };
  },
  created() {
    // 从 localStorage 恢复
    this.queryParams.processCode = localStorage.getItem('cachedProcessCode') || null;
    this.getList();
    this.getProcess();
    this.getWarehouseList();
    this.getTreeselect();
  },
  methods: {
    /** 查询生产报工记录列表 */
    getList() {
      this.loading = true;
      listFeedback(this.queryParams).then(response => {
        this.feedbackList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.wareOpen = false;
      this.teamMembers = []; // 清空班组成员
      this.processDefectList = []; // 清空缺陷列表
      this.cascaderOptions = []; // 清空缺陷级联选择器
      //this.removeScrollListener();
      this.wareList = []; // 清空入库列表
      this.wareHouse = [];
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        feedbackType: null,
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        processId: null,
        processCode: null,
        processName: null,
        workorderId: null,
        workorderCode: null,
        workorderName: null,
        taskId: null,
        taskCode: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        quantity: null,
        quantityFeedback: null,
        quantityQualified: null,
        quantityUnquanlified: null,
        userName: null,
        nickName: null,
        feedbackChannel: null,
        feedbackTime: null,
        recordUser: null,
        recordNick: null,
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
        defectId: null,
        principalName: null,
        principalId: null,
        cascaderValues: [],  // 存储级联选择的值
        machineryCode: null,
        machineryName: null,
        machineryId: null,
      };
      this.resetForm('form');
      this.teamMembers = []; // 清空班组成员
      this.processDefectList = []; // 清空缺陷列表
      this.cascaderOptions = []; // 清空缺陷级联选择器
    },
    handleQuantityChanged() {
      this.form.quantityFeedback = this.form.quantityQualified + this.form.quantityUnquanlified;
      //this.currentMaxLimit = this.form.quantityFeedback;
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
      this.form.feedbackTime = new Date(); // 追加当前时间展示
      this.form.feedbackType ="UNI"; // 默认选中
      this.title = '添加生产报工记录';
      this.optType = 'add';
      // 初始化时读取设备缓存
      this.loadMachineryCache();
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const recordId = row.id || this.ids;
      await getFeedback(recordId).then(response => {
        this.form = response.data;
        console.log("获取的表单信息: " , this.form.memberList);
        for (let i = 0; i < this.form.memberList.length; i++) {
          this.form.memberList[i].nickname = this.form.memberList[i].nickName;
          this.form.memberList[i].username = this.form.memberList[i].userName;

          if (this.form.memberList[i].postIds) {
            const idsString = this.form.memberList[i].postIds.replace(/[^0-9,]/g, ''); // 清理字符串
            if (idsString) {
              this.form.memberList[i].postIds = idsString.split(',').map(Number); // 转换为数字数组
            }
          }
        }

        this.teamMembers =  this.form.memberList;
        this.processDefectList = response.data.processDefectList.map((item, index) => ({
          ...item,
          index: index + 1  // 从1开始编号
        }));
        /* if (this.form.processCode) {
          // 追加缺陷下拉框
          getByCode(this.form.processCode).then(response => {
            this.processDefectList = response.data;
            this.changeDefectList();
          });
        }*/
      });

      await initWarehouse({
        workorderId: this.form.workorderId,
        taskId: this.form.taskId
      }).then(response => {
        this.wareHouse = [
          response.warehouse.id,
          response.location.id,
          response.area.id
        ];
        this.form.warehouseId = response.warehouse.id;
        this.form.locationId = response.location.id;
        this.form.areaId = response.area.id;
        console.log("this.wareHouse" , this.wareHouse);
        this.$nextTick(() => {
          this.open = true;
          this.title = '修改生产报工记录';
          this.optType = 'edit';
        });
      });

    },
    // 查询明细按钮操作
    async handleView(row) {
      this.reset();
      const recordId = row.id || this.ids;
      await getFeedback(recordId).then(response => {
        // 在此处更改 审核人
        // response.data.recordNick = response.data.recordNick ? response.data.recordNick : this.$store.state.user.nickname;
        console.log(response.data);
        this.form = response.data;
        for (let i = 0; i < this.form.memberList.length; i++) {
          this.form.memberList[i].nickname = this.form.memberList[i].nickName;
          this.form.memberList[i].username = this.form.memberList[i].userName;

          if (this.form.memberList[i].postIds) {
            const idsString = this.form.memberList[i].postIds.replace(/[^0-9,]/g, ''); // 清理字符串
            if (idsString) {
              this.form.memberList[i].postIds = idsString.split(',').map(Number); // 转换为数字数组
            }
          }
        }

        this.teamMembers = this.form.memberList;
        this.processDefectList = response.data.processDefectList.map((item, index) => ({
          ...item,
          index: index + 1  // 从1开始编号
        }));

        /*if (this.form.processCode) {
          // 追加缺陷下拉框
          getByCode(this.form.processCode).then(response => {
            this.processDefectList = response.data;
            this.changeDefectList();
          });
        }*/
      });

      await initWarehouse({
        workorderId: this.form.workorderId,
        taskId: this.form.taskId
      }).then(response => {
        this.wareHouse = [
          response.warehouse.id,
          response.location.id,
          response.area.id
        ];
        this.form.warehouseId = response.warehouse.id;
        this.form.locationId = response.location.id;
        this.form.areaId = response.area.id;
        console.log("this.wareHouse" , this.wareHouse);
        this.$nextTick(() => {
          this.open = true;
          this.title = '查看生产报工记录';
          this.optType = 'view';
        });
      });

    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        this.form.processDefectList = this.processDefectList; // 追加缺陷项管控
        this.form.processDefectList.forEach((defect, index) => {
          const startMeter = parseFloat(defect.startMeter);
          const endMeter = parseFloat(defect.endMeter);

          if (!startMeter && !endMeter) {
            return;
          }
          if (isNaN(startMeter) || isNaN(endMeter)) {
            this.$message.error(`第${index + 1}行米数填写错误，请输入有效数字！`);
            valid = false;
            return;
          }

          if (startMeter < 0 || endMeter < 0) {
            this.$message.error(`第${index + 1}行米数填写错误，请输入有效数字！`);
            valid = false;
            return;
          }

          if (startMeter > endMeter) {
            this.$message.error(`第${index + 1}行缺陷米数填写错误，起始米数不能大于结束米数！`);
            valid = false;
            return;
          }
        });

        // 卡控报工数量不能为0
        if (!this.form.quantityFeedback) {
          this.$message.error(`请输入正确的报工数量!`);
          valid = false;
          return;
        }


        if (valid) {
          this.form.feedbackMemberList = this.teamMembers;
          if (this.form.id != null) {
            updateFeedback(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.teamMembers = []; // 清空班组成员
              this.processDefectList = []; // 清空缺陷列表
              this.cascaderOptions = []; // 清空缺陷级联选择器
              this.open = false;
              this.getList();
            });
          } else {
            console.log(this.form);
            addFeedback(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.teamMembers = []; // 清空班组成员
              this.processDefectList = []; // 清空缺陷列表
              this.cascaderOptions = []; // 清空缺陷级联选择器
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleSubmit() {
      this.form.status = 'APPROVING';
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.feedbackMemberList = this.teamMembers;
            updateFeedback(this.form).then(response => {
              this.$modal.msgSuccess('提交成功');
              //this.open = false;
              //this.getList();
            });
          }
        }
      });
    },
    //执行
    handleExecute() {
      const recordIds = this.form.id;

      if (!this.form.warehouseId && !this.form.locationId && !this.form.areaId) {
        this.$message.error(`请选择仓库信息！`);
        return;
      }

      this.$modal
        .confirm('确认执行报工？')
        .then(() => {
          return executes({id: recordIds, status: 'APPROVED', warehouseId: this.form.warehouseId, locationId: this.form.locationId, areaId: this.form.areaId}); //审核通过APPROVED 不通过UNAPPROVED
        })
        .then(() => {
          this.getList();
          //this.removeScrollListener();
          this.$modal.msgSuccess('执行成功');
          this.open = false;

        })
        .catch(() => {
        });
    },
    // 审核不通过
    handleReject() {
      const recordIds = this.form.id;
      if (!this.form.warehouseId && !this.form.locationId && !this.form.areaId) {
        this.$message.error(`请选择仓库信息！`);
        return;
      }

      this.$modal
        .confirm('确认拒审报工？')
        .then(function () {
          return executes({id: recordIds, status: 'UNAPPROVED', warehouseId: this.form.warehouseId, locationId: this.form.locationId, areaId: this.form.areaId}); //审核通过APPROVED 不通过UNAPPROVED
        })
        .then(() => {
          this.getList();
          //this.removeScrollListener();
          this.$modal.msgSuccess('拒审成功');
          this.open = false;
        })
        .catch(() => {
        });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const recordIds = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除生产报工记录编号为"' + recordIds + '"的数据项？')
        .then(function () {
          return delFeedback(recordIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'pro/feedback/export',
        {
          ...this.queryParams,
        },
        `feedback_${new Date().getTime()}.xlsx`,
      );
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
        this.form.itemId = row.productId;
        this.form.itemCode = row.productCode;
        this.form.itemName = row.productName;
        this.form.specification = row.productSpc;
        this.form.unitOfMeasure = row.unitOfMeasure;
      }
    },
    handleTaskSelect() {
      this.$refs.taskSelect.showFlag = true;
      this.$refs.taskSelect.getList();
    },
    onTaskSelected(row) {
      if (row != undefined && row != null) {
        console.log("开始获取班组信息");
        console.log(row);
        this.form.taskId = row.id;
        this.form.taskCode = row.taskCode;
        this.form.taskName = row.taskName;
        this.form.workstationId = row.workstationId;
        this.form.workstationCode = row.workstationCode;
        this.form.workstationName = row.workstationName;
        this.form.processId = row.processId;
        this.form.processCode = row.processCode;
        this.form.processName = row.processName;
        this.form.teamCode = row.attr1;
      }
      if(this.form.processCode === 'AM005'){
        this.form.unitOfMeasure = '米';
      }
      if (this.form.teamCode) {
        // 基于当前班组编码获取班组人员
        /*listTeam({teamCode: this.form.teamCode}).then(response => {
          const result = response.data.list[0];
          console.log("result: ", result);
          this.form.machineryCode = result.machineryCode;
          this.form.machineryName = result.machineryName;
          this.form.machineryId = result.machineryId;
        });*/
        const shiftInfo = this.form.shiftInfo || 'default'; // 使用默认班次或当前选择的班次
        getByTeamCodeAndShiftInfo(this.form.teamCode, shiftInfo).then(response => {
          let teamInfo = response.data;
          console.log("teamInfo: ", teamInfo);
          this.form.principalName = teamInfo[0].principalName;
          this.form.principalId = teamInfo[0].principalId;
          this.teamMembers = []; // 清空当前班组成员列表
          for (let i = 0; i < teamInfo.length; i++) {
            let obj = teamInfo[i];
            obj.username = obj.userName; // 用户名
            obj.nickname = obj.nickName; // 昵称
            this.teamMembers.push(obj);
          }
        }).catch(error => {
          console.error('获取班组人员失败:', error);
          this.$message.error('获取班组人员失败');
        });
      }
      console.log(this.form);
      // 追加问题缺陷与检验项
      if (this.form.processCode) {
        // 基于工序获取对应的缺陷问题
        /*getByCode(this.form.processCode).then(response => {
          console.log(response.data);
          let index =  1;
          this.processDefectList = response.data.map(defect => ({
            ...defect,
            index: index++,
            startMeter: '',
            endMeter: '',
            defectMeter: ''
          }));
          this.changeDefectList();
        });*/

        getQcdefectByCode(this.form.processCode).then(response => {
          console.log(response.data);
          let index = 1;
          this.processDefectList = response.data.map(defect => ({
            ...defect,
            index: index++,
            startMeter: '',
            endMeter: '',
            defectMeter: ''
          }));
        });

        // 基于当前工序编码获取检测项
        getQcindexByProcessCode(this.form.processCode).then(response => {
          console.log(response.data);
          this.qcIndexList = response.data;
        });
      }

    },
    //点击人员选择按钮
    handleUserSelect() {
      this.$refs.userSelect.showFlag = true;
    },
    //人员选择返回
    onUserSelected(row) {
      console.log(row);
      this.teamMembers.push(row);
    },
    //点击人员选择按钮
    handleUser2Select() {
      this.$refs.user2Select.showFlag = true;
    },
    //人员选择返回
    onUser2Selected(obj) {
      console.log(obj);
      if (obj != undefined && obj != null) {
        this.form.principalName = obj.nickname;
        this.form.principalId = obj.id;
      }
      console.log(this.form);
    },

    async handleBatchPrint() {
      for (let i = 0; i < this.selectedRows.length; i++) {
        let status = this.selectedRows[i].status;
        if (status === 'PREPARE' || status === 'APPROVING') {
          this.$message.error('第' + (i + 1) + '行选中的报工单未完成');
          return;
        }
      }
      console.log("当前行信息: ", this.selectedRows);
      await this.$modal.confirm('确认批量打印？');
      LODOP.PRINT_INITA(0, 0, 150, 100); // 初始化打印任务，纸张大小为150mm*100mm，单位：像素
      LODOP.SET_PRINT_PAGESIZE(2, "", "", "热敏纸"); // 设置纸张横向
      for (const queryId of this.ids) {
        let obj = {};
        await getFeedback(queryId).then(response => {
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
        LODOP.ADD_PRINT_TEXT(13, 0, 150, 30, "产成品标签");

        // 内容样式及分块边框
        LODOP.SET_PRINT_STYLE("FontSize", 14);
        LODOP.SET_PRINT_STYLE("Bold", 0);
        LODOP.SET_PRINT_STYLE("Horient", 0); // 取消居中

        LODOP.ADD_PRINT_TEXT(65, 15, 120, 35, "条码编号:");
        LODOP.ADD_PRINT_TEXT(65, 120, 280, 35, obj.id); // 内容部分

        LODOP.ADD_PRINT_TEXT(110, 15, 120, 35, "生产车间:");
        LODOP.ADD_PRINT_TEXT(110, 120, 280, 35, obj.workstationName);

        LODOP.ADD_PRINT_TEXT(155, 15, 120, 35, "物料名称:");
        LODOP.ADD_PRINT_TEXT(155, 120, 280, 35, obj.itemName);

        LODOP.ADD_PRINT_TEXT(200, 15, 120, 35, "工单号:");
        LODOP.ADD_PRINT_TEXT(200, 120, 280, 35, obj.workorderCode);

        LODOP.ADD_PRINT_TEXT(245, 15, 120, 35, "合格数量:");
        if(obj.machineryCode === 'AMSB-BF202401'){
          // 分切工序中, 剥离复卷机产成品单位为"米"
          LODOP.ADD_PRINT_TEXT(245, 120, 280, 35, obj.quantityQualified + '米');
        }else{
          LODOP.ADD_PRINT_TEXT(245, 120, 280, 35, obj.quantityQualified + obj.unitOfMeasure);
        }

        LODOP.ADD_PRINT_TEXT(290, 15, 120, 35, "批次号:");
        LODOP.ADD_PRINT_TEXT(290, 120, 280, 35, obj.batchCode);

        LODOP.ADD_PRINT_TEXT(335, 15, 120, 35, "日期:");
        LODOP.ADD_PRINT_TEXT(335, 120, 280, 35, new Date(obj.createTime).toISOString().slice(0, 19).replace('T', ' '));

        let jsonQc = {
          "id": obj.id,
          "type": "feedback"
        }
        LODOP.ADD_PRINT_BARCODE(220, 390, 170, 170, "QRCode", JSON.stringify(jsonQc));

      }
      LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1); //打印后自动关闭预览窗口
      LODOP.PREVIEW();

      // 开始修改单据, 状态变更已入库
      for (const queryId of this.ids) {
        let obj = {};
        await getFeedback(queryId).then(response => {
          obj = response.data;
        });

        // 校验当前单据是否已入库, 未入库则改变状态
        if (obj.status === 'WAREHOUSED') {
          return;
        }

        obj.status = 'PRINTED';
        await updateFeedback(obj).then(response => {
          console.log(response);
        });
      }
      this.$modal.msgSuccess('批量打印成功');
      this.selectedRows = []; // 清空已选中的行
      this.getList(); // 刷新列表
    },
    // 初始化仓库数据
    getWarehouseList() {
      getTreeList().then(response => {
        this.warehouseOptions = response.data;
      });
    },
    // 开始入库
    warehousing() {
      // 初始化仓库信息
      // 弹出框
     /* this.wareOpen = true;
      this.title = '产成品入库';*/

      if(this.selectedRows.length <1){
        this.$message.error('请勾选要入库的产成品');
        return;
      }

      console.log(this.selectedRows);

      // 只允许勾选已完成单据进行入库
      for (const row of this.selectedRows) {
        if (row.status !== 'FINISHED' && row.status !== 'PRINTED') {
          this.$message.error('请勾选已完成的单据进行入库');
          return;
        }
      }

      this.$modal.confirm('确认入库选中的 ' + this.selectedRows.length + ' 条报工单？').then(() => {
        this.loading = true;
        startWareHousing({"wareList": this.selectedRows}).then(response => {
          this.$modal.msgSuccess("入库成功");
          this.getList();
        }).catch(error => {
          console.error('入库失败:', error);
          this.$message.error(`入库失败`);
        }).finally(() => {
          this.loading = false;
          this.getList(); // 刷新列表
        });
      });

    },
    async getCameraInfo() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        const specificCamera = videoDevices.find(device => device.label === 'GC8034');
        if (specificCamera) {
          this.targetCameraId = specificCamera.deviceId;
          console.log('找到指定摄像头:', specificCamera);
        } else {
          const defaultCamera = videoDevices[0];
          if (defaultCamera) {
            this.targetCameraId = defaultCamera.deviceId;
            console.log('使用默认摄像头:', defaultCamera);
          } else {
            console.log('未找到任何可用的摄像头');
            this.$notify({
              title: '错误',
              message: '未找到任何可用的摄像头',
              type: 'error'
            });
            return;
          }
        }
        this.showCameraPreview();
      } catch (error) {
        console.error('获取摄像头信息失败:', error);
        this.$notify({
          title: '错误',
          message: '获取摄像头信息失败',
          type: 'error'
        });
      }
    },

    startScanning() {
      const deviceId = this.targetCameraId || undefined;
      const constraints = {
        audio: false,
        video: {
          width: this.videoWidth,
          height: this.videoHeight,
          deviceId: {exact: deviceId}
        }
      };

      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        this.$refs.videoCameraPreview.srcObject = stream;
        this.$refs.videoCameraPreview.onloadedmetadata = () => {
          this.$refs.videoCameraPreview.play();
          this.loading = false;
          this.scanQRCode();
        };
      }).catch(err => {
        console.error("无法打开摄像头: ", err);
        this.$notify({
          title: '警告',
          message: '没有开启摄像头权限或浏览器版本不兼容.',
          type: 'warning'
        });
        this.cameraPreviewVisible = false;
      });
    },
    // 扫描二维码
    scanQRCode() {
      const that = this;
      const video = this.$refs.videoCameraPreview;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // 将视频流绘制到 canvas 上
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          // 获取 canvas 的图像数据
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          // 使用 jsQR 解码图像数据
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          if (code) {
            console.log('QR Code scanned:', code.data);
            //this.stopScanning();
            // 处理扫描到的二维码数据
            // let fin = null;// 最终扫描的数据
            if (code.data) {
              // 关闭当前的摄像头预览弹出框
              that.cameraPreviewVisible = false;
              try {
                // 替换中文引号为英文引号，并解析 JSON
                code.data = code.data.replace(/“/g, '"').replace(/”/g, '"').replace(/：/g, ':').replace(/，/g, ',');
                // 移除零宽度非换行空格字符
                code.data = code.data.replace(/\uFEFF/g, '');
                // 直接解析 JSON 字符串
                const data = JSON.parse(code.data);
                // 检查是否包含 po_no 属性
                if (data && data.id) {
                  that.wareForm.id = data.id;
                } else {
                  console.log("data is undefined");
                }
              } catch (error) {
                console.error('解析 JSON 出错:', error);
                that.$message.error('扫描结果不是有效的 JSON 字符串');
              }
              that.handleBlur(); // 基于当前的采购单获取所有的物料数据
              that.stopScanning();
            }
          }
        }
        requestAnimationFrame(tick);
      }

      tick();
    },
    // 停止扫描二维码
    stopScanning() {
      const stream = this.$refs.videoCameraPreview.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    },
    // 显示摄像头预览弹出框
    showCameraPreview() {
      this.cameraPreviewVisible = true;
      this.startScanning();
    },
    handleBlur() {
      // 获取当前的采购单数据
      console.log(this.wareForm.id);
      let idStr = this.wareForm.id.toString();
      if (this.wareForm.id && (idStr.includes('{') || idStr.includes('[') || idStr.includes('}') || idStr.includes(']')) && !idStr.includes('"')) {
        idStr = idStr.trim();
        // 清理文本框内容的多余空格，并格式化为标准 JSON 格式
        idStr = idStr
          // 去除字段名和字段值之间的多余空格
          .replace(/\s*[:]\s*/g, ':')
          .replace(/\s*,\s*/g, ',')
          .replace(/\s*{\s*/g, '{')
          .replace(/\s*}\s*/g, '}')
          .replace(/\s*\[\s*/g, '[')
          .replace(/\s*\]\s*/g, ']');
        // 给键和字符串值加上双引号
        let formattedData = idStr
          // 给所有键名加双引号
          .replace(/([a-zA-Z0-9_]+)(?=\s*[:])/g, '"$1"')
          // 给字符串值加双引号，排除数字和其他非字符串类型的值
          .replace(/(:\s*)([a-zA-Z\u4e00-\u9fa5_-]+)(?=\s*,|\s*\})/g, '$1"$2"');
        // Step 2: 处理数字和标识符类型的字符串，如 AMCG86-241030001 和 20241106805-01，需给它们加上双引号
        formattedData = formattedData.replace(/(:\s*)([A-Za-z0-9-]+)(?=\s*,|\s*\})/g, '$1"$2"');

        try {
          // Step 3: 使用 JSON.parse 转换为对象
          const parsedData = JSON.parse(formattedData);
          // Step 4: 使用 JSON.stringify 格式化为标准 JSON 字符串
          const data = JSON.stringify(parsedData, null, 2);
          const transedData = JSON.parse(data);
          // 检查是否包含id属性
          if (transedData) {
            if (!transedData.type) {
              this.$message.error('扫描结果不是有效成品条码!');
            }
            // 更新 wareForm.poNo
            this.wareForm.id = transedData.id;
          }
        } catch (error) {
          this.$message.error('扫描结果不是有效的 JSON 字符串');
        }
      }
      getFeedback(this.wareForm.id).then(response => {
        let obj = response.data;
        let id = obj.id;
        /*this.wareList = this.wareList.filter(item => {
          return !id.includes(item.id);
        });*/
        // 追加校验, 不允许同一个单号扫码多次
        if (this.wareList.some(item => item.id === obj.id)) {
          this.$message.error('当前报工单已扫码!');
          this.wareForm.id = '';
          return;
        }
        console.log(obj);
        // 追加报工入库明细
        this.wareList.push(obj);
        this.wareForm.id = '';
      });

    },
    //选择默认的仓库、库区、库位
    handleWarehouseChanged(obj) {
      if (obj != null) {
        this.form.warehouseId = obj[0]; // 仓库
        this.form.locationId = obj[1];// 库区
        this.form.areaId = obj[2]; // 库位
      }
    },

    async submitWareForm() {
      // 校验表单数据
      let obj = {
        "wareList": this.wareList,
      };
      this.loading = true;

      try {
        await startWareHousing(obj);
        for (const query of this.wareList) {
          let feedbackObj = {};
          try {
            feedbackObj = await getFeedback(query.id);
            feedbackObj.data.status = 'WAREHOUSED';
            console.log('准备更新的单据:', feedbackObj.data); // 打印出要更新的数据
            await updateFeedback(feedbackObj.data);
            console.log('成功更新单据:', query.id); // 成功更新后的日志
          } catch (error) {
            console.error('更新单据状态失败:', error);
            this.$message.error(`更新单据 ${query.id} 状态失败`);
          }
        }
        this.$message.success('入库成功');
      } catch (error) {
        console.error('入库失败:', error);
        this.$message.error('入库失败，请检查网络连接或稍后再试');
      } finally {
        this.wareList = [];
        this.loading = false;
        this.wareOpen = false; // 关闭弹出框
        this.getList(); // 刷新列表
      }
    },
    // 显示拆分弹出框
    split() {
      // 检查 selectedRows 是否已定义且非空
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.warning('请选择至少一项进行拆分');
        return;
      }
      const firstRow = this.selectedRows[0]; // 访问第一行
      if (firstRow.status != 'FINISHED') {
        this.$message.warning('仅允许拆分已完成的报工单!');
        return;
      }
      this.splitForm = {
        id: firstRow.id,
        workorderCode: firstRow.workorderCode,
        itemCode: firstRow.itemCode,
        quantityFeedback: firstRow.quantityFeedback,
        unitOfMeasure: firstRow.unitOfMeasure
      };
      console.log(this.splitForm);
      this.splitDetails = this.selectedRows.map(row => ({
        workorderCode: row.workorderCode,
        itemCode: row.itemCode,
        unitOfMeasure: row.unitOfMeasure,
        quantity: '' // 用户需要填写的数量
      }));
      console.log(this.splitDetails);
      this.splitDialogVisible = true;
    },
    // 新增拆分行
    addSplitDetail() {
      // 校验当前数量是否允许拆分
      // 判定当前数量是否允许再次拆分
      let quantityFeedback = parseFloat(this.splitForm.quantityFeedback); // 当前拆分数量
      let totalQuantity = this.splitDetails.reduce((sum, detail) => {
        return sum + (parseFloat(detail.quantity) || 0);
      }, 0); // 拆分详情中已填写的数量总和
      if (totalQuantity >= quantityFeedback) {
        this.$message.error('拆分数量总和不能超过报工数量');
        return;
      }

      const newRow = {
        workorderCode: this.splitForm.workorderCode,
        itemCode: this.splitForm.itemCode,
        unitOfMeasure: this.splitForm.unitOfMeasure,
        quantity: ''
      };
      this.splitDetails.push(newRow);
    },
    addSplitDetailByQuantity() {
      let feedbackNum = parseFloat(this.splitForm.quantityFeedback);
      let finList = [];
      for (let i = 0; i < feedbackNum; i++) {
        const newRow = {
          workorderCode: this.splitForm.workorderCode,
          itemCode: this.splitForm.itemCode,
          unitOfMeasure: this.splitForm.unitOfMeasure,
          quantity: 1
        }
        finList.push(newRow);
      }
      this.splitDetails = finList;
    },
    // 删除拆分行
    removeSplitDetail(index) {
      this.splitDetails.splice(index, 1);
    },
    // 提交拆分
    submitSplit() {
      // 校验拆分详情中的数量总和是否小于等于报工数量
      let totalQuantity = this.splitDetails.reduce((sum, detail) => {
        return sum + (parseFloat(detail.quantity) || 0);
      }, 0);

      if (totalQuantity > parseFloat(this.splitForm.quantityFeedback)) {
        this.$message.error('拆分数量总和不能超过报工数量');
        return;
      }

      // 校验拆分行的数量是否为空或0
      for (let detail of this.splitDetails) {
        if (!detail.quantity || parseFloat(detail.quantity) === 0) {
          this.$message.error('拆分行的数量禁止为空或0');
          return;
        }
      }
      // 这里添加提交拆分逻辑

      // 这里添加提交拆分逻辑
      let obj = {
        'id': this.splitForm.id,
        'workorderCode': this.splitForm.workorderCode,
        'itemCode': this.splitForm.itemCode,
        'quantityFeedback': this.splitForm.quantityFeedback,
        'unitOfMeasure': this.splitForm.unitOfMeasure,
        'splitDetails': this.splitDetails
      }

      splitFeedback(obj).then(response => {
        this.splitDialogVisible = false;
        this.$message.success('拆分成功');
        this.getList();
      });

    },
    addTeamMember() {
      // 实现新增班组成员的逻辑
      //this.userSelectVisible = true;
      this.$refs.userSelect.showFlag = true;
    },
    deleteTeamMember(id) {
      // 实现删除班组成员的逻辑
      this.teamMembers = this.teamMembers.filter(member => member.id !== id);
    },
    // 撤销报工
    async cancelReport() {
      console.log(this.selectedRows);
      // 校验当前报工产成品是否入库, 入库不允许进行撤销
      await checkWarehousing(this.selectedRows[0].id).then(response => {
        if (response.data === "Y") {// 入库不允许进行撤销
          this.$message.error('该报工产成品已入库, 不能进行撤销!');
          return;
        }
      });
      // 校验当前选中行状态是否为已完成, 已完成才允许进行撤销
      if (this.selectedRows[0].status != 'FINISHED') {
        this.$message.error('该单据未报工!');
        return;
      }
      // 校验当前选中行是否存在来源单据, 存在不允许撤销
      if (this.selectedRows[0].originCode) {
        this.$message.error('该单据存在来源单据, 不能进行撤销!');
        return;
      }

      // 开始进行撤销报工操作
      // 追加弹出框, 当用户点击确认后在执行reFeedback方法
      this.$confirm('确定要撤销)?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reFeedback(this.selectedRows[0].id).then(response => {
          this.$message.success('撤销成功');
        });
      }).catch(() => {
        this.$message.info('已取消');
      });
    },

    defectChange(value) {
      // TODO: 根据任务单获取对应的工序信息, 根据工序信息带出对应的缺陷
      const selectedProcess = this.workOrderProcessOptions.find(item => item.processCode === value);
      if (selectedProcess) {
        this.form.processName = selectedProcess.processName;
        this.form.processCode = selectedProcess.processCode;
        this.form.processId = selectedProcess.id;
      }
    },
    handleRowClick(row) {
      // 切换行的选中状态
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    // 缺陷列表
    /*  changeDefectList() {
        this.cascaderOptions = this.processDefectList.map(defect => ({
          value: defect.id,
          label: defect.defectName,
          children: this.generateRanges(100, 10000, 100), // 初始时生成100到10000的区间，步长为100
          leaf: false, // 标记为非叶子节点，表示还有子节点
        }));
      },*/


    /*changeDefectList() {
      this.cascaderOptions = this.processDefectList.map(defect => {
        let upperRanges = [];
        let lowerRanges = [];

        // 生成米数区间
        this.generateRanges(upperRanges);

        // 对于每个上沿，生成对应的下沿
        upperRanges.forEach(range => {
          let lowerStart = range.value + 10;  // 假设下沿的起点比上沿大10米
          let lowerEnd = range.value + 50;    // 假设下沿的终点比上沿大50米
          let stepLower = 10; // 下沿的步长

          let lowerRange = [];
          for (let i = lowerStart; i <= lowerEnd; i += stepLower) {
            lowerRange.push({value: i, label: `${i}米`});
          }

          range.children = lowerRange;  // 将下沿区间作为上沿的子级
        });

        return {
          value: defect.id,
          label: defect.defectName,
          children: upperRanges  // 上沿区间作为缺陷问题的子级
        };
      });
    },
    // 生成米数区间
    generateRanges(upperRanges) {
      for (let i = this.upperLimit; i <= this.currentMaxLimit; i += this.step) {
        upperRanges.push({value: i, label: `${i}米`});
      }
    },*/

    // 监听滚动事件，判断是否滚动到最底部
    /*onScroll(event) {
      console.log("滚动事件: loadingMore=> " + this.loadingMore);
      const el = event.target;
      const bottom = el.scrollHeight === el.scrollTop + el.clientHeight;

      if (bottom && !this.loadingMore) {
        this.loadingMore = true;  // 开始加载更多
        this.loadMoreRanges();
      }
    },*/

    // 动态加载更多的米数区间
    /*loadMoreRanges() {
      console.log("加载更多米数");
      setTimeout(() => {
        // 更新 currentMaxLimit，增加米数区间的范围
        this.currentMaxLimit += 1000;  // 每次增加 5000 米的区间范围

        // 将新的米数区间加入到 cascaderOptions 中
        this.changeDefectList();

        // 加载完成后设置 loadingMore 为 false
        this.loadingMore = false;
      }, 1000); // 模拟异步加载的延迟
    },*/
    /*addScrollListener() {
      // 获取第二个 .el-scrollbar el-cascader-menu 下的 .el-scrollbar__bar.is-vertical
      const verticalScrollBar = this.$refs.cascader?.$el?.querySelector('.el-cascader-panel .el-scrollbar.el-cascader-menu:nth-child(2) .el-scrollbar__bar.is-vertical');
      if (verticalScrollBar) {
        verticalScrollBar.addEventListener('scroll', this.onScroll);
      } else {
        console.error('未找到第二个 .el-scrollbar el-cascader-menu 下的垂直滚动条');
      }
    },
    removeScrollListener() {
      // 获取第二个 .el-scrollbar el-cascader-menu 下的 .el-scrollbar__bar.is-vertical
      const verticalScrollBar = this.$refs.cascader?.$el?.querySelector('.el-cascader-panel .el-scrollbar.el-cascader-menu:nth-child(2) .el-scrollbar__bar.is-vertical');
      if (verticalScrollBar) {
        verticalScrollBar.removeEventListener('scroll', this.onScroll);
      }
    },*/

    /* onCascaderChange(value) {
       console.log('级联选择器变化', value);
       // 重新添加滚动监听器，因为级联选择器的内容可能发生变化
       this.removeScrollListener();
       this.addScrollListener();
     },*/

    // 班次信息变化时的处理方法
    handleShiftChange() {
      // 确保 form.teamCode 和 form.shiftInfo 都有值
      if (this.form.teamCode && this.form.shiftInfo) {
        // 基于当前班组编码和班次信息获取对应班组人员
        getByTeamCodeAndShiftInfo(this.form.teamCode, this.form.shiftInfo).then(response => {
          let teamInfo = response.data;
          this.teamMembers = []; // 清空当前班组成员列表
          for (let i = 0; i < teamInfo.length; i++) {
            let obj = teamInfo[i];
            obj.username = obj.userName; // 用户名
            obj.nickname = obj.nickName; // 昵称
            this.teamMembers.push(obj);
          }
        }).catch(error => {
          console.error('获取班组人员失败:', error);
          this.$message.error('获取班组人员失败');
        });
      }
    },
    /*changeDefectList() {
      this.cascaderOptions = this.processDefectList.map(defect => ({
        value: defect.id,
        label: defect.defectName,
        children: [], // 初始时不加载子节点
        leaf: false, // 标记为非叶子节点，表示还有子节点
        loading: false, // 当前节点的加载状态
      }));
    },*/
    lazyLoad(node, resolve) {
      const {value} = node;
      // 如果是根节点，则直接返回
      if (!value) {
        resolve(this.cascaderOptions);
        return;
      }

      // 如果已经在加载中，则直接返回
      if (this.loadingStatus[value]) {
        return;
      }

      // 设置当前节点的加载状态为 true
      this.loadingStatus[value] = true;
      node.loading = true;

      // 模拟异步加载数据
      setTimeout(() => {
        // 生成新的米数区间
        const newRanges = [];
        this.generateRanges(newRanges, this.currentMaxLimit, this.currentMaxLimit + 1000, this.step);
        this.currentMaxLimit += 1000;

        // 将新的米数区间作为子节点添加到当前节点
        node.children = newRanges;

        // 设置当前节点的加载状态为 false
        this.loadingStatus[value] = false;
        node.loading = false;

        // 调用 resolve 函数，表示数据加载完成
        resolve(newRanges); // 确保传递正确的参数
      }, 1000);
    },
    generateRanges(ranges, start, end, step) {
      for (let i = start; i <= end; i += step) {
        ranges.push({value: i, label: `${i}米`});
      }
    },
    handleStartMeterInput(index, event) {
      const defect = this.processDefectList[index];
      if (defect.startMeter === '') {
        defect.defectMeter = '';
        return;
      }
      const startMeter = isNaN(Number(defect.startMeter)) ? 0 : Number(defect.startMeter);
      const endMeter = isNaN(Number(defect.endMeter)) ? 0 : Number(defect.endMeter);
      if (endMeter === 0) {
        return;
      }
      if (endMeter - startMeter < 0) {
        return;
      }
      defect.defectMeter = endMeter - startMeter;
    },
    handleEndMeterInput(index, event) {
      const defect = this.processDefectList[index];
      if (defect.endMeter === '') {
        defect.defectMeter = '';
        return;
      }
      const startMeter = isNaN(Number(defect.startMeter)) ? 0 : Number(defect.startMeter);
      const endMeter = isNaN(Number(defect.endMeter)) ? 0 : Number(defect.endMeter);
      if (startMeter === 0) {
        return;
      }
      if (endMeter - startMeter < 0) {
        return;
      }
      defect.defectMeter = endMeter - startMeter;
    },
    //查询工序信息
    getProcess() {
      // 初始化工序选项
      this.processOptions = [];
      listProcess().then(response => {
        this.processOptions = response.data.list;
        console.log(this.processOptions)
      });
    },
    // 合并单据
    handleMerge() {
      if (this.selectedRows.length < 2) {
        this.$message.warning('请至少选择两条要合并的报工单');
        return;
      }

      // 验证是否可合并
      const first = this.selectedRows[0];
      const canMerge = this.selectedRows.every(row =>
        row.itemCode === first.itemCode &&
        row.workorderCode === first.workorderCode &&
        row.taskCode === first.taskCode &&
        row.processCode === first.processCode &&
        row.status === 'WAREHOUSED'
      );

      if (!canMerge) {
        this.$message.error('只能合并相同任务单、相同物料且状态为完成的报工单');
        return;
      }

      this.$modal.confirm('确认合并选中的 ' + this.selectedRows.length + ' 条报工单？').then(() => {
        const ids = this.selectedRows.map(item => item.id);
        this.loading = true;
        mergeFeedback(ids).then(response => {
          this.$modal.msgSuccess("合并成功");
          this.getList();
        }).finally(() => {
          this.loading = false;
        });
      });
    },
    // 工序缓存
    handleProcessChange(val) {
      if (val) {
        localStorage.setItem('cachedProcessCode', val);
      } else {
        localStorage.removeItem('cachedProcessCode');
      }
    },
    handleMachineryAdd() {
      this.$refs.machinerySelect.showFlag = true;
    },

    loadMachineryCache() {
      console.log("加载缓存!", localStorage.getItem('cachedMachinery'));
      try {
        const cachedMachinery = localStorage.getItem('cachedMachinery')
        if (cachedMachinery) {
          const { id, code, name } = JSON.parse(cachedMachinery)
          // 验证缓存数据完整性
          if (id && code && name) {
            this.form.machineryId = id
            this.form.machineryCode = code
            this.form.machineryName = name
          }
        }
      } catch (e) {
        console.error('设备信息缓存读取失败:', e)
        localStorage.removeItem('cachedMachinery')
      }
    },

    saveMachineryCache(data) {
      console.log("保存缓存!", data);
      localStorage.setItem('cachedMachinery', JSON.stringify({
        id: data.id,
        code: data.machineryCode,
        name: data.machineryName
      }))
    },

    getTreeselect() {
      listSimplePosts().then(response => {
        // 处理 postOptions 参数
        this.postOptions = [];
        this.postOptions.push(...response.data);
      });
    },
    onMachineryAdd(rows) {
      if (rows) {
        // 更新表单数据
        this.form.machineryId = rows.id
        this.form.machineryCode = rows.machineryCode
        this.form.machineryName = rows.machineryName

        // 保存到缓存
        this.saveMachineryCache(rows)
      } else {
        // 清空选择时移除缓存
        localStorage.removeItem('cachedMachinery')
        this.form.machineryId = ''
        this.form.machineryCode = ''
        this.form.machineryName = ''
      }
    },
    handlePostChange(row) {
      console.log('修改后的岗位:', row.postIds)
    }
  },
  activated() {
    // 当从缓存中重新激活组件时，可以在此更新数据
    this.getList();
  }
};
</script>
