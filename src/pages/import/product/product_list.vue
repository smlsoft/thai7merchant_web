<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-2 surface-section flex-auto">
        <div class="p-1">
          <router-link to="/import/importProduct">
            <Button
              label="นำเข้าข้อมูลสินค้า"
              class="p-button-info p-button-plain"
              icon="pi pi-upload"
              iconPos="left"
            />
          </router-link>
          <Button
            @click="visible_delall = true"
            label="ลบรายการที่เลือก"
            class="ml-1 p-button-danger p-button-plain"
            icon="pi pi-minus"
            iconPos="left"
          />
        </div>

        <div class="grid">
          <div class="col-12">
            <DataTable
              :value="data_detail"
              :paginator="true"
              :rows="15"
              :rowHover="true"
              responsiveLayout="scroll"
              class="p-datatable-sm"
              v-model:filters="filters"
              filterDisplay="menu"
              v-model:selection="selectedItems"
              dataKey="guidfixed"
            >
              <template #header>
                <div class="flex justify-content-end align-items-right">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText
                      v-model="filters['global'].value"
                      placeholder="ค้นหา...."
                    />
                  </span>
                </div>
              </template>
              <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
              <Column field="index" header="#" :sortable="true"></Column>
              <Column field="barcode" header="บาร์โค้ด" :sortable="true"></Column>
              <Column field="name1" header="ชื่อ1" :sortable="true"></Column>
              <Column field="name2" header="ชื่อ2" :sortable="true"></Column>
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: center;"
                field="unit_name1"
                header="หน่วยนับ1"
                :sortable="true"
              ></Column>
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: right;"
                field="unit_name2"
                header="หน่วยนับ2"
                :sortable="true"
              ></Column>
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: right;"
                field="price"
                header="ราคา"
                :sortable="true"
              ></Column>
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: right;"
                field="member_price"
                header="ราคาสมาชิก"
                :sortable="true"
              ></Column>
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: center;"
                field="categoryguid"
                header="รหัสหมวดหมู่"
                :sortable="true"
              ></Column>

              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: center;"
                field="option_code"
                header="รหัสตัวเลือก"
                :sortable="true"
              ></Column>
              <Column>
                <template #body="{ data }">
                  <Button
                    @click="delRow(data)"
                    type="button"
                    icon="pi pi-minus "
                    class="p-button-text p-button-danger p-button-sm"
                  ></Button>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <Dialog
        v-model:visible="visible1"
        appendTo="body"
        :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
        :style="{ width: '40vw' }"
      >
        <template #header>
          <div class="flex align-items-center">
            <span
              class="flex align-items-center justify-content-center bg-cyan-100 text-cyan-800 mr-3 border-circle"
              style="width: 32px; height: 32px"
            >
              <i class="pi pi-info text-lg"></i>
            </span>
            <span class="font-medium text-2xl text-900">ยืนยันการทำงาน</span>
          </div>
        </template>
        <p class="line-height-3 p-0 m-0">
          ต้องการลบข้อมูลสินค้า {{ del_data.barcode }} ~ {{ del_data.name1 }} ใช่หรือไม่
        </p>
        <template #footer>
          <div class="border-top-1 surface-border pt-3">
            <Button
              icon="pi pi-times"
              @click="visible1 = false"
              label="ยกเลิก"
              class="p-button-text"
            ></Button>
            <Button
              icon="pi pi-check"
              class="p-button-danger"
              @click="confirmDel()"
              label="ยืนยัน"
            ></Button>
          </div>
        </template>
      </Dialog>

      <Dialog
        v-model:visible="visible_delall"
        appendTo="body"
        :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
        :style="{ width: '40vw' }"
      >
        <template #header>
          <div class="flex align-items-center">
            <span
              class="flex align-items-center justify-content-center bg-cyan-100 text-cyan-800 mr-3 border-circle"
              style="width: 32px; height: 32px"
            >
              <i class="pi pi-info text-lg"></i>
            </span>
            <span class="font-medium text-2xl text-900">ยืนยันการทำงาน</span>
          </div>
        </template>
        <p class="line-height-3 p-0 m-0">ต้องการลบข้อมูลสินค้าที่เลือก ใช่หรือไม่</p>
        <template #footer>
          <div class="border-top-1 surface-border pt-3">
            <Button
              icon="pi pi-times"
              @click="visible_delall = false"
              label="ยกเลิก"
              class="p-button-text"
            ></Button>
            <Button
              icon="pi pi-check"
              class="p-button-danger"
              @click="confirmDelSelect()"
              label="ยืนยัน"
            ></Button>
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

const router = useRouter();
const visible1 = ref(false);
const visible_delall = ref(false);
const data_detail = ref([]);
const selectedItems = ref([]);
const del_data = ref({});

onMounted(() => {
  getProductImportList();
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  barcode: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  name1: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  name2: { value: null, matchMode: FilterMatchMode.IN },
  unitname1: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  unitname2: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  price: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  memberprice: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  categoryguid: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  option_code: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
});

function getProductImportList() {
  MasterdataService.getProductImport()
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_detail.value = res.data;

        data_detail.value.forEach((ele, index) => {
          if (ele.options.length > 0) {
            var optioncode = [];
            ele.options.forEach((data) => {
              optioncode.push(data.code);
            });

            ele.option_code = optioncode.toString();
          }
          ele.index = index + 1;
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
function delRow(data) {
  visible1.value = true;
  del_data.value = data;
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
function confirmDel() {
  var deldata = [del_data.value.guidfixed];
  console.log(deldata);
  MasterdataService.delProductImport(deldata)
    .then((res) => {
      console.log(res);
      if (res.success) {
        getProductImportList();
        visible1.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>
