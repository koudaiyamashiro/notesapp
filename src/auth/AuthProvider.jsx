import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  confirmResetPassword,
  confirmSignIn,
  confirmSignUp,
  fetchUserAttributes,
  getCurrentUser,
  resendSignUpCode,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from 'aws-amplify/auth'
import { ensureAmplifyConfigured } from '../lib/amplifyClient.js'

const AuthContext = createContext(null)

function normalizeUser(currentUser, attributes = {}) {
  const email = attributes?.email || currentUser?.signInDetails?.loginId || currentUser?.username || ''
  return {
    id: currentUser?.userId || currentUser?.username || email,
    email,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAmplifyReady, setIsAmplifyReady] = useState(false)
  const [configError, setConfigError] = useState('')

  const refreshCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      const attributes = await fetchUserAttributes().catch(() => ({}))
      setUser(normalizeUser(currentUser, attributes))
      return currentUser
    } catch {
      setUser(null)
      return null
    }
  }

  useEffect(() => {
    let active = true

    ;(async () => {
      const status = await ensureAmplifyConfigured()
      if (!active) return

      setIsAmplifyReady(Boolean(status?.ready))
      setConfigError(status?.error || '')

      if (status?.ready) {
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
    if (!isAmplifyReady) {
      throw new Error(configError || 'Amplify is not configured')
    }
    const result = await signIn({ username: email, password })
    if (result?.isSignedIn) {
      await refreshCurrentUser()
    }
    return result
  }

  const signUpWithEmail = async (email, password) => {
    if (!isAmplifyReady) {
      throw new Error(configError || 'Amplify is not configured')
    }
    return signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    })
  }

  const confirmSignUpCode = async (email, code) => {
    if (!isAmplifyReady) {
      throw new Error(configError || 'Amplify is not configured')
    }
    return confirmSignUp({
      username: email,
      confirmationCode: code,
    })
  }

  const resendSignUpConfirmationCode = async (email) => {
    if (!isAmplifyReady) {
      throw new Error(configError || 'Amplify is not configured')
    }
    return resendSignUpCode({ username: email })
  }

  const startResetPassword = async (email) => {
    if (!isAmplifyReady) {
      throw new Error(configError || 'Amplify is not configured')
    }
    return resetPassword({ username: email })
  }

  const submitResetPassword = async (email, code, newPassword) => {
    if (!isAmplifyReady) {
      throw new Error(configError || 'Amplify is not configured')
    }
    return confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    })
  }

  const signOutUser = async () => {
    await signOut()
    setUser(null)
  }

  const confirmNewPassword = async (newPassword) => {
    if (!isAmplifyReady) {
      throw new Error(configError || 'Amplify is not configured')
    }
    const result = await confirmSignIn({ challengeResponse: newPassword })
    if (result?.isSignedIn) {
      await refreshCurrentUser()
    }
    return result
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      isAmplifyReady,
      configError,
      signInWithEmail,
      signUpWithEmail,
      confirmSignUpCode,
      resendSignUpConfirmationCode,
      startResetPassword,
      submitResetPassword,
      confirmNewPassword,
      signOutUser,
      refreshCurrentUser,
    }),
    [user, loading, isAmplifyReady, configError]
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
