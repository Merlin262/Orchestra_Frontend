"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type ProfileType = "analista" | "colaborador"

interface ProfileContextType {
  profile: ProfileType
  setProfile: (profile: ProfileType) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileType>("analista")

  // Carregar perfil do localStorage na inicialização
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile") as ProfileType | null
    if (savedProfile && (savedProfile === "analista" || savedProfile === "colaborador")) {
      setProfile(savedProfile)
    }
  }, [])

  // Salvar perfil no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("userProfile", profile)
  }, [profile])

  return <ProfileContext.Provider value={{ profile, setProfile }}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
