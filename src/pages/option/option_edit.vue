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
  guidfixed: "",
  code: Utils.uuidv4(),
  name1: "",
  name2: "",
  name3: "",
  name4: "",
  name5: "",
  required: true,
  choicetype: 0,
  maxselect: 0,
  choices: [],
});

onMounted(() => {
  storeApp.setPageTitle("แก้ไขตัวเลือก");
  storeApp.setActivePage("option_list");
  getDetail(route.params.id);
});

function getDetail(data) {
  MasterdataService.getOptionDetail(data)
    .then((res) => {
      console.log(res);
      if (res.success) {
        form_model.value.guidfixed = res.data.guidfixed;
        form_model.value.name1 = res.data.name1;
        form_model.value.name2 = res.data.name2;
        form_model.value.name3 = res.data.name3;
        form_model.value.name4 = res.data.name4;
        form_model.value.name5 = res.data.name5;
        form_model.value.choices = res.data.choices;
        form_model.value.required = res.data.required;
        form_model.value.choicetype = res.data.choicetype
   
      }
      console.log(form_model.value);
    })
    .catch((err) => {
      console.log(err);
    });
}

function onSave() {
  console.log(form_model.value);

  MasterdataService.updateOption(form_model.value)
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
          goTo("option_list", "");
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
        <Form :form_model="form_model" v-on:save="onSave" v-on:back="goTo('option_list', '')" />
      </div>
    </MainContentWarp>
  </AppLayout>
</template>
