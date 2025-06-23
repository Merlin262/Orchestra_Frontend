"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Search, UserPlus, AlertCircle, Check } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface User {
  id: string
  nome: string
  email: string
  cargo: string
  departamento: string
  foto: string
}

interface Task {
  xmlTaskId: string
  responsibleUser?: {
    id: string
  }
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
  pools?: string[]
  processInstanceId: string
}

// Papéis disponíveis para atribuição
const papeisDisponiveis = [
  { id: "responsavel", nome: "Responsável" },
  { id: "aprovador", nome: "Aprovador" },
  { id: "consultor", nome: "Consultor" },
  { id: "executor", nome: "Executor" },
  { id: "observador", nome: "Observador" },
]

export default function AddUserModal({ isOpen, onClose, etapas, onAddUser, pools, processInstanceId }: AddUserModalProps) {
  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEtapa, setSelectedEtapa] = useState<string>("")
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [selectedPapel, setSelectedPapel] = useState<string>("responsavel")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [errors, setErrors] = useState<{ etapa?: string; usuario?: string }>({})
  const [responsaveisPorTask, setResponsaveisPorTask] = useState<Record<string, string>>({})

  console.log("selectedUser:", selectedUser, "usuariosDisponiveis:", usuariosDisponiveis);

  // Buscar usuários da API ao abrir o modal
  useEffect(() => {
    if (isOpen && pools && pools.length > 0) {
      const params = pools.map(pool => `groupNames=${encodeURIComponent(pool)}`).join("&")
      apiClient.get<User[]>(`/api/users/ByGroups?${params}`)
        .then((data) => setUsuariosDisponiveis(data))
        .catch(() => setUsuariosDisponiveis([]))
    } else if (isOpen) {
      // fallback: busca todos se não houver pools
      apiClient.get<User[]>("/api/users")
        .then((data) => setUsuariosDisponiveis(data))
        .catch(() => setUsuariosDisponiveis([]))
    }
  }, [isOpen, pools])

  async function fetchTasksByProcessInstance(processInstanceId: string): Promise<Task[]> {
    if (!processInstanceId) return []
    try {
      return await apiClient.get<Task[]>(`/api/tasks/by-process-instance/${processInstanceId}`)
    } catch (error) {
      return []
    }
  }

  useEffect(() => {
    if (isOpen && processInstanceId) {
      fetchTasksByProcessInstance(processInstanceId)
        .then((tasks: Task[]) => {
          // Troque de taskId para xmlTaskId
          const mapping: Record<string, string> = {}
          tasks.forEach((task: Task) => {
            mapping[task.xmlTaskId] = task.responsibleUser?.id ?? ""
          })
          setResponsaveisPorTask(mapping)
        })
        .catch(() => setResponsaveisPorTask({}))
    }
  }, [isOpen, processInstanceId])

// Sempre que a etapa mudar, defina o usuário já vinculado como selecionado
  useEffect(() => {
    console.log("Responsáveis por task:", responsaveisPorTask)
    console.log("Etapa selecionada:", selectedEtapa)
    console.log("responsaveisPorTask[selectedEtapa]:", responsaveisPorTask[selectedEtapa])
    if (selectedEtapa && responsaveisPorTask[selectedEtapa]) {
      const userId = responsaveisPorTask[selectedEtapa]
      console.log("User ID vinculado:", userId)
      const user = usuariosDisponiveis.find(u => String(u.id).toLowerCase() === String(userId).toLowerCase())
      setFilteredUsers(user ? [user] : [])
    } else {
      // Caso contrário, filtra normalmente pelo termo de busca
      const filtered = usuariosDisponiveis.filter(
        (user) =>
          (user.nome ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.cargo ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.departamento ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, usuariosDisponiveis, selectedEtapa, responsaveisPorTask])


  const assignUserToTask = async (taskId: string, userId: string) => {
    try {
      await apiClient.put("/api/tasks/assign-user", {
        TaskId: taskId,
        UserId: userId,
      })
    } catch (error) {
      throw new Error("Erro ao atribuir usuário à tarefa")
    }
  }

  const desvincularUsuario = async (taskId: string) => {
    try {
      await apiClient.put(`/api/tasks/unassign-user/${taskId}`)
      setSelectedUser("")
    } catch (error) {
      console.error("Erro ao desvincular usuário:", error)
    }
  }

  const handleUserSelect = async (userId: string) => {
  setSelectedUser(userId)
  // Atribuição via API só deve acontecer no handleSubmit (ao clicar no botão)
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

  const handleSubmit = async () => {
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
    try {
      await assignUserToTask(selectedEtapa, selectedUser)
      onAddUser(selectedEtapa, selectedUser, selectedPapel)
      onClose()
    } catch (error) {
      setErrors({ ...newErrors, usuario: "Erro ao atribuir usuário à tarefa" })
    }
  }
}

  if (!isOpen) return null

  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <UserPlus size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Adicionar Usuário à Etapa</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Seleção de etapa */}
          <div>
            <label htmlFor="etapa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Etapa do Processo
            </label>
            <div className="relative">
              <select
                id="etapa"
                className={`w-full p-2 pr-10 border ${
                  errors.etapa ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                } rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 appearance-none`}
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

              {/* Ícone personalizado do dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 14a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 11.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 14z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {errors.etapa && (
                <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.etapa}
                </div>
              )}
            </div>
          </div>

          {/* Seleção de papel */}
          <div>
            <label htmlFor="papel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Papel do Usuário
            </label>
            <div className="relative">
              <select
                id="papel"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors appearance-none pr-10"
                value={selectedPapel}
                onChange={(e) => setSelectedPapel(e.target.value)}
              >
                {papeisDisponiveis.map((papel) => (
                  <option key={papel.id} value={papel.id}>
                    {papel.nome}
                  </option>
                ))}
              </select>
              {/* Ícone personalizado do dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 14a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 11.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 14z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Busca de usuários */}
          <div>
            <label htmlFor="busca-usuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Buscar Usuário
            </label>
            <div className="relative">
              <input
                type="text"
                id="busca-usuario"
                placeholder="Buscar por nome, email, cargo ou departamento..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            {errors.usuario && (
              <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                <AlertCircle size={16} className="mr-1" />
                {errors.usuario}
              </div>
            )}
          </div>

          {/* Lista de usuários */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Usuários Disponíveis</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">{filteredUsers.length} usuários encontrados</span>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden max-h-64 overflow-y-auto bg-white dark:bg-gray-900">
              {/* Se já houver usuário vinculado, mostra só ele */} 
              {selectedEtapa && responsaveisPorTask[selectedEtapa] ? (
                <ul>
                  {usuariosDisponiveis
                    .filter((user) => String(user.id).toLowerCase() === String(responsaveisPorTask[selectedEtapa]).toLowerCase())
                    .map((user) => (
                      <li key={user.id} className="p-3 bg-blue-50 dark:bg-blue-900 flex items-center justify-between">
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
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.nome}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded dark:bg-green-900 dark:text-green-200">
                              Responsável já vinculado a esta etapa
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{user.cargo}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.departamento}</p>
                          </div>
                        </div>
                        <button
                          className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                          onClick={() => desvincularUsuario(selectedEtapa)}
                        >
                          Desvincular Usuário
                        </button>
                      </li>
                    ))}
                </ul>
              ) : (
                // Caso não tenha usuário vinculado, mostra a lista normal
                filteredUsers.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <li
                        key={user.id}
                        className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                          selectedUser === user.id ? "bg-blue-50 dark:bg-blue-900" : ""
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
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.nome}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{user.cargo}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.departamento}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <p>Nenhum usuário encontrado com os critérios de busca.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end gap-2 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md text-sm transition-colors"
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
