import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 2 | 3 | 4;
}

export function Grid({ className, cols = 3, ...props }: GridProps) {
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[cols];
  return (
    <div className={cn("grid grid-cols-1 gap-6 md:gap-8", colClass, className)} {...props} />
  );
}
