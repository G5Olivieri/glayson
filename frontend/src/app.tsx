import Bloguinho from "@app/bloguinho";
import Post from "@app/bloguinho/post";
import Financeiro from "@app/financeiro";
import NewTransaction from "@app/financeiro/new-transaction";
import UpdateTransaction from "@app/financeiro/update-transaction";
import Home from "@app/home";
import i18n from "@app/i18n";
import AuthProvider from "@app/login/auth-provider";
import Login from "@app/login/login";
import useAuth from "@app/login/use-auth";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";

function RequiredAuth({ children }: { children: JSX.Element }): JSX.Element {
  const auth = useAuth();
  if (auth.isLoading) return <div>Loading...</div>;
  if (!auth.isAuthenticated) return <Login />;
  return children;
}

export default function App() {
  useRegisterSW();

  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <RequiredAuth>
                  <Home />
                </RequiredAuth>
              }
            />
            <Route
              path="login"
              element={
                <RequiredAuth>
                  <Navigate to="/" />
                </RequiredAuth>
              }
            />
            <Route
              path="bloguinho"
              element={
                <RequiredAuth>
                  <Bloguinho />
                </RequiredAuth>
              }
            />
            <Route
              path="bloguinho/posts/:id"
              element={
                <RequiredAuth>
                  <Post />
                </RequiredAuth>
              }
            />
            <Route
              path="financeiro"
              element={
                <RequiredAuth>
                  <Financeiro />
                </RequiredAuth>
              }
            />
            <Route
              path="financeiro/new"
              element={
                <RequiredAuth>
                  <NewTransaction />
                </RequiredAuth>
              }
            />
            <Route
              path="financeiro/:id"
              element={
                <RequiredAuth>
                  <UpdateTransaction />
                </RequiredAuth>
              }
            />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </AuthProvider>
  );
}
