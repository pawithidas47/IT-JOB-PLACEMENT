<template>
  <div>
    <AdminNavbar />

    <div class="d-flex">
      <AdminSidebar />

      <div class="p-4" style="flex: 1;">
        <h4 class="fw-bold text-orange mb-3">
          <i class="bi bi-speedometer2 me-2"></i> แดชบอร์ดผู้ดูแลระบบ
        </h4>
        <p>ยินดีต้อนรับ! คุณสามารถจัดการระบบได้จากเมนูซ้าย</p>

        <div class="row g-3">
          <div class="col-md-4">
            <div class="border border-warning p-3 rounded-3">
              <h6 class="fw-bold">
                <i class="bi bi-people-fill me-2"></i> ผู้ใช้ทั้งหมด
              </h6>
              <p class="mb-1">มีทั้งหมด <strong>{{ totalUsers }}</strong> คน</p>
              <router-link to="/admin/users" class="btn btn-orange btn-sm">ไปยังหน้าผู้ใช้</router-link>
            </div>
          </div>
          <div class="col-md-4">
            <div class="border border-info p-3 rounded-3">
              <h6 class="fw-bold">
                <i class="bi bi-briefcase-fill me-2"></i> งานทั้งหมด
              </h6>
              <p class="mb-1">มีทั้งหมด <strong>{{ totalJobs }}</strong> ตำแหน่ง</p>
              <router-link to="/admin/jobs" class="btn btn-orange btn-sm">ไปยังหน้างาน</router-link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AdminNavbar from "@/components/admin/AdminNavbar.vue";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";

export default {
  components: {
    AdminNavbar,
    AdminSidebar,
  },
  data() {
    return {
      totalUsers: 0,
      totalJobs: 0,
    };
  },
  async mounted() {
    try {
      const userRes = await fetch("http://localhost:3001/api/admin/users", {
        headers: { Authorization: localStorage.getItem("admin_token") },
      });
      const users = await userRes.json();
      this.totalUsers = users.length;

      const jobRes = await fetch("http://localhost:3001/api/admin/jobs", {
        headers: { Authorization: localStorage.getItem("admin_token") },
      });
      const jobs = await jobRes.json();
      this.totalJobs = jobs.length;
    } catch (err) {
      console.error("❌ โหลดจำนวนผู้ใช้/งาน ล้มเหลว:", err);
    }
  },
};
</script>


<style scoped>
.text-orange {
  color: #ff6600;
}
.btn-orange {
  background-color: #ff6600;
  color: white;
  font-weight: 500;
}
.btn-orange:hover {
  background-color: #e65c00;
}
</style>
