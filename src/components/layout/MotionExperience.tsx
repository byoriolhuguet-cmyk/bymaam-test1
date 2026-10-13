import { useMotionEngine } from "@/lib/motion";

/** Monta el motor de movimiento (reveals, paralaje, progreso de scroll). No pinta nada. */
export function MotionExperience({ pathname }: { pathname: string }) {
  useMotionEngine(pathname);
  return null;
}
