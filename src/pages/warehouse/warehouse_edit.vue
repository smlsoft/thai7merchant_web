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
    code: "",
    locations: [
        {
            datakey: "code0",
            code: "",
            name1: "",
            name2: "",
            name3: "",
            name4: "",
            name5: ""
        }
    ],
    name1: "",
    name2: "",
    name3: "",
    name4: "",
    name5: ""
});
const form_valid = ref({
    code: true,
    name1: true,
    locations: [
        {
            code: true,
            name1: true,

        }
    ],
});

onMounted(() => {

    storeApp.setPageTitle("เพิ่มข้อมูลคลังและพื้นที่เก็บ");
    storeApp.setActivePage("master");
    storeApp.setActiveChild("warehouse_list");
    getDetail(route.params.id);
});

function getDetail(data) {
    var newData = [];
    MasterdataService.getWarehouseById(data)
        .then((res) => {
            //console.log(res);
            if (res.success) {
                form_model.value.guidfixed = res.data.guidfixed;
                form_model.value.code = res.data.code;
                form_model.value.name1 = res.data.name1;
                form_model.value.name2 = res.data.name2;
                form_model.value.name3 = res.data.name3;
                form_model.value.name4 = res.data.name4;
                form_model.value.name5 = res.data.name5;
                res.data.locations.forEach((ele, index) => {
                    newData.push({
                        datakey: "code" + index,
                        code: ele.code,
                        name1: ele.name1,
                        name2: ele.name2,
                        name3: ele.name3,
                        name4: ele.name4,
                        name5: ele.name5,
                    });
                });
                form_model.value.locations = newData;

            }
        })
        .catch((err) => {
            console.log(err);
        });
}



async function onSave() {
    console.log(form_model.value);
    try {
        const res = await MasterdataService.updateWarehouse(form_model.value,form_model.value.guidfixed);
        if (res.success) {
            toast.add({
                severity: "success",
                summary: "success",
                detail: "บันทึกข้อมูลสำเร็จ",
                life: 3000,
            });
            setTimeout(() => {
                goTo("warehouse_list", "");
            }, 1000);
        }
    } catch (err) {
        toast.add({
            severity: "error",
            summary: "ทำรายการไม่สำเร็จ",
            detail: "บันทึกไม่สำเร็จ",
            life: 3000,
        });
    }
    
}

function goTo(path, param) {
    if (param != "") {
        router.push({ name: path, params: { id: param } });
    } else {
        router.push({ name: path });
    }
}


function addColumnShelf(index) {
    form_model.value.locations.splice(index + 1, 0, {
        datakey: "code" + (index + 1),
        code: "",
        name1: "",
        name2: "",
        name3: "",
        name4: "",
        name5: ""
    });

    form_valid.value.locations.splice(index + 1, 0, {
        code: true,
        name1: true,
    });
}

function deleteDetailShelf(index) {
    form_model.value.locations.splice(index, 1);

    if (form_model.value.locations.length == 0) {
        form_model.value.locations.push({
            code: "",
            name1: "",
            name2: "",
            name3: "",
            name4: "",
            name5: ""
        });
    }

    toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Detail Deleted",
        life: 3000,
    });

}
</script>
        
<template>
    <AppLayout>
        <MainContentWarp>
            <div class="p-4 surface-section flex-auto shadow-2 border-round">
                <Form :form_model="form_model" :form_valid="form_valid" v-on:save="onSave"
                    v-on:addColumnShelf="addColumnShelf" v-on:deleteDetailShelf="deleteDetailShelf"
                    v-on:back="goTo('warehouse_list', '')" />
            </div>
        </MainContentWarp>
    </AppLayout>

</template>
        