<template>
  <div class="navbar-home-wrapper">
    <router-link to="/employer/dashboard" class="brand-title text-decoration-none">
      IT job placement <span class="text-highlight">@Mor-Nor</span>
    </router-link>
    <div class="nav-top-right">
      

      <router-link to="/employer/dashboard" class="top-link" exact-active-class="active-link">จัดการงาน</router-link>
      <router-link to="/employer/applicants" class="top-link" exact-active-class="active-link">ผู้สมัครงาน</router-link>
      <router-link to="/employer/search-applicants" class="top-link" exact-active-class="active-link">
  ค้นหาผู้หางาน
</router-link>
      <!-- เพิ่มปุ่มลงประกาศงาน -->
      <router-link to="/employer/post-job" class="top-link btn-add-job">ลงประกาศงาน</router-link>

      <div class="dropdown" @click="toggleDropdown">
        <button class="btn btn-user dropdown-toggle" type="button">
          👤 {{ user?.e_company_name || user?.e_contact || 'ผู้ว่าจ้าง' }}

        </button>
        <ul class="dropdown-menu" :class="{ show: showDropdown }">
  <li>
    <div class="dropdown-item text-nowrap text-truncate text-muted" title="อีเมลของคุณ">
      <i class="bi bi-envelope me-2"></i>
      <span class="email-text">{{ user?.e_email || 'ไม่มีอีเมล' }}</span>
    </div>
  </li>
  <li><hr class="dropdown-divider" /></li>
  <li>
    <button class="dropdown-item text-danger" @click="logout">
      <i class="bi bi-box-arrow-right me-2"></i> ออกจากระบบ
    </button>
  </li>
</ul>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavbarEmployer",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      showDropdown: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_role");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.email-text {
  font-size: 13.5px;
  font-weight: 400;
  color: #666;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-item.text-danger {
  font-weight: 500;
}

.dropdown-item.text-danger:hover {
  background-color: #fff5f5;
  color: #d9534f;
}

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

.btn-user {
  background: none;
  border: none;
  font-weight: 500;
  color: #333;
  font-size: 15px;
  cursor: pointer;
}

.btn-user:hover,
.btn-user:focus {
  color: #ff6600;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  padding: 0.5rem 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  min-width: 200px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  display: none;
  z-index: 1000;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  background: none;
  border: none;
  text-align: left;
  width: 100%;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f8f8;
  color: #ff6600;
}

.dropdown-divider {
  margin: 4px 0;
  border-top: 1px solid #ddd;
}

/* ปรับแต่งปุ่ม "ลงประกาศงาน" */
.btn-add-job {
  background-color: #ff6600;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 500;
  transition: 0.2s;
}

.btn-add-job:hover {
  background-color: #e65c00;
}
</style>
