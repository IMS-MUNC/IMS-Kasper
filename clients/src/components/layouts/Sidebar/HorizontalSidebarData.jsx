// horizontalSidebarData.jsx
// This file exports horizontalSidebarMenu in the required format for Sidebar rendering
import {
    MdOutlineDashboard,
    MdOutlineCategory,
    MdStraighten,
    MdChecklist,
    MdVerified,
    MdQrCode,
} from "react-icons/md";
import { GoPackage } from "react-icons/go";
import { TbShoppingBag, TbFileUnknown, TbFileUpload, TbListDetails, TbBrandAsana } from "react-icons/tb";
import { BsHSquare } from "react-icons/bs";
import { FaRegFileAlt } from "react-icons/fa";

export const horizontalSidebarMenu = [
    {
        title: "Dashboard",
        icon: <MdOutlineDashboard className="icons" />,
        links: [
            { title: "Admin Dashboard", path: "/admin" },
            { title: "Admin Dashboard 2", path: "/admin-2" },
            { title: "Sales Dashboard", path: "/sales" },
        ],
    },
    {
        title: "Products",
        icon: <GoPackage className="icons" />,
        links: [
            { title: "Product List", path: "/product" },
            { title: "Create Product", path: "/choose-adproduct" },
            { title: "Expired Products", path: "/expired-products" },
            { title: "Low Stocks", path: "/low-stocks" },
            { title: "Print Barcode", path: "/barcode" },
            { title: "Print QRCode", path: "/qrcode" },
            { title: "HSN", path: "/hsn" },
            { title: "Variant Attributes", path: "/variant-attributes" },
            { title: "Warranties", path: "/warranty" },
        ],
    },
    {
        title: "Categories",
        icon: <TbListDetails className="icons" />,
        links: [
            { title: "Category List", path: "/category-list" },
            { title: "Sub Categories", path: "/sub-categories" },
            { title: "Brands", path: "/brand-list" },
            { title: "Units", path: "/units" },
        ],
    },
    {
        title: "Purchases",
        icon: <TbShoppingBag className="icons" />,
        links: [
            { title: "Purchase List", path: "/purchase-list" },
            { title: "Purchase Order", path: "/purchase-order" },
            { title: "Purchase Return", path: "/purchase-returns" },
            { title: "Purchase Report", path: "/purchase-report" },
        ],
    },
    {
        title: "Stock",
        icon: <TbShoppingBag className="icons" />,
        links: [
            { title: "Manage Stock", path: "/manage-stocks" },
            { title: "Stock Adjustment", path: "/stock-adjustment" },
            { title: "Stock Transfer", path: "/stock-transfer" },
        ],
    },
    {
        title: "Sales",
        icon: <MdOutlineDashboard className="icons" />,
        links: [
            { title: "Online Orders", path: "/online-orders" },
            { title: "POS Orders", path: "/pos-orders" },
            { title: "Invoices", path: "/invoice" },
            { title: "Sales Return", path: "/sales-returns" },
            { title: "Quotation", path: "/quotation-list" },
        ],
    },
    {
        title: "Promo",
        icon: <FaRegFileAlt className="icons" />,
        links: [
            { title: "Coupons", path: "/coupons" },
            { title: "Gift Cards", path: "/gift-cards" },
        ],
    },
    {
        title: "Location",
        icon: <MdOutlineCategory className="icons" />,
        links: [
            { title: "Locations", path: "/locations" },
            { title: "Countries", path: "/countries" },
            { title: "States", path: "/states" },
            { title: "Cities", path: "/cities" },
        ],
    },
    {
        title: "User Management",
        icon: <MdOutlineDashboard className="icons" />,
        links: [
            { title: "Users", path: "/Users" },
            { title: "Roles & Permissions", path: "/roles-permissions" },
            { title: "Delete Account Request", path: "/delete-account" },
        ],
    },
    {
        title: "Settings",
        icon: <MdOutlineDashboard className="icons" />,
        links: [
            { title: "Purchase Settings", path: "/Purchase-settings" },
            { title: "Warehouse Settings", path: "/warehouse-settings" },
            { title: "Profile", path: "/general-settings" },
            { title: "Security", path: "/security-settings" },
            { title: "Notifications", path: "/notification" },
            { title: "Connected Apps", path: "/connected-apps" },
            { title: "System Settings", path: "/system-settings" },
            { title: "Company Settings", path: "/company-settings" },
            { title: "Localization", path: "/localization-settings" },
            { title: "Prefixes", path: "/prefixes" },
            { title: "Preference", path: "/preference" },
            { title: "Appearance", path: "/appearance" },
            { title: "Social Authentication", path: "/social-authentication" },
            { title: "Language", path: "/language-settings" },
            { title: "Printer", path: "/printer-settings" },
            { title: "POS", path: "/pos-settings" },
            { title: "Custom Fields", path: "/custom-fields" },
            { title: "Email Settings", path: "/email-settings" },
            { title: "Email Template", path: "/email-template" },
            { title: "SMS Settings", path: "/sms-settings" },
            { title: "SMS Template", path: "/sms-template" },
            { title: "OTP", path: "/otp-settings" },
            { title: "GDPR Cookies", path: "/gdpr-settings" },
            { title: "Payment Gateway", path: "/payment-gateway-settings" },
            { title: "Bank Accounts", path: "/bank-settings-grid" },
            { title: "Tax Rates", path: "/tax-rates" },
            { title: "Currencies", path: "/currency-settings" },
            { title: "Storage", path: "/storage-settings" },
            { title: "Ban IP Address", path: "/ban-ip-address" },
            { title: "Logout", path: "/logout" },
        ],
    },
    {
        title: "Reports",
        icon: <FaRegFileAlt className="icons" />,
        links: [
            { title: "Sales Report", path: "/reports/sales" },
            { title: "Purchase Report", path: "/purchase-report" },
            { title: "Inventory Report", path: "/reports/inventory" },
            { title: "Employee Report", path: "/reports/employees" },
        ],
    },
    // Add more sections as needed
];
