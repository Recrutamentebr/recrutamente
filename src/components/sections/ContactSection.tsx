import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contato" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Contato</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
                Vamos conversar sobre suas{" "}
                <span className="text-accent">necessidades</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Entre em contato conosco e descubra como podemos ajudar sua empresa a encontrar os melhores talentos.
              </p>
            </div>

            <div className="space-y-6">
              <a
                href="https://wa.me/5581981985374"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-accent transition-colors group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent-gradient transition-all">
                  <Phone className="text-accent group-hover:text-primary-foreground transition-colors" size={24} />
                </div>
                <div>
                  <div className="font-semibold text-foreground">WhatsApp</div>
                  <div className="text-muted-foreground">(81) 98198-5374</div>
                </div>
              </a>

              <a
                href="mailto:denys@recrutamente.site"
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-accent transition-colors group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent-gradient transition-all">
                  <Mail className="text-accent group-hover:text-primary-foreground transition-colors" size={24} />
                </div>
                <div>
                  <div className="font-semibold text-foreground">E-mail</div>
                  <div className="text-muted-foreground">denys@recrutamente.site</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <MapPin className="text-accent" size={24} />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Localização</div>
                  <div className="text-muted-foreground">Recife, PE - Brasil</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 rounded-3xl shadow-card border border-border">
            <h3 className="font-bold text-xl text-foreground mb-6">Envie uma mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Nome *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Seu nome completo"
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    E-mail *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Telefone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Assunto *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Como podemos ajudar?"
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Mensagem *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Descreva sua necessidade..."
                  rows={4}
                  required
                  className="bg-background resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send size={18} />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
