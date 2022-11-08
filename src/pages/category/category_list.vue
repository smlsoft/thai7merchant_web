<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-2 surface-section flex-auto">
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
                <div class="flex">
                  <div class="flex-1 justify-content-start align-items-right">
                    <div class="table-header-container">
                      <Button
                        icon="pi pi-plus"
                        label="เพิ่มหมวดหมู่"
                        class="mr-1"
                        @click="goTo('category_create', '')"
                      />
                    </div>
                  </div>
                </div>
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

              <Column field="categoryguid" header="รหัส" :sortable="true"></Column>
              <Column field="name1" header="ชื่อ1" :sortable="true"></Column>
              <Column field="name2" header="ชื่อ2" :sortable="true"></Column>
              <Column field="parentguid" header="รหัสกลุ่มหลัก" :sortable="true"></Column>
              <Column
                headerStyle="text-align: center;"
                bodyStyle="text-align: center;"
                field="order"
                header="เรียงลำดับ"
                :sortable="true"
              ></Column>
              <Column>
                <template #body="{ data }">
                  <Button
                    @click="uploadThis(data)"
                    type="button"
                    icon="pi pi-image "
                    class="p-button-text p-button-info p-button-sm"
                  ></Button>
                </template>
              </Column>
              <Column>
                <template #body="{ data }">
                  <Button
                    @click="goTo('category_edit', data.guidfixed)"
                    type="button"
                    icon="pi pi-pencil "
                    class="p-button-text p-button-warning p-button-sm"
                  ></Button>
                </template>
              </Column>
              <Column>
                <template #body="{ data }">
                  <Button
                    @click="delData(data)"
                    type="button"
                    icon="pi pi-trash "
                    class="p-button-text p-button-danger p-button-sm"
                  ></Button>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <Dialog
        v-model:visible="visible_deldialog"
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
          ต้องการลบข้อมูลสินค้า {{ del_data.CODE }} ~ {{ del_data.NAME1 }} ใช่หรือไม่
        </p>
        <template #footer>
          <div class="border-top-1 surface-border pt-3">
            <Button
              icon="pi pi-times"
              @click="visible_deldialog = false"
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
      =
      <Dialog
        v-model:visible="visible_upload"
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
              <i class="pi pi-image text-lg"></i>
            </span>
            <span class="font-medium text-2xl text-900">อัพโหลดรูปภาพ</span>
          </div>
        </template>
        <h4>{{ category_select.image }}</h4>
        <Image :src="category_select.image" width="250"  />
        <p class="line-height-3 p-0 m-0"  v-if="category_select.image == ''">
          <FileUpload
            mode="basic"
            name="Image[]"
            :customUpload="true"
            ref="image_file"
            accept="image/*"
            :maxFileSize="1000000"
          />
        </p>
        <template #footer>
          <div class="border-top-1 surface-border pt-3">
            <Button
              icon="pi pi-times"
              @click="visible_upload = false"
              label="ยกเลิก"
              class="p-button-text"
            ></Button>
            <Button
              icon="pi pi-check"
              class="p-button-danger"
              @click="myUploader()"
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
import { useApp } from "@/stores/app.js";

const storeApp = useApp();
const router = useRouter();
const visible1 = ref(false);
const selectedItems = ref([]);
const visible_delall = ref(false);
const visible_upload = ref(false);
const image_file = ref();
const data_import = ref([]);
const visible_deldialog = ref(false);

const category_select = ref({
  categoryguid: "",
  image: "",
  name1: "",
  name2: "",
  order: 0,
  parentguid: "",
  guidfixed: "",
});
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
  code: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  name1: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  name2: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  parentguid: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },

  order: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
});
const data_detail = ref([]);

onMounted(() => {
  storeApp.setPageTitle("หมวดหมู่");
  storeApp.setActivePage("category_list");
  getCategoryImportList();
});

function delData(data) {
  visible_deldialog.value = true;
  del_data.value = data;
}

function confirmDel() {
  var deldata = [del_data.value.guidfixed];
  console.log(deldata);
  MasterdataService.delInventory(deldata)
    .then((res) => {
      console.log(res);
      if (res.success) {
        getProductList();
        visible_deldialog.value = false;
      }
    })
    .catch((err) => {
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

function uploadThis(data) {
  console.log(data);
  category_select.value = data;
  visible_upload.value = true;
}

function myUploader() {
  console.log(image_file.value);
  MasterdataService.upLoadImages(image_file.value.files[0])
    .then((res) => {
      console.log(res);
      if (res.success) {
        category_select.value.image = res.data.uri;
        console.log(category_select.value);
        MasterdataService.updateCategory(category_select.value)
          .then((res) => {
            console.log(res);
            if (res.success) {
              visible_upload.value = false;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getCategoryImportList() {
  MasterdataService.getCategoryList()
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
