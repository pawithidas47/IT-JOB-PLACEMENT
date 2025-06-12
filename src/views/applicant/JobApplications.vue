<template>
  <div>
    <NavbarApplicant />

    <div class="container py-4">
      <!-- Header Title Centered with Background -->

      <!-- Filters with count on left -->
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <p class="text-muted mb-0 small">พบทั้งหมด {{ filteredJobs.length }} รายการ</p>
        <div class="d-flex gap-2">
          <input v-model="searchText" class="form-control" placeholder="ค้นหาตามชื่อ..." />
          <select v-model="selectedStatus" class="form-select custom-select">
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
        <table class="table table-hover align-middle text-center mb-0">
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
              <td><span :class="statusClass(job.status)">{{ translateStatus(job.status) }}</span></td>
              <td>
                <button v-if="job.status === 'cancelled'" class="btn btn-sm btn-outline-black rounded-pill px-3"
                  @click="deleteApplication(job.application_id)">
                  <i class="bi bi-trash me-1"></i>
                </button>



                <button v-else-if="job.status !== 'rejected'" class="btn btn-outline-danger rounded-pill px-3"
                  @click="cancelApplication(job.application_id)">
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
      searchText: "",
      filterType: "",
      filterEmployer: "",
      applications: [],
    };
  },
  computed: {
    filteredJobs() {
      return this.applications.filter((job) => {
        const statusMatch = this.selectedStatus ? job.status === this.selectedStatus : true;
        const nameMatch = job.job_name.toLowerCase().includes(this.searchText.toLowerCase());
        const typeMatch = this.filterType ? job.job_type === this.filterType : true;
        const employerMatch = this.filterEmployer ? job.employer_name === this.filterEmployer : true;
        return statusMatch && nameMatch && typeMatch && employerMatch;
      });
    },
    uniqueTypes() {
      return [...new Set(this.applications.map((job) => job.job_type))].filter(Boolean);
    },
    uniqueEmployers() {
      return [...new Set(this.applications.map((job) => job.employer_name))].filter(Boolean);
    },
  },
  methods: {
    translateStatus(code) {
      return {
        pending: "รอพิจารณา",
        accepted: "รอการติดต่อ",
        rejected: "ถูกปฏิเสธ",
        cancelled: "ยกเลิกแล้ว",
      }[code] || code;
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
        const user_id = localStorage.getItem("user_id");
        if (!user_id) return;
        const res = await axios.get(`http://localhost:3001/api/applications/${user_id}`);

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
          confirmButtonText: "ยืนยันยกเลิก",
        });
        if (confirmed.isConfirmed) {
          await axios.put(`http://localhost:3001/api/applications/${applicationId}/cancel`);
          Swal.fire({ icon: "success", title: "ยกเลิกสำเร็จ!", timer: 1500, showConfirmButton: false });
          this.fetchApplications();
        }
      } catch (err) {
        console.error("❌ ยกเลิกไม่สำเร็จ:", err);
      }
    },
    async deleteApplication(applicationId) {
      try {
        const confirmed = await Swal.fire({
          title: "ลบรายการนี้?",
          text: "เมื่อลบแล้วจะไม่สามารถกู้คืนได้",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ลบ",
        });
        if (confirmed.isConfirmed) {
          await axios.delete(`http://localhost:3001/api/applications/${applicationId}`);
          Swal.fire({ icon: "success", title: "ลบเรียบร้อย!", timer: 1500, showConfirmButton: false });
          this.fetchApplications();
        }
      } catch (err) {
        console.error("❌ ลบไม่สำเร็จ:", err);
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("th-TH", {
        day: "2-digit", month: "2-digit", year: "numeric"
      });
    },
  },
  mounted() {
    this.fetchApplications();
  },
};
</script>
<style scoped>
.btn-outline-black {
  color: #545050;
  border: 1px solid #000;
  background-color: transparent;
  transition: all 0.2s ease;
}

.btn-outline-black:hover,
.btn-outline-black:focus,
.btn-outline-black:active {
  background-color: #000;
  color: #fff;
  border-color: #000;
}

.btn-cancelled {
  color: #6c757d;
  /* muted gray */
  border: 1px solid #6c757d;
  background-color: transparent;
  transition: all 0.2s;
}

.btn-cancelled:hover,
.btn-cancelled:focus,
.btn-cancelled:active {
  color: #000;
  border-color: #000;
  background-color: #f1f1f1;
  /* soft background when hovered */
}

.custom-select,
.form-control {
  border-radius: 999px !important;
  padding: 0.45rem 1.25rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  min-width: 200px;
  max-width: 240px;
}

.btn-delete-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffecec;
  border: none;
  color: #e53935;
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, color 0.3s;
}

.btn-delete-icon:hover {
  background-color: #e53935;
  color: #fff;
}

.table thead {
  background-color: #f9f9f9;
  font-weight: 600;
  border-bottom: 2px solid #eee;
}

.table td,
.table th {
  vertical-align: middle;
  padding: 0.75rem;
  border-color: #f0f0f0;
}
</style>
