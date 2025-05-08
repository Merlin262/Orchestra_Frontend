import Link from "next/link"
import { Plus, Upload } from "lucide-react"
import ProcessCard from "@/components/process-card"

// Dados de exemplo para processos
const processos = [
  { id: "1", nome: "Processo de Vendas", dataCriacao: "2023-10-15", ultimaModificacao: "2023-11-01" },
  { id: "2", nome: "Onboarding de Clientes", dataCriacao: "2023-09-22", ultimaModificacao: "2023-10-28" },
  { id: "3", nome: "Aprovação de Despesas", dataCriacao: "2023-11-05", ultimaModificacao: "2023-11-05" },
]

export default function ProcessosPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meus Processos</h1>
        <div className="flex gap-3">
          <Link
            href="/processos/novo"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Plus size={18} />
            Novo Processo
          </Link>
          <Link
            href="/processos/carregar"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Upload size={18} />
            Carregar Processo
          </Link>
        </div>
      </div>

      {processos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processos.map((processo) => (
            <ProcessCard key={processo.id} processo={processo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Você ainda não tem processos criados.</p>
          <Link
            href="/processos/novo"
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
