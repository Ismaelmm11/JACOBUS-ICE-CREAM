import { Rubik_Spray_Paint, Space_Grotesk, Space_Mono, Unbounded } from "next/font/google";

export const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-unbounded",
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const rubikSpray = Rubik_Spray_Paint({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-rubik-spray",
  display: "swap",
});

export const fontVariables = [unbounded, spaceGrotesk, spaceMono, rubikSpray]
  .map((font) => font.variable)
  .join(" ");
