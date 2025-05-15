<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4">
      <div class="d-flex align-items-center me-auto">
        <h5 class="fw-bold text-warning mb-0">IT job placement @Mor-Nor</h5>
      </div>
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" href="#">จัดการงาน</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">ตรวจสอบผู้สมัครงาน</a>
        </li>
      </ul>
      <button class="btn btn-sm btn-outline-dark" @click="logout">ออกจากระบบ</button>
    </nav>

    <div class="container mt-4">
      <!-- Header + Search -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>จัดการประกาศงาน</h4>
        <div>
          <input type="text" class="form-control" placeholder="🔍 ชื่องาน..." v-model="search" />
        </div>
      </div>

      <!-- Table -->
      <table class="table">
        <thead>
          <tr>
            <th>ชื่องาน</th>
            <th>ประเภทงาน</th>
            <th>วันที่ประกาศ</th>
            <th>ค่าจ้าง</th>
            <th class="text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in filteredJobs" :key="job.job_id">
            <td>{{ job.j_title }}</td>
            <td>{{ job.j_type }}</td>
            <td>{{ formatDate(job.j_posted_at) }}</td>
            <td>{{ parseFloat(job.j_salary).toLocaleString() }}</td>
            <td class="text-center">
              <button 
  class="btn btn-sm btn-outline-secondary me-2" 
  @click="$router.push({ name: 'EditJob', params: { id: job.job_id } })"
>✏️</button>

              <button class="btn btn-sm btn-outline-danger" @click="deleteJob(job.job_id)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- เพิ่มงานใหม่ -->
      <div class="text-end mt-4">
        <router-link to="/employer/post-job" class="btn btn-success rounded-circle text-white">
          <span class="fs-4">＋</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DashboardEmployer",
  data() {
    return {
      user: null,
      search: "",
      jobs: [],
    };
  },
  computed: {
    filteredJobs() {
      return this.jobs.filter((j) =>
        j.j_title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  mounted() {
    const u = localStorage.getItem("user");
    if (!u) return this.$router.push("/login");
    this.user = JSON.parse(u);
    this.fetchJobs();
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
    formatDate(d) {
      const date = new Date(d);
      return date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    async fetchJobs() {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/jobs/employer/${this.user.employer_id}`
        );
        this.jobs = res.data;
      } catch (err) {
        console.error("❌ ดึงข้อมูลงานล้มเหลว:", err);
      }
    },
    editJob(jobId) {
      this.$router.push(`/employer/edit-job/${jobId}`);
    },
    async deleteJob(jobId) {
      const confirmed = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?");
      if (!confirmed) return;

      try {
        await axios.delete(`http://localhost:3001/api/jobs/${jobId}`);
        alert("🗑️ ลบงานเรียบร้อยแล้ว");
        this.fetchJobs();
      } catch (err) {
        console.error("❌ ลบงานล้มเหลว:", err);
        alert("ไม่สามารถลบงานได้");
      }
    },
  },
};
</script>

<style scoped>
.navbar .nav-link.active {
  border-bottom: 3px solid orange;
  font-weight: bold;
}
</style>
