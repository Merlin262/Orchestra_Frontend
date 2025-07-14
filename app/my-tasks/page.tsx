"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CheckCircle,
  Clock,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertCircle,
  MessageSquare,
  ArrowUpRight,
  Circle,
} from "lucide-react"
import Image from "next/image"
import { useProfile } from "@/components/profile-context"
import { useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import React from "react"
import { useRouter } from "next/navigation"
import { ProfileTypeEnum } from "@/components/Enum/ProfileTypeEnum"
import { getUserIdFromProfile } from "@/app/helpers/getUserIdFromProfile";


export enum TaskStatus {
  NotStarted = 1,
  InProgress = 2,
  Finished = 3,
  Late = 4
}

// Componente para exibir o status da tarefa
const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const statusConfig = {
    [TaskStatus.NotStarted]: {
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-800 dark:text-yellow-200",
      label: "Pendente",
    },
    [TaskStatus.InProgress]: {
      bg: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-200",
      label: "Em andamento",
    },
    [TaskStatus.Finished]: {
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-800 dark:text-green-200",
      label: "Concluída",
    },
    [TaskStatus.Late]: {
      bg: "bg-red-100 dark:bg-red-900",
      text: "text-red-800 dark:text-red-200",
      label: "Atrasada",
    },
  }

  const config = statusConfig[status] || statusConfig[TaskStatus.NotStarted]

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>
  )
}

// Componente para exibir a prioridade da tarefa
const PriorityBadge = ({ prioridade }: { prioridade: string }) => {
  const prioridadeConfig = {
    alta: {
      bg: "bg-red-100 dark:bg-red-900",
      text: "text-red-800 dark:text-red-200",
      label: "Alta",
    },
    média: {
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-800 dark:text-yellow-200",
      label: "Média",
    },
    baixa: {
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-800 dark:text-green-200",
      label: "Baixa",
    },
  }

  const config = prioridadeConfig[prioridade as keyof typeof prioridadeConfig] || prioridadeConfig.média

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>
  )
}



export default function MinhasTarefasPage() {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>("todas")
  const [termoBusca, setTermoBusca] = useState<string>("")
  const [tarefaExpandida, setTarefaExpandida] = useState<string | null>(null)
  const [tarefaDetalhada, setTarefaDetalhada] = useState<any | null>(null)
  const [abaAtiva, setAbaAtiva] = useState<"detalhes" | "subtarefas" | "comentarios">("detalhes")
  const { profile } = useProfile()
  const [tarefas, setTarefas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const todasTarefas = [ ...tarefas]
  const router = useRouter()

  useEffect(() => {
      if (!profile || (profile.ProfileType !== "Employee" && profile?.ProfileType !== ProfileTypeEnum.Employee.toString())) {
        router.replace("/auth")
      }
    }, [profile, loading, router])


  async function atualizarStatusTarefa(taskId: string, statusId: number) {
    try {
      await apiClient.put("/api/Tasks/update-status", {
        TaskId: taskId,
        StatusId: statusId
      });
      
      setTarefaDetalhada((prev: any) =>
      prev
        ? {
            ...prev,
            status:
              statusId === TaskStatus.InProgress
                ? TaskStatus.InProgress
                : statusId === TaskStatus.Finished
                ? TaskStatus.Finished
                : statusId === TaskStatus.NotStarted
                ? TaskStatus.NotStarted
                : prev.status,
          }
        : prev
    );
      setTarefas((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status:
                statusId === TaskStatus.InProgress
                  ? TaskStatus.InProgress
                  : statusId === TaskStatus.Finished
                  ? TaskStatus.Finished
                  : statusId === TaskStatus.NotStarted
                  ? TaskStatus.NotStarted
                  : t.status,
            }
          : t
      )
    );
    } catch (error) {
      console.error("Erro ao atualizar status da tarefa:", error);
    }
  }


  useEffect(() => {
    const userId = getUserIdFromProfile(profile);
    if (!userId) return
    setLoading(true)
    apiClient.get<any[]>(`/api/Tasks/user-process-instances/${userId}`)
      .then((data: any[]) => {
        const tarefasTransformadas = data.flatMap((proc: any) =>
          (proc.tasks || []).map((t: any) => ({
            id: t.taskId,
            nome: t.name,
            processoId: proc.processInstanceId,
            processoNome: proc.name,
            etapaId: t.xmlTaskId,
            etapaNome: t.name || t.xmlTaskId,
            prazo: t.completedAt ? new Date(t.completedAt).toLocaleDateString() : "",
            dataInicio: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "",
            prioridade: "média",
            status: t.statusId as TaskStatus,
            progresso: t.completed ? 100 : 0,
            responsavel: t.responsibleUser
              ? {
                  id: t.responsibleUser.id,
                  nome: t.responsibleUser.fullName || t.responsibleUser.userName || "",
                  foto: "/placeholder.svg",
                }
              : { id: "", nome: "", foto: "/placeholder.svg" },
            comentarios: t.comments || [],
            subtarefas: [],
          }))
        )
        setTarefas(tarefasTransformadas)
      })
      .catch((error) => {
        console.error("Erro ao buscar tarefas:", error);
        setTarefas([]);
      })
      .finally(() => setLoading(false))
  }, [profile])

  // Filtrar tarefas com base nos filtros selecionados
  const tarefasFiltradas = todasTarefas.filter((tarefa) => {
    // Filtro por status
    if (filtroStatus !== "todos" && tarefa.status !== Number(filtroStatus)) {
      return false
    }

    // Filtro por prioridade
    if (filtroPrioridade !== "todas" && tarefa.prioridade !== filtroPrioridade) {
      return false
    }

    // Filtro por termo de busca
    if (
      termoBusca &&
      !tarefa.nome.toLowerCase().includes(termoBusca.toLowerCase()) &&
      !tarefa.processoNome.toLowerCase().includes(termoBusca.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Expandir/colapsar detalhes da tarefa
  const toggleTarefaExpandida = (tarefaId: string) => {
    if (tarefaExpandida === tarefaId) {
      setTarefaExpandida(null)
    } else {
      setTarefaExpandida(tarefaId)
    }
  }

  // Abrir detalhes completos da tarefa
  const abrirDetalhesTarefa = (tarefa: any) => {
    setTarefaDetalhada(tarefa)
    setAbaAtiva("detalhes")
  }

  // Fechar detalhes da tarefa
  const fecharDetalhesTarefa = () => {
    setTarefaDetalhada(null)
  }

  // Calcular o número de tarefas por status
  const contadorStatus = {
    total: todasTarefas.length,
    NotStarted: todasTarefas.filter((t) => t.status === TaskStatus.NotStarted).length,
    InProgress: todasTarefas.filter((t) => t.status === TaskStatus.InProgress).length,
    Finished: todasTarefas.filter((t) => t.status === TaskStatus.Finished).length,
    Late: todasTarefas.filter((t) => t.status === TaskStatus.Late).length,
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Minhas Tarefas</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Perfil:</span>
            <span className="text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full">
              Colaborador
            </span>
          </div>
        </div>
      </div>

      {/* Resumo de tarefas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-gray-400 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Tarefas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contadorStatus.total}</p>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Clock size={24} className="text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-yellow-400 dark:border-yellow-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contadorStatus.NotStarted}</p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-blue-400 dark:border-blue-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Em Andamento</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contadorStatus.InProgress}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Clock size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-green-400 dark:border-green-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Concluídas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contadorStatus.Finished}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-red-400 dark:border-red-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Atrasadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contadorStatus.Late}</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
              <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="busca" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                id="busca"
                placeholder="Buscar por nome ou processo..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="todos">Todos os status</option>
                <option value={TaskStatus.NotStarted}>Pendente</option>
                <option value={TaskStatus.InProgress}>Em andamento</option>
                <option value={TaskStatus.Finished}>Concluída</option>
                <option value={TaskStatus.Late}>Atrasada</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prioridade
            </label>
            <div className="relative">
              <select
                id="prioridade"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
                value={filtroPrioridade}
                onChange={(e) => setFiltroPrioridade(e.target.value)}
              >
                <option value="todas">Todas as prioridades</option>
                <option value="alta">Alta</option>
                <option value="média">Média</option>
                <option value="baixa">Baixa</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de tarefas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Lista de Tarefas</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {tarefasFiltradas.length} tarefas encontradas
          </span>
        </div>

        {tarefasFiltradas.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {tarefasFiltradas.map((tarefa) => (
              <li key={tarefa.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3
                        className="text-lg font-medium text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => abrirDetalhesTarefa(tarefa)}
                      >
                        {tarefa.nome}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      <StatusBadge status={tarefa.status} />
                      <PriorityBadge prioridade={tarefa.prioridade} />
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {tarefa.processoNome}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar size={16} className="mr-1" />
                      <span>Prazo: {tarefa.prazo}</span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                      <div
                        className={`h-2.5 rounded-full ${
                          tarefa.status === TaskStatus.Late
                            ? "bg-red-600 dark:bg-red-500"
                            : tarefa.status === TaskStatus.Finished
                              ? "bg-green-600 dark:bg-green-500"
                              : "bg-blue-600 dark:bg-blue-500"
                        }`}
                        style={{ width: `${tarefa.progresso}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      {/* Adicione mais informações se necessário */}
                    </div>
                  </div>

                  <div className="flex flex-col items-end ml-4">
                    {/* Ações rápidas */}
                  </div>
                </div>

                {/* Detalhes expandidos */}
                {tarefaExpandida === tarefa.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Detalhes adicionais */}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <Search size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Nenhuma tarefa encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400">Tente ajustar os filtros ou termos de busca.</p>
          </div>
        )}
      </div>

      {/* Modal de detalhes da tarefa */}
      {tarefaDetalhada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    tarefaDetalhada.status === TaskStatus.Late
                      ? "bg-red-500"
                      : tarefaDetalhada.status === TaskStatus.Finished
                        ? "bg-green-500"
                        : tarefaDetalhada.status === TaskStatus.InProgress
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                  }`}
                ></div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{tarefaDetalhada.nome}</h2>
              </div>
              <button
                onClick={fecharDetalhesTarefa}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navegação por abas */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                <button
                  onClick={() => setAbaAtiva("detalhes")}
                  className={`px-4 py-3 text-sm font-medium ${
                    abaAtiva === "detalhes"
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Detalhes
                </button>
                {/* <button
                  onClick={() => setAbaAtiva("subtarefas")}
                  className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                    abaAtiva === "subtarefas"
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Subtarefas
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                    {tarefaDetalhada.subtarefas.filter((st) => st.concluida).length}/{tarefaDetalhada.subtarefas.length}
                  </span>
                </button> */}
                <button
                  onClick={() => setAbaAtiva("comentarios")}
                  className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                    abaAtiva === "comentarios"
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Comentários
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                    {tarefaDetalhada.comentarios.length}
                  </span>
                </button>
              </nav>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto p-6">
              {abaAtiva === "detalhes" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Informações da Tarefa
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Processo</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {tarefaDetalhada.processoNome}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Etapa</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {tarefaDetalhada.etapaNome}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                            <StatusBadge status={tarefaDetalhada.status} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Prioridade</p>
                            <PriorityBadge prioridade={tarefaDetalhada.prioridade} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Data de Início</p>
                            <p className="text-sm text-gray-900 dark:text-white">{tarefaDetalhada.dataInicio}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Prazo</p>
                            <p className="text-sm text-gray-900 dark:text-white">{tarefaDetalhada.prazo}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Progresso</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Progresso Geral</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {tarefaDetalhada.progresso}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                          <div
                            className={`h-2.5 rounded-full ${
                              tarefaDetalhada.status === "atrasada"
                                ? "bg-red-600 dark:bg-red-500"
                                : tarefaDetalhada.status === 2
                                  ? "bg-green-600 dark:bg-green-500"
                                  : "bg-blue-600 dark:bg-blue-500"
                            }`}
                            style={{ width: `${tarefaDetalhada.progresso}%` }}
                          ></div>
                        </div>

                        {/* <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Subtarefas Concluídas</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {tarefaDetalhada.subtarefas.filter((st) => st.concluida).length}/
                            {tarefaDetalhada.subtarefas.length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full"
                            style={{
                              width: `${
                                tarefaDetalhada.subtarefas.length > 0
                                  ? (
                                      tarefaDetalhada.subtarefas.filter((st) => st.concluida).length /
                                        tarefaDetalhada.subtarefas.length
                                    ) * 100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsável</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200 dark:border-gray-600">
                        <Image
                          src={tarefaDetalhada.responsavel.foto || "/placeholder.svg"}
                          alt={tarefaDetalhada.responsavel.nome}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {tarefaDetalhada.responsavel.nome}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Responsável pela tarefa</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contexto do Processo</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Esta tarefa faz parte do processo{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {tarefaDetalhada.processoNome}
                        </span>
                        , na etapa{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{tarefaDetalhada.etapaNome}</span>.
                      </p>
                      <Link
                        href={`/processos/${tarefaDetalhada.processoId}/detalhes`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                      >
                        Ver detalhes do processo
                        <ArrowUpRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* {abaAtiva === "subtarefas" && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Lista de Subtarefas</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {tarefaDetalhada.subtarefas.filter((st) => st.concluida).length} de{" "}
                      {tarefaDetalhada.subtarefas.length} concluídas
                    </div>
                  </div>

                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-6">
                    {tarefaDetalhada.subtarefas.map((subtarefa) => (
                      <li key={subtarefa.id} className="py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={subtarefa.concluida}
                              onChange={() => {
                                // Aqui você implementaria a lógica para marcar/desmarcar a subtarefa
                                alert(
                                  `${subtarefa.concluida ? "Desmarcando" : "Marcando"} a subtarefa: ${subtarefa.nome}`,
                                )
                              }}
                              className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <p
                              className={`text-sm ${subtarefa.concluida ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-900 dark:text-white"}`}
                            >
                              {subtarefa.nome}
                            </p>
                          </div>
                          <div>
                            <button
                              className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                              onClick={() => {
                                // Aqui você implementaria a lógica para excluir a subtarefa
                                alert(`Excluindo a subtarefa: ${subtarefa.nome}`)
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Adicionar Nova Subtarefa
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nome da subtarefa"
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              )} */}

              {abaAtiva === "comentarios" && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Histórico de Comentários
                  </h3>

                  <ul className="space-y-4 mb-6">
                    {tarefaDetalhada.comentarios.map((comentario, index) => (
                      <li key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-900 dark:text-white">{comentario.autor}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{comentario.data}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{comentario.texto}</p>
                      </li>
                    ))}

                    {tarefaDetalhada.comentarios.length === 0 && (
                      <li className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Nenhum comentário encontrado.
                      </li>
                    )}
                  </ul>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adicionar Comentário</h3>
                    <textarea
                      rows={3}
                      placeholder="Digite seu comentário..."
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    ></textarea>
                    <div className="flex justify-end">
                      <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                        Enviar Comentário
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400 dark:text-gray-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Última atualização: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex gap-2">
                {tarefaDetalhada.status !== TaskStatus.Finished && (
                  <button
                    className={`px-4 py-2 rounded-md text-sm ${
                      tarefaDetalhada.status === TaskStatus.NotStarted
                        ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                    }`}
                    onClick={async () => {
                      if (tarefaDetalhada.status === TaskStatus.NotStarted) {
                        await atualizarStatusTarefa(tarefaDetalhada.id, TaskStatus.InProgress);
                      } else if (tarefaDetalhada.status === TaskStatus.InProgress) {
                        await atualizarStatusTarefa(tarefaDetalhada.id, TaskStatus.Finished);
                      }
                    }}
                  >
                    {tarefaDetalhada.status === TaskStatus.NotStarted
                    ? "Iniciar Tarefa"
                    : "Marcar como Concluída"}
                  </button>
                )}
                <button
                  onClick={fecharDetalhesTarefa}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md text-sm"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
