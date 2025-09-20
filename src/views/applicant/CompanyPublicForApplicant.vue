<template>
  <div>
    <NavbarApplicant />

    <div class="wrap" v-if="loaded">
      <!-- HERO -->
      <section class="hero">
        <div class="hero-left">
          <img :src="companyLogo" class="co-logo" alt="company"/>
          <div class="co-text">
            <h1 class="co-name">{{ company.e_company_name || 'ชื่อบริษัท' }}</h1>
            <div class="co-meta">
              <span class="chip">{{ company.e_type || 'ประเภทธุรกิจ' }}</span>
              <span v-if="jobs.length" class="sep">•</span>
              <span v-if="jobs.length" class="muted">เปิดรับ {{ jobs.length }} งาน</span>
            </div>
          </div>
        </div>
        <div class="hero-right">
          <a v-if="company.e_website" :href="company.e_website" target="_blank" rel="noopener" class="btn ghost">
            เข้าเว็บไซต์บริษัท
          </a>
        </div>
      </section>

      <div class="grid">
        <!-- LEFT: Company info -->
        <section class="card co-card">
          <h3 class="block-title"><i class="bi bi-info-circle me-2"></i>เกี่ยวกับ</h3>
          <p class="para" v-if="company.e_description">{{ company.e_description }}</p>
          <p class="muted" v-else>ยังไม่มีคำอธิบายบริษัท</p>

          <div v-if="gallery.length" class="block">
            <div class="block-title-sm"><i class="bi bi-images me-2"></i>แกลเลอรี่</div>
            <div class="gallery">
              <img v-for="img in gallery" :key="img" :src="base + img" class="thumb" @click="preview=img" />
            </div>
          </div>

          <div class="block">
            <div class="block-title-sm"><i class="bi bi-geo-alt me-2"></i>สถานที่ปฏิบัติงาน</div>
            <p class="para">{{ company.e_address || 'ไม่ระบุ' }}</p>
            <div v-if="company.e_map_iframe" class="map-wrap">
              <iframe :src="company.e_map_iframe" allowfullscreen loading="lazy"></iframe>
            </div>
          </div>

          <div class="block">
            <div class="block-title-sm"><i class="bi bi-telephone me-2"></i>ติดต่อ</div>
            <ul class="contact">
              <li><i class="bi bi-person-circle me-2"></i>{{ company.e_contact || '-' }}</li>
              <li><i class="bi bi-telephone me-2"></i>{{ company.e_phone || '-' }}</li>
              <li>
                <i class="bi bi-globe me-2"></i>
                <a v-if="company.e_website" :href="company.e_website" target="_blank" rel="noopener">{{ company.e_website }}</a>
                <span v-else>-</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- RIGHT: Jobs -->
        <aside class="card jobs-card">
          <h3 class="block-title"><i class="bi bi-briefcase me-2"></i>ตำแหน่งงานที่เปิดรับ</h3>

          <div v-if="jobs.length" class="job-list">
            <article
              v-for="job in jobs"
              :key="job.job_id"
              class="job-item"
              @click="$router.push({ name: 'ApplicantJobDetail', params: { id: job.job_id } })"
            >
              <!-- ชื่อ -->
              <h4 class="job-title">รับสมัคร {{ job.j_title }}</h4>

              <!-- หมวดหมู่ ใต้ชื่อ -->
              <div class="job-tag-row">
                <span class="tag">{{ job.j_type || 'งาน' }}</span>
              </div>

              <!-- เมตา คนละบรรทัด -->
              <div class="job-meta-col">
                <div class="meta-line"><i class="bi bi-cash-coin me-1"></i>{{ salary(job.j_salary) }}</div>
                <div class="meta-line"><i class="bi bi-people me-1"></i>{{ job.j_amount || '-' }} อัตรา</div>
              </div>

              <!-- วันที่ ขวาล่าง -->
              <div class="job-date">{{ posted(job.j_posted_at) }}</div>
            </article>
          </div>

          <div v-else class="empty">
            <i class="bi bi-briefcase mb-2"></i>
            <p class="mb-0">ตอนนี้ยังไม่มีงานที่เปิดรับ</p>
          </div>
        </aside>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="preview" class="backdrop" @click.self="preview=null">
      <img :src="base + preview" class="lightbox" alt="" />
      <button class="x" @click="preview=null">✕</button>
    </div>

    <div v-if="!loaded" class="loading">
      <span class="spinner-border spinner-border-sm me-2"></span>กำลังโหลด…
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarApplicant from "@/components/NavbarApplicant.vue";

const api = axios.create({ baseURL: "http://localhost:3001", withCredentials: false });

export default {
  name: "CompanyPublicForApplicant",
  components: { NavbarApplicant },
  data() {
    return {
      base: "http://localhost:3001",
      company: {},
      jobs: [],
      gallery: [],
      preview: null,
      loaded: false,
    };
  },
  computed: {
    companyLogo() {
      const p = this.company.e_profile_img_url || this.company.profile_img_url;
      return p ? this.base + p : "/default-profile.jpg";
    },
  },
  async mounted() {
    const employerId = this.$route.params.id;
    try {
      const { data: company } = await api.get(`/api/employers/${employerId}`);
      this.company = company;
      try { this.gallery = JSON.parse(company.e_gallery || "[]"); } catch { this.gallery = []; }

      const { data: allJobs } = await api.get(`/api/jobs/employer/${employerId}`);
      this.jobs = (allJobs || [])
        .filter(j => {
          const closed = String(j.j_status || "").toLowerCase() === "closed";
          const deleted = !!j.deleted_at || j.is_deleted === 1 || j.j_is_deleted === 1;
          return !closed && !deleted;
        })
        .sort((a,b) => new Date(b.j_posted_at) - new Date(a.j_posted_at));
    } catch (e) {
      console.error("❌ โหลดข้อมูลบริษัทล้มเหลว:", e);
    } finally {
      this.loaded = true;
    }
  },
  methods: {
    salary(s) {
      if (s == null || s === "") return "ไม่ระบุ";
      const n = Number(s);
      return isNaN(n) ? String(s) : `${n.toLocaleString("th-TH")} บาท`;
    },
    posted(s) {
      if (!s) return "-";
      return new Date(s).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "2-digit" });
    },
  },
};
</script>

<style scoped>
/* ===== Shell ===== */
.wrap{max-width:1100px;margin:0 auto;padding:20px 16px 60px}

/* ===== Hero ===== */
.hero{
  background:#fff;border:1px solid #e9eef5;border-left:4px solid #ff6600;border-radius:12px;
  padding:16px 18px;box-shadow:0 4px 14px rgba(16,24,40,.04);
  display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px
}
.hero-left{display:flex;gap:12px;align-items:center}
.co-logo{width:56px;height:56px;border-radius:50%;object-fit:cover;border:1px solid #e9eef5}
.co-text{display:flex;gap:2px;flex-direction:column}
.co-name{margin:0;color:#0f172a;font-weight:800;line-height:1.2}
.co-meta{display:flex;gap:8px;align-items:center;color:#64748b}
.chip{background:#fff5e6;border:1px solid #ffb380;color:#ff6600;padding:2px 8px;border-radius:999px;font-weight:700}

/* ===== 2 Columns ===== */
.grid{
  display:grid;
  grid-template-columns:1.45fr .95fr;
  gap:16px;
  align-items:start;
}

/* ===== Card base ===== */
.card{
  background:#fff;border:1px solid #e9eef5;border-radius:16px;box-shadow:0 10px 24px rgba(16,24,40,.06)
}
.co-card{padding:14px 14px 12px;align-self:start}
.jobs-card{border:none;box-shadow:none;background:transparent;padding:0;align-self:start}
.jobs-card .block-title{
  background:#fff;border:1px solid #e9eef5;border-radius:12px;padding:10px 12px;margin:0 0 10px;
  box-shadow:0 8px 20px rgba(16,24,40,.05)
}

/* ===== Blocks & text ===== */
.block{margin-top:14px}
.block-title{font-size:1.05rem;font-weight:800;color:#0f172a}
.block-title-sm{font-weight:800;color:#0f172a;margin-bottom:6px}
.para{color:#111827;margin:0}
.muted{color:#6b7280}

/* ===== Gallery ===== */
.gallery{display:flex;gap:8px;overflow:auto}
.thumb{height:72px;width:110px;object-fit:cover;border-radius:10px;border:1px solid #e9eef5;cursor:pointer}

/* ===== Map ===== */
.map-wrap{border-radius:10px;overflow:hidden;border:1px solid #e9eef5}
.map-wrap iframe{width:100%;height:220px;border:0}

/* ===== Contact ===== */
.contact{list-style:none;margin:0;padding-left:0}
.contact li{color:#111827;margin:.2rem 0}

/* ===== Jobs list ===== */
.job-list{display:flex;flex-direction:column;gap:10px}
.job-item{
  position:relative;background:#fff;border:1px solid #e9eef5;border-radius:12px;
  box-shadow:0 8px 20px rgba(16,24,40,.05);padding:14px 16px 46px;cursor:pointer;
  transition:box-shadow .15s ease, transform .06s ease
}
.job-item:hover{box-shadow:0 12px 26px rgba(16,24,40,.08);transform:translateY(-1px)}
.job-title{margin:0;line-height:1.25;font-size:1rem;font-weight:800;color:#0f172a}
.job-tag-row{margin:8px 0 10px}
.tag{
  display:inline-flex;align-items:center;padding:3px 10px;font-size:.86rem;line-height:1;border-radius:999px;
  background:#fff5e6;border:1px solid #ffb380;color:#ff6600;font-weight:700;white-space:nowrap
}
.job-meta-col{display:grid;grid-template-columns:1fr;row-gap:6px;color:#4b5563}
.meta-line{display:inline-flex;align-items:center;gap:8px;line-height:1.35}
.meta-line i{font-size:1rem;opacity:.8;transform:translateY(.5px)}
.job-date{position:absolute;right:16px;bottom:12px;color:#6b7280;font-size:.9rem;line-height:1}

/* Buttons */
.btn{border:none;border-radius:999px;padding:10px 14px;min-width:160px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;transition:transform .08s ease,box-shadow .2s ease}
.btn:hover{transform:translateY(-1px)}
.btn.ghost{background:#fff;border:1px solid #dbe2ea;color:#0f172a}
.btn.ghost:hover{box-shadow:0 6px 18px rgba(16,24,40,.08)}

/* Lightbox / Loading */
.backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:99}
.lightbox{max-width:90vw;max-height:85vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
.x{position:absolute;top:18px;right:18px;border:none;background:rgba(0,0,0,.6);color:#fff;border-radius:50%;width:36px;height:36px;cursor:pointer}
.loading{max-width:1100px;margin:20px auto;padding:20px 16px;color:#64748b}

/* Responsive */
@media (max-width:991px){
  .grid{grid-template-columns:1fr}
}
</style>
