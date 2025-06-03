<template>
  <div>
    <!-- Navbar -->
    <div class="nav-wrapper">
      <span class="brand-title">IT job placement @Mor-Nor</span>
      <div class="nav-top-right">
        <router-link to="/" class="top-link" exact-active-class="active-link">หางาน</router-link>
        <router-link to="/login" class="top-link" exact-active-class="active-link">เข้าสู่ระบบ</router-link>
        <router-link to="/register/employer" class="top-link" exact-active-class="active-link">สำหรับผู้ว่าจ้าง</router-link>
      </div>
    </div>

    <!-- Job Detail -->
    <div class="container mt-5 d-flex flex-column align-items-center justify-content-center text-center">
      <div class="card shadow-sm p-5 border-0 rounded-4" style="max-width: 720px; width: 100%;">
        <h3 class="mb-4 text-orange fw-bold"><i class="bi bi-briefcase-fill me-2"></i>{{ job.j_title }}</h3>

        <div class="mb-3 text-start">
          <i class="bi bi-tags-fill me-2 text-muted"></i>
          <span class="fw-semibold">ประเภทงาน:</span> {{ job.j_type }}
        </div>
        <div class="mb-3 text-start">
          <i class="bi bi-card-text me-2 text-muted"></i>
          <span class="fw-semibold">รายละเอียดงาน:</span>
          <div class="bg-light p-3 mt-1 rounded" style="white-space: pre-wrap">{{ job.j_description }}</div>
        </div>
        <div class="mb-3 text-start">
          <i class="bi bi-cash-coin me-2 text-muted"></i>
          <span class="fw-semibold">ค่าจ้าง:</span> {{ formatSalary(job.j_salary) }} บาท
        </div>
        <div class="mb-4 text-start">
          <i class="bi bi-calendar-event me-2 text-muted"></i>
          <span class="fw-semibold">วันหมดเขต:</span> {{ formatDate(job.j_appdeadline) }}
        </div>

        <!-- Button Area -->
        <div class="mt-5 text-center">
          <router-link
            v-if="!isLoggedIn"
            to="/login"
            class="btn text-white fw-bold d-inline-flex align-items-center justify-content-center"
            style="background: linear-gradient(135deg,#ff6600,#e55d00); border-radius: 12px; height: 48px; font-size: 16px; padding: 0 24px; box-shadow: 0 2px 10px rgba(255, 102, 0, 0.3); min-width: 280px;"
          >
            <i class="bi bi-person-plus me-2"></i>
            เข้าสู่ระบบก่อนสมัครงาน
          </router-link>

          <button
            v-else
            class="btn text-white fw-bold d-inline-flex align-items-center justify-content-center"
            style="background: linear-gradient(135deg,#ff6600,#e55d00); border-radius: 12px; height: 48px; font-size: 16px; padding: 0 24px; box-shadow: 0 2px 10px rgba(255, 102, 0, 0.3); min-width: 280px;"
            @click="applyJob"
          >
            <i class="bi bi-check2-circle me-2"></i>
            สมัครงาน
          </button>
        </div>
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
      isLoggedIn: false,
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
        alert("เกิดข้อผิดพลาดในการสมัครงาน กรุณาลองใหม่");
      }
    },
  },
};
</script>

<style scoped>
.nav-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 4px solid #ff6600;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff6600;
}

.nav-top-right {
  display: flex;
  gap: 20px;
}

.top-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  position: relative;
}

.top-link::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  height: 3px;
  width: 0%;
  background-color: #ff6600;
  transition: width 0.3s;
}

.top-link:hover::after,
.active-link::after {
  width: 60%;
}

.text-orange {
  color: #ff6600;
}
</style>