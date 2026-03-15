import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import { AppProviders } from "./app/providers/AppProviders";
import { setupAuthInterceptors } from "./shared/api/httpClient";
import "./app/styles/global.css";

setupAuthInterceptors();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders />
    <Toaster richColors closeButton position="top-center" />
  </StrictMode>,
);
