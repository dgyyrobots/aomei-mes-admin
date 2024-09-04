<template>
  <el-dialog title="发布任务" v-loading="loading" v-if="showFlag" :visible.sync="showFlag" width="1000px" center>
    <el-form :model="form" :rules="rules" ref="form" label-width="150px">
      <el-row>
        <!--        <el-col :span="24">-->
        <!--          <el-form-item prop="name" label="任务标题">-->
        <!--            <el-input v-model="form.name" placeholder="请输入任务标题"></el-input>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :span="12">
          <el-form-item prop="typeId" label="任务类型">
            <el-select v-model="form.typeId" placeholder="请选择任务类型">
              <el-option v-for="opt in collectionTypes" :value="opt.id" :label="opt.name" :key="opt.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务记录" prop="self">
            <el-radio-group v-model="form.self">
              <el-radio :value="2" :key="2" :label="2">立即修改</el-radio>
              <el-radio :value="1" :key="1" disabled :label="1">立即发布</el-radio>
              <el-radio :value="0" :key="0" disabled :label="0">暂存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-for="(field, j) in fields" :prop="field.field" label-width="0" :key="j">
        <el-button type="primary" block v-if="Array.isArray(field.default)" @click="addFieldInner(field)">添加 </el-button>
        <div v-if="field.type == 'TwoImgField'">
          <el-descriptions :column="2" border class="my-5">
            <template v-for="(val, i) in record[field.field]">
              <el-descriptions-item label="标记图" @click.native="handlePaste" class="666">
                <ImageUpload :limit="1" ref="upload" :value="val.mark_image" @input="setValue(val, 'mark_image', $event)">
                </ImageUpload>
              </el-descriptions-item>
              <el-descriptions-item label="测量图">
                <ImageUpload :limit="1" :value="val.result_image" @input="setValue(val, 'result_image', $event)">
                </ImageUpload>
              </el-descriptions-item>
              <el-descriptions-item label="测量结果">
                <input type="text" v-model="val.result" placeholder="请输入结果" />
              </el-descriptions-item>
              <el-descriptions-item label="备注">
                <el-input :value="val.remark" @input="setValue(val, 'remark', $event)" type="textarea"
                  placeholder="请输入备注"></el-input>
              </el-descriptions-item>
            </template>
          </el-descriptions>
        </div>
        <div v-else-if="field.type == 'OneImgField'">
          <el-descriptions direction="vertical" :column="2" border class="my-5">
            <template v-for="(val, i) in record[field.field]">
              <el-descriptions-item label="主图">
                <div @paste.capture.prevent="handlePaste(i, val, $event)" style="width: 100%;">
                  <ImageUpload :limit="1" :ref="`uploadMutiple${i}`" :fileSize="10" :value="val.image"
                    @input="setValue(val, 'image', $event)">
                  </ImageUpload>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="备注">
                <el-input :value="val.remark" @input="setValue(val, 'remark', $event)" type="textarea"
                  placeholder="请输入备注"></el-input>
              </el-descriptions-item>
            </template>
          </el-descriptions>
        </div>
        <div v-else-if="field.type == 'File'">
          <FileUpload :fileSize="100" :file-type="['doc', 'xls', 'ppt', 'txt', 'pdf', 'rar', 'zip', 'dmg']"
            v-model="record[field.field]" />
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="showFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createFormRecord } from '@/api/system/formRecord.js';
import { getForm } from '@/api/system/form.js';
import { cloneDeep } from 'lodash';
import ImageUpload from '@/components/ImageUpload/index.vue';
import FileUpload from '@/components/FileUpload/index.vue';
import { getOrderCollectionTypeSimpleList } from '@/api/mall/trade/orderCollectionType';
import { createOrderCollection, updateOrderCollectionStatus } from '@/api/mall/trade/orderCollection';

export default {
  components: { ImageUpload, FileUpload },
  data() {
    return {
      collectionTypes: [],
      loading: false,
      showFlag: false,
      record: null,
      fields: [],
      recordId: 0,
      orderId: 0,
      formId: 0,
      form: {
        name: '',
        typeId: '',
        self: 2,
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        typeId: [{ required: true, message: '任务类型不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    getOrderCollectionTypeSimpleList().then(res => {
      this.collectionTypes = res.data;
    });
    this.$watch(() => [this.form.typeId, this.form.self].join('-'), this.watchTypeAndSelf);
  },
  methods: {
    setValue(obj, field, value) {
      this.$set(obj, field, value);
      const record = cloneDeep(this.record);
      this.$set(this, 'record', record);
      // this.$forceUpdate();
    },
    addFieldInner(field) {
      this.record[field.field] = this.record[field.field].concat(cloneDeep(field.default));
      this.$forceUpdate();
    },
    reset() {
      this.form = {
        name: '',
        typeId: '',
        self: 2,
      };
      this.record = {};
      this.fields = [];
    },
    open(order_id) {
      this.orderId = order_id;
      this.reset();
      this.showFlag = true;
    },
    watchTypeAndSelf() {
      this.record = {};
      this.fields = [];
      let formId = 0;
      if (this.form.self && this.form.typeId) {
        for (let i = 0; i < this.collectionTypes.length; i++) {
          if (this.collectionTypes[i].id == this.form.typeId) {
            formId = this.collectionTypes[i].formId;
            break;
          }
        }
      }
      this.formId = formId;
      if (formId) {
        getForm(formId).then(({ data: { fields } }) => {
          for (let i = 0; i < fields.length; i++) {
            this.record[fields[i].field] = this.record[fields[i].field] || cloneDeep(fields[i].default);
          }
          this.fields = fields;
          this.$forceUpdate();
        });
      }
    },
    async confirm() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const { data: recordId } = await createFormRecord({
          formId: this.formId,
          value: JSON.stringify(this.record),
        });
        const { data: taskId } = await createOrderCollection({
          ...this.form,
          name: '',
          orderId: this.orderId,
          recordId,
        });
        await updateOrderCollectionStatus(taskId, 'applied');
        this.$emit('saved', taskId);
        this.showFlag = false;
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    handlePaste(index, val, event) {
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;
      if (!items || items.length === 0) {
        this.$message.error("当前浏览器不支持本地");
        return;
      }
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) {
        this.$message.error("粘贴内容非图片");
        return;
      }
      if (val.image) {
        this.$message.error(`上传文件数量不能超过 1 个!`); // 图片数量超出
        return
      }
      this.$refs[`uploadMutiple${index}`][0].$refs.upload.handleStart(file); // 将粘贴过来的图片加入预上传队列
      this.$refs[`uploadMutiple${index}`][0].$refs.upload.submit(); // 提交图片上传队列
    }
  },
};
</script>
<style scoped></style>
