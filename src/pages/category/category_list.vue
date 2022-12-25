<script setup>
import DialogForm from "@/components/widget/DialogForm.vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import ProductService from "@/services/ProductService";
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useApp } from "@/stores/app.js";
import { useLang } from "@/stores/lang.js";
import { useRouter } from "vue-router";
import $ from "jquery";

const router = useRouter();
const code_detail = ref("");
const storeApp = useApp();
const storeLang = useLang();
const category_List = ref([]);
const toast = useToast();
const detail = ref();
const data_list = ref([]);
const sortField = ref("");
const sortOrder = ref(1);
const totalItemsCount = ref(0);
const limitPage = ref(30);
const filters = ref(null);
const loading = ref(true);
const activePage = ref(1);
const typingTimer = ref(null);
const doneTypingInterval = ref(1000);
const firstPage = ref(0);
const totalPage = ref(0);
const confirmDeleteDialog = ref(false);
const confirmDeleteAllDialog = ref(false);
const isSkeleton = ref(false);
const expandedRows = ref([]);
const isLoad = ref(false);
const selectedUnit = ref(null);
const deep_level = ref(0);
const updateMode = ref(false);
const selectMode = ref(false);
const tempHtml = ref("");
const data_list_load = ref([
  {
    code: "",
    name: "",
  },
  {
    code: "",
    name: "",
  },
  {
    code: "",
    name: "",
  },
  {
    code: "",
    name: "",
  },
  {
    code: "",
    name: "",
  },
  {
    code: "",
    name: "",
  },
  {
    code: "",
    name: "",
  },
]);
const unitModel = ref({
  guidfixed: "",
  unitcode: "",
  names: [],
});
const tableHeight = ref(0);
onMounted(() => {
  getCategory();
  storeApp.setPageTitle("ข้อมูลหมวดสินค้า");
  storeApp.setActivePage("master");
  storeApp.setActiveChild("category_list");

  checkActiveLang();
});

async function getCategory() {
  await ProductService.getCategory()
    .then((res) => {
      console.log(res);
      if (res.success) {
        var rootCategorys = [];

        res.data.forEach((ele) => {
          rootCategorys.push({ detail: ele, childCategorys: [] });
        });
        var index = 0;
        while (index < rootCategorys.length) {
          // console.log(rootCategorys[index]);
          if (rootCategorys[index].detail.parentguid != "") {
            var findResult = findCategory(
              rootCategorys,
              rootCategorys[index].detail.parentguid
            );

            //console.log(findResult);
            if (findResult != null) {
              findResult.childCategorys.push(rootCategorys[index]);
              rootCategorys.splice(index, 1);
            } else {
              index++;
            }
          } else {
            index++;
          }
        }
        setTimeout(() => {
          category_List.value = rootCategorys;

          console.log(category_List.value);
          findDeepLevel();
          //categoryList(0, rootCategorys);
        }, 200);
      } else {
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function findCategory(categorys, guid) {
  for (var findIndex = 0; findIndex < categorys.length; findIndex++) {
    if (guid == categorys[findIndex].detail.guidfixed) {
      //console.log(categorys[findIndex]);
      return categorys[findIndex];
    }
    if (categorys[findIndex].childCategorys.length > 0) {
      var find = findCategory(categorys[findIndex].childCategorys, guid);
      if (find != null) {
        return find;
      }
    }
  }
  return null;
}

async function findDeepLevel() {
  var last_member = null;
  deep_level.value = await getLastChildren(category_List.value, 1);
  console.log(deep_level.value);
  console.log(category_List.value);
  setTimeout(() => {
    loading.value = false;
    expandedRows.value = category_List.value.filter((p) => p.detail.guidfixed);
  }, 500);
}

function getLastChildren(obj, current_level) {
  for (var i = 0; i < obj.length; i++) {
    {
      if (obj[i].childCategorys.length > 0) {
        getLastChildren(obj[i].childCategorys, current_level + 1);
      } else if (current_level >= deep_level.value) {
        deep_level.value = current_level - 1;
      }
    }
  }

  return deep_level.value;
}

function clearForm() {
  unitModel.value = { guidfixed: "", unitcode: "", names: [] };
  checkActiveLang();
  updateMode.value = false;
  $("#unitcode").focus();
}

function checkActiveLang() {
  console.log(storeLang.languages);
  storeLang.languages.forEach((ele) => {
    if (ele.use) {
      unitModel.value.names.push({
        code: ele.code,
        isauto: true,
        isdelete: true,
        name: "",
      });
    }
  });
}

function getLangName(data) {
  var result = storeLang.languages.filter((x) => x.code == data);

  if (result.length > 0) {
    return result[0].name;
  } else {
    return "";
  }
}

function generateHtml(data) {
  console.log(data);

  if (data.childCategorys.length > 0) {
    data.childCategorys.forEach((ele) => {
      if (ele.childCategorys.length == 0) {
        tempHtml.value += genTableChildren(ele.detail);
      } else {
        //generateHtml(ele);
      }
    });
  } else {
    tempHtml.value += genTableChildren(data.detail);
  }

  console.log(tempHtml.value);

  return tempHtml.value;
}

function genTableChildren(data) {
  console.log(data);
  var show_name = "";
  data.names.forEach((element, index) => {
    if (index != 0) {
      show_name += "," + element.name;
    } else {
      show_name += element.name;
    }
  });
  return `<tr>
            <td>${data.guidfixed}</td>
            <td>${show_name}</td>
         </tr>`;
}

function getUnitListScroll() {
  isSkeleton.value = true;
  MasterdataService.getUnitList(
    limitPage.value,
    activePage.value,
    filters.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      console.log(res);
      if (res.success) {
        setTimeout(() => {
          res.data.forEach((ele) => {
            data_list.value.push(ele);
          });
          console.log(data_list.value);

          isSkeleton.value = false;
        }, 500);
      } else {
        setTimeout(() => {
          isSkeleton.value = false;
        }, 500);
      }
    })
    .catch((err) => {
      isSkeleton.value = false;
      console.log(err);
    });
}

function keySearch() {
  $("#textSearch").focus();
}

function deleteUnitSelected() {
  if (selectedUnit.value != null && selectedUnit.value.length > 0) {
    confirmDeleteAllDialog.value = true;
  } else {
    toast.add({
      severity: "error",
      summary: "ไม่สามารถทำรายการได้",
      detail: "ไม่พบรายการหน่วยนับที่เลือกอยู่ กรุณาเลือกรายการ",
      life: 3000,
    });
  }
}

function onUpdate() {
  console.log(unitModel.value);
  if (unitModel.value.unitcode != "") {
    MasterdataService.updateUnit(unitModel.value, unitModel.value.guidfixed)
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
            clearForm();
            getUnitList();
          }, 500);
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
  } else {
    toast.add({
      severity: "error",
      summary: "ไม่สามารถบันทึกได้ ",
      detail: "กรุณาป้อนรหัสหน่วยนับ",
      life: 3000,
    });
  }
}
function onSave() {
  console.log(unitModel.value);
  if (unitModel.value.unitcode != "") {
    MasterdataService.createUnit(unitModel.value)
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
            clearForm();
            getUnitList();
          }, 500);
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
  } else {
    toast.add({
      severity: "error",
      summary: "ไม่สามารถบันทึกได้ ",
      detail: "กรุณาป้อนรหัสหน่วยนับ",
      life: 3000,
    });
  }
}

function sortBy(data) {
  //console.log(data);

  sortField.value = data.sortField;
  sortOrder.value = data.sortOrder;

  getUnitList();
}

function goTo(path, param) {
  if (param != "") {
    router.push({ name: path, params: { id: param } });
  } else {
    router.push({ name: path });
  }
}

function confirmDeleteDetail(data) {
  detail.value = data;
  console.log(detail.value.barcode);
  code_detail.value = detail.value.barcode;

  confirmDeleteDialog.value = true;
}

function keyup() {
  clearTimeout(typingTimer.value);
  typingTimer.value = setTimeout(doneTyping, doneTypingInterval.value);
}
function keydown() {
  clearTimeout(typingTimer.value);
}
function doneTyping() {
  activePage.value = 1;
  firstPage.value = 0;
  getUnitList();
}

function deleteDetail() {
  MasterdataService.delUnit(unitModel.value.guidfixed)
    .then((res) => {
      console.log(res);
      if (res.success) {
        getUnitList();
        clearForm();
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "ลบรายการที่เลือกสำเร็จ",
          life: 3000,
        });
        confirmDeleteDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function deleteDetailAll() {
  var data = [];
  selectedUnit.value.forEach((ele) => {
    data.push(ele.guidfixed);
  });
  console.log(data);
  MasterdataService.delUnitSelected(data)
    .then((res) => {
      console.log(res);
      if (res.success) {
        activePage.value = 1;
        getUnitList();
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "ลบรายการที่เลือกสำเร็จ",
          life: 3000,
        });
        selectModeClick();
        confirmDeleteAllDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function onClose() {
  confirmDeleteDialog.value = false;
}
function onAllClose() {
  confirmDeleteAllDialog.value = false;
}
function onPage(event) {
  activePage.value = event.page + 1;
  limitPage.value = event.rows;
  loading.value = true;

  getUnitList();
}

function nextInput(data, index, length) {
  switch (data) {
    case "unitcode":
      $("#unitname_" + index).focus();
      break;
    case "unitname":
      if (index + 1 < length) {
        $("#unitname_" + (index + 1)).focus();
      } else {
        $("#unitcode").focus();
      }
      break;
    default:
  }
}

function onRowSelect(ele) {
  if (!selectMode.value) {
    console.log(ele.data);
    updateMode.value = true;
    unitModel.value.guidfixed = ele.data.guidfixed;
    unitModel.value.unitcode = ele.data.unitcode;
    unitModel.value.names.forEach((main) => {
      var result = ele.data.names.filter((ele) => ele.code == main.code);
      if (result.length) {
        main.name = result[0].name;
      } else {
        main.name = "";
      }
    });
  } else {
    console.log("asfgasfasfsfs");
  }
}

function deleteUnit() {
  confirmDeleteDialog.value = true;
}

function selectModeClick() {
  if (selectMode.value) {
    selectMode.value = false;
    selectedUnit.value = null;
  } else {
    selectedUnit.value = null;
    selectMode.value = true;
  }
}

function onScroll() {
  let div = $("#table-div")[0];
  if (div.scrollTop + div.clientHeight >= div.scrollHeight - 8) {
    if (!isSkeleton.value) {
      nextPage();
    }
  }
}
function nextPage() {
  activePage.value += 1;

  if (activePage.value <= totalPage.value) {
    getUnitListScroll();
  }
}
</script>

<template>
  <AppLayout v-on:keyup.f2="keySearch()" v-on:keyup.f10="onSave()">
    <MainContentWarp id="mainDiv">
      <div class="grid"></div>
      <div class="grid mt-2">
        <div class="col-12">
          <Splitter>
            <SplitterPanel>
              <div class="p-4 surface-section flex-auto shadow-2 border-round">
                <div class="flex justify-content-between mb-3">
                  <div
                    class="
                      flex-none flex
                      align-items-center
                      justify-content-end
                    "
                  >
                    <span class="p-input-icon-left">
                      <i class="pi pi-search" />
                      <InputText
                        v-model="filters"
                        id="textSearch"
                        placeholder="ค้นหา....(F2)"
                        @keyup="keyup()"
                        @keydown="keydown()"
                      />
                    </span>
                  </div>
                  <div class="flex">
                    <Button
                      v-if="selectMode"
                      icon="pi pi-trash"
                      @click="deleteUnitSelected()"
                      class="p-button-danger"
                    />
                    <Button
                      icon="pi pi-check"
                      class="p-button-info ml-3"
                      :class="!selectMode ? 'p-button-outlined' : ''"
                      @click="selectModeClick()"
                    />

                    <Button
                      icon="pi pi-plus"
                      @click="clearForm()"
                      class="p-button-success ml-3"
                    />
                  </div>
                </div>
                <div
                  id="table-div"
                  style="height: 80vh; overflow: scroll"
                  class="pointer"
                  @scroll="onScroll"
                >
                  <DataTable
                    :value="category_List"
                    dataKey="guidfixed"
                    class="p-datatable-sm"
                    :loading="loading"
                    stripedRows
                    :selectionMode="!selectMode ? 'single' : 'multiple'"
                    :metaKeySelection="false"
                    v-model:selection="selectedUnit"
                    v-model:expandedRows="expandedRows"
                    responsiveLayout="scroll"
                    @rowSelect="onRowSelect"
                    @sort="sortBy"
                    :rowHover="true"
                  >
                    <template #empty> ไม่พบข้อมูล </template>
                    <template #loading>
                      กำลังประมวลผล กรุณารอซักครู่..
                    </template>

                    <Column :expander="true" headerStyle="width: 3rem" />
                    <Column header="รหัสหน่วยนับ" :sortable="true">
                      <template #body="slotProps">
                        {{ slotProps.data.detail.guidfixed }}
                      </template>
                    </Column>
                    <Column header="ชื่อหมวด " :sortable="true">
                      <template #body="slotProps">
                        <span
                          v-for="(data, index) in slotProps.data.detail.names"
                          :key="index"
                        >
                          {{
                            index > 0 && data.name != ""
                              ? "," + data.name
                              : data.name
                          }}
                        </span>
                      </template>
                    </Column>

                    <template #expansion="slotProps">
                      <table
                        v-for="(data, index) in slotProps.data.childCategorys"
                        :key="index"
                        v-html="generateHtml(data)"
                      ></table>
                    </template>
                  </DataTable>
                  <DataTable :value="data_list_load" v-if="isSkeleton">
                    <Column field="code">
                      <template #body>
                        <Skeleton></Skeleton>
                      </template>
                    </Column>
                    <Column field="name">
                      <template #body>
                        <Skeleton></Skeleton>
                      </template>
                    </Column>
                  </DataTable>
                </div>
              </div>
            </SplitterPanel>
            <SplitterPanel>
              <div class="p-4 surface-section flex-auto shadow-2 border-round">
                <div class="flex justify-content-between mb-3">
                  <div class="flex">
                    <h3>
                      {{ updateMode ? "แก้ไขหน่วยนับ" : "เพิ่มหน่วยนับ" }}
                    </h3>
                  </div>
                  <div class="flex align-items-center justify-content-center">
                    <Button
                      v-if="updateMode"
                      icon="pi pi-trash"
                      @click="deleteUnit()"
                      class="p-button-danger"
                    />
                    <Button icon="pi pi-save" class="p-button-success ml-3" />
                  </div>
                </div>
                <Divider />
                <div class="grid formgrid p-fluid">
                  <div class="field mb-6 col-6 md:col-6">
                    <label for="unitcode" class="font-medium text-900"
                      ><span class="text-orange-500">* </span> รหัสหน่วยนับ
                    </label>
                    <InputText
                      id="unitcode"
                      type="text"
                      :readonly="updateMode"
                      v-model="unitModel.unitcode"
                      @keyup.enter="nextInput('unitcode', 0, 0)"
                      required
                    />
                  </div>
                  <div class="field mb-6 col-6 md:col-6"></div>
                  <div
                    class="field mb-6 col-6 md:col-6"
                    v-for="(data, index) in unitModel.names"
                    :key="index"
                  >
                    <label for="unitname1" class="font-medium text-900"
                      >ชื่อหน่วยนับ {{ getLangName(data.code) }}
                    </label>
                    <InputText
                      :id="'unitname_' + index"
                      @keyup.enter="
                        nextInput('unitname', index, unitModel.names.length)
                      "
                      type="text"
                      v-model="data.name"
                    />
                  </div>
                </div>
                <div class="mt-2">
                  <Button
                    @click="updateMode ? onUpdate() : onSave()"
                    label="บันทึกหน่วยนับ (F10)"
                    icon="pi pi-save"
                    class="w-auto p-button-success"
                  ></Button>
                </div>
              </div>
            </SplitterPanel>
          </Splitter>
        </div>
      </div>
      <div>
        <DialogForm
          :confirmDialog="confirmDeleteDialog"
          textContent="ต้องการลบข้อมูลหน่วยนับ"
          :code_detail="unitModel.unitcode"
          v-on:close="onClose"
          v-on:confirm="deleteDetail"
        ></DialogForm>
        <DialogForm
          :confirmDialog="confirmDeleteAllDialog"
          textContent="ต้องการลบข้อมูลหน่วยนับที่เลือก"
          :code_detail="''"
          v-on:close="onAllClose"
          v-on:confirm="deleteDetailAll"
        ></DialogForm>
      </div>
    </MainContentWarp>
  </AppLayout>
</template>
