<template>
  <div>
    <AdminNavbar />
    <div class="d-flex">
      <AdminSidebar />

      <div class="p-4" style="flex: 1;">
        <h4 class="fw-bold text-orange mb-4">
          <i class="bi bi-exclamation-diamond-fill me-2"></i> ข้อร้องเรียน
        </h4>

        <table class="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อผู้ส่ง</th>
              <th>อีเมล</th>
              <th>เรื่อง</th>
              <th>รายละเอียด</th>
              <th>วันที่</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in complaints" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.subject }}</td>
              <td>{{ item.message }}</td>
              <td>{{ formatDate(item.created_at) }}</td>
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
import axios from "axios";

export default {
  components: { AdminNavbar, AdminSidebar },
  data() {
    return {
      complaints: [],
    };
  },
  created() {
    this.fetchComplaints();
  },
  methods: {
    async fetchComplaints() {
      try {
        const res = await axios.get("/api/admin/complaints");
        this.complaints = res.data;
      } catch (err) {
        console.error("โหลดข้อร้องเรียนไม่สำเร็จ:", err);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>
