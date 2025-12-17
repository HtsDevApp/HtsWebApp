import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import FormularioCaso from "./pages/shared/FormularioCaso";
import Encuesta from "./pages/shared/Encuesta";

// Pages
import Login from "./pages/Login";
// Admin
import AdminHome from "./pages/admin/AdminHome";
import Companies from "./pages/admin/Companies";
import Users from "./pages/admin/Users";
import Content from "./pages/admin/Content";
// User Dashboards
import CongeladosDashboard from "./pages/dashboard/CongeladosDashboard";
import GenericDashboard from "./pages/dashboard/GenericDashboard";
import ContentList from "./pages/shared/ContentList";
import ContentView from "./pages/shared/ContentView";

// Components
import AdminRoute from "./components/AdminRoute";

// --- HELPERS ---

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// THE DISPATCHER: This replaces your Spring Boot HomeController logic
function DashboardDispatcher() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;

  const companyName = user.empresa_nombre;

  if (companyName === "Congelados") return <Navigate to="/dashboard/congelados" replace />;

  return <Navigate to="/dashboard/generic" replace />;
}

// Wrapper for Public Route (Login)
function PublicRouteWrapper() {
  const { user } = useAuth();
  if (user) return <DashboardDispatcher />;
  return <Login />;
}

// --- MAIN APP ---

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<PublicRouteWrapper />} />

          {/* Root Redirects to Dispatcher */}
          <Route path="/" element={<DashboardDispatcher />} />

          {/* --- ADMIN ROUTES --- */}
          <Route path="/admin" element={<AdminRoute><AdminHome /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/admin/companies" element={<AdminRoute><Companies /></AdminRoute>} />
          <Route path="/admin/content" element={<AdminRoute><Content /></AdminRoute>} />

          {/* --- USER DASHBOARD ROUTES (Manual Additions) --- */}

          {/* 1. Congelados */}
          <Route path="/dashboard/congelados" element={
            <ProtectedRoute>
              {/* Optional: Add extra check to ensure only Congelados users are here */}
              <CongeladosDashboard />
            </ProtectedRoute>
          } />

          {/* 2. Generic / Fallback */}
          <Route path="/dashboard/generic" element={
            <ProtectedRoute>
              <GenericDashboard />
            </ProtectedRoute>
          } />

          <Route path="/formulario-caso" element={
            <ProtectedRoute>
              <FormularioCaso />
            </ProtectedRoute>
          } />

          <Route path="/encuesta" element={
            <ProtectedRoute>
              <Encuesta />
            </ProtectedRoute>
          } />

          {/* List of articles */}
          <Route path="/contents" element={
            <ProtectedRoute>
              <ContentList />
            </ProtectedRoute>
          } />

          {/* Single article viewer (Slug parameter) */}
          <Route path="/contents/:slug" element={
            <ProtectedRoute>
              <ContentView />
            </ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}