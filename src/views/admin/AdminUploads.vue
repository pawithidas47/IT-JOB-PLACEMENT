<template>
  <div>
    <AdminNavbar />
    <div class="d-flex">
      <AdminSidebar />
      <div class="p-4" style="flex: 1;">
        <h4 class="fw-bold text-orange mb-3"><i class="bi bi-file-earmark-arrow-up-fill me-2"></i> ไฟล์ที่อัปโหลด</h4>
        <table class="table table-bordered table-hover">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>ชื่อไฟล์</th>
              <th>ประเภท</th>
              <th>วันที่อัปโหลด</th>
              <th>ดู</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in uploads" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ file.filename }}</td>
              <td>{{ file.filetype }}</td>
              <td>{{ new Date(file.uploaded_at).toLocaleString() }}</td>
              <td><a :href="file.url" target="_blank" class="btn btn-sm btn-outline-primary">เปิด</a></td>
            </tr>
            <tr v-if="uploads.length === 0">
              <td colspan="5" class="text-muted text-center">ไม่มีไฟล์ที่อัปโหลด</td>
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
    return { uploads: [] };
  },
  async mounted() {
    try {
      const res = await fetch("http://localhost:3001/api/admin/uploads", {
        headers: { Authorization: localStorage.getItem("admin_token") }
      });
      this.uploads = await res.json();
    } catch (err) {
      console.error("โหลดไฟล์ล้มเหลว", err);
    }
  }
};
</script>

<style scoped>
.text-orange {
  color: #ff6600;
}
</style>
