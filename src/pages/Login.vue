<script setup>
import BlankLayout from "@/components/layout/BlankLayout.vue";
import { useRouter } from "vue-router";
import { ref } from 'vue'

import { useAuthen } from "@/stores/authen.js"
import AuthenService from "@/services/AuthenService";

const store = useAuthen()
const username = ref("")
const password = ref("")
const listShop = ref(undefined)
const checked = ref(false)
const showShopList = ref(false)
const loading = ref(false)
const router = useRouter();
const loginFailed = ref(false)

async function handleLogin() {
  loading.value = true;
  console.log(username, password)

  localStorage.removeItem("_token");
  await store.login(username.value, password.value)

  console.log("Can Login " , store.loginSuccess)

  if (store.loginSuccess) {
    // select shop

    AuthenService.getListShop()
          .then((res) => {
            console.log(res);
            if (res.success) {
              showShopList.value = true;
              listShop.value = res.data;
            }
          })
          .catch((err) => {
            
            console.log(err);
          });
  }
  else {
    loginFailed.value = true;
  }
  loading.value = false;
}

function selectShop(item) {
      localStorage.shopid = item.shopid;
      localStorage.shop_name = item.name;
      localStorage.shop_role = item.role;
      AuthenService.selectShop().then((res) => {
        if (res.success) {
          // this.showSnackBar("เข้าสู่ระบบสำเร็จ", "success");
        
          setTimeout(async () => {
            router.push({name : "dashboard" });
          }, 1000);
        } else {
          // this.showSnackBar(
          //   " ไม่สามารถเชื่อมต่อได้ เนื่องจากฐานข้อมูลมีปัญหา",
          //   "error"
          // );
        }
      });
    }

function goHome() {
  router.push({
    name: "home",
  });
}

</script>

<template>
  <div
    class="surface-ground px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center"
  >
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6" v-if="!showShopList">
      <div class="text-center mb-5">
        <img src="@/assets/dedepos.png" alt="Image" height="50" class="mb-3" />
        <div class="text-900 text-3xl font-medium mb-3">Thai7 Merchant</div>
        <span class="text-600 font-medium line-height-3"
          >Don't have an account?</span
        >
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer"
          >Create today!</a
        >
      </div>

      <div>
        <label for="email1" class="block text-900 font-medium mb-2"
          >Email</label
        >
        <InputText id="email1" type="text" class="w-full mb-3" v-model="username" />

        <label for="password1" class="block text-900 font-medium mb-2"
          >Password</label
        >
        <InputText id="password1" type="password" class="w-full mb-3" v-model="password" />

        <div class="flex align-items-center justify-content-between mb-3">
          <div class="flex align-items-center">
            <Checkbox
              id="rememberme1"
              :binary="true"
              v-model="checked"
              class="mr-2"
            ></Checkbox>
            <label for="rememberme1">Remember me</label>
          </div>
          <a
            class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer"
            >Forgot password?</a
          >
        </div>

        <div style="height: 20px">
          <span v-if="loginFailed" style="color: #FF0000" class="text-xs">*Invalid Username or Password.</span>
        </div>
        <Button
          label="Sign In"
          icon="pi pi-user"
          class="w-full"
          v-if="loading==false"
          @click="handleLogin()"
        ></Button>

        <Button icon="pi pi-spin pi-spinner" v-if="loading==true" class="w-full" ></Button>
      </div>
    </div>

    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6" v-if="showShopList">
      <div class="text-3xl font-medium text-900 mb-3">เลือกร้านค้า</div>
       <div class="">
         <ul class="list-none p-0 m-0">
           <li  style="border-radius: 10px; border-color:rgba(234,179,10,.5)" class="pb-3 cursor-pointer p-3 border-1" v-for="shop in listShop" :key="shop" @click="selectShop(shop)">
             {{ shop.name}}
           </li>
         </ul>
       </div>
    </div>
  </div>
</template>
