<template>
  <div class="app-container">
    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="info">
        <el-form ref="info" label-width="auto" :label-position="'left'">
          <el-row>
            <el-col :span="8">
              <el-form-item label="昵称" prop="nickname">
                <el-input :maxlength="100" autocomplete="off" v-model="info.nickname"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="头像" prop="cover">
            <crop :img.sync="info.avatar"></crop>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="primary">确认</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="password">用户管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Crop from '@/components/Crop'

export default {
  name: 'Account',
  components: {
    Crop
  },
  data() {
    return {
      active: "info",
      info: {
        nickname: "",
        avatar: ""
      }
    }
  },
  mounted() {
    // 初始化vuex中的数据
    this.info.nickname = this.$store.getters.nickname
    this.info.avatar = this.$store.getters.avatar
  },
  methods: {
    test() {
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 打开上传头像
    cropShow() {
      this.$refs.upload.setStep(1)
      this.crop.show = true
    }
  }
}
</script>
