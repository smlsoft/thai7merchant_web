<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import Form from "./components/form.vue";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApp } from "@/stores/app.js";
import Utils from "@/utils/";

const toast = useToast();
const storeApp = useApp();
const router = useRouter();
const form_model = ref({
  categoryguid: localStorage.shopid,
  code: Utils.uuidv4(),
  guidfixed:"",
  image: "",
  name1: "",
  name2: "",
  name3: "",
  name4: "",
  name5: "",
  order: 0,
  parentguid: "",
});

onMounted(() => {
  storeApp.setPageTitle("เพิ่มหมวดหมู่");
  storeApp.setActivePage("category_list");
});

function onSave() {

  console.log(form_model.value);
  form_model.value.categoryguid = localStorage.shopid + form_model.value.code;
  MasterdataService.createCategory(form_model.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({
          severity: "success",
          summary: "success",
          detail: "บันทึกข้อมูลสำเร็จ",
          life: 3000,
        });
        setTimeout(() => {
          goTo("category_list", "");
        }, 1000);
      }
    })
    .catch((err) => {
      console.log(err);
      toast.add({
        severity: "error",
        summary: "error",
        detail: "บันทึกไม่สำเร็จ " + err,
        life: 3000,
      });
    });
}

function goTo(path, param) {
  if (param != "") {
    router.push({ name: path, params: { id: param } });
  } else {
    router.push({ name: path });
  }
}
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-4 surface-section flex-auto shadow-2 border-round">
        <Form
          :form_model="form_model"
   
          v-on:save="onSave"
          v-on:back="goTo('category_list', '')"
        />
      </div>
    </MainContentWarp>
  </AppLayout>
</template>
