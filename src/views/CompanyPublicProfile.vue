<template>
  <div>
    <NavbarHome />
    <div class="container py-5 d-flex flex-column flex-lg-row gap-4" style="max-width:1140px;margin:0 auto">
      <!-- ซ้าย: ข้อมูลบริษัท -->
      <div class="card p-4 shadow rounded-4 w-100" style="flex:2">
        <div class="text-center mb-4">
          <img :src="avatar" class="rounded mb-2" style="width:100px;height:100px;object-fit:cover" alt="company" />
          <h5 class="fw-bold mb-0">{{ company.e_company_name || 'ชื่อบริษัท' }}</h5>
          <p class="text-muted small">{{ company.e_type || 'ประเภทธุรกิจ' }}</p>
        </div>

        <h6 class="fw-bold text-success mb-2">เกี่ยวกับบริษัท</h6>
        <div class="card bg-light p-3 mb-4">
          <p class="small mb-0">{{ company.e_description || '-' }}</p>
        </div>

        <h6 class="fw-bold text-success mb-2">แกลเลอรี่รูปภาพบริษัท</h6>
        <div class="d-flex gap-2 overflow-auto mb-4">
          <img v-for="(img,i) in gallery" :key="i" :src="base + img" class="rounded"
               style="height:80px;object-fit:cover;cursor:pointer" @click="selectedImage = base + img" />
        </div>

        <h6 class="fw-bold text-success mb-2">ที่อยู่บริษัท</h6>
        <p class="small mb-2">{{ company.e_address || '-' }}</p>

        <iframe v-if="company.e_map_iframe" :src="company.e_map_iframe" width="100%" height="220"
                style="border:0;border-radius:8px" allowfullscreen loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"></iframe>

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

      <!-- ขวา: งานที่โพสต์ -->
      <div style="flex:1">
        <h5 class="fw-bold text-orange mb-3">ตำแหน่งงานที่รับสมัคร</h5>
        <div v-for="job in jobs" :key="job.job_id" class="border rounded-4 bg-white shadow-sm p-4 mb-4"
             style="cursor:pointer" @click="$router.push(`/jobs/${job.job_id}`)">
          <h6 class="fw-bold text-dark mb-1">{{ job.j_title }}</h6>
          <span class="badge-category">{{ job.j_type || '-' }}</span>
          <p class="mb-1 text-muted"><i class="bi bi-cash-coin me-1"></i> ค่าจ้าง: {{ Number(job.j_salary).toLocaleString() }} บาท</p>
          <p class="mb-0 text-muted"><i class="bi bi-person-lines-fill me-1"></i> รับจำนวน: {{ job.j_amount || '-' }} คน</p>
        </div>

        <div v-if="jobs.length === 0" class="text-muted text-center py-5">
          <i class="bi bi-briefcase"></i>
          <p class="mt-2">บริษัทยังไม่มีการโพสต์งาน</p>
        </div>
      </div>
    </div>

    <!-- modal รูปใหญ่ -->
    <div v-if="selectedImage" class="modal-backdrop" @click.self="selectedImage=null">
      <div class="modal-image-wrapper">
        <button class="close-btn" @click="selectedImage=null">✕</button>
        <img :src="selectedImage" class="preview-image"/>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarHome from "@/components/NavbarHome.vue";
import axios from "axios";

const publicApi = axios.create({ baseURL: "http://localhost:3001" });

export default {
  name: "CompanyPublicProfile",
  components: { NavbarHome },
  data() {
    return {
      company: {},
      jobs: [],
      gallery: [],
      selectedImage: null,
      base: "http://localhost:3001",
    };
  },
  computed: {
    avatar() {
      return this.company.profile_img_url ? this.base + this.company.profile_img_url : "/default-profile.jpg";
    },
  },
  async mounted() {
    const id = this.$route.params.id;
    try {
      const c = await publicApi.get(`/api/employers/${id}`, { meta: { ignoreAuthRedirect: true } });
      this.company = c.data || {};
      this.gallery = JSON.parse(this.company.e_gallery || "[]");

      const j = await publicApi.get(`/api/jobs/employer/${id}`, { meta: { ignoreAuthRedirect: true } });
      this.jobs = j.data || [];
    } catch (e) {
      console.error("โหลดข้อมูลบริษัทล้มเหลว:", e);
      this.$router.replace("/");
    }
  },
};
</script>

<style scoped>
.text-orange { color:#ff6600; }
.badge-category { background:#fff5e6; color:#ff6600; border:1px solid #ff6600; border-radius:999px; font-weight:500; padding:.1rem .5rem; font-size:12px; }
.modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.85); display:flex; align-items:center; justify-content:center; z-index:9999; }
.modal-image-wrapper { position:relative; border-radius:16px; max-width:90vw; max-height:90vh; background:#fff; overflow:hidden; display:flex; align-items:center; justify-content:center; }
.preview-image { max-width:100%; max-height:90vh; object-fit:contain; }
.close-btn { position:absolute; top:10px; right:10px; background:rgba(0,0,0,.6); color:#fff; border:none; border-radius:50%; padding:.4rem .6rem; font-size:1.2rem; cursor:pointer; }
</style>
