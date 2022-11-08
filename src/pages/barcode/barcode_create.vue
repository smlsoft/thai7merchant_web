<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import Form from "./components/form.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApp } from "@/stores/app.js";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const storeApp = useApp();
const router = useRouter();
const form_model = ref({
    txtsearch: "",
    guidfixed: "",
    barcode: "",
    itemcode: "",
    name1: "",
    unitcode: "",
    price: "",
    isstockproduct: false,
    unituses: [
        {
            unitcode: "",
            unitname1: "",
            itemunitstd: null,
            itemunitdiv: null,
            isunitstandard: true,
            image: "",
            isprimary: true
        }
    ],
    barcodes: [{
        barcode: "",
        unitcode: "",
        unitname1: "",
        price: null,
        image: "",
        isprimary: true
    }],
});

const form_valid = ref({
    barcode: true,
    name1: true,
    unitcode: true,
    price: true,
});

const unituses = ref([]);
const modeButton = ref("save");
const disableInput = ref(true);
const disableBarcode = ref(false);


onMounted(() => {
    getUnitList();
    storeApp.setPageTitle("จัดการบาร์โค้ดสินค้า");
    storeApp.setActivePage("master");
    storeApp.setActiveChild("barcode_create");

});

function getUnitList() {
    MasterdataService.getUnitList()
        .then((res) => {
            //console.log(res);
            if (res.success) {
                unituses.value = res.data;
            }
        })
        .catch((err) => {
            console.log(err);
        });

}

function onSave() {
    form_model.value.itemcode = form_model.value.barcode;
    form_model.value.price = parseFloat(form_model.value.price);
    form_model.value.barcodes.forEach((barcodes) => {
        barcodes.price = parseFloat(barcodes.price);
    });

    console.log(form_model.value);

    var partApi = "";

    if (form_model.value.guidfixed == '') {
        partApi = MasterdataService.createInventory(form_model.value)
    } else {
        partApi = MasterdataService.updateInventory(form_model.value, form_model.value.guidfixed)
    }

    partApi
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
                    resetFormDataAll();
                }, 1000);
            } else if (res.false) {
                console.log("is exists");
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


function resetFormDataAll() {
    form_model.value = {
        txtsearch: "",
        guidfixed: "",
        barcode: "",
        name1: "",
        unitcode: "",
        price: "",
        isstockproduct: false,
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
    };

    form_valid.value = {
        barcode: true,
        name1: true,
        unitcode: true,
        price: true,
    }

    modeButton.value = "save";
    disableInput.value = true;
    disableBarcode.value = false;

    setTimeout(() => {
        document.getElementById("txtsearch").focus();
    }, 300);
}

function resetFormData() {
    form_model.value = {
        txtsearch: form_model.value.txtsearch,
        guidfixed: "",
        barcode: "",
        name1: "",
        unitcode: "",
        price: "",
        isstockproduct: false,
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
    };

    form_valid.value = {
        barcode: true,
        name1: true,
        unitcode: true,
        price: true,
    }

    modeButton.value = "save";
    disableInput.value = true;
    disableBarcode.value = false;
}


function selectUnit(data, index) {
    var ele = unituses.value.filter((val) => val.unitcode == data);
    form_model.value.unituses[index].unitname1 = ele[0].unitname1;
}

function getBarcode(data) {
    resetFormData();
    //console.log(data);
    if (data != "") {
        MasterdataService.getInventoryDetailByBarcode(data)
            .then((res) => {
                console.log(res);
                if (res.success) {
                    if (res.data.guidfixed != '') {
                        form_model.value = res.data;
                        form_model.value.txtsearch = data;
                        modeButton.value = "update";


                    } else {
                        form_model.value.barcode = data;
                        disableInput.value = false;
                        genBarcode();
                        setTimeout(() => {
                            document.getElementById("name1").focus();
                        }, 300);
                    }

                }
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        resetFormDataAll();
    }
};

function saveConfirmEdit() {
    disableInput.value = false;
    disableBarcode.value = true;
    modeButton.value = "save";
}

function genBarcode() {

    var setBarcode = {
        barcode: form_model.value.barcode,
        unitcode: form_model.value.unitcode,
        unitname1: "",
        price: form_model.value.price,
        image: "",
        isprimary: true
    }

    var ele = form_model.value.unituses.filter((val) => val.unitcode == form_model.value.unitcode);
    if (ele.length > 0) {
        setBarcode.unitname1 = ele[0].unitname1;
    }

    if (form_model.value.barcode != "") {

        var filter = form_model.value.barcodes.filter((val) => val.isprimary == true);
        if (filter.length > 0) {

            form_model.value.barcodes.forEach((ele, index) => {
                if (ele.isprimary == true) {
                    form_model.value.barcodes[index] = setBarcode;
                }
            });

        } else {

            form_model.value.barcodes.forEach((ele, index) => {
                if (ele.barcode == "") {
                    form_model.value.barcodes.splice(index, 1);
                }
            });
            form_model.value.barcodes.push(setBarcode)

        }

    }

}

function genUnit() {
    var setDataUnit = {
        unitcode: form_model.value.unitcode,
        unitname1: "",
        itemunitstd: 1,
        itemunitdiv: 1,
        isunitstandard: true,
        image: "",
        isprimary: true
    }

    var ele = unituses.value.filter((val) => val.unitcode == form_model.value.unitcode);
    if (ele.length > 0) {
        setDataUnit.unitname1 = ele[0].unitname1;
    }

    if (form_model.value.unitcode != "") {

        var filter = form_model.value.unituses.filter((val) => val.isprimary == true);
        if (filter.length > 0) {

            form_model.value.unituses.forEach((ele, index) => {
                if (ele.isprimary == true) {
                    form_model.value.unituses[index] = setDataUnit;
                    genBarcode();
                }
            });

        } else {
            form_model.value.unituses.forEach((ele, index) => {
                if (ele.unitcode == "") {
                    form_model.value.unituses.splice(index, 1);

                }
            });

            form_model.value.unituses.push(setDataUnit)
            genBarcode();
        }
    }
}

</script>


    
<template>
    <AppLayout>
        <MainContentWarp>
            <div class="p-4 surface-section flex-auto shadow-2 border-round">
                <Form :form_model="form_model" :form_valid="form_valid" :unituses="unituses" :modeButton="modeButton"
                    :disableInput="disableInput" :disableBarcode="disableBarcode" v-on:save="onSave"
                    v-on:selectUnit="selectUnit" v-on:resetFormData="resetFormDataAll" v-on:getBarcode="getBarcode"
                    v-on:genBarcode="genBarcode" v-on:saveConfirmEdit="saveConfirmEdit" v-on:genUnit="genUnit" />
            </div>
        </MainContentWarp>
    </AppLayout>
</template>
    