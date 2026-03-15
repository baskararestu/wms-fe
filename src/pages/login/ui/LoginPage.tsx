import { MainLayout } from "../../../app/layouts/MainLayout";
import { LoginForm } from "../../../features/auth-login/ui/LoginForm";
import { LoginAuthPanel } from "./LoginAuthPanel";
import { LoginHeroPanel } from "./LoginHeroPanel";
import { LoginPageLayout } from "./LoginPageLayout";

export const LoginPage = () => {
  return (
    <MainLayout>
      <LoginPageLayout
        leftPanel={<LoginHeroPanel />}
        rightPanel={
          <LoginAuthPanel>
            <LoginForm />
          </LoginAuthPanel>
        }
      />
    </MainLayout>
  );
};
