<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-2 surface-section flex-auto">
        <div class="formgroup-inline">
          <div class="p-1">
            <Button
              label="ดาวน์โหลดตัวอย่าง"
              class="p-button-warning p-button-plain"
              icon="pi pi-file-excel"
              iconPos="left"
              @click="DownloadExampleExcel()"
            />
          </div>
          <div class="p-1">
            <FileUpload
              mode="basic"
              name="input file"
              accept=".json"
              ref="myFiles"
              :customUpload="true"
              @change="ImportFile()"
              class="p-button-plain p-button-info"
              chooseLabel="นำเข้าไฟล์"
            ></FileUpload>
          </div>
        </div>
        <div class="formgroup-inline" v-if="import_detail.length > 0">
          <div class="p-1">
            <Button
              label="บันทึกรายการ"
              class="p-button-success p-button-plain"
              icon="pi pi-save"
              iconPos="left"
              @click="onSave()"
            />
          </div>
        </div>
        <div class="grid">
          <div class="col-12">
            <DataTable
              :value="import_detail"
              :paginator="true"
              :rows="10"
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
              <Column field="name1" header="ชื่อ1" :sortable="true"></Column>
              <Column field="printerx" header="ชื่อ2" :sortable="true"></Column>

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
    </MainContentWarp>
  </AppLayout>
</template>

<script setup>
/* eslint-disable */
import XLSX from "xlsx";
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import RestaurantService from "@/services/RestaurantService";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const head_example = ref([]);
const detail_example = ref([]);
const import_detail = ref([]);
const myFiles = ref();
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
  printerx: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
});

function ImportFile() {
  var reader = new FileReader();

  reader.readAsText(myFiles.value.files[0]);
  reader.onload = function (e) {
    console.log(e.target.result);
    let results = JSON.parse(e.target.result);

    var details = [];
    for (let index = 0; index < results.length; index++) {
      details.push({
        index: index,
        code: results[index].รหัส,
        name1: results[index].ชื่อโซน,
        printerx: results[index].เครื่องพิมพ์,
      });
    }

    console.log(details);

    import_detail.value = details;
  };

  reader.onerror = function (e) {
    console.log(e);
  };
}

function DownloadExampleExcel() {
  console.log("DownloadExampleExcel");

  head_example.value = [];

  detail_example.value.push({
    รหัส: "101",
    ชื่อโซน: "หน้าร้าน",
    เครื่องพิมพ์: "P01",
  });

  console.log(detail_example.value);
  var config = { raw: true, type: "string" };
  var Example = XLSX.utils.json_to_sheet(
    detail_example.value,
    head_example.value,
    config
  );

  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, Example, "ImportZoneExample");
  XLSX.writeFile(wb, "ImportZoneExample.xlsx");
}

function delRow(data) {
  console.log(data.index);

  import_detail.value.splice(data.index, 1);

  let details = [];
  for (let index = 0; index < import_detail.value.length; index++) {
    details.push({
      index: index,
      code: import_detail.value[index].code,
      name1: import_detail.value[index].name1,
      printerx: import_detail.value[index].printerx,
    });
  }

  import_detail.value = details;
}

function onSave() {
  var checkdata = true;
  import_detail.value.forEach((data) => {
    if (data.code == "") {
      checkdata = false;
    }
  });

  if (checkdata != false) {
    let post_data = [];
    import_detail.value.forEach((ele) => {
      post_data.push({
        code: ele.code.toString(),
        name1: ele.name1,
        printer: { code: ele.printerx },
      });
    });
    console.log(post_data);
    RestaurantService.importZone(post_data)
      .then((res) => {
        console.log(res);
        if (res.success) {
          setTimeout(async () => {
            router.push("/restaurant/zone/zone_list");
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log("ข้อมูลไม่ครบ");
  }
}
</script>
