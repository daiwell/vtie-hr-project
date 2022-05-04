<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="action_head">
        <el-radio-group v-model="collect" size="mini">
          <el-radio-button
            :label="false"
            @click.native.prevent="loadImage(false)"
            >全部</el-radio-button
          >

          <el-radio-button :label="true" @click.native.prevent="loadImage(true)"
            >收藏</el-radio-button
          >
        </el-radio-group>
        <el-button
          type="success"
          size="mini"
          @click="dialogUploadVisible = !dialogUploadVisible"
          >上傳圖片</el-button
        >
      </div>
      <!-- 图片列表 -->
      <el-row :gutter="30" class="el_row" v-loading="loading">
        <!-- start -->
        <el-col
          :xs="24"
          :sm="12"
          :md="6"
          :lg="4"
          v-for="(curImage, index) in images.results"
          :key="index"
          class="iamge_warp"
        >
          <el-image
            style="height: 100px; width: 200px"
            :src="curImage.url"
            fit="cover"
          >
          </el-image>
          <div class="image_action">
            <!-- <i
              @click="updateCollect(curImage)"
              :class="{
                'el-icon-star-off': !curImage.is_collected,
                'el-icon-star-on': curImage.is_collected,
              }"
            ></i> -->
            <el-button
              type="warning"
              :loading="curImage.loading"
              @click="updateCollect(curImage)"
              :icon="
                curImage.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'
              "
              circle
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCurImage(curImage.id)"
            ></el-button>

            <!-- <i class="el-icon-delete" @click="deleteCurImage(curImage.id)"></i> -->
          </div>
        </el-col>
        <!-- / start -->
      </el-row>
      <!-- 图片列表 -->
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="per_page"
        @current-change="onPageChange"
      >
      </el-pagination>
      <!--/ 分页 -->
    </el-card>
    <!-- 彈出層 -->
    <el-dialog
      title="上傳素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        multiple
        :headers="upLoadHeader"
        name="image"
        :on-change="upLoadChange"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
    <!-- 彈出層 -->
  </div>
</template>

<script>
import { getImages, changeCollectImage, deleteImage } from "@/api/image.js";

export default {
  name: "ImageIndex",
  computed: {},
  data() {
    return {
      images: [],
      total: 0,
      page: 1,
      per_page: 30, //每页数量
      collect: "全部",
      dialogUploadVisible: false,
      upLoadHeader: {
        Authorization: `Bearer ${this.$store.state.userToken}`,
      },
      loading: false,
    };
  },
  created() {
    this.loadImage(false);
  },
  methods: {
    //加载图片数据
    async loadImage(collect = false) {
      this.loading = true;
      this.collect = collect;

      try {
        const { data } = await getImages({
          page: this.page,
          per_page: this.per_page,
          collect: collect,
        });
        this.total = data.data.total_count;
        data.data.results.forEach((item) => {
          item.loading = false;
        });
        this.images = data.data;
        //把loading关闭
        this.loading = false;
      } catch (error) {
        this.$message({
          type: "error",
          message: error.response.message,
        });
      }
    },
    onPageChange(page) {
      this.page = page;
      this.loadImage();
    },
    upLoadChange(val) {
      //  this.$message({
      //   type: "success",
      //   message: "上传素材成功",
      // });
      this.loadImage(false);
      this.dialogUploadVisible = false;
    },
    async updateCollect(imgInfo) {
      imgInfo.loading = true;
      let { id, is_collected } = imgInfo;
      try {
        const { data } = await changeCollectImage(id, !is_collected);
        imgInfo.is_collected = !imgInfo.is_collected;
        imgInfo.loading = false;
        this.$message({
          type: "success",
          message: `${is_collected ? "取消收藏" : "收藏"}成功`,
        });
      } catch (error) {
        console.log(error);
        this.$message({
          type: "error",
          message: "收藏素材失败",
        });
      }
    },
    async deleteCurImage(imageID) {
      this.loading = true;
      try {
        await deleteImage(imageID);
        this.$message({
          type: "success",
          message: "删除当前素材成功",
        });
        this.loadImage();
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el_row {
  margin-top: 30px;
}
.action_head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.iamge {
  width: 100%;
  height: 100%;
  background-size: cover;
}
.iamge_warp {
  position: relative;
  padding-left: 0px;
  padding-right: 0px;
}
.image_action {
  width: 90%;
  height: 40px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: 2%;
  left: 7%;
  i {
    font-size: 20px;
  }
}
</style>