<template>
  <div>
    <AdminNavbar />
    <div class="d-flex">
      <AdminSidebar />
      <div class="p-4 flex-1">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="fw-bold text-orange mb-0">
            <i class="bi bi-briefcase-fill me-2"></i> งานทั้งหมด
          </h4>
          <button class="btn btn-primary" @click="openCreate">
            <i class="bi bi-plus-lg me-1"></i> เพิ่มงาน
          </button>
        </div>

        <!-- ตัวกรองเล็กๆ (ถ้าอยากใช้) -->
        <div class="d-flex gap-2 mb-3 flex-wrap">
          <input v-model="searchQuery" class="form-control" style="max-width: 320px" placeholder="🔍 ค้นหาชื่องาน" />
          
        </div>

        <table class="table table-bordered table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th style="width: 60px">#</th>
              <th>ชื่องาน</th>
              <th style="width: 140px">หมวดหมู่</th>
              <th style="width: 160px">ค่าจ้าง</th>
              <th>ผู้โพสต์</th>
              <th style="width: 240px">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(job, index) in filteredJobs" :key="job.id">
              <td>{{ index + 1 }}</td>
              <td class="fw-semibold">{{ job.j_title }}</td>
              <td><span class="badge bg-secondary">{{ job.j_type }}</span></td>
              <td>{{ formatSalary(job.j_salary) }}</td>
              <td>{{ job.employer_name || "-" }}</td>
              <td class="text-nowrap">
                <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(job)">
                  <i class="bi bi-pencil-square me-1"></i>แก้ไข
                </button>
                <button class="btn btn-sm btn-danger" @click="confirmDelete(job)">
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

                  <div class="col-12">
                    <label class="form-label">รายละเอียดงาน</label>
                    <textarea v-model.trim="form.j_description" rows="4" class="form-control"
                              placeholder="หน้าที่ งานที่ต้องทำ ทักษะที่ต้องมี ฯลฯ"></textarea>
                  </div>
                </div>

                <div v-if="errorMsg" class="alert alert-danger mt-3 py-2">
                  <i class="bi bi-exclamation-triangle me-1"></i>{{ errorMsg }}
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                  {{ formMode === 'create' ? 'บันทึกงาน' : 'บันทึกการแก้ไข' }}
                </button>
              </div>
            </form>
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

export default {
  components: { AdminNavbar, AdminSidebar },
  data() {
    return {
      jobs: [],
      searchQuery: "",
      typeFilter: "",
      // modal + form
      modals: { upsert: null },
      formMode: "create", // 'create' | 'edit'
      form: {
        id: null,
        j_title: "",
        j_type: "",
        j_salary: 0,
        j_location: "",
        j_description: "",
        employer_name: ""
      },
      loading: false,
      errorMsg: "",
    };
  },
  computed: {
    filteredJobs() {
      const key = this.searchQuery.toLowerCase().trim();
      return this.jobs.filter((j) => {
        const matchType = !this.typeFilter || j.j_type === this.typeFilter;
        const matchKey =
          !key ||
          j.j_title?.toLowerCase().includes(key) ||
          j.j_location?.toLowerCase().includes(key);
        return matchType && matchKey;
      });
    },
  },
  async mounted() {
    this.modals.upsert = new bootstrap.Modal(document.getElementById("upsertJobModal"));
    await this.fetchJobs();
  },
  methods: {
    authHeader() {
      const token = localStorage.getItem("admin_token");
      return token ? { Authorization: token } : {};
    },
    async fetchJobs() {
      try {
        const res = await fetch(API, { headers: { ...this.authHeader() } });
        if (!res.ok) throw new Error("โหลดงานล้มเหลว");
        this.jobs = await res.json();
      } catch (err) {
        console.error(err);
      }
    },
    // ----- Create/Edit -----
    openCreate() {
      this.formMode = "create";
      this.resetForm();
      this.modals.upsert.show();
    },
    openEdit(job) {
      this.formMode = "edit";
      this.resetForm();
      this.form = {
        id: job.id,
        j_title: job.j_title || "",
        j_type: job.j_type || "",
        j_salary: Number(job.j_salary) || 0,
        j_location: job.j_location || "",
        j_description: job.j_description || "",
        employer_name: job.employer_name || "",
      };
      this.modals.upsert.show();
    },
    resetForm() {
      this.errorMsg = "";
      this.form = {
        id: null,
        j_title: "",
        j_type: "",
        j_salary: 0,
        j_location: "",
        j_description: "",
        employer_name: "",
      };
    },
    async submitJob() {
      this.loading = true;
      this.errorMsg = "";
      try {
        if (!this.form.j_title || !this.form.j_type || this.form.j_salary === null) {
          this.errorMsg = "กรอกข้อมูลที่จำเป็นให้ครบถ้วน";
          return;
        }
        if (this.formMode === "create") {
          const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...this.authHeader() },
            body: JSON.stringify(this.form),
          });
          if (!res.ok) throw new Error(await res.text());
          const created = await res.json();
          this.jobs.unshift(created);
        } else {
          const res = await fetch(`${API}/${this.form.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...this.authHeader() },
            body: JSON.stringify({
              j_title: this.form.j_title,
              j_type: this.form.j_type,
              j_salary: this.form.j_salary,
              j_location: this.form.j_location,
              j_description: this.form.j_description,
              employer_name: this.form.employer_name,
            }),
          });
          if (!res.ok) throw new Error(await res.text());
          const updated = await res.json();
          const idx = this.jobs.findIndex((j) => j.id === updated.id);
          if (idx !== -1) this.jobs.splice(idx, 1, updated);
        }
        this.modals.upsert.hide();
      } catch (err) {
        console.error(err);
        this.errorMsg = "บันทึกไม่สำเร็จ";
      } finally {
        this.loading = false;
      }
    },
    // ----- Delete -----
    confirmDelete(job) {
      if (confirm(`ยืนยันลบงาน: ${job.j_title}?`)) {
        this.deleteJob(job.id);
      }
    },
    async deleteJob(id) {
      try {
        const res = await fetch(`${API}/${id}`, {
          method: "DELETE",
          headers: { ...this.authHeader() },
        });
        if (!res.ok) throw new Error(await res.text());
        this.jobs = this.jobs.filter((j) => j.id !== id);
      } catch (err) {
        console.error(err);
        alert("ลบงานไม่สำเร็จ");
      }
    },
    // ----- Utils -----
    formatSalary(v) {
      const n = Number(v || 0);
      return `${n.toLocaleString()} บาท`;
    },
  },
};
</script>

<style scoped>
.flex-1 { flex: 1; }
.text-orange { color: #ff6600; }
.table td, .table th { vertical-align: middle; }
.modal .form-label { font-weight: 600; }
</style>
