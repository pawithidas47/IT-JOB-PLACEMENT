<template>
  <div>
    <NavbarHome />
    <div class="d-flex justify-content-center align-items-center py-5 px-3" style="background-color: #f7f8fa; min-height: calc(100vh - 80px);">
      <div class="card p-5 shadow-lg border-0 rounded-4 w-100" style="max-width: 540px;">
        <div class="text-center mb-4">
          <h4 class="fw-bold mb-0 text-orange">สมัครสมาชิกผู้สมัครงาน</h4>
        
        </div>

        <form @submit.prevent="submitForm" novalidate class="needs-validation">
          <div class="mb-3">
            <label class="form-label">ชื่อผู้ใช้งาน<span class="text-danger"> *</span></label>
            <input v-model.trim="form.a_username" class="form-control rounded-3" placeholder="ชื่อผู้ใช้" required />
          </div>

          <div class="mb-3">
            <label class="form-label">รหัสผ่าน<span class="text-danger"> *</span></label>
            <input type="password" v-model.trim="form.a_password" class="form-control rounded-3" placeholder="รหัสผ่าน" required />
          </div>

          <div class="mb-3">
            <label class="form-label">ยืนยันรหัสผ่าน<span class="text-danger"> *</span></label>
            <input type="password" v-model.trim="form.confirm_password" class="form-control rounded-3" placeholder="กรอกรหัสผ่านอีกครั้ง" required />
          </div>

          <div class="row mb-3">
            <div class="col">
              <label class="form-label">ชื่อ<span class="text-danger"> *</span></label>
              <input v-model.trim="form.a_firstname" class="form-control rounded-3" placeholder="ชื่อจริง" required />
            </div>
            <div class="col">
              <label class="form-label">นามสกุล<span class="text-danger"> *</span></label>
              <input v-model.trim="form.a_lastname" class="form-control rounded-3" placeholder="นามสกุล" required />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <label class="form-label">รหัสนิสิต<span class="text-danger"> *</span></label>
              <input v-model.trim="form.a_studentid" class="form-control rounded-3" placeholder="65123456" required />
            </div>
            <div class="col">
              <label class="form-label">วันเกิด<span class="text-danger"> *</span></label>
              <input type="date" v-model.trim="form.a_birthdate" class="form-control rounded-3" required />
            </div>
            <div class="col">
              <label class="form-label">เพศ<span class="text-danger"> *</span></label>
              <select v-model="form.a_gender" class="form-select rounded-3" required>
                <option value="" class="text-center">-- เพศ --</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="อื่น ๆ">อื่น ๆ</option>
              </select>
            </div>
          </div>

         <div class="mb-3">
            <label class="form-label">คณะ<span class="text-danger"> *</span></label>
            <select v-model="form.a_faculty" class="form-select rounded-3" required>
              <option value="" class="text-center">----------------- กรุณาเลือกคณะ -----------------</option>
              <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
<option value="วิศวกรรมศาสตร์">วิศวกรรมศาสตร์</option>
<option value="มนุษยศาสตร์">มนุษยศาสตร์</option>
<option value="เกษตรศาสตร์">เกษตรศาสตร์</option>
<option value="พยาบาลศาสตร์">พยาบาลศาสตร์</option>
<option value="สถาปัตยกรรมศาสตร์">สถาปัตยกรรมศาสตร์</option>
<option value="ศึกษาศาสตร์">ศึกษาศาสตร์</option>
<option value="เภสัชศาสตร์">เภสัชศาสตร์</option>
<option value="นิติศาสตร์">นิติศาสตร์</option>
<option value="บริหารธุรกิจ เศรษฐศาสตร์และการสื่อสาร">บริหารธุรกิจ เศรษฐศาสตร์และการสื่อสาร</option>
<option value="สาธารณสุขศาสตร์">สาธารณสุขศาสตร์</option>
<option value="วิทยาลัยการเมืองการปกครอง">วิทยาลัยการเมืองการปกครอง</option>
<option value="วิทยาลัยนิเทศศาสตร์">วิทยาลัยนิเทศศาสตร์</option>
<option value="วิทยาลัยพลังงานและสิ่งแวดล้อม">วิทยาลัยพลังงานและสิ่งแวดล้อม</option>
<option value="วิทยาลัยนานาชาติ">วิทยาลัยนานาชาติ</option>
<option value="วิทยาลัยทันตแพทยศาสตร์นานาชาติ">วิทยาลัยทันตแพทยศาสตร์นานาชาติ</option>
<option value="วิทยาลัยสหวิทยาการ">วิทยาลัยสหวิทยาการ</option>
<option value="คณะแพทยศาสตร์">แพทยศาสตร์</option>
<option value="คณะวิทยาศาสตร์การแพทย์">วิทยาศาสตร์การแพทย์</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">เบอร์โทรศัพท์<span class="text-danger"> *</span></label>
            <input v-model.trim="form.a_phone" class="form-control rounded-3" placeholder="0812345678" required />
          </div>

          <div class="mb-4">
            <label class="form-label">อีเมล<span class="text-danger"> *</span></label>
            <input type="email" v-model.trim="form.a_email" class="form-control rounded-3" placeholder="example@email.com" required />
          </div>

          <button type="submit" class="btn btn-orange w-100 fw-bold py-2 rounded-3 fs-6">
            สมัครสมาชิก
          </button>

          <p class="text-center mt-3 mb-0">
            เป็นสมาชิกอยู่แล้ว?
            <router-link to="/login" class="fw-bold text-decoration-none" style="color: #ff6600;">
              เข้าสู่ระบบ
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarHome from "@/components/NavbarHome.vue";

export default {
  name: "RegisterApplicant",
  components: { NavbarHome },
  data() {
    return {
      form: {
        a_username: "",
        a_password: "",
        confirm_password: "",
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
      const f = this.form;
      if (!f.a_username || !f.a_password || !f.confirm_password || !f.a_firstname || !f.a_lastname || !f.a_studentid || !f.a_faculty || !f.a_birthdate || !f.a_gender || !f.a_email || !f.a_phone) {
        alert("❌ กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return;
      }
      if (f.a_password !== f.confirm_password) {
        alert("❌ รหัสผ่านไม่ตรงกัน");
        return;
      }
      axios
        .post("http://localhost:3001/api/auth/register/applicant", f)
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

<style scoped>
.btn-orange {
  background-color: #ff6600;
  border: none;
  color: white;
  transition: 0.2s ease-in-out;
}

.btn-orange:hover {
  background-color: #e65c00;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.25);
}

input::placeholder {
  color: #bbb;
}
</style>
