<template>
  <div>
    <NavbarApplicant />

    <div class="container py-4">
      <!-- หัวเรื่อง -->
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h4 class="fw-bold text-orange m-0 d-flex align-items-center">
          <i class="bi bi-bookmark-fill me-2"></i> งานที่คุณบันทึกไว้
        </h4>

        <!-- แถว “เรียงตาม” + ค้นหา -->
        <div class="d-flex align-items-center gap-2">
          <input
            v-model="filter.title"
            @input="applyFilter"
            class="form-control rounded-pill"
            placeholder="ค้นหาตามชื่องาน/บริษัท..."
            style="min-width: 260px"
          />

          <div class="d-flex align-items-center gap-2">
            <label class="mb-0 small text-muted">เรียงตาม</label>
            <select v-model="filter.sort" @change="applyFilter" class="form-select custom-pill">
              <option value="all">ทั้งหมด</option>
              <option value="latest">ล่าสุด</option>
              <option value="applied">สมัครแล้ว</option>
              <option value="not_applied">ยังไม่ได้สมัคร</option>
              <option value="salaryHigh">ค่าจ้าง: มาก→น้อย</option>
              <option value="salaryLow">ค่าจ้าง: น้อย→มาก</option>
            </select>
          </div>
        </div>
      </div>

      <p class="text-muted small mb-3">พบ {{ filteredJobs.length }} งาน</p>

      <!-- ว่างเปล่า -->
      <div v-if="filteredJobs.length === 0" class="text-muted">ยังไม่มีงานที่ตรงกับเงื่อนไข</div>

      <!-- กริดการ์ด -->
      <div v-else class="job-grid">
        <div
          class="job-card p-4 bg-white border rounded-3 shadow-sm position-relative"
          v-for="job in filteredJobs"
          :key="job.job_id"
        >
          <!-- ปุ่มมุมขวาบน -->
          <div class="card-meta">
            <!-- ป้ายสมัครแล้วบนสุด (ถ้าสมัคร) -->
            <span v-if="isApplied(job.job_id)" class="chip-applied me-2">สมัครแล้ว</span>

            <!-- ปุ่มลบ -->
            <button
              class="icon-btn danger"
              title="ลบออกจากที่บันทึก"
              @click.stop="removeJob(job.job_id)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <!-- โลโก้ + บริษัท -->
          <div class="d-flex align-items-center mb-3">
            <img
              :src="job.e_profile_img_url ? base + job.e_profile_img_url : '/default-profile.jpg'"
              alt="โลโก้บริษัท"
              class="rounded-circle shadow-sm me-3"
              style="width: 42px; height: 42px; object-fit: cover"
            />
            <div class="text-truncate">
              <div class="fw-semibold">{{ job.e_company_name || 'ชื่อบริษัทไม่ระบุ' }}</div>
            </div>
          </div>

          <!-- หัวข้อ -->
          <div class="d-flex align-items-center flex-wrap gap-2 mb-2">
            <h5 class="fw-bold text-dark mb-0">{{ job.j_title }}</h5>
          </div>

          <!-- หมวดหมู่ -->
          <div v-if="job.j_type" class="mb-2">
            <span class="badge-category">{{ job.j_type }}</span>
          </div>

          <!-- รายละเอียดสั้น -->
          <p class="mb-1 text-muted">
            <i class="bi bi-people-fill me-1"></i> รับจำนวน: {{ job.j_amount || '-' }} คน
          </p>
          <p class="mb-0 text-muted">
            <i class="bi bi-cash-coin me-1"></i>
            ค่าจ้าง: {{ formatMoney(job.j_salary) }} บาท
          </p>

          <!-- เวลาที่ผ่านมา -->
          <div class="ago-badge">
            {{ timeAgo(job.j_posted_at) }}
          </div>

          <!-- ปุ่มเข้าหน้ารายละเอียด -->
          <div class="mt-3">
            <router-link
              :to="`/applicant/jobs/${job.job_id}`"
              class="btn btn-sm btn-outline-primary rounded-pill px-3"
              title="ดูรายละเอียดงาน"
            >
              ดูรายละเอียด
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarApplicant from "@/components/NavbarApplicant.vue";

export default {
  name: "SavedJobs",
  components: { NavbarApplicant },
  data() {
    return {
      base: "http://localhost:3001",
      savedJobs: [],
      filteredJobs: [],
      appliedJobIds: [], // เก็บ job_id ที่สมัครแล้ว (ไม่นับที่ยกเลิก)
      user: JSON.parse(localStorage.getItem("user")),
      filter: {
        title: "",
        sort: "all", // all | latest | applied | not_applied | salaryHigh | salaryLow
      },
    };
  },
  mounted() {
    // โหลดงานที่บันทึกไว้จาก localStorage
    if (this.user?.applicant_id) {
      const key = `bookmarkedJobs_${this.user.applicant_id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        this.savedJobs = JSON.parse(saved);
      }
      this.fetchApplied();
      this.applyFilter();
    }
  },
  methods: {
    async fetchApplied() {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/applications/${this.user.applicant_id}`
        );
        // เก็บเฉพาะงานที่สถานะไม่ใช่ cancelled
        this.appliedJobIds = res.data
          .filter((app) => app.status !== "cancelled")
          .map((app) => Number(app.job_id));
        this.applyFilter();
      } catch (err) {
        console.error("❌ ดึงงานที่สมัครแล้วล้มเหลว:", err);
      }
    },
    isApplied(jobId) {
      return this.appliedJobIds.includes(Number(jobId));
    },
    applyFilter() {
      const kw = this.filter.title.trim().toLowerCase();

      // ค้นหาตามคำ
      let list = this.savedJobs.filter((job) => {
        if (!kw) return true;
        return (
          job.j_title?.toLowerCase().includes(kw) ||
          job.j_description?.toLowerCase().includes(kw) ||
          job.j_type?.toLowerCase().includes(kw) ||
          job.e_company_name?.toLowerCase().includes(kw)
        );
      });

      // กรองตาม “เรียงตาม”
      switch (this.filter.sort) {
        case "applied":
          list = list.filter((j) => this.isApplied(j.job_id));
          break;
        case "not_applied":
          list = list.filter((j) => !this.isApplied(j.job_id));
          break;
        case "latest":
          list.sort(
            (a, b) => new Date(b.j_posted_at) - new Date(a.j_posted_at)
          );
          break;
        case "salaryHigh":
          list.sort((a, b) => Number(b.j_salary) - Number(a.j_salary));
          break;
        case "salaryLow":
          list.sort((a, b) => Number(a.j_salary) - Number(b.j_salary));
          break;
        // "all" => ไม่ต้องทำอะไรเพิ่มเติม
      }

      this.filteredJobs = list;
    },
    removeJob(jobId) {
      const key = `bookmarkedJobs_${this.user.applicant_id}`;
      this.savedJobs = this.savedJobs.filter((j) => j.job_id !== jobId);
      localStorage.setItem(key, JSON.stringify(this.savedJobs));
      this.applyFilter();
    },
    formatMoney(n) {
      if (n == null || isNaN(n)) return "-";
      return Number(n).toLocaleString("th-TH", { maximumFractionDigits: 0 });
    },
    timeAgo(input) {
      if (!input) return "";
      const d = new Date(input);
      if (isNaN(d)) return "";
      const now = new Date();
      let diff = Math.floor((now - d) / 1000);

      const units = [
        { sec: 31536000, name: "ปี" },
        { sec: 2592000, name: "เดือน" },
        { sec: 604800, name: "สัปดาห์" },
        { sec: 86400, name: "วัน" },
        { sec: 3600, name: "ชั่วโมง" },
        { sec: 60, name: "นาที" },
        { sec: 1, name: "วินาที" },
      ];

      for (const u of units) {
        const val = Math.floor(diff / u.sec);
        if (val >= 1) return `${val} ${u.name}ที่ผ่านมา`;
      }
      return "เมื่อสักครู่ที่ผ่านมา";
    },
  },
};
</script>

<style scoped>
.text-orange { color: #ff6600; }

/* หัวข้อค้นหา/เรียงตาม */
.form-control { border-radius: 999px; }

.custom-pill {
  width: 220px;
  height: 38px;
  font-size: 14px;
  border-radius: 999px;
  border: 1px solid #ddd;
  background: #fff;
}

/* กริดการ์ด */
.job-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 1200px) {
  .job-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .job-grid { grid-template-columns: 1fr; }
}

/* Card เหมือนหน้ารายการงาน */
.job-card {
  border-radius: 12px;
  background: #fff;
  transition: transform .2s ease, box-shadow .2s ease;
  box-shadow: 0 6px 18px rgba(0,0,0,.06);
  position: relative;
}
.job-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.08); }

/* มุมขวาบน */
.card-meta{
  position:absolute; top:12px; right:12px;
  display:flex; align-items:center; gap:8px;
}

/* ปุ่มไอคอน */
.icon-btn{
  width:36px;height:36px;border-radius:999px;border:1px solid #e5e5e5;background:#fff;
  display:inline-flex;align-items:center;justify-content:center;transition:all .15s ease;
}
.icon-btn i{ font-size:16px; color:#6b7280; }
.icon-btn:hover{ transform:translateY(-1px); box-shadow:0 4px 16px rgba(0,0,0,.08); }
.icon-btn.danger{ border-color:#f5c2c7; background:#fff5f6; }
.icon-btn.danger i{ color:#dc3545; }

/* ป้ายหมวดหมู่ */
.badge-category {
  background-color: #fff5e6; color: #ff6600; border: 1px solid #ff6600;
  border-radius: 999px; font-weight: 500; padding: .15rem .6rem; font-size: 14px;
}

/* ป้าย “สมัครแล้ว” */
.chip-applied{
  font-size:12px; padding:2px 10px; border-radius:999px;
  border:1px solid #28a745; color:#1f8b37; background:#eaf8ef;
}

/* เวลาที่ผ่านมา */
.ago-badge{
  position:absolute; right:12px; bottom:10px; font-size:12px; color:#6b7280;
  background:#f3f4f6; padding:4px 10px; border-radius:999px; box-shadow: inset 0 1px 0 rgba(255,255,255,.6);
}
</style>
