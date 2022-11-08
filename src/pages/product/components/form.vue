<script setup>
import MasterdataService from "@/services/MasterdataService";
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import Utils from "@/utils/";
import TagInput from "@/components/widget/TagInput.vue";

const toast = useToast();
const image_file = ref();
const isUnitCost = ref(0);
const isUnitStandard = ref(0);
const displayModal = ref(false);
const visible_upload = ref(false);
const modelImage = ref(false);
const typingTimer = ref(null);

const barcodeImageListIndex = ref(null);
const unitCodeBarcode = ref("");
const optionList = ref([{
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
    choices: [],
    disable: false
}
]);

const props = defineProps({
    form_model: Object,
    form_valid: Object,
    unituses: Object,
    categoryChoice: Object,
});

const emit = defineEmits(["save", "back", "addColumn", "addColumnBarcode", "deleteDetail", "deleteDetailBarcode", "selectUnit", "selectIsUnitCost", "selectIsUnitStandard", "selectUnitBarcode", "delImages"]);

onMounted(() => {
    setTimeout(() => {
        console.log(props.form_model);
        checkEnable();
        checkEnableimage();
    }, 500);

    getOptionist();



});


function getOptionist() {
    MasterdataService.getOption()
        .then((res) => {
            // console.log(res);
            if (res.success) {
                optionList.value = res.data;
                optionList.value.forEach(element => {
                    element.disable = false
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function genUnit() {
    var setDataUnit = {
        unitcode: props.form_model.unitcode,
        unitname1: "",
        itemunitstd: 1,
        itemunitdiv: 1,
        isunitstandard: true,
        image: "",
        isprimary: true
    }

    var ele = props.unituses.filter((val) => val.unitcode == props.form_model.unitcode);
    if (ele.length > 0) {
        setDataUnit.unitname1 = ele[0].unitname1;
    }

    if (props.form_model.unitcode != "") {

        var filter = props.form_model.unituses.filter((val) => val.isprimary == true);
        if (filter.length > 0) {

            props.form_model.unituses.forEach((ele, index) => {
                if (ele.isprimary == true) {
                    props.form_model.unituses[index] = setDataUnit;
                    genBarcode();
                }
            });

        } else {
            props.form_model.unituses.forEach((ele, index) => {
                if (ele.unitcode == "") {
                    props.form_model.unituses.splice(index, 1);

                }
            });

            props.form_model.unituses.push(setDataUnit)
            genBarcode();
        }
    }
}

function keyup() {
    clearTimeout(typingTimer.value);
    typingTimer.value = setTimeout(genBarcode, 100);
}
function keydown() {
    clearTimeout(typingTimer.value);
}

function genBarcode() {

    var setBarcode = {
        barcode: props.form_model.barcode,
        unitcode: props.form_model.unitcode,
        unitname1: "",
        price: props.form_model.price,
        image: "",
        isprimary: true
    }


    var ele = props.unituses.filter((val) => val.unitcode == props.form_model.unitcode);
    if (ele.length > 0) {
        setBarcode.unitname1 = ele[0].unitname1;
    }

    if (props.form_model.barcode != "") {

        var filter = props.form_model.barcodes.filter((val) => val.isprimary == true);
        if (filter.length > 0) {

            props.form_model.barcodes.forEach((ele, index) => {
                if (ele.isprimary == true) {
                    props.form_model.barcodes[index] = setBarcode;
                }
            });

        } else {

            props.form_model.barcodes.forEach((ele, index) => {
                if (ele.barcode == "") {
                    props.form_model.barcodes.splice(index, 1);
                }
            });
            props.form_model.barcodes.push(setBarcode)

        }

    }

}

function onSave() {
    if (validate()) {
        //console.log(props.form_model);
        emit("save");
    }
}

function onBack() {
    emit("back");
}

function uploadPic() {

    MasterdataService.upLoadImages(image_file.value.files[0])
        .then((res) => {
            //console.log(res);
            if (res.success) {
                props.form_model.images.push({
                    uri: res.data.uri
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });

}

function openModal() {
    displayModal.value = true;
}

function chooseOption(index) {
    setTimeout(() => {
        checkEnable();
    }, 100);
    props.form_model.options.push(optionList.value[index]);
    displayModal.value = false;
}

function delOption(key) {
    props.form_model.options.splice(key.index, 1);

    setTimeout(() => {
        checkEnable();
    }, 200);
}


function checkEnable() {
    optionList.value.forEach(ele => {
        var filtered = props.form_model.options.filter(a => a.code == ele.code);
        if (filtered.length > 0) {
            return ele.disable = true
        } else {
            return ele.disable = false
        }
    });
}

function addImagesBarcode(uri) {
    props.form_model.barcodes[barcodeImageListIndex.value].image = uri;

    props.form_model.images.forEach((element, index) => {
        if (element.uri == uri) {
            props.form_model.images[index].unitcode = unitCodeBarcode.value;
        }
    });

    console.log(props.form_model.images);

    checkEnableimage();
    modelImage.value = false;
}

function checkEnableimage() {
    if (props.form_model.images.length > 0) {
        props.form_model.images.forEach(ele => {
            var filtered = props.form_model.barcodes.filter(a => a.image == ele.uri);
            if (filtered.length > 0) {
                return ele.disable = true
            } else {
                return ele.disable = false
            }
        });
    }
}


function validate() {
    let checkValid = 0;
    let err_msg = "";

    if (props.form_model.itemcode == "") {
        props.form_valid.itemcode = false;
        err_msg += "รหัสสินค้า ";
        checkValid += 1;
    } else {
        props.form_valid.itemcode = true;
    }

    if (props.form_model.name1 == "") {
        props.form_valid.name1 = false;
        err_msg += "ชื่อสินค้า ";
        checkValid += 1;
    } else {
        props.form_valid.name1 = true;
    }

    props.form_model.unituses.forEach((ele, index) => {
        if (ele.unitcode == "") {
            err_msg += "หน่วยนับ ";
            checkValid += 1;
        }
    });


    props.form_model.barcodes.forEach((ele, index) => {
        if (ele.barcode == "") {
            err_msg += "บาร์โค้ด ";
            checkValid += 1;
        }
    });


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

function addColumn(index) {
    emit("addColumn", index);
}

function addColumnBarcode(index) {
    emit("addColumnBarcode", index);
}

function deleteDetail(data, index) {
    emit("deleteDetail", data, index);
}

function deleteDetailBarcode(data, index) {
    setTimeout(() => {
        checkEnableimage();
    }, 200);
    emit("deleteDetailBarcode", index);
}

function selectUnit(data, index) {
    emit("selectUnit", data, index);
}

function selectIsUnitCost(index) {
    emit("selectIsUnitCost", index);
}
function selectIsUnitStandard(index) {
    emit("selectIsUnitStandard", index);
}

function selectUnitBarcode(data, index) {
    emit("selectUnitBarcode", data, index);
}

function delImages(uri, index) {
    emit("delImages", uri, index);
}

function uploadThis(data, index) {

    barcodeImageListIndex.value = index;
    unitCodeBarcode.value = data.unitcode;

    modelImage.value = true;

}

function replaceUnitCode(uri) {
    var result = [];
    result = props.form_model.barcodes.filter((val) => val.image == uri);
    return result.length > 0 ? result[0].unitcode : "ไม่พบข้อมูลหน่วยนับ";
}

function dataTags(dataTag) {
    props.form_model.tags = dataTag;
}

function newResult(data, index) {
    if (data.isunitstandard == true) {
        return isUnitStandard.value = index;
    }

}


</script>

<template>
    <div class="grid">
        <div class="col-12 sm:col-12 md:col-12">
            <div class="grid formgrid p-fluid">
                <div class="field mb-12 col-12 md:col-12 ">
                    <div class="flex flex-wrap ">
                        <div class="flex justify-content-between mt-1">
                            <FileUpload mode="basic" name="Image[]" :customUpload="true" @uploader="uploadPic"
                                :auto="true" ref="image_file" chooseLabel="Upload Picture" chooseIcon="pi pi-upload"
                                accept="image/*" />
                        </div>
                    </div>
                    <div class="grid">
                        <div class="col-12 md:col-6 xl:col-3" v-for="(images, index) in props.form_model.images"
                            :key="images.uri">
                            <div style="position:relative;">
                                <Button icon="pi pi-times" class="p-button-rounded p-button-danger delete-image"
                                    @click="delImages(images.uri, index)" />
                                <div class="p-3 mt-4  card-container blue-container">
                                    <div class="shadow-2 p-3 surface-card border-round cardimage">
                                        <div class=" relative mb-0">
                                            <img :src="images.uri" class="mb-0 w-full h-9rem"
                                                style="object-fit: cover; height: 12rem" />
                                        </div>
                                        <div class="flex justify-content-center  mb-0">
                                            <span class="text-900 font-medium titletext">
                                                {{ replaceUnitCode(images.uri)}}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="surface-border border-top-1 opacity-50 mb-3 col-12"></div>
                <div class="field mb-4 col-12 md:col-4">
                    <label for="itemcode" class="font-medium text-900"><span
                            class="text-orange-500">*</span>รหัสสินค้า</label>
                    <InputText id="itemcode" type="text" v-model="props.form_model.itemcode"
                        @keyup.enter="$event.target.parentElement.nextSibling.children[1].focus()"
                        :class="!props.form_valid.itemcode ? 'p-invalid' : ''"
                        :style="[props.form_model.itemcode == '' ? 'background-color: #FFF6FF;' : '']" autofocus />
                </div>
                <div class="field mb-4 col-12 md:col-6">
                    <label for="name1" class="font-medium text-900"><span
                            class="text-orange-500">*</span>ชื่อสินค้า</label>
                    <InputText id="name1" type="text" v-model="props.form_model.name1"
                        :class="!props.form_valid.name1 ? 'p-invalid' : ''"
                        :style="[props.form_model.name1 == '' ? 'background-color: #FFF6FF;' : '']" />
                </div>
                <div class="field mb-12 col-12 md:col-2">
                    <label for="name1" class="font-medium text-900">สต็อกสินค้า</label>
                    <div class="field-checkbox pt-2">
                        <Checkbox inputId="binary" v-model="props.form_model.isstockproduct" :binary="true" />
                        <label for="binary">สินค้าทำ สต็อก</label>
                    </div>
                </div>
                <div class="field mb-4 col-12 md:col-6">
                    <label for="barcode" class="font-medium text-900">บาร์โค้ด</label>
                    <InputText id="barcode" type="text" v-model="props.form_model.barcode" @keyup="keyup()"
                        @keydown="keydown()" />
                </div>
                <div class="field mb-4 col-12 md:col-6">
                    <label for="unitcode" class="font-medium text-900">หน่วยนับ</label>
                    <Dropdown id="unitcode" :options="props.unituses" optionLabel="unitname1" optionValue="unitcode"
                        v-model="props.form_model.unitcode" :filter="true" filterBy="order" @change="genUnit()"
                        placeholder="เลือกหน่วยนับสินค้า">
                        <template #option="slotProps">
                            <span>{{ slotProps.option.unitcode }} ~
                                {{ slotProps.option.unitname1 }}</span>
                        </template>
                    </Dropdown>
                </div>
                <div class="field mb-4 col-12 md:col-6">
                    <label for="price" class="font-medium text-900">ราคา</label>
                    <InputText id="price" type="number" v-model="props.form_model.price" @keyup="keyup()"
                        @keydown="keydown()" />
                </div>
                <div class="field mb-4 col-12 md:col-6">
                    <label for="category" class="font-medium text-900">หมวดสินค้า</label>
                    <Dropdown id="category" :options="props.categoryChoice" optionLabel="name1" optionValue="guidfixed"
                        v-model="props.form_model.categoryguid" :filter="true" filterBy="order"
                        placeholder="เลือกกลุ่มสินค้า">
                        <template #option="slotProps">
                            <div class="flex align-items-center">
                                <img :src="slotProps.option.image" :class="'mr-2'" style="width: 25px" />
                                <div>{{ slotProps.option.name1 }}</div>
                            </div>
                        </template>
                    </Dropdown>
                </div>
                <div class="surface-border border-top-1 opacity-50 mb-4 col-12"></div>
                <div class="field mb-12 col-12 md:col-12">
                    <DataTable showGridlines :value="props.form_model.unituses" responsiveLayout="scroll">
                        <Column header="เพิ่ม" bodyStyle="text-align:center" style="width: 10%">
                            <template #body="slotProps">
                                <Button icon="pi pi-plus" class="p-button-rounded p-button-success p-button-text"
                                    @click="addColumn(slotProps.index)" />
                            </template>
                        </Column>
                        <Column field="unitcode" header="รหัสหน่วยนับ" style="width: 20%">
                            <template #body="{ data, field, index }">
                                <Dropdown :disable="data.isprimary" v-model="data[field]" :options="props.unituses"
                                    :filter="true" :filterFields="['unitcode', 'unitname1']" filterPlaceholder="ค้นหา"
                                    @change="selectUnit(data[field], index)" optionLabel="unitname1"
                                    optionValue="unitcode" placeholder="เลือก" :disabled="data.isprimary">
                                    <template #option="slotProps">
                                        <span>{{ slotProps.option.unitcode }} ~
                                            {{ slotProps.option.unitname1 }}</span>
                                    </template>
                                </Dropdown>
                            </template>
                        </Column>
                        <Column field="unitname1" header="ชื่อหน่วยนับ" style="width: 15%">
                            <template #body="{ data, field }">
                                <div :class="(data.isprimary) ? 'text-500' : ''">{{ data[field] }}</div>
                            </template>
                        </Column>
                        <Column field="itemunitstd" header="ตัวตั้ง" style="text-align: right !important"
                            headerStyle="text-align:center;width: 15%">

                            <template #body="{ data, field }">
                                <InputNumber v-model="data[field]" mode="decimal" :maxFractionDigits="2"
                                    style="text-align: right" :disabled="data.isprimary" />
                            </template>
                        </Column>
                        <Column field="itemunitdiv" header="ตัวหาร" style="text-align: right !important"
                            headerStyle="text-align:center;width: 15%">
                            <template #body="{ data, field }">
                                <InputNumber v-model="data[field]" mode="decimal" :maxFractionDigits="2"
                                    style="text-align: right" :disabled="data.isprimary" />
                            </template>
                        </Column>
                        <Column field="isUnitStandard" header="หน่วยคงเหลือ" style="width: 15%;text-align: center">
                            <template #body="{ data, index }">
                                <div style="display: none;">{{ newResult(data,index) }}</div>
                                <RadioButton id="isUnitStandard" name="isUnitStandard" :value="index"
                                    v-model="isUnitStandard" @change="selectIsUnitStandard(index)" />
                            </template>
                        </Column>
                        <Column header="ลบ" bodyStyle="text-align:center" style="width: 10%">
                            <template #body="slotProps">
                                <Tag class="mr-2" icon="pi pi-exclamation-triangle" severity="warning" value="Gen"
                                    v-if="slotProps.data.isprimary" style="color: #fff"></Tag>
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text"
                                    @click="deleteDetail(slotProps.data, slotProps.index)"
                                    v-if="!slotProps.data.isprimary" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
                <div class="field mb-12 col-12 md:col-12">
                    <DataTable showGridlines :value="props.form_model.barcodes" responsiveLayout="scroll">
                        <Column header="เพิ่ม" bodyStyle="text-align:center" style="width: 10%">
                            <template #body="slotProps">
                                <Button icon="pi pi-plus" class="p-button-rounded p-button-success p-button-text"
                                    @click="addColumnBarcode(slotProps.index)" />
                            </template>
                        </Column>
                        <Column field="barcode" header="บาร์โค้ด" style="text-align: left !important"
                            headerStyle="text-align:center;width: 20%">
                            <template #body="{ data, field }">
                                <InputText type="number" v-model="data[field]" style="text-align: left"
                                    :disabled="data.isprimary" />
                            </template>
                        </Column>
                        <Column field="unitcode" header="หน่วยนับ" style="width: 15%">
                            <template #body="{ data, field, index }">
                                <Dropdown v-model="data[field]" :options="props.form_model.unituses"
                                    @change="selectUnitBarcode(data[field], index)" optionLabel="unitname1"
                                    optionValue="unitcode" placeholder="เลือก" :disabled="data.isprimary">
                                    <template #option="slotProps">
                                        <span>{{ slotProps.option.unitcode }} ~
                                            {{ slotProps.option.unitname1 }}</span>
                                    </template>
                                </Dropdown>
                            </template>
                        </Column>

                        <Column field="price" header="ราคาขาย" headerStyle="text-align:center;width: 17.5%">

                            <template #body="{ data, field }">
                                <InputText type="number" v-model="data[field]" style="text-align: left"
                                    :disabled="data.isprimary" />
                            </template>
                        </Column>
                        <Column header="รูปภาพ" style="width: 27.5%" class="text-header-right"
                            headerStyle="text-align: right;" bodyStyle="text-align:center;">
                            <template #body="slotProps">
                                <div class="cursor-pointer">
                                    <img v-if="slotProps.data.image != ''" :src="slotProps.data.image" :class="'mr-2'"
                                        style="width: 80px" @click="uploadThis(slotProps.data, slotProps.index)" />
                                </div>
                                <Button v-if="slotProps.data.image == ''"
                                    @click="uploadThis(slotProps.data, slotProps.index)" type="button"
                                    icon="pi pi-image" class="p-button-text p-button-info p-button-sm"></Button>
                            </template>
                        </Column>
                        <Column header="ลบ" bodyStyle="text-align:center" style="width: 10%">
                            <template #body="slotProps">
                                <Tag class="mr-2" icon="pi pi-exclamation-triangle" severity="warning" value="Gen"
                                    v-if="slotProps.data.isprimary" style="color: #fff"></Tag>
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text"
                                    @click="deleteDetailBarcode(slotProps.data, slotProps.index)"
                                    v-if="!slotProps.data.isprimary" />
                            </template>
                        </Column>

                    </DataTable>
                </div>
                <div class="surface-border border-top-1 opacity-50 mb-3 col-12"></div>
                <div class="field mb-12 col-12 md:col-12 ">
                    <label for="tags" class="font-medium text-900">รายละเอียด</label>
                    <Editor v-model="props.form_model.description1" editorStyle="height:200px" />
                </div>
                <div class="surface-border border-top-1 opacity-50 mb-3 col-12"></div>
                <div class="field mb-12 col-12 md:col-12 ">
                    <label for="tags" class="font-medium text-900">Tag </label>
                    <TagInput v-model="props.form_model.tags" :options="['สินค้าขายดี', 'แนะนำ', 'ลดราคา']" :showCount="true"
                        v-on:dataTags="dataTags" />
                </div>
                <!--More-->

                <div class="surface-border border-top-1 opacity-50 mb-3 col-12"></div>
                <div class="field mb-12 col-12 md:col-12">

                    <Panel header="ตัวเลือกเพิ่มเติม" :toggleable="true" :collapsed="false">
                        <!--
                        <div class="grid formgrid p-fluid">
                            <div class="field mb-4 col-12 md:col-6">
                                <label for="name2" class="font-medium text-900">ชื่อ2</label>
                                <InputText id="name2" type="text" v-model="props.form_model.name2" />
                            </div>
                            <div class="field mb-4 col-12 md:col-6">
                                <label for="name3" class="font-medium text-900">ชื่อ3</label>
                                <InputText id="name3" type="text" v-model="props.form_model.name3" />
                            </div>
                            <div class="field mb-4 col-12 md:col-6">
                                <label for="name4" class="font-medium text-900">ชื่อ4</label>
                                <InputText id="name4" type="text" v-model="props.form_model.name4" />
                            </div>
                            <div class="field mb-4 col-12 md:col-6">
                                <label for="name5" class="font-medium text-900">ชื่อ5</label>
                                <InputText id="name5" type="text" v-model="props.form_model.name5" />
                            </div>
                        </div>
                        <div class="surface-border border-top-1 opacity-50 mb-4 col-12"></div>
                        <div class="grid formgrid p-fluid">
                            <div class="field mb-4 col-12 md:col-6">
                                <label for="description2" class="font-medium text-900">รายละเอียด2</label>
                                <InputText id="description2" type="text" v-model="props.form_model.description2" />
                            </div>
                            <div class="field mb-4 col-12 md:col-6">
                                <label for="description3" class="font-medium text-900">รายละเอียด3</label>
                                <InputText id="description3" type="text" v-model="props.form_model.description3" />
                            </div>
                            <div class="field mb-4 col-12 md:col-6">
                                <label for="description4" class="font-medium text-900">รายละเอียด4</label>
                                <InputText id="description4" type="text" v-model="props.form_model.description4" />
                            </div>
                            <div class="field mb-4 col-12 md:col-6">
                                <label for="description5" class="font-medium text-900">รายละเอียด5</label>
                                <InputText id="description5" type="text" v-model="props.form_model.description5" />
                            </div>

                        </div>
                        -->
                        <div class="surface-border border-top-1 opacity-50 mb-3 col-12"></div>
                        <div class="field mb-12 col-12 md:col-12">
                            <OrderList v-model="props.form_model.options" listStyle="height:auto">
                                <template #header>
                                    <div class=" flex align-items-center justify-content-center">
                                        <Button icon="pi pi-plus" class="p-button-primary " @click="openModal()"
                                            label="เพิ่มตัวเลือกเสริม" />
                                    </div>
                                </template>
                                <template #item="slotProps">
                                    <div class="choices-item">
                                        <div class="choices-list-detail">
                                            <h3 class="mb-2">รหัสตัวเลือก : {{ slotProps.item.code }}</h3>
                                            <span class="choices-category">ชื่อตัวเลือก : {{ slotProps.item.name1
                                            }}</span>
                                        </div>
                                        <div class="choices-list-action">
                                            <Button icon="pi pi-trash" class="p-button-danger"
                                                @click="delOption(slotProps)" />
                                        </div>
                                    </div>
                                </template>
                            </OrderList>
                        </div>
                    </Panel>
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

    <Dialog header="เลือกตัวเลือก" v-model:visible="displayModal" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
        :style="{ width: '80vw' }" :modal="true">

        <div class="surface-ground">
            <div class="grid">
                <div class="col-12 md:col-6 xl:col-4 p-3" v-for="(option, index) in optionList" :key="option.guidfixed">
                    <div class="surface-card shadow-2 border-rounded p-4">
                        <div class="flex border-bottom-1 surface-border pb-4">
                            <div class="flex flex-column align-items-start">
                                <span class="text-lg text-900 font-medium mb-1">รหัสตัวเลือก : {{ option.code
                                }}</span>
                                <span class="text-600 font-medium mb-2">ชื่อตัวเลือก : {{ option.name1 }}</span>
                            </div>
                        </div>
                        <div class="flex  pt-4 ">
                            <Button label="เลือก" icon="pi pi-plus"
                                class="p-button-outlined p-button-secondary w-6 mr-2" @click="chooseOption(index)"
                                :disabled="option.disable"></Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </Dialog>
    <Dialog header="เลือกรูปภาพ" v-model:visible="modelImage" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
        :style="{ width: '80vw' }" :modal="true">
        <div class="grid">
            <div class="col-12 pt-3">
                <FileUpload mode="basic" name="Image[]" :customUpload="true" @uploader="uploadPic" :auto="true"
                    ref="image_file" chooseLabel="เลือกรูปภาพ" chooseIcon="pi pi-upload" accept="image/*" />
            </div>
            <div class="col-12 md:col-6 xl:col-3 pt-0" v-for="image in props.form_model.images" :key="image.uri">
                <div class="p-4 mt-3 cursor-pointer card-container blue-container"
                    :class="(image.disable) ? 'bg-blue-100' : 'bg-blue-while hover:bg-gray-200'"
                    @click="addImagesBarcode(image.uri)">
                    <div class="shadow-2 p-3 surface-card border-round cardimage">
                        <div class="mb-2">
                            <img :src="image.uri" class="mb-0 w-full h-9rem" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>

</template>

<style lang="scss" scoped>
.p-column-header-content {
    flex-direction: column;
}

.delete-image {
    right: 0px;
    position: absolute;
}

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
