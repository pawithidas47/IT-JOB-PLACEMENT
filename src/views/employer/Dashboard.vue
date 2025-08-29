<template> 
  <div>
    <NavbarEmployer />

    <div class="container py-5 d-flex flex-column flex-lg-row gap-4" style="max-width:1140px;margin:0 auto">
      <!-- ซ้าย: โปรไฟล์บริษัท -->
      <div class="card p-4 shadow rounded-4 w-100">
        <div class="d-flex justify-content-end gap-2 mb-2">
          <button v-if="!editMode" class="btn btn-sm btn-outline-secondary rounded-pill" @click="startEdit">✏️ แก้ไขโปรไฟล์บริษัท</button>
          <template v-else>
            <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="cancelEdit">ยกเลิกการแก้ไข</button>
            <button class="btn btn-sm btn-success rounded-pill" @click="saveProfile">💾 บันทึก</button>
          </template>
        </div>

        <div class="text-center mb-4">
          <img
            :src="photoPreview || imgUrl(user.profile_img_url)"
            class="rounded mb-2"
            style="width:100px;height:100px;object-fit:cover"
            alt="company-logo"
          />
          <div v-if="editMode" class="mb-3">
            <input type="file" accept="image/*" class="form-control form-control-sm" @change="onPickPhoto" />
          </div>

          <h5 class="fw-bold mb-0">
            <template v-if="editMode">
              <input v-model="tempUser.e_company_name" class="form-control form-control-sm text-center" placeholder="ชื่อบริษัทของคุณ"/>
            </template>
            <template v-else>{{ user.e_company_name || 'ชื่อบริษัทของคุณ' }}</template>
          </h5>
        </div>

        <h6 class="fw-bold text-success mb-3">ข้อมูลติดต่อบริษัท</h6>
        <ul class="list-unstyled small text-muted mb-4 profile-list">
          <li>
            <i class="bi bi-telephone me-2"></i><b>โทรศัพท์: </b>
            <template v-if="editMode"><input v-model="tempUser.e_phone" class="form-control form-control-sm"/></template>
            <template v-else>{{ user.e_phone || '—' }}</template>
          </li>
          <li>
            <i class="bi bi-person-circle me-2"></i><b>ผู้ติดต่อ: </b>
            <template v-if="editMode"><input v-model="tempUser.e_contact" class="form-control form-control-sm"/></template>
            <template v-else>{{ user.e_contact || '—' }}</template>
          </li>
          <li>
            <i class="bi bi-person-badge me-2"></i><b>ตำแหน่ง: </b>
            <template v-if="editMode"><input v-model="tempUser.e_position" class="form-control form-control-sm"/></template>
            <template v-else>{{ user.e_position || '—' }}</template>
          </li>
          <li>
            <i class="bi bi-globe me-2"></i><b>เว็บไซต์: </b>
            <template v-if="editMode">
              <input v-model="tempUser.e_website" class="form-control form-control-sm" placeholder="https://your-company.com"/>
            </template>
            <template v-else>
              <a v-if="user.e_website" :href="user.e_website" target="_blank" rel="noopener">{{ user.e_website }}</a>
              <span v-else>—</span>
            </template>
          </li>
        </ul>
        <h6 class="fw-bold text-success mb-2 mt-4">เกี่ยวกับบริษัท</h6>

<!-- โหมดแก้ไข -->
<div v-if="editMode">
  <textarea
    v-model.trim="tempUser.e_about"
    class="form-control"
    rows="4"
    placeholder="อธิบายว่าบริษัททำอะไร จุดเด่น/บริการ/อุตสาหกรรม ลูกค้าที่ดูแล ฯลฯ (แนะนำ 50–300 ตัวอักษร)"
    maxlength="1000"
  ></textarea>
  <div class="text-muted small mt-1">
    {{ (tempUser.e_about?.length || 0).toLocaleString() }}/1,000
  </div>
</div>

<!-- โหมดแสดงผล -->
<p v-else class="small mb-3" style="white-space:pre-wrap">
  {{ user.e_about || 'ยังไม่ระบุเกี่ยวกับบริษัท' }}
</p>


        <h6 class="fw-bold text-success mb-2">แกลเลอรี่รูปภาพบริษัท</h6>
        <div class="d-flex gap-2 overflow-auto mb-3">
          <img
            v-for="(img,idx) in (user.e_gallery || [])"
            :key="idx"
            :src="imgUrl(img)"
            class="rounded thumb"
            @click="showImage(imgUrl(img))"
            alt="gallery"
          />
          <span v-if="!user.e_gallery || user.e_gallery.length === 0" class="text-muted small">ยังไม่มีรูปแกลเลอรี่</span>
        </div>
        <input v-if="editMode" type="file" multiple class="form-control form-control-sm mb-4" @change="onPickGallery"/>

        <!-- modal รูป -->
        <div v-if="selectedImage" class="modal-backdrop" @click.self="selectedImage=null">
          <div class="modal-image-wrapper">
            <button class="close-btn" @click="selectedImage=null">✕</button>
            <button class="nav-btn left" @click="prevImage">‹</button>
            <img :src="selectedImage" class="preview-image" alt="preview"/>
            <button class="nav-btn right" @click="nextImage">›</button>
          </div>
        </div>

        <h6 class="fw-bold text-success mb-2">ที่อยู่บริษัท</h6>
        <div v-if="editMode">
          <textarea v-model="tempUser.e_address" class="form-control form-control-sm" rows="2" placeholder="กรอกที่อยู่บริษัท"></textarea>
        </div>
        <p v-else class="small mb-2">{{ user.e_address || 'ยังไม่ระบุที่อยู่บริษัท' }}</p>

        <template v-if="user.e_map_iframe">
          <iframe :src="user.e_map_iframe" width="100%" height="220" style="border:0;border-radius:8px"
                  allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </template>
        <p v-else class="text-muted small">ยังไม่ระบุแผนที่บริษัท</p>

        <input v-if="editMode" v-model="tempUser.e_map_iframe" class="form-control form-control-sm mt-2" placeholder="วางลิงก์ iframe ของ Google Maps ที่นี่"/>
      </div>

      <!-- ขวา: รายการงาน -->
      <div class="flex-grow-1" style="flex-basis:43%">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="fw-bold mb-0 text-orange">ตำแหน่งงานที่รับสมัคร</h5>
          <span class="text-muted small" style="font-size:1rem">{{ filteredJobs.length }} ตำแหน่ง</span>
        </div>

        <div class="d-flex align-items-center gap-2 mb-4">
          <div class="position-relative flex-grow-1">
            <input type="text" class="form-control ps-5 py-2 rounded-pill shadow-sm" placeholder="ค้นหาชื่องาน..." v-model="search"/>
            <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
          </div>
          <select v-model="filterStatus" class="form-select form-select-sm rounded-pill shadow-sm" style="height:38px;padding-inline:14px;min-width:120px">
            <option value="all">ทั้งหมด</option>
            <option value="open">เปิดรับสมัคร</option>
            <option value="closed">ปิดรับสมัคร</option>
          </select>
        </div>

        <div v-for="job in filteredJobs" :key="job.job_id" class="job-card border rounded-4 bg-white shadow-sm p-4 mb-4"
             @click="$router.push(`/employer/jobs/${job.job_id}`)" style="cursor:pointer">
          <h5 class="fw-bold text-dark mb-2">{{ job.j_title }}</h5>
          <div class="mb-3"><span class="badge-category">{{ job?.j_type || '-' }}</span></div>
          <p class="text-muted small mb-1">
            <i class="bi bi-cash-coin me-1"></i>ค่าจ้าง:
            <span class="text-success">{{ formatSalary(job) }}</span>
          </p>
          <p class="text-muted small mb-0"><i class="bi bi-person-lines-fill me-1"></i>จำนวนที่รับ: {{ job.j_amount ? job.j_amount + ' คน' : 'ยังไม่ระบุ' }}</p>
        </div>

        <div v-if="filteredJobs.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-emoji-frown fs-1"></i>
          <p class="mt-3">ไม่พบงานที่ตรงกับคำค้น</p>
        </div>
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
      user: { employer_id: null, e_gallery: [], e_about: "" }, // e_about = ใช้แสดงบนหน้า (map จาก e_description)
      tempUser: null,
      editMode: false,

      // รูป
      photoFile: null,
      photoPreview: null,
      galleryFiles: [],

      // งาน
      jobs: [],
      search: "",
      filterStatus: "all",

      // modal รูป
      selectedImage: null,
      currentImageIndex: 0,
    };
  },
  computed: {
    filteredJobs() {
      return this.jobs.filter((j) => {
        const s = this.search.trim().toLowerCase();
        const title = (j.j_title || "").toLowerCase();
        const matchSearch = !s || title.includes(s);
        const matchStatus =
          this.filterStatus === "all" ||
          (this.filterStatus === "open" && j.j_status !== "closed") ||
          (this.filterStatus === "closed" && j.j_status === "closed");
        return matchSearch && matchStatus;
      });
    },
  },
  mounted() {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (!u?.employer_id) return this.$router.push("/login");

    // merge กัน key หาย และ normalize แกลเลอรี่
    this.user = {
      employer_id: u.employer_id,
      ...u,
      e_gallery: normalizeGallery(u.e_gallery),
      e_about: u.e_about || u.e_description || "", // เผื่อเคย cache ไว้
    };

    this.fetchUserProfile();
    this.fetchJobs();
  },
  methods: {
    // ---------- Helpers ----------
    imgUrl(path) {
      return path ? `${BASE}${path}` : "/default-profile.jpg";
    },
    _toNum(v) {
      if (v == null || v === "") return null;
      const n = Number(String(v).replace(/[^\d.-]/g, ""));
      return Number.isFinite(n) ? n : null;
    },
    _parseLegacySalary(txt) {
      if (!txt || typeof txt !== "string") return {};
      const m = txt.match(
        /(รายชั่วโมง|รายวัน|รายเดือน|เหมางาน|ตามตกลง)?\s*([\d,]+)?\s*(?:[-–]\s*([\d,]+))?/,
      );
      if (!m) return {};
      return {
        type: (m[1] || "").trim(),
        min: this._toNum(m[2]),
        max: this._toNum(m[3]),
      };
    },

    // ---------- API ----------
    async fetchUserProfile() {
      try {
        const { employer_id } = this.user; // กันหาย
        const { data } = await axios.get(`${BASE}/api/employers/${employer_id}`);

        // ใช้ e_description จาก DB แล้ว map เป็น e_about สำหรับฝั่งหน้าเว็บ
        const merged = {
          ...this.user,
          ...data,
          employer_id,
          e_gallery: normalizeGallery(data?.e_gallery),
          e_about: data?.e_description ?? this.user.e_about ?? "",
        };

        this.user = merged;
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (e) {
        console.error("❌ โหลดโปรไฟล์ล้มเหลว:", e);
      }
    },

    async fetchJobs() {
      try {
        const { data } = await axios.get(
          `${BASE}/api/jobs/employer/${this.user.employer_id}`,
        );
        this.jobs = (data || []).map((j) => {
          const legacy = this._parseLegacySalary(j.j_salary);
          const type =
            j.j_salary_type ?? j.salary_type ?? j.j_type_salary ?? legacy.type ?? "";
          const min = this._toNum(j.j_salary_min ?? j.salary_min ?? legacy.min);
          const max = this._toNum(j.j_salary_max ?? j.salary_max ?? legacy.max);
          return { ...j, j_salary_type: type, j_salary_min: min, j_salary_max: max };
        });
      } catch (e) {
        console.error("❌ โหลดข้อมูลงานล้มเหลว:", e);
      }
    },

    // ---------- เงินเดือน UI ----------
    formatSalary(job) {
      const type = (job.j_salary_type || "").trim();
      const min = this._toNum(job.j_salary_min);
      const max = this._toNum(job.j_salary_max);

      if (type === "ตามตกลง") return "ตามตกลง";
      if (min != null && max != null)
        return `${min.toLocaleString()} – ${max.toLocaleString()} บาท${
          type ? ` (${type})` : ""
        }`;
      if (min != null) return `${min.toLocaleString()} บาทขึ้นไป${type ? ` (${type})` : ""}`;
      if (max != null) return `สูงสุด ${max.toLocaleString()} บาท${type ? ` (${type})` : ""}`;
      if (job.j_salary) return String(job.j_salary); // legacy
      return "ยังไม่ระบุ";
    },

    // ---------- Edit flow ----------
    startEdit() {
      this.tempUser = JSON.parse(JSON.stringify(this.user));
      this.photoFile = null;
      this.photoPreview = null;
      this.galleryFiles = [];
      this.editMode = true;
    },
    cancelEdit() {
      this.tempUser = null;
      this.photoFile = null;
      this.photoPreview = null;
      this.galleryFiles = [];
      this.editMode = false;
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    onPickPhoto(e) {
      const f = e.target.files?.[0];
      if (!f) return;
      this.photoFile = f;
      this.photoPreview = URL.createObjectURL(f);
    },
    onPickGallery(e) {
      this.galleryFiles = Array.from(e.target.files || []);
    },

    async saveProfile() {
      try {
        // map e_about (frontend) -> e_description (DB)
        const payload = {
          ...this.tempUser,
          e_description: this.tempUser.e_about ?? "", // ✅ ตรงกับ backend
        };

        // 1) save fields
        await axios.put(
          `${BASE}/api/employers/${this.user.employer_id}`,
          payload,
        );

        // 2) upload profile photo
        if (this.photoFile) {
          const fd = new FormData();
          fd.append("profile", this.photoFile);
          await axios.post(
            `${BASE}/api/employers/upload-profile-employer/${this.user.employer_id}`,
            fd,
          );
        }

        // 3) upload gallery
        if (this.galleryFiles.length) {
          const fd2 = new FormData();
          this.galleryFiles.forEach((f) => fd2.append("gallery", f));
          await axios.post(
            `${BASE}/api/employers/${this.user.employer_id}/upload-gallery`,
            fd2,
          );
        }

        // 4) refresh from server (ให้แน่ใจว่าอ่านค่าล่าสุดจาก DB)
        await this.fetchUserProfile();

        // reset ui
        this.editMode = false;
        this.tempUser = null;
        this.photoFile = null;
        this.photoPreview = null;
        this.galleryFiles = [];
        alert("✅ บันทึกข้อมูลสำเร็จ");
      } catch (e) {
        console.error("❌ บันทึกโปรไฟล์ล้มเหลว:", e.response?.data || e.message);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    },

    // ---------- modal รูป ----------
    showImage(url) {
      this.currentImageIndex = (this.user.e_gallery || []).findIndex(
        (img) => this.imgUrl(img) === url,
      );
      this.selectedImage = url;
    },
    nextImage() {
      const total = (this.user.e_gallery || []).length;
      if (!total) return;
      this.currentImageIndex = (this.currentImageIndex + 1) % total;
      this.selectedImage = this.imgUrl(this.user.e_gallery[this.currentImageIndex]);
    },
    prevImage() {
      const total = (this.user.e_gallery || []).length;
      if (!total) return;
      this.currentImageIndex = (this.currentImageIndex - 1 + total) % total;
      this.selectedImage = this.imgUrl(this.user.e_gallery[this.currentImageIndex]);
    },
  },
};

/* ===== util (นอก export) ===== */
function normalizeGallery(g) {
  try {
    if (Array.isArray(g)) return g;
    if (typeof g === "string" && g.trim().length) return JSON.parse(g);
  } catch (_) {
    // eslint-disable-next-line no-console
    console.warn("normalizeGallery: invalid gallery format");
  }
  return [];
}
</script>


<style scoped>
.badge-category{background:#fff5e6;color:#ff6600;border:1px solid #ff6600;border-radius:999px;font-weight:500;padding:.1rem .5rem;font-size:12px}

.profile-list li + li{ margin-top:6px; }

.thumb{ height:80px; width:auto; object-fit:cover; cursor:pointer; border-radius:8px; }

/* Modal */
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:9999}
.modal-image-wrapper{position:relative;border-radius:16px;max-width:90vw;max-height:90vh;background:#fff;box-shadow:0 20px 50px rgba(0,0,0,.5);overflow:hidden;display:flex;align-items:center;justify-content:center}
.preview-image{display:block;max-width:100%;max-height:90vh;object-fit:contain}
.close-btn{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.6);color:#fff;border:none;border-radius:50%;padding:.4rem .6rem;font-size:1.2rem;cursor:pointer}
.close-btn:hover{background:rgba(0,0,0,.9)}
.nav-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.6);color:#fff;border:none;padding:.6rem .8rem;font-size:2rem;border-radius:50%;cursor:pointer}
.nav-btn:hover{background:rgba(0,0,0,.9)}
.nav-btn.left{left:10px}.nav-btn.right{right:10px}
</style>
