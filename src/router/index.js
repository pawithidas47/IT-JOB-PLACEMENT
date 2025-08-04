import { createRouter, createWebHistory } from "vue-router";

// ✅ Employer views
import DashboardEmployer from "@/views/employer/Dashboard.vue";
import PostJob from "@/views/employer/PostJob.vue";
import EditJob from "@/views/employer/EditJob.vue";
import RegisterEmployer from "@/views/employer/Register.vue";
import EmployerProfile from "@/views/employer/EmployerProfile.vue";
import EditProfile from "@/views/employer/EditProfile.vue"
// ✅ Applicant views
import RegisterApplicant from "@/views/applicant/Register.vue";
import JobApplications from "@/views/applicant/JobApplications.vue";

// ✅ General views
import HomePage from "@/views/Home.vue";
import Login from "@/views/Login.vue";

const routes = [
  // หน้าหลัก
  { path: "/", component: HomePage },

  // เข้าสู่ระบบ / สมัครสมาชิก
  { path: "/login", component: Login },
  { path: "/register/applicant", component: RegisterApplicant },
  { path: "/register/employer", component: RegisterEmployer },

  // Employer
  {
    path: "/employer/dashboard",
    name: "DashboardEmployer",
    component: DashboardEmployer,
  },
  {
  path: '/employer/jobs/:id',
  name: 'EmployerJobDetail',
  component: () => import('@/views/employer/EmployerJobDetail.vue')
}
,
  {
    path: "/employer/post-job",
    name: "PostJob",
    component: PostJob,
  },
  {
    path: "/employer/edit-job/:id",
    name: "EditJob",
    component: EditJob,
  },
  {
    path: "/employer/applicants",
    name: "EmployerApplicants",
    component: () => import("@/views/employer/Applicants.vue"),

  },
  {
  path: "/employer/applicant/:id",
  name: "EmployerApplicantProfile",
  component: () => import("@/views/employer/ApplicantProfile.vue"),
  props: true
}
,

   {
      path: "/employer/profile",
      name: "EmployerProfile",
      component: EmployerProfile,
    },
    {
      path: "/employer/edit-profile",
      name: "EmployerEditProfile",
      component: EditProfile,
    },
    {
  path: '/employer/search-applicants',
  name: 'SearchApplicants',
  component: () => import('@/views/employer/SearchApplicants.vue')
}
,


  // Applicant
  {
    path: "/applicant/jobs",
    name: "ApplicantJobs",
    component: () => import("@/views/applicant/Jobs.vue"),
  },
  {
    path: "/applicant/jobs/:id",
    name: "ApplicantJobDetail",
    component: () => import("@/views/applicant/JobDetailPage.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/applicant/userprofile",
    name: "UserProfile",
    component: () => import("@/views/applicant/UserProfile.vue"),
  },
  {
    path: "/applicant/editprofile",
    name: "EditProfile",
    component: () => import("@/views/applicant/EditProfile.vue"),
  },
  {
    path: "/applicant/jobapplications",
    name: "JobApplications",
    component: JobApplications,
  },
  {
    path: "/applicant/applications",
    component: JobApplications,
  },
  {
    path: "/applicant/profile",
    component: () => import("@/views/applicant/UserProfile.vue"),
  },
  {
    path: "/applicant/savedjobs",
    component: () => import("@/views/applicant/SavedJobs.vue"),
  },
  {
  path: '/applicant/:id',
  name: 'PublicApplicantProfile',
  component: () => import('@/views/applicant/UserProfile.vue')  // ✅ ใช้ component เดิมได้เลย
}
,

  // Job detail (public)
  {
    path: "/jobs/:id",
    name: "PublicJobDetail",
    component: () => import("@/views/JobDetail.vue"),
  }

,
// ✅ เพิ่มในหมวด Job detail (public) หรือแยกหมวด Public Employer Profile ก็ได้
{
  path: '/employer/profile/:id',
  name: 'EmployerPublicProfile',
  component: () => import('@/views/applicant/EmployerPublicProfile.vue'),
}

,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
