import { useTranslation } from "react-i18next";
import {
  MdOutlineDashboard,
  MdOutlineCategory,
  MdStraighten,
  MdChecklist,
  MdVerified,
  MdQrCode,
} from "react-icons/md";
import {
  TbMapPin,
  TbUserShield,
  TbJumpRope,
  TbTrashX,
  TbSettings,
  TbWorld,
  TbDeviceMobile,
  TbDeviceDesktop,
  TbSettingsDollar,
  TbSettings2,
  TbLogout,
} from "react-icons/tb";
import {
  TbUserEdit,
  TbBrandAppleArcade,
  TbTablePlus,
  TbListDetails,
  TbBrandAsana,
} from "react-icons/tb";
import { GoPackage } from "react-icons/go";
import { CiBarcode } from "react-icons/ci";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { PiWarningDiamond } from "react-icons/pi";
import {
  TbShoppingBag,
  TbFileUnknown,
  TbFileUpload,
  TbFileStack,
  TbFilePencil,
  TbMoneybag,
  TbReportMoney,
  TbAlertCircle,
  TbZoomMoney,
  TbFileInfinity,
  TbUsersGroup,
  TbUserUp,
  TbUserDollar,
  TbHomeBolt,
  TbBuildingWarehouse,
} from "react-icons/tb";
import { CiBank } from "react-icons/ci";
import { TbFilePercent, TbGiftCard } from "react-icons/tb";
import {
  BsPeople,
  BsPersonGear,
  BsPersonFillCheck,
  BsCalendarCheck,
  BsFillPersonLinesFill,
  BsFillPersonXFill,
  BsHSquare,
} from "react-icons/bs";

import {
  RiAccountPinCircleLine,
  RiTeamLine,
  RiTimeLine,
  RiGroupLine,
} from "react-icons/ri";

import {
  FaRegFileAlt,
  FaFileInvoiceDollar,
  FaChartBar,
} from "react-icons/fa";

// import {
//   MdOutlineDashboard,
//   MdOutlinePointOfSale,
// } from "react-icons/md";
import {
  // MdOutlineDashboard,
  MdOutlinePointOfSale,
} from "react-icons/md";
import {
  TbFileInvoice,
  TbReceiptRefund,
  TbFileDescription,
} from "react-icons/tb";
import { SiFuturelearn } from "react-icons/si";
import { useAuth } from "../../auth/AuthContext";
import { FaStackOverflow } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import { IoLogoWebComponent } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";
import { MdOutlineSpeakerNotes } from "react-icons/md";

export const getMenuData = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const id = user?._id;
  return [
    // main dashboard
    {
      section: t("main"),
      key: "main",
      items: [
        { label: t("dashboard"), path: "/dashboard", icon: <MdOutlineDashboard className="icons" /> },
        // {
        //   key: "dashboard",
        //   title: t("dashboard"),
        //   icon: <MdOutlineDashboard className="icons" />,
        //   subItems: [
        //     { label: t("adminDashboard"), path: "/admin" },
        //     { label: t("adminDashboard2"), path: "/admin-2" },
        //     { label: t("salesDashboard"), path: "/sales" },
        //   ],
        // },
        {
          key: "application",
          title: t("application"),
          icon: <TbBrandAppleArcade className="icons" />,
          subItems: [
            { label: t("chat"), path: "/chat" },
            { label: t("mail"), path: "/mail/inbox" },
          ],
        },
      ],
    },
    // inventory section
    {
      section: t("inventory"),
      key: "inventory",
      items: [
        { label: t("product"), path: "/product", icon: <GoPackage className="icons" /> },
        { label: t("createProduct"), path: "/choose-adproduct", icon: <TbTablePlus className="icons" /> },
        { label: t("expiredProducts"), path: "/expired-products", icon: <PiWarningDiamond className="icons" /> },
        { label: t("lowStocks"), path: "/low-stocks", icon: <HiArrowTrendingUp className="icons" /> },
        { label: t("category"), path: "/category-list", icon: <TbListDetails className="icons" /> },
        { label: t("subCategory"), path: "/sub-categories", icon: <MdOutlineCategory className="icons" /> },
        { label: t("brands"), path: "/brand-list", icon: <TbBrandAsana className="icons" /> },
        { label: t("units"), path: "/units", icon: <MdStraighten className="icons" /> },
        { label: t("hsn"), path: "/hsn", icon: <BsHSquare className="icons" /> },
        { label: t("variantAttributes"), path: "/variant-attributes", icon: <MdChecklist className="icons" /> },
        { label: t("warranties"), path: "/warranty", icon: <MdVerified className="icons" /> },
        { label: t("printBarcode"), path: "/barcode", icon: <CiBarcode className="icons" /> },
        // { label: "Debit", path: "/debit-note", icon: <MdQrCode className="icons" /> },
        // { label: "Credit", path: "/credit-note", icon: <MdQrCode className="icons" /> },
      ],
    },
    {
      section: t("peoples"),
      key: "Peoples",
      items: [
        {
          label: t("customers"),
          path: "/customers",
          icon: <TbUsersGroup className="icons" />,
        },

        {
          label: t("suppliers"),
          path: "/suppliers",
          icon: <TbUserDollar className="icons" />,
        },

        {

          path: "/warehouse",
          icon: <TbBuildingWarehouse className="icons" />,
          title: t("Warehouse"),
          subItems: [
            {
              label: t("All warehouse"),
              path: "/warehouse",
            },
            {
              label: t("Stock Movement Log"),
              path: "/stock-movement-log"
            },
          ]
        },
        // {
        //   label: t("warehouses"),
        //   path: "/warehouse",
        //   icon: <TbBuildingWarehouse className="icons" />,
        // },
      ],
    },
    {
      section: t("purchases"),
      key: "purchases",
      items: [
        {
          label: t("purchases"),
          path: "/purchase-list",
          icon: <TbShoppingBag className="icons" />,
        },
        {
          label: t("purchaseOrder"),
          path: "/purchase-order",
          icon: <TbFileUnknown className="icons" />,
        },
        {
          label: t("purchaseReturn"),
          path: "/purchase-returns",
          icon: <TbFileUpload className="icons" />,
        },
        { label: "Debit Note", path: "/debit-note", icon: <MdQrCode className="icons" /> },
      ],
    },

    {
      section: t("Stock"),
      key: "stock",
      items: [
        // {
        //   label: t("Purchase Stocks"),
        //   path: "/stock",
        //   icon: <TbShoppingBag className="icons" />,
        // },
        // {
        //   label: t("Purchase Return Stocks"),
        //   path: "/return-stock",
        //   icon: <TbShoppingBag className="icons" />,
        // },
        {
          label: t("Purchase Stock"),
          path: "/manage-stocks",
          icon: <TbShoppingBag className="icons" />,
        },
        // {
        //   label: t("Stock Adjustment"),
        //   path: "/stock-adjustment",
        //   icon: <TbFileUnknown className="icons" />,
        // },
        // {
        //   label: t("Stock Transfer"),
        //   path: "/stock-transfer",
        //   icon: <TbFileUpload className="icons" />,
        // },
      ],
    },


    {
      section: t("sales"),
      key: "sales",
      items: [
        {
          label: t("sales"),
          path: "/invoice",
          icon: <MdOutlineDashboard className="icons" />,
          title: t("salesOrders"),
          subItems: [
            {
              label: t("onlineOrders"),
              path: "/online-orders",
            },
            {
              label: t("Payment History"),
              path: "/sales-payment",
            },
            {
              label: t("Sales History"),
              path: "/sales-log",
            },
            { label: "Credit", path: "/credit-note", icon: <MdQrCode className="icons" /> },
            {
              label: t("posOrders"),
              path: "/pos",
            },
          ],
        },


        {
          label: t("invoices"),
          path: "/invoice",
          icon: <TbFileInvoice className="icons" />,
        },
        {
          label: t("salesReturn"),
          path: "/sales-returns",
          icon: <TbReceiptRefund className="icons" />,
        },
        // {
        //   label: t("quotation"),
        //   path: "/quotation-list",
        //   icon: <TbFileDescription className="icons" />,
        // },
        {
          label: t("pos"),
          path: "/pos",
          icon: <MdOutlinePointOfSale className="icons" />,
        },

      ],
    },
    {
      section: t("promo"),
      key: "promo",
      items: [
        {
          label: t("coupons"),
          path: "/coupons",
          icon: <TbFilePercent className="icons" />,
        },
        {
          label: t("giftCards"),
          path: "/gift-cards",
          icon: <TbGiftCard className="icons" />,
        },
      ],
    },
    {
      section: t("location"),
      items: [
        {
          title: t("location"),
          icon: <TbMapPin className="icons" />,
          key: "Location",
          subItems: [
            { label: t("countries"), path: "/countries" },
            { label: t("states"), path: "/states" },
            { label: t("cities"), path: "/cities" },
          ],
        },
      ],
    },
    {
      section: t("userManagement"),
      items: [
        { label: t("users"), icon: <TbUserShield className="icons" />, path: "/Users" },
        { label: t("rolesPermissions"), icon: <TbJumpRope className="icons" />, path: "/roles-permissions" },
      ],
    },
    {
      section: t("settings"),
      items: [
        {
          title: t("generalSettings"),
          // title: "General Settings",
          icon: <TbSettings className="icons" />,
          key: "generalSettings",
          subItems: [
            // { label: "Purchase", path: "/Purchase-settings" },
            // { label: "Warehouse", path: "/warehouse-settings" },
            { label: t("profile"), path: `/profile/${id}` },
            { label: "Security", path: "/security-settings" },
            // { label: "Notifications", path: "/notification" },
            // { label: "Connected Apps", path: "/connected-apps" },
          ],
        },
        {
          title: "Website Settings",
          icon: <TbWorld className="icons" />,
          key: "websiteSettings",
          subItems: [
            { label: "Company Settings", path: "/company-settings" },
            { label: "Localization", path: "/language-settings" },
            // { label: "Prefixes", path: "/prefixes" },
            // { label: "Appearance", path: "/appearance" },
            // { label: "System Settings", path: "/system-settings" },

          ],
        },


      ],
    },

    // report
    {
      section: "Reports",
      key: "reports",
      items: [
        {
          label: "Sales Report",
          path: "/reports/sales",
          icon: <FaChartBar className="icons" />,
        },
        {
          label: "Purchase Report",
          path: "/purchase-report",
          icon: <FaRegFileAlt className="icons" />,
        },

      ],
    },
    // finance & acount section
    {
      section: "Finance & Accounts",
      key: "Finance & Accounts",

      items: [

        {
          label: "Balance Sheet",
          path: "/balance-sheet",
          icon: <TbReportMoney className="icons" />,
        },
        {
          label: "Profit & Loss",
          path: "/profit&loss",
          icon: <SiFuturelearn className="icons" />,
        },
        {
          label: "Overdue Report",
          path: "/overdue-report",
          icon: <FaStackOverflow className="icons" />,
        },
        {
          label: "Expense Report",
          path: "/expense-report",
          icon: <GiExpense className="icons" />,
        },
        {
          label: "B2B & B2C",
          path: "/bc",
          icon: <IoLogoWebComponent className="icons" />,
        },
        {
          label: "Payment History",
          path: "/payment-history",
          icon: <MdOutlinePayments className="icons" />,
        },
        {
          label: "Credit & Debit Note",
          path: "/credit&debit-note",
          icon: <MdOutlineSpeakerNotes className="icons" />,
        },

        {
          label: "Logout",
          icon: <TbLogout className="icons" />,
          path: "/logout",
        },

      ],
    },


  ];
};
