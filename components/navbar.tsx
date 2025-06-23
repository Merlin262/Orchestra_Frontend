"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogIn, UserPlus } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { ProfileSwitcher } from "./profile-switcher"
import Image from "next/image"
import { isDevelopment } from "@/lib/config"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Orchestra_logo.png" alt="Orchestra Logo" width={40} height={40} />
            <span className="font-bold text-xl dark:text-white">Orchestra</span>
            {isDevelopment() && (
              <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                DEV
              </span>
            )}
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`font-medium ${
                pathname === "/"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Início
            </Link>
            <Link
              href="/processos"
              className={`font-medium ${
                pathname.startsWith("/processos")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Processos
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Simulação de estado de autenticação - em produção viria de um contexto */}
            {false ? ( // Mude para true para simular usuário logado
              <>
                <ProfileSwitcher />
                <ThemeToggle />
                <Link
                  href="/processos/novo"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Novo Processo
                </Link>
              </>
            ) : (
              <>
                <ThemeToggle />
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <LogIn size={16} />
                    <span className="hidden sm:inline">Entrar</span>
                  </Link>
                  <Link
                    href="/auth"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Cadastrar</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
