<template>
  <div>
    <NavbarApplicant />

    <div
      class="container mt-5 d-flex flex-column align-items-center justify-content-center text-center position-relative">
     <div class="job-detail-card px-5 py-4">

        <h3 class="mb-4 text-orange fw-bold">
          <i class="bi bi-briefcase-fill me-2"></i>{{ job.j_title }}
        </h3>

    <div class="text-start mb-4 fs-6">
  <p><i class="bi bi-tags-fill me-2"></i><strong>ประเภทงาน:</strong> {{ job.j_type }}</p>
  <p><i class="bi bi-cash-coin me-2"></i><strong>ค่าจ้าง:</strong> {{ Number(job.j_salary).toLocaleString() }} บาท</p>
  <p><i class="bi bi-calendar-event me-2"></i><strong>วันหมดเขต:</strong> {{ new Date(job.j_appdeadline).toLocaleDateString('th-TH') }}</p>
  <p><i class="bi bi-person-badge me-2"></i><strong>ผู้ว่าจ้าง:</strong> {{ job.employer_type || 'ไม่ระบุ' }}</p>
  <p><i class="bi bi-card-text me-2"></i><strong>รายละเอียดงาน:</strong></p>
  <div class="bg-light p-3 rounded text-start" style="white-space: pre-line;">
    {{ job.j_description }}
  </div>
</div>


        <div class="text-center">
          <button :class="alreadyApplied ? 'btn btn-secondary w-100 fw-bold' : 'btn btn-orange w-100 fw-bold'"
            :disabled="alreadyApplied" @click="confirmApply">
            <i class="bi" :class="alreadyApplied ? 'bi-check-circle' : 'bi-check-circle-fill'"></i>
            {{ alreadyApplied ? 'สมัครแล้ว' : 'สมัครงาน' }}
          </button>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";
import NavbarApplicant from "@/components/NavbarApplicant.vue";

export default {
  name: "JobDetailPage",
  components: { NavbarApplicant },
  data() {
    return {
      job: {},
      user: {},
      alreadyApplied: false,
      applicationStatus: null,
    };
  },

  async mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.user = user;

    await this.loadJobData(); // ✅ ตรวจสอบสถานะหลัง job พร้อม
  },

  methods: {
    async loadJobData() {
      try {
        const jobId = this.$route.params.id;
        const jobRes = await axios.get(`http://localhost:3001/api/jobs/${jobId}`);
        this.job = jobRes.data;
        console.log("📦 job loaded:", this.job.job_id);

        if (this.user?.applicant_id && this.job?.job_id) {
          await this.checkApplicationStatus(); // ✅ ตอนนี้มีค่าแน่นอน
        }
      } catch (err) {
        console.error("❌ โหลด job ล้มเหลว:", err);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลงานได้", "error");
      }
    },

    async checkApplicationStatus() {
      const job_id = Number(this.job.job_id);
      const applicant_id = Number(this.user.applicant_id);

      console.log("🔍 ตรวจสอบสถานะด้วย:", { job_id, applicant_id });

      try {
        const res = await axios.get(
          `http://localhost:3001/api/applications/check-status/${job_id}/${applicant_id}`
        );
        console.log("✅ API response:", res.data);

        this.applicationStatus = res.data.status;
        this.alreadyApplied = res.data.alreadyApplied;
      } catch (err) {
        console.error("❌ ตรวจสอบ API ล้มเหลว:", err);
      }
    },

    async confirmApply() {
      if (this.alreadyApplied) return;

      const job_id = Number(this.job.job_id);
      const applicant_id = Number(this.user.applicant_id);

      const result = await Swal.fire({
        title: "ยืนยันการสมัครงาน",
        text: `คุณต้องการสมัคร "${this.job.j_title}" หรือไม่?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      try {
        await axios.post("http://localhost:3001/api/applications", {
          job_id,
          applicant_id,
          app_portfolio_url: this.user.portfolio_url || null,
        });

        Swal.fire("สมัครงานสำเร็จ!", "ระบบได้บันทึกการสมัครของคุณแล้ว", "success");

        await new Promise((resolve) => setTimeout(resolve, 300));
        await this.checkApplicationStatus();
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด", err.response?.data?.message || "ไม่สามารถสมัครงานได้", "error");
        console.error("❌ สมัครไม่สำเร็จ:", err);
      }
    },
  },
};
</script>

<style scoped>
.job-detail-card {
  max-width: 720px;
  width: 100%;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15); /* << เพิ่มความเข้ม */
  margin-top: 2rem;
}


.btn-orange {
  background-color: #ff6600;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.5rem;
}

.btn-orange:hover {
  background-color: #e65c00;
}

.text-orange {
  color: #ff6600;
}
</style>
