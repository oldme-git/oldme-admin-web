<template>
  <div class="post-container">
    <el-form ref="formData" :rules="rules" :model="formData" label-width="120px">
      <sticky :class-name="'sub-navbar'" style="margin-bottom: 20px" :z-index="10">
        <el-button type="success" size="medium">
          确认
        </el-button>
        <el-button type="warning" size="medium">
          取消
        </el-button>
      </sticky>
      <div class="form-container">
        <el-form-item label="管理员组名称" prop="name">
          <el-input v-model="formData.name" type="text" :maxlength="20" autocomplete="off" />
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input v-model="formData.description" type="textarea" :maxlength="200" autocomplete="off" />
        </el-form-item>
        <el-form-item label="操作权限">
          <el-table :data="action" border>
            <el-table-column>
              <template slot="header">
                <el-checkbox class="table-cell-checkbox" />
                <span style="margin-left: 10px">全选</span>
              </template>
              <template slot-scope="scope">
                <el-checkbox class="table-cell-checkbox" />
                <span style="margin-left: 10px">{{ scope.row.text }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <el-checkbox class="table-cell-checkbox" />
                <span style="margin-left: 10px">读 <i class="table-cell-tips">仅仅可以查看数据</i></span>
              </template>
              <template slot-scope="scope">
                <el-checkbox class="table-cell-checkbox" />
                <span style="margin-left: 10px">{{ scope.row.text }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <el-checkbox class="table-cell-checkbox" />
                <span style="margin-left: 10px">写 <i class="table-cell-tips">可以查看、新增、编辑、删除数据</i></span>
              </template>
              <template slot-scope="scope">
                <el-checkbox class="table-cell-checkbox" />
                <span style="margin-left: 10px">{{ scope.row.text }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { action } from '@/api/admin-group'

export default {
  name: 'AdminGroupAdd',
  components: { Sticky },
  data() {
    return {
      // 表单验证规则
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入管理员组名称' }],
        description: [{ required: true, trigger: 'blur', message: '请输入简介' }]
      },
      // form数据
      formData: {
        name: "", // 管理员组名称
        description: "", // 简介
        action: ""
      },
      // 操作项数据
      action: []
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    // 获取所有操作列表
    load() {
      action().then(response => {
        const { data } = response
        this.action = data
      })
    }
  }
}
</script>

<style scoped>
/*.table-cell-checkbox {*/
/*  margin-right: 4px;*/
/*}*/

.table-cell-tips {
  color: #409eff;
  font-size: 12px;
}
</style>
