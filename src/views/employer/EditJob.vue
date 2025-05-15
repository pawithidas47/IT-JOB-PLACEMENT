<template>
  <div class="container mt-5" style="max-width: 600px">
    <h3 class="mb-4">แก้ไขงาน</h3>
    <form @submit.prevent="submitEdit">
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
        <select v-model="job.j_type" class="form-control" required>
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
      <button class="btn btn-warning text-white w-100">บันทึกการแก้ไข</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditJob",
  data() {
    return {
      job: {
        j_title: "",
        j_description: "",
        j_type: "",
        j_salary: null,
        j_appdeadline: "",
      },
    };
  },
  mounted() {
    // ดึง id งานจาก params ของ route
    const jobId = this.$route.params.id;
    this.fetchJob(jobId);
  },
  methods: {
    fetchJob(id) {
      axios
        .get(`http://localhost:3001/api/jobs/${id}`)
        .then((res) => {
          this.job = res.data;
        })
        .catch((err) => {
          console.error("ดึงข้อมูลงานล้มเหลว:", err);
          alert("ไม่สามารถโหลดข้อมูลงานได้");
          this.$router.push("/employer/dashboard");
        });
    },
    submitEdit() {
      const jobId = this.$route.params.id;
      axios
        .put(`http://localhost:3001/api/jobs/${jobId}`, this.job)
        .then(() => {
          alert("บันทึกการแก้ไขสำเร็จ");
          this.$router.push("/employer/dashboard");
        })
        .catch((err) => {
          console.error("แก้ไขงานล้มเหลว:", err);
          alert("เกิดข้อผิดพลาดในการแก้ไขงาน");
        });
    },
  },
};
</script>
