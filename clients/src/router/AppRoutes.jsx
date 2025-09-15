import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login/Login";
import Register from "../components/auth/Register/Register";
import ForgotPassword from "../components/auth/ForgotPassword/ForgotPassword";
import Dashboard from "../components/Dashboard/Admin/AdminDashboard";
import AuthLayout from "../components/layouts/autlayout/AuthLayout";
import Setting from "../settings/Setting";
import ResetPassword from "../components/auth/ResetPassword/ResetPassword";
import ChangePassword from "../components/auth/ChangePassword/ChangePassword";
import Profile from "../pages/profile/Profile";
import PrivateRoute from "../utils/PrivateRoute";
//------------------------------- invetory------------------------------//

import Product from "../components/features/inventory/product/Product";
import ChooseToAddProduct from "../components/features/inventory/product/ChooseToAddProduct.jsx";
import ProductCreate from "../components/features/inventory/product/ProductCreate";
import ExpriedProduct from "../components/features/inventory/product/ExpriedProduct";
import Category from "../components/features/category/Category";
import SubCategory from "../components/features/category/subcategory/SubCategory";
import Country from "../pages/Location/country/Country";
import State from "../pages/Location/state/State.jsx";
import City from "../pages/Location/city/City";
import LocationTable from "../pages/Location/LocationTable";
import Brand from "../components/features/brand/Brand";
import Units from "../components/features/units/Units";
import Stores from "../components/features/stores/Stores";
import Users from "../components/auth/users/Users";
import Role from "../pages/Role/Role";
import Permission from "../pages/permission/Permission";
import RolePermissionEditor from "../pages/permission/RolePermissionEditor";
import Warranty from "../components/features/inventory/warranty/Warranty";
import Logout from "../components/auth/Logout/Logout.jsx"; // adjust path if needed
import Coupons from "../components/features/Promo/Coupons.jsx";
// ... all your imports remain same
import GiftCard from "../components/features/Promo/GiftCard.jsx"
import "../i18n.js"; // Import here
import Chat from "../components/features/Chat/Chat.jsx";
// import Mail from "../components/features/Mail/mail.jsx"
import Activities from "../components/layouts/Navbar/activities.jsx";
import ViewAllNotifications from "../components/layouts/Navbar/ViewAllNotifications.jsx";
import Barcode from "../components/features/inventory/barcode/Barcode.jsx";
// import Mail from "../components/features/Mail/mail.jsx"

// ------------------ Mail Components ------------------ //
// import MailPage from "../Pages/MailPage";
// import Inbox from "../components/EmailLayout/Inbox";
import MailPage from "../components/features/Mail/Pages/MailPage.jsx";

import Inbox from "../components/features/Mail/EmailLayout/Inbox.jsx"
import Starred from "../components/features/Mail/EmailLayout/Starred.jsx";
import Sent from "../components/features/Mail/EmailLayout/Sent.jsx";
import Drafts from "../components/features/Mail/EmailLayout/Drafts";
import Importants from "../components/features/Mail/EmailLayout/Importants.jsx";
import Spam from "../components/features/Mail/EmailLayout/Spam.jsx";
import Deleted from "../components/features/Mail/EmailLayout/Deleted.jsx";
import EmailMessages from "../components/features/Mail/EmailMessages/EmailMessages.jsx";


import ManageStock from "../components/features/stock/manageStock/ManageStock";
import StockAdujestment from "../components/features/stock/stockAdujestment/StockAdujestment";
import StockTransfer from "../components/features/stock/stockTransfer/StockTransfer";

import Purchase from "../components/features/purchase/Purchases/Purchase.jsx";
import PurchaseReturn from "../components/features/purchase/PurchaseReturn//PurchaseReturn.jsx";
import PurchaseOrder from "../components/features/purchase/PurchaseOrder/PurchaseOrder.jsx";
import PurchaseSettings from "../settings/purchase/PurchaseSettings.jsx";
import Hsn from "../components/features/inventory/hsn/Hsn.jsx";
import Warehouse from "../components/features/warehouse/Warehouse.jsx";
import RackSettings from "../settings/warehouse/RackSettings.jsx";
import SidebarSettings from "../settings/sidebar/SidebarSettings.jsx";
import Variant from "../components/features/variant/varient.jsx";
import AdminDashboard from "../components/Dashboard/Admin/AdminDashboard.jsx";
import ThemeCustomizer from "../pages/themes/ThemeCustomizer.jsx";
import LanguageSwitcher from "../utils/LanguageSwitch/LanguageSwitcher.jsx";
import DebitNote from "../components/features/creditDebit/debitNote/DebitNote.jsx";
import CreditNote from "../components/features/creditDebit/creditNote/CreditNote.jsx";
import Sales from "../components/features/sales/Sales.jsx";
import SaleReturn from "../components/features/sales/return/SaleReturn.jsx";
import AllCustomer from "../components/features/customers/AllCustomers.jsx";
import AllSuppliers from "../components/features/suppliers/AllSuppliers.jsx";
import ViewSupplierModal from "../pages/Modal/suppliers/ViewSupplierModal.jsx";
import ViewPurchase from "../pages/Modal/PurchaseModals/ViewPurchase.jsx";
import LowStock from "../components/features/stock/lowstock/LowStock.jsx";
import PurchaseReport from "../components/features/inventory/report/PurchaseReport.jsx";
import InvoiceTemplate from "../pages/Invoices/Invoice.jsx";
import Invoice7 from "../pages/Invoices/Invoice7.jsx";
import ProductEdit from "../components/features/inventory/product/ProductEdit";
import ProductStock from "../components/features/inventory/product/ProductStock.jsx";
import ViewProductStock from "../pages/ViewProductStock.jsx";
import ViewReturnProduct from "../pages/ViewReturnProduct.jsx";
import SaleHistory from "../../../clients/src/components/features/sales/SaleHistory.jsx";
import ViewSales from "../components/features/sales/ViewSales.jsx";
import Invoice from "../components/features/sales/Invoice.jsx";
import SalePaymentHistory from "../../../clients/src/components/features/sales/SalesPaymentHistory.jsx";
import Pos from "../pages/pos/Pos.jsx";




// import Settings from "../pages/setting28-07-2025/Settings.jsx";
import UserProfiles from "../components/componentSetting/profile/Profile.jsx";
import Security from "../components/componentSetting/security/Security.jsx";
import Notification from "../components/componentSetting/notification/Notification.jsx";
import ConnectedApps from "../components/componentSetting/connectedApps/ConnectedApps.jsx";
import SystemSettings from "../components/componentSetting/systemsettings/SystemSettings.jsx";
import Companysettings from "../components/componentSetting/companySettings/Companysettings.jsx";
import Localization from "../components/componentSetting/localization/Localization.jsx";
import Prefixes from "../components/componentSetting/prefixes/Prefixes.jsx";
import Preferance from "../components/componentSetting/prefrance/Preferance.jsx";
import Appearance from "../components/componentSetting/appearance/Appearance.jsx";
import SocialAuthentications from "../components/componentSetting/socialAuthentication/SocialAuthentication.jsx";
import Language from "../components/componentSetting/language/Language.jsx";
import InvoiceSettings from "../settings/invoice/InvoiceSettings.jsx";
import AddWarehouse from "../components/features/warehouse/AddWarehouse.jsx";
import WarehouseDetails from "../components/features/warehouse/WarehouseDetails.jsx";
import Godown from "../components/features/warehouse/Godown.jsx";
import SelectPage from "../components/features/warehouse/SelectPage.jsx";
import StockMovementLog from "../components/features/warehouse/StockMovementLog.jsx";

// FINANNCE & ACCOUNT 
import BalanceSheet from "../pages/finance&accounts/balance_sheet/BalanceSheet.jsx";
import ProfitLoss from "../pages/finance&accounts/profit_loss/ProfitLoss.jsx";
import ProfitLossDateChoose from "../pages/finance&accounts/profit_loss/ProfitLossDateChoose.jsx";
import ProfitLossSelectDate from "../pages/finance&accounts/profit_loss/ProfitLossSelectDate.jsx";
import OverdueReport from "../pages/finance&accounts/overdue_report/OverdueReport.jsx";
import ExpenseReport from "../pages/finance&accounts/expense_report/ExpenseReport.jsx";
import ExpenseForm from "../pages/finance&accounts/expense_report/ExpenseForm.jsx";
import ExpenseFormEdit from "../pages/finance&accounts/expense_report/ExpenseFromEdit.jsx";
import BC from "../pages/finance&accounts/b2b&b2c/BC.jsx";
import PaymentHistory from "../pages/finance&accounts/payment_history/PaymentHistory.jsx";
import CreditDebitNotes from "../pages/finance&accounts/credit&debit_note/CreditDebitNotes.jsx";
import Credit from "../pages/finance&accounts/credit&debit_note/Credit.jsx";
import Debit from "../pages/finance&accounts/credit&debit_note/Debit.jsx";
import ExpenseReportProductModal from "../pages/finance&accounts/expense_report/ExpenseReportProductModal.jsx"
import PosHeader from "../pages/pos/posHead/PosHeader.jsx";
import OtpVerification from "../components/auth/OtpVerification.jsx";
import Quotation from "../components/features/quotation/Quotation.jsx";
import NewPos from "../pages/pos/NewPos.jsx";
// import {Pos} from "../pages/pos/Pos.jsx";


const AppRoutes = () => {
  return (

    <Routes>
      {/* Auth & 404 remain outside layout */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/otp" element={<OtpVerification />} />


      <Route
        element={
          <PrivateRoute>
            <AuthLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/general-settings" element={<Setting />} /> */}

        <Route path="/" element={<Setting />}>
          <Route path="profile/:id" element={<UserProfiles />} />
          <Route path="security-settings" element={<Security />} />
          <Route path="notification" element={<Notification />} />
          <Route path="connectedapps" element={<ConnectedApps />} />
          <Route path="system-settings" element={<SystemSettings />} />
          <Route path="company-settings" element={<Companysettings />} />
          <Route path="language-settings" element={<Localization />} />
          <Route path="prefixes" element={<Prefixes />} />
          <Route path="preferance" element={<Preferance />} />
          <Route path="appearance" element={<Appearance />} />
          <Route path="socialauth" element={<SocialAuthentications />} />
          <Route path="language" element={<Language />} />
          <Route path="invoice-settings" element={<InvoiceSettings />} />
          <Route path="/Purchase-settings" element={<PurchaseSettings />} />
          <Route path="/warehouse-settings" element={<RackSettings />} />
        </Route>


        <Route path="/profile" element={<Profile />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/edit/:id" element={<ProductEdit />} />

        <Route path="/choose-adproduct" element={<ChooseToAddProduct />} />
        <Route path="/add-product" element={<ProductCreate />} />
        <Route path="/expired-products" element={<ExpriedProduct />} />
        <Route path="/category-list" element={<Category />} />
        <Route path="/sub-categories" element={<SubCategory />} />
        <Route path="/brand-list" element={<Brand />} />
        <Route path="/units" element={<Units />} />
        <Route path="/users" element={<Users />} />
        <Route path="/roles-permissions" element={<Role />} />
        {/* <Route path="/permissions/:roleId" element={<RolePermissionEditor />} /> */}
        <Route path="/permissions" element={<RolePermissionEditor />} />
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/countries" element={<Country />} />
        <Route path="/states" element={<State />} />
        <Route path="/cities" element={<City />} />
        <Route path="/locations" element={<LocationTable />} />
        <Route path="/store-list" element={<Stores />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/gift-cards" element={<GiftCard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/variant-attributes" element={<Variant />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/theme" element={<ThemeCustomizer />} />
        <Route path="/language" element={<LanguageSwitcher />} />
        <Route path="/debit-note" element={<DebitNote />} />
        <Route path="/credit-note" element={<CreditNote />} />

        <Route path="/activities" element={<Activities />} />
        <Route path="/ViewAllNotifications" element={<ViewAllNotifications />} />
        <Route path="/barcode" element={<Barcode />} />




        {/* purchase */}
        <Route path="/purchase-list" element={<Purchase />} />
        <Route path="/purchase-order" element={<PurchaseOrder />} />
        <Route path="/purchase-returns" element={<PurchaseReturn />} />
        {/* <Route path="/purchase-report" element={<ViewPurchase />} /> */}
        <Route path="/purchase-report" element={<PurchaseReport />} />

        {/* sales */}
        <Route path="/online-orders" element={<Sales />} />
        <Route path="/sales-returns" element={<SaleReturn />} />
        <Route path="/sales/view/:id" element={<ViewSales />} />
        <Route path="/invoice/:invoiceId" element={<Invoice />} />
        <Route path="/sales-log" element={<SaleHistory />} />
        <Route path="/sales-payment" element={<SalePaymentHistory />} />
        <Route path="/quotation-list" element={<Quotation />} />

        {/* stock */}
        <Route path="/stock" element={<ViewProductStock />} />
        <Route path="/return-stock" element={<ViewReturnProduct />} />
        <Route path="/manage-stocks" element={<ManageStock />} />
        <Route path="/stock-adjustment" element={<StockAdujestment />} />
        <Route path="/stock-transfer" element={<StockTransfer />} />
        <Route path="/low-stocks" element={<LowStock />} />
        <Route path="/hsn" element={<Hsn />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/invoice" element={<InvoiceTemplate />} />
        <Route path="/invoice7" element={<Invoice7 />} />
        <Route path="/stock-transfer" element={<StockTransfer />} />
        <Route path="/hsn" element={<Hsn />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/addwarehouse" element={<AddWarehouse />} />
        <Route path="/WarehouseDetails/:id" element={<WarehouseDetails />} />
        <Route path="/Godown/:id" element={<Godown />} />
        <Route path="/selectpage" element={<SelectPage />} />
        <Route path="/stock-movement-log" element={<StockMovementLog />} />


        {/* customer */}
        <Route path="/customers" element={<AllCustomer />} />
        {/* suppplier */}
        <Route path="/suppliers" element={<AllSuppliers />} />
        <Route path="/viewsupplier/:id" element={<ViewSupplierModal />} />
        {/* settings */}
        {/* <Route path="/Purchase-settings" element={<PurchaseSettings />} />
        <Route path="/warehouse-settings" element={<RackSettings />} /> */}
        {/* <Route path="/sidebar-settings" element={<SidebarSettings />} /> */}





        {/* ------------------ MAIL ROUTES ------------------ */}
        <Route path="/mail" element={<MailPage />}>
          <Route path="inbox" element={<Inbox />} />
          <Route path="starred" element={<Starred />} />
          <Route path="sent" element={<Sent />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="important" element={<Importants />} />
          <Route path="allemails" element={<EmailMessages />} />
          <Route path="spam" element={<Spam />} />
          <Route path="deleted" element={<Deleted />} />
        </Route>


        {/* ------------------ Finance & Accounts ------------------ */}
        <Route path="/balance-sheet" element={<BalanceSheet />} />
        <Route path="/profit&loss" element={<ProfitLoss />} />
        <Route
          path="/profit_lossdate_choose"
          element={<ProfitLossDateChoose />}
        />
        <Route
          path="/profit_lossselect_date"
          element={<ProfitLossSelectDate />}
        />
        <Route path="/overdue-report" element={<OverdueReport />} />
        <Route path="/expense-report" element={<ExpenseReport />} />
        <Route path="/add_expenses" element={<ExpenseForm />} />
        <Route path="/expenseformedit" element={<ExpenseFormEdit />} />
        <Route path="/expensereportproduct-modal" element={<ExpenseReportProductModal />} />
        <Route path="/bc" element={<BC />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/credit&debit-note" element={<CreditDebitNotes />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/debit" element={<Debit />} />


      </Route>
      {/* <Route path="/pos" element={<Pos />} /> */}
      {/* <Route path="/pos" element={<NewPos/>} /> */}
      {/* POS with header */}
      <Route path="/pos" element={
        <>
          <PosHeader />
          <Pos />
        </>
      } />
    </Routes>
  );
};

export default AppRoutes;


