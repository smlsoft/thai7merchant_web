<script setup>
import MasterdataService from "@/services/MasterdataService";
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const image_file = ref();

const categoryChoice = ref([]);
const form_model = ref({
  categoryguid: "",
  guidfixed: "",
  code: "",
  image: "",
  name1: "",
  name2: "",
  name3: "",
  name4: "",
  name5: "",
  order: 0,
  parentguid: "",
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
  getCategoryList();
  form_model.value = props.form_model;
});

function getCategoryList() {
  MasterdataService.getCategoryList()
    .then((res) => {
      console.log(res);
      if (res.success) {
        categoryChoice.value = res.data;
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

function onSave() {
  if (validate()) {
    emit("save");
  }
}

function onBack() {
  emit("back");
}

function uploadPic() {
  console.log(image_file.value);
  MasterdataService.upLoadImages(image_file.value.files[0])
    .then((res) => {
      console.log(res);
      if (res.success) {
        form_model.value.image = res.data.uri;
      }
    })
    .catch((err) => {
      console.log(err);
    });
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
  // if (form_model.value.code == "") {
  //   form_valid.value.code = false;
  //   err_msg += "รหัส ";
  //   checkValid += 1;
  // } else {
  //   form_valid.value.code = true;
  // }
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
</script>

<template>
  <div class="grid">
    <div class="col-12 sm:col-12 md:col-4">
      <label for="avatar" class="font-medium text-900">รูปภาพ</label>
      <div class="flex align-items-center mt-1">
        <FileUpload
          mode="basic"
          name="Image[]"
          :customUpload="true"
          @uploader="uploadPic"
          :auto="true"
          ref="image_file"
          chooseLabel="เลือกรูปภาพ"
          chooseIcon="pi pi-upload"
          accept="image/*"
        />
      </div>
      <div class="flex align-items-center mt-1"></div>
      <Image :src="form_model.image" width="300" />
    </div>
    <div class="col-12 sm:col-12 md:col-8">
      <div class="grid formgrid p-fluid">
        <div class="field mb-4 col-12 md:col-6">
          <label for="name1" class="font-medium text-900">ชื่อ</label>
          <InputText
            id="name1"
            type="text"
            v-model="form_model.name1"
            :class="!form_valid.name1 ? 'p-invalid' : ''"
          />
        </div>
        <div class="field mb-4 col-12 md:col-6">
          <label for="order" class="font-medium text-900">ลำดับ</label>
          <InputNumber id="order" :min="0" v-model="form_model.order" />
        </div>
        <div class="field mb-4 col-12 md:col-6">
          <label for="code" class="font-medium text-900">รหัส</label>
          <InputText
            id="code"
            type="text"
           
            v-model="form_model.code"
            :class="!form_valid.code ? 'p-invalid' : ''"
          />
        </div>
        <div class="field mb-4 col-12 md:col-6">
          <label for="parent" class="font-medium text-900">หมวดหลัก</label>
          <Dropdown
            id="parent"
            :options="categoryChoice"
            optionLabel="name1"
            optionValue="categoryguid"
            v-model="form_model.parentguid"
            :filter="true"
            filterBy="order"
            placeholder="เลือกกลุ่มหลัก"
          >
            <template #option="slotProps">
              <div class="flex align-items-center">
                <img
                  :src="slotProps.option.image"
                  :class="'mr-2'"
                  style="width: 25px"
                />
                <div>{{ slotProps.option.name1 }}</div>
              </div>
            </template>
          </Dropdown>
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
            <Button
              icon="pi pi-arrow-left"
              label="ยกเลิก"
              @click="onBack()"
              class="w-auto p-button-danger"
            ></Button
            ><Button
              icon="pi pi-save"
              label="บันทึก"
              class="w-auto p-button-success"
              @click="onSave()"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
