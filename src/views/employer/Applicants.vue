<template>
  <div>
    <NavbarEmployer />

    <div class="container py-6" style="max-width: 1100px">
      <!-- Header -->
      <div class="header-row">
        <div class="title-wrap">
          <span class="dot"></span>
          <h2 class="page-title">ผู้สมัครงานทั้งหมด</h2>
          <span class="muted">พบ {{ filteredApplicants.length }} รายการ</span>
        </div>

        <div class="action-wrap">
          <div class="search-wrap">
            <i class="bi bi-search"></i>
            <input
              v-model="searchQuery"
              class="search-input"
              placeholder="ค้นหาชื่อผู้สมัคร / ชื่องาน"
            />
          </div>
          <select v-model="sortOption" class="select-pill">
            <option value="date">ใหม่ล่าสุด</option>
            <option value="status">เรียงตามสถานะ</option>
          </select>
        </div>
      </div>

      <!-- empty -->
      <div v-if="filteredApplicants.length === 0" class="empty">
        <i class="bi bi-person-x"></i>
        <div>ยังไม่มีผู้สมัครที่ตรงกับเงื่อนไข</div>
      </div>

      <!-- list -->
      <div
        v-for="app in filteredApplicants"
        :key="app.application_id"
        class="app-card"
      >
        <!-- avatar -->
        <div class="avatar">
          <img :src="app.profileImage" alt="avatar" />
        </div>

        <!-- info -->
        <div class="info">
          <div class="name">
            {{ app.applicant.a_firstname }} {{ app.applicant.a_lastname }}
          </div>
          <div class="row-brief">
            <span class="icon-text"><i class="bi bi-briefcase"></i>{{ app.j_title }}</span>
            <span class="sep">•</span>
            <span class="icon-text"><i class="bi bi-calendar-event"></i>สมัครเมื่อ {{ formatDate(app.applied_at) }}</span>
          </div>
          <div class="row-brief muted">
            <span class="icon-text"><i class="bi bi-telephone"></i>{{ app.applicant.a_phone || '-' }}</span>
            <span class="sep">•</span>
            <span class="icon-text"><i class="bi bi-envelope"></i>{{ app.applicant.a_email || '-' }}</span>
          </div>
        </div>

        <!-- actions (fixed column) -->
        <div class="actions">
          <!-- ============= STATUS AREA (มีได้แค่ 'หนึ่ง' อันต่อการ์ด) ============= -->
          <!-- pending: โชว์ปุ่มคู่ -->
          <div v-if="app.status === 'pending'" class="decision">
            <button class="seg seg-approve" @click="applyDecision(app,'approved')">
              <i class="bi bi-check2"></i> อนุมัติ
            </button>
            <button class="seg seg-reject" @click="applyDecision(app,'rejected')">
              <i class="bi bi-x-lg"></i> ปฏิเสธ
            </button>
          </div>

          <!-- not pending: โชว์ชิปสถานะ 'อันเดียว' -->
          <div v-else class="status-wrap">
            <div class="status-pill" :class="pillClass(app.status)">
              {{ statusText(app.status) }}
            </div>
          </div>
          <!-- ==================================================================== -->

          <router-link
            :to="{ name:'EmployerApplicantProfile', params:{ id: app.applicant.applicant_id } }"
            class="btn-lite w-100"
            title="ดูโปรไฟล์"
          >
            <i class="bi bi-person-lines-fill"></i><span>โปรไฟล์</span>
          </router-link>

          <a
            v-if="app.resume_url"
            :href="`http://localhost:3001${app.resume_url}`"
            target="_blank"
            class="btn-lite w-100"
            title="เปิดเรซูเม่"
          >
            <i class="bi bi-file-earmark-text"></i><span>Resume</span>
          </a>

          <button class="btn-lite danger w-100" @click="deleteApplicant(app.application_id)">
            <i class="bi bi-trash3"></i><span>ลบ</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";
import defaultProfile from "@/assets/default-profile.png";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default {
  name: "EmployerApplicants",
  components: { NavbarEmployer },
  data() {
    return {
      user: null,
      applicants: [],
      defaultProfile,
      searchQuery: "",
      sortOption: "date",
    };
  },
  computed: {
    filteredApplicants() {
      const q = this.searchQuery.trim().toLowerCase();
      let list = this.applicants.filter((a) => {
        const name = `${a.applicant.a_firstname} ${a.applicant.a_lastname}`.toLowerCase();
        const title = (a.j_title || "").toLowerCase();
        return name.includes(q) || title.includes(q);
      });
      if (this.sortOption === "date") {
        list.sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at));
      } else {
        list.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
      }
      return list;
    },
  },
  async mounted() {
    const local = localStorage.getItem("user");
    if (!local) return this.$router.push("/login");
    this.user = JSON.parse(local);
    await this.fetchApplicants();
  },
  methods: {
    formatDate(s) {
      if (!s) return "-";
      const d = new Date(s);
      return isNaN(d)
        ? "-"
        : d.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });
    },
    statusText(s) {
      switch (s) {
        case "approved": return "อนุมัติแล้ว";
        case "rejected": return "ปฏิเสธแล้ว";
        default: return "รอดำเนินการ";
      }
    },
    pillClass(s) {
      return {
        'pill--pending': s === 'pending',
        'pill--ok': s === 'approved',
        'pill--no': s === 'rejected',
      };
    },
    async fetchApplicants() {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/employers/${this.user.employer_id}/applicants`
        );
        this.applicants = data.map((app) => ({
          ...app,
          status: app.status || "pending",
          profileImage: app.applicant?.profile_img_url
            ? `http://localhost:3001${app.applicant.profile_img_url}`
            : this.defaultProfile,
          resume_url: app.resume_url || null,
        }));
      } catch (err) {
        console.error("❌ โหลดผู้สมัครล้มเหลว:", err);
      }
    },
    async applyDecision(app, newStatus) {
  // ✅ Pop-up ยืนยันทั้งอนุมัติ และปฏิเสธ
  let title = "";
  let confirmText = "";
  let confirmColor = "";

  if (newStatus === "approved") {
    title = `ยืนยันการอนุมัติ ${app.applicant.a_firstname} ${app.applicant.a_lastname}?`;
    confirmText = "อนุมัติ";
    confirmColor = "#22c55e"; // เขียว
  } else if (newStatus === "rejected") {
    title = `ยืนยันการปฏิเสธ ${app.applicant.a_firstname} ${app.applicant.a_lastname}?`;
    confirmText = "ปฏิเสธ";
    confirmColor = "#ef4444"; // แดง
  }

  const res = await Swal.fire({
    title,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "ยกเลิก",
    reverseButtons: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: "#9ca3af",
  });

  if (!res.isConfirmed) return; // ❌ กดยกเลิก → ไม่ทำอะไร

  // ✅ ถ้ากดยืนยัน → call API อัปเดตสถานะ
  try {
    await axios.put(
      `http://localhost:3001/api/employer/applications/${app.application_id}/status`,
      { app_status: newStatus },
      { headers: { "Content-Type": "application/json" } }
    );
    app.status = newStatus;

    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "success",
      title: "อัปเดตสถานะสำเร็จ",
      showConfirmButton: false,
      timer: 1700,
      timerProgressBar: true,
    });
  } catch (err) {
    console.error("❌ เปลี่ยนสถานะล้มเหลว:", err.response?.data || err.message);
    Swal.fire({ icon: "error", title: "อัปเดตไม่สำเร็จ", text: "กรุณาลองใหม่อีกครั้ง" });
  }
}
,
    async deleteApplicant(applicationId) {
      const res = await Swal.fire({
        title: "ลบผู้สมัคร?",
        text: "การลบไม่สามารถย้อนกลับได้",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก",
        reverseButtons: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#9ca3af",
      });
      if (!res.isConfirmed) return;

      try {
        await axios.delete(`http://localhost:3001/api/applications/${applicationId}`);
        this.applicants = this.applicants.filter(a => a.application_id !== applicationId);
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "success",
          title: "ลบเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 1400,
        });
      } catch (err) {
        console.error("❌ ลบไม่สำเร็จ:", err);
        Swal.fire({ icon: "error", title: "ลบไม่สำเร็จ", text: "กรุณาลองใหม่" });
      }
    },
  },
};
</script>

<style scoped>
/* ===== layout ===== */
.py-6{padding-top:2rem;padding-bottom:2rem}
.muted{color:#9aa3ae;font-size:.95rem}
.icon-text{display:inline-flex;align-items:center;gap:.45rem}
.icon-text i{color:#94a3b8}
.sep{color:#cbd5e1;margin:0 .5rem}

/* header */
.header-row{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1rem}
.title-wrap{display:flex;align-items:center;gap:.6rem}
.page-title{margin:0;font-weight:800;color:#111827}
.dot{width:.7rem;height:.7rem;background:#ff6600;border-radius:999px;display:inline-block}
.action-wrap{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap}
.search-wrap{position:relative;min-width:320px;flex:1}
.search-wrap i{position:absolute;left:.85rem;top:50%;transform:translateY(-50%);color:#9aa3ae}
.search-input{width:100%;padding:.7rem .9rem .7rem 2.3rem;border:1px solid #e5e7eb;border-radius:999px;outline:none;background:#fff}
.search-input:focus{border-color:#ff9052;box-shadow:0 0 0 4px rgba(255,102,0,.12)}
.select-pill{height:38px;padding:0 14px;border-radius:999px;border:1px solid #e5e7eb;background:#fff;color:#111827}

/* empty */
.empty{text-align:center;color:#9aa3ae;padding:4rem 0}
.empty i{font-size:42px;display:block;margin-bottom:.5rem}

/* card grid */
.app-card{
  background:#fff;border:1px solid #eef1f4;border-radius:18px;padding:18px;
  display:grid;grid-template-columns:84px 1fr 260px;gap:16px;align-items:center;
  margin-bottom:14px;box-shadow:0 4px 18px rgba(17,24,39,.04);
  transition:transform .15s, box-shadow .15s; min-height:130px;
}
.app-card:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(17,24,39,.08)}

.avatar img{width:84px;height:84px;object-fit:cover;border-radius:50%;border:4px solid #f6f7fb}

.info .name{font-weight:800;color:#0f172a;font-size:1.06rem;margin-bottom:4px}
.row-brief{display:flex;align-items:center;flex-wrap:wrap;gap:.35rem .45rem;font-size:.95rem;color:#334155}
.row-brief.muted{color:#94a3b8}

.actions{justify-self:end;display:flex;flex-direction:column;gap:.55rem;min-width:240px}

/* ======== STATUS AREA ======== */
/* pending: segmented buttons */
.decision{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.seg{
  display:inline-flex;align-items:center;justify-content:center;gap:.4rem;
  border:1px solid #e5e7eb;background:#fff;padding:.52rem .6rem;border-radius:10px;
  font-size:.9rem;color:#0f172a;transition:border-color .15s, box-shadow .15s, transform .05s;
}
.seg:active{transform:translateY(1px)}
.seg-approve:hover{border-color:#22c55e;box-shadow:0 2px 10px rgba(34,197,94,.12)}
.seg-reject:hover{border-color:#ef4444;box-shadow:0 2px 10px rgba(239,68,68,.12)}

/* decided: single pill */
.status-wrap{display:flex;justify-content:flex-end}
.status-pill{
  padding:.38rem .75rem;border-radius:999px;font-size:.82rem;font-weight:600;border:1px solid transparent;
}
.pill--pending{background:#f3f4f6;color:#374151;border-color:#e5e7eb}
.pill--ok{background:#ecfdf5;color:#065f46;border-color:#a7f3d0}
.pill--no{background:#fef2f2;color:#991b1b;border-color:#fecaca}
/* ================================= */

/* utility buttons */
.btn-lite{display:inline-flex;align-items:center;gap:.4rem;border:1px solid #e5e7eb;background:#fff;padding:.48rem .6rem;border-radius:10px;font-size:.9rem;color:#0f172a;transition:border-color .15s, box-shadow .15s}
.btn-lite:hover{border-color:#ff9052;box-shadow:0 2px 10px rgba(255,102,0,.12)}
.btn-lite.danger:hover{border-color:#ef4444;box-shadow:0 2px 10px rgba(239,68,68,.12)}
.w-100{width:100%}
</style>
