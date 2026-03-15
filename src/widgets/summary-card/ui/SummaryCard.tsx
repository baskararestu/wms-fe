import React from "react";

interface SummaryCardProps {
  title: string;
  value: string;
  trend: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, trend }) => (
  <article className="rounded border border-slate-200 bg-white px-4 py-3">
    <p className="text-[11px] text-slate-500">{title}</p>
    <p className="mt-1 text-xl font-bold text-slate-800">{value}</p>
    <p className="mt-1 text-xs text-emerald-600">{trend}</p>
  </article>
);
