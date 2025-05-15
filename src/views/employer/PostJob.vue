<template>
  <div class="container mt-5" style="max-width: 600px">
    <h3 class="mb-4">📌 โพสต์งานใหม่</h3>
    <form @submit.prevent="submitJob">
      <div class="mb-3">
        <label>ชื่องาน</label>
        <input v-model="job.j_title" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>รายละเอียดงาน</label>
        <textarea v-model="job.j_description" class="form-control" rows="4" required></textarea>
      </div>
      <div class="mb-3">
        <label>ประเภทงาน</label>
        <select v-model="job.j_type" class="form-control">
          <option value="">-- เลือกประเภท --</option>
          <option value="part-time">งานพาร์ทไทม์</option>
          <option value="freelance">งานฟรีแลนซ์</option>
        </select>
      </div>
      <div class="mb-3">
        <label>ค่าจ้าง</label>
        <input v-model.number="job.j_salary" type="number" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>วันปิดรับสมัคร</label>
        <input v-model="job.j_appdeadline" type="date" class="form-control" required />
      </div>
      <button class="btn btn-warning text-white w-100">โพสต์งาน</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PostJob",
  data() {
    return {
      job: {
        j_title: "",
        j_description: "",
        j_type: "part-time",
        j_salary: null,
        j_appdeadline: ""
      },
      user: null
    };
  },
  mounted() {
    const userData = localStorage.getItem("user");
    if (!userData) return this.$router.push("/login");
    this.user = JSON.parse(userData);
  },
  methods: {
    submitJob() {
      if (!this.user?.employer_id) return alert("ไม่พบข้อมูลผู้ว่าจ้าง");
      const payload = {
        ...this.job,
        employer_id: this.user.employer_id
      };

      axios
        .post("http://localhost:3001/api/jobs", payload)
        .then(() => {
          alert("✅ โพสต์งานสำเร็จ");
          this.$router.push("/employer/dashboard");
        })
        .catch((err) => {
          console.error("❌ โพสต์งานล้มเหลว:", err);
          alert("เกิดข้อผิดพลาดในการโพสต์งาน");
        });
    }
  }
};
</script>
