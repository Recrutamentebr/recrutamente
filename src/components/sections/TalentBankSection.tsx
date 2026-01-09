import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Briefcase, ChevronRight, Filter, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  shareViaWhatsApp,
  shareViaLinkedIn,
  shareViaFacebook,
  shareViaTwitter,
  copyShareLink,
} from "@/utils/shareUtils";

interface Job {
  id: string;
  slug: string;
  title: string;
  description: string;
  area: string;
  city: string;
  state: string;
  type: string;
  level: string;
}

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
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
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-foreground text-xl group-hover:text-accent transition-colors">
              {job.title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-accent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share2 size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    shareViaWhatsApp(job.title, job.slug);
                  }}
                >
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    shareViaLinkedIn(job.slug);
                  }}
                >
                  LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    shareViaFacebook(job.title, job.slug);
                  }}
                >
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    shareViaTwitter(job.title, job.slug);
                  }}
                >
                  X (Twitter)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async (e) => {
                    e.stopPropagation();
                    const success = await copyShareLink(job.slug);
                    if (success) {
                      toast.success("Link copiado!");
                    } else {
                      toast.error("Erro ao copiar link");
                    }
                  }}
                >
                  Copiar link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
          <Link to={`/vagas/${job.slug}`}>
            Ver Vaga
            <ChevronRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export function TalentBankSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, slug, title, description, area, city, state, type, level")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters from database jobs
  const areas = [...new Set(jobs.map((j) => j.area))];
  const types = [...new Set(jobs.map((j) => j.type))];
  const levels = [...new Set(jobs.map((j) => j.level))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = !selectedArea || selectedArea === "all" || job.area === selectedArea;
    const matchesType = !selectedType || selectedType === "all" || job.type === selectedType;
    const matchesLevel = !selectedLevel || selectedLevel === "all" || job.level === selectedLevel;

    return matchesSearch && matchesArea && matchesType && matchesLevel;
  });

  return (
    <section id="banco-talentos" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Oportunidades</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Encontre a vaga <span className="text-accent">ideal</span> para você
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore nossas vagas disponíveis e candidate-se às oportunidades que combinam com seu perfil.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Buscar por cargo, área ou palavra-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-background"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filtros
            </Button>

            {/* Filters */}
            <div className={`flex flex-col sm:flex-row gap-4 ${showFilters ? "block" : "hidden lg:flex"}`}>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-full sm:w-44 h-12 bg-background">
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

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-36 h-12 bg-background">
                  <SelectValue placeholder="Tipo" />
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
                <SelectTrigger className="w-full sm:w-36 h-12 bg-background">
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
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
          ) : (
            <>
              <div className="text-muted-foreground text-sm mb-4">
                {filteredJobs.length} vaga{filteredJobs.length !== 1 ? "s" : ""} encontrada{filteredJobs.length !== 1 ? "s" : ""}
              </div>

              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <Briefcase className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground text-lg">
                    {jobs.length === 0 
                      ? "Ainda não há vagas cadastradas. Volte em breve!"
                      : "Nenhuma vaga encontrada com os filtros selecionados."}
                  </p>
                  {jobs.length > 0 && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedArea("");
                        setSelectedType("");
                        setSelectedLevel("");
                      }}
                    >
                      Limpar filtros
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/vagas">
              Ver todas as vagas
              <ChevronRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
