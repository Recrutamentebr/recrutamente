import { Link } from "react-router-dom";
import { Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo-recrutamente.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-6">
            <img src={logo} alt="RecrutaMente" className="h-16 w-auto brightness-0 invert" />
            <p className="text-primary-foreground/80 leading-relaxed">
              Consultoria especializada em Recrutamento e Seleção, conectando talentos qualificados às melhores oportunidades do mercado.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/recrutamente"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary-foreground/10 rounded-lg hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/recrutamente/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary-foreground/10 rounded-lg hover:bg-primary-foreground/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Links Rápidos</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Home
              </Link>
              <Link to="/#quem-somos" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Quem Somos
              </Link>
              <Link to="/#servicos" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Serviços
              </Link>
              <Link to="/vagas" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Banco de Talentos
              </Link>
              <Link to="/empresas" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Para Empresas
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-6">Nossos Serviços</h4>
            <nav className="flex flex-col gap-3">
              <span className="text-primary-foreground/80">Recrutamento e Seleção</span>
              <span className="text-primary-foreground/80">Gestão de Banco de Talentos</span>
              <span className="text-primary-foreground/80">Triagem Técnica e Comportamental</span>
              <span className="text-primary-foreground/80">Consultoria em RH</span>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contato</h4>
            <div className="flex flex-col gap-4">
              <a
                href="https://wa.me/5581981985374"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Phone size={18} />
                (81) 98198-5374
              </a>
              <a
                href="mailto:denys@recrutamente.site"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Mail size={18} />
                denys@recrutamente.site
              </a>
              <span className="flex items-center gap-3 text-primary-foreground/80">
                <MapPin size={18} />
                Recife, PE - Brasil
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} RecrutaMente. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
