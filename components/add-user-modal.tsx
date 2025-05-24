"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Search, UserPlus, AlertCircle } from "lucide-react"

interface User {
  id: string
  nome: string
  email: string
  cargo: string
  departamento: string
  foto: string
}

interface Etapa {
  id: string
  nome: string
  responsaveis?: User[]
}

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  etapas: Etapa[]
  onAddUser: (etapaId: string, userId: string, papel: string) => void
}

// Papéis disponíveis para atribuição
const papeisDisponiveis = [
  { id: "responsavel", nome: "Responsável" },
  { id: "aprovador", nome: "Aprovador" },
  { id: "consultor", nome: "Consultor" },
  { id: "executor", nome: "Executor" },
  { id: "observador", nome: "Observador" },
]

export default function AddUserModal({ isOpen, onClose, etapas, onAddUser }: AddUserModalProps) {
  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEtapa, setSelectedEtapa] = useState<string>("")
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [selectedPapel, setSelectedPapel] = useState<string>("responsavel")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [errors, setErrors] = useState<{ etapa?: string; usuario?: string }>({})

  // Buscar usuários da API ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      fetch("https://localhost:7073/api/users") 
        .then((res) => res.json())
        .then((data) => setUsuariosDisponiveis(data))
        .catch(() => setUsuariosDisponiveis([]))
    }
  }, [isOpen])

  const handleUserSelect = async (userId: string) => {
    setSelectedUser(userId)
      if (selectedEtapa) {
        try {
          await fetch("https://localhost:7073/api/tasks/assign-user", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              taskId: selectedEtapa,
            }),
          })
          // Opcional: feedback ou fechar modal
          onClose()
        } catch (error) {
          // Trate o erro conforme necessário
          alert("Erro ao atribuir usuário à tarefa.")
        }
      }
    }

  // Filtrar usuários com base no termo de busca
  useEffect(() => {
  const filtered = usuariosDisponiveis.filter(
    (user) =>
      (user.nome ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.cargo ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.departamento ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  )
  setFilteredUsers(filtered)
}, [searchTerm, usuariosDisponiveis])

  // Resetar o estado quando o modal é aberto
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("")
      setSelectedEtapa(etapas.length > 0 ? etapas[0].id : "")
      setSelectedUser("")
      setSelectedPapel("responsavel")
      setErrors({})
    }
  }, [isOpen, etapas])

  const handleSubmit = () => {
    // Validar campos
    const newErrors: { etapa?: string; usuario?: string } = {}

    if (!selectedEtapa) {
      newErrors.etapa = "Selecione uma etapa"
    }

    if (!selectedUser) {
      newErrors.usuario = "Selecione um usuário"
    }

    setErrors(newErrors)

    // Se não houver erros, adicionar usuário
    if (Object.keys(newErrors).length === 0) {
      onAddUser(selectedEtapa, selectedUser, selectedPapel)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <UserPlus size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Adicionar Usuário à Etapa</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Seleção de etapa */}
            <div>
              <label htmlFor="etapa" className="block text-sm font-medium text-gray-700 mb-1">
                Etapa do Processo
              </label>
              <div className="relative">
                <select
                  id="etapa"
                  className={`w-full p-2 border ${
                    errors.etapa ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  value={selectedEtapa}
                  onChange={(e) => setSelectedEtapa(e.target.value)}
                >
                  <option value="">Selecione uma etapa</option>
                  {etapas.map((etapa) => (
                    <option key={etapa.id} value={etapa.id}>
                      {etapa.nome}
                    </option>
                  ))}
                </select>
                {errors.etapa && (
                  <div className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.etapa}
                  </div>
                )}
              </div>
            </div>

            {/* Seleção de papel */}
            <div>
              <label htmlFor="papel" className="block text-sm font-medium text-gray-700 mb-1">
                Papel do Usuário
              </label>
              <select
                id="papel"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedPapel}
                onChange={(e) => setSelectedPapel(e.target.value)}
              >
                {papeisDisponiveis.map((papel) => (
                  <option key={papel.id} value={papel.id}>
                    {papel.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Busca de usuários */}
            <div>
              <label htmlFor="busca-usuario" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar Usuário
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="busca-usuario"
                  placeholder="Buscar por nome, email, cargo ou departamento..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
              </div>
              {errors.usuario && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.usuario}
                </div>
              )}
            </div>

            {/* Lista de usuários */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Usuários Disponíveis</h3>
                <span className="text-xs text-gray-500">{filteredUsers.length} usuários encontrados</span>
              </div>

              <div className="border border-gray-200 rounded-md overflow-hidden max-h-64 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <li
                        key={user.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer ${
                          selectedUser === user.id ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleUserSelect(user.id)}
                      >
                        <div className="flex items-center">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                            <Image
                              src={user.foto || "/placeholder.svg"}
                              alt={user.nome}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.nome}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-gray-900">{user.cargo}</p>
                            <p className="text-xs text-gray-500">{user.departamento}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p>Nenhum usuário encontrado com os critérios de busca.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t p-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
          >
            Adicionar Usuário
          </button>
        </div>
      </div>
    </div>
  )
}
