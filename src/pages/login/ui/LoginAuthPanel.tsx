import type { PropsWithChildren } from "react";

type LoginAuthPanelProps = PropsWithChildren;

export const LoginAuthPanel = ({ children }: LoginAuthPanelProps) => {
  return (
    <>
      <h2 className="m-0 text-5xl font-bold tracking-tight max-lg:text-4xl">Welcome Back</h2>
      <p className="mb-8 mt-2 text-sm text-slate-500">Sign in to your account to continue</p>
      {children}
    </>
  );
};
