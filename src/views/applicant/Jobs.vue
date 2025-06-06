<template>

  <NavbarApplicant />
  <div class="container-fluid px-4 py-4">
    <div class="main-layout align-items-start">
      <!-- Sidebar Filter -->
      <aside class="filter-panel shadow-popup text-start bg-white"
        style="padding: 24px; border-radius: 12px; width: 260px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);">
        <form class="d-flex flex-column gap-3" @submit.prevent="searchJobs">
          <div>
            <label class="form-label mb-1 fw-semibold text-dark">คำที่ต้องการค้นหา</label>
            <div class="position-relative">
              <input v-model="filter.title" @input="searchJobs" type="text" class="form-control ps-4"
                placeholder="  เช่น งานออกแบบ" style="border-radius: 10px; height: 38px; font-size: 14px;" />
              <span class="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted">
                <i class="bi bi-search"></i>
              </span>
            </div>
          </div>

          <div>
            <label class="form-label mb-1 fw-semibold text-dark">ประเภทงาน</label>
            <select v-model="filter.type" @change="searchJobs" class="form-select"
              style="border-radius: 10px; height: 38px; font-size: 14px;">
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

          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <p class="mb-0 text-muted">
              ผลการค้นหา:
            <template
              v-if="!filter.title && !filter.type && !filter.salaryMin && !filter.salaryMax && !filter.employerType">
              ทั้งหมด
            </template>
            <template v-else>
              <span v-if="filter.title"> | คำค้น: "{{ filter.title }}"</span>
              <span v-if="filter.type"> | ประเภทงาน: {{ filter.type }}</span>
              <span v-if="filter.salaryMin || filter.salaryMax">
                | ค่าจ้าง:
                {{ filter.salaryMin ? Number(filter.salaryMin).toLocaleString() : 'ต่ำสุด' }} -
                {{ filter.salaryMax ? Number(filter.salaryMax).toLocaleString() : 'สูงสุด' }}
              </span>
              <span v-if="filter.employerType"> | ผู้ว่าจ้าง: {{ filter.employerType }}</span>
            </template>
          </p>

          <div class="d-flex align-items-center gap-2 mt-2 mt-md-0">
            <label class="form-label fw-semibold mb-0" style="white-space: nowrap;">เรียงตาม:</label>
            <select v-model="filter.sort" @change="searchJobs" class="form-select"
              style="border-radius: 10px; height: 38px; font-size: 14px; min-width: 160px;">
              <option value="">ไม่เรียง</option>
              <option value="latest">วันที่โพสต์ล่าสุด</option>
              <option value="salary">ค่าจ้างสูงสุด</option>
              <option value="deadline">หมดเขตเร็วที่สุด</option>
            </select>
          </div>
        </div>




        <div class="job-grid">
          <div class="job-card p-4 bg-white border rounded-3 shadow-sm position-relative" v-for="job in filteredJobs"
            :key="job.job_id">
            <span class="badge bg-warning text-dark position-absolute top-0 end-0 mt-2 me-2"
              style="font-size: 0.75rem;">ใหม่</span>
            <h6 class="fw-bold text-orange mb-2">
              <i class="bi bi-briefcase-fill me-2"></i> {{ job.j_title }}
            </h6>
            <p class="mb-1 text-muted"><i class="bi bi-tags-fill me-1"></i> {{ job.j_type }}</p>
            <p class="mb-1 text-muted"><i class="bi bi-cash-coin me-1"></i> {{ job.j_salary.toLocaleString() }} บาท</p>
            <p class="mb-1 text-muted"><i class="bi bi-person-badge me-1"></i> {{ job.employer_type || 'ไม่ระบุ' }}</p>
            <p class="mb-1 text-muted"><i class="bi bi-clock me-1"></i> โพสต์เมื่อ: {{ new
              Date(job.j_posted_at).toLocaleDateString('th-TH') }}</p>
            <p class="mb-1 text-muted"><i class="bi bi-calendar-event me-1"></i> หมดเขต: {{ new
              Date(job.j_appdeadline).toLocaleDateString('th-TH') }}</p>

            <div class="d-flex justify-content-between mt-3">
             <router-link :to="`/applicant/jobs/${job.job_id}`" class="btn btn-sm btn-outline-primary rounded-pill px-3">
  ดูรายละเอียด
</router-link>

              <div>
                <button class="btn btn-sm rounded-pill me-1"
                  :class="isBookmarked(job.job_id) ? 'btn-warning' : 'btn-outline-secondary'" @click="bookmarkJob(job)">
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
import NavbarApplicant from '@/components/NavbarApplicant.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'ApplicantJobList',
  components: { NavbarApplicant },
  data() {
    return {
      showLoginPopup: false,
      isLoggedIn: localStorage.getItem('authToken') !== null,
      filter: {
        title: '',
        type: '',
        salaryMin: '',
        salaryMax: '',
        employerType: '',
        sort: '',
      },
      jobs: [],
      filtered: [],
      bookmarkedIds: [],
    };
  },
  computed: {
    filteredJobs() {
      return this.filtered;
    },
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem("bookmarkedJobs")) || [];
    this.bookmarkedIds = saved.map(j => j.job_id);

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
      const salaryMin = this.filter.salaryMin ? parseInt(this.filter.salaryMin) : 0;
      const salaryMax = this.filter.salaryMax ? parseInt(this.filter.salaryMax) : Number.MAX_SAFE_INTEGER;

      this.filtered = this.jobs
        .filter((job) => {
          const titleMatch = job.j_title?.toLowerCase().includes(this.filter.title.toLowerCase());
          const typeMatch = this.filter.type === '' || job.j_type === this.filter.type;
          const salaryMatch = job.j_salary >= salaryMin && job.j_salary <= salaryMax;
          const employerMatch = this.filter.employerType === '' || job.employer_type === this.filter.employerType;
          return titleMatch && typeMatch && salaryMatch && employerMatch && job.j_status === 'open';
        })
        .sort((a, b) => {
          if (this.filter.sort === 'latest') return new Date(b.j_posted_at) - new Date(a.j_posted_at);
          if (this.filter.sort === 'salary') return b.j_salary - a.j_salary;
          if (this.filter.sort === 'deadline') return new Date(a.j_appdeadline) - new Date(b.j_appdeadline);
          return 0;
        });
    },
      getJobDetailLink(id) {
    return this.isLoggedIn ? `/applicant/jobs/${id}` : `/jobs/${id}`;
  },
    isBookmarked(jobId) {
      return this.bookmarkedIds.includes(jobId);
    },
    bookmarkJob(job) {
      const key = "bookmarkedJobs";
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
    },
    shareJob(job) {
      const shareUrl = `${window.location.origin}/jobs/${job.job_id}`;
      const message = `ดูงานนี้: ${job.j_title}\n${shareUrl}`;

      try {
        if (navigator.share) {
          navigator.share({
            title: job.j_title,
            text: message,
            url: shareUrl,
          }).catch(() => {
            Swal.fire("ไม่สามารถแชร์ได้", "อุปกรณ์ของคุณไม่รองรับการแชร์", "info");
          });
        } else if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          navigator.clipboard.writeText(shareUrl)
            .then(() => {
              Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'success',
                title: 'คัดลอกลิงก์งานเรียบร้อยแล้ว',
                showConfirmButton: false,
                timer: 1500
              });
            })
            .catch(() => {
              Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถคัดลอกลิงก์ได้", "error");
            });
        } else {
          // fallback แบบ textarea
          const textarea = document.createElement("textarea");
          textarea.value = shareUrl;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "absolute";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          textarea.select();
          try {
            const success = document.execCommand("copy");
            if (success) {
              Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'success',
                title: 'คัดลอกลิงก์งานเรียบร้อยแล้ว (fallback)',
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              throw new Error("copy command failed");
            }
          } catch (err) {
            Swal.fire("ไม่สามารถแชร์ได้", "เบราว์เซอร์ของคุณไม่รองรับการแชร์หรือคัดลอก", "warning");
          }
          document.body.removeChild(textarea);
        }
      } catch (err) {
        console.error("❌ shareJob error:", err);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถดำเนินการแชร์ได้", "error");
      }
    }
  }
};
</script>


<style scoped>
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