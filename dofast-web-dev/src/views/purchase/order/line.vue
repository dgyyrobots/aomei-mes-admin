<template>
  <div class="app-container">

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column label="单据编码" align="center" prop="id"/>
      <el-table-column :show-overflow-tooltip="true" label="采购单号" width="220" align="center" prop="poNo"/>
      <el-table-column :show-overflow-tooltip="true" label="商品编号" width="220" align="center" prop="goodsNumber"/>
      <el-table-column :show-overflow-tooltip="true" label="商品名称" width="230" align="center" prop="goodsName"/>
      <el-table-column :show-overflow-tooltip="true" label="商品规格" width="150" align="center" prop="goodsSpecs"/>
      <el-table-column label="商品单位" align="center" prop="company"/>
      <el-table-column label="采购数量" align="center" width="110" prop="quantity"/>
      <el-table-column label="收货数量" align="center" width="110" prop="receiveNum"/>
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
      <el-table-column label="操作" align="center"  v-if="optType != 'view'" width="100px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="optType != 'view'" v-hasPermi="['purchase:goods:update']">修改 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

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
            <el-form-item label="收货单位" width="100%" prop="receiveNum">
              <el-select filterable clearable v-model="form.unitOfMeasure"  placeholder="请选择">
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

  </div>
</template>

<script>
import StockSelect from '@/components/stockSelect/single.vue';
import {createGoods, updateGoods, deleteGoods, getGoods, getGoodsPage, getAllGoods, exportGoodsExcel, updateReceiveStatus, startWareHousing, splitGoods, getPurchaseBarCode , checkConfig , batchUpdateReceiveStatus} from '@/api/purchase/goods';
import {listAllUnitmeasure} from "@/api/mes/md/unitmeasure";

export default {
  name: 'GoodsLine',
  components: { StockSelect },
  dicts: ['purchase_status'],
  props: {
    optType: null,
    purchaseId: null,
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 单行表格数据
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        purchaseId: this.purchaseId,
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
      selectedRows: [], // 选中行
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemId: [{ required: true, message: '产品物料不能为空', trigger: 'blur' }],
        quantityIssued: [{ required: true, message: '领料数量不能为空', trigger: 'blur' }],
      },
      unitOptions: [], // 单位下拉列表

    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询生产领料单行列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getGoodsPage(this.queryParams).then(response => {
        console.log(response);
        this.list = response.data.list;
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
      this.selectedRows = selection;
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      console.log(row);
      // 追加校验, 禁止修改已入库的单据
      if (row.status === 2) {
        this.$modal.msgError('该单据已入库，禁止修改！');
        return;
      }

      await listAllUnitmeasure().then(response => {
        this.unitOptions = response.data;
      });

      getGoods(id).then(response => {
        this.form = response.data;
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
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
      });
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

  },
};
</script>
