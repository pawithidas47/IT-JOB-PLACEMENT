<template>
  <div class="navbar-home-wrapper">
    <router-link to="/" class="brand-title text-decoration-none">
      IT job placement <span class="text-highlight">@Mor-Nor</span>
    </router-link>
    <div class="nav-top-right">
      <router-link to="/" class="top-link" exact-active-class="active-link">หางาน</router-link>
      <router-link to="/register/applicant" class="top-link" exact-active-class="active-link">สมัครสมาชิก</router-link>
      <router-link to="/login" class="top-link" exact-active-class="active-link">เข้าสู่ระบบ</router-link>
      <router-link to="/register/employer" class="top-link" exact-active-class="active-link">สำหรับผู้ว่าจ้าง</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavbarHome",
};
</script>

<style scoped>
.navbar-home-wrapper {
  padding: 16px 64px;
  border-bottom: 4px solid #ff6600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.brand-title {
  font-size: 22px;
  font-weight: bold;
  color: #ff6600;
}

.text-highlight {
  color: #e65c00;
}

.nav-top-right {
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
}

.top-link {
  font-size: 15px;
  color: #333;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.top-link:hover {
  color: #ff6600;
}

.active-link {
  border-bottom: 3px solid #ff6600;
  padding-bottom: 4px;
  color: #ff6600;
}
</style>
