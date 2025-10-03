<template> 
  <div>
    <NavbarHome />

    <div v-if="job" class="detail-wrap">
      <!-- HERO -->
      <header class="hero">
        <div class="hero-top">
          <div class="co-inline">
            <img :src="companyLogo" class="co-logo" alt="company" />
            <div class="co-text">
              <div class="co-name">{{ job?.e_company_name || '-' }}</div>
            </div>
          </div>
        </div>

        <h1 class="title">รับสมัคร {{ job?.j_title }}</h1>

        <div class="hero-meta">
          <span class="chip type">{{ job?.j_type || '-' }}</span>
          <span v-if="job?.j_status === 'closed'" class="chip closed">ปิดรับสมัคร</span>
        </div>

        <button
          v-if="job?.j_status !== 'closed'"
          class="btn-pill apply hero-apply"
          @click="handleApplyClick"
          :disabled="alreadyApplied"
          title="สมัครงาน"
        >
          <i class="bi bi-check2-circle me-2"></i>{{ alreadyApplied ? 'คุณสมัครแล้ว' : 'สมัครงาน' }}
        </button>
      </header>

      <!-- สองคอลัมน์ (โครงเดิม) -->
      <main class="main-grid">
        <div class="grid">
          <!-- ซ้าย -->
          <section class="col-left">
            <div class="company-card left-card">
              <!-- แถบสรุปเร็ว -->
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
                  <li v-for="(line,i) in normalizeLines(job?.j_description)" :key="'d'+i">
                    {{ line }}
                  </li>
                </ul>
                <div v-else class="muted">ไม่ระบุ</div>
              </section>

              <!-- คุณสมบัติผู้สมัคร -->
              <section class="section card-section">
                <h3 class="section-title"><i class="bi bi-check2-circle me-2"></i>คุณสมบัติผู้สมัคร</h3>
                <ul class="bullet-list" v-if="job?.j_qualification">
                  <li v-for="(line,i) in normalizeLines(job?.j_qualification)" :key="'q'+i">
                    {{ line }}
                  </li>
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
              <h4 class="snap-title">เกี่ยวกับบริษัท</h4>
              <p class="snap-text">{{ job?.e_description || 'ไม่ระบุ' }}</p>

              <div v-if="galleryArray.length" class="snap-block">
                <div class="snap-label">แกลเลอรี่</div>
                <div class="gallery">
                  <img
                    v-for="img in galleryArray"
                    :key="img"
                    :src="'http://localhost:3001' + img"
                    class="g-thumb"
                    @click="openImage(img)"
                    alt="gallery"
                  />
                </div>
              </div>

              <div class="snap-block">
                <div class="snap-label">สถานที่ปฏิบัติงาน</div>
                <p class="snap-text">{{ locationDisplay }}</p>

                <iframe
                  v-if="job?.e_map_iframe"
                  :src="job.e_map_iframe"
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
                <router-link
                  :to="{ name: 'CompanyPublic', params: { id: job.employer_id } }"
                  class="btn-pill ghost same-size"
                >
                  ดูข้อมูลผู้ว่าจ้าง
                </router-link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import NavbarHome from "@/components/NavbarHome.vue";

const API = "http://localhost:3001";

export default {
  name: "JobDetailPage",
  components: { NavbarHome },
  data() {
    return {
      job: null,
      user: null,
      alreadyApplied: false,
      applicationStatus: null,
      galleryArray: [],
    };
  },
  computed: {
    // ใช้แบบเดียวกับ guard ปัจจุบัน
    isLoggedIn() {
      return !!this.user?.applicant_id;
    },
    companyLogo() {
      return this.job?.e_profile_img_url
        ? API + this.job.e_profile_img_url
        : "/default-profile.jpg";
    },
    salaryDisplay() {
      const s = this.job?.j_salary;
      if (s == null || s === "") return "ไม่ระบุ";
      const numeric = typeof s === "number" || (/^\s*\d+(\.\d+)?\s*$/.test(String(s)));
      if (numeric) {
        const n = Number(s);
        return isNaN(n) ? String(s) : `${n.toLocaleString("th-TH")} บาท`;
      }
      return String(s);
    },
    locationDisplay() {
      const clean = v => (v == null ? "" : String(v)).replace(/\s+/g, " ").trim().replace(/^(null|undefined|ไม่ระบุ)$/i, "");
      const loc = clean(this.job?.j_location); if (loc) return loc;
      const addr = clean(this.job?.e_address); if (addr) return addr;
      const parts = [clean(this.job?.e_subdistrict), clean(this.job?.e_district), clean(this.job?.e_province)].filter(Boolean);
      return parts.length ? parts.join(" ") : "ไม่ระบุ";
    },
  },
  async mounted() {
    this.user = JSON.parse(localStorage.getItem("user") || "null");
    await this.loadJob();
  },
  methods: {
    async loadJob() {
      try {
        const id = this.$route.params.id;
        const { data } = await axios.get(`${API}/api/jobs/${id}`);
        this.job = data;

        try { this.galleryArray = JSON.parse(this.job.e_gallery || "[]"); }
        catch { this.galleryArray = []; }

        if (this.isLoggedIn && this.job?.job_id) await this.checkStatus();
      } catch (e) {
        console.error("❌ โหลดข้อมูลงานล้มเหลว:", e);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลงานได้", "error");
      }
    },

    async checkStatus() {
      try {
        const { data } = await axios.get(
          `${API}/api/applications/check-status/${this.job.job_id}/${this.user.applicant_id}`
        );
        this.applicationStatus = data.status;
        this.alreadyApplied = data.alreadyApplied;
      } catch (err) {
        console.error("❌ ตรวจสอบสถานะใบสมัครล้มเหลว:", err);
      }
    },

    async handleApplyClick() {
      // ❌ ยังไม่ล็อกอิน → เด้งแจ้งเตือน + พาไปหน้าเข้าสู่ระบบ และ "หยุด" ไม่ให้สมัคร
      if (!this.isLoggedIn) {
        const res = await Swal.fire({
          title: "กรุณาเข้าสู่ระบบก่อน",
          text: "คุณต้องเข้าสู่ระบบเพื่อสมัครงาน",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "เข้าสู่ระบบ",
          cancelButtonText: "ยกเลิก",
          reverseButtons: true,
        });
        if (res.isConfirmed) {
          this.$router.push({
            path: "/login",                    // ใช้ path เพราะ route /login ของคุณไม่มี name
            query: { redirect: this.$route.fullPath },
          });
        }
        return; // ← ห้ามยิง API ต่อ
      }

      if (this.alreadyApplied) return;

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

      await this.applyJob();
    },

    async applyJob() {
      try {
        await axios.post(`${API}/api/applications`, {
          job_id: this.job.job_id,
          applicant_id: this.user.applicant_id,
          app_portfolio_url: this.user?.portfolio_url || null,
        });
        await Swal.fire("สมัครงานสำเร็จ!", "ระบบได้บันทึกการสมัครของคุณแล้ว", "success");
        await this.checkStatus();
      } catch (e) {
        console.error("❌ สมัครงานไม่สำเร็จ:", e);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถสมัครงานได้", "error");
      }
    },

    normalizeLines(text) {
      return (text || "")
        .split(/\r?\n/)
        .map(s => s.replace(/^\s*(•|-|\*)\s*/, "").trim())
        .filter(Boolean);
    },
    openImage(path) {
      window.open(API + path, "_blank", "noopener");
    },
  },
};
</script>

<style scoped>
/* สไตล์เดิม */
.company-card{background:#fff;border:1px solid #eef2f7;border-radius:12px;padding:16px;box-shadow:0 8px 20px rgba(16,24,40,.06)}
.left-card{background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04)}
.company-card.right-card{background:#fdf6ec;border:1px solid #f5e6d8;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);color:#0f172a!important}
.company-card.right-card *{color:#0f172a!important}
.detail-wrap{max-width:1100px;margin:0 auto;padding:24px 16px 60px}
.hero{position:relative;background:#fff;border:1px solid #e5e7eb;border-left:4px solid #ff6600;border-radius:12px;padding:16px 20px 56px;box-shadow:0 4px 14px rgba(0,0,0,.04);margin-bottom:16px}
.hero-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
.co-inline{display:flex;align-items:center;gap:12px}
.co-logo{width:48px;height:48px;border-radius:50%;object-fit:cover;border:1px solid #e5e7eb}
.co-text{display:flex;flex-direction:column}
.co-name{font-weight:800;color:#0f172a;line-height:1}
.co-type{color:#64748b;font-size:.9rem}
.title{font-weight:800;color:#0f172a;margin:8px 0 8px;line-height:1.2}
.hero-meta{display:flex;gap:8px;align-items:center}
.chip{padding:4px 10px;border-radius:999px;font-weight:600;font-size:.82rem}
.chip.type{background:#fff5e6;color:#ff6600;border:1px solid #ffb380}
.chip.closed{background:#f1f5f9;color:#0f172a;border:1px dashed #cbd5e1}
.hero-apply{position:absolute;right:18px;bottom:14px}
.grid{display:grid;grid-template-columns:1.6fr .95fr;gap:18px;align-items:start}
.col-left{min-width:0}.col-right{min-width:0}
.quick-row{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:14px;align-items:center;padding:4px 0 12px}
.divider{width:1px;height:40px;background:#e5e7eb}
.q-label{color:#6b7280;font-size:.86rem}
.q-value{font-weight:700;color:#111827}
.section{margin-top:14px}
.card-section{border:1px solid #eef2f7;border-radius:12px;padding:14px 14px 10px;background:#fff}
.section-title{font-size:1.05rem;font-weight:800;color:#0f172a;margin-bottom:10px}
.muted{color:#94a3b8}
.bullet-list{padding-left:1.1rem;margin:0}
.bullet-list li{margin:.25rem 0;color:#111827}
.snap-title{font-size:1rem;font-weight:800;margin-bottom:8px}
.snap-block{margin-top:14px}
.snap-label{font-weight:700;margin-bottom:4px}
.snap-text{margin:0}
.snap-list{list-style:none;padding-left:0;margin:0}
.gallery{display:flex;gap:8px;overflow:auto}
.g-thumb{height:70px;width:110px;object-fit:cover;border-radius:8px;border:1px solid #e5e7eb;cursor:pointer}
.company-actions{margin-top:20px;text-align:center}
.btn-pill{border:none;border-radius:999px;padding:10px 18px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;transition:transform .08s ease,box-shadow .2s ease;min-width:160px;text-align:center}
.btn-pill:hover{transform:translateY(-1px)}
.btn-pill.apply{background:linear-gradient(135deg,#ff6600,#e55d00);color:#fff}
.btn-pill.ghost{background:#fff;border:1px solid #dbe2ea;color:#0f172a}
.btn-pill.ghost:hover{box-shadow:0 6px 18px rgba(16,24,40,.08)}
.btn-pill.same-size{min-width:160px;padding:10px 18px}
@media (max-width:991px){.grid{grid-template-columns:1fr}.hero{padding-bottom:64px}.hero-apply{right:12px;bottom:10px}}
</style>
