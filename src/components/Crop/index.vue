<!--
  图片裁剪组件
  field 上传图片字段名称
  url 上传地址
  header 请求头
  img 上传后的图片地址
-->
<template>
  <div class="wrap">
    <el-button class="avatar-uploader" @click="cropShow">
      <img v-if="img" :src="img" class="avatar" alt="">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-button>
    <crop-upload
        ref="upload"
        :field="field"
        v-model="show"
        :url="url"
        :headers="header"
        @crop-upload-success="cropSuccess"
    ></crop-upload>
  </div>
</template>

<script>
import cropUpload from 'vue-image-crop-upload/upload-2.vue'
import { url, header } from '@/utils/upload'

export default {
  name: 'Crop',
  data() {
    return {
      show: false
    }
  },
  props: {
    field: {
      type: String,
      default: 'file'
    },
    url: {
      type: String,
      default: url()
    },
    img: {
      type: String,
      default: ""
    },
    header: {
      type: Object,
      default: () => {
        return header()
      }
    }
  },
  components: {
    cropUpload
  },
  methods: {
    // 上传头像成功后
    cropSuccess(response) {
      const { code, message, data } = response
      if (code === 0) {
        this.$emit("update:img", data.path)
      } else {
        this.$notify({
          title: '失败',
          message,
          duration: 5000,
          type: 'error'
        })
      }
      this.show = false
    },
    // 打开上传头像
    cropShow() {
      this.$refs.upload.setStep(1)
      this.show = true
    },
  }
}
</script>
