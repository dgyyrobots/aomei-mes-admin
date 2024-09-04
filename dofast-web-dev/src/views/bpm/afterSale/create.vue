<template>
  <div class="app-container">
    <!-- 对话框(添加 / 修改) -->
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="事物类别" prop="transactionCategory">
        <!-- 字典 -->
        <!-- <el-select v-model="form.transactionCategory" placeholder="请选择">
          <el-option v-for="dict in typeDictData" :key="parseInt(dict.value)" :label="dict.label"
            :value="parseInt(dict.value)" />
        </el-select> -->
        <!-- 参数配置 -->
        <!-- <el-cascader v-model="form.transactionCategory" placeholder="请选择" :options="arr" @change="change"
          :props="{ value: 'label' }" :show-all-levels="false"></el-cascader> -->
        <el-input type="input" :rows="3" v-model="form.transactionCategory" placeholder="请输入事物类别" />
      </el-form-item>

      <!-- <el-select v-model="form.mainPersonResponsible" placeholder="请选择">
          <el-option v-for="dict in typeDictData" :key="parseInt(dict.value)" :label="dict.label"
            :value="parseInt(dict.value)" />
        </el-select> -->
      <el-form-item label="主要负责人" prop="mainPersonResponsible">
        <el-col :span="10">
          <el-input v-model="form.mainPersonResponsible" placeholder="请选择责任人" disabled>
            <el-button slot="append" @click="handleUserSelect" icon="el-icon-search"></el-button>
          </el-input>
          <UserSingleSelect ref="userSelect" @onSelected="onUserSelected"></UserSingleSelect>
        </el-col>
      </el-form-item>
      <el-form-item label="事物标题" prop="transactionTitle">
        <el-col :span="10">
          <el-input type="input" :rows="3" v-model="form.transactionTitle" placeholder="请输入事物标题" />
        </el-col>
      </el-form-item>
      <el-form-item label="事物内容" prop="transactionContent">
        <el-col :span="10">
          <el-input type="textarea" :rows="3" v-model="form.transactionContent" placeholder="请输入事物内容" />
        </el-col>
      </el-form-item>
      <el-form-item label="关联业务" prop="associatedBusiness">
        <el-col :span="10"><el-input v-model="form.associatedBusiness" placeholder="请输入关联业务" /></el-col>
      </el-form-item>
      <el-form-item label="业务数据" prop="businessData">
        <el-col :span="10"> <el-input v-model="form.businessData" placeholder="请输入业务数据" /></el-col>
      </el-form-item>

      <el-form-item label="关联对象" prop="associatedObjects">
        <el-col :span="10"> <el-input v-model="form.associatedObjects" placeholder="请输入关联对象" /></el-col>
      </el-form-item>
      <el-form-item label="对象名称" prop="objectName">
        <el-col :span="10"> <el-input v-model="form.objectName" placeholder="请输入对象名称" /></el-col>
      </el-form-item>
      <el-form-item label="关联店铺" prop="associatedStores">
        <el-col :span="10"><el-input v-model="form.associatedStores" placeholder="请输入关联店铺" /></el-col>
      </el-form-item>
      <el-form-item label="关联仓库" prop="associatedRepository">
        <el-col :span="10"> <el-input v-model="form.associatedRepository" placeholder="请输入关联仓库" /></el-col>
      </el-form-item>
      <el-form-item label="关联金额" prop="associatedAmounts">
        <el-col :span="10"> <el-input type="number" v-model="form.associatedAmounts" placeholder="请输入关联金额" /></el-col>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-col :span="10"> <el-input type="number" v-model="form.priority" placeholder="请输入优先级" /></el-col>
      </el-form-item>
      <el-form-item label="添加抄送" prop="addCopy">
        <el-input v-model="form.addCopy" placeholder="请输入添加抄送" />
      </el-form-item>
      <el-form-item label="截止时间" prop="deadline">
        <el-date-picker clearable v-model="form.deadline" type="date" value-format="timestamp" placeholder="选择截止时间" />
      </el-form-item>
      <el-form-item label="标记" prop="remark">
        <el-col :span="10"> <el-input v-model="form.remark" placeholder="请输入标记" /></el-col>
      </el-form-item>
      <el-form-item label="图片" prop="picture">
        <imageUpload v-model="form.picture" />
      </el-form-item>
      <el-form-item label="售后结果" prop="result">
        <el-input v-model="form.result" placeholder="请输入售后结果" />
      </el-form-item>
      <el-form-item label="流程实例的编号" prop="processInstanceId">
        <el-input v-model="form.processInstanceId" placeholder="请输入流程实例的编号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ImageUpload from '@/components/ImageUpload';
import { createAfterSale } from '@/api/bpm/afterSale';
import { getDictDatas, DICT_TYPE } from '@/utils/dict';
import { getConfig, getConfigKey } from '@/api/system/config';
import UserSingleSelect from '@/components/userSelect/single.vue';
export default {
  name: 'BpmAfterSaleCreate',
  components: {
    ImageUpload,
    UserSingleSelect,
  },
  data() {
    return {
      // 事物类别参数分类
      arr: null,
      // 表单参数
      form: {
        mainPersonResponsible: undefined,
        transactionTitle: undefined,
        // transactionCategory: ['售后退款'],
        transactionCategory: undefined,
        transactionContent: undefined,
      },
      // 表单校验
      rules: {
        mainPersonResponsible: [{ required: true, message: '主要负责人不能为空', trigger: 'blur' }],
        transactionTitle: [{ required: true, message: '事物标题不能为空', trigger: 'blur' }],
        transactionCategory: [{ required: true, message: '事物类别不能为空', trigger: 'change' }],
        transactionContent: [{ required: true, message: '事物内容不能为空', trigger: 'change' }],
      },

      typeDictData: getDictDatas(DICT_TYPE.TRADE_AFTER_SALE_TYPE),
    };
  },
  created() {
    // 获取事物类别参数配置
    // getConfigKey
    // 此处应换为key但是尚未确定命名
    getConfig(67).then(res => {
      this.arr = JSON.parse(res.data.value);
    });
  },
  methods: {
    //点击责任人选择按钮
    handleUserSelect() {
      this.$refs.userSelect.showFlag = true;
    },
    //责任人选择返回
    onUserSelected(row) {
      // this.form.nickName = row.nickname;
      this.form.mainPersonResponsible = row.username;
      this.$refs['form'].validateField('mainPersonResponsible');
    },
    /** 提交按钮 */
    submitForm() {
      this.form.transactionCategory = this.form.transactionCategory[this.form.transactionCategory.length - 1];
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }

        // 添加的提交
        createAfterSale(this.form).then(response => {
          this.$modal.msgSuccess('发起成功');
          this.$tab.closeOpenPage({ path: '/scm/after-sale' });
        });
      });
    },
  },
};
</script>
