import { Check, X } from "lucide-react";

export interface ComparisonRow {
  feature: string;
  transcribatron: boolean | string;
  competitors: Record<string, boolean | string>;
}

interface ComparisonTableProps {
  competitorNames: readonly string[];
  rows: readonly ComparisonRow[];
}

export function ComparisonTable({ competitorNames, rows }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-sep bg-surface">
      <table className="w-full text-sm">
        <thead className="bg-surface-2">
          <tr>
            <th className="text-left p-4 font-medium text-ink">Feature</th>
            <th className="p-4 font-semibold text-accent">Transcribatron</th>
            {competitorNames.map((n) => (
              <th key={n} className="p-4 font-medium text-ink-2">{n}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-sep">
              <td className="p-4 text-ink">{row.feature}</td>
              <Cell value={row.transcribatron} highlight />
              {competitorNames.map((n) => (
                <Cell key={n} value={row.competitors[n] ?? false} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  return (
    <td className={`p-4 text-center ${highlight ? "bg-accent-soft/50" : ""}`}>
      {typeof value === "string" ? (
        <span className="text-ink-2">{value}</span>
      ) : value ? (
        <Check className="w-5 h-5 text-positive mx-auto" />
      ) : (
        <X className="w-5 h-5 text-ink-3 mx-auto" />
      )}
    </td>
  );
}
