<template>
  <div>
    <NavbarEmployer />

    <div class="container py-5">
      <div class="form-box shadow rounded-4 p-4 bg-white mx-auto" style="max-width: 750px;">
        <h4 class="fw-bold mb-4 text-orange">📝 โพสต์งานใหม่</h4>

        <form @submit.prevent="submitJob" class="row g-3">
  <!-- 1. ชื่องาน -->
  <div class="col-12">
    <label class="form-label fw-bold">ชื่องาน</label>
    <input v-model="job.title" class="form-control rounded-3" placeholder="เช่น พนักงานขายสินค้า" required />
  </div>
<div class="col-12">
            <label class="form-label fw-bold">หมวดหมู่งาน</label>
            <select v-model="job.category" class="form-select rounded-3" required>
  <option disabled value="">-- เลือกหมวดหมู่ --</option>
              <option value="ออกแบบและมัลติมีเดีย">ออกแบบและมัลติมีเดีย</option>
              <option value="การตลาดดิจิทัล">การตลาดดิจิทัล</option>
              <option value="พัฒนาเว็บไซต์">พัฒนาเว็บไซต์</option>
              <option value="UX/UI Design">UX/UI Design</option>
              <option value="IT Support">IT Support</option>
              <option value="ดูแลระบบเครือข่าย">ดูแลระบบเครือข่าย</option>
              <option value="เขียนบทความ/ แปลบทบความเทคโนโลยี่">เขียน/ แปลบทบความเทคโนโลยี่</option>
              <option value="คีย์ข้อมูล / Data Entry">คีย์ข้อมูล / Data Entry</option>
              <option value="แอดมินเพจ / ดูแลโซเชียลมีเดีย">แอดมินเพจ / โซเชียลมีเดีย</option>
              <option value="ตัดต่อวิดีโอ / สร้างคอนเทนต์">ตัดต่อวิดีโอ / คอนเทนต์</option>
              <option value="ที่ปรึกษาด้านเทคโนโลยี่">ที่ปรึกษาด้านเทคโนโลยี่</option>
            </select>
          </div>
  <!-- 2. รายละเอียดงาน -->
  <div class="col-12">
    <label class="form-label fw-bold">รายละเอียดงาน</label>
    <textarea v-model="job.description" class="form-control rounded-3" rows="4" placeholder="อธิบายลักษณะงานโดยรวม" required></textarea>
  </div>

 

  <!-- 4. คุณสมบัติผู้สมัคร -->
  <!-- 4. คุณสมบัติผู้สมัคร -->
<div class="col-12">
  <label class="form-label fw-bold">คุณสมบัติผู้สมัคร</label>
  <textarea v-model="job.qualification" class="form-control rounded-3" rows="4" placeholder="เช่น มีโน้ตบุ๊ก, ใช้ Photoshop ได้\n- เรียนสาย IT\n- ทำงานเป็นทีมได้ดี"></textarea>
</div>
 <!-- 3. จำนวนที่รับ -->
  <div class="col-md-6">
    <label class="form-label fw-bold">จำนวนที่รับ</label>
    <input v-model="job.vacancy" class="form-control rounded-3" placeholder="เช่น 3 อัตรา" />
  </div>

  <!-- 6. ค่าตอบแทน -->
  <div class="col-md-6">
    <label class="form-label fw-bold">ค่าจ้าง</label>
    <input v-model="job.salary" class="form-control rounded-3" placeholder="เช่น 50 บาท/ชม." required />
  </div>

  <!-- 7. ระยะเวลางาน -->
  <div class="col-md-6">
    <label class="form-label fw-bold">ระยะเวลางาน</label>
    <input v-model="job.duration" class="form-control rounded-3" placeholder="เช่น 1 ก.ค. - 30 ส.ค." />
  </div>

  <!-- 8. วัน-เวลาทำงาน -->
  <div class="col-md-6">
    <label class="form-label fw-bold">วัน-เวลาทำงาน</label>
    <input v-model="job.working_time" class="form-control rounded-3" placeholder="เช่น จ.-ศ. 9:00-17:00" />
  </div>

  <!-- 9. สถานที่ทำงาน -->
  <div class="col-md-6">
    <label class="form-label fw-bold">สถานที่ทำงาน</label>
    <input v-model="job.location" class="form-control rounded-3" placeholder="เช่น ออนไลน์ / กรุงเทพฯ" />
  </div>


  
  <div class="col-12">
    <button type="submit" class="btn btn-orange w-100 fw-bold py-2">📨 โพสต์งาน</button>
  </div>
</form>

      </div>

      <!-- Preview -->
      <div v-if="job.j_title" class="mt-5">
        <h5 class="mb-3 fw-bold text-orange">👀 ตัวอย่างงานที่กำลังโพสต์</h5>
        <div class="border rounded-3 shadow-sm p-4 bg-light">
          <h6 class="fw-bold mb-1">{{ job.j_title }}</h6>
          <p class="mb-1 text-muted">{{ job.j_type }}</p>
          <p class="mb-1"><strong>รายละเอียด:</strong> {{ job.detail }}</p>
          <p><strong>ติดต่อ:</strong> {{ job.contact }} | 💰 {{ job.j_salary?.toLocaleString() }} บาท | ⏳ {{
            job.duration }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarEmployer from "@/components/NavbarEmployer.vue";

export default {
  components: { NavbarEmployer },
  data() {
    return {
      job: {
        title: "",
        description: "",
        category: "",
        vacancy: "",
        qualification: "",
        salary: "",
        duration: "",
        working_time: "",
        location: "",
        welfare: "",
        deliverable: "",
        contact: "",
        deadline: ""
      },
      user: null,
      files: [],
    };
  },
  mounted() {
    const u = localStorage.getItem("user");
    if (!u) return this.$router.push("/login");
    this.user = JSON.parse(u);

    // แปลงวันที่ (optional)
    if (this.job.deadline) {
      const date = new Date(this.job.deadline);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      this.job.deadline = `${yyyy}-${mm}-${dd}`;
    }
  },
  methods: {
    handleFileUpload(e) {
      this.files = [...e.target.files];
    },
    submitJob() {
const payload = {
  j_title: this.job.title,
  j_description: this.job.description,
  j_type: this.job.category,
  j_salary: this.job.salary,
  j_appdeadline: this.job.deadline,
  j_amount: this.job.vacancy,
  j_duration: this.job.duration,
  j_worktime: this.job.working_time,
  j_location: this.job.location,
  j_welfare: this.job.welfare,
  j_deliverable: this.job.deliverable,
  j_contact: this.job.contact,
  j_qualification: this.job.qualification, // ✅ ต้องมี
  employer_id: this.user.employer_id
};


  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });

  this.$axios.post("http://localhost:3001/api/jobs", formData)
    .then(() => {
      alert("✅ โพสต์งานสำเร็จ");
      this.$router.push("/employer/dashboard");
    })
    .catch(err => {
      console.error("❌ โพสต์ล้มเหลว:", err);
      alert("โพสต์ไม่สำเร็จ");
    });
}

    
  }
};
</script>


<style scoped>
.text-orange {
  color: #ff6600;
}

.form-box {
  background: #fff;
  border: 1px solid #eee;
}

.btn-orange {
  background-color: #ff6600;
  color: white;
  transition: all 0.2s ease-in-out;
  border: none;
}

.btn-orange:hover {
  background-color: #e65c00;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.25);
}
</style>
