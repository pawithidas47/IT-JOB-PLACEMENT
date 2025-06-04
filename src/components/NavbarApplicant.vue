<template>
  <div class="navbar-home-wrapper">
    <router-link to="/" class="brand-title text-decoration-none">
      IT job placement @Mor-Nor
    </router-link>
    <div class="nav-top-right">
      <router-link to="/applicant/jobs" class="top-link" exact-active-class="active-link">หางาน</router-link>
      <router-link to="/applicant/jobapplications" class="top-link" exact-active-class="active-link">ตรวจสอบงาน</router-link>
      <router-link to="/applicant/userprofile" class="top-link" exact-active-class="active-link">จัดการโปรไฟล์</router-link>
      <span class="top-link">{{ user?.a_username || 'hobby' }}</span>
      <button class="top-link btn btn-link p-0 ms-3 text-danger" @click="logout">ออกจากระบบ</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavbarApplicant",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.navbar-home-wrapper {
  padding: 20px 100px;
  border-bottom: 4px solid #ff6600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
}

.brand-title {
  font-size: 24px;
  font-weight: bold;
  color: #ff6600;
}

.nav-top-right {
  display: flex;
  align-items: center;
}

.top-link {
  font-size: 16px;
  margin-left: 36px;
  color: #000;
  font-weight: 500;
  text-decoration: none;
}

.top-link:hover {
  color: #ff6600;
}

.active-link {
  border-bottom: 3px solid #ff6600;
  padding-bottom: 6px;
  color: #ff6600;
}
</style>
