<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-2 surface-section flex-auto">
        <div class="p-1">
          <router-link to="/restaurant/table/table_import">
            <Button
              label="นำเข้าข้อมูลโต๊ะ"
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
           
              <Column
                field="number"
                header="เลขที่โต๊ะ"
                :sortable="true"
              ></Column>
              <Column field="name1" header="ชื่อ" :sortable="true"></Column>
              <Column
                field="seat"
                header="จำนวนที่นั่ง"
                :sortable="true"
              ></Column>
              <Column field="zones" header="โซน" :sortable="true"></Column>

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
          ต้องการลบข้อมูลโต๊ะ {{ del_data.number }} ~
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
  name2: "",
  parentguid: "",
  order: 1,
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  number: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  name1: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  seat: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  zones: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
});

const data_detail = ref([]);

onMounted(() => {
  getTableList();
});

function delRow(data) {
  visible1.value = true;
  del_data.value = data;
}

function confirmDel() {
  var deldata = del_data.value.guidfixed;
  console.log(deldata);
  RestaurantService.delTable(deldata)
    .then((res) => {
      console.log(res);
      if (res.success) {
        getTableList();
        visible1.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getTableList() {
  RestaurantService.getTableList()
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_detail.value = res.data;

        data_detail.value.forEach((ele, index) => {
          ele.index = index + 1;
          ele.zones = ele.zone.code;
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>
