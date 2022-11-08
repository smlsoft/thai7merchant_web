<script setup>
import { useApp } from "@/stores/app.js";
import { useLang } from "@/stores/lang.js";
import { ref } from "vue";
const storeLang = useLang();
const storeApp = useApp();
const selectLangList = ref(false);
function toggle(event) {

  selectLangList.value = true;
  console.log(storeApp.languages)
}
</script>

<template>
  <div
    class="flex justify-content-between align-items-center px-3 surface-section shadow-2 relative lg:static border-bottom-1 surface-border animation-duration-200 animation-ease-in-out"
    style="height: 6vh"
  >
    <a
      class="cursor-pointer block text-700 p-ripple"
      @click="storeApp.setActivedToggle()"
    >
      <i class="pi pi-bars"></i>
    </a>
    <div class="align-items-center flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full surface-overlay left-0 top-100 z-1 shadow-2 lg:shadow-none">
        <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row">
        
        </ul>
        <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row border-top-1 surface-border lg:border-top-none">
<!--          
            <li class="border-top-1 surface-border lg:border-top-none">
                <a v-ripple class="flex px-6 p-3 lg:px-3 lg:py-2 align-items-center hover:surface-100 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple"
                v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }" >
                    <img src="@/assets/flags/th.png" class="mr-3 lg:mr-0" style="width: 40px; height: 28px"/>
                    <div class="block lg:hidden">
                        <div class="text-900 font-medium">Josephine Lillard</div>
                        <span class="text-600 font-medium text-sm">Marketing Specialist</span>
                    </div>
                </a>
            </li> -->
        </ul>
    </div>
  </div>
</template>
