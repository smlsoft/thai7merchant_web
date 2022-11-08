<script setup>
import DialogForm from "@/components/widget/DialogForm.vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useApp } from "@/stores/app.js";
import { useRouter } from "vue-router";
import Utils from "@/utils/";

const router = useRouter();
const code_detail = ref("");
const storeApp = useApp();
const toast = useToast();
const detail = ref();
const data_list = ref([]);
const sortField = ref("itemcode");
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
const categoryList = ref([]);
const isUnitStandard = ref(0);


onMounted(() => {
  getInventoryList();
  getCategoryList();
  storeApp.setPageTitle("ข้อมูลสินค้า");
  storeApp.setActivePage("master");
  storeApp.setActiveChild("product_list");
});


function getInventoryList() {
  loading.value = true;
  MasterdataService.getInventoryList(
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

function sortBy(data) {
  //console.log(data);
  sortField.value = data.sortField;
  sortOrder.value = data.sortOrder;

  loading.value = true;
  MasterdataService.getInventoryList(
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
  console.log(detail.value.barcode);
  code_detail.value = detail.value.barcode;

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
  MasterdataService.getInventoryList(
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

function deleteDetail() {
  MasterdataService.delInventory(detail.value.guidfixed)
    .then((res) => {
      console.log(res);
      if (res.success) {
        getInventoryList(activePage.value);
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

  MasterdataService.getInventoryList(
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

function getCategoryList() {
  MasterdataService.getCategoryList()
    .then((res) => {
      //console.log(res);
      if (res.success) {
        categoryList.value = res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function newResultCategory(data) {
  var result = [];
  result = categoryList.value.filter((val) => val.guidfixed == data);
  return result.length > 0 ? result[0].name1 : "ไม่พบข้อมูล";
}

function newResult(data, index) {
  if (data.isunitstandard == true) {
    return isUnitStandard.value = index;
  }

}


</script>
  
<template>
  <AppLayout>
    <MainContentWarp>
      <div class="grid"></div>
      <div class="grid mt-2">
        <div class="col-12">
          <DataTable :value="data_list" dataKey="guidfixed" class="p-datatable-sm" :loading="loading" stripedRows
            responsiveLayout="scroll" @sort="sortBy" v-model:expandedRows="expandedRows">
            <template #header>
              <div class="flex">
                <div class="flex-none flex align-items-center justify-content-start">
                  <Button label="เพิ่มข้อมูลสินค้า" icon="pi pi-plus" class="w-auto"
                    @click="goTo('product_create', '')"></Button>
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
            <Column field="itemcode" header="รหัสสินค้า" :sortable="true"></Column>
            <Column field="name1" header="ชื่อสินค้า" :sortable="true"></Column>
            <Column field="categoryguid" header="หมวดสินค้า" :sortable="true">
              <template #body="{ data, field }">
                {{ newResultCategory(data[field]) }}
              </template>
            </Column>
            <Column bodyStyle="text-align:center" style="width: 5%">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning p-button-text"
                  @click="goTo('product_edit', slotProps.data.guidfixed)" />
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
                <h4>ข้อมูลหน่วยนับ ของรหัสสินค้า {{ mainProps.data.itemcode }}</h4>
                <DataTable :value="mainProps.data.unituses" class="editable-cells-table" responsiveLayout="scroll"
                  showGridlines>
                  <Column header="หน่วยนับ" style="width: 20%">
                    <template #body="slotProps">
                      {{ slotProps.data.unitcode}} ~ {{slotProps.data.unitname1}}
                    </template>
                  </Column>
                  <Column field="itemunitstd" header="ตัวตั้ง" style="text-align: right !important"
                    headerStyle="text-align:center;width: 10%">
                    <template #body="{ data, field }">
                      {{ Utils.formatCurrency(data[field]) }}
                    </template>

                  </Column>
                  <Column field="itemunitdiv" header="ตัวหาร" style="text-align: right !important"
                    headerStyle="text-align:center;width: 10%">
                    <template #body="{ data, field }">
                      {{ Utils.formatCurrency(data[field]) }}
                    </template>
                  </Column>

                  <Column field="isunitstandard" header="หน่วยคงเหลือ" bodyStyle="text-align:center" style="width: 10%">
                    <template #body="{ data, field ,index}">
                      <div style="display: none;">{{ newResult(data,index) }}</div>
                      <RadioButton id="isUnitStandard" name="isUnitStandard" :value="index" v-model="isUnitStandard"
                        :disabled="true" />
                    </template>
                  </Column>
                </DataTable>
              </div>
              <div class="orders-subtable p-3">
                <h4>ข้อมูลบาร์โค้ด ของรหัสสินค้า {{ mainProps.data.itemcode }}</h4>
                <DataTable :value="mainProps.data.barcodes" class="editable-cells-table" responsiveLayout="scroll"
                  showGridlines>
                  <Column field="barcode" header="บาร์โค้ด" style="width: 20%"></Column>
                  <Column field="unitcode" header="ชื่อหน่วยนับ" style="width: 20%"></Column>
                  <Column field="price" header="ราคาขาย" style="text-align: right !important"
                    headerStyle="text-align:center;width: 10%">
                    <template #body="{ data, field }">
                      {{ Utils.formatCurrency(data[field]) }}
                    </template>
                  </Column>
                </DataTable>
              </div>
            </template>
          </DataTable>
        </div>
      </div>
      <div>
        <DialogForm :confirmDialog="confirmDeleteDialog" textContent="ต้องการลบข้อมูลสินค้า" :code_detail="code_detail"
          v-on:close="onClose" v-on:confirm="deleteDetail"></DialogForm>
      </div>
    </MainContentWarp>
  </AppLayout>
</template>
  
<style scoped>

</style>