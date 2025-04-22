
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let resp;
      if (isSignIn) {
        resp = await supabase.auth.signInWithPassword({ email, password });
      } else {
        resp = await supabase.auth.signUp({ email, password });
      }
      if (resp.error) {
        setError(resp.error.message);
      } else if (resp.data?.user) {
        // Sucesso
        navigate("/");
      } else {
        setError("Erro inesperado no login/cadastro.");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao autenticar.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-orange-50">
      <Card className="max-w-md w-full p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isSignIn ? "Entrar no Sistema" : "Criar Conta de Admin"}
        </h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            className="w-full px-3 py-2 border rounded"
            type="email"
            placeholder="E-mail"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border rounded"
            type="password"
            placeholder="Senha"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading
              ? "Aguarde..."
              : isSignIn
                ? "Entrar"
                : "Cadastrar"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <button
            className="text-blue-600 underline"
            type="button"
            onClick={() => setIsSignIn(!isSignIn)}
          >
            {isSignIn ? "Criar conta" : "Já tem conta? Entrar"}
          </button>
        </div>
        <div className="text-xs mt-3 text-gray-500 text-center">
          Use o e-mail <strong>ivangualbertodeoliveirajunior@gmail.com</strong> e a senha <strong>798546</strong> para acesso superadmin.
        </div>
      </Card>
    </div>
  );
}
