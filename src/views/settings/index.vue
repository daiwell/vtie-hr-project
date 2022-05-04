<template>
  <div class="setting_container">
    <el-card class="top_card">
      <!-- 面包屑 -->
      <el-breadcrumb separator="">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人设置</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 面包屑 -->
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="編號"> {{ userInfo.id }} </el-form-item>
            <el-form-item label="手機"> {{ userInfo.mobile }} </el-form-item>
            <el-form-item label="媒體名稱">
              <el-input v-model="userInfo.name">{{ userInfo.name }}</el-input>
            </el-form-item>

            <el-form-item label="媒體介紹">
              <el-input type="textarea" v-model="userInfo.intro">{{
                userInfo.intro
              }}</el-input>
            </el-form-item>

            <el-form-item label="郵箱">
              <el-input v-model="userInfo.email">{{ userInfo.email }}</el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="4" :span="5">
          <label for="file">
            <el-avatar
              shape="square"
              :size="100"
              fit="cover"
              :src="userInfo.photo"
            ></el-avatar>
            <div>點擊修改頭像</div>
          </label>
          <input
            ref="File"
            id="file"
            type="file"
            hidden
            @change="onFileChange"
          />
          <div></div>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="裁剪頭像"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      append-to-body
      @opened="dialogOpenfish"
    >
      <div class="preview-img-warp">
        <img ref="previewImg" class="preview-img" :src="previewIamge" alt="" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOff">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import { updateUserImage } from "@/api/image";

import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
export default {
  name: "SettingIndex",
  data() {
    return {
      form: {},
      userInfo: {},
      dialogVisible: false,
      previewIamge: "",
      cropper: null,
      UpdateBeforeImgUrl:''
    };
  },
  mounted() {},
  created() {
    this.loadUserProfile();
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    onFileChange() {
      const flie = this.$refs["File"];
      const BlobData = flie.files[0];
      const imgUrl = window.URL.createObjectURL(BlobData);
      this.previewIamge = imgUrl;
      this.dialogVisible = true;

      this.$refs["File"].value = "";
    },
    async loadUserProfile() {
      const { data } = await getUserProfile();
      console.log(data);
      this.userInfo = data.data;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //dialog打开窗口回调
    dialogOpenfish() {
      if (this.cropper) {
        this.cropper.replace(this.previewIamge);
        console.log("zxxx");
        return;
      }
      //必须要img图片展示时才初始化
      this.$nextTick(() => {
        const image = this.$refs["previewImg"];
        this.cropper = new Cropper(image, {
          aspectRatio: 16 / 9,
          viewMode: 1,
          dragMode: "move",
          aspectRatio: 1,
          cropBoxMovable: false,
          cropBoxResizable: false,
          background: true,
          movable: true,
        });
      });
    },
    dialogOff() {
      this.cropper.getCroppedCanvas().toBlob(async (file) => {
        const Fd = new FormData();
        Fd.append("photo", file);
        const {data} =await updateUserImage(Fd);
        this.userInfo.photo=data.data.photo;
        console.log(data);
      });

      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.preview-img-warp {
  .preview-img {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>