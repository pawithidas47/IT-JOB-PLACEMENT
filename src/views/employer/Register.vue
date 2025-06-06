<template>
  <div>
    <NavbarHome />
    <div
      class="d-flex justify-content-center align-items-center py-5 px-3"
      style="background-color: #f7f8fa; min-height: calc(100vh - 80px);"
    >
      <div class="card p-5 shadow-lg border-0 rounded-4 w-100" style="max-width: 540px;">
        <div class="text-center mb-4">
          <h4 class="fw-bold mb-0 text-orange">สมัครสมาชิกผู้ว่าจ้าง</h4>
        </div>

        <form @submit.prevent="submitForm" class="needs-validation">
          <div class="mb-3">
            <label class="form-label">ชื่อผู้ใช้งาน<span class="text-danger"> *</span></label>
            <input v-model.trim="form.username" class="form-control rounded-3" required placeholder="ชื่อผู้ใช้" />
          </div>

          <div class="mb-3">
            <label class="form-label">รหัสผ่าน<span class="text-danger"> *</span></label>
            <input type="password" v-model.trim="form.password" class="form-control rounded-3" placeholder="รหัสผ่าน" required />
          </div>

          <div class="mb-3">
            <label class="form-label">ยืนยันรหัสผ่าน<span class="text-danger"> *</span></label>
            <input type="password" v-model.trim="form.confirm_password" class="form-control rounded-3" placeholder="กรอกรหัสผ่านอีกครั้ง" required />
          </div>

          <div class="row mb-3">
            <div class="col">
              <label class="form-label">ชื่อ<span class="text-danger"> *</span></label>
              <input v-model.trim="form.firstname" class="form-control rounded-3" placeholder="ชื่อจริง" required />
            </div>
            <div class="col">
              <label class="form-label">นามสกุล<span class="text-danger"> *</span></label>
              <input v-model.trim="form.lastname" class="form-control rounded-3" placeholder="นามสกุล" required />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">ประเภทผู้ว่าจ้าง<span class="text-danger"> *</span></label>
            <select v-model="form.type" class="form-select rounded-3 text-start" required>
              <option disabled value="" style="text-align: center;">--------------- กรุณาเลือกประเภท ---------------</option>
              <option value="บริษัท">บริษัท</option>
              <option value="ร้านค้า">ร้านค้า</option>
              <option value="หน่วยงานภาครัฐ">หน่วยงานภาครัฐ</option>
              <option value="องค์กรไม่แสวงหากำไร">องค์กรไม่แสวงหากำไร</option>
              <option value="บุคคลทั่วไป">บุคคลทั่วไป</option>
              <option value="นักศึกษา">นักศึกษา</option>
              <option value="สตาร์ทอัป">สตาร์ทอัป</option>
              <option value="ฟรีแลนซ์">ฟรีแลนซ์</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">เบอร์โทรศัพท์<span class="text-danger"> *</span></label>
            <input v-model.trim="form.phone" class="form-control rounded-3" placeholder="0812345678" required />
          </div>

          <div class="mb-4">
            <label class="form-label">อีเมล<span class="text-danger"> *</span></label>
            <input type="email" v-model.trim="form.email" class="form-control rounded-3" placeholder="example@email.com" required />
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
import Swal from "sweetalert2";

export default {
  name: "RegisterEmployer",
  components: { NavbarHome },
  data() {
    return {
      form: {
        username: "",
        password: "",
        confirm_password: "",
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
      const { username, password, confirm_password, firstname, lastname, type, phone, email } = this.form;

      if (!username || !password || !confirm_password || !firstname || !lastname || !type || !phone || !email) {
        Swal.fire({
          icon: 'error',
          title: 'กรอกข้อมูลไม่ครบ',
          text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
          confirmButtonColor: '#ff6600'
        });
        return;
      }

      if (password !== confirm_password) {
        Swal.fire({
          icon: 'error',
          title: 'รหัสผ่านไม่ตรงกัน',
          text: 'โปรดตรวจสอบรหัสผ่านอีกครั้ง',
          confirmButtonColor: '#ff6600'
        });
        return;
      }

      axios
        .post("http://localhost:3001/api/auth/register/employer", {
          e_username: username,
          e_password: password,
          e_firstname: firstname,
          e_lastname: lastname,
          e_type: type,
          e_phone: phone,
          e_email: email,
        })
        .then(() => {
          Swal.fire({
            title: '✅ สมัครสมาชิกสำเร็จ!',
            text: 'ยินดีต้อนรับผู้ว่าจ้างเข้าสู่ระบบ',
            icon: 'success',
            iconColor: '#10b981',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            background: '#ffffff',
            color: '#333',
            customClass: {
              popup: 'rounded-4 animated-popup shadow',
              title: 'fw-bold fs-5',
              htmlContainer: 'fs-6',
            },
            willClose: () => {
              this.$router.push("/login");
            }
          });
        })
        .catch((err) => {
          console.error("❌ สมัครผู้ว่าจ้างไม่สำเร็จ:", err);
          Swal.fire({
            icon: 'error',
            title: 'สมัครไม่สำเร็จ',
            text: 'กรุณาตรวจสอบข้อมูลอีกครั้ง',
            confirmButtonColor: '#ff6600'
          });
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
  color: #cacaca;
}

/* Animation */
.swal2-popup.animated-popup {
  animation: popScale 0.4s ease-out;
}
@keyframes popScale {
  0% {
    transform: scale(0.85);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
