<template>
  <div class="app-container">
    <el-table :data="data.list" border style="width: 100%">
      <el-table-column label="名称" prop="name" />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" icon="el-icon-edit" @click="handle('edit', row.id)">编辑</el-button>
          <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除标签吗？"
            @onConfirm="handle('del', row.id)"
          >
            <el-button slot="reference" type="warning" size="mini" icon="el-icon-delete">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { list, del } from '@/api/tag-grp'

export default {
  name: 'TagGrpList',
  data() {
    return {
      data: []
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
          this.$router.push('/tag-grp/edit/' + id)
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

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
</style>
