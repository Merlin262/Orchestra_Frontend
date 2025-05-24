"use client"

import { Activity, Circle, DiamondIcon } from "lucide-react"

interface BpmnPaletteProps {
  onSelectElement: (type: string) => void
}

export default function BpmnPalette({ onSelectElement }: BpmnPaletteProps) {
  const paletteItems = [
    {
      type: "task",
      name: "Tarefa",
      icon: <Activity size={20} className="text-blue-600" />,
      description: "Atividade ou tarefa a ser executada",
    },
    {
      type: "startEvent",
      name: "Evento de Início",
      icon: <Circle size={20} className="text-green-600" />,
      description: "Marca o início do processo",
    },
    {
      type: "endEvent",
      name: "Evento de Fim",
      icon: <Circle size={20} className="text-red-600" />,
      description: "Marca o fim do processo",
    },
    {
      type: "exclusiveGateway",
      name: "Gateway Exclusivo",
      icon: <DiamondIcon size={20} className="text-yellow-600" />,
      description: "Decisão exclusiva (ou/ou)",
    },
  ]

  return (
    <div className="p-2">
      <div className="p-2 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Elementos BPMN</h3>
        <p className="text-xs text-gray-500 mt-1">Arraste para o diagrama</p>
      </div>
      <div className="space-y-2 mt-2">
        {paletteItems.map((item) => (
          <div
            key={item.type}
            className="p-3 bg-white border border-gray-200 rounded-md hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
            onClick={() => onSelectElement(item.type)}
            title={item.description}
          >
            <div className="flex items-center">
              <div className="mr-2">{item.icon}</div>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
