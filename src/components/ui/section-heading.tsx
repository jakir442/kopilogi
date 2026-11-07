import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
