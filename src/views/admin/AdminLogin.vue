<template>
  <div class="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="login-box shadow rounded-4 p-4 bg-white" style="width: 100%; max-width: 400px">
      <h3 class="fw-bold text-center mb-4 text-orange">
        <i class="bi bi-person-fill-lock me-2"></i> เข้าสู่ระบบแอดมิน
      </h3>

      <div class="mb-3">
        <label class="form-label">ชื่อผู้ใช้</label>
        <div class="input-group">
          <span class="input-group-text bg-white"><i class="bi bi-person-fill text-orange"></i></span>
          <input
            v-model="username"
            type="text"
            class="form-control"
            placeholder="กรอกชื่อผู้ใช้"
          />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">รหัสผ่าน</label>
        <div class="input-group">
          <span class="input-group-text bg-white"><i class="bi bi-lock-fill text-orange"></i></span>
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="กรอกรหัสผ่าน"
          />
        </div>
      </div>

      <div class="d-grid">
        <button @click="login" class="btn btn-orange" :disabled="loading">
          <span v-if="loading">
            <i class="spinner-border spinner-border-sm me-2"></i> กำลังเข้าสู่ระบบ...
          </span>
          <span v-else>
            <i class="bi bi-box-arrow-in-right me-1"></i> เข้าสู่ระบบ
          </span>
        </button>
      </div>

      <p class="text-danger mt-3" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminLogin",
  data() {
    return {
      username: "",
      password: "",
      error: "",
      loading: false,
    };
  },
  methods: {
    async login() {
      this.error = "";
      this.loading = true;
      try {
        const res = await fetch("http://localhost:3001/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const data = await res.json();
        console.log("📦 ตอบกลับจากเซิร์ฟเวอร์:", data);

        if (!res.ok) throw new Error(data.message);

        // ✅ บันทึก token
        localStorage.setItem("admin_token", data.token);

        // ✅ เด้งไปหน้าแดชบอร์ด
        this.$router.push("/admin/dashboard");
      } catch (err) {
        this.error = err.message || "เกิดข้อผิดพลาด";
      } finally {
        this.loading = false;
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
  border-color: #ff6600;
  color: white;
  font-weight: 500;
}
.btn-orange:hover {
  background-color: #e65c00;
  border-color: #e65c00;
}
.login-box {
  animation: fadeIn 0.4s ease-in-out;
  border: 1px solid #f3f3f3;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
