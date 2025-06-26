"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CheckSquare,
  Activity,
  Clock,
  Calendar,
  Users,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  FileText,
  BarChart2,
  PlusCircle,
  Search,
  Briefcase,
} from "lucide-react"
import Image from "next/image"
import { useProfile } from "./profile-context"
import { apiClient } from "@/lib/api-client"
import { ProfileTypeEnum } from "./Enum/ProfileTypeEnum"

interface User {
  id: string
  fullName: string
  email: string
  role: string
}

// Wrapper para garantir que só renderiza a sidebar se houver perfil
export function SidebarWrapper() {
  const { profile } = useProfile()
  if (!profile || profile.Role === "notLoggedIn" || (profile.ProfileType == "ADM" || profile.ProfileType == ProfileTypeEnum.ADM.toString())) return null
  return <SidebarColaborador />
}

export async function getUserById(id: string): Promise<User> {
  try {
    return await apiClient.get<User>(`/api/users/${id}`)
  } catch (error) {
    throw new Error("Usuário não encontrado")
  }
}

function SidebarColaborador() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(true)
  const { profile } = useProfile()
  const [analystName, setAnalystName] = useState<string>("")

  useEffect(() => {
    async function fetchAnalyst() {
      if (profile && profile.Role === "Analyst") {
          const user = await getUserById(profile.Id)
          setAnalystName(user.fullName)
      }
    }
    fetchAnalyst()
  }, [profile])


  const funcionarioMenuItems = [
    { href: "/my-tasks", label: "Minhas Tarefas", icon: <CheckSquare size={20} /> },
    { href: "/assigned-processes", label: "Processos Atribuídos", icon: <Activity size={20} /> },
    { href: "/calendario", label: "Calendário", icon: <Calendar size={20} /> },
    { href: "/equipe", label: "Minha Equipe", icon: <Users size={20} /> },
    { href: "/configuracoes", label: "Configurações", icon: <Settings size={20} /> },
    { href: "/ajuda", label: "Ajuda", icon: <HelpCircle size={20} /> },
  ]

  const gerenteMenuItems = [
    { href: "/processos", label: "Todos os Processos", icon: <FileText size={20} /> },
    { href: "/processos/novo", label: "Novo Processo", icon: <PlusCircle size={20} /> },
    { href: "/analise", label: "Análise de Processos", icon: <BarChart2 size={20} /> },
    { href: "/busca-avancada", label: "Busca Avançada", icon: <Search size={20} /> },
    { href: "/projetos", label: "Projetos", icon: <Briefcase size={20} /> },
    { href: "/configuracoes", label: "Configurações", icon: <Settings size={20} /> },
    { href: "/ajuda", label: "Ajuda", icon: <HelpCircle size={20} /> },
  ]

  const menuItems =
    profile && profile.ProfileType === "ProcessManager"
      ? gerenteMenuItems
      : funcionarioMenuItems

  return (
    <aside
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center">
              <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                <Image
                  src={
                    profile?.Role === "Analyst"
                      ? "https://randomuser.me/api/portraits/women/68.jpg"
                      : "https://randomuser.me/api/portraits/men/67.jpg"
                  }
                  alt="{profile?.FullName}"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium dark:text-white">
                  {profile?.FullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {profile?.Role}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
            <div className="flex items-center">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              {!collapsed && <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">Online</span>}
            </div>

            {!collapsed && (
              <div className="flex items-center">
                <Clock size={16} className="text-gray-400 mr-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SidebarWrapper