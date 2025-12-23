import { forwardRef } from "react";
import { MessageCircle } from "lucide-react";

export const WhatsAppButton = forwardRef<HTMLAnchorElement>((props, ref) => {
  return (
    <a
      ref={ref}
      href="https://wa.me/5581981985374?text=Olá! Gostaria de saber mais sobre os serviços da RecrutaMente."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[hsl(142,70%,45%)] text-primary-foreground px-5 py-4 rounded-full shadow-xl hover:bg-[hsl(142,70%,40%)] transition-all duration-300 hover:scale-105 group"
      aria-label="Falar no WhatsApp"
      {...props}
    >
      <MessageCircle size={24} className="animate-pulse" />
      <span className="hidden md:inline font-semibold">Fale Conosco</span>
    </a>
  );
});

WhatsAppButton.displayName = "WhatsAppButton";
