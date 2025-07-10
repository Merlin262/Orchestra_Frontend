"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowRight, Github, Chrome } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useProfile } from "@/components/profile-context"
import { apiClient } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"
import { useEffect } from "react"
import { ProfileTypeEnum } from "@/components/Enum/ProfileTypeEnum"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setProfile } = useProfile()
  const { profile } = useProfile()

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [registerForm, setRegisterForm] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileType: "",
    acceptTerms: false,
  })

  useEffect(() => {
    if (profile && profile.ProfileType) {
      if (profile.ProfileType === "ADM") {
        router.replace("/admin")
      } else if (profile.ProfileType === "ProcessManager") {
        router.replace("/processos")
      } else if (profile.ProfileType === "Employee") {
        router.replace("/my-tasks")
      } else {
        router.replace("/")
      }
    }
  }, [profile, router])

  // Função utilitária para extrair ProfileType do token JWT
  function getProfileTypeFromToken(token: string): string | undefined {
    try {
      const payload = token.split('.')[1]
      // Corrige padding do base64url
      let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4 !== 0) base64 += "=";
      const decodedStr = atob(base64)
      const decoded = JSON.parse(decodedStr)
      // Tenta diferentes variações de nome do campo
      const profileType = decoded.ProfileType || decoded.profileType || decoded.role || decoded.perfil || decoded.perfilType
      return profileType
    } catch (err) {
      return undefined
    }
  }

  // Função utilitária para extrair o payload decodificado inteiro do token JWT
  function getDecodedPayloadFromToken(token: string): any {
    try {
      const payload = token.split('.')[1]
      let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4 !== 0) base64 += "=";
      const decodedStr = atob(base64)
      return JSON.parse(decodedStr)
    } catch (err) {
      return {}
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Requisição real para o endpoint de login
      const response = await apiClient.post("/api/auth/login", {
        email: loginForm.email,
        password: loginForm.password,
      })
      // Resposta tem token na raiz, não em data
      const token = (response as { token: string }).token
      if (!token) {
        throw new Error("Token não encontrado na resposta do login.")
      }
      // Salvar token (exemplo: localStorage)
      localStorage.setItem("token", token)
      // Buscar perfil do usuário autenticado somente se houver token
      if (token) {
        try {
          const profileResponse = await (apiClient as any).request("/api/auth/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          })
          if (!profileResponse.ok) {
            // Se não autorizado ou não encontrado, trata como não logado
            if ([401, 403, 404].includes(profileResponse.status)) {
              localStorage.removeItem("userProfile")
              setProfile({
                Id: "",
                UserName: "",
                email: "",
                FullName: "",
                ProfileType: "",
                Role: "notLoggedIn",
                IsActive: false,
                CreatedAt: "", 
              })
              setIsLoading(false)
              toast({
                title: "Sessão expirada",
                description: "Faça login novamente.",
                variant: "destructive",
              })
              return
            }
            throw new Error("Erro ao buscar perfil do usuário.")
          }
          const userProfile = await profileResponse.json()
          const decoded = getDecodedPayloadFromToken(token)
          // Mescla o perfil retornado com o payload do token, priorizando dados do backend
          const mergedProfile = { ...decoded, ...userProfile }
          localStorage.setItem("userProfile", JSON.stringify(mergedProfile))
          setProfile(mergedProfile)
        } catch (profileErr) {
          // fallback: salva o payload decodificado completo do token
          const decoded = getDecodedPayloadFromToken(token)
          localStorage.setItem("userProfile", JSON.stringify(decoded))
          setProfile(decoded)
        }
      }
      // Extrai o tipo de perfil do token
      const profileType = getProfileTypeFromToken(token)
      // Redireciona para admin se for ADM, senão para home
      setIsLoading(false)
      if (profileType === "ADM") {
        router.push("/admin")
      } else if (profileType === "ProcessManager") {
        router.push("/processos")
      } else if (profileType === "Employee") {
        router.push("/my-tasks")
      } else {
        router.push("/")
      }
    } catch (error: any) {
      setIsLoading(false)
      toast({
        title: "Erro ao fazer login",
        description: error?.message || "Credenciais inválidas.",
        variant: "destructive",
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }    try {
      // Mapear string para valor numérico do enum ProfileTypeEnum
      const profileTypeMap: Record<string, number> = {
        "IT": 1,
        "ProcessManager": 2,
        "Employee": 3,
        "ADM": 4
      }
      
      const dto = {
        UserName: registerForm.fullName,
        FullName: registerForm.fullName,
        Email: registerForm.email,
        Password: registerForm.password,
        ProfileType: profileTypeMap[registerForm.profileType],
      }
      const response = await apiClient.post("/api/auth/register", dto)
      toast({
        title: "Sucesso",
        description: "Usuário registrado com sucesso.",
      })
      // Redirecionar ou logar usuário
      setTimeout(() => {
        router.push("/auth")
      }, 1000)
    } catch (error: any) {
      toast({
        title: "Erro ao registrar",
        description: error?.message || "Não foi possível registrar o usuário.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-primary-foreground rounded-sm"></div>
          </div>
          <h1 className="text-2xl font-bold">Orchestra</h1>
          <p className="text-muted-foreground">Gerencie seus processos de negócio</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
                <CardDescription>Entre com suas credenciais para acessar sua conta</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={loginForm.rememberMe}
                        onCheckedChange={(checked) => setLoginForm({ ...loginForm, rememberMe: checked as boolean })}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Lembrar-me
                      </Label>
                    </div>
                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                      Esqueci minha senha
                    </Link>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Entrar</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <Button variant="outline" className="w-full">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Chrome className="h-4 w-4 mr-2" />
                      Google
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Criar conta</CardTitle>
                <CardDescription>Preencha os dados abaixo para criar sua conta</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Seu Nome completo"
                        className="pl-10"
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profileType">Tipo de perfil</Label>
                    <Select
                      value={registerForm.profileType}
                      onValueChange={(value) => setRegisterForm({ ...registerForm, profileType: value })}
                      required
                    >
                      <SelectTrigger id="profileType">
                        <SelectValue placeholder="Selecione o tipo de perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">TI</SelectItem>
                        <SelectItem value="ProcessManager">Gerente de Processos</SelectItem>
                        <SelectItem value="Employee">Funcionário</SelectItem>
                        <SelectItem value="ADM">ADM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        <span>Criando conta...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Criar conta</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Ou cadastre-se com</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <Button variant="outline" className="w-full">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Chrome className="h-4 w-4 mr-2" />
                      Google
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 Orchestra. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
