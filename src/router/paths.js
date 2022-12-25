import Home from "@/pages/Home.vue";
import HomeView from "../views/HomeView.vue";

export default [
  {
    path: "/home",
    name: "home",
    meta: {
      auth: true,
    },
    component: Home,
  },
  {
    path: "/",
    name: "dashboard",
    meta: {
      auth: true,
    },
    component: () => import("../pages/Dashboard.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: {
      forwordauth: true,
      guest: true,
    },
    component: () => import("../pages/Login.vue"),
  },
  {
    path: "/me",
    name: "profile",
    meta: {
      auth: true,
    },
    component: () => import("../pages/Profile.vue"),
  },
  {
    path: "/logout",
    name: "logout",
    component: () => import("../pages/Logout.vue"),
  },

  {
    path: "/product/create",
    name: "product_create",
    meta: {
      auth: true,
    },
    component: () => import("../pages/product/product_create.vue"),
  },
  {
    path: "/product/edit/:id",
    name: "product_edit",
    meta: {
      auth: true,
    },
    component: () => import("../pages/product/product_edit.vue"),
  },
  {
    path: "/product/list",
    name: "product_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/product/product_list.vue"),
  },
  
  {
    path: "/unit/list",
    name: "unit_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/unit/unit_list.vue"),
  },
  {
    path: "/category/list",
    name: "category_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/category/category_list.vue"),
  },

  {
    path: "/health-check",
    name: "health-check",
    component: () => import("../pages/HealthCheck.vue"),
  }

];
