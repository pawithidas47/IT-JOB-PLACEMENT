<template>
  <div>
    <NavbarEmployer />

    <div class="container py-5 d-flex flex-column flex-lg-row gap-4" style="max-width:1140px;margin:0 auto">
      <!-- ซ้าย: โปรไฟล์บริษัท -->
      <div class="card p-4 shadow rounded-4 w-100">
        <div class="d-flex justify-content-end gap-2 mb-2">
          <button v-if="!editMode" class="btn btn-sm btn-outline-secondary rounded-pill" @click="startEdit">
            ✏️ แก้ไขโปรไฟล์บริษัท
          </button>
          <template v-else>
            <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="cancelEdit">ยกเลิกการแก้ไข</button>
            <button class="btn btn-sm btn-success rounded-pill" @click="saveProfile">💾 บันทึก</button>
          </template>
        </div>

        <div class="text-center mb-4">
          <img
            :src="editMode ? (photoPreview || imgUrl(user.profile_img_url)) : imgUrl(user.profile_img_url)"
            class="rounded mb-2" style="width:100px;height:100px;object-fit:cover"
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
        <ul class="list-unstyled small text-muted mb-4">
          <li>
            <i class="bi bi-telephone me-2"></i><b>โทรศัพท์: </b>
            <template v-if="editMode"><input v-model="tempUser.e_phone" class="form-control form-control-sm"/></template>
            <template v-else>{{ user.e_phone || '-' }}</template>
          </li>
          <li>
            <i class="bi bi-person-circle me-2"></i><b>ผู้ติดต่อ: </b>
            <template v-if="editMode"><input v-model="tempUser.e_contact" class="form-control form-control-sm"/></template>
            <template v-else>{{ user.e_contact || '-' }}</template>
          </li>
          <li>
            <i class="bi bi-person-badge me-2"></i><b>ตำแหน่ง: </b>
            <template v-if="editMode"><input v-model="tempUser.e_position" class="form-control form-control-sm"/></template>
            <template v-else>{{ user.e_position || '-' }}</template>
          </li>
          <li>
            <i class="bi bi-globe me-2"></i><b>เว็บไซต์: </b>
            <template v-if="editMode">
              <input v-model="tempUser.e_website" class="form-control form-control-sm" placeholder="https://your-company.com"/>
            </template>
            <template v-else>
              <a v-if="user.e_website" :href="user.e_website" target="_blank">{{ user.e_website }}</a>
              <span v-else>—</span>
            </template>
          </li>
        </ul>

        <h6 class="fw-bold text-success mb-2">เกี่ยวกับบริษัท</h6>
        <div v-if="!editMode" class="card bg-light p-3 mb-4">
          <p class="small mb-0">{{ user.e_description || 'คุณยังไม่ได้เพิ่มรายละเอียดเกี่ยวกับบริษัทของคุณ' }}</p>
        </div>
        <textarea v-else v-model="tempUser.e_description" class="form-control mb-4" rows="3" placeholder="ใส่คำอธิบายเกี่ยวกับบริษัทของคุณ"></textarea>

        <!-- ประเภทธุรกิจ -->
        <div class="mb-4">
          <div class="border rounded-4 p-3 shadow-sm bg-white w-100 text-center">
            <i class="bi bi-building fs-1 text-secondary mb-2"></i>
            <div class="fw-semibold text-muted">ประเภทธุรกิจ</div>
            <template v-if="editMode">
              <input v-model="tempUser.e_type" class="form-control form-control-sm text-center mt-2" placeholder="เช่น ร้านอาหาร, ค้าปลีก ฯลฯ"/>
            </template>
            <template v-else><div class="fw-bold text-success mt-1">{{ user.e_type || '—' }}</div></template>
          </div>
        </div>

        <h6 class="fw-bold text-success mb-2">แกลเลอรี่รูปภาพบริษัท</h6>
        <div class="d-flex gap-2 overflow-auto mb-3">
          <img v-for="(img,idx) in user.e_gallery || []" :key="idx" :src="imgUrl(img)"
               class="rounded" style="height:80px;object-fit:cover;cursor:pointer"
               @click="showImage(imgUrl(img))"/>
        </div>

        <!-- อัปโหลดแกลเลอรี (stage ไว้ก่อน) -->
        <input v-if="editMode" type="file" multiple class="form-control form-control-sm mb-4" @change="onPickGallery"/>

        <!-- modal ดูภาพ -->
        <div v-if="selectedImage" class="modal-backdrop" @click.self="selectedImage=null">
          <div class="modal-image-wrapper">
            <button class="close-btn" @click="selectedImage=null">✕</button>
            <button class="nav-btn left" @click="prevImage">‹</button>
            <img :src="selectedImage" class="preview-image"/>
            <button class="nav-btn right" @click="nextImage">›</button>
          </div>
        </div>

        <h6 class="fw-bold text-success mb-2">ที่อยู่บริษัท</h6>
        <div v-if="editMode">
          <textarea v-model="tempUser.e_address" class="form-control form-control-sm" rows="2" placeholder="กรอกที่อยู่บริษัท"></textarea>
        </div>
        <p v-else class="small mb-2">{{ user.e_address || 'ยังไม่ระบุที่อยู่บริษัท' }}</p>

        <iframe
          :src="user.e_map_iframe" width="100%" height="220"
          style="border:0;border-radius:8px" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade">
        </iframe>
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
          <p class="text-muted small mb-1"><i class="bi bi-cash-coin me-1"></i>ค่าจ้าง: <span class="text-success">{{ Number(job.j_salary).toLocaleString() }} บาท</span></p>
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
      user: { e_gallery: [] },     // ค่าที่บันทึกจริง
      tempUser: null,              // ฉบับร่างตอนแก้ไข
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
      return this.jobs.filter(j => {
        const s = this.search.trim().toLowerCase();
        const matchSearch = j.j_title.toLowerCase().includes(s);
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
    this.user = u;
    this.fetchUserProfile();
    this.fetchJobs();
  },
  methods: {
    imgUrl(path) { return path ? `${BASE}${path}` : "/default-profile.jpg"; },

    async fetchUserProfile() {
      try {
        const { data } = await axios.get(`${BASE}/api/employers/${this.user.employer_id}`);
        const profile = { ...data, e_gallery: data.e_gallery ? JSON.parse(data.e_gallery) : [] };
        this.user = profile;
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (e) {
        console.error("❌ โหลดโปรไฟล์ล้มเหลว:", e);
      }
    },

    async fetchJobs() {
      try {
        const { data } = await axios.get(`${BASE}/api/jobs/employer/${this.user.employer_id}`);
        this.jobs = data;
      } catch (e) {
        console.error("❌ โหลดข้อมูลงานล้มเหลว:", e);
      }
    },

    // --- Edit flow ---
    startEdit() {
      this.tempUser = JSON.parse(JSON.stringify(this.user)); // clone ลึก
      this.photoFile = null;
      this.photoPreview = null;
      this.galleryFiles = [];
      this.editMode = true;
    },

    cancelEdit() {
      // ไม่แตะ server / localStorage — ทิ้งฉบับร่างทั้งหมด
      this.tempUser = null;
      this.photoFile = null;
      this.photoPreview = null;
      this.galleryFiles = [];
      this.editMode = false;
      // (กันเหนียว) โอเวอร์ไรด์ค่าที่หน้าอื่นอาจอ้างจาก localStorage
      localStorage.setItem("user", JSON.stringify(this.user));
    },

    onPickPhoto(e) {
      const f = e.target.files?.[0];
      if (!f) return;
      this.photoFile = f;
      this.photoPreview = URL.createObjectURL(f);
    },

    onPickGallery(e) {
      const files = Array.from(e.target.files || []);
      this.galleryFiles = files;
    },

    async saveProfile() {
      try {
        // 1) อัปเดตข้อมูลข้อความ
        await axios.put(`${BASE}/api/employers/${this.user.employer_id}`, this.tempUser);

        // 2) อัปโหลดรูปโปรไฟล์หากเลือก
        if (this.photoFile) {
          const fd = new FormData();
          fd.append("profile", this.photoFile);
          const res = await axios.post(`${BASE}/api/employers/upload-profile-employer/${this.user.employer_id}`, fd);
          if (res.data?.url) this.tempUser.profile_img_url = res.data.url;
        }

        // 3) อัปโหลดแกลเลอรีถ้ามี
        if (this.galleryFiles.length) {
          const fd2 = new FormData();
          this.galleryFiles.forEach(f => fd2.append("gallery", f));
          const res2 = await axios.post(`${BASE}/api/employers/${this.user.employer_id}/upload-gallery`, fd2);
          if (Array.isArray(res2.data?.urls)) this.tempUser.e_gallery = res2.data.urls;
        }

        // 4) sync กลับเป็นค่าจริง + localStorage แล้วจบ edit mode
        this.user = JSON.parse(JSON.stringify(this.tempUser));
        localStorage.setItem("user", JSON.stringify(this.user));
        this.editMode = false;

        // ล้าง stage
        this.tempUser = null; this.photoFile = null; this.photoPreview = null; this.galleryFiles = [];
        alert("✅ บันทึกข้อมูลสำเร็จ");
      } catch (e) {
        console.error("❌ บันทึกโปรไฟล์ล้มเหลว:", e.response?.data || e.message);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    },

    // --- modal รูป ---
    showImage(url) {
      this.currentImageIndex = (this.user.e_gallery || []).findIndex(img => this.imgUrl(img) === url);
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
  }
};
</script>

<style scoped>
.badge-category{background:#fff5e6;color:#ff6600;border:1px solid #ff6600;border-radius:999px;font-weight:500;padding:.1rem .5rem;font-size:12px}
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:9999}
.modal-image-wrapper{position:relative;border-radius:16px;max-width:90vw;max-height:90vh;background:#fff;box-shadow:0 20px 50px rgba(0,0,0,.5);overflow:hidden;display:flex;align-items:center;justify-content:center}
.preview-image{display:block;max-width:100%;max-height:90vh;object-fit:contain}
.close-btn{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.6);color:#fff;border:none;border-radius:50%;padding:.4rem .6rem;font-size:1.2rem;cursor:pointer}
.close-btn:hover{background:rgba(0,0,0,.9)}
.nav-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.6);color:#fff;border:none;padding:.6rem .8rem;font-size:2rem;border-radius:50%;cursor:pointer}
.nav-btn:hover{background:rgba(0,0,0,.9)}
.nav-btn.left{left:10px}.nav-btn.right{right:10px}
</style>
