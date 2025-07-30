<template>
  <div class="app-container">
    <el-row v-if="optType != 'view'" :gutter="10" class="mb8">
      <el-col :span="4">
        <el-input
          v-model="purchaseId"
          placeholder="请输入"
          @focus="handleInputFocus"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          style="ime-mode: disabled"
        />

      </el-col>

      <el-col :span="3">
        <el-button type="primary" round @click="getCameraInfo()">摄像头</el-button>
      </el-col>

      <el-col :span="4">
          <el-input v-model="form.machineryName" placeholder="请选择设备信息" disabled>
            <el-button slot="append" icon="el-icon-search" @click="handleMachineryAdd"></el-button>
          </el-input>
        <MachinerySelectSingle ref="machinerySelect" @onSelected="onMachineryAdd"></MachinerySelectSingle>
      </el-col>


      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleBlur" v-hasPermi="['wms:issue-header:create']">新增 </el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['wms:issue-header:update']">修改 </el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['wms:issue-header:delete']">删除 </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleSwitchChange" v-hasPermi="['wms:issue-header:update']">启用 </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleCancleIssue" :disabled="disabledFlag" >撤销领料 </el-button>
      </el-col>

      <el-col :span="1.5"><!-- v-hasPermi="['wms:issue-header:erpInterface']" -->
        <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleIssueErp" :disabled="disabledFlag" >ERP领料</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table  ref="multipleTable"  v-loading="loading" :data="issuelineList" @selection-change="handleSelectionChange" @row-click="handleRowClick"><!--@row-click="handleRowClick"-->
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column label="条码编号" align="center" prop="barcodeNumber" />
      <el-table-column label="产品物料编码" width="120px" align="center" prop="itemCode" />
      <el-table-column label="产品物料名称" width="120px" align="center" prop="itemName" :show-overflow-tooltip="true" />
      <el-table-column label="产品物料规格" width="120px" align="center" prop="specification" :show-overflow-tooltip="true" />
      <el-table-column label="设备名称" align="center" prop="machineryName" />
      <el-table-column label="领料数量" align="center" prop="quantityIssued" />
      <el-table-column label="领料状态" align="center" prop="status" >
        <template v-slot="scope">
          <span v-if="scope.row.status === 'N'">未上料</span>
          <span v-else>已上料</span>
        </template>
      </el-table-column>

      <el-table-column label="启用状态" align="center" prop="enableFlag" >
        <template v-slot="scope">
          <el-switch
            disabled
            v-model="scope.row.enableFlag"
            active-value="true"
            active-color="#13ce66">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="报工状态" align="center" prop="feedbackStatus" >
        <template v-slot="scope">
          <span v-if="scope.row.feedbackStatus === 'N'">未报工</span>
          <span v-else>已报工</span>
        </template>
      </el-table-column>
      <el-table-column  width="180" label="批次号" align="center" prop="batchCode" />
      <el-table-column  width="180"  label="报工单" align="center" prop="feedbackCode" :show-overflow-tooltip="true" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />

      <el-table-column width="180" label="仓库名称" align="center" prop="warehouseName" />
      <el-table-column width="180" label="库区名称" align="center" prop="locationName" />
      <el-table-column width="180" label="库位名称" align="center" prop="areaName" />

      <el-table-column fixed="right"  label="领料人" align="center" prop="creator" />
      <el-table-column fixed="right"  label="领料时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="ERP状态" align="center" prop="erpEnable" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.erp_status" :value="scope.row.erpEnable" />
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center"  v-if="optType != 'view'" width="100px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="optType != 'view'" v-hasPermi="['wms:issue-header:update']">修改 </el-button>
-->
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-if="optType != 'view'" v-hasPermi="['wms:issue-header:delete']">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改生产领料单行对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品物料编码" prop="itemCode">
              <el-input v-model="form.itemCode" readonly="readonly" placeholder="请选择产品物料编码">
                <el-button slot="append" @click="handleSelectStock" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
            <StockSelect ref="stockSelect" :batchCode="batchCdoe" :vendorId="vendorId" @onSelected="onStockSelected"></StockSelect>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品物料名称" prop="itemName">
              <el-input v-model="form.itemName" readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料数量" prop="quantityIssued">
              <el-input-number :max="form.quantityMax" v-model="form.quantityIssued" placeholder="请输入领料数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="规格型号" prop="specification">
              <el-input v-model="form.specification" readonly="readonly" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input v-model="form.unitOfMeasure" readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批次号" prop="batchCode">
              <el-input v-model="form.batchCode" readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="仓库" prop="warehouseName">
              <el-input v-model="form.warehouseName" readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库区" prop="locationName">
              <el-input v-model="form.locationName" readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库位" prop="areaName">
              <el-input v-model="form.areaName" readonly="readonly" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 摄像头预览弹出框 -->
    <el-dialog title="摄像头预览" :visible.sync="cameraPreviewVisible" width="50%" v-dialogDrag append-to-body>
      <div>
        <video ref="videoCameraPreview" autoplay playsinline style="width: 100%; height: auto;"></video>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cameraPreviewVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listIssueline, getIssueline, delIssueline, addIssueline, updateIssueline , updateEnable, cancleIssue , checkMaxIssue , issueErp } from '@/api/mes/wm/issueline';
import StockSelect from '@/components/stockSelect/single.vue';
import jsQR from "jsqr";
import {getStockInfoByPurchaseId} from "@/api/purchase/goods";
import MachinerySelectSingle from "@/components/machinerySelect/single.vue";

export default {
  name: 'Issueline',
  components: {MachinerySelectSingle, StockSelect },
  dicts: ['erp_status'],
  props: {
    optType: null,
    issueId: null,
    warehouseId: null,
    locationId: null,
    areaId: null,
  },
  data() {
    return {
      batchCdoe: '',
      vendorId: '',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 选中行
      selectedRows: [],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 生产领料单行表格数据
      issuelineList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        issueId: this.issueId,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        quantityIssued: null,
        batchCode: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
      },
      // 表单参数
      form: {
        // 设备信息
        machineryName: '',
        machineryId: '',
        machineryCode: ''
      },
      // 表单校验
      rules: {
        itemId: [{ required: true, message: '产品物料不能为空', trigger: 'blur' }],
        quantityIssued: [{ required: true, message: '领料数量不能为空', trigger: 'blur' }],
      },
      //摄像头配置
      targetCameraId: null,
      videoWidth: 640,
      videoHeight: 480,
      cameraPreviewVisible: false, // 控制摄像头弹出框
      scanResult: '', // 存储扫描结果
      purchaseId: '', // 采购单ID
      disabledFlag: false,
      originalInputValue: '', // 保存原始输入值

      hasShownInputTip: false, // 标记是否已显示过提示
      compositionLock: false,  // 标记是否处于中文输入法组合状态
    };
  },
  created() {
    // 初始化时读取设备缓存
    this.loadMachineryCache()
    this.getList();
  },
  watch: {
    'purchaseId': function(newVal) {
      if(!newVal){
        return;
      }
      if (typeof newVal === 'string' && newVal.includes('{') && newVal.includes('}')) {
        console.log('输入内容包含完整的 "{" 和 "}"');
        let type = '';
        // 替换中文引号为英文引号，并解析 JSON
        newVal = newVal.replace(/“/g, '"').replace(/”/g, '"').replace(/：/g, ':').replace(/，/g, ',');
        // 移除零宽度非换行空格字符
        newVal = newVal.replace(/\uFEFF/g, '');
        // 直接解析 JSON 字符串
        const data = JSON.parse(newVal);
        // 检查是否包含 id 属性
        if (data) {
          this.purchaseId = data.id;
          type = data.type;
        }
        this.handleBlur(type);
      } else if(typeof newVal === 'string' && newVal.includes('-') && !newVal.includes('{') && !newVal.includes('}')){
        console.log('输入内容为批次号: ' + newVal);
      }else {
        console.log('输入内容不包含完整的 "{" 和 "}"');
      }
    }
  },
  methods: {
    /** 查询生产领料单行列表 */
    getList() {
      this.loading = true;
      listIssueline(this.queryParams).then(response => {
        this.issuelineList = response.data.list;
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
        issueId: this.issueId,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        quantityIssued: null,
        batchCode: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
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
      this.selectedRows = selection;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加生产领料单行';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const lineId = row.id || this.ids;
      getIssueline(lineId).then(response => {
        this.form = response.data;
        // this.warehouseInfo[0] = response.data.warehouseId;
        // this.warehouseInfo[1] = response.data.locationId;
        // this.warehouseInfo[2] = response.data.areaId;
        this.open = true;
        this.title = '修改生产领料单行';
      });
    },
    /** 提交按钮 */
    submitForm() {
      /*this.$refs['form'].validate(valid => {
        if (valid) {
          console.log(("新增:" + this.form));
          console.log(this.form);

          if (this.form.id != null) {
            updateIssueline(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addIssueline(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });*/
      this.handleBlur();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const lineIds = row.id || this.ids;
      const status = row.status
      if (status === 'Y') {
        this.$modal.msgError('已领料 ，不能删除');
        return;
      }
      this.$modal
        .confirm('是否确认删除生产领料单行编号为"' + lineIds + '"的数据项？')
        .then(function () {
          return delIssueline(lineIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
    handleSelectStock() {
      this.$refs.stockSelect.showFlag = true;
      this.$refs.stockSelect.getList();
    },
    //物料选择弹出框
    onStockSelected(obj) {
      if (obj != undefined && obj != null) {
        this.form.materialStockId = obj.id;
        this.form.itemId = obj.itemId;
        this.form.itemCode = obj.itemCode;
        this.form.itemName = obj.itemName;
        this.form.specification = obj.specification;
        this.form.unitOfMeasure = obj.unitOfMeasure;
        this.form.batchCode = obj.batchCode;
        this.form.warehouseId = obj.warehouseId;
        this.form.warehouseCode = obj.warehouseCode;
        this.form.warehouseName = obj.warehouseName;
        this.form.locationId = obj.locationId;
        this.form.locationCode = obj.locationCode;
        this.form.locationName = obj.locationName;
        this.form.areaId = obj.areaId;
        this.form.areaCode = obj.areaCode;
        this.form.areaName = obj.areaName;
        this.form.quantityIssued = obj.quantityOnhand;
        this.form.quantityMax = obj.quantityOnhand;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'wm/issueline/export',
        {
          ...this.queryParams,
        },
        `issueline_${new Date().getTime()}.xlsx`,
      );
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
    scanQRCode() {
      const that = this;
      const video = this.$refs.videoCameraPreview;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      let type = '';
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
                // 检查是否包含 id 属性
                if (data && data.id) {
                  console.log("data.id:", data.id);
                  that.purchaseId = data.id;
                  type = data.type;
                } else {
                  console.log("data.id is undefined");
                }
              } catch (error) {
                that.$message.error('扫描结果不是有效的 JSON 字符串');
              }
              that.handleBlur(type); // 基于当前的采购单获取所有的物料数据
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
    },
    // 显示摄像头预览弹出框
    showCameraPreview() {
      this.cameraPreviewVisible = true;
      this.startScanning();
    },

    handleBlur: function(type) {
      console.log("当前选中的设备信息: ",  this.form.machineryId, this.form.machineryCode, this.form.machineryName);

      if(!this.form.machineryId){
        this.$message.error(`请选择领料机台`);
        this.purchaseId = null;
        return;
      }

      let finType = '';
      let batchCode = '';
      if(type){
        finType = type;
      }
      // 基于当前的采购单获取所有的物料数据
      if (!this.purchaseId) {
        return;
      }
      if (isNaN(this.purchaseId)) {
        if ((this.purchaseId.includes('{') || this.purchaseId.includes('[') || this.purchaseId.includes('}') || this.purchaseId.includes(']'))) {
          this.purchaseId = this.purchaseId.trim();
          // 清理文本框内容的多余空格，并格式化为标准 JSON 格式
          this.purchaseId = this.purchaseId
            // 去除字段名和字段值之间的多余空格
            .replace(/\s*[:]\s*/g, ':')
            .replace(/\s*,\s*/g, ',')
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*\[\s*/g, '[')
            .replace(/\s*\]\s*/g, ']');
          // 给键和字符串值加上双引号
          let formattedData = this.purchaseId
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
            // 检查是否包含 id 属性
            if (transedData) {
              // 更新 purchaseId
              this.purchaseId = transedData.id;
              finType = transedData.type;
            }
          } catch (error) {
            this.$message.error('扫描结果不是有效的 JSON 字符串');
            return; // 如果 JSON 解析失败，直接返回
          }
        } else if(this.purchaseId.includes('-') && !this.purchaseId.includes('{') && !this.purchaseId.includes('}')){
          console.log('输入内容包含完整的"-" ', this.purchaseId);
          batchCode = this.purchaseId;
          finType = null;

        }
      }
      if(!finType && !batchCode){
        this.$message.error('未获取到条码类型, 请切换为英文输入法!');
        this.purchaseId = null;
        return;
      }

      let obj = {
        'id': Number.parseInt(this.purchaseId),
        'type': finType,
        'batchCode': batchCode
      }
      // 获取当前采购单身信息
      getStockInfoByPurchaseId(obj).then(response => {
        console.log("当前物料信息: ", response.data);
        let barcodeNumber = null;
        if(!batchCode){
          barcodeNumber = this.purchaseId;
        }
        this.purchaseId = null;
        let obj = response.data;
        // 追加生产领料表单身信息
        obj.quantityIssued = obj.quantityOnhand;
        const isItemExists = this.issuelineList.some(item => item.itemCode === obj.itemCode && item.batchCode === obj.batchCode);
        // 如果物料Id不存在，则添加到this.allocatedList
        if (!isItemExists) {
          // 将当前数据传入领料单单身表
          obj.issueId = this.issueId;
          obj.barcodeNumber = barcodeNumber;
          obj.machineryId = this.form.machineryId;
          obj.machineryCode = this.form.machineryCode;
          obj.machineryName = this.form.machineryName;
          let count = -1;
          // 校验当前物料是否以61开头
          if (obj.itemCode.startsWith('61')) {
            // 开始获取单身绑定报工单个数
            checkMaxIssue(obj).then(response => {
              console.log("获取的膜类物料对应报工单个数: ", response);
              count = response.data;
              if(count > 0){
                this.$confirm('当前已存在膜类物料, 绑定报工单个数为:  ' + count + ' 个, 是否继续上料?', '警告', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async () => {
                  addIssueline(obj).then(response => {
                    this.$modal.msgSuccess('新增成功');
                    this.getList();
                  });
                });
              }else{
                addIssueline(obj).then(response => {
                  this.$modal.msgSuccess('新增成功');
                  this.getList();
                });
              }
            }).catch(error => {
              console.log("error: ", error);
              this.$message.error(`获取报工单个数失败!`);
              return; // 如果 checkMaxIssue 报错，直接返回
            });
          } else {
            // 如果物料不以61开头，直接添加
            addIssueline(obj).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.getList();
            });
          }
        } else {
          this.$message.error(`物料唯一码已存在，请勿添加重复项。`);
        }
      }).catch(error => {
        console.log(error);
        this.$message.error(`获取物料信息失败!`);
        this.purchaseId = null;
      });
    },
    handleRowClick(row) {
      // 切换行的选中状态
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleSwitchChange(row) {
      const selectedRows = row ? [row] : this.selectedRows;
      const ids = row.id || this.ids;
      if (!ids || ids.length === 0) {
        this.$message.error(`请至少选中一行数据!`);
        return;
      }

      // 检查所有选中行状态
      const hasInvalidRow = selectedRows.some(item => {
        console.log("item: " , item);
        if(item.status === 'N') {
          this.$message.error(`存在未上料的物料，无法启用!`);
          return true;
        }
        return false;
      });

      if(hasInvalidRow) return;

      this.$confirm('是否确认变更物料状态?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        updateEnable(ids).then(response => {
          this.$message.success(`物料状态变更成功!`);
          this.getList();
        }).catch(error => {
          console.log(error);
          this.$message.error(`启用失败!`);
          this.getList();
        });
      });

    },
    handleMachineryAdd() {
      this.$refs.machinerySelect.showFlag = true;
    },

    // 加载设备缓存
    loadMachineryCache() {
      try {
        const cached = localStorage.getItem('cachedMachinery')
        if (cached) {
          const { id, code, name } = JSON.parse(cached)
          this.form.machineryId = id
          this.form.machineryCode = code
          this.form.machineryName = name
        }
      } catch (e) {
        console.error('设备缓存读取失败', e)
        localStorage.removeItem('cachedMachinery')
      }
    },

    // 设备选择回调
    onMachineryAdd(rows) {
      if (rows) {
        this.form.machineryId = rows.id
        this.form.machineryCode = rows.machineryCode
        this.form.machineryName = rows.machineryName

        // 保存到缓存
        localStorage.setItem('cachedMachinery', JSON.stringify({
          id: rows.id,
          code: rows.machineryCode,
          name: rows.machineryName
        }))
      } else {
        this.clearMachineryCache()
      }
    },

    // 清理设备缓存
    clearMachineryCache() {
      localStorage.removeItem('cachedMachinery')
      this.form.machineryId = ''
      this.form.machineryCode = ''
      this.form.machineryName = ''
    },
    handleCancleIssue(){
      const ids = this.ids;
      if(!ids || ids.length === 0){
        this.$message.error(`请至少选中一行数据!`);
        return;
      }

      // 获取当前选中行信息
      const selectedRows = this.selectedRows;
      // 仅允许选取已上料未报工的单据行信息
      for (const row of selectedRows) {
        console.log("row:", row);
        if (row.status != 'Y' || row.feedbackStatus != 'N') {
          this.$message.error('请勾选已上料未报工的单据进行撤销!');
          return;
        }

        /*if (row.erp_status != 'Y') {
          this.$message.error('请勾选同步ERP的单据进行撤销!');
          return;
        }*/
      }
      this.$confirm('是否确认撤销?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true;
        this.disabledFlag = true;
        await cancleIssue(ids).then(response => {
          this.$message.success(`撤销成功!`);
        }).catch(error => {
          this.$message.error(`撤销失败!`);
        }).finally(()=>{
          this.loading = true;
          this.getList();
          this.disabledFlag = true;
        })
      });

    },
    handleIssueErp(row){
      const ids = this.ids;
      if(!ids || ids.length === 0){
        this.$message.error(`请至少选中一行数据!`);
        return;
      }

      // 获取当前选中行信息
      const selectedRows = this.selectedRows;

      // 仅允许选取已上料未同步ERP的单据行信息
      for (const row of selectedRows) {
        if (row.status !== 'Y' || row.erpEnable !== 'N') {
          this.$message.error('请勾选已上料未同步ERP的单据进行领料!');
          return;
        }
      }

      this.$confirm('是否确认ERP领料?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true;
        this.disabledFlag = true;
        await issueErp(ids).then(response => {
          this.$message.success(`接口调用成功!`);
        }).catch(error => {
          this.$message.error(`接口调用失败! : ` + error);
        }).finally(()=>{
          this.loading = false;
          this.disabledFlag = false;
          this.getList();
        });
      });
    },

    handleInputFocus() {
      this.$message.info('请切换为英文输入法（半角状态）');
    },

    // 处理输入法开始事件
    handleCompositionStart() {
      this.compositionLock = true;
    },

    // 处理输入法结束事件
    handleCompositionEnd(event) {
      this.compositionLock = false;
      this.$nextTick(() => {
        this.handleInputChange(this.purchaseId);
      });
    },

    // 处理输入变化
    handleInputChange(value) {
      if (this.compositionLock) return;

      // 检查是否包含中文字符
      if (/[\u4e00-\u9fa5]/.test(value)) {
        this.$message.warning('请使用英文输入法输入');
        this.purchaseId = this.originalInputValue;
        return;
      }

      this.originalInputValue = value;

      // 当输入框内容变化时，尝试自动处理
      if (value && value.includes('{') && value.includes('}')) {
        this.tryParseInput(value);
      }
    },

    // 尝试解析输入内容
    tryParseInput(input) {
      try {
        // 替换中文标点并移除特殊字符
        const cleanedInput = input
          .replace(/“/g, '"')
          .replace(/”/g, '"')
          .replace(/：/g, ':')
          .replace(/，/g, ',')
          .replace(/\uFEFF/g, '')
          .trim();

        // 解析JSON
        const data = JSON.parse(cleanedInput);

        if (data && data.id) {
          this.purchaseId = data.id;
          this.handleBlur(data.type);
        }
      } catch (error) {
        // 解析失败时不处理，等待用户继续输入
      }
    },


  },
};
</script>

