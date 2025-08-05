<template>
  <div class="container py-5">
    <div class="card shadow rounded-4 p-4">
      <h3 class="fw-bold text-orange mb-4">
        <i class="bi bi-speedometer2 me-2"></i> แดชบอร์ดผู้ดูแลระบบ
      </h3>

      <p class="text-muted">ยินดีต้อนรับ! คุณสามารถจัดการระบบได้จากเมนูนี้</p>

      <div class="row g-4 mt-4">
        <div class="col-md-6 col-lg-4">
          <div class="card border-start border-4 border-warning shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title fw-bold"><i class="bi bi-people-fill me-2"></i> ผู้ใช้ทั้งหมด</h5>
              <p class="card-text text-muted">ดู / แก้ไข / แบนผู้ใช้</p>
              <router-link to="/admin/users" class="btn btn-sm btn-orange">ไปยังหน้าผู้ใช้</router-link>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card border-start border-4 border-info shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title fw-bold"><i class="bi bi-briefcase-fill me-2"></i> งานทั้งหมด</h5>
              <p class="card-text text-muted">ดู / ลบงานที่ถูกโพสต์</p>
              <router-link to="/admin/jobs" class="btn btn-sm btn-orange">ไปยังหน้างาน</router-link>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card border-start border-4 border-secondary shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title fw-bold"><i class="bi bi-file-earmark-text-fill me-2"></i> ไฟล์ที่อัปโหลด</h5>
              <p class="card-text text-muted">ตรวจสอบรูปภาพ / เอกสาร</p>
              <router-link to="/admin/uploads" class="btn btn-sm btn-orange">ไปยังหน้าไฟล์</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
  mounted() {
  const token = localStorage.getItem("admin_token");

  // ✅ เปลี่ยนจาก 'admin1234' → เป็น 'admin_dummy_token'
  if (token !== "admin_dummy_token") {
    this.$router.push("/admin/login");
  }
}
,
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
.btn-orange {
  background-color: #ff6600;
  border-color: #ff6600;
  color: white;
}
.btn-orange:hover {
  background-color: #e65c00;
  border-color: #e65c00;
}
</style>
