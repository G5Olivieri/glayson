import { useContext } from 'react'
import { AuthContext } from '@app/login/auth-context'

export const useAuth = () => useContext(AuthContext)
