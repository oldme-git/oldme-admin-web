<template>
  <div class="app-container">
    <el-tabs v-model="active">
      <el-tab-pane label="基本信息" name="info">
        <el-form ref="info" label-width="auto" :label-position="'left'" :rules="infoRules" :model="info">
          <el-row>
            <el-col :span="10">
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
      <el-tab-pane label="修改密码" name="password">
        <el-form ref="password" label-width="auto" :label-position="'left'" :rules="passwordRules" :model="password">
          <el-row>
            <el-col :span="10">
              <el-form-item label="旧密码" prop="oldPwd">
                <el-input :maxlength="100" autocomplete="off" v-model="password.oldPwd" type="password"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="新密码" prop="pwd">
                <el-input :maxlength="100" autocomplete="off" v-model="password.pwd" type="password"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="再次确认" prop="newPwd">
                <el-input :maxlength="100" autocomplete="off" v-model="password.newPwd" type="password"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="操作">
            <el-button type="primary" @click="submitPassword()">确认</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
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
    // 规则验证
    const pwdRules = (rule, value, callback) => {
      const isEdit = this.isEdit
      if (isEdit && value === undefined) {
        callback()
      }
      const pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      const valid = pattern.test(value)
      if (valid) {
        callback()
      } else {
        callback(new Error('至少包含数字和英文，长度6-20，不能使用特殊字符和中文字符'))
      }
    }
    const reOldPwd = (rule, value, callback) => {
      if (value === this.password.oldPwd) {
        callback(new Error('新密码不能和旧密码一致!'));
      } else {
        callback();
      }
    }
    const rePwd = (rule, value, callback) => {
      if (value !== this.password.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }

    return {
      // 基本信息规则验证
      infoRules: {
        nickname: [{ required: true, trigger: 'blur', message: '昵称不能为空' }],
        avatar: [{ required: true, trigger: 'blur', message: '请上传图片' }]
      },
      // 密码规则验证
      passwordRules: {
        oldPwd: [
          { required: true, trigger: 'blur', message: '请输入旧密码' },
          { validator: pwdRules, trigger: 'blur' }
        ],
        pwd: [
          { required: true, trigger: 'blur', message: '请输入新密码' },
          { validator: pwdRules, trigger: 'blur' },
          { validator: reOldPwd, trigger: 'blur' },
        ],
        newPwd: [
          { required: true, trigger: 'blur', message: '请再次确认' },
          { validator: pwdRules, trigger: 'blur' },
          { validator: rePwd, trigger: 'blur' }
        ]
      },
      active: 'info',
      info: {
        nickname: '',
        avatar: ''
      },
      password: {
        oldPwd: '',
        pwd: '',
        newPwd: ''
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
              message: '修改成功',
              duration: 5000,
              type: 'success'
            })
            // 更新信息
            this.$store.dispatch('user/getInfo')
          }).catch(error => {
          })
        }
      })
    },
    submitPassword() {
      // 提交信息
      this.$refs.info.validate((valid) => {
        if (valid) {
          let data = {
            old_password: this.password.oldPwd,
            password: this.password.pwd
          }
          // 发起请求
          updatePassword(data).then(response => {
            const { message } = response
            this.$notify({
              title: message,
              message: '修改密码成功，请重新登录',
              duration: 5000,
              type: 'success'
            })
            this.logout()
          }).catch(error => {
          })
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
