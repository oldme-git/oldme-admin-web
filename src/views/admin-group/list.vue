<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-left">
        <!--        name: {{ name }}-->
      </div>
      <div class="filter-right">
        <el-button type="primary" @click="add()">添加</el-button>
      </div>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'AdminGroupList',
  data() {
    return {
      name: 'admin_group',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    add() {
      this.$router.push('/admin_group/edit/1')
    }
  }
}
</script>

