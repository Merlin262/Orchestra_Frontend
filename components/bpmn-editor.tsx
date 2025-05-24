"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { Move, Link as LinkIcon, ZoomIn, ZoomOut, Save } from "lucide-react"
import BpmnPalette from "./bpmn-palette"

type Props = {
  xml: string
  isEditable: boolean
  onSave: (xml: string) => void
  currentTask?: string
  assignee?: string
}

export default function BpmnEditor({ xml, isEditable, onSave, currentTask, assignee }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelerRef = useRef<any>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [modifiedXml, setModifiedXml] = useState(false)

  const handleZoomIn = () => {
    if (modelerRef.current) {
      const canvas = modelerRef.current.get("canvas")
      canvas.zoom("fit-viewport")
    }
  }

  const handleZoomOut = () => {
    if (modelerRef.current) {
      const canvas = modelerRef.current.get("canvas")
      canvas.zoom(0.75)
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    let isMounted = true

    // Importar dinamicamente o bpmn-js no client
    import("bpmn-js/lib/Modeler").then((BpmnJSModule) => {
      if (!isMounted) return
      const BpmnJS = BpmnJSModule.default
      const modeler = new BpmnJS({
        container: containerRef.current as HTMLElement,
      })

      modeler.importXML(xml)
        .then(() => {
          modelerRef.current = modeler

          // Detectar alterações
          modeler.on("commandStack.changed", () => setModifiedXml(true))
        })
        .catch((err: any) => {
          console.error("Erro ao importar XML BPMN", err)
        })
    })

    return () => {
      isMounted = false
      modelerRef.current?.destroy?.()
    }
  }, [xml])

  const handleSave = async () => {
    if (!modelerRef.current) return
    const result = await modelerRef.current.saveXML({ format: true })
    onSave(result.xml)
  }

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {isEditable && (
          <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md flex items-center gap-2 text-sm">
            {isConnecting ? (
              <>
                <LinkIcon size={16} />
                Modo de conexão
              </>
            ) : (
              <>
                <Move size={16} />
                Modo de edição
              </>
            )}
          </div>
        )}

        <button
          onClick={handleZoomOut}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md"
          title="Diminuir Zoom"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={handleZoomIn}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md"
          title="Aumentar Zoom"
        >
          <ZoomIn size={20} />
        </button>

        {isEditable && modifiedXml && (
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Save size={18} />
            Salvar Alterações
          </button>
        )}
      </div>
      <div ref={containerRef} className="flex-1 h-full bg-white" />
    </div>
  )
}
