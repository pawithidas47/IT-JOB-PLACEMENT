<template>
  <div>
    <NavbarEmployer />
    <div class="container py-5" style="max-width: 1000px">
      <h4 class="fw-bold text-orange mb-4">
        <i class="bi bi-person-lines-fill me-2"></i> ผู้สมัครงานทั้งหมด
      </h4>

      <!-- ไม่มีผู้สมัคร -->
      <div v-if="applicants.length === 0" class="text-muted text-center py-5">
        <i class="bi bi-person-x fs-1"></i>
        <p class="mt-2">ยังไม่มีผู้สมัครในงานของคุณ</p>
      </div>

      <!-- Card ผู้สมัคร -->
      <div v-for="app in applicants" :key="app.application_id"
        class="card mb-4 p-3 shadow-sm rounded-4 border-0 d-flex flex-row gap-3 align-items-center flex-wrap">

        <!-- รูปโปรไฟล์ -->
        <img :src="app.profileImage" class="rounded-circle border" style="width: 80px; height: 80px; object-fit: cover"
          alt="profile" />

        <!-- ข้อมูล -->
        <div class="flex-grow-1">
          <h5 class="fw-bold mb-1">{{ app.a_firstname }} {{ app.a_lastname }}</h5>
          <p class="mb-1">
            <i class="bi bi-briefcase-fill me-2 text-orange"></i><strong>งาน:</strong> {{ app.j_title }}
          </p>
          <p class="mb-1 text-muted small">
            <i class="bi bi-calendar-event me-2"></i> สมัครเมื่อ: {{ formatDate(app.applied_at) }}
          </p>
          <p class="mb-1 text-muted small">
            <i class="bi bi-telephone-fill me-2"></i> {{ app.a_phone || '-' }} |
            <i class="bi bi-envelope-fill ms-3 me-2"></i> {{ app.a_email || '-' }}
          </p>
        </div>

        <!-- ปุ่ม Action -->
        <div class="d-flex flex-column align-items-end gap-2">
          <span class="badge rounded-pill px-3 py-2" :class="{
            'bg-secondary': app.status === 'pending',
            'bg-success': app.status === 'approved',
            'bg-danger': app.status === 'rejected'
          }">
            {{ statusText(app.status) }}
          </span>

          <select v-model="app.status" @change="updateStatus(app)" class="form-select form-select-sm">
            <option value="pending">รอดำเนินการ</option>
            <option value="approved">อนุมัติ</option>
            <option value="rejected">ปฏิเสธ</option>
          </select>

          <div class="d-flex gap-2 mt-1">
            <a :href="`mailto:${app.a_email}`" class="btn btn-outline-secondary btn-sm">📧</a>
            <router-link :to="{
              name: 'EmployerApplicantProfile',
              query: {
                applicant_id: app.applicant_id,
                application_id: app.application_id
              }
            }" class="btn btn-sm btn-outline-primary rounded-pill">
              ดูโปรไฟล์
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";
import defaultProfile from "@/assets/default-profile.png";

export default {
  name: "EmployerApplicants",
  components: { NavbarEmployer },
  data() {
    return {
      user: null,
      applicants: [],
      defaultProfile, // ✅ รูป fallback
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
        const res = await axios.get(`http://localhost:3001/api/employer/${this.user.employer_id}/applicants`);
        // ✅ map เพื่อเพิ่ม profileImage ให้แต่ละผู้สมัคร
        this.applicants = res.data.map(app => ({
          ...app,
          profileImage: app.profile_img_url
            ? `http://localhost:3001${app.profile_img_url}`
            : this.defaultProfile
        }));
      } catch (err) {
        console.error("❌ โหลดข้อมูลผู้สมัครล้มเหลว:", err);
      }
    },
   async updateStatus(app) {
  try {
    await axios.put(
      `http://localhost:3001/api/employer/applications/${app.application_id}/status`,
      { status: app.status },
      { headers: { "Content-Type": "application/json" } } // ✅ ระบุ content-type
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

.card {
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(255, 102, 0, 0.1);
}

.badge {
  font-size: 0.8rem;
}
</style>
