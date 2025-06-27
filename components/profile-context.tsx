"use client"

import { apiClient } from "@/lib/api-client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Profile =
  {
    Id: string
    UserName: string
    email: string
    FullName: string
    ProfileType: string
    Role: string
    IsActive: boolean
    CreatedAt: string
  }

interface ProfileContextType {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
  loading: boolean // Adicione o estado de loading aqui
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  async function validateProfile() {
    const savedProfile = localStorage.getItem("userProfile")
    const token = localStorage.getItem("token")
    if (savedProfile && token) {
      try {
        const res = await (apiClient as any).request("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.success && res.data) {
          const backendProfile = res.data
          const adaptedProfile = {
            Id: backendProfile.id,
            UserName: backendProfile.userName,
            email: backendProfile.email,
            FullName: backendProfile.fullName,
            ProfileType: backendProfile.profileType === 2 ? "ProcessManager" : String(backendProfile.profileType),
            Role: backendProfile.roles?.[0] ?? "",
            IsActive: backendProfile.isActive,
            CreatedAt: backendProfile.createdAt,
          }
          setProfile(adaptedProfile)
        } else {
          localStorage.removeItem("userProfile")
          localStorage.removeItem("token")
          setProfile(null)
        }
      } catch {
        setProfile(null)
      }
    } else {
      setProfile(null)
    }
    setLoading(false)
  }
  validateProfile()
}, [])


  useEffect(() => {
    if (!loading && profile) {
      localStorage.setItem("userProfile", JSON.stringify(profile))
    }
  }, [profile, loading])

  if (loading) return null

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
