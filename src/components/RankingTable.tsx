
import { useQuery } from "@tanstack/react-query";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Award, Medal } from "lucide-react";

interface Ranking {
  id: string;
  player_name: string;
  score: number;
  moves: number;
  time_seconds: number;
  created_at: string | null;
}

async function fetchRanking(): Promise<Ranking[]> {
  const { data, error } = await supabase
    .from("ranking")
    .select("*")
    .order("score", { ascending: false })
    .order("time_seconds", { ascending: true })
    .limit(10);

  if (error) throw error;
  return data || [];
}

export default function RankingTable() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ranking"],
    queryFn: fetchRanking,
  });

  if (isLoading) {
    return <div className="text-center text-gray-500 py-4">Carregando ranking...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-4">Erro ao carregar ranking.</div>;
  }
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400 py-4">Nenhuma pontuação registrada ainda.</div>;
  }

  return (
    <div className="my-8">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Medal className="h-6 w-6 text-yellow-500" />
        <h2 className="text-lg font-bold text-yellow-700">Ranking dos Melhores Jogadores</h2>
      </div>
      <Table className="bg-white/90 rounded-lg shadow overflow-hidden text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Pontos</TableHead>
            <TableHead>Movimentos</TableHead>
            <TableHead>Tempo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell className="font-bold">{idx === 0 ? <Award className="inline w-4 h-4 text-yellow-600" /> : idx + 1}</TableCell>
              <TableCell>{item.player_name}</TableCell>
              <TableCell>{item.score}</TableCell>
              <TableCell>{item.moves}</TableCell>
              <TableCell>
                {Math.floor(item.time_seconds / 60)
                  .toString()
                  .padStart(2, "0")}
                :
                {(item.time_seconds % 60).toString().padStart(2, "0")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
