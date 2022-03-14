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
                <el-option label="顶级分类" :value="0"></el-option>
                <el-option
                    v-for="item in categoryList"
                    :key="item.id"
                    :label="categoryName(item)"
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
              <el-input v-model="formData.keywords" type="text" autocomplete="off" v-show="false"/>
              <word-input :tags.sync="formData.keywords"></word-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="sort">
              <el-input v-model.number="formData.sort" type="number" :min="0" :max="9999999" autocomplete="off"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="描述" prop="description">
              <el-input v-model="formData.description" type="textarea" :maxlength="200" autocomplete="off" :rows="4"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="缩略图" prop="cover">
          <el-button @click="cropShow" class="avatar-uploader">
            <img v-if="formData.thumbnail" :src="formData.thumbnail" class="avatar" alt="">
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
import WordInput from '@/components/WordInput'
import { create, update, details, list } from '@/api/article-category'
import cropUpload from 'vue-image-crop-upload/upload-2.vue'
import { header, url } from '@/utils/upload'

export default {
  name: 'ArticleCategoryDetails',
  components: { Sticky, cropUpload, WordInput },
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
        sort: [
          { type:"number", min: 0, trigger: 'blur', message: '排序最小为0' },
          { type:"number", max: 9999999, trigger: 'blur', message: '排序最大为9999999' },
        ],
        description: [
          { min: 10, trigger: 'blur', message: '描述至少10个字符' },
          { max: 200, trigger: 'blur', message: '描述至多200个字符' }
        ]
      },
      // form数据
      formData: {
        id: '',
        name: '', // 名称
        parent_id: 0, // 父id
        keywords: "", // 关键词
        description: "", // 描述
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
    // 根据等级计算属性，给属性前面加 —
    categoryName(item) {
      let str = ""
      for (let i = 1; i < item.lv; i++) {
        str += " — "
      }
      return str + item.name
    },
    // 初始化数据
    load() {
      // 读取上传图片的凭据
      this.crop.url = url()
      this.crop.header = header()

      list().then(({ data }) => {
        this.categoryList = data
      })

      if (this.isEdit) {
        // 如果是编辑状态下，则渲染数据
        const id = this.$route.params.id
        details(id).then(response => {
          const { data } = response
          // 文章分类渲染
          this.formData = data
        })
      }
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
        this.formData.thumbnail = data
      } else {
        this.$notify({
          title: '失败',
          message,
          duration: 5000,
          type: 'error'
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
            update(this.formData.id, this.formData).then(response => {
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
            // 添加请求
            create(this.formData).then(response => {
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
      this.$router.push('/article_category/list')
    }
  }
}
</script>
