<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <el-select v-model="param.grpId">
              <el-option :value="null">请选择</el-option>
              <el-option
                v-for="item in clist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input v-model="param.search" placeholder="搜索标题、标签、简介" @keyup.enter.native="list" />
          </el-col>
          <el-col :span="2" :offset="2">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="list">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="data.list" border style="width: 100%">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="title" label="标题" />
      <el-table-column label="关键词">
        <template slot-scope="{row}">
          <el-tag v-for="item in tags(row)" :key="item">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" sortable />
      <el-table-column label="发布状态">
        <template slot-scope="{row}">
          <span v-if="row.onshow == 1" class="c-success">
            <i class="el-icon-circle-check" />
            已发布
          </span>
          <span v-else class="c-danger">
            <i class="el-icon-circle-close" />
            未发布
          </span>
        </template>
      </el-table-column>
      <el-table-column label="置顶状态">
        <template slot-scope="{row}">
          <span v-if="row.ontop == 1" class="c-primary">
            <i class="el-icon-star-off" />
            置顶
          </span>
          <span v-else class="c-success">
            <i class="el-icon-tickets" />
            普通
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" icon="el-icon-edit" @click="handle('edit', row.id)">编辑</el-button>
          <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除文章吗？"
            @onConfirm="handle('del', row.id)"
          >
            <el-button slot="reference" type="warning" size="mini" icon="el-icon-delete">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :hide-on-single-page="hidePage"
        background
        layout="prev, pager, next, total"
        :current-page="param.page"
        :page-size="param.size"
        :total="data.total"
        @current-change="pgChange"
      />
    </div>
  </div>
</template>

<script>
import { list, del } from '@/api/article'
import { list as clist } from '@/api/article-category'

export default {
  name: 'ArticleList',
  data() {
    return {
      data: [],
      // 是否隐藏分页条
      hidePage: true,
      // 管理员组列表
      clist: [],
      // 查询条件配置
      param: {
        grpId: null,
        search: '',
        publish: 1,
        top: 0,
        page: 1,
        size: 15
      }
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      // 文章列表
      this.list()
      // 文章分类
      this.articleCateGory()
    },
    //
    list() {
      // 加载数据
      list(this.param).then(({ data }) => {
        this.data = data
      })
    },
    // 加载文章分类
    articleCateGory() {
      clist().then(response => {
        const { data } = response
        this.clist = data.list
      })
    },
    // 关键词转换为数组
    tags(item) {
      let arr = []
      if (item.tags !== null) {
        arr = item.tags.split(',')
      }
      return arr
    },
    // 改变页数
    pgChange(page) {
      this.param.page = page
      this.list()
    },
    handle(mod, id) {
      switch (mod) {
        // 编辑
        case 'edit':
          this.$router.push('/article/edit/' + id)
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
