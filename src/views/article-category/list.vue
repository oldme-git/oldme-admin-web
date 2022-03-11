<template>
  <div class="app-container">
    <el-table :data="data" border style="width: 100%">
      <el-table-column label="名称">
        <template slot-scope="{row}">
          {{ categoryName(row) }}
        </template>
      </el-table-column>
      <el-table-column label="关键词">
        <template slot-scope="{row}">
          <el-tag v-for="item in categoryKeywords(row)" :key="item">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序"/>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" icon="el-icon-edit" @click="handle('edit', row.id)">编辑</el-button>
          <el-popconfirm style="margin-left: 10px"
                         confirm-button-text="确定"
                         cancel-button-text="取消"
                         icon="el-icon-info"
                         icon-color="red"
                         title="确定删除文章分类吗？"
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
import { list, del } from '@/api/article-category'

export default {
  name: 'ArticleCategoryList',
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
    // 根据等级计算属性，给属性前面加 —
    categoryName(item) {
      let str = ""
      for (let i = 1; i < item.lv; i++) {
        str += " — "
      }
      return str + item.name
    },
    // 关键词转换为数组
    categoryKeywords(item) {
      let arr = []
      if (item.keywords !== null) {
        arr = item.keywords.split(",")
      }
      return arr
    },
    handle(mod, id) {
      switch (mod) {
          // 编辑
        case 'edit':
          this.$router.push('/article_category/edit/' + id)
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
