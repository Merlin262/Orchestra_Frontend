"use client"

import { useEffect, useState, use } from "react"
import { useParams } from "next/navigation"
import ProcessDetails from "@/components/process-details"
import ProcessTracking from "@/components/process-tracking"
import BpmnViewer from "@/components/bpmn-viewer"
import BpmnEditor from "@/components/bpmn-editor"
import TaskDetailsPanel from "@/components/task-details-panel"
import BpmnTaskList from "@/components/bpmn-task-list"
import { ArrowLeft, Edit, FileText, ListChecks, Users, Info } from "lucide-react"
import Link from "next/link"
import AddUserModal from "@/components/add-user-modal"
import { apiClient } from "@/lib/api-client"
import { useProcessInstanceSignalR } from "@/hooks/useProcessInstanceSignalR";
import { TaskStatusEnum } from "@/components/Enum/TaskStatusEnum";

interface ProcessoData {
  id: string
  name: string
  CreatedBy: string
  createdAt: string
  lastUpdate: string
  xmlContent: string
}

type Processo = {
  id: string
  name: string
  createdAt: string
  lastUpdate: string
  CreatedBy: string
  xml: string
}

type Task = {
  taskId: string,
  name: string
  completed: boolean,
  statusId: TaskStatusEnum,
  createdAt: string,
  completedAt?: string,
  comments?: string,
  responsibleUser? : User
}

type User = {
  id: string,
  userName: string,
  email: string,
  fullName: string,
  role?: string
}


type Tab = "diagrama" | "tarefas" | "acompanhamento" | "detalhes"

const fetchProcessoById = async (id: string): Promise<Processo> => {
  try {
    const data = await apiClient.get<ProcessoData>(`/api/BpmnProcessInstances/${id}`)
    // Adaptar os campos para o formato esperado pelo componente
    return {
      id: data.id,
      name: data.name,
      CreatedBy: data.CreatedBy,
      createdAt: data.createdAt,
      lastUpdate: data.lastUpdate,
      xml: data.xmlContent,
    }
  } catch (error) {
    throw new Error("Erro ao buscar processo")
  }
}

const fetchPools = async (processId: string): Promise<string[]> => {
  try {
    return await apiClient.get<string[]>(`/api/Bpmn/${processId}/pools`)
  } catch (error) {
    throw new Error("Erro ao buscar pools")
  }
}

export default function InstanciaDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = useParams()
  const [instancia, setInstancia] = useState(null)
  const [processo, setProcesso] = useState<Processo | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>("diagrama")
  const [currentXml, setCurrentXml] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [selectedEtapa, setSelectedEtapa] = useState<{ id: string, nome: string } | null>(null)
  const [pools, setPools] = useState<string[]>([])
  const [instanceTasks, setInstanceTasks] = useState<any[]>([]);
  const [assignees, setAssignees] = useState<any[]>([]);
  const resolvedParams = use(params)

  const etapas = instanceTasks.map(task => ({
    id: task.id,
    nome: task.name,
    responsaveis: task.assignee ? [task.assignee] : [],
  }))

  useEffect(() => {
    if (!resolvedParams.id) return;
    apiClient.get<any[]>(`/api/BpmnProcessInstances/${resolvedParams.id}/tasks`)
      .then(setInstanceTasks)
      .catch(err => setError(err.message));

    // Busca as tasks com usuários e status para acompanhamento
    apiClient.get<any[]>(`/api/BpmnProcessInstances/${resolvedParams.id}/tasks-with-users-status`)
      .then((data) => {
        // Mapear para o tipo Task
        const mapped: Task[] = data.map(item => ({
          taskId: item.taskId,
          name: item.name,
          completed: item.completed ?? false,
          statusId: item.statusId as TaskStatusEnum,
          createdAt: item.createdAt ?? '',
          completedAt: item.completedAt,
          comments: item.comments,
          responsibleUser: item.responsibleUser
        }));
        setAssignees(mapped);
      })
      .catch(() => setAssignees([]));
  }, [resolvedParams.id]);

  useProcessInstanceSignalR(({ taskId, statusId }) => {
    console.log("Sinal recebido do SignalR: TaskStatusUpdated", { taskId, statusId });
    setInstanceTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.xmlTaskId === taskId ? { ...task, statusId: Number(statusId) } : task
      )
    );
  });

  useEffect(() => {
    if (showAddUserModal && processo?.id) {
      fetchPools(processo.id)
        .then(setPools)
        .catch(() => setPools([]))
    }
  }, [showAddUserModal, processo?.id])

  const handleTaskClick = (taskId: string, taskName: string) => {
    setSelectedEtapa({ id: taskId, nome: taskName })
    setShowAddUserModal(true)
  }

  const handleAddUser = (etapaId: string, userId: string, papel: string) => {
    // Sua lógica para adicionar usuário à etapa
    // Exemplo: console.log(etapaId, userId, papel)
  }

  useEffect(() => {
    setLoading(true)
    fetchProcessoById(resolvedParams.id)
      .then((data) => {
        setProcesso(data)
        setCurrentXml(data.xml)
      })
      .catch(() => setError("Erro ao carregar processo"))
      .finally(() => setLoading(false))
  }, [resolvedParams.id])

  if (loading) return <div className="p-6">Carregando...</div>
  if (error || !processo) return <div className="p-6 text-red-500">{error || "Processo não encontrado"}</div>

  const currentAssignee = assignees.find((a) => a.statusId === 1)

  const handleSaveChanges = (xml: string) => {
    // Aqui você implementaria a lógica para salvar as alterações no backend
    setCurrentXml(xml)
    setIsEditing(false)
    alert("Alterações salvas com sucesso!")
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId)
    setActiveTab("detalhes")
  }

  // Encontrar a tarefa selecionada
  const selectedTask = selectedTaskId ? instanceTasks.find((task) => task.id === selectedTaskId) : null

  return (
    <div className="h-screen flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/processos"
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{processo.name}</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("diagrama")}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                activeTab === "diagrama"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <FileText size={16} />
              Diagrama
            </button>
            <button
              onClick={() => setActiveTab("tarefas")}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                activeTab === "tarefas"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <ListChecks size={16} />
              Tarefas
            </button>
            <button
              onClick={() => setActiveTab("acompanhamento")}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                activeTab === "acompanhamento"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Users size={16} />
              Acompanhamento
            </button>
            {selectedTask && (
              <button
                onClick={() => setActiveTab("detalhes")}
                className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                  activeTab === "detalhes"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Info size={16} />
                Detalhes da Tarefa
              </button>
            )}
          </nav>
        </div>

        <div className="flex-1 min-h-0">
          {activeTab === "diagrama" && !isEditing && (
            <div className="w-full h-full">
              <BpmnViewer xml={processo.xml} onTaskClick={handleTaskClick} instanceTasks={instanceTasks} />
            </div>
          )}

          {activeTab === "diagrama" && isEditing && (
            <BpmnEditor
              xml={currentXml}
              isEditable={isEditing}
              onSave={handleSaveChanges}
              currentTask={currentAssignee?.taskId}
              assignee={currentAssignee?.name}
            />
          )}
          {activeTab === "tarefas" && <BpmnTaskList xml={currentXml} />}
          {activeTab === "acompanhamento" && <ProcessTracking xml={currentXml} assignees={assignees} />}
          {activeTab === "detalhes" && selectedTask && <TaskDetailsPanel task={selectedTask} />}
        </div>
      </div>
      
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        etapas={selectedEtapa ? [selectedEtapa] : etapas}
        onAddUser={handleAddUser}
        pools={pools}
        processInstanceId={processo.id}
      />
    </div>
  )
}