'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, firebaseConfigured } from '@/shared/utils/firebase'
import { AuthContext } from '@/shared/hooks/use-auth'

// Stub user used when Firebase is not configured (dev / no-.env mode)
const DEV_USER = { uid: 'dev', email: 'dev@local', displayName: 'مطوّر' } as unknown as User

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setUser(DEV_USER)
      setLoading(false)
      return
    }

    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  async function signOut() {
    if (auth) await firebaseSignOut(auth)
    else setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
