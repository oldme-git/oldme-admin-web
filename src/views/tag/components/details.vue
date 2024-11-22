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
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name" type="text" autocomplete="off"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="标签分类" prop="grpId">
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
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { create, update, details } from '@/api/tag'
import { list } from '@/api/tag-grp'

export default {
  name: 'TagDetails',
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
          { required: true, trigger: 'blur', message: '请输入标签名称' },
          { min: 1, trigger: 'blur', message: '标签名称至少1个字符' },
          { max: 30, trigger: 'blur', message: '标签名称至多30个字符' }
        ]
      },
      // form数据
      formData: {
        id: '',
        grpId: "",
        name: '' // 名称
      },
      grpList: [],
    }
  },
  created() {
    this.load()
  },
  methods: {
    // 初始化数据
    load() {
      list().then(({ data }) => {
        this.grpList = data.list
      })
      if (this.isEdit) {
        // 如果是编辑状态下，则渲染数据
        const id = this.$route.params.id
        details(id).then(response => {
          const { data } = response
          // 标签分类渲染
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
                message: '标签分类编辑成功',
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
                message: '标签分类添加成功',
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
      this.$router.push('/tag/list')
    }
  }
}
</script>
