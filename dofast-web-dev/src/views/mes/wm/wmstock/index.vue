<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="itemTypeName" placeholder="请输入分类名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="itemTypeOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>

      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
          <el-form-item label="产品物料编码" prop="itemCode">
            <el-input v-model="queryParams.itemCode" placeholder="请输入产品物料编码" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="产品物料名称" prop="itemName">
            <el-input v-model="queryParams.itemName" placeholder="请输入产品物料名称" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="入库批次号" prop="batchCode">
            <el-input v-model="queryParams.batchCode" placeholder="请输入入库批次号" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
<!--          <el-form-item label="仓库名称" prop="warehouseName">
            <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>-->

          <el-form-item label="仓库信息" prop="warehouse">
            <el-cascader v-model="queryParams.warehouse" :options="warehouseOptions" :props="warehouseProps" @change="handleWarehouseChanged"></el-cascader>
          </el-form-item>

          <el-form-item label="供应商编号" prop="vendorCode">
            <el-input v-model="queryParams.vendorCode" placeholder="请输入供应商编号" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="供应商名称" prop="vendorName">
            <el-input v-model="queryParams.vendorName" placeholder="请输入供应商名称" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="库存有效期" prop="expireDate">
            <el-date-picker clearable v-model="queryParams.expireDate" type="date" value-format="timestamp" placeholder="请选择库存有效期"> </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['wms:material-stock:export']" :loading="exportLoading">导出</el-button>
          </el-col>

          <el-col :span="1.5"><!-- v-hasPermi="['wms:material-stock:export']" -->
            <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="multiple" @click="batchPrint">批量打印</el-button>
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="wmstockList" @selection-change="handleSelectionChange" ref="multipleTable" @row-click="handleRowClick">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="产品物料编码" width="120px" align="center" prop="itemCode" />
          <el-table-column label="产品物料名称" width="150px" align="center" prop="itemName" :show-overflow-tooltip="true" />
          <el-table-column label="规格型号" align="center" prop="specification" :show-overflow-tooltip="true" />
          <el-table-column label="在库数量" align="center" prop="quantityOnhand" />
          <el-table-column label="单位" align="center" prop="unitOfMeasure" />
          <el-table-column label="入库批次号" width="100px" align="center" prop="batchCode" :show-overflow-tooltip="true" />
          <el-table-column label="仓库" width="120px" align="center" prop="warehouseName" :show-overflow-tooltip="true" />
          <el-table-column label="库区" width="150px" align="center" prop="locationName" :show-overflow-tooltip="true" />
          <el-table-column label="库位" width="150px" align="center" prop="areaName" :show-overflow-tooltip="true" />
          <el-table-column label="供应商编号" width="100px" align="center" prop="vendorCode" />
          <el-table-column label="供应商名称" width="120px" align="center" prop="vendorName" :show-overflow-tooltip="true" />
          <el-table-column label="供应商简称" width="100px" align="center" prop="vendorNick" />
          <el-table-column label="生产工单" width="180px" prop="workorderCode" :show-overflow-tooltip="true" />
          <el-table-column label="入库日期" align="center" prop="recptDate" width="120">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.recptDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="库存有效期" align="center" prop="expireDate" width="120">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.expireDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>



  </div>
</template>

<script>
import { listWmstock, getWmstock, delWmstock, addWmstock, updateWmstock , exportExcel} from '@/api/mes/wm/wmstock';
import { treeselect } from '@/api/mes/md/itemtype';
import Treeselect from '@riophae/vue-treeselect';
import {getTreeList} from '@/api/mes/wm/warehouse';
import '@/utils/CLodopfuncs2.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import {getGoods} from "@/api/purchase/goods";
export default {
  name: 'Wmstock',
  components: { Treeselect },
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
      itemTypeName: null,
      // 总条数
      total: 0,
      //物料产品分类树
      itemTypeOptions: undefined,
      // 库存记录表格数据
      wmstockList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      defaultProps: {},
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        itemTypeId: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
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
        vendorId: null,
        vendorCode: null,
        vendorName: null,
        vendorNick: null,
        quantityOnhand: null,
        workorderCode: null,
        expireDate: null,
        warehouse: null,
      },
      // 表单参数
      form: {},
      // 仓库数据
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
      },
      exportLoading: false
    };
  },
  watch: {
    // 根据名称筛选分类树
    itemTypeName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getWarehouseList();
  },
  methods: {
    /** 查询库存记录列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams);
      listWmstock(this.queryParams).then(response => {
        this.wmstockList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 查询分类下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.itemTypeOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.itemTypeId = data.id;
      this.handleQuery();
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
    /** 导出按钮操作 */
    handleExport() {
     /* this.download(
        'mes/wms/material-stock/export-excel',
        {
          ...this.queryParams,
        },
        `库存明细_${new Date().getTime()}.xlsx`,
      );*/

      this.$modal
        .confirm('是否确认导出所有库存数据?')
        .then(() => {
          this.exportLoading = true;
          return exportExcel({
            ...this.queryParams,
          });
        })
        .then(response => {
          this.$download.excel(response, '库存明细.xls');
          this.exportLoading = false;
        })
        .catch(() => { });

    },
    // 初始化仓库数据
    getWarehouseList() {
      getTreeList().then(response => {
        this.warehouseOptions = response.data;
        console.log(this.warehouseOptions);
      });
    },
    //选择默认的仓库、库区、库位
    handleWarehouseChanged(obj) {
      if (obj != null) {
        this.queryParams.warehouseId = obj[0]; // 仓库
        this.queryParams.locationId = obj[1];// 库区
        this.queryParams.areaId = obj[2]; // 库位
      }
    },

    async batchPrint() {
      await this.$modal.confirm('确认批量打印？');
      LODOP.PRINT_INITA(0, 0, 150, 100); // 初始化打印任务，纸张大小为150mm*100mm，单位：像素
      LODOP.SET_PRINT_PAGESIZE(2, "", "", "热敏纸"); // 设置纸张横向
      for (const queryId of this.ids) {
        let obj = {};
        // 根据当前勾选行Id获取条码内容
        await getWmstock(queryId).then(response => {
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
        LODOP.ADD_PRINT_TEXT(13, 0, 150, 30, "库存标签");

        // 内容样式及分块边框
        LODOP.SET_PRINT_STYLE("FontSize", 14);
        LODOP.SET_PRINT_STYLE("Bold", 0);
        LODOP.SET_PRINT_STYLE("Horient", 0); // 取消居中

        LODOP.ADD_PRINT_TEXT(65, 15, 120, 35, "条码编号:"); // 标签部分，距离左边10px
        LODOP.ADD_PRINT_TEXT(65, 120, 280, 35, obj.id); // 内容部分

        LODOP.ADD_PRINT_TEXT(110, 15, 120, 35, "物料料号:"); // 标签部分，距离左边10px
        LODOP.ADD_PRINT_TEXT(110, 120, 280, 35, obj.itemCode); // 内容部分

        LODOP.ADD_PRINT_TEXT(155, 15, 120, 35, "物料名称:");
        LODOP.ADD_PRINT_TEXT(155, 120, 280, 35, obj.itemName + obj.specification);

        LODOP.ADD_PRINT_TEXT(200, 15, 120, 35, "库位:");
        LODOP.ADD_PRINT_TEXT(200, 120, 280, 35, obj.locationName);

        LODOP.ADD_PRINT_TEXT(245, 15, 120, 35, "库存数量:");
        LODOP.ADD_PRINT_TEXT(245, 120, 280, 35, obj.quantityOnhand + obj.unitOfMeasure);

        LODOP.ADD_PRINT_TEXT(290, 15, 120, 35, "批次号:");
        LODOP.ADD_PRINT_TEXT(290, 120, 280, 35, obj.batchCode);

        LODOP.ADD_PRINT_TEXT(335, 15, 120, 35, "入库日期:");
        // let receiveTime = new Date(obj.receiveTime).toISOString().slice(0, 19).replace('T', ' '); // 收货日期

        const receiveDate = new Date(obj.createTime);
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
          "type": "warehouse"
        }
        LODOP.ADD_PRINT_BARCODE(220, 390, 170, 170, "QRCode", JSON.stringify(jsonQc));
      }
      LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1);
      LODOP.PREVIEW();
    },
    handleRowClick(row) {
      // 切换行的选中状态
      this.$refs.multipleTable.toggleRowSelection(row);
    },
  },
};
</script>
