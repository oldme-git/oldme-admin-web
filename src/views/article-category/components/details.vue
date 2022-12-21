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
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="formData.name" type="text" autocomplete="off"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="标签" prop="tags">
              <el-input v-model="formData.tags" type="text" autocomplete="off" v-show="false"/>
              <word-input :tags.sync="formData.tags"></word-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否显示" prop="onshow">
              <el-radio v-model="formData.onshow" :label="1">显示</el-radio>
              <el-radio v-model="formData.onshow" :label="0">隐藏</el-radio>
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
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import WordInput from '@/components/WordInput'
import Crop from '@/components/Crop'
import { create, update, details, list } from '@/api/article-category'

export default {
  name: 'ArticleCategoryDetails',
  components: { Sticky, WordInput },
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
          { min: 2, trigger: 'blur', message: '文章分类名称至少2个字符' },
          { max: 30, trigger: 'blur', message: '文章分类名称至多30个字符' }
        ],
        tags: [
          { min: 1, trigger: 'blur', message: '文章分类名称至少1个字符' },
          { max: 200, trigger: 'blur', message: '文章分类名称至多200个字符' }
        ],
        description: [
          { min: 2, trigger: 'blur', message: '描述至少2个字符' },
          { max: 200, trigger: 'blur', message: '描述至多200个字符' }
        ]
      },
      // form数据
      formData: {
        id: '',
        name: '', // 名称
        tags: "", // 标签
        description: "", // 描述
        onshow: 1 // 是否显示
      },
    }
  },
  created() {
    this.load()
  },
  methods: {
    // 初始化数据
    load() {
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
