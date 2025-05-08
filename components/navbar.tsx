"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Activity size={24} className="text-blue-600" />
            <span className="font-bold text-xl">BPMN Modeler</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`font-medium ${pathname === "/" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
            >
              Início
            </Link>
            <Link
              href="/processos"
              className={`font-medium ${pathname.startsWith("/processos") ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
            >
              Processos
            </Link>
          </nav>

          <div>
            <Link
              href="/processos/novo"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Novo Processo
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
