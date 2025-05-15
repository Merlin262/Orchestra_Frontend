"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ProcessDetails from "@/components/process-details"
import BpmnViewer from "@/components/bpmn-viewer"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

type Processo = {
  id: string
  name: string
  createdAt: string
  lastUpdate: string
  CreatedBy: string
  xml: string
}

const fetchProcessoById = async (id: string): Promise<Processo> => {
  const res = await fetch(`https://localhost:7073/api/Bpmn/${id}`)
  if (!res.ok) throw new Error("Erro ao buscar processo")
  const data = await res.json()
  // Adaptar os campos para o formato esperado pelo componente
  return {
    id: data.id,
    name: data.name,
    CreatedBy: data.CreatedBy,
    createdAt: data.createdAt,
    lastUpdate: data.lastUpdate,
    xml: data.xmlContent,
  }
}

export default function ProcessoDetailsPage({ params }: { params: { id: string } }) {
  const [processo, setProcesso] = useState<Processo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

    useEffect(() => {
    fetchProcessoById(params.id)
      .then(setProcesso)
      .catch(() => setError("Erro ao carregar processo"))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="p-6">Carregando...</div>
  if (error || !processo) return <div className="p-6 text-red-500">{error || "Processo não encontrado"}</div>


  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/processos" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{processo.name}</h1>
        </div>
        <Link
          href={`/processos/${params.id}`}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          <Edit size={18} />
          Editar Processo
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ProcessDetails processo={processo} />
        </div>
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Visualização do Diagrama</h2>
          </div>
          <div className="h-[600px]">
            <BpmnViewer xml={processo.xml} />
          </div>
        </div>
      </div>
    </div>
  )
}
