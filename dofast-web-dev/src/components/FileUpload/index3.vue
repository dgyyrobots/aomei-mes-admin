<template>
  <div class="upload-file">
    <el-upload multiple :action="uploadFileUrl" :before-upload="handleBeforeUpload" :file-list="fileList" :limit="limit"
      :on-error="handleUploadError" :on-exceed="handleExceed" :on-success="handleUploadSuccess" :show-file-list="false"
      :headers="headers" class="upload-file-uploader" ref="fileUpload">
      <!-- 上传按钮 -->
      <el-button size="mini" type="primary" v-if="isShowTips">选取文件</el-button>
      <!-- 上传提示 -->
      <div class="el-upload__tip" slot="tip" v-if="isShowTips"><!--showTip-->
        请上传
        <template v-if="fileSize">
          大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
        </template>
        <template v-if="fileType">
          格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b>
        </template>
        的文件
      </div>
    </el-upload>

<!--    &lt;!&ndash; 文件列表 &ndash;&gt;
    <transition-group class="upload-file-list el-upload-list el-upload-list&#45;&#45;text" name="el-fade-in-linear" tag="ul"
      style="display: flex; flex-wrap: wrap;">
      <li :key="file.url" class="el-upload-list__item ele-upload-list__item-content flex"
        v-for="(file, index) in fileList" style="width: 20%;height: 150px;margin: 0 10px 10px  10px !important;">
        <el-image v-if="isImage(file.url)" :src="file.url" fit="cover"
          :preview-src-list="fileList.filter(({ url }) => isImage(url)).map(({ url }) => url)"
          style="height: 100%;"></el-image>
        <el-link v-else :href="`${file.url}`" :underline="false" target="_blank"
          class="flex-1 text-ellipsis text-right overflow-hidden px-2">
          <span class="el-icon-document" v-if="!isImage(file.name)"> </span>
&lt;!&ndash;          <span v-if="!isImage(file.name)">{{ file.name.split('.').pop().toUpperCase() }}</span>&ndash;&gt;
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link :underline="false" @click="handleDelete(index)" v-if="isShowTips" type="danger"
            style="text-align: center;">删除</el-link>
        </div>
      </li>
    </transition-group>-->
    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul" style="display: flex; flex-wrap: wrap;">
      <li :key="file.url" class="el-upload-list__item ele-upload-list__item-content flex"
          v-for="(file, index) in fileList" style="width: 20%;height: 150px;margin: 0 10px 10px  10px !important;">
<!--        <el-image v-if="isImage(file.url)" :src="file.name" fit="cover"
                  :preview-src-list="fileList.filter(({ url }) => isImage(url)).map(({ url }) => url)"
          style="height: 100%;"></el-image> v-else-->

        <el-link :underline="false" target="_blank"
          class="flex-1 text-ellipsis text-right overflow-hidden px-2">
          <!-- :href="file.url"-->
<!--          <span class="el-icon-document" v-if="!isImage(file.name)"></span>-->
          <!-- 添加预览按钮 -->
          <el-button type="text" @click="handlePreview(file.name)">{{ file.name.split('_')[1] }}</el-button>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link :underline="false" @click="handleDelete(index)" v-if="isShowTips" type="danger" style="text-align: center;" v-hasPermi="['system:file:delete']" >
            删除
          </el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { getAccessToken } from '@/utils/auth';
import {getFullUrl , deleteFile} from '@/api/infra/file';

export default {
  name: 'FileUpload',
  props: {
    // 值
    value: [String, Object, Array],
    // 数量限制
    limit: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ['doc', 'xls', 'ppt', 'txt', 'pdf'],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true,
    },
    isShowTips: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      number: 0,
      uploadList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/admin-api/infra/file/upload', // 请求地址
      headers: { Authorization: 'Bearer ' + getAccessToken() }, // 设置上传的请求头部
      fileList: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          let temp = 1;
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(',');
          // 然后将数组转为对象数组
          this.fileList = list.map(item => {
            if (typeof item === 'string') {
              item = { name: item, url: item };
            }
            item.uid = item.uid || new Date().getTime() + temp++;
            return item;
          });
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  methods: {
    isImage(url) {
      return /.*(.png|.jpg|.jpeg|.gif)$/.test(url);
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = '';
        if (file.name.lastIndexOf('.') > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
        }
        const isTypeOk = this.fileType.some(type => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join('/')}格式文件!`);
          return false;
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      // 校验文件名称不能为中文
      if (/[\u4e00-\u9fa5]/g.test(file.name)) {
        this.$modal.msgError('文件名称不能包含中文!');
        return false;
      }
      // 校验文件名称不能包含特殊字符
      if (/[\\/:*?"<>|]/g.test(file.name)) {
        this.$modal.msgError('文件名称不能包含特殊字符!');
        return false;
      }

      this.$modal.loading('正在上传文件，请稍候...');
      this.number++;
      return true;
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传失败
    handleUploadError(err) {
      this.$modal.msgError('上传图片失败，请重试');
      this.$modal.closeLoading();
    },
    // 上传成功回调
    async handleUploadSuccess(res, file) {
      if (res.code === 0) {
        const fileName = res.data;

        // 根据当前的文件名称获取完整的文件访问路径
        /*const fullUrl = await getFullUrl(fileName).then(response => {
          return response.data;
        });*/
        //const fullUrl = `http://${window.location.hostname}/minio/${fileName}`;
        console.log(window.location.hostname);
        const fullUrl = "http://172.18.12.250:9000/ammes/"+fileName;

        this.uploadList.push({ name: fileName, url: fullUrl });
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除文件
    handleDelete(index) {
      const fileInfo = this.fileList[index];
      deleteFile(fileInfo.name).then(response => {
        if (response.code === 0) {
          // 开始移除列表信息
          this.fileList.splice(index, 1);
          this.$emit('input', this.listToString(this.fileList));
        } else {
          this.$modal.msgError("删除文件失败!");
        }
      });
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        console.log(this.fileList);
        this.uploadList = [];
        this.number = 0;
        this.$emit('input', this.listToString(this.fileList));
        this.$modal.closeLoading();
      }
      console.log(this.fileList);
    },
    // 获取文件名称
    getFileName(name) {
      if (name.lastIndexOf('/') > -1) {
        return name.slice(name.lastIndexOf('/') + 1);
      } else {
        return '';
      }
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = '';
      separator = separator || ',';
      for (let i in list) {
        strs += list[i].url + separator;
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : '';
    },
    handlePreview(fileUrl) {
      console.log(fileUrl);
      const parts = fileUrl.split('?');
      console.log(parts[0]);
      let base64Url = this.base64Encode(parts[0]);
      const kkFileViewUrl = `http://172.18.12.250:8012/onlinePreview?url=${base64Url}`;
      console.log(kkFileViewUrl);
      window.open(kkFileViewUrl, '_blank');
    },
    /**
     * Base64 编码函数
     * @param {string} str - 需要编码的字符串
     * @returns {string} Base64 编码后的字符串
     */
    base64Encode(str) {
      return btoa(unescape(encodeURIComponent(str)));
    }
  },
};
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}

.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}

.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>
