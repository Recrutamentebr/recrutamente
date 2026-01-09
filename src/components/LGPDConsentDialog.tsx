import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface LGPDConsentDialogProps {
  onConsentChange: (consented: boolean) => void;
  consented: boolean;
}

const LGPDConsentDialog = ({ onConsentChange, consented }: LGPDConsentDialogProps) => {
  return (
    <div className="p-4 bg-muted/50 rounded-xl border border-border">
      <div className="flex items-start gap-3">
        <Checkbox
          id="lgpd-consent"
          checked={consented}
          onCheckedChange={(checked) => onConsentChange(checked === true)}
          className="mt-1"
        />
        <Label htmlFor="lgpd-consent" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
          <strong className="text-foreground">Termo de Consentimento LGPD:</strong> Estou de acordo em compartilhar 
          meus dados, podendo ser utilizados para avaliação da RecrutaMente e da empresa contratante da RecrutaMente. 
          Compreendo que meus dados serão tratados conforme a Lei Geral de Proteção de Dados (LGPD).
        </Label>
      </div>
    </div>
  );
};

export default LGPDConsentDialog;
