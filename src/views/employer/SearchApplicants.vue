<template>
  <div>
    <NavbarEmployer />

    <div class="p-5">
      <h2 class="fw-bold mb-4 text-orange">รายชื่อผู้หางาน</h2>

      <div class="row g-4">
        <div class="col-md-6 col-lg-4" v-for="(applicant, index) in applicants" :key="index">
          <router-link :to="`/employer/applicant/${applicant.applicant_id}`" class="text-decoration-none text-dark">
            <div class="card shadow-sm rounded-4 p-3 h-100">
              <div class="d-flex align-items-center gap-3 mb-3">
                <img :src="getImageUrl(applicant.profile_img_url)" alt="avatar" width="64" height="64"
                  class="rounded-circle border object-fit-cover" />
                <div>
                  <div class="fw-bold">
                    {{ applicant.a_interest_position || "ไม่ระบุตำแหน่ง" }}
                  </div>
                  <small class="text-muted">กำลังมองหางาน</small>
                </div>
              </div>

              <div class="mb-1">
                ชื่อ: {{ applicant.a_firstname }} {{ applicant.a_lastname }}
              </div>
              <div class="mb-1">
                ระดับการศึกษา: {{ applicant.a_education_level || "ไม่ระบุ" }}
              </div>
              <div class="mb-1">
                คณะ: {{ applicant.a_faculty || "ไม่ระบุ" }}
              </div>
              <div class="mb-1">
                สาขาวิชา: {{ applicant.a_major || "ไม่ระบุ" }}
              </div>
              <div class="text-end">
                <small class="text-muted">ID: {{ applicant.applicant_id }}</small>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div v-if="applicants.length === 0" class="text-muted mt-4">
        ไม่พบข้อมูลผู้สมัคร
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
    };
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
  },
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
