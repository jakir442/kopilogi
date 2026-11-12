import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  label,
  title,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className='text-sm font-semibold uppercase tracking-[0.18em] text-label'>{label}</p>

      <h2 className='mt-3 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl'>
        {title}
      </h2>

      {description && (
        <p className='mt-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8'>
          {description}
        </p>
      )}
    </div>
  );
}
