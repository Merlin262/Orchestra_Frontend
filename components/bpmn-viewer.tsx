"use client"

import { useEffect, useRef, useState } from "react"
import BpmnAvatarOverlay from './BpmnAvatarOverlay'
import BpmnJsViewer from "bpmn-js/lib/NavigatedViewer"

interface BpmnViewerProps {
  xml: string
}

export default function BpmnViewer({ xml }: BpmnViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let isMounted = true

    const initViewer = async () => {
      try {
        const BpmnJS = (await import("bpmn-js")).default

        if (viewerRef.current) {
          viewerRef.current.destroy()
          viewerRef.current = null
        }

        if (containerRef.current) {
          viewerRef.current = new BpmnJS({
            container: containerRef.current,
            height: "100%",
            width: "100%",
          })

          try {
            await viewerRef.current.importXML(xml)
            const canvas = viewerRef.current.get("canvas")
            const elementRegistry = viewerRef.current.get("elementRegistry")

            // Aplica zoom para ajustar à viewport
            canvas.zoom("fit-viewport", "auto")

            // Estilos customizados por tipo de elemento
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

            if (isMounted) setIsLoaded(true)
          } catch (err) {
            console.error("Erro ao importar XML:", err)
          }
        }
      } catch (err) {
        console.error("Erro ao carregar a biblioteca bpmn-js:", err)
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
      <div ref={containerRef} className="w-full h-full" />

      {isLoaded && viewerRef.current && (
        <BpmnAvatarOverlay
          modeler={viewerRef.current}
          taskId="Id_638789cd-a4f0-4fa8-9165-680794ff9779"
          imageUrl="https://randomuser.me/api/portraits/men/32.jpg"
        />
      )}

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  )
}
