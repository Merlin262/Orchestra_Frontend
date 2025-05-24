"use client"

import { useState } from "react"
import { Calendar, Clock, CheckCircle, Circle, MessageSquare, User } from "lucide-react"

interface TaskDetailsPanelProps {
  task: any
}

export default function TaskDetailsPanel({ task }: TaskDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<"info" | "subtasks" | "comments">("info")

  // Calcular o número de subtarefas concluídas
  const completedSubtasks = task.details.subtasks.filter((subtask: any) => subtask.completed).length
  const totalSubtasks = task.details.subtasks.length
  const completionPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  return (
    <div className="h-full flex flex-col">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${task.details.progress >= 100 ? "bg-green-500" : task.details.progress > 0 ? "bg-blue-500" : "bg-gray-300"}`}
          ></div>
          <h2 className="text-xl font-semibold text-gray-900">{task.name}</h2>
        </div>
        <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
          {task.details.progress}% concluído
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="border-b">
        <nav className="flex">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "info" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Informações
          </button>
          <button
            onClick={() => setActiveTab("subtasks")}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === "subtasks"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tarefas Pendentes
            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === "comments"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Comentários
            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {task.details.comments.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "info" && (
          <div className="space-y-6">
            {/* Barra de progresso */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Progresso</h3>
                <span className="text-sm font-medium text-gray-900">{task.details.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${task.details.progress}%` }}></div>
              </div>
            </div>

            {/* Responsável */}
            <div className="flex items-start gap-4">
              <User size={20} className="text-gray-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Responsável</h3>
                <div className="mt-1 flex items-center gap-2">
                  {task.assignee ? (
                    <>
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={task.assignee.photoUrl || "/placeholder.svg"}
                          alt={task.assignee.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="text-sm text-gray-900">{task.assignee.name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">Não atribuído</span>
                  )}
                </div>
              </div>
            </div>

            {/* Datas */}
            <div className="flex items-start gap-4">
              <Calendar size={20} className="text-gray-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Datas</h3>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Início</p>
                    <p className="text-sm text-gray-900">{task.details.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Prazo</p>
                    <p className="text-sm text-gray-900">{task.details.dueDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="flex items-start gap-4">
              <MessageSquare size={20} className="text-gray-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Descrição</h3>
                <p className="mt-1 text-sm text-gray-600">{task.details.description}</p>
              </div>
            </div>

            {/* Conclusão de subtarefas */}
            <div className="flex items-start gap-4">
              <CheckCircle size={20} className="text-gray-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Conclusão de Tarefas</h3>
                <div className="mt-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      {completedSubtasks} de {totalSubtasks} concluídas
                    </span>
                    <span className="text-sm font-medium text-gray-900">{Math.round(completionPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "subtasks" && (
          <div>
            <ul className="divide-y divide-gray-200">
              {task.details.subtasks.map((subtask: any) => (
                <li key={subtask.id} className="py-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {subtask.completed ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <Circle size={20} className="text-gray-300" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className={`text-sm ${subtask.completed ? "text-gray-500 line-through" : "text-gray-900"}`}>
                        {subtask.name}
                      </p>
                    </div>
                    <div>
                      <button
                        className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                        onClick={() => {
                          // Aqui você implementaria a lógica para marcar/desmarcar a tarefa
                          alert(`${subtask.completed ? "Desmarcando" : "Marcando"} a subtarefa: ${subtask.name}`)
                        }}
                      >
                        {subtask.completed ? "Desmarcar" : "Concluir"}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {task.details.subtasks.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500">Nenhuma tarefa pendente encontrada</p>
              </div>
            )}

            {/* Adicionar nova subtarefa */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Adicionar nova subtarefa</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nome da subtarefa"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div>
            <ul className="space-y-4">
              {task.details.comments.map((comment: any, index: number) => (
                <li key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{comment.text}</p>
                </li>
              ))}
            </ul>

            {task.details.comments.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500">Nenhum comentário encontrado</p>
              </div>
            )}

            {/* Formulário para adicionar comentário */}
            <div className="mt-6 pt-6 border-t">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Adicionar comentário
              </label>
              <textarea
                id="comment"
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Digite seu comentário..."
              ></textarea>
              <div className="mt-2 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé */}
      <div className="border-t p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span className="text-xs text-gray-500">
            Última atualização: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors">
            Atualizar Status
          </button>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors">
            Reassignar
          </button>
        </div>
      </div>
    </div>
  )
}
