"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, Clock, Filter, Search, ArrowUpRight, Calendar, Activity } from "lucide-react"
import Image from "next/image"

// Dados simulados de processos atribuídos ao colaborador
const processosAtribuidos = [
  {
    id: "proc1",
    nome: "Processo de Aprovação de Crédito",
    descricao: "Fluxo de aprovação de solicitações de crédito para clientes pessoa física.",
    dataCriacao: "10/05/2023",
    ultimaAtualizacao: "18/05/2023",
    status: "em_andamento",
    progresso: 60,
    responsavel: {
      id: "user2",
      nome: "Ana Silva",
      foto: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    participantes: [
      {
        id: "user1",
        nome: "Carlos Santos",
        foto: "https://randomuser.me/api/portraits/men/67.jpg",
        papel: "Analista",
      },
      {
        id: "user2",
        nome: "Ana Silva",
        foto: "https://randomuser.me/api/portraits/women/33.jpg",
        papel: "Gerente",
      },
      {
        id: "user3",
        nome: "João Oliveira",
        foto: "https://randomuser.me/api/portraits/men/42.jpg",
        papel: "Aprovador",
      },
    ],
    etapas: [
      {
        id: "etapa1",
        nome: "Análise de Documentos",
        status: "em_andamento",
        responsavel: {
          id: "user1",
          nome: "Carlos Santos",
          foto: "https://randomuser.me/api/portraits/men/67.jpg",
        },
        tarefas: 4,
        tarefasConcluidas: 2,
      },
      {
        id: "etapa2",
        nome: "Análise de Crédito",
        status: "pendente",
        responsavel: {
          id: "user3",
          nome: "João Oliveira",
          foto: "https://randomuser.me/api/portraits/men/42.jpg",
        },
        tarefas: 3,
        tarefasConcluidas: 0,
      },
      {
        id: "etapa3",
        nome: "Aprovação Final",
        status: "pendente",
        responsavel: {
          id: "user2",
          nome: "Ana Silva",
          foto: "https://randomuser.me/api/portraits/women/33.jpg",
        },
        tarefas: 2,
        tarefasConcluidas: 0,
      },
    ],
  },
  {
    id: "proc2",
    nome: "Processo de Compras",
    descricao: "Fluxo de aprovação de solicitações de compras de materiais e serviços.",
    dataCriacao: "15/05/2023",
    ultimaAtualizacao: "20/05/2023",
    status: "em_andamento",
    progresso: 30,
    responsavel: {
      id: "user4",
      nome: "Mariana Costa",
      foto: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    participantes: [
      {
        id: "user1",
        nome: "Carlos Santos",
        foto: "https://randomuser.me/api/portraits/men/67.jpg",
        papel: "Solicitante",
      },
      {
        id: "user4",
        nome: "Mariana Costa",
        foto: "https://randomuser.me/api/portraits/women/68.jpg",
        papel: "Compradora",
      },
      {
        id: "user5",
        nome: "Roberto Alves",
        foto: "https://randomuser.me/api/portraits/men/91.jpg",
        papel: "Financeiro",
      },
    ],
    etapas: [
      {
        id: "etapa1",
        nome: "Solicitação",
        status: "concluida",
        responsavel: {
          id: "user1",
          nome: "Carlos Santos",
          foto: "https://randomuser.me/api/portraits/men/67.jpg",
        },
        tarefas: 2,
        tarefasConcluidas: 2,
      },
      {
        id: "etapa2",
        nome: "Aprovação de Solicitações",
        status: "em_andamento",
        responsavel: {
          id: "user1",
          nome: "Carlos Santos",
          foto: "https://randomuser.me/api/portraits/men/67.jpg",
        },
        tarefas: 4,
        tarefasConcluidas: 1,
      },
      {
        id: "etapa3",
        nome: "Cotação",
        status: "pendente",
        responsavel: {
          id: "user4",
          nome: "Mariana Costa",
          foto: "https://randomuser.me/api/portraits/women/68.jpg",
        },
        tarefas: 3,
        tarefasConcluidas: 0,
      },
    ],
  },
  {
    id: "proc3",
    nome: "Gestão de Contratos",
    descricao: "Processo de revisão e aprovação de contratos com fornecedores.",
    dataCriacao: "05/05/2023",
    ultimaAtualizacao: "25/05/2023",
    status: "concluido",
    progresso: 100,
    responsavel: {
      id: "user6",
      nome: "Patrícia Lima",
      foto: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    participantes: [
      {
        id: "user1",
        nome: "Carlos Santos",
        foto: "https://randomuser.me/api/portraits/men/67.jpg",
        papel: "Revisor",
      },
      {
        id: "user6",
        nome: "Patrícia Lima",
        foto: "https://randomuser.me/api/portraits/women/22.jpg",
        papel: "Jurídico",
      },
      {
        id: "user7",
        nome: "Fernando Gomes",
        foto: "https://randomuser.me/api/portraits/men/29.jpg",
        papel: "Diretor",
      },
    ],
    etapas: [
      {
        id: "etapa1",
        nome: "Elaboração",
        status: "concluida",
        responsavel: {
          id: "user6",
          nome: "Patrícia Lima",
          foto: "https://randomuser.me/api/portraits/women/22.jpg",
        },
        tarefas: 3,
        tarefasConcluidas: 3,
      },
      {
        id: "etapa2",
        nome: "Revisão Legal",
        status: "concluida",
        responsavel: {
          id: "user1",
          nome: "Carlos Santos",
          foto: "https://randomuser.me/api/portraits/men/67.jpg",
        },
        tarefas: 4,
        tarefasConcluidas: 4,
      },
      {
        id: "etapa3",
        nome: "Aprovação",
        status: "concluida",
        responsavel: {
          id: "user7",
          nome: "Fernando Gomes",
          foto: "https://randomuser.me/api/portraits/men/29.jpg",
        },
        tarefas: 2,
        tarefasConcluidas: 2,
      },
    ],
  },
  {
    id: "proc4",
    nome: "Reunião Trimestral",
    descricao: "Processo de preparação e realização da reunião trimestral de resultados.",
    dataCriacao: "12/05/2023",
    ultimaAtualizacao: "23/05/2023",
    status: "atrasado",
    progresso: 45,
    responsavel: {
      id: "user8",
      nome: "Luciana Martins",
      foto: "https://randomuser.me/api/portraits/women/57.jpg",
    },
    participantes: [
      {
        id: "user1",
        nome: "Carlos Santos",
        foto: "https://randomuser.me/api/portraits/men/67.jpg",
        papel: "Apresentador",
      },
      {
        id: "user8",
        nome: "Luciana Martins",
        foto: "https://randomuser.me/api/portraits/women/57.jpg",
        papel: "Coordenadora",
      },
      {
        id: "user9",
        nome: "Ricardo Pereira",
        foto: "https://randomuser.me/api/portraits/men/78.jpg",
        papel: "Diretor Financeiro",
      },
    ],
    etapas: [
      {
        id: "etapa1",
        nome: "Coleta de Dados",
        status: "concluida",
        responsavel: {
          id: "user9",
          nome: "Ricardo Pereira",
          foto: "https://randomuser.me/api/portraits/men/78.jpg",
        },
        tarefas: 3,
        tarefasConcluidas: 3,
      },
      {
        id: "etapa2",
        nome: "Preparação de Materiais",
        status: "atrasada",
        responsavel: {
          id: "user1",
          nome: "Carlos Santos",
          foto: "https://randomuser.me/api/portraits/men/67.jpg",
        },
        tarefas: 4,
        tarefasConcluidas: 2,
      },
      {
        id: "etapa3",
        nome: "Apresentação",
        status: "pendente",
        responsavel: {
          id: "user1",
          nome: "Carlos Santos",
          foto: "https://randomuser.me/api/portraits/men/67.jpg",
        },
        tarefas: 2,
        tarefasConcluidas: 0,
      },
    ],
  },
]

// Componente para exibir o status do processo
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pendente: {
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-800 dark:text-yellow-200",
      label: "Pendente",
    },
    em_andamento: {
      bg: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-200",
      label: "Em andamento",
    },
    concluido: {
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-800 dark:text-green-200",
      label: "Concluído",
    },
    atrasado: {
      bg: "bg-red-100 dark:bg-red-900",
      text: "text-red-800 dark:text-red-200",
      label: "Atrasado",
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>
  )
}

export default function ProcessosAtribuidosPage() {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [termoBusca, setTermoBusca] = useState<string>("")
  const [processoSelecionado, setProcessoSelecionado] = useState<any | null>(null)

  // Filtrar processos com base nos filtros selecionados
  const processosFiltrados = processosAtribuidos.filter((processo) => {
    // Filtro por status
    if (filtroStatus !== "todos" && processo.status !== filtroStatus) {
      return false
    }

    // Filtro por termo de busca
    if (
      termoBusca &&
      !processo.nome.toLowerCase().includes(termoBusca.toLowerCase()) &&
      !processo.descricao.toLowerCase().includes(termoBusca.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Calcular o número de processos por status
  const contadorStatus = {
    total: processosAtribuidos.length,
    pendente: processosAtribuidos.filter((p) => p.status === "pendente").length,
    em_andamento: processosAtribuidos.filter((p) => p.status === "em_andamento").length,
    concluido: processosAtribuidos.filter((p) => p.status === "concluido").length,
    atrasado: processosAtribuidos.filter((p) => p.status === "atrasado").length,
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Processos Atribuídos</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Perfil:</span>
            <span className="text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full">
              Colaborador
            </span>
          </div>
          <Link
            href="/minhas-tarefas"
            className="text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Ver Minhas Tarefas
          </Link>
        </div>
      </div>

      {/* Resumo de processos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-gray-400 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Processos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contadorStatus.total}</p>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Activity size={24} className="text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-yellow-400 dark:border-yellow-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contadorStatus.pendente}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contadorStatus.em_andamento}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Clock size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-green-400 dark:border-green-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Concluídos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contadorStatus.concluido}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-red-400 dark:border-red-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Atrasados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contadorStatus.atrasado}</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
              <Clock size={24} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="busca" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                id="busca"
                placeholder="Buscar por nome ou descrição..."
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
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
                <option value="atrasado">Atrasado</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de processos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna de processos */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Processos</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {processosFiltrados.length} processos encontrados
              </span>
            </div>

            {processosFiltrados.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {processosFiltrados.map((processo) => (
                  <li
                    key={processo.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${processoSelecionado?.id === processo.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                    onClick={() => setProcessoSelecionado(processo)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{processo.nome}</h3>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{processo.descricao}</p>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <StatusBadge status={processo.status} />
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            {processo.etapas.filter((e) => e.responsavel.id === "user1").length} etapas atribuídas
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <Calendar size={16} className="mr-1" />
                          <span>Atualizado em: {processo.ultimaAtualizacao}</span>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                          <div
                            className={`h-2.5 rounded-full ${
                              processo.status === "atrasado"
                                ? "bg-red-600 dark:bg-red-500"
                                : processo.status === "concluido"
                                  ? "bg-green-600 dark:bg-green-500"
                                  : "bg-blue-600 dark:bg-blue-500"
                            }`}
                            style={{ width: `${processo.progresso}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center">
                            <div className="flex -space-x-2">
                              {processo.participantes.slice(0, 3).map((participante) => (
                                <div
                                  key={participante.id}
                                  className="relative w-6 h-6 rounded-full overflow-hidden border border-white dark:border-gray-800"
                                >
                                  <Image
                                    src={participante.foto || "/placeholder.svg"}
                                    alt={participante.nome}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                              {processo.participantes.length > 3 && (
                                <div className="relative w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border border-white dark:border-gray-800 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                                  +{processo.participantes.length - 3}
                                </div>
                              )}
                            </div>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">
                              {processo.participantes.length} participantes
                            </span>
                          </div>

                          <Link
                            href={`/processos/${processo.id}/detalhes`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                          >
                            Ver detalhes
                            <ArrowUpRight size={16} className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <Search size={32} className="text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Nenhum processo encontrado</h3>
                <p className="text-gray-500 dark:text-gray-400">Tente ajustar os filtros ou termos de busca.</p>
              </div>
            )}
          </div>
        </div>

        {/* Coluna de detalhes do processo */}
        <div className="lg:col-span-1">
          {processoSelecionado ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Detalhes do Processo</h2>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{processoSelecionado.nome}</h3>
                <StatusBadge status={processoSelecionado.status} />

                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{processoSelecionado.descricao}</p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Data de Criação</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {processoSelecionado.dataCriacao}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Última Atualização</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {processoSelecionado.ultimaAtualizacao}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Progresso</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                    <div
                      className={`h-2.5 rounded-full ${
                        processoSelecionado.status === "atrasado"
                          ? "bg-red-600 dark:bg-red-500"
                          : processoSelecionado.status === "concluido"
                            ? "bg-green-600 dark:bg-green-500"
                            : "bg-blue-600 dark:bg-blue-500"
                      }`}
                      style={{ width: `${processoSelecionado.progresso}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right text-gray-600 dark:text-gray-400">
                    {processoSelecionado.progresso}% concluído
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Responsável</p>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200 dark:border-gray-600">
                      <Image
                        src={processoSelecionado.responsavel.foto || "/placeholder.svg"}
                        alt={processoSelecionado.responsavel.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {processoSelecionado.responsavel.nome}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Responsável pelo processo</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Participantes</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {processoSelecionado.participantes.length} pessoas
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3">
                    <div className="flex flex-wrap gap-2">
                      {processoSelecionado.participantes.map((participante) => (
                        <div
                          key={participante.id}
                          className="flex items-center bg-white dark:bg-gray-700 p-2 rounded-md"
                        >
                          <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2 border border-gray-200 dark:border-gray-600">
                            <Image
                              src={participante.foto || "/placeholder.svg"}
                              alt={participante.nome}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">{participante.nome}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{participante.papel}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Minhas Etapas</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {processoSelecionado.etapas.filter((e) => e.responsavel.id === "user1").length} etapas
                    </span>
                  </div>
                  <div className="space-y-2">
                    {processoSelecionado.etapas
                      .filter((etapa) => etapa.responsavel.id === "user1")
                      .map((etapa) => (
                        <div key={etapa.id} className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{etapa.nome}</p>
                            <StatusBadge status={etapa.status} />
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>
                              Tarefas: {etapa.tarefasConcluidas}/{etapa.tarefas}
                            </span>
                            <Link
                              href="/minhas-tarefas"
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              Ver tarefas
                            </Link>
                          </div>
                        </div>
                      ))}

                    {processoSelecionado.etapas.filter((e) => e.responsavel.id === "user1").length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">
                        Você não tem etapas atribuídas neste processo.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Link
                    href={`/processos/${processoSelecionado.id}/detalhes`}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Ver Detalhes Completos
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <Activity size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Selecione um Processo</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                Clique em um processo na lista para ver seus detalhes e acompanhar seu progresso.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
