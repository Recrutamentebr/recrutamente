import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-recrutamente.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#quem-somos", label: "Quem Somos" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/vagas", label: "Banco de Talentos" },
  { href: "/empresas", label: "Para Empresas" },
  { href: "/#contato", label: "Contato" },
  { href: "/auth", label: "Painel Admin" },
  { href: "/cliente/login", label: "Painel Cliente" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  const scrollToSection = (sectionId: string) => {
    closeMenu();

    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    navigate("/");
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleHomeClick = () => {
    closeMenu();

    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="RecrutaMente" className="h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.href === "/") {
                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={handleHomeClick}
                    className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                );
              }

              if (link.href.startsWith("/#")) {
                const sectionId = link.href.slice(2);
                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => scrollToSection(sectionId)}
                    className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                );
              }

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMenu}
                  className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="whatsapp" asChild>
              <a
                href="https://wa.me/5581981985374"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fale Conosco
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                if (link.href === "/") {
                  return (
                    <button
                      key={link.href}
                      type="button"
                      onClick={handleHomeClick}
                      className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 py-2 text-left"
                    >
                      {link.label}
                    </button>
                  );
                }

                if (link.href.startsWith("/#")) {
                  const sectionId = link.href.slice(2);
                  return (
                    <button
                      key={link.href}
                      type="button"
                      onClick={() => scrollToSection(sectionId)}
                      className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 py-2 text-left"
                    >
                      {link.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={closeMenu}
                    className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 py-2"
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Button variant="whatsapp" className="mt-4" asChild>
                <a
                  href="https://wa.me/5581981985374"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fale Conosco
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
