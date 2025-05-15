<template>
  <div class="container mt-5">
    <h2>สมัครสมาชิกผู้ว่าจ้าง</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label>ชื่อผู้ใช้งาน</label>
        <input v-model="form.username" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>รหัสผ่าน</label>
        <input
          type="password"
          v-model="form.password"
          class="form-control"
          required
        />
      </div>
      <div class="row mb-3">
        <div class="col">
          <label>ชื่อ</label>
          <input v-model="form.firstname" class="form-control" required />
        </div>
        <div class="col">
          <label>นามสกุล</label>
          <input v-model="form.lastname" class="form-control" required />
        </div>
      </div>
      <div class="mb-3">
        <label>ประเภทผู้ว่าจ้าง</label>
        <select v-model="form.type" class="form-control" required>
          <option value="">กรุณาเลือกประเภท</option>
          <option value="บริษัท">บริษัท</option>
          <option value="คณะ/หน่วยงานในมหาวิทยาลัย">คณะ/หน่วยงาน</option>
          <option value="องค์กรภายนอก">องค์กรภายนอก</option>
        </select>
      </div>
      <div class="mb-3">
        <label>เบอร์โทรศัพท์</label>
        <input v-model="form.phone" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>อีเมล</label>
        <input
          type="email"
          v-model="form.email"
          class="form-control"
          required
        />
      </div>
      <button class="btn btn-warning w-100 text-white">สมัครสมาชิก</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterEmployer",
  data() {
    return {
      form: {
        username: "",
        password: "",
        firstname: "",
        lastname: "",
        type: "",
        phone: "",
        email: "",
      },
    };
  },
  methods: {
    submitForm() {
      axios
        .post("http://localhost:3001/api/auth/register/employer", {
          e_username: this.form.username,
          e_password: this.form.password,
          e_firstname: this.form.firstname,
          e_lastname: this.form.lastname,
          e_type: this.form.type,
          e_phone: this.form.phone,
          e_email: this.form.email,
        })
        .then(() => {
          alert("✅ สมัครสมาชิกผู้ว่าจ้างสำเร็จ");
          this.$router.push("/login");
        })
        .catch((err) => {
          console.error("❌ สมัครผู้ว่าจ้างไม่สำเร็จ:", err);
          alert("สมัครไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง");
        });
    },
  },
};
</script>
