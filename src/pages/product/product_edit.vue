<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import Form from "./components/form.vue";
import { ref, onMounted } from "vue";
import { useApp } from "@/stores/app.js";
import { useToast } from "primevue/usetoast";
import { useRouter, useRoute } from "vue-router";

const toast = useToast();
const storeApp = useApp();
const router = useRouter();
const route = useRoute();
const form_model = ref({
  guidfixed: "",
  itemcode: "",
  barcode: "",
  unitcode: "",
  price: null,
  categoryguid: "",
  description1: "",
  name1: "",
  tags: [],
  options: [],
  /*
name2: "",
name3: "",
name4: "",
name5: "",
description2: "",
description3: "",
description4: "",
description5: "",
unitname1: "",
unitname2: "",
unitname3: "",
unitname4: "",
unitname5: "",
itemunitstd: null,
itemunitdiv: null,
*/
  images: [],
  unituses: [
    {
      unitcode: "",
      unitname1: "",
      itemunitstd: null,
      itemunitdiv: null,
      isunitstandard: true,
      image: "",
      isprimary: false
    }
  ],
  barcodes: [{
    barcode: "",
    unitcode: "",
    unitname1: "",
    price: null,
    image: "",
    isprimary: false
  }],

});

const form_valid = ref({
  itemcode: true,
  name1: true,
});

const unituses = ref([]);

const categoryChoice = ref([{
  categoryguid: "",
  code: "",
  guidfixed: "",
  image: "",
  name1: "",
  name2: "",
  name3: "",
  name4: "",
  name5: "",
  order: 0,
  parentguid: "",
}]);


onMounted(() => {
  getUnitList();
  getCategoryList();
  getInventoryDetail(route.params.id);
  storeApp.setPageTitle("แก้ไขข้อมูลสินค้า");
  storeApp.setActivePage("master");
  storeApp.setActiveChild("product_list");

});

function getCategoryList() {
  MasterdataService.getCategoryList()
    .then((res) => {
      //console.log(res);
      if (res.success) {
        categoryChoice.value = res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getInventoryDetail(data) {
  MasterdataService.getInventoryDetail(data)
    .then((res) => {
      //console.log(res);
      if (res.success) {
        form_model.value = res.data;
        if (res.data.barcodes == null || res.data.unituses == null) {
          res.data.barcodes = [];
          res.data.unituses = [];
          form_model.value.barcodes.push({
            barcode: "",
            unitcode: "",
            unitname1: "",
            price: null,
            image: "",
            isprimary: false
          })
          form_model.value.unituses.push({
            unitcode: "",
            unitname1: "",
            itemunitstd: null,
            itemunitdiv: null,
            isunitstandard: true,
            image: "",
            isprimary: false
          })
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });

}

function getUnitList() {
  unituses.value = [{
    unitcode: "กระป๋อง",
    unitname1: "กระป๋อง",
  }, {
    unitcode: "ขวด",
    unitname1: "ขวด",
  }]

  // MasterdataService.getUnitList()
  //   .then((res) => {
  //     //console.log(res);
  //     if (res.success) {
  //       unituses.value = res.data;
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

}


function onSave() {

  form_model.value.price = parseFloat(form_model.value.price);
  form_model.value.barcodes.forEach((barcodes) => {
    barcodes.price = parseFloat(barcodes.price);
  });

  console.log(form_model.value)


  MasterdataService.updateInventory(form_model.value, form_model.value.guidfixed)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({
          severity: "success",
          summary: "success",
          detail: "บันทึกข้อมูลสำเร็จ",
          life: 3000,
        });
        setTimeout(() => {
          goTo("product_list", "");
        }, 1000);
      }
    })
    .catch((err) => {
      console.log(err);
      toast.add({
        severity: "error",
        summary: "error",
        detail: "บันทึกไม่สำเร็จ " + err,
        life: 3000,
      });
    });

}

function goTo(path, param) {
  if (param != "") {
    router.push({ name: path, params: { id: param } });
  } else {
    router.push({ name: path });
  }
}


function addColumn(index) {
  form_model.value.unituses.splice(index + 1, 0, {
    unitcode: "",
    unitname1: "",
    itemunitstd: null,
    itemunitdiv: null,
    isunitcost: false,
    isunitstandard: false,
  });
}

function addColumnBarcode(index) {
  form_model.value.barcodes.splice(index + 1, 0, {
    barcode: "",
    unitcode: "",
    unitname1: "",
    price: null,
    image: "",
    isprimary: false
  });
}

function deleteDetail(data, index) {

  form_model.value.unituses.splice(index, 1);

  if (form_model.value.unituses.length == 0) {
    form_model.value.unituses.push({
      unitcode: "",
      unitname1: "",
      itemunitstd: null,
      itemunitdiv: null,
      isunitcost: false,
      isunitstandard: false,
    });
  }

  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Detail Deleted",
    life: 3000,
  });

}

function deleteDetailBarcode(data) {

  form_model.value.barcodes.splice(data, 1);

  if (form_model.value.barcodes.length == 0) {
    form_model.value.barcodes.push({
      barcode: "",
      unitcode: "",
      unitname: "",
      price: null,
      image: ""
    });
  }
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Detail Deleted",
    life: 3000,
  });

}

function selectUnit(data, index) {
  var ele = unituses.value.filter((val) => val.unitcode == data);
  form_model.value.unituses[index].unitname1 = ele[0].unitname1;
}

function selectUnitBarcode(data, index) {
  var ele = form_model.value.unituses.filter((val) => val.unitcode == data);
  form_model.value.barcodes[index].unitname1 = ele[0].unitname1;
}

function selectIsUnitCost(index) {
  form_model.value.unituses.forEach((data) => {
    data.isunitcost = false;
  });
  form_model.value.unituses[index].isunitcost = true;
}

function selectIsUnitStandard(index) {
  form_model.value.unituses.forEach((data) => {
    data.isunitstandard = false;
  });
  form_model.value.unituses[index].isunitstandard = true;
}
function delImages(uri, index) {
  form_model.value.images.splice(index, 1);


  if (form_model.value.barcodes.length > 0) {
    form_model.value.barcodes.forEach((element, index) => {
      if (element.image == uri) {
        form_model.value.barcodes[index].image = "";
      }
    });
  }

}
</script>
  
<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-4 surface-section flex-auto shadow-2 border-round">
        <Form :form_model="form_model" :form_valid="form_valid" :categoryChoice="categoryChoice" :unituses="unituses"
          v-on:save="onSave" v-on:deleteDetail="deleteDetail" v-on:addColumn="addColumn"
          v-on:deleteDetailBarcode="deleteDetailBarcode" v-on:addColumnBarcode="addColumnBarcode"
          v-on:selectUnit="selectUnit" v-on:selectIsUnitCost="selectIsUnitCost"
          v-on:selectIsUnitStandard="selectIsUnitStandard" v-on:selectUnitBarcode="selectUnitBarcode"
          v-on:delImages="delImages" v-on:back="goTo('product_list', '')" />
      </div>
    </MainContentWarp>
  </AppLayout>
</template>
  