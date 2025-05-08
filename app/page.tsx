import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">Modelagem de Processos BPMN</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Crie, edite e gerencie seus diagramas de processos de negócio de forma simples e eficiente.
        </p>
        <div className="pt-6">
          <Link
            href="/processos"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Começar
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}
