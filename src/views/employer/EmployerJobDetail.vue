<template>
  <div>
    <!-- Navbar -->
    <NavbarEmployer />

    <!-- รายละเอียดงาน -->
    <div class="container py-5" v-if="job">
      <div class="card shadow rounded-4 p-4">

        <!-- วันที่ -->
        <p class="text-muted small mb-1">
          <i class="bi bi-calendar-event me-2"></i> {{ formatDate(job.j_posted_at) || '-' }}

        </p>

        <!-- หัวเรื่องงาน -->
        <h5 class="fw-bold mb-1">รับสมัคร {{ job.j_title }}</h5>
        <p class="text-muted mb-2">{{ job.e_company_name }}</p>

        <!-- ประเภท/หมวดหมู่ -->
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span class="badge bg-success">งาน{{ job.j_type }}</span>
          <span class="text-muted small">หมวดหมู่ {{ job.j_category || '-' }}</span>
        </div>

        <!-- จำนวนรับ -->
        <p class="fw-bold mb-1">จำนวนที่รับ {{ job.j_amount || '-' }} อัตรา</p>

        <!-- ลักษณะงาน -->
        <h6 class="fw-bold mt-4">ลักษณะงาน</h6>
        <ul class="small">
          <li v-for="line in splitLines(job.j_description)" :key="line">{{ line }}</li>
        </ul>

        <!-- คุณสมบัติผู้สมัคร -->
        <h6 class="fw-bold mt-4">คุณสมบัติผู้สมัคร</h6>
        <ul class="small">
          <li v-for="line in splitLines(job.j_qualification)" :key="line">{{ line }}</li>
        </ul>

        <!-- เงินเดือน -->
        <h6 class="fw-bold mt-4">เงินเดือน/ค่าตอบแทน</h6>
        <p>{{ formatSalary(job.j_salary) }} บาท</p>

        <!-- สวัสดิการ -->
        <h6 class="fw-bold mt-4">สวัสดิการ</h6>
        <ul class="small">
          <li v-for="line in splitLines(job.j_benefits)" :key="line">{{ line }}</li>
        </ul>

        <!-- สถานที่ทำงาน -->
        <h6 class="fw-bold mt-4">สถานที่ปฏิบัติงาน</h6>
        <p>{{ job.j_location || 'ไม่ระบุ' }}</p>

        <!-- เวลาทำงาน -->
        <h6 class="fw-bold mt-4">จำนวนวันและเวลาทำงาน</h6>
        <p>{{ job.j_worktime || 'ไม่ระบุ' }}</p>

        <!-- ปุ่มแก้ไข -->
        <div class="d-flex justify-content-between align-items-center mt-4">
          <button class="btn btn-outline-secondary rounded-pill" @click="editJob">
            <i class="bi bi-pencil-square me-1"></i> แก้ไขงาน
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
}
,
    formatSalary(salary) {
      return parseFloat(salary).toLocaleString();
    },
    splitLines(text) {
      return text?.split('\n') || [];
    },
    editJob() {
      // ไปยังหน้าแก้ไขงาน
      this.$router.push(`/employer/jobs/edit/${this.job.job_id}`);
    }
  },
};
</script>

<style scoped>
/* ปรับแต่งสไตล์ */
</style>
