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
            <el-form-item label="文章分类名称" prop="name">
              <el-input v-model="formData.name" type="text" :maxlength="50" autocomplete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="父分类" prop="parent_id">
              <el-select class="w-100" v-model="formData.parent_id" placeholder="请选择">
                <el-option
                    v-for="item in categoryList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
              <el-form-item label="关键词" prop="keywords">
              <el-input v-model="formData.keywords" type="text" :maxlength="100" autocomplete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="formData.sort" type="number" :min="0" :max="9999999" autocomplete="off"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="简介" prop="description">
              <el-input v-model="formData.description" type="textarea" :maxlength="200" autocomplete="off" :rows="4"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="缩略图" prop="cover">
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
import { create, update, details, list } from '@/api/article-category'
import cropUpload from 'vue-image-crop-upload/upload-2.vue'

export default {
  name: 'ArticleCategoryDetails',
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
        name: [
          { required: true, trigger: 'blur', message: '请输入文章分类名称' },
          { min: 2, trigger: 'blur', message: '文章分类名称至少2个字符' }
        ],
        description: [
          { required: true, trigger: 'blur', message: '请输入简介' },
          { min: 2, trigger: 'blur', message: '简介至少2个字符' }]
      },
      // form数据
      formData: {
        id: '',
        name: '', // 名称
        parent_id: 0, // 父id
        description: '', // 简介
        sort: 0, // 排序，数字越大越靠前
        thumbnail: '' // 缩略图地址
      },
      // 文章分组列表
      categoryList: [],
      crop: {
        url: '',
        header: {},
        show: false
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    // 初始化数据
    load() {
      list().then(({ data }) => {
        this.categoryList = data
      })
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
          type: 'success'
        })
      }
      this.crop.show = false
    },
    // 正式添加
    onSubmit() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          // 发起请求
          if (this.isEdit) {
            // 编辑请求
            update(formData.id, formData).then(response => {
              const { message } = response
              this.$notify({
                title: message,
                message: '文章分类编辑成功',
                duration: 5000,
                type: 'success'
              })
              this.onCancel()
            }).catch(error => {
            })
          } else {
            console.log(formData)
            return
            // 添加请求
            create(formData).then(response => {
              const { message } = response
              this.$notify({
                title: message,
                message: '文章分类添加成功',
                duration: 5000,
                type: 'success'
              })
              this.onCancel()
            }).catch(error => {
            })
          }
        }
      })
    },
    // 取消
    onCancel() {
      this.$router.push('/admin_group/list')
    }
  }
}
</script>
