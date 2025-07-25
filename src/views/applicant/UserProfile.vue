<template>
  <div>
    <NavbarApplicant />
    <div class="container py-5">
      <div class="text-center mb-4">
        <h2 class="fw-bold text-orange">
          <i class="bi bi-person-circle me-2"></i> โปรไฟล์ของคุณ
        </h2>
      </div>

      <div class="card shadow rounded-4 p-4 bg-white mx-auto" style="max-width: 980px">
        <div class="row g-4">
          <!-- ซ้าย: รูปภาพและข้อมูลติดต่อ -->
          <div class="col-md-4">
            <div class="text-center">
              <img
                :src="profileImage || defaultImage"
                class="rounded-4 shadow-sm border mb-3"
                style="width: 100%; max-width: 220px; height: 280px; object-fit: cover"
                alt="profile"
              />
            </div>
            <div class="border-top pt-3 mt-2">
              <h6 class="fw-bold mb-3 text-center">ข้อมูลติดต่อ</h6>
              <ul class="list-unstyled small">
                <li class="mb-1 fw-semibold">ชื่อ : {{ user.a_firstname }} {{ user.a_lastname }}</li>
                <li class="mb-1">เพศ : {{ user.a_gender }}</li>
                <li class="mb-1">อายุ : {{ calculateAge(user.a_birthdate) }}</li>
                <li class="mb-1">คณะ : {{ user.a_faculty }}</li>
                <li class="mb-1">สัญชาติ : {{ user.a_nationality || '-' }}</li>
                <li class="mb-1 d-flex gap-2 align-items-center">
                  <i class="bi bi-telephone-fill"></i> <span>{{ user.a_phone }}</span>
                </li>
                <li class="mb-1 d-flex gap-2 align-items-center">
                  <i class="bi bi-envelope-fill"></i> <span>{{ user.a_email }}</span>
                </li>
              </ul>
            
            </div>
          </div>

          <!-- ขวา: รายละเอียดโปรไฟล์ -->
          <div class="col-md-8">
            <section class="mb-4">
              <h5 class="fw-bold">ตำแหน่งงาน ที่สนใจ</h5>
              <p class="mb-1 text-primary fw-bold">{{ user.a_position || 'ยังไม่ระบุ' }}</p>
              <p class="text-muted small">ค่าจ้างที่ต้องการ : {{ user.a_salary || '-' }} บาท</p>
              <p class="text-muted small">จังหวัดที่สนใจทำงาน : {{ user.a_province || 'ยังไม่ระบุ' }}</p>
            </section>

            <section class="mb-4">
              <h5 class="fw-bold">ทักษะและความสามารถ</h5>
              <ul class="ps-3 mb-0">
                <li v-for="skill in skills" :key="skill.skill_id">{{ skill.skill_name }}</li>
              </ul>
            </section>

            <section class="mb-4">
              <h5 class="fw-bold">ระดับความชำนาญด้านคอมพิวเตอร์</h5>
              <p class="mb-1">
                <span v-html="user.a_computer_stars || '⭐ ⭐ ⭐ ☆ ☆'"></span>
                <span class="ms-2">{{ user.a_computer_level || 'ปานกลาง' }}</span>
              </p>
            </section>

            <section class="mb-4">
              <h5 class="fw-bold">ความสนใจอื่น ๆ</h5>
              <p class="mb-0">{{ user.a_interest || '-' }}</p>
            </section>

            <section class="mb-4">
              <h5 class="fw-bold">ประวัติการศึกษา</h5>
              <p class="fw-semibold">{{ user.a_study_year || '2564' }} - {{ user.a_university || 'มหาวิทยาลัยนเรศวร' }}</p>
              <p class="mb-1">ระดับการศึกษา : {{ user.a_education_level || '-' }}</p>
              <p class="mb-1">คณะ : {{ user.a_faculty || '-' }}</p>
              <p class="mb-1">สาขาวิชา : {{ user.a_major || '-' }}</p>
              <p class="mb-1">เกรดเฉลี่ย : {{ user.a_gpa || '-' }}</p>
            </section>

            <section class="mb-4">
              <h5 class="fw-bold">ประวัติการทำงาน</h5>
              <div v-for="(job, index) in user.experiences || []" :key="index" class="mb-3">
                <p class="fw-semibold">ตำแหน่ง : {{ job.title }}</p>
                <p class="mb-1">{{ formatDate(job.start_date) }} - {{ job.end_date ? formatDate(job.end_date) : 'ปัจจุบัน' }}</p>
                <p class="mb-1">ประสบการณ์ : {{ job.duration }}</p>
                <ul class="mb-1 ps-3">
                  <li v-for="(desc, idx) in job.description.split('\n')" :key="idx">{{ desc }}</li>
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
      user: {},
      skills: [],
      portfolios: [],
      profileImage: null,
      defaultImage: DefaultProfile,
    };
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
    async fetchProfile(id) {
      try {
        const res = await axios.get(`${BASE_URL}/api/applicants/${id}`);
        this.user = res.data.user;
        this.skills = res.data.skills;
        this.portfolios = res.data.portfolios;
        if (res.data.user.profile_img_url) {
          this.profileImage = `${BASE_URL}${res.data.user.profile_img_url}`;
        }
      } catch (err) {
        console.error("❌ fetchProfile failed", err);
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      if (isNaN(date)) return "-";
      const thYear = date.getFullYear() + 543;
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${day}/${month}/${thYear}`;
    },
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
ul {
  list-style: disc;
  padding-left: 1.25rem;
}
</style>
