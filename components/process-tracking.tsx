"use client"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"

interface Assignee {
  id: string
  name: string
  taskId: string
  taskName: string
  status: "active" | "completed" | "pending"
  photoUrl?: string
}

interface ProcessTrackingProps {
  xml: string
  assignees?: Assignee[]
}

export default function ProcessTracking({ xml, assignees = [] }: ProcessTrackingProps) {
  // Se não houver assignees, criar alguns para demonstração
  const demoAssignees: Assignee[] = [
    {
      id: "1",
      name: "João Silva",
      taskId: "Task_1",
      taskName: "Analisar Solicitação",
      status: "active",
      photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "2",
      name: "Maria Oliveira",
      taskId: "Task_2",
      taskName: "Processar Aprovação",
      status: "pending",
      photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: "3",
      name: "Carlos Santos",
      taskId: "Task_3",
      taskName: "Notificar Rejeição",
      status: "pending",
      photoUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    },
  ]

  const displayAssignees = assignees.length > 0 ? assignees : demoAssignees

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={18} className="text-green-500" />
      case "active":
        return <Clock size={18} className="text-blue-500" />
      case "pending":
        return <AlertCircle size={18} className="text-gray-400" />
      default:
        return <AlertCircle size={18} className="text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído"
      case "active":
        return "Em andamento"
      case "pending":
        return "Pendente"
      default:
        return "Desconhecido"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700"
      case "active":
        return "bg-blue-50 text-blue-700"
      case "pending":
        return "bg-gray-50 text-gray-500"
      default:
        return "bg-gray-50 text-gray-500"
    }
  }

  return (
    <div className="overflow-y-auto max-h-[500px]">
  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Acompanhamento de Integrantes</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Visualize em qual etapa do processo cada integrante está trabalhando
    </p>
  </div>

  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
    {displayAssignees.map((assignee) => (
      <li key={assignee.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {assignee.photoUrl ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={assignee.photoUrl || "/placeholder.svg"}
                  alt={assignee.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback para as iniciais se a imagem falhar
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-medium">
                {assignee.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{assignee.name}</p>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  assignee.status === "completed"
                    ? "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300"
                    : assignee.status === "active"
                    ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-300"
                }`}
              >
                {getStatusText(assignee.status)}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Etapa: <span className="font-medium dark:text-gray-100">{assignee.taskName}</span>
            </p>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>
  )
}
