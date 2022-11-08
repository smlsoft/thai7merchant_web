<script setup>
import { useAuthen } from "@/stores/authen.js"
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useAuthen()

onMounted(() => {
  store.logout()
})

</script>
<template>
  <div class="w-full">
    <div class="surface-card border-round shadow-2 p-4 text-center">
      <img
        src="@/assets/subscribe.svg"
        alt="Image"
        class="mx-auto block mb-4"
      />
      <div class="text-900 font-medium mb-3 text-xl">Thankyou!</div>
      <p class="mt-0 mb-4 p-0 line-height-3">
        Nunc mi ipsum faucibus vitae aliquet nec. Lacus sed viverra tellus in
        hac habitasse platea dictumst.
      </p>
      <Button
        label="Sign In"
        icon="pi pi-arrow-right"
        class="p-button-rounded"
        iconPos="right"
        @click="router.push('/login')"
      ></Button>
    </div>
  </div>
</template>
