"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, User, Mail, Briefcase, Building, Shield, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UserType {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: string
  lastLogin: string
  avatar: string
  phone?: string
  joinDate?: string
  permissions?: string[]
}

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
  onSave: (user: UserType) => void
}

const roles = [
  "Administrador",
  "Analista de Processos",
  "Gerente",
  "Coordenador",
  "Colaborador",
  "Supervisor",
  "Diretor",
  "Consultor",
]

const allPermissions = [
  "Criar Processos",
  "Editar Processos",
  "Excluir Processos",
  "Visualizar Processos",
  "Executar Tarefas",
  "Aprovar Processos",
  "Visualizar Relatórios",
  "Gerenciar Usuários",
  "Gerenciar Equipe",
  "Configurar Sistema",
  "Exportar Dados",
  "Importar Dados",
]

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<UserType>({
    id: 0,
    name: "",
    email: "",
    role: "",
    department: "",
    status: "Ativo",
    lastLogin: "",
    avatar: "",
    phone: "",
    joinDate: "",
    permissions: [],
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        phone: user.phone || "",
        joinDate: user.joinDate || "2024-01-01",
        permissions: user.permissions || ["Visualizar Processos", "Executar Tarefas"],
      })
    }
  }, [user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.role) {
      newErrors.role = "Cargo é obrigatório"
    }

    if (!formData.department) {
      newErrors.department = "Departamento é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handleInputChange = (field: keyof UserType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handlePermissionToggle = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions?.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...(prev.permissions || []), permission],
    }))
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={formData.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {(formData.name || "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Editar Usuário</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="work">Trabalho</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <Label htmlFor="status" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Status
                    </Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                      <option value="Suspenso">Suspenso</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="work" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Cargo
                    </Label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      className={`w-full rounded-md border ${errors.role ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400`}
                    >
                      <option value="">Selecione um cargo</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="joinDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data de Ingresso
                  </Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => handleInputChange("joinDate", e.target.value)}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Informações Adicionais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Último Login:</span>
                      <span>{formData.lastLogin}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Status Atual:</span>
                      <Badge variant={formData.status === "Ativo" ? "default" : "secondary"}>{formData.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Permissões do Sistema</CardTitle>
                    <CardDescription>Selecione as permissões que este usuário deve ter no sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {allPermissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={formData.permissions?.includes(permission) || false}
                            onChange={() => handlePermissionToggle(permission)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Permissões Selecionadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {formData.permissions?.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {(!formData.permissions || formData.permissions.length === 0) && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma permissão selecionada</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditUserModal
