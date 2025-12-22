import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-hero-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-72 h-72 bg-sky rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-sky-light rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Contrate com estratégia.{" "}
            <span className="text-sky-light">Selecione com inteligência.</span>
          </h2>
          <p className="text-lg sm:text-xl text-primary-foreground/85 mb-10 max-w-2xl mx-auto">
            Deixe a RecrutaMente cuidar do seu processo seletivo enquanto você foca no crescimento do seu negócio.
          </p>
          <Button variant="hero" size="xl" asChild>
            <a
              href="https://wa.me/5581981985374?text=Olá! Gostaria de falar com um especialista da RecrutaMente."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={24} />
              Falar com um Especialista
              <ArrowRight size={20} />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
