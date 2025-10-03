<template> 
  <div>
    <AdminNavbar />
    <div class="d-flex">
      <AdminSidebar />
      <div class="p-4 flex-1">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="fw-bold text-orange mb-0">
            <i class="bi bi-people-fill me-2"></i> ผู้ใช้ทั้งหมด
          </h4>
          
        </div>

        <!-- Filters (uniform) -->
        <div class="filter-row mb-3">
          <input v-model="searchQuery" class="form-control search" placeholder="🔍 ค้นหาชื่อ/อีเมล/เบอร์โทร" />
          <select v-model="userTypeFilter" class="form-select compact select-fit">
            <option value="">ผู้ใช้ทั้งหมด</option>
            <option value="applicant">ผู้สมัครงาน</option>
            <option value="employer">ผู้ว่าจ้าง</option>
          </select>
        </div>

        <!-- Table -->
        <table class="table table-hover align-middle user-table">
          <thead>
            <tr>
              <th style="width:60px">#</th>
              <th>ชื่อผู้ใช้</th>
              <th>อีเมล</th>
              <th>เบอร์โทร</th>
              <th style="width:140px">ประเภท</th>
              <th style="width:140px">สถานะ</th>
              <th style="width:320px">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id">
              <td>{{ index + 1 }}</td>
              <td class="fw-semibold">{{ user.name }}</td>
              <td>{{ user.email || '—' }}</td>
              <td>{{ user.phone || '—' }}</td>

              <td>
                <span class="chip"
                  :class="{
                    'chip-slate': user.roleRaw === 'applicant',
                    'chip-indigo': user.roleRaw === 'employer'
                  }">
                  {{ user.roleTh }}
                </span>
              </td>
              <td>
                <span class="chip" :class="user.statusTh === 'ใช้งาน' ? 'chip-emerald' : 'chip-rose'">
                  {{ user.statusTh }}
                </span>
              </td>

              <td class="text-nowrap">  <button class="btn-pill btn-violet me-1" @click="viewUser(user)">
                  <i class="bi bi-person-badge me-1"></i>ดูโปรไฟล์
                </button>
               
                <button class="btn-pill btn-sky me-1" @click="openEdit(user)">
                  <i class="bi bi-pencil-square me-1"></i>แก้ไข
                </button>
               <button class="btn-pill btn-rose" @click="confirmDelete(user)">
                  <i class="bi bi-trash me-1"></i>ลบ
                </button>
              </td>
            </tr>

            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="text-muted text-center">ไม่มีข้อมูลผู้ใช้</td>
            </tr>
          </tbody>
        </table>

        <!-- View modal -->
        <div class="modal fade" id="viewUserModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content p-3">
              <div class="modal-header">
                <h5 class="modal-title">ข้อมูลผู้ใช้</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <p><strong>ชื่อ:</strong> {{ selectedUser.name }}</p>
                <p><strong>อีเมล:</strong> {{ selectedUser.email || '—' }}</p>
                <p><strong>เบอร์โทร:</strong> {{ selectedUser.phone || '—' }}</p>
                <p><strong>ประเภท:</strong> {{ selectedUser.roleTh }}</p>
                <p><strong>สถานะ:</strong> {{ selectedUser.statusTh }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Upsert modal -->
        <div class="modal fade" id="upsertUserModal" tabindex="-1">
          <div class="modal-dialog">
            <form class="modal-content p-3" @submit.prevent="submitUser">
              <div class="modal-header">
                <h5 class="modal-title">{{ formMode === 'create' ? 'เพิ่มผู้ใช้ใหม่' : 'แก้ไขผู้ใช้' }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div class="modal-body">
                <div class="mb-2">
                  <label class="form-label">ชื่อผู้ใช้ <span class="text-danger">*</span></label>
                  <input v-model.trim="form.name" type="text" class="form-control" required />
                </div>
                <div class="mb-2">
                  <label class="form-label">อีเมล <span class="text-danger">*</span></label>
                  <input v-model.trim="form.email" type="email" class="form-control" required />
                </div>
                <div class="mb-2">
                  <label class="form-label">เบอร์โทร</label>
                  <input v-model.trim="form.phone" type="tel" class="form-control" pattern="^[0-9+\\- ]*$" />
                </div>
                <div class="mb-2">
                  <label class="form-label">ประเภทผู้ใช้ <span class="text-danger">*</span></label>
                  <select v-model="form.role" class="form-select compact" required>
                    <option disabled value="">-- เลือกประเภท --</option>
                    <option value="applicant">ผู้สมัครงาน</option>
                    <option value="employer">ผู้ว่าจ้าง</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="form-label">สถานะ <span class="text-danger">*</span></label>
                  <select v-model="form.status" class="form-select compact" required>
                    <option value="ใช้งาน">ใช้งาน</option>
                    <option value="แบนแล้ว">แบนแล้ว</option>
                  </select>
                </div>

                <div class="mb-2" v-if="formMode === 'create'">
                  <label class="form-label">รหัสผ่าน (เฉพาะตอนเพิ่ม) <span class="text-danger">*</span></label>
                  <input v-model="form.password" type="password" minlength="6" class="form-control" required />
                  <div class="form-text">อย่างน้อย 6 ตัวอักษร</div>
                </div>

                <div class="alert alert-danger py-2" v-if="errorMsg">
                  <i class="bi bi-exclamation-triangle me-1"></i>{{ errorMsg }}
                </div>
              </div>

              <div class="modal-footer">
                <button class="btn-pill btn-slate" type="button" data-bs-dismiss="modal">ยกเลิก</button>
                <button class="btn-pill btn-emerald" type="submit" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                  {{ formMode === 'create' ? 'บันทึกผู้ใช้' : 'บันทึกการแก้ไข' }}
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
const API = "http://localhost:3001/api/admin/users";

export default {
  components: { AdminNavbar, AdminSidebar },
  data() {
    return {
      users: [],
      selectedUser: {},
      searchQuery: "",
      userTypeFilter: "",
      formMode: "create",
      form: { id: null, name: "", email: "", phone: "", role: "", status: "ใช้งาน", password: "" },
      loading: false,
      errorMsg: "",
      modals: { view: null, upsert: null },
    };
  },
  computed: {
    filteredUsers() {
      const k = this.searchQuery.toLowerCase().trim();
      return this.users.filter(u => {
        const matchType = !this.userTypeFilter || u.roleRaw === this.userTypeFilter;
        const matchSearch = !k ||
          (u.name || '').toLowerCase().includes(k) ||
          (u.email || '').toLowerCase().includes(k) ||
          (u.phone || '').toLowerCase().includes(k);
        return matchType && matchSearch;
      });
    },
  },
  async mounted() {
    this.modals.view = new bootstrap.Modal(document.getElementById("viewUserModal"));
    this.modals.upsert = new bootstrap.Modal(document.getElementById("upsertUserModal"));
    await this.fetchUsers();
  },
  methods: {
    roleToTh(role){
      if (role === 'applicant') return 'ผู้สมัครงาน';
      if (role === 'employer')  return 'ผู้ว่าจ้าง';
      return role || '—';
    },
    statusToTh(status){
      if (!status) return '—';
      const s = String(status).toLowerCase();
      if (s.includes('ban') || s.includes('แบน')) return 'แบนแล้ว';
      return 'ใช้งาน';
    },
    authHeader() {
      const token = localStorage.getItem("admin_token");
      if (!token) return {};
      const value = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      return { Authorization: value };
    },
    async fetchUsers() {
      try {
        const res = await fetch(API, { headers: { ...this.authHeader() }, cache: "no-store" });
        if (!res.ok) throw new Error("โหลดผู้ใช้ล้มเหลว");
        const rows = await res.json();
        this.users = (rows || []).map(u => ({
          ...u,
          roleRaw: u.role,
          roleTh : this.roleToTh(u.role),
          statusTh: this.statusToTh(u.status),
        }));
      } catch (err) {
        console.error(err);
      }
    },
    viewUser(user) {
      this.selectedUser = user;
      this.modals.view.show();
    },
    openCreate() {
      this.formMode = "create";
      this.resetForm();
      this.form.status = "ใช้งาน";
      this.modals.upsert.show();
    },
    openEdit(user) {
      this.formMode = "edit";
      this.resetForm();
      this.form = {
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.roleRaw || "",
        status: user.statusTh || "ใช้งาน",
        password: "",
      };
      this.modals.upsert.show();
    },
    resetForm() {
      this.errorMsg = "";
      this.form = { id: null, name: "", email: "", phone: "", role: "", status: "ใช้งาน", password: "" };
    },
    async submitUser() {
      this.loading = true;
      this.errorMsg = "";
      try {
        if (!this.form.name || !this.form.email || !this.form.role || !this.form.status) {
          this.errorMsg = "กรอกข้อมูลที่จำเป็นให้ครบถ้วน";
          return;
        }

        if (this.formMode === "create") {
          if (!this.form.password || this.form.password.length < 6) {
            this.errorMsg = "รหัสผ่านอย่างน้อย 6 ตัวอักษร";
            return;
          }
          const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...this.authHeader() },
            body: JSON.stringify({
              name: this.form.name,
              email: this.form.email,
              phone: this.form.phone,
              role: this.form.role,
              status: this.form.status,
              password: this.form.password,
            }),
          });
          if (!res.ok) throw new Error(await res.text() || "บันทึกไม่สำเร็จ");
          await this.fetchUsers();
        } else {
          const res = await fetch(`${API}/${this.form.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...this.authHeader() },
            body: JSON.stringify({
              name: this.form.name,
              email: this.form.email,
              phone: this.form.phone,
              role: this.form.role,
              status: this.form.status,
            }),
          });
          if (!res.ok) throw new Error(await res.text() || "บันทึกไม่สำเร็จ");
          await this.fetchUsers();
        }

        this.modals.upsert.hide();
      } catch (err) {
        console.error(err);
        this.errorMsg = err?.message || "บันทึกไม่สำเร็จ";
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(user) {
      if (confirm(`ยืนยันลบผู้ใช้ ${user.name}?`)) this.deleteUser(user.id);
    },
    async deleteUser(userId) {
      try {
        const res = await fetch(`${API}/${userId}`, { method: "DELETE", headers: { ...this.authHeader() } });
        if (!res.ok) throw new Error(await res.text() || "ลบผู้ใช้ล้มเหลว");
        this.users = this.users.filter(u => u.id !== userId);
      } catch (err) {
        console.error(err);
        alert(err?.message || "ลบผู้ใช้ไม่สำเร็จ");
      }
    },
  },
};
</script>

<style scoped>
/* shared */
.flex-1 { flex: 1; }
.text-orange { color: #ff6600; }

/* Filter bar */
.filter-row {
  display:flex;
  gap:12px;
  align-items:center;
  flex-wrap:wrap
}
.filter-row .search {
  flex:1 1 300px;
  max-width: 360px;
}
.form-select.compact {
  height:36px;
  padding:.25rem .75rem;
  font-size:.9rem;
  border-radius: 999px; /* ทำให้ dropdown มนๆ */
}
.select-fit {
  width:auto;
  min-width:160px;
  max-width:240px;
}

/* Table */
.user-table {
  width: 100%;
}
.user-table thead tr {
  background:#fafafa
}
.user-table th {
  font-weight:700;
  color:#333;
  border-bottom:1px solid #eee
}
.user-table td {
  border-bottom:1px solid #f1f1f1
}

/* Chips (ปรับเป็นข้อความปกติสำหรับ ประเภท & สถานะ) */
.chip {
  font-size: 16px;
  font-weight: 500;
  background: none;
  border: none;
  padding: 0;
}
.chip-slate { color:#475569 }   /* ผู้สมัครงาน */
.chip-indigo { color:#4f46e5 }  /* ผู้ว่าจ้าง */
.chip-emerald { color:#059669 } /* ใช้งาน */
.chip-rose { color:#e11d48 }    /* แบนแล้ว */

/* Buttons – outline + hover fill */
.btn-pill {
  border-radius: 999px;
  font-weight: 600;
  font-size: 13.5px;
  padding: 8px 14px;
  background: transparent;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ดูโปรไฟล์ */
.btn-violet {
  border: 2px solid #7c3aed;
  color: #7c3aed;
}
.btn-violet:hover {
  background: #7c3aed;
  color: #fff;
}

/* แก้ไข */
.btn-sky {
  border: 2px solid #0ea5e9;
  color: #0ea5e9;
}
.btn-sky:hover {
  background: #0ea5e9;
  color: #fff;
}

/* ลบ */
.btn-rose {
  border: 2px solid #e11d48;
  color: #e11d48;
}
.btn-rose:hover {
  background: #e11d48;
  color: #fff;
}

/* เพิ่มผู้ใช้ */
.btn-emerald {
  border: 2px solid #10b981;
  color: #10b981;
}
.btn-emerald:hover {
  background: #10b981;
  color: #fff;
}

/* ยกเลิก */
.btn-slate {
  border: 2px solid #64748b;
  color: #64748b;
}
.btn-slate:hover {
  background: #64748b;
  color: #fff;
}

/* Modal */
.modal .form-label {
  font-weight:600
}
</style>
