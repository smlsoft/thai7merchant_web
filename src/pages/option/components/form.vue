<script setup>
import { ref, onMounted, normalizeStyle } from "vue";
import { useToast } from "primevue/usetoast";


const toast = useToast();

const displayModal = ref(false);
const modalModeEdit = ref(false);
const index = ref();
const form_model_choices = ref([
  {
    barcode: "",
    name1: "",
    name2: "",
    name3: "",
    name4: "",
    name5: "",
    price: null,
    qty: null,
    qtymax: null,
    suggestcode: "",
    itemunit: "",

  }
]);
const selectedChecked = ref(false);
const defaultChecked = ref(false);

const form_model = ref({
  guidfixed: "",
  code: "",
  name1: "",
  name2: "",
  name3: "",
  name4: "",
  name5: "",
  required: true,
  choicetype: 0,
  maxselect: 0,
  choicess: [],
});


const form_valid = ref({
  name1: true,
  code: true,
});
const props = defineProps({
  form_model: Object,
});

const emit = defineEmits(["save", "back"]);

onMounted(() => {

  form_model.value = props.form_model;


});

function addchoices() {

  form_model.value.choices.push({
    barcode: form_model_choices.value.barcode,
    name1: form_model_choices.value.name1,
    name2: form_model_choices.value.name2,
    name3: form_model_choices.value.name3,
    name4: form_model_choices.value.name4,
    name5: form_model_choices.value.name5,
    itemunit: form_model_choices.value.itemunit,
    price: form_model_choices.value.price,
    qty: form_model_choices.value.qty,
    qtymax: form_model_choices.value.qtymax,
    suggestcode: form_model_choices.value.suggestcode,
    default: defaultChecked.value,
    selected: selectedChecked.value,
  });

  closeModal();
}

function editchoices(data) {

  modalModeEdit.value = true;
  displayModal.value = true;

  index.value = data.index;
  form_model_choices.value = data.item;
  defaultChecked.value = data.item.default;
  selectedChecked.value = data.item.selected;

}
[index]
function updatechoices(index) {

  form_model.value.choices[index] = form_model_choices.value;
  form_model.value.choices[index].default = defaultChecked.value;
  form_model.value.choices[index].selected = selectedChecked.value;

  closeModal();

}

function delchoices(key) {
  form_model.value.choices.splice(key.index, 1);
  form_model_choices.value.barcode = "";
  form_model_choices.value.name1 = "";
  form_model_choices.value.price = "";
}

function onSave() {
  if (validate()) {
    emit("save");
  }
}
function onBack() {
  emit("back");
}

function validate() {
  let checkValid = 0;
  let err_msg = "";
  if (form_model.value.name1 == "") {
    form_valid.value.name1 = false;
    err_msg += "ชื่อ ";
    checkValid += 1;
  } else {
    form_valid.value.name1 = true;
  }

  if (checkValid == 0) {
    return true;
  } else {
    toast.add({
      severity: "error",
      summary: "error",
      detail: "กรุณากรอบข้อมูล\n" + err_msg,
      life: 3000,
    });

    return false;
  }
}
function openModal() {
  displayModal.value = true;
}
function closeModal() {

  displayModal.value = false;
  modalModeEdit.value = false;

  form_model_choices.value.index = null;
  form_model_choices.value = [];
  defaultChecked.value = false;
  selectedChecked.value = false;

}
</script>

<template>
  <div class="grid">
    <div class="col-12 sm:col-12 md:col-12">
      <div class="grid formgrid p-fluid">

        <div class="field mb-4 col-12 md:col-6">
          <label for="code" class="font-medium text-900">รหัส</label>
          <InputText id="code" type="text" v-model="form_model.code" :class="!form_valid.code ? 'p-invalid' : ''" />
        </div>
        <div class="field mb-4 col-12 md:col-6">
          <label for="name1" class="font-medium text-900">ชื่อ</label>
          <InputText id="name1" type="text" v-model="form_model.name1" :class="!form_valid.name1 ? 'p-invalid' : ''" />
        </div>

        <div class="surface-border border-top-1 opacity-50 mb-4 col-12"></div>

        <div class="field mb-12 col-12 md:col-12">
          <OrderList v-model="form_model.choices" listStyle="height:auto">
            <template #header>
              <div class=" flex align-items-center justify-content-center">
                <Button icon="pi pi-plus" class="p-button-primary " @click="openModal()" label="เพิ่มตัวเลือกย่อย" />
              </div>
            </template>
            <template #item="slotProps">
              <div class="choices-item">
                <div class="choices-list-detail" @click="editchoices(slotProps)">
                  <h3 class="mb-2">{{ slotProps.item.barcode }}</h3>
                  <i class="pi pi-tag choices-category-icon"></i>
                  <span class="choices-category">{{ slotProps.item.name1 }}</span>
                </div>
                <div class="choices-list-action">
                  <h3 class="mb-2">${{ slotProps.item.price }}</h3>
                  <Button icon="pi pi-trash" class="p-button-danger" @click="delchoices(slotProps)" />
                </div>
              </div>
            </template>
          </OrderList>
        </div>
        <div class="surface-border border-top-1 opacity-50 mb-4 col-12"></div>
        <div class="field mb-12 col-12 md:col-12">
          <h3>ลูกค้าจำเป็นต้องเลือกนี้หรือไม่ ?</h3>
          <div class="field-radiobutton">
            <RadioButton id="required" name="required" :value="true" v-model="form_model.required" />
            <label for="required">จำเป็นต้องเลือก </label>
          </div>
          <div class="field-radiobutton">
            <RadioButton id="notrequired" name="notrequired" :value="false" v-model="form_model.required" />
            <label for="notrequired">ไม่บังคับ </label>
          </div>
        </div>
        <div class="field mb-12 col-12 md:col-12">
          <h3>ลูกค้าสามารถเลือกตัวเลือกย่อยได้กี่อย่าง ?</h3>
          <div class="field-radiobutton">
            <RadioButton id="choicestype" name="choicestype" :value="0" v-model="form_model.choicetype" />
            <label for="choicestype">1 อย่างเท่านั้น </label>
          </div>
          <div class="field-radiobutton">
            <RadioButton id="anychoicestype" name="anychoicestype" :value="1" v-model="form_model.choicetype" />
            <label for="anychoicestype">หลายอย่าง </label>
          </div>

        </div>
        <div class="field mb-12 col-12 md:col-12" v-if="form_model.choicetype == 1">
          <label for="maxselect" class="font-medium text-900">เลือกได้สูงสุด</label>
          <InputNumber id="maxselect" :min="0" v-model="form_model.maxselect" />
        </div>
        <div class="surface-border border-top-1 opacity-50 mb-4 col-12"></div>
        <div class="field mb-4 col-12 md:col-6">
          <label for="name2" class="font-medium text-900">ชื่อ2</label>
          <InputText id="name2" type="text" v-model="form_model.name2" />
        </div>
        <div class="field mb-4 col-12 md:col-6">
          <label for="name3" class="font-medium text-900">ชื่อ3</label>
          <InputText id="name3" type="text" v-model="form_model.name3" />
        </div>
        <div class="field mb-4 col-12 md:col-6">
          <label for="name4" class="font-medium text-900">ชื่อ4</label>
          <InputText id="name4" type="text" v-model="form_model.name4" />
        </div>
        <div class="field mb-4 col-12 md:col-6">
          <label for="name5" class="font-medium text-900">ชื่อ5</label>
          <InputText id="name5" type="text" v-model="form_model.name5" />
        </div>
        <div class="surface-border border-top-1 opacity-50 mb-3 col-12"></div>
        <div class="col-12">
          <div class="flex justify-content-between flex-wrap">
            <Button icon="pi pi-arrow-left" label="ยกเลิก" @click="onBack()"
              class="w-auto p-button-danger"></Button><Button icon="pi pi-save" label="บันทึก"
              class="w-auto p-button-success" @click="onSave()"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog header="เพิ่มตัวเลือกย่อย" v-model:visible="displayModal" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '50vw' }" :modal="true">
    <div class="grid">
      <div class="col-12 sm:col-12 md:col-12">
        <div class="grid formgrid p-fluid">

          <div class="field mb-12 col-12 md:col-12">
            <label for="choices_barcode" class="font-medium text-900">Barcode</label>
            <InputText id="choices_barcode" type="text" v-model="form_model_choices.barcode" />
          </div>
          <div class="field mb-12 col-12 md:col-12">
            <label for="choices_name1" class="font-medium text-900">ชื่อ1</label>
            <InputText id="choices_name1" type="text" v-model="form_model_choices.name1" />
          </div>
          <div class="field mb-12 col-12 md:col-12">
            <label for="choices_itemunit" class="font-medium text-900">หน่วยนับ</label>
            <InputText id="choices_itemunit" type="text" v-model="form_model_choices.itemunit" />
          </div>
          <div class="field mb-12 col-12 md:col-12">
            <label for="choices_price" class="font-medium text-900">ราคา</label>
             <InputNumber id="choices_price" :min="0" v-model="form_model_choices.price" />
          </div>
          <div class="field mb-12 col-12 md:col-12">
            <label for="choices_qty" class="font-medium text-900">จำนวน</label>
            <InputNumber id="choices_qty" :min="0" v-model="form_model_choices.qty" />
          </div>
          <div class="field mb-12 col-12 md:col-12">
            <label for="choices_qtymax" class="font-medium text-900">จำนวนสูงสุด</label>
             <InputNumber id="choices_qtymax" :min="0" v-model="form_model_choices.qtymax" />
          </div>
          <div class="field mb-12 col-12 md:col-12">
            <label for="choices_price" class="font-medium text-900">รหัสแนะนำ</label>
            <InputText id="choices_price" type="text" v-model="form_model_choices.suggestcode" />
          </div>
          <div class="field mb-4 col-12 md:col-6">
            <div class="field-checkbox">
              <Checkbox id="binary" v-model="selectedChecked" :binary="true" />
              <label for="binary">เลือกให้เลย </label>
            </div>
            <div class="field-checkbox">
              <Checkbox id="binary" v-model="defaultChecked" :binary="true" />
              <label for="binary">ค่าเริ่มต้น </label>
            </div>

          </div>


          <div class="surface-border border-top-1 opacity-50 mb-4 col-12"></div>
          <div class="field mb-4 col-12 md:col-6">
            <label for="name2" class="font-medium text-900">ชื่อ2</label>
            <InputText id="name2" type="text" v-model="form_model_choices.name2" />
          </div>
          <div class="field mb-4 col-12 md:col-6">
            <label for="name3" class="font-medium text-900">ชื่อ3</label>
            <InputText id="name3" type="text" v-model="form_model_choices.name3" />
          </div>
          <div class="field mb-4 col-12 md:col-6">
            <label for="name4" class="font-medium text-900">ชื่อ4</label>
            <InputText id="name4" type="text" v-model="form_model_choices.name4" />
          </div>
          <div class="field mb-4 col-12 md:col-6">
            <label for="name5" class="font-medium text-900">ชื่อ5</label>
            <InputText id="name5" type="text" v-model="form_model_choices.name5" />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" @click="closeModal()" class="p-button-text" />
      <Button label="Save" icon="pi pi-check" @click="addchoices()" autofocus v-if="!modalModeEdit" />
      <Button label="Update" class="p-button-warning" icon="pi pi-check" @click="updatechoices(index.vale)" autofocus
        v-if="modalModeEdit" />
    </template>
  </Dialog>
</template>


<style lang="scss" scoped>
.choices-item {
  display: flex;
  align-items: center;
  padding: .5rem;
  width: 100%;


  .choices-list-detail {
    flex: 1 1 0;
  }

  .choices-list-action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .choices-category-icon {
    vertical-align: middle;
    margin-right: .5rem;
    font-size: .875rem;
  }

  .choices-category {
    vertical-align: middle;
    line-height: 1;
    font-size: .875rem;
  }
}
</style>