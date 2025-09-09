import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/AppRoutes";
import LanguageSwitcher from "./utils/LanguageSwitch/LanguageSwitcher";
import "./i18n"; // Import i18n config
const App = () => {
  return (
    <BrowserRouter>
      {/* <LanguageSwitcher /> */}
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
