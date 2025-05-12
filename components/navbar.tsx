"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
//import { Activity } from "lucide-react"
import Image from "next/image"


export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Orchestra_logo.png" alt="Orchestra Logo" width={40} height={40} />
          <span className="font-bold text-xl">Orchestra</span>
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
              className={`font-medium ${pathname === "/processos" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
            >
              Processos
            </Link>
            <Link
              href="/processos/importar"
              className={`font-medium ${pathname === "/processos/importar" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
            >
              Importar
            </Link>
          </nav>

          <div>
            <Link
              href="/processos/new"
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
