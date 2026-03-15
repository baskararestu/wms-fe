import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type AppButtonVariant = "primary" | "secondary";

type AppButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: AppButtonVariant;
  fullWidth?: boolean;
};

export const AppButton = ({ children, className, fullWidth = false, variant = "primary", ...buttonProps }: AppButtonProps) => {
  const baseClasses = "inline-flex min-h-11 items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold leading-tight transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-70";

  const variantClasses = {
    primary: "border-transparent bg-blue-600 text-white shadow-lg hover:enabled:-translate-y-px hover:enabled:shadow-xl",
    secondary: "border-blue-100 bg-white text-slate-800 hover:enabled:-translate-y-px hover:enabled:border-blue-600",
  };

  const classes = [baseClasses, variantClasses[variant], fullWidth ? "w-full" : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
};
