"use client"

import Link from "next/link"
import { FileEdit, Trash2, Calendar } from "lucide-react"

interface Processo {
  id: string
  nome: string
  dataCriacao: string
  ultimaModificacao: string
}

interface ProcessCardProps {
  processo: Processo
}

export default function ProcessCard({ processo }: ProcessCardProps) {
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{processo.nome}</h3>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar size={16} className="mr-1" />
          <span>Modificado em {formatarData(processo.ultimaModificacao)}</span>
        </div>

        <div className="flex justify-between mt-4">
          <Link
            href={`/processos/${processo.id}`}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            <FileEdit size={16} />
            Editar
          </Link>

          <button
            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium text-sm"
            onClick={() => confirm("Tem certeza que deseja excluir este processo?")}
          >
            <Trash2 size={16} />
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
