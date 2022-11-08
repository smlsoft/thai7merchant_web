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
        <div class="formgroup-inline" v-if="data_detail.length > 0">
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
              :value="data_detail"
              :paginator="true"
              :rows="15"
              :rowHover="true"
              responsiveLayout="scroll"
              class="p-datatable-sm"
              v-model:filters="filters"
              dataKey="INDEX"
              v-model:expandedRows="expandedRows"
              filterDisplay="menu"
            >
              <template #header>
                <div class="flex">
                  <div class="flex-1 justify-content-start align-items-right">
                    <div class="table-header-container">
                      <Button
                        v-if="data_detail.length > 0 && expandedRows.length == 0"
                        icon="pi pi-plus"
                        label="แสดงตัวเลือกทั้งหมด"
                        @click="expandAll"
                        class="mr-2"
                      />
                      <Button
                        v-if="data_detail.length > 0 && expandedRows.length != 0"
                        icon="pi pi-minus"
                        label="ซ่อนตัวเลือกทั้งหมด"
                        @click="collapseAll"
                      />
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
                </div>
              </template>
              <Column :expander="true" headerStyle="width: 3rem" />
              <Column field="OPTIONCODE" header="OPTIONCODE" :sortable="true"></Column>
              <Column field="NAME1" header="NAME1" :sortable="true"></Column>
              <Column field="NAME2" header="NAME2" :sortable="true"></Column>
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: center;"
                field="MAXSELECTED"
                header="MAXSELECTED"
                :sortable="true"
              ></Column>
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: center;"
                field="CHOICETYPE"
                header="CHOICETYPE"
                :sortable="true"
              ></Column>
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: center;"
                field="ISREQUIRED"
                header="ISREQUIRED"
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
              <template #expansion="mainProps">
                <div class="orders-subtable">
                  <h5>รายการตัวเลือก ของ {{ mainProps.data.NAME1 }}</h5>
                  <DataTable :value="mainProps.data.CHOICES" responsiveLayout="scroll">
                    <Column field="BARCODE" header="BARCODE" sortable></Column>
                    <Column field="NAME1" header="NAME1" sortable></Column>
                    <Column field="NAME2" header="NAME2" sortable></Column>
                    <Column
                      headerStyle="text-align: center"
                      bodyStyle="text-align: right;"
                      field="PRICE"
                      header="PRICE"
                      sortable
                    >
                      <template #body="slotProps" sortable>
                        {{ formatCurrency(slotProps.data.PRICE) }}
                      </template>
                    </Column>
                    <Column
                      headerStyle="text-align: center"
                      bodyStyle="text-align: center;"
                      field="QTY"
                      header="QTY"
                      sortable
                    ></Column>
                    <Column
                      headerStyle="text-align: center"
                      bodyStyle="text-align: center;"
                      field="QTYMAX"
                      header="QTYMAX"
                      sortable
                    ></Column>
                    <Column field="SUGGESTCODE" header="SUGGESTCODE" sortable></Column>
                    <Column
                      headerStyle="text-align: center"
                      bodyStyle="text-align: center;"
                      field="ITEMUNIT"
                      header="ITEMUNIT"
                      sortable
                    ></Column>
                    <Column
                      headerStyle="text-align: center"
                      bodyStyle="text-align: center;"
                      field="SELECTED"
                      header="SELECTED"
                      sortable
                    ></Column>
                    <Column
                      headerStyle="text-align: center"
                      bodyStyle="text-align: center;"
                      field="DEFAULT"
                      header="DEFAULT"
                      sortable
                    ></Column>
                    <Column headerStyle="width:1rem">
                      <template #body="slotProps">
                        <Button
                          @click="delChoiceRow(mainProps.data, slotProps.data)"
                          type="button"
                          icon="pi pi-minus "
                          class="p-button-text p-button-danger p-button-sm"
                        ></Button>
                      </template>
                    </Column>
                  </DataTable>
                </div>
              </template>
            </DataTable>
          </div>
        </div>
      </div>

      <Dialog
        v-model:visible="visible_main"
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
          ต้องการลบข้อมูลกลุ่ม {{ del_data.OPTIONCODE }} ~ {{ del_data.NAME1 }} ใช่หรือไม่
        </p>
        <template #footer>
          <div class="border-top-1 surface-border pt-3">
            <Button
              icon="pi pi-times"
              @click="visible_main = false"
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
        v-model:visible="visible_choice"
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
          ต้องการลบข้อมูลตัวเลือกเสริม {{ del_data_choice.BARCODE }} ~
          {{ del_data_choice.NAME1 }} ออกจาก {{ del_data_choice.OPTIONNAME }} ใช่หรือไม่
        </p>
        <template #footer>
          <div class="border-top-1 surface-border pt-3">
            <Button
              icon="pi pi-times"
              @click="visible_choice = false"
              label="ยกเลิก"
              class="p-button-text"
            ></Button>
            <Button
              icon="pi pi-check"
              class="p-button-danger"
              @click="confirmDelChoice()"
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
import XLSX from "xlsx";
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const visible_main = ref(false);
const visible_choice = ref(false);
const expandedRows = ref([]);
const head_example = ref([]);
const detail_example = ref([]);
const data_detail = ref([]);
const myFiles = ref();
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
const del_data_choice = ref({
  OPTIONINDEX: 0,
  OPTIONNAME: "",
  INDEX: 0,
  BARCODE: "",
  NAME1: "",
  NAME2: "",
  PRICE: 0,
  QTY: 0,
  QTYMAX: 0,
  SUGGESTCODE: "",
  ITEMUNIT: "",
  SELECTED: true,
  DEFAULT: true,
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  OPTIONCODE: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  MAXSELECTED: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  CHOICETYPE: { value: null, matchMode: FilterMatchMode.IN },
  ISREQUIRED: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
});

function delRow(data) {
  visible_main.value = true;
  del_data.value = data;
}
function delChoiceRow(main, data) {
  visible_choice.value = true;
  del_data_choice.value = data;

  del_data_choice.value.OPTIONNAME = main.NAME1;
  del_data_choice.value.OPTIONINDEX = main.INDEX;
}

function expandAll() {
  expandedRows.value = data_detail.value;
}
function collapseAll() {
  expandedRows.value = [];
}
function confirmDel() {
  console.log(del_data.value.INDEX);

  data_detail.value.splice(del_data.value.INDEX, 1);

  let details = [];
  for (let index = 0; index < data_detail.value.length; index++) {
    details.push({
      INDEX: index,
      OPTIONCODE: data_detail.value[index].OPTIONCODE,
      NAME1: data_detail.value[index].NAME1,
      NAME2: data_detail.value[index].NAME2,
      MAXSELECTED: data_detail.value[index].MAXSELECTED,
      CHOICETYPE: data_detail.value[index].CHOICETYPE,
      ISREQUIRED: data_detail.value[index].ISREQUIRED,
      CHOICES: data_detail.value[index].CHOICES,
    });
  }

  data_detail.value = details;

  visible_main.value = false;
}
function confirmDelChoice() {
  data_detail.value[del_data_choice.value.OPTIONINDEX].CHOICES.splice(
    del_data_choice.value.INDEX,
    1
  );
  console.log(data_detail.value[del_data_choice.value.OPTIONINDEX].CHOICES);

  data_detail.value[del_data_choice.value.OPTIONINDEX].CHOICES.forEach((ele, index) => {
    ele.INDEX = index;
  });

  visible_choice.value = false;
}

function onSave() {
  var checkdata = true;
  data_detail.value.forEach((data) => {
    if (data.OPTIONCODE == "") {
      checkdata = false;
    }
  });

  if (checkdata != false) {
    let post_data = [];
    post_data = genPostData();
    console.log(post_data);
    MasterdataService.importOption(post_data)
      .then((res) => {
        console.log(res);
        if (res.success) {
          setTimeout(async () => {
            router.push("/import/listOption");
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

function ImportFile() {
  var config = { raw: true, type: "string" };
  var reader = new FileReader();
  reader.readAsText(myFiles.value.files[0]);
  reader.onload = function (e) {
    let results = JSON.parse(e.target.result);

    var optFilterData = genImportData(results);
    data_detail.value = optFilterData;
  };
  reader.onerror = function (e) {
    console.log(e);
  };
}

function DownloadExampleExcel() {
  console.log("DownloadExampleExcel");

  head_example.value = [];
  detail_example.value = [];

  detail_example.value.push(
    {
      รหัส: "",
      ชื่อ1: "",
      ชื่อ2: "",
      เลือกได้สูงสุด: "",
      ประเภทตัวเลือก: "(1=เลือกได้อย่างเดียว 2=เลือกได้หลายอย่าง)",
      จำเป็นต้องเลือก: "0=ไม่จำเป็น 1=จำเป็น",
      บาร์โค้ดตัวเลือก: "",
      ชื่อตัวเลือก1: "",
      ชื่อตัวเลือก2: "",
      ราคา: "",
      จำนวน: "",
      จำนวนสูงสุด: "",
      ผู้แนะนำ: "",
      หน่วยนับ: "",
      เลือกอัตโนมัติ: "0=ไม่เลือก 1=เลือกให้เลย",
      ตั้งเป็นค่าเริ่มต้น: "0=ไม่ใช่ 1=ใช่",
    },
    {
      รหัส: "1",
      ชื่อ1: "เนื้อสัตว์",
      ชื่อ2: "Meet",
      เลือกได้สูงสุด: "2",
      ประเภทตัวเลือก: "2",
      จำเป็นต้องเลือก: "1",
      บาร์โค้ดตัวเลือก: "0001",
      ชื่อตัวเลือก1: "หมู",
      ชื่อตัวเลือก2: "Pock",
      ราคา: "100",
      จำนวน: "1",
      จำนวนสูงสุด: "10",
      ผู้แนะนำ: "100001",
      หน่วยนับ: "EA",
      เลือกอัตโนมัติ: "1",
      ตั้งเป็นค่าเริ่มต้น: "1",
    }
  );

  console.log(detail_example.value);
  var config = { raw: true, type: "string" };
  var Example = XLSX.utils.json_to_sheet(
    detail_example.value,
    head_example.value,
    config
  );

  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, Example, "ImportOptionExample");
  XLSX.writeFile(wb, "ImportOptionExample.xlsx");
}

function groupBy(array, key) {
  const result = {};
  array.forEach((item) => {
    if (!result[item[key]]) {
      result[item[key]] = [];
    }
    result[item[key]].push(item);
  });
  return result;
}

function genPostData() {
  var post_data = [];
  data_detail.value.forEach((ele) => {
    var is_require = false;
    if (ele.ISREQUIRED == "1") {
      is_require = true;
    }

    var post_choice = [];
    ele.CHOICES.forEach((detail) => {
      console.log(detail);
      var is_default = false;
      var is_selected = false;
      if (detail.DEFAULT == "1") {
        is_default = true;
      }
      if (detail.SELECTED == "1") {
        is_selected = true;
      }
      post_choice.push({
        barcode: detail.BARCODE,
        default: is_default,
        itemunit: detail.ITEMUNIT,
        name1: detail.NAME1,
        name2: detail.NAME2,
        price: parseFloat(detail.PRICE),
        qty: parseInt(detail.QTY),
        qtymax: parseInt(detail.QTYMAX),
        selected: is_selected,
        suggestcode: detail.SUGGESTCODE,
      });
    });

    post_data.push({
      choices: post_choice,
      choicetype: parseInt(ele.CHOICETYPE),
      code: ele.OPTIONCODE,
      maxselect: parseInt(ele.MAXSELECTED),
      name1: ele.NAME1,
      name2: ele.NAME2,
      required: is_require,
    });
  });

  return post_data;
}

function formatCurrency(value) {
  return value.toLocaleString("th-TH", { style: "currency", currency: "THB" });
}

function genImportData(results) {
  var details = [];
  for (let index = 0; index < results.length; index++) {
    if (index > 0) {
      details.push({
        OPTIONCODE: results[index].รหัส,
        NAME1: results[index].ชื่อ1,
        NAME2: results[index].ชื่อ2,
        MAXSELECTED: results[index].เลือกได้สูงสุด,
        CHOICETYPE: results[index].ประเภทตัวเลือก,
        ISREQUIRED: results[index].จำเป็นต้องเลือก,
        CHOICES_BARCODE: results[index].บาร์โค้ดตัวเลือก,
        CHOICES_NAME1: results[index].ชื่อตัวเลือก1,
        CHOICES_NAME2: results[index].ชื่อตัวเลือก2,
        CHOICES_PRICE: results[index].ราคา,
        CHOICES_QTY: results[index].จำนวน,
        CHOICES_QTYMAX: results[index].จำนวนสูงสุด,
        CHOICES_SUGGESTCODE: results[index].ผู้แนะนำ,
        CHOICES_ITEMUNIT: results[index].หน่วยนับ,
        CHOICES_SELECTED: results[index].เลือกอัตโนมัติ,
        CHOICES_DEFAULT: results[index].ตั้งเป็นค่าเริ่มต้น,
      });
    }
  }
  console.log(details);
  var headerArr = [];

  details.forEach((ele) => {
    headerArr.push(ele.OPTIONCODE);
  });

  headerArr = headerArr.filter(function (item, pos) {
    return headerArr.indexOf(item) == pos;
  });
  console.log(headerArr);
  let detailsFilter = groupBy(details, "OPTIONCODE");

  console.log(detailsFilter);
  var optFilterData = [];
  headerArr.forEach((head, index) => {
    var choiceDetail = [];
    if (detailsFilter[head].length > 0) {
      detailsFilter[head].forEach((ele, idx) => {
        choiceDetail.push({
          INDEX: idx,
          BARCODE: ele.CHOICES_BARCODE,
          NAME1: ele.CHOICES_NAME1,
          NAME2: ele.CHOICES_NAME2,
          PRICE: ele.CHOICES_PRICE,
          QTY: ele.CHOICES_QTY,
          QTYMAX: ele.CHOICES_QTYMAX,
          SUGGESTCODE: ele.CHOICES_SUGGESTCODE,
          ITEMUNIT: ele.CHOICES_ITEMUNIT,
          SELECTED: ele.CHOICES_SELECTED,
          DEFAULT: ele.CHOICES_DEFAULT,
        });
      });
      optFilterData.push({
        INDEX: index,
        OPTIONCODE: detailsFilter[head][0].OPTIONCODE,
        NAME1: detailsFilter[head][0].NAME1,
        NAME2: detailsFilter[head][0].NAME2,
        MAXSELECTED: detailsFilter[head][0].MAXSELECTED,
        CHOICETYPE: detailsFilter[head][0].CHOICETYPE,
        ISREQUIRED: detailsFilter[head][0].ISREQUIRED,
        CHOICES: choiceDetail,
      });
    }
  });
  return optFilterData;
}
</script>
