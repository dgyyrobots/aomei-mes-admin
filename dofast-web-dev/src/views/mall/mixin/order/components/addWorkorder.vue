<template>
  <div class="app-container" style="border-left-width: 0">
    <div class="text-center text-6 text-bold" style="border-bottom: 1px solid #ccc; line-height: 45px; height: 40px">
      {{ title }}
    </div>
    <el-form :model="form" :rules="rules" ref="form" class="mt-5" label-width="90px">
      <el-form-item label="工单编号" prop="workorderCode">
        <el-input v-model="form.workorderCode" placeholder="请输入工单编号">
          <el-switch slot="append" v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成"
            @change="handleAutoGenChange(autoGenFlag)"></el-switch>
        </el-input>
      </el-form-item>
      <el-form-item label="工单名称" prop="workorderName">
        <el-input v-model="form.workorderName" placeholder="请输入工单名称" />
      </el-form-item>
      <el-form-item label="生产方" prop="isOut">
        <el-radio-group v-model="form.isOut">
          <el-radio :key="false" :label="false">自产</el-radio>
          <el-radio :key="true" :label="true">委外</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="来源类型" prop="orderSource" style="display: none">
        <el-radio-group v-model="form.orderSource">
          <el-radio v-for="dict in dict.type.mes_workorder_sourcetype" :key="dict.value" :label="dict.value">
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="订单编号" prop="sourceCode">
        <el-input v-model="form.sourceCode" placeholder="请输入订单编号" disabled="" />
      </el-form-item>
      <el-form-item label="单据状态" prop="status">
        <el-select v-model="form.status" disabled placeholder="请选择单据状态">
          <el-option v-for="dict in dict.type.mes_order_status" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品编号" prop="productCode">
        <el-input v-model="form.productCode" placeholder="请选择产品">
          <el-button slot="append" @click="handleSelectProduct" icon="el-icon-search"></el-button>
        </el-input>
        <ItemSelect ref="itemSelect" @onSelected="onItemSelected"></ItemSelect>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="form.productName" placeholder="请选择产品" disabled />
      </el-form-item>
      <el-form-item label="规格型号" prop="productSpc">
        <el-input v-model="form.productSpc" placeholder="请选择产品" />
      </el-form-item>
      <el-form-item label="单位" prop="unitOfMeasure">
        <el-input v-model="form.unitOfMeasure" placeholder="请选择产品" disabled />
      </el-form-item>
      <el-form-item label="工单数量" prop="quantity">
        <el-input-number :min="1" v-model="form.quantity" placeholder="请输入生产数量" />
      </el-form-item>
      <el-form-item label="需求日期" prop="requestDate">
        <el-date-picker clearable v-model="form.requestDate" type="date" value-format="timestamp"
          placeholder="请选择需求日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="批次号" prop="batchCode">
        <el-input v-model="form.batchCode" placeholder="请输入批次号" />
      </el-form-item>
      <el-form-item label="客户编码" prop="clientCode">
        <el-input v-model="form.clientCode" placeholder="请输入客户编码">
          <el-button slot="append" @click="handleSelectClient" icon="el-icon-search"></el-button>
        </el-input>
        <ClientSelect ref="clientSelect" @onSelected="onClientSelected"></ClientSelect>
      </el-form-item>
      <el-form-item label="客户名称" prop="clientName">
        <el-input v-model="form.clientName" readonly="readonly" placeholder="请输入客户名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="附件" prop="adjuncts" @paste.native.capture.prevent="handlePaste">
        <!-- ref="uploadMutiple" -->
        <file-upload v-model="form.adjuncts" ref="uploadMutiple" :file-type="adjunctTypes" :limit="20"
          :file-size="100"></file-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="addWorkorder">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ItemSelect from '@/components/itemSelect/single.vue';
import ClientSelect from '@/components/clientSelect/single.vue';
import { addWorkorder, getWorkorderList, listWorkorder, updateWorkorder } from '@/api/mes/pro/workorder';
import { genCode } from '@/api/mes/autocode/rule';
import FileUpload from '@/components/FileUpload/index2.vue';
import { getOrderRemarkList } from '@/api/mall/trade/orderRemark';
import { updateStat } from '@/api/mall/trade/mixinOrder'
export default {
  components: { FileUpload, ItemSelect, ClientSelect },
  dicts: ['mes_order_status', 'mes_workorder_sourcetype'],
  props: ['id', 'fj'],
  data() {
    return {
      title: '',
      adjunctTypes: null, // ['doc', 'xls', 'xlsx', 'ppt', 'txt', 'pdf', 'png', 'jpg', 'jpeg'],
      //
      autoGenFlag: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        workorderCode: [{ required: true, message: '工单编码不能为空', trigger: 'blur' }],
        workorderName: [{ required: true, message: '工单名称不能为空', trigger: 'blur' }],
        orderSource: [{ required: true, message: '来源类型不能为空', trigger: 'blur' }],
        productId: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
        productSpc: [{ required: true, message: '规格型号不能为空', trigger: 'blur' }],
        productCode: [{ required: true, message: '产品编号不能为空', trigger: 'blur' }],
        productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
        quantity: [{ required: true, message: '生产数量不能为空', trigger: 'blur' }],
        requestDate: [{ required: true, message: '需求日期不能为空', trigger: 'blur' }],
      },
    };
  },
  methods: {
    async addWorkorder() {
      console.log(this.id);
      await this.$refs['form'].validate();
      const { data } = await listWorkorder({ mixinOrderId: this.form.mixinOrderId, pageSize: 1, pageNo: 1 });
      if (data && data.total > 0) {
        await this.$modal.confirm(`该销售单已产生${data.total}条工单,你确定要继续创建工单吗?`).catch(e => {
          setTimeout(() => {
            this.$emit('cancel');
          }, 300);
          throw e;
        });
      }
      let datas = await addWorkorder(this.form);
      let datad = await updateStat({ id: this.id, state: 1 });
      console.log(datad);
      this.$modal.msgSuccess('新增成功');
      this.$emit('success');
    },
    resetWorkorderForm() {
      this.form = {
        id: null,
        workorderCode: null,
        workorderName: null,
        orderSource: 'ORDER',
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
        parentId: 0,
        status: 'PREPARE',
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        adjuncts: '',
        mixinOrderId: null,
        isOut: false,
      };
    },
    /** 查询生产工单下拉树结构 */
    getTreeselect() {
      listWorkorder().then(response => {
        this.workorderOptions = [];
        const data = { id: 0, workorderName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data.list, 'id', 'parentId');
        this.workorderOptions.push(data);
      });
    },
    async open(order) {
      this.resetWorkorderForm();
      console.log(order)
      if (order.pics.length > 0) {
        // 判断是否有图片，将图片带入
        console.log(order.pics);
        this.form.adjuncts = order.pics.map(item => item.url || item).filter(item => item).join(',');
        console.log(this.form.adjuncts);
      }
      this.getTreeselect();
      this.form.sourceCode = order.saleNo;
      this.form.mixinOrderId = order.id;
      this.form.requestDate = order.estimatedDeliveryTime ? order.estimatedDeliveryTime : '';
      this.form.workorderName = order.title;
      const { data: remarks } = await getOrderRemarkList({ mixin_order_id: order.id });
      this.form.remark = remarks[remarks.length - 1].remark;
      // this.form.remark = remarks
      //   .map(remark => {
      //     return remark.remark;
      //   })
      //   .join('\n');
      await this.$modal.alert('已自动将标题,备注,需求时间带入');

      this.title = '添加生产工单';
    },
    handleSelectProduct() {
      this.$refs.itemSelect.showFlag = true;
    },
    handleSelectClient() {
      this.$refs.clientSelect.showFlag = true;
    },
    //物料选择弹出框
    onItemSelected(obj) {
      if (obj != undefined && obj != null) {
        this.form.productId = obj.id;
        this.form.productCode = obj.itemCode;
        this.form.productName = obj.itemName;
        this.form.productSpc = obj.specification;
        this.form.unitOfMeasure = obj.unitOfMeasure;
      }
    },
    //客户选择弹出框
    onClientSelected(obj) {
      if (obj != undefined && obj != null) {
        this.form.clientId = obj.id;
        this.form.clientCode = obj.clientCode;
        this.form.clientName = obj.clientName;
      }
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        genCode('WORKORDER_CODE').then(response => {
          this.form.workorderCode = response;
        });
      } else {
        this.form.workorderCode = null;
      }
    },
    addAdjunct(url) {
      if (!this.form.adjuncts) {
        this.form.adjuncts = url;
        return;
      }
      if (this.form.adjuncts.split(',').indexOf(url) < 0) {
        this.form.adjuncts += ',' + url;
      }
    },
    handlePaste(event) {
      console.log('粘贴');
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;
      if (!items || items.length === 0) {
        this.$message.error("当前浏览器不支持本地");
        return;
      }
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) {
        this.$message.error("粘贴内容非图片");
        return;
      }
      // if (this.fileList.length >= this.limit) {
      //   this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`); // 图片数量超出
      //   return
      // }
      this.$refs.uploadMutiple.$refs.fileUpload.handleStart(file); // 将粘贴过来的图片加入预上传队列
      this.$refs.uploadMutiple.$refs.fileUpload.submit(); // 提交图片上传队列
    }
  },
};
</script>
