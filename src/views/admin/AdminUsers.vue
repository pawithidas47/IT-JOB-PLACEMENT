<template>
  <div>
    <AdminNavbar />
    <div class="d-flex">
      <AdminSidebar />
      <div class="p-4 flex-1">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="fw-bold text-orange mb-0">
            <i class="bi bi-people-fill me-2"></i> ผู้ใช้ทั้งหมด
          </h4>
          <button class="btn btn-primary" @click="openCreate">
            <i class="bi bi-plus-lg me-1"></i> เพิ่มผู้ใช้
          </button>
        </div>

        <!-- ตัวกรอง -->
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <input v-model="searchQuery" class="form-control w-50" placeholder="🔍 ค้นหาชื่อ/อีเมล/เบอร์โทร" />
          <select v-model="userTypeFilter" class="form-select w-auto">
            <option value="">ผู้ใช้ทั้งหมด</option>
            <option value="applicant">ผู้สมัครงาน</option>
            <option value="employer">ผู้ว่าจ้าง</option>
            <option value="admin">ผู้ดูแลระบบ</option>
          </select>
        </div>

        <!-- ตารางผู้ใช้ -->
        <table class="table table-bordered table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th style="width:60px">#</th>
              <th>ชื่อผู้ใช้</th>
              <th>อีเมล</th>
              <th>เบอร์โทร</th>
              <th style="width:120px">ประเภท</th>
              <th style="width:120px">สถานะ</th>
              <th style="width:280px">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id">
              <td>{{ index + 1 }}</td>
              <td class="fw-semibold">{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td><span class="badge bg-secondary text-capitalize">{{ user.role }}</span></td>
              <td>
                <span class="badge" :class="user.status === 'ใช้งาน' ? 'bg-success' : 'bg-danger'">{{ user.status }}</span>
              </td>
              <td class="text-nowrap">
                <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(user)">
                  <i class="bi bi-pencil-square me-1"></i>แก้ไข
                </button>
                <button class="btn btn-sm btn-info me-1" @click="viewUser(user)">
                  <i class="bi bi-person-badge me-1"></i>ดูโปรไฟล์
                </button>
                <button class="btn btn-sm btn-danger" @click="confirmDelete(user)">
                  <i class="bi bi-trash me-1"></i>ลบ
                </button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="text-muted text-center">ไม่มีข้อมูลผู้ใช้</td>
            </tr>
          </tbody>
        </table>

        <!-- Modal ดูโปรไฟล์ -->
        <div class="modal fade" id="viewUserModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content p-3">
              <div class="modal-header">
                <h5 class="modal-title">ข้อมูลผู้ใช้</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <p><strong>ชื่อ:</strong> {{ selectedUser.name }}</p>
                <p><strong>อีเมล:</strong> {{ selectedUser.email }}</p>
                <p><strong>เบอร์โทร:</strong> {{ selectedUser.phone }}</p>
                <p><strong>ประเภท:</strong> {{ selectedUser.role }}</p>
                <p><strong>สถานะ:</strong> {{ selectedUser.status }}</p>
                <p v-if="selectedUser.created_at"><strong>สร้างเมื่อ:</strong> {{ formatDate(selectedUser.created_at) }}</p>
                <p v-if="selectedUser.updated_at"><strong>อัปเดตล่าสุด:</strong> {{ formatDate(selectedUser.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal เพิ่ม/แก้ไข ผู้ใช้ -->
        <div class="modal fade" id="upsertUserModal" tabindex="-1">
          <div class="modal-dialog">
            <form class="modal-content p-3" @submit.prevent="submitUser">
              <div class="modal-header">
                <h5 class="modal-title">
                  {{ formMode === 'create' ? 'เพิ่มผู้ใช้ใหม่' : 'แก้ไขผู้ใช้' }}
                </h5>
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
                  <input v-model.trim="form.phone" type="tel" class="form-control" pattern="^[0-9+\- ]*$" />
                </div>
                <div class="mb-2">
                  <label class="form-label">ประเภทผู้ใช้ <span class="text-danger">*</span></label>
                  <select v-model="form.role" class="form-select" required>
                    <option disabled value="">-- เลือกประเภท --</option>
                    <option value="applicant">ผู้สมัครงาน</option>
                    <option value="employer">ผู้ว่าจ้าง</option>
                    <option value="admin">ผู้ดูแลระบบ</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="form-label">สถานะ <span class="text-danger">*</span></label>
                  <select v-model="form.status" class="form-select" required>
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
                <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">ยกเลิก</button>
                <button class="btn btn-primary" type="submit" :disabled="loading">
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
      formMode: "create", // 'create' | 'edit'
      form: { id: null, name: "", email: "", phone: "", role: "", status: "ใช้งาน", password: "" },
      loading: false,
      errorMsg: "",
      modals: { view: null, upsert: null },
    };
  },
  computed: {
    filteredUsers() {
      const keyword = this.searchQuery.toLowerCase().trim();
      return this.users.filter((u) => {
        const matchType = !this.userTypeFilter || u.role === this.userTypeFilter;
        const matchSearch =
          !keyword ||
          u.name?.toLowerCase().includes(keyword) ||
          u.email?.toLowerCase().includes(keyword) ||
          u.phone?.toLowerCase().includes(keyword);
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
    // ---- Header ใส่ Bearer อัตโนมัติ ----
    authHeader() {
      const token = localStorage.getItem("admin_token");
      if (!token) return {};
      const value = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      return { Authorization: value };
    },

    async fetchUsers() {
      try {
        const res = await fetch(API, { headers: { ...this.authHeader() } });
        if (!res.ok) throw new Error("โหลดผู้ใช้ล้มเหลว");
        this.users = await res.json();
      } catch (err) {
        console.error(err);
      }
    },

    // ----- View -----
    viewUser(user) {
      this.selectedUser = user;
      this.modals.view.show();
    },

    // ----- Create / Edit -----
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
        role: user.role || "",
        status: user.status || "ใช้งาน",
        password: "", // ไม่ใช้ตอนแก้ไข
      };
      this.modals.upsert.show();
    },
    resetForm() {
      this.errorMsg = "";
      this.form = { id: null, name: "", email: "", phone: "", role: "", status: "ใช้งาน", password: "" };
    },

    // ----- Submit (รองรับ 200/201/204 + body ว่าง) -----
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

          if (!res.ok) {
            const msg = await safeText(res);
            throw new Error(msg || "บันทึกไม่สำเร็จ");
          }

          const created = await safeJson(res);
          if (created && created.id) {
            this.users.unshift(created);
          } else {
            await this.fetchUsers(); // ถ้าไม่ได้คืน object กลับมา
          }
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

          if (!res.ok) {
            const msg = await safeText(res);
            throw new Error(msg || "บันทึกไม่สำเร็จ");
          }

          const updated = await safeJson(res);
          if (updated && updated.id) {
            const idx = this.users.findIndex((u) => u.id === updated.id);
            if (idx !== -1) this.users.splice(idx, 1, updated);
            if (this.selectedUser?.id === updated.id) this.selectedUser = updated;
          } else {
            await this.fetchUsers();
          }
        }

        this.modals.upsert.hide();
      } catch (err) {
        console.error(err);
        this.errorMsg = err?.message || "บันทึกไม่สำเร็จ";
      } finally {
        this.loading = false;
      }
    },

    // ----- Delete -----
    confirmDelete(user) {
      if (confirm(`ยืนยันลบผู้ใช้ ${user.name}?`)) {
        this.deleteUser(user.id);
      }
    },
    async deleteUser(userId) {
      try {
        const res = await fetch(`${API}/${userId}`, { method: "DELETE", headers: { ...this.authHeader() } });
        if (!res.ok) throw new Error(await safeText(res) || "ลบผู้ใช้ล้มเหลว");
        this.users = this.users.filter((u) => u.id !== userId);
      } catch (err) {
        console.error(err);
        alert(err?.message || "ลบผู้ใช้ไม่สำเร็จ");
      }
    },

    // ----- Utils -----
    formatDate(d) {
      try { return new Date(d).toLocaleString("th-TH"); } catch { return d; }
    },
  },
};

// helpers สำหรับอ่าน response ที่อาจว่าง
async function safeText(res) {
  try { return await res.text(); } catch { return ""; }
}
async function safeJson(res) {
  try {
    const t = await res.text();
    if (!t || !t.trim()) return null;
    return JSON.parse(t);
  } catch {
    return null;
  }
}
</script>

<style scoped>
.flex-1 { flex: 1; }
.text-orange { color: #ff6600; }
.table td, .table th { vertical-align: middle; }
.modal .form-label { font-weight: 600; }
</style>
