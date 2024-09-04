<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form-item label="评价人的用户编号，关联 MemberUserDO 的 id 编号" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入评价人的用户编号，关联 MemberUserDO 的 id 编号" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="评价人名称" prop="userNickname" label-width="82">
        <el-input v-model="queryParams.userNickname" placeholder="请输入评价人名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="评价人头像" prop="userAvatar">
        <el-input v-model="queryParams.userAvatar" placeholder="请输入评价人头像" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="是否匿名" prop="anonymous">
        <el-select v-model="queryParams.anonymous" placeholder="请选择是否匿名" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="交易订单编号" prop="orderId" label-width="96">
        <el-input v-model="queryParams.orderId" placeholder="请输入交易订单编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="交易订单项编号，关联 TradeOrderItemDO 的 id 编号" prop="orderItemId">
        <el-input v-model="queryParams.orderItemId" placeholder="请输入交易订单项编号，关联 TradeOrderItemDO 的 id 编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item> -->
      <el-form-item label="商品 SPU 编号" prop="spuId" label-width="103">
        <el-input v-model="queryParams.spuId" placeholder="请输入商品 SPU 编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商品 SPU 名称" prop="spuName" label-width="103">
        <el-input v-model="queryParams.spuName" placeholder="请输入商品 SPU 名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="商品 SKU 编号，关联 ProductSkuDO 的 id 编号" prop="skuId">
        <el-input v-model="queryParams.skuId" placeholder="请输入商品 SKU 编号，关联 ProductSkuDO 的 id 编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="图片地址" prop="skuPicUrl">
        <el-input v-model="queryParams.skuPicUrl" placeholder="请输入图片地址" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]" prop="skuProperties">
        <el-input v-model="queryParams.skuProperties" placeholder="请输入属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item> -->
      <!-- <el-form-item label="是否可见，true:显示false:隐藏" prop="visible">
        <el-select v-model="queryParams.visible" placeholder="请选择是否可见，true:显示false:隐藏" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="评分星级1-5分" prop="scores" label-width="104">
        <el-input v-model="queryParams.scores" placeholder="请输入评分星级1-5分" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="描述星级1-5星" prop="descriptionScores" label-width="104">
        <el-input v-model="queryParams.descriptionScores" placeholder="请输入描述星级1-5星" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="服务星级1-5星" prop="benefitScores" label-width="104">
        <el-input v-model="queryParams.benefitScores" placeholder="请输入服务星级1-5星" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="评论图片地址数组" prop="picUrls">
        <el-input v-model="queryParams.picUrls" placeholder="请输入评论图片地址数组" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item> -->
      <el-form-item label="商家是否回复" prop="replyStatus" label-width="96">
        <el-select v-model="queryParams.replyStatus" placeholder="请选择商家是否回复" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="回复管理员编号，关联 AdminUserDO 的 id 编号" prop="replyUserId">
        <el-input v-model="queryParams.replyUserId" placeholder="请输入回复管理员编号，关联 AdminUserDO 的 id 编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item> -->
      <!-- <el-form-item label="商家回复时间" prop="replyTime">
        <el-date-picker v-model="queryParams.replyTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item> -->
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
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['product:comment:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['product:comment:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="评论编号，主键自增" align="center" prop="id" />
      <el-table-column label="评价人的用户编号" align="center" prop="userId" />
      <!-- <el-table-column label="评价人的用户编号，关联 MemberUserDO 的 id 编号" align="center" prop="userId" /> -->
      <el-table-column label="评价人名称" align="center" prop="userNickname" />
      <el-table-column label="评价人头像" align="center" prop="userAvatar" />
      <el-table-column label="是否匿名" align="center" prop="anonymous" />
      <!-- <el-table-column label="交易订单编号，关联 TradeOrderDO 的 id 编号" align="center" prop="orderId" /> -->
      <el-table-column label="交易订单编号" align="center" prop="orderId" />
      <!-- <el-table-column label="交易订单项编号，关联 TradeOrderItemDO 的 id 编号" align="center" prop="orderItemId" /> -->
      <el-table-column label="交易订单项编号" align="center" prop="orderItemId" />
      <!-- <el-table-column label="商品 SPU 编号，关联 ProductSpuDO 的 id" align="center" prop="spuId" /> -->
      <el-table-column label="商品 SPU 编号" align="center" prop="spuId" />
      <el-table-column label="商品 SPU 名称" align="center" prop="spuName" />
      <!-- <el-table-column label="商品 SKU 编号，关联 ProductSkuDO 的 id 编号" align="center" prop="skuId" /> -->
      <el-table-column label="商品 SKU 编号" align="center" prop="skuId" />
      <el-table-column label="图片地址" align="center" prop="skuPicUrl" />
      <el-table-column label="属性数组" align="center" prop="skuProperties" />
      <!-- <el-table-column label="属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]" align="center"
        prop="skuProperties" /> -->
      <!-- <el-table-column label="是否可见，true:显示false:隐藏" align="center" prop="visible" /> -->
      <el-table-column label="是否可见" align="center" prop="visible" />
      <el-table-column label="评分星级1-5分" align="center" prop="scores" />
      <el-table-column label="描述星级 1-5 星" align="center" prop="descriptionScores" />
      <el-table-column label="服务星级 1-5 星" align="center" prop="benefitScores" />
      <el-table-column label="评论内容" align="center" prop="content" />
      <el-table-column label="评论图片地址数组" align="center" prop="picUrls" />
      <el-table-column label="商家是否回复" align="center" prop="replyStatus" />
      <el-table-column label="回复管理员编号，关联 AdminUserDO 的 id 编号" align="center" prop="replyUserId" />
      <el-table-column label="商家回复内容" align="center" prop="replyContent" />
      <el-table-column label="商家回复时间" align="center" prop="replyTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.replyTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['product:comment:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['product:comment:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="评价人的用户编号，关联 MemberUserDO 的 id 编号" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入评价人的用户编号，关联 MemberUserDO 的 id 编号" />
        </el-form-item>
        <el-form-item label="评价人名称" prop="userNickname">
          <el-input v-model="form.userNickname" placeholder="请输入评价人名称" />
        </el-form-item>
        <el-form-item label="评价人头像" prop="userAvatar">
          <el-input v-model="form.userAvatar" placeholder="请输入评价人头像" />
        </el-form-item>
        <el-form-item label="是否匿名" prop="anonymous">
          <el-radio-group v-model="form.anonymous">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="交易订单编号，关联 TradeOrderDO 的 id 编号" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入交易订单编号，关联 TradeOrderDO 的 id 编号" />
        </el-form-item>
        <el-form-item label="交易订单项编号，关联 TradeOrderItemDO 的 id 编号" prop="orderItemId">
          <el-input v-model="form.orderItemId" placeholder="请输入交易订单项编号，关联 TradeOrderItemDO 的 id 编号" />
        </el-form-item>
        <el-form-item label="商品 SPU 编号，关联 ProductSpuDO 的 id" prop="spuId">
          <el-input v-model="form.spuId" placeholder="请输入商品 SPU 编号，关联 ProductSpuDO 的 id" />
        </el-form-item>
        <el-form-item label="商品 SPU 名称" prop="spuName">
          <el-input v-model="form.spuName" placeholder="请输入商品 SPU 名称" />
        </el-form-item>
        <el-form-item label="商品 SKU 编号，关联 ProductSkuDO 的 id 编号" prop="skuId">
          <el-input v-model="form.skuId" placeholder="请输入商品 SKU 编号，关联 ProductSkuDO 的 id 编号" />
        </el-form-item>
        <el-form-item label="图片地址" prop="skuPicUrl">
          <el-input v-model="form.skuPicUrl" placeholder="请输入图片地址" />
        </el-form-item>
        <el-form-item label="属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]" prop="skuProperties">
          <el-input v-model="form.skuProperties"
            placeholder="请输入属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]" />
        </el-form-item>
        <el-form-item label="是否可见，true:显示false:隐藏" prop="visible">
          <el-radio-group v-model="form.visible">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评分星级1-5分" prop="scores">
          <el-input v-model="form.scores" placeholder="请输入评分星级1-5分" />
        </el-form-item>
        <el-form-item label="描述星级 1-5 星" prop="descriptionScores">
          <el-input v-model="form.descriptionScores" placeholder="请输入描述星级 1-5 星" />
        </el-form-item>
        <el-form-item label="服务星级 1-5 星" prop="benefitScores">
          <el-input v-model="form.benefitScores" placeholder="请输入服务星级 1-5 星" />
        </el-form-item>
        <el-form-item label="评论内容">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item>
        <el-form-item label="评论图片地址数组" prop="picUrls">
          <el-input v-model="form.picUrls" placeholder="请输入评论图片地址数组" />
        </el-form-item>
        <el-form-item label="商家是否回复" prop="replyStatus">
          <el-radio-group v-model="form.replyStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="回复管理员编号，关联 AdminUserDO 的 id 编号" prop="replyUserId">
          <el-input v-model="form.replyUserId" placeholder="请输入回复管理员编号，关联 AdminUserDO 的 id 编号" />
        </el-form-item>
        <el-form-item label="商家回复内容">
          <editor v-model="form.replyContent" :min-height="192" />
        </el-form-item>
        <el-form-item label="商家回复时间" prop="replyTime">
          <el-date-picker clearable v-model="form.replyTime" type="date" value-format="timestamp"
            placeholder="选择商家回复时间" />
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
import { createComment, updateComment, deleteComment, getComment, getCommentPage, exportCommentExcel } from "@/api/product/comment";
import Editor from '@/components/Editor';

export default {
  name: "Comment",
  components: {
    Editor
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
      // 商品评论列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        userId: null,
        userNickname: null,
        userAvatar: null,
        anonymous: null,
        orderId: null,
        orderItemId: null,
        spuId: null,
        spuName: null,
        skuId: null,
        skuPicUrl: null,
        skuProperties: null,
        visible: null,
        scores: null,
        descriptionScores: null,
        benefitScores: null,
        content: null,
        picUrls: null,
        replyStatus: null,
        replyUserId: null,
        replyContent: null,
        replyTime: [],
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        skuPicUrl: [{ required: true, message: "图片地址不能为空", trigger: "blur" }],
      }
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
      getCommentPage(this.queryParams).then(response => {
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
        userId: undefined,
        userNickname: undefined,
        userAvatar: undefined,
        anonymous: undefined,
        orderId: undefined,
        orderItemId: undefined,
        spuId: undefined,
        spuName: undefined,
        skuId: undefined,
        skuPicUrl: undefined,
        skuProperties: undefined,
        visible: undefined,
        scores: undefined,
        descriptionScores: undefined,
        benefitScores: undefined,
        content: undefined,
        picUrls: undefined,
        replyStatus: undefined,
        replyUserId: undefined,
        replyContent: undefined,
        replyTime: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商品评论";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getComment(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商品评论";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateComment(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createComment(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除商品评论编号为"' + id + '"的数据项?').then(function () {
        return deleteComment(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有商品评论数据项?').then(() => {
        this.exportLoading = true;
        return exportCommentExcel(params);
      }).then(response => {
        this.$download.excel(response, '商品评论.xls');
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
