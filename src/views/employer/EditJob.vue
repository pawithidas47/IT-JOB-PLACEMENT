<template>
  <div class="container py-5" style="max-width: 700px;">
    <h4 class="fw-bold text-orange mb-4">
      <i class="bi bi-pencil-square me-2"></i> แก้ไขงาน
    </h4>
    <form @submit.prevent="submitEdit">
      <div class="mb-3">
        <label class="form-label fw-semibold">ชื่องาน</label>
        <input v-model="job.j_title" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold">รายละเอียดงาน</label>
        <textarea v-model="job.j_description" class="form-control" rows="5" required></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold">ประเภทงาน</label>
        <select v-model="job.j_type" class="form-select" required>
          <option disabled value="">-- กรุณาเลือกประเภท --</option>
          <option value="ออกแบบและมัลติมีเดีย">ออกแบบและมัลติมีเดีย</option>
          <option value="การตลาดดิจิทัล">การตลาดดิจิทัล</option>
          <option value="แอดมินเพจ / โซเชียลมีเดีย">แอดมินเพจ / โซเชียลมีเดีย</option>
          <option value="ตัดต่อวิดีโอ / คอนเทนต์">ตัดต่อวิดีโอ / คอนเทนต์</option>
          <option value="คีย์ข้อมูล / Data Entry">คีย์ข้อมูล / Data Entry</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold">ค่าจ้าง</label>
        <input v-model.number="job.j_salary" type="number" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold">วันปิดรับสมัคร</label>
        <input v-model="job.j_appdeadline" type="date" class="form-control" required />
      </div>
      <div class="text-end">
        <button class="btn btn-orange fw-bold px-4 py-2 rounded-pill shadow-sm">
          <i class="bi bi-check2-circle me-2"></i> บันทึกการแก้ไข
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditJob",
  data() {
    return {
      job: {}
    };
  },
  mounted() {
    const jobId = this.$route.params.id;
    this.fetchJob(jobId);
  },
  methods: {
    fetchJob(id) {
      axios.get(`http://localhost:3001/api/jobs/${id}`)
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
      axios.put(`http://localhost:3001/api/jobs/${jobId}`, this.job)
        .then(() => {
          alert("บันทึกการแก้ไขสำเร็จ");
          this.$router.push("/employer/dashboard");
        })
        .catch((err) => {
          console.error("แก้ไขงานล้มเหลว:", err);
          alert("เกิดข้อผิดพลาดในการแก้ไขงาน");
        });
    }
  }
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
.btn-orange {
  background-color: #ff6600;
  color: white;
}
.btn-orange:hover {
  background-color: #e65c00;
}
</style>
