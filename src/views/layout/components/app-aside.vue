<template>
  <el-menu
    default-active=""
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    background-color="#002033"
    text-color="#fff"
    active-text-color="#ffd04b"
    router=""
    :collapse="isCollapse"
    
  >
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-folder"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
     <el-menu-item index="/publish">
      <i class="el-icon-edit-outline"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="el-icon-folder-opened"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
   
    <el-menu-item index="/comment">
      <i class="el-icon-chat-line-round"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
     <el-menu-item index="fans">
      <i class="el-icon-user-solid"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
     <el-menu-item index="settings">
      <i class="el-icon-s-tools"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "AppAside",
  props:{
    isCollapse:{
      type:Boolean,
      required:true
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style>
</style>