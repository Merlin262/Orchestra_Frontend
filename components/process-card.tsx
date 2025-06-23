"use client"

import Link from "next/link"
import { FileEdit, Trash2, Calendar, Eye, BookOpen, Play, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"

interface Processo {
  id: string
  name: string
  createdAt: string
  lastUpdate: string
  tipo?: "baseline" | "instancia"
  version?: string
  createdByUserName?: string
  baselineId?: string
  status?: string
  responsavel?: string
}

interface ProcessCardProps {
  processo: Processo
  onDelete?: (id: string) => void
}

export default function ProcessCard({ processo }: ProcessCardProps) {
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  const isBaseline = processo.tipo === "baseline" || !processo.tipo

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{processo.name}</h3>
          <Badge
            variant="outline"
            className={`${
              isBaseline
                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
            }`}
          >
            {isBaseline ? (
              <>
                <BookOpen size={14} className="mr-1" /> Baseline
              </>
            ) : (
              <>
                <Play size={14} className="mr-1" /> Instância
              </>
            )}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar size={16} className="mr-1" />
          {processo.lastUpdate
            ? <span>Modificado em {formatarData(processo.lastUpdate)}</span>
            : <span>Criado em {formatarData(processo.createdAt)}</span>
          }
        </div>

        <div className="mb-4 text-sm">
          {isBaseline && processo.version && (
            <div className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Versão:</span> {processo.version}
            </div>
          )}

          {isBaseline && processo.createdByUserName && (
            <div className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Autor:</span> {processo.createdByUserName}
            </div>
          )}

          {!isBaseline && processo.status && (
            <div className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Status:</span> {processo.status}
            </div>
          )}

          {!isBaseline && processo.responsavel && (
            <div className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Responsável:</span> {processo.responsavel}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <div className="flex gap-3">
            <Link
              href={`/processos/${processo.id}`}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              <FileEdit size={16} />
              Editar
            </Link>

            {isBaseline ? (
              <Link
                href={`/processos/${processo.id}`}
                className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 font-medium text-sm"
              >
                <Eye size={16} />
                Visualizar
              </Link>
            ) : (
              <Link
                href={`/processos/instance/${processo.id}`}
                className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 font-medium text-sm"
              >
                <Eye size={16} />
                Visualizar
              </Link>
            )}

            {isBaseline && (
              <button
                className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium text-sm"
                onClick={async () => {
                  try {
                    await apiClient.post(`/api/BpmnProcessInstances/CreateFromBaseline/${processo.id}`);
                    alert("Instância de processo criada com sucesso!");
                    window.location.reload();
                  } catch (error) {
                    alert("Erro ao criar instância de processo.");
                  }
                }}
                type="button"
              >
                <Copy size={16} />
                Criar Instância
              </button>
            )}
          </div>

          <button
            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium text-sm"
            onClick={async () => {
              if (confirm("Tem certeza que deseja excluir este processo?")) {
                try {
                  await apiClient.delete(`/api/bpmn/${processo.id}`);
                  window.location.reload();
                } catch (error) {
                  alert("Erro ao excluir o processo.");
                }
              }
            }}
          >
            <Trash2 size={16} />
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}