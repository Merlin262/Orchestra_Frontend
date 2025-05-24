"use client"

import Link from "next/link"
import { Plus, Upload } from "lucide-react"
import ProcessCard from "@/components/process-card"
import { useEffect, useState } from "react"

type Processo = {
  id: string
  name: string
  createdAt: string
  lastUpdate: string
  CreatedBy: string
}

export default function ProcessosPage() {
  const [processos, setProcessos] = useState<Processo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("https://localhost:7073/api/Bpmn")
      .then(async (res) => {
        console.log(res)
        if (!res.ok) throw new Error("Erro ao buscar processos")
        return res.json()
      })
      .then(setProcessos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meus Processos</h1>
        <div className="flex gap-3">
          <Link
            href="/processos/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Plus size={18} />
            Novo Processo
          </Link>
          <Link
            href="/processos/importar"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Upload size={18} />
            importar Processo
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">Carregando...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : processos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processos.map((processo) => (
            <ProcessCard key={processo.id} processo={processo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Você ainda não tem processos criados.</p>
          <Link
            href="/processos/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Plus size={18} />
            Criar Primeiro Processo
          </Link>
        </div>
      )}
    </div>
  )
}