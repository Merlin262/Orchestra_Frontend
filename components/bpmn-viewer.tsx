"use client"

import { useEffect, useRef } from "react"

interface BpmnViewerProps {
  xml: string
}

export default function BpmnViewer({ xml }: BpmnViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)

  useEffect(() => {
    // Importação dinâmica da biblioteca bpmn-js
    const initViewer = async () => {
      try {
        // Importação dinâmica para evitar problemas de SSR
        const BpmnJS = (await import("bpmn-js")).default

        // Criar uma nova instância do visualizador BPMN
        if (!viewerRef.current && containerRef.current) {
          viewerRef.current = new BpmnJS({
            container: containerRef.current,
            height: "100%",
            width: "100%",
          })

          // Importar o XML do diagrama BPMN
          try {
            await viewerRef.current.importXML(xml)

            // Ajustar o zoom para exibir todo o diagrama
            viewerRef.current.get("canvas").zoom("fit-viewport", "auto")
          } catch (err) {
            console.error("Erro ao importar XML:", err)
          }
        }
      } catch (err) {
        console.error("Erro ao carregar a biblioteca bpmn-js:", err)
      }
    }

    initViewer()

    // Limpeza ao desmontar o componente
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [xml])

  return (
    <div ref={containerRef} className="w-full h-full">
      {/* O visualizador BPMN será renderizado aqui */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    </div>
  )
}
