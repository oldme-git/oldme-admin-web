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
            <el-form-item label="标题" prop="title">
              <el-input v-model="formData.title" type="text" autocomplete="off"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="文章分类" prop="cate_id">
              <el-select class="w-100" v-model="formData.cate_id" placeholder="请选择">
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
          <el-col :span="8">
            <el-form-item label="作者" prop="author">
              <el-input v-model="formData.author" type="text" autocomplete="off"/>
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
            <el-form-item label="是否发布" prop="is_publish">
              <el-radio v-model="formData.is_publish" :label="1">发布</el-radio>
              <el-radio v-model="formData.is_publish" :label="0">不发布</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否置顶" prop="is_top">
              <el-radio v-model="formData.is_top" :label="1">置顶</el-radio>
              <el-radio v-model="formData.is_top" :label="0">不置顶</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="描述" prop="description">
              <el-input v-model="formData.description" type="textarea" :maxlength="200" autocomplete="off" :rows="4"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="缩略图" prop="thumbnail">
              <crop :img.sync="formData.thumbnail"></crop>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主图" prop="main_img">
              <el-upload
                  name="img"
                  class="avatar-uploader"
                  :action="upload.url"
                  :headers="upload.header"
                  :show-file-list="false"
                  :on-success="handleSuccess"
                  :before-upload="beforeUpload"
                  accept=".png,.jpg,.gif,.jpeg,"
              >
                <div v-if="formData.main_img" class="avatar img-uploader">
                  <img :src="formData.main_img" alt="">
                </div>
                <i v-else class="el-icon-plus avatar-uploader-icon img-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容" prop="rich">
              <tinymce v-model="formData.rich"/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky'
import WordInput from '@/components/WordInput'
import Crop from '@/components/Crop'
import { url, header } from '@/utils/upload'
import { create, update, details } from '@/api/article'
import { list } from '@/api/article-category'

export default {
  name: 'ArticleDetails',
  components: { Tinymce, Sticky, WordInput, Crop },
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
        cate_id: [{ required: true, trigger: 'blur', message: '请选择文章分类' }],
        title: [
          { required: true, trigger: 'blur', message: '请输入文章名称' },
          { min: 2, max:20, trigger: 'blur', message: '文章名称限制2-20个字符' }
        ],
        author: [
          { min: 2, max:200, trigger: 'blur', message: '作者限制2-200个字符' },
        ],
        keywords: [
          { min: 2, max:500, trigger: 'blur', message: '关键词限制10-500个字符' },
        ],
        description: [
          { max: 2000, trigger: 'blur', message: '描述至多2000个字符' }
        ],
        sort: [
          { type:"number", min:0, max: 999999, trigger: 'blur', message: '排序范围在0-999999' }
        ]
      },
      // form数据
      formData: {
        id: '',
        cate_id: "", // 文章分类id
        title: '', // 标题
        author: this.$store.state.user.nickname, // 作者
        keywords: '', // 关键词
        description: '', // 简介
        sort: 0, // 排序
        is_publish: 1, // 是否发布
        is_top: 0, // 是否置顶
        thumbnail: '', // 缩略图
        main_img: '', // 主图
        rich: '' // 富文本
      },
      // 文章分组列表
      categoryList: [],
      // 上传文件信息
      upload: {
        url: url(),
        header: header()
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    // 根据等级计算属性，给属性前面加 —
    categoryName(item) {
      let str = ''
      for (let i = 1; i < item.lv; i++) {
        str += ' — '
      }
      return str + item.name
    },
    load() {
      list().then(({ data }) => {
        this.categoryList = data
      })
      if (this.isEdit) {
        // 如果是编辑状态下，则渲染数据
        const id = this.$route.params.id

        details(id).then(response => {
          const { data } = response
          // 处理keywords null类型
          if (data.keywords === null) {
            data.keywords = ""
          }
          this.formData = data
        })
      }
    },
    // 上传主图成功
    handleSuccess(response) {
      if (response.code != 0) {
        this.$notify.error({
          title: response.message,
          message: response.errors
        })
        return
      }
      this.formData.main_img = response.data
    },
    // 上传前
    beforeUpload(file) {
      // 判断是否为需要的格式
      let typeArr = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
      if (typeArr.indexOf(file.type) === -1) {
        this.$notify.error({
          title: '文件格式不正确',
          message: '请上传.jpeg,.png,.gif,.jpg文件格式的图片'
        })
        return false
      } else {
        return true
      }
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
                message: '文章编辑成功',
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
                message: '文章添加成功',
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
      this.$router.push('/article/list')
    }
  }
}
</script>
