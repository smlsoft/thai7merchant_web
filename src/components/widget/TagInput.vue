<template>
    <div class="tag-input" :class="{ 'with-count': showCount }">
        <InputText v-model="newTag" :list="id" autocomplete="on" @keydown.enter="addTag(newTag)"
            @keydown.prevent.tab="addTag(newTag)" @keydown.delete="newTag.length || removeTag(tags.length - 1)"
            :style="{ 'padding-left': `${paddingLeft}px` }" @change="addTag(newTag)" />

        <datalist v-if="options" :id="id">
            <option v-for="option in availableOptions" :key="option" :value="option">
                {{ option }}
            </option>
        </datalist>

        <ul class="tags" ref="tagsUl">
            <li v-for="(tag, index) in tags" :key="tag" class="tag" :class="{ duplicate: tag.name === duplicate }">
                {{ tag.name }}
                <button class="delete" @click="removeTag(index)">x</button>
            </li>
        </ul>

        <div v-if="showCount" class="count">
            <span>{{ props.modelValue.length }}</span> tags
        </div>
    </div>
</template>
<script setup>
import { ref, watch, nextTick, onMounted, computed } from "vue";

// Tags
const tags = ref(props.modelValue);
const newTag = ref("");
const id = Math.random().toString(36).substring(7);

const props = defineProps({
    name: { type: String, default: "" },
    modelValue: { type: Array, default: () => [] },
    options: { type: [Array, Boolean], default: false },
    showCount: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "dataTags"]);

const addTag = (tag) => {
    //console.log(tag);
    if (!tag) return; // prevent empty tag

    if (props.modelValue.filter(e => e.name === tag).length > 0) {
        handleDuplicate(tag);
        return;
    }

    tags.value.push({ name: tag });
    newTag.value = ""; // reset newTag

    emit("dataTags", tags.value);

};
function removeTag(index) {
    tags.value.splice(index, 1);
    emit("dataTags", tags.value);
};


// handling duplicates
const duplicate = ref(null);
const handleDuplicate = (tag) => {
    duplicate.value = tag;
    setTimeout(() => (duplicate.value = null), 1000);
    newTag.value = "";
};


// positioning and handling tag change
const paddingLeft = ref(10);
const tagsUl = ref(null);
function onTagsChange() {

    // position cursor
    const extraCushion = 15;
    paddingLeft.value = tagsUl.value.clientWidth + extraCushion;
    // scroll to end of tags
    tagsUl.value.scrollTo(tagsUl.value.scrollWidth, 0);
    // emit value on tags change

    emit("update:modelValue", props.modelValue);
};

watch(props.modelValue, () => nextTick(onTagsChange), { deep: true });


onMounted(() => {

    setTimeout(() => {
        onTagsChange();

        if (props.modelValue.length > 0) {
            props.modelValue.forEach((ele) => {
                tags.value.push(ele);
            });
        }

    }, 500);

});

// options
const availableOptions = computed(() => {
    if (!props.options) return false;
    return props.options.filter((option) => !props.modelValue.filter(e => e.name === option).length > 0);
});

</script>
<style scoped>
.tag-input {
    position: relative;
}

ul {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 10px;
    max-width: 75%;
    overflow-x: auto;
}

.tag {
    background: rgba(14, 118, 14, 0.606);
    padding: 10px;
    border-radius: 4px;
    color: white;
    white-space: nowrap;
    transition: 0.1s ease background;
}



.delete {
    color: white;
    background: none;
    outline: none;
    border: none;
    cursor: pointer;
}

@keyframes shake {

    10%,
    90% {
        transform: scale(0.9) translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: scale(0.9) translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: scale(0.9) translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: scale(0.9) translate3d(4px, 0, 0);
    }
}

input {
    width: 100%;
    padding: 20px;
}

.tag.duplicate {
    background: red;
    animation: shake 1s;
}

.count {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 10px;
    display: block;
    font-size: 0.8rem;
    white-space: nowrap;
}

.count span {
    background: #eee;
    padding: 2px;
    border-radius: 2px;
}

.with-count input {
    padding-right: 60px;
}

.with-count ul {
    max-width: 60%;
}
</style>