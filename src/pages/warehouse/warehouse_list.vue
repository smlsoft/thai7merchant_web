<script setup>
import DialogForm from "@/components/widget/DialogForm.vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useApp } from "@/stores/app.js";
import { useRouter } from "vue-router";

const router = useRouter();
const code_detail = ref("");
const storeApp = useApp();
const toast = useToast();
const detail = ref();
const data_list = ref([]);
const sortField = ref("barcode");
const sortOrder = ref(1);
const totalItemsCount = ref(0);
const limitPage = ref(20);
const filters = ref(null);
const loading = ref(true);
const activePage = ref(1);
const typingTimer = ref(null);
const doneTypingInterval = ref(1000);
const firstPage = ref(0);
const confirmDeleteDialog = ref(false);
const expandedRows = ref([]);


onMounted(() => {
  getWarehouseList();

  storeApp.setPageTitle("ข้อมูลคลังและพื้นที่เก็บสินค้า");
  storeApp.setActivePage("master");
  storeApp.setActiveChild("warehouse_list");
});


function getWarehouseList() {
  loading.value = true;
  MasterdataService.getWarehouseList(
    limitPage.value,
    activePage.value,
    filters.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_list.value = res.data;
        totalItemsCount.value = res.pagination.total;
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}

function sortBy(data) {
  //console.log(data);
  sortField.value = data.sortField;
  sortOrder.value = data.sortOrder;

  loading.value = true;
  MasterdataService.getWarehouseList(
    limitPage.value,
    activePage.value,
    filters.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      //console.log(res);
      if (res.success) {
        data_list.value = res.data;
        totalItemsCount.value = res.pagination.total;
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}

function goTo(path, param) {
  if (param != "") {
    router.push({ name: path, params: { id: param } });
  } else {
    router.push({ name: path });
  }
}

function confirmDeleteDetail(data) {
  detail.value = data;
  console.log(detail.value.code);
  code_detail.value = detail.value.code;

  confirmDeleteDialog.value = true;
}

function keyup() {
  clearTimeout(typingTimer.value);
  typingTimer.value = setTimeout(doneTyping, doneTypingInterval.value);
}
function keydown() {
  clearTimeout(typingTimer.value);
}
function doneTyping() {
  activePage.value = 1;
  firstPage.value = 0;
  MasterdataService.getWarehouseList(
    limitPage.value,
    activePage.value,
    filters.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_list.value = res.data;
        totalItemsCount.value = res.pagination.total;
        console.log(totalItemsCount.value);
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}

function deleteDetail() {
  MasterdataService.delWarehouse(detail.value.guidfixed)
    .then((res) => {
      console.log(res);
      if (res.success) {
        getWarehouseList(activePage.value);
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Deleted",
          life: 3000,
        });
        confirmDeleteDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
function onClose() {
  confirmDeleteDialog.value = false;
}
function onPage(event) {
  activePage.value = event.page + 1;
  limitPage.value = event.rows;
  loading.value = true;

  MasterdataService.getWarehouseList(
    limitPage.value,
    activePage.value,
    filters.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      //console.log(res);
      if (res.success) {
        data_list.value = res.data;
      }
      loading.value = false;
    })
    .catch((err) => {
      console.log(err);
      loading.value = false;
    });
}




</script>
    
<template>
  <AppLayout>
    <MainContentWarp>
      <div class="grid mt-2">
        <div class="col-12">
          <DataTable :value="data_list" dataKey="guidfixed" class="p-datatable-sm" :loading="loading" stripedRows
            responsiveLayout="scroll" @sort="sortBy" :rowHover="true" v-model:expandedRows="expandedRows">
            <template #header>
              <div class="flex">
                <div class="flex-none flex align-items-center justify-content-start">
                  <Button label="เพิ่มข้อมูลคลัง/พื้นที่เก็บสินค้า" icon="pi pi-plus" class="w-auto"
                    @click="goTo('warehouse_create', '')"></Button>
                </div>
                <div class="flex-1 flex align-items-center justify-content-center">
                  <Paginator :rows="20" v-model:first="firstPage" :totalRecords="totalItemsCount" @page="onPage($event)"
                    :rowsPerPageOptions="[20, 50, 100]">
                  </Paginator>
                </div>
                <div class="flex-none flex align-items-center justify-content-end">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters" placeholder="ค้นหา...." @keyup="keyup()" @keydown="keydown()" />
                  </span>
                </div>
              </div>
            </template>
            <template #empty> ไม่พบข้อมูล </template>
            <template #loading> กำลังประมวลผล กรุณารอซักครู่..</template>
            <Column :expander="true" headerStyle="width: 3rem" />
            <Column field="code" header="รหัสคลัง" :sortable="true"></Column>
            <Column field="name1" header="ชื่อคลัง 1" :sortable="true"></Column>
            <Column header="จำนวนพื้นที่เก็บ" :sortable="true">
              <template #body="slotProps">
                {{slotProps.data.locations.length}}
              </template>
            </Column>
            <Column bodyStyle="text-align:center" style="width: 5%">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning p-button-text"
                  @click="goTo('warehouse_edit', slotProps.data.guidfixed)" />
              </template>
            </Column>
            <Column bodyStyle="text-align:center" style="width: 5%">
              <template #body="slotProps">
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text"
                  @click="confirmDeleteDetail(slotProps.data)" />
              </template>
            </Column>
            <template #expansion="mainProps">
              <div class="orders-subtable p-3">
                <h4>ข้อมูลพื้นที่เก็บ {{ mainProps.data.code +" - "+ mainProps.data.name1 }}</h4>
                <DataTable :value="mainProps.data.locations" class="editable-cells-table" responsiveLayout="scroll">
                  <Column field="code" header="รหัสพื้นที่เก็บ" style="width: 20%"></Column>
                  <Column field="name1" header="ชื่อพื้นที่เก็บ" style="width: 20%"></Column>
                </DataTable>
              </div>
            </template>
          </DataTable>
        </div>
      </div>
      <div>
        <DialogForm :confirmDialog="confirmDeleteDialog" textContent="ต้องการลบข้อมูลคลัง" :code_detail="code_detail"
          v-on:close="onClose" v-on:confirm="deleteDetail"></DialogForm>
      </div>
    </MainContentWarp>
  </AppLayout>
</template>
    
  