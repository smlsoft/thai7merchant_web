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
              <Column field="printer" header="เครื่องพิมพ์" :sortable="true"></Column>
              <Column field="product" header="สินค้า" :sortable="true"></Column>
              <Column field="category" header="หมวด" :sortable="true"></Column>
              <Column
                headerStyle="text-align: center;"
                bodyStyle="text-align: center;"
                field="zone"
                header="โซน"
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
  printer: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  product: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  category: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  zone: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
});

function ImportFile() {
  var reader = new FileReader();

  reader.readAsText(myFiles.value.files[0]);
  reader.onload = function (e) {
    // console.log(e.target.result);
    let results = JSON.parse(e.target.result);

    var details = [];
    for (let index = 0; index < results.length; index++) {
      details.push({
        index: index,
        code: results[index].รหัสครัว,
        name1: results[index].ชื่อครัว,
        printer: results[index].เครื่องพิมพ์,
        product: results[index].สินค้า,
        category: results[index].หมวดหมู่,
        zone: results[index].โซน,
      });
    }

    //console.log(details);

    import_detail.value = details;
  };

  reader.onerror = function (e) {
    console.log(e);
  };
}

function DownloadExampleExcel() {
  console.log("DownloadExampleExcel");

  head_example.value = [];

  detail_example.value.push(
    {
      รหัสครัว: "K1",
      ชื่อครัว: "ครัวร้อน",
      เครื่องพิมพ์: "P1,P2",
      สินค้า: "201",
      หมวดหมู่: "",
      โซน: "102",
    },
    {
      รหัสครัว: "K2",
      ชื่อครัว: "บาร์น้ำ",
      เครื่องพิมพ์: "P3",
      สินค้า: "",
      หมวดหมู่: "002",
      โซน: "103",
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
  XLSX.utils.book_append_sheet(wb, Example, "ImportKitchenExample");
  XLSX.writeFile(wb, "ImportKitchenExample.xlsx");
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
      printer: import_detail.value[index].printer,
      product: import_detail.value[index].product,
      category: import_detail.value[index].category,
      zone: import_detail.value[index].zone,
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

    var headerArr = [];

    import_detail.value.forEach((ele) => {
      headerArr.push(ele.code);
    });

    headerArr = headerArr.filter(function (item, pos) {
      return headerArr.indexOf(item) == pos;
    });
    //console.log(headerArr);

    var group_printer = groupBy(import_detail.value, "code");

    headerArr.forEach(async (head, index) => {
      var choiceDetail = [];
      if (group_printer[head].length > 0) {
        var productList = [];
        var printerArr = [];
        var printerList = [];
        var zoneArr = [];
        var zoneList = [];
        await group_printer[head].forEach((pd) => {
          if (pd.product != "") {
            productList.push({ barcode: pd.product.toString() });
          }
          printerArr.push(pd.printer);

          zoneArr.push(pd.zone);
        });
        printerArr = printerArr.filter(function (item, pos) {
          return printerArr.indexOf(item) == pos;
        });
        zoneArr = zoneArr.filter(function (item, pos) {
          return zoneArr.indexOf(item) == pos;
        });
        await printerArr.forEach((ele) => {
          var printSplit = ele.split(",");
          printSplit.forEach((spl) => {
            printerList.push({ code: spl.toString() });
          });
        });
        //console.log(zoneArr)
        await zoneArr.forEach((ze) => {
          // console.log(ze);
          var zoneSplit = ze.split(",");
          zoneSplit.forEach((spl) => {
            if (spl != "") {
              zoneList.push({ code: spl.toString() });
            }
          });
        });
        //console.log(zoneList);

        post_data.push({
          code: group_printer[head][0].code.toString(),
          name1: group_printer[head][0].name1.toString(),
          printers: printerList,
          products: productList,
          zones: zoneList,
          category: [{ code: group_printer[head][0].category.toString() }],
        });
      }
    });
    setTimeout(() => {
      console.log(post_data);

      RestaurantService.importKitchen(post_data)
        .then((res) => {
          console.log(res);
          if (res.success) {
            setTimeout(async () => {
              ///router.push("/restaurant/kitchen/kitchen_list");
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);
  } else {
    console.log("ข้อมูลไม่ครบ");
  }
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
</script>
