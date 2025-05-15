<template>
  <div class="container mt-5">
    <h2>สมัครสมาชิกผู้สมัครงาน</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label>ชื่อผู้ใช้</label>
        <input v-model="form.a_username" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>รหัสผ่าน</label>
        <input
          type="password"
          v-model="form.a_password"
          class="form-control"
          required
        />
      </div>
      <div class="row mb-3">
        <div class="col">
          <label>ชื่อ</label>
          <input v-model="form.a_firstname" class="form-control" required />
        </div>
        <div class="col">
          <label>นามสกุล</label>
          <input v-model="form.a_lastname" class="form-control" required />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <label>รหัสนิสิต</label>
          <input v-model="form.a_studentid" class="form-control" required />
        </div>
        <div class="col">
          <label>วันเกิด</label>
          <input
            type="date"
            v-model="form.a_birthdate"
            class="form-control"
            required
          />
        </div>
        <div class="col">
          <label>เพศ</label>
          <select v-model="form.a_gender" class="form-control">
            <option value="">- เพศ -</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
            <option value="อื่น ๆ">อื่น ๆ</option>
          </select>
        </div>
      </div>
      <div class="mb-3">
        <label>คณะ</label>
        <select v-model="form.a_faculty" class="form-control">
          <option value="">------------ กรุณาเลือกคณะ ------------</option>
          <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
          <option value="วิศวกรรมศาสตร์">วิศวกรรมศาสตร์</option>
          <option value="มนุษยศาสตร์">มนุษยศาสตร์</option>
        </select>
      </div>
      <div class="mb-3">
        <label>เบอร์โทรศัพท์</label>
        <input v-model="form.a_phone" class="form-control" />
      </div>
      <div class="mb-3">
        <label>อีเมล</label>
        <input
          type="email"
          v-model="form.a_email"
          class="form-control"
          required
        />
      </div>
      <button class="btn btn-primary">สมัครสมาชิก</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterApplicant",
  data() {
    return {
      form: {
        a_username: "",
        a_password: "",
        a_firstname: "",
        a_lastname: "",
        a_studentid: "",
        a_faculty: "",
        a_birthdate: "",
        a_gender: "",
        a_email: "",
        a_phone: "",
      },
    };
  },
  methods: {
    submitForm() {
      axios
        .post("http://localhost:3001/api/auth/register/applicant", this.form)
        .then(() => {
          alert("✅ สมัครสมาชิกสำเร็จ");
          this.$router.push("/login");
        })
        .catch((err) => {
          console.error("❌ สมัครไม่สำเร็จ:", err);
          alert("เกิดข้อผิดพลาด กรุณาตรวจสอบข้อมูลอีกครั้ง");
        });
    },
  },
};
</script>
