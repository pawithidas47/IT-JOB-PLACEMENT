<template>
  <div class="navbar-home-wrapper">
    <router-link to="/" class="brand-title text-decoration-none">
      IT job placement @Mor-Nor
    </router-link>
    <div class="nav-top-right">
      <router-link to="/" class="top-link" exact-active-class="active-link">หางาน</router-link>
      <router-link to="/register/applicant" class="top-link" exact-active-class="active-link">สมัครสมาชิก</router-link>
      <router-link to="/login" class="top-link" exact-active-class="active-link">เข้าสู่ระบบ</router-link>
      <router-link to="/register/employer" class="top-link" exact-active-class="active-link">สำหรับผู้ว่าจ้าง</router-link>
    </div>
  </div>
</template>

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

.nav-top-right .top-link {
  font-size: 16px;
  margin-left: 36px;
  color: #000;
  font-weight: 500;
  text-decoration: none;
}

.nav-top-right .top-link:hover {
  color: #ff6600;
}

.active-link {
  border-bottom: 3px solid #ff6600;
  padding-bottom: 6px;
  color: #ff6600;
}
</style>
