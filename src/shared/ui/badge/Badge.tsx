import type { PropsWithChildren } from "react";

type BadgeTone = "emerald" | "rose" | "amber" | "violet" | "blue" | "cyan" | "orange" | "slate";

type BadgeProps = PropsWithChildren<{
  tone?: BadgeTone;
  className?: string;
}>;

const toneClasses: Record<BadgeTone, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  rose: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
  cyan: "bg-cyan-100 text-cyan-700",
  orange: "bg-orange-100 text-orange-700",
  slate: "bg-slate-100 text-slate-700",
};

export const Badge = ({ children, tone = "slate", className }: BadgeProps) => {
  const classes = ["rounded px-2 py-1 text-[10px] font-semibold", toneClasses[tone], className ?? ""].filter(Boolean).join(" ");

  return <span className={classes}>{children}</span>;
};
