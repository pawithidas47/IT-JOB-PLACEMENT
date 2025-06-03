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
      <div class="main-layout align-items-start">
        <!-- Sidebar Filter -->
        <aside class="filter-panel shadow-popup text-start bg-white" style="padding: 24px; border-radius: 12px; width: 260px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);">
          <form class="d-flex flex-column gap-3" @submit.prevent="searchJobs">
            <!-- คำค้น -->
            <div>
              <label class="form-label mb-1 fw-semibold text-dark">คำที่ต้องการค้นหา</label>
              <div class="position-relative">
                <input v-model="filter.title" @input="searchJobs" type="text" class="form-control ps-4" placeholder="  เช่น งานออกแบบ" style="border-radius: 10px; height: 38px; font-size: 14px;" />
                <span class="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted">
                  <i class="bi bi-search"></i>
                </span>
              </div>
            </div>
            <!-- ประเภทงาน -->
            <div>
              <label class="form-label mb-1 fw-semibold text-dark">ประเภทงาน</label>
              <select v-model="filter.type" @change="searchJobs" class="form-select" style="border-radius: 10px; height: 38px; font-size: 14px;">
                <option value="">ทั้งหมด</option>
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
            <!-- ราคาค่าจ้าง -->
            <div>
              <label class="form-label mb-1 fw-semibold text-dark">ช่วงค่าตอบแทน (บาท)</label>
              <select v-model="filter.salary" @change="searchJobs" class="form-select mb-2" style="border-radius: 10px; height: 38px; font-size: 14px;">
                <option value="">ทั้งหมด</option>
                <option value="500">ไม่เกิน 500</option>
                <option value="1500">501 - 1,500</option>
                <option value="3000">1,501 - 3,000</option>
                <option value="5000">มากกว่า 3,000</option>
              </select>
            </div>
            <!-- สถานะผู้ว่าจ้าง -->
            <div>
              <label class="form-label mb-1 fw-semibold text-dark">ประเภทผู้ว่าจ้าง</label>
              <select v-model="filter.employerType" @change="searchJobs" class="form-select mb-2" style="border-radius: 10px; height: 38px; font-size: 14px;">
                <option value="">ทั้งหมด</option>
                <option value="บริษัท">บริษัท</option>
    <option value="ร้านค้า">ร้านค้า</option>
    <option value="หน่วยงานภาครัฐ">หน่วยงานภาครัฐ</option>
    <option value="องค์กรไม่แสวงหากำไร">องค์กรไม่แสวงหากำไร</option>
    <option value="บุคคลทั่วไป">บุคคลทั่วไป</option>
    <option value="นักศึกษา">นักศึกษา</option>
    <option value="สตาร์ทอัป">สตาร์ทอัป</option>
    <option value="ฟรีแลนซ์">ฟรีแลนซ์</option>
              </select>
            </div>
            <!-- เรียงลำดับ -->
            <div>
              <label class="form-label mb-1 fw-semibold text-dark">เรียงลำดับ</label>
              <select v-model="filter.sort" @change="searchJobs" class="form-select mb-2" style="border-radius: 10px; height: 38px; font-size: 14px;">
                <option value="">ไม่เรียง</option>
                <option value="latest">วันที่โพสต์ล่าสุด</option>
                <option value="salary">ค่าจ้างสูงสุด</option>
                <option value="deadline">หมดเขตเร็วที่สุด</option>
              </select>
            </div>
            <!-- ปุ่มค้นหา -->
                <!-- ปุ่มค้นหา -->
            <div class="text-center">
              <button class="btn text-white fw-bold" style="width: 100%; background: linear-gradient(135deg,#ff6600,#e55d00); border-radius: 10px; height: 40px; font-size: 14px; box-shadow: 0 2px 10px rgba(255, 102, 0, 0.3);" type="submit">
                ค้นหา
              </button>
            </div>
          </form>
        </aside>

        <!-- Divider Line -->
        <div class="vertical-divider"></div>

        <!-- Job Results -->
        <section class="job-results">
          <h5 class="mb-4 text-orange">พบ {{ filteredJobs.length }} ตำแหน่งงาน</h5>
          <div class="job-grid">
            <div class="job-card p-4 bg-white border rounded-3 shadow-sm position-relative" v-for="job in filteredJobs" :key="job.job_id">
              <span class="badge bg-warning text-dark position-absolute top-0 end-0 mt-2 me-2" style="font-size: 0.75rem;">ใหม่</span>
              <h6 class="fw-bold text-orange mb-2">
                <i class="bi bi-briefcase-fill me-2"></i> {{ job.j_title }}
              </h6>
              <p class="mb-1 text-muted"><i class="bi bi-tags-fill me-1"></i> ประเภทงาน: {{ job.j_type }}</p>
              <p class="mb-1 text-muted"><i class="bi bi-cash-coin me-1"></i> ค่าจ้าง: {{ job.j_salary.toLocaleString() }} บาท</p>
              <p class="mb-1 text-muted"><i class="bi bi-person-badge me-1"></i> ผู้ว่าจ้าง: {{ job.employer_type || 'ไม่ระบุ' }}</p>
              <p class="mb-1 text-muted">
  <i class="bi bi-clock me-1"></i>
  โพสต์เมื่อ: {{ new Date(job.j_posted_at).toLocaleDateString('th-TH') }}
</p>

              <p class="mb-1 text-muted"><i class="bi bi-calendar-event me-1"></i> หมดเขต: {{ new Date(job.j_appdeadline).toLocaleDateString('th-TH') }}</p>
              <p class="mb-1 text-muted" v-if="job.j_description.includes('#')">
                <i class="bi bi-hash me-1"></i>
                <span v-for="tag in job.j_description.match(/#\w+/g)" :key="tag" class="badge bg-light text-secondary me-1">{{ tag }}</span>
              </p>
              <div class="d-flex justify-content-between mt-3">
                <router-link :to="`/jobs/${job.job_id}`" class="btn btn-sm btn-outline-primary rounded-pill px-3">ดูรายละเอียด</router-link>
                <div v-if="isLoggedIn">
                  <button class="btn btn-sm btn-outline-secondary rounded-pill me-1" @click="shareJob(job)"><i class="bi bi-share"></i></button>
                  <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="bookmarkJob(job)"><i class="bi bi-bookmark"></i></button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JobHomePage",
  data() {
    return {
      isLoggedIn: localStorage.getItem("authToken") !== null,
      filter: {
        title: "",
        type: "",
        salary: "",
        employerType: "",
        sort: "",
      },
      jobs: [],
      filtered: [],
    };
  },
  computed: {
    filteredJobs() {
      return this.filtered;
    },
  },
  mounted() {
    import("axios").then(({ default: axios }) => {
      axios.get("http://localhost:3001/api/jobs")
        .then((res) => {
          this.jobs = res.data;
          this.searchJobs();
        })
        .catch((err) => {
          console.error("❌ ดึงข้อมูลงานล้มเหลว:", err);
        });
    });
  },
  methods: {
    searchJobs() {
      this.filtered = this.jobs
        .filter((job) => {
          const titleMatch = job.j_title?.toLowerCase().includes(this.filter.title.toLowerCase());
          const typeMatch = this.filter.type === "" || job.j_type === this.filter.type;
          const salaryMatch = this.filter.salary === "" || job.j_salary >= parseInt(this.filter.salary);
          const employerMatch = this.filter.employerType === "" || job.employer_type === this.filter.employerType;
          return titleMatch && typeMatch && salaryMatch && employerMatch && job.j_status === 'open';
        })
        .sort((a, b) => {
          if (this.filter.sort === "latest") return new Date(b.j_posted_at) - new Date(a.j_posted_at);
          if (this.filter.sort === "salary") return b.j_salary - a.j_salary;
          if (this.filter.sort === "deadline") return new Date(a.j_appdeadline) - new Date(b.j_appdeadline);
          return 0;
        });
    },
    shareJob(job) {
      const shareText = `ดูงาน "${job.j_title}" ที่ IT job placement @Mor-Nor\n${window.location.origin}/jobs/${job.job_id}`;
      if (navigator.share) {
        navigator.share({
          title: job.j_title,
          text: shareText,
          url: `${window.location.origin}/jobs/${job.job_id}`
        }).catch(err => console.warn("❌ แชร์ไม่สำเร็จ:", err));
      } else {
        navigator.clipboard.writeText(shareText).then(() => {
          alert("📋 คัดลอกลิงก์งานไปยังคลิปบอร์ดแล้ว!");
        });
      }
    },
    bookmarkJob(job) {
      alert(`🔖 บันทึกงาน: ${job.j_title}`);
    }
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
  font-size: 1.5rem;
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
  background: white;
  border: none;
  min-height: auto;
}

.shadow-popup {
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
}

.vertical-divider {
  width: 2px;
  background-color: #000;
  opacity: 0.1;
  height: auto;
  align-self: stretch;
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 24px rgba(255, 102, 0, 0.2);
}

select,
input.form-control {
  background-color: #fcfcfc;
  border-color: #ddd;
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }

  .filter-panel {
    width: 100%;
    max-height: 600px;
    overflow-y: auto;
  }

  .vertical-divider {
    display: none;
  }
  
}
</style>