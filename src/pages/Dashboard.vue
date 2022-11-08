<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import { onMounted } from "vue";
import { useApp } from "@/stores/app.js";

const storeApp = useApp();

onMounted(() => {
  storeApp.setActivePage("dashboard");
  storeApp.setActiveChild('');
  storeApp.setPageTitle("แดรชบอร์ด");
});
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div>Dashboard</div>
    </MainContentWarp>
  </AppLayout>
</template>
