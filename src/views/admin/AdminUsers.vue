<template>
  <div>
    <AdminNavbar />
    <div class="d-flex">
      <AdminSidebar />
      <div class="p-4" style="flex: 1;">
        <h4 class="fw-bold text-orange mb-3"><i class="bi bi-people-fill me-2"></i> ผู้ใช้ทั้งหมด</h4>
        <table class="table table-bordered table-hover">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>ชื่อผู้ใช้</th>
              <th>อีเมล</th>
              <th>เบอร์โทร</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(user, index) in users" :key="index">
  <td>{{ index + 1 }}</td>
  <td>{{ user.name }}</td>         <!-- ✅ เปลี่ยนตรงนี้ -->
  <td>{{ user.email }}</td>
  <td>{{ user.phone }}</td>
  <td><span class="badge bg-success">{{ user.status }}</span></td>
</tr>

            <tr v-if="users.length === 0">
              <td colspan="5" class="text-muted text-center">ไม่มีข้อมูลผู้ใช้</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavbar from "@/components/admin/AdminNavbar.vue";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";

export default {
  components: { AdminNavbar, AdminSidebar },
  data() {
    return { users: [] };
  },
  async mounted() {
    try {
      const res = await fetch("http://localhost:3001/api/admin/users", {
        headers: { Authorization: localStorage.getItem("admin_token") }
      });
      this.users = await res.json();
    } catch (err) {
      console.error("โหลดผู้ใช้ล้มเหลว", err);
    }
  }
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
</style>
