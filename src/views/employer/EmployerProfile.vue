<template>
  <div>
    <NavbarEmployer />
    <div class="container py-5" style="max-width: 1000px">
      <h4 class="fw-bold text-orange mb-4">
        <i class="bi bi-person-lines-fill me-2"></i> โปรไฟล์ผู้ว่าจ้าง
      </h4>

      <!-- ข้อมูลผู้ว่าจ้าง -->
      <div class="card p-4 shadow rounded-4">
        <div class="row">
          <!-- รูปโปรไฟล์ -->
          <div class="col-md-3 text-center border-end pe-4">
            <img
              :src="profileImage || defaultProfile"
              class="img-fluid rounded shadow mb-3"
              style="max-height: 250px; object-fit: cover"
              alt="profile"
            />
          </div>

          <!-- ข้อมูล -->
          <div class="col-md-9 ps-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label>ชื่อผู้ใช้</label>
                <input class="form-control bg-light" :value="user.e_username" readonly />
              </div>
              <div class="col-md-6">
                <label>ชื่อ</label>
                <input class="form-control bg-light" :value="user.e_firstname" readonly />
              </div>
              <div class="col-md-6">
                <label>นามสกุล</label>
                <input class="form-control bg-light" :value="user.e_lastname" readonly />
              </div>
              <div class="col-md-6">
                <label>อีเมล</label>
                <input class="form-control bg-light" :value="user.e_email" readonly />
              </div>
              <div class="col-md-6">
                <label>เบอร์โทร</label>
                <input class="form-control bg-light" :value="user.e_phone" readonly />
              </div>
              <div class="col-md-6">
                <label>ประเภทผู้ว่าจ้าง</label>
                <input class="form-control bg-light" :value="user.e_type" readonly />
              </div>

              <!-- ปุ่มแก้ไขโปรไฟล์ -->
              <div class="col-12 text-end mt-4">
                <router-link
                  to="/employer/edit-profile"
                  class="btn btn-orange text-white px-4 py-2 rounded-pill"
                >
                  แก้ไขโปรไฟล์
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div> <!-- card -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";
import defaultProfile from "@/assets/default-profile.png";

export default {
  name: "EmployerProfile",
  components: { NavbarEmployer },
  data() {
    return {
      user: {},
      profileImage: null,
      defaultProfile: defaultProfile,
    };
  },
  mounted() {
    const userId = JSON.parse(localStorage.getItem("user_id"));
    this.fetchProfile(userId);
  },
  methods: {
    async fetchProfile(id) {
      try {
        const response = await axios.get(`http://localhost:3001/api/employer/${id}/profile`);
        this.user = response.data;
        if (response.data.profile_img_url) {
          this.profileImage = `http://localhost:3001${response.data.profile_img_url}`;
        }
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
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
