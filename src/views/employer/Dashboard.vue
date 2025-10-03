<template>
  <div>
    <NavbarEmployer />

    <div class="container py-4" style="max-width:1140px">
      <!-- ========= HERO ========= -->
      <div class="card shadow-sm rounded-4 border-0 mb-4">
        <div class="card-body p-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <!-- ซ้าย: โลโก้ + ชื่อ + แท็ก -->
          <div class="d-flex align-items-center gap-3">
            <img
              :src="photoPreview || imgUrl(user.profile_img_url)"
              class="rounded-circle border"
              style="width:56px;height:56px;object-fit:cover"
              alt="company-logo"
            />
            <div>
              <h2 class="fw-bold mb-1" style="line-height:1.1">
                <template v-if="editMode">
                  <input
                    v-model="tempUser.e_company_name"
                    class="form-control form-control-sm"
                    placeholder="ชื่อบริษัทของคุณ"
                  />
                </template>
                <template v-else>{{ user.e_company_name || 'ชื่อบริษัทของคุณ' }}</template>
              </h2>

              <div class="d-flex align-items-center gap-2 flex-wrap">
                <span class="chip chip-orange-filled">
                  {{ user.e_business_type || user.e_category || 'ประเภทธุรกิจ' }}
                </span>
                <span class="text-muted">• เปิดรับ {{ openJobsCount }} งาน</span>
              </div>
            </div>
          </div>

          <!-- ขวา: ปุ่ม (ลบปุ่มเข้าเว็บไซต์บริษัทแล้ว) -->
          <div class="d-flex align-items-center gap-2">
            <template v-if="!editMode">
              <button class="btn btn-modern btn-ghost" @click="startEdit">
                <i class="bi bi-pencil-square"></i> แก้ไขโปรไฟล์
              </button>
            </template>
            <template v-else>
              <button class="btn btn-modern btn-ghost" @click="cancelEdit">ยกเลิก</button>
              <button class="btn btn-modern btn-solid" @click="saveProfile">
                <i class="bi bi-floppy"></i> บันทึก
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- ========= BODY: ซ้ายรายละเอียด / ขวางาน ========= -->
      <div class="row g-4">
        <!-- ซ้าย -->
        <div class="col-lg-7">
          <div class="card shadow-sm rounded-4 border-0">
            <div class="card-body p-4">
              <!-- เกี่ยวกับบริษัท -->
              <section class="mb-4">
                <div class="section-head">
                  <i class="bi bi-info-circle me-2"></i><h5 class="section-title">เกี่ยวกับบริษัท</h5>
                </div>
                <div v-if="editMode">
                  <textarea
                    v-model.trim="tempUser.e_about"
                    class="form-control"
                    rows="5"
                    placeholder="อธิบายภาพรวมบริษัท จุดเด่น บริการ อุตสาหกรรม ฯลฯ"
                    maxlength="1000"
                  ></textarea>
                  <div class="small text-muted mt-1">
                    {{ (tempUser.e_about?.length || 0).toLocaleString() }}/1,000
                  </div>
                </div>
                <p v-else class="small mb-0" style="white-space:pre-wrap">
                  {{ user.e_about || 'ยังไม่ระบุรายละเอียดบริษัท' }}
                </p>
              </section>

              <!-- แกลเลอรี -->
              <section class="mb-4">
                <div class="section-head">
                  <i class="bi bi-images me-2"></i><h5 class="section-title">แกลเลอรี</h5>
                </div>
                <div class="d-flex gap-2 flex-wrap">
                  <img
                    v-for="(img,idx) in (user.e_gallery || [])"
                    :key="idx"
                    :src="imgUrl(img)"
                    class="thumb"
                    @click="showImage(imgUrl(img))"
                    alt="gallery"
                  />
                  <span v-if="!user.e_gallery || !user.e_gallery.length" class="text-muted small">ยังไม่มีรูป</span>
                </div>
                <div v-if="editMode" class="mt-3">
                  <input type="file" multiple accept="image/*" class="form-control form-control-sm" @change="onPickGallery"/>
                </div>
              </section>

              <!-- สถานที่ปฏิบัติงาน -->
              <section class="mb-4">
                <div class="section-head">
                  <i class="bi bi-geo-alt me-2"></i><h5 class="section-title">สถานที่ปฏิบัติงาน</h5>
                </div>

                <div v-if="editMode" class="mb-2">
                  <textarea v-model="tempUser.e_address" class="form-control form-control-sm" rows="2" placeholder="กรอกที่อยู่บริษัท"></textarea>
                </div>
                <p v-else class="small mb-2">{{ user.e_address || 'ยังไม่ระบุที่อยู่' }}</p>

                <template v-if="user.e_map_iframe">
                  <iframe
                    :src="user.e_map_iframe"
                    width="100%"
                    height="220"
                    style="border:0;border-radius:12px"
                    allowfullscreen
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </template>
                <input
                  v-if="editMode"
                  v-model="tempUser.e_map_iframe"
                  class="form-control form-control-sm mt-2"
                  placeholder="วางลิงก์ iframe ของ Google Maps ที่นี่"
                />
              </section>

              <!-- ติดต่อ -->
              <section>
                <div class="section-head">
                  <i class="bi bi-telephone me-2"></i><h5 class="section-title">ติดต่อ</h5>
                </div>

                <ul class="list-unstyled small mb-0 profile-list">
                  <li class="mb-1">
                    <i class="bi bi-person-lines-fill me-2"></i><b>ผู้ติดต่อ:</b>
                    <template v-if="editMode">
                      <input v-model="tempUser.e_contact" class="form-control form-control-sm mt-1"/>
                    </template>
                    <template v-else>{{ user.e_contact || '—' }}</template>
                  </li>
                  <li class="mb-1">
                    <i class="bi bi-telephone me-2"></i><b>โทรศัพท์:</b>
                    <template v-if="editMode">
                      <input type="tel" v-model="tempUser.e_phone" class="form-control form-control-sm mt-1" placeholder="+66xxxxxxxxx"/>
                    </template>
                    <template v-else>{{ user.e_phone || '—' }}</template>
                  </li>
                  <li class="mb-1">
                    <i class="bi bi-link-45deg me-2"></i><b>เว็บไซต์:</b>
                    <template v-if="editMode">
                      <input v-model="tempUser.e_website" class="form-control form-control-sm mt-1" placeholder="https://your-company.com"/>
                    </template>
                    <template v-else>
                      <a v-if="user.e_website" :href="user.e_website" target="_blank" class="link-dark">{{ user.e_website }}</a>
                      <span v-else>—</span>
                    </template>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>

        <!-- ขวา: ตำแหน่งงานที่เปิดรับ -->
        <div class="col-lg-5">
          <div class="card shadow-sm rounded-4 border-0 mb-3">
            <div class="card-body p-4 pb-3 d-flex align-items-center gap-2">
              <i class="bi bi-inbox"></i>
              <h5 class="fw-bold mb-0">ตำแหน่งงานที่เปิดรับ</h5>
            </div>
          </div>

          <div v-if="openJobs.length === 0" class="text-center text-muted py-5 card rounded-4 border-0 shadow-sm">
            <div class="p-4">ยังไม่มีงานเปิดรับ</div>
          </div>

          <div
            v-for="job in openJobs"
            :key="job.job_id"
            class="job-tile card rounded-4 border-0 shadow-sm mb-3"
            @click="$router.push(`/employer/jobs/${job.job_id}`)"
            style="cursor:pointer;"
          >
            <div class="card-body p-4">
              <h6 class="fw-bold mb-1">{{ job.j_title }}</h6>

              <div class="mb-2"><span class="chip chip-orange-filled">{{ job?.j_type || '-' }}</span></div>

              <!-- ค่าจ้างแบบ 50 บาท/เดือน / 12,000–20,000 บาท/เดือน / ตามตกลง -->
              <div class="small text-muted mb-1">
                <i class="bi bi-cash-coin me-1"></i> {{ salaryDisplay(job) }}
              </div>

              <div class="small text-muted">
                <i class="bi bi-people me-1"></i> {{ job.j_amount ? job.j_amount + ' อัตรา' : '—' }}
              </div>

              <!-- วันที่โพสต์ -->
              <div class="text-end small text-muted mt-2">{{ formatJobDate(job) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal รูป -->
    <div v-if="selectedImage" class="modal-backdrop" @click.self="selectedImage=null">
      <div class="modal-image-wrapper">
        <button class="close-btn" @click="selectedImage=null">✕</button>
        <button class="nav-btn left" @click="prevImage">‹</button>
        <img :src="selectedImage" class="preview-image" alt="preview"/>
        <button class="nav-btn right" @click="nextImage">›</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";

const BASE = "http://localhost:3001";

export default {
  name: "DashboardEmployer",
  components: { NavbarEmployer },
  data() {
    return {
      user: { employer_id: null, e_gallery: [], e_about: "" },
      tempUser: null,
      editMode: false,
      photoFile: null,
      photoPreview: null,
      galleryFiles: [],
      jobs: [],
      selectedImage: null,
      currentImageIndex: 0,
      versionStamp: Date.now(),
    };
  },

  computed: {
    // เรียงด้วยวันโพสต์จริง (fallback ไปคีย์อื่น ๆ)
    openJobs() {
      const getSortDate = (j) => {
        const raw = this.getFirstDateValue(j);
        const d = this.parseDate(raw);
        return d ? d.getTime() : 0;
      };
      return (this.jobs || [])
        .filter(j => (j.j_status || "open").toLowerCase() !== "closed")
        .sort((a, b) => getSortDate(b) - getSortDate(a));
    },
    openJobsCount() { return this.openJobs.length; },
  },

  mounted() {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (!u?.employer_id) return this.$router.push("/login");
    this.user = {
      employer_id: u.employer_id,
      ...u,
      e_gallery: normalizeGallery(u.e_gallery),
      e_about: u.e_about || u.e_description || "",
    };
    this.fetchUserProfile();
    this.fetchJobs();
  },

  methods: {
    /* ---------- รูป ---------- */
    imgUrl(path) {
      if (!path) return "/default-profile.jpg";
      const url = `${BASE}${path}`;
      const v = this.user?.updated_at || this.versionStamp;
      return url + (url.includes("?") ? "&" : "?") + "v=" + encodeURIComponent(v);
    },

    /* ---------- วันที่ ---------- */
    // ✅ ครอบคลุม j_posted_at และคีย์อื่น ๆ ที่พบบ่อย
    getFirstDateValue(job) {
      const keys = [
        "j_posted_at", "posted_at", "date_posted",
        "created_at", "j_created_at", "createdAt",
        "j_updated_at", "updated_at", "updatedAt",
        "post_date", "j_date", "date"
      ];
      for (const k of keys) if (job && job[k]) return job[k];
      return null;
    },

    // รองรับ ISO, 'YYYY-MM-DD HH:mm:ss', และ dd/MM/yyyy (พ.ศ. ก็ได้)
    parseDate(val) {
      if (!val) return null;
      if (val instanceof Date) return isNaN(val) ? null : val;

      if (typeof val === "number") {
        const ms = val < 1e12 ? val * 1000 : val;
        const d = new Date(ms);
        return isNaN(d) ? null : d;
      }

      const s = String(val).trim();

      // case: 'YYYY-MM-DD HH:mm:ss'
      const isoLike = s.replace(" ", "T");
      let d = new Date(isoLike);
      if (!isNaN(d)) return d;

      // case: 'YYYY-MM-DD'
      d = new Date(s);
      if (!isNaN(d)) return d;

      // case: 'dd/MM/yyyy' (รองรับ พ.ศ.)
      const m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
      if (m) {
        let day = +m[1], mon = +m[2] - 1, year = +m[3];
        if (year > 2400) year -= 543; // พ.ศ. -> ค.ศ.
        d = new Date(year, mon, day);
        return isNaN(d) ? null : d;
      }
      return null;
    },

    formatJobDate(job) {
      const d = this.parseDate(this.getFirstDateValue(job));
      return d
        ? d.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "2-digit" })
        : "—";
    },

    /* ---------- เงินเดือน ---------- */
    _toNum(v) {
      if (v == null || v === "") return null;
      const n = Number(String(v).replace(/[^\d.-]/g, ""));
      return Number.isFinite(n) ? n : null;
    },
    _parseLegacySalary(txt) {
      if (!txt || typeof txt !== "string") return {};
      const m = txt.match(/(รายชั่วโมง|รายวัน|รายเดือน|เหมางาน|ตามตกลง)?\s*([\d,]+)?\s*(?:[-–]\s*([\d,]+))?/);
      return { type: (m?.[1] || "").trim(), min: this._toNum(m?.[2]), max: this._toNum(m?.[3]) };
    },
    salaryDisplay(job) {
      const legacy = this._parseLegacySalary(job.j_salary);
      const nMin = this._toNum(job.j_salary_min ?? job.salary_min ?? legacy.min);
      const nMax = this._toNum(job.j_salary_max ?? job.salary_max ?? legacy.max);
      const nOne = this._toNum(job.j_salary ?? job.salary);
      const unit =
        job.j_salary_unit ??
        job.salary_unit ??
        (String(job.j_work_type || "").includes("ชั่วโมง") ? "บาท/ชั่วโมง" : "บาท/เดือน");
      const fmt = (n) => Number(n).toLocaleString("th-TH", { maximumFractionDigits: 0 });

      if (nMin != null && nMax != null) return `${fmt(nMin)}–${fmt(nMax)} ${unit}`;
      if (nOne != null)               return `${fmt(nOne)} ${unit}`;
      if (legacy.min != null && legacy.max != null) return `${fmt(legacy.min)}–${fmt(legacy.max)} ${unit}`;
      if (legacy.min != null) return `${fmt(legacy.min)} ${unit}`;
      return "ตามตกลง";
    },

    /* ---------- API ---------- */
    async fetchUserProfile() {
      try {
        const { employer_id } = this.user;
        const { data } = await axios.get(`${BASE}/api/employers/${employer_id}`);
        const phone = data?.e_phone ?? data?.phone ?? this.user.e_phone ?? "";
        this.user = {
          ...this.user, ...data, employer_id,
          e_gallery: normalizeGallery(data?.e_gallery),
          e_about: data?.e_description ?? this.user.e_about ?? "",
          e_phone: phone,
        };
        this.versionStamp = Date.now();
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (e) {
        console.error("โหลดโปรไฟล์ล้มเหลว:", e);
      }
    },
    async fetchJobs() {
      try {
        const { data } = await axios.get(`${BASE}/api/jobs/employer/${this.user.employer_id}`);
        this.jobs = (data || []).map(j => {
          const legacy = this._parseLegacySalary(j.j_salary);
          const type = j.j_salary_type ?? j.salary_type ?? j.j_type_salary ?? legacy.type ?? "";
          const min  = this._toNum(j.j_salary_min ?? j.salary_min ?? legacy.min);
          const max  = this._toNum(j.j_salary_max ?? j.salary_max ?? legacy.max);
          return { ...j, j_salary_type: type, j_salary_min: min, j_salary_max: max };
        });
      } catch (e) {
        console.error("โหลดข้อมูลงานล้มเหลว:", e);
      }
    },

    /* ---------- Edit & Modal (เหมือนเดิม) ---------- */
    startEdit(){ this.tempUser = JSON.parse(JSON.stringify(this.user)); this.photoFile=null; this.photoPreview=null; this.galleryFiles=[]; this.editMode=true; },
    cancelEdit(){ this.tempUser=null; this.photoFile=null; this.photoPreview=null; this.galleryFiles=[]; this.editMode=false; localStorage.setItem("user", JSON.stringify(this.user)); },
    onPickPhoto(e){ const f=e.target.files?.[0]; if(!f) return; this.photoFile=f; this.photoPreview=URL.createObjectURL(f); },
    onPickGallery(e){ this.galleryFiles = Array.from(e.target.files || []); },
    async saveProfile(){
      try{
        const editable = ["e_company_name","e_phone","e_contact","e_position","e_website","e_address","e_map_iframe"];
        const payload = {}; editable.forEach(k=>payload[k]=this.tempUser[k]);
        const cleanPhone = (payload.e_phone ?? this.tempUser.phone ?? "").toString().replace(/[^\d+]/g,"").slice(0,20);
        payload.e_phone = cleanPhone; payload.phone = cleanPhone;
        payload.e_description = this.tempUser.e_about ?? "";
        await axios.put(`${BASE}/api/employers/${this.user.employer_id}`, payload, { headers:{ "Content-Type":"application/json" }});
        if(this.photoFile){ const fd = new FormData(); fd.append("profile", this.photoFile);
          await axios.post(`${BASE}/api/employers/upload-profile-employer/${this.user.employer_id}`, fd); }
        if(this.galleryFiles.length){ const fd2 = new FormData(); this.galleryFiles.forEach(f=>fd2.append("gallery", f));
          await axios.post(`${BASE}/api/employers/${this.user.employer_id}/upload-gallery`, fd2); }
        await this.fetchUserProfile();
        this.editMode=false; this.tempUser=null; this.photoFile=null; this.photoPreview=null; this.galleryFiles=[];
        alert("✅ บันทึกข้อมูลสำเร็จ");
      }catch(e){
        console.error("❌ บันทึกโปรไฟล์ล้มเหลว:", e.response?.data || e.message);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    },

    showImage(url){ this.currentImageIndex = (this.user.e_gallery || []).findIndex(img=> this.imgUrl(img)===url); this.selectedImage = url; },
    nextImage(){ const total=(this.user.e_gallery||[]).length; if(!total) return;
      this.currentImageIndex=(this.currentImageIndex+1)%total; this.selectedImage=this.imgUrl(this.user.e_gallery[this.currentImageIndex]); },
    prevImage(){ const total=(this.user.e_gallery||[]).length; if(!total) return;
      this.currentImageIndex=(this.currentImageIndex-1+total)%total; this.selectedImage=this.imgUrl(this.user.e_gallery[this.currentImageIndex]); },
  },
};

function normalizeGallery(g){
  try{
    if (Array.isArray(g)) return g;
    if (typeof g === "string" && g.trim().length) return JSON.parse(g);
  }catch(e){
    // หากพัง (เช่น JSON ไม่ถูกต้อง) ให้ fallback เป็นอาเรย์ว่างทันที
    return [];
  }
  return [];
}

</script>


<style scoped>
/* สีตัวอักษร (ดำ/เทา) */
* { color:#212529; }

/* ส่วนหัวเรื่อง/section */
.section-head{ display:flex; align-items:center; margin-bottom:.5rem; }
.section-title{ font-weight:700; margin:0; }

/* ชิปสีส้ม */
.chip{ display:inline-block; padding:.2rem .6rem; border-radius:999px; font-size:.85rem; font-weight:700; }
.chip-orange-filled{ background:#ffefe0; border:1px solid #ffa552; color:#ff7a1a; }

/* การ์ดงาน */
.job-tile .tile-meta{ color:#6c757d; }
.job-tile:hover{ transform:translateY(-1px); box-shadow:0 10px 22px rgba(0,0,0,.06); transition:all .15s ease; }

/* แกลเลอรี่ */
.thumb{ height:80px; width:auto; object-fit:cover; cursor:pointer; border-radius:8px; border:1px solid #e7e7e7; }

/* Modal รูป */
.modal-backdrop{position:fixed; inset:0; background:rgba(0,0,0,.85); display:flex; align-items:center; justify-content:center; z-index:9999}
.modal-image-wrapper{position:relative; border-radius:16px; max-width:90vw; max-height:90vh; background:#fff; box-shadow:0 20px 50px rgba(0,0,0,.5); overflow:hidden; display:flex; align-items:center; justify-content:center}
.preview-image{display:block; max-width:100%; max-height:90vh; object-fit:contain}
.close-btn{position:absolute; top:10px; right:10px; background:rgba(0,0,0,.6); color:#fff; border:none; border-radius:50%; padding:.4rem .6rem; font-size:1.2rem; cursor:pointer}
.close-btn:hover{background:rgba(0,0,0,.9)}
.nav-btn{position:absolute; top:50%; transform:translateY(-50%); background:rgba(0,0,0,.6); color:#fff; border:none; padding:.6rem .8rem; font-size:2rem; border-radius:50%; cursor:pointer}
.nav-btn:hover{background:rgba(0,0,0,.9)}
.nav-btn.left{left:10px}.nav-btn.right{right:10px}

/* ปุ่มโมเดิร์น */
.btn-modern{
  --btn-bg:#fff; --btn-fg:#111; --btn-bd:#d0d0d0;
  display:inline-flex; align-items:center; gap:.5rem;
  padding:.46rem .95rem; border-radius:9999px; border:1px solid var(--btn-bd);
  background:var(--btn-bg); color:var(--btn-fg); font-weight:700; line-height:1;
  box-shadow:0 1px 2px rgba(0,0,0,.04);
  transition:transform .15s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease;
}
.btn-modern i{ font-size:1rem; line-height:0; }
.btn-modern:hover{ transform:translateY(-1px); box-shadow:0 6px 14px rgba(0,0,0,.08); border-color:#bdbdbd; background:#f9f9f9; }
.btn-modern:active{ transform:translateY(0); box-shadow:0 2px 6px rgba(0,0,0,.08); }
.btn-solid{ --btn-bg:#111; --btn-fg:#fff; --btn-bd:#111; background:#111; color:#fff; }
</style>
