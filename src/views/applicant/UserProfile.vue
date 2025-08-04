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
              <img
                :src="profileImage || defaultImage"
                class="rounded-4 shadow-sm border"
                style="width: 100%; max-width: 240px; height: 300px; object-fit: cover"
                alt="profile"
              />
            </div>
            <h6 class="fw-bold text-center border-top pt-3">ข้อมูลติดต่อ</h6>
            <ul class="list-unstyled small mt-3">
              <li class="mb-2 fw-semibold">ชื่อ : {{ user.a_firstname }} {{ user.a_lastname }}</li>
              <li class="mb-2">เพศ : {{ user.a_gender }}</li>
              <li class="mb-2">อายุ : {{ calculateAge(user.a_birthdate) }}</li>
              <li class="mb-2">คณะ : {{ user.a_faculty }}</li>
              <li class="mb-2">สัญชาติ : {{ user.a_nationality || '-' }}</li>
              <li class="mb-2 d-flex align-items-center gap-2">
                <i class="bi bi-telephone-fill text-success"></i> <span>{{ user.a_phone }}</span>
              </li>
              <li class="mb-2 d-flex align-items-center gap-2">
                <i class="bi bi-envelope-fill text-primary"></i> <span>{{ user.a_email }}</span>
              </li>
            </ul>
          </div>

          <!-- ขวา -->
          <div class="col-md-8">
            <section class="mb-4">
              <h5 class="fw-bold mb-2">ตำแหน่งงานที่สนใจ</h5>
              <p class="mb-1 text-primary fw-bold">{{ user.a_position || 'ยังไม่ระบุ' }}</p>
              <p class="text-muted small">ค่าจ้างที่ต้องการ : {{ user.a_salary || '-' }} บาท</p>
            </section>

            <section class="mb-4">
              <h5 class="fw-bold mb-2">ทักษะและความสามารถ</h5>
              <ul class="ps-3">
                <li v-for="skill in skills" :key="skill.skill_id">• {{ skill.skill_name }}</li>
              </ul>
            </section>

            <section class="mb-4">
              <h5 class="fw-bold mb-2">ระดับความชำนาญด้านคอมพิวเตอร์</h5>
              <div class="d-flex align-items-center">
                <span v-for="n in 5" :key="n" style="font-size: 1.25rem; margin-right: 4px">
                  <i class="bi" :class="n <= selectedStars ? 'bi-star-fill text-warning' : 'bi-star text-muted'"></i>
                </span>
                <span class="ms-2 text-muted">ระดับ: {{ computerLevelLabel }}</span>
              </div>
            </section>

            <section class="mb-4">
              <h5 class="fw-bold mb-2">ความสนใจอื่น ๆ</h5>
              <p class="mb-0">{{ user.a_interest || '-' }}</p>
            </section>

            <section class="mb-4">
              <h5 class="fw-bold mb-2">ประวัติการศึกษา</h5>
              <div v-if="user.education && user.education.length > 0">
                <div v-for="(edu, index) in user.education" :key="index" class="mb-3">
                  <p class="fw-semibold">{{ edu.start_year }} - {{ edu.university }}</p>
                  <p class="mb-1">ระดับการศึกษา : {{ edu.level || '-' }}</p>
                  <p class="mb-1">วุฒิการศึกษา : {{ edu.degree || '-' }}</p>
                  <p class="mb-1">สาขาวิชา : {{ edu.major || '-' }}</p>
                  <p class="mb-1">เกรดเฉลี่ย : {{ edu.gpa || '-' }}</p>
                </div>
              </div>
              <div v-else>
                <p class="text-muted">ยังไม่มีข้อมูลประวัติการศึกษา</p>
              </div>
            </section>

            <section class="mb-4">
              <h5 class="fw-bold mb-2">ประวัติการทำงาน</h5>
              <div v-for="(job, index) in user.experiences || []" :key="index" class="mb-3 border-bottom pb-2">
                <p class="fw-semibold">💼ตำแหน่ง : {{ job.title }}</p>
                <p class="mb-1">ช่วงเวลา : {{ formatDate(job.start_date) }} - {{ job.end_date ? formatDate(job.end_date) : 'ปัจจุบัน' }}</p>
                <p class="mb-1">ประสบการณ์ : {{ job.duration }}</p>
                <ul class="mb-0 ps-3">
                  <li v-for="(desc, idx) in job.description.split('\n')" :key="idx">• {{ desc }}</li>
                </ul>
              </div>
            </section>

            <div class="text-end mt-4">
              <router-link
                to="/applicant/editprofile"
                class="btn btn-warning rounded-pill px-4 py-2 text-white fw-semibold"
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
      user: {
        education: [],
        experiences: [],
        a_computer_level: "",
        a_computer_stars: "",
      },
      selectedStars: 3,
      skills: [],
      profileImage: null,
      defaultImage: DefaultProfile,
    };
  },
  computed: {
    computerLevelLabel() {
      const levels = ['เริ่มต้น', 'พอใช้', 'ปานกลาง', 'ดี', 'ดีมาก'];
      return levels[this.selectedStars - 1] || 'ปานกลาง';
    },
  },
  mounted() {
    const id = this.$route.params.id || localStorage.getItem("user_id");
    if (id) this.fetchProfile(id);
  },
  methods: {
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
        this.selectedStars = parseInt(res.data.user.a_computer_stars) || 3;

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
.text-orange {
  color: #ff6600;
}
ul {
  list-style: none;
  padding-left: 0;
}
ul li::before {
  content: '•';
  margin-right: 6px;
  color: #444;
}
</style>
