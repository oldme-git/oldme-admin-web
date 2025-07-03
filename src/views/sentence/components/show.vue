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
  // 接受父组件的id
  props: ['id'],
  // 监控id
  watch: {
    id() {
      this.load()
    }
  },
  mounted() {
    this.getBookList()
    this.load()
  },
  methods: {
    load() {
      this.show()
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
    }
  }
}
</script>

<style scoped lang="scss">
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

  .el-tag {
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
