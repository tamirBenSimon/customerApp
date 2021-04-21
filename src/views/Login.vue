<template>
  <div class="login container d-flex">
    <el-card>
      <h2>Login</h2>
      <el-form
        class="login-form"
        :model="model"
        :rules="rules"
        ref="form"
        @submit.native.prevent="login"
      >
        <el-form-item prop="username">
          <el-input
            v-model="model.username"
            placeholder="Username"
            prefix-icon="fas fa-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="model.password"
            placeholder="Password"
            type="password"
            prefix-icon="fas fa-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            class="login-button"
            type="primary"
            native-type="submit"
            block
            >Login</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      validCredentials: {
        username: "a",
        password: "a"
      },
      model: {
        username: "",
        password: ""
      },
      loading: false,
      rules: {
        username: [
          {
            required: true,
            message: "Username is required",
            trigger: "blur"
          },
          {
            min: 0,
            message: "Username length should be at least 5 characters",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "Password is required", trigger: "blur" },
          {
            min: 0,
            message: "Password length should be at least 5 characters",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    onValidation(data) {
      const vm = this;
      this.$store
        .dispatch({
          type: "login",
          userCred: { ...data }
        })
        .then(user => {
          this.$store.dispatch({
            type: "loaddrafts",
            filterBy: { username:user.Username, password:user.Password }
          });
        });
      this.$router.push("/dashbord");
    },
    async login() {
      const vm = this;
      const Http = new XMLHttpRequest();
      let url =
        "HTTP://192.117.139.150/Magicxpi4.7/MgWebRequester.dll?appname=IFSUsers&prgname=HTTP&arguments=-Avalidate%23login";
      url += "&Username=" + vm.model.username;
      url += "&Password=" + vm.model.password;
      axios.post(url).then(function(response) {
        // console.log(response)
        const resObj = response.data;
        // vm.results = [resObj[Object.keys(resObj)[0]]]
        if (resObj.Username && resObj.Username.length > 0) {
          vm.onValidation(resObj);
        }
      });
    }
  }
};
//   async login() {
//     let valid = await this.$refs.form.validate();
//     if (!valid) {
//       return;
//     }
//     this.loading = true;
//     await this.simulateLogin();
//     this.loading = false;
//     if (
//       this.model.username === this.validCredentials.username &&
//       this.model.password === this.validCredentials.password
//     ) {
//       this.$message.success("Login successfull");
//       this.$router.push("dashbord");
//     } else {
//       this.$message.error("Username or password is invalid");
//     }
//   }
// }
// };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  width: 70vw;
  height: 70vh;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button {
  width: 100%;
  margin-top: 40px;
}
.login-form {
  width: 290px;
}
.forgot-password {
  margin-top: 10px;
}
</style>
<style>
el-button--primary {
}
.login .el-input__inner:hover {
  border-color: red;
}
.login .el-input__prefix {
  background: rgb(238, 237, 234);
  left: 0;
  left: 1px;
  top: 1px;
  border-radius: 3px;
}
.login .el-input__icon {
  width: 30px;
}
.login .el-input input {
  padding-left: 35px;
}
.login .el-card {
  padding-top: 0;
  padding-bottom: 30px;
}
h2 {
  font-family: "Open Sans";
  letter-spacing: 1px;
  font-family: Roboto, sans-serif;
  padding-bottom: 20px;
}
a {
  text-decoration: none;
}

.login .el-card {
  width: 340px;
  display: flex;
  justify-content: center;
}
.el-message {
  margin-top: 60px;
}
</style>
