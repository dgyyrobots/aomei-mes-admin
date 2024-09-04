<template>
  <div>
    <el-dialog title="模型复制" :visible.sync="copyModelDialogVisible">
      <el-form :model="form">
        <el-form-item label="复制到租户" :label-width="formLabelWidth">
          <!--            <el-select v-model="form.tenantId" placeholder="请选择租户">-->
          <!--              <el-option label="" value="shanghai"></el-option>-->
          <!--            </el-select>-->
          <el-select v-model="form.tenantId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
            <el-option v-for="item in list" :key="item.id" :label="item.name + item.contactName" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCopy">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { copyModel } from '@/api/bpm/model';
import { getTenantPage } from '@/api/system/tenant';
export default {
  name: 'copyModelDialog',
  props: {},
  data() {
    return {
      copyModelDialogVisible: false,
      form: {
        id: '',
        tenantId: '',
      },
      formLabelWidth: '120px',
      loading: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 50,
        name: null,
      },
      list: [],
    };
  },
  created() {},
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getTenantPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    remoteMethod(query) {
      if (query !== '') this.queryParams.name = query;
      this.loading = true;
      getTenantPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },

    initDialog(row) {
      console.log(row);
      this.getList();
      this.form.id = row.id;
      this.form.tenantId = null;
      this.copyModelDialogVisible = true;
    },

    handleCopy() {
      const that = this;
      copyModel(this.form.id, this.form.tenantId).then(res => {
        if (res.code == 0) {
          this.form.tenantId = null;
          this.copyModelDialogVisible = false;
        }
      });
    },
  },
};
</script>

<style scoped></style>
