import { useNavigate } from "react-router-dom";

import { AppButton } from "../../../widgets/button/ui/AppButton";
import { useLoginForm } from "../model/useLoginForm";

type LoginFormProps = {
  onForgotPassword?: () => void;
};

export const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const navigate = useNavigate();
  const { email, password, rememberMe, isSubmitting, errorMessage, setEmail, setPassword, toggleRememberMe, handleSubmit } = useLoginForm({
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  return (
    <form className="grid gap-3.5" onSubmit={handleSubmit}>
      <label className="grid gap-1.5" htmlFor="email">
        <span className="text-xs font-semibold text-slate-600">Email Address</span>
        <input id="email" name="email" type="email" placeholder="Input placeholder" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-1" required />
      </label>

      <label className="grid gap-1.5" htmlFor="password">
        <span className="text-xs font-semibold text-slate-600">Password</span>
        <input id="password" name="password" type="password" placeholder="Input placeholder" value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-1" required />
      </label>

      <div className="mb-0.5 flex items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-slate-600" htmlFor="rememberMe">
          <input id="rememberMe" name="rememberMe" type="checkbox" checked={rememberMe} onChange={toggleRememberMe} />
          <span>Remember me</span>
        </label>

        <button className="cursor-pointer border-0 bg-transparent text-sm text-slate-600 hover:text-blue-600" type="button" onClick={onForgotPassword}>
          Forgot password?
        </button>
      </div>

      <AppButton fullWidth type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in to Dashboard"}
      </AppButton>

      {errorMessage ? <p className="text-xs font-medium text-rose-600">{errorMessage}</p> : null}

      <div className="relative my-1 text-center before:absolute before:left-0 before:right-0 before:top-1/2 before:border-t before:border-slate-200" aria-hidden="true">
        <span className="relative bg-white px-2 text-xs text-slate-400">or</span>
      </div>

      <AppButton fullWidth type="button" variant="secondary">
        <span className="mr-2 inline-grid h-5 w-5 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-600" aria-hidden="true">
          G
        </span>
        Continue with Google
      </AppButton>

      <p className="mt-0.5 text-center text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <a className="font-semibold text-blue-600 no-underline" href="#signup">
          Sign up free
        </a>
      </p>
    </form>
  );
};
