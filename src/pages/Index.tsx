
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MemoryGame from "@/components/MemoryGame";
import { Utensils, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface IndexProps {
  user?: { email?: string };
}

export default function Index({ user }: IndexProps) {
  const isSuperAdmin = user?.email === "ivangualbertodeoliveirajunior@gmail.com";
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 p-4">
      <div className="container max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-600 flex items-center justify-center gap-2 mb-2">
            <Utensils className="h-8 w-8" />
            <span>Jogo da Memória</span>
          </h1>
          <p className="text-gray-600">Encontre os pares de lanches iguais!</p>
        </header>

        {/* Link para administração */}
        <div className="flex justify-end mb-4 gap-2">
          {isSuperAdmin ? (
            <>
              <Link to="/admin">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Administração</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
              >
                Sair
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Login Admin</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Card do jogo */}
        <Card className="p-4 shadow-lg bg-white/80 backdrop-blur-sm">
          <MemoryGame />
        </Card>

        {/* Rodapé */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Jogo da Memória da Lanchonete &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Desenvolvido com ♥ para amantes de comida</p>
        </footer>
      </div>
    </div>
  );
}
