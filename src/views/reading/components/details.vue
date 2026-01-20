<template>
  <div class="post-container">
    <el-form ref="formData" :model="formData" label-width="120px">
      <sticky :class-name="'sub-navbar'" style="margin-bottom: 20px" :z-index="10">
        <el-button type="success" size="medium" @click="onSubmit">确认</el-button>
        <el-button type="warning" size="medium" @click="onCancel">取消</el-button>
      </sticky>
      <div class="form-container">
        <el-row>
          <el-col :span="16">
            <el-form-item label="书本名" prop="name">
              <el-input v-model="formData.name" type="text" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="作者名" prop="author">
              <el-input v-model="formData.author" type="text" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" class="w-100" placeholder="请选择">
                <el-option
                  v-for="item in readingStatus()"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="完结时间" prop="finishedAt">
              <el-date-picker
                v-model="formData.finishedAt"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { create, update, details } from '@/api/reading'
import { readingStatus } from "@/utils/reading"

export default {
  name: 'ReadingDetails',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // form数据
      formData: {
        id: '',
        name: '', // 名称
        author: "",
        status: 95, // 状态
        finishedAt: "" // 完结时间
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    readingStatus,
    // 初始化数据
    load() {
      if (this.isEdit) {
        // 如果是编辑状态下，则渲染数据
        const id = this.$route.params.id
        details(id).then(response => {
          const { data } = response
          // 书籍渲染
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
                message: '书籍编辑成功',
                duration: 5000,
                type: 'success'
              })
              this.onCancel()
            }).catch(error => {
              console.log(error)
            })
          } else {
            // 添加请求
            create(this.formData).then(response => {
              const { message } = response
              this.$notify({
                title: message,
                message: '书籍添加成功',
                duration: 5000,
                type: 'success'
              })
              this.onCancel()
            }).catch(error => {
              console.log(error)
            })
          }
        }
      })
    },
    // 取消
    onCancel() {
      this.$router.push('/reading/list')
    }
  }
}
</script>
