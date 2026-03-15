import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardPage } from "../../pages/dashboard/ui/DashboardPage";
import { LoginPage } from "../../pages/login/ui/LoginPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate replace to="/dashboard" />} />
    </Routes>
  );
};
