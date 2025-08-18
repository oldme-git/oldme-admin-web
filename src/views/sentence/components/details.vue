<template>
  <div class="post-container">
    <el-form ref="formData" :model="formData" label-width="120px">
      <sticky :class-name="'sub-navbar'" style="margin-bottom: 20px" :z-index="10">
        <el-button type="success" size="medium" @click="onSubmit">确认</el-button>
        <el-button type="warning" size="medium" @click="onCancel">取消</el-button>
      </sticky>
      <div class="form-container">
        <el-row>
          <el-col :span="12">
            <el-form-item label="来源书籍" prop="bookId">
              <el-select v-model="formData.bookId" class="w-100" filterable>
                <el-option :value="0" label="无来源" />
                <el-option
                  v-for="item in bList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签分类" prop="bookId">
              <el-select v-model="choseTagGrp" class="w-100" @change="getTagList">
                <el-option :value="0" label="请选择标签分类" />
                <el-option
                  v-for="item in tgList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="">
              <el-tag v-for="(item, i) in tList" :key="item.id" class="tag-cursor" effect="dark" :type="richColor(i)" @click="chooseTag(item)">{{ item.name }}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="标签">
              <el-tag
                v-for="item in choseTagList"
                :key="item.id"
                effect="dark"
                closable
                @close="delChoseTag(item)"
              >{{ item.name }}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="句子" prop="sentence">
              <el-input v-model="formData.sentence" type="textarea" autocomplete="off" :rows="20" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { create, update, details } from '@/api/sentence'
import { list as tglist } from '@/api/tag-grp'
import { list as tlist } from '@/api/tag'
import { list as rlist } from '@/api/reading'

export default {
  name: 'Sentence',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prevQuery: {},
      // form数据
      formData: {
        id: '',
        bookId: 0,
        tagIds: '',
        sentence: ""
      },
      tgList: [],
      tList: [],
      bList: [],

      choseTagGrp: 0,
      choseTagList: []
    }
  },
  created() {
    this.prevQuery = this.$route.query
    this.load()
  },
  methods: {
    // 初始化数据
    load() {
      this.getBookList()
      this.getTagGrpList()

      if (this.isEdit) {
        // 如果是编辑状态下，则渲染数据
        const id = this.$route.params.id
        details(id).then(response => {
          const { data } = response
          // 句子渲染
          this.formData = data
          // 标签渲染
          this.choseTagList = data.tag_list
        })
      }
    },
    getBookList() {
      rlist().then(({ data }) => {
        this.bList = data.list
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
    handleTagsIds() {
      this.formData.tagIds = this.choseTagList.map(item => item.id)
    },
    // 正式添加
    onSubmit() {
      this.handleTagsIds()
      // 发起请求
      if (this.isEdit) {
        // 编辑请求
        update(this.formData.id, this.formData).then(response => {
          const { message } = response
          this.$notify({
            title: message,
            message: '句子编辑成功',
            duration: 5000,
            type: 'success'
          })
          this.onCancel()
        }).catch(error => {
          console.log(error)
        })
      } else {
        // 添加请求
        create(this.formData).then(response => {
          const { message } = response
          this.$notify({
            title: message,
            message: '句子添加成功',
            duration: 5000,
            type: 'success'
          })
          // this.onCancel()
          this.resetFormData()
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 重置formData
    resetFormData() {
      this.formData = {
        id: "",
        bookId: this.formData.bookId,
        tagIds: "",
        sentence: ""
      }
      this.choseTagGrp = 0
      this.getTagList()
      this.choseTagList = []
    },
    // 取消
    onCancel() {
      this.$router.push({
        path: '/sentence/list',
        query: this.prevQuery
      })
    }
  }
}
</script>

<style>
.tag-cursor {
  cursor: pointer;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
