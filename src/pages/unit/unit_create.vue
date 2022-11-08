<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import Form from "./components/form.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApp } from "@/stores/app.js";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const storeApp = useApp();
const router = useRouter();
const form_model = ref({
  guidfixed: "",
  unitcode: "",
  unitname1: "",
  unitname2: "",
  unitname3: "",
  unitname4: "",
  unitname5: "",
});
const form_valid = ref({
  unitcode: true,
  unitname1: true,
});

onMounted(() => {

  storeApp.setPageTitle("เพิ่มข้อมูลหน่อยนับ");
  storeApp.setActivePage("master");
  storeApp.setActiveChild("unit_list");
});



async function onSave() {
  MasterdataService.createUnit(form_model.value)
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
          goTo("unit_list", "");
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
        <Form :form_model="form_model" :form_valid="form_valid" v-on:save="onSave" v-on:back="goTo('unit_list', '')" />
      </div>
    </MainContentWarp>
  </AppLayout>

</template>
