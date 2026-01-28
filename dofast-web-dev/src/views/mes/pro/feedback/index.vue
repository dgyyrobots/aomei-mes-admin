<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="报工单号" prop="feedbackCode">
        <el-input v-model="queryParams.feedbackCode" placeholder="请输入报工单号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="生产工单" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入生产工单编号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="任务编号" prop="taskCode">
        <el-input v-model="queryParams.taskCode" placeholder="请输入任务编号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="批次号" prop="workorderCode">
        <el-input v-model="queryParams.batchCode" placeholder="请输入批次号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="物料编码" prop="itemCode">
        <el-input v-model="queryParams.itemCode" placeholder="请输入物料编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="物料名称" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入物料名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="生产工序" prop="processCode">
        <el-select @change="val => { handleProcessChange(val) }" v-model="queryParams.processCode" placeholder="请选择工序" clearable>
          <el-option v-for="item in processOptions" :key="item.processCode" :label="item.processName" :value="item.processCode"/>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>

      <el-form-item label="ERP报工标识" prop="erpFeedbackStatus">
        <el-select v-model="queryParams.erpFeedbackStatus" placeholder="请选择ERP报工标识" clearable>
          <el-option v-for="dict in dict.type.erp_status" :key="dict.value" :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>

      <el-form-item label="ERP入库标识" prop="erpWarehousingStatus">
        <el-select v-model="queryParams.erpWarehousingStatus" placeholder="请选择ERP入库标识" clearable>
          <el-option v-for="dict in dict.type.erp_status" :key="dict.value" :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>

      <el-form-item label="设备信息" prop="machineryName">
        <el-input v-model="queryParams.machineryName" placeholder="请选择设备信息" disabled>
          <el-button slot="append" icon="el-icon-search" @click="handleQueryMachineryAdd"></el-button>
        </el-input>
      </el-form-item>
      <MachinerySelectSingle ref="queryMachinerySelect" @onSelected="onQueryMachineryAdd"></MachinerySelectSingle>

      <el-form-item label="报工时间" prop="feedbackTime">
        <el-date-picker
          v-model="queryParams.feedbackTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
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
        <el-button type="success" plain icon="el-icon-edit" :disabled="multiple" size="mini" @click="handleCertificatePrint"> 打印合格证
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-success" size="mini" :disabled="single" @click="warehousing" v-hasPermi="['pro:feedback:warehousing']">入库</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-success" size="mini" :disabled="single" @click="revokedWarehousing" v-hasPermi="['pro:feedback:warehousing']">MES撤销入库</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="single" @click="split" v-hasPermi="['pro:feedback:split']">拆分</el-button>
      </el-col>

      <el-col :span="1.5"><!---->
        <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="single" @click="cancelReport" v-hasPermi="['pro:feedback:reFeedback']" :loading="reFeedbackLoading">撤销报工</el-button>
      </el-col>

      <el-col :span="1.5"><!--"-->
        <el-button type="warning" plain icon="el-icon-merge" size="mini" :disabled="multiple" v-hasPermi="['pro:feedback:merge']" @click="handleMerge">合并</el-button>
      </el-col>

      <el-col :span="1.5"><!---->
        <el-button type="success" plain icon="el-icon-merge" size="mini" :disabled="multiple" v-hasPermi="['pro:feedback:erpInterface']" @click="handleFeedbackErp">ERP报工</el-button>
      </el-col>

      <el-col :span="1.5"><!--v-hasPermi="['pro:feedback:erpInterface']"-->
        <el-button type="success" plain icon="el-icon-merge" size="mini" v-hasPermi="['pro:feedback:erpInterface']" @click="handleWarehouseScan">ERP入库</el-button>
      </el-col>

      <el-col :span="1.5"><!--  -->
        <el-button type="success" plain icon="el-icon-merge" size="mini" v-hasPermi="['pro:feedback:erpWarehouseInterface']" @click="handleWarehousingErp">ERP手动入库</el-button>
      </el-col>

      <el-col :span="1.5"> <!--  v-hasPermi="['pro:feedback:export']" -->
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
        >导出
        </el-button>
      </el-col>

      <el-col :span="1.5"> <!-- v-hasPermi="['pro:feedback:audit']" -->
        <el-button type="primary" plain icon="el-icon-document" size="mini" @click="handleAudit">提交审核</el-button>
      </el-col>

      <el-col :span="1.5"><!-- v-hasPermi="['pro:feedback:changeMergeStatus']" -->
        <el-button type="success" plain icon="el-icon-merge" size="mini" :disabled="single" @click="changeMergeStatus">变更合并状态</el-button>
      </el-col>


      <el-col :span="1.5"><!-- v-hasPermi="['pro:feedback:changeMergeStatus']" -->
        <el-button type="success" plain icon="el-icon-merge" size="mini" :disabled="single" @click="handleRemark">变更备注</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table :row-class-name="tableRowClassName" v-loading="loading" :data="feedbackList" @selection-change="handleSelectionChange" ref="multipleTable" @row-click="handleRowClick">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="工作站" width="180px" align="center" prop="workstationName"/>
      <el-table-column label="报工单号" width="210px" align="center" prop="feedbackCode"/>
      <el-table-column label="生产工单编号" width="150px" align="center" prop="workorderCode"/>
      <!--      <el-table-column label="产品物料编码" width="120px" align="center" prop="itemCode"/>-->
      <el-table-column label="产品物料名称" width="150px" align="center" prop="itemName" :show-overflow-tooltip="true"/>
      <el-table-column label="规格型号" align="center" prop="specification" :show-overflow-tooltip="true"/>
      <el-table-column label="生产工序" align="center" prop="processName"/>
      <el-table-column label="工作序" align="center" prop="processSequence"/>
      <el-table-column fixed="right" label="生产数量" align="center" prop="quantityFeedback"/>
      <el-table-column fixed="right" label="合格数量" align="center" prop="quantityQualified"/>
      <el-table-column fixed="right" label="工艺损耗" align="center" prop="quantityExcess"/>
      <el-table-column fixed="right" label="报工人" align="center" prop="nickName"/>
      <el-table-column fixed="right" label="报工时间" align="center" prop="feedbackTime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.feedbackTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status"/>
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="100" label="ERP报工状态" align="center" prop="erpFeedbackStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.erp_status" :value="scope.row.erpFeedbackStatus"/>
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="100" label="ERP入库状态" align="center" prop="erpWarehousingStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.erp_status" :value="scope.row.erpWarehousingStatus"/>
        </template>
      </el-table-column>

      <el-table-column width="120" label="来源单号" :show-overflow-tooltip="true" align="center" prop="originCode"/>

      <el-table-column width="145" fixed="right" label="批次号" align="center" prop="batchCode"/>

      <el-table-column width="140" fixed="right" label="卷号编码" align="center" prop="volumesNumber"/>

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
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body :before-close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-loading="feedLoading"><!-- v-loading="feedLoading" -->
        <el-row>
          <el-col :span="6">
            <el-form-item label="报工类型" prop="feedbackType">
              <el-select v-model="form.feedbackType" placeholder="请选择报工类型">
                <el-option v-for="dict in dict.type.mes_feedback_type" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
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
          <el-col :span="8">
            <el-form-item label="规格型号" prop="specification">
              <el-input v-model="form.specification" readonly="readonly"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-switch
              style="margin-left: 10%"
              v-model="form.iotFlag"
              active-text="数采导入"
              @change="handleIotSwitchChange">
            </el-switch>
          </el-col>

          <!--          <el-col :span="8">
                      <el-form-item label="数采状态" v-if="iotLoading">
                        <el-tag type="info">正在获取设备数采数据...</el-tag>
                      </el-form-item>
                    </el-col>-->

          <el-col :span="8">
            <el-form-item label="报工数量" prop="quantityFeedback">
              <el-input readonly="readonly" v-model="form.quantityFeedback"/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>

          <el-col :span="8">
            <el-form-item label="工艺损耗" prop="quantityExcess">
              <el-input-number :min="0" @change="handleQuantityChanged" v-model="form.quantityExcess"
                               placeholder="请输入余料数量"/><!-- :disabled="form.iotFlag" -->
            </el-form-item>
          </el-col>


          <el-col :span="8">
            <el-form-item label="合格品数量" prop="quantityQualified">
              <el-input-number :min="0" @change="handleQuantityChanged" v-model="form.quantityQualified"
                               placeholder="请输入合格品数量" :disabled="form.iotFlag"/><!--  -->
            </el-form-item>
          </el-col>
          <!--          <el-col :span="8">
                      <el-form-item label="不良品数量" prop="quantityUnquanlified">
                        <el-input-number :min="0" @change="handleQuantityChanged" v-model="form.quantityUnquanlified"
                                         placeholder="请输入不良品数量"/>
                      </el-form-item>
                    </el-col>-->

          <el-col :span="8">
            <el-form-item label="不良品数量" prop="quantityUnquanlified">
              <div>
                <el-input-number :min="0" v-model="form.quantityUnquanlified" placeholder="请输入不良品数量" readonly @click.native="handleDefectDialogOpen" :controls="false"/>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

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
            <!--            <el-form-item label="任务状态" prop="taskStatus">
                          <el-select v-model="form.taskStatus" placeholder="请选择任务状态">
                            <el-option v-for="dict in dict.type.mes_pro_task_status" :key="dict.value" :label="dict.label"
                                       :value="dict.value"></el-option>
                          </el-select>
                        </el-form-item>-->

            <el-form-item label="任务状态" prop="taskStatus">
              <el-radio-group v-model="form.taskStatus" @change="updateRadio()">
                <el-radio label="STARTED">已开工</el-radio>
                <el-radio label="FINISHED">已完工</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="合并需求" prop="mergeStatus">
              <el-select v-model="form.mergeStatus" placeholder="请选择合并需求">
                <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item v-if=" form.status == 'APPROVING' " label="仓库信息">
              <el-cascader v-model="wareHouse" :options="warehouseOptions" :props="warehouseProps" @change="handleWarehouseChanged"></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item v-if=" form.id !== null  && form.machineryCode && form.machineryCode.split('-').pop().startsWith('BF') && form.processCode === 'AM006' " label="转换数量">
              <el-input v-model="form.conversionQuantity" placeholder="转换后的合格品数量" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item v-if=" form.id !== null && form.machineryCode && (form.machineryCode.split('-').pop().startsWith('BF')) && form.processCode === 'AM006' " label="转换单位">
              <el-input v-model="form.conversionUnit" placeholder="转换单位" disabled/>
            </el-form-item>
          </el-col>

        </el-row>


        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="班组成员信息" name="1">
            <el-card class="box-card">
              <el-row>
                <el-col :span="24">
                  <!--                <div style="text-align: right; margin-top: 20px;">
                                    <el-button type="primary" @click="addTeamMember()">新增</el-button>
                                  </div>-->
                  <div>
                    <el-button type="primary" size="small" @click="addTeamMember()">新增</el-button> <!-- v-hasPermi="['cal:team:create']" -->
                  </div>

                </el-col>
              </el-row>

              <el-table :data="teamMembers" style="width: 100%">
                <el-table-column prop="username" label="成员账号" width="130" align="center"/>
                <el-table-column prop="nickname" label="成员昵称" width="130" align="center"/>
                <el-table-column prop="teamCode" label="所属班组" width="130" align="center"/>
                <el-table-column prop="quantity" label="生产数量" width="130" align="center"/>
                <el-table-column label="岗位" align="center">
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

                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteTeamMember(scope.row.id)">删除</el-button><!-- v-hasPermi="['cal:team:delete']" -->
                  </template>
                </el-table-column>
              </el-table>

            </el-card>
          </el-collapse-item>

          <el-collapse-item title="机长自检" name="2">
            <el-card class="box-card">
              <div>
                <el-button type="primary" size="small" @click="handleDefectSelect">新增</el-button>
                <el-button type="danger" size="small" :disabled="processDefectList.length === 0" @click="removeSelectedDefects">删除</el-button>
              </div>
              <el-table :data="processDefectList" max-height="420px" style="width: 100%; height: 420px" @selection-change="handleDefectSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column label="序号" width="80" align="center">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="defectName" label="不良项名称" width="150" :show-overflow-tooltip="true" align="center"/>
                <el-table-column prop="processName" label="不良工序" width="120" align="center"/>
                <!--                <el-table-column label="起始米数" width="120" align="center" >
                                  <template slot-scope="scope">
                                    <el-input
                                      v-model.number="scope.row.startMeter"
                                      placeholder="请输入起始米数"
                                      type="number"
                                      min="1"
                                      @input="handleStartMeterInput(scope.$index, $event)"
                                    ></el-input>
                                  </template>
                                </el-table-column>
                                <el-table-column label="结束米数" width="120" align="center" >
                                  <template slot-scope="scope">
                                    <el-input
                                      v-model.number="scope.row.endMeter"
                                      placeholder="请输入结束米数"
                                      type="number"
                                      min="1"
                                      @input="handleEndMeterInput(scope.$index, $event)"
                                    ></el-input>
                                  </template>
                                </el-table-column>-->
                <el-table-column label="不良米数" width="120" align="center">
                  <template slot-scope="scope">
                    <el-input
                      v-model.number="scope.row.defectMeter"
                      placeholder="请输入不良米数"
                      type="number"
                      @input="handleDefectMeterChange(scope.$index, $event)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="originBatchCode" label="来源批次" width="170" align="center"/>
                <el-table-column prop="originTeamCode" label="来源班组" align="center"/>
                <el-table-column prop="originFeedbackCode" label="来源报工单" width="200" align="center"/>
              </el-table>
            </el-card>
          </el-collapse-item>
        </el-collapse>
        <DefectSelect ref="defectSelect" @onSelected="onDefectSelected" :processCode="this.cachedProcessCode" style="z-index: 9999" append-to-body></DefectSelect>
        <UserSingleSelect ref="userSelect" @onSelected="onUserSelected"></UserSingleSelect>

      </el-form>
      <div slot="footer" class="dialog-footer">
<!--        <el-button type="primary" @click="cancel" v-if="optType == 'view' || form.status != 'PREPARE'"   >返回</el-button>
        <el-button type="primary" @click="submitForm" v-if="form.status == 'PREPARE' && optType != 'view'" >保 存
        </el-button>
        <el-button type="primary" @click="handleSubmit" v-if="form.status == 'PREPARE' && optType != 'view'" v-hasPermi="['pro:feedback:submit']" >提交审批
        </el-button>

        <el-button type="success" @click="handleExecute" :disabled="disabledFlag" v-if="form.status == 'APPROVING' && form.id != null" v-hasPermi="['pro:feedback:approval']"  >审批通过
        </el-button>

        <el-button @click="cancel" >取 消</el-button>

        <el-button type="danger" @click="handleReject" :disabled="disabledFlag" v-if="form.status == 'APPROVING' && form.id != null" v-hasPermi="['pro:feedback:approval']" >审批不通过
        </el-button>-->

        <el-button type="primary" @click="cancel" v-if="optType == 'view' || form.status != 'PREPARE'"
                   :disabled="feedLoading || loading">返回</el-button>

        <el-button type="primary" @click="submitForm" v-if="form.status == 'PREPARE' && optType != 'view'"
                   :disabled="feedLoading || loading" :loading="feedLoading">
          保 存
        </el-button>

        <el-button type="primary" @click="handleSubmit" v-if="form.status == 'PREPARE' && optType != 'view'"
                   v-hasPermi="['pro:feedback:submit']" :disabled="feedLoading || loading" :loading="feedLoading">
          提交审批
        </el-button>

        <el-button type="success" @click="handleExecute" :disabled="disabledFlag || feedLoading || loading"
                   v-if="form.status == 'APPROVING' && form.id != null" v-hasPermi="['pro:feedback:approval']"
                   :loading="feedLoading">
          审批通过
        </el-button>

        <el-button @click="cancel" :disabled="feedLoading || loading" :loading="feedLoading">取 消</el-button>

<!--        <el-button type="danger" @click="handleReject" :disabled="disabledFlag || feedLoading || loading"
                   v-if="form.status == 'APPROVING' && form.id != null" v-hasPermi="['pro:feedback:approval']"
                   :loading="feedLoading">
          审批不通过
        </el-button>-->

      </div>
    </el-dialog>

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
            <el-form-item label="合格数量" prop="quantityQualified">
              <el-input disabled v-model="splitForm.quantityQualified" placeholder="请输入合格数量"/>
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
<!--        <el-button type="primary" @click="addSplitDetailByQuantity">按数量拆分</el-button>-->
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
        <el-button type="primary" :disabled="splitDisabled" @click="submitSplit">确定拆分</el-button>
      </div>
    </el-dialog>

    <!--  ERP入库  -->
    <el-dialog :title="title" :visible.sync="wareOpen" width="75%" v-dialogDrag append-to-body>
      <el-form ref="wareForm" :model="wareForm" :rules="rules" label-width="120px" @submit.native.prevent>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="报工单号" prop="feedbackCode">
              <el-input v-model="wareForm.id" placeholder="请扫描报工单条码" @keyup.enter.native.prevent="handleBlur"/> <!-- @blur="handleBlur" @input="handleInput"-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" round @click="getCameraInfo()">摄像头</el-button>
          </el-col>


          <el-col :span="12">
            <el-form-item label="仓库信息" prop="goodsNumber">
              <el-cascader v-model="wareForm.wareHouse" :options="warehouseOptions" :props="warehouseProps" @change="handleWarehouseChanged"></el-cascader>
            </el-form-item>
          </el-col>

        </el-row>


        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="showHistory()">历史记录</el-button>
          </el-col>
        </el-row>

        <!-- 设置el-table的高度 -->
        <el-table v-loading="loading" :data="wareList" height="500">
          <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="报工单号" width="210px" align="center" prop="feedbackCode"/>
          <el-table-column label="生产工单编号" width="150px" align="center" prop="workorderCode"/>
          <!--      <el-table-column label="产品物料编码" width="120px" align="center" prop="itemCode"/>-->
          <el-table-column label="产品物料名称" width="150px" align="center" prop="itemName" :show-overflow-tooltip="true"/>
          <el-table-column label="生产工序" align="center" prop="processName"/>
          <el-table-column label="生产设备" align="center" prop="machineryName"/>
          <el-table-column label="仓库" align="center" prop="warehouseName" :show-overflow-tooltip="true"/>
          <el-table-column label="库区" align="center" prop="locationName" :show-overflow-tooltip="true"/>
          <el-table-column label="库位" align="center" prop="areaName" :show-overflow-tooltip="true"/>
          <el-table-column fixed="right" label="合格数量" align="center" prop="quantityQualified"/>
          <el-table-column fixed="right" label="报工时间" align="center" prop="feedbackTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.feedbackTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" fixed="right" label="批次号" align="center" prop="batchCode"/>
        </el-table>

      </el-form>

      <div>
        <video ref="videoCamera" style="display: none;"></video>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="disabledFlag" @click="submitWareForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>

    </el-dialog>

    <el-dialog title="入库历史记录" :visible.sync="historyDialogVisible" width="65%" append-to-body :close-on-click-modal="false">
      <el-form :model="historyQueryParams" ref="historyQueryForm" :inline="true" size="small">
        <el-form-item label="生产工单" prop="workorderCode">
          <el-input v-model="historyQueryParams.workorderCode" placeholder="请输入生产工单"/>
        </el-form-item>

        <el-form-item label="任务单" prop="taskCode">
          <el-input v-model="historyQueryParams.taskCode" placeholder="请输入任务单"/>
        </el-form-item>

        <el-form-item label="报工单号" prop="feedbackCode">
          <el-input v-model="historyQueryParams.feedbackCode" placeholder="请输入报工单号"/>
        </el-form-item>

        <el-form-item label="日期范围">
          <el-date-picker
            v-model="historyQueryParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 240px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleHistoryQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetHistoryQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="historyLoading" :data="historyList" height="500">
        <el-table-column type="index" label="序号" width="60" align="center"><!-- :index="index => (historyQueryParams.pageNo - 1) * historyQueryParams.pageSize + index + 1" -->
        </el-table-column>
        <el-table-column prop="feedbackCode" label="报工单号" width="180" :show-overflow-tooltip="true"/>
        <el-table-column prop="workorderCode" label="生产工单" width="160" :show-overflow-tooltip="true"/>
        <el-table-column prop="itemName" label="物料名称" width="180" :show-overflow-tooltip="true"/>
        <el-table-column prop="quantityQualified" label="合格数量" align="center"/>
        <el-table-column prop="batchCode" label="批次号" width="150"/>
        <el-table-column prop="warehouseName" label="仓库" :show-overflow-tooltip="true"/>
        <el-table-column prop="locationName" label="库区" :show-overflow-tooltip="true"/>
        <el-table-column prop="areaName" label="库位" :show-overflow-tooltip="true"/>
        <el-table-column prop="erpWarehousingTime" label="入库时间" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="ERP状态" width="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.erp_status" :value="scope.row.erpWarehousingStatus"/>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="historyTotal>0"
        :total="historyTotal"
        :page.sync="historyQueryParams.pageNo"
        :limit.sync="historyQueryParams.pageSize"
        @pagination="getHistoryList"
      />
    </el-dialog>

    <!-- 提交审核对话框 -->
    <el-dialog title="提交审核" :visible.sync="auditDialogVisible" width="90%" append-to-body>
      <el-form :model="auditQueryParams" ref="auditQueryForm" :inline="true" size="small">
        <el-form-item label="工单号" prop="workorderCode">
          <el-input v-model="auditQueryParams.workorderCode" placeholder="请输入工单号" clearable></el-input>
        </el-form-item>


        <el-form-item label="生产工序" prop="processCode">
          <el-select v-model="auditQueryParams.processCode" placeholder="请选择工序" clearable><!-- @change="val => { handleProcessChange(val) }" -->
            <el-option v-for="item in processOptions" :key="item.processCode" :label="item.processName" :value="item.processCode"/>
          </el-select>
        </el-form-item>


        <el-form-item label="班次信息" prop="shiftInfo">
          <el-select v-model="auditQueryParams.shiftInfo" placeholder="请选择班次信息" @change="handleShiftChange" clearable>
            <el-option v-for="dict in dict.type.mes_shift_info" :key="dict.value" :label="dict.label"
                       :value="dict.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="报工人" prop="nickName">
          <el-input v-model="auditQueryParams.nickName" placeholder="请输入报工人" clearable></el-input>
        </el-form-item>

        <!--
                <el-form-item label="报工时间" prop="feedbackTime">
                  <el-date-picker
                    v-model="auditQueryParams.feedbackTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  ></el-date-picker>
                </el-form-item>
        -->
        <el-form-item label="报工起始时间" prop="feedbackBeginTime">
          <el-date-picker
            v-model="auditQueryParams.feedbackBeginTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="报工结束时间" prop="feedbackEndTime">
          <el-date-picker
            v-model="auditQueryParams.feedbackEndTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getAuditData">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- 上方：报工详情表格（带勾选） -->
      <div class="audit-detail-container">
        <!--        <el-table
                  ref="detailTable"
                  v-loading="auditLoading"
                  :data="auditDetailList"
                  border
                  height="300"
                  @selection-change="handleDetailSelectionChange"
                >
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="feedbackCode" label="报工单号" width="190" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="workorderCode" label="工单号" width="160" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemName" label="物料名称" width="150" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="processName" label="工序" width="60"></el-table-column>
                  <el-table-column prop="nickName" label="报工人" width="70"></el-table-column>
                  <el-table-column prop="machineryName" label="报工设备" width="100"></el-table-column>
                  <el-table-column prop="quantityFeedback" label="报工数量" align="center"></el-table-column>
                  <el-table-column prop="quantityQualified" label="合格数量" align="center"></el-table-column>
                  <el-table-column prop="quantityUnquanlified" label="不良数量" align="center"></el-table-column>
                  <el-table-column prop="quantityExcess" label="工艺损耗" align="center"></el-table-column>
                  <el-table-column prop="feedbackTime" label="报工时间" width="180">
                    <template slot-scope="scope">
                      {{ parseTime(scope.row.feedbackTime) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="teamCode" label="班组" width="80"></el-table-column>
                  <el-table-column prop="batchCode" label="批次号" width="150"></el-table-column>
                </el-table>-->

        <el-table
          ref="detailTable"
          v-loading="auditLoading"
          :data="auditDetailList"
          border
          height="300"
          @selection-change="handleDetailSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="feedbackCode" label="报工单号" width="100%" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="workorderCode" label="工单号" width="100%" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="itemName" label="物料名称" width="100%" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="processName" label="工序" width="100%"></el-table-column>
          <el-table-column prop="nickName" label="报工人" width="100%"></el-table-column>
          <el-table-column prop="machineryName" label="报工设备" width="100%"></el-table-column>
          <el-table-column prop="quantityFeedback" label="报工数量" align="center"></el-table-column>
          <el-table-column prop="quantityQualified" label="合格数量" align="center"></el-table-column>
          <el-table-column prop="quantityUnquanlified" label="不良数量" align="center"></el-table-column>
          <el-table-column prop="quantityExcess" label="工艺损耗" align="center"></el-table-column>
          <el-table-column prop="feedbackTime" label="报工时间" width="100%" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ parseTime(scope.row.feedbackTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="teamCode" label="班组" width="100%"></el-table-column>
          <el-table-column prop="batchCode" label="批次号" width="100%" :show-overflow-tooltip="true"></el-table-column>
        </el-table>

        <pagination v-show="auditQueryTotal > 0" :total="auditQueryTotal" :page.sync="auditQueryParams.pageNo" :limit.sync="auditQueryParams.pageSize"
                    @pagination="getAuditData"/>
      </div>

      <!-- 下方：左右两个表格 -->
      <div class="audit-bottom-container">
        <!-- 左侧：报工汇总 -->
        <el-col :span="12">
          <div class="audit-summary">
            <el-table
              v-loading="auditItemLoading"
              :data="auditSummaryList"
              border
              height="300"
              @row-click="handleSummaryRowClick"
            >
              <el-table-column prop="workorderCode" label="工单号" width="100%" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="taskCode" label="任务单号" width="100%" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="processName" label="工序" width="100%"></el-table-column>
              <el-table-column prop="nickName" label="报工人" width="100%"></el-table-column>
              <el-table-column prop="machineryName" label="设备" width="100%" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="totalQuantityFeedback" label="总生产数" align="center"></el-table-column>
              <el-table-column prop="totalQuantityQualified" label="总合格数" align="center"></el-table-column>
              <el-table-column prop="totalQuantityUnquanlified" label="总不良数" align="center"></el-table-column>
              <el-table-column prop="totalQuantityExcess" label="工艺损耗" align="center"></el-table-column>
            </el-table>
          </div>
        </el-col>

        <!-- 右侧：班组人员 -->
        <el-col :span="12">
          <div class="audit-team">
            <el-table
              v-loading="teamLoading"
              :data="auditTeamList"
              border
              height="300"
            >
              <el-table-column prop="teamCode" label="所属班组"></el-table-column>
              <el-table-column prop="userName" label="成员账号"></el-table-column>
              <el-table-column prop="nickName" label="成员姓名"></el-table-column>
            </el-table>
          </div>
        </el-col>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitAudit">提交审核</el-button>
      </div>
    </el-dialog>

    <el-dialog title="机长自检" :visible.sync="defectDialogVisible" width="80%" append-to-body>
      <el-card class="box-card">
        <div>
          <el-button type="primary" size="small" @click="handleDefectSelect">新增</el-button>
          <el-button type="danger" size="small" :disabled="processDefectList.length === 0"
                     @click="removeSelectedDefects">删除
          </el-button>
        </div>
        <el-table :data="processDefectList" max-height="420px" style="width: 100%; height: 420px"
                  @selection-change="handleDefectSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column label="序号" width="80" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="defectName" label="不良项名称" :show-overflow-tooltip="true" align="center"/>
          <el-table-column prop="processName" label="不良工序" align="center"/>
          <!--          <el-table-column label="起始米数" align="center" width="120" >
                      <template slot-scope="scope">
                        <el-input
                          v-model.number="scope.row.startMeter"
                          placeholder="请输入起始米数"
                          type="number"
                          min="1"
                          @input="handleStartMeterInput(scope.$index, $event)"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="结束米数" align="center" width="120">
                      <template slot-scope="scope">
                        <el-input
                          v-model.number="scope.row.endMeter"
                          placeholder="请输入结束米数"
                          type="number"
                          min="1"
                          @input="handleEndMeterInput(scope.$index, $event)"
                        ></el-input>
                      </template>
                    </el-table-column>-->
          <el-table-column label="不良米数" align="center" width="120">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.defectMeter"
                placeholder="请输入不良米数"
                type="number"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="originBatchCode" label="来源批次" width="170" align="center"/>
          <el-table-column prop="originTeamCode" label="来源班组" align="center"/>
          <el-table-column prop="originFeedbackCode" label="来源报工单" width="200" align="center"/>

        </el-table>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="defectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDefects">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="合格证信息编辑" :visible.sync="certificateEditVisible" width="50%" append-to-body>
      <el-form :model="certificateForm" :rules="certificateRules" ref="certificateForm" label-width="120px">
        <template>
          <el-tabs v-model="qualifiedActiveName" type="card"  @tab-click="handleTabClick">
            <el-tab-pane label="东莞智源" name="zyQualified">
              <el-form-item label="智源订单号" prop="zyPoNum">
                <el-input v-model="certificateForm.zyPoNum" placeholder="请输入智源订单号"/>
              </el-form-item>
              <el-form-item label="智源物料编码" prop="zyItemCode">
                <el-input v-model="certificateForm.zyItemCode" placeholder="请输入智源物料编码"/>
              </el-form-item>
              <el-form-item label="年份对应编码" prop="zyYear">
                <el-input v-model="certificateForm.zyYear" placeholder="请输入年份对应编码"/>
              </el-form-item>
              <el-form-item label="追溯号" prop="zySerial">
                <el-input v-model="certificateForm.zySerial" placeholder="请输入追溯号"/>
              </el-form-item>
              <el-form-item label="流水号" prop="volumesNumber">
                <el-input v-model="certificateForm.volumesNumber" placeholder="请输入流水号"/>
              </el-form-item>
              <el-form-item label="批次流水号" prop="volumesNumber">
                <el-input v-model="certificateForm.batchcodeVolumes" placeholder="请输入批次流水号"/>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="其他" name="otherQualified">
              <el-form-item label="参数1" prop="attr1">
                <el-input v-model="certificateForm.attr1" placeholder="请输入参数1"/>
              </el-form-item>
              <el-form-item label="参数2" prop="attr2">
                <el-input v-model="certificateForm.attr2" placeholder="请输入参数2"/>
              </el-form-item>
              <el-form-item label="参数3" prop="attr3">
                <el-input v-model="certificateForm.attr3" placeholder="请输入参数3"/>
              </el-form-item>
              <el-form-item label="参数4" prop="attr4">
                <el-input v-model="certificateForm.attr4" placeholder="请输入参数4"/>
              </el-form-item>
              <el-form-item label="参数5" prop="attr5">
                <el-input v-model="certificateForm.attr5" placeholder="请输入参数5"/>
              </el-form-item>
              <el-form-item label="参数6" prop="attr6">
                <el-input v-model="certificateForm.attr6" placeholder="请输入参数6"/>
              </el-form-item>
              <el-form-item label="参数7" prop="attr7">
                <el-input v-model="certificateForm.attr7" placeholder="请输入参数7"/>
              </el-form-item>
              <el-form-item label="参数8" prop="attr8">
                <el-input v-model="certificateForm.attr8" placeholder="请输入参数8"/>
              </el-form-item>
              <el-form-item label="参数9" prop="attr9">
                <el-input v-model="certificateForm.attr9" placeholder="请输入参数9"/>
              </el-form-item>
              <el-form-item label="参数10" prop="attr10">
                <el-input v-model="certificateForm.attr10" placeholder="请输入参数10"/>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="saveCertificateData">保存并打印</el-button>
      </div>
    </el-dialog>

    <el-dialog title="合格证信息编辑" :visible.sync="certificateFrontVisible" width="50%" append-to-body>
      <el-form :model="certificateFrontForm" :rules="frontRules" ref="certificateFrontForm" label-width="120px">
        <template>
          <el-form-item label="批次流水号" prop="batchcodeVolumes">
            <el-input v-model="certificateFrontForm.batchcodeVolumes" placeholder="请输入批次流水号"/>
          </el-form-item>
          <el-form-item label="膜接头" prop="membraneJoint" v-if="certificateFrontForm.type === true">
            <el-input v-model="certificateFrontForm.membraneJoint" placeholder="请输入膜接头"/>
          </el-form-item>
          <el-form-item label="纸接头" prop="paperJoint"  v-if="certificateFrontForm.type === true">
            <el-input v-model="certificateFrontForm.paperJoint" placeholder="请输入纸接头"/>
          </el-form-item>

          <el-form-item label="条形码显隐" prop="codeHide" v-if="certificateFrontForm.codeHideType === true">
            <el-select  v-model="certificateFrontForm.codeHide" placeholder="请选择" >
              <el-option
                v-for="item in codeHideOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="saveCertificateFrontData">保存并打印</el-button>
      </div>
    </el-dialog>

    <!-- 合并弹出框 -->
    <el-dialog title="合并详情" :visible.sync="mergeDialogVisible" width="50%" v-dialogDrag append-to-body>
      <el-form ref="mergeForm" :model="mergeForm" label-width="120px">
        <el-row :gutter="24">
            <el-col :span="12">
<!--              <el-form-item label="报工单号" prop="feedbackCode" >
                <el-select  style="width:100%" v-model="mergeForm.feedbackCode" @change="handleMergeFeedbackCodeChange" placeholder="请选择报工单号">
                  <el-option
                    v-for="item in mergeFeedbackOptions"
                    :key="item.feedbackCode"
                    :label="item.feedbackCode"
                    :value="item.feedbackCode">
                  </el-option>
                </el-select>
              </el-form-item>-->

              <el-form-item label="工单号" prop="workorderCode" >
                <el-select  style="width:100%" v-model="mergeForm.workorderCode" @change="handleMergeFeedbackCodeChange" placeholder="请选择工单号">
                  <el-option
                    v-for="item in mergeFeedbackOptions"
                    :key="item.workorderCode"
                    :label="item.workorderCode"
                    :value="item.workorderCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

<!--            <el-col :span="12">
              <el-form-item label="工单号" prop="workorderCode">
                <el-input disabled  v-model="mergeForm.workorderCode" placeholder="请输入工单号"/>
              </el-form-item>
            </el-col>-->
          <el-col :span="12">
            <el-form-item label="任务单号" prop="taskCode">
              <el-input disabled  v-model="mergeForm.taskCode" placeholder="请输入任务单号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">

          <el-col :span="12">
            <el-form-item label="物料号" prop="itemCode">
              <el-input disabled v-model="mergeForm.itemCode" placeholder="请输入物料号"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :disabled="mergeDisabled" @click="mergeFunction">确定合并</el-button>
      </div>
    </el-dialog>

    <!--  备注补录弹出框  -->
    <el-dialog title="补录备注" :visible.sync="remarkDialogVisible" width="50%" v-dialogDrag append-to-body>
      <el-form ref="remarkForm" :model="remarkForm" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="remarkForm.remark" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="updateRemark">确定修改</el-button>
      </div>
    </el-dialog>

<!--      -->

  </div>
</template>

<script>
import {listFeedback, getFeedback, delFeedback, addFeedback, updateFeedback, execute, executes, startWareHousing, splitFeedback, checkWarehousing, reFeedback, mergeFeedback, initWarehouse, updatePrintStatus, feedbackErp, checkProcess, updateMergeStatus, warehousingErp, getFeedbackDetail, exportJimu, syncwarehousingErp, submitFeedbackAudit, getIotFeedbackData, reWarehousing, listFeedbackAuditPage, initCertificate, updateFeedbackRemark} from '@/api/mes/pro/feedback';
import {auditFeedback} from "@/api/mes/pro/feedbackAudit";

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
import {getProtask, getTaskDetail} from "@/api/mes/pro/protask";
import {exportOrderExcel} from "@/api/channel/order";
import {getFeedbackWarehousingLogPage} from "@/api/pro/feedbackWarehousingLog";
import {getDict} from "@/api/system/dict/data";
import {toBoolean} from "vue-qr/src/packages/util";

// import DefectSelect from '@/components/qmsDefectSelect/single.vue';
import DefectSelect from '@/components/qmsDefectSelect/index.vue';


export default {
  name: 'Feedback',
  components: {MachinerySelectSingle, WorkorderSelect, WorkstationSelect, UserSingleSelect, ProtaskSelect, DefectSelect},
  dicts: ['mes_order_status', 'mes_feedback_type', 'mes_shift_info', 'mes_pro_task_status', 'sys_yes_no', 'erp_status', 'mes_shift_time'],
  props: {
    itemCode: {
      type: String,
      default: '',
    },
    modalAppendToBody: {
      type: Boolean,
      default: false,
    },
    modalClass: {
      type: String,
      default: '',
    },
    mainClass: {
      type: String,
      default: '',
    },
    taskCode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      optType: undefined,
      // 遮罩层
      loading: true,
      historyLoading: true,
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
      historyTotal: 0,
      // 生产报工记录表格数据
      feedbackList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 入库弹出层
      wareOpen: false,
      // 历史记录弹出框展示
      historyDialogVisible: false,
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
        quantityExcess: null,
        userName: null,
        nickName: null,
        feedbackChannel: null,
        feedbackTime: null,
        recordUser: null,
        recordNick: null,
        status: null,
        machineryId: null,
        machineryCode: null,
        machineryName: null
      },
      historyQueryParams: {
        pageNo: 1,
        pageSize: 10,
        feedbackCode: null,
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        workorderId: null,
        workorderCode: null,
        workorderName: null,
        processId: null,
        processCode: null,
        processName: null,
        taskId: null,
        taskCode: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        unitOfMeasure: null,
        specification: null,
        quantityFeedback: null,
        quantityQualified: null,
        quantityUnquanlified: null,
        userName: null,
        nickName: null,
        batchCode: null,
        erpBatchCode: null,
        machineryName: null,
        machineryCode: null,
        machineryId: null,
        erpFeedback: null,
        erpFeedbackStatus: null,
        erpWarehousingStatus: null,
        conversionQuantity: null,
        conversionUnit: null,
        conversionQuantityUnquanlified: null,
        status: null,
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createTime: []
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
      // 不良列表
      processDefectList: [],
      exportLoading: false,
      currentMaxLimit: 5000,  // 当前加载的最大下限
      loadingStatus: {},
      processOptions: [], // 工序选项
      activeName: '1',
      wareHouse: [], // 仓库信息
      // 岗位选项
      postOptions: [],
      // 完工入库历史记录
      historyList: [],
      // 提交审核对话框显示状态
      auditDialogVisible: false,
      // 审批参数
      auditQueryParams: {
        pageNo: 1,
        pageSize: 10,
        workorderCode: undefined,
        nickName: undefined,
        feedbackTime: undefined,
        feedbackBeginTime: undefined,
        feedbackEndTime: undefined,
        shiftInfo: undefined,
      },
      // 报工详情列表
      auditDetailList: [],
      // 报工详情中选中的行
      selectedDetails: [],
      // 报工汇总列表（基于选中的报工详情计算）
      auditSummaryList: [],
      // 班组人员列表
      auditTeamList: [],
      auditLoading: false,
      auditItemLoading: false,
      // 班组人员加载状态
      teamLoading: false,
      // 当前激活的审核标签页
      activeAuditTab: 'detail',
      auditQueryTotal: 0,
      cachedAuditSummary: [],
      // 存储所有选中行的ID
      selectedDetailIds: [],
      cachedSelections: new Map(),
      teamMemberCount: 0,
      cachedProcessCode: null,
      disabledFlag: false,
      iotLoading: false,
      initialized: false,
      splitDisabled: false, // 拆分按钮禁用状态
      selectedDefects: [], // 存储选中的不良项
      defectDialogVisible: false, // 控制机长自检对话框显示

      // 合格证的数据属性
      certificateEditVisible: false, // 分条控制编辑框显示
      certificateFrontVisible: false,  // 涂布, 分切控制编辑框显示

      selectedProcessCode: '', // 当前选中的工序代码
      certificateForm: {
        // 智源参数
        zyPoNum: null,
        zyItemCode: null,
        zyYear: null,
        zySerial: null,
        volumesNumber: null,
        // 其他参数
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        attr5: null,
        attr6: null,
        attr7: null,
        attr8: null,
        attr9: null,
        attr10: null,
      },
      certificateFrontForm: {
        type: false, // 管控是否填写膜接头与纸接头
        codeHideType: false, // 管控是否有条形码显影, 默认不展示
        batchcodeVolumes: null, // 批次号流水号
        membraneJoint: null, // 膜接头
        paperJoint: null, // 纸接头
        codeHide: false, // 条形码显隐, 默认false不展示
      },
      certificateRules: {
        zyPoNum: [{required: true, message: '请输入智源订单号', trigger: 'blur'}],
        zyItemCode: [{required: true, message: '请输入智源物料编码', trigger: 'blur'}],
        zyYear: [{required: true, message: '请输入年份对应编码', trigger: 'blur'}],
        zySerial: [{required: true, message: '请输入追溯号', trigger: 'blur'}],
        volumesNumber: [{required: true, message: '请输入流水号', trigger: 'blur'}],
        batchcodeVolumes: [{required: true, message: '请输入批次流水号', trigger: 'blur'}],
      },

      frontRules: {
        batchcodeVolumes: [{required: true, message: '请输入批次流水号', trigger: 'blur'}],
        /*membraneJoint: [{required: true, message: '请输入膜接头', trigger: 'blur'}],
        paperJoint: [{required: true, message: '请输入纸接头', trigger: 'blur'}],*/
      },

      originalRules:{

      },
      pendingPrintIds: [], // 待打印的ID列表
      qualifiedActiveName: 'zyQualified',
      reFeedbackLoading: false, // 撤销按钮加载状态
      mergeDialogVisible: false, // 合并弹出框
      mergeForm: {
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
        quantityExcess: null,
        userName: null,
        nickName: null,
        feedbackChannel: null,
        feedbackTime: null,
        recordUser: null,
        recordNick: null,
        status: null,
        machineryId: null,
        machineryCode: null,
        machineryName: null
      }, // 合并表单
      mergeFeedbackOptions: [], // 合并报工单选项
      mergeDisabled: false, // 合并禁用按钮
      remarkDialogVisible: false, // 备注弹出框
      remarkForm: {
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
        quantityExcess: null,
        userName: null,
        nickName: null,
        feedbackChannel: null,
        feedbackTime: null,
        recordUser: null,
        recordNick: null,
        status: null,
        machineryId: null,
        machineryCode: null,
        machineryName: null,
        remark: null
      },
      feedLoading: null,
      codeHideOptions: [
        {
          value: true,
          label: '显示'
        },
        {
          value: false,
          label: '隐藏'
        }
      ]
    };
  },
  created() {
    // 从 localStorage 恢复
    const cachedValue = localStorage.getItem('cachedProcessCode');
    this.cachedProcessCode = cachedValue;
    this.queryParams.processCode = cachedValue;
    // this.queryParams.processCode = localStorage.getItem('cachedProcessCode') || null;

    this.getList();
    this.getProcess();
    this.getWarehouseList();
    this.getTreeselect();
  },
  methods: {
    /** 查询生产报工记录列表 */
    getList() {
      this.loading = true;
      if (this.taskCode) this.queryParams.taskCode = this.taskCode;

      listFeedback({
        ...this.queryParams,
        feedbackTime: this.queryParams.feedbackTime || null
      }).then(response => {
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
      this.processDefectList = []; // 清空不良列表
      //this.removeScrollListener();
      this.wareList = []; // 清空入库列表
      this.wareHouse = [];
      this.auditDialogVisible = false
      this.auditDetailList = [];
      this.auditSummaryList = [];
      this.auditTeamList = [];
      this.certificateEditVisible = false
      this.certificateFrontVisible = false
      this.mergeDialogVisible = false
      this.remarkDialogVisible = false

      // 重置加载状态
      this.feedLoading = false;
      this.loading = false;

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
        quantityExcess: null,
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
        conversionUnit: null,
        conversionQuantity: null,
        iotFlag: null,
      };
      this.resetForm('form');
      this.teamMembers = []; // 清空班组成员
      this.processDefectList = []; // 清空不良列表
      this.initialized = false; // 重置初始化状态
      this.iotLoading = false;  // 重置加载状态
      this.certificateForm = {
        zyPoNum: null,
        zyItemCode: null,
        zyYear: null,
        zySerial: null,
        volumesNumber: null,
        batchcodeVolumes: null, // 批次号流水号
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        attr5: null,
        attr6: null,
        attr7: null,
        attr8: null,
        attr9: null,
        attr10: null,

      },
      this.certificateFrontForm ={
        batchcodeVolumes: null, // 批次号流水号
        membraneJoint: null, // 膜接头
        paperJoint: null, // 纸接头
        codeHide: false, // 条形码显隐
      }
      this.resetForm('certificateForm');
      this.mergeForm = {
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
        quantityExcess: null,
        userName: null,
        nickName: null,
        feedbackChannel: null,
        feedbackTime: null,
        recordUser: null,
        recordNick: null,
        status: null,
        machineryId: null,
        machineryCode: null,
        machineryName: null
      };
      this.resetForm('mergeForm');

      this.remarkForm  = {
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
        quantityExcess: null,
        userName: null,
        nickName: null,
        feedbackChannel: null,
        feedbackTime: null,
        recordUser: null,
        recordNick: null,
        status: null,
        machineryId: null,
        machineryCode: null,
        machineryName: null,
        remark: null
      };
      this.resetForm('remarkForm');

      // 重置加载状态
      this.feedLoading = false;
      this.loading = false;

    },
    handleQuantityChanged() {
      this.form.quantityFeedback = this.form.quantityQualified + this.form.quantityUnquanlified + this.form.quantityExcess;
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
    resetHistoryQuery() {
      this.resetForm('historyQueryForm');
      this.handleHistoryQuery();
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
      // 默认手动录入
      this.form.iotFlag = true;
      if (this.taskCode) this.handleTaskCodeChange(this.taskCode);
      this.form.feedbackTime = new Date(); // 追加当前时间展示
      this.form.feedbackType = "UNI"; // 默认选中
      this.form.taskStatus = "STARTED"; //默认选择已开工
      this.form.mergeStatus = "N"; // 默认没有合并需求
      this.title = '添加生产报工记录';
      this.optType = 'add';
      // 初始化时读取设备缓存
      this.loadMachineryCache();
      /* if (this.form.machineryCode && this.form.iotFlag) {
         this.fetchIotData();
       }*/

    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();

      const recordId = row.id || this.ids;
      await getFeedback(recordId).then(response => {
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

        this.form.iotFlag = toBoolean(response.data.iotFlag);
        this.teamMembers = this.form.memberList;
        this.processDefectList = response.data.processDefectList.map((item, index) => ({
          ...item,
          index: index + 1  // 从1开始编号
        }));
        this.initialized = true;
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
        this.form.iotFlag = toBoolean(response.data.iotFlag);
        this.teamMembers = this.form.memberList;
        this.processDefectList = response.data.processDefectList.map((item, index) => ({
          ...item,
          index: index + 1  // 从1开始编号
        }));

        this.initialized = true;
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
        this.$nextTick(() => {
          this.open = true;
          this.title = '查看生产报工记录';
          this.optType = 'view';
        });
      });

    },


    /** 提交按钮 */
    submitForm() {
      this.loading = true;
      this.$refs['form'].validate(async valid => {

        // 2025-10-15 追加: 校验当前任务单所属工单与当前表单提交工单是否一致
        await getProtask(this.form.taskId).then(response => {
          const workorderCode = response.data.workorderCode;
          if (workorderCode != this.form.workorderCode) {
            this.$message.error('当前工单与任务单不匹配, 请您校验!');
            valid = false;
            return;
          }
        });


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
        if (!this.form.quantityFeedback || this.form.quantityFeedback === 0) {
          this.$message.error(`请输入正确的报工数量!`);
          valid = false;
          return;
        }
        if (this.form.quantityExcess > this.form.quantityFeedback) {
          this.$message.error(`请输入正确的损耗数量!`);
          valid = false;
          return;
        }


        if (!this.form.machineryCode) {
          this.$message.error(`请选择正确的报工设备!`);
          valid = false;
          return;
        }

        if (!this.form.taskStatus) {
          this.$message.error(`请选择当前任务单状态!`);
          valid = false;
          return;
        }

        // 新增不良品数量校验
        // 计算所有缺陷项的缺陷米数总和
        const totalDefectMeter = this.processDefectList.reduce((sum, defect) => {
          return sum + (parseFloat(defect.defectMeter) || 0);
        }, 0);
        // 检查缺陷米数总和是否等于不良品数量
        /*if (totalDefectMeter !== this.form.quantityUnquanlified) {
          this.$message.error(`不良品数量(${this.form.quantityUnquanlified})与缺陷米数总和(${totalDefectMeter})不匹配`);
          valid = false;
          return;
        }*/


        if (valid) {
          if ((this.form.processCode === 'AM005') || (this.form.processCode === 'AM007') ||
            (
              this.form.processCode === 'AM006' &&
              this.form.machineryCode &&
              this.form.machineryCode.split('-').pop().startsWith('BF')
            )
          ) {
            this.form.unitOfMeasure = '米';
          }

          this.form.feedbackMemberList = this.teamMembers;
          if (this.form.id != null) {
            updateFeedback(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
            }).finally(() => {
              this.teamMembers = []; // 清空班组成员
              this.processDefectList = []; // 清空缺陷列表
              this.open = false;
              this.loading = false;
              this.getList();
            });
          } else {
            addFeedback(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
            }).finally(() => {
              this.teamMembers = []; // 清空班组成员
              this.processDefectList = []; // 清空缺陷列表
              this.open = false;
              this.loading = false;
              this.getList();
            });
          }
        }
      });
    },
    handleSubmit() {
      this.form.status = 'APPROVING';
      this.$refs['form'].validate(valid => {
        this.loading = true;
        this.feedLoading = true;
        if (valid) {
          if(!this.form.id){
            this.$modal.msgError('当前单据未保存, 请先点击保存按钮!');
            // 重置状态
            this.form.status = 'PREPARE';
            this.optType = 'add';
            this.loading = false;
            this.feedLoading = false;
            return;
          }

          if (this.form.id) {
            this.form.feedbackMemberList = this.teamMembers;
            updateFeedback(this.form).then(async response => {
              this.$modal.msgSuccess('提交成功');
              //this.open = false;
              this.getList();
              // 重新进入渲染当前form内容
              await getFeedback(this.form.id).then(response => {
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

                this.form.iotFlag = toBoolean(response.data.iotFlag);
                this.teamMembers = this.form.memberList;
                this.processDefectList = response.data.processDefectList.map((item, index) => ({
                  ...item,
                  index: index + 1  // 从1开始编号
                }));
                this.initialized = true;
                this.loading = false;
                this.feedLoading = false;
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
                this.$nextTick(() => {
                  this.open = true;
                  this.title = '修改生产报工记录';
                  this.optType = 'edit';
                });
              });

            });
          }
        }
      });
    },

    async handleExecute() {

      if (this.disabledFlag || !this.form.id || this.form.status !== 'APPROVING') {
        return;
      }

      if (!this.form.warehouseId && !this.form.locationId && !this.form.areaId) {
        this.$message.error(`请选择仓库信息！`);
        return;
      }
      try {
        this.disabledFlag = true;
        await this.$modal.confirm('确认执行报工？');
        const response = await executes({
          id: this.form.id,
          status: 'APPROVED',
          warehouseId: this.form.warehouseId,
          locationId: this.form.locationId,
          areaId: this.form.areaId
        }).finally(() => {
          this.cancel();
          this.getList();
          this.loading = false;
          this.disabledFlag = false;
        });
        if(response.code === 0){
          this.$modal.msgSuccess('执行成功');
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$modal.msgError('执行失败');
        }
      } finally {
        this.disabledFlag = false;
      }
    },

    async handleReject() {
      if (this.disabledFlag || !this.form.id || this.form.status !== 'APPROVING') {
        return;
      }

      if (!this.form.warehouseId && !this.form.locationId && !this.form.areaId) {
        this.$message.error(`请选择仓库信息！`);
        return;
      }
      try {
        this.disabledFlag = true;
        await this.$modal.confirm('确认拒审报工？');
        await executes({
          id: this.form.id,
          status: 'UNAPPROVED',
          warehouseId: this.form.warehouseId,
          locationId: this.form.locationId,
          areaId: this.form.areaId
        }).catch(error => {
          // 处理错误
          this.$message.error('执行报工异常: ' + error);
        }).finally(() => {
          this.cancel();
          this.getList();
          this.loading = false;
          this.disabledFlag = false;
        });
        this.$modal.msgSuccess('拒审成功');
      } catch (error) {
        if (error !== 'cancel') {
          this.$modal.msgError('拒审失败');
        }
      } finally {
        this.disabledFlag = false;
      }
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
      // 处理查询参数
      let params = {...this.queryParams, feedbackTime: this.queryParams.feedbackTime || null};
      params.pageNo = undefined;
      params.pageSize = undefined;

      this.$modal
        .confirm('是否确认导出所有报工数据?')
        .then(async () => {
          this.exportLoading = true;
          try {
            const response = await exportJimu(params);
            if (response.data) {
              //window.open(`${process.env.VUE_APP_BASE_API}/jmreport/view/1099904632157564928?token=${getAccessToken()}&ids=${response.data}`);
              window.open(`${process.env.VUE_APP_BASE_API}/jmreport/view/1099927802109648896?token=${getAccessToken()}&ids=${response.data}`);
            }
          } catch (error) {
            console.error('Export failed:', error);
          } finally {
            this.exportLoading = false;
          }
        })
        .catch(() => {
        });


    },
    //选择生产工单
    handleWorkorderSelect() {
      this.$refs.woSelect.showFlag = true;
    },
    /*onWorkorderSelected(row) {
      if (row != undefined && row != null) {
        this.form.workorderId = null;
        this.form.workorderCode = null;
        this.form.workorderName = null;
        this.form.itemId = null;
        this.form.itemCode = null;
        this.form.itemName = null;
        this.form.specification = null;
        this.form.unitOfMeasure = null;

        this.form.workorderId = row.id;
        this.form.workorderCode = row.workorderCode;
        this.form.workorderName = row.workorderName;
        this.form.itemId = row.productId;
        this.form.itemCode = row.productCode;
        this.form.itemName = row.productName;
        this.form.specification = row.productSpc;
        this.form.unitOfMeasure = row.unitOfMeasure;
      }
    },*/
    onWorkorderSelected(row) {
      if (!row) return;
      // 清空表单数据
      this.form = {
        ...this.form,
        workorderId: null,
        workorderCode: null,
        workorderName: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        taskId: null,
        taskCode: null,
        taskName: null,
      };
      const {
        id: workorderId,
        workorderCode,
        workorderName,
        productId: itemId,
        productCode: itemCode,
        productName: itemName,
        productSpc: specification,
        unitOfMeasure
      } = row;

      // 更新表单数据
      this.form = {
        ...this.form,
        workorderId,
        workorderCode,
        workorderName,
        itemId,
        itemCode,
        itemName,
        specification,
        unitOfMeasure
      };
    },


    handleDefectSelect() {
      this.$refs.defectSelect.showFlag = true;
    },
    /*onDefectSelected(row) {
      if (row != undefined && row != null) {
        console.log("row: ", row)
        const obj = {
          ...row,
          startMeter: '',
          endMeter: '',
          defectMeter: ''
        };
        // 若当前缺陷项已存在相同缺陷编码, 则报错
        const isDuplicate = this.processDefectList.some(item => item.defectCode === row.defectCode);
        if (isDuplicate) {
          this.$message.error('缺陷项已存在相同缺陷编码, 请重新选择!');
          return;
        }
        this.processDefectList.push(obj);
      }
    },*/
    onDefectSelected(rows) {
      if (rows && rows.length > 0) {
        rows.forEach(row => {
          // 检查是否重复
          const isDuplicate = this.processDefectList.some(item => item.defectCode === row.defectCode);
          if (!isDuplicate) {
            const obj = {
              ...row,
              startMeter: '',
              endMeter: '',
              defectMeter: ''
            };
            this.processDefectList.push(obj);
          } else {
            this.$message.error(`缺陷项 ${row.defectCode} 已存在，请重新选择!`);
          }
        });
      }
    },
    removeSelectedDefects() {
      // 获取表格的选中行
      const selectedRows = this.selectedDefects;
      if (!selectedRows || selectedRows.length === 0) {
        this.$message.warning('请先选择要删除的缺陷项');
        return;
      }
      // 从processDefectList中移除选中的行
      this.processDefectList = this.processDefectList.filter(
        item => !selectedRows.some(selected => selected.id === item.id)
      );
      // 删除后重新计算缺陷米数总和
      this.handleDefectMeterChange();
      this.$message.success('删除成功');
    },


    handleTaskSelect() {
      this.$refs.taskSelect.showFlag = true;
      this.$refs.taskSelect.getList();
    },
    async onTaskSelected(row) {
      if (row != undefined && row != null) {
        this.form.taskId = row.id;
        this.form.taskCode = row.taskCode;
        this.form.taskName = row.taskName;
        this.form.workstationId = row.workstationId;
        this.form.workstationCode = row.workstationCode;
        this.form.workstationName = row.workstationName;
        this.form.processId = row.processId;
        this.form.processCode = row.processCode;
        this.form.processName = row.processName;
        this.form.processSequence = row.processSequence;
        // this.form.teamCode = row.attr1; // 默认带出派工班组编码
      }
      // 校验当前设备编码是否存在缓存, 存在则基于缓存设备编码带出班组编号
      if (this.form.machineryCode) {
        const response = await listTeam({"machineryCode": this.form.machineryCode});
        const teamCode = response.data.list[0].teamCode;
        this.form.teamCode = teamCode;
      }

      if ((this.form.processCode === 'AM005') || (this.form.processCode === 'AM007') ||
        (
          this.form.processCode === 'AM006' &&
          this.form.machineryCode &&
          this.form.machineryCode.split('-').pop().startsWith('BF')
        )
      ) {
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
        // 判定时间, 若为当前时间为上午7点至晚上19点这段时间, shiftInfo为1, 否则为0

        let startTime = this.dict.type.mes_shift_time.find(item => item.value === "day_shift_start")?.label || null;
        let endTime = this.dict.type.mes_shift_time.find(item => item.value === "day_shift_end")?.label || null;

        if (!startTime || !endTime) {
          this.$message.error('班次时间未配置, 请配置班次时间!');
          return;
        }

        let shift = null;
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        // 判定当前时间是否大于startTime且小于endTime. 符合则将shift设置为0否则设置为1
        shift = ((currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
          (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute))) ? '0' : '1';

        if (!this.form.shiftInfo) this.form.shiftInfo = shift;
        const shiftInfo = this.form.shiftInfo
        getByTeamCodeAndShiftInfo(this.form.teamCode, shiftInfo).then(response => {
          let teamInfo = response.data;
          // 2025-8-12 白班与夜班分别对应不同的负责人
          if (shiftInfo === '0') {
            this.form.principalName = teamInfo[0].principalName;
            this.form.principalId = teamInfo[0].principalId;
          } else {
            this.form.principalName = teamInfo[0].nightPrincipalName;
            this.form.principalId = teamInfo[0].nightPrincipalId;
          }
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
      // 追加问题缺陷与检验项
      if (this.form.processCode) {
        // 2025-8-21 缺陷问题让用户手动配置
        // 基于工序获取对应的缺陷问题
        /*getQcdefectByCode(this.form.processCode).then(response => {
          let index = 1;
          this.processDefectList = response.data.map(defect => ({
            ...defect,
            index: index++,
            startMeter: '',
            endMeter: '',
            defectMeter: ''
          }));
        });*/
        // 如果设备已存在且是数采模式，自动获取数采记录
        if (this.form.iotFlag && this.form.machineryCode && !this.initialized) {
          this.fetchIotData();
        }
      }

    },
    //点击人员选择按钮
    handleUserSelect() {
      this.$refs.userSelect.showFlag = true;
    },
    //人员选择返回
    onUserSelected(row) {
      // 2025-9-3 不允许追加相同用户
      // 循环teamMembers, 判定是否存在相同nickName
      for (let i = 0; i < this.teamMembers.length; i++) {
        if (this.teamMembers[i].username === row.username) {
          this.$message.error('已存在相同人员: ' + row.nickname);
          return;
        }
      }
      this.teamMembers.push(row);
    },
    //点击人员选择按钮
    handleUser2Select() {
      this.$refs.user2Select.showFlag = true;
    },
    //人员选择返回
    onUser2Selected(obj) {
      if (obj != undefined && obj != null) {
        this.form.principalName = obj.nickname;
        this.form.principalId = obj.id;
      }
    },

    async handleBatchPrint() {
      for (let i = 0; i < this.selectedRows.length; i++) {
        let status = this.selectedRows[i].status;
        if (status === 'PREPARE' || status === 'APPROVING') {
          this.$message.error('第' + (i + 1) + '行选中的报工单未完成');
          return;
        }
      }
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

        LODOP.ADD_PRINT_TEXT(105, 15, 120, 35, "生产车间:");
        LODOP.ADD_PRINT_TEXT(105, 120, 280, 35, obj.workstationName);

        LODOP.ADD_PRINT_TEXT(145, 15, 120, 35, "物料名称:");
        LODOP.SET_PRINT_STYLE("FontSize", 12);
        LODOP.ADD_PRINT_TEXT(145, 120, 490, 35, obj.itemName);

        LODOP.SET_PRINT_STYLE("FontSize", 14);
        LODOP.ADD_PRINT_TEXT(185, 15, 120, 35, "工单号:");
        LODOP.ADD_PRINT_TEXT(185, 120, 280, 35, obj.workorderCode);

        LODOP.ADD_PRINT_TEXT(225, 15, 120, 35, "合格数量:");

        if (obj.machineryCode === 'AMSB-BF202401') {
          // 分切工序中, 剥离复卷机产成品单位为"米"
          LODOP.ADD_PRINT_TEXT(225, 120, 280, 35, obj.quantityQualified + '米');
        } else {
          LODOP.ADD_PRINT_TEXT(225, 120, 280, 35, obj.quantityQualified + obj.unitOfMeasure);
        }

        LODOP.ADD_PRINT_TEXT(265, 15, 120, 35, "批次号:");
        LODOP.ADD_PRINT_TEXT(265, 120, 280, 35, obj.batchCode);

        LODOP.ADD_PRINT_TEXT(305, 15, 120, 35, "卷数号:");
        LODOP.ADD_PRINT_TEXT(305, 120, 280, 35, obj.volumesNumber);

        const feedbackTime = new Date(obj.feedbackTime);
        const localTime = feedbackTime.toLocaleString('zh-CN', {
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        LODOP.ADD_PRINT_TEXT(345, 15, 120, 35, "日期:");
        LODOP.ADD_PRINT_TEXT(345, 120, 280, 35, localTime);

        let jsonQc = {
          "id": obj.id,
          "type": "feedback"
        }
        LODOP.ADD_PRINT_BARCODE(220, 390, 170, 170, "QRCode", JSON.stringify(jsonQc));

      }
      LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1); //打印后自动关闭预览窗口
      LODOP.PREVIEW();

      // 开始修改单据, 状态变更已入库
      /*for (const queryId of this.ids) {
        let obj = {};
        await getFeedback(queryId).then(response => {
          obj = response.data;
        });

        // 校验当前单据是否已入库, 未入库则改变状态
        if (obj.status === 'WAREHOUSED') {
          return;
        }

        obj.status = 'PRINTED';
        obj.feedbackMemberList = obj.memberList;
        await updateFeedback(obj).then(response => {
          console.log(response);
        });
      }*/

      for (const queryId of this.ids) {
        await updatePrintStatus(queryId);
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
    async warehousing() {
      // 初始化仓库信息
      // 弹出框
      /* this.wareOpen = true;
       this.title = '产成品入库';*/

      if (this.selectedRows.length < 1) {
        this.$message.error('请勾选要入库的产成品');
        return;
      }

      // 只允许勾选已完成单据进行入库
      for (const row of this.selectedRows) {
        if (row.status !== 'FINISHED' && row.status !== 'PRINTED') {
          this.$message.error('请勾选已完成的单据进行入库');
          return;
        }

        if (row.mergeStatus === 'Y') {
          this.$message.error('勾选单据存在合并需求, 请检查!');
          return;
        }

      }

      await checkProcess(this.selectedRows[0].id).then(response => {
        if (!response.data.process && response.data.taskStatus === 'FINISHED') {// 末工序且设置为'已完成'
          // 追加判定
          this.$modal.confirm('当前任务单确认完成吗? 任务单: ' + response.data.taskCode + ' , 计划数量: ' + response.data.planQuantity + ', 总报工合格数: ' + response.data.qualityQuantity).then(() => {
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
        } else {
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
        }
      })
    },
    async revokedWarehousing() {
      if (this.selectedRows.length < 1) {
        this.$message.error('请勾选要MES撤销入库的产成品');
        return;
      }

      // 只允许勾选已完成单据进行入库
      for (const row of this.selectedRows) {
        if (row.status !== 'WAREHOUSED') {
          this.$message.error('请勾选已入库的单据进行入库');
          return;
        }

        if (row.mergeStatus === 'Y') {
          this.$message.error('勾选单据存在合并需求, 请检查!');
          return;
        }

        if (row.erpWarehousingStatus === 'Y') {
          this.$message.error('该单据已ERP入库, 无法撤销!');
          return;
        }
      }

      this.$modal.confirm('确认撤销入库选中的 ' + this.selectedRows.length + ' 条报工单？').then(async () => {
        this.loading = true;
        await reWarehousing({"wareList": this.selectedRows}).then(response => {
          this.$modal.msgSuccess("撤销成功");
          this.getList();
        }).catch(error => {
          console.error('撤销失败:', error);
          this.$message.error(`撤销失败`);
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
        } else {
          const defaultCamera = videoDevices[0];
          if (defaultCamera) {
            this.targetCameraId = defaultCamera.deviceId;
          } else {
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
                  console.log("undefined");
                }
              } catch (error) {
                that.$message.error('扫描结果不是有效的 JSON 字符串');
              }
              that.handleBlur();
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
      if (!this.wareForm.id) {
        return;
      }

      let idStr = this.wareForm.id.toString();

      if (this.wareForm.id && (idStr.includes('{') || idStr.includes('[') || idStr.includes('}') || idStr.includes(']'))) {
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

      getFeedbackDetail(this.wareForm.id).then(response => {
        let obj = response.data;
        let id = obj.id;
        /*this.wareList = this.wareList.filter(item => {
          return !id.includes(item.id);
        });*/

        // 2025-10-24 卡控先填写仓库
        if (!this.wareForm.locationId){
          this.$message.error('请先选择入库位置!');
          this.wareForm.id = undefined;
          return;
        }

        // 追加校验, 不允许同一个单号扫码多次
        if (this.wareList.some(item => item.id === obj.id)) {
          this.$message.error('当前报工单已扫码!');
          this.wareForm.id = undefined;
          return;
        }

        // 循环wareList列表, 校验每一行的confirmStatus是否为"Y", 若不为Y报错
        if (obj.confirmStatus === 'Y') {
          this.$message.error('存在无需调用的单据' + obj.feedbackCode + ', 请先确认!');
          this.wareForm.id = undefined;
          return;
        }

        if (obj.erpWarehousingStatus !== 'N') {
          this.$message.error('只有未同步入库状态的报工单才能进行ERP报工!');
          this.wareForm.id = undefined;
          return;
        }


        // TODO 2025-10-24 若当前ERP完工入库选择不良品仓, 需卡控备注是否填写
        if (this.wareForm.locationId === 69){
          if(!obj.remark){
            this.$message.error('判定当前ERP入库库区为不良品仓, 请填写当前报工单备注!');
            this.wareForm.id = undefined;
            return;
          }
        }

        // 追加报工入库明细
        this.wareList.push(obj);
        this.wareForm.id = undefined;
      }).catch(error => {
        // 处理错误
        this.$message.error('获取报工单详情失败，请稍后再试');
        this.wareForm.id = undefined;
      });


    },
    //选择默认的仓库、库区、库位
    handleWarehouseChanged(obj) {
      if (obj != null) {
        this.wareForm.warehouseId = obj[0]; // 仓库
        this.wareForm.locationId = obj[1];// 库区
        this.wareForm.areaId = obj[2]; // 库位
      }
    },

    async submitWareForm() {

      if (!this.wareForm.wareHouse) {
        this.$message.error('请选择要入库的位置!');
        return;
      }

      // 校验表单数据
      let obj = {
        "wareList": this.wareList,
        'warehouseId': this.wareForm.warehouseId,
        'locationId': this.wareForm.locationId,
        'areaId': this.wareForm.areaId,
      };
      try {
        await this.$modal.confirm('确认进行ERP完工入库？');
        this.loading = true;
        this.disabledFlag = true;
        await warehousingErp(obj).then(response => {
          this.$modal.msgSuccess("ERP接口调用成功!");
        }).catch(error => {
          // 处理错误
          console.error('获取报工单详情失败:', error);
          this.$message.error('error: ' + error);
        }).finally(() => {
          this.cancel();
          this.getList();
          this.loading = false;
          this.disabledFlag = false;
        });
      } catch (error) {
        this.$message.error('ERP接口调用失败!');
        this.cancel();
        this.getList();
        this.loading = false;
        this.disabledFlag = false;
      }

      /*try {
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
      }*/

    },

    // 显示拆分弹出框
    split() {
      // 检查 selectedRows 是否已定义且非空
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.warning('请选择至少一项进行拆分');
        return;
      }
      const firstRow = this.selectedRows[0]; // 访问第一行
      if (firstRow.status != 'FINISHED' && firstRow.status != 'PRINTED') {
        this.$message.warning('仅允许拆分已完成或已打印的报工单!');
        return;
      }

      if (firstRow.processCode === 'AM006' || firstRow.processCode === 'AM007') {
        this.$message.warning('当前工序无需拆分!');
        return;
      }

      this.splitForm = {
        id: firstRow.id,
        workorderCode: firstRow.workorderCode,
        itemCode: firstRow.itemCode,
        quantityFeedback: firstRow.quantityFeedback,
        quantityQualified: firstRow.quantityQualified,
        unitOfMeasure: firstRow.unitOfMeasure
      };
      this.splitDetails = this.selectedRows.map(row => ({
        workorderCode: row.workorderCode,
        itemCode: row.itemCode,
        unitOfMeasure: row.unitOfMeasure,
        quantity: '' // 用户需要填写的数量
      }));
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
    async submitSplit() {
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
      this.splitDisabled = true;
      let obj = {
        'id': this.splitForm.id,
        'workorderCode': this.splitForm.workorderCode,
        'itemCode': this.splitForm.itemCode,
        'quantityFeedback': this.splitForm.quantityFeedback,
        'unitOfMeasure': this.splitForm.unitOfMeasure,
        'splitDetails': this.splitDetails
      }

      try {
        await splitFeedback(obj);
        this.$message.success('拆分成功');
      } catch (error) {
        this.$message.error('拆分失败' + error);
      } finally {
        this.splitDisabled = false;
        this.splitDialogVisible = false;
        this.getList();
      }

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
      // 校验当前报工产成品是否入库, 入库不允许进行撤销
      try {
        this.reFeedbackLoading = true;
        const response = await checkWarehousing(this.selectedRows[0].id);
        if (response.data === "Y") { // 入库不允许进行撤销
          this.$message.error('该报工产成品已入库, 请先调用撤销入库接口!');
          this.reFeedbackLoading = false;
          return;
        }

        if(this.selectedRows[0].status === 'WAREHOUSED'){
          this.$message.error('该报工产成品已入库, 请先调用撤销入库接口!');
          this.reFeedbackLoading = false;
          return;
        }

        // 校验当前选中行状态是否为已完成, 已完成才允许进行撤销
        if (this.selectedRows[0].status != 'FINISHED' && this.selectedRows[0].status != 'PRINTED' && this.selectedRows[0].status != 'UNAPPROVED') {
          this.$message.error('该单据不满足撤销需求!');
          this.reFeedbackLoading = false;
          return;
        }
        // 校验当前选中行是否存在来源单据, 存在不允许撤销
        if (this.selectedRows[0].originCode) {
          this.$message.error('该单据存在来源单据, 不能进行撤销!');
          this.reFeedbackLoading = false;
          return;
        }
        // 开始进行撤销报工操作
        // 追加弹出框, 当用户点击确认后在执行reFeedback方法
        this.$confirm('确定要撤销?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          reFeedback(this.selectedRows[0].id).then(response => {
            this.getList();
            this.$message.success('撤销成功');
            this.reFeedbackLoading = false;
          }).catch(()=>{
            this.$message.error('撤销失败');
            this.reFeedbackLoading = false;
          });
        }).catch(() => {
          this.$message.info('已取消');
          this.reFeedbackLoading = false;
        });
      } catch (error) {
        console.error('检查入库状态时出错:', error);
        this.reFeedbackLoading = false;
      }
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
      this.handleDefectMeterChange();
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
      this.handleDefectMeterChange();
    },
    //查询工序信息
    getProcess() {
      // 初始化工序选项
      this.processOptions = [];
      listProcess().then(response => {
        this.processOptions = response.data.list;
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
      /*const canMerge = this.selectedRows.every(row =>
        row.itemCode === first.itemCode &&
        // 2025-8-20 允许跨工单合并
        // row.workorderCode === first.workorderCode &&
        // row.taskCode === first.taskCode &&
        row.processCode === first.processCode &&
        // row.machineryCode === first.machineryCode &&
        (row.status === 'FINISHED' || row.status === 'PRINTED')
      );*/

      const canMerge = this.selectedRows.every(row =>
        row.itemCode === first.itemCode &&
        // 2025-8-20 允许跨工单合并
        row.processCode === first.processCode &&
        (row.status === 'FINISHED' || row.status === 'PRINTED')
      );

      if (!canMerge) {
        this.$message.error('只能合并相同物料的报工单');
        return;
      }
      // 将当前选择的工单信息传递到mergeFeedbackOptions中
      this.mergeFeedbackOptions = this.selectedRows;

     // this.mergeDialogVisible = true;
      // 若当前同属于一个工单, 则直接调用mergeFunction()方法, 否则打开弹出框
      if (this.selectedRows.every(row => row.workorderCode === first.workorderCode)) {
        this.mergeFunction()
      }else{
        this.mergeDialogVisible = true;
      }
    },
    // 2025-10-21 追加卡控, 允许用户手动选择合并到哪个工单
    mergeFunction() {
      this.$modal.confirm('确认合并选中的 ' + this.selectedRows.length + ' 条报工单？').then(() => {
        const ids = this.selectedRows.map(item => item.id);
        this.loading = true;
        mergeFeedback({"feedbackIds": ids,"baseFeedbackId" : Number(this.mergeForm.id)}).then(response => {
          this.$modal.msgSuccess("合并成功");
          this.mergeDialogVisible = false
          this.mergeForm = {};
          this.getList();
        }).finally(() => {
          this.loading = false;
        });
      });
    },

    // 工序缓存
    handleProcessChange(val) {
      this.cachedProcessCode = val;
      if (val) {
        localStorage.setItem('cachedProcessCode', val);
      } else {
        localStorage.removeItem('cachedProcessCode');
      }
      // 强制重新渲染
      this.$forceUpdate();
    },
    handleMachineryAdd() {
      this.$refs.machinerySelect.showFlag = true;
    },
    handleQueryMachineryAdd() {
      this.$refs.queryMachinerySelect.showFlag = true;
    },

    loadMachineryCache() {
      try {
        const cachedMachinery = localStorage.getItem('cachedMachinery')
        if (cachedMachinery) {
          const {id, code, name} = JSON.parse(cachedMachinery)
          // 验证缓存数据完整性
          if (id && code && name) {
            this.form.machineryId = id
            this.form.machineryCode = code
            this.form.machineryName = name
            this.queryParams.machineryId = id
            this.queryParams.machineryCode = code
            this.queryParams.machineryName = name
          }
        }
      } catch (e) {
        console.error('设备信息缓存读取失败:', e)
        localStorage.removeItem('cachedMachinery')
      }
    },

    saveMachineryCache(data) {
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

        /* if (this.form.iotFlag) {
           console.log("CCC")
          this.fetchIotData();
         }*/

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
    onQueryMachineryAdd(rows) {
      if (rows) {
        // 更新表单数据
        this.queryParams.machineryId = rows.id
        this.queryParams.machineryCode = rows.machineryCode
        this.queryParams.machineryName = rows.machineryName
      }
    },

    handlePostChange(row) {
      console.log('修改后的岗位:', row.postIds)
    },
    handleFeedbackErp(row) {
      // 只允许选择一行
      if (this.selectedRows.length !== 1) {
        this.$message.warning('请选择一行数据进行操作');
        return;
      }
      const selectedRow = this.selectedRows[0];
      if (selectedRow.status !== 'WAREHOUSED' && selectedRow.erpFeedbackStatus !== 'N') {
        this.$message.warning('只有完成状态的报工单且未同步才能进行ERP报工!');
        return;
      }
      this.$modal.confirm('确认进行ERP报工？').then(() => {
        this.loading = true;
        feedbackErp(selectedRow.id).then(response => {
          this.$modal.msgSuccess("ERP报工成功!");
        }).finally(() => {
          this.getList();
          this.loading = false;
        });
      });
    },
    handleWarehouseScan() {
      this.wareOpen = true;
      this.title = 'ERP成品入库'
    },
    handleWarehousingErp(row) {

      if (this.selectedRows.length < 1) {
        this.$message.error('请至少选择一行数据进行操作');
        return;
      }
      const selectedRow = this.selectedRows;

      // 循环selectedRow, 判定每一行 "只有未同步入库状态的报工单才能进行ERP报工"
      for (let i = 0; i < selectedRow.length; i++) {
        const row = selectedRow[i];
        if (row.erpWarehousingStatus !== 'N') {
          this.$message.error('只有未同步入库状态的报工单才能进行ERP报工!');
          return;
        }
      }
      const ids = selectedRow.map(item => item.id);

      this.$modal.confirm('确认进行ERP完工入库？').then(() => {
        this.loading = true;
        syncwarehousingErp(ids).then(response => {
          this.$modal.msgSuccess("ERP入库成功!");
          this.getList();
        }).finally(() => {
          this.loading = false;
        });
      });
    },


    tableRowClassName({row, rowIndex}) {
      if (row.mergeStatus === 'Y') {
        return 'warning-row';
      }
      return '';
    },
    updateRadio() {
      this.$forceUpdate();
    },
    handleTaskCodeChange(taskCode) {
      getTaskDetail(taskCode).then(response => {
        const data = response.data;
        this.form.workorderCode = data.workorderCode;
        this.form.workorderName = data.workorderName;

        this.form.itemCode = data.itemCode;
        this.form.itemName = data.itemName;
        this.form.specification = data.specification;
        this.form.unitOfMeasure = data.unitOfMeasure;

        this.form.taskId = data.taskId;
        this.form.taskCode = data.taskCode;
        this.form.workstationId = data.workstationId;
        this.form.workstationCode = data.workstationCode;
        this.form.workstationName = data.workstationName;

        this.form.processId = data.processId;
        this.form.processCode = data.processCode;
        this.form.processName = data.processName;
        this.form.teamCode = data.teamCode;
      })

      /*if(this.form.processCode === 'AM005'){
        this.form.unitOfMeasure = '米';
      }*/

      if ((this.form.processCode === 'AM005') || (this.form.processCode === 'AM007') ||
        (
          this.form.processCode === 'AM006' &&
          this.form.machineryCode &&
          this.form.machineryCode.split('-').pop().startsWith('BF')
        )
      ) {
        this.form.unitOfMeasure = '米';
      }

      if (this.form.teamCode) {
        // 基于当前班组编码获取班组人员
        // 判定时间, 若为当前时间为上午7点30至晚上19点30这段时间, shiftInfo为1, 否则为0
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const isDuringShift = (hour > 7 || (hour === 7 && minute >= 30)) &&
          (hour < 19 || (hour === 19 && minute < 30));
        const time = isDuringShift ? '0' : '1';

        if (!this.form.shiftInfo) this.form.shiftInfo = time;
        const shiftInfo = this.form.shiftInfo;
        getByTeamCodeAndShiftInfo(this.form.teamCode, shiftInfo).then(response => {
          let teamInfo = response.data;
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
      // 追加问题缺陷与检验项
      if (this.form.processCode) {
        // 2025-8-21 缺陷项改为用户手动配置
        /* getQcdefectByCode(this.form.processCode).then(response => {
          console.log(response.data);
          let index = 1;
          this.processDefectList = response.data.map(defect => ({
            ...defect,
            index: index++,
            startMeter: '',
            endMeter: '',
            defectMeter: ''
          }));
        });*/

      }
    },
    handleInput(inputValue) {
      // 更新 scanResult
      this.scanResult = inputValue;
    },
    showHistory() {
      this.historyDialogVisible = true;
      this.getHistoryList();
    },
    handleHistoryQuery() {
      this.historyQueryParams.pageNo = 1;
      this.historyLoading = true;
      this.getHistoryList();
    },
    getHistoryList() {
      getFeedbackWarehousingLogPage(this.historyQueryParams).then(response => {
        this.historyList = response.data.list;
        this.historyTotal = response.data.total;
        this.historyLoading = false;
      });
    },


    // 打开审批对话框
    handleAudit() {
      this.auditDialogVisible = true;
      // 如果有缓存数据，恢复汇总列表
      if (this.cachedAuditSummary.length > 0) {
        this.auditSummaryList = [...this.cachedAuditSummary];
      }
      this.getAuditData();

      let startTime = this.dict.type.mes_shift_time.find(item => item.value === "day_shift_start")?.label || null;
      let endTime = this.dict.type.mes_shift_time.find(item => item.value === "day_shift_end")?.label || null;

      if (!startTime || !endTime) {
        this.$message.error('班次时间未配置, 请配置班次时间!');
        return;
      }

      // TODO: 追加当前用户


      let shift = null;
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      shift = ((currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
        (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute))) ? '0' : '1';
      this.auditQueryParams.shiftInfo = shift;
    },

    // 获取报工详情数据
    async getAuditData() {
      this.auditLoading = true;
      // 保存当前页的选中状态
      if (this.auditDetailList.length > 0) {
        this.cachedSelections.set(
          this.auditQueryParams.pageNo,
          this.$refs.detailTable.selection
        );
      }

      this.auditQueryParams.feedbackTime = [
        this.auditQueryParams.feedbackBeginTime,
        this.auditQueryParams.feedbackEndTime
      ];
      try {
        const response = await listFeedbackAuditPage(this.auditQueryParams);
        this.auditDetailList = response.data.list;
        this.auditQueryTotal = response.data.total;

        // 恢复当前页的选中状态
        this.$nextTick(() => {
          const savedSelections = this.cachedSelections.get(this.auditQueryParams.pageNo) || [];
          savedSelections.forEach(row => {
            const found = this.auditDetailList.find(item => item.id === row.id);
            if (found) {
              this.$refs.detailTable.toggleRowSelection(found, true);
            }
          });
        });
      } finally {
        this.auditLoading = false;
      }
    },

    // 报工详情勾选变化
    handleDetailSelectionChange(selection) {
      // 更新当前页的选中缓存
      this.cachedSelections.set(this.auditQueryParams.pageNo, selection);

      // 重建完整的选中列表
      this.selectedDetails = Array.from(this.cachedSelections.values())
        .flat()
        .filter((row, index, self) =>
          index === self.findIndex(r => r.id === row.id)
        );

      // 计算汇总
      this.calcSummaryData();
    },

    // 计算报工汇总数据
    calcSummaryData() {
      const summaryMap = new Map();
      this.auditTeamList = [];
      this.teamMemberCount = 0;

      this.selectedDetails.forEach(item => {
        const key = `${item.workorderCode}-${item.taskCode}-${item.nickName}-${item.machineryCode}`;

        if (!summaryMap.has(key)) {
          summaryMap.set(key, {
            key: key,
            workorderCode: item.workorderCode,
            workorderId: item.workorderId,
            taskCode: item.taskCode,
            taskId: item.taskId,
            processId: item.processId,
            processName: item.processName,
            processCode: item.processCode,
            itemId: item.itemId,
            itemName: item.itemName,
            itemCode: item.itemCode,
            unitOfMeasure: item.unitOfMeasure,
            specification: item.specification,
            userName: item.userName,
            nickName: item.nickName,
            teamCode: item.teamCode,
            machineryCode: item.machineryCode,
            machineryName: item.machineryName,
            totalQuantityFeedback: 0,
            totalQuantityQualified: 0,
            totalQuantityUnquanlified: 0,
            totalQuantityExcess: 0,
            teamMembers: [],
            feedbackIds: []
          });
        }

        const summary = summaryMap.get(key);
        summary.totalQuantityFeedback += item.quantityFeedback;
        summary.totalQuantityQualified += item.quantityQualified;
        summary.totalQuantityUnquanlified += item.quantityUnquanlified;
        summary.totalQuantityExcess += item.quantityExcess;

        // 将当前报工记录ID添加到汇总项中
        if (!summary.feedbackIds.includes(item.id)) {
          summary.feedbackIds.push(item.id);
        }

        // 合并班组成员（去重）
        if (item.memberList && item.memberList.length > 0) {
          item.memberList.forEach(member => {
            const exists = summary.teamMembers.some(m =>
              m.userName === member.userName
            );
            if (!exists) {
              summary.teamMembers.push({
                userName: member.userName,
                nickName: member.nickName,
                teamCode: member.teamCode,
                postName: this.formatPostNames(member.postIds)
              });
            }
          });
        }
      });

      this.auditSummaryList = Array.from(summaryMap.values());
    },
    // 格式化岗位名称
    formatPostNames(postIds) {
      if (!postIds) return '';
      const ids = Array.isArray(postIds) ? postIds : postIds.split(',').map(id => parseInt(id.trim()));
      return this.postOptions.filter(post => ids.includes(post.id)).map(post => post.name).join(', ');
    },

    // 点击报工汇总行
    handleSummaryRowClick(row) {
      this.auditTeamList = row.teamMembers || [];
      this.teamMemberCount = this.auditTeamList.length;

      if (this.teamMemberCount === 0) {
        this.$message.info('当前工单任务没有班组成员信息');
      }
    },

    // 提交审核
    submitAudit() {
      if (this.selectedDetails.length === 0) {
        this.$message.warning('请至少选择一条报工记录');
        return;
      }

      /*if(!this.auditQueryParams.feedbackBeginTime || !this.auditQueryParams.feedbackEndTime){
        this.$message.warning('请选择报工时间范围!');
        return;
      }*/

      // 构造提交数据
      const submitData = {
        queryParams: this.auditQueryParams,
        feedbackIds: this.selectedDetails.map(item => item.id),
        summaryList: this.auditSummaryList
      };

      this.$modal.confirm('确认提交选中的 ' + this.selectedDetails.length + ' 条报工记录进行审核？').then(() => {
        this.auditLoading = true;
        auditFeedback(submitData).then(() => {
          this.$modal.msgSuccess('提交审核成功');
          this.auditDialogVisible = false;
          this.auditDetailList = [];
          this.auditSummaryList = [];
          this.auditTeamList = [];
          this.getList(); // 刷新主列表
        }).finally(() => {
          this.auditLoading = false;
        });
      });

    },
    async fetchIotData() {
      if (this.initialized || !this.form.machineryCode) {
        return;
      }
      this.iotLoading = true;
      try {
        const response = await getIotFeedbackData(this.form.machineryCode);
        if (response.data) {
          const iotData = response.data;
          // 更新表单数据
          this.form.quantityQualified = iotData || 0;
          this.form.quantityFeedback = this.form.quantityQualified + this.form.quantityUnquanlified;
          this.initialized = true; // 标记数据已初始化
          this.$message.success('成功获取设备数采记录');

        }
      } catch (error) {
        console.error('获取数采记录失败:', error);
        this.$message.error('获取设备数采记录失败');
      } finally {
        this.iotLoading = false;
      }
    },

    handleIotSwitchChange(value) {
      if (value && this.form.machineryCode) {
        this.fetchIotData();
      }
    },

    async handleCertificatePrint(row) {
      if (this.selectedRows.length < 1) {
        this.$message.error('请至少选择一行数据进行操作');
        return;
      }

      const selectedIds = this.selectedRows.map(item => item.id);

      // 并行检查所有ID的制程状态
      const processChecks = await Promise.all(
        selectedIds.map(id => checkProcess(id))
      );

      // 检查是否有任何ID存在下道制程
      const hasProcess = processChecks.some(response => response.data.process);
      if (hasProcess) {
        // 找出第一个有问题的ID
        const problematicIndex = processChecks.findIndex(response => response.data.process);
        const problematicId = selectedIds[problematicIndex];
        const response = processChecks[problematicIndex];
        this.$message.error(`报工单${response.data.feedbackCode}存在下道制程, 无需打印合格证!`);
        return;
      }
      // 检查工序类型: 如果是涂布直接打印
      const processCodes = [...new Set(this.selectedRows.map(item => item.processCode))];
      if (processCodes.length > 1) {
        this.$message.error('不同工序的报工单不能混合打印，请选择相同工序的报工单');
        return;
      }

      // 查看当前选中行, 如果为分切(processCode = AM006) 则需要获取当前行单位
      const unit = this.selectedRows[0].unitOfMeasure;

      const processCode = processCodes[0];
      if (processCode === 'AM001' || (processCode === 'AM006' && unit === "张")) {
        this.certificateFrontForm.type = false;
        if(processCode === 'AM006'){
          this.certificateFrontForm.codeHideType = true;
        }
        this.certificateFrontVisible = true;
        //  this.executeCertificatePrint();
      } else if(processCode === 'AM006' && unit === "米"){
        this.certificateFrontForm.type = true;
        if(processCode === 'AM006'){
          this.certificateFrontForm.codeHideType = true;
        }
        this.certificateFrontVisible = true;
      }else {
        // AM004工序弹出输入框
        this.certificateEditVisible = true;
      }

    },
    async saveCertificateData() {
      this.$refs.certificateForm.validate(async valid => {
        if (valid) {
          this.certificateEditVisible = false;
          await this.executeCertificatePrint();
        }
      });
    },
    async saveCertificateFrontData(){
      this.$refs.certificateFrontForm.validate(async valid => {
        if (valid) {
          this.certificateEditVisible = false;
          await this.executeCertificatePrint();
        }
      });
    },
    async executeCertificatePrint() {
      const selectedIds = this.selectedRows.map(item => item.id);
      try {
        this.loading = true;
        const printData = await initCertificate(selectedIds);
        const lodopItems = [];
        for (let i = 0; i < printData.data.length; i++) {
          const jsonObject = printData.data[i];
          if (jsonObject.processCode === "AM004" || jsonObject.processCode === "AM001" || jsonObject.processCode === "AM006") {
            lodopItems.push(jsonObject);
          }
        }

        if (lodopItems.length > 0) {
          LODOP.PRINT_INITA(0, 0, 150, 100);
          LODOP.SET_PRINT_PAGESIZE(2, "", "", "热敏纸"); // 设置纸张横向

          for (const jsonObject of lodopItems) {
            // 一维码生成
            // 获取当前月份
            const month = new Date().getMonth() + 1;
            const date = new Date().getDate();
            // 日期转换, 1 -> 1 , 2->2 , 10 -> A , 11 -> B , 12 -> C
            const monthCode = month <= 9 ? month : String.fromCharCode(month - 10 + 65);
            const dateCode = date <= 9 ? date : String.fromCharCode(date - 10 + 65);
            const lastThreeChars = jsonObject.volumesNumber.slice(-3);
            const modifiedVolumesNumber = lastThreeChars.slice(0, -1);

            let barcodeData = null;
            if(this.qualifiedActiveName == 'zyQualified'){
              barcodeData = this.certificateForm.zyPoNum + '-' + this.certificateForm.zyItemCode + '-' + this.certificateForm.zyYear + monthCode + dateCode + this.certificateForm.zySerial + '-' + jsonObject.weight + '/';
            }else{
              // 追加判定, 若attr参数不为空才进行追加, 以防止null
              barcodeData = [
                this.certificateForm.attr1,
                this.certificateForm.attr2,
                this.certificateForm.attr3,
                this.certificateForm.attr4,
                this.certificateForm.attr5,
                this.certificateForm.attr6,
                this.certificateForm.attr7,
                this.certificateForm.attr8,
                this.certificateForm.attr9,
                this.certificateForm.attr10
              ].filter(attr => attr != null && attr !== '').join('');
            }

            let batchCodeVolumn = (!this.certificateForm.batchcodeVolumes ? this.certificateFrontForm.batchcodeVolumes : this.certificateForm.batchcodeVolumes);
            let hideCodeHeight = (this.certificateFrontForm.codeHide !== true ? 50 : 0);

            if (jsonObject.processCode === "AM004") {
              // 开始拼接分条合格证
              LODOP.NEWPAGE();
              // 添加整体边框
              LODOP.ADD_PRINT_RECT(8, 5, 150 * 3.78 - 10, 100 * 3.75 - 10, 0, 1); // 整体边框
              // 添加网络图片
              LODOP.ADD_PRINT_IMAGE(10, 20, "15mm", "15mm", "http://172.18.12.250:9000/ammes/userAvatar_userBlob06310_21a3a05d2092420d8ca8220c1d23f478.");
              // 设置图片样式为自动缩放
              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

              LODOP.ADD_PRINT_IMAGE(55, 20, "15mm", "5mm", "http://172.18.12.250:9000/ammes/jimureport/images/aomei_text.png");
              // 设置图片样式为自动缩放
              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);


              // 添加标题及标题边框
              LODOP.SET_PRINT_STYLE("FontSize", 15);
              LODOP.SET_PRINT_STYLE("FontName", "Microsoft YaHei");
              LODOP.SET_PRINT_STYLE("Bold", 1);
              LODOP.ADD_PRINT_TEXT(13, 150, 500, 30, "江苏澳美镭射包装材料有限公司");

              LODOP.SET_PRINT_STYLE("FontSize", 15);
              LODOP.SET_PRINT_STYLE("FontName", "宋体");
              LODOP.ADD_PRINT_TEXT(43, 100, 500, 30, "Jiangsu Aomei Laser Packaging Co.,Ltd");

              // 内容样式及分块边框
              LODOP.SET_PRINT_STYLE("FontSize", 14);
              LODOP.SET_PRINT_STYLE("Bold", 0);
              LODOP.SET_PRINT_STYLE("Horient", 0); // 取消居中

              LODOP.ADD_PRINT_TEXT(75, 15, 120, 35, "类    型:");
              LODOP.ADD_PRINT_TEXT(75, 120, 500, 35, jsonObject.itemName); // 内容部分

              LODOP.ADD_PRINT_TEXT(115, 15, 120, 35, "规    格:");
              LODOP.ADD_PRINT_TEXT(115, 120, 500, 35, jsonObject.specification);

              LODOP.ADD_PRINT_TEXT(155, 15, 120, 35, "净    重:");
              LODOP.ADD_PRINT_TEXT(155, 120, 490, 35, jsonObject.weight + 'KG');

              LODOP.ADD_PRINT_TEXT(155, 360, 120, 35, "保质期:");
              LODOP.ADD_PRINT_TEXT(155, 430, 280, 35, "12个月");

              LODOP.ADD_PRINT_TEXT(195, 15, 120, 35, "批    号:");
              LODOP.ADD_PRINT_TEXT(195, 120, 280, 35, jsonObject.workorderCode + "-" + batchCodeVolumn);

              const printDate = new Date(jsonObject.printDate);
              const localTime = printDate.toLocaleString('zh-CN', {
                hour12: false,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });

              LODOP.ADD_PRINT_TEXT(235, 15, 120, 35, "生产日期:");
              LODOP.ADD_PRINT_TEXT(235, 120, 280, 35, localTime);

              LODOP.ADD_PRINT_TEXT(275, 15, 500, 35, "公司地址: 江苏省扬州市宝应县低碳产业园C区1号");

              LODOP.ADD_PRINT_BARCODE(310, 10, 560, 58, '128AUTO', barcodeData) // barcodeData

              let jsonQc = {
                "id": jsonObject.id,
                "type": "feedback"
              }

              LODOP.ADD_PRINT_BARCODE(180, 435, 140, 140, "QRCode", JSON.stringify(jsonQc));

            } else if (jsonObject.processCode === "AM001") {
              LODOP.NEWPAGE();
              // 添加整体边框
              LODOP.ADD_PRINT_RECT(8, 5, 150 * 3.78 - 10, 100 * 3.75 - 10, 0, 1); // 整体边框
              // 添加网络图片
              LODOP.ADD_PRINT_IMAGE(10, 20, "15mm", "15mm", "http://172.18.12.250:9000/ammes/userAvatar_userBlob06310_21a3a05d2092420d8ca8220c1d23f478.");
              // 设置图片样式为自动缩放
              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
              LODOP.ADD_PRINT_IMAGE(55, 20, "15mm", "5mm", "http://172.18.12.250:9000/ammes/jimureport/images/aomei_text.png");
              // 设置图片样式为自动缩放
              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

              // 添加标题及标题边框
              LODOP.SET_PRINT_STYLE("FontSize", 15);
              LODOP.SET_PRINT_STYLE("FontName", "Microsoft YaHei");
              LODOP.SET_PRINT_STYLE("Bold", 1);
              LODOP.ADD_PRINT_TEXT(13, 150, 500, 30, "江苏澳美镭射包装材料有限公司");

              LODOP.SET_PRINT_STYLE("FontSize", 15);
              LODOP.SET_PRINT_STYLE("FontName", "宋体");
              LODOP.ADD_PRINT_TEXT(43, 100, 500, 30, "Jiangsu Aomei Laser Packaging Co.,Ltd");

              // 内容样式及分块边框
              LODOP.SET_PRINT_STYLE("FontSize", 14);
              LODOP.SET_PRINT_STYLE("Bold", 0);
              LODOP.SET_PRINT_STYLE("Horient", 0); // 取消居中

              LODOP.ADD_PRINT_TEXT(75, 15, 120, 35, "客户名称:");
              LODOP.ADD_PRINT_TEXT(75, 110, 500, 35, ""); // 内容部分

              LODOP.ADD_PRINT_TEXT(120, 15, 120, 35, "品    名:");
              // 追加正则表达式, 只展示中文
              const chineseRegex = /[\u4e00-\u9fa5]+/g;
              LODOP.ADD_PRINT_TEXT(120, 105, 280, 35, jsonObject.itemName.match(chineseRegex)); // 内容部分

              const specRegex = /[\d.]+μm\*[\d.]+mm/;
              LODOP.ADD_PRINT_TEXT(120, 300, 120, 35, "规    格:");

              LODOP.ADD_PRINT_TEXT(120, 405, 280, 35, jsonObject.specification.split('（')[0].trim().split('(')[0].trim());

              LODOP.ADD_PRINT_TEXT(165, 15, 120, 35, "批    号:");
              LODOP.ADD_PRINT_TEXT(165, 105, 280, 35, jsonObject.workorderCode + "-" + batchCodeVolumn);

              LODOP.ADD_PRINT_TEXT(165, 300, 120, 35, "米    长:");
              LODOP.ADD_PRINT_TEXT(165, 405, 280, 35, jsonObject.quantityQualified);

              LODOP.ADD_PRINT_TEXT(210, 15, 120, 35, "检    验:");
              LODOP.ADD_PRINT_TEXT(210, 105, 280, 35, "合格");

              if (jsonObject.shiftInfo) {
                LODOP.ADD_PRINT_TEXT(210, 160, 120, 35, "班  组:");
                LODOP.ADD_PRINT_TEXT(210, 235, 280, 35, jsonObject.shiftInfo === 0 ? 'A' : 'B');
              }

              LODOP.ADD_PRINT_TEXT(210, 300, 120, 35, "净    重:");
              LODOP.ADD_PRINT_TEXT(210, 405, 280, 35, jsonObject.weight + 'KG');

              const printDate = new Date(jsonObject.printDate);
              const localTime = printDate.toLocaleString('zh-CN', {
                hour12: false,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });

              LODOP.ADD_PRINT_TEXT(255, 15, 120, 35, "生产日期:");
              LODOP.ADD_PRINT_TEXT(255, 105, 280, 35, localTime);

              LODOP.ADD_PRINT_TEXT(300, 15, 250, 35, "公司地址: 江苏省扬州市宝应县低碳产业园C区1号");

              /*LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
              LODOP.ADD_PRINT_IMAGE(300, 250, "14mm", "14mm", "http://172.18.12.250:9000/ammes/jimureport/images/excel1_1758099413052.png");

              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
              LODOP.ADD_PRINT_IMAGE(300, 295, "14mm", "14mm", "http://172.18.12.250:9000/ammes/jimureport/images/excel2_1758099288756.png");

              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
              LODOP.ADD_PRINT_IMAGE(300, 340, "14mm", "14mm", "http://172.18.12.250:9000/ammes/jimureport/images/excel3_1758099297347.png");

              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
              LODOP.ADD_PRINT_IMAGE(300, 375, "14mm", "14mm", "http://172.18.12.250:9000/ammes/jimureport/images/excel4_1758099303191.jpg");
              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);*/

              LODOP.ADD_PRINT_IMAGE(300, 250, 184, 68, "http://172.18.12.250:9000/ammes/jimureport/images/new_logo.png");
              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

              let jsonQc = {
                "id": jsonObject.id,
                "type": "feedback"
              }

              LODOP.ADD_PRINT_BARCODE(248, 435, 140, 140, "QRCode", JSON.stringify(jsonQc));
            } else if (jsonObject.processCode === "AM006") {

              // todo: 基于报工单单位需进行区分 字段 unitOfMeasure
              LODOP.NEWPAGE();
              const scaleFactor = 1.9;

              // 设置线条样式
              LODOP.SET_PRINT_STYLE("LineWidth", 1);
              LODOP.SET_PRINT_STYLE("LineStyle", "0");

              // 添加网络图片
              LODOP.ADD_PRINT_IMAGE(10, 20, "30mm", "30mm", "http://172.18.12.250:9000/ammes/userAvatar_userBlob06310_21a3a05d2092420d8ca8220c1d23f478.");
              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

              LODOP.ADD_PRINT_IMAGE(105, 20, "30mm", "10mm", "http://172.18.12.250:9000/ammes/jimureport/images/aomei_text.png");
              // 设置图片样式为自动缩放
              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

              // 添加标题及标题边框
              // 添加整体边框
              LODOP.ADD_PRINT_RECT(5, 5, 1083,755, 0, 1); // 整体边框


              LODOP.SET_PRINT_STYLE("FontSize", 25);
              LODOP.SET_PRINT_STYLE("FontName", "Microsoft YaHei");
              LODOP.SET_PRINT_STYLE("Bold", 1);
              LODOP.ADD_PRINT_TEXT(13 * scaleFactor, 160 * scaleFactor, 500 * scaleFactor, 30 * scaleFactor, "江苏澳美镭射包装材料有限公司");

              LODOP.SET_PRINT_STYLE("FontSize", 18);
              LODOP.SET_PRINT_STYLE("FontName", "宋体");
              LODOP.ADD_PRINT_TEXT(40 * scaleFactor, 150 * scaleFactor, 500 * scaleFactor, 30 * scaleFactor, "Jiangsu Aomei Laser Packaging Co.,Ltd");

              // 添加合格证标题
              LODOP.SET_PRINT_STYLE("Horient", 0);
              LODOP.SET_PRINT_STYLE("FontSize", 22);
              LODOP.SET_PRINT_STYLE("FontName", "楷体");
              LODOP.SET_PRINT_STYLE("Bold", 1);
              LODOP.ADD_PRINT_TEXT(58 * scaleFactor, 180 * scaleFactor, 200 * scaleFactor, 40 * scaleFactor, "产品合格证");
              LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

              // 定义表格参数
              const rowHeight = 66.5 + (this.certificateFrontForm.codeHide !== true ? 15 : 0);
              const startY = 142.5;
              const leftLabelWidth = 228;
              const leftContentWidth = 532;
              const leftAddLineWidth = 120;

              const rightLabelWidth = 228;
              const rightContentWidth = 532;
              const rightAddLineWidth = 200;

              const leftLabelX = 28.5;
              const leftContentX = 152;
              const leftSubStartX = 50
              const rightLabelX = 712.5;
              const rightContentX = 893;

              const textCentered = 19;

              // 计算左侧栏右边框的X坐标（左侧内容区域结束位置）
              const leftBorderX = leftContentX + leftContentWidth;

              // 第一行：品名和定量  leftLabelX - leftSubStartX
              LODOP.ADD_PRINT_LINE(startY , 5 , startY, rightContentX + rightContentWidth, 0, 1); // 上横线

              // 左侧栏文本右边框
              LODOP.ADD_PRINT_LINE(startY , leftBorderX, startY + rowHeight + hideCodeHeight, leftBorderX, 0, 1);
              // 左侧栏标题右边框
              LODOP.ADD_PRINT_LINE(startY, leftLabelX + leftAddLineWidth, startY + rowHeight + hideCodeHeight, leftLabelX + leftAddLineWidth, 0, 1);
              // 右侧栏右边框
              LODOP.ADD_PRINT_LINE(startY, leftBorderX + rightAddLineWidth, startY + rowHeight + hideCodeHeight, leftBorderX + rightAddLineWidth, 0, 1);

              LODOP.ADD_PRINT_TEXT(startY + textCentered + (hideCodeHeight/3), leftLabelX, leftLabelWidth, rowHeight, "品  名:");
              LODOP.ADD_PRINT_TEXT(startY + (hideCodeHeight/3), leftContentX, leftContentWidth, rowHeight, jsonObject.itemName || "");
              LODOP.ADD_PRINT_TEXT(startY + textCentered + (hideCodeHeight/3), rightLabelX  , rightLabelWidth, rowHeight, "定量(g/m2):");
              LODOP.ADD_PRINT_TEXT(startY + textCentered + (hideCodeHeight/3), rightContentX , rightContentWidth, rowHeight, jsonObject.quantitative || "");

              const row2Y = startY + rowHeight;
              const row3Y = row2Y + rowHeight;
              const row4Y = row3Y + rowHeight;
              const row5Y = row4Y + rowHeight;

              if(jsonObject.unitOfMeasure === "张"){
                // 第二行：宽幅和批号
                LODOP.ADD_PRINT_LINE(row2Y + hideCodeHeight, 5, row2Y + hideCodeHeight, rightContentX + rightContentWidth, 0, 1); // 中间横线
                // 左侧栏文本右边框
                LODOP.ADD_PRINT_LINE(row2Y + hideCodeHeight, leftBorderX, row2Y + rowHeight + hideCodeHeight, leftBorderX, 0, 1); // 竖线
                // 左侧栏标题右边框
                LODOP.ADD_PRINT_LINE(row2Y + hideCodeHeight, leftLabelX + leftAddLineWidth, row2Y + rowHeight+ hideCodeHeight , leftLabelX + leftAddLineWidth, 0, 1); // 竖线
                // 右侧栏右边框
                LODOP.ADD_PRINT_LINE(row2Y + hideCodeHeight, leftBorderX + rightAddLineWidth , row2Y + rowHeight + hideCodeHeight, leftBorderX + rightAddLineWidth, 0, 1); // 竖线

                LODOP.ADD_PRINT_TEXT(row2Y + textCentered  + hideCodeHeight, rightLabelX, rightLabelWidth, rowHeight, "宽 幅 (mm):");
                LODOP.ADD_PRINT_TEXT(row2Y + textCentered  + hideCodeHeight, rightContentX, rightContentWidth, rowHeight, jsonObject.wide || "");
                LODOP.ADD_PRINT_TEXT(row2Y + textCentered  + hideCodeHeight , leftLabelX, leftLabelWidth, rowHeight, "批  号:");
                LODOP.ADD_PRINT_TEXT(row2Y + textCentered  + hideCodeHeight , leftContentX, leftContentWidth, rowHeight, jsonObject.workorderCode + "-" + batchCodeVolumn || "");

                // 第三行：板距和检验
                LODOP.ADD_PRINT_LINE(row3Y  + hideCodeHeight, 5, row3Y  + hideCodeHeight, rightContentX + rightContentWidth, 0, 1); // 中间横线
                // 左侧栏文本右边框
                LODOP.ADD_PRINT_LINE(row3Y, leftBorderX, row3Y + rowHeight + hideCodeHeight, leftBorderX, 0, 1);
                // 左侧栏标题右边框
                LODOP.ADD_PRINT_LINE(row3Y + hideCodeHeight, leftLabelX + leftAddLineWidth, row3Y + rowHeight + hideCodeHeight, leftLabelX + leftAddLineWidth, 0, 1);
                // 右侧栏右边框
                LODOP.ADD_PRINT_LINE(row3Y + hideCodeHeight, leftBorderX + rightAddLineWidth, row3Y + rowHeight + hideCodeHeight, leftBorderX + rightAddLineWidth, 0, 1);

                LODOP.ADD_PRINT_TEXT(row3Y + textCentered  + hideCodeHeight , rightLabelX, rightLabelWidth, rowHeight, "版 距 (mm):");
                LODOP.ADD_PRINT_TEXT(row3Y + textCentered  + hideCodeHeight, rightContentX, rightContentWidth, rowHeight, jsonObject.width || "");
                LODOP.ADD_PRINT_TEXT(row3Y + textCentered  + hideCodeHeight, leftLabelX, leftLabelWidth, rowHeight, "检  验:");
                LODOP.ADD_PRINT_TEXT(row3Y + textCentered  + hideCodeHeight, leftContentX, leftContentWidth, rowHeight, "合 格");

                // 第四行：数量、班组和净重量
                // 第四行区域开头横线
                LODOP.ADD_PRINT_LINE(row4Y + hideCodeHeight, 5, row4Y + hideCodeHeight, rightContentX + rightContentWidth, 0, 1); // 中间横线

                // 右侧标题文本左边框
                LODOP.ADD_PRINT_LINE(row4Y + hideCodeHeight, leftBorderX, row4Y + rowHeight + hideCodeHeight, leftBorderX, 0, 1);

                // 左侧标题文本右边框
                LODOP.ADD_PRINT_LINE(row4Y+ hideCodeHeight, leftLabelX + leftAddLineWidth, row4Y + rowHeight + hideCodeHeight, leftLabelX + leftAddLineWidth, 0, 1);

                // 左侧栏标题左边框2
                LODOP.ADD_PRINT_LINE(row4Y + hideCodeHeight, rightLabelX - 195 * scaleFactor, row4Y + rowHeight + hideCodeHeight, rightLabelX - 195 * scaleFactor , 0, 1);
                // 左侧栏标题右边框2
                LODOP.ADD_PRINT_LINE(row4Y + hideCodeHeight, rightLabelX - 195 * scaleFactor + leftAddLineWidth + 50, row4Y + rowHeight + hideCodeHeight, rightLabelX - 195 * scaleFactor + leftAddLineWidth + 50 , 0, 1);

                // 右侧栏标题文本右边框
                LODOP.ADD_PRINT_LINE(row4Y+ hideCodeHeight, leftBorderX + rightAddLineWidth, row4Y + rowHeight+ hideCodeHeight, leftBorderX + rightAddLineWidth, 0, 1);

                LODOP.ADD_PRINT_TEXT(row4Y + textCentered + hideCodeHeight, rightLabelX, rightLabelWidth, rowHeight, "数 量 (张):");
                LODOP.ADD_PRINT_TEXT(row4Y + textCentered + hideCodeHeight, rightContentX, rightContentWidth, rowHeight, jsonObject.quantityQualified || null);
                LODOP.ADD_PRINT_TEXT(row4Y + textCentered + hideCodeHeight, leftLabelX, leftLabelWidth, rowHeight, "班  组:");
                LODOP.ADD_PRINT_TEXT(row4Y + textCentered + hideCodeHeight, leftContentX, leftContentWidth, rowHeight, jsonObject.shiftCode || null);
                LODOP.ADD_PRINT_TEXT(row4Y + textCentered + hideCodeHeight, rightLabelX - 195 * scaleFactor, rightLabelWidth, rowHeight, "净重量(kg):");
                LODOP.ADD_PRINT_TEXT(row4Y + textCentered + hideCodeHeight, rightContentX - 195 * scaleFactor, rightContentWidth, rowHeight, jsonObject.weight || null);

                // 第五行：日期
                LODOP.ADD_PRINT_LINE(row5Y + hideCodeHeight, 5, row5Y + hideCodeHeight, rightContentX + rightContentWidth , 0, 1); // 中间横线
                // 左侧栏标题右边框
                LODOP.ADD_PRINT_LINE(row5Y + hideCodeHeight, leftLabelX + leftAddLineWidth, row5Y + rowHeight + hideCodeHeight, leftLabelX + leftAddLineWidth, 0, 1);

                const printDate = new Date(jsonObject.printDate || new Date());
                const localTime = printDate.toLocaleString('zh-CN', {
                  hour12: false,
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                });
                LODOP.ADD_PRINT_TEXT(row5Y + textCentered + hideCodeHeight, leftLabelX, leftLabelWidth, rowHeight, "日  期:");
                LODOP.ADD_PRINT_TEXT(row5Y + textCentered + hideCodeHeight, leftContentX, leftContentWidth, rowHeight, localTime);

              }else{

                // 第二行：宽幅和批号
                LODOP.ADD_PRINT_LINE(row2Y  + hideCodeHeight, 5, row2Y  + hideCodeHeight, rightContentX + rightContentWidth, 0, 1); // 中间横线
                // 左侧栏文本右边框
                LODOP.ADD_PRINT_LINE(row2Y + hideCodeHeight, leftBorderX, row2Y + rowHeight + hideCodeHeight, leftBorderX, 0, 1);
                // 左侧栏标题右边框
                LODOP.ADD_PRINT_LINE(row2Y + hideCodeHeight, leftLabelX + leftAddLineWidth, row2Y + rowHeight  + hideCodeHeight, leftLabelX + leftAddLineWidth, 0, 1);
                // 右侧栏右边框
                LODOP.ADD_PRINT_LINE(row2Y + hideCodeHeight, leftBorderX + rightAddLineWidth , row2Y + rowHeight + hideCodeHeight, leftBorderX + rightAddLineWidth, 0, 1);

                LODOP.ADD_PRINT_TEXT(row2Y + textCentered + hideCodeHeight, rightLabelX, rightLabelWidth, rowHeight, "宽 幅 (mm):");
                LODOP.ADD_PRINT_TEXT(row2Y + textCentered + hideCodeHeight, rightContentX, rightContentWidth, rowHeight, jsonObject.wide || "");
                LODOP.ADD_PRINT_TEXT(row2Y + textCentered + hideCodeHeight, leftLabelX, leftLabelWidth, rowHeight, "批  号:");
                LODOP.ADD_PRINT_TEXT(row2Y + textCentered + hideCodeHeight, leftContentX, leftContentWidth, rowHeight, jsonObject.workorderCode + "-" + batchCodeVolumn || "");

                // 第三行：板距和检验
                LODOP.ADD_PRINT_LINE(row3Y + hideCodeHeight, 5, row3Y + hideCodeHeight, rightContentX + rightContentWidth, 0, 1); // 中间横线
                // 左侧栏文本右边框
                LODOP.ADD_PRINT_LINE(row3Y + hideCodeHeight, leftBorderX, row3Y + rowHeight + hideCodeHeight, leftBorderX, 0, 1);
                // 左侧栏标题右边框
                LODOP.ADD_PRINT_LINE(row3Y + hideCodeHeight, leftLabelX + leftAddLineWidth, row3Y + rowHeight  + hideCodeHeight, leftLabelX + leftAddLineWidth, 0, 1);
                // 右侧栏右边框
                LODOP.ADD_PRINT_LINE(row3Y + hideCodeHeight, leftBorderX + rightAddLineWidth, row3Y + rowHeight + hideCodeHeight, leftBorderX + rightAddLineWidth, 0, 1);

                LODOP.ADD_PRINT_TEXT(row3Y + textCentered + hideCodeHeight, rightLabelX, rightLabelWidth, rowHeight, "膜接头:");
                LODOP.ADD_PRINT_TEXT(row3Y + textCentered + hideCodeHeight, rightContentX, rightContentWidth, rowHeight, this.certificateFrontForm.membraneJoint || "/");
                LODOP.ADD_PRINT_TEXT(row3Y + textCentered + hideCodeHeight, leftLabelX  - 18, leftLabelWidth, rowHeight, "数量(米):");
                LODOP.ADD_PRINT_TEXT(row3Y + textCentered + hideCodeHeight, leftContentX, leftContentWidth, rowHeight, jsonObject.quantityQualified || null);

                // 左侧栏标题左边框2
                LODOP.ADD_PRINT_LINE(row3Y + hideCodeHeight, rightLabelX - 195 * scaleFactor, row3Y + rowHeight  + hideCodeHeight, rightLabelX - 195 * scaleFactor , 0, 1);
                // 左侧栏标题右边框2
                LODOP.ADD_PRINT_LINE(row3Y + hideCodeHeight, rightLabelX - 195 * scaleFactor + leftAddLineWidth + 50, row3Y + rowHeight + hideCodeHeight , rightLabelX - 195 * scaleFactor + leftAddLineWidth + 50 , 0, 1);

                LODOP.ADD_PRINT_TEXT(row3Y + textCentered + hideCodeHeight, rightLabelX - 195 * scaleFactor, rightLabelWidth, rowHeight, "检  验:");
                LODOP.ADD_PRINT_TEXT(row3Y + textCentered + hideCodeHeight, rightContentX - 195 * scaleFactor, rightContentWidth, rowHeight, "合 格");

                // 第四行：数量、班组和净重量
                LODOP.ADD_PRINT_LINE(row4Y+ hideCodeHeight, 5, row4Y+ hideCodeHeight, rightContentX + rightContentWidth, 0, 1); // 中间横线
                // 左侧栏文本右边框
                LODOP.ADD_PRINT_LINE(row4Y+ hideCodeHeight, leftBorderX, row4Y + rowHeight+ hideCodeHeight, leftBorderX, 0, 1);
                // 左侧栏标题右边框
                LODOP.ADD_PRINT_LINE(row4Y+ hideCodeHeight, leftLabelX + leftAddLineWidth, row4Y + rowHeight + hideCodeHeight, leftLabelX + leftAddLineWidth, 0, 1);

                // 左侧栏标题左边框2
                LODOP.ADD_PRINT_LINE(row4Y+ hideCodeHeight, rightLabelX - 195 * scaleFactor, row4Y + rowHeight+ hideCodeHeight , rightLabelX - 195 * scaleFactor , 0, 1);
                // 左侧栏标题右边框2
                LODOP.ADD_PRINT_LINE(row4Y+ hideCodeHeight, rightLabelX - 195 * scaleFactor + leftAddLineWidth + 50, row4Y + rowHeight + hideCodeHeight, rightLabelX - 195 * scaleFactor + leftAddLineWidth + 50 , 0, 1);

                // 右侧栏右边框
                LODOP.ADD_PRINT_LINE(row4Y+ hideCodeHeight, leftBorderX + rightAddLineWidth, row4Y + rowHeight + hideCodeHeight, leftBorderX + rightAddLineWidth, 0, 1);

                LODOP.ADD_PRINT_TEXT(row4Y + textCentered+ hideCodeHeight, rightLabelX, rightLabelWidth, rowHeight, "纸接头:");
                LODOP.ADD_PRINT_TEXT(row4Y + textCentered+ hideCodeHeight, rightContentX, rightContentWidth, rowHeight, this.certificateFrontForm.paperJoint || "/");

                LODOP.ADD_PRINT_TEXT(row4Y + textCentered + hideCodeHeight, leftLabelX, leftLabelWidth, rowHeight, "班  组:");
                LODOP.ADD_PRINT_TEXT(row4Y + textCentered+ hideCodeHeight, leftContentX, leftContentWidth, rowHeight, jsonObject.shiftCode || null);

                LODOP.ADD_PRINT_TEXT(row4Y + textCentered+ hideCodeHeight, rightLabelX - 195 * scaleFactor, rightLabelWidth, rowHeight, "净重量(kg):");
                LODOP.ADD_PRINT_TEXT(row4Y + textCentered+ hideCodeHeight, rightContentX - 195 * scaleFactor, rightContentWidth, rowHeight, jsonObject.weight || null);

                // 第五行：日期
                LODOP.ADD_PRINT_LINE(row5Y+ hideCodeHeight, 5, row5Y+ hideCodeHeight, rightContentX + rightContentWidth, 0, 1); // 中间横线
                // 左侧栏标题右边框
                LODOP.ADD_PRINT_LINE(row5Y+ hideCodeHeight, leftLabelX + leftAddLineWidth, row5Y + rowHeight + hideCodeHeight, leftLabelX + leftAddLineWidth, 0, 1);

                const printDate = new Date(jsonObject.printDate || new Date());
                const localTime = printDate.toLocaleString('zh-CN', {
                  hour12: false,
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                });
                LODOP.ADD_PRINT_TEXT(row5Y + textCentered+ hideCodeHeight, leftLabelX, leftLabelWidth, rowHeight, "日  期:");
                LODOP.ADD_PRINT_TEXT(row5Y + textCentered+ hideCodeHeight, leftContentX, leftContentWidth, rowHeight, localTime);

                // 左侧栏标题右边框2
                LODOP.ADD_PRINT_LINE(row5Y+ hideCodeHeight, rightLabelX - 195 * scaleFactor + leftAddLineWidth + 50, row5Y + rowHeight + hideCodeHeight, rightLabelX - 195 * scaleFactor + leftAddLineWidth + 50 , 0, 1);

                // 左侧栏文本右边框
                LODOP.ADD_PRINT_LINE(row5Y+ hideCodeHeight, leftBorderX - 65, row5Y + rowHeight+ hideCodeHeight, leftBorderX - 65, 0, 1);
                LODOP.ADD_PRINT_TEXT(row5Y + textCentered+ hideCodeHeight, rightContentX - 195 * scaleFactor, rightContentWidth, rowHeight, "备 注:");
                LODOP.ADD_PRINT_IMAGE(row5Y+ hideCodeHeight, rightLabelX - 65, 297, 75, "http://172.18.12.250:9000/ammes/jimureport/images/paper_output.png");

                LODOP.ADD_PRINT_TEXT(row5Y + textCentered + hideCodeHeight, rightContentX + 70 , rightContentWidth, rowHeight, "出纸方向");
              }


              // 底部横线
              const bottomY = row5Y + rowHeight;

              // 左侧栏右边框延伸到表格底部
              // 不知干嘛 先观察
              //  LODOP.ADD_PRINT_LINE(bottomY, leftBorderX, bottomY, leftBorderX, 0, 1);


              if(this.certificateFrontForm.codeHide === true){
                // 左侧栏文本右边框
                LODOP.ADD_PRINT_LINE(bottomY, leftLabelX + leftAddLineWidth, bottomY + rowHeight * 1.8, leftLabelX + leftAddLineWidth, 0, 1);
                // 条形码上方横线, 若隐藏条形码, 则注释
                LODOP.ADD_PRINT_LINE(bottomY, 5, bottomY, rightContentX + rightContentWidth, 0, 1);
                // 条形码标签
                LODOP.ADD_PRINT_TEXT(bottomY + 45, leftLabelX, leftLabelWidth, rowHeight, "条形码:");
              }



              // 公司地址
              // LODOP.ADD_PRINT_TEXT(bottomY + 85 * 1.9 + textCentered, leftLabelX, 280 * 1.9, rowHeight, "公司地址: 江苏省扬州市宝应县低碳产业园C区1号");
              if(this.certificateFrontForm.codeHide === true){
                LODOP.ADD_PRINT_TEXT(bottomY + 85 * 1.9 + textCentered, leftLabelX, 280 * 1.9, rowHeight, "公司地址: 江苏省扬州市宝应县低碳产业园C区1号");
              }else{
                LODOP.ADD_PRINT_TEXT(bottomY + textCentered + hideCodeHeight + 30 , leftLabelX, 280 * 1.9, rowHeight, "公司地址: 江苏省扬州市宝应县低碳产业园C区1号");
              }

              // 二维码和图标区域
              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
              // 条形码行高: 119.7 平均分给5行 约等于24
              // 图片上方横线
              if(this.certificateFrontForm.codeHide === true){
                LODOP.ADD_PRINT_LINE(bottomY + rowHeight * 1.8, 5, bottomY + rowHeight * 1.8, rightContentX + rightContentWidth, 0, 1);
              }else{
                LODOP.ADD_PRINT_LINE(bottomY + hideCodeHeight, 5, bottomY + hideCodeHeight , rightContentX + rightContentWidth, 0, 1);
              }
              //

              // 为图标区域添加边框
              const iconAreaY = 317 * scaleFactor;
              const iconAreaHeight = 156;

              LODOP.ADD_PRINT_IMAGE(iconAreaY, 300 * scaleFactor - 50, 410, 154, "http://172.18.12.250:9000/ammes/jimureport/images/new_logo.png");
              LODOP.SET_PRINT_STYLEA(0,"Stretch",1);

              // 二维码 - 等比例放大
              let jsonQc = {
                "id": jsonObject.id,
                "type": "feedback",
                "processCode": "AM006"
              }

              // 二维码
              LODOP.ADD_PRINT_BARCODE(iconAreaY, 490 * scaleFactor, 156, iconAreaHeight, "QRCode", JSON.stringify(jsonQc));
            }
          }

          LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1);
          LODOP.PREVIEW();
        }
        this.cancel();
        this.getList();
      } finally {
        this.loading = false;
      }
    },
    handleDefectSelectionChange(selection) {
      this.selectedDefects = selection;
    },

    // 打开机长自检对话框
    handleDefectDialogOpen() {
      this.defectDialogVisible = true;
    },

    // 保存缺陷数据并更新不合格数量
    saveDefects() {
      // 循环processDefectList, 判定defectMeter不能为空
      for (let i = 0; i < this.processDefectList.length; i++) {
        if (!this.processDefectList[i].defectMeter) {
          this.$message.error('第' + (i + 1) + '行缺陷米数不能为空');
          return;
        }
      }

      // 计算所有缺陷项的缺陷米数总和
      const totalDefectMeter = this.processDefectList.reduce((sum, defect) => {
        return sum + (parseFloat(defect.defectMeter) || 0);
      }, 0);

      // 更新不合格数量
      this.form.quantityUnquanlified = totalDefectMeter;

      // 同时更新报工总数（合格数 + 不良数 + 损耗数）
      this.form.quantityFeedback = (this.form.quantityQualified || 0) +
        totalDefectMeter +
        (this.form.quantityExcess || 0);

      // 关闭对话框
      this.defectDialogVisible = false;

      this.$message.success('机长自检数据已保存');
    },
    // 缺陷米数变更处理
    handleDefectMeterChange(index, value) {
      // 计算所有缺陷项的缺陷米数总和
      const totalDefectMeter = this.processDefectList.reduce((sum, defect) => {
        return sum + (parseFloat(defect.defectMeter) || 0);
      }, 0);

      // 更新不良品数量
      this.form.quantityUnquanlified = totalDefectMeter;

      // 同时更新报工总数（合格数 + 不良数 + 损耗数）
      this.form.quantityFeedback = (this.form.quantityQualified || 0) +
        totalDefectMeter +
        (this.form.quantityExcess || 0);
    },

    changeMergeStatus() {
      if (this.selectedRows.length < 1) {
        this.$message.error('请至少选择一行数据进行操作');
        return;
      }
      const selectedRow = this.selectedRows;
      const ids = selectedRow.map(item => item.id);
      this.$modal.confirm('确认变更合并状态？').then(() => {
        this.loading = true;
        updateMergeStatus(ids).then(response => {
          this.$modal.msgSuccess("合并状态变更成功!");
          this.getList();
        }).finally(() => {
          this.loading = false;
        });
      });
    },

    activated() {
      // 当从缓存中重新激活组件时，可以在此更新数据
      this.getList();
    },
    handleTabClick(tab) {
      const form = this.$refs.certificateForm;
      if (tab.name === 'otherQualified') {
        // 保存原始验证规则
        this.originalRules = this.certificateRules;
        // 清空验证规则
        this.certificateRules = {};
      } else {
        // 恢复原始验证规则
        if (this.originalRules) {
          this.certificateRules = this.originalRules;
        }
      }
    },
    handleMergeFeedbackCodeChange(val){
        const row = this.mergeFeedbackOptions.find(item => item.workorderCode === val);
        this.mergeForm = row;
    },
    handleRemark(row){
      if (this.selectedRows.length < 1) {
        this.$message.error('请至少选择一行数据进行操作');
        return;
      }
      this.reset();
      const recordId = row.id || this.ids;
      getFeedback(recordId).then(response => {
        this.remarkForm = response.data;
      });
      this.remarkDialogVisible = true;
    },
    updateRemark(){
        // 根据数据开始修改
        updateFeedbackRemark(this.remarkForm).then(response => {
          this.$message.msgSuccess("修改备注成功!")
        });
        this.cancel();
        this.getList();
    },


  },

  watch: {
    cachedProcessCode(newVal) {
      this.queryParams.processCode = newVal;
      // this.auditQueryParams.processCode = newVal;
      this.getList();
    }
    ,
    'form.machineryCode'(newVal) {
      if (newVal && this.form.iotFlag && (this.optType === 'add')) {
        this.initialized = false;
        this.fetchIotData();
      }
    },
  }
}
;
</script>


<style>
.el-table .warning-row {
  background: #F8EBE9;
}

.audit-detail-container {
  margin-bottom: 20px;
}

.audit-bottom-container {
  padding-top: 10px;
  display: flex;
  gap: 20px;
}

.audit-summary {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
}

.audit-team {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
}

</style>
