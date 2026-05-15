import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import "./globals.css";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({subsets:['latin'],variable:'--font-mono'})

export const metadata: Metadata = {
  title: "Figure",
  description: "A local-first personal expense tracker with optional Google Drive backup.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        "font-mono",
        geistMono.variable
      )}
    >
      <body>
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      </body>
    </html>
  )
}
