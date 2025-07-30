<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="iqclineList" @selection-change="handleSelectionChange">
      <el-table-column fixed="left" label="检测项名称" width="100px" align="center" prop="indexName" />
      <el-table-column fixed="left" label="检测项类型" width="100px" align="center" prop="indexType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_index_type" :value="scope.row.indexType" />
        </template>
      </el-table-column>
      <el-table-column label="检测工具" align="center" prop="qcTool" />
      <el-table-column label="检测要求" align="center" prop="checkMethod" :show-overflow-tooltip="true" />
      <el-table-column label="标准值" align="center" prop="standerVal" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="误差上限" align="center" prop="thresholdMax" />
      <el-table-column label="误差下限" align="center" prop="thresholdMin" />
<!--      <el-table-column width="120px" label="致命缺陷数量" align="center" prop="crQuantity" />
      <el-table-column width="120px" label="严重缺陷数量" align="center" prop="majQuantity" />
      <el-table-column width="120px" label="轻微缺陷数量" align="center" prop="minQuantity" />-->

<!--      <el-table-column width="120px" label="致命缺陷数量" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.crQuantity"
            :min="0"
            :step="0.1"
            :precision="4"
            :disabled="optType === 'view'"
            @change="(value) => handleQuantityChange(scope.row, 'crQuantity', value)"
            size="mini"
            controls-position="right"
          />
        </template>
      </el-table-column>

      <el-table-column width="120px" label="严重缺陷数量" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.majQuantity"
            :min="0"
            :step="0.1"
            :precision="4"
            :disabled="optType === 'view'"
            @change="(value) => handleQuantityChange(scope.row, 'majQuantity', value)"
            size="mini"
            controls-position="right"
          />
        </template>
      </el-table-column>

      <el-table-column width="120px" label="轻微缺陷数量" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.minQuantity"
            :min="0"
            :step="0.1"
            :precision="4"
            :disabled="optType === 'view'"
            @change="(value) => handleQuantityChange(scope.row, 'minQuantity', value)"
            size="mini"
            controls-position="right"
          />
        </template>
      </el-table-column>-->

<!--
      <el-table-column width="120px" label="检验结果1" align="center" prop="inspectionValue1" />
      <el-table-column width="120px" label="检验结果2" align="center" prop="inspectionValue2" />
      <el-table-column width="120px" label="检验结果3" align="center" prop="inspectionValue3" />
      <el-table-column width="120px" label="检验结果4" align="center" prop="inspectionValue4" />
      <el-table-column width="120px" label="检验结果5" align="center" prop="inspectionValue5" />
-->

      <el-table-column label="检验数值1" width="120px" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.inspectionValue1"
            :min="0"
            :step="0.1"
            :precision="4"
            :disabled="optType === 'view'"
            @change="(value) => handleQuantityChange(scope.row, 'inspectionValue1', value)"
            size="mini"
            controls-position="right"
          />
        </template>
      </el-table-column>

      <el-table-column label="检验数值2" width="120px" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.inspectionValue2"
            :min="0"
            :step="0.1"
            :precision="4"
            :disabled="optType === 'view'"
            @change="(value) => handleQuantityChange(scope.row, 'inspectionValue2', value)"
            size="mini"
            controls-position="right"
          />
        </template>
      </el-table-column>

      <el-table-column label="检验数值3" width="120px" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.inspectionValue3"
            :min="0"
            :step="0.1"
            :precision="4"
            :disabled="optType === 'view'"
            @change="(value) => handleQuantityChange(scope.row, 'inspectionValue3', value)"
            size="mini"
            controls-position="right"
          />
        </template>
      </el-table-column>

      <el-table-column label="检验数值4" width="120px" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.inspectionValue4"
            :min="0"
            :step="0.1"
            :precision="4"
            :disabled="optType === 'view'"
            @change="(value) => handleQuantityChange(scope.row, 'inspectionValue4', value)"
            size="mini"
            controls-position="right"
          />
        </template>
      </el-table-column>

      <el-table-column label="检验数值5" width="120px" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.inspectionValue5"
            :min="0"
            :step="0.1"
            :precision="4"
            :disabled="optType === 'view'"
            @change="(value) => handleQuantityChange(scope.row, 'inspectionValue5', value)"
            size="mini"
            controls-position="right"
          />
        </template>
      </el-table-column>

      <!-- 检验结果列 -->
      <el-table-column label="检验结果" width="120px" align="center">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.inspectionResult"
            placeholder="请选择"
            :disabled="optType === 'view'"
            @change="(value) => handleQuantityChange(scope.row, 'inspectionResult', value)"
            size="mini"
          >
            <el-option
              v-for="dict in dict.type.mes_qc_result"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </template>
      </el-table-column>

<!--      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDefect(scope.row)" v-hasPermi="['qms:iqc-line:update']" v-if="optType != 'view'">缺陷记录</el-button>
        </template>
      </el-table-column>-->

    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <Defectrecord ref="defectDialog" :qcId="defect_iqcid" :lineId="defect_lineid" :qcType="defect_qctype" :optType="optType"></Defectrecord>
  </div>
</template>

<script>
import { listIqcline, getIqcline, delIqcline, addIqcline, updateIqcline } from '@/api/mes/qc/iqcline';
import Defectrecord from '../defectrecord/index.vue';
export default {
  name: 'IqcLine',
  dicts: ['mes_index_type', 'mes_qc_result'],
  props: {
    iqcId: null,
    optType: null,
  },
  components: { Defectrecord },
  data() {
    return {
      defect_iqcid: null,
      defect_lineid: null,
      defect_qctype: 'IQC',
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
      // 来料检验单行表格数据
      iqclineList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        iqcId: this.iqcId,
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
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询来料检验单行列表 */
    getList() {
      this.loading = true;
      listIqcline(this.queryParams).then(response => {
        this.iqclineList = response.data.list;
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
        iqcId: this.iqcId,
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
    handleDefect(row) {
      this.defect_iqcid = row.iqcId;
      this.defect_lineid = row.id;
      this.$nextTick(() => {
        this.$refs.defectDialog.showFlag = true;
        this.$refs.defectDialog.getList();
      });
    },

    // 添加处理数量变化的方法
    handleQuantityChange(row, field, value) {
      // 构造更新数据
      const updateData = {
        id: row.id,
        iqcId: row.iqcId,
        [field]: value
      };

      // 调用API更新
      updateIqcline(updateData).then(response => {
        this.$modal.msgSuccess(`${this.getFieldLabel(field)}更新成功`);

        // 更新本地数据（可选）
        const index = this.iqclineList.findIndex(item => item.id === row.id);
        if (index !== -1) {
          this.$set(this.iqclineList, index, {
            ...this.iqclineList[index],
            [field]: value
          });
        }
      }).catch(error => {
        console.error('更新缺陷数量失败:', error);
        this.$modal.msgError(`${this.getFieldLabel(field)}更新失败`);
      });
    },

    // 获取字段中文标签
    getFieldLabel(field) {
      const labels = {
        crQuantity: '致命缺陷数量',
        majQuantity: '严重缺陷数量',
        minQuantity: '轻微缺陷数量',
        inspectionValue1: '检验数值1',
        inspectionValue2: '检验数值1',
        inspectionValue3: '检验数值1',
        inspectionValue4: '检验数值1',
        inspectionValue5: '检验数值1',
        inspectionResult: "检验结果",
      };
      return labels[field] || '缺陷数量';
    },

  },
};
</script>
