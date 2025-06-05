"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  GitBranch,
  User,
  Eye,
  Edit,
  Archive,
  Copy,
  Play,
  BookOpen,
  Calendar,
  MoreHorizontal,
  GitCompare,
  Download,
  Star,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Dados de exemplo para versões
const processVersions = {
  baseline: [
    {
      id: "v1.0",
      version: "1.0",
      type: "baseline",
      title: "Processo de Aprovação de Despesas",
      description: "Versão inicial do processo",
      author: "Ana Silva",
      createdAt: "2024-01-15",
      status: "archived",
      changes: "Criação inicial do processo",
      instances: 12,
    },
    {
      id: "v1.1",
      version: "1.1",
      type: "baseline",
      title: "Processo de Aprovação de Despesas",
      description: "Correção de bugs e melhorias",
      author: "Carlos Santos",
      createdAt: "2024-02-10",
      status: "archived",
      changes: "Correção no fluxo de aprovação, adição de validações",
      instances: 8,
    },
    {
      id: "v2.0",
      version: "2.0",
      type: "baseline",
      title: "Processo de Aprovação de Despesas",
      description: "Reformulação completa do processo",
      author: "Maria Oliveira",
      createdAt: "2024-03-05",
      status: "active",
      changes: "Nova interface, automação de aprovações, integração com sistema financeiro",
      instances: 25,
    },
    {
      id: "v2.1",
      version: "2.1",
      type: "baseline",
      title: "Processo de Aprovação de Despesas",
      description: "Melhorias de performance",
      author: "João Costa",
      createdAt: "2024-03-20",
      status: "draft",
      changes: "Otimização de consultas, melhoria na interface mobile",
      instances: 0,
    },
  ],
  instances: [
    {
      id: "inst-001",
      name: "Aprovação Despesas - Marketing Q1",
      baselineVersion: "2.0",
      responsible: "Pedro Lima",
      createdAt: "2024-03-10",
      status: "active",
      priority: "high",
      participants: 5,
      completedTasks: 8,
      totalTasks: 12,
    },
    {
      id: "inst-002",
      name: "Aprovação Despesas - TI Infraestrutura",
      baselineVersion: "2.0",
      responsible: "Ana Costa",
      createdAt: "2024-03-12",
      status: "completed",
      priority: "medium",
      participants: 3,
      completedTasks: 10,
      totalTasks: 10,
    },
    {
      id: "inst-003",
      name: "Aprovação Despesas - RH Treinamentos",
      baselineVersion: "1.1",
      responsible: "Carlos Silva",
      createdAt: "2024-03-15",
      status: "paused",
      priority: "low",
      participants: 4,
      completedTasks: 3,
      totalTasks: 8,
    },
  ],
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "archived":
      return "bg-gray-500"
    case "draft":
      return "bg-yellow-500"
    case "completed":
      return "bg-blue-500"
    case "paused":
      return "bg-orange-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Ativa"
    case "archived":
      return "Arquivada"
    case "draft":
      return "Rascunho"
    case "completed":
      return "Concluída"
    case "paused":
      return "Pausada"
    default:
      return status
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500"
    case "medium":
      return "bg-yellow-500"
    case "low":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

export default function ProcessVersionsPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])
  const [compareMode, setCompareMode] = useState(false)

  const handleVersionSelect = (versionId: string) => {
    if (compareMode) {
      if (selectedVersions.includes(versionId)) {
        setSelectedVersions(selectedVersions.filter((id) => id !== versionId))
      } else if (selectedVersions.length < 2) {
        setSelectedVersions([...selectedVersions, versionId])
      }
    }
  }

  const allVersions = [...processVersions.baseline, ...processVersions.instances]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Versões do Processo</h1>
            <p className="text-muted-foreground">Processo de Aprovação de Despesas</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={compareMode ? "default" : "outline"}
            onClick={() => {
              setCompareMode(!compareMode)
              setSelectedVersions([])
            }}
            className="flex items-center space-x-2"
          >
            <GitCompare className="h-4 w-4" />
            <span>Comparar</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Copy className="h-4 w-4" />
            <span>Nova Versão</span>
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Baselines</p>
                <p className="text-2xl font-bold">{processVersions.baseline.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Instâncias</p>
                <p className="text-2xl font-bold">{processVersions.instances.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Versão Ativa</p>
                <p className="text-lg font-bold">v2.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Instâncias</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modo de Comparação */}
      {compareMode && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitCompare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Modo de Comparação Ativo</span>
                <Badge variant="secondary">{selectedVersions.length}/2 selecionadas</Badge>
              </div>
              {selectedVersions.length === 2 && <Button size="sm">Comparar Versões</Button>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas as Versões</TabsTrigger>
          <TabsTrigger value="baselines">Baselines</TabsTrigger>
          <TabsTrigger value="instances">Instâncias</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {/* Timeline de Baselines */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Baselines</span>
              </h3>
              <div className="space-y-4">
                {processVersions.baseline.map((version, index) => (
                  <Card
                    key={version.id}
                    className={`transition-all ${
                      compareMode && selectedVersions.includes(version.id) ? "ring-2 ring-blue-500" : ""
                    } ${compareMode ? "cursor-pointer hover:shadow-md" : ""}`}
                    onClick={() => handleVersionSelect(version.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(version.status)}`} />
                            {index < processVersions.baseline.length - 1 && (
                              <div className="w-px h-16 bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">v{version.version}</Badge>
                              <Badge variant="secondary">{getStatusText(version.status)}</Badge>
                              {version.status === "active" && <Badge className="bg-green-500">Ativa</Badge>}
                            </div>
                            <h4 className="font-semibold">{version.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{version.description}</p>
                            <p className="text-sm text-muted-foreground mb-3">{version.changes}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{version.author}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(version.createdAt).toLocaleDateString("pt-BR")}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Play className="h-4 w-4" />
                                <span>{version.instances} instâncias</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Exportar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Arquivar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Instâncias */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Instâncias Ativas</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processVersions.instances.map((instance) => (
                  <Card key={instance.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(instance.status)}`} />
                          <Badge variant="outline">v{instance.baselineVersion}</Badge>
                        </div>
                        <Badge className={getPriorityColor(instance.priority)}>
                          {instance.priority === "high" ? "Alta" : instance.priority === "medium" ? "Média" : "Baixa"}
                        </Badge>
                      </div>
                      <h4 className="font-semibold mb-2">{instance.name}</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{instance.responsible}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(instance.createdAt).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Progresso:</span>
                          <span>
                            {instance.completedTasks}/{instance.totalTasks}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(instance.completedTasks / instance.totalTasks) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="baselines">
          <div className="space-y-4">
            {processVersions.baseline.map((version, index) => (
              <Card key={version.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(version.status)}`} />
                        {index < processVersions.baseline.length - 1 && <div className="w-px h-16 bg-border mt-2" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">v{version.version}</Badge>
                          <Badge variant="secondary">{getStatusText(version.status)}</Badge>
                          {version.status === "active" && <Badge className="bg-green-500">Ativa</Badge>}
                        </div>
                        <h4 className="font-semibold">{version.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{version.description}</p>
                        <p className="text-sm text-muted-foreground mb-3">{version.changes}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{version.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(version.createdAt).toLocaleDateString("pt-BR")}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Play className="h-4 w-4" />
                            <span>{version.instances} instâncias</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="instances">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processVersions.instances.map((instance) => (
              <Card key={instance.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(instance.status)}`} />
                      <Badge variant="outline">v{instance.baselineVersion}</Badge>
                    </div>
                    <Badge className={getPriorityColor(instance.priority)}>
                      {instance.priority === "high" ? "Alta" : instance.priority === "medium" ? "Média" : "Baixa"}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-2">{instance.name}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{instance.responsible}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(instance.createdAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Progresso:</span>
                      <span>
                        {instance.completedTasks}/{instance.totalTasks}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(instance.completedTasks / instance.totalTasks) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Pausar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
