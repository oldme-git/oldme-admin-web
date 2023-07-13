<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-row type="flex" align="middle">
          <el-col :span="6">
            <el-input v-model="param.search" placeholder="搜索名称，邮箱，内容" @keyup.enter.native="list" />
          </el-col>
          <el-col :span="2" :offset="2">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="list">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="data.list" border style="width: 100%">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="email" label="email" />
      <el-table-column label="审核状态">
        <template slot-scope="{row}">
          <span v-if="row.status == 1" class="c-primary">
            <i class="el-icon-circle-plus-outline" />
            待审核
          </span>
          <span v-else-if="row.status == 2" class="c-success">
            <i class="el-icon-circle-check" />
            审核通过
          </span>
          <span v-else-if="row.status == 3" class="c-danger">
            <i class="el-icon-circle-close" />
            审核失败
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-data-analysis" @click="handle('show', row.id)">查看</el-button>
<!--          <el-button type="primary" size="mini" icon="el-icon-chat-line-square" @click="handle('add', row.id)">回复</el-button>-->
          <el-button type="success" size="mini" icon="el-icon-edit" @click="handle('edit', row.id)">编辑</el-button>
          <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除文章回复吗？"
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
import { list as _l, del as _d } from '@/api/reply'

export default {
  name: 'ReplyList',
  props: {
    status: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      data: [],
      // 是否隐藏分页条
      hidePage: true,
      // 查询条件配置
      param: {
        search: '',
        page: 1,
        size: 15,
        status: this.status
      }
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      // 文章回复列表
      this.list()
    },
    //
    list() {
      // 加载数据
      _l(this.param).then(({ data }) => {
        this.data = data
      })
    },
    // 改变页数
    pgChange(page) {
      this.param.page = page
      this.list()
    },
    handle(mod, id) {
      switch (mod) {
        // 查看
        case 'show':
          this.$router.push('/reply/show/' + id)
          break
        // 编辑
        case 'edit':
          this.$router.push('/reply/edit/' + id)
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
      _d(id).then(response => {
        const { message } = response
        this.$notify({
          title: message,
          message: '删除成功',
          duration: 5000,
          type: 'success'
        })
        this.load()
      }).catch(error => {})
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
