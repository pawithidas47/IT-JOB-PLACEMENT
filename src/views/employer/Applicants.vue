<template>
  <div>
    <NavbarEmployer />

    <div class="container py-5" style="max-width: 1000px">
      <h4 class="fw-bold text-orange mb-4">
        <i class="bi bi-person-lines-fill me-2"></i> ผู้สมัครงานทั้งหมด
      </h4>

      <div v-if="applicants.length === 0" class="text-muted text-center py-5">
        <i class="bi bi-person-x fs-1"></i>
        <p class="mt-2">ยังไม่มีผู้สมัครในงานของคุณ</p>
      </div>

      <div
        v-for="app in applicants"
        :key="app.application_id"
        class="card mb-4 shadow-sm rounded-4 border-0"
      >
        <div class="card-body">
          <div class="d-flex justify-content-between flex-wrap">
            <div>
              <h5 class="fw-bold text-dark">
                {{ app.a_firstname }} {{ app.a_lastname }}
              </h5>
              <p class="mb-1">
                <i class="bi bi-briefcase-fill me-2 text-orange"></i>
                <strong>งานที่สมัคร:</strong> {{ app.j_title }}
              </p>
              <p class="mb-1">
                <i class="bi bi-calendar-event me-2 text-muted"></i>
                สมัครเมื่อ: {{ formatDate(app.applied_at) }}
              </p>
              <p class="mb-1">
                <i class="bi bi-telephone-fill me-2 text-muted"></i>
                เบอร์โทร: {{ app.a_phone || '-' }}
              </p>
              <p class="mb-1">
                <i class="bi bi-envelope-fill me-2 text-muted"></i>
                อีเมล: {{ app.a_email || '-' }}
              </p>
            </div>

            <div class="d-flex flex-column align-items-end gap-2 mt-3">
              <span
                class="badge"
                :class="{
                  'bg-secondary': app.status === 'pending',
                  'bg-success': app.status === 'approved',
                  'bg-danger': app.status === 'rejected'
                }"
              >
                {{ statusText(app.status) }}
              </span>

              <select
                v-model="app.status"
                @change="updateStatus(app)"
                class="form-select form-select-sm"
                style="width: 160px"
              >
                <option value="pending">รอดำเนินการ</option>
                <option value="approved">อนุมัติ</option>
                <option value="rejected">ปฏิเสธ</option>
              </select>

              <a
                :href="`mailto:${app.a_email}`"
                class="btn btn-sm btn-outline-secondary rounded-pill"
              >
                📧 ติดต่อ
              </a>

              <router-link
                :to="`/applicant/${app.applicant_id}`"
                class="btn btn-sm btn-outline-primary rounded-pill"
              >
                ดูโปรไฟล์
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";

export default {
  name: "EmployerApplicants",
  components: { NavbarEmployer },
  data() {
    return {
      user: null,
      applicants: [],
    };
  },
  mounted() {
    const userData = localStorage.getItem("user");
    if (!userData) return this.$router.push("/login");
    this.user = JSON.parse(userData);
    this.fetchApplicants();
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    statusText(status) {
      switch (status) {
        case "approved":
          return "✅ อนุมัติแล้ว";
        case "rejected":
          return "❌ ปฏิเสธ";
        case "pending":
        default:
          return "⏳ รอดำเนินการ";
      }
    },
    async fetchApplicants() {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/employer/${this.user.employer_id}/applicants`
        );
        this.applicants = res.data;
      } catch (err) {
        console.error("❌ โหลดข้อมูลผู้สมัครล้มเหลว:", err);
      }
    },
    async updateStatus(app) {
      try {
        await axios.put(
          `http://localhost:3001/api/applications/${app.application_id}/status`,
          { status: app.status }
        );
      } catch (err) {
        console.error("❌ เปลี่ยนสถานะล้มเหลว:", err);
      }
    },
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
.card-body {
  padding: 1.5rem;
}
.badge {
  font-size: 0.85rem;
  padding: 0.4rem 0.75rem;
}
</style>
