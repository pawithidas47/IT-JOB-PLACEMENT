<template>
  <div>
    <!-- Navbar -->
    <div class="nav-wrapper">
      <span class="brand-title">IT job placement @Mor-Nor</span>
      <div class="nav-top-right">
        <router-link to="/" class="top-link" exact-active-class="active-link">หางาน</router-link>
        <router-link to="/login" class="top-link" exact-active-class="active-link">เข้าสู่ระบบ</router-link>
        <router-link to="/register/employer" class="top-link" exact-active-class="active-link">สำหรับผู้ว่าจ้าง</router-link>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="container-fluid px-4 py-4">
      <div class="main-layout">
        <!-- Sidebar Filter -->
        <aside class="filter-panel shadow-popup">
          <div class="mb-3">
          <h5 class="mb-4 "></h5>
            <label class="form-label">คำที่ต้องการค้นหา</label><br>
            <input v-model="filter.title" type="text" class="form-control"  />
          </div>
          <div class="mb-3">
            <label class="form-label">ชื่องาน</label><br>
            <select v-model="filter.type" class="form-select">
              <option value="ออกแบบและมัลติมีเดีย">ออกแบบและมัลติมีเดีย</option>
              <option value="การตลาดดิจิทัล">การตลาดดิจิทัล</option>
              <option value="พัฒนาเว็บไซต์">พัฒนาเว็บไซต์</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">ประเภทงาน</label><br>
            <select v-model="filter.type" class="form-select">
              <option value="ออกแบบและมัลติมีเดีย">ออกแบบและมัลติมีเดีย</option>
              <option value="การตลาดดิจิทัล">การตลาดดิจิทัล</option>
              <option value="พัฒนาเว็บไซต์">พัฒนาเว็บไซต์</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">ราคาค่าจ้าง</label><br>
            <select v-model="filter.salary" class="form-select">
              <option value="3000">มากกว่า 3,000</option>
              <option value="1500">มากกว่า 1,500</option>
            </select>
          </div>
          <button class="btn btn-warning text-white w-100" @click="searchJobs">ค้นหา</button>
        </aside>

        <!-- Divider Line -->
        <div class="vertical-divider"></div>

        <!-- Job Results -->
        <section class="job-results">
          <h5 class="mb-4 text-orange">พบ {{ filteredJobs.length }} ตำแหน่งงาน</h5>
          <div class="job-grid">
            <div class="job-card" v-for="job in filteredJobs" :key="job.job_id">
              <h6 class="text-orange fw-bold mb-2">ชื่องาน: {{ job.j_title }}</h6>
              <p><strong>ประเภทงาน:</strong> {{ job.j_type }}</p>
              <p><strong>ค่าจ้าง:</strong> {{ job.j_salary.toLocaleString() }} บาท</p>
              <p><strong>รูปแบบ:</strong> ออนไลน์</p>
              <p><strong>ผู้ว่าจ้าง:</strong> ไม่ระบุ</p>
              <div class="d-flex justify-content-between mt-3">
                <router-link :to="`/jobs/${job.job_id}`" class="btn btn-outline-primary btn-sm">ดูรายละเอียด</router-link>
                
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePage",
  data() {
    return {
      filter: {
        title: "",
        type: "",
        salary: "",
      },
      jobs: [],
    };
  },
  computed: {
    filteredJobs() {
      return this.jobs.filter((job) => {
        const titleMatch = job.j_title.includes(this.filter.title);
        const typeMatch = this.filter.type === "" || job.j_type === this.filter.type;
        const salaryMatch = this.filter.salary === "" || job.j_salary >= parseInt(this.filter.salary);
        return titleMatch && typeMatch && salaryMatch && job.j_status === 'open';
      });
    },
  },
  mounted() {
    axios
      .get("http://localhost:3001/api/jobs")
      .then((res) => {
        this.jobs = res.data;
      })
      .catch((err) => {
        console.error("❌ ดึงข้อมูลงานล้มเหลว:", err);
      });
  },
  methods: {
    searchJobs() {},
  },
};
</script>

<style scoped>
.nav-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 4px solid #ff6600;
}

.brand-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ff6600;
}

.nav-top-right {
  display: flex;
  gap: 20px;
}

.top-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  position: relative;
}

.top-link::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  height: 3px;
  width: 0%;
  background-color: #ff6600;
  transition: width 0.3s;
}

.top-link:hover::after,
.active-link::after {
  width: 60%;
}

.text-orange {
  color: #ff6600;
}

.main-layout {
  display: flex;
  gap: 2rem;
  align-items: stretch;
}

.filter-panel {
  width: 320px;
  padding: 24px;
  border-radius: 12px;
  background: white;
  border: none;
  min-height: 100vh;
}

.shadow-popup {
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
}

.vertical-divider {
  width: 2px;
  background-color: #000;
  opacity: 0.2;
  height: auto;
  min-height: 100vh;
}

.job-results {
  flex: 1;
}

.job-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.job-card {
  border: 2px solid #ff6600;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
  transition: box-shadow 0.3s;
}

.job-card:hover {
  box-shadow: 0px 4px 20px rgba(255, 102, 0, 0.15);
}

.btn-warning {
  background-color: #ff6600;
  border-color: #ff6600;
}

.btn-warning:hover {
  background-color: #e65c00;
  border-color: #e65c00;
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }

  .filter-panel {
  height: auto;
  max-height: 600px; /* หรือค่าที่ต้องการ */
  overflow-y: auto;  /* เพิ่ม scroll ด้านในถ้าเกิน */
}

  .vertical-divider {
    display: none;
  }
}
</style>
