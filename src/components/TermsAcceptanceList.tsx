import { useState, useEffect } from "react";
import { Loader2, FileText, Calendar, Globe, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TermAcceptance {
  id: string;
  client_user_id: string;
  client_email?: string;
  accepted_at: string;
  ip_address: string | null;
  term_version: string;
  term_text: string;
}

interface TermsAcceptanceListProps {
  companyId: string;
}

const TermsAcceptanceList = ({ companyId }: TermsAcceptanceListProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [acceptances, setAcceptances] = useState<TermAcceptance[]>([]);

  useEffect(() => {
    fetchAcceptances();
  }, [companyId]);

  const fetchAcceptances = async () => {
    try {
      const { data, error } = await supabase
        .from("client_terms_acceptance")
        .select("*")
        .eq("company_id", companyId)
        .order("accepted_at", { ascending: false });

      if (error) throw error;

      // Fetch client emails from client_company_access
      const acceptancesWithEmails = await Promise.all(
        (data || []).map(async (acceptance) => {
          const { data: accessData } = await supabase
            .from("client_company_access")
            .select("client_email")
            .eq("client_user_id", acceptance.client_user_id)
            .eq("company_id", companyId)
            .single();

          return {
            ...acceptance,
            client_email: accessData?.client_email || "Email não disponível",
          };
        })
      );

      setAcceptances(acceptancesWithEmails);
    } catch (error) {
      console.error("Error fetching acceptances:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os aceites.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Aceites de Termos</h2>
        <p className="text-muted-foreground text-sm">
          Registro dos termos aceitos pelos clientes
        </p>
      </div>

      {acceptances.length > 0 ? (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Data do Aceite</TableHead>
                <TableHead>Versão</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acceptances.map((acceptance) => (
                <TableRow key={acceptance.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-muted-foreground" />
                      <span className="font-medium">{acceptance.client_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-muted-foreground" />
                      {formatDate(acceptance.accepted_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                      v{acceptance.term_version}
                    </span>
                  </TableCell>
                  <TableCell>
                    {acceptance.ip_address ? (
                      <div className="flex items-center gap-2">
                        <Globe size={16} className="text-muted-foreground" />
                        {acceptance.ip_address}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <FileText className="mx-auto text-muted-foreground mb-4" size={48} />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum aceite registrado
          </h3>
          <p className="text-muted-foreground">
            Os aceites de termos dos clientes aparecerão aqui.
          </p>
        </div>
      )}
    </div>
  );
};

export default TermsAcceptanceList;
