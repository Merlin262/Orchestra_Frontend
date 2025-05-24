"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ProcessDetails from "@/components/process-details"
import ProcessTracking from "@/components/process-tracking"
import BpmnViewer from "@/components/bpmn-viewer"
import BpmnEditor from "@/components/bpmn-editor"
import TaskDetailsPanel from "@/components/task-details-panel"
import BpmnTaskList from "@/components/bpmn-task-list"
import { ArrowLeft, Edit, FileText, ListChecks, Users, Info } from "lucide-react"
import Link from "next/link"

type Processo = {
  id: string
  name: string
  createdAt: string
  lastUpdate: string
  CreatedBy: string
  xml: string
}

const assignees = [
  {
    id: "1",
    name: "João Silva",
    taskId: "Task_1",
    taskName: "Analisar Solicitação",
    status: "active" as const,
    photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    taskId: "Task_2",
    taskName: "Processar Aprovação",
    status: "pending" as const,
    photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "3",
    name: "Carlos Santos",
    taskId: "Task_3",
    taskName: "Notificar Rejeição",
    status: "pending" as const,
    photoUrl: "https://randomuser.me/api/portraits/men/67.jpg",
  },
]

// Gerar dados de tarefas com detalhes
const tasks = [
  {
    id: "Task_1",
    name: "Analisar Solicitação",
    type: "task",
    assignee: assignees.find((a) => a.taskId === "Task_1"),
    details: {
      description: "Análise inicial da solicitação do cliente para verificar viabilidade e documentação.",
      startDate: "15/04/2023",
      dueDate: "22/04/2023",
      progress: 75,
      subtasks: [
        { id: "Task_1-sub1", name: "Verificar documentação", completed: true },
        { id: "Task_1-sub2", name: "Validar informações", completed: true },
        { id: "Task_1-sub3", name: "Preparar relatório", completed: false },
        { id: "Task_1-sub4", name: "Encaminhar para aprovação", completed: false },
      ],
      comments: [
        { author: "João Silva", date: "16/04/2023", text: "Documentação recebida, iniciando análise." },
        { author: "Ana Souza", date: "18/04/2023", text: "Encontrei inconsistências nos dados financeiros." },
        { author: "João Silva", date: "19/04/2023", text: "Inconsistências corrigidas, continuando análise." },
      ],
    },
  },
  {
    id: "Task_2",
    name: "Processar Aprovação",
    type: "task",
    assignee: assignees.find((a) => a.taskId === "Task_2"),
    details: {
      description: "Processamento da aprovação da solicitação, incluindo geração de documentos e notificações.",
      startDate: "23/04/2023",
      dueDate: "28/04/2023",
      progress: 30,
      subtasks: [
        { id: "Task_2-sub1", name: "Gerar documentos", completed: true },
        { id: "Task_2-sub2", name: "Coletar assinaturas", completed: false },
        { id: "Task_2-sub3", name: "Registrar aprovação", completed: false },
        { id: "Task_2-sub4", name: "Notificar cliente", completed: false },
      ],
      comments: [
        { author: "Maria Oliveira", date: "23/04/2023", text: "Iniciando processamento da aprovação." },
        { author: "Carlos Santos", date: "24/04/2023", text: "Documentos gerados e enviados para assinatura." },
      ],
    },
  },
  {
    id: "Task_3",
    name: "Notificar Rejeição",
    type: "task",
    assignee: assignees.find((a) => a.taskId === "Task_3"),
    details: {
      description: "Notificação ao cliente sobre a rejeição da solicitação, incluindo motivos e próximos passos.",
      startDate: "23/04/2023",
      dueDate: "25/04/2023",
      progress: 10,
      subtasks: [
        { id: "Task_3-sub1", name: "Preparar justificativa", completed: true },
        { id: "Task_3-sub2", name: "Revisar com gerência", completed: false },
        { id: "Task_3-sub3", name: "Enviar notificação", completed: false },
        { id: "Task_3-sub4", name: "Registrar feedback", completed: false },
      ],
      comments: [{ author: "Carlos Santos", date: "23/04/2023", text: "Preparando justificativa para rejeição." }],
    },
  },
]

type Tab = "diagrama" | "tarefas" | "acompanhamento" | "detalhes"

const fetchProcessoById = async (id: string): Promise<Processo> => {
  const res = await fetch(`https://localhost:7073/api/Bpmn/${id}`)
  if (!res.ok) throw new Error("Erro ao buscar processo")
  const data = await res.json()
  // Adaptar os campos para o formato esperado pelo componente
  return {
    id: data.id,
    name: data.name,
    CreatedBy: data.CreatedBy,
    createdAt: data.createdAt,
    lastUpdate: data.lastUpdate,
    xml: data.xmlContent,
  }
}

export default function ProcessoDetailsPage({ params }: { params: { id: string } }) {
  const [processo, setProcesso] = useState<Processo | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>("diagrama")
  const [currentXml, setCurrentXml] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchProcessoById(params.id)
      .then((data) => {
        setProcesso(data)
        setCurrentXml(data.xml)
      })
      .catch(() => setError("Erro ao carregar processo"))
      .finally(() => setLoading(false))
  }, [params.id])


  if (loading) return <div className="p-6">Carregando...</div>
  if (error || !processo) return <div className="p-6 text-red-500">{error || "Processo não encontrado"}</div>

  const currentAssignee = assignees.find((a) => a.status === "active")

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
  const selectedTask = selectedTaskId ? tasks.find((task) => task.id === selectedTaskId) : null

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/processos" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{processo.name}</h1>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Edit size={18} />
            Editar Processo
          </button>
        ) : (
          <div className="text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-md">Modo de edição ativo</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna da esquerda: ProcessDetails + Tarefas do Processo */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <ProcessDetails processo={processo} />

          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Tarefas do Processo</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedTaskId === task.id ? "bg-blue-50" : ""}`}
                  onClick={() => handleTaskSelect(task.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${task.details.progress >= 100 ? "bg-green-500" : task.details.progress > 0 ? "bg-blue-500" : "bg-gray-300"} mr-3`}
                      ></div>
                      <span className="font-medium text-gray-900">{task.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">{task.details.progress}%</div>
                  </div>
                  {task.assignee && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <div className="relative w-5 h-5 rounded-full overflow-hidden mr-2">
                        <img
                          src={task.assignee.photoUrl || "/placeholder.svg"}
                          alt={task.assignee.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span>{task.assignee.name}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Coluna da direita: Diagrama e abas */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full min-h-0 flex flex-col">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("diagrama")}
                className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                  activeTab === "diagrama"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FileText size={16} />
                Diagrama
              </button>
              <button
                onClick={() => setActiveTab("tarefas")}
                className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                  activeTab === "tarefas"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ListChecks size={16} />
                Tarefas
              </button>
              <button
                onClick={() => setActiveTab("acompanhamento")}
                className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                  activeTab === "acompanhamento"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
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
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
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
              <BpmnViewer xml={processo.xml} />
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
      </div>
    </div>
  )
}