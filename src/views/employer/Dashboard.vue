<template>
  <div>
    <NavbarEmployer />
    <div class="container py-5 d-flex flex-column flex-lg-row gap-4" style="max-width: 1140px; margin: 0 auto">
      <!-- ข้อมูลบริษัทด้านซ้าย -->
      <div class="card p-4 shadow rounded-4" style="width: 100%">
        <div class="text-end mb-2">
          <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="editMode = !editMode">
            {{ editMode ? 'ยกเลิกการแก้ไข' : '✏️ แก้ไขโปรไฟล์บริษัท' }}
          </button>
        </div>

        <div class="text-center mb-4">
          <img :src="user.profile_img_url ? 'http://localhost:3001' + user.profile_img_url : '/default-profile.jpg'"
            class="rounded mb-2" style="width: 100px; height: 100px; object-fit: cover" />
          <div v-if="editMode" class="mb-3">
            <input type="file" @change="uploadProfileImage" class="form-control form-control-sm" />
          </div>
          <h5 class="fw-bold mb-0">
            <template v-if="editMode">
              <input v-model="user.e_company_name" class="form-control form-control-sm text-center"
                placeholder="ชื่อบริษัทของคุณ" />
            </template>
            <template v-else>
              {{ user.e_company_name || 'ชื่อบริษัทของคุณ' }}
            </template>
          </h5>
        </div>

        <h6 class="fw-bold text-success mb-3">ข้อมูลติดต่อบริษัท</h6>
        <ul class="list-unstyled small text-muted mb-4">
          <li><i class="bi bi-telephone me-2"></i> <b>โทรศัพท์: </b>
            <template v-if="editMode">
              <input v-model="user.e_phone" class="form-control form-control-sm" />
            </template>
            <template v-else>
              {{ user.e_phone || '-' }}
            </template>
          </li>
          <li><i class="bi bi-person-circle me-2"></i> <b>ผู้ติดต่อ: </b>
            <template v-if="editMode">
              <input v-model="user.e_contact" class="form-control form-control-sm" />
            </template>
            <template v-else>
              {{ user.e_contact || '-' }}
            </template>
          </li>
          <li><i class="bi bi-person-badge me-2"></i> <b>ตำแหน่ง: </b>
            <template v-if="editMode">
              <input v-model="user.e_position" class="form-control form-control-sm" />
            </template>
            <template v-else>
              {{ user.e_position || '-' }}
            </template>
          </li>
          <li><i class="bi bi-globe me-2"></i> <b>เว็บไซต์: </b>
            <template v-if="editMode">
              <input v-model="user.e_website" class="form-control form-control-sm"
                placeholder="https://your-company.com" />
            </template>
            <template v-else>
              <a v-if="user.e_website" :href="user.e_website" target="_blank">{{ user.e_website }}</a>
              <span v-else>—</span>
            </template>
          </li>
        </ul>
        <h6 class="fw-bold text-success mb-2">เกี่ยวกับบริษัท</h6>
        <div v-if="!editMode" class="card bg-light p-3 mb-4">
          <p class="small mb-0">
            {{ user.e_description || 'คุณยังไม่ได้เพิ่มรายละเอียดเกี่ยวกับบริษัทของคุณ' }}
          </p>
        </div>
        <textarea v-else v-model="user.e_description" class="form-control mb-4" rows="3"
          placeholder="ใส่คำอธิบายเกี่ยวกับบริษัทของคุณ"></textarea>
        <!-- ประเภทบริษัท -->
        <div class="mb-4">
          <div class="border rounded-4 p-3 shadow-sm bg-white w-100 text-center">
            <i class="bi bi-building fs-1 text-secondary mb-2"></i>
            <div class="fw-semibold text-muted">ประเภทธุรกิจ</div>
            <template v-if="editMode">
              <input v-model="user.e_type" class="form-control form-control-sm text-center mt-2"
                placeholder="ระบุประเภท เช่น ร้านอาหาร, ค้าปลีก, ฯลฯ" />
            </template>
            <template v-else>
              <div class="fw-bold text-success mt-1">{{ user.e_type || '—' }}</div>
            </template>
          </div>
        </div>


        <h6 class="fw-bold text-success mb-2">แกลเลอรี่รูปภาพบริษัท</h6>
        <div class="d-flex gap-2 overflow-auto mb-3">
          <img v-for="img in user.e_gallery || []" :key="img" :src="'http://localhost:3001' + img" class="rounded"
            style="height: 80px; object-fit: cover; cursor: pointer"
            @click="showImage('http://localhost:3001' + img)" />


        </div>
        <!-- modal ดูภาพ -->
    <div v-if="selectedImage" class="modal-backdrop" @click.self="selectedImage = null">
  <div class="modal-image-wrapper">
    <button class="close-btn" @click="selectedImage = null">✕</button>
    <button class="nav-btn left" @click="prevImage">‹</button>
    <img :src="selectedImage" class="preview-image" />
    <button class="nav-btn right" @click="nextImage">›</button>
  </div>
</div>



        <input v-if="editMode" type="file" multiple @change="handleGalleryUpload"
          class="form-control form-control-sm mb-4" />

        <h6 class="fw-bold text-success mb-2">ที่อยู่บริษัท</h6>
        <div v-if="editMode">
          <textarea v-model="user.e_address" class="form-control form-control-sm" rows="2"
            placeholder="กรอกที่อยู่บริษัท"></textarea>
        </div>
        <p v-else class="small mb-2">
          {{ user.e_address || 'ยังไม่ระบุที่อยู่บริษัท' }}
        </p>

        <iframe v-if="user.e_map_iframe" :src="user.e_map_iframe" width="100%" height="220" style="border:0"
          allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        <input v-if="editMode" v-model="user.e_map_iframe" placeholder="วางลิงก์ iframe ของ Google Maps ที่นี่"
          class="form-control form-control-sm mt-2" />

        <button v-if="editMode" class="btn btn-success w-100 rounded-pill mt-3" @click="saveProfile">
          💾 บันทึกการแก้ไข
        </button>
      </div>

      <!-- รายการตำแหน่งงานด้านขวา -->
      <div class="flex-grow-1" style="flex-basis: 43%">

        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="fw-bold mb-0 text-orange">
            ตำแหน่งงานที่รับสมัคร
          </h5>
          <span class="text-muted small" style="font-size: 1rem">{{ filteredJobs.length }} ตำแหน่ง</span>

        </div>

        <div class="search-box mb-4 shadow-sm">
          <i class="bi bi-search text-muted search-icon"></i>
          <input type="text" class="form-control search-input" placeholder="ค้นหาชื่องานที่คุณโพสต์ไว้..."
            v-model="search" />
        </div>

        <div v-for="job in filteredJobs" :key="job.job_id" class="job-card border rounded-4 bg-white shadow-sm p-4 mb-4"
          @click="$router.push(`/employer/jobs/${job.job_id}`)" style="cursor: pointer">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h6 class="fw-bold mb-1 text-dark">{{ job.j_title }}</h6>
              <p class="text-muted small mb-1">
                <i class="bi bi-cash-coin me-1"></i> ค่าจ้าง: <span class="text-success">{{
                  parseFloat(job.j_salary).toLocaleString() }} บาท</span>
              </p>
              <p class="text-muted small mb-1">
                <i class="bi bi-calendar3 me-1"></i> หมดเขต: {{ formatDate(job.j_appdeadline) }}
              </p>
              <p class="text-muted small">
                <i class="bi bi-person-lines-fill me-1"></i>
                อัตราที่รับ: {{ job.j_amount ? job.j_amount + ' คน' : 'ยังไม่ระบุ' }}
              </p>




              <div class="d-flex flex-wrap gap-2 mt-2">
                <span class="badge rounded-pill bg-success">งานพาร์ทไทม์</span>
                <span class="badge rounded-pill bg-danger">สัมภาษณ์ออนไลน์</span>
              </div>
            </div>
          </div>
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

export default {
  name: "DashboardEmployer",
  components: { NavbarEmployer },
  data() {
  return {
    user: {
      e_gallery: [],   // กำหนดค่าเริ่มต้นภายในเดียวกัน
    },
    search: "",
    jobs: [],
    editingJob: {},
    showModal: false,
    selectedImage: null,
    editMode: false,
    currentImageIndex: 0,
    galleryImages: [],
  };
}
,
  computed: {
    filteredJobs() {
      return this.jobs.filter((job) =>
        job.j_title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  mounted() {
    const userStr = localStorage.getItem("user");
    if (!userStr) return this.$router.push("/login");
    this.user = JSON.parse(userStr);
    this.fetchJobs();
    this.fetchUserProfile();
  },
  methods: {
    formatDate(d) {
      const date = new Date(d);
      return date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    async fetchUserProfile() {
      try {
        const res = await axios.get(`http://localhost:3001/api/employers/${this.user.employer_id}`);
        const profile = res.data;
        if (profile.e_gallery) {
          profile.e_gallery = JSON.parse(profile.e_gallery);
        } else {
          profile.e_gallery = [];
        }
        this.user = profile;
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (err) {
        console.error("❌ โหลดข้อมูลโปรไฟล์ล้มเหลว:", err);
      }
    }
    ,
    async uploadProfileImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("profile", file);

      try {
        const res = await axios.post(`http://localhost:3001/api/employers/upload-profile-employer/${this.user.employer_id}`, formData);
        this.user.profile_img_url = res.data.url;
      } catch (err) {
        console.error("❌ อัปโหลดรูปโปรไฟล์ล้มเหลว:", err);
        alert("ไม่สามารถอัปโหลดรูปได้");
      }
    },
    async fetchJobs() {
      try {
        const res = await axios.get(`http://localhost:3001/api/jobs/employer/${this.user.employer_id}`);
        this.jobs = res.data;
      } catch (err) {
        console.error("❌ โหลดข้อมูลงานล้มเหลว:", err);
      }
    },
    openEdit(job) {
      this.editingJob = { ...job };
      this.showModal = true;
    },
    async deleteJob(id) {
      if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?")) return;
      try {
        await axios.delete(`http://localhost:3001/api/jobs/${id}`);
        this.fetchJobs();
      } catch (err) {
        console.error("❌ ลบล้มเหลว:", err);
      }
    },
    async saveProfile() {
      try {
        console.log("📝 กำลังบันทึก:", this.user.e_type);  // <--- เพิ่ม
        await axios.put(`http://localhost:3001/api/employers/${this.user.employer_id}`, this.user);
        alert("บันทึกข้อมูลสำเร็จ");
        localStorage.setItem("user", JSON.stringify(this.user));
        this.editMode = false;
      } catch (err) {
        console.error("❌ บันทึกโปรไฟล์ล้มเหลว:", err);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    }
    ,
    async updateStatus(applicationId, newStatus) {
  try {
    await axios.put(`http://localhost:3001/api/employer/applications/${applicationId}/status`, {
      app_status: newStatus
    });
    console.log("✅ อัปเดตสำเร็จ");
  } catch (err) {
    console.error("❌ อัปเดตสถานะล้มเหลว:", err);
  }
}
,
    async handleGalleryUpload(event) {
      const files = event.target.files;
      const formData = new FormData();
      for (const file of files) {
        formData.append("gallery", file);
      }

      try {
        const res = await axios.post(`http://localhost:3001/api/employers/${this.user.employer_id}/upload-gallery`, formData);
        this.user.e_gallery = res.data.urls;
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (err) {
        console.error("❌ อัปโหลดแกลเลอรี่ล้มเหลว:", err);
      }
    },
      showImage(url) {
  this.currentImageIndex = this.user.e_gallery.findIndex(img => 'http://localhost:3001' + img === url);
  this.selectedImage = url;
},
nextImage() {
  const total = this.user.e_gallery.length;
  this.currentImageIndex = (this.currentImageIndex + 1) % total;
  this.selectedImage = 'http://localhost:3001' + this.user.e_gallery[this.currentImageIndex];
},
prevImage() {
  const total = this.user.e_gallery.length;
  this.currentImageIndex = (this.currentImageIndex - 1 + total) % total;
  this.selectedImage = 'http://localhost:3001' + this.user.e_gallery[this.currentImageIndex];
},


}}
  ;
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-image-wrapper {
  position: relative;
  border-radius: 16px;
  max-width: 90vw;
  max-height: 90vh;
  background: #fff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  display: block;
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 0;
}

/* ปุ่มปิด */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 0.4rem 0.6rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
  z-index: 10;
}
.close-btn:hover {
  background: rgba(0, 0, 0, 0.9);
}

/* ปุ่มเลื่อนซ้าย/ขวา */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 0.6rem 0.8rem;
  font-size: 2rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s;
}
.nav-btn:hover {
  background: rgba(0, 0, 0, 0.9);
}
.nav-btn.left {
  left: 10px;
}
.nav-btn.right {
  right: 10px;
}

</style>
