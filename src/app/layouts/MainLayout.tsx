import type { PropsWithChildren } from "react";

type MainLayoutProps = PropsWithChildren<{
  className?: string;
}>;

export const MainLayout = ({ children, className }: MainLayoutProps) => {
  const layoutClassName = ["grid min-h-screen place-items-center overflow-auto bg-slate-900 p-0", className ?? ""].filter(Boolean).join(" ");

  return <main className={layoutClassName}>{children}</main>;
};
