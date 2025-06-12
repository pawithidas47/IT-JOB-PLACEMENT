<template>
  <div>
    <NavbarApplicant />
    <div class="container py-5">
      <div class="text-center mb-4">
        <h2 class="fw-bold text-orange">
          <i class="bi bi-pencil-square me-2"></i> แก้ไขโปรไฟล์
        </h2>
      </div>

      <div class="card p-4 shadow border-0 rounded-4 bg-white">
        <div class="row g-3">
          <div class="col-md-4 text-center">
            <img
              :src="profileImage || defaultImage"
              alt="Profile"
              class="rounded-circle shadow-sm border mb-3"
              style="width: 150px; height: 150px; object-fit: cover"
            />
            <input type="file" @change="onImageChange" class="form-control" />
          </div>

          <div class="col-md-8">
            <div class="mb-3">
              <label class="form-label fw-bold">อีเมล</label>
              <input v-model="user.a_email" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">เบอร์โทร</label>
              <input v-model="user.a_phone" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">คณะ</label>
              <input v-model="user.a_faculty" class="form-control" />
            </div>
          </div>
        </div>

        <div class="mt-4">
          <label class="form-label fw-semibold">แนะนำตัวเอง</label>
          <textarea v-model="user.a_bio" class="form-control" rows="3"></textarea>
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-primary" @click="saveProfile">บันทึก</button>
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
  name: "EditProfile",
  components: { NavbarApplicant },
  data() {
    return {
      user: {},
      profileImage: null,
      defaultImage: DefaultProfile,
    };
  },
  mounted() {
    const id = localStorage.getItem("user_id");
    if (id) this.fetchProfile(id);
  },
  methods: {
    async fetchProfile(id) {
      try {
        const res = await axios.get(`${BASE_URL}/api/applicant/${id}`);
        this.user = res.data.user;
        if (res.data.user.profile_img_url) {
          this.profileImage = `${BASE_URL}${res.data.user.profile_img_url}`;
        }
      } catch (err) {
        console.error("❌ fetchProfile failed", err);
      }
    },
    async onImageChange(e) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const id = localStorage.getItem("user_id");

      try {
        const res = await axios.post(`${BASE_URL}/api/applicant/${id}/upload`, formData);
        this.profileImage = `${BASE_URL}${res.data.url}`;
      } catch (err) {
        console.error("❌ upload failed", err);
      }
    },
    async saveProfile() {
      const id = localStorage.getItem("user_id");
      try {
        await axios.put(`${BASE_URL}/api/applicant/${id}/bio`, {
          a_bio: this.user.a_bio,
        });
        alert("บันทึกเรียบร้อยแล้ว");
        this.$router.push("/applicant/userprofile");
      } catch (err) {
        console.error("❌ saveProfile failed", err);
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
