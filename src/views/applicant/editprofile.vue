<template>
  <div>
    <NavbarApplicant />
    <div class="container py-5">
      <div class="text-center mb-4">
        <h2 class="fw-bold text-orange">
          <i class="bi bi-person-circle me-2"></i> แก้ไขโปรไฟล์
        </h2>
      </div>

      <div class="card shadow rounded-4 p-4 bg-white">
        <div class="row g-4">
          <!-- รูปภาพและข้อมูลติดต่อ -->
          <div class="col-md-3 d-flex flex-column align-items-center">
            <img :src="profileImage || defaultImage" class="rounded shadow border mb-3"
              style="width: 100%; max-width: 240px; height: 320px; object-fit: cover" alt="profile" />
            <input type="file" @change="onImageChange" class="form-control" />
            <div class="w-100 border-top pt-3 mt-2">
              <h6 class="fw-bold text-center">ข้อมูลติดต่อ</h6>
              <div class="mb-2">
                <label class="form-label small text-muted">เบอร์โทรศัพท์</label>
                <input v-model="user.a_phone" class="form-control form-control-sm" />
              </div>
              <div class="mb-2">
                <label class="form-label small text-muted">อีเมล</label>
                <input v-model="user.a_email" class="form-control form-control-sm" />
              </div>
              <div class="mb-2">
                <label class="form-label small text-muted">ช่องทางติดต่อเพิ่มเติม</label>
                <input v-model="user.a_contact" class="form-control form-control-sm" />
              </div>
            </div>
          </div>

          <!-- ข้อมูลทั่วไป -->
          <div class="col-md-9">
            <div class="row g-3 border-start ps-4">
              <div class="col-md-6">
                <label class="form-label">ชื่อ</label>
                <input v-model="user.a_firstname" class="form-control" disabled />
              </div>
              <div class="col-md-6">
                <label class="form-label">นามสกุล</label>
                <input v-model="user.a_lastname" class="form-control" disabled />
              </div>
              <div class="col-md-6">
                <label class="form-label">รหัสนิสิต</label>
                <input v-model="user.a_studentid" class="form-control" disabled />
              </div>
              <div class="col-md-6">
                <label class="form-label">คณะ</label>
                <input v-model="user.a_faculty" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">อายุ</label>
                <input :value="calculateAge(user.a_birthdate)" class="form-control" disabled />
              </div>
              <div class="col-md-6">
                <label class="form-label">เพศ</label>
                <input :value="user.a_gender" class="form-control" disabled />
              </div>
              <div class="col-md-6">
                <label class="form-label">แนะนำตัวเอง (Bio)</label>
                <textarea v-model="user.a_bio" class="form-control" rows="4"></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label">ผลงาน (Portfolio)</label>
                <textarea v-model="newPortfolioUrl" class="form-control" rows="4"></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">ทักษะและเครื่องมือ (Skills & Tools)</label>
                <input v-model="newSkillsText" class="form-control" placeholder="เช่น HTML, CSS, JS" />
              </div>
            </div>
            <div class="text-end mt-4">
              <button @click="saveProfile" class="btn btn-success px-4 py-2 rounded-pill">
                💾 บันทึกข้อมูล
              </button>
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
  name: "EditUserProfile",
  components: { NavbarApplicant },
  data() {
    return {
      user: {},
      profileImage: null,
      defaultImage: DefaultProfile,
      newSkillsText: "",
      newPortfolioUrl: "",
    };
  },
  mounted() {
    const id = localStorage.getItem("user_id");
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
      const res = await axios.get(`${BASE_URL}/api/applicant/${id}`);
      this.user = res.data.user;
      if (res.data.user.profile_img_url) {
        this.profileImage = `${BASE_URL}${res.data.user.profile_img_url}`;
      }
      this.newSkillsText = res.data.skills.map(s => s.skill_name).join(", ");
      this.newPortfolioUrl = res.data.portfolios.map(p => p.portfolio_url).join("\n");
    },
    async onImageChange(e) {
      const file = e.target.files[0];
      const form = new FormData();
      form.append("image", file);
      const id = localStorage.getItem("user_id");
      const res = await axios.post(`${BASE_URL}/api/applicant/${id}/upload`, form);
      this.profileImage = `${BASE_URL}${res.data.url}`;
    },
    async saveProfile() {
      const id = localStorage.getItem("user_id");
      const skills = this.newSkillsText.split(",").map(s => s.trim()).filter(Boolean);
      const portfolios = this.newPortfolioUrl.split("\n").map(p => p.trim()).filter(Boolean);

      // แปลงวันเกิดให้ถูกต้อง (แยก T)
      const parsedDate = new Date(this.user.a_birthdate).toISOString().split("T")[0];

      const updateData = {
        a_firstname: this.user.a_firstname,
        a_lastname: this.user.a_lastname,
        a_faculty: this.user.a_faculty,
        a_gender: this.user.a_gender,
        a_birthdate: parsedDate,
        a_contact: this.user.a_contact,
        a_phone: this.user.a_phone,
        a_email: this.user.a_email,
      };

      try {
        await axios.put(`${BASE_URL}/api/applicant/${id}`, updateData);
        await axios.put(`${BASE_URL}/api/applicant/${id}/bio`, { a_bio: this.user.a_bio });
        await axios.put(`${BASE_URL}/api/applicant/${id}/skills`, { skills });

        await axios.delete(`${BASE_URL}/api/applicant/${id}/portfolio/all`);
        for (const url of portfolios) {
          await axios.post(`${BASE_URL}/api/applicant/${id}/portfolio`, { portfolio_url: url });
        }

        alert("✅ บันทึกโปรไฟล์เรียบร้อยแล้ว");
        this.$router.push("/applicant/userprofile");
      } catch (err) {
        console.error("❌ saveProfile error:", err);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    },
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
</style>
