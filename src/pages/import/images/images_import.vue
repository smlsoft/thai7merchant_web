<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-2 surface-section flex-auto">
        <ProgressBar v-if="loading" :value="onUploadProgress" />
        <FileUpload
          name="Image[]"
          :customUpload="true"
          @uploader="myUploader"
          :multiple="true"
          accept="image/*"
          :maxFileSize="1000000"
        >
          <template #empty>
            <p>Drag and drop files to here to upload.</p>
          </template>
        </FileUpload>
      </div>

      <Toast position="top-right" />
    </MainContentWarp>
  </AppLayout>
</template>

<script setup>
/* eslint-disable */
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const router = useRouter();
const data_import = ref([]);

const del_data = ref({});
const onUploadProgress = ref(0);

const loading = ref(false);

onMounted(() => {});

function myUploader(event) {
  data_import.value = event.files;

  loading.value = true;

  data_import.value.forEach((ele) => {

    MasterdataService.importImages(ele, (eventx) => {
      onUploadProgress.value = Math.round((100 * eventx.loaded) / eventx.total);
      console.log(onUploadProgress.value);
    })
      .then((res) => {
        console.log(res);
        if (res.success) {
          loading.value = false;
          toast.add({
            severity: "info",
            summary: "Success",
            detail: "File Uploaded",
            life: 3000,
          });
        }
      })
      .catch((err) => {
        loading.value = false;
        console.log(err);
        toast.add({
          severity: "Error",
          summary: "Error",
          detail: err,
          life: 3000,
        });
      });
  });
}
function onUpload(file) {
  console.log(file);
}
function confirmDelSelect() {
  var deldata = [];
  selectedItems.value.forEach((ele) => {
    deldata.push(ele.guidfixed);
  });
  if (deldata.length > 0) {
    console.log(deldata);
    MasterdataService.delProductImport(deldata)
      .then((res) => {
        console.log(res);
        if (res.success) {
          getProductImportList();
          visible_delall.value = false;
          selectedItems.value = [];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
</script>
