<template>
  <div>
    <NavbarEmployer />

    <div v-if="job" class="detail-wrap">
      <!-- Hero -->
      <header class="hero">
        <div class="hero-meta">
          <span class="date">
            <i class="bi bi-calendar-event me-1"></i>{{ formatDate(job?.j_posted_at) || '-' }}
          </span>
        </div>

        <h1 class="title">รับสมัคร {{ job?.j_title }}</h1>

        <!-- กลุ่มหมวดหมู่ + สถานะ -->
        <div class="hero-tags">
          <span class="chip type">{{ job?.j_type || '-' }}</span>
          <span v-if="job?.j_status === 'closed'" class="chip closed">ปิดรับสมัคร</span>
        </div>

        <p class="company">{{ job?.e_company_name || '-' }}</p>
      </header>

      <!-- Content card -->
      <main class="card-pro">
        <!-- Summary chips -->
        <section class="quick-row">
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
        </section>

        <!-- Description / Qualification -->
        <section class="section">
          <h3 class="section-title"><i class="bi bi-briefcase me-2"></i>ลักษณะงาน</h3>
          <ul class="bullet-list">
            <li v-for="(line,i) in normalizeLines(job?.j_description)" :key="'d'+i">
              {{ line }}
            </li>
          </ul>
          <div v-if="!job?.j_description" class="muted">ไม่ระบุ</div>
        </section>

        <section class="section">
          <h3 class="section-title"><i class="bi bi-check2-circle me-2"></i>คุณสมบัติผู้สมัคร</h3>
          <ul class="bullet-list">
            <li v-for="(line,i) in normalizeLines(job?.j_qualification)" :key="'q'+i">
              {{ line }}
            </li>
          </ul>
          <div v-if="!job?.j_qualification" class="muted">ไม่ระบุ</div>
        </section>

        <!-- Footer note -->
        <div v-if="job?.j_status === 'closed'" class="alert-note">
          <i class="bi bi-lock-fill me-2"></i>งานนี้ปิดรับสมัครแล้ว
        </div>
      </main>

      <!-- Action bar -->
      <nav class="action-bar" :class="{ fixed: isMobile }">
        <button
          type="button"
          class="btn-pill warn"
          @click="closeJob"
          :disabled="job.j_status === 'closed'"
          title="ปิดรับสมัคร"
        >
          <i class="bi bi-lock-fill me-2"></i> ปิดรับสมัคร
        </button>

        <router-link :to="`/employer/edit-job/${job?.job_id}`" class="btn-pill ghost" title="แก้ไขงานนี้">
          <i class="bi bi-pencil-square me-2"></i> แก้ไขงานนี้
        </router-link>

        <button class="btn-pill danger" @click="confirmDelete" title="ลบงานนี้">
          <i class="bi bi-trash me-2"></i> ลบงานนี้
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";

export default {
  name: "EmployerJobDetail",
  components: { NavbarEmployer },
  data() {
    return {
      job: null,
      isMobile: false,
      resizeHandler: null,
    };
  },
  computed: {
    salaryDisplay() {
      return this.job ? this._formatSalary(this.job) : "ไม่ระบุ";
    },
  },
  mounted() {
    const jobId = this.$route.params.id;
    axios
      .get(`http://localhost:3001/api/jobs/${jobId}`)
      .then((res) => {
        const j = res.data || {};
        // normalize salary fields
        let type = j.j_salary_type ?? j.salary_type ?? j.j_type_salary ?? "";
        let min = this._toNum(j.j_salary_min ?? j.salary_min);
        let max = this._toNum(j.j_salary_max ?? j.salary_max);

        // fallback parse from legacy string
        if ((!type || (!min && !max)) && j.j_salary) {
          const lg = this._parseLegacySalary(j.j_salary);
          type ||= lg.type || "";
          if (min == null) min = lg.min;
          if (max == null) max = lg.max;
        }

        this.job = { ...j, j_salary_type: type, j_salary_min: min, j_salary_max: max };
      })
      .catch((err) => console.error("❌ โหลดงานไม่สำเร็จ:", err));

    this.resizeHandler = () => {
      this.isMobile = window.innerWidth < 768;
    };
    this.resizeHandler();
    window.addEventListener("resize", this.resizeHandler);
  },
  beforeUnmount() {
    if (this.resizeHandler) window.removeEventListener("resize", this.resizeHandler);
  },
  methods: {
    // แปลงข้อความหลายบรรทัด -> array พร้อมล้างนำหน้าด้วย •, -, * (ถ้ามี)
    normalizeLines(text) {
      return (text || "")
        .split(/\r?\n/)
        .map((s) => s.replace(/^\s*(•|-|\*)\s*/, "").trim())
        .filter(Boolean);
    },

    _toNum(v) {
      if (v == null || v === "") return null;
      const n = Number(String(v).replace(/[^\d.-]/g, ""));
      return Number.isFinite(n) ? n : null;
    },
    _parseLegacySalary(txt) {
      if (!txt || typeof txt !== "string") return {};
      const m = txt.match(
        /(รายชั่วโมง|รายวัน|รายเดือน|เหมางาน|ตามตกลง)?\s*([\d,]+)?\s*(?:[-–]\s*([\d,]+))?/
      );
      return !m
        ? {}
        : { type: m[1] || "", min: this._toNum(m[2]), max: this._toNum(m[3]) };
    },
    _formatSalary(job) {
      const type = (job.j_salary_type || "").trim();
      const min = this._toNum(job.j_salary_min);
      const max = this._toNum(job.j_salary_max);

      if (type === "ตามตกลง") return "ตามตกลง";
      if (type && (min != null || max != null)) {
        if (min != null && max != null)
          return `${min.toLocaleString()} – ${max.toLocaleString()} บาท (${type})`;
        if (min != null) return `${min.toLocaleString()} บาทขึ้นไป (${type})`;
        if (max != null) return `สูงสุด ${max.toLocaleString()} บาท (${type})`;
      }
      return job.j_salary || "ไม่ระบุ";
    },

    formatDate(dateStr) {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      return isNaN(d)
        ? null
        : d.toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
    },

    confirmDelete() {
      if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?")) return;
      axios
        .delete(`http://localhost:3001/api/jobs/${this.job?.job_id}`)
        .then(() => {
          alert("✅ ลบงานสำเร็จ");
          this.$router.push("/employer/dashboard");
        })
        .catch((err) => {
          console.error("❌ ลบงานล้มเหลว:", err);
          alert("เกิดข้อผิดพลาดในการลบงาน");
        });
    },

    closeJob() {
      const jobId = this.job?.job_id;
      if (!jobId) return;
      if (!confirm("คุณต้องการปิดรับสมัครงานนี้หรือไม่?")) return;
      axios
        .put(`http://localhost:3001/api/jobs/${jobId}/close`)
        .then(() => {
          alert("✅ งานนี้ถูกปิดรับสมัครแล้ว");
          this.job.j_status = "closed";
        })
        .catch((err) => {
          console.error("❌ ปิดรับสมัครล้มเหลว:", err);
          alert("เกิดข้อผิดพลาดในการปิดรับสมัคร");
        });
    },
  },
};
</script>

<style scoped>
.hero-tags{display:flex;gap:8px;margin:6px 0 4px}

/* Layout */
.detail-wrap{max-width:1100px;margin:0 auto;padding:24px 16px 100px;}
.hero {
  background:#ffffff;border:1px solid #e5e7eb;border-left:4px solid #ff6600;
  border-radius:12px;padding:28px 24px;margin-bottom:18px;
  box-shadow:0 4px 14px rgba(0, 0, 0, 0.04);
}

.hero-meta{display:flex;flex-wrap:wrap;gap:8px 10px;margin-bottom:6px;align-items:center}
.date{color:#6b7280;font-size:.9rem}
.chip{padding:4px 10px;border-radius:999px;font-weight:600;font-size:.82rem}
.chip.type{background:#fff5e6;color:#ff6600;border:1px solid #ffb380}
.chip.closed{background:#f1f5f9;color:#0f172a;border:1px dashed #cbd5e1}
.title{font-weight:800;color:#0f172a;margin:2px 0 6px;line-height:1.25}
.company{color:#6b7280;margin:0}

/* Card body */
.card-pro{border-radius:22px;border:1px solid #eef2f7;background:#fff;
  box-shadow:0 12px 30px rgba(16,24,40,.06);padding:20px}

/* Quick summary row */
.quick-row{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;
  gap:14px;align-items:center;padding:8px 4px 4px}
.divider{width:1px;height:40px;background:linear-gradient(#e5e7eb,#e5e7eb)}
.quick-box .q-label{color:#6b7280;font-size:.86rem;margin-bottom:2px}
.quick-box .q-value{font-weight:700;color:#111827}

/* Sections */
.section{margin-top:22px}
.section-title{font-size:1.05rem;font-weight:800;color:#0f172a;margin-bottom:10px}
.muted{color:#94a3b8}
.bullet-list{padding-left:1.25rem;margin:0}
.bullet-list li{margin:.28rem 0;color:#111827}

/* Note */
.alert-note{margin-top:18px;background:#f6f7fb;border:1px dashed #cbd5e1;color:#0f172a;
  border-radius:14px;padding:10px 12px;font-weight:700}

/* Action bar */
.action-bar{display:flex;gap:10px;justify-content:flex-end;margin-top:16px}
.action-bar.fixed{position:fixed;left:0;right:0;bottom:0;padding:10px 16px;
  background:#ffffffea;backdrop-filter:blur(6px);box-shadow:0 -10px 30px rgba(0,0,0,.06)}

/* Buttons */
.btn-pill{border:none;border-radius:999px;padding:10px 18px;font-weight:700;
  display:inline-flex;align-items:center;justify-content:center;
  transition:transform .08s ease, box-shadow .2s ease, background .2s ease;white-space:nowrap}
.btn-pill:hover{transform:translateY(-1px)}
.btn-pill.warn{background:#ffedd5;color:#9a3412;border:1px solid #fdba74}
.btn-pill.warn:disabled{opacity:.7;cursor:not-allowed}
.btn-pill.ghost{background:#fff;border:1px solid #dbe2ea;color:#0f172a}
.btn-pill.ghost:hover{box-shadow:0 6px 18px rgba(16,24,40,.08)}
.btn-pill.danger{background:#fee2e2;color:#7f1d1d;border:1px solid #fecaca}

/* Responsive */
@media (max-width: 991px){
  .quick-row{grid-template-columns:1fr;gap:10px}
  .divider{display:none}
}
@media (max-width: 767px){
  .hero{padding:22px 18px}
  .title{font-size:1.35rem}
  .card-pro{padding:16px}
}
</style>
