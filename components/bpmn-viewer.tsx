"use client"

import { useEffect, useRef, useState } from "react"
import BpmnAvatarOverlay from "./BpmnAvatarOverlay"
import NavigatedViewer from "bpmn-js/lib/NavigatedViewer"

interface BpmnViewerProps {
  xml: string
  onTaskClick?: (taskId: string, taskName: string) => void
}

export default function BpmnViewer({ xml, onTaskClick }: BpmnViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    let isMounted = true

    const initViewer = async () => {
      try {
        if (viewerRef.current) {
          viewerRef.current.destroy()
          viewerRef.current = null
        }

        if (containerRef.current) {
          viewerRef.current = new NavigatedViewer({
            container: containerRef.current,
            height: "100%",
            width: "100%",
          })

          try {
            await viewerRef.current.importXML(xml)
            const canvas = viewerRef.current.get("canvas")
            const elementRegistry = viewerRef.current.get("elementRegistry")

            // Ajustar o diagrama para caber na tela inicialmente
            canvas.zoom("fit-viewport", "auto")

            // Estilização por tipo de elemento
            elementRegistry.getAll().forEach((element: any) => {
              const type = element?.businessObject?.$type
              switch (type) {
                case "bpmn:StartEvent":
                  canvas.addMarker(element.id, "highlight-green")
                  break
                case "bpmn:EndEvent":
                  canvas.addMarker(element.id, "highlight-red")
                  break
                case "bpmn:Task":
                  canvas.addMarker(element.id, "highlight-blue")
                  break
                case "bpmn:ExclusiveGateway":
                  canvas.addMarker(element.id, "highlight-yellow")
                  break
              }
            })

            // Lidar com clique nas tarefas
            if (onTaskClick) {
              viewerRef.current.get("eventBus").on("element.click", function (e: any) {
                const bo = e.element?.businessObject
                if (bo && bo.$type === "bpmn:Task") {
                  onTaskClick(bo.id, bo.name || "")
                }
              })
            }

            if (isMounted) setIsLoaded(true)
          } catch (err) {
            console.error("Erro ao importar XML:", err)
          }
        }
      } catch (err) {
        console.error("Erro ao inicializar o viewer BPMN:", err)
      }
    }

    setIsLoaded(false)
    initViewer()

    return () => {
      isMounted = false
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [xml])

  return (
    <div className="relative w-full h-full">
      {/* Container do Diagrama */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Overlay com Avatar */}
      {isLoaded && viewerRef.current && (
        <BpmnAvatarOverlay
          modeler={viewerRef.current}
          taskId="Id_638789cd-a4f0-4fa8-9165-680794ff9779"
          imageUrl="https://randomuser.me/api/portraits/men/32.jpg"
        />
      )}

      {/* Loading Spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  )
}
