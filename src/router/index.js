// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

/* Employer */
import DashboardEmployer from "@/views/employer/Dashboard.vue";
import PostJob from "@/views/employer/PostJob.vue";
import EditJob from "@/views/employer/EditJob.vue";
import RegisterEmployer from "@/views/employer/Register.vue";
import EditProfile from "@/views/employer/EditProfile.vue";

/* Applicant */
import RegisterApplicant from "@/views/applicant/Register.vue";
import JobApplications from "@/views/applicant/JobApplications.vue";

/* General */
import HomePage from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import AdminLogin from "@/views/admin/AdminLogin.vue";
import AdminDashboard from "@/views/admin/AdminDashboard.vue";
import CompanyPublicPage from '@/views/CompanyPublicPage.vue';
/** ✅ ชี้ไปที่ไฟล์จริงในโฟลเดอร์ applicant */
const CompanyPublicForApplicant = () =>
  import("@/views/applicant/CompanyPublicForApplicant.vue"); 
// ถ้าไฟล์คุณชื่อ CompanyPublicForApplicant.vue ก็เปลี่ยนชื่อไฟล์ในบรรทัดนี้ให้ตรงด้วย:
// import("@/views/applicant/CompanyPublicForApplicant.vue");

const routes = [
  
   { path: '/company/:id', name: 'CompanyPublic', component: CompanyPublicPage },
  /* --- หน้าโปรไฟล์บริษัทสำหรับผู้สมัคร (public) --- */
  {
    path: "/applicant/company/:id",
    name: "CompanyPublicForApplicant",
    component: CompanyPublicForApplicant,
    meta: { public: true, useHomeNavbar: false },
  },

  /* --- Public pages --- */
  { path: "/", component: HomePage },
  { path: "/login", component: Login },
  { path: "/register/applicant", component: RegisterApplicant },
  { path: "/register/employer", component: RegisterEmployer },

  /* รายละเอียดงาน (public) */
  {
    path: "/jobs/:id",
    name: "PublicJobDetail",
    component: () => import("@/views/JobDetail.vue"),
  },

  /* --- Admin --- */
  { path: "/admin/login", component: AdminLogin },
  { path: "/admin/dashboard", component: AdminDashboard },
  { path: "/admin/users", component: () => import("@/views/admin/AdminUsers.vue") },
  { path: "/admin/jobs", component: () => import("@/views/admin/AdminJobs.vue") },
  { path: "/admin/uploads", component: () => import("@/views/admin/AdminUploads.vue") },
  { path: "/admin/complaints", component: () => import("@/views/admin/AdminComplaints.vue") },

  /* --- Employer area --- */
  { path: "/employer/dashboard", name: "DashboardEmployer", component: DashboardEmployer },
  { path: "/employer/post-job", name: "PostJob", component: PostJob },
  { path: "/employer/edit-job/:id", name: "EditJob", component: EditJob },
  { path: "/employer/jobs/:id", name: "EmployerJobDetail", component: () => import("@/views/employer/EmployerJobDetail.vue") },
  { path: "/employer/applicants", name: "EmployerApplicants", component: () => import("@/views/employer/Applicants.vue") },
  { path: "/employer/applicant/:id", name: "EmployerApplicantProfile", component: () => import("@/views/employer/ApplicantProfile.vue"), props: true },
  { path: "/employer/edit-profile", name: "EmployerEditProfile", component: EditProfile },

  /* --- Applicant area --- */
  { path: "/applicant/jobs", name: "ApplicantJobs", component: () => import("@/views/applicant/Jobs.vue") },
  {
    path: "/applicant/jobs/:id",
    name: "ApplicantJobDetail",
    component: () => import("@/views/applicant/JobDetailPage.vue"),
    meta: { requiresAuth: true },
  },
  { path: "/applicant/userprofile", name: "UserProfile", component: () => import("@/views/applicant/UserProfile.vue") },
  { path: "/applicant/editprofile", name: "EditProfile", component: () => import("@/views/applicant/EditProfile.vue") },
  { path: "/applicant/jobapplications", name: "JobApplications", component: JobApplications },
  { path: "/applicant/applications", component: JobApplications },
  { path: "/applicant/profile", component: () => import("@/views/applicant/UserProfile.vue") },
  { path: "/applicant/savedjobs", component: () => import("@/views/applicant/SavedJobs.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* Guard */
router.beforeEach((to, from, next) => {
  if (to.meta?.public) return next();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  if (to.meta?.requiresAuth && !user) return next("/login");
  if (to.meta?.role && to.meta.role !== role) return next("/");
  next();
});

export default router;
