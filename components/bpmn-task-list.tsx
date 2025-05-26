"use client"

import { useEffect, useState } from "react"
import { Circle, AlertCircle } from "lucide-react"

interface Task {
  id: string
  name: string
  type: string
}

interface BpmnTaskListProps {
  xml: string
}

export default function BpmnTaskList({ xml }: BpmnTaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const extractTasks = async () => {
      try {
        setLoading(true)
        setError(null)

        // Usar DOMParser para analisar o XML
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xml, "text/xml")

        // Verificar se há erros de parsing
        const parserError = xmlDoc.querySelector("parsererror")
        if (parserError) {
          throw new Error("XML inválido")
        }

        // Extrair todas as tarefas do XML
        // Namespace BPMN 2.0
        const bpmnNS = "http://www.omg.org/spec/BPMN/20100524/MODEL"

        // Selecionar todos os tipos de tarefas
        const taskTypes = [
          "task",
          "userTask",
          "serviceTask",
          "sendTask",
          "receiveTask",
          "manualTask",
          "businessRuleTask",
          "scriptTask",
        ]

        const extractedTasks: Task[] = []

        // Para cada tipo de tarefa, extrair os elementos
        taskTypes.forEach((type) => {
          const elements = xmlDoc.getElementsByTagNameNS(bpmnNS, type)

          for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            const id = element.getAttribute("id") || ""
            const name = element.getAttribute("name") || "Tarefa sem nome"

            extractedTasks.push({
              id,
              name,
              type: type.replace(/([A-Z])/g, " $1").trim(), // Formatar o tipo (ex: userTask -> user Task)
            })
          }
        })

        setTasks(extractedTasks)
        setLoading(false)
      } catch (err) {
        console.error("Erro ao extrair tarefas:", err)
        setError("Não foi possível extrair as tarefas do diagrama BPMN.")
        setLoading(false)
      }
    }

    if (xml) {
      extractTasks()
    }
  }, [xml])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-700">{error}</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-700">Nenhuma tarefa encontrada no diagrama.</p>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto max-h-[500px]">
  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
    {tasks.map((task) => (
      <li
        key={task.id}
        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-1">
            <Circle size={18} className="text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tipo: {task.type}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">ID: {task.id}</p>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>
  )
}
