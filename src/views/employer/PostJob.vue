<template>
  <div>
    <NavbarEmployer />

    <div class="container py-5">
      <div class="form-box shadow rounded-4 p-4 bg-white mx-auto" style="max-width: 750px;">
        <h4 class="fw-bold mb-4 text-orange">📝 โพสต์งานใหม่</h4>

        <form @submit.prevent="submitJob" class="row g-3">
          <!-- Job Title -->
          <div class="col-12">
            <label class="form-label">ชื่องาน</label>
            <input v-model="job.j_title" class="form-control rounded-3" required />
          </div>

          <!-- Detail -->
          <div class="col-12">
            <label class="form-label">รายละเอียดงาน</label>
            <textarea v-model="job.detail" class="form-control rounded-3" rows="3" placeholder="อธิบายลักษณะงานโดยรวม"
              required></textarea>
          </div>

          <!-- Style + Goal -->
          <div class="col-md-6">
            <label class="form-label">เป้าหมายของงาน</label>
            <input v-model="job.goal" class="form-control rounded-3" placeholder="เพิ่มยอดขาย / Awareness" />
          </div>
          <div class="col-md-6">
            <label class="form-label">โทน/สไตล์</label>
            <input v-model="job.style" class="form-control rounded-3" placeholder="มินิมอล / Modern" />
          </div>

          <!-- Upload -->
          <div class="col-12">
            <label class="form-label">แนบไฟล์ (Brief/Reference)</label>
            <input type="file" multiple class="form-control rounded-3" @change="handleFileUpload" />
          </div>

          <!-- Deliverable / Revisions -->
          <div class="col-md-6">
            <label class="form-label">สิ่งที่ต้องส่งมอบ</label>
            <input v-model="job.deliverable" class="form-control rounded-3" placeholder="เช่น PNG, PSD, AI" />
          </div>
          <div class="col-md-6">
            <label class="form-label">จำนวนรอบแก้ไข</label>
            <input v-model="job.revisions" type="number" class="form-control rounded-3" />
          </div>

          <!-- Duration + Contact -->
          <div class="col-md-6">
            <label class="form-label">ระยะเวลาส่งงาน</label>
            <input v-model="job.duration" class="form-control rounded-3" placeholder="เช่น 7 วัน" />
          </div>
          <div class="col-md-6">
            <label class="form-label">ช่องทางติดต่อ</label>
            <input v-model="job.contact" class="form-control rounded-3" placeholder="LINE / Email" required />
          </div>

          <!-- Job Type -->
          <div class="col-md-6">
            <label class="form-label">ประเภทงาน</label>
            <select v-model="job.j_type" class="form-select rounded-3" required>
              <option disabled value="">-- เลือกประเภท --</option>
              <option>ออกแบบและมัลติมีเดีย</option>
              <option>คีย์ข้อมูล / Data Entry</option>
              <option>แอดมินเพจ / ดูแลโซเชียล</option>
              <option>ตัดต่อวิดีโอ / สร้างคอนเทนต์</option>
            </select>
          </div>

          <!-- Salary + Deadline -->
          <div class="col-md-3">
            <label class="form-label">ค่าจ้าง (บาท)</label>
            <input v-model.number="job.j_salary" type="number" class="form-control rounded-3" required />
          </div>
          <div class="col-md-3 d-flex align-items-end">
            <button class="btn btn-outline-secondary w-100" type="button" @click="recommend">
              🔮 แนะนำโดย AI
            </button>
          </div>
          <div class="col-md-6">
            <label class="form-label">วันปิดรับสมัคร</label>
            <input v-model="job.j_appdeadline" type="date" class="form-control rounded-3" required />
          </div>

          <!-- Submit -->
          <div class="col-12">
            <button class="btn btn-orange w-100 fw-bold py-2"> โพสต์งาน</button>

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
        j_title: "",
        detail: "",
        goal: "",
        style: "",
        deliverable: "",
        revisions: null,
        duration: "",
        contact: "",
        j_type: "",
        j_salary: null,
        j_appdeadline: "",
      },
      user: null,
      files: [],
    };
  },
  mounted() {
    const u = localStorage.getItem("user");
    if (!u) return this.$router.push("/login");
    this.user = JSON.parse(u);

    // แปลงวันที่ให้เป็น YYYY-MM-DD ถ้ามีค่าเริ่มต้นจาก backend
    if (this.job.j_appdeadline) {
      const date = new Date(this.job.j_appdeadline);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      this.job.j_appdeadline = `${yyyy}-${mm}-${dd}`; // 👈 ทำให้ตรงกับ format ของ input[type="date"]
    }
  },
  methods: {
    handleFileUpload(e) {
      this.files = [...e.target.files];
    },
    recommend() {
      // Mock AI logic: generate based on job type (in real case call API)
      if (this.job.j_type.includes("แอดมิน") || this.job.j_type.includes("คีย์ข้อมูล")) {
        this.job.j_salary = 800;
        this.job.duration = "ภายใน 3 วัน";
      } else if (this.job.j_type.includes("ออกแบบ") || this.job.j_type.includes("ตัดต่อ")) {
        this.job.j_salary = 1500;
        this.job.duration = "ภายใน 5 วัน";
      } else {
        this.job.j_salary = 1000;
        this.job.duration = "ภายใน 4 วัน";
      }
    },
    submitJob() {
      const payload = {
        ...this.job,
        j_description: `รายละเอียด: ${this.job.detail}\nเป้าหมาย: ${this.job.goal}\nสไตล์: ${this.job.style}\nสิ่งที่ส่งมอบ: ${this.job.deliverable}\nรอบแก้ไข: ${this.job.revisions}\nส่งภายใน: ${this.job.duration}`,
        employer_id: this.user.employer_id,
      };

      // ✅ ใช้งาน API จริง
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });
      this.files.forEach(file => {
        formData.append("files", file);
      });


      // สมมุติว่า POST ไปที่ /api/jobs
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
    ,
  },
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
