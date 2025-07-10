"use client"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"
import { TaskStatusEnum } from "./Enum/TaskStatusEnum"

interface Assignee {
  name: string
  taskId: string
  taskName: string
  statusId: TaskStatusEnum
  photoUrl?: string,
  responsibleUser: User
}

interface ProcessTrackingProps {
  xml: string
  assignees?: Assignee[]
}

type User = {
  id: string,
  userName: string,
  email: string,
  fullName?: string,
  role?: string
}

export default function ProcessTracking({ xml, assignees = [] }: ProcessTrackingProps) {
  const displayAssignees = assignees

  const getStatusIcon = (status: TaskStatusEnum) => {
    switch (status) {
      case TaskStatusEnum.Finished:
        return <CheckCircle size={18} className="text-green-500" />
      case TaskStatusEnum.InProgress:
        return <Clock size={18} className="text-blue-500" />
      case TaskStatusEnum.NotStarted:
      case TaskStatusEnum.Late:
        return <AlertCircle size={18} className="text-gray-400" />
      default:
        return <AlertCircle size={18} className="text-gray-400" />
    }
  }

  const getStatusText = (status: TaskStatusEnum) => {
    console.log("Status:", status)
    switch (status) {
      case TaskStatusEnum.Finished:
        return "Concluído"
      case TaskStatusEnum.InProgress:
        return "Em andamento"
      case TaskStatusEnum.NotStarted:
        return "Pendente"
      case TaskStatusEnum.Late:
        return "Atrasado"
      default:
        return "Pendente"
    }
  }

  const getStatusColor = (status: TaskStatusEnum) => {
    switch (status) {
      case TaskStatusEnum.Finished:
        return "bg-green-50 text-green-700"
      case TaskStatusEnum.InProgress:
        return "bg-blue-50 text-blue-700"
      case TaskStatusEnum.NotStarted:
        return "bg-gray-50 text-gray-500"
      case TaskStatusEnum.Late:
        return "bg-red-50 text-red-700"
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
      <li key={assignee.taskId} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{assignee.responsibleUser?.fullName}</p>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  assignee.statusId === TaskStatusEnum.Finished
                    ? "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300"
                    : assignee.statusId === TaskStatusEnum.InProgress
                    ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : assignee.statusId === TaskStatusEnum.Late
                    ? "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-300"
                }`}
              >
                {getStatusText(assignee.statusId)}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Etapa: <span className="font-medium dark:text-gray-100">{assignee.name}</span>
            </p>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>
  )
}
