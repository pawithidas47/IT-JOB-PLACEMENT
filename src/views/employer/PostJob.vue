<template>
  <div class="container mt-5" style="max-width: 700px">
    <h3 class="mb-4">📌 โพสต์งานใหม่</h3>
    <form @submit.prevent="submitJob">
      <div class="mb-3">
        <label>ชื่องาน<span class="text-danger">*</span></label>
        <input v-model="job.j_title" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>รายละเอียดงานที่ต้องการให้ทำ <span class="text-danger">*</span></label>
        <textarea v-model="job.detail" class="form-control" rows="3" placeholder="อธิบายลักษณะงานโดยรวม เช่น ออกแบบโปสเตอร์สำหรับงานประชาสัมพันธ์ หรือทำโลโก้ร้านกาแฟสไตล์มินิมอล" required></textarea>
      </div>
      <div class="mb-3">
        <label>เป้าหมายของงานนี้</label>
        <textarea v-model="job.goal" class="form-control" rows="2" placeholder="เช่น เพิ่มยอดขาย สร้างการรับรู้แบรนด์ ฯลฯ"></textarea>
      </div>
      <div class="mb-3">
        <label>รูปแบบที่ต้องการ (โทนสี / สไตล์)</label>
        <textarea v-model="job.style" class="form-control" rows="2" placeholder="เช่น โทนอบอุ่น สไตล์มินิมอล โมเดิร์น ฯลฯ"></textarea>
      </div>
      <div class="mb-3">
        <label>สิ่งที่ต้องส่งมอบ (ประเภทไฟล์ / ขนาด)</label>
        <textarea v-model="job.deliverable" class="form-control" rows="2" placeholder="เช่น ไฟล์ PNG, AI, PSD ขนาด 1080x1080px"></textarea>
      </div>
      <div class="mb-3">
        <label>จำนวนรอบที่สามารถแก้ไขได้</label>
        <input v-model="job.revisions" type="number" min="0" class="form-control" placeholder="เช่น 2 รอบ" />
      </div>
      <div class="mb-3">
        <label>ระยะเวลาที่ต้องการให้ส่งงาน <span class="text-danger">*</span></label>
        <input v-model="job.duration" class="form-control" placeholder="เช่น ภายใน 5 วัน หรือ 7 มิ.ย. 2568" required />
      </div>
      <div class="mb-3">
        <label>ช่องทางติดต่อ <span class="text-danger">*</span></label>
        <input v-model="job.contact" class="form-control" placeholder="เช่น LINE ID: myline, Email: example@email.com" required />
      </div>

      <div class="mb-3">
        <label>ประเภทงาน</label>
        <select v-model="job.j_type" class="form-select" required>
          <option disabled value="">-- กรุณาเลือกประเภทงาน --</option>
          <option value="ออกแบบและมัลติมีเดีย">ออกแบบและมัลติมีเดีย</option>
          <option value="การตลาดดิจิทัล">การตลาดดิจิทัล</option>
          <option value="พัฒนาเว็บไซต์">พัฒนาเว็บไซต์</option>
          <option value="UX/UI Design">UX/UI Design</option>
          <option value="IT Support">IT Support</option>
          <option value="ดูแลระบบเครือข่าย">ดูแลระบบเครือข่าย</option>
          <option value="เขียนบทความ/แปลบทความเทคโนโลยี">เขียน/แปลบทความเทคโนโลยี</option>
          <option value="คีย์ข้อมูล / Data Entry">คีย์ข้อมูล / Data Entry</option>
          <option value="แอดมินเพจ / ดูแลโซเชียลมีเดีย">แอดมินเพจ / โซเชียลมีเดีย</option>
          <option value="ตัดต่อวิดีโอ / สร้างคอนเทนต์">ตัดต่อวิดีโอ / คอนเทนต์</option>
          <option value="ที่ปรึกษาด้านเทคโนโลยี">ที่ปรึกษาด้านเทคโนโลยี</option>
        </select>
      </div>
      <div class="mb-3">
        <label>ค่าจ้าง</label>
        <input v-model.number="job.j_salary" type="number" class="form-control" placeholder="ระบุจำนวนเป็นบาท เช่น 2000" required />
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
        detail: "",
        goal: "",
        style: "",
        deliverable: "",
        revisions: null,
        duration: "",
        contact: "",
        j_type: "",
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
        j_description: `รายละเอียด: ${this.job.detail}\nเป้าหมาย: ${this.job.goal}\nรูปแบบ: ${this.job.style}\nสิ่งที่ต้องส่งมอบ: ${this.job.deliverable}\nจำนวนรอบแก้ไข: ${this.job.revisions}\nระยะเวลา: ${this.job.duration}\nติดต่อ: ${this.job.contact}`,
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
