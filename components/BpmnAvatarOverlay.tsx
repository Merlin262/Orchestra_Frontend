"use client"

import { useEffect, useState } from "react"

interface BpmnAvatarOverlayProps {
  modeler: any
  taskId: string
  imageUrl: string
}

export default function BpmnAvatarOverlay({
  modeler,
  taskId,
  imageUrl
}: BpmnAvatarOverlayProps) {
  const [position, setPosition] = useState<{ x: number; y: number; width: number } | null>(null)

  useEffect(() => {
    if (!modeler || !taskId) return

    const elementRegistry = modeler.get("elementRegistry")
    const canvas = modeler.get("canvas")

    const element = elementRegistry.get(taskId)

    if (!element) {
      console.warn("Elemento não encontrado:", taskId)
      return
    }

    // Use getAbsoluteBBox para pegar a posição relativa à tela
    const bbox = canvas.getAbsoluteBBox(element)

    setPosition({
      x: bbox.x + bbox.width - 20, // ajusta o X (direita da tarefa)
      y: bbox.y - 10,              // ajusta o Y (acima da tarefa)
      width: 30                    // tamanho da imagem
    })
  }, [modeler, taskId])

  if (!position) return null

  return (
    <div
      className="absolute"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${position.width}px`,
        height: `${position.width}px`,
        pointerEvents: "none",
      }}
    >
      <img
        src={imageUrl}
        alt="avatar"
        className="rounded-full border-2 border-white shadow-md"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
