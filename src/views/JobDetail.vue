<template>
  <div>
    <NavbarHome />
    <div v-if="job" class="container py-5 d-flex flex-column flex-lg-row gap-4" style="max-width: 1140px">
      
      <!-- ซ้าย: รายละเอียดงาน -->
      <div class="card shadow rounded-4 p-5 border-0 bg-white w-100" style="flex: 2">
        <p class="text-muted small mb-2">
          <i class="bi bi-calendar-event me-2"></i>{{ formatDate(job?.j_posted_at) || '-' }}
        </p>

        <h3 class="fw-bold text-dark mb-1">รับสมัคร {{ job?.j_title }}</h3>
        <p class="text-muted mb-3">{{ job?.e_company_name || '-' }}</p>

        <div class="mb-4">
          <span class="badge bg-warning text-dark rounded-pill px-3 py-2">
            หมวดหมู่: {{ job?.j_type || '-' }}
          </span>
        </div>

        <p class="fw-bold text-dark mb-4">
          จำนวนที่รับ: {{ job?.j_amount || '-' }} อัตรา
        </p>

        <h5 class="fw-bold text-dark mb-2">ลักษณะงาน</h5>
        <div class="mb-4">
          <div class="text-dark mb-1" v-for="line in splitLines(job?.j_description)" :key="line">{{ line }}</div>
        </div>

        <h5 class="fw-bold text-dark mb-2">คุณสมบัติผู้สมัคร</h5>
        <div class="mb-4">
          <div class="text-dark mb-1" v-for="line in splitLines(job?.j_qualification)" :key="line">{{ line }}</div>
        </div>

        <h5 class="fw-bold text-dark mb-2">เงินเดือน/ค่าตอบแทน</h5>
        <p class="mb-4 text-dark">{{ formatSalary(job?.j_salary) }} บาท</p>

        <h5 class="fw-bold text-dark mb-2">สวัสดิการ</h5>
        <div class="mb-4">
          <div class="text-dark mb-1" v-for="line in splitLines(job?.j_welfare)" :key="line">{{ line }}</div>
        </div>

        <h5 class="fw-bold text-dark mb-2">สิ่งที่ต้องส่ง</h5>
        <p class="mb-4 text-dark">{{ job?.j_deliverable || 'ไม่ระบุ' }}</p>

        <h5 class="fw-bold text-dark mb-2">สถานที่ปฏิบัติงาน</h5>
        <p class="mb-4 text-dark">{{ job?.j_location || 'ไม่ระบุ' }}</p>

        <h5 class="fw-bold text-dark mb-2">วันและเวลาทำงาน</h5>
        <p class="mb-4 text-dark">{{ job?.j_worktime || 'ไม่ระบุ' }}</p>

        <!-- ปุ่มสมัครงาน -->
        <div class="mt-4 d-flex flex-column align-items-center gap-2">
          <div class="w-100 d-flex justify-content-center">
            <button
              v-if="!isLoggedIn"
              class="btn text-white fw-bold d-inline-flex align-items-center justify-content-center"
              style="background: linear-gradient(135deg,#ff6600,#e55d00); border-radius: 12px; height: 48px; font-size: 16px; padding: 0 24px; box-shadow: 0 2px 10px rgba(255, 102, 0, 0.3); width: 100%;"
              @click="showLoginPopup = true"
            >
              สมัครงาน
            </button>
            <button
              v-else
              class="btn text-white fw-bold d-inline-flex align-items-center justify-content-center"
              style="background: linear-gradient(135deg,#ff6600,#e55d00); border-radius: 12px; height: 48px; font-size: 16px; padding: 0 24px; box-shadow: 0 2px 10px rgba(255, 102, 0, 0.3); min-width: 200px; max-width: 220px;"
              @click="applyJob"
            >
              <i class="bi bi-check2-circle me-2"></i>
              สมัครงาน
            </button>
          </div>
          <div class="d-flex justify-content-end w-100 gap-2 text-end">
            <button class="btn btn-outline-secondary rounded-pill px-3" @click="saveJob">
              <i class="bi bi-bookmark me-1"></i> บันทึกงาน
            </button>
            <button class="btn btn-outline-secondary rounded-pill px-3" @click="shareJob">
              <i class="bi bi-share me-1"></i> แชร์
            </button>
          </div>
        </div>
      </div>

      <!-- ขวา: ข้อมูลบริษัท -->
      <div class="card shadow rounded-4 p-4 bg-white" style="flex: 1; min-width: 260px; max-width: 360px;">
        <div class="text-center mb-3">
          <img :src="job.e_profile_img_url ? 'http://localhost:3001' + job.e_profile_img_url : '/default-profile.jpg'"
            class="rounded-circle mb-2" style="width: 100px; height: 100px; object-fit: cover" />
          <h5 class="fw-bold mb-1">{{ job?.e_company_name || 'ชื่อบริษัท' }}</h5>
          <p class="text-muted small mb-2">{{ job?.e_type || 'ประเภทธุรกิจ' }}</p>
        </div>

        <h6 class="fw-bold text-success mb-2">เกี่ยวกับบริษัท</h6>
        <p class="small" v-if="job.e_description">{{ job.e_description }}</p>

        <h6 class="fw-bold text-success mb-2 mt-4">แกลเลอรี่รูปภาพบริษัท</h6>
        <div class="d-flex gap-2 overflow-auto mb-3">
          <img v-for="img in galleryArray" :key="img" :src="'http://localhost:3001' + img" class="rounded"
            style="height: 80px; object-fit: cover; cursor: pointer"
            @click="showImage('http://localhost:3001' + img)" />
        </div>

        <div v-if="selectedImage" class="modal-backdrop" @click.self="selectedImage = null">
          <div class="modal-image-wrapper">
            <button class="close-btn" @click="selectedImage = null">✕</button>
            <button class="nav-btn left" @click="prevImage">‹</button>
            <img :src="selectedImage" class="preview-image" />
            <button class="nav-btn right" @click="nextImage">›</button>
          </div>
        </div>

        <h6 class="fw-bold text-success mb-2 mt-3">ที่อยู่บริษัท</h6>
        <p class="small mb-2">{{ job?.e_address || 'ยังไม่ระบุที่อยู่บริษัท' }}</p>

        <iframe v-if="job?.e_map_iframe" :src="job.e_map_iframe" width="100%" height="220"
          style="border: 0; border-radius: 8px" allowfullscreen loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>

        <h6 class="fw-bold text-success mb-2 mt-3">ข้อมูลติดต่อบริษัท</h6>
        <ul class="list-unstyled small text-muted">
          <li><i class="bi bi-person-circle me-2"></i> {{ job?.e_contact || '-' }}</li>
          <li><i class="bi bi-telephone me-2"></i> {{ job?.e_phone || '-' }}</li>
          <li>
            <i class="bi bi-globe me-2"></i>
            <a v-if="job?.e_website" :href="job.e_website" target="_blank">{{ job.e_website }}</a>
            <span v-else>-</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Popups -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content text-center">
        <p class="mb-4 fw-bold">กรุณาเข้าสู่ระบบ<br />เพื่อบันทึกงานที่สนใจ</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-outline-secondary px-4" @click="closePopup">ยกเลิก</button>
          <router-link to="/login" class="btn px-4" style="background-color: #ff6600; color: white;">เข้าสู่ระบบ</router-link>
        </div>
      </div>
    </div>

    <div v-if="sharePopup" class="popup-overlay">
      <div class="popup-content">
        <p class="mb-3 fw-bold text-center">
          📋 คัดลอกลิงก์งานเรียบร้อยแล้ว คุณสามารถนำไปแชร์ต่อได้เลย!
        </p>
        <div class="d-flex justify-content-end">
          <button class="btn btn-outline-secondary" @click="sharePopup = false">ปิด</button>
        </div>
      </div>
    </div>

    <div v-if="showLoginPopup" class="popup-overlay">
      <div class="popup-content text-center">
        <p class="mb-4 fw-bold">กรุณาเข้าสู่ระบบ<br />เพื่อสมัครงาน</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-outline-secondary px-4" @click="showLoginPopup = false">ยกเลิก</button>
          <router-link to="/login" class="btn px-4" style="background-color: #ff6600; color: white;">เข้าสู่ระบบ</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import NavbarHome from "@/components/NavbarHome.vue";

export default {
  name: "JobDetailPage",
components: { NavbarHome },
  data() {
    return {
      job: {},
      user: null,
      alreadyApplied: false,
      applicationStatus: null,
      selectedImage: null,
      currentImageIndex: 0,
      galleryArray: [],
      showPopup: false,
      sharePopup: false,
      showLoginPopup: false,
    };
  },
  computed: {
    isLoggedIn() {
      return !!this.user?.applicant_id;
    }
  },
  async mounted() {
    const userData = localStorage.getItem("user");
    this.user = userData ? JSON.parse(userData) : null;
    await this.loadJobData();
  },
  methods: {
    async loadJobData() {
      try {
        const jobId = this.$route.params.id;
        const jobRes = await axios.get(`http://localhost:3001/api/jobs/${jobId}`);
        this.job = jobRes.data;

        try {
          this.galleryArray = JSON.parse(this.job.e_gallery || "[]");
        } catch {
          this.galleryArray = [];
        }

        if (this.isLoggedIn && this.job?.job_id) {
          await this.checkApplicationStatus();
        }
      } catch (err) {
        console.error("❌ โหลด job ล้มเหลว:", err);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลงานได้", "error");
      }
    },

    async checkApplicationStatus() {
      if (!this.user?.applicant_id || !this.job?.job_id) return;

      try {
        const { job_id } = this.job;
        const { applicant_id } = this.user;
        const res = await axios.get(
          `http://localhost:3001/api/applications/check-status/${job_id}/${applicant_id}`
        );
        this.applicationStatus = res.data.status;
        this.alreadyApplied = res.data.alreadyApplied;
      } catch (err) {
        console.error("❌ ตรวจสอบสถานะล้มเหลว:", err);
      }
    },

    applyJob() {
      if (!this.isLoggedIn) {
        this.showLoginPopup = true;
        return;
      }
      this.confirmApply();
    },

    async confirmApply() {
      if (this.alreadyApplied) return;

      const { job_id } = this.job;
      const { applicant_id, portfolio_url } = this.user;

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
          app_portfolio_url: portfolio_url || null,
        });

        Swal.fire("สมัครงานสำเร็จ!", "ระบบได้บันทึกการสมัครของคุณแล้ว", "success");

        await new Promise((r) => setTimeout(r, 300));
        await this.checkApplicationStatus();
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด", err.response?.data?.message || "ไม่สามารถสมัครงานได้", "error");
        console.error("❌ สมัครไม่สำเร็จ:", err);
      }
    },

    saveJob() {
      if (!this.isLoggedIn) {
        this.showPopup = true;
        return;
      }

      // TODO: เพิ่ม logic การบันทึกงานจริงที่นี่
      console.log("บันทึกงานสำเร็จ");
    },

    shareJob() {
      navigator.clipboard.writeText(window.location.href);
      this.sharePopup = true;
    },

    closePopup() {
      this.showPopup = false;
    },

    formatDate(dateStr) {
      if (!dateStr) return "-";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateStr).toLocaleDateString("th-TH", options);
    },

    formatSalary(salary) {
      if (!salary || isNaN(salary)) return "-";
      return Number(salary).toLocaleString("th-TH");
    },

    splitLines(text) {
      if (!text) return [];
      return text.split(/\r?\n/).filter((line) => line.trim() !== "");
    },

    showImage(url) {
      this.currentImageIndex = this.galleryArray.findIndex(
        (img) => "http://localhost:3001" + img === url
      );
      this.selectedImage = url;
    },

    nextImage() {
      const total = this.galleryArray.length;
      this.currentImageIndex = (this.currentImageIndex + 1) % total;
      this.selectedImage = "http://localhost:3001" + this.galleryArray[this.currentImageIndex];
    },

    prevImage() {
      const total = this.galleryArray.length;
      this.currentImageIndex = (this.currentImageIndex - 1 + total) % total;
      this.selectedImage = "http://localhost:3001" + this.galleryArray[this.currentImageIndex];
    },
  },
};
</script>



<style scoped>

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
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: white;
  border-radius: 16px;
  padding: 24px 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  width: 400px;
}

</style>


