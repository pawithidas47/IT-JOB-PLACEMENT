<template>
  <div>
    <NavbarApplicant />

    <div class="container mt-5 d-flex flex-column align-items-center justify-content-center text-center position-relative">
      <div
        class="card px-5 py-3 border-0 rounded-4"
        style="box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); max-width: 720px; width: 100%;"
      >
        <h3 class="mb-4 text-orange fw-bold">
          <i class="bi bi-briefcase-fill me-2"></i>{{ job.j_title }}
        </h3>

        <div class="text-start">
          <div class="mb-3">
            <i class="bi bi-tags-fill me-2"></i><strong>ประเภทงาน:</strong> {{ job.j_type }}
          </div>
          <div class="mb-3">
            <i class="bi bi-building me-2"></i><strong>บริษัท:</strong> {{ job.j_company }}
          </div>
          <div class="mb-3">
            <i class="bi bi-geo-alt-fill me-2"></i><strong>สถานที่:</strong> {{ job.j_location }}
          </div>
          <div class="mb-3">
            <i class="bi bi-cash-stack me-2"></i><strong>เงินเดือน:</strong> {{ job.j_salary }}
          </div>
          <div class="mb-3">
            <i class="bi bi-card-text me-2"></i><strong>รายละเอียด:</strong> {{ job.j_description }}
          </div>
        </div>

        <!-- ปุ่มสมัครงาน -->
        <button
          class="btn btn-orange w-100 mt-4 fw-bold"
          @click="confirmApply"
        >
          <i class="bi bi-check-circle-fill me-2"></i> สมัครงาน
        </button>
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
  components: {
    NavbarApplicant,
  },
  data() {
    return {
      job: {},
      user: {},
    };
  },
  async created() {
    const jobId = this.$route.params.id;
    const response = await axios.get(`http://localhost:3001/api/jobs/${jobId}`);
    this.job = response.data;

    const userJson = localStorage.getItem("user");
    if (userJson) {
      this.user = JSON.parse(userJson);
    }

    console.log("✅ user:", this.user);
    console.log("📄 job:", this.job);
  },
  methods: {
    async confirmApply() {
      const applicantId = this.user.applicant_id;
      const jobId = this.job.job_id;

      if (!applicantId || !jobId) {
        Swal.fire("กรุณาเข้าสู่ระบบ", "หรือข้อมูลไม่ครบ", "warning");
        return;
      }

      try {
        // 🔍 ตรวจสอบว่าผู้สมัครเคยสมัครหรือยัง
        const check = await axios.get(`http://localhost:3001/api/applications/check`, {
          params: { job_id: jobId, applicant_id: applicantId },
        });

        if (check.data.applied) {
          Swal.fire("คุณได้สมัครงานนี้ไปแล้ว", "", "info");
          return;
        }

        // ⚠️ Popup ยืนยันการสมัคร
        const result = await Swal.fire({
          title: "ยืนยันการสมัครงาน",
          text: ` "${this.job.j_title}" หรือไม่?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "ยืนยัน",
          cancelButtonText: "ยกเลิก",
          reverseButtons: true,
          width: "450px",
        });

        if (!result.isConfirmed) return;

        // ✅ สมัครงาน
        const response = await axios.post(
          "http://localhost:3001/api/applications",
          {
            job_id: jobId,
            applicant_id: applicantId,
            app_portfolio_url: this.user.portfolio_url || null,
          }
        );

        Swal.fire("สมัครงานสำเร็จ!", response.data.message, "success").then(() => {
          this.$router.push("/applicant/jobs");
        });

      } catch (error) {
        console.error("❌ สมัครงานไม่สำเร็จ:", error);
        Swal.fire("เกิดข้อผิดพลาด", error.response?.data?.message || "ไม่สามารถสมัครงานได้", "error");
      }
    },
  },
};
</script>


<style scoped>
.btn-orange {
  background-color: #ff6600;
  color: white;
  border: none;
}
.btn-orange:hover {
  background-color: #e65c00;
}
</style>
