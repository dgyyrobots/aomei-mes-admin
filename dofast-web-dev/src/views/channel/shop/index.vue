<template>
  <div class="app-container !p-0 absolute w-full h-full">
    <el-card class="h-full flex flex-col" :body-style="{ flex: 1, overflowY: 'auto', backgroundColor: '#fcfcfc' }">
      <template #header>
        <div>
          <h3 class="inline-block m-0">店铺授权</h3>
          <el-link underline type="primary" class="fr" @click="handleImport">导入</el-link>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col v-bind="{ xl: 4, lg: 8, md: 12, sm: 12, xs: 24 }" v-for="(shop, i) in list" :key="i" class="mb-4">
          <el-card :body-style="{ padding: 0 }">
            <template #header>
              <div class="flex">
                <i>{{ shop.channel }}</i>
                <div class="inline-block">{{ shop.displayName }}</div>
                <div class="flex-1"></div>
                <el-link type="text" icon="el-icon-more" :underline="false"> </el-link>
              </div>
            </template>
            <div class="p-5 text-14px">
              <div>
                <span class="mr-2">{{ getDictDataLabel(shop.channel) }}渠道标识：</span>
                <span>{{ shop.shopCode }}</span>
              </div>
              <div>
                <span class="mr-2">创建事件：</span>
                <span>{{ parseTime(shop.createTime) }}</span>
              </div>
              <div>
                <span class="mr-2">同步事件：</span>
                <span>{{ parseTime(shop.lastTime) }}</span>
              </div>
            </div>
            <div
              class="py-4 px-5 border-0 border-t-1px border-solid border-gray-100 flex w-full align-item-center justify-between">
              <div v-if="shop.status == -1">
                <div class="el-text text-gray-500 mr-1" type="info">
                  <svg-icon icon-class="dot" color="danger"></svg-icon>
                  <span>已失效</span>
                </div>
                <el-link size="small">
                  <span>测试</span>
                </el-link>
              </div>
              <div v-else-if="shop.status == 0">
                <div class="el-text text-gray-500 mr-1" type="info">
                  <svg-icon icon-class="dot" color="danger"></svg-icon>
                  <span>同步中</span>
                </div>
                <el-link size="small">
                  <span>暂停同步</span>
                </el-link>
              </div>
              <div v-else-if="shop.status == 1">
                <div class="el-text text-gray-500 mr-1" type="info">
                  <svg-icon icon-class="dot"></svg-icon>
                  <span>已暂停</span>
                </div>
                <el-link size="small" color="primary">
                  <span>开始同步</span>
                </el-link>
              </div>
              <div v-if="shop.status == -1">
                <div class="el-text text-gray-500 mr-1" type="info">
                  <el-icon name="dot"></el-icon>
                  <span>已禁用</span>
                </div>
              </div>
              <div>
                <el-link type="primary" icon="el-icon-list" @click="bdzh(shop)">绑定银行账号</el-link>
                <el-link type="primary" icon="el-icon-list">订单</el-link>
                <el-link type="primary" icon="el-icon-list">商品</el-link>
                <el-link type="primary" icon="el-icon-database">数据</el-link>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="" prop="channel" label-width="0px">
          <el-radio-group v-model="form.channel">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.ORDER_FROM_CHANNEL)" :key="dict.value"
              :label="dict.value" class="mb-4 min-w-24">
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="店铺名称" prop="displayName">
          <el-input v-model="form.displayName" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="店铺标识" prop="shopId">
          <el-input v-model="form.shopId" placeholder="请输入店铺标识" />
        </el-form-item>
        <el-form-item label="店铺编码" prop="shopCode">
          <el-input v-model="form.shopCode" placeholder="请输入店铺编码" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请选择银行账户" :visible.sync="dialogVisible" width="500px" v-dialogDrag center append-to-body>
      <div style="text-align: center;">
        <el-select v-model="bankCard" placeholder="请选择银行账户">
          <el-option v-for="dict in zh" :key="dict.id" :label="dict.title + dict.account" :value="dict.id + ''" />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="bd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createShop, updateShop, deleteShop, getShop, syncShop, listShop, exportShopExcel, getAllShop } from '@/api/channel/shop';
import { getCashDepositorPage } from '@/api/finance/cashDepositor';
export default {
  name: 'Shop',
  components: {},
  data() {
    return {
      bdid: null,
      zh: [],
      dialogVisible: false,
      bankCard: '',
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 店铺授权列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {},
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        displayName: [{ required: true, message: '店铺名称不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '店铺标识不能为空', trigger: 'blur' }],
        shopNick: [{ required: true, message: '掌柜昵称不能为空', trigger: 'blur' }],
        shopUrl: [{ required: true, message: '店铺地址不能为空', trigger: 'blur' }],
        shopId: [{ required: true, message: '请求posId不能为空', trigger: 'blur' }],
        shopCode: [{ required: true, message: '请求posCode不能为空', trigger: 'blur' }],
        channel: [{ required: true, message: '渠道不能为空', trigger: 'change' }],
        sortCode: [{ required: true, message: '排序号不能为空', trigger: 'blur' }],
        lastTime: [{ required: true, message: '上次拉去时间不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    // 获取可选择账号
    getCashDepositorPage({ pageSize: 100 }).then(res => {
      this.zh = res.data.list;
    })
    this.getList();
  },
  methods: {
    bdzh(v) {
      this.bankCard = v.bankCard;
      // this.bankCard = '';
      this.bdid = v.id;
      this.dialogVisible = true;
    },
    bd() {
      console.log('绑定银行账户')
      console.log(this.bdid);
      if (!this.bankCard) return this.$message.error('请选择银行账户');
      updateShop({ id: this.bdid, bankCard: this.bankCard }).then(response => {
        this.$modal.msgSuccess('修改成功');
        this.dialogVisible = false;
        this.getList();
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getAllShop({}).then(response => {
        this.list = response.data;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {};
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
      this.title = '添加店铺授权';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getShop(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改店铺授权';
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
          updateShop(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createShop(this.form).then(response => {
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
        .confirm('是否确认删除店铺授权编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteShop(id);
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
        .confirm('是否确认导出所有店铺授权数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportShopExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '店铺授权.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
    handleImport() {
      this.$modal
        .prompt('请输入店铺编码进行同步店铺信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\d+/,
          inputErrorMessage: '请输入正确的店铺编码',
        })
        .then(({ value }) => {
          return syncShop(value);
        })
        .catch(() => { });
    },
  },
};
</script>
