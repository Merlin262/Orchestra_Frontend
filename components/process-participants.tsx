"use client"

import { useState } from "react"
import Image from "next/image"
import { UserPlus, X, Search, Filter } from "lucide-react"

interface User {
  id: string
  nome: string
  foto: string
  etapaId: string
  etapaNome: string
  papel: string
}

interface Etapa {
  id: string
  nome: string
}

interface ProcessParticipantsProps {
  participantes: User[]
  etapas: Etapa[]
  onAddUser: () => void
  onRemoveUser: (userId: string, etapaId: string) => void
}

export default function ProcessParticipants({
  participantes,
  etapas,
  onAddUser,
  onRemoveUser,
}: ProcessParticipantsProps) {
  const [filtroEtapa, setFiltroEtapa] = useState<string>("todas")
  const [filtroPapel, setFiltroPapel] = useState<string>("todos")
  const [termoBusca, setTermoBusca] = useState<string>("")

  // Filtrar participantes
  const participantesFiltrados = participantes.filter((participante) => {
    // Filtro por etapa
    if (filtroEtapa !== "todas" && participante.etapaId !== filtroEtapa) {
      return false
    }

    // Filtro por papel
    if (filtroPapel !== "todos" && participante.papel.toLowerCase() !== filtroPapel) {
      return false
    }

    // Filtro por termo de busca
    if (termoBusca && !participante.nome.toLowerCase().includes(termoBusca.toLowerCase())) {
      return false
    }

    return true
  })

  // Agrupar participantes por etapa
  const participantesPorEtapa = etapas.map((etapa) => {
    return {
      ...etapa,
      participantes: participantesFiltrados.filter((p) => p.etapaId === etapa.id),
    }
  })

  // Extrair papéis únicos para o filtro
  const papeisUnicos = Array.from(new Set(participantes.map((p) => p.papel.toLowerCase())))

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Participantes do Processo</h2>
        <button
          onClick={onAddUser}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          <UserPlus size={18} />
          Adicionar Participante
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Participante
            </label>
            <div className="relative">
              <input
                type="text"
                id="busca"
                placeholder="Nome do participante..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="etapa" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Etapa
            </label>
            <div className="relative">
              <select
                id="etapa"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={filtroEtapa}
                onChange={(e) => setFiltroEtapa(e.target.value)}
              >
                <option value="todas">Todas as etapas</option>
                {etapas.map((etapa) => (
                  <option key={etapa.id} value={etapa.id}>
                    {etapa.nome}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="papel" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Papel
            </label>
            <div className="relative">
              <select
                id="papel"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={filtroPapel}
                onChange={(e) => setFiltroPapel(e.target.value)}
              >
                <option value="todos">Todos os papéis</option>
                {papeisUnicos.map((papel) => (
                  <option key={papel} value={papel}>
                    {papel.charAt(0).toUpperCase() + papel.slice(1)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de participantes por etapa */}
      <div className="space-y-6">
        {participantesPorEtapa.map((etapa) => (
          <div key={etapa.id} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">{etapa.nome}</h3>

            {etapa.participantes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {etapa.participantes.map((participante) => (
                  <div
                    key={`${participante.id}-${etapa.id}`}
                    className="bg-white rounded-md p-3 border border-gray-200 flex items-center"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={participante.foto || "/placeholder.svg"}
                        alt={participante.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{participante.nome}</p>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">{participante.papel}</span>
                      </div>
                    </div>
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => onRemoveUser(participante.id, etapa.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-white rounded-md border border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">Nenhum participante atribuído a esta etapa</p>
                <button onClick={onAddUser} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  + Adicionar participante
                </button>
              </div>
            )}
          </div>
        ))}

        {participantesPorEtapa.every((etapa) => etapa.participantes.length === 0) && (
          <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
            <UserPlus size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">Nenhum participante encontrado</h3>
            <p className="text-gray-500 mb-4">Adicione participantes às etapas do processo</p>
            <button
              onClick={onAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Adicionar Participante
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
