<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <el-select v-model="param.bookId">
              <el-option :value="0" label="无来源" />
              <el-option
                v-for="item in blist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="choseTagGrp" class="w-100" @change="getTagList">
              <el-option :value="0" label="请选择标签分类" />
              <el-option
                v-for="item in tgList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-input v-model="param.search" placeholder="搜索" @keyup.enter.native="list" />
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <el-col :span="20">
            <el-tag v-for="(item, i) in tList" :key="item.id" class="tag-cursor" effect="dark" :type="richColor(i)" @click="chooseTag(item)">{{ item.name }}</el-tag>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="20">
            <el-tag
              v-for="item in choseTagList"
              :key="item.id"
              effect="dark"
              closable
              @close="delChoseTag(item)"
            >{{ item.name }}</el-tag>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="list">
      <el-card v-for="item of data.list" :key="item.id" class="box-card">
        <div>
          <span>{{ item.sentence }}</span>
        </div>
        <el-divider />
        <div style="text-align: right">
          <el-button type="text" size="mini" icon="el-icon-data-analysis" @click="handle('show', item.id)">查看</el-button>
          <el-button type="text" size="mini" icon="el-icon-edit" @click="handle('edit', item.id)">编辑</el-button>
          <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @onConfirm="handle('del', item.id)"
          ><el-button slot="reference" type="text" size="mini" icon="el-icon-delete">删除</el-button>
          </el-popconfirm>
        </div>
      </el-card>
    </div>

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
import { list, del } from '@/api/sentence'
import { list as blist } from '@/api/reading'
import { list as tglist } from "@/api/tag-grp"
import { list as tlist } from "@/api/tag"

export default {
  name: 'SentenceList',
  data() {
    return {
      data: [],
      // 是否隐藏分页条
      hidePage: true,
      blist: [],
      // 查询条件配置
      param: {
        bookId: 0,
        page: 1,
        size: 50,
        tagIds: '',
        search: ''
      },
      tgList: [],
      tList: [],
      bList: [],

      choseTagGrp: 0,
      choseTagList: []
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.getBookList()
      this.getTagGrpList()
      this.list()
    },
    search() {
      this.param.page = 1
      this.list()
    },
    list() {
      this.param.tagIds = this.choseTagList.map(item => item.id)
      // 加载数据
      list(this.param).then(({ data }) => {
        this.data = data
      })
    },
    // 加载书籍
    getBookList() {
      blist().then(response => {
        const { data } = response
        this.blist = data.list
      })
    },
    getTagGrpList() {
      tglist().then(({ data }) => {
        this.tgList = data.list
        this.getTagList()
      })
    },
    getTagList() {
      if (this.choseTagGrp === 0) {
        this.tList = []
        return
      }
      tlist({
        grpId: this.choseTagGrp
      }).then(({ data }) => {
        this.tList = data.list
      })
    },
    chooseTag(tag) {
      const index = this.choseTagList.findIndex(item => item.id === tag.id)
      if (index === -1) {
        this.choseTagList.push(tag)
      }
    },
    delChoseTag(tag) {
      const index = this.choseTagList.findIndex(item => item.id === tag.id)
      if (index !== -1) {
        this.choseTagList.splice(index, 1)
      }
    },
    richColor(i) {
      return ['success', 'info', 'warning', 'danger'][i % 4]
    },
    handle(mod, id) {
      switch (mod) {
        // 查看
        case 'show':
          this.$router.push('/sentence/show/' + id)
          break
        // 编辑
        case 'edit':
          this.$router.push('/sentence/edit/' + id)
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
    },
    // 改变页数
    pgChange(page) {
      this.param.page = page
      this.list()
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  padding-right: 20vw;
  column-count: 3;
  column-gap: 15px;

  .box-card {
    break-inside: avoid;
    margin-bottom: 15px;
    display: inline-block;
    width: 100%;
  }
}

.tag-cursor {
  cursor: pointer;
}
</style>
