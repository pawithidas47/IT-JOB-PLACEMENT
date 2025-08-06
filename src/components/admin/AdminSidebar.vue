<template>
  <div class="sidebar bg-white shadow-sm p-3" style="width: 220px; height: 100vh;">
    <ul class="list-unstyled">
      <li class="mb-3">
        <router-link to="/admin/dashboard" class="nav-link" exact>
          <i class="bi bi-speedometer2 me-2"></i> ภาพรวม
        </router-link>
      </li>
      <li class="mb-3">
        <router-link to="/admin/users" class="nav-link" exact>
          <i class="bi bi-people-fill me-2"></i> ผู้ใช้ทั้งหมด
        </router-link>
      </li>
      <li class="mb-3">
        <router-link to="/admin/jobs" class="nav-link" exact>
          <i class="bi bi-briefcase-fill me-2"></i> งานทั้งหมด
        </router-link>
      </li>
      <li class="mb-3">
        <router-link to="/admin/uploads" class="nav-link" exact>
          <i class="bi bi-file-earmark-arrow-up-fill me-2"></i> ไฟล์ที่อัปโหลด
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AdminSidebar",
};
</script>

<style scoped>
.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  display: block;
  transition: background-color 0.2s ease;
}
.nav-link:hover {
  background-color: #f3f3f3;
}
.router-link-exact-active {
  background-color: #ffe4cc; /* สีส้มอ่อน */
  color: #ff6600 !important;
  font-weight: bold;
}
</style>
