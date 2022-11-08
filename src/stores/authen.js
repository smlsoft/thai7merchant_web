import { defineStore } from "pinia";
import AuthService from "@/services/AuthenService";
import router from '@/router'

export const useAuthen = defineStore("authen", {
  state: () => ({     
      loginSuccess: false,
      loginErrorMsg: "",
      token: localStorage.getItem("_token"),
      userCode: localStorage.getItem("_usercode"),
      permission: [],
    })
  ,
  actions: {
    async login(username, password) {
      //let loginSuccess = false,
      //  errorMsg = "";

      //console.log("Login : ", username, password)

      await AuthService.login(username, password)
        .then((response) => {
          let respData = response.data;
          // console.log(respData);
          if (respData.success && respData.token != "") {
            this.loginSuccess = true;
            localStorage._token = respData.token;
            localStorage._usercode = username;
            //commit("SET_TOKEN", { token: respData.token, userCode: username });
            this.token = respData.token;
            this.userCode = username;
          } else {
            this.loginSuccess = false;
            this.loginErrorMsg = "Username or password is wrong !";
          }
        })
        .catch((err) => {
          this.loginSuccess = false;
          this.loginErrorMsg = err;
        });


      // load permission
      // if (loginSuccess) {
      //   let permission = {};      
      //   //await commit("SET_PERMISSION", { permission: permission });
      // }

      //await commit("SET_LOGIN", { success: loginSuccess, msgErr: errorMsg });
    },
    directSetToken(token){
      localStorage._token = token;
      this.token = token;
    },
    logout() {
      localStorage._token = "";
      localStorage._usercode = "";
 
      this.token = "";
      this.userCode = "";
 
    },
    directLogout() {
      localStorage._token = "";
      localStorage._usercode = "";

      this.token = "";
      this.userCode = "";
      router.push({name: 'login'})
    },
    // async checkPermission({ commit }) {
    //   let errorMsg = "";
    //   // console.log("chekc perm")
    //   await UserService.getPermission()
    //     .then((response) => {
    //       //console.log(response)
    //       if (response.success) {
    //         commit("SET_PERMISSION", { permission: response.permission });
    //       } else {
    //         errorMsg = "Something wrong !";
    //       }
    //     })
    //     .catch((err) => {
    //       errorMsg = err;
    //     });

    //   if (errorMsg) {
    //     // show snagbar error
    //   }
    // },
  },
});
