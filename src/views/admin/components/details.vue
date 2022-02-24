<template>
  <div class="post-container">
    <el-form ref="formData" :rules="rules" :model="formData" label-width="120px">
      <sticky :class-name="'sub-navbar'" style="margin-bottom: 20px" :z-index="10">
        <el-button type="success" size="medium" @click="onSubmit">确认</el-button>
        <el-button type="warning" size="medium" @click="onCancel">取消</el-button>
      </sticky>
      <div class="form-container">
        <el-row>
          <el-col :span="8">
            <el-form-item label="管理员组" prop="group_id">
              <el-select class="w-100" v-model="formData.group_id" placeholder="请选择">
                <el-option
                    v-for="item in adminGroup"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="账号状态" prop="status">
              <el-radio v-model="formData.status" label="1">正常</el-radio>
              <el-radio v-model="formData.status" label="0">冻结</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formData.username" :maxlength="100" autocomplete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="formData.password" :maxlength="100" autocomplete="off"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="formData.nickname" :maxlength="100" autocomplete="off"/>
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
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { create, update, details } from '@/api/admin'
import { list } from '@/api/admin-group'
import cropUpload from 'vue-image-crop-upload/upload-2.vue'
import { url, header } from '@/utils/upload'

export default {
  name: 'AdminDetails',
  components: { Sticky, cropUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表单验证规则
      rules: {
        group_id: [{ required: true, trigger: 'blur', message: '请选择管理员组' }],
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, message: "密码 至少包含数字和英文，长度6-20，不能使用特殊字符和中文字符" }]
      },
      // form数据
      formData: {
        id: '',
        group_id: '',
        username: '',
        password: '',
        avatar: '',
        nickname: '',
        status: '1'
      },
      // 管理员组
      adminGroup: {},
      crop: {
        url: "",
        header: {},
        show: false
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    // 打开上传头像
    cropShow() {
      this.$refs.upload.setStep(1)
      this.crop.show = true
    },
    // 上传头像成功后
    cropSuccess(response) {
      const { code, message, data} = response
      if (code === 0) {
        this.formData.avatar = data
      } else {
        this.$notify({
          title: "失败",
          message,
          duration: 5000,
          type: 'success'
        })
      }
      this.crop.show = false
    },
    // 获取所有操作列表
    load() {
      // 读取管理员组
      list().then(response => {
        const { data } = response
        this.adminGroup = data
      })
      // 读取上传图片的凭据
      this.crop.url = url()
      this.crop.header = header()

      if (this.isEdit) {
        // 如果是编辑状态下，则渲染数据
        const id = this.$route.params.id
        if (id == 1) {
          // 超级管理员组不允许修改
          this.$router.push('/admin_group/list')
          this.$notify({
            title: '权限不足',
            message: '超级管理员组不允许修改',
            duration: 5000,
            type: 'error'
          })
        }

        details(id).then(response => {
          const { data } = response
          let randNumber = 0
          let writeNumber = 0

          // 根据rules渲染checkData
          const rules = data.rules
          for (const value in checkData) {
            let item = checkData[value].item
            let rule = rules[item]
            if (rule === 6) {
              checkData[value].rand = true
              checkData[value].write = true
              randNumber++
              writeNumber++
              continue
            }
            if (rule === 4) {
              checkData[value].rand = true
              randNumber++
            }
          }
          this.formData = data
          // 获取所有操作的个数
          const checkAllNumber = checkData.length
          // // 改变读全选按钮状态
          this.rand.all = randNumber === checkAllNumber
          this.rand.isIndeterminate = !(randNumber === 0 || randNumber === checkAllNumber)
          // // 改变写全选按钮状态
          this.write.all = writeNumber === checkAllNumber
          this.write.isIndeterminate = !(writeNumber === 0 || writeNumber === checkAllNumber)
        })
      }
    },
    // 正式添加
    onSubmit() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const formData = this.formData
          // 发起请求
          if (this.isEdit) {
            // 编辑请求
            update(formData.id, formData).then(response => {
              const { message } = response
              this.$notify({
                title: message,
                message: '管理员编辑成功',
                duration: 5000,
                type: 'success'
              })
            }).catch(error=>{})
          } else {
            // 添加请求
            create(formData).then(response => {
              const { message } = response
              this.$notify({
                title: message,
                message: '管理员添加成功',
                duration: 5000,
                type: 'success'
              })
            }).catch(error=>{})
          }
          this.onCancel()
        }
      })
    },
    // 取消
    onCancel() {
      this.$router.push('/admin/list')
    }
  }
}
</script>
