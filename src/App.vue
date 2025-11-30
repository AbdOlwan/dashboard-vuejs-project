<template>
  <router-view />
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  direction: rtl;
}

/* main.css أو App.vue - إضافة هذه الأنماط */

/* تحسين مظهر رسائل SweetAlert2 للـ Guest */
.guest-alert-popup {
  font-family: 'Cairo', 'Segoe UI', sans-serif !important;
  border-radius: 16px !important;
  padding: 24px !important;
}

.guest-alert-title {
  font-size: 24px !important;
  font-weight: 700 !important;
  color: #1f2937 !important;
  padding: 8px 0 !important;
}

.guest-alert-content {
  margin-top: 12px !important;
}

/* تحسين شكل الأزرار */
.swal2-confirm {
  font-family: 'Cairo', 'Segoe UI', sans-serif !important;
  font-weight: 600 !important;
  padding: 10px 32px !important;
  border-radius: 8px !important;
  font-size: 15px !important;
}

/* إخفاء أخطاء الكونسول للـ Guest */
.guest-mode .console-error {
  display: none !important;
}
</style>
