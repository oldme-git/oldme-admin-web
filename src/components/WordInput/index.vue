<!--
  单词分割组件
  tags 传,隔开的字符串或者数组
-->

<template>
  <div>
    <el-tag
        :key="tag"
        v-for="tag in tagsArr"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>

    <el-input
        v-if="inputVisible"
        class="input-new-tag"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
    >
    </el-input>

    <el-button v-else class="button-new-tag new-tag" size="small" @click="showInput">+ 添加</el-button>
  </div>
</template>

<script>
export default {
  name: 'WordInput',
  props: {
    tags: {
      type: [String, Array],
      default: ['', function() {
        return []
      }]
    }
  },
  data() {
    return {
      inputVisible: false,
      inputValue: '',
      tagsArr: []
    }
  },
  mounted() {
    this.tagsToArray()
  },
  watch: {
    tags() {
      // 监听字符串类型，转为数组
      this.tagsToArray()
    },
    tagsArr() {
      // 监听数组类型，转为字符串
      this.arrayToTags()
    }
  },
  methods: {
    handleClose(tag) {
      this.tagsArr.splice(this.tagsArr.indexOf(tag), 1)
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      // 判断是否已经存在值
      if (this.tagsArr.indexOf(inputValue) !== -1) {
        this.$notify({
          title: '失败',
          message: '不能重复添加',
          duration: 5000,
          type: 'error'
        })
        return
      }
      // 添加
      if (inputValue) {
        this.tagsArr.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    tagsToArray() {
      if (this.tags.length !== 0) {
        if (typeof this.tags == 'string') {
          this.tagsArr = this.tags.split(',')
        } else {
          this.tagsArr = this.tags
        }
      }
    },
    arrayToTags() {
      if (typeof this.tags == 'string') {
        this.$emit('update:tags', this.tagsArr.toString())
      } else {
        this.$emit('update:tags', this.tagsArr)
      }
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}

.el-tag + .button-new-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 0;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
