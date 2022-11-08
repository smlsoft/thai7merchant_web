<script setup>
import MasterdataService from "@/services/MasterdataService";
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const typingTimer = ref(null);

const openConfirmEdit = ref(false);


const props = defineProps({
    form_model: Object,
    form_valid: Object,
    unituses: Object,
    modeButton: String,
    disableInput: Boolean,
    disableBarcode: Boolean,
});

const emit = defineEmits(["save", "resetFormData", "selectUnit", "getBarcode", "saveConfirmEdit", "genBarcode", "genUnit"]);

onMounted(() => {


});

function genUnit() {
    emit("genUnit", props.form_model.unitcode);
}


function keyup(event) {
    clearTimeout(typingTimer.value);
    if (event.target.id == "barcode") {
        typingTimer.value = setTimeout(getBarcode, 1000);

    } else {
        typingTimer.value = setTimeout(genBarcode, 1000);
    }
}
function keydown(event) {
    clearTimeout(typingTimer.value);
}



function genBarcode() {

    emit("genBarcode", props.form_model.barcode);
    setTimeout(() => {
        document.getElementById("barcode").focus();
    }, 300);
}

function getBarcode() {

    emit("getBarcode", props.form_model.txtsearch);
    setTimeout(() => {
        document.getElementById("barcode").focus();
    }, 300);
}



function onSave() {

    if (props.modeButton == "save") {
        if (validate()) {
            //console.log(props.form_model);
            emit("save");

        }
    } else {
        openConfirmEdit.value = true;
    }

}

function resetFormData() {
    emit("resetFormData");
}


function validate() {
    let checkValid = 0;
    let err_msg = "";

    if (props.form_model.barcode == "") {
        props.form_valid.barcode = false;
        err_msg += "รหัสบาร์โค้ด ";
        checkValid += 1;
    } else {
        props.form_valid.barcode = true;
    }

    if (props.form_model.name1 == "") {
        props.form_valid.name1 = false;
        err_msg += "ชื่อสินค้า ";
        checkValid += 1;
    } else {
        props.form_valid.name1 = true;
    }

    if (props.form_model.unitcode == "") {
        props.form_valid.unitcode = false;
        err_msg += "หน่วยนับ ";
        checkValid += 1;
    } else {
        props.form_valid.unitcode = true;
    }

    if (props.form_model.price == "") {
        props.form_valid.price = false;
        err_msg += "ราคา ";
        checkValid += 1;
    } else {
        props.form_valid.price = true;
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

function closeConfirmEdit() {
    openConfirmEdit.value = false;

}
function saveConfirmEdit() {
    emit("saveConfirmEdit");


    openConfirmEdit.value = false;
}

</script>
    
<template>
    <div class="grid">
        <div class="col-12 sm:col-12 md:col-12">
            <div class="grid formgrid p-fluid">
                <div class="field mb-12 col-12 md:col-12">
                    <label for="txtsearch" class="font-medium text-900">ค้นหา</label>
                    <InputText id="txtsearch" type="text" autofocus v-model="props.form_model.txtsearch"
                        class="p-inputtext-lg" :disabled="props.disableBarcode" @keyup.enter="getBarcode()"
                        placeholder="ค้นหา..." />
                </div>
                <div class="field mb-4 col-12 md:col-6">
                    <label for="barcode" class="font-medium text-900"><span
                            class="text-orange-500">*</span>บาร์โค้ด</label>
                    <InputText id="barcode" type="text" v-model="props.form_model.barcode" :disabled="true" />
                </div>
                <div class="field mb-4 col-12 md:col-6">
                    <label for="name1" class="font-medium text-900"><span
                            class="text-orange-500">*</span>ชื่อสินค้า</label>
                    <InputText id="name1" type="text" v-model="props.form_model.name1"
                        :class="!props.form_valid.name1 ? 'p-invalid' : ''"
                        :style="[props.form_model.name1 == '' ? 'background-color: #FFF6FF;' : '']"
                        :disabled="props.disableInput" />
                </div>
                <div class="field mb-4 col-12 md:col-6">
                    <label for="unitcode" class="font-medium text-900"><span
                            class="text-orange-500">*</span>หน่วยนับ</label>
                  
                    <Dropdown id="unitcode" :options="props.unituses" optionLabel="unitname1" optionValue="unitcode"
                        v-model="props.form_model.unitcode" :filter="true" filterBy="order" @change="genUnit()"
                        placeholder="เลือกหน่วยนับสินค้า" :disabled="props.disableInput"
                        :class="!props.form_valid.name1 ? 'p-invalid' : ''"
                        :style="[props.form_model.name1 == '' ? 'background-color: #FFF6FF;' : '']">
                        <template #option="slotProps">
                            <span>{{ slotProps.option.unitcode }} ~
                                {{ slotProps.option.unitname1 }}</span>
                        </template>
                    </Dropdown>
                     <!--
                    <Listbox v-model="props.form_model.unitcode" :options="props.unituses" :filter="true"
                        optionLabel="unitname1" optionValue="unitcode" listStyle="max-height:200px"
                        filterPlaceholder="Search" filterBy="order" @change="genUnit()"
                        :class="!props.form_valid.unitcode ? 'p-invalid' : ''"
                        :style="[props.form_model.unitcode == '' ? 'background-color: #FFF6FF;' : '']"
                        :disabled="props.disableInput">
                        >
                        <template #option="slotProps">
                            <span>{{ slotProps.option.unitcode }} ~
                                {{ slotProps.option.unitname1 }}</span>
                        </template>
                    </Listbox>
                     -->

                </div>
                <div class="field mb-4 col-12 md:col-6">
                    <label for="price" class="font-medium text-900"><span class="text-orange-500">*</span>ราคา</label>
                    <InputText id="price" type="number" v-model="props.form_model.price" @keyup="keyup($event)"
                        @keydown="keydown($event)" :disabled="props.disableInput"
                        :class="!props.form_valid.price ? 'p-invalid' : ''"
                        :style="[props.form_model.price == '' ? 'background-color: #FFF6FF;' : '']" />
                </div>
                <div class="field mb-12 col-12 md:col-12">
                    <div class="flex justify-content-between flex-wrap">
                        <Button icon="pi pi-refresh " label="เริ่มใหม่" @click="resetFormData()"
                            class="w-auto p-button-secondary"></Button>
                        <Button :icon="props.modeButton == 'save' ? 'pi pi-save' : 'pi pi-pencil'"
                            :label="props.modeButton == 'save' ? 'บันทึก' : 'แก้ไข' " class="w-auto"
                            :class="props.modeButton == 'save' ? 'p-button-success' : 'p-button-info' "
                            @click="onSave() "></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Dialog header="Confirmation" v-model:visible="openConfirmEdit" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>ต้องการแก้ไข Barcode {{props.form_model.barcode}} ใช่หรือไม่ ?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" @click="closeConfirmEdit()" class="p-button-text" />
            <Button label="Yes" icon="pi pi-check" @click="saveConfirmEdit()" class="p-button-text" autofocus />
        </template>
    </Dialog>

</template>
