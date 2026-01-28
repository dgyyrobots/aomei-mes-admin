<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="采购单号" prop="poNo">
        <el-input v-model="queryParams.poNo" placeholder="请输入采购单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['purchase:order:create']">新增</el-button>
      </el-col>-->
<!--      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['purchase:order:export']">导出</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="single" @click="printTitle" v-hasPermi="['purchase:goods:print']">单据打印</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="采购单号" align="center" prop="poNo" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['purchase:order:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['purchase:order:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="65%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购单号" prop="poNo">
              <el-input disabled v-model="form.poNo" placeholder="请输入采购单号"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注" />
        </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-divider v-if="form.id != null" content-position="center">采购明细</el-divider>
      <el-card shadow="always" v-if="form.id != null" class="box-card">
        <GoodsLine ref="line" :purchaseId="form.id"  :optType="optType"></GoodsLine>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createOrder, updateOrder, deleteOrder, getOrder, getOrderPage, exportOrderExcel } from '@/api/purchase/order';
import GoodsLine from "@/views/purchase/order/line.vue";
import {checkConfig} from "@/api/purchase/goods";
import '@/utils/CLodopfuncs2.js';
export default {
  name: 'Order',
  components: {GoodsLine},
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
      // 采购订单列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        supplierId: null,
        supplierContact: null,
        supplierPhone: null,
        purchaseAmount: null,
        poNo: null,
        paymentType: null,
        returnGoods: null,
        processType: null,
        remarks: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      optType: undefined,
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
      getOrderPage(this.queryParams).then(response => {
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
        supplierId: undefined,
        supplierContact: undefined,
        supplierPhone: undefined,
        purchaseAmount: undefined,
        id: undefined,
        poNo: undefined,
        paymentType: undefined,
        returnGoods: undefined,
        processType: undefined,
        remarks: undefined,
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
      this.title = '添加采购订单';
      this.optType = 'add';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改采购订单';
        this.optType = 'edit';
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
          updateOrder(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createOrder(this.form).then(response => {
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
        .confirm('是否确认删除采购订单编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteOrder(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm('是否确认导出所有采购订单数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportOrderExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '采购订单.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectedRows = selection;
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    async printTitle() {
      // 校验当前采购单号下所有单身是否配置单位与收货数量
      let result = await checkConfig(this.selectedRows[0].poNo);
      if (!result){
        this.$message.error('采购单: '+ this.selectedRows[0].poNo +'存在未配置单位与收货数量的明细信息，请先配置后打印！');
        return;
      }
      if (!Array.isArray(result.data)) {
        console.error("结果不是一个数组: ", result);
        return;
      }

      await this.$modal.confirm('确认打印？');
      console.log("开始循环: "+ result);

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
        LODOP.SET_PRINT_STYLE("FontSize", 12);
        LODOP.ADD_PRINT_TEXT(155, 120, 490, 35, obj.goodsName);

        LODOP.SET_PRINT_STYLE("FontSize", 14);
        LODOP.ADD_PRINT_TEXT(200, 15, 120, 35, "采购单号:");
        LODOP.ADD_PRINT_TEXT(200, 120, 280, 35, obj.poNo);

        LODOP.ADD_PRINT_TEXT(245, 15, 120, 35, "收货数量:");
        LODOP.ADD_PRINT_TEXT(245, 120, 280, 35, obj.receiveNum);

        LODOP.ADD_PRINT_TEXT(290, 15, 120, 35, "收货单位:");
        LODOP.ADD_PRINT_TEXT(290, 120, 280, 35, obj.unitOfMeasure);

        LODOP.ADD_PRINT_TEXT(335, 15, 120, 35, "收货日期:");
        let receiveTime = new Date(obj.receiveTime).toISOString().slice(0, 19).replace('T', ' '); // 退料日期
        LODOP.ADD_PRINT_TEXT(335, 120, 280, 35, receiveTime);
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
  },
};
</script>
