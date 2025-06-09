<template>
  <div>
    <!-- ✅ ใช้ NavbarHome.vue แทน Navbar เดิม -->
    <NavbarHome />

    <!-- Job Detail -->
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
            <i class="bi bi-tags-fill me-2 text-muted"></i>
            <span class="fw-semibold">ประเภทงาน:</span> {{ job.j_type }}
          </div>
          <div class="mb-3">
            <i class="bi bi-cash-coin me-2 text-muted"></i>
            <span class="fw-semibold">ค่าจ้าง:</span> {{ formatSalary(job.j_salary) }} บาท
          </div>
          <div class="mb-3">
            <i class="bi bi-calendar-event me-2 text-muted"></i>
            <span class="fw-semibold">วันหมดเขต:</span> {{ formatDate(job.j_appdeadline) }}
          </div>
          <p><i class="bi bi-person-badge me-2"></i><strong>ผู้ว่าจ้าง:</strong> {{ job.employer_type || 'ไม่ระบุ' }}</p>
          <div class="mb-4">
            <i class="bi bi-card-text me-2 text-muted"></i>
            <span class="fw-semibold">รายละเอียดงาน:</span>
            <div
              class="bg-light p-3 mt-2 rounded text-muted"
              style="white-space: pre-wrap; line-height: 1.6;"
            >
              {{ job.j_description }}
            </div>
          </div>
        </div>

        <!-- Apply and Action Buttons Column -->
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
    </div>

    <!-- Popups (เหมือนเดิม) -->
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
import NavbarHome from "@/components/NavbarHome.vue";

export default {
  name: "JobDetail",
  components: { NavbarHome },
  data() {
    return {
      job: {},
      isLoggedIn: false,
      showPopup: false,
      sharePopup: false,
      showLoginPopup: false,
    };
  },
  mounted() {
    const jobId = this.$route.params.id;
    this.fetchJobDetails(jobId);

    const user = localStorage.getItem("user");
    try {
      const parsed = JSON.parse(user);
      this.isLoggedIn = !!parsed?.id;
    } catch {
      this.isLoggedIn = false;
    }
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
      return salary && !isNaN(salary) ? salary.toLocaleString() : "ไม่ระบุ";
    },
    async applyJob() {
      const user = localStorage.getItem("user");
      if (!user) {
        alert("⚠ กรุณาเข้าสู่ระบบก่อนสมัครงาน");
        this.$router.push("/login");
        return;
      }

      try {
        const parsedUser = JSON.parse(user);
        await axios.post("http://localhost:3001/api/applications", {
          jobId: this.job.job_id,
          userId: parsedUser.id,
        });
        alert("📨 สมัครงานสำเร็จ!");
      } catch (err) {
        console.error("❌ สมัครงานไม่สำเร็จ:", err);
        alert("เกิดข้อผลในการสมัครงาน กรุณาลองใหม่");
      }
    },
    saveJob() {
      if (!this.isLoggedIn) {
        this.showPopup = true;
        return;
      }
      alert("✅ บันทึกงานเรียบร้อย");
    },
    shareJob() {
      const shareUrl = this.shareUrl;
      if (navigator.share) {
        navigator
          .share({
            title: this.job.j_title,
            text: `ดูงานนี้ได้ที่: ${shareUrl}`,
            url: shareUrl,
          })
          .catch(() => alert("ไม่สามารถแชร์ได้ในอุปกรณ์นี้"));
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            this.sharePopup = true;
          })
          .catch(() => {
            alert("ไม่สามารถคัดลอกลิงก์ได้");
          });
      } else {
        alert("เบราว์เซอร์ของคุณไม่รองรับการแชร์หรือคัดลอกลิงก์");
      }
    },
    closePopup() {
      this.showPopup = false;
    },
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.popup-content {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 300px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
</style>
