<template>
  <NavbarHome />
  <div class="container-fluid px-4 py-4">
    <div class="main-layout align-items-start">
      <!-- Sidebar Filter -->
      <aside class="filter-panel shadow-popup text-start bg-white"
        style="padding: 24px; border-radius: 12px; width: 260px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);">
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
    style="border-radius: 10px; height: 38px; font-size: 14px; padding-left: 2.2rem;" />

  <span class="position-absolute top-50 translate-middle-y text-muted" style="left: 12px;">
    <i class="bi bi-search"></i>
  </span>
</div>



          </div>

          <div>
            <label class="form-label mb-1 fw-semibold text-dark">หมวดหมู่งาน</label>

            <select v-model="filter.type" @change="searchJobs" class="form-select"
              style="border-radius: 10px; height: 38px; font-size: 14px;">
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
<!-- ฟิลด์: ทักษะที่ใช้ -->
<div>
  <label class="form-label mb-1 fw-semibold text-dark">ทักษะที่ใช้</label>
  <input
    v-model="filter.skills"
    @input="searchJobs"
    type="text"
    class="form-control"
    placeholder="เช่น HTML, Photoshop, Python"
    style="border-radius: 10px; height: 38px; font-size: 14px;" />
</div>

          <div>
            <label class="form-label mb-1 fw-semibold text-dark">ค่าจ้าง (บาท)</label>
            <div class="d-flex align-items-center">
              <select v-model="filter.salaryMin" @change="searchJobs" class="form-select me-2"
                style="border-radius: 10px; height: 38px; font-size: 14px;">
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
              <select v-model="filter.salaryMax" @change="searchJobs" class="form-select ms-2"
                style="border-radius: 10px; height: 38px; font-size: 14px;">
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
            <select v-model="filter.employerType" @change="searchJobs" class="form-select mb-2"
              style="border-radius: 10px; height: 38px; font-size: 14px;">
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
            <button class="btn text-white fw-bold"
              style="width: 100%; background: linear-gradient(135deg,#ff6600,#e55d00); border-radius: 10px; height: 40px; font-size: 14px; box-shadow: 0 2px 10px rgba(255, 102, 0, 0.3);"
              type="submit">
              ค้นหา
            </button>
          </div>
        </form>
      </aside>
      <div class="vertical-divider"></div>

      <!-- Job Results -->
      <section class="job-results">
        <h5 class="mb-2 text-orange">พบ {{ filteredJobs.length }} งาน</h5>
        <div class="job-grid">
          <div class="job-card p-4 bg-white border rounded-3 shadow-sm position-relative"
               v-for="job in filteredJobs" :key="job.job_id">
            <span class="position-absolute top-0 end-0 mt-2 me-2 text-muted small">
              {{ new Date(job.j_posted_at).toLocaleDateString('th-TH') }}
            </span>
            <div class="d-flex align-items-center mb-3">
              <img :src="job.e_profile_img_url ? `http://localhost:3001${job.e_profile_img_url}` : '/default-profile.jpg'"
                   alt="โลโก้บริษัท" class="rounded-circle shadow-sm me-3"
                   style="width: 42px; height: 42px; object-fit: cover" />
              <div>
                <div class="fw-semibold">{{ job.e_company_name || 'ชื่อบริษัทไม่ระบุ' }}</div>
              </div>
            </div>
            <h5 class="fw-bold text-orange mb-2">{{ job.j_title }}</h5>
            <div v-if="job.j_type" class="mb-2">
              <span class="badge-category">
  {{ job?.j_type || '-' }}
</span>
            </div>
            <p class="mb-1 text-muted">
              <i class="bi bi-people-fill me-1"></i>
              รับจำนวน: {{ job.j_amount || '-' }} คน
            </p>
            <p class="mb-1 text-muted">
              <i class="bi bi-cash-coin me-1"></i>
              ค่าจ้าง: {{ Number(job.j_salary).toLocaleString() }} บาท
            </p>
            <div class="d-flex justify-content-between mt-3">
              <router-link :to="getJobDetailLink(job.job_id)" class="btn btn-sm btn-outline-primary rounded-pill px-3">
                ดูรายละเอียด
              </router-link>
              <div>
                <button class="btn btn-sm rounded-pill me-1"
                        :class="isBookmarked(job.job_id) ? 'btn-warning' : 'btn-outline-secondary'"
                        @click="bookmarkJob(job)">
                  <i :class="isBookmarked(job.job_id) ? 'bi bi-bookmark-fill' : 'bi bi-bookmark'"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="shareJob(job)">
                  <i class="bi bi-share"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
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
      filter: {
  keyword: '',
  type: '',
  salaryMin: '',
  salaryMax: '',
  employerType: '',
  sort: '',
  skills: '',
}
,
      jobs: [],
      filtered: [],
      bookmarkedIds: [],
      user: null,
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
    searchJobs() {
  const keyword = this.filter.keyword.toLowerCase();
  const skillKeyword = this.filter.skills?.toLowerCase() || '';
  const salaryMin = this.filter.salaryMin ? parseInt(this.filter.salaryMin) : 0;
  const salaryMax = this.filter.salaryMax ? parseInt(this.filter.salaryMax) : Number.MAX_SAFE_INTEGER;

  this.filtered = this.jobs.filter((job) => {
    const matchesKeyword =
      job.j_title?.toLowerCase().includes(keyword) ||
      job.j_description?.toLowerCase().includes(keyword) ||
      job.j_type?.toLowerCase().includes(keyword) ||
      job.e_company_name?.toLowerCase().includes(keyword);

    const matchesSkills =
      skillKeyword === '' ||
      job.j_qualification?.toLowerCase().includes(skillKeyword);

    const matchesType = this.filter.type === '' || job.j_type === this.filter.type;
    const matchesSalary = job.j_salary >= salaryMin && job.j_salary <= salaryMax;
    const matchesEmployer = this.filter.employerType === '' || job.employer_type === this.filter.employerType;

    return (
      matchesKeyword &&
      matchesSkills &&
      matchesType &&
      matchesSalary &&
      matchesEmployer &&
      job.j_status === 'open'
    );
  });
}

,
    getJobDetailLink(id) {
      return this.isLoggedIn ? `/applicant/jobs/${id}` : `/jobs/${id}`;
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
      if (result.isConfirmed) {
        this.$router.push('/login');
      }
    });
    return;
  }

  const key = `bookmarkedJobs_${this.user.applicant_id}`;
  let existing = JSON.parse(localStorage.getItem(key)) || [];
  const index = existing.findIndex(j => j.job_id === job.job_id);

  if (index !== -1) {
    existing.splice(index, 1);
    this.bookmarkedIds = this.bookmarkedIds.filter(id => id !== job.job_id);
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'info',
      title: 'ยกเลิกบันทึกงานแล้ว',
      showConfirmButton: false,
      timer: 1500
    });
  } else {
    existing.push(job);
    this.bookmarkedIds.push(job.job_id);
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: 'บันทึกงานเรียบร้อย',
      showConfirmButton: false,
      timer: 1500
    });
  }

  localStorage.setItem(key, JSON.stringify(existing));
}
,
    shareJob(job) {
      const shareUrl = `${window.location.origin}/jobs/${job.job_id}`;
      const message = `ดูงานนี้: ${job.j_title}\n${shareUrl}`;

      if (navigator.share) {
        navigator.share({ title: job.j_title, text: message, url: shareUrl })
          .catch(() => Swal.fire('ไม่สามารถแชร์ได้', 'อุปกรณ์ของคุณไม่รองรับ', 'info'));
      } else if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(shareUrl)
          .then(() => Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'คัดลอกลิงก์แล้ว', showConfirmButton: false, timer: 1500 }))
          .catch(() => Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถคัดลอกได้', 'error'));
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          if (document.execCommand('copy')) {
            Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'คัดลอกลิงก์งานเรียบร้อย (fallback)', showConfirmButton: false, timer: 1500 });
          } else {
            throw new Error('copy failed');
          }
        } catch {
          Swal.fire('ไม่สามารถแชร์ได้', 'เบราว์เซอร์ของคุณไม่รองรับการแชร์', 'warning');
        }
        document.body.removeChild(textarea);
      }
    }
  }
};
</script>


<style scoped>
.badge-category {
  background-color: #fff5e6;
  color: #ff6600;
  border: 1px solid #ff6600;
  border-radius: 999px;
  font-weight: 500;
  padding: 0.15rem 0.6rem;
  font-size: 15px;
}


.custom-select {
  border-radius: 999px;
  padding: 0.45rem 1.25rem;
  font-size: 0.95rem;
  border: 1px solid #ddd;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  min-width: 160px;
  max-width: 220px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  /* ลูกศร */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23666' class='bi bi-chevron-down' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2rem;
}

.custom-select:focus {
  outline: none;
  border-color: #ff6600;
  box-shadow: 0 0 0 0.15rem rgba(255, 102, 0, 0.25);
}


.text-orange {
  color: #ff6600;
}

.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(255, 102, 0, 0.2);
  transition: 0.3s ease;
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