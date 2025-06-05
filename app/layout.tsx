import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { SidebarWrapper } from "@/components/sidebar-collaborator"
import { ThemeProvider } from "@/components/theme-provider"
import { ProfileProvider } from "@/components/profile-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Orchestra",
  description: "Aplicação para modelagem de processos BPMN",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/Orchestra_logo.png" type="image/jpeg" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ProfileProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                <SidebarWrapper />
                <main className="flex-1 p-4">{children}</main>
              </div>
            </div>
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}