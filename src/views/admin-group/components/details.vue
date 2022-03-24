<template>
  <div class="post-container">
    <el-form ref="formData" :rules="rules" :model="formData" label-width="120px">
      <sticky :class-name="'sub-navbar'" style="margin-bottom: 20px" :z-index="10">
        <el-button type="success" size="medium" @click="onSubmit">确认</el-button>
        <el-button type="warning" size="medium" @click="onCancel">取消</el-button>
      </sticky>
      <div class="form-container">
        <el-form-item label="管理员组名称" prop="name">
          <el-input v-model="formData.name" type="text" :maxlength="10" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :maxlength="100" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="操作权限" prop="action">
          <el-table :data="checkData" border>
            <el-table-column>
              <template slot="header" slot-scope="scope">
                <el-checkbox label="读" v-model="rand.all" @change="handleRandAll()"
                             :indeterminate="rand.isIndeterminate" :disabled="write.all"
                />
                <i class="table-cell-tips">仅仅可以查看数据</i>
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.rand" :label="scope.row.text" @change="handleRandItem()"
                             :disabled="scope.row.write"
                />
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="scope">
                <el-checkbox label="写" v-model="write.all" @change="handleWriteAll()"
                             :indeterminate="write.isIndeterminate"
                />
                <i class="table-cell-tips">包含写权限，另外可以新增、编辑、删除数据</i>
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.write" :label="scope.row.text" @change="handleWriteItem(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
          <el-input v-model="formData.action" type="text" :maxlength="20" autocomplete="off" v-show="false"/>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { action, create, update, details } from '@/api/admin-group'

export default {
  name: 'AdminGroupDetails',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 规则验证
    const actionRules = (rule, value, callback) => {
      const checkData = this.checkData
      let valid = false
      for (const item in checkData) {
        if (checkData[item].rand) {
          valid = true
          break
        }
      }
      if (valid) {
        callback()
      } else {
        callback(new Error('请选择权限'))
      }
    }
    return {
      // 表单验证规则
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请输入管理员组名称' },
          { min: 2, trigger: 'blur', message: '管理员组名称至少2个字符' }
        ],
        description: [
          { required: true, trigger: 'blur', message: '请输入描述' },
          { min: 2, trigger: 'blur', message: '描述至少2个字符' }],
        action: [{ trigger: 'blur', validator: actionRules }]
      },
      // form数据
      formData: {
        id: '',
        name: '', // 管理员组名称
        description: '', // 描述
        rules: ''
      },
      rand: {
        all: false,
        isIndeterminate: false
      },
      write: {
        all: false,
        isIndeterminate: false
      },
      checkData: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    // 获取所有操作列表
    load() {
      const a = action().then(response => {
        const { data } = response
        const checkData = []

        // 初始化checkData数据
        for (const value in data) {
          checkData.push({
            item: data[value]['item'],
            text: data[value]['text'],
            rand: false,
            write: false
          })
        }

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
        this.checkData = checkData
      })
    },
    // 读全选
    handleRandAll() {
      const randAll = this.rand.all
      let checkData = this.checkData
      for (const item in checkData) {
        if (!checkData[item].write) {
          // 当读全选时过滤掉写权限带来的锁定
          checkData[item].rand = randAll
        }
      }
      this.rand.isIndeterminate = false
      this.checkData = checkData
    },
    // 写全选，并连带读全选
    handleWriteAll() {
      const writeAll = this.write.all
      let checkData = this.checkData
      for (const item in checkData) {
        checkData[item].write = writeAll
        checkData[item].rand = writeAll
      }
      this.write.isIndeterminate = false
      this.checkData = checkData
      // 连带读全选
      this.rand.all = writeAll
      this.handleRandAll()
    },
    // 读权限变动
    handleRandItem() {
      let checkData = this.checkData

      // 获取选中的个数
      let checkedNumber = 0
      for (const item in checkData) {
        if (checkData[item].rand) {
          checkedNumber++
        }
      }
      // 获取所有操作的个数
      const checkAllNumber = checkData.length
      // // 改变全选按钮状态
      this.rand.all = checkedNumber === checkAllNumber
      this.rand.isIndeterminate = !(checkedNumber === 0 || checkedNumber === checkAllNumber)
    },
    // 写权限变动
    handleWriteItem(index) {
      let checkData = this.checkData

      // 获取选中的个数并且
      let checkedNumber = 0
      for (const item in checkData) {
        if (checkData[item].write) {
          checkedNumber++
        }
      }
      // 获取所有操作的个数
      const checkAllNumber = checkData.length
      // // 改变全选按钮状态
      this.write.all = checkedNumber === checkAllNumber
      this.write.isIndeterminate = !(checkedNumber === 0 || checkedNumber === checkAllNumber)
      // 连带读权限
      checkData[index].rand = checkData[index].write
      this.handleRandItem()
    },
    // 正式添加
    onSubmit() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          // 整理权限数据
          const checkData = this.checkData
          const actionObj = {}
          for (const value in checkData) {
            let item = checkData[value].item
            let rand = checkData[value].rand
            let write = checkData[value].write
            if (write) {
              // 读写为6
              actionObj[item] = 6
              continue
            }
            if (rand) {
              // 读为4
              actionObj[item] = 4
            }
          }
          const formData = this.formData
          formData.rules = JSON.stringify(actionObj)
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
              this.onCancel()
            }).catch(error => {
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

<style scoped>
.table-cell-tips {
  color: #409eff;
  font-size: 12px;
  margin-left: 10px;
}
</style>
