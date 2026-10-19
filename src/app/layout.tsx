import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/styles/fonts";
import { themeInitScript } from "@/lib/theme";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Jacobus Ice Cream · Helados de barrio en Elda",
    template: "%s · Jacobus Ice Cream",
  },
  description: "Heladería de barrio en Elda. Dulce por fuera, punk por dentro. Pide antes de que se derrita.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
