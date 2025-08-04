<template>
  <div>
    <NavbarEmployer />

    <div class="container-fluid px-4 py-5">
      <h2 class="fw-bold mb-4 text-orange">รายชื่อผู้หางาน</h2>

      <div class="row">
        <!-- 🔍 Sidebar Filter -->
        <div class="col-lg-3 mb-4">
          <div class="bg-white shadow-sm p-4 rounded-4">
            <h6 class="fw-bold mb-3 text-orange">ค้นหาผู้สมัคร</h6>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control mb-3 rounded-pill"
              placeholder="เช่น สมรักษ์ หรือ นักออกแบบ"
            />
            <button @click="searchApplicants" class="btn btn-sm btn-primary rounded-pill w-100">
              ค้นหา
            </button>
          </div>
        </div>

        <!-- 📋 ผู้สมัคร -->
        <div class="col-lg-9">
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
        </div>
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
      searchQuery: ""
    };
  },
  computed: {
    filteredApplicants() {
      if (!this.searchQuery) return this.applicants;

      const keyword = this.searchQuery.toLowerCase();
      return this.applicants.filter((a) => {
        const name = `${a.a_firstname} ${a.a_lastname}`.toLowerCase();
        const position = (a.a_position || "").toLowerCase();
        return name.includes(keyword) || position.includes(keyword);
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
    searchApplicants() {
      // ไม่ต้องทำอะไร เพราะใช้ computed filter แล้ว
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
