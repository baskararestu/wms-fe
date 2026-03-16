import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { DashboardPage } from "../../pages/dashboard/ui/DashboardPage";
import { LoginPage } from "../../pages/login/ui/LoginPage";
import { AUTH_LOGOUT_EVENT, forceLogout, hasValidAccessToken, isAccessTokenExpired } from "../../shared/auth/authSession";
import { getAccessToken } from "../../shared/auth/tokenStorage";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) {
    return <Navigate replace to="/login" state={{ from: location.pathname }} />;
  }

  if (isAccessTokenExpired(token, 0)) {
    forceLogout();
    return <Navigate replace to="/login" state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

const GuestOnlyRoute = () => {
  if (hasValidAccessToken()) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
};

export const AppRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getAccessToken();

    if (token && isAccessTokenExpired(token, 0)) {
      forceLogout();
    }
  }, [location.pathname]);

  useEffect(() => {
    const onAuthLogout = () => {
      navigate("/login", { replace: true });
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, onAuthLogout);

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, onAuthLogout);
    };
  }, [navigate]);

  return (
    <Routes>
      <Route element={<GuestOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate replace to={hasValidAccessToken() ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};
