import type { ReactNode } from "react";
import { showPending } from "@/lib/site";

/** A review note for content Andreia still needs to provide. Hidden in production. */
export function Pending({ children }: { children: ReactNode }) {
  if (!showPending) return null;
  return (
    <div className="pending" role="note">
      <strong>Conteúdo pendente</strong> {children}
    </div>
  );
}
