<script setup>
import DialogForm from "@/components/widget/DialogForm.vue";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";

const toast = useToast();
const confirmSaveDialog = ref(false);
const expandedRows = ref([]);

const props = defineProps({
    form_model: Object,
    form_valid: Object
});

const emit = defineEmits(["save", "back", "addColumnShelf", "deleteDetailShelf"]);

onMounted(async () => {
    // console.log(props.form_model)
    // console.log(props.form_valid)
});

async function onSave() {
    var isPass = await verifyData();
    if (isPass) {
        confirmSaveDialog.value = true;
    }
}

function onBack() {
    emit("back");
}

function confirmSave() {
    confirmSaveDialog.value = false;
    emit("save", props.form_model);
}

function onClose() {
    confirmSaveDialog.value = false;
}

function addColumnShelf(index) {
    emit("addColumnShelf", index);
}

function deleteDetailShelf(index) {
    emit("deleteDetailShelf", index);
}

async function verifyData() {

    let checkValid = 0;
    let err_msg = "";
    if (props.form_model.code == "") {
        props.form_valid.code = false;
        err_msg += "รหัสคลังสินค้า ";
        checkValid += 1;
    } else {
        props.form_valid.code = true;
    }
    if (props.form_model.name1 == "") {
        props.form_valid.name1 = false;
        err_msg += "ชื่อคลังสินค้า ";
        checkValid += 1;
    } else {
        props.form_valid.name1 = true;
    }

    if (props.form_model.locations[0].code == "") {
        props.form_valid.locations[0].code = false;
        err_msg += " รหัสคลังสินค้า 1";
        checkValid += 1;
    } else {
        props.form_valid.locations[0].code = true;
    }

    if (props.form_model.locations[0].name1 == "") {
        props.form_valid.locations[0].name1 = false;
        err_msg += " ชื่อคลังสินค้า 1";
        checkValid += 1;
    } else {
        props.form_valid.locations[0].name1 = true;
    }


    if (checkValid == 0) {
        return true;
    } else {
        toast.add({
            severity: "error",
            summary: "error",
            detail: "กรุณากรอบข้อมูล\n" + err_msg,
            life: 4000,
        });

        return false;
    }
}
</script>
    
<template>
    <Button label="กลับหน้ารายการ" icon="pi pi-arrow-left" class="p-button-text p-button-sm p-button-info"
        @click="onBack()" />
    <div class="surface-card p-4 shadow-2 border-round p-fluid">
        <div class="grid formgrid p-fluid">
            <div class="field mb-6 col-6 md:col-6">
                <label for="code" class="font-medium text-900"><span class="text-orange-500">* </span> รหัสคลังสินค้า
                </label>
                <InputText id="code" type="text" v-model="props.form_model.code"
                    :class="!props.form_valid.code ? 'p-invalid' : ''"
                    :style="[props.form_model.code == '' ? 'background-color: #FFF6FF;' : '']" />
            </div>
            <div class="field mb-6 col-6 md:col-6">
                <label for="name1" class="font-medium text-900"><span class="text-orange-500">* </span> ชื่อคลังสินค้า
                </label>
                <InputText id="name1" type="text" v-model="props.form_model.name1"
                    :class="!props.form_valid.name1 ? 'p-invalid' : ''"
                    :style="[props.form_model.name1 == '' ? 'background-color: #FFF6FF;' : '']" />
            </div>


            <div class="field mb-12 col-12 md:col-12">
                <DataTable showGridlines :value="props.form_model.locations" responsiveLayout="scroll"
                    :dataKey="props.form_model.datakey" v-model:expandedRows="expandedRows">

                    <Column header="เพิ่ม" bodyStyle="text-align:center" style="width: 10%">
                        <template #body="slotProps">
                            <Button icon="pi pi-plus" class="p-button-rounded p-button-success p-button-text"
                                @click="addColumnShelf(slotProps.index)" />
                        </template>
                    </Column>
                    <Column field="code" header="รหัสพื้นที่เก็บ">
                        <template #body="{ data, field,index }">
                            <InputText id="shelf_code" type="text" v-model="data[field]"
                                :class="!props.form_valid.locations[0].code && index== 0 ? 'p-invalid' : ''"
                                :style="props.form_model.locations[0].code == '' && index== 0 ? 'background-color: #FFF6FF;' : ''" />
                        </template>
                    </Column>
                    <Column field="name1" header="ชื่อพื้นที่เก็บ">
                        <template #body="{ data, field ,index }">
                            <InputText id="shelf_name1" type="text" v-model="data[field]"
                                :class="!props.form_valid.locations[0].name1 && index== 0 ? 'p-invalid' : ''"
                                :style="props.form_model.locations[0].name1 == '' && index== 0 ? 'background-color: #FFF6FF;' : ''" />
                        </template>
                    </Column>
                    <Column :expander="true" bodyStyle="text-align:center" header="เพิ่มเติม" headerStyle="width: 3rem"
                        style="width: 10%"></Column>
                    <Column header="ลบ" bodyStyle="text-align:center" style="width: 10%">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text"
                                @click="deleteDetailShelf(slotProps.data, slotProps.index)" />
                        </template>
                    </Column>
                    <template #expansion="mainProps">
                        <h4>ข้อมูลพื้นที่เก็บเพิ่มเติมของคลัง {{ mainProps.data.code + " - "  + mainProps.data.name1}}</h4>
                        <div class="grid formgrid p-fluid">
                            <div class="field mb-6 col-6 md:col-6">
                                <label for="name2" class="font-medium text-900">ชื่อพื้นที่เก็บ 2
                                </label>
                                <InputText id="name2" type="text" v-model="mainProps.data.name2" />
                            </div>
                            <div class="field mb-6 col-6 md:col-6">
                                <label for="name3" class="font-medium text-900"> ชื่อพื้นที่เก็บ 3
                                </label>
                                <InputText id="name3" type="text" v-model="mainProps.data.name3" />
                            </div>
                            <div class="field mb-6 col-6 md:col-6">
                                <label for="name4" class="font-medium text-900">ชื่อพื้นที่เก็บ 4
                                </label>
                                <InputText id="name4" type="text" v-model="mainProps.data.name4" />
                            </div>
                            <div class="field mb-6 col-6 md:col-6">
                                <label for="name5" class="font-medium text-900"> ชื่อพื้นที่เก็บ 5
                                </label>
                                <InputText id="name5" type="text" v-model="mainProps.data.name5" />
                            </div>
                        </div>
                    </template>
                </DataTable>

            </div>

            <div class="field mb-12 col-12 md:col-12">
                <Fieldset legend="ข้อมูลคลังเพิ่มเติม" :toggleable="true" :collapsed="props.form_model.name2 == '' ">
                    <div class="grid formgrid p-fluid">
                        <div class="field mb-6 col-6 md:col-6">
                            <label for="name2" class="font-medium text-900">ชื่อคลังสินค้า 2
                            </label>
                            <InputText id="name2" type="text" v-model="props.form_model.name2" />
                        </div>
                        <div class="field mb-6 col-6 md:col-6">
                            <label for="name3" class="font-medium text-900"> ชื่อคลังสินค้า 3
                            </label>
                            <InputText id="name3" type="text" v-model="props.form_model.name3" />
                        </div>
                        <div class="field mb-6 col-6 md:col-6">
                            <label for="name4" class="font-medium text-900">ชื่อคลังสินค้า 4
                            </label>
                            <InputText id="name4" type="text" v-model="props.form_model.name4" />
                        </div>
                        <div class="field mb-6 col-6 md:col-6">
                            <label for="name5" class="font-medium text-900"> ชื่อคลังสินค้า 5
                            </label>
                            <InputText id="name5" type="text" v-model="props.form_model.name5" />
                        </div>
                    </div>
                </Fieldset>
            </div>


            <div class="field mb-12 col-12 md:col-12">
                <div class="flex justify-content-between flex-wrap">
                    <Button icon="pi pi-arrow-left" label="ยกเลิก" @click="onBack()"
                        class="w-auto p-button-danger"></Button><Button icon="pi pi-save" label="บันทึก"
                        class="w-auto p-button-success" @click="onSave()"></Button>
                </div>
            </div>
        </div>
    </div>
    <DialogForm :confirmDialog="confirmSaveDialog" textContent="ต้องการบันทึกคลังสินค้า "
        :code_detail="props.form_model.name1" v-on:close="onClose" v-on:confirm="confirmSave"></DialogForm>
</template>

<style scoped>
.p-column-header-content {
    flex-direction: column;
}
</style>
    