import { Calendar, User, Clock } from "lucide-react"

interface Processo {
  id: string
  name: string
  createdAt: string
  lastUpdate: string
  CreatedBy: string
  xml: string
}

interface ProcessDetailsProps {
  processo: Processo
}

export default function ProcessDetails({ processo }: ProcessDetailsProps) {
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Informações do Processo</h2>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nome</h3>
          <p className="text-gray-900 dark:text-gray-100">{processo.name}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Criado por</h3>
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400 dark:text-gray-500" />
            <p className="text-gray-900 dark:text-gray-100">{processo.CreatedBy}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Data de criação</h3>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
            <p className="text-gray-900 dark:text-gray-100">{formatarData(processo.createdAt)}</p>
          </div>
        </div>

        {processo.lastUpdate && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Última atualização</h3>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400 dark:text-gray-500" />
              <p className="text-gray-900 dark:text-gray-100">{formatarData(processo.lastUpdate)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">ID do Processo</span>
          <span className="text-sm font-mono bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 py-1 rounded">{processo.id}</span>
        </div>
      </div>
    </div>
  )
}
