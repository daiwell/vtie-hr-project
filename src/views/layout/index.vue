<template>
  <el-container class="layout_container">
      <!--  侧边栏-->
    <el-aside width="auto" class="aside">
      <app-aside class="app_aside" :isCollapse="isCollapse" />
    </el-aside>
      <!--/  侧边栏-->
    <el-container>
      <el-header class="header">
        <div class="left-container">
          <i :class="{'el-icon-s-fold':!isCollapse,'el-icon-s-unfold':isCollapse,'icon':true}" @click="isCollapse=!isCollapse"></i>
          <span class="title">快资讯后台管理系统</span>
        </div>
        <div class="right-container">
          <el-image
            style="width: 30px; height: 30px"
            :src="userInfo.photo"
            class="avater"
            round
          ></el-image>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{userInfo.name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item @click.native="outLogin">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main">
          <keep-alive>

        <router-view></router-view>

          </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from "./components/app-aside.vue";
import { getUserProfile } from "@/api/user.js";

export default {
  components: { AppAside },
  name: "layoutIndex",
  data() {
    return {
      userInfo: {},
      isCollapse:false //侧边栏展示状态
    };
  },
  methods: {
    async loadUserProfile() {
      const { data } = await getUserProfile();
      console.log(data);
      this.userInfo = data.data;
    //   console.log(data.data);
    },
    outLogin(){
         this.$confirm('此操作将退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功'
          });
                 localStorage.removeItem('userInfo')
        this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });          
        });
 
    }
  },
  created() {
    this.loadUserProfile();
  },
};
</script>

<style lang="less" scoped>
.layout_container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .app_aside {
    height: 100%;
  }
  .mian {
    background-color: aquamarine;
  }
  .header {
    background-color: white;
    display: flex;
    justify-content: space-between;
    padding: 0px 10px;
    box-sizing: border-box;
    align-items: center;
    border-bottom: 1px solid whitesmoke ;
    .left-container {
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        font-size: 30px;
        margin-right: 10px;
      }
      .title {
        font-size: 30px;
      }
    }
    .right-container {
      display: flex;
      justify-content: center;
      align-items: center;
      .avater {
        margin-right: 10px;
      }
    }
  }
}
</style>