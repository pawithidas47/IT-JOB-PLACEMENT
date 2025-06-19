<template>
  <div>
    <NavbarEmployer />

    <div class="container py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h4 class="fw-bold text-orange">
          <i class="bi bi-briefcase-fill me-2"></i> จัดการงานของคุณ
        </h4>
        <router-link to="/employer/post-job" class="btn btn-orange fw-bold px-4 py-2 rounded-pill shadow-sm">
          <i class="bi bi-plus-circle me-2"></i> เพิ่มงานใหม่
        </router-link>
      </div>

      <!-- Search -->
      <div class="input-group mb-4 shadow-sm">
        <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
        <input type="text" class="form-control border-start-0" placeholder="ค้นหาชื่องาน..." v-model="search" />
      </div>

      <!-- Jobs Card Grid -->
      <div class="row g-4">
        <div v-for="job in filteredJobs" :key="job.job_id" class="col-md-6 col-lg-4">
          <div class="job-card p-4 rounded-4 shadow-sm h-100 position-relative">
            <h5 class="fw-bold mb-2 text-dark">
              <i class="bi bi-briefcase text-orange me-2"></i> {{ job.j_title }}
            </h5>
            <p class="mb-1"><i class="bi bi-tags-fill me-2 text-muted"></i> ประเภท: {{ job.j_type }}</p>
            <p class="mb-1"><i class="bi bi-calendar-event me-2 text-muted"></i> โพสต์เมื่อ: {{ formatDate(job.j_posted_at) }}</p>
            <p class="mb-3"><i class="bi bi-cash-coin me-2 text-muted"></i> ค่าจ้าง: {{ parseFloat(job.j_salary).toLocaleString() }} บาท</p>

            <div class="d-flex justify-content-end gap-2 mt-auto">
              <button @click="openEdit(job)" class="btn btn-sm btn-outline-secondary rounded-circle" title="แก้ไข">
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button @click="deleteJob(job.job_id)" class="btn btn-sm btn-outline-danger rounded-circle" title="ลบ">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        </div>
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

      // ✅ แปลงวันที่ให้เหมาะกับ MySQL
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
        console.error("❌ บันทึกงานล้มเหลว:", err);
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    },
    async deleteJob(id) {
      if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?")) return;
      try {
        await axios.delete(`http://localhost:3001/api/jobs/${id}`);
        this.fetchJobs();
      } catch (err) {
        console.error("❌ ลบงานล้มเหลว:", err);
      }
    },
  },
};
</script>

<style scoped>
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

/* โมดัลแบบกล่องลอย */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 20, 20, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-box {
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: pop-in 0.3s ease;
}
@keyframes pop-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.job-card {
  border: 1px solid #eee;
  transition: 0.3s;
  background-color: white;
}
.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(255, 102, 0, 0.1);
}
</style>
