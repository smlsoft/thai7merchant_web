<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-2 surface-section flex-auto">
        <div class="grid">
          <div class="col-12">
            <DataTable :value="data_detail" :paginator="true" :rows="15" :rowHover="true" responsiveLayout="scroll"
              class="p-datatable-sm" v-model:filters="filters" dataKey="guidfixed" v-model:expandedRows="expandedRows"
              v-model:selection="selectedItems" filterDisplay="menu">

              <template #header>
                <div class="flex">
                  <div class="flex-1 justify-content-start align-items-right">
                    <div class="table-header-container">
                      <Button icon="pi pi-plus" label="เพิ่มตัวเลือก" class="mr-1" @click="goTo('option_create', '')" />
                    </div>
                  </div>
                  <div class="flex justify-content-end align-items-right">
                    <span class="p-input-icon-left">
                      <i class="pi pi-search" />
                      <InputText v-model="filters['global'].value" placeholder="ค้นหา...." />
                    </span>
                  </div>
                </div>
              </template>
              <!--<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>-->
              <Column :expander="true" headerStyle="width: 3rem" />
              <Column field="code" header="รหัส" :sortable="true"></Column>
              <Column field="name1" header="ชื่อ1" :sortable="true"></Column>
              <Column field="name2" header="ชื่อ2" :sortable="true"></Column>
              <Column headerStyle="text-align: center" bodyStyle="text-align: center;" field="maxselect"
                header="จำนวนสูงสุด" :sortable="true"></Column>
              <Column headerStyle="text-align: center" bodyStyle="text-align: center;" field="choicetype"
                header="ประเภทตัวเลือก" :sortable="true"></Column>
              <Column headerStyle="text-align: center" bodyStyle="text-align: center;" field="required"
                header="จำเป็นต้องเลือก" :sortable="true"></Column>
              <Column>
                <template #body="{ data }">
                  <Button @click="goTo('option_edit', data.guidfixed)" type="button" icon="pi pi-pencil "
                    class="p-button-text p-button-warning p-button-sm"></Button>
                  <Button @click="delRow(data)" type="button" icon="pi pi-trash "
                    class="p-button-text p-button-danger p-button-sm"></Button>
                </template>
              </Column>
              <template #expansion="mainProps">
                <div class="orders-subtable">
                  <h5>รายการตัวเลือก ของ {{ mainProps.data.name1 }}</h5>
                  <DataTable :value="mainProps.data.choices" responsiveLayout="scroll">
                    <Column field="barcode" header="บาร์โค้ด" sortable></Column>
                    <Column field="name1" header="ชื่อ1" sortable></Column>
                    <Column field="name2" header="ชื่อ2" sortable></Column>
                    <Column headerStyle="text-align: center" bodyStyle="text-align: right;" field="price" header="ราคา"
                      sortable>
                      <template #body="slotProps" sortable>
                        {{ formatCurrency(slotProps.data.price) }}
                      </template>
                    </Column>
                    <Column headerStyle="text-align: center" bodyStyle="text-align: center;" field="qty" header="จำนวน"
                      sortable></Column>
                    <Column headerStyle="text-align: center" bodyStyle="text-align: center;" field="qtymax"
                      header="จำนวนสูงสุด" sortable></Column>
                    <Column field="suggestcode" header="ผู้แนะนำ" sortable></Column>
                    <Column headerStyle="text-align: center" bodyStyle="text-align: center;" field="itemunit"
                      header="หน่วยนับ" sortable></Column>
                    <Column headerStyle="text-align: center" bodyStyle="text-align: center;" field="selected"
                      header="เลือกอัตโนมัติ" sortable></Column>
                    <Column headerStyle="text-align: center" bodyStyle="text-align: center;" field="default"
                      header="ค่าเริ่มต้น" sortable></Column>
                  </DataTable>
                </div>
              </template>
            </DataTable>
          </div>
        </div>
      </div>

      <Dialog v-model:visible="visible_main" appendTo="body" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '40vw' }">
        <template #header>
          <div class="flex align-items-center">
            <span class="flex align-items-center justify-content-center bg-cyan-100 text-cyan-800 mr-3 border-circle"
              style="width: 32px; height: 32px">
              <i class="pi pi-info text-lg"></i>
            </span>
            <span class="font-medium text-2xl text-900">ยืนยันการทำงาน</span>
          </div>
        </template>
        <p class="line-height-3 p-0 m-0">
          ต้องการลบข้อมูลตัวเลือก {{ del_data.code }} ~ {{ del_data.name1 }} ใช่หรือไม่
        </p>
        <template #footer>
          <div class="border-top-1 surface-border pt-3">
            <Button icon="pi pi-times" @click="visible_main = false" label="ยกเลิก" class="p-button-text"></Button>
            <Button icon="pi pi-check" class="p-button-danger" @click="confirmDel()" label="ยืนยัน"></Button>
          </div>
        </template>
      </Dialog>
      <Dialog v-model:visible="visible_delall" appendTo="body" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '40vw' }">
        <template #header>
          <div class="flex align-items-center">
            <span class="flex align-items-center justify-content-center bg-cyan-100 text-cyan-800 mr-3 border-circle"
              style="width: 32px; height: 32px">
              <i class="pi pi-info text-lg"></i>
            </span>
            <span class="font-medium text-2xl text-900">ยืนยันการทำงาน</span>
          </div>
        </template>
        <p class="line-height-3 p-0 m-0">ต้องการลบข้อมูลสินค้าที่เลือก ใช่หรือไม่</p>
        <template #footer>
          <div class="border-top-1 surface-border pt-3">
            <Button icon="pi pi-times" @click="visible_delall = false" label="ยกเลิก" class="p-button-text"></Button>
            <Button icon="pi pi-check" class="p-button-danger" @click="confirmDelSelect()" label="ยืนยัน"></Button>
          </div>
        </template>
      </Dialog>
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
import { useApp } from "@/stores/app.js";

const storeApp = useApp();
const router = useRouter();
const visible_main = ref(false);
const visible_delall = ref(false);
const expandedRows = ref([]);
const selectedItems = ref([]);

const data_detail = ref([]);
const del_data = ref({
  INDEX: 0,
  OPTIONCODE: "",
  NAME1: "",
  NAME2: "",
  MAXSELECTED: 0,
  CHOICETYPE: 1,
  ISREQUIRED: true,
  CHOICES: [],
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  code: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  maxselect: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  name1: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  choicetype: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  required: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  order: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
});

onMounted(() => {
  storeApp.setPageTitle("ข้อมูลตัวเลือก");
  storeApp.setActivePage("option_list");
  getOptionList();
});

function getOptionList() {
  MasterdataService.getOption()
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_detail.value = res.data;

        data_detail.value.forEach((ele) => {
          if (ele.choicetype == 1) {
            ele.choicetype = "เลือกได้อย่างเดียว";
          } else {
            ele.choicetype = "เลือกได้หลายอย่าง";
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function delRow(data) {
  visible_main.value = true;
  del_data.value = data;
}

function expandAll() {
  expandedRows.value = data_detail.value;
}
function collapseAll() {
  expandedRows.value = [];
}
function confirmDel() {
  var deldata = [del_data.value.guidfixed];
  console.log(deldata);
  MasterdataService.delOption(deldata)
    .then((res) => {
      console.log(res);
      if (res.success) {
        getOptionList();
        visible_main.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function confirmDelSelect() {
  var deldata = [];
  selectedItems.value.forEach((ele) => {
    deldata.push(ele.guidfixed);
  });
  if (deldata.length > 0) {
    console.log(deldata);
    MasterdataService.delOption(deldata)
      .then((res) => {
        console.log(res);
        if (res.success) {
          getOptionList();
          visible_delall.value = false;
          selectedItems.value = [];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function goTo(path, param) {
  if (param != "") {
    router.push({ name: path, params: { id: param } });
  } else {
    router.push({ name: path });
  }
}

function formatCurrency(value) {
  return value.toLocaleString("th-TH", { style: "currency", currency: "THB" });
}
</script>
