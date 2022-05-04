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
          <el-form
            ref="refForm"
            :rules="formRules"
            :model="userInfo"
            label-width="80px"
            v-loading="formLoading"
          >
            <el-form-item label="編號"> {{ userInfo.id }} </el-form-item>
            <el-form-item label="手機"> {{ userInfo.mobile }} </el-form-item>
            <el-form-item label="媒體名稱" prop="name">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>

            <el-form-item label="媒體介紹" prop="intro">
              <el-input type="textarea" v-model="userInfo.intro"></el-input>
            </el-form-item>

            <el-form-item label="郵箱" prop="email">
              <el-input v-model="userInfo.email"></el-input>
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
        <el-button
          type="primary"
          @click="dialogOff"
          :loading="updatePhotoLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserProfile } from "@/api/user";
import { updateUserImage } from "@/api/image";

import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import globalBus from "@/utils/global-bus.js";
export default {
  name: "SettingIndex",
  data() {
    return {
      form: {},
      userInfo: {},
      dialogVisible: false,
      previewIamge: "",
      cropper: null,
      formRules: {
        name: [
          { required: true, message: "请输入个人名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        intro: [{ required: true, message: "内容不能为空", trigger: "blur" }],
        email: [{ required: true, message: "内容不能为空", trigger: "blur" }],
      },
      updatePhotoLoading: false,
      formLoading: false,
    };
  },
  created() {
    this.loadUserProfile();
  },
  methods: {
    //表单提交时触发
     onSubmit() {
      this.$refs["refForm"].validate(async (valid) => {
        if (valid) {
          this.formLoading = true;
          const { data } = await updateUserProfile(this.userInfo);
          this.formLoading = false;
          this.$message({
            type: "success",
            message: "修改资料成功",
          });
          // evBus
          globalBus.$emit("update-user", { ...this.userInfo, ...data.data });//因为更新的data里面没有photo,所以需要新加一个photo字段
        }else{
           this.$message({
            type: "error",
            message: "检查表单是否有误",
          }); 
        }
      });
    },
    //但上传文件时触发
    onFileChange() {
      const flie = this.$refs["File"];
      const BlobData = flie.files[0];
      const imgUrl = window.URL.createObjectURL(BlobData);
      this.previewIamge = imgUrl;
      this.dialogVisible = true;

      this.$refs["File"].value = "";
    },
    //加载用户信息
    async loadUserProfile() {
      const { data } = await getUserProfile();
      this.userInfo = data.data;
    },
    //关闭dialog对话框触发
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
        });
      });
    },
    //但用户裁剪图片点击确认时候的回调
    dialogOff() {
      this.updatePhotoLoading = true;
      this.cropper.getCroppedCanvas().toBlob(async (file) => {
        const Fd = new FormData();
        Fd.append("photo", file);
        const { data } = await updateUserImage(Fd);
        this.userInfo.photo = data.data.photo;
        globalBus.$emit("update-user", this.userInfo);

        this.updatePhotoLoading = false;
        this.dialogVisible = false;

        this.$message({
          type: "success",
          message: "修改图片成功",
        });
      });
      //关闭dialog对话框
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