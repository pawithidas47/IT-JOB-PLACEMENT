<template>
  <div>
    <NavbarHome />

    <div class="container-fluid px-4 py-4">
      <div class="main-layout align-items-start">

        <!-- Sidebar Filter -->
        <aside
          class="filter-panel shadow-popup text-start bg-white"
          style="padding: 24px; border-radius: 12px; width: 260px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);"
        >
          <form class="d-flex flex-column gap-3" @submit.prevent="searchJobs">
            <div>
              <label class="form-label mb-1 fw-semibold text-dark">คำที่ต้องการค้นหา</label>
              <div class="position-relative">
                <input
                  v-model="filter.keyword"
                  @input="searchJobs"
                  type="text"
                  class="form-control"
                  placeholder="เช่น เขียนโปรแกรม, บริษัท"
                  style="border-radius: 10px; height: 38px; font-size: 14px; padding-left: 2.2rem;"
                />
                <span class="position-absolute top-50 translate-middle-y text-muted" style="left: 12px;">
                  <i class="bi bi-search"></i>
                </span>
              </div>
            </div>

            <div>
              <label class="form-label mb-1 fw-semibold text-dark">หมวดหมู่งาน</label>
              <select
                v-model="filter.type"
                @change="searchJobs"
                class="form-select"
                style="border-radius: 10px; height: 38px; font-size: 14px;"
              >
                <option value="">ทั้งหมด</option>
                <option value="ออกแบบกราฟิก / มัลติมีเดีย">ออกแบบกราฟิก / มัลติมีเดีย</option>
                <option value="UX/UI Design">UX/UI Design</option>
                <option value="พัฒนาเว็บไซต์">พัฒนาเว็บไซต์</option>
                <option value="พัฒนาแอปพลิเคชัน">พัฒนาแอปพลิเคชัน</option>
                <option value="เขียนโปรแกรม / Coding">เขียนโปรแกรม / Coding</option>
                <option value="คีย์ข้อมูล / Data Entry">คีย์ข้อมูล / Data Entry</option>
                <option value="เขียน / แปลบทความไอที">เขียน / แปลบทความไอที</option>
                <option value="การตลาดดิจิทัล / คอนเทนต์">การตลาดดิจิทัล / คอนเทนต์</option>
                <option value="แอดมินเพจ / โซเชียลมีเดีย">แอดมินเพจ / โซเชียลมีเดีย</option>
                <option value="ตัดต่อวิดีโอ / สร้างคอนเทนต์">ตัดต่อวิดีโอ / สร้างคอนเทนต์</option>
                <option value="ช่วยเหลือด้าน IT / Remote Support">ช่วยเหลือด้าน IT / Remote Support</option>
                <option value="ติวเตอร์ / เทรนเนอร์ด้านเทคโนโลยี">ติวเตอร์ / เทรนเนอร์ด้านเทคโนโลยี</option>
                <option value="ผู้ช่วยวิจัย / รวบรวมข้อมูล">ผู้ช่วยวิจัย / รวบรวมข้อมูล</option>
              </select>
            </div>

            <div>
              <label class="form-label mb-1 fw-semibold text-dark">ทักษะที่ใช้</label>
              <input
                v-model="filter.skills"
                @input="searchJobs"
                type="text"
                class="form-control"
                placeholder="เช่น HTML, Photoshop"
                style="border-radius: 10px; height: 38px; font-size: 14px;"
              />
            </div>

            <div>
              <label class="form-label mb-1 fw-semibold text-dark">ค่าจ้าง (บาท)</label>
              <div class="d-flex align-items-center">
                <select
                  v-model="filter.salaryMin"
                  @change="searchJobs"
                  class="form-select me-2"
                  style="border-radius: 10px; height: 38px; font-size: 14px;"
                >
                  <option value="">ต่ำสุด</option>
                  <option value="100">100</option>
                  <option value="300">300</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="2000">2000</option>
                  <option value="5000">5000</option>
                  <option value="10000">10000</option>
                </select>
                <span>-</span>
                <select
                  v-model="filter.salaryMax"
                  @change="searchJobs"
                  class="form-select ms-2"
                  style="border-radius: 10px; height: 38px; font-size: 14px;"
                >
                  <option value="">สูงสุด</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="2000">2000</option>
                  <option value="5000">5000</option>
                  <option value="10000">10000</option>
                  <option value="20000">20000</option>
                  <option value="9999999">มากกว่า 20000</option>
                </select>
              </div>
            </div>

            <div>
              <label class="form-label mb-1 fw-semibold text-dark">ผู้ว่าจ้าง</label>
              <select
                v-model="filter.employerType"
                @change="searchJobs"
                class="form-select mb-2"
                style="border-radius: 10px; height: 38px; font-size: 14px;"
              >
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

            <div class="text-center">
              <button
                class="btn text-white fw-bold"
                style="width: 100%; background: linear-gradient(135deg,#ff6600,#e55d00); border-radius: 10px; height: 40px; font-size: 14px; box-shadow: 0 2px 10px rgba(255, 102, 0, 0.3);"
                type="submit"
              >
                ค้นหา
              </button>
            </div>
          </form>
        </aside>

        <div class="vertical-divider"></div>

        <!-- Job Results -->
        <section class="job-results">

          <!-- ส่วนหัวผลลัพธ์ -->
          <div class="results-header">
            <h5 class="mb-1 text-orange">พบ {{ filteredJobs.length }} งาน</h5>

            <div class="sort-row">
              <label for="sortSelect" class="me-2 mb-0 text-muted small">เรียงตาม</label>
              <select
                id="sortSelect"
                v-model="viewFilter"
                @change="searchJobs"
                class="form-select custom-pill"
              >
                <option value="all">ทั้งหมด</option>
                <option value="latest">ล่าสุด</option>
                <option value="applied">สมัครแล้ว</option>
                <option value="not_applied">ยังไม่ได้สมัคร</option>
              </select>
            </div>
          </div>

          <br />

          <div class="job-grid">
            <div
              class="job-card p-4 bg-white border rounded-3 shadow-sm position-relative"
              v-for="job in filteredJobs"
              :key="job.job_id"
              @click="openJob(job.job_id)"
              style="cursor:pointer"
            >
              <!-- ปุ่มบันทึก -->
              <div class="card-meta">
                <button
                  class="icon-btn"
                  :class="{ saved: isBookmarked(job.job_id) }"
                  @click.stop="bookmarkJob(job)"
                  :aria-label="isBookmarked(job.job_id) ? 'ยกเลิกบันทึก' : 'บันทึกงาน'"
                  title="บันทึกงาน"
                >
                  <i :class="isBookmarked(job.job_id) ? 'bi bi-bookmark-fill' : 'bi bi-bookmark'"></i>
                </button>
              </div>

              <!-- บริษัท -->
              <div class="d-flex align-items-center mb-3">
                <img
                  :src="job.e_profile_img_url ? `http://localhost:3001${job.e_profile_img_url}` : '/default-profile.jpg'"
                  alt="โลโก้บริษัท"
                  class="rounded-circle shadow-sm me-3"
                  style="width: 42px; height: 42px; object-fit: cover"
                />
                <div class="text-truncate">
                  <div class="fw-semibold">{{ job.e_company_name || 'ชื่อบริษัทไม่ระบุ' }}</div>
                </div>
              </div>

              <!-- หัวข้อ -->
              <div class="d-flex align-items-center flex-wrap gap-2 mb-2">
                <h5 class="fw-bold text-dark mb-0">{{ job.j_title }}</h5>
                <span v-if="isBookmarked(job.job_id)" class="chip-saved">บันทึกแล้ว</span>
              </div>

              <!-- หมวดหมู่ -->
              <div v-if="job.j_type" class="mb-2">
                <span class="badge-category">{{ job.j_type }}</span>
              </div>

              <!-- รายละเอียดสั้น -->
              <p class="mb-1 text-muted">
                <i class="bi bi-people-fill me-1"></i> รับจำนวน: {{ job.j_amount || '-' }} คน
              </p>
              <p class="mb-0 text-muted">
                <i class="bi bi-cash-coin me-1"></i> ค่าจ้าง: {{ salaryDisplay(job) }}
              </p>

              <!-- เวลาที่ผ่านมา -->
              <div class="ago-badge">
                {{ timeAgo(job.j_posted_at) }}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script>
import NavbarHome from '@/components/NavbarHome.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'GuestJobListWithPopup',
  components: { NavbarHome },
  data() {
    return {
      isLoggedIn: localStorage.getItem('authToken') !== null,
      viewFilter: 'all', // 'all' | 'latest' | 'applied' | 'not_applied'
      filter: {
        keyword: '',
        type: '',
        salaryMin: '',
        salaryMax: '',
        employerType: '',
        sort: '',
        skills: '',
      },
      jobs: [],
      filtered: [],
      bookmarkedIds: [],
      user: null,
      appliedJobIds: new Set(),
    };
  },
  computed: {
    filteredJobs() {
      return this.filtered;
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (this.user) {
      const key = `bookmarkedJobs_${this.user.applicant_id}`;
      const saved = JSON.parse(localStorage.getItem(key)) || [];
      this.bookmarkedIds = saved.map(j => j.job_id);
      this.loadAppliedJobs();
    }

    axios.get('http://localhost:3001/api/jobs')
      .then((res) => {
        this.jobs = res.data;
        this.searchJobs();
      })
      .catch((err) => {
        console.error('❌ ดึงข้อมูลงานล้มเหลว:', err);
      });
  },
  methods: {
    async loadAppliedJobs() {
      try {
        if (!this.user) return;
        const res = await axios.get(`http://localhost:3001/api/applications/${this.user.applicant_id}`);
        this.appliedJobIds = new Set(res.data.map(a => a.job_id));
      } catch (e) {
        console.warn('โหลดงานที่สมัครแล้วไม่สำเร็จ (ข้ามได้)', e);
      }
    },

    openJob(id) {
      const path = this.isLoggedIn ? `/applicant/jobs/${id}` : `/jobs/${id}`;
      this.$router.push(path);
    },

    // ---- แก้เงื่อนไขเงินเดือนให้รองรับข้อความ/ช่วง/ตามตกลง ----
    parseSalaryRange(s) {
      if (s === null || s === undefined) return null;
      const str = String(s);
      const nums = str.match(/\d+(?:[.,]\d+)?/g);
      if (!nums) return null;
      const values = nums
        .map(n => parseInt(n.replace(/[^\d]/g, ''), 10))
        .filter(v => !isNaN(v));
      if (!values.length) return null;
      return { min: Math.min(...values), max: Math.max(...values) };
    },
    salaryDisplay(job) {
      const s = job?.j_salary;
      if (s === null || s === undefined || s === '') return 'ไม่ระบุ';
      const n = Number(s);
      if (!isNaN(n)) return n.toLocaleString() + ' บาท';
      return String(s);
    },

    searchJobs() {
      const keyword = this.filter.keyword.toLowerCase();
      const skillKeyword = this.filter.skills?.toLowerCase() || '';
      const salaryMin = this.filter.salaryMin ? parseInt(this.filter.salaryMin, 10) : null;
      const salaryMax = this.filter.salaryMax ? parseInt(this.filter.salaryMax, 10) : null;

      let result = this.jobs.filter((job) => {
        const matchesKeyword =
          job.j_title?.toLowerCase().includes(keyword) ||
          job.j_description?.toLowerCase().includes(keyword) ||
          job.j_type?.toLowerCase().includes(keyword) ||
          job.e_company_name?.toLowerCase().includes(keyword);

        const matchesSkills =
          skillKeyword === '' ||
          job.j_qualification?.toLowerCase().includes(skillKeyword);

        const matchesType =
          this.filter.type === '' || job.j_type === this.filter.type;

        // เงินเดือน: ถ้าไม่ตั้งช่วง -> ไม่กรอง, ถ้าตั้งช่วงพยายาม parse
        let matchesSalary = true;
        if (salaryMin !== null || salaryMax !== null) {
          const r = this.parseSalaryRange(job.j_salary);
          if (!r) {
            // งานแบบ “ตามตกลง/ไม่มีตัวเลข” ให้ผ่านเมื่อไม่ได้กำหนดเงื่อนไขเข้มงวด
            matchesSalary = true;
          } else {
            const passMin = salaryMin !== null ? r.max >= salaryMin : true;
            const passMax = salaryMax !== null ? r.min <= salaryMax : true;
            matchesSalary = passMin && passMax;
          }
        }

        const matchesEmployer =
          !this.filter.employerType || job.employer_type === this.filter.employerType;

        // ถ้า j_status ไม่มี ให้ถือว่า open
        const isOpen = !job.j_status || job.j_status === 'open';

        return (
          matchesKeyword &&
          matchesSkills &&
          matchesType &&
          matchesSalary &&
          matchesEmployer &&
          isOpen
        );
      });

      // เรียง/คัดกรองตามดรอปดาว
      if (this.viewFilter === 'latest') {
        const safeDate = (x) => (x ? new Date(x) : new Date(0));
        result = result.sort((a, b) => safeDate(b.j_posted_at) - safeDate(a.j_posted_at));
      } else if (this.viewFilter === 'applied') {
        result = result.filter(j => this.appliedJobIds.has(j.job_id));
      } else if (this.viewFilter === 'not_applied') {
        result = result.filter(j => !this.appliedJobIds.has(j.job_id));
      }

      this.filtered = result;
    },

    isBookmarked(jobId) {
      return this.bookmarkedIds.includes(jobId);
    },
    bookmarkJob(job) {
      if (!this.isLoggedIn || !this.user) {
        Swal.fire({
          icon: 'warning',
          title: 'กรุณาเข้าสู่ระบบก่อน',
          text: 'คุณต้องเข้าสู่ระบบเพื่อบันทึกงาน',
          showCancelButton: true,
          confirmButtonText: 'เข้าสู่ระบบ',
          cancelButtonText: 'ยกเลิก',
          confirmButtonColor: '#6a5acd',
          cancelButtonColor: '#aaa'
        }).then((result) => {
          if (result.isConfirmed) this.$router.push('/login');
        });
        return;
      }

      const key = `bookmarkedJobs_${this.user.applicant_id}`;
      let existing = JSON.parse(localStorage.getItem(key)) || [];
      const index = existing.findIndex(j => j.job_id === job.job_id);

      if (index !== -1) {
        existing.splice(index, 1);
        this.bookmarkedIds = this.bookmarkedIds.filter(id => id !== job.job_id);
        Swal.fire({ toast: true, position: 'bottom-end', icon: 'info', title: 'ยกเลิกบันทึกงานแล้ว', showConfirmButton: false, timer: 1500 });
      } else {
        existing.push(job);
        this.bookmarkedIds.push(job.job_id);
        Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'บันทึกงานเรียบร้อย', showConfirmButton: false, timer: 1500 });
      }
      localStorage.setItem(key, JSON.stringify(existing));
    },

    timeAgo(input) {
      if (!input) return '';
      const d = new Date(input);
      if (isNaN(d)) return '';
      const now = new Date();
      let diff = Math.floor((now - d) / 1000);
      const units = [
        { sec: 31536000, name: 'ปี' },
        { sec: 2592000,  name: 'เดือน' },
        { sec: 604800,   name: 'สัปดาห์' },
        { sec: 86400,    name: 'วัน' },
        { sec: 3600,     name: 'ชั่วโมง' },
        { sec: 60,       name: 'นาที' },
        { sec: 1,        name: 'วินาที' },
      ];
      for (const u of units) {
        const val = Math.floor(diff / u.sec);
        if (val >= 1) return `${val} ${u.name}ที่ผ่านมา`;
      }
      return 'เมื่อสักครู่ที่ผ่านมา';
    }
  }
};
</script>

<style scoped>
/* กล่องหัวข้อ + เรียงตาม (สองบรรทัด) */
.results-header{ display:flex; flex-direction:column; gap:6px; }
.sort-row{ display:flex; justify-content:flex-end; align-items:center; }

/* pill select ขวาบน */
.form-select.custom-pill{
  width: 220px !important;
  display: inline-block;
  height: 38px; font-size: 14px; padding: 0 14px;
  border-radius: 999px; border: 1px solid #ddd; background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,.05); transition: all .2s ease;
}
.form-select.custom-pill:focus{
  border-color: #ff6600; box-shadow: 0 0 0 3px rgba(255,102,0,.20);
}

/* Layout */
.main-layout { display: flex; gap: 24px; align-items: stretch; }
.filter-panel { width: 280px; background: #fff; border: none; min-height: auto; }
.shadow-popup { box-shadow: 0 0 30px rgba(0,0,0,0.1); }
.vertical-divider { width: 2px; background-color: #000; opacity: 0.08; align-self: stretch; }
.job-results { flex: 1; }

/* Grid การ์ด */
.job-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 1200px) { .job-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px)  {
  .main-layout { flex-direction: column; gap: 16px; }
  .filter-panel { width: 100%; max-height: 600px; overflow-y: auto; }
  .vertical-divider { display: none; }
  .job-grid { grid-template-columns: 1fr; gap: 16px; }
}

/* Card & Meta */
.job-card { border-radius: 12px; background: #fff; transition: transform .2s ease, box-shadow .2s ease; box-shadow: 0 6px 18px rgba(0,0,0,0.06); }
.job-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,0.08); }

.card-meta { position: absolute; top: 12px; right: 12px; display: flex; align-items: center; gap: 10px; }
.icon-btn { width: 36px; height: 36px; border-radius: 999px; border: 1px solid #e5e5e5; background: #fff; display: inline-flex; align-items: center; justify-content: center; transition: all .15s ease; }
.icon-btn i { font-size: 16px; color: #6b7280; }
.icon-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.icon-btn.saved { border-color: #ffc107; background: #fff9e6; }
.icon-btn.saved i { color: #ff9900; }

.chip-saved { font-size: 12px; padding: 2px 8px; border-radius: 999px; border: 1px solid #ffc107; color: #b26b00; background: #fff9e6; }

/* ป้ายหมวดหมู่ */
.badge-category { background-color: #fff5e6; color: #ff6600; border: 1px solid #ff6600; border-radius: 999px; font-weight: 500; padding: 0.15rem 0.6rem; font-size: 14px; }

/* เวลา “…ที่ผ่านมา” */
.ago-badge { position: absolute; right: 12px; bottom: 10px; font-size: 12px; color: #6b7280; background: #f3f4f6; padding: 4px 10px; border-radius: 999px; box-shadow: inset 0 1px 0 rgba(255,255,255,.6); }

/* ช่องกรอง */
select, input.form-control { background-color: #fcfcfc; border-color: #ddd; }

/* สีส้มแบรนด์ */
.text-orange { color: #ff6600; }
</style>
