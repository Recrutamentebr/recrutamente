import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TERM_TEXT = `Estou de acordo e ciente que, caso seja realizada contratação de qualquer profissional inscrito na plataforma, pelo prazo de 12 meses, será devida a cobrança dos honorários, conforme honorários aceitos na proposta.`;

const TERM_VERSION = "1.0";

interface ClientTermsDialogProps {
  open: boolean;
  onAccepted: () => void;
  companyId: string;
}

const ClientTermsDialog = ({ open, onAccepted, companyId }: ClientTermsDialogProps) => {
  const { toast } = useToast();
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!accepted) {
      toast({
        title: "Atenção",
        description: "Você precisa concordar com os termos para continuar.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      // Get client's IP (optional, may be null)
      let ipAddress = null;
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        ipAddress = data.ip;
      } catch {
        // IP fetch failed, continue without it
      }

      const { error } = await supabase
        .from("client_terms_acceptance")
        .insert({
          client_user_id: user.id,
          company_id: companyId,
          term_version: TERM_VERSION,
          term_text: TERM_TEXT,
          ip_address: ipAddress,
        });

      if (error) throw error;

      toast({
        title: "Termos aceitos",
        description: "Obrigado por concordar com os termos de uso.",
      });

      onAccepted();
    } catch (error: any) {
      console.error("Error accepting terms:", error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar a aceitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="text-accent" size={24} />
            Termos de Uso da Plataforma
          </DialogTitle>
          <DialogDescription>
            Por favor, leia e aceite os termos abaixo para continuar utilizando a plataforma.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 bg-muted/50 rounded-xl border border-border mb-6">
            <p className="text-foreground leading-relaxed">
              {TERM_TEXT}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="accept-terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
              className="mt-0.5"
            />
            <Label htmlFor="accept-terms" className="text-sm cursor-pointer">
              Li e aceito os termos acima descritos
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAccept} disabled={submitting || !accepted}>
            {submitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Processando...
              </>
            ) : (
              "Aceitar e Continuar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientTermsDialog;
