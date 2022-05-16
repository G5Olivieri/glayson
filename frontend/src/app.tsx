import { Bloguinho } from '@app/bloguinho'
import { Financeiro } from '@app/financeiro'
import { NewTransaction } from '@app/financeiro/new-transaction'
import { UpdateTransaction } from '@app/financeiro/update-transaction'
import { Home } from '@app/home'
import i18n from '@app/i18n'
import { AuthProvider } from '@app/login/auth-provider'
import { Login } from '@app/login/login'
import { useAuth } from '@app/login/use-auth'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

const RequiredAuth = ({ children }: { children: JSX.Element }): JSX.Element => {
  const auth = useAuth()
  if (auth.isLoading) return <div>Loading...</div>
  if (!auth.isAuthenticated) return <Login />
  return children
}

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <RequiredAuth>
                <Home />
              </RequiredAuth>
            } />
            <Route path="login" element={
              <RequiredAuth>
                <Navigate to="/" />
              </RequiredAuth>
            } />
            <Route path="bloguinho" element={
              <RequiredAuth>
                <Bloguinho />
              </RequiredAuth>
            } />
            <Route path="financeiro" element={
              <RequiredAuth>
                <Navigate to="/financeiro/transactions" />
              </RequiredAuth>
            } />
            <Route path="financeiro/transactions" element={
              <RequiredAuth>
                <Financeiro />
              </RequiredAuth>
            } />
            <Route path="financeiro/transactions/new" element={
              <RequiredAuth>
                <NewTransaction />
              </RequiredAuth>
            } />
            <Route path="financeiro/transactions/:id" element={
              <RequiredAuth>
                <UpdateTransaction />
              </RequiredAuth>
            } />
            <Route path='*' element={<div>404 Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </AuthProvider>
  )
}
