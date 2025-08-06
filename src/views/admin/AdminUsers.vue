<template>
  <div>
    <AdminNavbar />
    <div class="d-flex">
      <AdminSidebar />
      <div class="p-4" style="flex: 1;">
        <h4 class="fw-bold text-orange mb-3">
          <i class="bi bi-people-fill me-2"></i> ผู้ใช้ทั้งหมด
        </h4>

        <!-- ✅ ตัวกรอง -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <input v-model="searchQuery" class="form-control w-50 me-3" placeholder="🔍 ค้นหาชื่อ/อีเมล/เบอร์โทร" />
          <select v-model="userTypeFilter" class="form-select w-auto">
            <option value="">ผู้ใช้ทั้งหมด</option>
            <option value="applicant">ผู้สมัครงาน</option>
            <option value="employer">ผู้ว่าจ้าง</option>
          </select>
        </div>

        <!-- ✅ ตารางผู้ใช้ -->
        <table class="table table-bordered table-hover">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>ชื่อผู้ใช้</th>
              <th>อีเมล</th>
              <th>เบอร์โทร</th>
              <th>สถานะ</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id">
              <td>{{ index + 1 }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>
                <span class="badge" :class="user.status === 'ใช้งาน' ? 'bg-success' : 'bg-danger'">
                  {{ user.status }}
                </span>
              </td>
              <td class="text-nowrap">
                <button class="btn btn-sm btn-warning me-1" @click="toggleBan(user)">
                  {{ user.status === 'ใช้งาน' ? 'แบน' : 'ยกเลิกแบน' }}
                </button>
                <button class="btn btn-sm btn-info me-1" @click="viewUser(user)">ดูโปรไฟล์</button>
                <button class="btn btn-sm btn-danger" @click="confirmDelete(user)">ลบ</button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="text-muted text-center">ไม่มีข้อมูลผู้ใช้</td>
            </tr>
          </tbody>
        </table>

        <!-- ✅ Modal ดูโปรไฟล์ -->
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

export default {
  components: { AdminNavbar, AdminSidebar },
  data() {
    return {
      users: [],
      selectedUser: {},
      searchQuery: "",
      userTypeFilter: "", // "", "applicant", "employer"
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        const matchType = this.userTypeFilter === "" || user.role === this.userTypeFilter;
        const keyword = this.searchQuery.toLowerCase();
        const matchSearch =
          user.name?.toLowerCase().includes(keyword) ||
          user.email?.toLowerCase().includes(keyword) ||
          user.phone?.includes(keyword);
        return matchType && matchSearch;
      });
    },
  },
  async mounted() {
    try {
      const res = await fetch("http://localhost:3001/api/admin/users", {
        headers: { Authorization: localStorage.getItem("admin_token") },
      });
      this.users = await res.json();
    } catch (err) {
      console.error("โหลดผู้ใช้ล้มเหลว", err);
    }
  },
  methods: {
    async toggleBan(user) {
      const newStatus = user.status === "ใช้งาน" ? "แบนแล้ว" : "ใช้งาน";
      try {
        const res = await fetch(`http://localhost:3001/api/admin/users/${user.id}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, role: user.role }),
        });
        if (res.ok) user.status = newStatus;
      } catch (err) {
        console.error("แบน/ยกเลิกแบนล้มเหลว:", err);
      }
    },
    confirmDelete(user) {
      if (confirm(`ยืนยันลบผู้ใช้ ${user.name}?`)) {
        this.deleteUser(user.id);
      }
    },
    async deleteUser(userId) {
      try {
        const res = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          this.users = this.users.filter((u) => u.id !== userId);
        }
      } catch (err) {
        console.error("ลบผู้ใช้ล้มเหลว:", err);
      }
    },
    viewUser(user) {
      this.selectedUser = user;
      const modal = new bootstrap.Modal(document.getElementById("viewUserModal"));
      modal.show();
    },
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
</style>
