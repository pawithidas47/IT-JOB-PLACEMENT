<template>
  <div>
    <NavbarApplicant />
    <div class="container-fluid px-4 py-4">
      <div class="main-layout align-items-start">
        <!-- Sidebar Filter -->
        <aside
          class="filter-panel shadow-popup text-start bg-white"
          style="padding: 24px; border-radius: 12px; width: 260px; box-shadow: 0 10px 20px rgba(0,0,0,.1);"
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
              <label class="form-label mb-1 fw-semibold text-dark">ประเภทงาน</label>
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
                placeholder="เช่น HTML, Photoshop, Python"
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
                style="width: 100%; background: linear-gradient(135deg,#ff6600,#e55d00); border-radius: 10px; height: 40px; font-size: 14px; box-shadow: 0 2px 10px rgba(255,102,0,.3);"
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
          <!-- แถบตัวกรองเรียงตาม -->
       <!-- ส่วนหัวผลลัพธ์ -->
<!-- ส่วนหัวผลลัพธ์ -->
<!-- หัวข้อผลลัพธ์ + แถวเรียงตาม -->
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
</div><br>




          <div class="job-grid">
            <div
              class="job-card p-4 bg-white border rounded-3 shadow-sm position-relative"
              v-for="job in filteredJobs"
              :key="job.job_id"
              @click="$router.push({ name: 'ApplicantJobDetail', params: { id: job.job_id } })"
              style="cursor:pointer"
            >
              <!-- ปุ่มบันทึก: มุมขวาบน -->
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

              <!-- โลโก้ + บริษัท -->
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
                <i class="bi bi-cash-coin me-1"></i> ค่าจ้าง:
                {{ Number(job.j_salary).toLocaleString('th-TH', { maximumFractionDigits: 0 }) }} บาท
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
import NavbarApplicant from '@/components/NavbarApplicant.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'ApplicantJobList',
  components: { NavbarApplicant },
  data() {
    return {
      isLoggedIn: localStorage.getItem('authToken') !== null,
      filter: {
        keyword: '',
        type: '',
        skills: '',
        salaryMin: '',
        salaryMax: '',
        employerType: '',
      },
      viewFilter: 'all',
      jobs: [],
      filtered: [],
      bookmarkedIds: [],
      appliedJobIds: [],
      user: null,
    };
  },
  computed: {
    filteredJobs() {
      return this.filtered;
    },
  },
  async mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    const key = `bookmarkedJobs_${this.user?.applicant_id}`;
    const saved = JSON.parse(localStorage.getItem(key)) || [];
    this.bookmarkedIds = saved.map((j) => j.job_id);

    try {
      const [jobsRes, appsRes] = await Promise.all([
        axios.get('http://localhost:3001/api/jobs'),
        this.user?.applicant_id
          ? axios.get(`http://localhost:3001/api/applications/${this.user.applicant_id}`)
          : Promise.resolve({ data: [] }),
      ]);

      this.jobs = jobsRes.data;
      this.appliedJobIds = (appsRes.data || []).map(a => a.job_id);
      this.searchJobs();
    } catch (err) {
      console.error('❌ ดึงข้อมูลล้มเหลว:', err);
    }
  },
  methods: {
    // ✅ แปลง "ค่าจ้าง (string)" เป็นช่วงตัวเลข
    // คืนรูปแบบ { min: number, max: number } ถ้าไม่สามารถตีความได้จะคืน {min:0, max:Infinity}
    parseSalaryRange(s) {
      if (s == null) return { min: 0, max: Infinity };
      const text = String(s).trim();

      // ตามตกลง / ไม่ระบุ
      if (!text || /ตามตกลง|ไม่ระบุ/i.test(text)) return { min: 0, max: Infinity };

      // ดึงตัวเลขทั้งหมด (ตัด comma ฯลฯ)
      const nums = (text.match(/\d[\d,]*/g) || []).map(n => Number(n.replace(/,/g, '')))
                     .filter(n => !isNaN(n));

      if (nums.length === 0) {
        // "2500+" / ไม่มีตัวเลขชัดเจน → พยายามหาเลขหน้า "+" ถ้ามี
        const plus = text.match(/(\d[\d,]*)\s*\+/);
        if (plus) {
          const v = Number(plus[1].replace(/,/g, ''));
          return isNaN(v) ? { min: 0, max: Infinity } : { min: v, max: Infinity };
        }
        return { min: 0, max: Infinity };
      }

      if (nums.length === 1) {
        // เช่น "รายวัน 800" / "2,500+" ให้เป็นช่วง [v, +∞)
        const v = nums[0];
        if (/\+/.test(text)) return { min: v, max: Infinity };
        return { min: v, max: v };
      }

      // มีสองค่า เช่น "10,500 – 12,000"
      const [a, b] = nums;
      return { min: Math.min(a, b), max: Math.max(a, b) };
    },

    // ✅ ตีความสถานะ: null/'' ให้เป็น open (เว้น closed)
    isOpenStatus(j) {
      const s = (j?.j_status || 'open').toLowerCase();
      return s !== 'closed';
    },

    // ✅ ฟิลเตอร์หลัก
    searchJobs() {
      const keyword = this.filter.keyword.toLowerCase();
      const skillKeyword = this.filter.skills?.toLowerCase() || '';

      // ถ้าไม่ได้ตั้งช่วงค่าจ้าง → ไม่ต้องบังคับเช็คช่วง
      const useSalaryFilter = this.filter.salaryMin !== '' || this.filter.salaryMax !== '';
      const salaryMin = this.filter.salaryMin ? parseInt(this.filter.salaryMin) : 0;
      const salaryMax = this.filter.salaryMax ? parseInt(this.filter.salaryMax) : Number.MAX_SAFE_INTEGER;

      let list = this.jobs.filter((job) => {
        // 1) เปิดรับ (open) โดยปริยาย
        if (!this.isOpenStatus(job)) return false;

        // 2) Keyword
        const matchesKeyword =
          job.j_title?.toLowerCase().includes(keyword) ||
          job.j_description?.toLowerCase().includes(keyword) ||
          job.j_type?.toLowerCase().includes(keyword) ||
          job.e_company_name?.toLowerCase().includes(keyword);

        if (!matchesKeyword) return false;

        // 3) Skills (ค้นในคุณสมบัติ)
        const matchesSkills =
          !skillKeyword || job.j_qualification?.toLowerCase().includes(skillKeyword);
        if (!matchesSkills) return false;

        // 4) ประเภทงาน
        const matchesType = !this.filter.type || job.j_type === this.filter.type;
        if (!matchesType) return false;

        // 5) ประเภทผู้ว่าจ้าง (ถ้าเก็บใน job)
        const matchesEmployer =
          !this.filter.employerType || job.employer_type === this.filter.employerType;
        if (!matchesEmployer) return false;

        // 6) ค่าจ้าง (เช็คแบบช่วงทับซ้อน)
        if (useSalaryFilter) {
          const { min, max } = this.parseSalaryRange(job.j_salary);
          const overlap = Math.max(min, salaryMin) <= Math.min(max, salaryMax);
          if (!overlap) return false;
        }

        return true;
      });

      // ฟิลเตอร์สถานะการสมัคร
      if (this.viewFilter === 'applied') {
        list = list.filter(j => this.appliedJobIds.includes(j.job_id));
      } else if (this.viewFilter === 'not_applied') {
        list = list.filter(j => !this.appliedJobIds.includes(j.job_id));
      }

      // เรียงล่าสุด
      if (this.viewFilter === 'latest') {
        list = list.slice().sort((a, b) => new Date(b.j_posted_at) - new Date(a.j_posted_at));
      }

      this.filtered = list;
    },

    isBookmarked(jobId) {
      return this.bookmarkedIds.includes(jobId);
    },

    bookmarkJob(job) {
      const key = `bookmarkedJobs_${this.user?.applicant_id}`;
      let existing = JSON.parse(localStorage.getItem(key)) || [];
      const index = existing.findIndex((j) => j.job_id === job.job_id);

      if (index !== -1) {
        existing.splice(index, 1);
        this.bookmarkedIds = this.bookmarkedIds.filter((id) => id !== job.job_id);
        Swal.fire({ toast:true, position:'bottom-end', icon:'info', title:'ยกเลิกบันทึกงานแล้ว', showConfirmButton:false, timer:1500 });
      } else {
        existing.push(job);
        this.bookmarkedIds.push(job.job_id);
        Swal.fire({ toast:true, position:'bottom-end', icon:'success', title:'บันทึกงานเรียบร้อย', showConfirmButton:false, timer:1500 });
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
    },
  },
};
</script>

<style scoped>
/* กล่องหัวข้อ + เรียงตาม (สองบรรทัด) */
.results-header{
  display:flex;
  flex-direction:column;   /* ให้ “เรียงตาม” ลงบรรทัดใหม่ */
  gap:6px;
}

/* แถว “เรียงตาม” ชิดขวา */
.sort-row{
  display:flex;
  justify-content:flex-end;  /* ไปขวาสุด */
  align-items:center;
}

/* ปรับให้เป็นทรง pill และ "ไม่ยืดเต็มบรรทัด" */
.form-select.custom-pill{
  width: 220px !important;       /* บังคับความกว้าง */
  display: inline-block;          /* กันการยืดเต็ม */
  height: 38px;
  font-size: 14px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #ddd;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,.05);
  transition: all .2s ease;
}

.form-select.custom-pill:focus{
  border-color: #ff6600;
  box-shadow: 0 0 0 3px rgba(255,102,0,.20);
}


.main-layout { display: flex; gap: 24px; align-items: stretch; }
.filter-panel { width: 280px; background: #fff; border: none; min-height: auto; }
.shadow-popup { box-shadow: 0 0 30px rgba(0,0,0,.1); }
.vertical-divider { width: 2px; background-color: #000; opacity: .08; align-self: stretch; }
.job-results { flex: 1; }

/* กริดการ์ด */
.job-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 1200px) { .job-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .main-layout { flex-direction: column; gap: 16px; }
  .filter-panel { width: 100%; max-height: 600px; overflow-y: auto; }
  .vertical-divider { display: none; }
  .job-grid { grid-template-columns: 1fr; gap: 16px; }
}

/* Card */
.job-card {
  border-radius: 12px;
  background: #fff;
  transition: transform .2s ease, box-shadow .2s ease;
  box-shadow: 0 6px 18px rgba(0,0,0,.06);
}
.job-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.08); }

/* ปุ่มบันทึกมุมขวาบน */
.card-meta{ position:absolute; top:12px; right:12px; display:flex; align-items:center; gap:10px; }
.icon-btn{
  width:36px;height:36px;border-radius:999px;border:1px solid #e5e5e5;background:#fff;
  display:inline-flex;align-items:center;justify-content:center;transition:all .15s ease;
}
.icon-btn i{ font-size:16px; color:#6b7280; }
.icon-btn:hover{ transform:translateY(-1px); box-shadow:0 4px 16px rgba(0,0,0,.08); }
.icon-btn.saved{ border-color:#ffc107; background:#fff9e6; }
.icon-btn.saved i{ color:#ff9900; }

/* ป้ายหมวดหมู่ */
.badge-category {
  background-color: #fff5e6; color: #ff6600; border: 1px solid #ff6600;
  border-radius: 999px; font-weight: 500; padding: .15rem .6rem; font-size: 14px;
}

/* ป้ายเวลา “…ที่ผ่านมา” มุมขวาล่าง */
.ago-badge{
  position:absolute; right:12px; bottom:10px; font-size:12px; color:#6b7280;
  background:#f3f4f6; padding:4px 10px; border-radius:999px; box-shadow: inset 0 1px 0 rgba(255,255,255,.6);
}

/* ช่องกรอง */
select, input.form-control{ background-color:#fcfcfc; border-color:#ddd; }

/* สีส้มแบรนด์ */
.text-orange{ color:#ff6600; }
</style>
