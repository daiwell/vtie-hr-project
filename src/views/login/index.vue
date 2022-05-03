<template>
  <div class="login-container">
    <!--
           配置用户表单验证规则 
            1、 给e-form 绑定model属性
            2、 给el-form-item 绑定prop属性 
            3、 el-form 配置验证规则
      
      -->
    <el-form
      class="form-warp"
      :model="userInfo"
      :rules="formRules"
      ref="refForm"
    >
      <el-form-item prop="mobile">
        <el-input v-model="userInfo.mobile"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="userInfo.code"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="userInfo.agree">我已阅读此条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          class="submit_btn"
          type="primary"
          @click="onSubmit"
          :loading="loginLoading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { loginApi } from "@/api/user.js";
import {setItem} from '@/utils/storage.js'
export default {
  data() {
    return {
      userInfo: {
        mobile: "13911111111",
        code: "246810",
        agree: false,
      },
      loginLoading: false,
      formRules: {
        mobile: {
          pattern: /^1[3|4|5|6|8|9]\d{9}$/,
          required: true,
          message: "手机号应该是11位",
          trigger: "change",
        },
        code: {
          pattern: /^\d{6}$/,
          required: true,
          message: "验证码应该为6位数",
          trigger: "change",
        },
        agree: {
          validator: (rule, value, callback) => { //自定義規則屬性規則
            if (value) {
              //驗證通過即通過驗證
              callback();
            } else {
              callback(new Error("请勾选"));
            }
          },
          trigger: "change",
        },
      },
    };
  },
  methods: {
    onSubmit() {
      if (this.userInfo.agree) {
        this.$refs.refForm.validate((val, err) => {
          if (!val) {
            this.$message.error("检查输入是否正确");
            return false;
          } else {
            this.loadLogin();
          }
        });
      }
      this.loginLoading = false;
    },
    async loadLogin() {
      // 开启登陆中 loading...
      this.loginLoading = true;
      try {
        const { data } = await loginApi(this.userInfo);
        setItem('userInfo',data.data);
        this.$store.commit('setUserToken',data.data)
        // 登录成功
        this.$message({
          message: "登录成功",
          type: "success",
        });
        this.$router.push({
          name:'home'
        })
      } catch (error) {
        this.$message.error("登录失败，手机号或验证码错误");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/login_bg.jpg");
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .form-warp {
    box-sizing: border-box;
    text-align: center;
    width: 400px;
    background: white;
    padding: 20px 20px;
    .el-form-item__label {
      color: white;
    }
    .submit_btn {
      width: 300px;
    }
  }
}
</style>