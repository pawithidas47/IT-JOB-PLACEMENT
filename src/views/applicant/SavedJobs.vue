// ✅ SavedJobs.vue — แสดงงานที่บันทึกไว้
<template>
  <div class="container py-4">
    <h4 class="text-orange mb-3">📌 งานที่คุณบันทึกไว้</h4>
    <div v-if="savedJobs.length === 0">ยังไม่มีงานที่บันทึก</div>

    <div v-else class="job-grid">
      <div class="job-card p-4 bg-white border rounded-3 shadow-sm" v-for="job in savedJobs" :key="job.job_id">
        <h6 class="fw-bold text-orange">{{ job.j_title }}</h6>
        <p class="text-muted"><i class="bi bi-tags-fill me-1"></i> {{ job.j_type }}</p>
        <p class="text-muted"><i class="bi bi-cash-coin me-1"></i> {{ job.j_salary.toLocaleString() }} บาท</p>
        <router-link :to="`/jobs/${job.job_id}`" class="btn btn-sm btn-outline-primary mt-2">
          ดูรายละเอียด
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SavedJobs",
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
  transition: 0.3s ease;
}
</style>
