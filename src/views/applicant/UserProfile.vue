<template>
  <div>
    <NavbarApplicant />
    <div class="container py-5">
      <div class="text-center mb-5">
        <h2 class="fw-bold text-orange">
          <i class="bi bi-person-circle me-2"></i> โปรไฟล์ของคุณ
        </h2>
      </div>

      <div class="card shadow rounded-4 p-5 bg-white mx-auto" style="max-width: 1080px">
        <div class="row g-5">
          <!-- ซ้าย -->
          <div class="col-md-4 border-end pe-md-4">
            <div class="text-center mb-3">
              <img :src="profileImage || defaultImage"
                   class="rounded-4 shadow-sm border"
                   style="width:100%;max-width:240px;height:300px;object-fit:cover"
                   alt="profile" />
            </div>
            <h6 class="fw-bold text-center border-top pt-3">ข้อมูลติดต่อ</h6>
            <ul class="list-unstyled mt-3 contact-info">
              <li class="mb-2 fw-bold text-dark fs-5">{{ user.a_firstname }} {{ user.a_lastname }}</li>
              <li class="mb-2">เพศ : {{ user.a_gender || '-' }}</li>
              <li class="mb-2">อายุ : {{ calculateAge(user.a_birthdate) }}</li>
              <li class="mb-2">คณะ : {{ user.a_faculty || '-' }}</li>
              <li class="mb-2">สัญชาติ : {{ user.a_nationality || '-' }}</li>
              <li class="mb-2 d-flex align-items-center gap-2">
                <i class="bi bi-telephone-fill text-success"></i><span>{{ user.a_phone || '-' }}</span>
              </li>
              <li class="mb-2 d-flex align-items-center gap-2">
                <i class="bi bi-envelope-fill text-primary"></i><span>{{ user.a_email || '-' }}</span>
              </li>
            </ul>
          </div>

          <!-- ขวา -->
          <div class="col-md-8">
            <!-- ตำแหน่ง + ค่าจ้าง -->
            <section class="mb-4">
              <h5 class="fw-bold mb-2">ตำแหน่งงานที่สนใจ</h5>
              <p class="mb-1 text-primary fw-bold">{{ user.a_position || 'ยังไม่ระบุ' }}</p>
              <p class="text-muted small">
                ค่าจ้างที่ต้องการ : {{ formatExpectedPay(user.a_salary) }}
                <template v-if="isNumber(user.a_salary)">บาท</template>
              </p>
            </section>

            <!-- ทักษะ -->
           <section class="mb-4">
  <h5 class="fw-bold mb-2">ทักษะและความสามารถ</h5>
  <p class="mb-0 preline">{{ user.a_bio || '-' }}</p>
</section>
            <!-- ความสนใจ -->
            <section class="mb-4">
              <h5 class="fw-bold mb-2">ความสนใจอื่น ๆ</h5>
              <p class="mb-0">{{ user.a_interest || '-' }}</p>
            </section>

            <!-- การศึกษา -->
            <section class="mb-4">
              <h5 class="fw-bold mb-2">ประวัติการศึกษา</h5>
              <div v-if="user.education && user.education.length">
                <div v-for="(edu, index) in user.education" :key="index" class="mb-3">
                  <p class="fw-semibold">{{ edu.start_year || '-' }} - {{ edu.university || '-' }}</p>
                  <p class="mb-1">ระดับการศึกษา : {{ edu.level || '-' }}</p>
                  <p class="mb-1">วุฒิการศึกษา : {{ edu.degree || '-' }}</p>
                  <p class="mb-1">สาขาวิชา : {{ edu.major || '-' }}</p>
                  <p class="mb-1">เกรดเฉลี่ย : {{ edu.gpa || '-' }}</p>
                </div>
              </div>
              <p v-else class="text-muted mb-0">ยังไม่มีข้อมูลประวัติการศึกษา</p>
            </section>

            <!-- ประสบการณ์ทำงาน -->
            <section class="mb-4">
              <h5 class="fw-bold mb-2">ประวัติการทำงาน</h5>
              <div v-if="user.experiences && user.experiences.length">
                <div v-for="(job, index) in user.experiences" :key="index" class="mb-3 border-bottom pb-2">
                  <p class="fw-semibold">💼 ตำแหน่ง : {{ job.title || '-' }}</p>
                  <p class="mb-1">
                    ช่วงเวลา : {{ formatDate(job.start_date) }} - {{ job.end_date ? formatDate(job.end_date) : 'ปัจจุบัน' }}
                  </p>
                  <p class="mb-1">ประสบการณ์ : {{ job.duration || '-' }}</p>
                  <ul v-if="job.description" class="mb-0 ps-3">
                    <li v-for="(desc, idx) in job.description.split('\n')" :key="idx">{{ desc }}</li>
                  </ul>
                </div>
              </div>
              <p v-else class="text-muted mb-0">ยังไม่มีข้อมูลประวัติการทำงาน</p>
            </section>

            <div class="text-end mt-4">
              <router-link
                to="/applicant/editprofile"
                class="btn border border-2 border-warning text-warning rounded-pill px-4 py-2 fw-semibold"
                style="background-color:white;"
              >
                แก้ไขโปรไฟล์
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarApplicant from "@/components/NavbarApplicant.vue";
import DefaultProfile from "@/assets/default-profile.png";

const BASE_URL = "http://localhost:3001";

export default {
  name: "UserProfile",
  components: { NavbarApplicant },
  data() {
    return {
      user: { education: [], experiences: [] },
      skills: [],
      profileImage: null,
      defaultImage: DefaultProfile,
    };
  },
  mounted() {
    const id = this.getCurrentApplicantId();
    if (id) this.fetchProfile(id);
  },
  methods: {
    getCurrentApplicantId() {
      try {
        const local = JSON.parse(localStorage.getItem("user"));
        return this.$route.params.id || local?.applicant_id || null;
      } catch {
        return this.$route.params.id || null;
      }
    },
    isNumber(v){ return v!==null && v!==undefined && !isNaN(Number(v)); },
    formatExpectedPay(v){
      if (v===null || v===undefined || v==="") return "ตามตกลง";
      const n = Number(v); return isNaN(n) ? "ตามตกลง" : n.toLocaleString("th-TH");
    },
    calculateAge(dateStr) {
      const birthDate = new Date(dateStr);
      if (isNaN(birthDate)) return "-";
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      return `${age} ปี`;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      if (isNaN(date)) return "-";
      const thYear = date.getFullYear() + 543;
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${day}/${month}/${thYear}`;
    },
    async fetchProfile(id) {
      try {
        const res = await axios.get(`${BASE_URL}/api/applicants/${id}`);
        this.user = {
          ...res.data.user,
          education: res.data.education || [],
          experiences: res.data.experience || [],
        };
        this.skills = res.data.skills || [];

        if (res.data.user.profile_img_url) {
          this.profileImage = `${BASE_URL}${res.data.user.profile_img_url}`;
        }
      } catch (err) {
        console.error("❌ fetchProfile failed", err.response?.data || err.message);
      }
    },
  },
};
</script>

<style scoped>
.preline { white-space: pre-line; } /* ให้ขึ้นบรรทัดตามที่พิมพ์ */
.text-orange { color: #ff6600; }
.contact-info { font-size: 1rem; line-height: 1.6; }
ul li::before { content: none !important; }
</style>
