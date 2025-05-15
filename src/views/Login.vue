<template>
  <div class="container mt-5" style="max-width: 500px">
    <div class="d-flex mb-4">
      <button
        class="btn"
        :class="
          role === 'applicant'
            ? 'btn-warning text-white'
            : 'btn-outline-secondary'
        "
        @click="role = 'applicant'"
      >
        สำหรับผู้สมัครงาน
      </button>
      <button
        class="btn ms-2"
        :class="
          role === 'employer'
            ? 'btn-warning text-white'
            : 'btn-outline-secondary'
        "
        @click="role = 'employer'"
      >
        สำหรับผู้ว่าจ้าง
      </button>
    </div>

    <div class="card shadow p-4">
      <h2 class="text-center mb-4">เข้าสู่ระบบ</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">ชื่อผู้ใช้งาน</label>
          <input v-model="username" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">รหัสผ่าน</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            class="form-control"
            required
          />
          <div class="form-check mt-1">
            <input
              type="checkbox"
              v-model="showPassword"
              class="form-check-input"
              id="showPassword"
            />
            <label for="showPassword" class="form-check-label"
              >Show password</label
            >
          </div>
        </div>
        <button class="btn btn-warning w-100 text-white">Login</button>
        <p class="mt-3 text-center">
          ยังไม่มีบัญชี?
          <router-link :to="registerLink">สมัครสมาชิก</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      role: "applicant",
    };
  },
  computed: {
    registerLink() {
      return this.role === "applicant"
        ? "/register/applicant"
        : "/register/employer";
    },
  },
  methods: {
    handleLogin() {
      axios
        .post("http://localhost:3001/api/auth/login", {
          username: this.username,
          password: this.password,
          role: this.role,
        })
        .then((res) => {
          alert("✅ เข้าสู่ระบบสำเร็จ");
          const user = res.data.user;
          localStorage.setItem("user", JSON.stringify(user));
          if (this.role === "applicant") {
            this.$router.push("/applicant/dashboard");
          } else {
            this.$router.push("/employer/dashboard");
          }
        })
        .catch(() => {
          alert("❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        });
    },
  },
};
</script>

<style scoped>
.btn-warning {
  background-color: #ff6600;
  border: none;
}
</style>
