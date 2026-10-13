import type { ReactNode } from "react";

/** Bloque de texto legal o editorial, con ritmo tipográfico cuidado. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="container-brand section-y">
      <div className="mx-auto max-w-2xl space-y-5 text-[0.95rem] leading-relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-14 [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:text-foreground [&_li]:mt-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_strong]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc">
        {children}
      </div>
    </div>
  );
}
