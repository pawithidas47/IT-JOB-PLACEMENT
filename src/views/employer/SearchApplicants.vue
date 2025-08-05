<template>
  <div>
    <NavbarEmployer />

    <div class="container-fluid px-4 py-4">
      <div class="main-layout d-flex align-items-start">
        <!-- Sidebar Filter -->
        <aside class="filter-panel shadow-popup text-start bg-white me-4"
          style="padding: 24px; border-radius: 12px; width: 280px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);">
          <form class="d-flex flex-column gap-3" @submit.prevent>
            <div>
              <label class="form-label mb-1 fw-semibold text-dark">ชื่อผู้สมัคร</label>
              <input v-model="filters.name" type="text" class="form-control" placeholder="เช่น สมรักษ์" />
            </div>

            <div>
              <label class="form-label mb-1 fw-semibold text-dark">ตำแหน่งที่สนใจ</label>
              <input v-model="filters.position" type="text" class="form-control" placeholder="เช่น นักออกแบบ" />
            </div>

            <div>
              <label class="form-label mb-1 fw-semibold text-dark">คณะ/สาขา</label>
              <input v-model="filters.faculty" type="text" class="form-control" placeholder="เช่น วิทยาศาสตร์" />
            </div>

            <div>
              <label class="form-label mb-1 fw-semibold text-dark">เพศ</label>
              <select v-model="filters.gender" class="form-select" style="height: 38px; font-size: 14px; border-radius: 10px;">
                <option value="">ทั้งหมด</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="อื่น ๆ">อื่น ๆ</option>
              </select>
            </div>

            <div>
              <label class="form-label mb-1 fw-semibold text-dark">เบอร์โทร</label>
              <input v-model="filters.phone" type="text" class="form-control" placeholder="เช่น 090..." />
            </div>

            <div>
              <label class="form-label mb-1 fw-semibold text-dark">อีเมล</label>
              <input v-model="filters.email" type="text" class="form-control" placeholder="@gmail.com" />
            </div>

            <div class="text-center d-flex justify-content-between">
              <button class="btn w-50 me-1 fw-bold text-white" style="background: #6c757d; border-radius: 10px; height: 40px; font-size: 14px;" type="button" @click="clearFilters">
                ล้างคำค้น
              </button>
              <button class="btn w-50 ms-1 fw-bold text-white" style="background: linear-gradient(135deg,#ff6600,#e55d00); border-radius: 10px; height: 40px; font-size: 14px;" type="button">
                ค้นหา
              </button>
            </div>
          </form>
        </aside>

        <!-- 📋 ผู้สมัคร -->
        <section class="job-results flex-grow-1">
          <h5 class="mb-2 text-orange">พบ {{ filteredApplicants.length }} ผู้สมัคร</h5>
          <div class="row g-4">
            <div
              class="col-md-6 col-lg-4"
              v-for="(applicant, index) in filteredApplicants"
              :key="index"
            >
              <router-link
                :to="`/employer/applicant/${applicant.applicant_id}`"
                class="text-decoration-none text-dark"
              >
                <div class="card shadow-sm rounded-4 p-3 h-100">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <img
                      :src="getImageUrl(applicant.profile_img_url)"
                      alt="avatar"
                      width="64"
                      height="64"
                      class="rounded-circle border object-fit-cover"
                    />
                    <div>
                      <div class="fw-bold">
                        {{ applicant.a_position || "ไม่ระบุตำแหน่ง" }}
                      </div>
                      <small class="text-muted">กำลังมองหางาน</small>
                    </div>
                  </div>

                  <div class="mb-1">
                    ชื่อ: {{ applicant.a_firstname }} {{ applicant.a_lastname }}
                  </div>
                  <div class="mb-1">
                    คณะ: {{ applicant.a_faculty || "ไม่ระบุ" }}
                  </div>
                  <div class="mb-1">
                    เพศ: {{ applicant.a_gender || "ไม่ระบุ" }}
                  </div>
                  <div class="mb-1">
                    เบอร์โทร: {{ applicant.a_phone || "ไม่ระบุ" }}
                  </div>
                  <div class="mb-1">
                    อีเมล: {{ applicant.a_email || "ไม่ระบุ" }}
                  </div>
                  <div class="text-end">
                    <small class="text-muted">ID: {{ applicant.applicant_id }}</small>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

          <div v-if="filteredApplicants.length === 0" class="text-muted mt-4">
            ไม่พบข้อมูลผู้สมัครที่ตรงกับเงื่อนไข
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarEmployer from "@/components/NavbarEmployer.vue";
import axios from "axios";

export default {
  name: "SearchApplicants",
  components: { NavbarEmployer },
  data() {
    return {
      applicants: [],
      filters: {
        name: "",
        position: "",
        faculty: "",
        gender: "",
        phone: "",
        email: ""
      }
    };
  },
  computed: {
    filteredApplicants() {
      return this.applicants.filter((a) => {
        const fullName = `${a.a_firstname} ${a.a_lastname}`.toLowerCase();
        return (
          fullName.includes(this.filters.name.toLowerCase()) &&
          (a.a_position || "").toLowerCase().includes(this.filters.position.toLowerCase()) &&
          (a.a_faculty || "").toLowerCase().includes(this.filters.faculty.toLowerCase()) &&
          (a.a_gender || "").toLowerCase().includes(this.filters.gender.toLowerCase()) &&
          (a.a_phone || "").toLowerCase().includes(this.filters.phone.toLowerCase()) &&
          (a.a_email || "").toLowerCase().includes(this.filters.email.toLowerCase())
        );
      });
    }
  },
  mounted() {
    this.fetchApplicants();
  },
  methods: {
    fetchApplicants() {
      axios
        .get("http://localhost:3001/api/applicants")
        .then((res) => {
          this.applicants = res.data;
        })
        .catch((err) => {
          console.error("❌ ไม่สามารถโหลดผู้สมัครได้:", err);
        });
    },
    getImageUrl(path) {
      return path
        ? `http://localhost:3001${path}`
        : "https://cdn-icons-png.flaticon.com/512/921/921347.png";
    },
    clearFilters() {
      this.filters = {
        name: "",
        position: "",
        faculty: "",
        gender: "",
        phone: "",
        email: ""
      };
    }
  }
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}

.card {
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.object-fit-cover {
  object-fit: cover;
}
</style>
