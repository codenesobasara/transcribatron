import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow";
}

export function Container({ className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 md:px-8 w-full",
        size === "narrow" ? "max-w-3xl" : "max-w-container",
        className
      )}
      {...props}
    />
  );
}
