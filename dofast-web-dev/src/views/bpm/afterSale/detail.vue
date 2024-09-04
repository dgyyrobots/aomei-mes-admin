<template>
  <div class="app-container">
    <!-- 对话框(添加 / 修改) -->
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="事务类别" prop="transactionCategory">
        {{ form.transactionCategory }}
      </el-form-item>
      <el-form-item label="事务标题" prop="transactionTitle">
        {{ form.transactionTitle }}
      </el-form-item>
      <el-form-item label="主要负责人" prop="mainPersonResponsible">
        {{ form.mainPersonResponsible }}
      </el-form-item>
      <el-form-item label="事物内容" prop="transactionContent"> {{ form.transactionContent }} </el-form-item>
      <el-form-item label="关联业务" prop="associatedBusiness">
        {{ form.associatedBusiness }}
      </el-form-item>
      <el-form-item label="业务数据" prop="businessData">
        {{ form.businessData }}
      </el-form-item>
      <el-form-item label="关联对象" prop="associatedObjects">
        {{ form.associatedObjects }}
      </el-form-item>
      <el-form-item label="对象名称" prop="objectName">
        {{ form.objectName }}
      </el-form-item>
      <el-form-item label="关联店铺" prop="associatedStores">
        {{ form.associatedStores }}
      </el-form-item>
      <el-form-item label="关联仓库" prop="associatedRepository">
        {{ form.associatedRepository }}
      </el-form-item>
      <el-form-item label="关联金额" prop="associatedAmounts">
        {{ form.associatedAmounts }}
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        {{ form.priority }}
      </el-form-item>
      <!-- <el-form-item label="添加抄送" prop="addCopy">
        {{ form.addCopy }}
      </el-form-item> -->

      <el-form-item label="截止时间" prop="deadline">
        {{ parseTime(form.deadline) }}
      </el-form-item>
      <el-form-item label="标记" prop="remark">
        {{ form.remark }}
      </el-form-item>
      <el-form-item label="图片" prop="picture">
        <template v-if="form.picture">
          <template v-for="(item, index) in form.picture.split(',')">
            <!-- <img :src="item" :key="index" style="width: 50px;height: 50px;" /> -->
            <el-image style="width: 50px; height: 50px" :src="item" :preview-src-list="form.picture.split(',')" :key="index"> </el-image>
          </template>
        </template>
      </el-form-item>
      <!-- <el-form-item label="售后结果" prop="result">
        <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT" :value="form.result" />
      </el-form-item> -->
      <el-form-item label="流程实例的编号" prop="processInstanceId">
        {{ form.processInstanceId }}
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        {{ parseTime(form.createTime) }}
        <!-- <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" /> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAfterSale } from '@/api/bpm/afterSale';
import { getDictDatas, DICT_TYPE } from '@/utils/dict';
export default {
  name: 'BpmAfterSaleeDetail',
  components: {},
  props: {
    id: {
      type: [String, Number],
      default: undefined,
    },
  },
  data() {
    return {
      leaveId: undefined, // 售后编号
      // 表单参数
      form: {
        startTime: undefined,
        endTime: undefined,
        type: undefined,
        reason: undefined,
      },

      typeDictData: getDictDatas(DICT_TYPE.BPM_OA_LEAVE_TYPE),
    };
  },
  created() {
    this.leaveId = this.id || this.$route.query.id;
    if (!this.leaveId) {
      this.$message.error('未传递 id 参数，无法查看售后详情');
      return;
    }
    this.getDetail();
  },
  methods: {
    /** 获得售后信息 */
    getDetail() {
      getAfterSale(this.leaveId).then(response => {
        this.form = response.data;
      });
    },
  },
};
</script>
