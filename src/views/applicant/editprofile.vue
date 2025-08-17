<template>
  <div>
    <NavbarApplicant />

    <div class="container py-5">
      <div class="text-center mb-4">
        <h2 class="fw-bold text-orange">
          <i class="bi bi-person-circle me-2"></i> แก้ไขโปรไฟล์ของคุณ
        </h2>
      </div>

      <div class="card shadow rounded-4 p-4 bg-white mx-auto" style="max-width: 980px">
        <div class="row g-4">
          <!-- ซ้าย -->
          <div class="col-md-4">
            <div class="text-center">
              <img :src="displayImage"
                   class="rounded-4 shadow-sm border mb-3"
                   style="width:100%;max-width:220px;height:280px;object-fit:cover"
                   alt="profile" />
              <input type="file" class="form-control" @change="onImageChange" accept="image/*" />
            </div>

            <div class="border-top pt-3 mt-3">
              <h6 class="fw-bold text-center">ข้อมูลติดต่อ</h6>
              <div class="mb-2"><label class="form-label">ชื่อ</label><input v-model="user.a_firstname" class="form-control" /></div>
              <div class="mb-2"><label class="form-label">นามสกุล</label><input v-model="user.a_lastname" class="form-control" /></div>
              <div class="mb-2"><label class="form-label">เพศ</label><input v-model="user.a_gender" class="form-control" /></div>
              <div class="mb-2"><label class="form-label">อายุ</label><input :value="calculateAge(user.a_birthdate)" class="form-control" readonly /></div>
              <div class="mb-2"><label class="form-label">คณะ</label><input v-model="user.a_faculty" class="form-control" /></div>
              <div class="mb-2"><label class="form-label">สัญชาติ</label><input v-model="user.a_nationality" class="form-control" /></div>
              <div class="mb-2"><label class="form-label">เบอร์โทร</label><input v-model="user.a_phone" class="form-control" /></div>
              <div class="mb-2"><label class="form-label">อีเมล</label><input v-model="user.a_email" class="form-control" /></div>
            </div>
          </div>

          <!-- ขวา -->
          <div class="col-md-8">
            <div class="mb-3"><label class="form-label">ตำแหน่งงานที่สนใจ</label><input v-model="user.a_position" class="form-control" /></div>

            <div class="mb-3">
              <label class="form-label">ค่าจ้างที่ต้องการ</label>
              <input v-model="user.a_salary" class="form-control" type="text" placeholder="เช่น 15000 หรือ ตามตกลง" />
            </div>

            <div class="mb-3">
              <label class="form-label">ทักษะและความสามารถ</label>
              <textarea v-model="user.a_bio" class="form-control" rows="3"
                        placeholder="พิมพ์สิ่งที่ทำได้/ประสบการณ์/จุดแข็ง เป็นประโยคได้เลย"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">ความสนใจอื่น ๆ</label>
              <textarea v-model="user.a_interest" class="form-control"></textarea>
            </div>

            <!-- การศึกษา -->
            <div class="mb-4">
              <h5 class="fw-bold">ประวัติการศึกษา</h5>
              <div v-for="(edu, index) in user.education || []" :key="index" class="border p-3 rounded mb-2">
                <div class="mb-2"><label>ปีที่เริ่ม</label><input v-model="edu.start_year" class="form-control" /></div>
                <div class="mb-2"><label>มหาวิทยาลัย</label><input v-model="edu.university" class="form-control" /></div>
                <div class="mb-2"><label>ระดับการศึกษา</label><input v-model="edu.level" class="form-control" /></div>
                <div class="mb-2"><label>วุฒิการศึกษา</label><input v-model="edu.degree" class="form-control" /></div>
                <div class="mb-2"><label>สาขา</label><input v-model="edu.major" class="form-control" /></div>
                <div class="mb-2"><label>เกรดเฉลี่ย</label><input v-model="edu.gpa" class="form-control" /></div>
                <button @click="removeEducation(index)" class="btn btn-outline-danger btn-sm">ลบ</button>
              </div>
              <button @click="addEducation" class="btn btn-outline-primary btn-sm">เพิ่มประวัติการศึกษา</button>
            </div>

            <!-- ประสบการณ์ -->
            <div class="mb-4">
              <h5 class="fw-bold">ประวัติการทำงาน</h5>
              <div v-for="(job, index) in user.experience || []" :key="index" class="border p-3 rounded mb-2">
                <div class="mb-2"><label>ชื่อตำแหน่ง</label><input v-model="job.title" class="form-control" /></div>
                <div class="mb-2"><label>วันที่เริ่ม</label><input v-model="job.start_date" type="date" class="form-control" /></div>
                <div class="mb-2"><label>วันที่สิ้นสุด</label><input v-model="job.end_date" type="date" class="form-control" /></div>
                <div class="mb-2"><label>ระยะเวลา (เดือน)</label><input v-model="job.duration" class="form-control" placeholder="เช่น 12" /></div>
                <div class="mb-2"><label>รายละเอียดงาน</label><textarea v-model="job.description" class="form-control" rows="3"></textarea></div>
                <button @click="removeExperience(index)" class="btn btn-outline-danger btn-sm">ลบ</button>
              </div>
              <button @click="addExperience" class="btn btn-outline-primary btn-sm">เพิ่มประวัติการทำงาน</button>
            </div>

            <div class="text-end mt-3 d-flex justify-content-end gap-2">
              <button @click="$router.push('/applicant/userprofile')" class="btn btn-outline-secondary px-4 py-2 rounded-pill">
                <i class="bi bi-x-circle me-1"></i> ยกเลิก
              </button>
              <button @click="saveProfile" class="btn btn-success px-4 py-2 rounded-pill">
                <i class="bi bi-check-circle me-1"></i> บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarApplicant from "@/components/NavbarApplicant.vue";
import DefaultProfile from "@/assets/default-profile.png";

const BASE_URL = "http://localhost:3001";

export default {
  name: "EditProfile",
  components: { NavbarApplicant },
  data() {
    return {
      user: {},
      portfolios: [],
      profileImage: null,   // preview
      imageFile: null,      // file จริง
      imgVer: 0,            // กันแคช
      defaultImage: DefaultProfile,
    };
  },
  computed: {
    displayImage() {
      if (this.profileImage) return this.profileImage;
      if (this.user?.profile_img_url) return `${BASE_URL}${this.user.profile_img_url}?v=${this.imgVer}`;
      return this.defaultImage;
    },
  },
  mounted() {
    const id = this.getCurrentApplicantId();
    if (id) this.fetchProfile(id);
  },
  methods: {
    getCurrentApplicantId() {
      try {
        const local = JSON.parse(localStorage.getItem("user"));
        return this.$route.params.id || local?.applicant_id || null;
      } catch {
        return this.$route.params.id || null;
      }
    },

    async fetchProfile(id) {
      try {
        const res = await axios.get(`${BASE_URL}/api/applicants/${id}`);
        const { user, portfolios, education, experience } = res.data;

        this.user = {
          ...user,
          education: education || [],
          experience: (experience || []).map(exp => ({
            ...exp,
            start_date: exp.start_date ? exp.start_date.slice(0, 10) : "",
            end_date: exp.end_date ? exp.end_date.slice(0, 10) : "",
          })),
        };

        this.portfolios = portfolios || [];
        if (this.user.profile_img_url) this.imgVer = Date.now();
      } catch (err) {
        console.error("❌ fetchProfile failed", err.response?.data || err.message);
      }
    },

    calculateAge(dateStr) {
      const birthDate = new Date(dateStr);
      if (isNaN(birthDate)) return "-";
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      return `${age} ปี`;
    },

    onImageChange(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      this.imageFile = file;
      this.profileImage = URL.createObjectURL(file); // preview
    },

    async saveProfile() {
      try {
        const id = this.getCurrentApplicantId();
        if (!id) { alert("ไม่พบรหัสผู้ใช้"); return; }

        /* 1) อัปโหลดรูปก่อน (ถ้ามี) */
        if (this.imageFile) {
          const fd = new FormData();
          fd.append("profile", this.imageFile); // <-- ต้องชื่อ profile ให้ตรง backend
          const photoRes = await axios.post(
            `${BASE_URL}/api/upload-profile/${id}`,
            fd,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          if (photoRes.data?.url) {
            this.user.profile_img_url = photoRes.data.url;
            this.imgVer = Date.now();
            const stored = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({
              ...stored,
              profile_img_url: this.user.profile_img_url,
            }));
          }
        }

        /* 2) เตรียมข้อมูลให้ตรง type DB */
        const norm = v => (v?.toString().trim() || null);
        const normDate = d => (d ? new Date(d).toISOString().slice(0,10) : null);
        const normInt = v => {
          const n = parseInt(String(v ?? "").replace(/\D+/g, ""), 10);
          return Number.isFinite(n) ? n : null;
        };

        let formattedBirthdate = null;
        if (this.user.a_birthdate) {
          const d = new Date(this.user.a_birthdate);
          if (!isNaN(d)) formattedBirthdate = d.toISOString().slice(0,10);
        }

        const salaryRaw = (this.user.a_salary ?? "").toString().trim();
        const salaryForApi = salaryRaw !== "" && !isNaN(Number(salaryRaw)) ? Number(salaryRaw) : null;

        const education = (this.user.education || []).map(e => ({
          start_year: norm(e.start_year),
          university: norm(e.university),
          level: norm(e.level),
          degree: norm(e.degree),
          major: norm(e.major),
          gpa: e.gpa === "" ? null : Number(e.gpa)
        }));

        const experience = (this.user.experience || []).map(j => ({
          title: norm(j.title),
          start_date: normDate(j.start_date),
          end_date: normDate(j.end_date),
          duration: normInt(j.duration),   // <<< กัน “1เดือน” พัง
          description: norm(j.description)
        }));

        const payload = {
          ...this.user,
          a_salary: salaryForApi,
          a_birthdate: formattedBirthdate,
          education,
          experience,
        };

        /* 3) อัปเดตโปรไฟล์ */
        await axios.put(`${BASE_URL}/api/applicants/${id}`, payload);

        /* 4) sync localStorage */
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({
          ...stored,
          ...this.user,
          applicant_id: id,
          a_salary: salaryForApi,
          a_birthdate: formattedBirthdate,
        }));

        alert("✅ บันทึกข้อมูลสำเร็จ");
        this.$router.push("/applicant/userprofile");
      } catch (err) {
        console.error("❌ saveProfile failed", err.response?.data || err.message);
        alert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    },

    addEducation() {
      (this.user.education ||= []).push({ start_year:"", university:"", level:"", degree:"", major:"", gpa:"" });
    },
    removeEducation(i) { this.user.education.splice(i, 1); },
    addExperience() {
      (this.user.experience ||= []).push({ title:"", start_date:"", end_date:"", duration:"", description:"" });
    },
    removeExperience(i) { this.user.experience.splice(i, 1); },
  },
};
</script>

<style scoped>
.text-orange { color: #ff6600; }
</style>
