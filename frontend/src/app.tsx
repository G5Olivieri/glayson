import Bloguinho from "@app/bloguinho";
import Post from "@app/bloguinho/post";
import Financeiro from "@app/financeiro";
import NewExpense from "@app/financeiro/new-expense";
import UpdateExpense from "@app/financeiro/update-expense";
import Home from "@app/home";
import i18n from "@app/i18n";
import initSW from "@app/init-sw";
import Layout from "@app/layout";
import AuthProvider from "@app/login/auth-provider";
import Login from "@app/login/login";
import useAuth from "@app/login/use-auth";
import Vagabundo from "@app/vagabundo";
import NewTask from "@app/vagabundo/tasks/new-task";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";

function RequiredAuth({ children }: { children: JSX.Element }): JSX.Element {
  const auth = useAuth();
  if (auth.isLoading) return <div>Loading...</div>;
  if (!auth.isAuthenticated) return <Login />;
  return children;
}

export default function App() {
  const { updateServiceWorker } = useRegisterSW();

  if (process.env.NODE_ENV !== "development") {
    updateServiceWorker();
    initSW();
  }

  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <RequiredAuth>
                  <Layout />
                </RequiredAuth>
              }
            >
              <Route index element={<Home />} />
              <Route path="bloguinho" element={<Bloguinho />} />
              <Route path="bloguinho/posts/:id" element={<Post />} />
              <Route path="financeiro" element={<Financeiro />} />
              <Route path="financeiro/new" element={<NewExpense />} />
              <Route path="financeiro/:id" element={<UpdateExpense />} />
              <Route path="vagabundo" element={<Vagabundo />} />
              <Route path="vagabundo/new" element={<NewTask />} />
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </AuthProvider>
  );
}
