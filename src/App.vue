<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* ✅ ใช้ฟอนต์ Prompt ทั่วระบบ */
*,
*::before,
*::after {
  font-family: 'Prompt', sans-serif !important;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-size: 16px;
  background-color: #fdfdfd;
  color: #222;
}
</style>
