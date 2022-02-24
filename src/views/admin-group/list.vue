<template>
  <div class="app-container">
    <!--    <div class="filter-container">-->
    <!--      <div class="filter-left">-->
    <!--        name: {{ name }}-->
    <!--      </div>-->
    <!--      <div class="filter-right">-->
    <!--        <el-button type="primary" @click="add()">添加</el-button>-->
    <!--      </div>-->
    <!--    </div>-->
    <el-table :data="data" border style="width: 100%">
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" icon="el-icon-edit" @click="handle('edit', row.id)">编辑</el-button>
          <el-popconfirm style="margin-left: 10px"
                         confirm-button-text="确定"
                         cancel-button-text="取消"
                         icon="el-icon-info"
                         icon-color="red"
                         title="确定删除管理员组吗？"
                         @onConfirm="handle('del', row.id)"
          >
            <el-button type="warning" size="mini" icon="el-icon-delete" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { list, del, details } from '@/api/admin-group'

export default {
  name: 'AdminGroupList',
  data() {
    return {
      name: 'admin_group',
      data: [],
      detailsDialog: false
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      // 加载数据
      list().then((response) => {
        const { data } = response
        this.data = data
      })
    },
    handle(mod, id) {
      switch (mod) {
          // 编辑
        case 'edit':
          this.$router.push('/admin_group/edit/' + id)
          break
          // 删除
        case 'del':
          this.del(id)
          break
      }
    },
    // 删除
    del(id) {
      // 执行删除
      del(id).then(response => {
        const { message } = response
        this.$notify({
          title: message,
          message: '删除成功',
          duration: 5000,
          type: 'success'
        })
        this.load()
      }).catch(error => {
      })
    }
  }
}
</script>

