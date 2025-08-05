<template>
  <div>
    <AdminNavbar />
    <div class="d-flex">
      <AdminSidebar />
      <div class="p-4" style="flex: 1;">
        <h4 class="fw-bold text-orange mb-3"><i class="bi bi-briefcase-fill me-2"></i> งานทั้งหมด</h4>
        <table class="table table-bordered table-hover">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>ชื่องาน</th>
              <th>ประเภท</th>
              <th>ค่าจ้าง</th>
              <th>ผู้โพสต์</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(job, index) in jobs" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ job.j_title }}</td>
              <td>{{ job.j_type }}</td>
              <td>{{ job.j_salary.toLocaleString() }} บาท</td>
              <td>{{ job.employer_name || "-" }}</td>
            </tr>
            <tr v-if="jobs.length === 0">
              <td colspan="5" class="text-muted text-center">ไม่มีข้อมูลงาน</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavbar from "@/components/admin/AdminNavbar.vue";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";

export default {
  components: { AdminNavbar, AdminSidebar },
  data() {
    return { jobs: [] };
  },
  async mounted() {
    try {
      const res = await fetch("http://localhost:3001/api/admin/jobs", {
        headers: { Authorization: localStorage.getItem("admin_token") }
      });
      this.jobs = await res.json();
    } catch (err) {
      console.error("โหลดงานล้มเหลว", err);
    }
  }
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
</style>
