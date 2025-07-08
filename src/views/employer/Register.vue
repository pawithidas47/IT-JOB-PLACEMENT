<template>
  <div>
    <NavbarHome />
    <div class="d-flex justify-content-center align-items-center py-5 px-3" style="background-color: #f7f8fa; min-height: calc(100vh - 80px);">
      <div class="card p-5 shadow-lg border-0 rounded-4 w-100" style="max-width: 720px;">
        <div class="text-center mb-4">
          <h4 class="fw-bold mb-0 text-orange">ลงทะเบียนบริษัท</h4>
          <p class="text-muted small">โปรดกรอกข้อมูลให้ครบถ้วน เพื่อจดทะเบียนบริษัท</p>
        </div>

        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="form-label">ชื่อผู้ใช้งาน *</label>
            <input v-model="form.username" class="form-control rounded-3" placeholder="ชื่อผู้ใช้สำหรับเข้าสู่ระบบ" required />
          </div>

          <div class="mb-3">
            <label class="form-label">รหัสผ่าน *</label>
            <input type="password" v-model="form.password" class="form-control rounded-3" placeholder="รหัสผ่าน" required />
          </div>

          <div class="mb-3">
            <label class="form-label">ชื่อบริษัท *</label>
            <input v-model="form.company_name" class="form-control rounded-3" placeholder="Company Name" required />
          </div>

          <div class="mb-3">
            <label class="form-label">คำอธิบายสั้นๆ เกี่ยวกับบริษัทของคุณ</label>
            <textarea v-model="form.description" class="form-control rounded-3" rows="3" placeholder="เช่น บริษัท พัฒนาระบบ IT..." />
          </div>

          <div class="mb-3">
            <label class="form-label">ประเภทธุรกิจ *</label>
            <select v-model="form.business_type" class="form-select rounded-3" required>
              <option disabled value="">-- เลือกประเภทธุรกิจ --</option>
              <option value="บริษัทเทคโนโลยี / Software">บริษัทเทคโนโลยี / Software</option>
              <option value="ร้านค้า / SME ท้องถิ่น">ร้านค้า / SME ท้องถิ่น</option>
              <option value="นักพัฒนาอิสระ / ฟรีแลนซ์">นักพัฒนาอิสระ / ฟรีแลนซ์</option>
              <option value="สตาร์ทอัป">สตาร์ทอัป</option>
              <option value="หน่วยงานภายในมหาวิทยาลัย">หน่วยงานภายในมหาวิทยาลัยนเรศวร</option>
              <option value="คณะ / ภาควิชา / ศูนย์บริการ">คณะ / ภาควิชา / ศูนย์บริการ</option>
              <option value="ธุรกิจด้านการศึกษา">ธุรกิจด้านการศึกษา</option>
              <option value="ธุรกิจด้านการตลาด / โฆษณา">ธุรกิจด้านการตลาด / โฆษณา</option>
              <option value="องค์กรภาครัฐ / ราชการ">องค์กรภาครัฐ / ราชการ</option>
              <option value="อื่น ๆ">อื่น ๆ</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">รูปแบบบริษัท *</label>
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" value="เอกชน" v-model="form.structure" required />
                <label class="form-check-label">เอกชน</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" value="รัฐวิสาหกิจ" v-model="form.structure" />
                <label class="form-check-label">รัฐวิสาหกิจ</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" value="หน่วยงานรัฐ" v-model="form.structure" />
                <label class="form-check-label">หน่วยงานรัฐ</label>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">จำนวนพนักงาน *</label>
            <select v-model="form.employee_count" class="form-select rounded-3" required>
              <option disabled value="">เลือกจำนวนพนักงาน</option>
              <option>ไม่เกิน 10 คน</option>
              <option>11–30 คน</option>
              <option>มากกว่า 30 คน</option>
            </select>
          </div>

          <h6 class="fw-bold mt-4">ข้อมูลที่อยู่บริษัท</h6>
          <div class="mb-3">
            <label class="form-label">ที่อยู่ *</label>
            <input v-model="form.address" class="form-control rounded-3" required placeholder="เช่น 222 หมู่บ้านสุรนิเวศ ซอย 9" />
          </div>
          <div class="row mb-3">
            <div class="col">
              <input v-model="form.subdistrict" class="form-control rounded-3" placeholder="ตำบล/แขวง" />
            </div>
            <div class="col">
              <input v-model="form.district" class="form-control rounded-3" placeholder="อำเภอ/เขต" />
            </div>
          </div>
          <div class="mb-3">
            <input v-model="form.province" class="form-control rounded-3" placeholder="จังหวัด" />
          </div>

          <h6 class="fw-bold mt-4">ข้อมูลติดต่อบริษัท</h6>
          <div class="mb-3">
            <label class="form-label">เบอร์โทรศัพท์ *</label>
            <input v-model="form.phone" class="form-control rounded-3" required placeholder="กรณีมีหลายเบอร์ให้ใส่เครื่องหมาย , คั่นกลาง" />
          </div>
          <div class="mb-3">
            <label class="form-label">อีเมล *</label>
            <input v-model="form.email" type="email" class="form-control rounded-3" required placeholder="เช่น contact@company.com" />
          </div>
          <div class="mb-3">
            <label class="form-label">เว็บไซต์บริษัท (ถ้ามี)</label>
            <input v-model="form.website" class="form-control rounded-3" placeholder="เช่น www.company.com" />
          </div>
          <div class="mb-3">
            <label class="form-label">ชื่อผู้ติดต่อ *</label>
            <input v-model="form.contact_name" class="form-control rounded-3" required placeholder="ชื่อผู้ติดต่อ" />
          </div>
          <div class="mb-4">
            <label class="form-label">ตำแหน่งของผู้ติดต่อ *</label>
            <input v-model="form.contact_position" class="form-control rounded-3" required placeholder="เช่น เจ้าของกิจการ, HR" />
          </div>

          <button type="submit" class="btn btn-orange w-100 fw-bold py-2 rounded-3 fs-6">
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarHome from "@/components/NavbarHome.vue";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  name: "RegisterEmployer",
  components: { NavbarHome },
  data() {
    return {
      form: {
        username: "",
        password: "",
        company_name: "",
        description: "",
        business_type: "",
        structure: "",
        employee_count: "",
        address: "",
        subdistrict: "",
        district: "",
        province: "",
        phone: "",
        email: "",
        website: "",
        contact_name: "",
        contact_position: ""
      },
    };
  },
  methods: {
    submitForm() {
      axios.post("http://localhost:3001/api/auth/register/employer", {
        e_username: this.form.username,
        e_password: this.form.password,
        e_company_name: this.form.company_name,
        e_description: this.form.description,
        e_type: this.form.business_type,
        e_structure: this.form.structure,
        e_employee_count: this.form.employee_count,
        e_address: this.form.address,
        e_subdistrict: this.form.subdistrict,
        e_district: this.form.district,
        e_province: this.form.province,
        e_phone: this.form.phone,
        e_email: this.form.email,
        e_website: this.form.website,
        e_contact: this.form.contact_name,
        e_position: this.form.contact_position
      })
      .then(() => {
        Swal.fire("บันทึกสำเร็จ", "ข้อมูลบริษัทถูกบันทึกเรียบร้อยแล้ว", "success");
        this.$router.push("/login");
      })
      .catch((err) => {
        console.error("❌ บันทึกข้อมูลไม่สำเร็จ:", err);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
      });
    },
  },
};
</script>

<style scoped>
.btn-orange {
  background-color: #ff6600;
  border: none;
  color: white;
  transition: 0.2s ease-in-out;
}

.btn-orange:hover {
  background-color: #e65c00;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.25);
}

input::placeholder {
  color: #cacaca;
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