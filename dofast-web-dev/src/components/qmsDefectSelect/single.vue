<template>
  <el-dialog title="不良选择" v-if="showFlag" :visible.sync="showFlag" :modal="false" width="80%" center :append-to-body="appendToBody" :class="mainClass">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="生产工序" prop="processCode">
        <el-select v-model="queryParams.processCode" placeholder="请选择工序" clearable @change="handleQuery">
          <el-option v-for="item in processOptions" :key="item.processCode" :label="item.processName" :value="item.processCode" />
        </el-select>
      </el-form-item>

      <el-form-item label="不良描述" prop="defectName">
        <el-input v-model="queryParams.defectName" placeholder="请输入不良描述" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="检测项类型" prop="indexType">
        <el-select v-model="queryParams.indexType" placeholder="请选择检测项类型" clearable @change="handleQuery">
          <el-option v-for="dict in dict.type.mes_index_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="不良等级" prop="defectLevel">
        <el-select v-model="queryParams.defectLevel" placeholder="请选择不良等级" clearable  @change="handleQuery">
          <el-option v-for="dict in dict.type.mes_defect_level" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>



      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="qcdefectList" >

      <el-table-column width="55" align="center">
        <template v-slot="scope">
          <el-radio v-model="selectedDefectId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ '' }}</el-radio>
        </template>
      </el-table-column>

      <el-table-column label="不良描述" align="center" prop="defectName" :show-overflow-tooltip="true"/>
      <el-table-column label="工序名称" align="center" prop="processName" :show-overflow-tooltip="true"/>
      <el-table-column label="检测项类型" align="center" prop="indexType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_index_type" :value="scope.row.indexType"/>
        </template>
      </el-table-column>
      <el-table-column label="不良等级" align="center" prop="defectLevel">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_defect_level" :value="scope.row.defectLevel"/>
        </template>
      </el-table-column>
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['qms:defect:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['qms:defect:delete']">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList"/>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmSelect">确 定</el-button>
      <el-button @click="showFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {listQcdefect} from '@/api/mes/qc/qcdefect';
import {listProcess} from "@/api/mes/pro/process";
export default {
  name: 'DefectSelectSingle',
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    mainClass: {
      type: String,
      default: '',
    },
    processCode:{
      type: String,
      default: null,
    }
  },
  components: {},
  dicts: ['mes_index_type', 'mes_defect_level'],
  data() {
    return {
      showFlag: false,
      // 遮罩层
      loading: true,
      // 选中数组
      selectedDefectId: undefined,
      selectedRows: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 不良表格数据
      qcdefectList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        defectCode: null,
        defectName: null,
        indexType: null,
        defectLevel: null,
        processCode: null,
      },
      processOptions: [], // 工序选项
    };
  },
  watch: {
    processCode: {
      immediate: true,
      handler(newVal) {
        this.queryParams.processCode = newVal;
        if (this.showFlag) {
          this.queryParams.pageNo = 1;
          this.getList();
        }
      }
    },

    showFlag(newVal) {
      if (newVal) {
        // 对话框显示时，确保使用最新的processCode
        this.queryParams.processCode = this.processCode;
        this.getList();
      } else {
        // 对话框隐藏时重置选择
        this.selectedDefectId = undefined;
        this.selectedRows = [];
      }
    }
  },
  created() {
    this.getList();
    this.getProcess();
  },
  methods: {
    /** 查询不良列表 */
    getList() {
      console.log('queryParams', this.queryParams);
      this.loading = true;
      listQcdefect(this.queryParams).then(response => {
        this.qcdefectList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    handleCurrent(row) {
      if (row) {
        this.selectedRows = row;
      }
    },
    // 单选选中数据
    handleRowChange(row) {
      if (row) {
        this.selectedRows = row;
      }
    },
    //双击选中
    handleRowDbClick(row) {
      if (row) {
        this.selectedRows = row;
        this.$emit('onSelected', this.selectedRows);
        this.showFlag = false;
      }
    },
    //确定选中
    confirmSelect() {
      if (this.selectedDefectId == null || this.selectedDefectId == 0) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '请至少选择一条数据!',
        });
        return;
      }
      this.$emit('onSelected', this.selectedRows);
      this.showFlag = false;
    },
    getProcess() {
      // 初始化工序选项
      this.processOptions = [];
      listProcess().then(response => {
        this.processOptions = [
          // ...response.data.list,
          ...response.data.list.filter(item => item.processCode !== 'AM010'),
          { processCode: 'other', processName: '其他' }
        ];

      });
    },
  },
};
</script>
