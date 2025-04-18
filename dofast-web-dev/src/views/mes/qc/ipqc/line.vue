<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="ipqclineList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="检测项名称" width="120px" align="center" prop="indexName" />
      <el-table-column label="检测项类型" width="100px" align="center" prop="indexType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_index_type" :value="scope.row.indexType" />
        </template>
      </el-table-column>
      <el-table-column label="检测工具" align="center" prop="qcTool" />
      <el-table-column label="检测要求" align="center" prop="checkMethod" />
      <el-table-column label="标准值" align="center" prop="standerVal" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="误差上限" align="center" prop="thresholdMax" />
      <el-table-column label="误差下限" align="center" prop="thresholdMin" />
      <el-table-column label="致命缺陷数量" align="center" prop="crQuantity" />
      <el-table-column label="严重缺陷数量" align="center" prop="majQuantity" />
      <el-table-column label="轻微缺陷数量" align="center" prop="minQuantity" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDefect(scope.row)" v-hasPermi="['qms:ipqc-line:update']" v-if="optType != 'view'">缺陷记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <Defectrecord ref="defectDialog" :qcId="defect_qcid" :lineId="defect_qclineid" :qcType="defect_qctype" :optType="optType"></Defectrecord>
  </div>
</template>

<script>
import { listIpqcline, getIpqcline, delIpqcline, addIpqcline, updateIpqcline } from '@/api/mes/qc/ipqcline';
import Defectrecord from '../defectrecord/index.vue';
export default {
  name: 'Ipqcline',
  dicts: ['mes_index_type'],
  props: {
    ipqcId: null,
    optType: undefined,
  },
  components: { Defectrecord },
  data() {
    return {
      defect_qcid: null,
      defect_qclineid: null,
      defect_qctype: 'IPQC',
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
      // 过程检验单行表格数据
      ipqclineList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        ipqcId: this.ipqcId,
        indexId: null,
        indexCode: null,
        indexName: null,
        indexType: null,
        qcTool: null,
        checkMethod: null,
        standerVal: null,
        unitOfMeasure: null,
        thresholdMax: null,
        thresholdMin: null,
        crQuantity: null,
        majQuantity: null,
        minQuantity: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ipqcId: [{ required: true, message: '检验单ID不能为空', trigger: 'blur' }],
        indexId: [{ required: true, message: '检测项ID不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询过程检验单行列表 */
    getList() {
      this.loading = true;
      listIpqcline(this.queryParams).then(response => {
        this.ipqclineList = response.data.list;
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
        ipqcId: null,
        indexId: null,
        indexCode: null,
        indexName: null,
        indexType: null,
        qcTool: null,
        checkMethod: null,
        standerVal: null,
        unitOfMeasure: null,
        thresholdMax: null,
        thresholdMin: null,
        crQuantity: null,
        majQuantity: null,
        minQuantity: null,
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
    },
    //缺陷记录
    handleDefect(row) {
      this.defect_qcid = row.ipqcId;
      this.defect_qclineid = row.id;
      this.$nextTick(() => {
        this.$refs.defectDialog.showFlag = true;
        this.$refs.defectDialog.getList();
      });
    },
  },
};
</script>
