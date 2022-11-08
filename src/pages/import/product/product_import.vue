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

      <Toast position="top-right" />
    </MainContentWarp>
  </AppLayout>
</template>

<script setup>
/* eslint-disable */
import XLSX from "xlsx";
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import Utils from "@/utils/";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const router = useRouter();
const head_example = ref([]);
const detail_example = ref([]);
const import_detail = ref([]);
const myFiles = ref();
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
  unit_name1: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  unit_name2: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  price: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  member_price: {
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

function ImportFile() {
  var reader = new FileReader();

  reader.readAsText(myFiles.value.files[0]);
  reader.onload = function (e) {
    console.log(e.target.result);
    let results = JSON.parse(e.target.result);
    let veridation = [];
    var details = [];
    for (let index = 0; index < results.length; index++) {
      veridation.push(results[index].บาร์โค้ด);
      details.push({
        index: index,
        barcode: results[index].บาร์โค้ด,
        name1: results[index].ชื่อ1,
        name2: results[index].ชื่อ2,
        unit_name1: results[index].หน่วยนับ1,
        unit_name2: results[index].หน่วยนับ2,
        price: results[index].ราคา,
        member_price: results[index].ราคาสมาชิก,
        categoryguid: results[index].รหัสหมวดหมู่,
        option_code: results[index].รหัสตัวเลือก,
      });
    }
    console.log(checkIfDuplicateExists(veridation));
    if (checkIfDuplicateExists(veridation)) {
      var alreadySeen = [];
      var strDuplicate = [];
      veridation.forEach((str) =>
        alreadySeen[str] ? strDuplicate.push(str) : (alreadySeen[str] = true)
      );
      toast.add({
        severity: "error",
        summary: "นำเข้าข้อมูลไม่สำเร็จ",
        detail: "บาร์โค้ด " + strDuplicate.toString() + " ซ้ำ",
        life: 3000,
      });
    } else {
      import_detail.value = details;
    }
  };

  reader.onerror = function (e) {
    console.log(e);
  };
}
function DownloadExampleExcel() {
  console.log("DownloadExampleExcel");

  head_example.value = [];
  detail_example.value = [];

  detail_example.value.push({
    บาร์โค้ด: "1001",
    ชื่อ1: "เพิ่มแคปหมู",
    ชื่อ2: "Add Pork Knuckle",
    หน่วยนับ1: "จาน",
    หน่วยนับ2: "plate",
    ราคา: "30",
    ราคาสมาชิก: "001",
    รหัสหมวดหมู่: "0",
    เรียงลำดับ: "0",
    รหัสตัวเลือก: "101,202",
  });

  console.log(detail_example.value);
  var config = { raw: true, type: "string" };
  var Example = XLSX.utils.json_to_sheet(
    detail_example.value,
    head_example.value,
    config
  );

  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, Example, "ImportProductExample");
  XLSX.writeFile(wb, "ImportProductExample.xlsx");
}
function delRow(data) {
  console.log(data.index);

  import_detail.value.splice(data.index, 1);

  let details = [];

  for (let index = 0; index < import_detail.value.length; index++) {
    details.push({
      index: index + 1,
      barcode: import_detail.value[index].barcode,
      name1: import_detail.value[index].name1,
      name2: import_detail.value[index].name2,
      unit_name1: import_detail.value[index].unit_name1,
      unit_name2: import_detail.value[index].unit_name2,
      price: import_detail.value[index].price,
      member_price: import_detail.value[index].member_price,
      categoryguid: import_detail.value[index].categoryguid,
      option_code: import_detail.value[index].option_code,
    });
  }

  import_detail.value = details;
}
function checkIfDuplicateExists(arr) {
  return new Set(arr).size !== arr.length;
}
function onSave() {
  var checkdata = true;
  import_detail.value.forEach((data) => {
    data.itemguid = localStorage.getItem("shopid") + data.barcode;
    if (data.CODE == "") {
      checkdata = false;
    }
  });

  if (checkdata != false) {
    let post_data = [];
    import_detail.value.forEach((ele) => {
      var optionChoice = [];
      var optionSplit = ele.option_code.split(",");

      optionSplit.forEach((opt) => {
        if (opt != "") {
          optionChoice.push({
            choices: [],
            choicetype: 0,
            code: opt,
            maxselect: 0,
            name1: "",
            name2: "",
            name3: "",
            name4: "",
            name5: "",
            required: false,
          });
        }
      });
      if (ele.member_price == "") {
        ele.member_price = 0;
      }
      post_data.push({
        activated: true,
        barcode: ele.barcode,
        categoryguid: ele.categoryguid,
        description1: "",
        description2: "",
        description3: "",
        description4: "",
        description5: "",
        itemcode: "",
        itemguid: ele.itemguid,
        itemoptioncode: "",
        itemoptionorder: 0,
        itemsku: "",
        itemunitcode: ele.unit_name1,
        itemunitdiv: 0,
        itemunitstd: 0,
        memberprice: parseFloat(ele.member_price),
        name1: ele.name1,
        name2: ele.name2,
        name3: "",
        name4: "",
        name5: "",
        options: optionChoice,
        parid: "",
        price: parseFloat(ele.price),
        recommended: true,
        tags: [],
        unitname1: ele.unit_name1,
        unitname2: ele.unit_name2,
        unitname3: "",
        unitname4: "",
        unitname5: "",
      });
    });
    console.log(post_data);
    MasterdataService.importProduct(post_data)
      .then((res) => {
        console.log(res);
        if (res.success) {
          setTimeout(async () => {
            router.push("/import/listProduct");
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
