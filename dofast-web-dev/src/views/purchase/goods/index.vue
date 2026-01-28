<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">

      <el-form-item label="采购单号" prop="goodsNumber">
        <el-input v-model="queryParams.poNo" placeholder="请输入采购单号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="商品编号" prop="goodsNumber">
        <el-input v-model="queryParams.goodsNumber" placeholder="请输入商品编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="批次号" prop="batchCode">
        <el-input v-model="queryParams.batchCode" placeholder="请输入批次号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>


      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="queryParams.goodsName" placeholder="请输入商品名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="供应商名称" prop="goodsName">
        <el-input v-model="queryParams.vendorName" placeholder="请输入" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="入库状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="入库状态" clearable>
          <el-option
            v-for="dict in dict.type.purchase_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <!--      <el-col :span="1.5">
              <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['purchase:goods:create']">新增</el-button>
            </el-col>-->

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['purchase:goods:update']">修改</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="multiple" @click="batchPrint" v-hasPermi="['purchase:goods:print']">批量打印</el-button>
      </el-col>

<!--      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="single" @click="printTitle" v-hasPermi="['purchase:goods:print']">单据打印</el-button>
      </el-col>-->

      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="disabledFlag" @click="receive" v-hasPermi="['purchase:goods:split']">收货</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="single" @click="split" v-hasPermi="['purchase:goods:split']">拆分</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-success" size="mini" @click="warehousing" v-hasPermi="['purchase:goods:warehousing']">一键入库</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-merge" size="mini" :disabled="multiple" @click="mergeGoods" v-hasPermi="['purchase:goods:merge']">合并</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" ref="multipleTable" @row-click="handleRowClick">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column label="单据编码" width=120 align="center" prop="id"/>
      <el-table-column label="采购单号" width=160 align="center" prop="poNo"/>
      <el-table-column label="商品编号" width=120 align="center" prop="goodsNumber"/>
      <el-table-column :show-overflow-tooltip="true" label="商品名称" align="center" prop="goodsName"/>
      <el-table-column :show-overflow-tooltip="true" label="商品规格" align="center" prop="goodsSpecs"/>
      <el-table-column label="供应商编号" width=120 align="center" prop="vendorCode"/>
      <el-table-column label="供应商名称" width=120 align="center" prop="vendorName"/>
      <el-table-column label="采购数量" align="center" prop="quantity"/>
      <el-table-column label="收货数量" align="center" prop="receiveNum"/>
      <el-table-column label="已拆数量" align="center" prop="receivedNum"/>
      <el-table-column label="单位" align="center" prop="company"/>
      <el-table-column label="批次号"  width=160  align="center" prop="batchCode" :show-overflow-tooltip="true"/>
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
      <el-table-column width="150" fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['purchase:goods:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['purchase:goods:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList"/>

    <el-dialog :title="title" :visible.sync="open" width="65%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购单号" prop="poNo">
              <el-input disabled v-model="form.poNo" placeholder="请输入采购单号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品编号" prop="goodsNumber">
              <el-input disabled v-model="form.goodsNumber" placeholder="请输入商品编号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input disabled v-model="form.goodsName" placeholder="请输入商品名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品规格" prop="goodsSpecs">
              <el-input disabled v-model="form.goodsSpecs" placeholder="请输入商品规格"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品单位" prop="company">
              <el-input disabled v-model="form.company" placeholder="请输入商品单位"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量" prop="quantity">
              <el-input disabled v-model="form.quantity" placeholder="请输入采购数量"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收货数量" prop="receiveNum">
              <el-input v-model="form.receiveNum" placeholder="请输入收货数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货单位" prop="unitOfMeasure">
              <el-select filterable clearable v-model="form.unitOfMeasure" style="width: 100%" placeholder="请选择">
                <el-option
                  v-for="unit in unitOptions"
                  :key="unit.measureCode"
                  :label="unit.measureName"
                  :value="unit.measureCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--  一键入库  -->
    <el-dialog :title="title" :visible.sync="wareOpen" width="75%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="wareForm" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="采购单号" prop="poNo">
              <el-input v-model="wareForm.poNo" placeholder="请输入采购单号" @blur="handleBlur" @input="handleInput"/>
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

        <!-- 设置el-table的高度 -->
        <el-table v-loading="loading" :data="wareList" height="500">
          <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="商品编号" align="center" prop="goodsNumber"/>
          <el-table-column label="商品名称" align="center" prop="goodsName"/>
          <el-table-column label="商品规格" align="center" prop="goodsSpecs"/>
          <el-table-column label="供应商编号" align="center" prop="vendorCode"/>
          <el-table-column label="商品单位" align="center" prop="company"/>
          <el-table-column label="采购数量" align="center" prop="quantity"/>
          <el-table-column label="收货数量" align="center" prop="receiveNum"/>
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

      </el-form>
      <div>
        <video ref="videoCamera" style="display: none;"></video>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="disabledFlag" @click="submitWareForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
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
            <el-form-item label="采购单号" prop="poNo">
              <el-input disabled v-model="splitForm.poNo" placeholder="请输入采购单号"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="商品编号" prop="goodsNumber">
              <el-input disabled v-model="splitForm.goodsNumber" placeholder="请输入商品编号"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入库数量" prop="quantity">
              <el-input disabled v-model="splitForm.receiveNum" placeholder="请输入采购数量"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="入库单位" prop="unitOfMeasure">
              <el-input disabled v-model="splitForm.unitOfMeasure" placeholder="请输入采购数量"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>


      <div style="text-align: right; margin-top: 20px;">
        <el-button type="primary" @click="conditionSplit">按条件拆分</el-button>
        <el-button type="primary" @click="addSplitDetailByCount">按数量拆分</el-button>

        <el-button type="primary" @click="addSplitDetail">新增</el-button>
      </div>
      <!-- 拆分表格 -->
      <el-table :data="splitDetails" style="width: 100%;" max-height="400">

        <el-table-column prop="index" label="序号" width="60"/>
        <el-table-column prop="poNo" label="采购单号" width="180"/>
        <el-table-column prop="goodsNumber" label="物料料号" width="180"/>
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
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitSplit">确定拆分</el-button>
      </div>
    </el-dialog>

    <!-- 按条件拆分弹出框 -->
    <el-dialog :title="'按条件拆分'" :visible.sync="splitConditionDialogVisible" width="30%" v-dialogDrag append-to-body>
      <el-form ref="splitConditionForm" :model="splitConditionForm" label-width="120px">
        <el-form-item label="拆分条数">
          <el-input v-model="splitConditionForm.splitCount" type="number" step="1" placeholder="请输入拆分条数"/>
        </el-form-item>

        <el-form-item label="拆分数量">
          <el-input v-model="splitConditionForm.splitQuantity" type="number" step="0.001" placeholder="请输入拆分数量"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSplit">取消</el-button>
        <el-button type="primary" @click="confirmConditionSplit">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {createGoods, updateGoods, deleteGoods, getGoods, getGoodsPage, getAllGoods, exportGoodsExcel, updateReceiveStatus, startWareHousing, splitGoods, getPurchaseBarCode, checkConfig, batchUpdateReceiveStatus, receiving , mergeGoods , checkOrigin} from '@/api/purchase/goods';
import {createPrintLog, getPrintLogPage} from "@/api/report/printLog";
import '@/utils/CLodopfuncs2.js';
import {getConfigKey} from '@/api/system/config';
import {getAccessToken} from '@/utils/auth';
import {listAllUnitmeasure} from '@/api/mes/md/unitmeasure';
import {DICT_TYPE, getDictDatas} from '@/utils/dict';
import {getTreeList} from '@/api/mes/wm/warehouse';
import jsQR from 'jsqr';

export default {
  name: 'Goods',
  dicts: ['purchase_status'],
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 采购商品明细列表
      list: [],
      // 准备入库的采购商品明细表
      wareList: [],
      // 弹出层标题
      title: '',
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 是否显示弹出层
      open: false,
      // 入库弹出层
      wareOpen: false,
      unitOptions: [], // 单位下拉列表
      selectedRows: [], // 选中行
      // 查询参数
      queryParams: {
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
      // 表单参数
      form: {},
      // 入库表单参数
      wareForm: {},
      // 表单校验
      rules: {
        poNo: [{required: true, message: '采购单号不能为空', trigger: 'blur'}],
        goodsNumber: [{required: true, message: '商品编号不能为空', trigger: 'blur'}],
        company: [{required: true, message: '商品单位不能为空', trigger: 'blur'}],
        quantity: [{required: true, message: '采购数量不能为空', trigger: 'blur'}],
        receiveNum: [{required: true, message: '收货数量不能为空', trigger: 'blur'}],
        unitOfMeasure: [{required: true, message: '收货单位不能为空', trigger: 'blur'}]
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
      // 条码拆分
      splitDialogVisible: false,
      splitForm: {
        poNo: '',
        goodsNumber: '',
        receiveNum: '',
        unitOfMeasure: ''
      },
      splitDetails: [],
      index: 1, // 序号
      // 控制按条件拆分弹出框的显示
      splitConditionDialogVisible: false,
      splitConditionForm: {
        splitQuantity: '', // 拆分数量
        splitCount: '' // 拆分数
      },
      disabledFlag: false,
    };
  },
  computed: {
    // 计算拆分按钮是否可用
    canSplit() {
      return this.selectedRows.length > 0;
    },
  },
  created() {
    this.getList();
    this.getWarehouseList();
  },
  watch: {
    // 监听 scanResult 的变化
    scanResult: {
      handler(newVal) {
        if (newVal && (newVal.includes('{}') || newVal.includes('[]'))) {
          this.handleScanResult(newVal);
        }
      },
      immediate: false, // 不在初始时触发
    },
    cameraPreviewVisible(newVal) {
      if (!newVal) {
        this.stopScanning();
      }
    },
    'wareForm.poNo': function (newVal) {
      if (typeof newVal === 'string' && newVal.includes('{') && newVal.includes('}')) {
        console.log('输入内容包含完整的 "{" 和 "}"');
        // 开始基于当前的内容追加产品入库
        // 直接解析 JSON 字符串
        const data = JSON.parse(newVal);
        // 检查是否包含 po_no 属性
        if (data && data.po_no) {
          console.log("data.po_no:", data.po_no);
          this.wareForm.poNo = data.po_no;
        } else {
          console.log("data.po_no is undefined");
        }
        console.log(this.wareForm.poNo);
        this.handleBlur();
      } else {
        console.log('输入内容不包含完整的 "{" 和 "}"');
      }
    }
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getGoodsPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.wareOpen = false;
      this.cameraPreviewVisible = false;
      this.wareList = [];
      this.splitDialogVisible = false;
      this.index = 1;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        purchaseId: undefined,
        goodsNumber: undefined,
        goodsName: undefined,
        goodsSpecs: undefined,
        company: undefined,
        monovalent: undefined,
        quantity: undefined,
        taxes: undefined,
        total: undefined,
        categoryName: undefined,
        brandName: undefined,
      };
      this.wareForm = {
        id: undefined,
        purchaseId: undefined,
        goodsNumber: undefined,
        goodsName: undefined,
        goodsSpecs: undefined,
        company: undefined,
        monovalent: undefined,
        quantity: undefined,
        taxes: undefined,
        total: undefined,
        categoryName: undefined,
        brandName: undefined,
      };

      this.resetForm('form');
      this.resetForm('wareForm');
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加采购商品明细';
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;

      // 追加校验, 禁止修改已入库的单据
      if (this.selectedRows[0].status === 3) {
        this.$modal.msgError('该单据已入库，禁止修改！');
        return;
      }

      await listAllUnitmeasure().then(response => {
        this.unitOptions = response.data;
      });

      getGoods(id).then(response => {
        this.form = response.data;
        // 新增：自动填充收货数量和单位
        if (this.form.receiveNum === null) {
          this.form.receiveNum = this.form.quantity; // 采购数量 -> 收货数量
          this.form.unitOfMeasure = this.form.company; // 商品单位 -> 收货单位
        }
        this.open = true;
        this.title = '修改采购商品明细';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
          if (!valid) {
            return;
          }

          // 修改的提交
          if (this.form.id != null) {
            updateGoods(this.form).then(response => {
              this.$modal.msgSuccess('收货成功');
              this.open = false;
              this.getList();
            });
            return;
          }

          // 添加的提交
          createGoods(this.form).then(response => {
            this.$modal.msgSuccess('新增成功');
            this.open = false;
            this.getList();
          });
        }
      );
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal
        .confirm('是否确认删除采购商品明细编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteGoods(id);
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
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm('是否确认导出所有采购商品明细数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportGoodsExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '采购商品明细.xls');
          this.exportLoading = false;
        })
        .catch(() => {
        });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectedRows = selection;
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 单据打印
    async printTitle() {

      // 校验当前采购单号下所有单身是否配置单位与收货数量
      let result = await checkConfig(this.selectedRows[0].poNo);
      if (!result) {
        this.$message.error('采购单: ' + this.selectedRows[0].poNo + '存在未配置单位与收货数量的明细信息，请先配置后打印！');
        return;
      }
      if (!Array.isArray(result.data)) {
        console.error("结果不是一个数组: ", result);
        return;
      }

      await this.$modal.confirm('确认打印？');

      LODOP.PRINT_INITA(0, 0, 150, 100); // 初始化打印任务，纸张大小为150mm*100mm，单位：像素
      LODOP.SET_PRINT_PAGESIZE(2, "", "", "热敏纸"); // 设置纸张横向

      for (const obj of result.data) {
        console.log("数据解析: ", obj);
        LODOP.NEWPAGE();
        // 添加整体边框
        LODOP.ADD_PRINT_RECT(8, 5, 150 * 3.71 - 10, 100 * 3.71 - 10, 0, 1); // 整体边框

        // 添加标题及标题边框
        LODOP.SET_PRINT_STYLE("FontSize", 18);
        LODOP.SET_PRINT_STYLE("FontName", "Microsoft YaHei");
        LODOP.SET_PRINT_STYLE("Bold", 1);
        LODOP.SET_PRINT_STYLE("Horient", 2); // 居中
        LODOP.ADD_PRINT_TEXT(13, 0, 150, 30, "入库单标签");

        // 内容样式及分块边框
        LODOP.SET_PRINT_STYLE("FontSize", 14);
        LODOP.SET_PRINT_STYLE("Bold", 0);
        LODOP.SET_PRINT_STYLE("Horient", 0); // 取消居中

        LODOP.ADD_PRINT_TEXT(65, 15, 120, 35, "条码编号:"); // 标签部分，距离左边10px
        LODOP.ADD_PRINT_TEXT(65, 120, 280, 35, obj.id); // 内容部分

        LODOP.ADD_PRINT_TEXT(110, 15, 120, 35, "采购料号:"); // 标签部分，距离左边10px
        LODOP.ADD_PRINT_TEXT(110, 120, 280, 35, obj.goodsNumber); // 内容部分

        LODOP.ADD_PRINT_TEXT(155, 15, 120, 35, "物料名称:");
        LODOP.ADD_PRINT_TEXT(155, 120, 280, 35, obj.goodsName + obj.goodsSpecs);

        LODOP.ADD_PRINT_TEXT(200, 15, 120, 35, "采购单号:");
        LODOP.ADD_PRINT_TEXT(200, 120, 280, 35, obj.poNo);

        LODOP.ADD_PRINT_TEXT(245, 15, 120, 35, "收货数量:");
        LODOP.ADD_PRINT_TEXT(245, 120, 280, 35, obj.receiveNum + obj.unitOfMeasure);

        LODOP.ADD_PRINT_TEXT(290, 15, 120, 35, "批次号:");
        LODOP.ADD_PRINT_TEXT(290, 120, 280, 35, obj.batchCode);

        const receiveDate = new Date(obj.receiveTime);
        const localTime = receiveDate.toLocaleString('zh-CN', {
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        LODOP.ADD_PRINT_TEXT(335, 15, 120, 35, "收货日期:");
        LODOP.ADD_PRINT_TEXT(335, 120, 280, 35, localTime);
        let jsonQc = {
          "id": obj.id,
          "type": "purchase",
          "po_no": obj.poNo,
        }
        LODOP.ADD_PRINT_BARCODE(220, 390, 170, 170, "QRCode", JSON.stringify(jsonQc));
      }
      LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1); //打印后自动关闭预览窗口
      LODOP.PREVIEW();


      this.batchUpdateStatus(this.selectedRows[0].poNo);
    },

    async batchPrint() {
      //校验当前所选项的收货数量与收货单位是否填写
      for (let i = 0; i < this.selectedRows.length; i++) {
        if (this.selectedRows[i].receiveNum === 0 || this.selectedRows[i].receiveNum === null || this.selectedRows[i].receiveNum === undefined) {
          this.$message.error('请先确认第' + (i + 1) + '行的收货数量');
          return;
        }
        if (this.selectedRows[i].unitOfMeasure === null || this.selectedRows[i].unitOfMeasure === undefined) {
          this.$message.error('请先确认第' + (i + 1) + '行的收货单位');
          return;
        }

        if (this.selectedRows[i].status === 0) {
          this.$message.error('请先对第' + (i + 1) + '行的物料进行收货');
          return;
        }

      }

      await this.$modal.confirm('确认批量打印？');

      this.loading = true;
      LODOP.PRINT_INITA(0, 0, 150, 100); // 初始化打印任务，纸张大小为150mm*100mm，单位：像素
      LODOP.SET_PRINT_PAGESIZE(2, "", "", "热敏纸"); // 设置纸张横向
      for (const queryId of this.ids) {
        let obj = {};
        // 根据当前勾选行Id获取条码内容
        await getGoods(queryId).then(response => {
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
        LODOP.ADD_PRINT_TEXT(13, 0, 150, 30, "入库单标签");

        // 内容样式及分块边框
        LODOP.SET_PRINT_STYLE("FontSize", 14);
        LODOP.SET_PRINT_STYLE("Bold", 0);
        LODOP.SET_PRINT_STYLE("Horient", 0); // 取消居中

        LODOP.ADD_PRINT_TEXT(65, 15, 120, 35, "条码编号:"); // 标签部分，距离左边10px
        LODOP.ADD_PRINT_TEXT(65, 120, 280, 35, obj.id); // 内容部分

        LODOP.ADD_PRINT_TEXT(110, 15, 120, 35, "采购料号:"); // 标签部分，距离左边10px
        LODOP.ADD_PRINT_TEXT(110, 120, 280, 35, obj.goodsNumber); // 内容部分

        LODOP.ADD_PRINT_TEXT(155, 15, 120, 35, "物料名称:");
        LODOP.ADD_PRINT_TEXT(155, 120, 280, 35, obj.goodsName + obj.goodsSpecs);

        LODOP.ADD_PRINT_TEXT(200, 15, 120, 35, "采购单号:");
        LODOP.ADD_PRINT_TEXT(200, 120, 280, 35, obj.poNo);

        LODOP.ADD_PRINT_TEXT(245, 15, 120, 35, "收货数量:");
        LODOP.ADD_PRINT_TEXT(245, 120, 280, 35, obj.receiveNum + obj.unitOfMeasure);

        LODOP.ADD_PRINT_TEXT(290, 15, 120, 35, "批次号:");
        LODOP.ADD_PRINT_TEXT(290, 120, 280, 35, obj.batchCode);

        LODOP.ADD_PRINT_TEXT(335, 15, 120, 35, "收货日期:");
        // let receiveTime = new Date(obj.receiveTime).toISOString().slice(0, 19).replace('T', ' '); // 收货日期

        const receiveDate = new Date(obj.receiveTime);
        const localTime = receiveDate.toLocaleString('zh-CN', {
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        LODOP.ADD_PRINT_TEXT(335, 120, 280, 35, localTime);
        let jsonQc = {
          "id": obj.id,
          "type": "purchase",
          "po_no": obj.poNo,
        }
        LODOP.ADD_PRINT_BARCODE(220, 390, 170, 170, "QRCode", JSON.stringify(jsonQc));
      }
      LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1); //打印后自动关闭预览窗口
      LODOP.PREVIEW();

      await this.updateStatus();
    },
    // 打印完成后， 修改当前行的状态
    updateStatus() {
      this.loading = true;
      updateReceiveStatus(this.selectedRows).then(response => {
        this.$message.success('打印成功');
        this.getList();
        this.loading = false;
      });
    }
    ,
    batchUpdateStatus(poNo) {
      batchUpdateReceiveStatus(poNo).then(response => {
        this.$message.success('打印成功');
        this.getList();
      });
    }
    ,
// 初始化仓库数据
    getWarehouseList() {
      getTreeList().then(response => {
        this.warehouseOptions = response.data;
        console.log(this.warehouseOptions);
      });
    }
    ,
//选择默认的仓库、库区、库位
    handleWarehouseChanged(obj) {
      if (obj != null) {
        this.wareForm.warehouseId = obj[0]; // 仓库
        this.wareForm.locationId = obj[1];// 库区
        this.wareForm.areaId = obj[2]; // 库位
      }
    }
    ,
// 开始入库
    warehousing() {
      // 初始化仓库信息
      // 弹出框
      this.wareOpen = true;
      this.title = '一键入库';
    },
    // 确定入库
    async submitWareForm() {
      // 校验当前的采购单号的内容是否都已打印的条码
      for (let i = 0; i < this.wareList.length; i++) {
        // 校验当前是否存在未入库的单据
        if (this.wareList[i].status === 0) {
          this.$message.error('存在未打印的单据, 物料号: ' + this.wareList[i].goodsNumber + '，请先打印条码!');
          return;
        }
      }
      if (!this.wareForm.wareHouse) {
        this.$message.error('请选择要入库的位置!');
        return;
      }
      let obj = {
        'poNo': this.wareForm.poNo,
        'warehouseId': this.wareForm.warehouseId,
        'locationId': this.wareForm.locationId,
        'areaId': this.wareForm.areaId,
      }
      this.loading = true;
      this.disabledFlag = true;

      // TODO 校验表单数据
      await startWareHousing(obj).then(response => {
        if (response != "success") {
          this.$message.error(response);
          return;
        }
        this.$message.success('入库成功');
      }).finally(() => {
        this.getList();
        this.wareForm.poNo = '';
        this.wareList = [];
        this.wareOpen = false;
        this.loading = false;
        this.disabledFlag = false;
      });
    },
    handleBlur() {
      // 获取当前的采购单数据
      // 基于当前的采购单获取所有的物料数据
      if (!this.wareForm.poNo) {
        return;
      }
      if (this.wareForm.poNo && (this.wareForm.poNo.includes('{') || this.wareForm.poNo.includes('[') || this.wareForm.poNo.includes('}') || this.wareForm.poNo.includes(']')) && !this.wareForm.poNo.includes('"')) {
        this.wareForm.poNo = this.wareForm.poNo.trim();
        // 清理文本框内容的多余空格，并格式化为标准 JSON 格式
        this.wareForm.poNo = this.wareForm.poNo
          // 去除字段名和字段值之间的多余空格
          .replace(/\s*[:]\s*/g, ':')
          .replace(/\s*,\s*/g, ',')
          .replace(/\s*{\s*/g, '{')
          .replace(/\s*}\s*/g, '}')
          .replace(/\s*\[\s*/g, '[')
          .replace(/\s*\]\s*/g, ']');
        // 给键和字符串值加上双引号
        let formattedData = this.wareForm.poNo
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
          // 检查是否包含 po_no 属性
          if (transedData) {
            // 更新 wareForm.poNo
            this.wareForm.poNo = transedData.po_no;
          }
        } catch (error) {
          this.$message.error('扫描结果不是有效的 JSON 字符串');
        }

      }
      this.loading = true;
      getAllGoods(this.wareForm).then(response => {
        this.wareList = response.data;
        this.loading = false;
      });
    }
    ,
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
    }
    ,

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
    }
    ,
    handleScanResult(scanResult) {
      /*try {
        // 尝试解析 JSON 字符串
        const data = JSON.parse(scanResult);
        // 检查是否包含 po_no 属性
        if (data && data.po_no) {
          // 更新 wareForm.poNo
          this.wareForm.poNo = data.po_no;
        }
      } catch (error) {
        console.error('解析 JSON 出错:', error);
        this.$message.error('扫描结果不是有效的 JSON 字符串');
      }
      that.handleBlur(); // 基于当前的采购单获取所有的物料数据
    */
    }
    ,
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
                if (data && data.po_no) {
                  console.log("data.po_no:", data.po_no);
                  that.wareForm.poNo = data.po_no;
                } else {
                  console.log("data.po_no is undefined");
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
    }
    ,
// 停止扫描二维码
    stopScanning() {
      const stream = this.$refs.videoCameraPreview.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
    ,
// 显示摄像头预览弹出框
    showCameraPreview() {
      this.cameraPreviewVisible = true;
      this.startScanning();
    }
    ,
    handleInput(inputValue) {
      // 更新 scanResult
      this.scanResult = inputValue;
    },
    // 显示拆分弹出框
    async split() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择至少一项进行拆分');
        return;
      }
      if (!this.selectedRows[0].receiveNum) {
        this.$message.warning('请先填写收货数量');
        return;
      }

      /*let result = await checkOrigin(this.selectedRows[0].id);
      if(result.data !== 'success'){
        this.$message.warning('无法拆分非来源单据物料！');
        this.getList();
        return;
      }*/

      /*
      允许收获前拆分
      if (!this.selectedRows[0].status === 0) {
        this.$message.warning('请先收货！');
        return;
      }*/

      this.splitForm = {
        id: this.selectedRows[0].id,
        poNo: this.selectedRows[0].poNo,
        goodsNumber: this.selectedRows[0].goodsNumber,
        receiveNum: this.selectedRows[0].receiveNum,
        unitOfMeasure: this.selectedRows[0].unitOfMeasure
      };
      this.splitDetails = this.selectedRows.map(row => ({
        index: this.index,
        poNo: row.poNo,
        goodsNumber: row.goodsNumber,
        unitOfMeasure: row.unitOfMeasure,
        quantity: '' // 用户需要填写的数量
      }));
      this.splitDialogVisible = true;
    },
// 新增拆分行
    addSplitDetail() {
      // 判定当前数量是否允许再次拆分
      let receiveNum = parseFloat(this.splitForm.receiveNum); // 当前采购数量
      let totalQuantity = this.splitDetails.reduce((sum, detail) => {
        return sum + (parseFloat(detail.quantity) || 0);
      }, 0); // 拆分详情中已填写的数量总和
      if (totalQuantity >= receiveNum) {
        this.$message.error('拆分数量总和不能超过采购数量');
        return;
      }
      // 校验当前拆分表单是否为空
      console.log(this.splitDetails.length);

      this.index += 1;
      const newRow = {
        index: this.index,
        poNo: this.splitForm.poNo,
        goodsNumber: this.splitForm.goodsNumber,
        unitOfMeasure: this.splitForm.unitOfMeasure,
        quantity: ''
      };
      this.splitDetails.push(newRow);
    }
    ,
// 基于当前的采购数量追加拆分行
    addSplitDetailByCount() {
      // 追加弹出框等待用户确认, 确认后开始下一步操作
      this.$confirm('是否基于当前采购数量' + this.splitForm.receiveNum + '追加拆分行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.splitForm.receiveNum);
        let receiveNum = parseFloat(this.splitForm.receiveNum);
        let finList = [];
        let maxCount = 0;
        for (let i = 0; i < receiveNum; i++) {
          const newRow = {
            index: i + 1,
            poNo: this.splitForm.poNo,
            goodsNumber: this.splitForm.goodsNumber,
            unitOfMeasure: this.splitForm.unitOfMeasure,
            quantity: 1
          }
          finList.push(newRow);
          maxCount++;
        }
        this.index = maxCount + 1;
        this.splitDetails = finList;
      }).catch(() => {
        // 用户取消操作
      });
    },

// 删除拆分行
    removeSplitDetail(index) {
      this.splitDetails.splice(index, 1);
      this.splitDetails.forEach((item, idx) => {
        item.index = idx + 1;
      });
      // 更新index值为当前最大序号
      if (this.splitDetails.length > 0) {
        this.index = Math.max(...this.splitDetails.map(item => item.index));
      } else {
        this.index = 0; // 如果splitDetails为空，则重置index为0
      }
    },
// 提交拆分
    submitSplit() {
      // 校验拆分详情中的数量总和是否小于等于采购数量
      let totalQuantity = this.splitDetails.reduce((sum, detail) => {
        return sum + (parseFloat(detail.quantity) || 0);
      }, 0).toFixed(4);

      if (parseFloat(totalQuantity) > parseFloat(this.splitForm.receiveNum)) {
        this.$message.error('拆分数量总和不能超过采购数量');
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
      let obj = {
        'id': this.splitForm.id,
        'poNo': this.splitForm.poNo,
        'goodsNumber': this.splitForm.goodsNumber,
        'splitDetails': this.splitDetails
      }
      console.log(obj);
      this.loading = true;
      splitGoods(obj).then(response => {
        this.splitDialogVisible = false;
        this.getList();
        this.index = 1;
        this.$message.success('拆分成功');
        this.loading = false;
      });
    },
    // 显示按条件拆分弹出框
    conditionSplit() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择至少一项进行拆分');
        return;
      }
      if (!this.selectedRows[0].receiveNum) {
        this.$message.warning('请先填写收货数量');
        return;
      }
      this.splitConditionDialogVisible = true;
    },
    // 确认按条件拆分
    confirmConditionSplit() {
      // 校验拆分数量和拆分个数
      if (!this.splitConditionForm.splitQuantity || !this.splitConditionForm.splitCount) {
        this.$message.error('拆分数量和拆分个数不能为空');
        return;
      }
      const splitQuantity = parseFloat(this.splitConditionForm.splitQuantity); // 避免splitQuantity精度缺失， 取小数点后四位
      const splitCount = parseInt(this.splitConditionForm.splitCount, 10);
      let sum = splitQuantity * splitCount;

      if (sum.toFixed(4) > this.selectedRows[0].receiveNum) {
        this.$message.error('拆分数量乘以拆分个数不能大于当前的入库数量');
        return;
      }
      // 基于用户输入的拆分数量与拆分个数自动进行拆分
      this.splitDetails = [];
      for (let i = 0; i < splitCount; i++) {
        this.splitDetails.push({
          index: i + 1, // 同步序号信息,
          poNo: this.selectedRows[0].poNo,
          goodsNumber: this.selectedRows[0].goodsNumber,
          unitOfMeasure: this.selectedRows[0].unitOfMeasure,
          quantity: splitQuantity // 设置拆分数量
        });
      }
      this.index = this.splitDetails.length + 1; // 更新序号
      this.splitConditionDialogVisible = false; // 关闭按条件拆分弹出框
      this.splitDialogVisible = true; // 显示拆分详情弹出框
      // 清空拆分条数与拆分数量
      this.splitConditionForm.splitQuantity = '';
      this.splitConditionForm.splitCount = '';
    },
    cancelSplit() {
      this.splitConditionDialogVisible = false;
      this.splitConditionForm.splitQuantity = '';
      this.splitConditionForm.splitCount = '';
    },
    handleRowClick(row) {
      // 切换行的选中状态
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    // 收货
    async receive() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择至少一项进行拆分');
        return;
      }
      for (let i = 0; i < this.selectedRows.length; i++) {
        if (!this.selectedRows[i].receiveNum) {
          this.$message.warning('请先填写第' + (i + 1) + '行收货数量!');
          return;
        }
      }

      // 先收货再拆分
      // 允许用户跨采购单进行收货, 卡控仅允许选中相同的供应商信息
      // 循环当前选中行, 若当前行所有的供应商都一直, 则调用收货接口
      /* let poNo = this.selectedRows[0].poNo;
       for (let i = 0; i < this.selectedRows.length; i++) {
         if (this.selectedRows[i].poNo !== poNo) {
           this.$message.error('请选择相同的采购单进行收货');
           return;
         }
       }*/

      for (let i = 0; i < this.selectedRows.length; i++) {
        if (this.selectedRows[i].status !== 0) {
          this.$message.error('只允许勾选未收货状态的单据!');
          return;
        }
      }

      // 调用后台收货接口
      let obj = {
        'list': this.selectedRows,
      }

      try{
        await this.$confirm('确定收货吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        this.loading = true;
        this.disabledFlag = true;
        await receiving(obj).then(response => {
          if (response.data != "success") {
            this.$message.error("收货失败, 请联系系统管理员, 问题如下: ", response.data);
            return;
          }
          this.index = 1;
          this.$message.success('收货成功');
        }).catch(error => {
          this.$message.error("收货失败, 请联系系统管理员, 问题如下: ", error);
        }).finally(() => {
          this.getList();
          this.loading = false;
          this.disabledFlag = false;
        });
      }catch(error){
        this.$message.error(error);
        this.getList();
        this.loading = false;
        this.disabledFlag = false;
      }

    },
    // 省略其他计算属性
    tableRowClassName({row, rowIndex}) {
      if (row.quantity && row.receiveNum && row.receivedNum && row.receiveNum > 0) {
        return 'highlight-row';
      }
      return '';
    },

    async mergeGoods() {
      if (this.selectedRows.length < 2) {
        this.$message.warning('请至少选择两条记录进行合并');
        return;
      }

      // 检查是否包含已入库的商品
      const hasWarehoused = this.selectedRows.some(row => row.status === 3);
      if (hasWarehoused) {
        this.$message.error('已入库的商品不允许合并');
        return;
      }

      // 检查采购单号和物料编号是否一致
      const firstRow = this.selectedRows[0];
      const samePoAndItem = this.selectedRows.every(row =>
        row.poNo === firstRow.poNo && row.goodsNumber === firstRow.goodsNumber
      );

      if (!samePoAndItem) {
        this.$message.error('只能合并相同采购单和物料编号的商品');
        return;
      }

      // 检查未打印和已打印状态的ERP收货单号是否一致
      const hasUnprintedOrPrinted = this.selectedRows.some(row => row.status === 1 || row.status === 2);
      if (hasUnprintedOrPrinted) {
        const firstErpCode = this.selectedRows.find(row => row.status === 1 || row.status === 2)?.erpReceiveCode;
        const sameErpCode = this.selectedRows
          .filter(row => row.status === 1 || row.status === 2)
          .every(row => row.erpReceiveCode === firstErpCode);

        if (!sameErpCode) {
          this.$message.error('未打印和已打印状态的商品只能合并相同ERP收货单号的记录');
          return;
        }
      }

      try {
        await this.$confirm('确定要合并选中的商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        this.loading = true;
        const ids = this.selectedRows.map(row => row.id);
        const response = await mergeGoods({ ids });

        if (response.code === 0) {
          this.$message.success('合并成功');
          this.getList();
        } else {
          this.$message.error(response.msg || '合并失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('合并失败: ' + (error.msg || error.message || '未知错误'));
        }
      } finally {
        this.loading = false;
      }
    },

  },


}
;
</script>

<style scoped>
.highlight-row {
  background-color: #bae5ec;
}
</style>
