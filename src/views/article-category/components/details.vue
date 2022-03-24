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
        <el-form-item label="缩略图" prop="thumbnail">
          <crop :img.sync="formData.thumbnail"></crop>
        </el-form-item>
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
  components: { Sticky, WordInput, Crop },
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
      categoryList: []
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
