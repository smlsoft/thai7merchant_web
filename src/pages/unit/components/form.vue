<script setup>
import DialogForm from "@/components/widget/DialogForm.vue";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";

const toast = useToast();
const confirmSaveDialog = ref(false);

const props = defineProps({
    form_model: Object,
    form_valid: Object
});

const emit = defineEmits(["save", "back"]);

onMounted(async () => {

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

async function verifyData() {

    let checkValid = 0;
    let err_msg = "";
    if (props.form_model.unitcode == "") {
        props.form_valid.unitcode = false;
        err_msg += "รหัสหน่วยนับ ";
        checkValid += 1;
    } else {
        props.form_valid.unitcode = true;
    }
    if (props.form_model.unitname1 == "") {
        props.form_valid.unitname1 = false;
        err_msg += "ชื่อหน่วยนับ ";
        checkValid += 1;
    } else {
        props.form_valid.unitname1 = true;
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
                <label for="unitcode" class="font-medium text-900"><span class="text-orange-500">* </span> รหัสหน่วยนับ
                </label>
                <InputText id="unitcode" type="text" v-model="props.form_model.unitcode"
                    :class="!props.form_valid.unitcode ? 'p-invalid' : ''"
                    :style="[props.form_model.unitcode == '' ? 'background-color: #FFF6FF;' : '']" />
            </div>
            <div class="field mb-6 col-6 md:col-6">
                <label for="unitname1" class="font-medium text-900"><span class="text-orange-500">* </span> ชื่อหน่วยนับ
                </label>
                <InputText id="unitname1" type="text" v-model="props.form_model.unitname1"
                    :class="!props.form_valid.unitname1 ? 'p-invalid' : ''"
                    :style="[props.form_model.unitname1 == '' ? 'background-color: #FFF6FF;' : '']" />
            </div>
            <div class="field mb-6 col-6 md:col-6">
                <label for="unitname2" class="font-medium text-900">รหัสหน่วยนับ 2
                </label>
                <InputText id="unitname2" type="text" v-model="props.form_model.unitname2" />
            </div>
            <div class="field mb-6 col-6 md:col-6">
                <label for="unitname3" class="font-medium text-900"> ชื่อหน่วยนับ 3
                </label>
                <InputText id="unitname3" type="text" v-model="props.form_model.unitname3" />
            </div>
            <div class="field mb-6 col-6 md:col-6">
                <label for="unitname4" class="font-medium text-900">รหัสหน่วยนับ 4
                </label>
                <InputText id="unitname4" type="text" v-model="props.form_model.unitname4" />
            </div>
            <div class="field mb-6 col-6 md:col-6">
                <label for="unitname5" class="font-medium text-900"> ชื่อหน่วยนับ 5
                </label>
                <InputText id="unitname5" type="text" v-model="props.form_model.unitname5" />
            </div>
        </div>
        <div class="mt-2">
            <Button @click="onSave()" label="บันทึกหน่วยนับ" icon="pi pi-save" class="w-auto p-button-success"></Button>
        </div>
    </div>
    <DialogForm :confirmDialog="confirmSaveDialog" textContent="ต้องการบันทึกหน่วยนับ "
        :code_detail="props.form_model.unitname1" v-on:close="onClose" v-on:confirm="confirmSave"></DialogForm>
</template>
    