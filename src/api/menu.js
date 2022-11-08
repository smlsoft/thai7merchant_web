export const menus = [
  {
    title: "แดรชบอร์ด",
    icon: "pi pi-home",
    name: "dashboard",
    to: "/",
    children: [],
  },
  {
    title: "ข้อมูลหลัก",
    icon: "pi pi-th-large",
    to: "",
    name: "master",
    children: [
      {
        title: "ข้อมูลสินค้า",
        icon: "pi pi-microsoft",
        to: "/product/list",
        name: "product_list",
      },
      // {
      //   title: "จัดการบาร์โค้ดสินค้า",
      //   icon: "pi pi-microsoft",
      //   to: "/barcode/create",
      //   name: "barcode_create",
      // },
      {
        title: "กำหนดหน่วยนับสินค้า",
        icon: "pi pi-microsoft",
        to: "/unit/list",
        name: "unit_list",
      },
      // {
      //   title: "กำหนด คลัง/พื้นที่เก็บ",
      //   icon: "pi pi-microsoft",
      //   to: "/warehouse/list",
      //   name: "warehouse_list",
      // },


    ],
  },
  // {
  //   title: "ข้อมูลหมวดหมู่",
  //   icon: "pi pi-list",
  //   to: "/category/list",
  //   name: "category_list",
  //   children: [],
  // },
  // {
  //   title: "ข้อมูลตัวเลือก",
  //   icon: "pi pi-list",
  //   to: "/option/list",
  //   name: "option_list",
  //   children: [],
  // },
  // {
  //   title: "นำเข้าข้อมูล",
  //   icon: "pi pi-cloud-upload",
  //   to: "",
  //   name: "upload_data",
  //   children: [
  //     {
  //       title: "รูปภาพ",
  //       icon: "pi pi-image",
  //       to: "/import/images",
  //       name: "import_images",
  //     },
  //     {
  //       title: "สินค้า",
  //       icon: "pi pi-apple",
  //       to: "/import/listProduct",
  //       name: "import_product",
  //     },
  //     {
  //       title: "หมวดหมู่",
  //       icon: "pi pi-list",
  //       to: "/import/listCategory",
  //       name: "import_category",
  //     },
  //     {
  //       title: "ตัวเลือก",
  //       icon: "pi pi-th-large",
  //       to: "/import/listOption",
  //       name: "import_option",
  //     },
  //     {
  //       title: "ประมวลผล",
  //       icon: "pi pi-caret-right",
  //       to: "/import/process",
  //       name: "import_process",
  //     }

  //   ],
  // },
  // {
  //   title: "จัดการร้านอาหาร",
  //   icon: "pi pi-apple",
  //   name: "restaurant_list",
  //   to: "",
  //   children: [
  //     {
  //       title: "เครื่องพิมพ์",
  //       icon: "pi pi-print",
  //       name: "printer_list",
  //       to: "/restaurant/printer/printer_list",
  //     },
  //     {
  //       title: "โซน",
  //       icon: "pi pi-map",
  //       name: "zone_list",
  //       to: "/restaurant/zone/zone_list",
  //     },
  //     {
  //       title: "โต๊ะอาหาร",
  //       icon: "pi pi-table",
  //       name: "table_list",
  //       to: "/restaurant/table/table_list",
  //     },
  //     {
  //       title: "กำหนดครัว",
  //       icon: "pi pi-briefcase",
  //       name: "kitchen_list",
  //       to: "/restaurant/kitchen/kitchen_list",
  //     },
  //   ],
  // },

  // {
  //   title: "Profile",
  //   icon: "pi pi-user",
  //   name: "profile",
  //   to: "/me",
  //   children: [],
  // },
  // {
  //   title: "Logout",
  //   icon: "pi pi-lock",
  //   to: "/logout",
  //   children: [],
  // },
];
