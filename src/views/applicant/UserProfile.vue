<template>
  <div>
    <NavbarApplicant />
    <div class="container py-4">
      <h3 class="fw-bold mb-4 text-orange">
        <i class="bi bi-person-circle me-2"></i> โปรไฟล์ของคุณ
      </h3>
      <div class="card p-4 shadow-sm">
        <div class="text-center mb-3">
          <img v-if="profileImage" :src="profileImage" alt="Profile" class="rounded-circle"
            style="width: 150px; height: 150px; object-fit: cover;" />
          <img v-else :src="defaultImage" alt="Default Profile" class="rounded-circle"
            style="width: 150px; height: 150px; object-fit: cover;" />
          <input type="file" @change="onImageChange" class="form-control mt-2 w-auto mx-auto" />
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label fw-bold">ชื่อ-นามสกุล</label>
            <input :value="user.a_firstname + ' ' + user.a_lastname" class="form-control" disabled />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-bold">อีเมล</label>
            <input v-model="user.a_email" class="form-control" disabled />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-bold">เบอร์โทร</label>
            <input v-model="user.a_phone" class="form-control" disabled />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-bold">คณะ</label>
            <input v-model="user.a_faculty" class="form-control" disabled />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">แนะนำตัวเอง (Bio)</label>
          <textarea v-model="user.a_bio" class="form-control" rows="3"></textarea>
          <button class="btn btn-sm btn-primary mt-2" @click="updateBio">บันทึก</button>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">ผลงาน (Portfolio)</label>
          <ul>
            <li v-for="item in portfolios" :key="item.portfolio_id">
              <a :href="item.portfolio_url" target="_blank" class="link-primary text-decoration-underline">
                ลิงก์ที่ {{ item.portfolio_id }}
              </a>
            </li>
          </ul>
          <div class="input-group mt-2">
            <input v-model="newPortfolioUrl" type="text" class="form-control" placeholder="แนบลิงก์ผลงานใหม่" />
            <button class="btn btn-success" @click="addPortfolio">เพิ่ม</button>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">ทักษะ (Skills)</label>
          <textarea v-model="newSkillsText" class="form-control" rows="2"
            placeholder="ระบุทักษะแยกด้วย , เช่น HTML, CSS, JS"></textarea>
          <button class="btn btn-sm btn-primary mt-2" @click="updateSkills">บันทึก</button>
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
      newSkillsText: "",
      newPortfolioUrl: ""
    };
  },
  mounted() {
    const applicantId = localStorage.getItem("user_id");
    console.log("🧾 applicantId =", applicantId);
    if (applicantId) {
      this.fetchProfile(applicantId);
    }
  },
  methods: {
    async fetchProfile(id) {
      try {
        const res = await axios.get(`${BASE_URL}/api/applicant/${id}`);
        this.user = res.data.user;
        this.skills = res.data.skills;
        this.portfolios = res.data.portfolios;
        if (res.data.user.profile_img_url) {
          this.profileImage = `${BASE_URL}${res.data.user.profile_img_url}`;
        }
        this.newSkillsText = this.skills.map(s => s.skill_name).join(", ");
      } catch (err) {
        console.error("❌ fetchProfile failed", err);
      }
    },
    async onImageChange(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      const applicantId = localStorage.getItem("user_id");
      const res = await axios.post(`${BASE_URL}/api/applicant/${applicantId}/upload`, formData);
      this.profileImage = `${BASE_URL}${res.data.url}`;
    },
    async updateBio() {
      try {
        const id = localStorage.getItem("user_id");
        await axios.put(`${BASE_URL}/api/applicant/${id}/bio`, {
          a_bio: this.user.a_bio,
        });
        alert("✅ บันทึกเรียบร้อยแล้ว");
      } catch (err) {
        console.error("❌ updateBio failed", err);
      }
    },
    async updateSkills() {
      const id = localStorage.getItem("user_id");
      const skills = this.newSkillsText.split(",").map(s => s.trim()).filter(s => s);

      try {
        await axios.put(`${BASE_URL}/api/applicant/${id}/skills`, { skills });
        alert("✅ บันทึกทักษะเรียบร้อย");
        this.fetchProfile(id);
      } catch (err) {
        console.error("❌ updateSkills failed", err);
        alert("เกิดข้อผิดพลาด");
      }
    },
    async addPortfolio() {
      if (!this.newPortfolioUrl.trim()) return;
      const applicantId = localStorage.getItem("user_id");
      try {
        await axios.post(`${BASE_URL}/api/applicant/${applicantId}/portfolio`, {
          portfolio_url: this.newPortfolioUrl,
        });
        this.newPortfolioUrl = "";
        this.fetchProfile(applicantId);
      } catch (err) {
        console.error("❌ addPortfolio failed", err);
        alert("ไม่สามารถเพิ่มลิงก์ได้");
      }
    }
  }
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
</style>
