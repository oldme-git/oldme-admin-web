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
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="formData.nickname" :maxlength="100" autocomplete="off"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="formData.password" :maxlength="100" autocomplete="off"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="头像" prop="cover">
          <el-upload
              class="avatar-uploader"
              :action="upload.url"
              :headers="upload.header"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              name="img">
            <img v-if="formData.cover" :src="formData.cover" class="avatar" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { create, update, details } from '@/api/admin'
import { list } from '@/api/admin-group'

export default {
  name: 'AdminDetails',
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
        name: [{ required: true, trigger: 'blur', message: '请输入管理员组名称' }],
        description: [{ required: true, trigger: 'blur', message: '请输入简介' }]
      },
      // form数据
      formData: {
        id: '',
        group_id: '',
        username: '',
        password: '',
        cover: '',
        nickname: '',
        status: '1'
      },
      // 管理员组
      adminGroup: {},
      upload: {
        url: "https://api.oldme.cn/admin/upload/img",
        header: {
          Authorization: "Bearer 36|Tobj4JiQDG3OK2jEssFHuDvNk9Zm4RT3l1bk7mOH"
        }
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    handleAvatarSuccess(res) {
      const { data } = res
      this.formData.cover = data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 获取所有操作列表
    load() {
      list().then(response => {
        const { data } = response
        this.adminGroup = data
      })
      // 读取管理员组
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
                message: '管理员组编辑成功',
                duration: 5000,
                type: 'success'
              })
            })
          } else {
            // 添加请求
            create(formData).then(response => {
              const { message } = response
              this.$notify({
                title: message,
                message: '管理员组添加成功',
                duration: 5000,
                type: 'success'
              })
            })
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
