<template>
  <div>
    <NavbarEmployer />

    <div v-if="job">
      <div class="container py-5 mx-auto" style="max-width: 840px;">
        <div class="card shadow rounded-4 p-5 border-0 bg-white">

          <!-- วันที่ -->
          <p class="text-muted small mb-2">
            <i class="bi bi-calendar-event me-2"></i>{{ formatDate(job?.j_posted_at) || '-' }}
          </p>

          <!-- หัวเรื่อง -->
          <h3 class="fw-bold text-dark mb-1">รับสมัคร {{ job?.j_title }}</h3>
          <p class="text-muted mb-3">{{ job?.e_company_name || '-' }}</p>

          <!-- หมวดหมู่ -->
          <div class="mb-4">
             <span class="badge-category">
  {{ job?.j_type || '-' }}
</span>

          </div>

          <!-- จำนวนที่รับ -->
          <p class="fw-bold text-dark mb-4">
            จำนวนที่รับ: {{ job?.j_amount || '-' }} อัตรา
          </p>

          <!-- ลักษณะงาน -->
          <h5 class="fw-bold text-dark mb-2">ลักษณะงาน</h5>
          <div class="mb-4">
            <div class="text-dark mb-1" v-for="line in splitLines(job?.j_description)" :key="line">{{ line }}</div>
          </div>

          <!-- คุณสมบัติ -->
          <h5 class="fw-bold text-dark mb-2">คุณสมบัติผู้สมัคร</h5>
          <div class="mb-4">
            <div class="text-dark mb-1" v-for="line in splitLines(job?.j_qualification)" :key="line">{{ line }}</div>
          </div>

          <!-- เงินเดือน -->
          <h5 class="fw-bold text-dark mb-2">ค่าตอบแทน</h5>
          <p class="mb-4 text-dark">{{ formatSalary(job?.j_salary) }} บาท</p>

         

          <!-- สิ่งที่ต้องส่ง -->
          <h5 class="fw-bold text-dark mb-2">สิ่งที่ต้องส่ง</h5>
          <p class="mb-4 text-dark">{{ job?.j_deliverable || 'ไม่ระบุ' }}</p>

          <!-- สถานที่ปฏิบัติงาน -->
          <h5 class="fw-bold text-dark mb-2">สถานที่ปฏิบัติงาน</h5>
          <p class="mb-4 text-dark">{{ job?.j_location || 'ไม่ระบุ' }}</p>

          <!-- เวลาทำงาน -->
          <h5 class="fw-bold text-dark mb-2">วันและเวลาทำงาน</h5>
          <p class="mb-4 text-dark">{{ job?.j_worktime || 'ไม่ระบุ' }}</p>

       
 <!-- ปุ่ม 3 ปุ่ม เรียงแนวนอนแบบสวยเท่ากัน -->
<div class="d-flex flex-wrap gap-2 mt-4 justify-content-end">
  <!-- ปิดรับสมัคร -->
  <button
    type="button"
    class="btn btn-warning rounded-pill d-flex align-items-center justify-content-center px-4 py-2"
    @click="closeJob"
    :disabled="job.j_status === 'closed'"
  >
    <i class="bi bi-lock-fill me-2"></i> ปิดรับสมัคร
  </button>

  <!-- แก้ไข -->
  <router-link :to="`/employer/edit-job/${job?.job_id}`" class="text-decoration-none">
    <button class="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center px-4 py-2">
      <i class="bi bi-pencil-square me-2"></i> แก้ไขงานนี้
    </button>
  </router-link>

  <!-- ลบ -->
  <button class="btn btn-danger rounded-pill d-flex align-items-center justify-content-center px-4 py-2"
    @click="confirmDelete">
    <i class="bi bi-trash me-2"></i> ลบงานนี้
  </button>

</div>
        </div>
      </div>
    </div>
<div v-if="job && job.j_status === 'closed'" class="alert alert-secondary rounded-pill text-center fw-bold my-3">
  🔒 งานนี้ปิดรับสมัครแล้ว
</div>

    <!-- Loading -->
   
  </div>
</template>

<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";

export default {
  name: "EmployerJobDetail",
  components: { NavbarEmployer },
  data() {
    return { job: null };
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
    confirmDelete() {
      if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?")) {
        axios.delete(`http://localhost:3001/api/jobs/${this.job?.job_id}`)
          .then(() => {
            alert("✅ ลบงานสำเร็จ");
            this.$router.push("/employer/dashboard");
          })
          .catch(err => {
            console.error("❌ ลบงานล้มเหลว:", err);
            alert("เกิดข้อผิดพลาดในการลบงาน");
          });
      }
    },
    closeJob() {
      const jobId = this.job?.job_id;
      if (!jobId) return;

      const confirmClose = confirm("คุณต้องการปิดรับสมัครงานนี้หรือไม่?");
      if (!confirmClose) return;

      axios.put(`http://localhost:3001/api/jobs/${jobId}/close`)
        .then(() => {
          alert("✅ งานนี้ถูกปิดรับสมัครแล้ว");
          this.job.j_status = 'closed'; // อัปเดตใน UI ทันที
        })
        .catch((err) => {
          console.error("❌ ปิดรับสมัครล้มเหลว:", err);
          alert("เกิดข้อผิดพลาดในการปิดรับสมัคร");
        });
    }
  }
};
</script>


<style scoped>
.text-orange {
  color: #ff6600;
}
.badge-category {
  background-color: #fff5e6;
  color: #ff6600;
  border: 1px solid #ff6600;
  border-radius: 999px;
  font-weight: bold;
  padding: 0.25rem 0.75rem;
}
</style>
