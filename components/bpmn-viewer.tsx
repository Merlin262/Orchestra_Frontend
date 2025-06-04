"use client"

import { useEffect, useRef, useState } from "react"
import BpmnAvatarOverlay from "./BpmnAvatarOverlay"
import NavigatedViewer from "bpmn-js/lib/NavigatedViewer"
import { Maximize2, Minimize2 } from "lucide-react"

interface BpmnViewerProps {
  xml: string
  onTaskClick?: (taskId: string, taskName: string) => void
  instanceTasks?: any[] // Adicione esta prop para receber as tasks da instância
}

export default function BpmnViewer({ xml, onTaskClick, instanceTasks = [] }: BpmnViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    let isMounted = true

    const initViewer = async () => {
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

          canvas.zoom("fit-viewport", "auto")

          // Mapeamento das tasks da instância para facilitar busca por xmlTaskId
          const statusByXmlTaskId: Record<string, number> = {}
          if (Array.isArray(instanceTasks)) {
            instanceTasks.forEach((t) => {
              if (t.xmlTaskId) statusByXmlTaskId[t.xmlTaskId] = t.statusId
            })
          }

          elementRegistry.getAll().forEach((element: any) => {
            const type = element?.businessObject?.$type
            // Se for uma task, verifica se existe status especial
            if (type === "bpmn:Task" && element.id && statusByXmlTaskId[element.id] !== undefined) {
              // Verde se statusId === 2, azul se statusId === 3, cinza caso contrário
              if (statusByXmlTaskId[element.id] === 2) {
                canvas.addMarker(element.id, "highlight-green")
              } else if (statusByXmlTaskId[element.id] === 3) {
                canvas.addMarker(element.id, "highlight-blue")
              } else {
                canvas.addMarker(element.id, "highlight-gray")
              }
            } else {
              // Mantém o comportamento padrão para outros elementos
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
            }
          })

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
  }, [xml, instanceTasks])

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      // Animação de entrada
      setAnimating(true)

      setTimeout(async () => {
        await wrapperRef.current?.requestFullscreen()
        setIsFullscreen(true)
        setAnimating(false)
      }, 200) // Delay curto para animação ocorrer antes do fullscreen
    } else {
      // Animação de saída (não visível devido ao comportamento do Fullscreen API)
      setIsFullscreen(false)
      await document.exitFullscreen()
    }
  }

  // Sair do fullscreen se o usuário pressionar ESC
  useEffect(() => {
    const handleExit = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener("fullscreenchange", handleExit)
    return () => {
      document.removeEventListener("fullscreenchange", handleExit)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full h-full border rounded-md overflow-hidden bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out
        ${animating ? "scale-[0.98] opacity-80" : "scale-100 opacity-100"}
        ${isFullscreen ? "fixed inset-0 z-50 h-screen w-screen rounded-none" : ""}
      `}
    >
      {/* Botão de tela cheia */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 z-10 p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title={isFullscreen ? "Sair do modo tela cheia" : "Expandir"}
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>

      {/* Container do Diagrama */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Overlay */}
      {isLoaded && viewerRef.current && (
        <BpmnAvatarOverlay
          modeler={viewerRef.current}
          taskId="Id_638789cd-a4f0-4fa8-9165-680794ff9779"
          imageUrl="https://randomuser.me/api/portraits/men/32.jpg"
        />
      )}

      {/* Spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
        </div>
      )}
    </div>
  )
}
