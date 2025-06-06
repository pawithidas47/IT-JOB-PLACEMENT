import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import RegisterApplicant from "@/views/applicant/Register.vue";
import RegisterEmployer from "@/views/employer/Register.vue";
import DashboardEmployer from "@/views/employer/Dashboard.vue";
import PostJob from "@/views/employer/PostJob.vue";
import EditJob from "@/views/employer/EditJob.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: Login },
  { path: "/register/applicant", component: RegisterApplicant },
  { path: "/register/employer", component: RegisterEmployer },
  { path: "/employer/dashboard", component: DashboardEmployer },
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
    path: "/applicant/jobs",
    name: "ApplicantJobs",
    component: () => import("@/views/applicant/Jobs.vue"),
  },
  {
    path: "/applicant/applications",
    component: () => import("@/views/applicant/JobApplications.vue"),
  },
  {
    path: "/applicant/profile",
    component: () => import("@/views/applicant/UserProfile.vue"),
  },


  {
  path: '/applicant/savedjobs',
  component: () => import('@/views/applicant/SavedJobs.vue'),
},
  
{
  path: "/jobs/:id",
  name: "PublicJobDetail",
  component: () => import("@/views/JobDetail.vue"),
},
{
  path: "/applicant/jobs/:id",
  name: "ApplicantJobDetail",
  component: () => import("@/views/applicant/JobDetailPage.vue"),
  meta: { requiresAuth: true }
}



];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
