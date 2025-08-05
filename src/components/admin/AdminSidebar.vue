<template>
  <div class="sidebar bg-white shadow-sm p-3" style="width: 220px; height: 100vh;">
    <ul class="list-unstyled">
      <li class="mb-3">
        <router-link to="/admin/dashboard" class="text-decoration-none fw-bold text-dark">
          <i class="bi bi-speedometer2 me-2"></i> ภาพรวม
        </router-link>
      </li>
      <li class="mb-3">
        <router-link to="/admin/users" class="text-decoration-none text-dark">
          <i class="bi bi-people-fill me-2"></i> ผู้ใช้ทั้งหมด
        </router-link>
      </li>
      <li class="mb-3">
        <router-link to="/admin/jobs" class="text-decoration-none text-dark">
          <i class="bi bi-briefcase-fill me-2"></i> งานทั้งหมด
        </router-link>
      </li>
      <li class="mb-3">
        <router-link to="/admin/uploads" class="text-decoration-none text-dark">
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
