<template>
  <div class="comment_container">
    <el-card class="top_card">
      <!-- 面包屑 -->
      <el-breadcrumb separator="">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 面包屑 -->
    </el-card>
    <!-- 列表 -->
    <el-card>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>

        <el-table-column prop="total_comment_count" label="总评论" width="180">
        </el-table-column>

        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数"
          width="180"
        >
        </el-table-column>

        <el-table-column prop="comment_status" label="状态" width="180">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? "正常" : "关闭" }}
          </template>
          正常
        </el-table-column>

        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-switch
            :disabled='scope.row.loading'
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync='page'
        :total="totalCount"
        page-size.sync='pageSize'
        @current-change='handleChange'
        @size-change='handleSizeChange'
      >
      </el-pagination>
      <!-- /分页 -->
    </el-card>
    <!-- 列表 -->
  </div>
</template>

<script>
import { getComment, updateCommentStatus } from "@/api/comment.js";
export default {
  name: "CommentIndex",
  data() {
    return {
      tableData: [],
      loading:false,
      totalCount:0,
      page:1,
      pageSize:10,
    };
  },
  created() {
    this.loadComments();
  },
  methods: {
    async loadComments(page) {
        this.page=page
      const { data } = await getComment({
          per_page:this.pageSize,
          page:this.page
      });
       data.data.results.forEach(item => {
           item.loading=false
       });
      this.tableData = data.data.results;
      this.totalCount=data.data.total_count;
    },
    //改变评论状态
    async onStatusChange(article) {
       article.loading=true
      try {
        const { data } = await updateCommentStatus(
          article.id.toString(),
          article.comment_status
        );
             article.loading=false
        this.$message({
            type:'success',
            message:'更新状态成功'
        })
      } catch (error) {
        console.log(error);
      }
    },
    handleChange(page){
        console.log(page);
        this.loadComments(page)
    },
    handleSizeChange(changeSize){
        this.pageSize=changeSize;
        this.loadComments(1)

    }
  },
};
</script>

<style>
</style>