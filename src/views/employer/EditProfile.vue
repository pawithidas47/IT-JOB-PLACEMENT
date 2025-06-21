<template>
  <div>
    <NavbarEmployer />
    <div class="container py-5" style="max-width: 700px">
      <h4 class="fw-bold text-orange mb-4">
        <i class="bi bi-pencil-square me-2"></i> แก้ไขโปรไฟล์ผู้ว่าจ้าง
      </h4>

      <div class="text-center mb-4">
        <img
          :src="preview || imageUrl"
          class="rounded-circle border"
          style="width: 130px; height: 130px; object-fit: cover"
          alt="โปรไฟล์"
        />
        <div class="mt-2">
          <input type="file" @change="handleImageUpload" accept="image/*" />
        </div>
      </div>

      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">ชื่อ</label>
          <input type="text" v-model="form.e_firstname" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">นามสกุล</label>
          <input type="text" v-model="form.e_lastname" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">อีเมล</label>
          <input type="email" v-model="form.e_email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">เบอร์โทรศัพท์</label>
          <input type="text" v-model="form.e_phone" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">ประเภทผู้ว่าจ้าง</label>
          <select v-model="form.e_type" class="form-select">
            <option value="บริษัท">บริษัท</option>
            <option value="ร้านค้า">ร้านค้า</option>
            <option value="บุคคลทั่วไป">บุคคลทั่วไป</option>
            <option value="สถาบันศึกษา">สถาบันศึกษา</option>
            <option value="องค์กรไม่แสวงหากำไร">องค์กรไม่แสวงหากำไร</option>
          </select>
        </div>

        <button type="submit" class="btn btn-orange w-100">
          💾 บันทึกการเปลี่ยนแปลง
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import NavbarEmployer from "@/components/NavbarEmployer.vue";
import axios from "axios";
import defaultProfile from "@/assets/default-profile.png";

export default {
  components: { NavbarEmployer },
  data() {
    return {
      form: {
        e_firstname: "",
        e_lastname: "",
        e_email: "",
        e_phone: "",
        e_type: "",
      },
      imageFile: null,
      preview: null,
      imageUrl: defaultProfile,
      employerId: null,
    };
  },
  async mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return this.$router.push("/login");
    this.employerId = user.employer_id;
    await this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const res = await axios.get(`http://localhost:3001/api/employer/${this.employerId}`);
        this.form = { ...res.data };
        this.imageUrl = res.data.profile_img_url
          ? `http://localhost:3001${res.data.profile_img_url}`
          : defaultProfile;
      } catch (err) {
        console.error("❌ โหลดโปรไฟล์ล้มเหลว:", err);
      }
    },
    handleImageUpload(event) {
      this.imageFile = event.target.files[0];
      this.preview = URL.createObjectURL(this.imageFile);
    },
    async submitForm() {
      try {
        await axios.put(`http://localhost:3001/api/employer/${this.employerId}`, this.form);

        if (this.imageFile) {
          const formData = new FormData();
          formData.append("profile", this.imageFile);
          await axios.post(
            `http://localhost:3001/api/upload-profile-employer/${this.employerId}`,
            formData
          );
        }

        alert("✅ บันทึกโปรไฟล์สำเร็จ");
        this.$router.push("/employer/profile");
      } catch (err) {
        console.error("❌ อัปเดตโปรไฟล์ล้มเหลว:", err);
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    },
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}

.btn-orange {
  background-color: #ff6600;
  color: white;
  font-weight: 500;
}

.btn-orange:hover {
  background-color: #e65c00;
}
</style>
