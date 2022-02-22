<template>
  <div class="app-container">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="日期dd" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'AdminGroupAdd',
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
  }
}
</script>

