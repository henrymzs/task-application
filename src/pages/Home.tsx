import { useTasks } from "@/contexts/TaskContext";
import { useNavigate } from "react-router-dom";
import { Plus, ClipboardList } from "lucide-react"
import TaskCard from '@/components/TaskCard';
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Filter = "all" | "pending" | "completed";

function Home() {
    const { tasks } = useTasks();
    const navigate = useNavigate();
    const [filter, setFilter] = useState<Filter>("all");

    const filtered = tasks.filter(t => {
        if (filter === "pending") return !t.completed;
        if (filter === "completed") return t.completed;
        return true;
    });

    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;

    return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Minhas Tarefas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total === 0
              ? 'Nenhuma tarefa ainda'
              : `${done} de ${total} concluída${done !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button onClick={() => navigate('/adicionar')} size="lg" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Nova
        </Button>
      </div>

      {total > 0 && (
        <div className="mb-5 flex gap-1 rounded-lg bg-secondary p-1">
          {(['all', 'pending', 'completed'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : 'Concluídas'}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ClipboardList className="mb-3 h-12 w-12 opacity-40" />
          <p className="text-sm">
            {total === 0
              ? 'Adicione sua primeira tarefa!'
              : 'Nenhuma tarefa neste filtro.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;