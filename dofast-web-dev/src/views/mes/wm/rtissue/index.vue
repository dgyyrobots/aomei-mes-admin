<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="退料单编号" prop="rtCode">
        <el-input v-model="queryParams.rtCode" placeholder="请输入退料单编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="生产工单" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入生产工单编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['wms:rt-issue:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['wms:rt-issue:update']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['wms:rt-issue:delete']">删除</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleprint" v-hasPermi="['wms:rt-issue:update']">打印</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="rtissueList" @selection-change="handleSelectionChange" ref="multipleTable" @row-click="handleRowClick">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="退料单编号" width="140px" align="center" prop="rtCode">
        <template slot-scope="scope">
          <el-button type="text" @click="handleView(scope.row)" v-hasPermi="['wms:rt-issue:query']">{{ scope.row.rtCode }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="退料单名称" width="120px" align="center" prop="rtName" :show-overflow-tooltip="true"/>
      <el-table-column label="生产工单" width="140px" align="center" prop="workorderCode"/>
      <el-table-column label="仓库名称" align="center" prop="warehouseName"/>
      <el-table-column label="库区名称" width="100px" align="center" prop="locationName"/>
      <el-table-column label="库位名称" align="center" prop="areaName"/>
      <el-table-column label="退料日期" align="center" prop="rtDate" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.rtDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.status == 'PREPARE'" @click="handleExecute(scope.row)" v-hasPermi="['wms:rt-issue:update']">执行退料</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" v-if="scope.row.status == 'PREPARE'" @click="handleUpdate(scope.row)" v-hasPermi="['wms:rt-issue:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.status == 'PREPARE'" @click="handleDelete(scope.row)" v-hasPermi="['wms:rt-issue:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList"/>

    <!-- 添加或修改生产退料单头对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="退料单编号" prop="rtCode">
              <el-input v-model="form.rtCode" placeholder="请输入退料单编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80"> <!--v-if="optType = 'view' && form.status == 'PREPARE'-->
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange(autoGenFlag)" v-if="optType=== 'add'"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退料单名称" prop="rtName">
              <el-input v-model="form.rtName" placeholder="请输入退料单名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input v-model="form.workorderCode" placeholder="请输入生产工单">
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

          <el-col :span="8">
            <el-form-item label="接收仓库">
              <el-cascader v-model="warehouseInfo" :options="warehouseOptions" :props="warehouseProps" @change="handleWarehouseChanged"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="退料日期" prop="rtDate">
              <el-date-picker disabled clearable v-model="form.rtDate" type="date" value-format="timestamp" placeholder="请选择退料日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
                    </el-form-item>
                  </el-col>
                </el-row>-->
      </el-form>
      <el-divider content-position="center">上料信息</el-divider>
      <el-card shadow="always" class="box-card">
        <!--        <Rtissueline :rtId="form.id" :optType="optType"></Rtissueline>-->
        <el-table v-loading="loading" max-height="300" :data="form.issuelineList" @selection-change="handleIssuseSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="物料编码" width="120px" align="center" prop="itemCode"/>
          <el-table-column label="物料名称" width="150px" align="center" prop="itemName" :show-overflow-tooltip="true"/>
          <el-table-column label="领料数量" align="center" prop="quantity"/>
          <el-table-column label="单位" align="center" prop="unitOfMeasure"/>
          <el-table-column label="领料批次号" width="180px" align="center" prop="batchCode" :show-overflow-tooltip="true"/>
          <el-table-column label="仓库名称" width="150px" align="center" prop="warehouseName"/>
          <el-table-column label="库区名称" width="150px" align="center" prop="locationName"/>
          <el-table-column label="库位名称" width="130px" align="center" prop="areaName"/>
        </el-table>
      </el-card>

      <el-divider content-position="center">退料信息</el-divider>
      <el-card shadow="always" class="box-card">
        <el-table v-loading="loading" max-height="300" :data="form.rtissuelineList">
          <el-table-column label="物料编码" width="120px" align="center" prop="itemCode"/>
          <el-table-column label="物料名称" width="150px" align="center" prop="itemName" :show-overflow-tooltip="true"/>
          <el-table-column label="退料数量" width="90px" align="center">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.quantity" placeholder="请输入" type="number" step="0.01"/>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center" prop="unitOfMeasure"/>
          <el-table-column label="领料批次号" width="180px" align="center" prop="batchCode" :show-overflow-tooltip="true"/>
          <el-table-column label="仓库名称" width="150px" align="center" prop="warehouseName"/>
          <el-table-column label="库区名称" width="150px" align="center" prop="locationName"/>
          <el-table-column label="库位名称" width="130px" align="center" prop="areaName"/>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view' || form.status != 'PREPARE'">返回</el-button>
        <el-button type="primary" @click="submitForm" v-if="form.status == 'PREPARE' && optType != 'view'">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <div>
      <!-- 引入批量打印组件 -->
      <Print
        v-if="showPrintComponent"
        :token="token"
        :url="url"
        :idList="idList"
        :templateId="templateId"
        @close="showPrintComponent = false"
      />
    </div>

  </div>
</template>

<script>
import {listRtissue, getRtissue, delRtissue, addRtissue, updateRtissue, execute} from '@/api/mes/wm/rtissue';
import WorkorderSelect from '@/components/workorderSelect/single.vue';
import Rtissueline from './line.vue';
import {getTreeList} from '@/api/mes/wm/warehouse';
import {genCode} from '@/api/mes/autocode/rule';
import ProtaskSelect from '@/components/TaskSelect/taskSelectSingle.vue';
import {getByTaskId} from "@/api/wms/feedLine";
import {createPrintLog, getPrintLogPage} from "@/api/report/printLog";
import '@/utils/CLodopfuncs2.js';
import {getRtsalselineByHeaderId} from "@/api/mes/wm/rtissueline";
import Print from "./print.vue";
import {getConfigKey} from '@/api/system/config';
import {getAccessToken} from '@/utils/auth';

export default {
  name: 'Rtissue',
  dicts: ['mes_order_status'],
  components: {
    ProtaskSelect,
    Rtissueline,
    WorkorderSelect,
    Print
  },
  data() {
    return {
      autoGenFlag: false,
      optType: undefined,
      warehouseInfo: [],
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
      },
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
      // 生产退料单头表格数据
      rtissueList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        rtCode: null,
        rtName: null,
        workorderId: null,
        workorderCode: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        rtDate: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        rtCode: [{required: true, message: '退料单编号不能为空', trigger: 'blur'}],
        workorderCode: [{required: true, message: '请选择要退料的生产工单', trigger: 'blur'}],
        warehouseId: [{required: true, message: '请选择仓库', trigger: 'change'}],
        locationId: [{required: true, message: '请选择库区', trigger: 'change'}],
        areaId: [{required: true, message: '请选择库位', trigger: 'change'}],
      },
      url: null,
      token: null,
      idList: [],
      templateId: null,
      showPrintComponent: false, // 控制打印组件显示
    };
  },
  created() {
    this.getList();
    this.getWarehouseList();
  },
  methods: {
    /** 查询生产退料单头列表 */
    getList() {
      this.loading = true;
      listRtissue(this.queryParams).then(response => {
        this.rtissueList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    getWarehouseList() {
      getTreeList().then(response => {
        this.warehouseOptions = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      // 重置仓库信息
      this.warehouseInfo = [];
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        rtCode: null,
        rtName: null,
        workorderId: null,
        workorderCode: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        rtDate: null,
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
        issuelineList: [], // 上料明细
        rtissuelineList: [],// 退料明细列表
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
    // 上料详情多选框选中
    handleIssuseSelectionChange(selection) {
      // 遍历选中的上料信息
      selection.forEach(item => {
        // 检查是否已经存在于退料信息列表中
        const exists = this.form.rtissuelineList.find(rtItem => rtItem.itemCode === item.itemCode);
        if (!exists) {
          // 如果不存在，则追加到退料信息列表中
          this.form.rtissuelineList.push({
            itemId: item.itemId,
            itemCode: item.itemCode,
            itemName: item.itemName,
            quantity: item.quantity, // 默认数量可以是上料数量
            unitOfMeasure: item.unitOfMeasure,
            batchCode: item.batchCode,
            warehouseId: item.warehouseId,
            warehouseCode: item.warehouseCode,
            warehouseName: item.warehouseName,
            locationId: item.locationId,
            locationCode: item.locationCode,
            locationName: item.locationName,
            areaId: item.areaId,
            areaCode: item.areaCode,
            areaName: item.areaName,
            vendorCode: item.vendorCode,
          });
        }
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加生产退料单头';
      this.form.rtDate = new Date(); // 退料时间自动设置为当前的时间
      this.optType = 'add';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const rtId = row.id || this.ids;
      getRtissue(rtId).then(response => {
        this.form = response.data;
        this.warehouseInfo[0] = response.data.warehouseId;
        this.warehouseInfo[1] = response.data.locationId;
        this.warehouseInfo[2] = response.data.areaId;
        console.log(response.data);
        this.open = true;
        this.title = '修改生产退料单头';
        this.optType = 'edit';
      });
    },
    // 查询明细按钮操作
    handleView(row) {
      this.reset();
      const rtId = row.id;
      getRtissue(rtId).then(response => {
        this.form = response.data;
        this.warehouseInfo[0] = response.data.warehouseId;
        this.warehouseInfo[1] = response.data.locationId;
        this.warehouseInfo[2] = response.data.areaId;
        this.open = true;
        this.title = '查看退料单信息';
        this.optType = 'view';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 校验退料数量是否超过领料数
          for (const rtItem of this.form.rtissuelineList) {
            const correspondingItem = this.form.issuelineList.find(item => item.itemCode === rtItem.itemCode);
            if (correspondingItem) {
              if (rtItem.quantity > correspondingItem.quantity) {
                this.$modal.msgError(`物料 ${rtItem.itemCode} 的退料数量不能超过领料数量 ${correspondingItem.quantity}`);
                return;
              }
            }
          }
          // 检查是否选择了仓库信息
          if (!this.form.warehouseId || !this.form.locationId || !this.form.areaId) {
            this.$modal.msgError('请选择完整的仓库信息（仓库、库区、库位）');
            return;
          }
          if (this.form.id != null) {
            updateRtissue(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addRtissue(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    //执行退料
    handleExecute(row) {
      const rtIds = row.id || this.ids;
      this.$modal
        .confirm('确认执行退料？')
        .then(function () {
          return execute(rtIds); //执行退料
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('退料成功');
        })
        .catch(() => {
        });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const rtIds = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除生产退料单头编号为"' + rtIds + '"的数据项？')
        .then(function () {
          return delRtissue(rtIds);
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
        'wm/rtissue/export',
        {
          ...this.queryParams,
        },
        `rtissue_${new Date().getTime()}.xlsx`,
      );
    },
    //选择默认的仓库、库区、库位
    handleWarehouseChanged(obj) {
      if (obj != null) {
        this.form.warehouseId = obj[0];
        this.form.locationId = obj[1];
        this.form.areaId = obj[2];
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
      }
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        genCode('RTISSUE_CODE').then(response => {
          this.form.rtCode = response;
        });
      } else {
        this.form.rtCode = null;
      }
    },
    handleTaskSelect() {
      this.$refs.taskSelect.showFlag = true;
      this.$refs.taskSelect.getList();
    },
    onTaskSelected(row) {
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
        console.log("获取上料详情," + row.id);
        // 根据任务单获取上料详情, 并基于上料详情展示可退料的物料与数量
        getByTaskId(row.id).then(response => {
          if (Array.isArray(response.data) && response.data.length > 0) {
            console.log(response);
            this.form.issuelineList = response.data; // 上料详情
          }
        });
      }
    },
    async handleprint() {
      // 获取当前选中行信息
      const rtIds = this.ids;
      await this.$modal.confirm('确认打印？')
      let datas = await createPrintLog({printName: this.$store.state.user.nickname, printType: this.$route.meta.title + '-退料单号', printCode: '测试退料单'});
      if (!datas.data) {
        this.$message.error(datas.msg);
        return
      }
      // 根据当前选中的单头Id获取单身信息
      let rtissueLine = [];
      await getRtsalselineByHeaderId(rtIds[0]).then(response => {
        rtissueLine = response.data; // 获取单身的Id
        console.log('rtissueLine:', rtissueLine); // 确保在这里打印
      }).catch(error => {
        console.error('报错:', error);
      });
      /* if (rtissueLineIds.length === 0) {
         this.$message.error('未找到相关单身信息！');
         return;
       }*/

      // 测试打印功能
      /*let res = await getConfigKey('TL1');
      if (!res.data && res.code == 0) {
        this.$message.error('请先配置退料标签id');
        return
      }
      let id = res.data.value;*/
      /* if (id) {
         for (let i = 0; i < rtissueLineIds.length; i++) {
           window.open(`${process.env.VUE_APP_BASE_API}/jmreport/view/${id}?token=${getAccessToken()}&id=${rtissueLineIds[i]}`);
         }
         // 将当前的url， token， 数据源进行绑定
         // this.url = process.env.VUE_APP_BASE_API + '/jmreport/view/';
         // this.token = getAccessToken();
         // this.idList = rtissueLineIds;
         // this.templateId = id;
         // // 显示打印组件
         // this.showPrintComponent = true;
       }*/

      for (let i = 0; i < rtissueLine.length; i++) {
        let id = rtissueLine[i].id;
        let itemName = rtissueLine[i].itemName;
        let itemCode = rtissueLine[i].itemCode;
        let batchCode = rtissueLine[i].batchCode;
        let unitOfMeasure = rtissueLine[i].unitOfMeasure;
        let quantity = rtissueLine[i].quantity;
        let warehouseName = rtissueLine[i].warehouseName; // 仓库名称
        let locationName = rtissueLine[i].locationName; // 库区名称
        let areaName = rtissueLine[i].areaName; // 库位名称
        let createTime = new Date(rtissueLine[i].createTime).toISOString().slice(0, 19).replace('T', ' '); // 退料日期
        let workStationName = rtissueLine[i].workstationName; // 工位名称
        // 先使用测试数据
        LODOP.PRINT_INITA(0, 0, 150, 100); // 初始化打印任务，纸张大小为150mm*100mm，单位：像素
        LODOP.SET_PRINT_PAGESIZE(2, "", "", "热敏纸"); // 设置纸张横向
        // 添加整体边框
        LODOP.ADD_PRINT_RECT(8, 5, 150 * 3.71 - 10, 100 * 3.71 - 10, 0, 1); // 整体边框

        // 添加标题及标题边框
        LODOP.SET_PRINT_STYLE("FontSize", 18);
        LODOP.SET_PRINT_STYLE("FontName", "Microsoft YaHei");
        LODOP.SET_PRINT_STYLE("Bold", 1);
        LODOP.SET_PRINT_STYLE("Horient", 2); // 居中
        LODOP.ADD_PRINT_TEXT(13, 0, 150, 30, "退料单标签");

        // 内容样式及分块边框
        LODOP.SET_PRINT_STYLE("FontSize", 16);
        LODOP.SET_PRINT_STYLE("Bold", 0);
        LODOP.SET_PRINT_STYLE("Horient", 0); // 取消居中
        LODOP.ADD_PRINT_TEXT(70, 15, 120, 35, "生产车间:"); // 标签部分，距离左边10px
        LODOP.ADD_PRINT_TEXT(70, 120, 280, 35, workStationName); // 内容部分

        LODOP.ADD_PRINT_TEXT(120, 15, 120, 35, "物料名称:");
        LODOP.ADD_PRINT_TEXT(120, 120, 280, 35, itemName);

        LODOP.ADD_PRINT_TEXT(170, 15, 120, 35, "工单号:");
        LODOP.ADD_PRINT_TEXT(170, 120, 280, 35, "AMCS21-240824001");

        LODOP.ADD_PRINT_TEXT(220, 15, 120, 35, "数量:");
        LODOP.ADD_PRINT_TEXT(220, 120, 280, 35, quantity);

        LODOP.ADD_PRINT_TEXT(270, 15, 120, 35, "退料单位:");
        LODOP.ADD_PRINT_TEXT(270, 120, 280, 35, unitOfMeasure);

        LODOP.ADD_PRINT_TEXT(320, 15, 120, 35, "退料日期:");
        LODOP.ADD_PRINT_TEXT(320, 120, 280, 35, createTime);

        let jsonQc = {
          "id": id,
          "type": "eject",
          "rt_code": itemCode,
        }
        LODOP.ADD_PRINT_BARCODE(220, 390, 170, 170, "QRCode", JSON.stringify(jsonQc));
        LODOP.PREVIEW();
      }


    },
    handleRowClick(row) {
      // 切换行的选中状态
      this.$refs.multipleTable.toggleRowSelection(row);
    },
  },
};
</script>

