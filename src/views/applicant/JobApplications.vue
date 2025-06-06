<template>
  <div>
    <NavbarApplicant />

    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">ตรวจสอบประวัติการสมัครงาน</h5>
        <select v-model="selectedStatus" class="form-select w-auto">
          <option value="">ทั้งหมด</option>
          <option value="รอพิจารณา">รอพิจารณา</option>
          <option value="รอการติดต่อ">รอการติดต่อ</option>
          <option value="ถูกปฏิเสธ">ถูกปฏิเสธ</option>
        </select>
      </div>

      <div class="table-responsive rounded-4 shadow-sm">
        <table class="table table-bordered text-center align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>ชื่องาน</th>
              <th>ประเภทงาน</th>
              <th>วันที่สมัคร</th>
              <th>ค่าจ้าง</th>
              <th>สถานะงานที่สมัคร</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in filteredJobs" :key="job.application_id">
              <td>{{ job.job_name }}</td>
              <td>{{ job.job_type }}</td>
              <td>{{ formatDate(job.applied_at) }}</td>
              <td>{{ job.job_wage.toLocaleString() }}</td>
              <td>
                <span :class="statusClass(job.status)">
                  {{ job.status }}
                </span>
              </td>
              <td>
                <button
                  v-if="job.status !== 'ถูกปฏิเสธ'"
                  class="btn btn-sm btn-outline-danger rounded-pill"
                  @click="cancelApplication(job.application_id)"
                >
                  ยกเลิกสมัคร
                </button>
                <span v-else class="text-muted">-</span>
              </td>
            </tr>
            <tr v-if="filteredJobs.length === 0">
              <td colspan="6" class="text-muted">ไม่พบรายการสมัครงานตามเงื่อนไข</td>
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
    async fetchApplications() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          console.warn("⛔ ไม่มี user.id ใน localStorage");
          return;
        }

        const res = await axios.get(
          `http://localhost:3001/api/applications/${user.id}`
        );
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
          await axios.put(
            `http://localhost:3001/api/applications/${applicationId}/cancel`
          );
          Swal.fire({
            title: "ยกเลิกสำเร็จ!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          this.fetchApplications(); // โหลดข้อมูลใหม่หลังยกเลิก
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

    statusClass(status) {
      return {
        "text-warning fw-bold": status === "รอพิจารณา",
        "text-success fw-bold": status === "รอการติดต่อ",
        "text-danger fw-bold": status === "ถูกปฏิเสธ",
        "text-muted fw-bold": status === "cancelled",
      };
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
}

.table-responsive {
  border-radius: 1rem;
  overflow: hidden;
}

select.form-select {
  border-radius: 1rem;
  font-size: 0.9rem;
}

.btn-outline-danger {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
}
</style>
