import { useTranslation } from "react-i18next";
import {
  MdOutlineDashboard,
  MdOutlineCategory,
  MdStraighten,
  MdChecklist,
  MdVerified,
  MdQrCode,
  MdOutlinePointOfSale,
  MdOutlinePayments,
  MdOutlineSpeakerNotes,
} from "react-icons/md";
import {
  TbMapPin,
  TbUserShield,
  TbJumpRope,
  TbSettings,
  TbWorld,
  TbLogout,
  TbListDetails,
  TbBrandAsana,
  TbShoppingBag,
  TbFileUnknown,
  TbReportMoney,
  TbUsersGroup,
  TbUserDollar,
  TbBuildingWarehouse,
  TbFilePercent,
  TbGiftCard,
  TbBrandAppleArcade,
  TbFileInvoice,
} from "react-icons/tb";
import { GoPackage } from "react-icons/go";
import { CiBarcode } from "react-icons/ci";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { PiWarningDiamond } from "react-icons/pi";
import { BsHSquare } from "react-icons/bs";
import { FaRegFileAlt } from "react-icons/fa";
import { SiFuturelearn } from "react-icons/si";
import { FaStackOverflow } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import { IoLogoWebComponent } from "react-icons/io5";
import { useAuth } from "../../auth/AuthContext";

export const getMenuData = () => {

  // old code 
// const { t } = useTranslation();
//   const { user } = useAuth();

//   // 🛑 If no user (logged out or not yet logged in) → return empty sidebar
//   if (!user) return [];

//   const id = user?._id;
//   const permissions = user?.role?.modulePermissions || {};

//   const canAccess = (module, action = "read") => {
//     if (!permissions || !permissions[module]) return true;
//     return permissions[module]?.all || permissions[module]?.[action] || true;
//   };


const { t } = useTranslation();
const { user } = useAuth();

// 🛑 If no user (logged out or not yet logged in) → return empty sidebar
if (!user) return [];

const id = user?._id;
const permissions = user?.role?.modulePermissions || {};

const canAccess = (module, action = "read") => {
  // ✅ SuperAdmin bypass: full access (case-insensitive)
  if (user?.role?.name?.toLowerCase() === "superadmin") return true;

  // If no permissions or module not defined → deny
  if (!permissions || !permissions[module]) return false;

  // ✅ Allow only if all:true or specific action:true
   return permissions[module]?.all === true || permissions[module]?.[action] === true;
};

  const menu = [
    // MAIN
    {
      section: t("main"),
      key: "main",
      items: [
        canAccess("Dashboard", "read") && {
          label: t("dashboard"),
          path: "/dashboard",
          icon: <MdOutlineDashboard className="icons" />,
        },
      ].filter(
        (item) =>
          item && (!item.subItems || (item.subItems && item.subItems.length > 0))
      ),
    },
   
    {
  section: t("Connect"),
  key: "Connect",
  items: [
    {
      key: "Connect",
      title: t("Connect"),
      icon: <TbBrandAppleArcade className="icons" />,
      subItems: [
        canAccess("Chat", "read") && { label: t("chat"), path: "/chat" },
        canAccess("Mail", "read") && { label: t("mail"), path: "/mail/inbox" },
      ].filter(Boolean),
    },
  ].filter(
    (item) =>
      item && (!item.subItems || (item.subItems && item.subItems.length > 0))
  ),
},


    // INVENTORY
    {
      section: t("inventory"),
      key: "inventory",
      items: [
        canAccess("Product", "read") && {
          label: t("product"),
          path: "/product",
          icon: <GoPackage className="icons" />,
        },
        canAccess("Product", "read") && {
          label: t("expiredProducts"),
          path: "/expired-products",
          icon: <PiWarningDiamond className="icons" />,
        },
        canAccess("Product", "read") && {
          label: t("lowStocks"),
          path: "/low-stocks",
          icon: <HiArrowTrendingUp className="icons" />,
        },
        canAccess("Category", "read") && {
          label: t("category"),
          path: "/category-list",
          icon: <TbListDetails className="icons" />,
        },
        canAccess("SubCategory", "read") && {
          label: t("subCategory"),
          path: "/sub-categories",
          icon: <MdOutlineCategory className="icons" />,
        },
        canAccess("Brand", "read") && {
          label: t("brands"),
          path: "/brand-list",
          icon: <TbBrandAsana className="icons" />,
        },
        canAccess("Unit", "read") && {
          label: t("units"),
          path: "/units",
          icon: <MdStraighten className="icons" />,
        },
        canAccess("HSN", "read") && {
          label: t("hsn"),
          path: "/hsn",
          icon: <BsHSquare className="icons" />,
        },
        canAccess("VariantAttributes", "read") && {
          label: t("variantAttributes"),
          path: "/variant-attributes",
          icon: <MdChecklist className="icons" />,
        },
        canAccess("Warranty", "read") && {
          label: t("warranties"),
          path: "/warranty",
          icon: <MdVerified className="icons" />,
        },
        canAccess("Barcode", "read") && {
          label: t("printBarcode"),
          path: "/barcode",
          icon: <CiBarcode className="icons" />,
        },
      ].filter(Boolean),
    },

    // PEOPLES
    {
      section: t("peoples"),
      key: "Peoples",
      items: [
        canAccess("Customer", "read") && {
          label: t("customers"),
          path: "/customers",
          icon: <TbUsersGroup className="icons" />,
        },
        canAccess("Supplier", "read") && {
          label: t("suppliers"),
          path: "/suppliers",
          icon: <TbUserDollar className="icons" />,
        },
      ].filter(
        (item) =>
          item && (!item.subItems || (item.subItems && item.subItems.length > 0))
      ),
    },


     // Remove Peoples section completely
// Create a new section only for Warehouse

{
  section: t("warehouse"),
  key: "warehouse",
  items: [
    canAccess("Warehouse", "read") && {
      title: t("Warehouse"),
      icon: <TbBuildingWarehouse className="icons" />,
      key: "Warehouse",
      subItems: [
        { label: t("All warehouse"), path: "/warehouse" },
        { label: t("Stock Movement Log"), path: "/stock-movement-log" },
      ],
    },
  ].filter(Boolean),
},




    // PURCHASES
    {
      section: t("purchases"),
      key: "purchases",
      items: [
        canAccess("Purchase", "read") && {
          label: t("purchases"),
          path: "/purchase-list",
          icon: <TbShoppingBag className="icons" />,
        },
        canAccess("DebitNote", "read") && {
          label: "Debit Note",
          path: "/debit-note",
          icon: <MdQrCode className="icons" />,
        },
      ].filter(Boolean),
    },

    // STOCK
    {
      section: t("Stock"),
      key: "stock",
      items: [
        canAccess("Stock", "read") && {
          label: t("Purchase Stock"),
          path: "/manage-stocks",
          icon: <TbShoppingBag className="icons" />,
        },
        canAccess("StockAdjustment", "read") && {
          label: t("Stock Adjustment"),
          path: "/stock-adjustment",
          icon: <TbFileUnknown className="icons" />,
        },
      ].filter(Boolean),
    },

    // SALES
    {
      section: t("sales"),
      key: "sales",
      items: [
        canAccess("Sales", "read") && {
          label: t("Sales"),
          path: "/online-orders",
          icon: <TbShoppingBag className="icons" />,
        },
        canAccess("CreditNote", "read") && {
          label: "Credit Note",
          path: "/credit-note",
          icon: <MdQrCode className="icons" />,
        },
        canAccess("POS", "read") && {
          label: t("pos"),
          path: "/pos",
          icon: <MdOutlinePointOfSale className="icons" />,
        },
          {
          label: t("invoices"),
          path: "/invoice",
          icon: <TbFileInvoice className="icons" />,
        },
      ].filter(Boolean),
    },


    // PROMO
    {
      section: t("promo"),
      key: "promo",
      items: [
        canAccess("Coupons", "read") && {
          label: t("coupons"),
          path: "/coupons",
          icon: <TbFilePercent className="icons" />,
        },
        canAccess("GiftCards", "read") && {
          label: t("giftCards"),
          path: "/gift-cards",
          icon: <TbGiftCard className="icons" />,
        },
      ].filter(Boolean),
    },

    // LOCATION
    {
      section: t("location"),
      items: [
        canAccess("Location", "read") && {
          title: t("location"),
          icon: <TbMapPin className="icons" />,
          key: "Location",
          subItems: [
            canAccess("Country", "read") && {
              label: t("countries"),
              path: "/countries",
            },
            canAccess("State", "read") && {
              label: t("states"),
              path: "/states",
            },
            canAccess("City", "read") && {
              label: t("cities"),
              path: "/cities",
            },
          ].filter(Boolean),
        },
      ].filter(
        (item) =>
          item && (!item.subItems || (item.subItems && item.subItems.length > 0))
      ),
    },

    // USER MANAGEMENT
    {
      section: t("userManagement"),
      items: [
        canAccess("Users", "read") && {
          label: t("users"),
          icon: <TbUserShield className="icons" />,
          path: "/Users",
        },
        canAccess("Roles", "read") && {
          label: t("rolesPermissions"),
          icon: <TbJumpRope className="icons" />,
          path: "/roles-permissions",
        },
      ].filter(Boolean),
    },

    // SETTINGS

    {
      section: t("settings"),
      items: [
        canAccess("Settings", "read") && {
          title: t("generalSettings"),
          icon: <TbSettings className="icons" />,
          key: "generalSettings",
          subItems: [
            canAccess("Profile", "read") && {
              label: t("profile"),
              path: `/profile/${id}`,
            },
            canAccess("Security", "read") && {
              label: "Security",
              path: "/security-settings",
            },
          ].filter(Boolean),
        },
        canAccess("Website", "read") && {
          title: "Website Settings",
          icon: <TbWorld className="icons" />,
          key: "websiteSettings",
          subItems: [
            canAccess("CompanySettings", "read") && {
              label: "Company Settings",
              path: "/company-settings",
            },
            canAccess("Localization", "read") && {
              label: "Localization",
              path: "/language-settings",
            },
          ].filter(Boolean),
        },
      ].filter(
        (item) =>
          item && (!item.subItems || (item.subItems && item.subItems.length > 0))
      ),
    },

    // REPORTS
    {
      section: "Reports",
      key: "reports",
      items: [
        canAccess("Reports", "read") && {
          label: "Purchase Report",
          path: "/purchase-report",
          icon: <FaRegFileAlt className="icons" />,
        },
      ].filter(Boolean),
    },
    // FINANCE & ACCOUNTS

    {
      section: "Finance & Accounts",
      key: "Finance & Accounts",
      items: [
        canAccess("Finance", "read") && {
          label: "Balance Sheet",
          path: "/balance-sheet",
          icon: <TbReportMoney className="icons" />,
        },
        canAccess("Finance", "read") && {
          label: "Profit & Loss",
          path: "/profit&loss",
          icon: <SiFuturelearn className="icons" />,
        },
        canAccess("Finance", "read") && {
          label: "Overdue Report",
          path: "/overdue-report",
          icon: <FaStackOverflow className="icons" />,
        },
        canAccess("Finance", "read") && {
          label: "Expense Report",
          path: "/expense-report",
          icon: <GiExpense className="icons" />,
        },
        canAccess("Finance", "read") && {
          label: "B2B & B2C",
          path: "/bc",
          icon: <IoLogoWebComponent className="icons" />,
        },
        canAccess("Finance", "read") && {
          label: "Payment History",
          path: "/payment-history",
          icon: <MdOutlinePayments className="icons" />,
        },
        canAccess("Finance", "read") && {
          label: "Credit & Debit Note",
          path: "/credit&debit-note",
          icon: <MdOutlineSpeakerNotes className="icons" />,
        },
      ].filter(Boolean),
    },
{
  section: "Logout",
  key: "Logout",
  items: [
    { label: "Logout", icon: <TbLogout className="icons" />, path: "/logout" },
  ],
},

  ];
  // ✅ Finally filter out empty sections
  return menu.filter((section) => section.items && section.items.length > 0);
};



// import { useTranslation } from "react-i18next";
// import {
//   MdOutlineDashboard,
//   MdOutlineCategory,
//   MdStraighten,
//   MdChecklist,
//   MdVerified,
//   MdQrCode,
// } from "react-icons/md";
// import {
//   TbMapPin,
//   TbUserShield,
//   TbJumpRope,
//   TbTrashX,
//   TbSettings,
//   TbWorld,
//   TbDeviceMobile,
//   TbDeviceDesktop,
//   TbSettingsDollar,
//   TbSettings2,
//   TbLogout,
//   TbTrash,
// } from "react-icons/tb";
// import {
//   TbUserEdit,
//   TbBrandAppleArcade,
//   TbTablePlus,
//   TbListDetails,
//   TbBrandAsana,
// } from "react-icons/tb";
// import { GoPackage } from "react-icons/go";
// import { CiBarcode } from "react-icons/ci";
// import { HiArrowTrendingUp } from "react-icons/hi2";
// import { PiWarningDiamond } from "react-icons/pi";
// import {
//   TbShoppingBag,
//   TbFileUnknown,
//   TbFileUpload,
//   TbFileStack,
//   TbFilePencil,
//   TbMoneybag,
//   TbReportMoney,
//   TbAlertCircle,
//   TbZoomMoney,
//   TbFileInfinity,
//   TbUsersGroup,
//   TbUserUp,
//   TbUserDollar,
//   TbHomeBolt,
//   TbBuildingWarehouse,
// } from "react-icons/tb";
// import { CiBank } from "react-icons/ci";
// import { TbFilePercent, TbGiftCard } from "react-icons/tb";
// import {
//   BsPeople,
//   BsPersonGear,
//   BsPersonFillCheck,
//   BsCalendarCheck,
//   BsFillPersonLinesFill,
//   BsFillPersonXFill,
//   BsHSquare,
// } from "react-icons/bs";

// import {
//   RiAccountPinCircleLine,
//   RiTeamLine,
//   RiTimeLine,
//   RiGroupLine,
// } from "react-icons/ri";

// import {
//   FaRegFileAlt,
//   FaFileInvoiceDollar,
//   FaChartBar,
// } from "react-icons/fa";

// // import {
// //   MdOutlineDashboard,
// //   MdOutlinePointOfSale,
// // } from "react-icons/md";
// import {
//   // MdOutlineDashboard,
//   MdOutlinePointOfSale,
// } from "react-icons/md";
// import {
//   TbFileInvoice,
//   TbReceiptRefund,
//   TbFileDescription,
// } from "react-icons/tb";
// import { SiFuturelearn } from "react-icons/si";
// import { useAuth } from "../../auth/AuthContext";
// import { FaStackOverflow } from "react-icons/fa6";
// import { GiExpense } from "react-icons/gi";
// import { IoLogoWebComponent } from "react-icons/io5";
// import { MdOutlinePayments } from "react-icons/md";
// import { MdOutlineSpeakerNotes } from "react-icons/md";

// export const getMenuData = () => {
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const id = user?._id;
//   return [
//     // main dashboard
//     {
//       section: t("main"),
//       key: "main",
//       items: [
//         { label: t("dashboard"), path: "/dashboard", icon: <MdOutlineDashboard className="icons" /> },
//         // {
//         //   key: "dashboard",
//         //   title: t("dashboard"),
//         //   icon: <MdOutlineDashboard className="icons" />,
//         //   subItems: [
//         //     { label: t("adminDashboard"), path: "/admin" },
//         //     { label: t("adminDashboard2"), path: "/admin-2" },
//         //     { label: t("salesDashboard"), path: "/sales" },
//         //   ],
//         // },
//         {
//           key: "application",
//           title: t("application"),
//           icon: <TbBrandAppleArcade className="icons" />,
//           subItems: [
//             { label: t("chat"), path: "/chat" },
//             { label: t("mail"), path: "/mail/inbox" },
//           ],
//         },
//       ],
//     },
//     // inventory section
//     {
//       section: t("inventory"),
//       key: "inventory",
//       items: [
//         { label: t("product"), path: "/product", icon: <GoPackage className="icons" /> },
//         // { label: t("createProduct"), path: "/choose-adproduct", icon: <TbTablePlus className="icons" /> },
//         { label: t("expiredProducts"), path: "/expired-products", icon: <PiWarningDiamond className="icons" /> },
//         { label: t("lowStocks"), path: "/low-stocks", icon: <HiArrowTrendingUp className="icons" /> },
//         { label: t("category"), path: "/category-list", icon: <TbListDetails className="icons" /> },
//         { label: t("subCategory"), path: "/sub-categories", icon: <MdOutlineCategory className="icons" /> },
//         { label: t("brands"), path: "/brand-list", icon: <TbBrandAsana className="icons" /> },
//         { label: t("units"), path: "/units", icon: <MdStraighten className="icons" /> },
//         { label: t("hsn"), path: "/hsn", icon: <BsHSquare className="icons" /> },
//         { label: t("variantAttributes"), path: "/variant-attributes", icon: <MdChecklist className="icons" /> },
//         { label: t("warranties"), path: "/warranty", icon: <MdVerified className="icons" /> },
//         { label: t("printBarcode"), path: "/barcode", icon: <CiBarcode className="icons" /> },
//         // { label: "Debit", path: "/debit-note", icon: <MdQrCode className="icons" /> },
//         // { label: "Credit", path: "/credit-note", icon: <MdQrCode className="icons" /> },
//       ],
//     },
//     {
//       section: t("peoples"),
//       key: "Peoples",
//       items: [
//         {
//           label: t("customers"),
//           path: "/customers",
//           icon: <TbUsersGroup className="icons" />,
//         },

//         {
//           label: t("suppliers"),
//           path: "/suppliers",
//           icon: <TbUserDollar className="icons" />,
//         },

//         {

//           path: "/warehouse",
//           icon: <TbBuildingWarehouse className="icons" />,
//           title: t("Warehouse"),
//           subItems: [
//             {
//               label: t("All warehouse"),
//               path: "/warehouse",
//             },
//             {
//               label: t("Stock Movement Log"),
//               path: "/stock-movement-log"
//             },
//           ]
//         },
//         // {
//         //   label: t("warehouses"),
//         //   path: "/warehouse",
//         //   icon: <TbBuildingWarehouse className="icons" />,
//         // },
//       ],
//     },
//     {
//       section: t("purchases"),
//       key: "purchases",
//       items: [
//         {
//           label: t("purchases"),
//           path: "/purchase-list",
//           icon: <TbShoppingBag className="icons" />,
//         },
//         // {
//         //   label: t("purchaseOrder"),
//         //   path: "/purchase-order",
//         //   icon: <TbFileUnknown className="icons" />,
//         // },
//         // {
//         //   label: t("purchaseReturn"),
//         //   path: "/purchase-returns",
//         //   icon: <TbFileUpload className="icons" />,
//         // },
//         { label: "Debit Note", path: "/debit-note", icon: <MdQrCode className="icons" /> },
//       ],
//     },

//     {
//       section: t("Stock"),
//       key: "stock",
//       items: [
//         // {
//         //   label: t("Purchase Stocks"),
//         //   path: "/stock",
//         //   icon: <TbShoppingBag className="icons" />,
//         // },
//         // {
//         //   label: t("Purchase Return Stocks"),
//         //   path: "/return-stock",
//         //   icon: <TbShoppingBag className="icons" />,
//         // },
//         {
//           label: t("Purchase Stock"),
//           path: "/manage-stocks",
//           icon: <TbShoppingBag className="icons" />,
//         },
//         // {
//         //   label: t("Stock Adjustment"),
//         //   path: "/stock-adjustment",
//         //   icon: <TbFileUnknown className="icons" />,
//         // },
//         // {
//         //   label: t("Stock Transfer"),
//         //   path: "/stock-transfer",
//         //   icon: <TbFileUpload className="icons" />,
//         // },
//       ],
//     },


//      {
//       section: t("sales"),
//       key: "sales",
//       items: [
//         {
//           label: t("Sales"),
//           path: "/online-orders",
//           icon: <TbShoppingBag className="icons" />,
//         },
//          { label: "Credit Note", path: "/credit-note", icon: <MdQrCode className="icons" /> },
//           {
//           label: t("pos"),
//           path: "/pos",
//           icon: <MdOutlinePointOfSale className="icons" />,
//         },
//           {
//           label: t("Invoice"),
//           path: "/invoice",
//           icon: <TbFileInvoice className="icons" />,
//         },
        
        
//       ],
//     },

//     // {
//     //   section: t("sales"),
//     //   key: "sales",
//     //   items: [
//     //     {
//     //       label: t("sales"),
//     //       path: "/invoice",
//     //       icon: <MdOutlineDashboard className="icons" />,
//     //       title: t("salesOrders"),
//     //       subItems: [
//     //         {
//     //           label: t("Sales Lists"),
//     //           path: "/online-orders",
//     //         },
//     //         // {
//     //         //   label: t("Payment History"),
//     //         //   path: "/sales-payment",
//     //         // },
//     //         // {
//     //         //   label: t("Sales History"),
//     //         //   path: "/sales-log",
//     //         // },
//     //         { label: "Credit", path: "/credit-note", icon: <MdQrCode className="icons" /> },
//     //         {
//     //           label: t("posOrders"),
//     //           path: "/pos",
//     //         },
//     //       ],
//     //     },


//     //     {
//     //       label: t("invoices"),
//     //       path: "/invoice",
//     //       icon: <TbFileInvoice className="icons" />,
//     //     },
//     //     {
//     //       label: t("salesReturn"),
//     //       path: "/sales-returns",
//     //       icon: <TbReceiptRefund className="icons" />,
//     //     },
//     //     // {
//     //     //   label: t("quotation"),
//     //     //   path: "/quotation-list",
//     //     //   icon: <TbFileDescription className="icons" />,
//     //     // },
//     //     {
//     //       label: t("pos"),
//     //       path: "/pos",
//     //       icon: <MdOutlinePointOfSale className="icons" />,
//     //     },

//     //   ],
//     // },
//     {
//       section: t("promo"),
//       key: "promo",
//       items: [
//         {
//           label: t("coupons"),
//           path: "/coupons",
//           icon: <TbFilePercent className="icons" />,
//         },
//         {
//           label: t("giftCards"),
//           path: "/gift-cards",
//           icon: <TbGiftCard className="icons" />,
//         },
//       ],
//     },
//     {
//       section: t("location"),
//       items: [
//         {
//           title: t("location"),
//           icon: <TbMapPin className="icons" />,
//           key: "Location",
//           subItems: [
//             { label: t("countries"), path: "/countries" },
//             { label: t("states"), path: "/states" },
//             { label: t("cities"), path: "/cities" },
//           ],
//         },
//       ],
//     },
//     {
//       section: t("userManagement"),
//       items: [
//         { label: t("users"), icon: <TbUserShield className="icons" />, path: "/Users" },
//         { label: t("rolesPermissions"), icon: <TbJumpRope className="icons" />, path: "/roles-permissions" },
//       ],
//     },
//     {
//       section: t("settings"),
//       items: [
//         {
//           title: t("generalSettings"),
//           // title: "General Settings",
//           icon: <TbSettings className="icons" />,
//           key: "generalSettings",
//           subItems: [
//             // { label: "Purchase", path: "/Purchase-settings" },
//             // { label: "Warehouse", path: "/warehouse-settings" },
//             { label: t("profile"), path: `/profile/${id}` },
//             { label: "Security", path: "/security-settings" },
//             // { label: "Notifications", path: "/notification" },
//             // { label: "Connected Apps", path: "/connected-apps" },
//           ],
//         },
//         {
//           title: "Website Settings",
//           icon: <TbWorld className="icons" />,
//           key: "websiteSettings",
//           subItems: [
//             { label: "Company Settings", path: "/company-settings" },
//             { label: "Localization", path: "/language-settings" },
//             // { label: "Prefixes", path: "/prefixes" },
//             // { label: "Appearance", path: "/appearance" },
//             // { label: "System Settings", path: "/system-settings" },

//           ],
//         },


//       ],
//     },

//     {
//       section: t("Recycle Bin"),
//       key: "delete",
//       items: [
//         {
//           label: t("Trash"),
//           path: "/delete",
//           icon: <TbTrash className="icons" />,
//         },
        
//       ],
//     },

//     // report
//     {
//       section: "Reports",
//       key: "reports",
//       items: [
//         // {
//         //   label: "Sales Report",
//         //   path: "/reports/sales",
//         //   icon: <FaChartBar className="icons" />,
//         // },
//         {
//           label: "Purchase Report",
//           path: "/purchase-report",
//           icon: <FaRegFileAlt className="icons" />,
//         },

//       ],
//     },
//     // finance & acount section
//     {
//       section: "Finance & Accounts",
//       key: "Finance & Accounts",

//       items: [

//         {
//           label: "Balance Sheet",
//           path: "/balance-sheet",
//           icon: <TbReportMoney className="icons" />,
//         },
//         {
//           label: "Profit & Loss",
//           path: "/profit&loss",
//           icon: <SiFuturelearn className="icons" />,
//         },
//         {
//           label: "Overdue Report",
//           path: "/overdue-report",
//           icon: <FaStackOverflow className="icons" />,
//         },
//         {
//           label: "Expense Report",
//           path: "/expense-report",
//           icon: <GiExpense className="icons" />,
//         },
//         {
//           label: "B2B & B2C",
//           path: "/bc",
//           icon: <IoLogoWebComponent className="icons" />,
//         },
//         {
//           label: "Payment History",
//           path: "/payment-history",
//           icon: <MdOutlinePayments className="icons" />,
//         },
//         {
//           label: "Credit & Debit Note",
//           path: "/credit&debit-note",
//           icon: <MdOutlineSpeakerNotes className="icons" />,
//         },

//         {
//           label: "Logout",
//           icon: <TbLogout className="icons" />,
//           path: "/logout",
//         },

//       ],
//     },


//   ];
// };
