import { cn } from "@/lib/utils";

/** Logotipo tipográfico "by maam handmade" (Fraunces SOFT, cercano a la rotulación original). */
export function Wordmark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <span className={cn("wordmark", className)} style={{ fontSize: size }} aria-label="By Maam, handmade">
      <em aria-hidden="true">by</em>{" "}
      <span aria-hidden="true">maam</span>
    </span>
  );
}

/** Se mantiene el nombre `Logo` por compatibilidad con el resto del proyecto. */
export const Logo = Wordmark;
