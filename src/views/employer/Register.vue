<template>
  <div>
    <NavbarHome />
    <div class="d-flex justify-content-center align-items-center py-5 px-3" style="background-color: #f7f8fa; min-height: calc(100vh - 80px);">
      <div class="card p-5 shadow-lg border-0 rounded-4 w-100" style="max-width: 480px;">
        <div class="text-center mb-4">
          <h4 class="fw-bold mb-0 text-orange">สมัครสมาชิกสำหรับผู้ว่าจ้าง</h4>
          <p class="text-muted small">ลงทะเบียนเพื่อใช้งานระบบ</p>
        </div>

        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="form-label">อีเมล</label>
            <input type="email" v-model="form.email" class="form-control rounded-3" required placeholder="เช่น example@company.com" />
          </div>

          <div class="mb-3">
            <label class="form-label">รหัสผ่าน</label>
            <input type="password" v-model="form.password" class="form-control rounded-3" required placeholder="รหัสผ่าน" />
          </div>

          <div class="mb-4">
            <label class="form-label">ยืนยันรหัสผ่าน</label>
            <input type="password" v-model="form.confirmPassword" class="form-control rounded-3" required placeholder="ยืนยันรหัสผ่าน" />
          </div>

          <button type="submit" class="btn btn-orange w-100 fw-bold py-2 rounded-3 fs-6">
            สมัครสมาชิก
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarHome from "@/components/NavbarHome.vue";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  name: "RegisterEmployer",
  components: { NavbarHome },
  data() {
    return {
      form: {
        email: "",
        password: "",
        confirmPassword: ""
      },
    };
  },
  methods: {
    submitForm() {
      if (this.form.password !== this.form.confirmPassword) {
        Swal.fire("รหัสผ่านไม่ตรงกัน", "โปรดยืนยันรหัสผ่านให้ถูกต้อง", "warning");
        return;
      }

      axios
        .post("http://localhost:3001/api/auth/register/employer", {
          e_email: this.form.email,
          e_password: this.form.password
        })
        .then(() => {
          Swal.fire("สมัครสมาชิกสำเร็จ", "กรุณาเข้าสู่ระบบ", "success");
          this.$router.push("/login");
        })
        .catch((err) => {
          console.error("❌ ไม่สามารถสมัครสมาชิกได้:", err);
          Swal.fire("เกิดข้อผิดพลาด", "อีเมลนี้อาจมีอยู่แล้ว", "error");
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
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.25);
}

input::placeholder {
  color: #cacaca;
}
</style>
