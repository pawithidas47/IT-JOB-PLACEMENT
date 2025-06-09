<template>
  <div>
    <NavbarApplicant />

    <div class="container py-4">
      <h4 class="mb-4 fw-bold text-orange d-flex align-items-center">
        <i class="bi bi-bookmark-fill me-2"></i> งานที่คุณบันทึกไว้
      </h4>

      <div v-if="savedJobs.length === 0" class="text-muted">ยังไม่มีงานที่บันทึก</div>

      <div v-else class="job-grid">
        <div
          class="job-card p-4 bg-white border rounded-4 shadow-sm position-relative"
          v-for="job in savedJobs"
          :key="job.job_id"
        >
          <h6 class="fw-bold text-orange mb-2">
            <i class="bi bi-briefcase-fill me-2"></i> {{ job.j_title }}
          </h6>
          <p class="mb-1 text-muted"><i class="bi bi-tags-fill me-1"></i> {{ job.j_type }}</p>
          <p class="mb-1 text-muted"><i class="bi bi-cash-coin me-1"></i> {{ job.j_salary.toLocaleString() }} บาท</p>
          <p class="mb-1 text-muted"><i class="bi bi-person-badge me-1"></i> {{ job.employer_type || 'ไม่ระบุ' }}</p>
          <div class="d-flex justify-content-between mt-3">
            <router-link
              :to="`/applicant/jobs/${job.job_id}`"
              class="btn btn-sm btn-outline-primary rounded-pill px-3"
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
import NavbarApplicant from "@/components/NavbarApplicant.vue";

export default {
  name: "SavedJobs",
  components: { NavbarApplicant },
  data() {
    return {
      savedJobs: [],
    };
  },
  mounted() {
    const saved = localStorage.getItem("bookmarkedJobs");
    if (saved) {
      this.savedJobs = JSON.parse(saved);
    }
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}

.job-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.job-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 24px rgba(255, 102, 0, 0.2);
}
</style>
