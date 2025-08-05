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
          <select v-model="filter.sort" class="form-select custom-select" @change="applyFilter">
            <option value="latest">วันที่โพสต์ (ใหม่สุด)</option>
            <option value="salaryHigh">ค่าจ้าง (มากไปน้อย)</option>
            <option value="salaryLow">ค่าจ้าง (น้อยไปมาก)</option>
          </select>
        </div>
      </div>

      <div v-if="filteredJobs.length === 0" class="text-muted">ยังไม่มีงานที่ตรงกับเงื่อนไข</div>

      <div v-else class="job-grid">
        <div
          class="job-card position-relative"
          v-for="job in filteredJobs"
          :key="job.job_id"
        >
          <span class="posted-date">
            {{ new Date(job.j_posted_at).toLocaleDateString('th-TH') }}
          </span>

          <div class="d-flex align-items-center mb-3">
            <img
              :src="job.e_profile_img_url ? `http://localhost:3001${job.e_profile_img_url}` : '/default-profile.jpg'"
              alt="โลโก้บริษัท"
              class="rounded-circle shadow-sm me-3"
              style="width: 42px; height: 42px; object-fit: cover"
            />
            <div>
              <div class="fw-semibold">{{ job.e_company_name || 'ชื่อบริษัทไม่ระบุ' }}</div>
            </div>
          </div>

          <h5 class="fw-bold text-orange mb-2">
            {{ job.j_title }}
          </h5>

          <div v-if="job.j_type" class="mb-2">
            <span class="badge-category">
              {{ job?.j_type || '-' }}
            </span>
          </div>

          <p class="mb-1 text-muted">
            <i class="bi bi-people-fill me-1"></i>
            รับจำนวน: {{ job.j_amount || '-' }} คน
          </p>
          <p class="mb-1 text-muted">
            <i class="bi bi-cash-coin me-1"></i>
            ค่าจ้าง: {{ Number(job.j_salary).toLocaleString() }} บาท
          </p>

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
        sort: "latest"
      }
    };
  },
  mounted() {
    if (this.user?.applicant_id) {
      const key = `bookmarkedJobs_${this.user.applicant_id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        this.savedJobs = JSON.parse(saved);
        this.applyFilter();
      }
    }
  },
  methods: {
    applyFilter() {
      const { title, sort } = this.filter;
      let filtered = this.savedJobs.filter((job) => {
        return title === "" || job.j_title?.toLowerCase().includes(title.toLowerCase());
      });

      // Sorting
      if (sort === "latest") {
        filtered.sort((a, b) => new Date(b.j_posted_at) - new Date(a.j_posted_at));
      } else if (sort === "salaryHigh") {
        filtered.sort((a, b) => b.j_salary - a.j_salary);
      } else if (sort === "salaryLow") {
        filtered.sort((a, b) => a.j_salary - b.j_salary);
      }

      this.filteredJobs = filtered;
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  align-items: stretch;
}

.job-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: white;
  border: 1px solid #eee;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
  min-height: 320px;
  max-width: 100%;
  position: relative;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(255, 102, 0, 0.15);
}

.posted-date {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.75rem;
  color: #666;
}

.badge-category {
  background-color: #fff5e6;
  color: #ff6600;
  border: 1px solid #ff6600;
  border-radius: 999px;
  font-weight: 500;
  padding: 0.15rem 0.6rem;
  font-size: 15px;
}
</style>
