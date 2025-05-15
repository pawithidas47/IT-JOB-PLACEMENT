import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import RegisterApplicant from "@/views/applicant/Register.vue";
import DashboardApplicant from "@/views/applicant/Dashboard.vue";
import RegisterEmployer from "@/views/employer/Register.vue";
import DashboardEmployer from "@/views/employer/Dashboard.vue";
import PostJob from "@/views/employer/PostJob.vue";
import EditJob from "@/views/employer/EditJob.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: Login },
  { path: "/register/applicant", component: RegisterApplicant },
  { path: "/register/employer", component: RegisterEmployer },
  { path: "/applicant/dashboard", component: DashboardApplicant },
  { path: "/employer/dashboard", component: DashboardEmployer },
  {
    path: "/employer/post-job",
    name: "PostJob",
    component: PostJob,
  },
  { path: "/employer/edit-job/:id", component: EditJob, name: "EditJob" },
  // เพิ่ม /login อีกครั้งถ้ามี login รวม (หรือแยกก็ได้)
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
