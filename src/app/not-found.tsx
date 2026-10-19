import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = { title: "Se derritió" };

/** 404 global (URLs que no casan con ninguna ruta): mismo marco que el resto del sitio. */
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
