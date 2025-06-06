<template>
  <div>
    <NavbarApplicant />

    <div class="container py-4">
      <!-- Header & Filter -->
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h5 class="fw-bold mb-0 text-dark">
          <i class="bi bi-clock-fill me-2 text-orange"></i>
          ตรวจสอบประวัติการสมัครงาน
        </h5>

        <div class="d-flex align-items-center gap-2 flex-nowrap" style="white-space: nowrap;">
          <label class="mb-0 fw-semibold text-secondary">เรียงตาม:</label>
          <select v-model="selectedStatus" class="custom-select">
  <option value="">ทั้งหมด</option>
  <option value="pending">รอพิจารณา</option>
  <option value="accepted">รอการติดต่อ</option>
  <option value="rejected">ถูกปฏิเสธ</option>
  <option value="cancelled">ยกเลิกแล้ว</option>
</select>

        </div>
      </div>

      <!-- Table -->
      <div class="table-responsive rounded-4 shadow-sm bg-white">
        <table class="table table-hover table-bordered align-middle text-center mb-0">
          <thead class="table-light text-uppercase small text-secondary">
            <tr>
              <th>ชื่องาน</th>
              <th>ประเภท</th>
              <th>ผู้ว่าจ้าง</th>
              <th>วันที่สมัคร</th>
              <th>ค่าจ้าง</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in filteredJobs" :key="job.application_id">
              <td class="fw-semibold text-dark">{{ job.job_name }}</td>
              <td>{{ job.job_type }}</td>
              <td>{{ job.employer_name || '-' }}</td>
              <td>{{ formatDate(job.applied_at) }}</td>
              <td>{{ job.job_wage.toLocaleString() }}</td>
              <td>
                <span :class="statusClass(job.status)">
                  {{ translateStatus(job.status) }}
                </span>
              </td>
              <td>
                <button
                  v-if="job.status !== 'rejected' && job.status !== 'cancelled'"
                  class="btn btn-sm btn-outline-danger rounded-pill px-3"
                  @click="cancelApplication(job.application_id)"
                >
                  ยกเลิก
                </button>
                <span v-else class="text-muted">-</span>
              </td>
            </tr>
            <tr v-if="filteredJobs.length === 0">
              <td colspan="7" class="text-muted">ไม่พบรายการสมัครงานตามเงื่อนไข</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarApplicant from "@/components/NavbarApplicant.vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "JobApplications",
  components: { NavbarApplicant },
  data() {
    return {
      selectedStatus: "",
      applications: [],
    };
  },
  computed: {
    filteredJobs() {
      return this.selectedStatus
        ? this.applications.filter((job) => job.status === this.selectedStatus)
        : this.applications;
    },
  },
  methods: {
    translateStatus(code) {
      const map = {
        pending: "รอพิจารณา",
        accepted: "รอการติดต่อ",
        rejected: "ถูกปฏิเสธ",
        cancelled: "ยกเลิกแล้ว",
      };
      return map[code] || code;
    },
    statusClass(status) {
      return {
        "text-warning fw-bold": status === "pending",
        "text-success fw-bold": status === "accepted",
        "text-danger fw-bold": status === "rejected",
        "text-muted fw-bold": status === "cancelled",
      };
    },
    async fetchApplications() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) return;
        const res = await axios.get(`http://localhost:3001/api/applications/${user.id}`);
        this.applications = res.data;
      } catch (err) {
        console.error("❌ ดึงข้อมูลสมัครงานไม่สำเร็จ:", err);
      }
    },
    async cancelApplication(applicationId) {
      try {
        const confirmed = await Swal.fire({
          title: "คุณแน่ใจหรือไม่?",
          text: "หากยกเลิกแล้วจะไม่สามารถสมัครซ้ำได้",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#e3342f",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "ยืนยันยกเลิก",
          cancelButtonText: "ยกเลิก",
        });
        if (confirmed.isConfirmed) {
          await axios.put(`http://localhost:3001/api/applications/${applicationId}/cancel`);
          Swal.fire({
            title: "ยกเลิกสำเร็จ!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          this.fetchApplications();
        }
      } catch (err) {
        console.error("❌ ยกเลิกไม่สำเร็จ:", err);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถยกเลิกการสมัครได้",
        });
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  mounted() {
    this.fetchApplications();
  },
};
</script>

<style scoped>
.custom-select {
  border-radius: 999px;
  padding: 0.45rem 1.25rem;
  font-size: 0.95rem;
  border: 1px solid #ddd;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  min-width: 160px;
  max-width: 220px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23666' class='bi bi-chevron-down' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2rem;
}

.custom-select:focus {
  outline: none;
  border-color: #ff6600;
  box-shadow: 0 0 0 0.15rem rgba(255, 102, 0, 0.25);
}


.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.table thead {
  background-color: #f3f4f6;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
}

.table th,
.table td {
  padding: 1rem 0.75rem;
  vertical-align: middle;
  text-align: center;
  white-space: nowrap;
  font-size: 0.95rem;
  color: #374151;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}

select.form-select {
  font-size: 0.9rem;
  min-width: 180px;
  padding: 0.45rem 1.25rem;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: border 0.2s ease;
}

select.form-select:focus {
  border-color: #ff6600;
  outline: none;
  box-shadow: 0 0 0 0.15rem rgba(255, 102, 0, 0.25);
}

.btn-outline-danger {
  padding: 0.35rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid #ef4444;
  border-radius: 999px;
  color: #ef4444;
  background-color: white;
  transition: all 0.2s ease;
}
.btn-outline-danger:hover {
  background-color: #ef4444;
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.text-orange {
  color: #ff6600;
}
.text-warning { color: #eab308; font-weight: 600; }
.text-success { color: #22c55e; font-weight: 600; }
.text-danger  { color: #ef4444; font-weight: 600; }
.text-muted   { color: #9ca3af; font-weight: 600; }

@media (max-width: 576px) {
  .table th, .table td {
    font-size: 0.82rem;
    padding: 0.5rem 0.75rem;
  }
  select.form-select {
    font-size: 0.85rem;
    padding: 0.3rem 0.75rem;
  }
  .btn-outline-danger {
    padding: 0.3rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
