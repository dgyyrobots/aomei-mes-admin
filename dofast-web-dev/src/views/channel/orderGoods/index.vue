<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联的id" prop="refOid">
        <el-input v-model="queryParams.refOid" placeholder="请输入关联的id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="子订单id" prop="refOlId">
        <el-input v-model="queryParams.refOlId" placeholder="请输入子订单id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="平台SPU_ID" prop="refSpuId">
        <el-input v-model="queryParams.refSpuId" placeholder="请输入平台SPU_ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="平台SKU_ID" prop="refSkuId">
        <el-input v-model="queryParams.refSkuId" placeholder="请输入平台SKU_ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商家编码" prop="outerId">
        <el-input v-model="queryParams.outerId" placeholder="请输入商家编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="货品标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入货品标题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="货品规格" prop="standards">
        <el-input v-model="queryParams.standards" placeholder="请输入货品规格" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="售价合计" prop="totalSellPrice">
        <el-input v-model="queryParams.totalSellPrice" placeholder="请输入售价合计" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="原价合计" prop="totalPrice">
        <el-input v-model="queryParams.totalPrice" placeholder="请输入原价合计" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="原价" prop="price">
        <el-input v-model="queryParams.price" placeholder="请输入原价" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="售价" prop="sellPrice">
        <el-input v-model="queryParams.sellPrice" placeholder="请输入售价" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="应收金额" prop="totalFee">
        <el-input v-model="queryParams.totalFee" placeholder="请输入应收金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="单个商品应收金额" prop="singleFee">
        <el-input v-model="queryParams.singleFee" placeholder="请输入单个商品应收金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="数量" prop="num">
        <el-input v-model="queryParams.num" placeholder="请输入数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="子订单售后状态" prop="refundStatus">
        <el-select v-model="queryParams.refundStatus" placeholder="请选择子订单售后状态" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.DIAN3_SUB_REFUND_STATUS)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="子订单状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择子订单状态" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.DIAN3_ORDER_TYPE)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品图片URL" prop="picUrl">
        <el-input v-model="queryParams.picUrl" placeholder="请输入商品图片URL" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否赠品" prop="isFreeGift">
        <el-select v-model="queryParams.isFreeGift" placeholder="请选择是否赠品" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="关联用户ID" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入关联用户ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['channel:order-goods:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['channel:order-goods:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="订单商品" align="center" prop="id" />
      <el-table-column label="关联的id" align="center" prop="refOid" />
      <el-table-column label="子订单id" align="center" prop="refOlId" />
      <el-table-column label="平台SPU_ID" align="center" prop="refSpuId" />
      <el-table-column label="平台SKU_ID" align="center" prop="refSkuId" />
      <el-table-column label="商家编码" align="center" prop="outerId" />
      <el-table-column label="货品标题" align="center" prop="title" />
      <el-table-column label="货品规格" align="center" prop="standards" />
      <el-table-column label="售价合计" align="center" prop="totalSellPrice" />
      <el-table-column label="原价合计" align="center" prop="totalPrice" />
      <el-table-column label="原价" align="center" prop="price" />
      <el-table-column label="售价" align="center" prop="sellPrice" />
      <el-table-column label="应收金额" align="center" prop="totalFee" />
      <el-table-column label="单个商品应收金额" align="center" prop="singleFee" />
      <el-table-column label="数量" align="center" prop="num" />
      <el-table-column label="子订单售后状态" align="center" prop="refundStatus">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.DIAN3_SUB_REFUND_STATUS" :value="scope.row.refundStatus" />
        </template>
      </el-table-column>
      <el-table-column label="子订单状态" align="center" prop="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.DIAN3_ORDER_TYPE" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="商品图片URL" align="center" prop="picUrl" />
      <el-table-column label="是否赠品" align="center" prop="isFreeGift">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.isFreeGift" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联用户ID" align="center" prop="userId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['channel:order-goods:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['channel:order-goods:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联的id" prop="refOid">
          <el-input v-model="form.refOid" placeholder="请输入关联的id" />
        </el-form-item>
        <el-form-item label="子订单id" prop="refOlId">
          <el-input v-model="form.refOlId" placeholder="请输入子订单id" />
        </el-form-item>
        <el-form-item label="平台SPU_ID" prop="refSpuId">
          <el-input v-model="form.refSpuId" placeholder="请输入平台SPU_ID" />
        </el-form-item>
        <el-form-item label="平台SKU_ID" prop="refSkuId">
          <el-input v-model="form.refSkuId" placeholder="请输入平台SKU_ID" />
        </el-form-item>
        <el-form-item label="商家编码" prop="outerId">
          <el-input v-model="form.outerId" placeholder="请输入商家编码" />
        </el-form-item>
        <el-form-item label="货品标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入货品标题" />
        </el-form-item>
        <el-form-item label="货品规格" prop="standards">
          <el-input v-model="form.standards" placeholder="请输入货品规格" />
        </el-form-item>
        <el-form-item label="售价合计" prop="totalSellPrice">
          <el-input v-model="form.totalSellPrice" placeholder="请输入售价合计" />
        </el-form-item>
        <el-form-item label="原价合计" prop="totalPrice">
          <el-input v-model="form.totalPrice" placeholder="请输入原价合计" />
        </el-form-item>
        <el-form-item label="原价" prop="price">
          <el-input v-model="form.price" placeholder="请输入原价" />
        </el-form-item>
        <el-form-item label="售价" prop="sellPrice">
          <el-input v-model="form.sellPrice" placeholder="请输入售价" />
        </el-form-item>
        <el-form-item label="应收金额" prop="totalFee">
          <el-input v-model="form.totalFee" placeholder="请输入应收金额" />
        </el-form-item>
        <el-form-item label="单个商品应收金额" prop="singleFee">
          <el-input v-model="form.singleFee" placeholder="请输入单个商品应收金额" />
        </el-form-item>
        <el-form-item label="数量" prop="num">
          <el-input v-model="form.num" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="子订单售后状态" prop="refundStatus">
          <el-select v-model="form.refundStatus" placeholder="请选择子订单售后状态">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.DIAN3_SUB_REFUND_STATUS)" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="子订单状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择子订单状态">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.DIAN3_ORDER_TYPE)" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片URL" prop="picUrl">
          <el-input v-model="form.picUrl" placeholder="请输入商品图片URL" />
        </el-form-item>
        <el-form-item label="是否赠品" prop="isFreeGift">
          <el-radio-group v-model="form.isFreeGift">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value" :label="parseInt(dict.value)">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入关联用户ID" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createOrderGoods, updateOrderGoods, deleteOrderGoods, getOrderGoods, getOrderGoodsPage, exportOrderGoodsExcel } from '@/api/channel/orderGoods';

export default {
  name: 'OrderGoods',
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
      // 子订单列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        refOid: null,
        refOlId: null,
        refSpuId: null,
        refSkuId: null,
        outerId: null,
        title: null,
        standards: null,
        totalSellPrice: null,
        totalPrice: null,
        price: null,
        sellPrice: null,
        totalFee: null,
        singleFee: null,
        num: null,
        refundStatus: null,
        status: null,
        picUrl: null,
        isFreeGift: null,
        createTime: [],
        userId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        refOid: [{ required: true, message: '关联的id不能为空', trigger: 'blur' }],
        refOlId: [{ required: true, message: '子订单id不能为空', trigger: 'blur' }],
        refSpuId: [{ required: true, message: '平台SPU_ID不能为空', trigger: 'blur' }],
        refSkuId: [{ required: true, message: '平台SKU_ID不能为空', trigger: 'blur' }],
        outerId: [{ required: true, message: '商家编码不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '货品标题不能为空', trigger: 'blur' }],
        standards: [{ required: true, message: '货品规格不能为空', trigger: 'blur' }],
        totalSellPrice: [{ required: true, message: '售价合计不能为空', trigger: 'blur' }],
        totalPrice: [{ required: true, message: '原价合计不能为空', trigger: 'blur' }],
        price: [{ required: true, message: '原价不能为空', trigger: 'blur' }],
        sellPrice: [{ required: true, message: '售价不能为空', trigger: 'blur' }],
        totalFee: [{ required: true, message: '应收金额不能为空', trigger: 'blur' }],
        singleFee: [{ required: true, message: '单个商品应收金额不能为空', trigger: 'blur' }],
        num: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
        refundStatus: [{ required: true, message: '子订单售后状态不能为空', trigger: 'change' }],
        status: [{ required: true, message: '子订单状态不能为空', trigger: 'change' }],
        picUrl: [{ required: true, message: '商品图片URL不能为空', trigger: 'blur' }],
        isFreeGift: [{ required: true, message: '是否赠品不能为空', trigger: 'blur' }],
        // userId: [{ required: true, message: "关联用户ID不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getOrderGoodsPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        refOid: undefined,
        refOlId: undefined,
        refSpuId: undefined,
        refSkuId: undefined,
        outerId: undefined,
        title: undefined,
        standards: undefined,
        totalSellPrice: undefined,
        totalPrice: undefined,
        price: undefined,
        sellPrice: undefined,
        totalFee: undefined,
        singleFee: undefined,
        num: undefined,
        refundStatus: undefined,
        status: undefined,
        picUrl: undefined,
        isFreeGift: undefined,
        userId: undefined,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加子订单';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getOrderGoods(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改子订单';
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
          updateOrderGoods(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createOrderGoods(this.form).then(response => {
          this.$modal.msgSuccess('新增成功');
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal
        .confirm('是否确认删除子订单编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteOrderGoods(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm('是否确认导出所有子订单数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportOrderGoodsExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '子订单.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
