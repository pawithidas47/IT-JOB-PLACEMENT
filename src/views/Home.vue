<template>  
  <div>
    <NavbarHome />
    <div class="container-fluid px-4 py-4">
      <div class="main-layout">
        <!-- === FILTER PANEL === -->
        <aside class="filter-panel">
          <form class="stack" @submit.prevent="searchJobs">
            <!-- คำค้น -->
            <div class="field">
              <label class="label">คำที่ต้องการค้นหา</label>
              <div class="input-icon">
                <i class="bi bi-search"></i>
                <input
                  v-model="filter.keyword"
                  @input="searchJobs"
                  type="text"
                  placeholder="เช่น เขียนโปรแกรม, บริษัท"
                />
              </div>
            </div>

            <hr class="divider" />

            <!-- หมวดหมู่ -->
            <div class="field">
              <label class="label">หมวดหมู่งาน</label>
              <select v-model="filter.type" @change="searchJobs">
                <option value="">ทั้งหมด</option>
                <option value="การตลาดดิจิทัล">การตลาดดิจิทัล</option>
                <option value="งานแปล / เขียนบทความ">งานแปล / เขียนบทความ</option>
                <option value="งานตัดต่อวิดีโอ / สร้างคอนเทนต์">งานตัดต่อวิดีโอ / สร้างคอนเทนต์</option>
                <option value="งานออกแบบ UX/UI">งานออกแบบ UX/UI</option>
                <option value="งานออกแบบกราฟิก / มัลติมีเดีย">งานออกแบบกราฟิก / มัลติมีเดีย</option>
                <option value="คีย์ข้อมูล / ป้อนข้อมูล">คีย์ข้อมูล / ป้อนข้อมูล</option>
                <option value="ดูแลระบบเครือข่าย">ดูแลระบบเครือข่าย</option>
                <option value="พัฒนาเว็บไซต์">พัฒนาเว็บไซต์</option>
                <option value="พัฒนาแอปพลิเคชัน">พัฒนาแอปพลิเคชัน</option>
                <option value="ผู้ดูแลเพจ / โซเชียลมีเดีย">ผู้ดูแลเพจ / โซเชียลมีเดีย</option>
                <option value="ที่ปรึกษาด้านเทคโนโลยี">ที่ปรึกษาด้านเทคโนโลยี</option>
                <option value="สนับสนุนงานไอที">สนับสนุนงานไอที (IT Support)</option>
                <option value="อื่น ๆ">อื่น ๆ</option>
              </select>
            </div>

            <!-- ทักษะ -->
            <div class="field">
              <label class="label">ทักษะที่ใช้</label>
              <input
                v-model="filter.skills"
                @input="searchJobs"
                type="text"
                placeholder="เช่น HTML, Photoshop"
              />
            </div>

            <hr class="divider" />

            <!-- ชนิดงาน -->
            <div class="field">
              <label class="label">ชนิดงาน</label>
              <div class="chips two-cols">
                <button
                  v-for="opt in workTypeOptions"
                  :key="opt.value"
                  type="button"
                  class="chip"
                  :class="{ active: filter.workType === opt.value }"
                  @click="toggleWorkType(opt.value)"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- วันทำงาน -->
            <div class="field">
              <label class="label">วันทำงาน</label>
              <div class="chips two-cols">
                <button
                  v-for="p in dayPresets"
                  :key="p.value"
                  type="button"
                  class="chip"
                  :class="{ active: filter.dayPreset === p.value }"
                  @click="selectDayPreset(p.value)"
                >
                  {{ p.label }}
                </button>
              </div>

              <!-- โชว์เมื่อเลือกกำหนดเอง -->
              <div v-if="filter.dayPreset === 'custom'" class="days-grid">
                <label v-for="d in dayOptions" :key="d.value" class="day-item">
                  <input
                    type="checkbox"
                    :value="d.value"
                    v-model="filter.workDaysCustom"
                    @change="searchJobs"
                  />
                  <span>{{ d.label }}</span>
                </label>
              </div>
            </div>

            <!-- ช่วงเวลาทำงาน (dropdown แบบช่วงเวลา) -->
            <div class="field">
              <label class="label">ช่วงเวลาทำงาน</label>
              <select v-model="filter.timeSlot" @change="searchJobs">
                <option value="">ไม่ระบุ</option>
                <option value="morning">08:00–12:00</option>
                <option value="afternoon">13:00–17:00</option>
                <option value="evening">17:00–21:00</option>
                <option value="night">21:00–00:00</option>
                <option value="fullday">09:00–18:00</option>
              </select>
            </div>

            <!-- ปุ่ม -->
            <div class="actions">
              <button type="button" class="btn-outline" @click="resetForm">รีเซ็ต</button>
              <button type="submit" class="btn-primary">ค้นหา</button>
            </div>
          </form>
        </aside>

        <!-- === RESULTS === -->
        <div class="vertical-divider"></div>
        <section class="job-results">
          <div class="results-header">
            <h5 class="mb-1 text-orange">พบ {{ filteredJobs.length }} งาน</h5>
            <div class="sort-row">
              
            
            </div>
          </div>

          <!-- สรุปผลการค้นหา -->
          <div v-if="searchSummaryParts.length" class="search-summary">
            <span class="search-title">ผลการค้นหา</span>
            <template v-for="(txt, i) in searchSummaryParts" :key="i">
              <span class="pipe" v-if="i>0">|</span>
              <span class="summary-item">{{ txt }}</span>
            </template>
          </div>

          <div class="job-grid">
            <div
              v-for="job in filteredJobs"
              :key="job.job_id"
              class="job-card"
              @click="openJob(job.job_id)"
            >
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

              <div class="co">
                <img
                  :src="job.e_profile_img_url ? `http://localhost:3001${job.e_profile_img_url}` : '/default-profile.jpg'"
                  alt="company"
                />
                <div class="co-name">{{ job.e_company_name || 'ชื่อบริษัทไม่ระบุ' }}</div>
              </div>

              <div class="title-row">
                <h5 class="title">{{ job.j_title }}</h5>
                <span v-if="isBookmarked(job.job_id)" class="chip-saved">บันทึกแล้ว</span>
              </div>

              <div v-if="displayCategory(job)" class="badge-category">{{ displayCategory(job) }}</div>

              <!-- ชนิดงาน -->
              <div v-if="displayWorkType(job)" class="muted">
                <i class="bi bi-briefcase me-1"></i>{{ displayWorkType(job) }}
              </div>


              <div class="muted"><i class="bi bi-people-fill me-1"></i>รับ: {{ job.j_amount || '-' }} คน</div>
              <div class="muted"><i class="bi bi-cash-coin me-1"></i>ค่าจ้าง: {{ salaryDisplay(job) }}</div>

              <div class="ago">{{ timeAgo(job.j_posted_at) }}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import NavbarHome from '@/components/NavbarHome.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'GuestJobListNeat',
  components: { NavbarHome },
  data() {
    return {
      isLoggedIn: localStorage.getItem('authToken') !== null,
      viewFilter: 'all',

      filter: {
        keyword: '',
        type: '',
        skills: '',
        workType: '',
        dayPreset: 'any',
        workDaysCustom: [],
        timeSlot: ''
      },

      jobs: [],
      filtered: [],
      bookmarkedIds: [],
      user: null,
      appliedJobIds: new Set(),

      workTypeOptions: [
        { value: 'one-shot', label: 'งานชิ้นเดียว' },
        { value: 'hourly',   label: 'รายชั่วโมง' },
        { value: 'parttime', label: 'พาร์ทไทม์' },
        { value: 'fulltime', label: 'ฟูลไทม์' },
      ],
      dayPresets: [
        { value: 'any',     label: 'ไม่ระบุ' },
        { value: 'alldays', label: 'ทุกวัน' },
        { value: 'weekday', label: 'จันทร์–ศุกร์' },
        { value: 'weekend', label: 'เสาร์–อาทิตย์' },
        { value: 'custom',  label: 'กำหนดเอง' },
      ],
      dayOptions: [
        { value: 'mon', label: 'จันทร์' },
        { value: 'tue', label: 'อังคาร' },
        { value: 'wed', label: 'พุธ' },
        { value: 'thu', label: 'พฤหัสฯ' },
        { value: 'fri', label: 'ศุกร์' },
        { value: 'sat', label: 'เสาร์' },
        { value: 'sun', label: 'อาทิตย์' },
      ],
    };
  },

  computed: {
    filteredJobs() { return this.filtered; },
    searchSummaryParts() {
      const parts = [];
      if (this.filter.keyword) parts.push(`คำค้น: ${this.filter.keyword}`);
      if (this.filter.type) parts.push(`หมวดหมู่: ${this.filter.type}`);
      if (this.filter.skills) parts.push(`ทักษะ: ${this.filter.skills}`);
      if (this.filter.workType) {
        const opt = this.workTypeOptions.find(o => o.value === this.filter.workType);
        parts.push(`ชนิดงาน: ${opt ? opt.label : this.filter.workType}`);
      }
      if (this.filter.dayPreset && this.filter.dayPreset !== 'any') {
        const map = {alldays:'ทุกวัน', weekday:'จันทร์–ศุกร์', weekend:'เสาร์–อาทิตย์'};
        let txt = map[this.filter.dayPreset];
        if (this.filter.dayPreset === 'custom' && this.filter.workDaysCustom.length) {
          const th = {mon:'จ.',tue:'อ.',wed:'พ.',thu:'พฤ.',fri:'ศ.',sat:'ส.',sun:'อา.'};
          txt = this.filter.workDaysCustom.map(d => th[d] || d).join(', ');
        }
        parts.push(`วันทำงาน: ${txt || 'ไม่ระบุ'}`);
      }
      if (this.filter.timeSlot) {
        const slotLabel = {
          morning:'เช้า 08:00–12:00',
          afternoon:'บ่าย 13:00–17:00',
          evening:'เย็น 17:00–21:00',
          night:'กะดึก 21:00–00:00',
          fullday:'เต็มวัน 09:00–18:00'
        }[this.filter.timeSlot];
        parts.push(`เวลา: ${slotLabel}`);
      }
      return parts;
    }
  },

  async mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user) {
      const key = `bookmarkedJobs_${this.user.applicant_id}`;
      const saved = JSON.parse(localStorage.getItem(key)) || [];
      this.bookmarkedIds = saved.map(j => j.job_id);
      await this.loadAppliedJobs();
    }

    try {
      const res = await axios.get('http://localhost:3001/api/jobs');
      this.jobs = res.data || [];
      this.searchJobs(); // เรียงล่าสุดเสมอ
    } catch (err) {
      console.error('❌ ดึงข้อมูลงานล้มเหลว:', err);
    }
  },

  methods: {
    async loadAppliedJobs() {
      if (!this.user) return;
      try {
        const res = await axios.get(`http://localhost:3001/api/applications/${this.user.applicant_id}`);
        this.appliedJobIds = new Set((res.data || []).map(a => a.job_id));
      } catch (e) {
        console.warn('loadAppliedJobs failed:', e);
      }
    },

    openJob(id) { this.$router.push(this.isLoggedIn ? `/applicant/jobs/${id}` : `/jobs/${id}`); },

    // UI
    toggleWorkType(val){ this.filter.workType = this.filter.workType === val ? '' : val; this.searchJobs(); },
    selectDayPreset(val){ this.filter.dayPreset = val; if (val !== 'custom') this.filter.workDaysCustom = []; this.searchJobs(); },
    resetForm(){
      this.filter = { keyword:'', type:'', skills:'', workType:'', dayPreset:'any', workDaysCustom:[], timeSlot:'' };
      this.searchJobs();
    },

    // helpers
    _norm(s){ return (s || '').toString().trim().toLowerCase(); },
    _mapWorkType(str){
      const s=this._norm(str); if(!s) return '';
      if (s.includes('ชิ้น')) return 'one-shot';
      if (s.includes('รายชั่วโมง') || s.includes('ชั่วโมง')) return 'hourly';
      if (s.includes('พาร์ท') || s.includes('part')) return 'parttime';
      if (s.includes('ฟูล') || s.includes('full')) return 'fulltime';
      return '';
    },
    _getCategory(job){
      return (
        job.category ||
        job.j_category ||
        job.j_type ||
        job.type ||
        job.job_type ||
        ''
      ).toString().trim();
    },

    // === ใช้ใน template เพื่อกัน error (_ctx.displayCategory is not a function) ===
    displayCategory(job){ return this._getCategory(job); },
    displayWorkType(job){
      const raw = (job.j_work_type || job.work_type || job.job_kind || '').toString().trim();
      const mapped = this._mapWorkType(raw);
      if (!mapped) return raw;
      const opt = this.workTypeOptions.find(o => o.value === mapped);
      return opt ? opt.label : raw;
    },

    // เงินเดือน
    _toNum(v){
      if (v === null || v === undefined) return null;
      const s = String(v).replace(/[^\d.]/g,'').trim();
      if (!s) return null;
      const n = Number(s);
      return Number.isFinite(n) ? n : null;
    },
    _fmt(n){ return Number(n).toLocaleString('th-TH', { maximumFractionDigits: 0 }); },
    salaryDisplay(job) {
      const rawMin = job.j_salary_min ?? job.salary_min ?? job.min_salary ?? null;
      const rawMax = job.j_salary_max ?? job.salary_max ?? job.max_salary ?? null;
      const rawOne = job.j_salary ?? job.salary ?? null;

      const nMin = this._toNum(rawMin);
      const nMax = this._toNum(rawMax);
      const nOne = this._toNum(rawOne);

      const unit =
        job.j_salary_unit ?? job.salary_unit ??
        (String(job.j_work_type||'').includes('ชั่วโมง') ? 'บาท/ชั่วโมง' : 'บาท/เดือน');

      if (nMin!=null && nMax!=null) return `${this._fmt(nMin)}–${this._fmt(nMax)} ${unit}`;
      if (nOne!=null)               return `${this._fmt(nOne)} ${unit}`;

      const txt = (job.j_salary_text ?? job.salary_text ?? '').toString().trim();
      return txt || 'ตามตกลง';
    },

    // ค้นหา + เรียงล่าสุดเสมอ
    searchJobs() {
      const keyword=this._norm(this.filter.keyword);
      const skillKeyword=this._norm(this.filter.skills);
      const wantWorkType=this.filter.workType;

      let result=(this.jobs || []).filter(job=>{
        const title = job.j_title || job.title || '';
        const desc  = job.j_description || job.description || '';
        const comp  = job.e_company_name || job.company_name || '';
        const cat   = this._getCategory(job);

        const matchesKeyword=!keyword ||
          this._norm(title).includes(keyword) ||
          this._norm(desc).includes(keyword) ||
          this._norm(cat).includes(keyword) ||
          this._norm(comp).includes(keyword);

        const matchesSkills=!skillKeyword || this._norm(job.j_qualification || job.skills || '').includes(skillKeyword);
        const matchesType  = !this.filter.type || cat === this.filter.type;

        let matchesWorkType=true;
        if (wantWorkType) {
          const mapped=this._mapWorkType(job.j_work_type || job.work_type || job.job_kind || '');
          matchesWorkType = mapped === wantWorkType;
        }

        const status = job.j_status || job.status || 'open';
        const isOpen = !status || status.toLowerCase()==='open' || status.toLowerCase()==='active';

        return matchesKeyword && matchesSkills && matchesType && matchesWorkType && isOpen;
      });

      const safe = x => (x ? new Date(x) : new Date(0));
      this.filtered = result.sort((a,b)=> safe(b.j_posted_at || b.posted_at) - safe(a.j_posted_at || a.posted_at));
    },

    isBookmarked(id){ return this.bookmarkedIds.includes(id); },
    bookmarkJob(job){
      if (!this.isLoggedIn || !this.user) {
        Swal.fire({
          icon:'warning',
          title:'กรุณาเข้าสู่ระบบก่อน',
          text:'คุณต้องเข้าสู่ระบบเพื่อบันทึกงาน',
          showCancelButton:true,
          confirmButtonText:'เข้าสู่ระบบ',
          cancelButtonText:'ยกเลิก',
          confirmButtonColor:'#6a5acd',
          cancelButtonColor:'#aaa'
        }).then(r=>{ if(r.isConfirmed) this.$router.push('/login'); });
        return;
      }
      const key=`bookmarkedJobs_${this.user.applicant_id}`;
      let arr=JSON.parse(localStorage.getItem(key))||[];
      const i=arr.findIndex(j=>j.job_id===job.job_id);
      if(i!==-1){
        arr.splice(i,1);
        this.bookmarkedIds=this.bookmarkedIds.filter(x=>x!==job.job_id);
        Swal.fire({ toast:true, position:'bottom-end', icon:'info', title:'ยกเลิกบันทึกงานแล้ว', showConfirmButton:false, timer:1400 });
      }else{
        arr.push(job);
        this.bookmarkedIds.push(job.job_id);
        Swal.fire({ toast:true, position:'bottom-end', icon:'success', title:'บันทึกงานเรียบร้อย', showConfirmButton:false, timer:1400 });
      }
      localStorage.setItem(key, JSON.stringify(arr));
    },

    timeAgo(input){
      if(!input) return '';
      const d=new Date(input); if(isNaN(d)) return '';
      const now=new Date(); let diff=Math.floor((now-d)/1000);
      const u=[{sec:31536000,name:'ปี'},{sec:2592000,name:'เดือน'},{sec:604800,name:'สัปดาห์'},{sec:86400,name:'วัน'},{sec:3600,name:'ชั่วโมง'},{sec:60,name:'นาที'},{sec:1,name:'วินาที'}];
      for(const x of u){ const v=Math.floor(diff/x.sec); if(v>=1) return `${v} ${x.name}ที่ผ่านมา`; }
      return 'เมื่อสักครู่ที่ผ่านมา';
    }
  }
};
</script>


<style scoped>
*,
*::before,
*::after { box-sizing: border-box; }

/* ===== Layout ===== */
.main-layout{ display:flex; gap:20px; align-items:flex-start; }
.vertical-divider{ width:2px; background:#000; opacity:.06; align-self:stretch; }

/* Panel */
.filter-panel{
  width:260px; background:#fff; border:none; border-radius:12px;
  padding:20px; box-shadow:0 8px 20px rgba(0,0,0,.08);
}

/* ช่องไฟแนวตั้งให้คงที่ */
.stack{ --gap:14px; display:flex; flex-direction:column; gap:var(--gap); }
.field{ display:flex; flex-direction:column; gap:8px; padding:0 8px; } /* ซ้าย=ขวา */
.divider{
  height:1px; background:rgba(0,0,0,.06);
  margin: calc(-1 * var(--gap)) 8px 0 8px; /* ระยะก่อน-หลังเท่ากันพอดี */
  border:0;
}

/* Inputs */
.label{ font-weight:600; color:#222; font-size:12.5px; }
select, input[type="text"]{
  display:block; width:100%;
  height:36px; font-size:13px; padding:0 12px;
  border:1px solid #e3e3e3; border-radius:10px; background:#fcfcfc;
}
::placeholder{ color:#b6bcc3; }

/* input + icon */
.input-icon{ position:relative; }
.input-icon i{
  position:absolute; left:14px; top:50%; transform:translateY(-50%);
  color:#9aa0a6; font-size:16px; pointer-events:none;
}
.input-icon input{
  height:36px; line-height:36px; width:100%;
  padding:0 12px 0 48px; border:1px solid #e3e3e3; border-radius:10px; background:#fcfcfc; font-size:13px;
}

/* Chips */
.chips{ display:grid; gap:8px; padding:0 2px; }
.chips.two-cols{ grid-template-columns:repeat(2, 1fr); }
.chip{
  padding:6px 10px; border:1px solid #e6e6e6; border-radius:999px; background:#fff;
  font-size:12.5px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  transition:.15s ease;
}
.chip.active{ color:#ff6600; background:#fff5e6; border-color:#ff6600; }

/* วันกำหนดเอง */
.days-grid{ display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; padding:0 2px; }
.day-item{ display:flex; align-items:center; gap:8px; font-size:12.5px; }

/* ปุ่ม */
.actions{ display:flex; gap:10px; justify-content:center; padding-top:4px; }
.btn-primary{
  min-width:96px; height:38px; border:none; border-radius:10px; font-weight:700; color:#fff;
  background:linear-gradient(135deg,#ff6600,#e55d00); box-shadow:0 3px 10px rgba(255,102,0,.25);
}
.btn-outline{
  min-width:84px; height:38px; padding:0 12px; border-radius:10px; font-weight:700;
  background:#fff; color:#ff6600; border:1px solid #ff6600;
}

/* Search summary */
.search-summary{
  display:flex; flex-wrap:wrap; align-items:center;
  gap:8px; margin:4px 0 14px; padding:6px 8px;
  border-radius:8px; background:#fafafa;
}
.search-summary .search-title{ font-weight:700; color:#111; margin-right:2px; }
.search-summary .pipe{ margin:0 6px; opacity:.45; }
.search-summary .summary-item{ color:#333; }

/* Results */
.job-results{ flex:1; }
.results-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.sort-row{ display:flex; align-items:center; gap:8px; }
.sort-pill{ width:180px; height:34px; padding:0 12px; border-radius:999px; border:1px solid #e3e3e3; background:#fff; font-size:13px; }
.job-grid{ display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; }
@media (max-width:1200px){ .job-grid{ grid-template-columns:repeat(2, 1fr);} }
@media (max-width:768px){
  .main-layout{ flex-direction:column; gap:16px; }
  .vertical-divider{ display:none; }
  .filter-panel{ width:100%; }
  .job-grid{ grid-template-columns:1fr; }
}

/* Cards */
.job-card{ position:relative; padding:16px; border-radius:12px; background:#fff; box-shadow:0 6px 16px rgba(0,0,0,.06); transition:.2s ease; cursor:pointer; }
.job-card:hover{ transform:translateY(-2px); box-shadow:0 10px 20px rgba(0,0,0,.08); }
.card-meta{ position:absolute; top:10px; right:10px; }
.icon-btn{ width:34px; height:34px; border-radius:999px; border:1px solid #e5e5e5; background:#fff; display:inline-flex; align-items:center; justify-content:center; }
.icon-btn.saved{ border-color:#ffc107; background:#fff9e6; }
.icon-btn.saved i{ color:#ff9900; }

.co{ display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.co img{ width:40px; height:40px; border-radius:50%; object-fit:cover; box-shadow:0 1px 3px rgba(0,0,0,.08); }
.co-name{ font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

.title-row{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px; }
.title{ margin:0; font-weight:700; font-size:16px; }
.chip-saved{ font-size:12px; padding:2px 8px; border-radius:999px; border:1px solid #ffc107; color:#b26b00; background:#fff9e6; }

.badge-category{ display:inline-block; padding:.1rem .55rem; font-size:12.5px; border-radius:999px; border:1px solid #ff6600; color:#ff6600; background:#fff5e6; margin-bottom:4px; }
.muted{ color:#6b7280; font-size:12.5px; }

/* แถววัน/เวลาในการ์ด */
.row-inline{ display:flex; align-items:center; gap:8px; margin-top:4px; }
.row-inline .bar{ opacity:.5; margin:0 2px; }

.ago{ position:absolute; right:12px; bottom:10px; font-size:12px; color:#6b7280; }
.text-orange{ color:#ff6600; }
</style>
