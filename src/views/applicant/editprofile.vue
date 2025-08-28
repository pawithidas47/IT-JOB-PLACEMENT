<template>
  <div>
    <NavbarApplicant />

    <div class="page">
      <!-- Header -->
      <header class="head">
        <h2 class="title"><i class="bi bi-person-circle me-2"></i> แก้ไขโปรไฟล์ของคุณ</h2>
        <p class="hint">อัปเดตข้อมูลให้ครบถ้วน เพื่อให้นายจ้างตัดสินใจได้ไวขึ้น</p>
      </header>

      <!-- Main panel -->
      <div class="panel">
        <div class="layout">
          <!-- LEFT -->
          <aside class="left">
            <div class="card soft">
              <img :src="displayImage" class="avatar" alt="profile" />
              <label class="form-label mt-2">อัปโหลดโปรไฟล์</label>
              <input type="file" class="form-control" @change="onImageChange" accept="image/*" />
              <small class="text-muted">แนะนำ 600×800 px (jpg/png)</small>
            </div>

            <div class="card soft">
              <h6 class="card-title">ข้อมูลติดต่อ</h6>

              <div class="form-row">
                <label>ชื่อ</label>
                <input v-model.trim="user.a_firstname" class="form-control" />
              </div>
              <div class="form-row">
                <label>นามสกุล</label>
                <input v-model.trim="user.a_lastname" class="form-control" />
              </div>

              <div class="grid-2">
                <div class="form-row">
                  <label>เพศ</label>
                  <select v-model="user.a_gender" class="form-select">
                    <option disabled value="">เลือกเพศ</option>
                    <option>หญิง</option><option>ชาย</option><option>ไม่ระบุ</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <label>อายุ</label>
                <input :value="displayAge" class="form-control" readonly />
              </div>

              <div class="form-row">
                <label>คณะ</label>
                <input v-model.trim="user.a_faculty" class="form-control" />
              </div>

              <div class="grid-2">
                <div class="form-row">
                  <label>สัญชาติ</label>
                  <input v-model.trim="user.a_nationality" class="form-control" />
                </div>
                <div class="form-row">
                  <label>เบอร์โทร</label>
                  <input v-model.trim="user.a_phone" class="form-control" inputmode="tel" />
                </div>
              </div>

              <div class="form-row">
                <label>อีเมล</label>
                <input v-model.trim="user.a_email" type="email" class="form-control" />
              </div>
            </div>
          </aside>

          <!-- RIGHT -->
          <section class="right">
            <!-- Summary -->
            <div class="card">
              <h5 class="card-title">ข้อมูลโดยย่อ</h5>

              <div class="grid-2">
                <div class="form-row">
                  <label>ตำแหน่งงานที่สนใจ</label>
                  <input v-model.trim="user.a_position" class="form-control" placeholder="เช่น Frontend Developer" />
                </div>
                <div class="form-row">
                  <label>ค่าจ้างที่ต้องการ</label>
                  <div class="input-group">
                    <input v-model.trim="user.a_salary" class="form-control" placeholder="เช่น 15000 หรือ ตามตกลง" />
                    <span class="input-group-text">บาท/เดือน</span>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <label>ทักษะและความสามารถ</label>
                <textarea v-model.trim="user.a_bio" class="form-control" rows="3"
                  placeholder="พิมพ์สิ่งที่ทำได้/ประสบการณ์/จุดแข็ง"></textarea>
              </div>

              <div class="form-row">
                <label>ความสนใจอื่น ๆ</label>
                <textarea v-model.trim="user.a_interest" class="form-control" rows="2"></textarea>
              </div>
            </div>

           <div v-for="(edu, i) in user.education || []" :key="'edu-'+i" class="subcard">
  <!-- แถวบน: ปี / ระดับ / มหาวิทยาลัย(ยาว 2 ช่อง) -->
  <div class="grid-3">
    <div class="form-row">
      <label>ปีที่เริ่ม (พ.ศ.)</label>
      <select v-model="edu.start_year" class="form-select">
        <option disabled value="">เลือกปี</option>
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <div class="form-row">
      <label>ระดับการศึกษา</label>
      <select v-model="edu.level" class="form-select">
        <option disabled value="">เลือกระดับ</option>
        <option>ปวช.</option><option>ปวส.</option>
        <option>อนุปริญญา</option>
        <option>ปริญญาตรี</option><option>ปริญญาโท</option><option>ปริญญาเอก</option>
        <option>ประกาศนียบัตร</option>
      </select>
    </div>

    <!-- ✅ ช่องมหาวิทยาลัยยาว (กิน 2 คอลัมน์) -->
    <div class="form-row grid-span-2">
      <label>มหาวิทยาลัย</label>
      <input v-model.trim="edu.university" class="form-control" />
    </div>
  </div>

  <!-- แถวล่าง: สาขา + GPA อยู่บรรทัดเดียว -->
  <div class="grid-2 mt-1">
    <div class="form-row">
      <label>สาขา</label>
      <input v-model.trim="edu.major" class="form-control" />
    </div>

    <div class="form-row">
      <label>เกรดเฉลี่ย (GPA)</label>
      <input v-model="edu.gpa" class="form-control" inputmode="decimal" placeholder="เช่น 3.25" />
    </div>
  </div>

  <div class="subcard-actions">
    <button @click="removeEducation(i)" class="btn btn-outline-danger btn-sm">
      <i class="bi bi-trash me-1"></i> ลบ
    </button>
  </div>
</div>


            <!-- Experience -->
            <div class="card">
              <div class="card-head">
                <h5 class="card-title">ประวัติการทำงาน</h5>
                <button @click="addExperience" class="btn btn-outline-primary btn-sm">
                  <i class="bi bi-plus-lg me-1"></i> เพิ่ม
                </button>
              </div>

              <div v-for="(job, i) in user.experience || []" :key="'job-'+i" class="subcard">
                <div class="grid-3">
                  <div class="form-row">
                    <label>ชื่อตำแหน่ง</label>
                    <input v-model.trim="job.title" class="form-control" placeholder="Intern Web Developer" />
                  </div>
                  <div class="form-row">
                    <label>วันที่เริ่ม</label>
                    <input v-model="job.start_date" type="date" class="form-control"
                           @change="job.start_date = toISODate(job.start_date)" />
                  </div>
                  <div class="form-row">
                    <label>วันที่สิ้นสุด</label>
                    <input v-model="job.end_date" type="date" class="form-control"
                           @change="job.end_date = toISODate(job.end_date)" />
                  </div>
                </div>

                <div class="form-row">
                  <label>รายละเอียดงาน</label>
                  <textarea v-model.trim="job.description" class="form-control" rows="4"
                            placeholder="หน้าที่ / ความรับผิดชอบ / ผลงาน"></textarea>
                </div>

                <div class="subcard-actions">
                  <button @click="removeExperience(i)" class="btn btn-outline-danger btn-sm">
                    <i class="bi bi-trash me-1"></i> ลบ
                  </button>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="actions">
              <button @click="$router.push('/applicant/userprofile')" class="btn btn-outline-secondary rounded-pill px-4">
                <i class="bi bi-x-circle me-1"></i> ยกเลิก
              </button>
              <button @click="saveProfile" class="btn btn-success rounded-pill px-4">
                <i class="bi bi-check-circle me-1"></i> บันทึกข้อมูล
              </button>
            </div>
          </section>
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
      user: { education: [], experience: [] },
      profileImage: null,
      imageFile: null,
      imgVer: 0,
      defaultImage: DefaultProfile,
      yearOptions: [],
    };
  },
  computed: {
    displayImage() {
      if (this.profileImage) return this.profileImage;
      if (this.user?.profile_img_url) return `${BASE_URL}${this.user.profile_img_url}?v=${this.imgVer}`;
      return this.defaultImage;
    },
    displayAge() {
      if (this.user?.a_age) return `${this.user.a_age} ปี`;
      if (this.user?.a_birthdate) return this.calculateAge(this.user.a_birthdate);
      return "-";
    },
  },
  mounted() {
    const now = new Date();
    const thaiYear = now.getFullYear() + 543;
    this.yearOptions = Array.from({ length: 30 }, (_, i) => thaiYear - i);

    const id = this.getCurrentApplicantId();
    if (id) this.fetchProfile(id);
  },
  methods: {
    toISODate(d) {
      if (!d) return null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
      const m = String(d).trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
      if (m) {
        const dd = m[1].padStart(2, "0");
        const mm = m[2].padStart(2, "0");
        const yyyy = m[3];
        return `${yyyy}-${mm}-${dd}`;
      }
      const dt = new Date(d);
      if (!isNaN(dt)) return dt.toISOString().slice(0, 10);
      return null;
    },
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
        const { user, education, experience } = res.data;

        this.user = {
          ...user,
          education: (education || []).map(e => ({ ...e })),
          experience: (experience || []).map((e) => ({
            ...e,
            start_date: e.start_date ? e.start_date.slice(0, 10) : "",
            end_date: e.end_date ? e.end_date.slice(0, 10) : "",
          })),
        };

        if (this.user.profile_img_url) this.imgVer = Date.now();
      } catch (err) {
        console.error("❌ fetchProfile failed", err.response?.data || err.message);
      }
    },
    calculateAge(dateStr) {
      const b = new Date(dateStr);
      if (isNaN(b)) return "-";
      const t = new Date();
      let age = t.getFullYear() - b.getFullYear();
      const m = t.getMonth() - b.getMonth();
      if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
      return `${age} ปี`;
    },
    onImageChange(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      this.imageFile = file;
      this.profileImage = URL.createObjectURL(file);
    },
    async saveProfile() {
      try {
        const id = this.getCurrentApplicantId();
        if (!id) { alert("ไม่พบรหัสผู้ใช้"); return; }

        if (this.imageFile) {
          const fd = new FormData();
          fd.append("profile", this.imageFile);
          const r = await axios.post(`${BASE_URL}/api/upload-profile/${id}`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (r.data?.url) {
            this.user.profile_img_url = r.data.url;
            this.imgVer = Date.now();
            const s = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...s, profile_img_url: this.user.profile_img_url }));
          }
        }

        const education = (this.user.education || []).map((e) => ({
          start_year: (e.start_year ?? "").toString().trim() || null,
          university: (e.university ?? "").toString().trim() || null,
          level:      (e.level ?? "").toString().trim() || null,
          major:      (e.major ?? "").toString().trim() || null,
          gpa:        e.gpa === "" || e.gpa == null ? null : Number(e.gpa),
        }));

        const experience = (this.user.experience || []).map((j) => ({
          title:       (j.title ?? "").toString().trim() || null,
          start_date:  this.toISODate(j.start_date),
          end_date:    this.toISODate(j.end_date),
          description: (j.description ?? "").toString().trim() || null,
        }));

        const payload = {
          a_firstname   : (this.user.a_firstname ?? "").toString().trim() || null,
          a_lastname    : (this.user.a_lastname ?? "").toString().trim() || null,
          a_gender      : (this.user.a_gender ?? "").toString().trim() || null,
          a_faculty     : (this.user.a_faculty ?? "").toString().trim() || null,
          a_nationality : (this.user.a_nationality ?? "").toString().trim() || null,
          a_phone       : (this.user.a_phone ?? "").toString().trim() || null,
          a_email       : (this.user.a_email ?? "").toString().trim() || null,
          a_position    : (this.user.a_position ?? "").toString().trim() || null,
          a_salary      : (this.user.a_salary ?? "").toString().trim() || null,
          a_bio         : (this.user.a_bio ?? "").toString().trim() || null,
          a_interest    : (this.user.a_interest ?? "").toString().trim() || null,
          a_birthdate   : this.user.a_birthdate ? this.toISODate(this.user.a_birthdate) : null,
          profile_img_url: this.user.profile_img_url || null,
          education, experience,
        };

        await axios.put(`${BASE_URL}/api/applicants/${id}`, payload);

        const s = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...s, ...this.user, applicant_id: id }));

        alert("✅ บันทึกข้อมูลสำเร็จ");
        this.$router.push("/applicant/userprofile");
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || JSON.stringify(err.response?.data || "") || err.message;
        console.error("❌ saveProfile failed:", msg);
        alert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล\n" + msg);
      }
    },
    addEducation() {
      (this.user.education ||= []).push({
        start_year: "", university: "", level: "", major: "", gpa: ""
      });
    },
    removeEducation(i) { this.user.education.splice(i, 1); },
    addExperience() {
      (this.user.experience ||= []).push({
        title: "", start_date: "", end_date: "", description: ""
      });
    },
    removeExperience(i) { this.user.experience.splice(i, 1); },
  },
};
</script>

<style scoped>
:root{
  --space:16px; --radius:16px; --shadow:0 12px 28px rgba(0,0,0,.07);
  --line:#e9ecef; --muted:#6c757d; --brand:#ff7a18;
}

.page{ max-width:1120px; margin:24px auto 56px; padding:0 16px; }
.head{ text-align:center; margin-bottom:12px; }
.title{ color:var(--brand); font-weight:800; margin:0; }
.hint{ color:var(--muted); margin:4px 0 0; }

.panel{ background:#fff; border-radius:var(--radius); box-shadow:var(--shadow); padding:18px; }
.layout{ display:grid; grid-template-columns:320px 1fr; gap:24px; }
@media (max-width: 992px){ .layout{ grid-template-columns:1fr; } }

.card{ border:1px solid var(--line); border-radius:14px; padding:16px; background:#fff; }
.card.soft{ background:#fafafa; }
.card-title{ font-weight:700; margin:0 0 10px; }
.card-head{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px; }

.left{ position:sticky; top:16px; align-self:start; }
.avatar{ width:100%; max-width:220px; height:280px; object-fit:cover; border-radius:12px; border:1px solid var(--line); box-shadow:0 6px 16px rgba(0,0,0,.08); display:block; margin:0 auto 8px; }

.form-row{ display:flex; flex-direction:column; gap:6px; margin-bottom:12px; }
.form-row>label{ font-weight:600; }
.grid-2{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.grid-3{ display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; }
.grid-4{ display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; }
.grid-span-2{ grid-column:span 2; }

@media (max-width: 992px){
  .grid-4{ grid-template-columns:1fr 1fr; }
  .grid-3{ grid-template-columns:1fr; }
  .grid-span-2{ grid-column:span 2; }
}
@media (max-width: 576px){
  .grid-2, .grid-4{ grid-template-columns:1fr; }
}

.subcard{ border:1px dashed #e2e8f0; background:#fcfcfd; border-radius:12px; padding:12px; margin-top:10px; }
.subcard-actions{ display:flex; justify-content:flex-end; margin-top:8px; }

.actions{ display:flex; justify-content:flex-end; gap:10px; margin-top:16px; }

.text-muted{ color:var(--muted)!important; }
.grid-span-2 { grid-column: span 2; }
.mt-1 { margin-top: .25rem; } /* หรือใช้ spacing ของโปรเจ็กต์คุณ */

</style>
