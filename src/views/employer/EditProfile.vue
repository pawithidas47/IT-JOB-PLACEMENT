<template> 
  <div>
    <NavbarEmployer />
    <div class="container py-5" style="max-width: 700px">
      <h4 class="fw-bold text-orange mb-4">
        <i class="bi bi-pencil-square me-2"></i> แก้ไขโปรไฟล์ผู้ว่าจ้าง
      </h4>

      <div class="text-center mb-4">
        <img
          :src="tempPreview || imageUrl"
          class="rounded-circle border"
          style="width:130px;height:130px;object-fit:cover"
          alt="โปรไฟล์"
        />
        <div class="mt-2">
          <input type="file" @change="onPickImage" accept="image/*" />
        </div>
      </div>

      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">ชื่อบริษัท</label>
          <input type="text" v-model="tempForm.e_company_name" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">ผู้ติดต่อ</label>
          <input type="text" v-model="tempForm.e_contact" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">ตำแหน่งผู้ติดต่อ</label>
          <input type="text" v-model="tempForm.e_position" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">อีเมล</label>
          <input type="email" v-model="tempForm.e_email" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">เบอร์โทรศัพท์</label>
          <input type="text" v-model="tempForm.e_phone" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">ประเภทผู้ว่าจ้าง</label>
          <select v-model="tempForm.e_type" class="form-select">
            <option value="บริษัท">บริษัท</option>
            <option value="ร้านค้า">ร้านค้า</option>
            <option value="บุคคลทั่วไป">บุคคลทั่วไป</option>
            <option value="สถาบันศึกษา">สถาบันศึกษา</option>
            <option value="องค์กรไม่แสวงหากำไร">องค์กรไม่แสวงหากำไร</option>
          </select>
        </div>

        <div class="d-flex gap-2">
          <button type="button" class="btn btn-outline-secondary w-50" @click="cancelEdit">
            ✖️ ยกเลิกการแก้ไข
          </button>
          <button type="submit" class="btn btn-orange w-50">
            💾 บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import NavbarEmployer from "@/components/NavbarEmployer.vue";
import axios from "axios";
import defaultProfile from "@/assets/default-profile.png";

const BASE = "http://localhost:3001";

export default {
  components: { NavbarEmployer },
  data() {
    return {
      // ค่าที่บันทึกจริงจาก DB
      form: {
        e_company_name: "",
        e_contact: "",
        e_position: "",
        e_email: "",
        e_phone: "",
        e_type: "",
      },
      // ค่าที่กำลังแก้
      tempForm: {
        e_company_name: "",
        e_contact: "",
        e_position: "",
        e_email: "",
        e_phone: "",
        e_type: "",
      },
      employerId: null,

      imageUrl: defaultProfile, // รูปที่บันทึกแล้ว
      tempImage: null,          // ไฟล์ใหม่
      tempPreview: null,        // พรีวิวไฟล์ใหม่
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
        const { data } = await axios.get(`${BASE}/api/employer/${this.employerId}`);

        this.form = {
          e_company_name: data.e_company_name || "",
          e_contact     : data.e_contact      || "",
          e_position    : data.e_position     || "",
          e_email       : data.e_email        || "",
          e_phone       : data.e_phone        || "",
          e_type        : data.e_type         || "",
        };
        this.tempForm = JSON.parse(JSON.stringify(this.form));
        this.imageUrl = data.profile_img_url ? `${BASE}${data.profile_img_url}` : defaultProfile;
        this.tempImage = null;
        this.tempPreview = null;
      } catch (err) {
        console.error("❌ โหลดโปรไฟล์ล้มเหลว:", err);
      }
    },

    onPickImage(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      this.tempImage = file;
      this.tempPreview = URL.createObjectURL(file);
    },

    async submitForm() {
      try {
        // 1) อัปเดตข้อมูลตัวหนังสือ
        await axios.put(`${BASE}/api/employer/${this.employerId}`, this.tempForm);

        // 2) อัปโหลดไฟล์รูปหากมี
        if (this.tempImage) {
          const fd = new FormData();
          fd.append("profile", this.tempImage);
          const res = await axios.post(`${BASE}/api/upload-profile-employer/${this.employerId}`, fd);
          if (res.data?.url) this.imageUrl = `${BASE}${res.data.url}?v=${Date.now()}`;
        }

        // 3) sync temp -> form และอัปเดต localStorage (หลังบันทึกเท่านั้น)
        this.form = JSON.parse(JSON.stringify(this.tempForm));
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        u.e_company_name = this.form.e_company_name;
        localStorage.setItem("user", JSON.stringify(u));

        this.tempImage = null;
        this.tempPreview = null;

        alert("✅ บันทึกโปรไฟล์สำเร็จ");
        this.$router.push("/employer/profile");
      } catch (err) {
        console.error("❌ อัปเดตโปรไฟล์ล้มเหลว:", err);
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    },

    cancelEdit() {
      // ❌ ไม่เรียก API — รีเซ็ตทุกอย่างเป็นค่าที่บันทึกล่าสุด
      this.tempForm = JSON.parse(JSON.stringify(this.form));
      this.tempImage = null;
      this.tempPreview = null;

      // กันเหนียว: คืนค่าที่หน้าอื่นอาจอ่านจาก localStorage
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      u.e_company_name = this.form.e_company_name;
      localStorage.setItem("user", JSON.stringify(u));

      this.$router.push("/employer/profile");
    },
  },
};
</script>

<style scoped>
.text-orange { color:#ff6600; }
.btn-orange { background:#ff6600; color:#fff; font-weight:500; }
.btn-orange:hover { background:#e65c00; }
</style>
