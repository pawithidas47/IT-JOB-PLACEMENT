<template>
  <div>
    <!-- Navbar -->
    <NavbarEmployer />

    <!-- รายละเอียดงาน -->
    <div class="container py-5" v-if="job">
      <div class="card shadow-lg rounded-4 p-5 border-0 bg-white">

        <!-- วันที่ -->
        <p class="text-muted small mb-2">
          <i class="bi bi-calendar-event me-2"></i>{{ formatDate(job.j_posted_at) || '-' }}
        </p>

        <!-- หัวเรื่องงาน -->
        <h2 class="fw-bold text-orange mb-1">รับสมัคร {{ job.j_title }}</h2>
        <p class="text-muted mb-3 fs-6">{{ job.e_company_name || '-' }}</p>

        <!-- ประเภท/หมวดหมู่ -->
        <div class="d-flex flex-wrap gap-2 mb-4">
          <span class="badge bg-warning text-dark px-3 py-2 rounded-pill">หมวดหมู่: {{ job.j_type || '-' }}</span>
        </div>

        <!-- จำนวนรับ -->
        <p class="mb-3"><strong>จำนวนที่รับ:</strong> {{ job.j_amount || '-' }} อัตรา</p>

        <!-- ลักษณะงาน -->
        <h5 class="fw-bold text-secondary mt-4">ลักษณะงาน</h5>
        <ul class="list-group list-group-flush mb-4">
          <li class="list-group-item" v-for="line in splitLines(job.j_description)" :key="line">📌 {{ line }}</li>
        </ul>

        <!-- คุณสมบัติผู้สมัคร -->
        <h5 class="fw-bold text-secondary">คุณสมบัติผู้สมัคร</h5>
        <ul class="list-group list-group-flush mb-4">
          <li class="list-group-item" v-for="line in splitLines(job.j_qualification || '')" :key="line">✅ {{ line }}</li>
        </ul>

        <!-- เงินเดือน -->
        <h5 class="fw-bold text-secondary">เงินเดือน/ค่าตอบแทน</h5>
        <p class="mb-4">💰 {{ formatSalary(job.j_salary) }} บาท</p>

        <!-- สวัสดิการ -->
        <h5 class="fw-bold text-secondary">สวัสดิการ</h5>
        <ul class="list-group list-group-flush mb-4">
          <li class="list-group-item" v-for="line in splitLines(job.j_welfare)" :key="line">🎁 {{ line }}</li>
        </ul>

        <!-- สิ่งที่ต้องส่ง -->
        <h5 class="fw-bold text-secondary">สิ่งที่ต้องส่ง</h5>
        <p class="mb-4">📎 {{ job.j_deliverable || 'ไม่ระบุ' }}</p>

        <!-- สถานที่ทำงาน -->
        <h5 class="fw-bold text-secondary">สถานที่ปฏิบัติงาน</h5>
        <p class="mb-4">📍 {{ job.j_location || 'ไม่ระบุ' }}</p>

        <!-- เวลาทำงาน -->
        <h5 class="fw-bold text-secondary">วันและเวลาทำงาน</h5>
        <p class="mb-4">🕒 {{ job.j_worktime || 'ไม่ระบุ' }}</p>

        <!-- ช่องทางติดต่อ -->
        <h5 class="fw-bold text-secondary">ช่องทางติดต่อ</h5>
        <p class="mb-4">📱 {{ job.j_contact || '-' }}</p>

        <!-- วันปิดรับสมัคร -->
        <h5 class="fw-bold text-secondary">วันปิดรับสมัคร</h5>
        <p class="mb-4">⏳ {{ formatDate(job.j_appdeadline) || '-' }}</p>

        <!-- ปุ่มแก้ไข -->
        <div class="d-flex justify-content-end mt-4">
          <button class="btn btn-outline-primary px-4 py-2 rounded-pill" @click="editJob">
            <i class="bi bi-pencil-square me-1"></i> แก้ไขงานนี้
          </button>
        </div>

      </div>
    </div>

    <!-- หากยังไม่มีข้อมูล -->
    <div v-else class="text-center text-muted py-5">
      <i class="bi bi-hourglass-split fs-2"></i>
      <p class="mt-3">กำลังโหลดข้อมูลงาน...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";

export default {
  name: "EmployerJobDetail",
  components: { NavbarEmployer },
  data() {
    return {
      job: null,
    };
  },
  mounted() {
    const jobId = this.$route.params.id;
    axios.get(`http://localhost:3001/api/jobs/${jobId}`)
      .then(res => {
        this.job = res.data;
      })
      .catch(err => {
        console.error("❌ โหลดงานไม่สำเร็จ:", err);
      });
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return isNaN(date) ? null : date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    },
    formatSalary(salary) {
      return parseFloat(salary).toLocaleString();
    },
    splitLines(text) {
      return text?.split('\n') || [];
    },
    editJob() {
      this.$router.push(`/employer/jobs/edit/${this.job.job_id}`);
    }
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
</style>
