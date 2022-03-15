<template>
  <div class="app-container">
    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="info">
        <el-form ref="formData">
          <el-row>
            <el-col :span="8">
              <el-form-item label="昵称" prop="nickname">
                <el-input :maxlength="100" autocomplete="off" v-model="formData.nickname"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="头像" prop="cover">
            <el-button @click="cropShow" class="avatar-uploader">
              <img v-if="formData.avatar" :src="formData.avatar" class="avatar" alt="">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-button>
            <crop-upload
                ref="upload"
                field="img"
                @crop-upload-success="cropSuccess"
                v-model="crop.show"
                :url="crop.url"
                :headers="crop.header"
            ></crop-upload>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="password">用户管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import cropUpload from 'vue-image-crop-upload/upload-2.vue'
import { url, header } from '@/utils/upload'

export default {
  name: 'Account',
  components: {
    cropUpload
  },
  data() {
    return {
      active: 'info',
      formData: {
        nickname: '',
        avatar: ''
      },
      crop: {
        url: '',
        header: {},
        show: false
      }
    }
  },
  mounted() {
    // 读取上传图片的凭据
    this.crop.url = url()
    this.crop.header = header()

    // 初始化vuex中的数据
    this.formData.nickname = this.$store.getters.nickname
    this.formData.avatar = this.$store.getters.avatar
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 打开上传头像
    cropShow() {
      this.$refs.upload.setStep(1)
      this.crop.show = true
    },
    // 上传头像成功后
    cropSuccess(response) {
      const { code, message, data } = response
      if (code === 0) {
        this.formData.avatar = data
      } else {
        this.$notify({
          title: '失败',
          message,
          duration: 5000,
          type: 'error'
        })
      }
      this.crop.show = false
    }
  }
}
</script>
