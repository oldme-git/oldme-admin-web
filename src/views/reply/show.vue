<template>
  <div class="wrap">
    <div class="item">
      <p class="title">显示名称： </p>
      <p class="value">{{ data.name }}</p>
    </div>
    <div class="item">
      <p class="title">email： </p>
      <p class="value">{{ data.email }}</p>
    </div>
    <div class="item">
      <p class="title">回复文章： </p>
      <p class="value">{{ data.articleTitle }}</p>
    </div>
    <div class="item">
      <p class="title">审核状态： </p>
      <p class="value">
        <span v-if="data.status == 1" class="c-primary">
          <i class="el-icon-circle-plus-outline" />
          待审核
        </span>
        <span v-else-if="data.status == 2" class="c-success">
          <i class="el-icon-circle-check" />
          审核通过
        </span>
        <span v-else-if="data.status == 3" class="c-danger">
          <i class="el-icon-circle-close" />
          审核失败
        </span>
      </p>
    </div>
    <div class="item">
      <p class="title">审核失败原因： </p>
      <p class="value">{{ data.reason }}</p>
    </div>
    <div class="item">
      <p class="title">回复人的网站： </p>
      <p class="value"><a :href="data.site">{{ data.site }}</a></p>
    </div>
    <div class="item">
      <p class="title">回复时间： </p>
      <p class="value">{{ data.createdAt }}</p>
    </div>
    <div class="item">
      <p class="title">更新时间： </p>
      <p class="value">{{ data.updatedAt }}</p>
    </div>
    <div class="item">
      <p class="title">回复的内容： </p>
      <p class="value"><router-link :to="'/reply/show/' + data.pid">{{ parent.content }}</router-link></p>
    </div>
    <div class="item">
      <p class="title">内容： </p>
      <p class="value">{{ data.content }}</p>
    </div>
    <div class="item" v-if="data.status != 2">
      <p class="title">审核： </p>
      <p class="value">
        <el-button type="success" size="small" @click="check(true)">通过</el-button>
        <el-button type="warning" size="small" @click="dialogCheck = true">不通过</el-button>
      </p>
    </div>
    <div class="item">
      <p class="title">操作： </p>
      <p class="value">
        <el-button type="success" size="small" @click="handle('edit')">编辑</el-button>
        <el-button type="warning" size="small" @click="handle('add')">回复</el-button>
      </p>
    </div>
    <el-dialog
      title="失败原因"
      :visible.sync="dialogCheck"
      width="50%"
    >
      <el-input
        type="textarea"
        placeholder="请输入失败原因"
        v-model="reason"
        maxlength="100"
        show-word-limit
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCheck = false">取 消</el-button>
        <el-button type="primary" @click="check(false)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { details as _d, check as _c } from "@/api/reply"
import {data} from "autoprefixer";

export default {
  name: "ReplyShow",
  data() {
    return {
      data: {},
      parent: {},
      id: 0,
      result: false,
      reason: "",
      dialogCheck: false
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.load()
  },
  methods: {
    load() {
      // 文章回复列表
      this.show()
    },
    show() {
      // 加载数据
      _d(this.id).then(({ data }) => {
        this.data = data
        this.parent = data.parentReply
      })
    },
    check(result) {
      const that = this
      _c(this.id, {
        result,
        reason: this.reason
      }).then(response => {
        const { message } = response
        this.$notify({
          title: message,
          message: '审核成功',
          duration: 5000,
          type: 'success'
        })
        that.load()
        this.dialogCheck = false
      })
    },
    handle(mod) {
      switch (mod) {
        // 编辑
        case 'edit':
          this.$router.push('/reply/edit/' + this.data.id)
          break
        // 回复
        case 'add':
          this.$router.push('/reply/add/' + this.data.id + "/" + this.data.aid)
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.wrap {
  padding: 20px 60px;
}

.item {
  display: flex;
  position: relative;

  .title {
    width: 150px;
    flex-shrink: 0;
  }

  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background: #409eff;
    bottom: 0;
  }
}
</style>
