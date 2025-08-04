<template>
  <div>
    <NavbarEmployer />

    <div class="container py-5" style="max-width: 1000px">
      <h4 class="fw-bold text-orange mb-4">
        <i class="bi bi-person-lines-fill me-2"></i> ผู้สมัครงานทั้งหมด
      </h4>

      <!-- ค้นหา -->
      <div class="mb-4 d-flex gap-3">
        <input v-model="searchQuery" class="form-control rounded-pill" placeholder="🔍 ค้นหาชื่อหรือตำแหน่ง" />
        <select v-model="sortOption" class="form-select rounded-pill" style="max-width: 200px">
          <option value="date">📅 ใหม่สุด</option>
          <option value="status">📌 ตามสถานะ</option>
        </select>
      </div>

      <!-- ไม่มีผู้สมัคร -->
      <div v-if="filteredApplicants.length === 0" class="text-muted text-center py-5">
        <i class="bi bi-person-x fs-1"></i>
        <p class="mt-2">ยังไม่มีผู้สมัครที่ตรงกับเงื่อนไข</p>
      </div>

      <!-- การ์ดผู้สมัคร -->
      <div
        v-for="app in filteredApplicants"
        :key="app.application_id"
        class="card p-4 shadow-sm rounded-4 border-0 d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 mb-4"
      >
        <!-- รูปโปรไฟล์ -->
        <img
          :src="app.profileImage"
          class="rounded-circle border"
          style="width: 80px; height: 80px; object-fit: cover"
          alt="profile"
        />

        <!-- ข้อมูล -->
        <div class="flex-grow-1">
          <h5 class="fw-bold mb-1">{{ app.applicant.a_firstname }} {{ app.applicant.a_lastname }}</h5>
          <p class="mb-1">
            <i class="bi bi-briefcase-fill me-2 text-orange"></i>
            <strong>งาน:</strong> {{ app.j_title }}
          </p>
          <p class="mb-1 text-muted small">
            <i class="bi bi-calendar-event me-2"></i> สมัครเมื่อ: {{ formatDate(app.applied_at) }}
          </p>
          <p class="mb-0 text-muted small">
            <i class="bi bi-telephone-fill me-2"></i> {{ app.applicant.a_phone || '-' }}
            <span class="mx-2">|</span>
            <i class="bi bi-envelope-fill me-2"></i> {{ app.applicant.a_email || '-' }}
          </p>

          <!-- Notes -->
          <textarea v-model="app.notes" class="form-control form-control-sm mt-2" rows="1" placeholder="🧾 หมายเหตุส่วนตัว..."></textarea>
        </div>

        <!-- Action -->
        <div class="d-flex flex-column align-items-md-end gap-2">
          <span
            class="badge px-3 py-2 text-white"
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
            class="form-select form-select-sm rounded-pill"
          >
            <option value="pending">รอดำเนินการ</option>
            <option value="approved">อนุมัติ</option>
            <option value="rejected">ปฏิเสธ</option>
          </select>

          <router-link
            :to="{
              name: 'EmployerApplicantProfile',
              params: { id: app.applicant.applicant_id }
            }"
            class="btn btn-sm btn-outline-primary rounded-pill"
          >
            ดูโปรไฟล์
          </router-link>

          <!-- Resume -->
          <a
            v-if="app.resume_url"
            :href="`http://localhost:3001${app.resume_url}`"
            target="_blank"
            class="btn btn-sm btn-outline-secondary rounded-pill"
          >📄 Resume</a>

          <!-- ลบ -->
          <button @click="deleteApplicant(app.application_id)" class="btn btn-sm btn-outline-danger rounded-pill">
             ลบผู้สมัคร
          </button>
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
      defaultProfile,
      searchQuery: "",
      sortOption: "date",
    };
  },
  computed: {
    filteredApplicants() {
      let filtered = this.applicants.filter((a) => {
        const name = `${a.applicant.a_firstname} ${a.applicant.a_lastname}`.toLowerCase();
        const title = a.j_title.toLowerCase();
        return (
          name.includes(this.searchQuery.toLowerCase()) ||
          title.includes(this.searchQuery.toLowerCase())
        );
      });

      if (this.sortOption === "date") {
        filtered.sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at));
      } else if (this.sortOption === "status") {
        filtered.sort((a, b) => a.status.localeCompare(b.status));
      }

      return filtered;
    },
  },
  mounted() {
    const userData = localStorage.getItem("user");
    if (!userData) return this.$router.push("/login");
    this.user = JSON.parse(userData);
    this.fetchApplicants();
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return isNaN(date)
        ? "-"
        : date.toLocaleDateString("th-TH", {
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
          `http://localhost:3001/api/employers/${this.user.employer_id}/applicants`
        );
        this.applicants = res.data.map((app) => ({
          ...app,
          status: app.status || "pending",
          profileImage: app.applicant?.profile_img_url
            ? `http://localhost:3001${app.applicant.profile_img_url}`
            : this.defaultProfile,
          resume_url: app.resume_url || null,
          notes: ""
        }));
      } catch (err) {
        console.error("❌ โหลดข้อมูลผู้สมัครล้มเหลว:", err);
      }
    },
    async updateStatus(app) {
      try {
        await axios.put(
          `http://localhost:3001/api/employer/applications/${app.application_id}/status`,
          { app_status: app.status },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("✅ เปลี่ยนสถานะสำเร็จ");
        await this.fetchApplicants();
      } catch (err) {
        console.error("❌ เปลี่ยนสถานะล้มเหลว:", err.response?.data || err.message);
      }
    },
    async deleteApplicant(applicationId) {
      if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้สมัครนี้?")) return;
      try {
        await axios.delete(
  `http://localhost:3001/api/applications/${applicationId}`
);

        this.applicants = this.applicants.filter(a => a.application_id !== applicationId);
        console.log("🗑 ลบสำเร็จ");
      } catch (err) {
        console.error("❌ ลบไม่สำเร็จ:", err);
      }
    }
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
  box-shadow: 0 8px 24px rgba(255, 102, 0, 0.12);
}
.badge {
  font-size: 0.8rem;
  min-width: 120px;
  text-align: center;
}
select.form-select-sm {
  min-width: 160px;
}
</style>