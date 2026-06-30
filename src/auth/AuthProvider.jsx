import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, signIn, signOut } from 'aws-amplify/auth'
import { ensureAmplifyConfigured } from '../lib/amplifyClient.js'

const AuthContext = createContext(null)

function normalizeUser(currentUser) {
  const email = currentUser?.signInDetails?.loginId || currentUser?.username || ''
  return {
    id: currentUser?.userId || currentUser?.username || email,
    email,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAmplifyReady, setIsAmplifyReady] = useState(false)

  const refreshCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(normalizeUser(currentUser))
      return currentUser
    } catch {
      setUser(null)
      return null
    }
  }

  useEffect(() => {
    let active = true

    ;(async () => {
      const ready = await ensureAmplifyConfigured()
      if (!active) return

      setIsAmplifyReady(ready)
      if (ready) {
        await refreshCurrentUser()
      } else {
        setUser(null)
      }
      if (active) {
        setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [])

  const signInWithEmail = async (email, password) => {
    const result = await signIn({ username: email, password })
    if (result?.isSignedIn) {
      await refreshCurrentUser()
    }
    return result
  }

  const signOutUser = async () => {
    await signOut()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      isAmplifyReady,
      signInWithEmail,
      signOutUser,
      refreshCurrentUser,
    }),
    [user, loading, isAmplifyReady]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
