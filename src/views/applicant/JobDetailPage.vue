<template>
  <div>
    <NavbarApplicant />

    <div v-if="job" class="detail-wrap">
      <!-- HERO -->
      <header class="hero">
        <div class="hero-top">
          <div class="co-inline">
            <img :src="companyLogoSrc" :key="companyLogoSrc" class="co-logo" alt="company" />
            <div class="co-text">
              <div class="co-name">{{ job?.e_company_name || '-' }}</div>
              <div class="co-type">{{ job?.e_type || 'ประเภทธุรกิจ' }}</div>
            </div>
          </div>
          <div class="hero-date">{{ formatDate(job?.j_posted_at) || '-' }}</div>
        </div>

        <h1 class="title">รับสมัคร {{ job?.j_title }}</h1>

        <div class="hero-meta">
          <span class="chip type">{{ job?.j_type || '-' }}</span>
          <span v-if="job?.j_status === 'closed'" class="chip closed">ปิดรับสมัคร</span>
        </div>

        <!-- ปุ่มสมัคร -->
        <button
          v-if="job?.j_status !== 'closed'"
          class="btn-pill hero-apply"
          :class="alreadyApplied ? 'applied' : 'apply'"
          :disabled="alreadyApplied"
          @click="confirmApply"
        >
          <i class="bi bi-check2-circle me-2"></i>
          {{ alreadyApplied ? 'สมัครแล้ว' : 'สมัครงาน' }}
        </button>
      </header>

      <!-- เนื้อหา 2 คอลัมน์ -->
      <main class="main-grid">
        <div class="grid">
          <!-- ซ้าย -->
          <section class="col-left">
            <div class="company-card left-card">
              <div class="quick-row">
                <div class="quick-box">
                  <div class="q-label">จำนวนที่รับ</div>
                  <div class="q-value">{{ job?.j_amount || '-' }} อัตรา</div>
                </div>
                <div class="divider"></div>
                <div class="quick-box">
                  <div class="q-label">ค่าจ้าง</div>
                  <div class="q-value">{{ salaryDisplay }}</div>
                </div>
                <div class="divider"></div>
                <div class="quick-box">
                  <div class="q-label">วัน/เวลาทำงาน</div>
                  <div class="q-value">{{ job?.j_worktime || 'ไม่ระบุ' }}</div>
                </div>
              </div>

              <!-- ลักษณะงาน -->
              <section class="section card-section">
                <h3 class="section-title"><i class="bi bi-briefcase me-2"></i>ลักษณะงาน</h3>
                <ul class="bullet-list" v-if="job?.j_description">
                  <li v-for="(line,i) in normalizeLines(job?.j_description)" :key="'d'+i">{{ line }}</li>
                </ul>
                <div v-else class="muted">ไม่ระบุ</div>
              </section>

              <!-- คุณสมบัติผู้สมัคร -->
              <section class="section card-section">
                <h3 class="section-title"><i class="bi bi-check2-circle me-2"></i>คุณสมบัติผู้สมัคร</h3>
                <ul class="bullet-list" v-if="job?.j_qualification">
                  <li v-for="(line,i) in normalizeLines(job?.j_qualification)" :key="'q'+i">{{ line }}</li>
                </ul>
                <div v-else class="muted">ไม่ระบุ</div>
              </section>

              <div v-if="job?.j_status === 'closed'" class="alert-note">
                <i class="bi bi-lock-fill me-2"></i>งานนี้ปิดรับสมัครแล้ว
              </div>
            </div>
          </section>

          <!-- ขวา -->
          <aside class="col-right">
            <div class="company-card right-card">
              <h4 class="snap-title">เกี่ยวกับ</h4>
              <p class="snap-text">{{ job?.e_description || 'ไม่ระบุ' }}</p>

              <div v-if="galleryArray.length" class="snap-block">
                <div class="snap-label">แกลเลอรี่</div>
                <div class="gallery">
                  <img
                    v-for="img in galleryArray"
                    :key="img"
                    :src="base + img"
                    class="g-thumb"
                    @click="showImage(base + img)"
                    alt="gallery"
                  />
                </div>
              </div>

              <div class="snap-block">
                <div class="snap-label">สถานที่ปฏิบัติงาน</div>
                <p class="snap-text">{{ locationDisplay }}</p>
                <iframe
                  v-if="mapIframe"
                  :src="mapIframe"
                  width="100%" height="220"
                  style="border:0; border-radius:10px"
                  allowfullscreen loading="lazy"
                ></iframe>
              </div>

              <div class="snap-block">
                <div class="snap-label">ติดต่อ</div>
                <ul class="snap-list">
                  <li><i class="bi bi-person-circle me-2"></i>{{ job?.e_contact || '-' }}</li>
                  <li><i class="bi bi-telephone me-2"></i>{{ job?.e_phone || '-' }}</li>
                  <li>
                    <i class="bi bi-globe me-2"></i>
                    <a v-if="job?.e_website" :href="job.e_website" target="_blank" rel="noopener">{{ job.e_website }}</a>
                    <span v-else>-</span>
                  </li>
                </ul>
              </div>

              <div class="company-actions">
                <router-link :to="`/applicant/company/${job.employer_id}`" class="btn-pill ghost same-size">
                  ดูข้อมูลผู้ว่าจ้าง
                </router-link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <!-- Modal รูป -->
      <div v-if="selectedImage" class="modal-backdrop" @click.self="selectedImage = null">
        <div class="modal-image-wrapper">
          <button class="close-btn" @click="selectedImage = null">✕</button>
          <button class="nav-btn left" @click="prevImage">‹</button>
          <img :src="selectedImage" class="preview-image" />
          <button class="nav-btn right" @click="nextImage">›</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import NavbarApplicant from "@/components/NavbarApplicant.vue";

export default {
  name: "JobDetailApplicant",
  components: { NavbarApplicant },
  data() {
    return {
      base: "http://localhost:3001",
      job: {},
      user: {},
      alreadyApplied: false,
      applicationStatus: null,
      selectedImage: null,
      currentImageIndex: 0,
      galleryArray: [],
    };
  },
  computed: {
    /* โลโก้บริษัท (กันแคช + รองรับหลายชื่อฟิลด์) */
    companyLogoSrc() {
      const base = this.base;
      const p =
        this.job?.e_profile_img_url ||
        this.job?.profile_img_url ||
        this.job?.e_profile_img ||
        this.job?.e_profile;
      if (!p) return "/default-profile.jpg";
      const url = String(p).startsWith("http") ? p : base + p;
      const v =
        this.job?.updated_at ||
        this.job?.e_updated_at ||
        this.job?.j_updated_at ||
        Date.now();
      return url + (url.includes("?") ? "&" : "?") + "v=" + encodeURIComponent(v);
    },

    /* เงินเดือน */
    salaryDisplay() {
      const s = this.job?.j_salary;
      if (s == null || s === "") return "ไม่ระบุ";
      const isNumeric = typeof s === "number" || /^\s*\d+(\.\d+)?\s*$/.test(String(s));
      if (!isNumeric) return String(s);
      const n = Number(s);
      return isNaN(n) ? String(s) : `${n.toLocaleString("th-TH")} บาท`;
    },

    /* ที่อยู่แบบ fallbacks: j_location > e_address > e_subdistrict/e_district/e_province(+zipcode) */
    locationDisplay() {
      const jloc = this.job?.j_location && String(this.job.j_location).trim();
      if (jloc) return jloc;

      const addr = this.job?.e_address && String(this.job.e_address).trim();
      if (addr) return addr;

      const parts = [
        this.job?.e_subdistrict,
        this.job?.e_district,
        this.job?.e_province,
        this.job?.e_postcode || this.job?.zipcode,
      ]
        .map(v => (v ? String(v).trim() : ""))
        .filter(Boolean);

      return parts.length ? parts.join(" ") : "ไม่ระบุ";
    },

    /* แผนที่: รองรับทั้งเก็บเป็น URL ตรง ๆ หรือเป็นแท็ก iframe เต็ม */
    mapIframe() {
      const raw = this.job?.e_map_iframe || this.job?.map_iframe || "";
      if (!raw) return "";
      return this.extractIframeSrc(raw) || raw.trim();
    },
  },

  async mounted() {
    this.user = JSON.parse(localStorage.getItem("user") || "null");
    await this.loadJobData();
  },

  methods: {
    async loadJobData() {
      try {
        const jobId = this.$route.params.id;
        const { data } = await axios.get(`http://localhost:3001/api/jobs/${jobId}`);
        this.job = data;

        try {
          this.galleryArray = JSON.parse(this.job.e_gallery || "[]");
        } catch {
          this.galleryArray = [];
        }

        if (this.user?.applicant_id && this.job?.job_id) {
          await this.checkApplicationStatus();
        }
      } catch (err) {
        console.error("❌ โหลด job ล้มเหลว:", err);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลงานได้", "error");
      }
    },

    async checkApplicationStatus() {
      try {
        const { job_id } = this.job;
        const { applicant_id } = this.user;
        const { data } = await axios.get(
          `http://localhost:3001/api/applications/check-status/${job_id}/${applicant_id}`
        );
        this.applicationStatus = data.status;
        this.alreadyApplied = data.alreadyApplied;
      } catch (err) {
        console.error("❌ ตรวจสอบสถานะใบสมัครล้มเหลว:", err);
      }
    },

    async confirmApply() {
      if (this.alreadyApplied) return;
      const { job_id } = this.job;
      const { applicant_id, portfolio_url } = this.user;

      const ok = await Swal.fire({
        title: "ยืนยันการสมัครงาน",
        text: `คุณต้องการสมัคร "${this.job.j_title}" หรือไม่?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        reverseButtons: true,
      });
      if (!ok.isConfirmed) return;

      try {
        await axios.post("http://localhost:3001/api/applications", {
          job_id,
          applicant_id,
          app_portfolio_url: portfolio_url || null,
        });
        Swal.fire("สมัครงานสำเร็จ!", "ระบบได้บันทึกการสมัครของคุณแล้ว", "success");
        await this.checkApplicationStatus();
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด", err.response?.data?.message || "ไม่สามารถสมัครงานได้", "error");
        console.error("❌ สมัครไม่สำเร็จ:", err);
      }
    },

    formatDate(s) {
      if (!s) return "-";
      try {
        const d = new Date(s);
        return d.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "2-digit" });
      } catch {
        return "-";
      }
    },

    /* แปลงข้อความหลายบรรทัด → bullet; ล้าง • / - / * */
    normalizeLines(text) {
      return (text || "")
        .split(/\r?\n/)
        .map(s => s.replace(/^\s*(•|-|\*)\s*/, "").trim())
        .filter(Boolean);
    },

    /* ดึง src ออกจากแท็ก iframe ถ้าส่งมาเป็นแท็กทั้งก้อน */
    extractIframeSrc(htmlOrUrl) {
      const s = String(htmlOrUrl || "");
      if (/^https?:\/\//i.test(s)) return s;             // เป็น URL อยู่แล้ว
      const m = s.match(/src\s*=\s*["']([^"']+)["']/i);  // เป็นแท็ก iframe
      return m ? m[1] : "";
    },

    showImage(url) {
      this.currentImageIndex = this.galleryArray.findIndex(img => this.base + img === url);
      this.selectedImage = url;
    },
    nextImage() {
      const total = this.galleryArray.length;
      if (!total) return;
      this.currentImageIndex = (this.currentImageIndex + 1) % total;
      this.selectedImage = this.base + this.galleryArray[this.currentImageIndex];
    },
    prevImage() {
      const total = this.galleryArray.length;
      if (!total) return;
      this.currentImageIndex = (this.currentImageIndex - 1 + total) % total;
      this.selectedImage = this.base + this.galleryArray[this.currentImageIndex];
    },
  },
};
</script>

<style scoped>
/* ปุ่ม */
.btn-pill.apply {
  background: linear-gradient(135deg,#ff6600,#e55d00);
  color:#fff;
}
.btn-pill.applied {
  background:#22c55e;
  color:#fff;
  cursor:not-allowed;
  opacity:.9;
}
.btn-pill {
  border:none;
  border-radius:999px;
  padding:10px 18px;
  font-weight:700;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  transition:transform .08s ease,box-shadow .2s ease;
  min-width:160px;
}

/* โครงหน้า */
.detail-wrap { max-width:1100px; margin:0 auto; padding:24px 16px 60px; }

/* HERO */
.hero{
  position:relative;
  background:#fff; border:1px solid #e5e7eb; border-left:4px solid #ff6600;
  border-radius:12px; padding:16px 20px 56px;
  box-shadow:0 4px 14px rgba(0,0,0,.04); margin-bottom:16px;
}
.hero-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
.co-inline{display:flex;align-items:center;gap:12px}
.co-logo{width:48px;height:48px;border-radius:50%;object-fit:cover;border:1px solid #e5e7eb}
.co-text{display:flex;flex-direction:column}
.co-name{font-weight:800;color:#0f172a;line-height:1}
.co-type{color:#64748b;font-size:.9rem}
.hero-date{color:#6b7280;font-size:.95rem;white-space:nowrap;margin-top:-4px}
.title{font-weight:800;color:#0f172a;margin:8px 0 8px;line-height:1.2}
.hero-meta{display:flex;gap:8px;align-items:center}
.chip{padding:4px 10px;border-radius:999px;font-weight:600;font-size:.82rem}
.chip.type{background:#fff5e6;color:#ff6600;border:1px solid #ffb380}
.chip.closed{background:#f1f5f9;color:#0f172a;border:1px dashed #cbd5e1}
.hero-apply{position:absolute;right:18px;bottom:14px}

/* Layout 2 คอลัมน์ */
.grid{display:grid;grid-template-columns:1.6fr .95fr;gap:18px;align-items:start}

/* การ์ดซ้าย */
.company-card.left-card{
  background:#ffffff !important;
  border:1px solid #eef2f7 !important;
  border-radius:14px;
  padding:16px;
  box-shadow:0 8px 20px rgba(16,24,40,.06);
}
.quick-row{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:14px;align-items:center;padding:4px 0 12px}
.divider{width:1px;height:40px;background:#e5e7eb}
.q-label{color:#6b7280;font-size:.86rem}
.q-value{font-weight:800;color:#111827}
.section{margin-top:14px}
.card-section{border:1px solid #eef2f7;border-radius:12px;padding:14px 14px 10px;background:#fff}
.section-title{font-size:1.05rem;font-weight:800;color:#0f172a;margin-bottom:10px}
.bullet-list{padding-left:1.1rem;margin:0}
.bullet-list li{margin:.25rem 0;color:#111827}
.muted{color:#94a3b8}
.alert-note{margin-top:14px;background:#f6f7fb;border:1px dashed #cbd5e1;color:#0f172a;border-radius:12px;padding:10px 12px;font-weight:700}

/* การ์ดขวา */
.company-card.right-card{
  background:#fdf6ec !important;
  border:1px solid #f5e6d8 !important;
  border-radius:14px;
  padding:16px;
  box-shadow:0 2px 8px rgba(0,0,0,.05);
  color:#0f172a !important;
}
.company-card.right-card * { color:#0f172a !important; }

.snap-title{font-size:1rem;font-weight:800;margin-bottom:8px}
.snap-block{margin-top:14px}
.snap-label{font-weight:700;margin-bottom:4px}
.snap-text{margin:0}
.snap-list{list-style:none;padding-left:0;margin:0}

/* แกลเลอรี่ */
.gallery{display:flex;gap:8px;overflow:auto}
.g-thumb{
  height:70px;width:110px;object-fit:cover;border-radius:8px;
  border:1px solid #e5e7eb;background:#fff;cursor:pointer;
}

/* ปุ่มลิงก์ */
.company-actions{margin-top:20px;text-align:center}
.btn-pill.ghost{background:#fff;border:1px solid #dbe2ea;color:#0f172a}
.btn-pill.ghost:hover{box-shadow:0 6px 18px rgba(16,24,40,.08)}
.btn-pill.same-size{min-width:160px}

/* Modal รูป */
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:1050}
.modal-image-wrapper{position:relative;max-width:min(92vw,980px);max-height:90vh}
.preview-image{max-width:100%;max-height:90vh;border-radius:12px}
.close-btn,.nav-btn{position:absolute;background:#fff;border:none;border-radius:999px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(16,24,40,.2);cursor:pointer}
.close-btn{top:-16px;right:-16px}
.nav-btn.left{left:-16px;top:50%;transform:translateY(-50%)}
.nav-btn.right{right:-16px;top:50%;transform:translateY(-50%)}

/* Responsive */
@media (max-width:991px){
  .grid{grid-template-columns:1fr}
  .hero{padding-bottom:64px}
  .hero-apply{right:12px;bottom:10px}
  .quick-row{grid-template-columns:1fr;gap:8px}
  .divider{display:none}
}
</style>
