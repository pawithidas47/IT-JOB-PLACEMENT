import { createRouter, createWebHistory } from "vue-router";

/* ---------- Employer views ---------- */
import DashboardEmployer from "@/views/employer/Dashboard.vue";
import PostJob from "@/views/employer/PostJob.vue";
import EditJob from "@/views/employer/EditJob.vue";
import RegisterEmployer from "@/views/employer/Register.vue";
import EmployerProfile from "@/views/employer/EmployerProfile.vue";
import EditProfile from "@/views/employer/EditProfile.vue";

/* ---------- Applicant views ---------- */
import RegisterApplicant from "@/views/applicant/Register.vue";
import JobApplications from "@/views/applicant/JobApplications.vue";

/* ---------- General views ---------- */
import HomePage from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import AdminLogin from "@/views/admin/AdminLogin.vue";
import AdminDashboard from "@/views/admin/AdminDashboard.vue";

const routes = [
  /* ---------- Admin ---------- */
  { path: "/admin/login", component: AdminLogin },
  { path: "/admin/dashboard", component: AdminDashboard },
  { path: "/admin/users", component: () => import("@/views/admin/AdminUsers.vue") },
  { path: "/admin/jobs", component: () => import("@/views/admin/AdminJobs.vue") },
  { path: "/admin/uploads", component: () => import("@/views/admin/AdminUploads.vue") },
  { path: "/admin/complaints", component: () => import("@/views/admin/AdminComplaints.vue") },

  /* ---------- Public pages ---------- */
  { path: "/", component: HomePage },
  { path: "/login", component: Login },
  { path: "/register/applicant", component: RegisterApplicant },
  { path: "/register/employer", component: RegisterEmployer },

  // รายละเอียดงาน (public)
  {
    path: "/jobs/:id",
    name: "PublicJobDetail",
    component: () => import("@/views/JobDetail.vue"),
  },

  // ✅ โปรไฟล์บริษัท (public) — ให้ผู้สมัครกดดูได้โดยไม่เด้งออก
  {
    path: "/employer/profile/:id",
    name: "EmployerPublicProfile",
    component: () => import("@/views/applicant/EmployerPublicProfile.vue"),
    meta: { public: true },
  },

  /* ---------- Employer area (ต้องล็อกอินเป็นนายจ้างถ้าตั้ง guard เพิ่ม) ---------- */
  { path: "/employer/dashboard", name: "DashboardEmployer", component: DashboardEmployer },
  { path: "/employer/post-job", name: "PostJob", component: PostJob },
  { path: "/employer/edit-job/:id", name: "EditJob", component: EditJob },
  { path: "/employer/jobs/:id", name: "EmployerJobDetail", component: () => import("@/views/employer/EmployerJobDetail.vue") },
  { path: "/employer/applicants", name: "EmployerApplicants", component: () => import("@/views/employer/Applicants.vue") },
  { path: "/employer/applicant/:id", name: "EmployerApplicantProfile", component: () => import("@/views/employer/ApplicantProfile.vue"), props: true },
  { path: "/employer/profile", name: "EmployerProfile", component: EmployerProfile },
  { path: "/employer/edit-profile", name: "EmployerEditProfile", component: EditProfile },
  { path: "/employer/search-applicants", name: "SearchApplicants", component: () => import("@/views/employer/SearchApplicants.vue") },

  /* ---------- Applicant area ---------- */
  { path: "/applicant/jobs", name: "ApplicantJobs", component: () => import("@/views/applicant/Jobs.vue") },
  {
    path: "/applicant/jobs/:id",
    name: "ApplicantJobDetail",
    component: () => import("@/views/applicant/JobDetailPage.vue"),
    meta: { requiresAuth: true }, // ต้องล็อกอินเป็นผู้สมัครถึงจะสมัครงานได้
  },
  { path: "/applicant/userprofile", name: "UserProfile", component: () => import("@/views/applicant/UserProfile.vue") },
  { path: "/applicant/editprofile", name: "EditProfile", component: () => import("@/views/applicant/EditProfile.vue") },
  { path: "/applicant/jobapplications", name: "JobApplications", component: JobApplications },
  { path: "/applicant/applications", component: JobApplications },
  { path: "/applicant/profile", component: () => import("@/views/applicant/UserProfile.vue") },
  { path: "/applicant/savedjobs", component: () => import("@/views/applicant/SavedJobs.vue") },

  // โปรไฟล์ผู้สมัครแบบ public (ถ้าต้องให้บริษัทเปิดดูได้)
  {
    path: "/applicant/:id",
    name: "PublicApplicantProfile",
    component: () => import("@/views/applicant/UserProfile.vue"),
    meta: { public: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* ---------- Global Guard: ไม่ลบ session เมื่อ role ไม่ตรง ---------- */
router.beforeEach((to, from, next) => {
  // หน้า public ผ่านได้เลย
  if (to.meta?.public) return next();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role"); // 'applicant' | 'employer' (ถ้าคุณตั้งค่าไว้)

  if (to.meta?.requiresAuth && !user) {
    return next("/login");
  }

  // ถ้าวาง role ใน meta ของบาง route: { requiresAuth: true, role: 'employer' }
  if (to.meta?.role && to.meta.role !== role) {
    // แค่ออกนอกเส้นทาง ไม่ต้องเคลียร์ localStorage
    return next("/"); // หรือหน้า 403
  }

  next();
});

export default router;
