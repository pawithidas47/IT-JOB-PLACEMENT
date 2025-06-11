<template>
  <div>
    <NavbarApplicant />

    <div class="container py-4">
      <h4 class="fw-bold text-orange d-flex align-items-center mb-3">
        <i class="bi bi-bookmark-fill me-2"></i> งานที่คุณบันทึกไว้
      </h4>

      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <p class="text-muted mb-0 small">พบ {{ filteredJobs.length }} งาน</p>
        <div class="d-flex gap-2">
          <input v-model="filter.title" class="form-control rounded-pill" placeholder="ค้นหาตามชื่อ..." @input="applyFilter" />
          <select v-model="filter.status" class="form-select custom-select" @change="applyFilter">
            <option value="">ทั้งหมด</option>
            <option value="active">ยังเปิดรับสมัคร</option>
            <option value="expired">ปิดรับสมัครแล้ว</option>
          </select>
        </div>
      </div>

      <div v-if="filteredJobs.length === 0" class="text-muted">ยังไม่มีงานที่ตรงกับเงื่อนไข</div>

      <div v-else class="job-grid">
        <div
          class="job-card p-4 bg-white border rounded-4 shadow-sm d-flex flex-column justify-content-between"
          v-for="job in filteredJobs"
          :key="job.job_id"
        >
          <div>
            <h6 class="fw-bold text-orange mb-2">
              <i class="bi bi-briefcase-fill me-2"></i> {{ job.j_title }}
            </h6>
            <p class="mb-1 text-muted"><i class="bi bi-tags-fill me-1"></i> ประเภทงาน: {{ job.j_type }}</p>
            <p class="mb-1 text-muted"><i class="bi bi-cash-coin me-1"></i> ค่าจ้าง: {{ job.j_salary.toLocaleString() }} บาท</p>
            <p class="mb-1 text-muted"><i class="bi bi-person-badge me-1"></i> ผู้ว่าจ้าง: {{ job.employer_type || 'ไม่ระบุ' }}</p>
            <p class="mb-1 text-muted"><i class="bi bi-clock me-1"></i> โพสต์เมื่อ: {{ new Date(job.j_posted_at).toLocaleDateString('th-TH') }}</p>
            <p class="mb-1 text-muted"><i class="bi bi-calendar-event me-1"></i> หมดเขต: {{ new Date(job.j_appdeadline).toLocaleDateString('th-TH') }}</p>
          </div>

          <div class="d-flex justify-content-between align-items-end mt-3">
            <router-link
              :to="`/applicant/jobs/${job.job_id}`"
              class="btn btn-sm btn-outline-primary rounded-pill px-3"
            >
              ดูรายละเอียด
            </router-link>

            <button
              class="btn btn-sm btn-outline-danger rounded-pill px-3"
              @click="removeJob(job.job_id)"
            >
              <i class="bi bi-trash me-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarApplicant from "@/components/NavbarApplicant.vue";

export default {
  name: "SavedJobs",
  components: { NavbarApplicant },
  data() {
    return {
      savedJobs: [],
      filteredJobs: [],
      user: JSON.parse(localStorage.getItem("user")),
      filter: {
        title: "",
        status: ""
      }
    };
  },
  mounted() {
    if (this.user?.applicant_id) {
      const key = `bookmarkedJobs_${this.user.applicant_id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        this.savedJobs = JSON.parse(saved);
        this.filteredJobs = [...this.savedJobs];
      }
    }
  },
  methods: {
    applyFilter() {
      const { title, status } = this.filter;
      const now = new Date();
      this.filteredJobs = this.savedJobs.filter((job) => {
        const titleMatch = title === "" || job.j_title?.toLowerCase().includes(title.toLowerCase());
        const statusMatch =
          status === "" ||
          (status === "active" && new Date(job.j_appdeadline) >= now) ||
          (status === "expired" && new Date(job.j_appdeadline) < now);
        return titleMatch && statusMatch;
      });
    },
    removeJob(jobId) {
      const key = `bookmarkedJobs_${this.user.applicant_id}`;
      this.savedJobs = this.savedJobs.filter(job => job.job_id !== jobId);
      this.filteredJobs = this.filteredJobs.filter(job => job.job_id !== jobId);
      localStorage.setItem(key, JSON.stringify(this.savedJobs));
    },
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}

.custom-select,
.form-control {
  border-radius: 999px !important;
  padding: 0.45rem 1.25rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  min-width: 200px;
  max-width: 380px;
}

.job-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.job-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%; /* ใช้กับ grid แล้วจะสูงเท่ากัน */
  max-width: 320px; 
  
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 24px rgba(255, 102, 0, 0.2);
}
</style>