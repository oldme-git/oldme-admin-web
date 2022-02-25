<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" align="middle">
        <el-col :span="4">
          <el-select v-model="param.group_id" @change="list">
            <el-option
                v-for="item in glist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-radio-group v-model="param.status" @change="list">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>
    <el-table :data="data.list" border :loading="true">
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="nickname" label="昵称"/>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          <span :class="row.status === 1 ? 'c-success' : 'c-danger'">
            <i :class="row.status === 1 ? 'el-icon-circle-check' : 'el-icon-circle-close'"></i>
            {{ cStatus(row.status) }}
          </span>
        </template>
      </el-table-column>
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
    <div class="pagination-container">
      <el-pagination
          :hide-on-single-page="hidePage"
          background
          layout="prev, pager, next, total"
          :current-page="param.page"
          :page-size="param.size"
          :total="data.total"
          @current-change="pgChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { list, del } from '@/api/admin'
import { list as glist } from '@/api/admin-group'

export default {
  name: 'AdminGroupList',
  data() {
    return {
      data: {
        list: [],
        total: 0
      },
      // 管理员组列表
      glist: [],
      // 是否隐藏分页条
      hidePage: true,
      // 查询条件配置
      param: {
        page: 1,
        size: 15,
        group_id: 1,
        status: 1
      }
    }
  },
  computed: {
    cStatus() {
      return (status) => {
        let text
        if (status === 1) {
          text = '正常'
        } else {
          text = '冻结'
        }
        return text
      }
    }
  },
  created() {
    this.adminGroup()
    this.list()
  },
  methods: {
    // 加载管理员组
    adminGroup() {
      glist().then(response => {
        const { data } = response
        this.glist = data
      })
    },
    // 加载表格列表数据
    list() {
      const page = this.param.page
      const size = this.param.size
      const group_id = this.param.group_id
      const status = this.param.status
      list({ page, size, group_id, status }).then((response) => {
        const { data } = response
        this.data = data
        // 条数不够，隐藏分页条
        if (data.total <= size) {
          this.hidePage = true
        }
      })
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
          this.$router.push('/admin/edit/' + id)
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

