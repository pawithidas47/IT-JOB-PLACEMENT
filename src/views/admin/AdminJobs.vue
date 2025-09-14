<template>   
  <div>
    <AdminNavbar />
    <div class="d-flex">
      <AdminSidebar />
      <div class="p-4 flex-1">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="fw-bold text-orange mb-0">
            <i class="bi bi-briefcase-fill me-2"></i> งานทั้งหมด
          </h4>
          <button class="btn-pill btn-emerald" @click="openCreate">
            <i class="bi bi-plus-lg me-1"></i> เพิ่มงาน
          </button>
        </div>

        <!-- Filters -->
        <div class="filter-row mb-3">
          <input v-model="searchQuery" class="form-control search" placeholder="🔍 ค้นหาชื่องาน/สถานที่" />
          <select v-model="typeFilter" class="form-select compact select-fit">
            <option value="">— เลือกหมวดหมู่ —</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <!-- Table -->
        <table class="table table-hover align-middle user-table">
          <thead>
            <tr>
              <th style="width:60px">#</th>
              <th>ชื่องาน</th>
              <th style="width:200px">หมวดหมู่</th>
              <th style="width:160px">ค่าจ้าง</th>
              <th>ผู้โพสต์</th>
              <th style="width:300px">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(job, index) in filteredJobs" :key="job.id">
              <td>{{ index + 1 }}</td>
              <td class="fw-semibold">{{ job.j_title }}</td>
              <td class="text-slate">{{ job.j_type || "-" }}</td>
              <td>{{ displaySalary(job) }}</td>
              <td>{{ job.employer_name || "-" }}</td>
              <td class="text-nowrap">
                <button class="btn-pill btn-violet me-1" @click="viewJob(job)">
                  <i class="bi bi-eye me-1"></i>ดูงาน
                </button>
                <button class="btn-pill btn-sky me-1" @click="openEdit(job)">
                  <i class="bi bi-pencil-square me-1"></i>แก้ไข
                </button>
                <button class="btn-pill btn-rose" @click="confirmDelete(job)">
                  <i class="bi bi-trash me-1"></i>ลบ
                </button>
              </td>
            </tr>
            <tr v-if="filteredJobs.length === 0">
              <td colspan="6" class="text-muted text-center">ไม่มีข้อมูลงาน</td>
            </tr>
          </tbody>
        </table>

        <!-- Modal เพิ่ม/แก้ไข งาน -->
        <div class="modal fade" id="upsertJobModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <form class="modal-content p-3" @submit.prevent="submitJob">
              <div class="modal-header">
                <h5 class="modal-title">{{ formMode === 'create' ? 'เพิ่มงานใหม่' : 'แก้ไขงาน' }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-8">
                    <label class="form-label">ชื่องาน <span class="text-danger">*</span></label>
                    <input v-model.trim="form.j_title" type="text" class="form-control" required />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">หมวดหมู่ <span class="text-danger">*</span></label>
                    <select v-model="form.j_type" class="form-select compact" required>
                      <option disabled value="">— เลือกหมวดหมู่ —</option>
                      <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                    </select>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label">ค่าจ้าง (บาท) <span class="text-danger">*</span></label>
                    <input v-model.number="form.j_salary" type="number" min="0" step="1" class="form-control" required />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">สถานที่</label>
                    <input v-model.trim="form.j_location" type="text" class="form-control" placeholder="เช่น พิษณุโลก / Remote" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">ผู้โพสต์ (ชื่อบริษัท/ผู้ว่าจ้าง)</label>
                    <input v-model.trim="form.employer_name" type="text" class="form-control" />
                  </div>
                </div>

                <div v-if="errorMsg" class="alert alert-danger mt-3 py-2">
                  <i class="bi bi-exclamation-triangle me-1"></i>{{ errorMsg }}
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn-pill btn-slate" data-bs-dismiss="modal">ยกเลิก</button>
                <button type="submit" class="btn-pill btn-emerald" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                  {{ formMode === 'create' ? 'บันทึกงาน' : 'บันทึกการแก้ไข' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal ดูงาน -->
        <div class="modal fade" id="viewJobModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content p-3">
              <div class="modal-header">
                <h5 class="modal-title">รายละเอียดงาน</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <p><strong>ชื่องาน:</strong> {{ selectedJob.j_title }}</p>
                <p><strong>หมวดหมู่:</strong> {{ selectedJob.j_type }}</p>
                <p><strong>ค่าจ้าง:</strong> {{ displaySalary(selectedJob) }}</p>
                <p><strong>สถานที่:</strong> {{ selectedJob.j_location || '-' }}</p>
                <p><strong>ผู้โพสต์:</strong> {{ selectedJob.employer_name || '-' }}</p>
                <p><strong>รายละเอียด:</strong></p>
                <p>{{ selectedJob.j_description || '—' }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import AdminNavbar from "@/components/admin/AdminNavbar.vue";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import * as bootstrap from "bootstrap";

const API = "http://localhost:3001/api/admin/jobs";

const CATEGORIES = [
  "การตลาดดิจิทัล","งานแปล / เขียนบทความ","งานตัดต่อวิดีโอ / สร้างคอนเทนต์",
  "งานออกแบบ UX/UI","งานออกแบบกราฟิก / มัลติมีเดีย","คีย์ข้อมูล / ป้อนข้อมูล",
  "ดูแลระบบเครือข่าย","พัฒนาเว็บไซต์","พัฒนาแอปพลิเคชัน",
  "ผู้ดูแลเพจ / โซเชียลมีเดีย","ที่ปรึกษาด้านเทคโนโลยี","สนับสนุนงานไอที (IT Support)","อื่น ๆ",
];

export default {
  components: { AdminNavbar, AdminSidebar },
  data() {
    return {
      categories: CATEGORIES,
      jobs: [],
      searchQuery: "",
      typeFilter: "",
      modals: { upsert: null, view: null },
      formMode: "create",
      form: { id: null, j_title: "", j_type: "", j_salary: null, j_location: "", j_description: "", employer_name: "", employer_id: null },
      selectedJob: {},
      loading: false,
      errorMsg: "",
    };
  },

  computed: {
    filteredJobs() {
      const key = this.searchQuery.toLowerCase().trim();
      return this.jobs.filter((j) => {
        const byType = !this.typeFilter || j.j_type === this.typeFilter;
        const byKey  = !key || j.j_title?.toLowerCase().includes(key) || j.j_location?.toLowerCase().includes(key);
        return byType && byKey;
      });
    },
  },

  async mounted() {
    this.modals.upsert = new bootstrap.Modal(document.getElementById("upsertJobModal"));
    this.modals.view   = new bootstrap.Modal(document.getElementById("viewJobModal"));
    await this.fetchJobs();
  },

  methods: {
    viewJob(job) {
      this.selectedJob = job;
      this.modals.view.show();
    },
    authHeader() {
      const token = localStorage.getItem("admin_token");
      return token ? { Authorization: token } : {};
    },
    normalizeSalary(...vals) {
      for (const v of vals) {
        if (v == null) continue;
        const n = Number(v);
        if (Number.isFinite(n)) return n;
        if (typeof v === "string") {
          const m = v.match(/([\d,]+)/);
          if (m) {
            const num = Number(m[1].replace(/,/g, ""));
            if (Number.isFinite(num)) return num;
          }
        }
      }
      return null;
    },
    isNegotiable(v) {
      return typeof v === "string" && /ตามตกลง|negotiable/i.test(v.trim());
    },
    async fetchJobs() {
      try {
        const res = await fetch(`${API}?t=${Date.now()}`, { headers: { ...this.authHeader() }, cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const rows = await res.json();
        this.jobs = Array.isArray(rows) ? rows : [];
      } catch (e) {
        console.error(e);
      }
    },
    openCreate() {
      this.formMode = "create";
      this.resetForm();
      this.modals.upsert.show();
    },
    openEdit(job) {
      this.formMode = "edit";
      this.resetForm();
      this.form = { ...job };
      this.modals.upsert.show();
    },
    resetForm() {
      this.errorMsg = "";
      this.form = { id: null, j_title: "", j_type: "", j_salary: null, j_location: "", j_description: "", employer_name: "", employer_id: null };
    },
    async submitJob() {
      this.loading = true;
      this.errorMsg = "";
      try {
        const payload = { ...this.form, j_salary: Number(this.normalizeSalary(this.form.j_salary)) };
        if (!payload.j_title || !payload.j_type || isNaN(payload.j_salary)) {
          this.errorMsg = "กรอกข้อมูลที่จำเป็นให้ครบถ้วน";
          return;
        }
        let res;
        if (this.formMode === "create") {
          res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json", ...this.authHeader() }, body: JSON.stringify(payload) });
        } else {
          res = await fetch(`${API}/${this.form.id}`, { method: "PUT", headers: { "Content-Type": "application/json", ...this.authHeader() }, body: JSON.stringify(payload) });
        }
        if (!res.ok) throw new Error(await res.text());
        await this.fetchJobs();
        this.modals.upsert.hide();
      } catch (err) {
        console.error(err);
        this.errorMsg = err.message || "บันทึกไม่สำเร็จ";
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(job) {
      if (confirm(`ยืนยันลบงาน: ${job.j_title}?`)) this.deleteJob(job.id);
    },
    async deleteJob(id) {
      try {
        const res = await fetch(`${API}/${id}`, { method: "DELETE", headers: { ...this.authHeader() } });
        if (!res.ok) throw new Error(await res.text());
        this.jobs = this.jobs.filter(j => j.id !== id);
      } catch (e) {
        console.error(e);
        alert("ลบงานไม่สำเร็จ");
      }
    },
    displaySalary(job) {
      if (this.isNegotiable(job?.j_salary)) return "ตามตกลง";
      const n = this.normalizeSalary(job?.j_salary);
      return Number.isFinite(n) ? `${n.toLocaleString()} บาท` : "-";
    }
  }
};
</script>

<style scoped>
/* shared */
.flex-1 { flex: 1; }
.text-orange { color: #ff6600; }

/* Filter bar – ให้หน้าตาเท่ากับหน้า user */
.filter-row{
  display:flex; gap:12px; align-items:center; flex-wrap:wrap;
}
.filter-row .search{
  flex:1 1 300px; max-width:360px;
}
.form-select.compact{
  height:36px; padding:.25rem .75rem; font-size:.9rem;
  border-radius:999px; /* ดรอปดาวมนๆ เหมือนหน้า user */
}
.select-fit{ width:auto; min-width:160px; max-width:240px; }

/* Table – เหมือนหน้า user */
.user-table{ width:100%; }
.user-table thead tr{ background:#fafafa; }
.user-table th{
  font-weight:700; color:#333; border-bottom:1px solid #eee;
}
.user-table td{ border-bottom:1px solid #f1f1f1; }

/* หมวดหมู่ (แสดงเป็นข้อความธรรมดา ไม่เป็นชิป) */
.text-slate{ color:#475569; font-weight:500; }

/* ปุ่ม – เส้นขอบมนๆ แบบ outline และค่อยเติมสีตอน hover */
.btn-pill{
  border-radius:999px; font-weight:600; font-size:13.5px;
  padding:8px 14px; background:transparent; transition:.2s ease;
  display:inline-flex; align-items:center; gap:4px;
}

/* ดูงาน */
.btn-violet{ border:2px solid #7c3aed; color:#7c3aed; }
.btn-violet:hover{ background:#7c3aed; color:#fff; }

/* แก้ไข */
.btn-sky{ border:2px solid #0ea5e9; color:#0ea5e9; }
.btn-sky:hover{ background:#0ea5e9; color:#fff; }

/* ลบ */
.btn-rose{ border:2px solid #e11d48; color:#e11d48; }
.btn-rose:hover{ background:#e11d48; color:#fff; }

/* เพิ่มงาน / บันทึก */
.btn-emerald{ border:2px solid #10b981; color:#10b981; }
.btn-emerald:hover{ background:#10b981; color:#fff; }

/* ยกเลิก */
.btn-slate{ border:2px solid #64748b; color:#64748b; }
.btn-slate:hover{ background:#64748b; color:#fff; }

/* โมดัล */
.modal .form-label{ font-weight:600; }
</style>

