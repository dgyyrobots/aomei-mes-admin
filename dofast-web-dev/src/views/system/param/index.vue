<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="参数名称" prop="paramName">
        <el-input v-model="queryParams.paramName" placeholder="请输入参数名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态选项" prop="value">
        <el-select v-model="queryParams.value" placeholder="请选择状态选项" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="数据类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择数据类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.PARAM_TYPE)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否可用" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择是否可用：0不可用 1可用" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否视频" prop="isVideo">
        <el-select v-model="queryParams.isVideo" placeholder="请选择是否为视频：0图片 1视频" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:param:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['system:param:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="参数名称" align="center" prop="paramName" />
      <el-table-column label="参数英文" align="center" prop="paramNameEn" />
      <el-table-column label="参数说明" align="center" prop="description" />
      <el-table-column label="示例信息" align="center" prop="example" />
      <el-table-column label="状态选项" align="center" prop="value">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.value" />
        </template>
      </el-table-column>
      <el-table-column label="数据类型" align="center" prop="type">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.PARAM_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="是否可用" align="center" prop="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="是否视频" align="center" prop="isVideo">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.isVideo" />
        </template>
      </el-table-column>
      <el-table-column label="坐标视角" align="center" prop="coordinate" />
      <el-table-column label="图片质量" align="center" prop="quality" />
      <el-table-column label="备注" align="center" prop="mark" />
      <el-table-column label="创建人" align="center" prop="createdBy" />
      <el-table-column label="创建时间" align="center" prop="createdDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createdDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编辑人" align="center" prop="editedBy" />
      <el-table-column label="编辑时间" align="center" prop="editedDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.editedDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:param:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:param:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="paramName">
          <el-input v-model="form.paramName" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数名称英文标识" prop="paramNameEn">
          <el-input v-model="form.paramNameEn" placeholder="请输入参数名称英文标识" />
        </el-form-item>
        <el-form-item label="参数说明" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="示例信息">
          <imageUpload v-model="form.example" />
        </el-form-item>
        <el-form-item label="状态选项" prop="value">
          <el-radio-group v-model="form.value">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择数据类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.PARAM_TYPE)" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="上级id" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入上级id" />
        </el-form-item>
        <el-form-item label="图片数量" prop="num">
          <el-input v-model="form.num" placeholder="请输入图片数量" />
        </el-form-item>
        <el-form-item label="是否可用：0不可用 1可用" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否为视频：0图片 1视频" prop="isVideo">
          <el-radio-group v-model="form.isVideo">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用于热点的坐标或者初始化视角" prop="coordinate">
          <el-input v-model="form.coordinate" placeholder="请输入用于热点的坐标或者初始化视角" />
        </el-form-item>
        <el-form-item label="当前热点关联的标记" prop="vrHotspot">
          <el-input v-model="form.vrHotspot" placeholder="请输入当前热点关联的标记" />
        </el-form-item>
        <el-form-item label="控制前端图片拍摄质量" prop="quality">
          <el-input v-model="form.quality" placeholder="请输入控制前端图片拍摄质量" />
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input v-model="form.mark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="创建人" prop="createdBy">
          <el-input v-model="form.createdBy" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdDate">
          <el-date-picker clearable v-model="form.createdDate" type="date" value-format="timestamp" placeholder="选择创建时间" />
        </el-form-item>
        <el-form-item label="编辑人" prop="editedBy">
          <el-input v-model="form.editedBy" placeholder="请输入编辑人" />
        </el-form-item>
        <el-form-item label="编辑时间" prop="editedDate">
          <el-date-picker clearable v-model="form.editedDate" type="date" value-format="timestamp" placeholder="选择编辑时间" />
        </el-form-item>
        <el-form-item label="租户id" prop="tenandId">
          <el-input v-model="form.tenandId" placeholder="请输入租户id" />
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
import { createParam, updateParam, deleteParam, getParam, getParamPage, exportParamExcel } from '@/api/system/param';
import ImageUpload from '@/components/ImageUpload';

export default {
  name: 'Param',
  components: {
    ImageUpload,
  },
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
      // 定制产品参数列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        paramName: null,
        paramNameEn: null,
        description: null,
        example: null,
        value: null,
        type: null,
        sort: null,
        pid: null,
        num: null,
        status: null,
        isVideo: null,
        coordinate: null,
        vrHotspot: null,
        quality: null,
        mark: null,
        createdBy: null,
        createdDate: [],
        editedBy: null,
        editedDate: [],
        tenandId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        createdBy: [{ required: true, message: '创建人不能为空', trigger: 'blur' }],
        createdDate: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }],
        editedBy: [{ required: true, message: '编辑人不能为空', trigger: 'blur' }],
        editedDate: [{ required: true, message: '编辑时间不能为空', trigger: 'blur' }],
        tenandId: [{ required: true, message: '租户id不能为空', trigger: 'blur' }],
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
      getParamPage(this.queryParams).then(response => {
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
        paramName: undefined,
        paramNameEn: undefined,
        description: undefined,
        example: undefined,
        value: undefined,
        type: undefined,
        sort: undefined,
        pid: undefined,
        num: undefined,
        status: undefined,
        isVideo: undefined,
        coordinate: undefined,
        vrHotspot: undefined,
        quality: undefined,
        mark: undefined,
        createdBy: undefined,
        createdDate: undefined,
        editedBy: undefined,
        editedDate: undefined,
        tenandId: undefined,
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
      this.title = '添加定制产品参数';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getParam(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改定制产品参数';
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
          updateParam(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createParam(this.form).then(response => {
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
        .confirm('是否确认删除定制产品参数编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteParam(id);
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
        .confirm('是否确认导出所有定制产品参数数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportParamExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '定制产品参数.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
