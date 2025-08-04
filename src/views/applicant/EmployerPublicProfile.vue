<template>
  <div>
    <NavbarApplicant />
    <div class="container py-5 d-flex flex-column flex-lg-row gap-4" style="max-width: 1140px; margin: 0 auto">

      <!-- ข้อมูลบริษัท -->
      <div class="card p-4 shadow rounded-4 w-100" style="flex: 2">
        <div class="text-center mb-4">
          <img
            :src="company.profile_img_url ? 'http://localhost:3001' + company.profile_img_url : '/default-profile.jpg'"
            class="rounded mb-2"
            style="width: 100px; height: 100px; object-fit: cover"
          />
          <h5 class="fw-bold mb-0">{{ company.e_company_name || 'ชื่อบริษัท' }}</h5>
          <p class="text-muted small">{{ company.e_type || 'ประเภทธุรกิจ' }}</p>
        </div>

        <h6 class="fw-bold text-success mb-2">เกี่ยวกับบริษัท</h6>
        <div class="card bg-light p-3 mb-4">
          <p class="small mb-0">{{ company.e_description || '-' }}</p>
        </div>

        <h6 class="fw-bold text-success mb-2">แกลเลอรี่รูปภาพบริษัท</h6>
        <div class="d-flex gap-2 overflow-auto mb-4">
          <img
            v-for="img in company.e_gallery || []"
            :key="img"
            :src="'http://localhost:3001' + img"
            class="rounded"
            style="height: 80px; object-fit: cover"
            @click="showImage('http://localhost:3001' + img)"
          />
        </div>

        <h6 class="fw-bold text-success mb-2">ที่อยู่บริษัท</h6>
        <p class="small mb-2">{{ company.e_address || '-' }}</p>

        <iframe
          v-if="company.e_map_iframe"
          :src="company.e_map_iframe"
          width="100%"
          height="220"
          style="border:0; border-radius: 8px"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>

        <h6 class="fw-bold text-success mb-2 mt-3">ข้อมูลติดต่อบริษัท</h6>
        <ul class="list-unstyled small text-muted">
          <li><i class="bi bi-person-circle me-2"></i> {{ company.e_contact || '-' }}</li>
          <li><i class="bi bi-telephone me-2"></i> {{ company.e_phone || '-' }}</li>
          <li>
            <i class="bi bi-globe me-2"></i>
            <a v-if="company.e_website" :href="company.e_website" target="_blank">{{ company.e_website }}</a>
            <span v-else>-</span>
          </li>
        </ul>
      </div>

      <!-- ตำแหน่งงานที่บริษัทโพสต์ -->
      <div style="flex: 1">
        <h5 class="fw-bold text-orange mb-3">ตำแหน่งงานที่รับสมัคร</h5>

        <div
          v-for="job in jobs"
          :key="job.job_id"
          class="border rounded-4 bg-white shadow-sm p-4 mb-4"
          @click="$router.push(`/applicant/jobs/${job.job_id}`)"
          style="cursor: pointer"
        >
          <h6 class="fw-bold text-dark mb-1">{{ job.j_title }}</h6>
          <span class="badge bg-light text-dark border mb-2">{{ job.j_type }}</span>
          <p class="mb-1 text-muted">
            <i class="bi bi-cash-coin me-1"></i> ค่าจ้าง: {{ Number(job.j_salary).toLocaleString() }} บาท
          </p>
          <p class="mb-0 text-muted">
            <i class="bi bi-person-lines-fill me-1"></i> รับจำนวน: {{ job.j_amount || '-' }} คน
          </p>
        </div>

        <div v-if="jobs.length === 0" class="text-muted text-center py-5">
          <i class="bi bi-briefcase"></i>
          <p class="mt-2">บริษัทนี้ยังไม่มีการโพสต์งาน</p>
        </div>
      </div>
    </div>

    <!-- modal ดูภาพใหญ่ -->
    <div v-if="selectedImage" class="modal-backdrop" @click.self="selectedImage = null">
      <div class="modal-image-wrapper">
        <button class="close-btn" @click="selectedImage = null">✕</button>
        <button class="nav-btn left" @click="prevImage">‹</button>
        <img :src="selectedImage" class="preview-image" />
        <button class="nav-btn right" @click="nextImage">›</button>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarApplicant from "@/components/NavbarApplicant.vue";
import axios from "axios";

export default {
  name: "EmployerPublicProfile",
  components: { NavbarApplicant },
  data() {
    return {
      company: {},
      jobs: [],
      selectedImage: null,
      currentImageIndex: 0,
    };
  },
  async mounted() {
    const employerId = this.$route.params.id;
    try {
      const companyRes = await axios.get(`http://localhost:3001/api/employers/${employerId}`);
      this.company = companyRes.data;
      this.company.e_gallery = JSON.parse(this.company.e_gallery || "[]");

      const jobsRes = await axios.get(`http://localhost:3001/api/jobs/employer/${employerId}`);
      this.jobs = jobsRes.data;
    } catch (err) {
      console.error("❌ โหลดข้อมูลบริษัทล้มเหลว:", err);
    }
  },
  methods: {
    showImage(url) {
      this.currentImageIndex = this.company.e_gallery.findIndex(img => 'http://localhost:3001' + img === url);
      this.selectedImage = url;
    },
    nextImage() {
      const total = this.company.e_gallery.length;
      this.currentImageIndex = (this.currentImageIndex + 1) % total;
      this.selectedImage = 'http://localhost:3001' + this.company.e_gallery[this.currentImageIndex];
    },
    prevImage() {
      const total = this.company.e_gallery.length;
      this.currentImageIndex = (this.currentImageIndex - 1 + total) % total;
      this.selectedImage = 'http://localhost:3001' + this.company.e_gallery[this.currentImageIndex];
    }
  }
};
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
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}
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
  z-index: 10;
}
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
}
.nav-btn.left {
  left: 10px;
}
.nav-btn.right {
  right: 10px;
}
</style>
