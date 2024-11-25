<template>
  <div>
    <el-button size="small" @click="handleOpen">拍照 <i class="el-icon-camera el-icon--right"></i></el-button>

    <el-dialog title="拍照" :visible.sync="cameraDialog" @close="closeclick" :close-on-click-modal="false"
               v-if="cameraDialog" width="600px">
      <div class="camera-box" v-loading="loading">
        <div class="camera-left">
          <video ref="videoCamera" width="100%" height="100%"></video>
        </div>
        <div class="camera-right">
          <div class="camera-img-box">
            <div class="small-img" v-for="(img, index) in images" :key="index">
              <img :src="img" style="width: 200px;height: 150px;"/>
            </div>
            <canvas ref="canvasCamera" class="canvas" :width='videoWidth' :height='videoHeight'
                    style="display: none;"></canvas>
          </div>
          <div>
            <el-button type="primary" class="save-camera-btn" icon="el-icon-camera" @click="drawImage"
                       style="margin-top: 10px;">拍照
            </el-button>
            <el-button type="primary" class="save-camera-btn" icon="el-icon-check" @click="uploadPictures">保存
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {uploadFace} from "@/api/system/user";
import store from "@/store";

export default {
  name: "userFace",
  data() {
    return {
      cameraDialog: false,
      images: [],
      thisVideo: null,
      thisContext: null,
      thisCanvas: null,
      videoWidth: 500,
      videoHeight: 300,
      loading: true,
      user: {
        id: undefined,
      },
      targetCameraId: null, // 用于存储目标摄像头的ID
    };
  },
  methods: {
    handleOpen() {
      this.loading = true;
      this.cameraDialog = true;
      this.getCameraInfo(); // 获取摄像头信息
    },
    async getCameraInfo() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        // 尝试找到特定的摄像头, 当前需调用前置摄像头
        //const specificCamera = videoDevices.find(device => device.label === 'GC8034' || device.label === 'GC5035');
        const specificCamera = videoDevices.find(device => device.label === 'GC8034');
        if (specificCamera) {
          this.targetCameraId = specificCamera.deviceId;
          console.log('找到指定摄像头:', specificCamera);
        } else {
          // 如果没有找到特定摄像头，尝试获取默认摄像头
          const defaultCamera = videoDevices[0]; // 默认取列表中的第一个摄像头作为默认摄像头
          if (defaultCamera) {
            this.targetCameraId = defaultCamera.deviceId;
            console.log('使用默认摄像头:', defaultCamera);
          } else {
            console.log('未找到任何可用的摄像头');
            this.$notify({
              title: '错误',
              message: '未找到任何可用的摄像头',
              type: 'error'
            });
          }
        }

        // 一旦获取到摄像头信息，就调用 getCompetence 方法
        this.$nextTick(() => {
          this.getCompetence();
        });
      } catch (error) {
        console.error('获取摄像头信息失败:', error);
        this.$notify({
          title: '错误',
          message: '获取摄像头信息失败',
          type: 'error'
        });
      }
    },
    getCompetence() {
      if (!this.$refs.videoCamera) {
        console.error('Video element is not ready');
        return;
      }

      const deviceId = this.targetCameraId || undefined;
      const constraints = {
        audio: false,
        video: {
          width: this.videoWidth,
          height: this.videoHeight,
          deviceId: { exact: deviceId }
        }
      };

      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        this.$refs.videoCamera.srcObject = stream;
        this.$refs.videoCamera.onloadedmetadata = () => {
          this.$refs.videoCamera.play();
          this.loading = false;
        };
      }).catch(err => {
        console.error("无法打开摄像头: ", err);
        this.$notify({
          title: '警告',
          message: '没有开启摄像头权限或浏览器版本不兼容.',
          type: 'warning'
        });
      });
    },
    drawImage() {
      if (!this.$refs.canvasCamera) {
        console.error('Canvas element is not ready');
        return;
      }
      this.thisContext = this.$refs.canvasCamera.getContext('2d');
      this.thisContext.drawImage(this.$refs.videoCamera, 0, 0, this.videoWidth, this.videoHeight);
      const imgSrc = this.$refs.canvasCamera.toDataURL('image/png');
      this.images.push(imgSrc);
      console.log('Image captured:', imgSrc); // Debug log
    },
    uploadPictures() {
      if (this.images.length === 0) {
        this.$notify({
          title: '错误',
          message: '没有图片可供上传.',
          type: 'error'
        });
        return;
      }
      let formData = new FormData();
      for (let i = 0; i < this.images.length; i++) {
        const blob = this.dataURLtoBlob(this.images[i]);
        formData.append('facesInfo', blob);
      }
      uploadFace(formData).then(resp => {
        console.log('Upload response:', resp);
        this.$modal.msgSuccess('修改成功');
        this.cameraDialog = false;
        this.resetCanvas();
      }).catch(error => {
        console.error('Upload error:', error);
        this.$notify({
          title: '错误',
          message: '图片上传失败.',
          type: 'error'
        });
      });
    },
    clearCanvas(id) {
      let c = document.getElementById(id);
      let cxt = c.getContext("2d");
      cxt.clearRect(0, 0, c.width, c.height);
    },
    resetCanvas() {
      this.images = [];
      this.clearCanvas('canvasCamera');
    },
    stopNavigator() {
      if (this.$refs.videoCamera && this.$refs.videoCamera.srcObject) {
        this.$refs.videoCamera.srcObject.getTracks().forEach(track => track.stop());
      }
    },
    closeclick() {
      this.cameraDialog = false;
      this.resetCanvas();
      this.stopNavigator();
    },
    dataURLtoBlob(dataurl) {
      const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      return new Blob([u8arr], {type: mime});
    },
  },
  mounted() {
    this.thisVideo = this.$refs.videoCamera;
    this.thisCanvas = this.$refs.canvasCamera;
    this.thisContext = this.thisCanvas.getContext('2d');
  },
}
</script>

<style scoped>
</style>
