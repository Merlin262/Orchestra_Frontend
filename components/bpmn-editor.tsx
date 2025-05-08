"use client"

import { useEffect, useRef, useState } from "react"
import { Save, Download, ZoomIn, ZoomOut, Undo, Redo } from "lucide-react"

interface BpmnEditorProps {
  processoId?: string
}

export default function BpmnEditor({ processoId }: BpmnEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [editorCarregado, setEditorCarregado] = useState(false)
  const [nomeDiagrama, setNomeDiagrama] = useState("Novo Diagrama")

  useEffect(() => {
    // Aqui seria implementada a inicialização do editor BPMN
    // Usando a biblioteca bpmn-js

    // Simulando o carregamento do editor
    const timer = setTimeout(() => {
      setEditorCarregado(true)

      if (processoId) {
        // Se tiver um ID, carregaria o processo existente
        setNomeDiagrama(`Processo #${processoId}`)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [processoId])

  const handleSalvar = () => {
    alert(`Diagrama "${nomeDiagrama}" salvo com sucesso!`)
  }

  const handleExportar = () => {
    // Lógica para exportar o diagrama
    alert("Diagrama exportado com sucesso!")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <input
          type="text"
          value={nomeDiagrama}
          onChange={(e) => setNomeDiagrama(e.target.value)}
          className="text-xl font-semibold border-none focus:outline-none focus:ring-0"
        />

        <div className="flex gap-2">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md" title="Desfazer">
            <Undo size={20} />
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md" title="Refazer">
            <Redo size={20} />
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md" title="Aumentar Zoom">
            <ZoomIn size={20} />
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md" title="Diminuir Zoom">
            <ZoomOut size={20} />
          </button>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md"
            title="Exportar Diagrama"
            onClick={handleExportar}
          >
            <Download size={20} />
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={handleSalvar}
          >
            <Save size={18} />
            Salvar
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
          <h3 className="font-medium mb-3">Elementos BPMN</h3>
          <div className="space-y-4">
            <div className="p-2 bg-white rounded border border-gray-200 cursor-move hover:border-blue-500">Tarefa</div>
            <div className="p-2 bg-white rounded border border-gray-200 cursor-move hover:border-blue-500">
              Evento de Início
            </div>
            <div className="p-2 bg-white rounded border border-gray-200 cursor-move hover:border-blue-500">
              Evento de Fim
            </div>
            <div className="p-2 bg-white rounded border border-gray-200 cursor-move hover:border-blue-500">
              Gateway Exclusivo
            </div>
            <div className="p-2 bg-white rounded border border-gray-200 cursor-move hover:border-blue-500">
              Gateway Paralelo
            </div>
            <div className="p-2 bg-white rounded border border-gray-200 cursor-move hover:border-blue-500">
              Fluxo de Sequência
            </div>
            <div className="p-2 bg-white rounded border border-gray-200 cursor-move hover:border-blue-500">
              Pool/Lane
            </div>
          </div>
        </div>

        <div ref={containerRef} className="flex-1 bg-white border relative">
          {!editorCarregado ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              {/* Aqui seria renderizado o editor BPMN real */}
              <p className="mb-2">Editor BPMN carregado</p>
              <p className="text-sm">Arraste elementos da barra lateral para começar a modelar</p>
            </div>
          )}
        </div>

        <div className="w-64 bg-gray-100 p-4 border-l overflow-y-auto">
          <h3 className="font-medium mb-3">Propriedades</h3>
          <p className="text-sm text-gray-500">Selecione um elemento para editar suas propriedades</p>
        </div>
      </div>
    </div>
  )
}
