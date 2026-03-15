import type { ReactNode } from "react";

type LoginPageLayoutProps = {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
};

export const LoginPageLayout = ({ leftPanel, rightPanel }: LoginPageLayoutProps) => {
  return (
    <section className="grid h-full w-full grid-cols-2 overflow-hidden rounded bg-white shadow-2xl max-lg:grid-cols-1" aria-label="Login page layout">
      <div className="relative flex items-center justify-center bg-linear-to-br from-blue-600 via-blue-600 to-blue-700 px-14 py-20 text-white max-lg:px-7 max-lg:py-10">
        <div className="w-full max-w-md">{leftPanel}</div>
      </div>
      <div className="flex items-center justify-center px-16 py-20 text-slate-800 max-lg:px-7 max-lg:py-10">
        <div className="w-full max-w-md">{rightPanel}</div>
      </div>
    </section>
  );
};
