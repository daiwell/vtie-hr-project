<template>
  <div class="article-container">
    <el-card class="top_card">
      <!-- 面包屑 -->
      <el-breadcrumb separator="">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 面包屑 -->
      <!-- 表单 -->
      <el-form
        ref="form"
        :model="form"
        label-width="40px"
        size="mini"
        class="table_list"
      >
        <el-form-item label="特殊资源">
          <el-radio-group v-model="form.curSelect">
            <el-radio :label="null">全部</el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
            <el-radio label="已删除"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择频道">
          <el-select
            v-model="form.channelId"
            placeholder="请选择活动区域"
            v-if="channels.length"
          >
            <el-option
              v-for="(curChannel, index) in channels"
              :key="index"
              :label="curChannel.name"
              :value="curChannel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">筛选</el-button>
        </el-form-item>
      </el-form>
      <!-- /表单 -->
    </el-card>
    <!-- 列表 -->
    <el-card>
      <div slot="header" class="clearfix">
        根据筛选条件共查询到{{ articles.total_count }} 条结果：
      </div>
      <el-table
        v-if="articles"
        :data="articles.results"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="pubdate" label="图片" width="180">
          <template slot-scope="scope">
            <!-- <img
              class="cover"
              v-if="scope.row.cover.images[0]"
              :src="scope.row.cover.images[0]"
              alt=""
            />
            <img class="cover" v-else src="../../assets/no-cover.gif" alt="" /> -->
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              :lazy="true"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180"
        ></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <!-- row就是当前列表item -->
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布事件"
          width="180"
        ></el-table-column>
        <el-table-column prop="status" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              circle
              @click="
                $router.push({
                  name: 'publish',
                  query: {
                    id: scope.row.id,
                  },
                })
              "
            ></el-button>
            <el-button
              circle
              size="mini"
              type="danger "
              icon="el-icon-delete"
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表 -->
      <!-- 页码 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        @current-change="loadArticle"
        :current-page.sync="page"
        :page-size="pageSize"
        :disabled="loading"
      >
      </el-pagination>
      <!-- /页码 -->
    </el-card>
  </div>
</template>

<script>
import to from "await-to-js";
import {
  getArticles,
  getArticleChanels,
  deleteArticle,
} from "@/api/article.js";
export default {
  name: "ArticleIndex",
  data() {
    return {
      form: {
        name: "",
        channelId: null,
        date1: "",
        date2: "",
        delivery: false,
        type: [1, 2, 3, 4, 5],
        curSelect: null,
        desc: "",
      },
      rangeDate: [],
      articles: [], //文章列表数据
      articleStatus: [
        { status: 0, text: "草稿", type: "info" }, // 0
        { status: 1, text: "待审核", type: "" }, // 1
        { status: 2, text: "审核通过", type: "success" }, // 2
        { status: 3, text: "审核失败", type: "warning" }, // 3
        { status: 4, text: "已删除", type: "danger" }, // 4
      ],
      loading: false,
      totalCount: 0,
      pageSize: 20,
      selectStatus: null,
      channels: [],
      page: 1, //当前分页器的页码
    };
  },
  created() {
    this.loadArticle();
    this.loadChannels();
  },
  methods: {
    onSubmit() {
      let selectText = this.form.curSelect;
      let status = null;
      if (selectText !== null) {
        [{ status }] = this.articleStatus.filter((item) => {
          return item.text === selectText;
        });
      }

      this.selectStatus = status;
      this.loadArticle();
    },
    async loadArticle(curPage) {
      this.loading = true;
      const { data } = await getArticles({
        page: curPage,
        per_page: this.pageSize,
        status: this.selectStatus,
        channel_id: this.form.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null,
      });
      this.articles = data.data;
      this.totalCount = data.data.total_count;
      this.loading = false;
    },
    async loadChannels() {
      const [err, data] = await to(getArticleChanels());
      this.channels = data.data.data.channels;
      if (err) {
        console.warn(err);
      }
    },
    //删除当前文章
    async onDeleteArticle(articleId) {
      try {
        await deleteArticle(articleId);
        let ret = await this.loadArticle(this.page);
        console.log(ret);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.top_card {
  margin-bottom: 30px;
}
.table-list {
  margin-bottom: 10px;
}
.cover {
  width: 100%;
  background-size: cover;
}
</style>