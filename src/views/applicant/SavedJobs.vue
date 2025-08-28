<template>  
  <div>
    <NavbarApplicant />

    <div class="container py-4">
      <!-- บรรทัดหัวเรื่อง -->
      <div class="toolbar-top">
        <h4 class="title">
          <i class="bi bi-bookmark-fill"></i> งานที่คุณบันทึกไว้
        </h4>
      </div>

      <!-- บรรทัดที่ 2: พบ X งาน + ช่องค้นหา + เรียงตาม (บรรทัดเดียว) -->
      <div class="toolbar-sub">
        <div class="left">
          <span class="result-count">พบ {{ filteredJobs.length }} งาน</span>
        </div>

        <div class="right">
          <!-- Search -->
          <div class="search-pill">
            <i class="bi bi-search"></i>
            <input
              v-model.trim="filter.title"
              @input="onSearchInput"
              class="search-input"
              type="search"
              placeholder="ค้นหาตามชื่องาน/บริษัท…"
              aria-label="ค้นหางานที่บันทึกไว้"
            />
            <button
              v-if="filter.title"
              class="clear-btn"
              @click="clearSearch"
              aria-label="ล้างคำค้น"
              title="ล้างคำค้น"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Sort (label + select ต้องอยู่บรรทัดเดียว) -->
          <div class="sort-group">
            <span class="sort-label">เรียงตาม</span>
            <select
              v-model="filter.sort"
              @change="applyFilter"
              class="form-select rounded-pill sort-select"
              aria-label="เรียงตาม"
            >
             
              <option value="all">ทั้งหมด</option>
              <option value="savedLatest">บันทึกล่าสุด</option>
              <option value="applied">สมัครแล้ว</option>
              <option value="not_applied">ยังไม่ได้สมัคร</option>
              <option value="salaryHigh">ค่าจ้าง: มาก→น้อย</option>
              <option value="salaryLow">ค่าจ้าง: น้อย→มาก</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ว่างเปล่า -->
      <div v-if="filteredJobs.length === 0" class="empty-state">
        <i class="bi bi-inbox"></i>
        <div class="mt-1">ยังไม่มีงานที่ตรงกับเงื่อนไข</div>
      </div>

      <!-- กริดการ์ด -->
      <div v-else class="job-grid">
        <router-link
          v-for="job in filteredJobs"
          :key="job.job_id"
          :to="`/applicant/jobs/${job.job_id}`"
          class="job-card p-4 bg-white border rounded-3 shadow-sm position-relative"
        >
          <div class="card-meta" @click.stop>
            <span v-if="isApplied(job.job_id)" class="chip-applied me-2">สมัครแล้ว</span>
            <button
              class="icon-btn danger"
              title="ลบออกจากที่บันทึก"
              @click.stop.prevent="removeJob(job.job_id)"
              aria-label="ลบงานที่บันทึก"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>

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

          <h5 class="fw-bold text-dark mb-2 line-clamp-1">{{ job.j_title }}</h5>

          <div v-if="job.j_type" class="mb-2">
            <span class="badge-category">{{ job.j_type }}</span>
          </div>

          <p class="mb-1 text-muted">
            <i class="bi bi-people-fill me-1"></i> รับจำนวน: {{ job.j_amount || '-' }} คน
          </p>
          <p class="mb-0 text-muted">
            <i class="bi bi-cash-coin me-1"></i>
            ค่าจ้าง: {{ formatMoney(job.j_salary) }} บาท
          </p>

          <div class="ago-badge">
            {{ timeAgo(job.j_posted_at) }}
          </div>
        </router-link>
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
      savedJobs: [],        // จะถูกจัดลำดับเป็น "บันทึกล่าสุด" ตั้งแต่ mounted()
      filteredJobs: [],
      appliedJobIds: [],
      user: JSON.parse(localStorage.getItem("user")),
      // ดรอปดาวแสดง "ทั้งหมด" แต่ลิสต์ฐานจะเรียง "บันทึกล่าสุด" อยู่แล้ว
      filter: { title: "", sort: "all" },
      searchTimer: null, // debounce
    };
  },
  mounted() {
    if (this.user?.applicant_id) {
      const key = `bookmarkedJobs_${this.user.applicant_id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        this.savedJobs = JSON.parse(saved).map((j, i) => ({ ...j, __savedIndex: i }));
        this.sortSavedLatest(true);
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
        this.appliedJobIds = res.data
          .filter((app) => app.status !== "cancelled")
          .map((app) => Number(app.job_id));
        this.applyFilter();
      } catch (err) {
        console.error("❌ ดึงงานที่สมัครแล้วล้มเหลว:", err);
      }
    },
    isApplied(jobId) { return this.appliedJobIds.includes(Number(jobId)); },

    onSearchInput() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(this.applyFilter, 250);
    },
    clearSearch() { this.filter.title = ""; this.applyFilter(); },

    sortSavedLatest(mutateBase = false) {
      const cmp = (a, b) => {
        const ta = a.bookmarked_at ? new Date(a.bookmarked_at).getTime() : a.__savedIndex ?? 0;
        const tb = b.bookmarked_at ? new Date(b.bookmarked_at).getTime() : b.__savedIndex ?? 0;
        return tb - ta; // ใหม่ก่อน
      };
      if (mutateBase) this.savedJobs.sort(cmp);
      else this.filteredJobs.sort(cmp);
    },

    applyFilter() {
      const kw = this.filter.title.trim().toLowerCase();

      let list = this.savedJobs.filter((job) => {
        if (!kw) return true;
        const fields = [
          job.j_title || "",
          job.e_company_name || "",
          job.j_type || "",
          job.j_description || "",
        ].map((s) => s.toLowerCase());
        if (fields.some((s) => s.startsWith(kw))) return true;
        return fields.some((s) => s.includes(kw));
      });

      switch (this.filter.sort) {
        case "savedLatest":
          list.sort((a, b) => {
            const ta = a.bookmarked_at ? new Date(a.bookmarked_at).getTime() : a.__savedIndex ?? 0;
            const tb = b.bookmarked_at ? new Date(b.bookmarked_at).getTime() : b.__savedIndex ?? 0;
            return tb - ta;
          });
          break;
        case "applied":
          list = list.filter((j) => this.isApplied(j.job_id));
          break;
        case "not_applied":
          list = list.filter((j) => !this.isApplied(j.job_id));
          break;
        case "latest":
          list.sort((a, b) => new Date(b.j_posted_at) - new Date(a.j_posted_at));
          break;
        case "salaryHigh":
          list.sort((a, b) => Number(b.j_salary) - Number(a.j_salary));
          break;
        case "salaryLow":
          list.sort((a, b) => Number(a.j_salary) - Number(b.j_salary));
          break;
        // case "all": คงลำดับฐาน (บันทึกล่าสุด)
      }

      this.filteredJobs = list;
    },

    removeJob(jobId) {
      const key = `bookmarkedJobs_${this.user.applicant_id}`;
      this.savedJobs = this.savedJobs.filter((j) => j.job_id !== jobId);
      localStorage.setItem(key, JSON.stringify(this.savedJobs));
      this.sortSavedLatest(true);
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
/* หัวข้อ */
.toolbar-top{ margin-bottom:6px; }
.title{
  margin:0; font-weight:800; color:#ff6600; display:flex; align-items:center; gap:8px;
}

/* บรรทัด “พบงาน + ฟิลเตอร์” */
.toolbar-sub{
  display:flex; align-items:center; justify-content:space-between;
  gap:12px; flex-wrap:wrap; margin-bottom:8px;
}
.result-count{ color:#6b7280; font-size:.9rem; }
.right{
  display:flex; align-items:center; gap:12px; flex-wrap:wrap;
}

/* Search pill */
.search-pill{
  position:relative; display:flex; align-items:center;
  background:#fff; border:1px solid #e5e7eb; border-radius:999px;
  padding:6px 40px 6px 36px; min-width:280px;
}
.search-pill i.bi-search{ position:absolute; left:12px; font-size:16px; color:#9ca3af; }
.search-input{ border:none; outline:none; width:100%; font-size:14px; background:transparent; }
.clear-btn{
  position:absolute; right:8px; width:28px; height:28px; border-radius:999px;
  border:1px solid #e5e7eb; background:#fff; display:flex; align-items:center; justify-content:center;
}
.clear-btn i{ font-size:12px; color:#6b7280; }
.clear-btn:hover{ background:#f9fafb; }

/* Sort (label + select อยู่บรรทัดเดียวเสมอ) */
.sort-group{ display:flex; align-items:center; gap:8px; white-space:nowrap; }
.sort-label{ color:#6b7280; font-size:.92rem; white-space:nowrap; } /* กันขึ้นบรรทัดใหม่ */
.sort-select{
  min-width:200px; height:38px; font-size:14px; border:1px solid #ddd;
  padding-left:16px; padding-right:36px; background:#fff; appearance:auto;
}

/* กริดการ์ด */
.job-grid{ display:grid; grid-template-columns:repeat(3, 1fr); gap:24px; margin-top:12px; }
@media (max-width: 1200px){ .job-grid{ grid-template-columns:repeat(2, 1fr); } }
@media (max-width: 768px){
  .job-grid{ grid-template-columns:1fr; }
  .search-pill{ flex:1; min-width:0; }
}

/* การ์ดงาน */
.job-card{
  display:block; height:210px; border-radius:12px; background:#fff;
  transition:transform .2s ease, box-shadow .2s ease; box-shadow:0 6px 18px rgba(0,0,0,.06);
  position:relative; text-decoration:none; color:inherit;
}
.job-card:hover{ transform:translateY(-2px); box-shadow:0 10px 24px rgba(0,0,0,.08); }
.card-meta{ position:absolute; top:12px; right:12px; display:flex; align-items:center; gap:8px; }

/* ปุ่มไอคอน */
.icon-btn{
  width:36px; height:36px; border-radius:999px; border:1px solid #e5e5e5; background:#fff;
  display:inline-flex; align-items:center; justify-content:center; transition:all .15s ease;
}
.icon-btn i{ font-size:16px; color:#6b7280; }
.icon-btn:hover{ transform:translateY(-1px); box-shadow:0 4px 16px rgba(0,0,0,.08); }
.icon-btn.danger{ border-color:#f5c2c7; background:#fff5f6; }
.icon-btn.danger i{ color:#dc3545; }

/* แถบ/ป้ายต่าง ๆ */
.badge-category{
  background:#fff5e6; color:#ff6600; border:1px solid #ff6600;
  border-radius:999px; font-weight:500; padding:.15rem .6rem; font-size:14px;
}
.chip-applied{
  font-size:12px; padding:2px 10px; border-radius:999px;
  border:1px solid #28a745; color:#1f8b37; background:#eaf8ef;
}
.ago-badge{
  position:absolute; right:12px; bottom:10px; font-size:12px; color:#6b7280;
  background:#f3f4f6; padding:4px 10px; border-radius:999px; box-shadow:inset 0 1px 0 rgba(255,255,255,.6);
}

/* สถานะว่าง */
.empty-state{ display:flex; align-items:center; gap:8px; color:#6b7280; padding:16px 0; }
.empty-state i{ font-size:18px; }
.line-clamp-1{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
</style>
