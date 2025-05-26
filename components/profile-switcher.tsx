"use client"

import { useState } from "react"
import { ChevronDown, UserCog, ClipboardCheck } from "lucide-react"
import { useProfile } from "./profile-context"

export function ProfileSwitcher() {
  const { profile, setProfile } = useProfile()
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)
  const closeDropdown = () => setIsOpen(false)

  const switchToAnalista = () => {
    setProfile("analista")
    closeDropdown()
  }

  const switchToColaborador = () => {
    setProfile("colaborador")
    closeDropdown()
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {profile === "analista" ? <UserCog size={18} /> : <ClipboardCheck size={18} />}
        <span>{profile === "analista" ? "Analista de Processos" : "Colaborador"}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={closeDropdown} aria-hidden="true" />
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                onClick={switchToAnalista}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                  profile === "analista"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                role="menuitem"
              >
                <UserCog size={18} />
                Analista de Processos
              </button>
              <button
                onClick={switchToColaborador}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                  profile === "colaborador"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                role="menuitem"
              >
                <ClipboardCheck size={18} />
                Colaborador
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
