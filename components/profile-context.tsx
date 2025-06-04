"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type ProfileType =
  {
    Id: string
    UserName: string
    Email: string
    FullName: string
    Role: string
    IsActive: number
    CreatedAt: string
    UserGroupId: number
  }

export const defaultProfile: ProfileType = {
  Id: "",
  UserName: "",
  Email: "",
  FullName: "",
  Role: "notLoggedIn",
  IsActive: 0,
  CreatedAt: "",
  UserGroupId: 0,
}

export const analystProfile: ProfileType = {
  Id: "0ABAB41F-3CE5-4B45-BF87-8EDD406A9AD3",
  UserName: "alicej",
  Email: "alice.johnson@example.com",
  FullName: "Alice Johnson",
  Role: "Analyst",
  IsActive: 0,
  CreatedAt: "2025-05-20 18:47:58.3500000",
  UserGroupId: 1,
}

export const developerProfile: ProfileType = {
  Id: "42A6FE9D-E922-4AC9-9BFF-C16880AC5C86",
  UserName: "mikeb",
  Email: "mike.brown@example.com",
  FullName: "Mike Brown",
  Role: "Developer",
  IsActive: 1,
  CreatedAt: "2025-05-20 18:47:58.3500000",
  UserGroupId: 2,
}

interface ProfileContextType {
  profile: ProfileType
  setProfile: (profile: ProfileType) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileType>(defaultProfile)
  const [loading, setLoading] = useState(true)

    useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch {
        setProfile(defaultProfile)
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("userProfile", JSON.stringify(profile))
    }
  }, [profile, loading])

  if (loading) return null

  return <ProfileContext.Provider value={{ profile, setProfile }}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
