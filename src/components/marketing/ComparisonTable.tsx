import { Check, Minus, Contrast } from "lucide-react";
import { cn } from "@/lib/utils";

export type CellState = "yes" | "partial" | "no";

export interface Cell {
  state: CellState;
  note?: string;
}

export interface ComparisonRow {
  feature: string;
  transcribatron: Cell;
  competitors: Record<string, Cell>;
}

interface ComparisonTableProps {
  competitorNames: readonly string[];
  rows: readonly ComparisonRow[];
}

export function ComparisonTable({ competitorNames, rows }: ComparisonTableProps) {
  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-sep bg-surface">
        <table className="w-full min-w-[760px] text-sm border-collapse">
          <thead className="bg-surface-2">
            <tr>
              <th className="sticky left-0 z-10 bg-surface-2 text-left p-4 font-medium text-ink">
                Feature
              </th>
              <th className="p-4 font-semibold text-accent whitespace-nowrap">Transcribatron</th>
              {competitorNames.map((n) => (
                <th key={n} className="p-4 font-medium text-ink-2 whitespace-nowrap">
                  {n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-sep">
                <td className="sticky left-0 z-10 bg-surface p-4 text-left text-ink font-medium">
                  {row.feature}
                </td>
                <CellCol cell={row.transcribatron} highlight />
                {competitorNames.map((n) => (
                  <CellCol key={n} cell={row.competitors[n] ?? { state: "no" }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Legend />
    </div>
  );
}

function CellCol({ cell, highlight }: { cell: Cell; highlight?: boolean }) {
  return (
    <td className={cn("p-3 text-center align-middle", highlight && "bg-accent-soft/50")}>
      <div className="flex flex-col items-center gap-1">
        {cell.state === "yes" && <Check className="w-4 h-4 text-positive" aria-label="Yes" />}
        {cell.state === "partial" && (
          <Contrast className="w-4 h-4 text-accent" aria-label="Partial" />
        )}
        {cell.state === "no" && <Minus className="w-4 h-4 text-ink-3" aria-label="No" />}
        {cell.note && (
          <span className="text-[11px] leading-tight text-ink-3">{cell.note}</span>
        )}
      </div>
    </td>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-ink-3">
      <span className="inline-flex items-center gap-1.5">
        <Check className="w-3.5 h-3.5 text-positive" /> Full support
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Contrast className="w-3.5 h-3.5 text-accent" /> Partial or limited
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Minus className="w-3.5 h-3.5 text-ink-3" /> Not available
      </span>
    </div>
  );
}
