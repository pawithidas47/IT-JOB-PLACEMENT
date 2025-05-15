<template>
  <div class="container mt-5">
    <h2>📋 หน้าหลักผู้สมัครงาน</h2>
    <p>ยินดีต้อนรับ, {{ user.username }}</p>
  </div>
</template>

<script>
export default {
  name: "ApplicantDashboard",
  data() {
    return {
      user: {},
    };
  },
  mounted() {
    const userData = localStorage.getItem("user");
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.$router.push("/login");
    }
  },
};
</script>
