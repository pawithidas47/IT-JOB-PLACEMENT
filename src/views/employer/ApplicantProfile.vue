<template>
  <div>
    <NavbarEmployer />
    <div class="container py-5">
      <h4 class="fw-bold text-orange mb-4">
        <i class="bi bi-journal-text me-2"></i> โปรไฟล์ผู้สมัคร
      </h4>

      <div class="card p-4 shadow rounded-4" v-if="applicant">
        <div class="row">
          <!-- ภาพ -->
          <div class="col-md-3 text-center border-end pe-4">
            <img
              :src="profileImage || defaultImage"
              class="img-fluid rounded shadow mb-3"
              style="max-height: 250px; object-fit: cover"
            />
            <div class="text-start small">
              <p class="mb-1">
                <i class="bi bi-telephone-fill text-danger me-2"></i> {{ applicant.a_phone || '-' }}
              </p>
              <p class="mb-1">
                <i class="bi bi-envelope-at-fill text-primary me-2"></i> {{ applicant.a_email || '-' }}
              </p>
              <p class="mb-1">
                <i class="bi bi-chat-dots text-muted me-2"></i> {{ applicant.a_contact || '-' }}
              </p>
            </div>
          </div>

          <!-- ข้อมูล -->
          <div class="col-md-9 ps-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label>ชื่อ</label>
                <input class="form-control bg-light" :value="applicant.a_firstname" readonly />
              </div>
              <div class="col-md-6">
                <label>นามสกุล</label>
                <input class="form-control bg-light" :value="applicant.a_lastname" readonly />
              </div>
              <div class="col-md-6">
                <label>รหัสนิสิต</label>
                <input class="form-control bg-light" :value="applicant.a_studentid" readonly />
              </div>
              <div class="col-md-6">
                <label>คณะ</label>
                <input class="form-control bg-light" :value="applicant.a_faculty" readonly />
              </div>
              <div class="col-md-6">
                <label>อายุ</label>
                <input class="form-control bg-light" :value="calculateAge(applicant.a_birthdate)" readonly />
              </div>
              <div class="col-md-6">
                <label>เพศ</label>
                <input class="form-control bg-light" :value="applicant.a_gender" readonly />
              </div>

              <div class="col-12">
                <label>แนะนำตัวเอง (Bio)</label>
                <textarea class="form-control" rows="2" :value="applicant.a_bio" readonly></textarea>
              </div>

              <div class="col-12">
                <label>Portfolio</label>
                <ul class="list-unstyled bg-light rounded p-3">
                  <li v-for="item in portfolios" :key="item.portfolio_id">
                    <a :href="item.portfolio_url" target="_blank">{{ item.portfolio_url }}</a>
                  </li>
                </ul>
              </div>

              <div class="col-12">
                <label>ทักษะ (Skills)</label>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="s in skills" :key="s.skill_id" class="badge bg-success px-3 py-2">
                    {{ s.skill_name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> <!-- card -->

      <div v-else class="text-center text-muted py-5">
        กำลังโหลดข้อมูลผู้สมัคร...
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";
import DefaultImage from "@/assets/default-profile.png";

export default {
  components: { NavbarEmployer },
  data() {
    return {
      applicant: null,
      skills: [],
      portfolios: [],
      profileImage: null,
      defaultImage: DefaultImage,
    };
  },
  mounted() {
    const applicant_id = this.$route.params.id;
    if (applicant_id) {
      this.fetchProfile(applicant_id);
    }
  },
  methods: {
    async fetchProfile(applicant_id) {
      try {
        const res = await axios.get(`http://localhost:3001/api/applicants/${applicant_id}`);
        this.applicant = res.data.user;
        this.skills = res.data.skills;
        this.portfolios = res.data.portfolios;
        if (this.applicant.profile_img_url) {
          this.profileImage = `http://localhost:3001${this.applicant.profile_img_url}`;
        }
      } catch (err) {
        console.error("❌ โหลดโปรไฟล์ผิดพลาด:", err);
      }
    },
    calculateAge(birthdate) {
      const b = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - b.getFullYear();
      const m = today.getMonth() - b.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
      return isNaN(age) ? "-" : `${age} ปี`;
    },
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
</style>
