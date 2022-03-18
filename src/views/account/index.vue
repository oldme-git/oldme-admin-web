<template>
  <div class="app-container">
    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="info">
        <el-form ref="info" label-width="auto" :label-position="'left'" :rules="infoRules" :model="info">
          <el-row>
            <el-col :span="8">
              <el-form-item label="昵称" prop="nickname">
                <el-input :maxlength="100" autocomplete="off" v-model="info.nickname"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="头像" prop="avatar">
            <el-input :maxlength="100" autocomplete="off" v-model="info.avatar" v-if="false"/>
            <crop :img.sync="info.avatar"></crop>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="primary" @click="submitInfo()">确认</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="password">用户管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Crop from '@/components/Crop'
import { updatePassword, update } from '@/api/user'
import store from '@/store'

export default {
  name: 'Account',
  components: {
    Crop
  },
  data() {
    return {
      infoRules: {
        nickname: [{ required: true, trigger: 'blur', message: '昵称不能为空' }],
        avatar: [{ required: true, trigger: 'blur', message: '请上传图片' }],
      },
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
    submitInfo() {
      // 提交信息
      this.$refs.info.validate((valid) => {
        if (valid) {
          // 发起请求
          update(this.info).then(response => {
            const { message } = response
            this.$notify({
              title: message,
              message: "修改成功",
              duration: 5000,
              type: 'success'
            })
            // 更新信息
            this.$store.dispatch("user/getInfo")
          }).catch(error => {})
        }
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
  }
}
</script>
