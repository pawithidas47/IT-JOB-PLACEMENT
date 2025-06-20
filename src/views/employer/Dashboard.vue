<template>
  <div>
    <NavbarEmployer />

    <div class="container py-4" style="max-width: 800px">
<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
  <h4 class="fw-bold text-orange"><i class="bi bi-briefcase-fill me-2"></i> งานทั้งหมด</h4>
  <router-link to="/employer/post-job" class="btn btn-add-job d-flex align-items-center">
    <i class="bi bi-plus-circle-fill me-2 fs-5"></i> เพิ่มงานใหม่
  </router-link>
</div>

<!-- ค้นหา -->
<div class="search-box mb-4 shadow-sm">
  <i class="bi bi-search text-muted search-icon"></i>
  <input
    type="text"
    class="form-control search-input"
    placeholder="ค้นหาชื่องานที่คุณโพสต์ไว้..."
    v-model="search"
/>
</div>


      <!-- Card-Post Style -->
      <div v-for="job in filteredJobs" :key="job.job_id" class="job-post shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold text-orange"><i class="bi bi-briefcase-fill me-2"></i>{{ job.j_title }}</h5>
          <small class="text-muted">{{ formatDate(job.j_posted_at) }}</small>
        </div>

        <ul class="list-unstyled mb-3 small text-dark">
          <li><i class="bi bi-tags-fill me-2 text-muted"></i><strong>ประเภทงาน:</strong> {{ job.j_type }}</li>
          <li><i class="bi bi-cash-coin me-2 text-muted"></i><strong>ค่าจ้าง:</strong> {{ parseFloat(job.j_salary).toLocaleString() }} บาท</li>
          <li><i class="bi bi-calendar-x me-2 text-muted"></i><strong>หมดเขต:</strong> {{ formatDate(job.j_appdeadline) }}</li>
          <li><i class="bi bi-person-vcard me-2 text-muted"></i><strong>ผู้ว่าจ้าง:</strong> {{ user?.e_type || 'ไม่ระบุ' }}</li>
        </ul>

        <div class="bg-light rounded p-3 small font-monospace" style="white-space: pre-wrap;">
          {{ job.j_description }}
        </div>

        <div class="d-flex justify-content-end gap-2 mt-3">
          <button @click="openEdit(job)" class="btn btn-sm btn-outline-secondary rounded-pill">
            ✏️ แก้ไข
          </button>
          <button @click="deleteJob(job.job_id)" class="btn btn-sm btn-outline-danger rounded-pill">
            🗑️ ลบ
          </button>
        </div>
      </div>

      <div v-if="filteredJobs.length === 0" class="text-center text-muted py-5">
        <i class="bi bi-emoji-frown fs-1"></i>
        <p class="mt-3">ไม่พบงานที่ตรงกับคำค้น</p>
      </div>

      <!-- Modal แก้ไขงาน -->
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal-box">
          <h5 class="fw-bold text-orange mb-3">
            🛠️ แก้ไขงาน
          </h5>
          <form @submit.prevent="submitEdit">
            <div class="mb-3">
              <label class="form-label">ชื่องาน</label>
              <input v-model="editingJob.j_title" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">รายละเอียด</label>
              <textarea v-model="editingJob.j_description" class="form-control" rows="4" required></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">ประเภทงาน</label>
              <select v-model="editingJob.j_type" class="form-select" required>
                <option disabled value="">-- เลือกประเภท --</option>
                <option value="ออกแบบและมัลติมีเดีย">ออกแบบและมัลติมีเดีย</option>
                <option value="การตลาดดิจิทัล">การตลาดดิจิทัล</option>
                <option value="พัฒนาเว็บไซต์">พัฒนาเว็บไซต์</option>
                <option value="UX/UI Design">UX/UI Design</option>
                <option value="IT Support">IT Support</option>
                <option value="ดูแลระบบเครือข่าย">ดูแลระบบเครือข่าย</option>
                <option value="เขียนบทความ/แปลบทความเทคโนโลยี">เขียน/แปลบทความเทคโนโลยี</option>
                <option value="คีย์ข้อมูล / Data Entry">คีย์ข้อมูล / Data Entry</option>
                <option value="แอดมินเพจ / ดูแลโซเชียลมีเดีย">แอดมินเพจ / โซเชียลมีเดีย</option>
                <option value="ตัดต่อวิดีโอ / สร้างคอนเทนต์">ตัดต่อวิดีโอ / คอนเทนต์</option>
                <option value="ที่ปรึกษาด้านเทคโนโลยี">ที่ปรึกษาด้านเทคโนโลยี</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">ค่าจ้าง</label>
              <input v-model.number="editingJob.j_salary" type="number" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">วันปิดรับสมัคร</label>
              <input v-model="editingJob.j_appdeadline" type="date" class="form-control" required />
            </div>
            <div class="text-end mt-4">
              <button class="btn btn-secondary me-2" type="button" @click="showModal = false">ยกเลิก</button>
              <button class="btn btn-orange" type="submit">
                <i class="bi bi-floppy me-1"></i> บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";

export default {
  name: "DashboardEmployer",
  components: { NavbarEmployer },
  data() {
    return {
      user: null,
      search: "",
      jobs: [],
      showModal: false,
      editingJob: {},
    };
  },
  computed: {
    filteredJobs() {
      return this.jobs.filter((job) =>
        job.j_title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  mounted() {
    const userStr = localStorage.getItem("user");
    if (!userStr) return this.$router.push("/login");
    this.user = JSON.parse(userStr);
    this.fetchJobs();
  },
  methods: {
    formatDate(d) {
      const date = new Date(d);
      return date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    async fetchJobs() {
      try {
        const res = await axios.get(`http://localhost:3001/api/jobs/employer/${this.user.employer_id}`);
        this.jobs = res.data;
      } catch (err) {
        console.error("❌ โหลดข้อมูลงานล้มเหลว:", err);
      }
    },
    openEdit(job) {
      const date = new Date(job.j_appdeadline);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');

      this.editingJob = {
        ...job,
        j_appdeadline: `${yyyy}-${mm}-${dd}`
      };
      this.showModal = true;
    },
    async submitEdit() {
      const j = { ...this.editingJob };

      if (j.j_appdeadline) {
        const d = new Date(j.j_appdeadline);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        j.j_appdeadline = `${yyyy}-${mm}-${dd}`;
      }

      try {
        await axios.put(`http://localhost:3001/api/jobs/${j.job_id}`, j);
        this.showModal = false;
        this.fetchJobs();
      } catch (err) {
        console.error("❌ แก้ไขล้มเหลว:", err);
      }
    },
    async deleteJob(id) {
      if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?")) return;
      try {
        await axios.delete(`http://localhost:3001/api/jobs/${id}`);
        this.fetchJobs();
      } catch (err) {
        console.error("❌ ลบล้มเหลว:", err);
      }
    },
  },
};
</script>

<style scoped>
/* ปุ่มเพิ่มงาน */
.btn-add-job {
  background-color: #ff6600;
  color: white;
  font-weight: 500;
  font-size: 15px;
  padding: 8px 16px;
  border-radius: 999px;
  box-shadow: 0 3px 10px rgba(255, 102, 0, 0.2);
  transition: all 0.2s ease;
  line-height: 1.2;
}
.btn-add-job:hover {
  background-color: #e65c00;
  transform: translateY(-1px);
}

/* กล่องค้นหา */
.search-box {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 999px;
  background: white;
  padding: 4px 14px;
  display: flex;
  align-items: center;
  height: 42px;
}
.search-icon {
  font-size: 1.1rem;
  margin-right: 8px;
  color: #999;
}
.search-input {
  border: none;
  outline: none !important;
  box-shadow: none !important;
  background: transparent;
  font-size: 14.5px;
  flex: 1;
}
.search-input::placeholder {
  color: #bbb;
}


.text-orange {
  color: #ff6600;
}
.btn-orange {
  background-color: #ff6600;
  color: white;
}
.btn-orange:hover {
  background-color: #e65c00;
}
.job-post {
  border: 1px solid #eee;
  border-left: 4px solid #ff6600;
  transition: 0.3s;
}
.job-post:hover {
  box-shadow: 0 8px 24px rgba(255, 102, 0, 0.1);
}

/* Modal style */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 30, 30, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: pop-in 0.25s ease;
}
@keyframes pop-in {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
