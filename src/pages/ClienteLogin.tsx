import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, ArrowLeft, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import logo from "@/assets/logo-recrutamente.png";

const emailSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

const passwordSchema = z.object({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme a senha"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type Mode = "select" | "register" | "login";
type Step = "email" | "create-password" | "enter-password";

const ClienteLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<Mode>("select");
  const [step, setStep] = useState<Step>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invitationData, setInvitationData] = useState<{ id: string; company_id: string; pending_job_ids: string[] } | null>(null);

  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        if (roleData?.role === "client") {
          navigate("/cliente");
        }
      }
      setCheckingAuth(false);
    };
    
    checkExistingSession();
  }, [navigate]);

  const handleRegisterEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setFormErrors({ email: result.error.errors[0].message });
      return;
    }

    setIsLoading(true);

    try {
      // Check if there's an invitation for this email
      const { data: accessData, error } = await supabase
        .from("client_company_access")
        .select("id, company_id, password_set, client_user_id, pending_job_ids")
        .eq("client_email", email)
        .single();

      if (error || !accessData) {
        toast({
          title: "Acesso não autorizado",
          description: "Este e-mail não foi cadastrado pelo administrador. Entre em contato com a empresa.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (accessData.password_set && accessData.client_user_id) {
        toast({
          title: "Conta já existe",
          description: "Este e-mail já possui uma conta. Use a opção 'Já tenho conta' para entrar.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setInvitationData({ id: accessData.id, company_id: accessData.company_id, pending_job_ids: (accessData.pending_job_ids as string[]) || [] });
      setStep("create-password");
    } catch (error) {
      console.error("Error checking email:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao verificar o e-mail.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setFormErrors({ email: result.error.errors[0].message });
      return;
    }

    setIsLoading(true);

    try {
      // Check if there's an account for this email
      const { data: accessData, error } = await supabase
        .from("client_company_access")
        .select("id, company_id, password_set, client_user_id")
        .eq("client_email", email)
        .single();

      if (error || !accessData) {
        toast({
          title: "Conta não encontrada",
          description: "Este e-mail não está cadastrado. Verifique o e-mail ou entre em contato com a empresa.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!accessData.password_set || !accessData.client_user_id) {
        toast({
          title: "Conta não ativada",
          description: "Este e-mail ainda não criou uma senha. Use a opção 'Primeiro acesso' para cadastrar.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setStep("enter-password");
    } catch (error) {
      console.error("Error checking email:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao verificar o e-mail.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = passwordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const errors: { password?: string; confirmPassword?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "password") errors.password = err.message;
        if (err.path[0] === "confirmPassword") errors.confirmPassword = err.message;
      });
      setFormErrors(errors);
      return;
    }

    if (!invitationData) {
      toast({
        title: "Erro",
        description: "Dados do convite não encontrados.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create the user in Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/cliente`,
          data: {
            user_type: "client",
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!signUpData.user) {
        throw new Error("Erro ao criar usuário");
      }

      // Update client_company_access with user_id and mark password as set
      const { error: updateError } = await supabase
        .from("client_company_access")
        .update({
          client_user_id: signUpData.user.id,
          password_set: true,
        })
        .eq("id", invitationData.id);

      if (updateError) throw updateError;

      // Transfer pending job access to client_job_access using RPC
      if (invitationData.pending_job_ids && invitationData.pending_job_ids.length > 0) {
        await supabase.rpc('transfer_pending_jobs_to_access', {
          p_client_user_id: signUpData.user!.id,
          p_access_id: invitationData.id,
        });
      }

      toast({
        title: "Conta ativada!",
        description: "Sua conta foi criada com sucesso. Entrando...",
      });

      // Auto-login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      navigate("/cliente");
    } catch (error: any) {
      console.error("Error creating account:", error);
      
      // Handle case where user already exists in auth but database wasn't updated
      if (error.message?.includes("already registered")) {
        try {
          // Try to sign in with the provided password
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            toast({
              title: "Usuário já registrado",
              description: "Este e-mail já está registrado. Use a opção 'Já tenho conta' para entrar.",
              variant: "destructive",
            });
            setMode("select");
            setStep("email");
            setIsLoading(false);
            return;
          }

          if (signInData?.user && invitationData) {
            // Update client_company_access with the existing user id
            await supabase
              .from("client_company_access")
              .update({
                client_user_id: signInData.user.id,
                password_set: true,
              })
              .eq("id", invitationData.id);

            // Transfer pending job access using RPC
            if (invitationData.pending_job_ids && invitationData.pending_job_ids.length > 0) {
              await supabase.rpc('transfer_pending_jobs_to_access', {
                p_client_user_id: signInData.user.id,
                p_access_id: invitationData.id,
              });
            }

            toast({
              title: "Conta ativada!",
              description: "Sua conta foi vinculada com sucesso.",
            });

            navigate("/cliente");
            return;
          }
        } catch (recoveryError) {
          console.error("Error recovering existing user:", recoveryError);
        }
        
        toast({
          title: "Erro",
          description: "Este e-mail já está registrado. Tente fazer login.",
          variant: "destructive",
        });
        setMode("select");
        setStep("email");
      } else {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao criar sua conta.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (!password) {
      setFormErrors({ password: "Digite sua senha" });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Verify user is a client
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      if (roleError || roleData?.role !== "client") {
        await supabase.auth.signOut();
        toast({
          title: "Acesso negado",
          description: "Esta área é exclusiva para clientes.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao portal do cliente.",
      });

      navigate("/cliente");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erro no login",
        description: error.message === "Invalid login credentials" 
          ? "E-mail ou senha incorretos." 
          : "Ocorreu um erro ao fazer login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step !== "email") {
      setStep("email");
      setPassword("");
      setConfirmPassword("");
      setFormErrors({});
    } else {
      setMode("select");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFormErrors({});
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20 bg-secondary flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 py-12">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-card">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="RecrutaMente" className="h-12" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground text-center mb-2">
              Portal do Cliente
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {mode === "select" && "Escolha uma opção para continuar"}
              {mode === "register" && step === "email" && "Digite o e-mail cadastrado pelo administrador"}
              {mode === "register" && step === "create-password" && "Crie sua senha para ativar a conta"}
              {mode === "login" && step === "email" && "Digite seu e-mail para entrar"}
              {mode === "login" && step === "enter-password" && "Digite sua senha para entrar"}
            </p>

            {/* Mode Selection */}
            {mode === "select" && (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setMode("register")}
                >
                  <UserPlus className="text-accent" size={24} />
                  <span className="font-semibold">Primeiro acesso</span>
                  <span className="text-xs text-muted-foreground">Criar minha senha</span>
                </Button>
                
                <Button
                  className="w-full h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setMode("login")}
                >
                  <LogIn size={24} />
                  <span className="font-semibold">Já tenho conta</span>
                  <span className="text-xs opacity-80">Entrar no painel</span>
                </Button>
              </div>
            )}

            {/* Register Flow - Email Step */}
            {mode === "register" && step === "email" && (
              <form onSubmit={handleRegisterEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormErrors({});
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-sm text-destructive">{formErrors.email}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                    <ArrowLeft size={18} />
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Verificando...
                      </>
                    ) : (
                      "Continuar"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Register Flow - Create Password Step */}
            {mode === "register" && step === "create-password" && (
              <form onSubmit={handleCreatePassword} className="space-y-6">
                <div className="p-3 bg-muted/50 rounded-lg border border-border mb-4">
                  <p className="text-sm text-muted-foreground">
                    <Mail className="inline-block mr-1" size={14} />
                    {email}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Criar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFormErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-sm text-destructive">{formErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setFormErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-destructive">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                    <ArrowLeft size={18} />
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Criando conta...
                      </>
                    ) : (
                      "Ativar Conta"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Login Flow - Email Step */}
            {mode === "login" && step === "email" && (
              <form onSubmit={handleLoginEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormErrors({});
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-sm text-destructive">{formErrors.email}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                    <ArrowLeft size={18} />
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Verificando...
                      </>
                    ) : (
                      "Continuar"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Login Flow - Password Step */}
            {mode === "login" && step === "enter-password" && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="p-3 bg-muted/50 rounded-lg border border-border mb-4">
                  <p className="text-sm text-muted-foreground">
                    <Mail className="inline-block mr-1" size={14} />
                    {email}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFormErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-sm text-destructive">{formErrors.password}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                    <ArrowLeft size={18} />
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClienteLoginPage;
