import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Briefcase, ChevronRight, Filter, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { jobs, areas, cities, states, types, levels, Job } from "@/data/jobs";

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
              {job.type}
            </span>
            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
              {job.level}
            </span>
          </div>
          <h3 className="font-bold text-foreground text-xl mb-2 group-hover:text-accent transition-colors">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
            <span className="flex items-center gap-1">
              <Briefcase size={14} />
              {job.area}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {job.city}, {job.state}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-3 line-clamp-2">{job.description}</p>
        </div>
        <Button variant="outline" size="sm" asChild className="flex-shrink-0">
          <Link to={`/vagas/${job.id}`}>
            Ver Vaga
            <ChevronRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
}

const VagasPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = !selectedArea || selectedArea === "all" || job.area === selectedArea;
    const matchesCity = !selectedCity || selectedCity === "all" || job.city === selectedCity;
    const matchesType = !selectedType || selectedType === "all" || job.type === selectedType;
    const matchesLevel = !selectedLevel || selectedLevel === "all" || job.level === selectedLevel;

    return matchesSearch && matchesArea && matchesCity && matchesType && matchesLevel;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedArea("");
    setSelectedCity("");
    setSelectedType("");
    setSelectedLevel("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-hero-gradient py-20">
          <div className="container mx-auto px-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ChevronLeft size={18} />
              Voltar para Home
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Banco de Talentos
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl">
              Encontre oportunidades que combinam com seu perfil. Cadastre-se e faça parte do nosso banco de talentos.
            </p>
          </div>
        </section>

        {/* Filters and Jobs */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            {/* Search and Filters */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border mb-8">
              <div className="flex flex-col gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    placeholder="Buscar por cargo, área ou palavra-chave..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-background"
                  />
                </div>

                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={18} />
                  {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
                </Button>

                {/* Filters */}
                <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-4 ${showFilters ? "block" : "hidden lg:grid"}`}>
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger className="h-12 bg-background">
                      <SelectValue placeholder="Área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as áreas</SelectItem>
                      {areas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-12 bg-background">
                      <SelectValue placeholder="Cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as cidades</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="h-12 bg-background">
                      <SelectValue placeholder="Tipo de Vaga" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="h-12 bg-background">
                      <SelectValue placeholder="Nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os níveis</SelectItem>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(selectedArea || selectedCity || selectedType || selectedLevel) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="self-start">
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="text-muted-foreground text-sm mb-4">
                {filteredJobs.length} vaga{filteredJobs.length !== 1 ? "s" : ""} encontrada{filteredJobs.length !== 1 ? "s" : ""}
              </div>

              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <p className="text-muted-foreground text-lg">
                    Nenhuma vaga encontrada com os filtros selecionados.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default VagasPage;
