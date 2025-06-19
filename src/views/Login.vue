// ===== FRONTEND: Login.vue =====
<template>
  <div>
    <NavbarHome />
    <div class="d-flex justify-content-center align-items-center py-5" style="background-color: #f7f8fa; min-height: calc(100vh - 80px);">
      <div class="card p-4 shadow-sm border-0 rounded-4" style="max-width: 420px; width: 100%;">
        <div class="role-toggle-wrapper position-relative">
          <div class="slider-bg" :class="{ right: role === 'employer' }"></div>
          <button class="role-tab z-1" :class="{ active: role === 'applicant' }" @click="role = 'applicant'">ผู้สมัครงาน</button>
          <button class="role-tab z-1" :class="{ active: role === 'employer' }" @click="role = 'employer'">ผู้ว่าจ้าง</button>
        </div>

        <h5 class="text-center fw-bold mb-4 mt-4">เข้าสู่ระบบ</h5>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">ชื่อผู้ใช้งาน</label>
            <input v-model="username" type="text" class="form-control rounded-3" placeholder="เช่น mornor01" required />
          </div>

          <div class="mb-3">
            <label class="form-label">รหัสผ่าน</label>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control rounded-3" placeholder="กรอกรหัสผ่าน" required />
            <div class="form-check mt-2">
              <input type="checkbox" v-model="showPassword" class="form-check-input" id="showPassword" />
              <label for="showPassword" class="form-check-label">แสดงรหัสผ่าน</label>
            </div>
          </div>

          <button type="submit" class="btn btn-orange w-100 py-2 fw-bold rounded-3 mt-2">เข้าสู่ระบบ</button>

          <p class="text-center mt-3">
            ยังไม่มีบัญชี?
            <router-link :to="registerLink" class="text-orange fw-bold text-decoration-none">
              สมัครสมาชิก
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
  name: "LoginPage",
  components: { NavbarHome },
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      role: "applicant", // applicant | employer
    };
  },
  computed: {
    registerLink() {
      return this.role === "applicant" ? "/register/applicant" : "/register/employer";
    },
  },
  methods: {
    handleLogin() {
      const url =
        this.role === "applicant"
          ? "http://localhost:3001/api/auth/login"
          : "http://localhost:3001/api/auth/employer/login";

      axios
        .post(url, {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          const user = res.data.user;
          const idKey = this.role === "applicant" ? "applicant_id" : "employer_id";

          if (!user || !user[idKey]) {
            console.warn("❌ Login response ไม่มีข้อมูล id:", user);
            return;
          }

          localStorage.setItem("user_id", user[idKey]);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("user_role", this.role); // เพิ่ม role ด้วย

          Swal.fire({
            title: "✅ เข้าสู่ระบบสำเร็จ!",
            text: "ยินดีต้อนรับเข้าสู่ระบบ",
            icon: "success",
            iconColor: "#10b981",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            background: "#ffffff",
            color: "#333",
            customClass: {
              popup: "rounded-4 animated-popup shadow",
              title: "fw-bold fs-5",
              htmlContainer: "fs-6",
            },
            willClose: () => {
              this.$router.push(
                this.role === "applicant"
                  ? "/applicant/jobs"
                  : "/employer/dashboard"
              );
            },
          });
        })
        .catch((err) => {
          console.error("❌ Login failed:", err);
          Swal.fire({
            icon: "error",
            title: "เข้าสู่ระบบไม่สำเร็จ",
            text: "กรุณาตรวจสอบชื่อผู้ใช้หรือรหัสผ่าน",
            confirmButtonColor: "#ff6600",
          });
        });
    },
  },
};
</script>


<style scoped>
.role-toggle-wrapper {
  background: #f3f3f3;
  border-radius: 16px;
  display: flex;
  position: relative;
  height: 44px;
  overflow: hidden;
}
.role-tab {
  flex: 1;
  z-index: 1;
  border: none;
  background: transparent;
  font-weight: 500;
  font-size: 0.95rem;
  color: #555;
  transition: color 0.2s ease;
}
.role-tab.active {
  color: white;
  font-weight: 600;
}
.slider-bg {
  position: absolute;
  width: 50%;
  height: 100%;
  background-color: #ff6600;
  border-radius: 16px;
  transition: transform 0.3s ease;
  z-index: 0;
  top: 0;
  left: 0;
}
.slider-bg.right {
  transform: translateX(100%);
}
.btn-orange {
  background-color: #ff6600;
  border: none;
  transition: 0.2s ease-in-out;
  color: white;
}
.btn-orange:hover {
  background-color: #e65c00;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.25);
}
.text-orange {
  color: #ff6600;
}
input::placeholder {
  color: #bbb;
}
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
