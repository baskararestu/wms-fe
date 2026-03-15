import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "../../pages/login/ui/LoginPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </Routes>
  );
};
