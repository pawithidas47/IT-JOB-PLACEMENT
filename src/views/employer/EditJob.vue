<template>
  <div>
    <NavbarEmployer />

    <div v-if="job">
      <form @submit.prevent="submitEdit">
        <div class="container py-5 mx-auto" style="max-width: 840px;">
          <div class="card shadow rounded-4 p-5 border-0 bg-white">

            <h3 class="fw-bold text-orange mb-3">
              <i class="bi bi-pencil-square me-2"></i> แก้ไขงาน
            </h3>

            <!-- ชื่องาน -->
            <div class="mb-3">
              <label class="fw-bold text-dark mb-2">ชื่องาน</label>
              <input v-model="job.j_title" class="form-control" required />
            </div>

            <!-- บริษัท -->
            <div class="mb-3">
              <label class="fw-bold text-dark mb-2">ชื่อบริษัท</label>
              <input v-model="job.e_company_name" class="form-control" disabled />
            </div>

            <!-- หมวดหมู่ -->
            <div class="mb-3">
              <label class="fw-bold text-dark mb-2">หมวดหมู่</label>
              <select v-model="job.j_type" class="form-select" required>
                <option disabled value="">-- กรุณาเลือก --</option>
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

            <!-- จำนวนที่รับ -->
            <div class="mb-3">
              <label class="fw-bold text-dark mb-2">จำนวนที่รับ</label>
              <input v-model.number="job.j_amount" type="number" class="form-control" required />
            </div>

            <!-- ลักษณะงาน -->
            <div class="mb-3">
              <label class="fw-bold text-dark mb-2">ลักษณะงาน</label>
              <textarea v-model="job.j_description" rows="4" class="form-control" required />
            </div>

            <!-- คุณสมบัติ -->
            <div class="mb-3">
              <label class="fw-bold text-dark mb-2">คุณสมบัติผู้สมัคร</label>
              <textarea v-model="job.j_qualification" rows="3" class="form-control" />
            </div>

            <!-- เงินเดือน -->
            <div class="mb-3">
              <label class="fw-bold text-dark mb-2">ค่าจ้าง</label>
              <input v-model.number="job.j_salary" type="number" class="form-control" required />
            </div>

           
            <!-- สิ่งที่ต้องส่ง -->
            <div class="mb-3">
              <label class="fw-bold text-dark mb-2">สิ่งที่ต้องส่ง</label>
              <input v-model="job.j_deliverable" class="form-control" />
            </div>

            <!-- สถานที่ทำงาน -->
            <div class="mb-3">
              <label class="fw-bold text-dark mb-2">สถานที่ปฏิบัติงาน</label>
              <input v-model="job.j_location" class="form-control" />
            </div>

            <!-- เวลาทำงาน -->
            <div class="mb-3">
              <label class="fw-bold text-dark mb-2">วันและเวลาทำงาน</label>
              <input v-model="job.j_worktime" class="form-control" />
            </div>

           
          
            <!-- ปุ่มบันทึก + ยกเลิก -->
            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="button" class="btn btn-outline-secondary px-4 py-2 rounded-pill" @click="cancelEdit">
                <i class="bi bi-x-circle me-1"></i> ยกเลิก
              </button>

              <button type="submit" class="btn btn-orange fw-bold px-4 py-2 rounded-pill shadow-sm">
                <i class="bi bi-check2-circle me-2"></i> บันทึกการแก้ไข
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>

    <!-- กำลังโหลด -->
    <div v-else class="text-center text-muted py-5">
      <i class="bi bi-hourglass-split fs-2"></i>
      <p class="mt-3">กำลังโหลดข้อมูลงาน...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";

export default {
  name: "EditJob",
  components: { NavbarEmployer },
  data() {
    return {
      job: null,
    };
  },
  mounted() {
    const jobId = this.$route.params.id;
    axios.get(`http://localhost:3001/api/jobs/${jobId}`)
      .then((res) => {
        this.job = res.data;
      })
      .catch((err) => {
        console.error("❌ โหลดข้อมูลงานล้มเหลว:", err);
        alert("ไม่สามารถโหลดข้อมูลงานได้");
        this.$router.push("/employer/dashboard");
      });
  },
  methods: {
    submitEdit() {
      const jobId = this.$route.params.id;
      axios.put(`http://localhost:3001/api/jobs/${jobId}`, this.job)
        .then(() => {
          alert("✅ แก้ไขงานสำเร็จ");
          this.$router.push("/employer/dashboard");
        })
        .catch((err) => {
          console.error("❌ แก้ไขงานล้มเหลว:", err);
          alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        });
    },
    cancelEdit() {
      this.$router.back(); // หรือจะใช้: this.$router.push(`/employer/jobs/${this.job?.job_id}`);
    }
  },
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
