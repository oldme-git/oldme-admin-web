<template>
  <div class="wrap">
    <div class="item">
      <p class="title">句子： </p>
      <p class="value">{{ data.sentence }}</p>
    </div>
    <div class="item">
      <p class="title">来源书籍： </p>
      <p class="value">{{ getBookName() }}</p>
    </div>
    <div class="item">
      <p class="title">标签： </p>
      <p class="value">
        <el-tag
          v-for="(item, i) in data.tag_list"
          :key="item.id"
          effect="dark"
          :type="richColor(i)"
        >{{ item.name }}</el-tag>
      </p>
    </div>
    <div class="item">
      <p class="title">操作： </p>
      <p class="value">
        <el-button @click="onCancel">返 回</el-button>
      </p>
    </div>
  </div>
</template>

<script>
import { details as _d } from "@/api/sentence"
import { list as rlist } from "@/api/reading"

export default {
  name: "SentenceShow",
  data() {
    return {
      data: {},
      bList: [],
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
      this.getBookList()
    },
    show() {
      // 加载数据
      _d(this.id).then(({ data }) => {
        this.data = data
      })
    },
    getBookList() {
      rlist().then(({ data }) => {
        this.bList = data.list
      })
    },
    getBookName() {
      for (const i of this.bList) {
        if (i.id === this.data.bookId) {
          return i.name
        }
      }
      return "暂无来源"
    },
    richColor(i) {
      return ["", 'success', 'info', 'warning', 'danger'][i % 5]
    },
    onCancel() {
      this.$router.push('/sentence/list')
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
