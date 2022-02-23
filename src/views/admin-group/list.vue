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
          <el-button type="primary" size="mini" icon="el-icon-view">查看</el-button>
          <el-button type="success" size="mini" icon="el-icon-edit" @click="handle('edit', row.id)">编辑</el-button>
          <el-button type="warning" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { list } from '@/api/admin-group'

export default {
  name: 'AdminGroupList',
  data() {
    return {
      name: 'admin_group',
      data: []
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      // 加载数据
      list().then((response)=>{
        const { data } = response
        this.data = data
      })
    },
    handle(mod, id) {
      switch (mod) {
        // 编辑
        case "edit":
          this.$router.push("/admin_group/edit/" + id)
          break
        case "details":
          this.$router.push("/admin_group/details/" + id)
          break
        case "delete":
          this.$router.push("/admin_group/delete/" + id)
          break
      }
    }
  }
}
</script>

