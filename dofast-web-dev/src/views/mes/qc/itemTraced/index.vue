<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">

      <el-form-item label="生产工单" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入工单编号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="任务编号" prop="taskCode">
        <el-input v-model="queryParams.taskCode" placeholder="请输入任务编号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="批次号" prop="batchCode">
        <el-input v-model="queryParams.batchCode" placeholder="请输入批次号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="采购来源" name="first">
        <el-table v-loading="loading" :data="purchaseGoodsList" ref="multipleTable">
          <el-table-column label="单据编码" align="center" prop="id"/>
          <el-table-column :show-overflow-tooltip="true" label="采购单号" align="center" prop="poNo"/>
          <el-table-column label="商品编号" align="center" prop="goodsNumber"/>
          <el-table-column :show-overflow-tooltip="true" label="商品名称" align="center" prop="goodsName"/>
          <el-table-column :show-overflow-tooltip="true" label="商品规格" align="center" prop="goodsSpecs"/>
          <el-table-column label="供应商编号" width=120 align="center" prop="vendorCode"/>
          <el-table-column label="供应商名称" width=120 align="center" prop="vendorName"/>
          <el-table-column label="采购数量" align="center" prop="quantity"/>
          <el-table-column label="收货数量" align="center" prop="receiveNum"/>
          <el-table-column label="已拆数量" align="center" prop="receivedNum"/>
          <el-table-column label="单位" align="center" prop="company"/>
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="入库状态" prop="status" width="80">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.purchase_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="purchaseGoodsTotal > 0" :total="purchaseGoodsTotal" :page.sync="purchaseGoodsQueryParams.pageNo" :limit.sync="purchaseGoodsQueryParams.pageSize" @pagination="getPurchaseGoodsList"/>

      </el-tab-pane>
      <el-tab-pane label="工单信息" name="second">
        <el-table v-loading="loading" :data="workorderList" row-key="id" default-expand-all
                  :tree-props="{ children: 'workorderDOList' }" @selection-change="handleSelectionChange" ref="multipleTable" @row-click="handleRowClick">
          <el-table-column align="center" label="工单编码" width="180" prop="workorderCode">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleWorkorderView(scope.row)" v-hasPermi="['pro:workorder:query']">
                {{ scope.row.workorderCode }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="工单名称" width="200" align="center" prop="workorderName" :show-overflow-tooltip="true"/>
          <el-table-column label="工单来源" align="center" prop="orderSource">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.mes_workorder_sourcetype" :value="scope.row.orderSource"/>
            </template>
          </el-table-column>
          <el-table-column label="产品编号" width="120" align="center" prop="productCode"/>
          <el-table-column label="产品名称" width="200" align="center" prop="productName" :show-overflow-tooltip="true"/>
          <el-table-column label="规格型号" align="center" prop="productSpc" :show-overflow-tooltip="true"/>
          <el-table-column label="单位" align="center" prop="unitOfMeasure"/>
          <el-table-column label="工单数量" align="center" prop="quantity"/>
          <el-table-column label="调整数量" align="center" prop="quantityChanged"/>
          <el-table-column label="已生产数量" align="center" width="100px" prop="quantityProduced"/>
          <el-table-column label="客户编码" align="center" prop="clientCode"/>
          <el-table-column label="客户名称" align="center" prop="clientName" :show-overflow-tooltip="true"/>
          <el-table-column label="需求日期" align="center" prop="requestDate" width="180" fixed="right">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.requestDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单据状态" align="center" prop="status" fixed="right">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="workorderTotal > 0" :total="workorderTotal" :page.sync="workorderQueryParams.pageNo" :limit.sync="workorderQueryParams.pageSize"
                    @pagination="getWorkorderList"/>
      </el-tab-pane>
      <el-tab-pane label="调拨详情" name="third">
        <el-table v-loading="loading" :data="allocatedList">
          <el-table-column label="调拨单编号" align="center" prop="allocatedCode">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleAllocatedShow(scope.row)" v-hasPermi="['wms:allocated-header:allocated']">
                {{ scope.row.allocatedCode }}
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="调拨单名称" align="center" prop="allocatedName"/>
          <el-table-column label="调拨日期" align="center" prop="allocatedDate" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.allocatedDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单据状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_allocated_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="allocatedTotal > 0" :total="allocatedTotal" :page.sync="allocatedQueryParams.pageNo" :limit.sync="allocatedQueryParams.pageSize"/>

      </el-tab-pane>
      <el-tab-pane label="领料记录" name="fourth">
        <el-table v-loading="loading" :data="issueheaderList">
          <el-table-column label="领料单编号" align="center" width="150px" prop="issueCode">
            <template slot-scope="scope">
              <el-button type="text" @click="handleIssueView(scope.row)" v-hasPermi="['wms:issue-header:query']">
                {{ scope.row.issueCode }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column disabled label="领料单名称" align="center" prop="issueName" :show-overflow-tooltip="true"/>
          <el-table-column label="生产工单" align="center" prop="workorderCode"/>
          <el-table-column label="生产工序" align="center" prop="processName"/>
          <el-table-column label="生产任务" align="center" prop="taskCode"/>
          <el-table-column label="领料日期" align="center" prop="issueDate" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.issueDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单据状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="issueHeaderTotal > 0" :total="issueHeaderTotal" :page.sync="issueHeaderQueryParams.pageNo" :limit.sync="issueHeaderQueryParams.pageSize" @pagination="getIssueHeaderList"/>
      </el-tab-pane>

      <el-tab-pane label="报工记录" name="fifth"> <!-- :row-class-name="tableRowClassName" -->
        <el-table  v-loading="loading" :data="feedbackList"  ref="multipleTable" >
          <el-table-column label="报工单号" align="center" width="210px" prop="feedbackCode">
            <template slot-scope="scope">
              <el-button type="text" @click="handleFeedbackView(scope.row)" v-hasPermi="['pro:feedback:query']">
                {{ scope.row.feedbackCode }}
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="报工类型" align="center" prop="feedbackType">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.mes_feedback_type" :value="scope.row.feedbackType"/>
          </template>
          </el-table-column>
          <el-table-column label="工作站" width="180px" align="center" prop="workstationName"/>
          <el-table-column label="生产工单编号" width="150px" align="center" prop="workorderCode"/>
          <el-table-column label="产品物料编码" width="120px" align="center" prop="itemCode"/>
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
          <el-table-column width="130"  label="ERP报工状态" align="center" prop="erpFeedbackStatus">
            <template v-slot="scope">
              <span v-if="scope.row.erpFeedbackStatus === 'N'">未同步</span>
              <span v-else>已同步</span>
            </template>
          </el-table-column>
          <el-table-column width="130"  label="ERP入库状态" align="center" prop="erpWarehousingStatus">
            <template v-slot="scope">
              <span v-if="scope.row.erpWarehousingStatus === 'N'">未同步</span>
              <span v-else>已同步</span>
            </template>
          </el-table-column>

          <el-table-column width="150" label="来源单号" :show-overflow-tooltip="true" align="center" prop="originCode"/>

          <el-table-column width="150" fixed="right" label="批次号" align="center" prop="batchCode"/>

        </el-table>
        <pagination v-show="feedbackTotal > 0" :total="feedbackTotal" :page.sync="feedbackQueryParams.pageNo" :limit.sync="feedbackQueryParams.pageSize"
                    @pagination="getFeedbackList"/>

      </el-tab-pane>
    </el-tabs>

    <!--  工单详情页面  -->
    <el-dialog :title="title" :visible.sync="workorderOpen" width="65%" append-to-body>
      <el-form ref="workorderForm" :model="workorderForm" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="工单编号" prop="workorderCode">
              <el-input disabled v-model="workorderForm.workorderCode" placeholder="请输入工单编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单名称" prop="workorderName">
              <el-input disabled v-model="workorderForm.workorderName" placeholder="请输入工单名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="生产方" prop="isOut">
              <el-radio-group v-model="workorderForm.isOut">
                <el-radio :key="false" :label="false">自产</el-radio>
                <el-radio :key="true" :label="true">委外</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源类型" prop="orderSource">
              <el-select disabled v-model="workorderForm.orderSource" placeholder="请选择来源类型">
                <el-option v-for="dict in dict.type.mes_workorder_sourcetype" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="workorderForm.orderSource == '2'">
            <el-form-item label="订单编号" prop="sourceCode">
              <el-input disabled v-model="workorderForm.sourceCode" placeholder="请输入订单编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select disabled v-model="workorderForm.status" placeholder="请选择单据状态">
                <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="工艺版本" prop="status">
              <el-select disabled v-model="workorderForm.routeCode" placeholder="请选择工艺版本">
                <el-option
                  v-for="item in workorderForm.routeList"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品编号" prop="productCode">
              <el-input v-model="workorderForm.productCode" placeholder="请选择产品">
                <el-button disabled slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" prop="productName">
              <el-input disabled v-model="workorderForm.productName" placeholder="请选择产品"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="productSpc">
              <el-input disabled v-model="workorderForm.productSpc" placeholder="请输入规格"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input disabled v-model="workorderForm.unitOfMeasure" placeholder="请选择产品"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="工单数量" prop="quantity">
              <el-input-number disabled :min="1" v-model="workorderForm.quantity" placeholder="请输入生产数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求日期" prop="requestDate">
              <el-date-picker disabled clearable v-model="workorderForm.requestDate" type="date" value-format="timestamp"
                              placeholder="请选择需求日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批次号" prop="batchCode">
              <el-input disabled v-model="workorderForm.batchCode" placeholder="请输入批次号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="workorderForm.orderSource == '2'">
          <el-col :span="12">
            <el-form-item label="客户编码" prop="clientCode">
              <el-input v-model="workorderForm.clientCode" placeholder="请输入客户编码">
                <el-button disabled slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="clientName">
              <el-input v-model="workorderForm.clientName" readonly="readonly" placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>
          <el-col></el-col>
        </el-row>
        <el-row>
          <el-col></el-col>
          <el-col></el-col>
          <el-col></el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="workorderForm.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="adjuncts">
              <file-upload :isShowTips="true" v-model="workorderForm.adjuncts" :limit="20" :file-size="100"></file-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tabs type="border-card" v-if="workorderForm.id != null">
        <el-tab-pane label="BOM组成">
          <Workorderbom ref="bomlist" :workorder="workorderForm"></Workorderbom>
        </el-tab-pane>

        <el-tab-pane label="快捷排产" v-if="workorderForm.status == 'CONFIRMED'">
          <el-steps :active="activeProcess" v-if="workorderForm.id != null" align-center simple>
            <el-step v-for="(item, index) in processOptions" :key="index" :title="item.processName"
                     @click.native="handleStepClick(index)"></el-step>
          </el-steps>
          <template v-for="(item, index) in processOptions">
            <el-card :key="index" v-if="activeProcess == index">
              <ProTask :workorderId="workorderForm.id" :workorderName="workorderForm.workorderName" :workorderCode="workorderForm.workorderCode" :processId="item.processId" :colorCode="item.colorCode" :optType="optType" :initQuantity="workorderForm.quantity">
              </ProTask>
            </el-card>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">返  回</el-button>
      </div>
    </el-dialog>

    <!--  调拨单详情页面  -->
    <el-dialog :title="title" :visible.sync="allocatedOpen" width="65%" v-dialogDrag append-to-body>
      <el-form ref="executeForm" :model="executeForm" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨单编号" prop="allocatedCode">
              <el-input disabled v-model="executeForm.allocatedCode" placeholder="请输入调拨单编号"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="调拨单名称" prop="allocatedName">
              <el-input disabled v-model="executeForm.allocatedName" placeholder="请输入调拨单名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨日期" prop="allocatedDate">
              <el-date-picker disabled clearable v-model="executeForm.allocatedDate" type="date" value-format="timestamp" placeholder="选择调拨日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料仓库">
              <el-cascader disabled v-model="allocatedWarehouseInfo" :options="allocatedWarehouseOptions" :props="allocatedWarehouseProps" ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select disabled v-model="executeForm.status">
                <el-option v-for="dict in dict.type.wms_allocated_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="executeForm.bindWorkorder">
          <el-col :span="8">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input disabled v-model="executeForm.workorderCode" placeholder="请选择生产工单">
                <el-button disabled slot="append" icon="el-icon-search" @click="handleWorkorderSelect"></el-button>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="生产任务" prop="taskCode">
              <el-input disabled v-model="executeForm.taskCode" placeholder="请选择生产任务">
                <el-button disabled slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="客户编号">
              <el-input disabled v-model="executeForm.clientCode" placeholder="请选择生产工单"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input disabled v-model="executeForm.remark" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider v-if="executeForm.bindWorkorder" content-position="center">BOM信息</el-divider>
        <!-- 物料信息列表，隐藏单选框 -->
        <el-table v-if="executeForm.bindWorkorder" max-height="200" :data="bomList" style="width: 100%">
          <el-table-column width="220" label="物料编码" align="center" prop="itemCode"/>
          <el-table-column width="220" label="物料名称" :show-overflow-tooltip="true" align="center" prop="itemName"/>
          <el-table-column width="220" label="需求数量" align="center" prop="quantityAllocated"/>
          <el-table-column width="210" label="单位" align="center" prop="unitOfMeasure"/>
        </el-table>

        <el-divider content-position="center">调拨信息</el-divider>
        <el-table v-loading="loading" :data="allocatedDetailList" >
          <el-table-column v-if="executeForm.status != 'FINISHED'" type="selection" width="55" align="center"/>
          <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column width="150" label="物料编码" align="center" prop="itemCode"/>
          <el-table-column width="150" label="物料名称" :show-overflow-tooltip="true" align="center" prop="itemName"/>
          <el-table-column width="100" label="调拨数量" align="center" prop="quantityAllocated"/>
          <el-table-column width="100" label="单位" align="center" prop="unitOfMeasure"/>
          <el-table-column width="100" label="批次号" align="center" prop="batchCode"/>
          <el-table-column width="100" label="调拨标识" align="center" prop="allocatedFlag"/>
          <el-table-column width="100" label="仓库名称" align="center" prop="warehouseName"/>
          <el-table-column width="130" label="库区名称" align="center" prop="locationName"/>
          <el-table-column width="100" label="库位名称" align="center" prop="areaName"/>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">返  回</el-button>
      </span>
    </el-dialog>

    <!--  领料单详情页面  -->
    <el-dialog :title="title" :visible.sync="issueHeaderOpen" width="65%" append-to-body>
      <el-form ref="issueHeaderForm" :model="issueHeaderForm" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="领料单编号" prop="issueCode">
              <el-input v-model="issueHeaderForm.issueCode" placeholder="请输入领料单编号" :disabled="optType !== 'add'"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="12">
            <el-form-item label="领料单名称" prop="issueName">
              <el-input v-model="issueHeaderForm.issueName" placeholder="请输入领料单名称" :disabled="optType !== 'add'"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="领料日期" prop="issueDate">
              <el-date-picker clearable v-model="issueHeaderForm.issueDate" type="date" value-format="timestamp" placeholder="请选择领料日期" :disabled="optType !== 'add'"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="领料仓库">
              <el-cascader
                disabled
                v-model="issueHeaderWarehouseInfo"
                :options="issueHeaderWarehouseOptions"
                :props="issueHeaderWarehouseProps"
                placeholder="请选择"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select v-model="issueHeaderForm.status" disabled>
                <el-option disabled v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input disabled v-model="issueHeaderForm.workorderCode" placeholder="请选择生产工单">
                <el-button disabled slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户编号">
              <el-input disabled v-model="issueHeaderForm.clientCode" placeholder="请选择生产工单" :disabled="optType !== 'add'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <el-input disabled v-model="issueHeaderForm.clientName" placeholder="请选择生产工单" :disabled="optType !== 'add'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="任务信息" prop="taskCode">
              <el-input disabled v-model="issueHeaderForm.taskCode" placeholder="请选择任务信息" disabled>
                <el-button disabled slot="append" icon="el-icon-search" ></el-button>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="工作站" prop="workstationName">
              <el-input disabled v-model="issueHeaderForm.workstationName" placeholder="请选择工作站" disabled>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input disabled v-model="issueHeaderForm.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider v-if="issueHeaderForm.id != null" content-position="center">物料信息</el-divider>
      <el-card shadow="always" v-if="issueHeaderForm.id != null" class="box-card">
        <Issueline ref="line" :issueId="issueHeaderForm.id" :warehouseId="issueHeaderForm.warehouseId" :locationId="issueHeaderForm.locationId" :areaId="issueHeaderForm.areaId" :optType="optType"></Issueline>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" >返  回</el-button>
      </div>
    </el-dialog>

    <!--  报工单详情  -->
    <el-dialog :title="title" :visible.sync="feedbackOpen" width="65%" append-to-body>
      <el-form ref="feedbackForm" :model="feedbackForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="报工类型" prop="feedbackType">
              <el-select disabled v-model="feedbackForm.feedbackType" placeholder="请选择报工类型">
                <el-option v-for="dict in dict.type.mes_feedback_type" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input disabled v-model="feedbackForm.workorderCode" placeholder="请选择生产工单">
                <el-button disabled slot="append" icon="el-icon-search" ></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产任务" prop="taskCode">
              <el-input disabled v-model="feedbackForm.taskCode" placeholder="请选择生产任务">
                <el-button disabled slot="append" icon="el-icon-search" @click="handleTaskSelect"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品编码" prop="itemCode">
              <el-input v-model="feedbackForm.itemCode" readonly="readonly"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称" prop="itemName">
              <el-input v-model="feedbackForm.itemName" readonly="readonly"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input v-model="feedbackForm.unitOfMeasure" readonly="readonly"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="规格型号" prop="specification">
              <el-input v-model="feedbackForm.specification" type="textarea" readonly="readonly"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="报工数量" prop="quantityFeedback">
              <el-input readonly="readonly" v-model="feedbackForm.quantityFeedback"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合格品数量" prop="quantityQualified">
              <el-input-number disabled :min="0" v-model="feedbackForm.quantityQualified"
                               placeholder="请输入合格品数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不良品数量" prop="quantityUnquanlified">
              <el-input-number disabled :min="0" v-model="feedbackForm.quantityUnquanlified"
                               placeholder="请输入不良品数量"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="8">
            <el-form-item label="报工班组" prop="teamCode">
              <el-input v-model="feedbackForm.teamCode" disabled placeholder="请输入报工班组"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="班组负责人" prop="principalName">
              <el-input v-model="feedbackForm.principalName" placeholder="请选择班组负责人" disabled>
                <el-button disabled="" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="报工时间" prop="feedbackTime">
              <el-date-picker disabled="" style="width: 100%" clearable v-model="feedbackForm.feedbackTime" type="date" value-format="timestamp"
                              placeholder="请选择报工时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="8">
            <el-form-item label="班次信息" prop="shiftInfo">
              <el-select disabled v-model="feedbackForm.shiftInfo" placeholder="请选择班次信息">
                <el-option  v-for="dict in dict.type.mes_shift_info" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="设备信息" prop="machineryName">
              <el-input disabled v-model="feedbackForm.machineryName" placeholder="请选择设备信息" disabled>
                <el-button disabled slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="任务状态" prop="taskStatus" >
              <el-radio-group disabled="" v-model="feedbackForm.taskStatus">
                <el-radio label="STARTED" >已开工</el-radio>
                <el-radio label="FINISHED" >已完工</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="合并需求" prop="mergeStatus">
              <el-select disabled v-model="feedbackForm.mergeStatus" placeholder="请选择合并需求">
                <el-option disabled v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="班组成员信息" name="1">
            <el-card class="box-card">
              <el-table :data="teamMembers" style="width: 100%">
                <el-table-column prop="id" label="成员ID" width="180"/>
                <el-table-column prop="nickname" label="成员昵称" width="180"/>
                <el-table-column prop="username" label="成员名称" width="180"/>
                <el-table-column label="岗位">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.postIds" multiple placeholder="请选择岗位">
                      <el-option
                        v-for="item in postOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" >返  回</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {listFeedback, getFeedback, initWarehouse, traceFeedbackPage} from '@/api/mes/pro/feedback';
import WorkorderSelect from '@/components/workorderSelect/single.vue';
import WorkstationSelect from '@/components/workstationSelect/simpletableSingle.vue';
import UserSingleSelect from '@/components/userSelect/single.vue';
import ProtaskSelect from '@/components/TaskSelect/taskSelectSingle.vue';
import {getTreeList} from '@/api/mes/wm/warehouse';
import {getByTeamCodeAndShiftInfo, getTeammemberByTeamCode} from '@/api/mes/cal/teammember';
import '@/utils/CLodopfuncs2.js';
import {getQcdefectByCode} from '@/api/mes/qc/qcdefect';
import {listProcess} from "@/api/mes/pro/process";
import {getQcindexByProcessCode} from '@/api/mes/qc/qcindex';
import MachinerySelectSingle from "@/components/machinerySelect/single.vue";

import {getWorkorder, listWorkorder , traceWorkorderPage} from "@/api/mes/pro/workorder";
import {traceGoodsPage } from "@/api/purchase/goods";
import {getRouteCodeByItemCode} from "@/api/mes/pro/proroute";
import ClientSelect from "@/components/clientSelect/single.vue";
import FileUpload from "@/components/FileUpload/index3.vue";
import ProTask from "@/views/mes/pro/schedule/proTask.vue";
import Workorderbom from "@/views/mes/pro/workorder/bom/bom.vue";
import ItemSelect from "@/components/itemSelect/single.vue";
import {listProductprocess} from '@/api/mes/pro/routeprocess';
import {getAllocatedHeader, getAllocatedHeaderPage , traceAllocatedPage} from "@/api/wms/allocatedHeader";
import {getAllocatedRecordByHeaderId} from "@/api/wms/allocatedRecord";
import StockSelect from "@/components/stockSelect/multi.vue";
import {getIssueheader, listIssueheader, traceIssueHeaderPage} from "@/api/mes/wm/issueheader";
import Issueline from "@/views/mes/wm/issue/line.vue";
import {listSimplePosts} from "@/api/system/post";


export default {
  name: 'itemTraced',
  components: {StockSelect, ItemSelect, Workorderbom, ProTask, FileUpload, ClientSelect, MachinerySelectSingle, WorkorderSelect, WorkstationSelect, UserSingleSelect, ProtaskSelect, Issueline},
  dicts: ['mes_order_status', 'mes_feedback_type', 'mes_shift_info', 'mes_pro_task_status', 'sys_yes_no', 'mes_order_status', 'mes_workorder_sourcetype', 'purchase_status', 'wms_allocated_status'],
  data() {
    return {
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
      purchaseGoodsTotal: 0,
      workorderTotal: 0,
      allocatedTotal: 0,
      issueHeaderTotal: 0,
      feedbackTotal: 0,

      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      workorderOpen: false,
      allocatedOpen: false,
      issueHeaderOpen: false,
      feedbackOpen:false,

      // 入库弹出层
      wareOpen: false,

      // 查询参数
      queryParams: {

        workorderCode: null,
        taskCode: null,
        batchCode: null,
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
      purchaseGoodsQueryParams: {
        pageNo: 1,
        pageSize: 10,
        purchaseId: null,
        goodsNumber: null,
        goodsName: null,
        goodsSpecs: null,
        company: null,
        monovalent: null,
        quantity: null,
        taxes: null,
        total: null,
        categoryName: null,
        brandName: null,
        createTime: [],
      },
      workorderQueryParams: {
        pageNo: 1,
        pageSize: 10,
        workorderCode: null,
        workorderName: null,
        orderSource: null,
        sourceCode: null,
        productId: null,
        productCode: null,
        productName: null,
        productSpc: null,
        unitOfMeasure: null,
        quantity: null,
        quantityProduced: null,
        quantityChanged: null,
        quantityScheduled: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        requestDate: null,
        parentId: null,
        ancestors: null,
        status: null,
        isOut: null,
      },
      allocatedQueryParams: {
        pageNo: 1,
        pageSize: 10,
        allocatedCode: null,
        allocatedName: null,
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        workorderId: null,
        workorderCode: null,
        taskId: null,
        taskCode: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        clientNick: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        allocatedDate: [],
        status: null,
        remark: null,
        createTime: [],
        bindWorkorder: null,
      },
      issueHeaderQueryParams: {
        pageNo: 1,
        pageSize: 10,
        issueCode: null,
        issueName: null,
        workstationId: null,
        workstationCode: null,
        workorderId: null,
        workorderCode: null,
        taskId: null,
        taskCode: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        issueDate: null,
        status: null,
      },
      feedbackQueryParams: {
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


      // 列表信息
      purchaseGoodsList: [],
      workorderList: [],
      allocatedList: [], // 存储调拨信息
      allocatedDetailList:[],
      issueheaderList: [],
      feedbackList: [],

      // 表单参数
      form: {},
      workorderForm: {},
      executeForm: {},
      issueHeaderForm: {},
      feedbackForm: {},

      // 表单校验
      rules: {},
      // 仓库数据

      allocatedWarehouseInfo: [],
      allocatedWarehouseOptions: [],
      allocatedWarehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
      },

      issueHeaderWarehouseInfo: [],
      issueHeaderWarehouseOptions: [],
      issueHeaderWarehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
      },

      selectedRows: [], // 选中行数据
      activeName: 'first',
      activeProcess: 0,
      processOptions: [],
      optType: 'view',
      teamMembers: [],
      processDefectList: [],
      postOptions: [],

    };
  },
  created() {
    this.getPurchaseGoodsList();
  },
  methods: {


    // 取消按钮
    cancel() {
      this.open = false;
      this.workorderOpen = false;
      this.allocatedOpen = false;
      this.issueHeaderOpen = false;
      this.feedbackOpen = false;

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
      this.workorderForm = {
        id: null,
        workorderCode: null,
        workorderName: null,
        orderSource: null,
        sourceCode: null,
        productId: null,
        productCode: null,
        productName: null,
        productSpc: null,
        unitOfMeasure: null,
        quantity: null,
        quantityProduced: null,
        quantityChanged: null,
        quantityScheduled: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        requestDate: null,
        parentId: null,
        status: 'PREPARE',
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        adjuncts: '',
        isOut: false,
      };
      this.executeForm= {};
      this.issueHeaderForm = {};
      this.feedbackForm =  {
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

    /** 搜索按钮操作 */
    handleQuery() {
      // 查看当前选中页, 调用不同的列表
      if (this.activeName === 'first') {
        this.queryParams.pageNo = 1;
        this.getPurchaseGoodsList();
      } else if (this.activeName === 'second') {
        this.queryParams.pageNo = 1;
        this.getWorkorderList();
      } else if (this.activeName === 'third') {
        this.queryParams.pageNo = 1;
        this.getAllocatedList();
      } else if (this.activeName === 'fourth') {
        this.queryParams.pageNo = 1;
        this.getIssueHeaderList();
      } else if (this.activeName === 'fifth') {
        this.queryParams.pageNo = 1
        this.getFeedbackList();
      }
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
      this.form.feedbackType = "UNI"; // 默认选中
      this.form.taskStatus = "STARTED"; //默认选择已开工
      this.form.mergeStatus = "N"; // 默认没有合并需求
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
        console.log("获取的表单信息: ", this.form.memberList);
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
        console.log("this.wareHouse", this.wareHouse);
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
        console.log("this.wareHouse", this.wareHouse);
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

        if (!this.form.taskStatus) {
          this.$message.error(`请选择当前任务单状态!`);
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
              this.loading = false;
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
              this.loading = false;
              this.getList();
            });
          }
        }
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
      if (this.form.processCode === 'AM005') {
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
        const now = new Date();
        const hour = now.getHours();
        const time = hour >= 7 && hour < 19 ? '0' : '1';
        if (!this.form.shiftInfo) this.form.shiftInfo = time;
        const shiftInfo = this.form.shiftInfo;
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

    handleRowClick(row) {
      // 切换行的选中状态
      this.$refs.multipleTable.toggleRowSelection(row);
    },

    //查询工序信息
    getProcess() {
      // 初始化工序选项
      listProductprocess(this.workorderForm.id).then(response => {
        this.processOptions = response.data;
        console.log("this.processOptions: ", this.processOptions);
      });
    },
    handleClick(tab, event) {
      console.log('切换到标签页:', tab.name);
      // 根据标签页名称调用相应方法
      switch (tab.name) {
        case 'first':
          this.getPurchaseGoodsList();
          break;
        case 'second':
          this.getWorkorderList();
          break;
        case 'third':
          this.getAllocatedList();
          break;
        case 'fourth':
          this.getIssueHeaderList();
          break;
        case 'fifth':
          this.getFeedbackList();
          break;
      }

    },
    getWorkorderList() {
      this.loading = true;
      if(this.queryParams) this.workorderQueryParams = this.queryParams;
      traceWorkorderPage({
        ...this.workorderQueryParams,
        ...(this.isMine ? {} : {isMine: 1}),
      }).then(response => {
        this.workorderList = response.data.list;
        this.workorderTotal = response.data.total;
        this.loading = false;
      });
    },
    getPurchaseGoodsList() {
      this.loading = true;
      if(this.queryParams){
        this.purchaseGoodsQueryParams = this.queryParams
      }
      // 执行查询
      traceGoodsPage(this.purchaseGoodsQueryParams).then(response => {
        this.purchaseGoodsList = response.data.list;
        this.purchaseGoodsTotal = response.data.total;
        this.loading = false;
      });
    },
    async handleWorkorderView(row) {
      this.reset();
      const workorderId = row.id || this.id;
      await getWorkorder(workorderId).then(response => {
        this.workorderForm = response.data;
        this.getProcess();
      });
      await getRouteCodeByItemCode(this.workorderForm.productCode).then(response => {
        this.workorderForm.routeList = response.data;
        this.workorderOpen = true;
        this.isShowDelete = true;
        this.title = '查看工单信息';
      });
    },
    //Step点击
    handleStepClick(index) {
      this.activeProcess = index;
    },
    getAllocatedList() {
      this.loading = true;
      if(this.queryParams) this.allocatedQueryParams = this.queryParams;
      // 执行查询
      traceAllocatedPage(this.allocatedQueryParams).then(response => {
        this.allocatedList = response.data.list;
        this.allocatedTotal = response.data.total;
        this.loading = false;
      });
    },
    handleAllocatedShow(row) {
      this.title = "出库详情";
      this.openExecuteDialog(row.id);
    },
    openExecuteDialog(allocatedId) {
      this.executeForm.id = allocatedId; // 传递需要执行出库的调拨单ID
      this.$nextTick(() => {
        this.$refs.executeForm.resetFields(); // 重置表单
      });
      getAllocatedHeader(allocatedId).then(response => {
        this.executeForm = response.data;
        this.executeForm.bindWorkorder = this.executeForm.bindWorkorder === "true";
        // 设置领料仓库信息
        this.allocatedWarehouseInfo = [
          response.data.warehouseId,
          response.data.locationId,
          response.data.areaId
        ];
        this.allocatedWarehouseInfo[0] = response.data.warehouseId;
        this.allocatedWarehouseInfo[1] = response.data.locationId;
        this.allocatedWarehouseInfo[2] = response.data.areaId;
        this.bomList = response.data.bomList;
      });

      // 渲染调拨单单身记录
      getAllocatedRecordByHeaderId(allocatedId).then(response => {
        this.allocatedDetailList = response.data;
      });
      this.allocatedOpen = true; // 控制弹出框显示
    },
    getIssueHeaderList(){
      this.loading = true;
      if(this.queryParams) this.issueHeaderQueryParams = this.queryParams;
      traceIssueHeaderPage(this.issueHeaderQueryParams).then(response => {
        this.issueheaderList = response.data.list;
        this.issueHeaderTotal = response.data.total;
        this.loading = false;
      });
    },
    handleIssueView(row){
      this.reset();
      const issueIds = row.id;
      getIssueheader(issueIds).then(response => {
        this.issueHeaderForm = response.data;
        // 设置领料仓库信息
        this.issueHeaderWarehouseInfo = [
          response.data.warehouseId,
          response.data.locationId,
          response.data.areaId
        ];
        this.issueHeaderOpen = true;
        this.title = '查看领料单信息';
      });
    },
    getFeedbackList() {
      this.loading = true;
      if(this.queryParams) this.feedbackQueryParams = this.queryParams
      traceFeedbackPage(this.feedbackQueryParams).then(response => {
        this.feedbackList = response.data.list;
        this.feedbackTotal = response.data.total;
        this.loading = false;
      });
    },

    async handleFeedbackView(row){
      this.reset();
      const recordId = row.id || this.ids;
      await getFeedback(recordId).then(response => {
        // 在此处更改 审核人
        // response.data.recordNick = response.data.recordNick ? response.data.recordNick : this.$store.state.user.nickname;
        console.log(response.data);
        this.feedbackForm = response.data;
        for (let i = 0; i < this.feedbackForm.memberList.length; i++) {
          this.feedbackForm.memberList[i].nickname = this.feedbackForm.memberList[i].nickName;
          this.feedbackForm.memberList[i].username = this.feedbackForm.memberList[i].userName;

          if (this.feedbackForm.memberList[i].postIds) {
            const idsString = this.feedbackForm.memberList[i].postIds.replace(/[^0-9,]/g, ''); // 清理字符串
            if (idsString) {
              this.feedbackForm.memberList[i].postIds = idsString.split(',').map(Number); // 转换为数字数组
            }
          }
        }

        this.teamMembers = this.feedbackForm.memberList;
        this.processDefectList = response.data.processDefectList.map((item, index) => ({
          ...item,
          index: index + 1  // 从1开始编号
        }));

        /*if (this.feedbackForm.processCode) {
          // 追加缺陷下拉框
          getByCode(this.feedbackForm.processCode).then(response => {
            this.processDefectList = response.data;
            this.changeDefectList();
          });
        }*/
      });

      await initWarehouse({
        workorderId: this.feedbackForm.workorderId,
        taskId: this.feedbackForm.taskId
      }).then(response => {
        this.feedbackWareHouse = [
          response.warehouse.id,
          response.location.id,
          response.area.id
        ];
        this.feedbackForm.warehouseId = response.warehouse.id;
        this.feedbackForm.locationId = response.location.id;
        this.feedbackForm.areaId = response.area.id;
        this.$nextTick(() => {
          this.feedbackOpen = true;
          this.title = '查看生产报工记录';
        });
      });
    },
    getTreeselect() {
      listSimplePosts().then(response => {
        // 处理 postOptions 参数
        this.postOptions = [];
        this.postOptions.push(...response.data);
      });
    },


  },


};
</script>


<style>
.el-table .warning-row {
  background: #F8EBE9;
}
</style>
