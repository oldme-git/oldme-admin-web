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
              <el-input v-model="formData.title" type="text" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="文章分类" prop="grpId">
              <el-select v-model="formData.grpId" class="w-100" placeholder="请选择">
                <el-option
                  v-for="item in grpList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作者" prop="author">
              <el-input v-model="formData.author" type="text" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="关键词" prop="tags">
              <el-input v-show="false" v-model="formData.tags" type="text" autocomplete="off" />
              <word-input :tags.sync="formData.tags" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="order">
              <el-input v-model.number="formData.order" type="number" :min="0" :max="9999" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否发布" prop="onshow">
              <el-radio v-model="formData.onshow" :label="1">发布</el-radio>
              <el-radio v-model="formData.onshow" :label="0">不发布</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否置顶" prop="ontop">
              <el-radio v-model="formData.ontop" :label="1">置顶</el-radio>
              <el-radio v-model="formData.ontop" :label="0">不置顶</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="描述" prop="description">
              <el-input v-model="formData.description" type="textarea" :maxlength="200" autocomplete="off" :rows="4" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="缩略图" prop="thumb">
              <crop :img.sync="formData.thumb" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <tinymce v-model="formData.content" />
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
        grpId: [{ required: true, trigger: 'blur', message: '请选择文章分类' }],
        title: [
          { required: true, trigger: 'blur', message: '请输入文章名称' },
          { min: 2, max: 100, trigger: 'blur', message: '文章名称限制2-100个字符' }
        ],
        author: [
          { min: 2, max: 30, trigger: 'blur', message: '作者限制2-30个字符' }
        ],
        tags: [
          { min: 2, max: 200, trigger: 'blur', message: '关键词限制2-200个字符' }
        ],
        description: [
          { min: 2, max: 200, trigger: 'blur', message: '描述限制10-200个字符' }
        ],
        order: [
          { type: "number", min: 0, max: 9999, trigger: 'blur', message: '排序范围在0-9999' }
        ]
      },
      // form数据
      formData: {
        id: '',
        grpId: "", // 文章分类id
        title: '', // 标题
        author: this.$store.state.user.nickname, // 作者
        tags: '', // 关键词
        description: '', // 简介
        order: 0, // 排序
        onshow: 1, // 是否发布
        ontop: 0, // 是否置顶
        thumb: '', // 缩略图
        main_img: '', // 主图
        content: '' // 富文本
      },
      // 文章分组列表
      grpList: [],
      // 上传文件信息
      upload: {
        url: url(),
        header: header()
      },
      // 编辑上传事件
      autoSaveEvent: null
    }
  },
  created() {
    this.load()
    this.autoSave()
  },
  destroyed() {
    clearInterval(this.autoSaveEvent)
  },
  methods: {
    load() {
      list().then(({ data }) => {
        this.grpList = data.list
      })
      if (this.isEdit) {
        // 如果是编辑状态下，则渲染数据
        const id = this.$route.params.id

        details(id).then(response => {
          const { data } = response
          // 处理tags null类型
          if (data.tags === null) {
            data.tags = ""
          }
          this.formData = data
        })
      }
    },
    autoSave() {
      if (this.isEdit) {
        // 编辑状况下，每过一分钟保存一次
        this.autoSaveEvent = setInterval(() => {
          this.onSubmit()
        }, 1000 * 60)
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
            }).catch(() => {
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
            }).catch(() => {
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
