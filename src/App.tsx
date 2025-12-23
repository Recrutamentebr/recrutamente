import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Vagas from "./pages/Vagas";
import VagaDetalhes from "./pages/VagaDetalhes";
import Candidatura from "./pages/Candidatura";
import Empresas from "./pages/Empresas";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NovaVaga from "./pages/NovaVaga";
import VagaCandidaturas from "./pages/VagaCandidaturas";
import EditarVaga from "./pages/EditarVaga";
import EditarPerfil from "./pages/EditarPerfil";
import ClienteLogin from "./pages/ClienteLogin";
import ClientePortal from "./pages/ClientePortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vagas" element={<Vagas />} />
            <Route path="/vagas/:slug" element={<VagaDetalhes />} />
            <Route path="/candidatura/:slug" element={<Candidatura />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/nova-vaga" element={<NovaVaga />} />
            <Route path="/dashboard/vagas/:id/candidaturas" element={<VagaCandidaturas />} />
            <Route path="/dashboard/vagas/:id/editar" element={<EditarVaga />} />
            <Route path="/dashboard/perfil" element={<EditarPerfil />} />
            <Route path="/cliente/login" element={<ClienteLogin />} />
            <Route path="/cliente" element={<ClientePortal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
