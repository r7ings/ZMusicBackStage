<template>
  <div id="root">
    <div
      class="content"
      v-loading="loading"
      element-loading-text="登陆中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :style="`background-image:url(${bgImg});background-size:cover;background-attachment:fixed;background-repeat:no-repeat;background-position: center center;`"
    >
      <div class="loginForm">
        <div class="title">ZMusicBackStage</div>
        <el-form
          :model="loginForm"
          status-icon
          label-width="100px"
          show-message
          :rules="rules"
          class="form"
        >
          <el-form-item class="ipt" prop="account">
            <span slot="label">
              <span style="color: #fff">账号</span>
            </span>
            <el-input type="text" v-model="loginForm.account"></el-input>
          </el-form-item>
          <el-form-item class="ipt" prop="password">
            <span slot="label">
              <span style="color: #fff">密码</span>
            </span>
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="formFooter">
          <el-button class="loginBtn" type="primary" @click="loginSubmit"
            >登录</el-button
          >
        </span>
      </div>
    </div>
  </div>
</template>
 
<script>
import { Message } from "element-ui";
import axios from "axios";
export default {
  data() {
    var checkAccount = (rule, value, cb) => {
      this.submitKey[0] = false;
      if (!value) {
        this.submitKey[0] = false;
        return cb(new Error("账号不能为空"));
      } else {
        this.submitKey[0] = true;
        return cb();
      }
    };
    var checkPassword = (rule, value, cb) => {
      this.submitKey[1] = false;
      if (!value) {
        this.submitKey[1] = false;
        return cb(new Error("密码不能为空"));
      } else {
        this.submitKey[1] = true;
        return cb();
      }
    };
    return {
      loading: false,
      bgImg: require("../../static/LoginBg.png"),
      loginForm: {
        account: "",
        password: "",
      },
      submitKey: [false, false],
      rules: {
        //登录表单规则
        account: [{ validator: checkAccount, trigger: ["blur", "change"] }],
        password: [{ validator: checkPassword, trigger: ["blur", "change"] }],
      },
    };
  },
  methods: {
    loginSubmit() {
      var that = this;
      if (!(this.submitKey[0] && this.submitKey[1]))
        return Message.error("请正确输入信息");
      this.loading = true;
      axios({
        method: "post",
        url: "/login/backStage",
        params: that.loginForm,
        timeout: 10000,
      })
        .then((res) => {
          if (res.data.statusCode < 200) {
            that.loading = false;
            // console.log(res.data.message, res.data.statusCode);
            Message.error(res.data.message);
          } else {
            that.loading = false;
            sessionStorage.setItem("loginKey", true);
            Message.success("登录成功");
            that.$router.replace({ path: "/MainDetail" });
          }
        })
        .catch((err) => {
          console.log(err);
          that.loading = false;
          Message.error(err.message);
        });
    },
  },
};
</script>

<style lang='less'>
#root {
  width: 100%;
  height: 100%;
  .content {
    width: 100%;
    height: 100%;
  }
  .loginForm {
    position: relative;
    top: 30%;
    left: 41%;
    transform: translateX(-50%);
    width: 500px;
    height: 300px;
    background-color: rgba(29, 25, 26);
    opacity: 0.5;
    border-radius: 15px;
    .title {
      position: absolute;
      top: -70px;
      color: black;
      font-size: 40px;
      text-align: center;
      width: 500px;
    }
    .form {
      position: absolute;
      top: 40px;
      left: 45%;
      transform: translateX(-50%);
      .ipt {
        color: #fff;
        width: 350px;
      }
    }
    .formFooter {
      position: relative;
      top: 200px;
      left: 180px;
      width: 150px;
      .loginBtn {
        width: 150px;
      }
    }
  }
}
</style>