<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-2">
      <div class="container-fluid">
        <span class="fw-bold text-warning">IT job placement @Mor-Nor</span>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link active" href="#">หางาน</a>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link">เข้าสู่ระบบ</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register/employer" class="nav-link">สำหรับผู้ว่าจ้าง</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main layout -->
    <div class="container mt-4">
      <div class="row">
        <!-- Sidebar Filter -->
        <div class="col-md-3">
          <div class="p-3 shadow-sm rounded border">
            <h5 class="mb-3">ค้นหางาน</h5>
            <div class="mb-2">
              <label class="form-label">ชื่องาน</label>
              <input
                v-model="filter.title"
                type="text"
                class="form-control"
                placeholder="🔍 ค้นหางาน"
              />
            </div>
            <div class="mb-2">
              <label class="form-label">ประเภทงาน</label>
              <select v-model="filter.type" class="form-select">
                <option value="">ทั้งหมด</option>
                <option value="ออกแบบและมัลติมีเดีย">ออกแบบและมัลติมีเดีย</option>
                <option value="การตลาดดิจิทัล">การตลาดดิจิทัล</option>
                <option value="พัฒนาเว็บไซต์">พัฒนาเว็บไซต์</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">ราคาค่าจ้าง</label>
              <select v-model="filter.salary" class="form-select">
                <option value="">ทั้งหมด</option>
                <option value="3000">มากกว่า 3,000</option>
                <option value="1500">มากกว่า 1,500</option>
              </select>
            </div>
            <button
              class="btn btn-warning text-white w-100 mt-2"
              @click="searchJobs"
            >
              ค้นหา
            </button>
          </div>
        </div>

        <!-- Job Results -->
        <div class="col-md-9">
          <h5>พบ {{ filteredJobs.length }} ตำแหน่งงาน</h5>
          <div class="row g-3">
            <div class="col-md-6" v-for="job in filteredJobs" :key="job.job_id">
              <div class="border rounded p-3 h-100">
                <h6 class="text-orange fw-bold">ชื่องาน: {{ job.j_title }}</h6>
                <p class="mb-1">ประเภทงาน: {{ job.j_type }}</p>
                <p class="mb-1">
                  ค่าจ้าง: {{ job.j_salary.toLocaleString() }} บาท
                </p>
                <p class="mb-1">
                  วันหมดเขต: {{ formatDate(job.j_appdeadline) }}
                </p>
                <div class="d-flex justify-content-between mt-3">
                  <router-link
                    :to="`/jobs/${job.job_id}`"
                    class="btn btn-sm btn-outline-primary"
                    >ดูรายละเอียด</router-link
                  >
                  <router-link
                    :to="`/login`"
                    class="btn btn-sm btn-warning text-white"
                    >สมัครเลย</router-link
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
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
      jobs: [],  // ข้อมูลที่จะแสดงในหน้าหลัก
    };
  },
  computed: {
    filteredJobs() {
      // กรองข้อมูลจาก jobs ตามที่กรองจาก filter
      return this.jobs.filter((job) => {
        const titleMatch = job.j_title.includes(this.filter.title);
        const typeMatch =
          this.filter.type === "" || job.j_type === this.filter.type;
        const salaryMatch =
          this.filter.salary === "" ||
          job.j_salary >= parseInt(this.filter.salary);
        return titleMatch && typeMatch && salaryMatch && job.j_status === 'open';
      });
    },
  },
  mounted() {
    // ดึงข้อมูลงานทั้งหมดจาก backend (เมื่อเข้าหน้า Home)
    axios.get("http://localhost:3001/api/jobs")
      .then((res) => {
        this.jobs = res.data;  // เก็บข้อมูลใน jobs
        console.log("Fetched jobs:", this.jobs); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ดึงมา
      })
      .catch((err) => {
        console.error("❌ ดึงข้อมูลงานล้มเหลว:", err);
      });
  },
  methods: {
    searchJobs() {
      // หา jobs ตามที่กรอกใน filter
    },
    formatDate(d) {
      const date = new Date(d);
      return date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}

.nav-tabs .nav-link.active {
  border-color: #ff6600;
}

.navbar .nav-link.active {
  font-weight: bold;
  border-bottom: 3px solid #ff6600;
}
</style>
