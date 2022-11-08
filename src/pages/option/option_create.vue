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
  storeApp.setPageTitle("เพิ่มตัวเลือก");
  storeApp.setActivePage("option_list");
});

function onSave() {
  console.log('DATASAVE');
  console.log(form_model.value);
  
  MasterdataService.createOption(form_model.value)
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
