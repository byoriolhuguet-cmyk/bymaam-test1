import type { ReactNode } from "react";

/** Bloque de texto legal o editorial estilo Miu Miu: columna estrecha, tipografía pequeña y títulos en sans. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="container-brand pb-24 pt-6 md:pb-32">
      <div className="miu-prose mx-auto max-w-xl space-y-4 text-[0.875rem] leading-relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_li]:mt-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_strong]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc">
        {children}
      </div>
    </div>
  );
}
