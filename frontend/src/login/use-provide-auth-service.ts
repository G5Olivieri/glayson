import { AuthService } from "@app/login/auth-service"
import { Credential } from "@app/login/credential"
import { useEffect, useState } from "react"

type AccessTokenType = {
  access_token: string
  refresh_token: string
  expires_in: number
}

export const useProvideAuthService = (): AuthService => {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState('')

  const signin = async (credential: Credential) => {

    const response = await fetch(`${baseUrl}/api/auth/token`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'password',
        ...credential,
      })
    })
    const body = await response.json() as AccessTokenType
    setToken(body.access_token, body.refresh_token, body.expires_in)
  }

  const signout = async () => {
    const access_token = localStorage.getItem('access_token')
    if (access_token) {
      await fetch(`${baseUrl}/api/auth/token/invalidate`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ access_token }),
      });
      clearToken()
    }
  }

  const clearToken = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('expired_at')
    setAccessToken('')
    setIsAuthenticated(false)
    setIsLoading(false)
  }

  const setToken = (access_token: string, refresh_token: string, expires_in: number) => {
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    localStorage.setItem('expired_at', (new Date().getTime() + expires_in).toString())
    setAccessToken(access_token)
    setIsAuthenticated(true)
    setIsLoading(false)
  }

  const refreshToken = async () => {
    const access_token = localStorage.getItem('access_token')
    const refresh_token = localStorage.getItem('refresh_token')
    if (!access_token || !refresh_token) {
      return
    }

    try {
      const response = await fetch(`${baseUrl}/api/auth/token`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          access_token,
          refresh_token,
        })
      }).then(res => res.json()) as AccessTokenType
      setToken(response.access_token, response.refresh_token, response.expires_in)
    } catch (e) {
      clearToken()
    }
  }

  useEffect(() => {
    const access_token = localStorage.getItem('access_token')
    if (access_token) {
      fetch(`${baseUrl}/api/auth/token/check`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ access_token })
      }).then((response) => {
        if (response.ok) {
          setAccessToken(access_token)
          setIsAuthenticated(true)
          setIsLoading(false)
        } else {
          return refreshToken()
        }
      })
      return
    }
    clearToken()
  }, [])

  return {
    isLoading,
    isAuthenticated,
    accessToken,
    signin,
    signout,
  }
}
