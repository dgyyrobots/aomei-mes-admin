<template>
  <el-dialog title="编辑任务记录" v-loading="loading" v-if="showFlag" :visible.sync="showFlag" width="1000px" center>
    <el-form>
      <el-form-item v-for="field in fields" :prop="field.field" :key="field.field">
        <el-button type="primary" block v-if="Array.isArray(field.default)" @click="addFieldInner(field)">添加 </el-button>
        <div v-if="field.type == 'TwoImgField'">
          <el-descriptions :column="2" border class="my-5">
            <template v-for="(val, i) in record[field.field]">
              <el-descriptions-item label="标记图">
                <ImageUpload :limit="1" :value="val.mark_image" @input="setValue(val, 'mark_image', $event)">
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
                  <ImageUpload :limit="1" :ref="`uploadMutiple${i}`" :value="val.image"
                    @input="setValue(val, 'image', $event)"></ImageUpload>
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
          <FileUpload :file-type="['doc', 'xls', 'ppt', 'txt', 'pdf', 'rar', 'zip', 'dmg']"
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
import { getFormRecord, createFormRecord, updateFormRecord } from '@/api/system/formRecord.js';
import { getForm } from '@/api/system/form.js';
import { cloneDeep } from 'lodash';
import ImageUpload from '@/components/ImageUpload/index.vue';
import FileUpload from '@/components/FileUpload/index.vue';

export default {
  components: { FileUpload, ImageUpload },
  data() {
    return {
      loading: false,
      showFlag: false,
      record: null,
      fields: [],
      recordId: 0,
      formId: 0,
    };
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
    open(row) {
      this.showFlag = true;
      this.record = {};
      this.recordId = row.recordId || 0;
      this.formId = row.formId || 0;
      if (row.recordId) {
        getFormRecord(row.recordId).then(({ data: record }) => {
          if (record) {
            this.record = {
              ...this.record,
              ...JSON.parse(record.value),
            };
          }
        });
      }
      if (row.formId) {
        getForm(row.formId).then(({ data: { fields } }) => {
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
        if (this.recordId) {
          await updateFormRecord({
            id: this.recordId,
            formId: this.formId,
            value: JSON.stringify(this.record),
          });
        } else {
          this.recordId = await createFormRecord({
            formId: this.formId,
            value: JSON.stringify(this.record),
          });
        }
        this.$emit('saved', { recordId: this.recordId });
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
