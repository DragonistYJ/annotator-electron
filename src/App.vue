<template>
  <el-container id="app">
    <el-header>
      标注系统
      <el-menu class="el-menu-demo" mode="horizontal" @select="menuSelect" background-color="#545c64" text-color="#fff"
               active-text-color="#ffd04b">
        <el-menu-item index="menu">菜单栏</el-menu-item>
        <el-menu-item index="sequence-tag">NER标注</el-menu-item>
      </el-menu>
    </el-header>
    <el-main style="height: 100%">
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'App',
  methods: {
    menuSelect(index, indexPath) {
      console.log(index, indexPath)
      this.$router.push(index);
    }
  }
}
</script>

<style scoped>
.el-container {
  height: 100%;
}
</style>
