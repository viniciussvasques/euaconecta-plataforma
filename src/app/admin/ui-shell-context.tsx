'use client'

import React, { createContext, useContext, useState } from 'react'

interface ShellContextValue {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const ShellContext = createContext<ShellContextValue | undefined>(undefined)

export function useShell() {
  const ctx = useContext(ShellContext)
  if (!ctx) throw new Error('useShell must be used within ShellProvider')
  return ctx
}

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <ShellContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </ShellContext.Provider>
  )
}

