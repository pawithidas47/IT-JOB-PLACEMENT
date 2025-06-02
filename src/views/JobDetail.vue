<template>
  <div class="container mt-5">
    <h3 class="mb-4 text-orange">{{ job.j_title }}</h3>

    <div class="row">
      <div class="col-md-8">
        <p><strong>ประเภทงาน:</strong> {{ job.j_type }}</p>
        <p><strong>รายละเอียดงาน:</strong> {{ job.j_description }}</p>
        <p><strong>ค่าจ้าง:</strong> {{ formatSalary(job.j_salary) }} บาท</p>
        <p><strong>วันหมดเขต:</strong> {{ formatDate(job.j_appdeadline) }}</p>
      </div>
      <div class="col-md-4">
        <!-- ปุ่มเข้าสู่ระบบ -->
        <button
          v-if="!isLoggedIn"
          class="btn btn-warning w-100 text-white"
          @click="redirectToLogin"
        >
          เข้าสู่ระบบเพื่อสมัครงาน
        </button>
        <p v-else>คุณสามารถสมัครงานได้หลังจากเข้าสู่ระบบ</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "JobDetail",
  data() {
    return {
      job: {},
      isLoggedIn: !!localStorage.getItem("user"), // ตรวจสอบการเข้าสู่ระบบ
    };
  },
  mounted() {
    const jobId = this.$route.params.id; // ใช้ id จาก route params
    this.fetchJobDetails(jobId);
  },
  methods: {
    async fetchJobDetails(jobId) {
      try {
        const res = await axios.get(`http://localhost:3001/api/jobs/${jobId}`);
        this.job = res.data;
      } catch (err) {
        console.error("❌ ไม่พบงาน:", err);
      }
    },
    formatDate(d) {
      const date = new Date(d);
      return date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    formatSalary(salary) {
      // ตรวจสอบว่า salary เป็นตัวเลขหรือไม่
      return salary && !isNaN(salary) ? salary.toLocaleString() : "ไม่ระบุ";
    },
    redirectToLogin() {
      this.$router.push("/login"); // ไปยังหน้า login
    },
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
</style>
