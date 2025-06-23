"use client"

import Link from "next/link"
import { Plus, Upload, BookOpen, Play } from "lucide-react"
import ProcessCard from "@/components/process-card"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfile } from "@/components/profile-context"
import { apiClient } from "@/lib/api-client"

type Processo = {
  id: string
  name: string
  createdAt: string
  lastUpdate: string
  fullName: string
  type?: "instancia" | "baseline"
  baselineId?: string
  status?: string
  versao: "1.0"
}

export default function ProcessosPage() {
  const [baselinesProcessos, setProcessos] = useState<Processo[]>([])
  const [instanciasProcessos, setInstanciasProcessos] = useState<Processo[]>([])
  const [loadingInstancias, setLoadingInstancias] = useState(true)
  const [errorInstancias, setErrorInstancias] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { profile } = useProfile()

  useEffect(() => {
    if (!profile?.Id) return

    setLoading(true)
    apiClient.get<Processo[]>(`/api/Bpmn/by-user/${profile.Id}`)
      .then(setProcessos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [profile])

  useEffect(() => {
    apiClient.get<any[]>("/api/BpmnProcessInstances")
      .then((data: any[]) => {
        const mapped = data.map((proc: any) => ({
          ...proc,
          tipo: proc.tipo ?? proc.type ?? "instancia",
          autor: proc.autor ?? proc.CreatedBy,
          responsavel: proc.responsavel ?? proc.Responsavel,
          versao: proc.versao ?? proc.Versao,
          status: proc.status ?? proc.Status,
        }))
        return mapped
      })
      .then(setInstanciasProcessos)
      .catch((err) => setErrorInstancias(err.message))
      .finally(() => setLoadingInstancias(false))
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meus Processos</h1>
        <div className="flex gap-3">
          <Link
            href="/processos/importar"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Upload size={18} />
            importar Processo
          </Link>
          {/* Botão para tela de versões */}
          <Link
            href="/processos/versions"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <BookOpen size={18} />
            Versões de Processos
          </Link>
        </div>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="todos" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            Todos
          </TabsTrigger>
          <TabsTrigger value="baselines" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            Baselines
          </TabsTrigger>
          <TabsTrigger value="instancias" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            Instâncias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          {/* Seção de Baselines */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <BookOpen size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Baselines de Processos</h2>
            </div>

            {baselinesProcessos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {baselinesProcessos.map((processo) => (
                  <ProcessCard key={processo.id} processo={processo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg mb-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhuma baseline de processo encontrada.</p>
              </div>
            )}
          </div>

          {/* Seção de Instâncias */}
          <div>
            <div className="flex items-center mb-4">
              <Play size={20} className="mr-2 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Instâncias de Processos</h2>
            </div>

            {instanciasProcessos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instanciasProcessos.map((processo) => (
                  <ProcessCard key={processo.id} processo={processo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhuma instância de processo encontrada.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="baselines">
          <div className="flex items-center mb-4">
            <BookOpen size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Baselines de Processos</h2>
          </div>

          {baselinesProcessos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {baselinesProcessos.map((processo) => (
                <ProcessCard key={processo.id} processo={processo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhuma baseline de processo encontrada.</p>
              <Link
                href="/processos/novo"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                <Plus size={18} />
                Criar Baseline
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="instancias">
          <div className="flex items-center mb-4">
            <Play size={20} className="mr-2 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Instâncias de Processos</h2>
          </div>

          {instanciasProcessos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instanciasProcessos.map((processo) => (
                <ProcessCard key={processo.id} processo={processo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhuma instância de processo encontrada.</p>
              <Link
                href="/processos/novo"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                <Plus size={18} />
                Criar Instância
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}