<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-2 surface-section flex-auto">
        <div class="p-1">
          <router-link to="/restaurant/printer/printer_import">
            <Button
              label="นำเข้าข้อมูลเครื่องพิมพ์"
              class="p-button-info p-button-plain"
              icon="pi pi-upload"
              iconPos="left"
            />
          </router-link>
   
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

              <Column field="code" header="รหัส" :sortable="true"></Column>
              <Column field="name1" header="ชื่อ" :sortable="true"></Column>
              <Column
                field="address"
                header="ที่อยู่"
                :sortable="true"
              ></Column>
              <Column field="type" header="ประเภท" :sortable="true"></Column>

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
              class="
                flex
                align-items-center
                justify-content-center
                bg-cyan-100
                text-cyan-800
                mr-3
                border-circle
              "
              style="width: 32px; height: 32px"
            >
              <i class="pi pi-info text-lg"></i>
            </span>
            <span class="font-medium text-2xl text-900">ยืนยันการทำงาน</span>
          </div>
        </template>
        <p class="line-height-3 p-0 m-0">
          ต้องการลบข้อมูลเครื่องพิมพ์ {{ del_data.code }} ~
          {{ del_data.name1 }} ใช่หรือไม่
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
    </MainContentWarp>
  </AppLayout>
</template>

<script setup>
/* eslint-disable */
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import RestaurantService from "@/services/RestaurantService";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const visible1 = ref(false);
const selectedItems = ref([]);
const visible_delall = ref(false);
const del_data = ref({
  index: 0,
  code: "",
  name1: "",
  address: "",
  guidfixed: "",
  type: 0,
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  code: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  name1: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  address: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  type: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
});

const data_detail = ref([]);

onMounted(() => {
  getPrinterList();
});

function delRow(data) {
  visible1.value = true;
  del_data.value = data;
}

function confirmDel() {
  var deldata = del_data.value.guidfixed;
  console.log(deldata);
  RestaurantService.delPrinter(deldata)
    .then((res) => {
      console.log(res);
      if (res.success) {
        getPrinterList();
        visible1.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getPrinterList() {
  RestaurantService.getPrinterList()
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_detail.value = res.data;

        data_detail.value.forEach((ele, index) => {
          ele.index = index + 1;
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>
