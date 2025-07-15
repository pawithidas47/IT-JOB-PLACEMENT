<template>
  <div class="navbar-home-wrapper">
    <router-link to="/applicant/jobs" class="brand-title text-decoration-none">
      IT job placement <span class="text-highlight">@Mor-Nor</span>
    </router-link>
    <div class="nav-top-right">
      <router-link to="/applicant/jobs" class="top-link" exact-active-class="active-link">หางาน</router-link>
      <router-link to="/applicant/jobapplications" class="top-link" exact-active-class="active-link">ตรวจสอบงาน</router-link>
      <div class="dropdown" @click="toggleDropdown">
        <button class="btn btn-user dropdown-toggle" type="button">
          👤 {{ user?.a_firstname  || 'guest' }}

        </button>
        <ul class="dropdown-menu" :class="{ show: showDropdown }">
          <li>
            <router-link class="dropdown-item" to="/applicant/savedjobs">
              <i class="bi bi-bookmark-fill me-2"></i> งานที่บันทึกไว้
            </router-link>
          </li>
          <li>
            <router-link class="dropdown-item" to="/applicant/userprofile">
              <i class="bi bi-person-circle me-2"></i> จัดการโปรไฟล์
            </router-link>
          </li>
          <li><hr class="dropdown-divider"></li>
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
  name: "NavbarApplicant",
  data() {
    return {
      user: null,
      showDropdown: false
    };
  },
  mounted() {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      console.log("✅ user from storage:", this.user);
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
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
</style>