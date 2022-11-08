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
    path: "/import/importProduct",
    name: "import_product",
    meta: {
      auth: true,
    },
    component: () => import("../pages/import/product/product_import.vue"),
  },
  {
    path: "/import/listProduct",
    name: "import_list_product",
    meta: {
      auth: true,
    },
    component: () => import("../pages/import/product/product_list.vue"),
  },
  {
    path: "/import/importCategory",
    name: "import_category",
    meta: {
      auth: true,
    },
    component: () => import("../pages/import/category/category_import.vue"),
  },
  {
    path: "/import/listCategory",
    name: "import_list_category",
    meta: {
      auth: true,
    },
    component: () => import("../pages/import/category/category_list.vue"),
  },
  {
    path: "/import/images",
    name: "import_images",
    meta: {
      auth: true,
    },
    component: () => import("../pages/import/images/images_import.vue"),
  },
  {
    path: "/import/importOption",
    name: "import_option",
    meta: {
      auth: true,
    },
    component: () => import("../pages/import/option/option_import.vue"),
  },
  {
    path: "/import/listOption",
    name: "import_list_option",
    meta: {
      auth: true,
    },
    component: () => import("../pages/import/option/option_list.vue"),
  },
  {
    path: "/import/process",
    name: "import_process",
    meta: {
      auth: true,
    },
    component: () => import("../pages/import/process.vue"),
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
  ,
  {
    path: "/unit/create",
    name: "unit_create",
    meta: {
      auth: true,
    },
    component: () => import("../pages/unit/unit_create.vue"),
  },
  {
    path: "/unit/edit/:id",
    name: "unit_edit",
    meta: {
      auth: true,
    },
    component: () => import("../pages/unit/unit_edit.vue"),
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
    path: "/category/create",
    name: "category_create",
    meta: {
      auth: true,
    },
    component: () => import("../pages/category/category_create.vue"),
  },
  {
    path: "/category/edit/:id",
    name: "category_edit",
    meta: {
      auth: true,
    },
    component: () => import("../pages/category/category_edit.vue"),
  },
  {
    path: "/option/list",
    name: "option_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/option/option_list.vue"),
  },
  {
    path: "/option/create",
    name: "option_create",
    meta: {
      auth: true,
    },
    component: () => import("../pages/option/option_create.vue"),
  },
  {
    path: "/option/edit/:id",
    name: "option_edit",
    meta: {
      auth: true,
    },
    component: () => import("../pages/option/option_edit.vue"),
  },
  {
    path: "/restaurant/table/table_list",
    name: "table_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/restaurant/table/table_list.vue"),
  },
  {
    path: "/restaurant/table/table_import",
    name: "table_import",
    meta: {
      auth: true,
    },
    component: () => import("../pages/restaurant/table/table_import.vue"),
  },
  {
    path: "/restaurant/printer/printer_import",
    name: "printer_import",
    meta: {
      auth: true,
    },
    component: () => import("../pages/restaurant/printer/printer_import.vue"),
  },
  {
    path: "/restaurant/printer/printer_list",
    name: "printer_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/restaurant/printer/printer_list.vue"),
  },
  {
    path: "/restaurant/zone/zone_import",
    name: "zone_import",
    meta: {
      auth: true,
    },
    component: () => import("../pages/restaurant/zone/zone_import.vue"),
  },
  {
    path: "/restaurant/zone/zone_list",
    name: "zone_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/restaurant/zone/zone_list.vue"),
  },
  {
    path: "/restaurant/kitchen/kitchen_import",
    name: "kitchen_import",
    meta: {
      auth: true,
    },
    component: () => import("../pages/restaurant/kitchen/kitchen_import.vue"),
  },
  {
    path: "/restaurant/kitchen/kitchen_list",
    name: "kitchen_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/restaurant/kitchen/kitchen_list.vue"),
  },

  {
    path: "/warehouse/list",
    name: "warehouse_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/warehouse/warehouse_list.vue"),
  },
  {
    path: "/warehouse/create",
    name: "warehouse_create",
    meta: {
      auth: true,
    },
    component: () => import("../pages/warehouse/warehouse_create.vue"),
  },
  {
    path: "/warehouse/edit/:id",
    name: "warehouse_edit",
    meta: {
      auth: true,
    },
    component: () => import("../pages/warehouse/warehouse_edit.vue"),
  },
  {
    path: "/barcode/create",
    name: "barcode_create",
    meta: {
      auth: true,
    },
    component: () => import("../pages/barcode/barcode_create.vue"),
  },
  {
    path: "/health-check",
    name: "health-check",
    component: () => import("../pages/HealthCheck.vue"),
  }

];
