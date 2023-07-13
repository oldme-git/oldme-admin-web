<template>
  <div class="post-container">
    <el-form ref="formData" :rules="rules" :model="formData" label-width="120px">
      <sticky :class-name="'sub-navbar'" style="margin-bottom: 20px" :z-index="10">
        <el-button type="success" size="medium" @click="onSubmit">确认</el-button>
        <el-button type="warning" size="medium" @click="onCancel">取消</el-button>
      </sticky>
      <div class="form-container">
        <el-row>
          <el-col :span="16">
            <el-form-item label="显示名称" prop="name">
              <el-input v-model="formData.name" type="text" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="email" prop="email">
              <el-input v-model="formData.email" type="email" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="网站" prop="site">
              <el-input v-model="formData.site" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="内容" prop="content">
              <el-input v-model="formData.content" type="textarea" :maxlength="200" autocomplete="off" :rows="4" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { update as _u, details as _d, create as _c } from '@/api/reply'

export default {
  name: 'ReplyDetails',
  components: { Sticky },
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
        name: [
          { required: true, trigger: 'blur', message: '请输入显示名称' },
          { min: 1, max: 20, trigger: 'blur', message: '显示名称限制1-20个字符' }
        ],
        email: [
          { required: true, trigger: 'blur', message: '请输入email' },
          { min: 1, max: 100, trigger: 'blur', message: 'email限制1-100个字符' }
        ],
        site: [
          { min: 1, max: 50, trigger: 'blur', message: '网站限制1-50个字符' }
        ],
        content: [
          { required: true, trigger: 'blur', message: '请输入内容' },
          { min: 2, max: 1000, trigger: 'blur', message: '内容限制2-1000个字符' }
        ]
      },
      // form数据
      formData: {
        id: 0,
        pid: 0,
        aid: 0,
        email: "tyyn1022@163.com",
        name: "oldme",
        site: "https://oldme.net",
        content: ""
      }
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.formData.id = this.$route.params.id
      if (this.isEdit) {
        _d(this.formData.id).then(response => {
          const { data } = response
          this.formData = {
            id: data.id,
            email: data.email,
            name: data.name,
            site: data.site,
            content: data.content
          }
        })
      } else {
        this.formData.aid = this.$route.params.aid
        this.formData.pid = this.$route.params.id
      }
    },
    // 正式添加
    onSubmit() {
      const that = this
      this.$refs.formData.validate((valid) => {
        if (valid) {
          // 发起请求
          if (this.isEdit) {
            _u(this.formData.id, this.formData).then(response => {
              const { message } = response
              that.$notify({
                title: message,
                message: '文章回复编辑成功',
                duration: 5000,
                type: 'success'
              })
              that.onCancel()
            }).catch(() => {})
          } else {
            _c(this.formData).then(response => {
              const { message } = response
              that.$notify({
                title: message,
                message: '回复成功',
                duration: 5000,
                type: 'success'
              })
              that.onCancel()
            }).catch(() => {})
          }
        }
      })
    },
    // 取消
    onCancel() {
      this.$router.go(-1)
    }
  }
}
</script>
