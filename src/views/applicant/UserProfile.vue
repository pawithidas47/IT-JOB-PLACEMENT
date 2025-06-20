<template>
  <div>
    <NavbarApplicant />
    <div class="container py-5">
      <!-- Header -->
      <div class="text-center mb-4">
        <h2 class="fw-bold text-orange">
          <i class="bi bi-person-circle me-2"></i> โปรไฟล์ของคุณ
        </h2>
      </div>

      <div class="card shadow rounded-4 p-4 bg-white">
        <div class="row g-4">
          <!-- รูปภาพโปรไฟล์และข้อมูลติดต่อ -->
          <div class="col-md-3 d-flex flex-column align-items-center">
            <img
              :src="profileImage || defaultImage"
              class="rounded shadow border mb-3"
              style="width: 100%; max-width: 220px; height: 280px; object-fit: cover"
              alt="profile"
            />
            <div class="w-100 border-top pt-3 mt-2 text-start">
              <h6 class="fw-bold text-center">ข้อมูลติดต่อ</h6>
              <div class="mb-2">
                <label class="form-label small text-muted">เบอร์โทรศัพท์</label>
                <p class="form-control form-control-sm bg-light mb-1">{{ user.a_phone }}</p>
              </div>
              <div class="mb-2">
                <label class="form-label small text-muted">อีเมล</label>
                <p class="form-control form-control-sm bg-light mb-1">{{ user.a_email }}</p>
              </div>
              <div class="mb-2">
  <label class="form-label small text-muted">ช่องทางติดต่อเพิ่มเติม</label>
  <p class="form-control form-control-sm bg-light mb-1">{{ user.a_contact || '-' }}</p>
</div>

            </div>
          </div>

          <!-- ข้อมูลรายละเอียด -->
          <div class="col-md-9">
            <div class="row g-3 border-start ps-4">
              <div class="col-md-6">
                <label class="form-label">ชื่อ</label>
                <p class="form-control bg-light">{{ user.a_firstname }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label">นามสกุล</label>
                <p class="form-control bg-light">{{ user.a_lastname }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label">รหัสนิสิต</label>
                <p class="form-control bg-light">{{ user.a_studentid }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label">คณะ</label>
                <p class="form-control bg-light">{{ user.a_faculty }}</p>
              </div>
              <div class="col-md-6">
  <label class="form-label">อายุ</label>
  <p class="form-control bg-light">{{ calculateAge(user.a_birthdate) }}</p>
</div>
              <div class="col-md-6">
                <label class="form-label">เพศ</label>
                <p class="form-control bg-light">{{ user.a_gender }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label">แนะนำตัวเอง (Bio)</label>
                <p class="form-control bg-light" style="height: 120px">{{ user.a_bio || '-' }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label">ผลงาน (Portfolio)</label>
                <div class="form-control bg-light" style="height: 120px; overflow: auto">
                  <ul class="mb-0 ps-3">
                    <li v-for="item in portfolios" :key="item.portfolio_id">
                      <a :href="item.portfolio_url" target="_blank">{{ item.portfolio_url }}</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label">ทักษะและเครื่องมือ (Skills & Tools)</label>
                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="skill in skills"
                    :key="skill.skill_id"
                    class="badge rounded-pill bg-success px-3 py-2"
                  >
                    ✅ {{ skill.skill_name }}
                  </span>
                </div>
              </div>
            </div>
            <div class="text-end mt-4">
              <router-link
                to="/applicant/editprofile"
                class="btn px-4 py-2 rounded-pill text-white"
                style="background-color: #ff6600"
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
}
,
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
        const res = await axios.get(`${BASE_URL}/api/applicant/${id}`);
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
  return `${day}/${month}/${thYear}`; // ✅ เช่น 10/03/2548
}

,
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
</style>
