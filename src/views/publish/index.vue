<template>
  <div class="publish-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator="">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{
        $route.query.id ? "修改文章" : "发布文章"
      }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑 -->
    <el-card class="form-card-container">
      <!-- form 表单 -->

      <el-form
        ref="refForm"
        :model="articleInfo"
        :rules="rules"
        label-width="80px"
        v-loading="loading"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap
            lang="zh"
            v-model="articleInfo.content"
            :extensions="extensions"
            height="300px"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="活动区域" prop="channel_id">
          <el-select
            v-model="articleInfo.channel_id"
            placeholder="请选择文章频道"
          >
            <el-option
              v-for="(channels, index) in channels"
              :key="index"
              :label="channels.name"
              :value="channels.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="articleInfo.cover.type">
            <el-radio label="1">单图</el-radio>
            <el-radio label="3">三图</el-radio>
            <el-radio label="0">无图</el-radio>
            <el-radio label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">{{
            $route.query.id ? "更新" : "发表"
          }}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
      <!-- /form表单 -->
    </el-card>
  </div>
</template>

<script>
import {
  getArticleChanels,
  addArticle,
  updateArticle,
  getArticle,
  uploadImage,
} from "@/api/article.js";
import { ElementTiptap } from "element-tiptap";
import {
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  CodeBlock,
  TextColor,
} from "element-tiptap";

import "element-tiptap/lib/index.css";
export default {
  name: "PublishIndex",
  components: {
    "el-tiptap": ElementTiptap,
  },
  data() {
    return {
      articleInfo: {
        title: "",
        content: "",
        cover: {
          type: 0,
          images: [],
        },
        channel_id: null,
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          urlPattern: function (file) {
            console.log(file);
          },
        }),
        new Underline(), // 下划线
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 华丽的分割线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Preview(),
        new CodeBlock(),
        new TextColor(),
      ],
      channels: [],
      loading: false,
      rules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 5,
            max: 30,
            message: "长度在 5 到 30 个字符",
            trigger: "blur",
          },
        ],
        content: [
          {
            validator: (rule, value, callback) => {
              if (value == "<p></p>") {
                callback(new error("请输入文章内容"));
              } else {
                callback();
              }
            },
          },
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.loadChannels();
    if (this.$route.query.id) {
      this.loadCurArticle();
    }
  },
  methods: {
    onPublish(draft = false) {
      this.$refs["refForm"].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        //draft 默认是false 不存入草稿
        this.loading = true;
        const { id } = this.$route.query;
        try {
          //增加文章接口
          if (id) {
            //根据传入的id判断是否是更新文章还是编辑发布新文章
            // 更新文章接口
            await updateArticle(id, this.articleInfo, draft);
            this.$router.push("/article");
          } else {
            await addArticle(this.articleInfo, draft);
          }

          this.$message({
            type: "success",
            message: `操作成功`,
          });
        } catch (error) {
          console.log(error);
          this.$message({
            type: "error",
            message: "操作失败",
          });
        }
        this.loading = false;
      });
    },
    //加载频道数据
    async loadChannels() {
      try {
        const {
          data: { data },
        } = await getArticleChanels();
        this.channels = data.channels;
      } catch (error) {
        console.log(error);
      }
    },
    //根据文章id请求当前文章数据
    async loadCurArticle() {
      const { data } = await getArticle(this.$route.query.id);
      this.articleInfo = data.data;
    },
  },
};
</script>

<style lang="less" scoped>
.form-card-container {
  margin-top: 30px;
}
</style>