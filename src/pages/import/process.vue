<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-2 surface-section flex-auto">
        <div class="grid">
          <div class="col-12">
            <DataTable
              :value="data_detail"
              :paginator="true"
              :rows="20"
              :rowHover="true"
              responsiveLayout="scroll"
              :autoLayout="true"
              class="p-datatable-sm"
              v-model:filters="filters"
              dataKey="itemguid"
              scrollHeight="75vh"
              scrollDirection="both"
              v-model:expandedRows="expandedRows"
              v-model:selection="selectedItems"
              filterDisplay="menu"
              ref="dt"
            >
              <template #header>
                <div class="flex">
                  <div class="flex-1 justify-content-start align-items-right">
                    <div class="table-header-container">
                      <Button
                        v-if="data_product.length > 0"
                        class="p-button-danger p-button-plain mr-1"
                        icon="pi pi-play"
                        label="ดึงข้อมูล"
                        @click="mapData()"
                      />
                      <Button
                        v-if="expandedRows.length == 0"
                        icon="pi pi-plus"
                        label="แสดงตัวเลือกทั้งหมด"
                        @click="expandAll"
                        class="mr-1"
                      />
                      <Button
                        v-if="expandedRows.length != 0"
                        icon="pi pi-minus"
                        label="ซ่อนตัวเลือกทั้งหมด"
                        lass="mr-1"
                        @click="collapseAll"
                      />
                      <Button
                        v-if="data_detail.length > 0"
                        class="p-button-success p-button-plain mr-1"
                        icon="pi pi-upload"
                        label="นำเข้ารายการที่เลือก"
                        @click="onSave()"
                      />
                      <Button
                        v-if="data_detail.length > 0"
                        class="p-button-primary p-button-plain"
                        icon="pi pi-file-pdf"
                        label="Open PDF"
                        @click="exportPDF()"
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
              <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
              <Column :expander="true" headerStyle="width: 3rem" />
              <Column field="barcode" header="บาร์โค้ด" :sortable="true"></Column>
              <Column field="name1" header="ชื่อ1" :sortable="true"></Column>
              <Column field="name2" header="ชื่อ2" :sortable="true"></Column>
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: center;"
                field="unitname1"
                header="หน่วยนับ1"
                :sortable="true"
              ></Column>
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: center;"
                field="unitname2"
                header="หน่วยนับ2"
                :sortable="true"
              ></Column>
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: right;"
                field="price"
                header="ราคา"
                :sortable="true"
              >
                <template #body="slotProps" sortable>
                  {{ formatCurrency(slotProps.data.price) }}
                </template></Column
              >
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: right;"
                field="memberprice"
                header="ราคาสมาชิก"
                :sortable="true"
              ></Column>
              <Column
                headerStyle="text-align: center"
                bodyStyle="text-align: center;"
                field="categoryname"
                header="หมวดหมู่"
                :sortable="true"
              ></Column>
              <template #expansion="mainProps">
                <h5 class="my-1" v-if="mainProps.data.options.length == 0">
                  ไม่พบรายการตัวเลือก
                </h5>
                <div class="orders-subtable" v-if="mainProps.data.options.length > 0">
                  <h5 class="my-1">รายการตัวเลือก ของ {{ mainProps.data.name1 }}</h5>
                  <DataTable
                    :value="mainProps.data.options"
                    responsiveLayout="scroll"
                    dataKey="guidfixed"
                    v-model:expandedRows="expandedRowsOption"
                  >
                    <Column :expander="true" headerStyle="width: 3rem" />
                    <Column field="code" header="รหัส" sortable></Column>
                    <Column field="name1" header="ชื่อ1" sortable></Column>
                    <Column field="name2" header="ชื่อ2" sortable></Column>
                    <Column
                      headerStyle="text-align: center"
                      bodyStyle="text-align: right;"
                      field="choicetype"
                      header="ประเภทตัวเลือก"
                      sortable
                    >
                      <template #body="slotProps" sortable>
                        {{
                          slotProps.data.choicetype == 1
                            ? "เลือกได้อย่างเดียว"
                            : "เลือกได้หลายอย่าง"
                        }}
                      </template>
                    </Column>
                    <Column
                      headerStyle="text-align: center"
                      bodyStyle="text-align: center;"
                      field="maxselect"
                      header="เลือกได้สูงสุด"
                      sortable
                    ></Column>
                    <Column
                      headerStyle="text-align: center"
                      bodyStyle="text-align: center;"
                      field="required"
                      header="จำเป็นต้องเลือก"
                      sortable
                    >
                      <template #body="slotProps" sortable>
                        {{ slotProps.data.required ? "ใช่" : "ไม่ใช่" }}
                      </template></Column
                    >
                    <Column
                      headerStyle="text-align: center"
                      bodyStyle="text-align: center;"
                      field="order"
                      header="ลำดับ"
                      sortable
                    ></Column>
                    <template #expansion="choiceProps">
                      <DataTable
                        :value="choiceProps.data.choices"
                        responsiveLayout="scroll"
                      >
                        <h5 class="my-1">
                          ตัวเลือกย่อย ของ {{ choiceProps.data.name1 }}
                        </h5>
                        <Column
                          headerStyle="text-align: center"
                          field="barcode"
                          header="บาร์โค้ด"
                          sortable
                        ></Column>
                        <Column
                          headerStyle="text-align: center"
                          field="name1"
                          header="ชื่อ1"
                          sortable
                        ></Column>
                        <Column
                          headerStyle="text-align: center"
                          field="name2"
                          header="ชื่อ2"
                          sortable
                        ></Column>
                        <Column
                          headerStyle="text-align: center"
                          bodyStyle="text-align: center;"
                          field="itemunit"
                          header="หน่วยนับ"
                          sortable
                        ></Column>
                        <Column
                          headerStyle="text-align: center"
                          bodyStyle="text-align: right;"
                          field="price"
                          header="ราคา"
                          sortable
                        >
                          <template #body="slotProps" sortable>
                            {{ formatCurrency(slotProps.data.price) }}
                          </template></Column
                        >
                        <Column
                          headerStyle="text-align: center"
                          bodyStyle="text-align: center;"
                          field="qtymax"
                          header="จำนวนสูงสุด"
                          sortable
                        ></Column>
                        <Column
                          headerStyle="text-align: center"
                          bodyStyle="text-align: center;"
                          field="default"
                          header="ตั้งเป็นค่าเริ่มต้น"
                          sortable
                        >
                          <template #body="slotProps" sortable>
                            {{ slotProps.data.default ? "ใช่" : "ไม่ใช่" }}
                          </template></Column
                        >
                        <Column
                          headerStyle="text-align: center"
                          bodyStyle="text-align: center;"
                          field="selected"
                          header="เลือกอัตโนมัติ"
                          sortable
                        >
                          <template #body="slotProps" sortable>
                            {{ slotProps.data.selected ? "ใช่" : "ไม่ใช่" }}
                          </template></Column
                        >
                        <Column
                          headerStyle="text-align: center"
                          bodyStyle="text-align: center;"
                          field="suggestcode"
                          header="รหัสแนะนำ"
                          sortable
                        ></Column>
                      </DataTable>
                    </template>
                  </DataTable>
                </div>
              </template>
            </DataTable>
          </div>
        </div>
      </div>
      <Dialog
        v-model:visible="visible_save"
        appendTo="body"
        :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
        :style="{ width: '40vw' }"
        :closable="false"
        :showHeader="false"
      >
        <div class="flex flex-column align-items-center my-4">
          <span
            class="flex align-items-center justify-content-center bg-cyan-100 text-cyan-800 mr-3 border-circle mb-3"
            style="width: 64px; height: 64px"
          >
            <i class="pi pi-check text-5xl"></i>
          </span>
          <div class="font-medium text-2xl text-900">ยืนยันการทำงาน</div>
        </div>
        <p class="line-height-3 p-0 m-0">ต้องการนำเข้าข้อมูลสินค้าใช่หรือไม่</p>
        <template #footer>
          <div class="border-top-1 surface-border pt-3 flex">
            <Button
              icon="pi pi-times"
              @click="visible_save = false"
              label="ยกเลิก"
              class="p-button-outlined w-6 mr-2"
            ></Button>
            <Button
              icon="pi pi-check"
              @click="onUpload()"
              label="ตกลง"
              class="w-6 ml-2"
            ></Button>
          </div>
        </template>
      </Dialog>
      <Dialog
        v-model:visible="visible_progress"
        appendTo="body"
        :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
        :style="{ width: '40vw' }"
        :closable="false"
        :show-header="false"
      >
        <div class="flex flex-column align-items-center my-4">
          <div class="font-medium text-2xl text-900">
            กำลังประมวลผล
            <div class=""></div>
          </div>
        </div>
        <ProgressBar mode="indeterminate" style="height: 0.5em" />
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
import { useToast } from "primevue/usetoast";
import pdfMake from "pdfmake/build/pdfmake";


//pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Sarabun: {
    normal: "http://fonts.gstatic.com/s/sarabun/v12/DtVjJx26TKEr37c9WBJDnlQN9gk.ttf",
    bold: "http://fonts.gstatic.com/s/sarabun/v12/DtVmJx26TKEr37c9YK5sulwm6gDXvwE.ttf",
    italics: "http://fonts.gstatic.com/s/sarabun/v12/DtVhJx26TKEr37c9aBBJmnYI5gnOpg.ttf",
    bolditalics: "http://fonts.gstatic.com/s/sarabun/v12/DtVkJx26TKEr37c9aBBxJlks7iLSrwFUlw.ttf",
  },
};

// ------------------ Data ---------------------//
const toast = useToast();
const router = useRouter();
const expandedRows = ref([]);
const expandedRowsOption = ref([]);
const selectedItems = ref([]);
const data_detail = ref([]);
const data_product = ref([]);
const data_category = ref([]);
const dt = ref(null);
const data_option = ref([]);
const visible_progress = ref(false);

const visible_save = ref(false);
const interval = null;
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

// ---------------  Created ----------------- //
onMounted(async () => {
  await getOptionImportList();
  await getCategoryImport();
  await getProductImport();
});
// ------------  Method Function ---------------- //

async function getProductImport() {
  await MasterdataService.getProductImport()
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_product.value = res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getOptionImportList() {
  await MasterdataService.getOptionImport()
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_option.value = res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getCategoryImport() {
  await MasterdataService.getCategoryImport()
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_category.value = res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function exportPDF() {
  var body = [];
  body = await buildFromJson();
  var docDefinition = pageSetup(body);
  pdfMake.createPdf(docDefinition).open();
}

function onSave() {
  if (selectedItems.value.length > 0) {
    visible_save.value = true;
  } else {
    toast.add({
      severity: "error",
      summary: "error",
      detail: "กรุณาเลือกรายการสินค้า",
      life: 3000,
    });
  }
}

async function onUpload() {
  visible_save.value = false;
  visible_progress.value = true;

  // console.log(selectedItems.value);
  // console.log(data_category.value);
  await upLoadProduct();
  await upLoadCategory();
  await upLoadUpdateProductCategory();
}

async function upLoadUpdateProductCategory() {
  let dataFilter = groupBy(selectedItems.value, "categoryguid");
  var headerArr = [];

  selectedItems.value.forEach((ele) => {
    headerArr.push(ele.categoryguid);
  });

  headerArr = headerArr.filter(function (item, pos) {
    return headerArr.indexOf(item) == pos;
  });

  headerArr.forEach(async (head, index) => {
    var itemList = [];
    if (dataFilter[head].length > 0) {
      dataFilter[head].forEach((data) => {
        itemList.push(data.itemguid);
      });
    }
    console.log("head " + head);
    console.log(itemList);

    await MasterdataService.updateProductCategory(head, itemList)
      .then((res) => {
        console.log(res);
        if (res.success) {
          visible_progress.value = false;
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "นำเข้าอัพเดทรายการหมวด " + head + " สำเร็จ",
            life: 3000,
          });
        } else {
          visible_progress.value = false;
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "นำเข้าอัพเดทรายการหมวด  " + head + "  ล้มเหลว",
            life: 3000,
          });
        }
      })
      .catch((err) => {
        visible_progress.value = false;
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "นำเข้าอัพเดทรายการหมวด  " + head + "  ล้มเหลว",
          life: 3000,
        });
        console.log(err);
      });
  });
}

async function upLoadProduct() {
  await MasterdataService.importProcessProduct(selectedItems.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        if (res.updateFailed.length > 0) {
          toast.add({
            severity: "error",
            summary: "error",
            detail: "นำเข้าสินค้าล้มเหลว รหัส " + res.updateFailed.length,
            life: 3000,
          });
        } else {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "นำเข้าข้อมูลสำเร็จ",
            life: 3000,
          });
        }
        visible_progress.value = false;
      } else {
        visible_progress.value = false;
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "นำเข้าข้อมูลล้มเหลว",
          life: 3000,
        });
      }
    })
    .catch((err) => {
      visible_progress.value = false;
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "นำเข้าข้อมูลล้มเหลว " + err,
        life: 3000,
      });
      console.log(err);
    });
}

async function upLoadCategory() {
  var post_category = [];

  data_category.value.forEach((cate) => {
    var parentguid = data_category.value.filter(function (item) {
      return item.code == cate.parentguid;
    });
    console.log(parentguid);
    var parentguidx = "";
    if (parentguid.length > 0) {
      parentguidx = parentguid[0].categoryguid;
    }
    post_category.push({
      code: cate.code,
      parentguid: parentguidx,
      categoryguid: cate.categoryguid,
      name1: cate.name1,
      name2: cate.name2 ?? "",
      order: cate.order,
    });
  });
  console.log(post_category);
  await MasterdataService.importProcessCategory(post_category)
    .then((res) => {
      console.log(res);
      if (res.success) {
        if (res.updateFailed.length > 0) {
          toast.add({
            severity: "error",
            summary: "error",
            detail: "นำเข้าหมวดหมู่ล้มเหลว รหัส " + res.updateFailed.length,
            life: 3000,
          });
        } else {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "นำเข้าหมวดหมู่สำเร็จ",
            life: 3000,
          });
        }
        visible_progress.value = false;
      } else {
        visible_progress.value = false;
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "นำเข้าหมวดหมู่ล้มเหลว",
          life: 3000,
        });
      }
    })
    .catch((err) => {
      visible_progress.value = false;
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "นำเข้าหมวดหมู่ล้มเหลว " + err,
        life: 3000,
      });
      console.log(err);
    });
}

function mapData() {
  console.log(data_product);
  if (data_product.value.length > 0) {
    data_product.value.forEach((data) => {
      var options = [];

      if (data.options.length > 0) {
        data.options.forEach((ele) => {
          var optionFilter = data_option.value.filter(function (item) {
            return item.code == ele.code;
          });

          if (optionFilter.length > 0) {
            options.push(optionFilter[0]);
          }
        });
      }
      var category = data_category.value.filter(function (item) {
        return item.code == localStorage.shopid + data.categoryguid;
      });
      data_detail.value.push({
        activated: true,
        barcode: data.barcode,
        categoryguid: category.length > 0 ? category[0].categoryguid : "",
        categoryname: category.length > 0 ? category[0].name1 : "",
        images: [],
        itemcode: "",
        itemguid: data.itemguid,
        itemunitcode: data.itemunitcode,
        itemunitdiv: 0,
        itemunitstd: 0,
        memberprice: data.memberprice != undefined ? data.memberprice : 0,
        name1: data.name1,
        name2: data.name2 != undefined ? data.name2 : "",
        options: options,
        price: data.price,
        recommended: true,
        tags: [],
        unitname1: data.unitname1,
        unitname2: data.unitname2 != undefined ? data.unitname2 : "",
      });
    });
    console.log(data_detail.value);
  }
}

function pageSetup(data) {
  var docDefinition = {
    content: [
      {
        style: "tableExample",
        table: {
          body: data,
        },
        layout: "lightHorizontalLines",
      },
    ],
    pageOrientation: "landscape",
    pageMargins: [8, 8, 8, 8],
    defaultStyle: {
      font: "Sarabun",
    },
  };
  return docDefinition;
}

function expandAll() {
  expandedRows.value = data_detail.value;
}
function collapseAll() {
  expandedRows.value = [];
}

function buildFromJson() {
  var body = [];

  body.push([
    { text: "บาร์โค้ด", fillColor: "#81d4fa" },
    { text: "ชื่อ1", fillColor: "#81d4fa" },
    { text: "ชื่อ2", fillColor: "#81d4fa" },
    { text: "หน่วยนับ1", fillColor: "#81d4fa" },
    { text: "หน่วยนับ2", fillColor: "#81d4fa" },
    { text: "ราคา", fillColor: "#81d4fa" },
    { text: "ราคาสมาชิก", fillColor: "#81d4fa" },
    { text: "หมวดหมู่", fillColor: "#81d4fa" },
  ]);
  data_detail.value.forEach((data) => {
    body.push([
      { text: data.barcode, fillColor: "#e1f5fe" },
      { text: data.name1, fillColor: "#e1f5fe" },
      { text: data.name2 != undefined ? data.name2 : "", fillColor: "#e1f5fe" },
      { text: data.unitname1, fillColor: "#e1f5fe" },
      { text: data.unitname2 != undefined ? data.unitname2 : "", fillColor: "#e1f5fe" },
      { text: data.price, fillColor: "#e1f5fe" },
      {
        text: data.memberprice != undefined ? data.memberprice : "",
        fillColor: "#e1f5fe",
      },
      { text: data.categoryname, fillColor: "#e1f5fe" },
    ]);

    if (data.options.length > 0) {
      body.push([
        { text: "รหัส", fillColor: "#ffe082" },
        { text: "ชื่อ1", fillColor: "#ffe082" },
        { text: "ชื่อ2", fillColor: "#ffe082" },
        { text: "ประเภทตัวเลือก", fillColor: "#ffe082" },
        { text: "เลือกได้สูงสุุด", fillColor: "#ffe082" },
        { text: "จำเป็นต้องเลือก", fillColor: "#ffe082" },
        { text: "ลำดับ", fillColor: "#ffe082" },
        { text: "", fillColor: "#ffe082" },
      ]);
    }
    data.options.forEach((opt) => {
      body.push([
        { text: opt.code, fillColor: "#ffffe5" },
        { text: opt.name1, fillColor: "#ffffe5" },
        { text: opt.name2 != undefined ? opt.name2 : "", fillColor: "#ffffe5" },
        {
          text: opt.choicetype == 1 ? "เลือกได้ตัวเดียว" : "เลือกได้หลายตัว",
          fillColor: "#ffffe5",
        },
        { text: opt.maxselect, fillColor: "#ffffe5" },
        { text: opt.required ? "ใช่" : "ไม่ใช่", fillColor: "#ffffe5" },
        { text: opt.order, fillColor: "#ffffe5" },
        { text: "", fillColor: "#ffffe5" },
      ]);
      if (opt.choices.length > 0) {
        body.push([
          { text: "บาร์โค้ด", fillColor: "#c8e6c9" },
          { text: "ชื่อ1", fillColor: "#c8e6c9" },
          { text: "ชื่อ2", fillColor: "#c8e6c9" },
          { text: "หน่วยนับ", fillColor: "#c8e6c9" },
          { text: "ราคา", fillColor: "#c8e6c9" },
          { text: "จำนวนสูงสุด", fillColor: "#c8e6c9" },
          { text: "ค่าเริ่มต้น", fillColor: "#c8e6c9" },
          { text: "เลือกAuto", fillColor: "#c8e6c9" },
        ]);
      }
      opt.choices.forEach((cho) => {
        body.push([
          cho.barcode,
          cho.name1,
          cho.name2 != undefined ? cho.name2 : "",
          cho.itemunit,
          cho.price,
          cho.qtymax,
          cho.default,
          cho.selected,
        ]);
      });
    });
  });
  return body;
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
function formatCurrency(value) {
  return value.toLocaleString("th-TH", { style: "currency", currency: "THB" });
}
</script>
