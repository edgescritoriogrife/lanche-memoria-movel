import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

function useAuthSession() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };
    loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_evt, session) => setUser(session?.user ?? null)
    );
    return () => listener?.subscription?.unsubscribe();
  }, []);
  return user;
}

const queryClient = new QueryClient();

const App = () => {
  const user = useAuthSession();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index user={user} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin user={user} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
