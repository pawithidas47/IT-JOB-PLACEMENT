<template>
  <div>
    <NavbarEmployer />

    <div class="container py-5">
      <div class="text-center mb-4">
        <h2 class="fw-bold heading">
          <i class="bi bi-person-circle me-2"></i> โปรไฟล์ผู้สมัคร
        </h2>
        <p class="text-muted small">ดูข้อมูลให้ครบถ้วน เพื่อคัดเลือกผู้สมัครได้แม่นยำยิ่งขึ้น</p>
      </div>

      <!-- การ์ดแนวตั้งเรียว -->
      <div class="card outer-card rounded-4 p-4 p-lg-5 bg-white mx-auto">
        <div class="row g-4">
          <!-- ซ้าย -->
          <div class="col-lg-4">
            <div class="text-center">
              <img
                :src="profileImage || defaultImage"
                class="avatar rounded-4 border"
                alt="profile"
              />
            </div>
            <h6 class="fw-bold text-center mt-3">ข้อมูลติดต่อ</h6>
            <ul class="list-unstyled contact">
              <li class="name">{{ applicant.a_firstname }} {{ applicant.a_lastname }}</li>
              <li><span class="label">เพศ</span><span>{{ applicant.a_gender || '-' }}</span></li>
              <li><span class="label">อายุ</span><span>{{ calculateAge(applicant.a_birthdate) }}</span></li>
              <li><span class="label">คณะ</span><span>{{ applicant.a_faculty || '-' }}</span></li>
              <li><span class="label">สัญชาติ</span><span>{{ applicant.a_nationality || '-' }}</span></li>
              <li><i class="bi bi-telephone-fill text-success me-2"></i>{{ applicant.a_phone || '-' }}</li>
              <li><i class="bi bi-envelope-fill text-primary me-2"></i>{{ applicant.a_email || '-' }}</li>
            </ul>
          </div>

          <!-- ขวา -->
          <div class="col-lg-8 d-flex flex-column gap-3">
            <!-- ข้อมูลย่อ -->
            <div class="card section-card p-3 p-lg-4">
              <div class="sec-head">
                <i class="bi bi-card-text sec-icon"></i>
                <h5 class="m-0 fw-bold">ข้อมูลโดยย่อ</h5>
              </div>

              <div class="mb-2">
                <div class="field-label">ตำแหน่งงานที่สนใจ</div>
                <div class="field-val text-primary fw-semibold">{{ applicant.a_position || 'ยังไม่ระบุ' }}</div>
              </div>

              <div class="mb-2">
                <div class="field-label">ค่าจ้างที่ต้องการ</div>
                <div class="field-val">
                  <template v-if="isNumber(applicant.a_salary)">
                    {{ Number(applicant.a_salary).toLocaleString('th-TH') }}
                    <span class="text-muted">บาท/เดือน</span>
                  </template>
                  <template v-else>ตามตกลง</template>
                </div>
              </div>

              <div class="mb-2" v-if="skills && skills.length">
                <div class="field-label">ทักษะ (Skills)</div>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="s in skills" :key="s.skill_id" class="badge-soft">{{ s.skill_name }}</span>
                </div>
              </div>

              <div class="mb-2" v-if="applicant.a_bio">
                <div class="field-label">ทักษะและความสามารถ (สรุป)</div>
                <p class="preline mb-0">{{ applicant.a_bio }}</p>
              </div>

              <div class="mb-0">
                <div class="field-label">ความสนใจอื่น ๆ</div>
                <p class="mb-0">{{ applicant.a_interest || '-' }}</p>
              </div>
            </div>

            <!-- ความชำนาญคอมพิวเตอร์ -->
            <div class="card section-card p-3 p-lg-4" v-if="selectedStars">
              <div class="sec-head">
                <i class="bi bi-cpu sec-icon"></i>
                <h5 class="m-0 fw-bold">ความชำนาญด้านคอมพิวเตอร์</h5>
              </div>
              <div class="d-flex align-items-center">
                <span v-for="n in 5" :key="n" style="font-size: 1.1rem; margin-right: 4px">
                  <i class="bi" :class="n <= selectedStars ? 'bi-star-fill text-warning' : 'bi-star text-muted'"></i>
                </span>
                <span class="ms-2 text-muted">ระดับ: {{ computerLevelLabel }}</span>
              </div>
            </div>

            <!-- การศึกษา -->
            <div class="card section-card p-3 p-lg-4">
              <div class="sec-head">
                <i class="bi bi-mortarboard sec-icon"></i>
                <h5 class="m-0 fw-bold">ประวัติการศึกษา</h5>
              </div>

              <div v-if="applicant.education && applicant.education.length" class="vstack gap-3">
                <div v-for="(edu, i) in applicant.education" :key="'edu-'+i" class="vcard">
                  <div class="vcard-head">
                    <strong>{{ edu.university || '-' }}</strong>
                    <span class="muted">{{ edu.start_year || '-' }}</span>
                  </div>
                  <div class="vcard-body">
                    ระดับ: {{ edu.level || '-' }} • วุฒิ: {{ edu.degree || '-' }}<br />
                    สาขา: {{ edu.major || '-' }}
                    <span v-if="edu.gpa">• เกรด: {{ edu.gpa }}</span>
                  </div>
                </div>
              </div>
              <p v-else class="text-muted mb-0">ยังไม่มีข้อมูลประวัติการศึกษา</p>
            </div>

            <!-- ประสบการณ์ -->
            <div class="card section-card p-3 p-lg-4">
              <div class="sec-head">
                <i class="bi bi-briefcase sec-icon"></i>
                <h5 class="m-0 fw-bold">ประวัติการทำงาน</h5>
              </div>

              <div v-if="applicant.experiences && applicant.experiences.length" class="vstack gap-3">
                <div v-for="(job, i) in applicant.experiences" :key="'job-'+i" class="vcard">
                  <div class="vcard-head">
                    <strong><i class="bi bi-laptop me-1"></i>{{ job.title || '-' }}</strong>
                    <span class="muted">
                      {{ formatDate(job.start_date) }} – {{ job.end_date ? formatDate(job.end_date) : 'ปัจจุบัน' }}
                    </span>
                  </div>
                  <div class="vcard-body">
                    <ul v-if="job.description" class="mb-0 ps-3">
                      <li v-for="(d, k) in job.description.split('\n')" :key="k">{{ d }}</li>
                    </ul>
                    <div v-if="job.duration" class="muted small mt-1">ระยะเวลา: {{ job.duration }}</div>
                  </div>
                </div>
              </div>
              <p v-else class="text-muted mb-0">ยังไม่มีข้อมูลประวัติการทำงาน</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";
import DefaultImage from "@/assets/default-profile.png";

const BASE_URL = "http://localhost:3001";

export default {
  name: "ApplicantProfileForEmployer",
  components: { NavbarEmployer },
  data() {
    return {
      applicant: {
        education: [],
        experiences: [],
        a_computer_level: "",
        a_computer_stars: "",
      },
      skills: [],
      portfolios: [],
      profileImage: null,
      defaultImage: DefaultImage,
    };
  },
  computed: {
    selectedStars() {
      return parseInt(this.applicant?.a_computer_stars || 0);
    },
    computerLevelLabel() {
      const levels = ["เริ่มต้น", "พอใช้", "ปานกลาง", "ดี", "ดีมาก"];
      const idx = Math.max(1, Math.min(5, this.selectedStars)) - 1;
      return levels[idx];
    },
  },
  mounted() {
    const applicant_id = this.$route.params.id;
    if (applicant_id) this.fetchProfile(applicant_id);
  },
  methods: {
    isNumber(v) {
      return v !== null && v !== undefined && !isNaN(Number(v));
    },
    async fetchProfile(applicant_id) {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/applicants/${applicant_id}`);
        this.applicant = {
          ...data.user,
          education: data.education || [],
          experiences: data.experience || [],
          a_computer_level: data.user?.a_computer_level || "",
          a_computer_stars: data.user?.a_computer_stars || "",
        };
        this.skills = data.skills || [];
        this.portfolios = data.portfolios || [];
        this.profileImage = data.user?.profile_img_url
          ? `${BASE_URL}${data.user.profile_img_url}?v=${Date.now()}`
          : null;
      } catch (err) {
        console.error("❌ โหลดโปรไฟล์ผิดพลาด:", err.response?.data || err.message);
      }
    },
    calculateAge(birthdate) {
      const b = new Date(birthdate);
      if (isNaN(b)) return "-";
      const t = new Date();
      let age = t.getFullYear() - b.getFullYear();
      const m = t.getMonth() - b.getMonth();
      if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
      return `${age} ปี`;
    },
    formatDate(s) {
      const d = new Date(s);
      if (isNaN(d)) return "-";
      const y = d.getFullYear() + 543;
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${dd}/${mm}/${y}`;
    },
  },
};
</script>

<style scoped>
.heading { color:#111827; }
.outer-card { max-width: 720px; box-shadow: 0 10px 28px rgba(0,0,0,.08); }
.avatar {
  width:100%; max-width:220px; height:280px; object-fit:cover;
  box-shadow:0 6px 14px rgba(0,0,0,.05);
}
.contact { margin-top:10px; font-size:.95rem; }
.contact .name{ font-weight:700; font-size:1.05rem; margin:6px 0; }
.contact li{ display:flex; align-items:center; gap:.5rem; padding:.5rem 0; border-bottom:1px dashed #eff2f6; }
.contact li:last-child{ border-bottom:none; }
.contact .label{ min-width:70px; color:#374151; font-weight:600; }

.section-card{ border:1px solid #e9ecef; border-radius:14px; }
.sec-head{ display:flex; align-items:center; gap:.6rem; margin-bottom:.6rem; }
.sec-icon{ color:#ff7a18; font-size:1.25rem; }

.field-label{ font-weight:700; color:#111827; margin-bottom:2px; }
.field-val{ font-weight:600; }
.preline{ white-space:pre-line; }
.muted{ color:#6b7280; }

.vcard{
  border:1px solid #e9ecef; border-radius:14px; background:#fff;
  padding:12px 14px; box-shadow:0 6px 12px rgba(0,0,0,.04);
}
.vcard-head{
  display:flex; justify-content:space-between; align-items:center;
  font-weight:600; margin-bottom:.25rem;
}
.vcard-body{ font-size:.9rem; }

.badge-soft{
  display:inline-block; padding:2px 10px; border:1px solid #e9ecef;
  border-radius:999px; background:#f8fafc; font-size:.85rem;
}

.text-orange { color: #ff6600; }
</style>
