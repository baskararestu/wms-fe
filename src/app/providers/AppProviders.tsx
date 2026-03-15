import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "../router/AppRouter";

export const AppProviders = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};
