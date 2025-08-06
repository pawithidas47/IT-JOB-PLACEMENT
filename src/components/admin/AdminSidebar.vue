<template>
  <div class="sidebar bg-white shadow-sm p-3" style="width: 220px; height: 100vh;">
    <ul class="list-unstyled mb-0">
      <li v-for="item in menuItems" :key="item.to" class="mb-2">
        <router-link :to="item.to" class="nav-link" exact>
          <i :class="`bi ${item.icon} me-2`"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AdminSidebar",
  data() {
    return {
      menuItems: [
        { to: "/admin/dashboard", icon: "bi-speedometer2", label: "ภาพรวม" },
        { to: "/admin/users", icon: "bi-people-fill", label: "ผู้ใช้ทั้งหมด" },
        { to: "/admin/jobs", icon: "bi-briefcase-fill", label: "งานทั้งหมด" },
        { to: "/admin/uploads", icon: "bi-folder-fill", label: "ไฟล์ที่อัปโหลด" },
        { to: "/admin/complaints", icon: "bi-exclamation-diamond-fill", label: "ข้อร้องเรียน" },
      ],
    };
  },
};
</script>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 10px 14px;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}
.nav-link:hover {
  background-color: #f3f3f3;
}
.router-link-exact-active {
  background-color: #ffe4cc;
  color: #ff6600 !important;
  font-weight: bold;
}
</style>
