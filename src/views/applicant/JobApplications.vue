<template>
  <div>
    <NavbarApplicant />

    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h5 class="fw-bold mb-0 text-dark">
          <i class="bi bi-clock-fill me-2 text-orange"></i>
          ตรวจสอบประวัติการสมัครงาน
        </h5>
        <div class="d-flex align-items-center gap-2 flex-nowrap" style="white-space: nowrap;">

          <label class="mb-0 fw-semibold text-secondary">ตัวกรอง:</label>
          <select v-model="selectedStatus" class="form-select rounded-pill px-3 py-1 shadow-sm border-0">
            <option value="">ทั้งหมด</option>
            <option value="pending">รอพิจารณา</option>
            <option value="accepted">รอการติดต่อ</option>
            <option value="rejected">ถูกปฏิเสธ</option>
            <option value="cancelled">ยกเลิกแล้ว</option>
          </select>
        </div>
      </div>

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
        if (!user || !user.id) {
          console.warn("⛔ ไม่มี user.id ใน localStorage");
          return;
        }
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
.table th,
.table td {
  vertical-align: middle;
  font-size: 0.92rem;
  color: #333;
}

.table-responsive {
  border-radius: 1rem;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05);
}

select.form-select {
  font-size: 0.9rem;
  min-width: 160px;
  padding: 0.375rem 1rem;
  border-radius: 2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0e0e0;
}

.btn-outline-danger {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  transition: all 0.2s ease;
}

.btn-outline-danger:hover {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
}

.text-orange {
  color: #ff6600;
}

.text-warning {
  color: #f59e0b !important;
}

.text-success {
  color: #10b981 !important;
}

.text-danger {
  color: #ef4444 !important;
}

.text-muted {
  color: #6c757d !important;
}
@media (min-width: 576px) {
  .filter-label-select {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
  }
}

</style>
