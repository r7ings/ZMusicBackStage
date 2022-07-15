<template>
  <div id="root">
    <el-container>
      <el-header class="header">Header</el-header>
      <el-container>
        <el-aside class="sideBar">
          <el-menu
            default-active="1"
            class="menu"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelected"
          >
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title">数据中心</span>
            </el-menu-item>
            <!-- 各平台应用实况 -->
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">应用实况</span>
            </el-menu-item>
            <!-- 曲库管理 -->
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>歌曲管理</span>
              </template>
              <el-menu-item index="3-1">上传歌曲</el-menu-item>
              <el-menu-item index="3-2">管理歌曲</el-menu-item>
            </el-submenu>
            <!-- 各平台用户管理 -->
            <el-menu-item index="4">
              <i class="el-icon-document"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <!-- 各平台展示信息管理 -->
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>展示管理</span>
              </template>
              <el-menu-item index="5-1">Web端</el-menu-item>
              <el-menu-item index="5-2">小程序端</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleOpen() {},
    handleClose() {},
    handleSelected(index) {
      switch (index) {
        case "1":
          this.$router.push({ path: "/MainDetail" });
          break;
        case "2":
          this.$router.push({ path: "/LayOut/AppDetail" });
          break;
        case "3-1":
          this.$router.push({ path: "/LayOut/AppMusices_upload" });
          break;
        case "3-2":
          this.$router.push({ path: "/LayOut/AppMusices_manage" });
          break;
        case "4":
          this.$router.push({ path: "/LayOut/AppUsers" });
          break;
        case "5-1":
          this.$router.push({ path: "/LayOut/AppShowingManage" });
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  background-color: pink;
}
.sideBar {
  width: 200px;
  .menu {
    height: 900px;
  }
}
.main {
  width: 100px;
  height: 900px;
}
</style>