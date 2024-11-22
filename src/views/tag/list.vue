<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <el-select v-model="param.grpId">
              <el-option
                v-for="item in clist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="list">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="data.list" border style="width: 100%">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="名称" />
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
Article
<script>
import { list, del } from '@/api/tag'
import { list as clist } from '@/api/tag-grp'

export default {
  name: 'TagList',
  data() {
    return {
      data: [],
      // 是否隐藏分页条
      hidePage: true,
      // 管理员组列表
      clist: [],
      // 查询条件配置
      param: {
        grpId: null
      }
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      // 标签分类
      this.tagGrp()
    },
    //
    list() {
      // 加载数据
      list(this.param).then(({ data }) => {
        this.data = data
      })
    },
    // 加载标签分类
    tagGrp() {
      clist().then(response => {
        const { data } = response
        this.clist = data.list
        this.param.grpId = data.list[0].id
        this.list()
      })
    },
    handle(mod, id) {
      switch (mod) {
        // 编辑
        case 'edit':
          this.$router.push('/tag/edit/' + id)
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
        console.log(error)
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
