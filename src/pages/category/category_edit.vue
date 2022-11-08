<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import Form from "./components/form.vue";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useApp } from "@/stores/app.js";
import Utils from "@/utils/";

const toast = useToast();
const storeApp = useApp();
const router = useRouter();
const route = useRoute();
const form_model = ref({
  categoryguid: localStorage.shopid,
  code: Utils.uuidv4(),
  image: "",
  name1: "",
  name2: "",
  guidfixed: "",
  name3: "",
  name4: "",
  name5: "",
  order: 0,
  parentguid: "",
});

onMounted(() => {
  storeApp.setPageTitle("แก้ไขหมวดหมู่");
  storeApp.setActivePage("category_list");
  getDetail(route.params.id);
});

function getDetail(data) {
  MasterdataService.getCategoryDetail(data)
    .then((res) => {
      console.log(res);
      if (res.success) {
        form_model.value.categoryguid = res.data.categoryguid;
        form_model.value.code = res.data.code ?? "";
        form_model.value.image = res.data.image ?? "";
        form_model.value.name1 = res.data.name1 ?? "";
        form_model.value.name2 = res.data.name2 ?? "";
        form_model.value.name3 = res.data.name3 ?? "";
        form_model.value.name4 = res.data.name4 ?? "";
        form_model.value.name5 = res.data.name5 ?? "";
        form_model.value.order = res.data.order ?? 0;
        form_model.value.guidfixed = res.data.guidfixed ?? "";
        form_model.value.parentguid = res.data.parentguid ?? "";
      }
      console.log(form_model.value);
    })
    .catch((err) => {
      console.log(err);
    });
}
function onSave() {

  console.log(form_model.value);
  form_model.value.categoryguid = localStorage.shopid + form_model.value.code;
  MasterdataService.updateCategory(form_model.value)
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
