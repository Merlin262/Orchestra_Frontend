"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, UserPlus, Edit, Trash2, Search, Filter, MoreHorizontal, Shield, Settings, Group } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useProfile } from "@/components/profile-context"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import EditUserModal from "@/components/edit-user-modal"
import CreateUserModal from "@/components/create-user-modal"
import { ProfileTypeEnum } from "@/components/Enum/ProfileTypeEnum"

// Definição do tipo para usuário retornado pela API
interface ApiUser {
  id: string | number
  fullName: string
  email: string
  roles: string[]
  department?: string
  isActive?: boolean
  lastLogin?: string
  avatar?: string
}

interface Group {
  id: string | number
  role: string
  members: number
  description?: string
}

export default function AdminPage() {
  const { profile } = useProfile()
  const router = useRouter()

  const [users, setUsers] = useState<ApiUser[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("users")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      if (!loading && (!profile || profile.ProfileType !== "ADM")) {
        router.replace("/auth")
      }
    }, [profile, loading, router])

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await apiClient.get<any[]>("/api/Users/Roles")
        // Mapeia os dados para o formato esperado
        const mappedGroups = res.map((roleObj, idx) => ({
          id: idx + 1,
          role: roleObj.role,
          members: roleObj.count,
          description: `Grupo de usuários com o papel "${roleObj.role}"`,
        }))
        setGroups(mappedGroups)
      } catch (err) {
        setGroups([])
      }
    }
    fetchGroups()
  }, [])

  // Busca usuários da API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await apiClient.get<any>(`/api/Users?pageNumber=1&pageSize=10`)
        setUsers(res.items)
        setTotalUsers(res.totalItems)
      } catch (err) {
        setUsers([])
        setTotalUsers(0)
      }
    }
    fetchUsers()
  }, [])

  // Redireciona se não for admin, usando useEffect
  useEffect(() => {
    if (!loading && (!profile || profile.ProfileType !== "ADM")) {
      router.replace("/auth")
    }
  }, [profile, loading, router])

  // Mostra loading enquanto o profile está sendo carregado
  if (typeof profile === "undefined") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-bold text-gray-500">Carregando...</h2>
      </div>
    )
  }

  console.log("Perfil do usuário adm:", profile)
  if ((!profile || profile.ProfileType !== ProfileTypeEnum.ADM.toString()) && profile?.ProfileType !== "ADM") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-bold text-red-500">Acesso restrito: apenas administradores podem acessar esta página.</h2>
      </div>
    )
  }

  const handleEditUser = (user: ApiUser) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleSaveUser = (updatedUser: ApiUser) => {
    // Here you would typically make an API call to update the user
    //console.log("Saving user:", updatedUser)
    // For demo purposes, we'll just log it
    // In a real app, you'd update the users array or refetch data
  }

  const handleCreateUser = (newUser: any) => {
    // Here you would typically make an API call to create the user
    //console.log("Creating user:", newUser)
    // For demo purposes, we'll just log it
    // In a real app, you'd add to the mockUsers array or refetch data
  }

  // Filtro de busca
  const filteredUsers = Array.isArray(users) ? users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase()),
  ) : []

  const filteredGroups = groups.filter(
  (group) => {
    return (
      group.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }
)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Card com informações do usuário logado */}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administração</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
          <Button variant="outline">
            <Group className="h-4 w-4 mr-2" />
            Novo Grupo
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários ou grupos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="groups">Grupos</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>Visualize e gerencie todos os usuários do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Cargos</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.fullName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.roles?.join(', ')}</TableCell>
                      <TableCell>{user.department || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Ativo" : "Inativo"}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{group.role}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{group.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Membros:</span>
                    <Badge variant="outline" className="flex items-center justify-center min-w-8">{group.members}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de edição de usuário */}
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={selectedUser as any}
        onSave={(user) => handleSaveUser(user as unknown as ApiUser)}
      />
      {/* Modal de criação de usuário */}
      <CreateUserModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateUser}
      />
    </div>
  )
}
