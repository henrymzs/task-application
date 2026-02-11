import { Check, Pencil, Trash2 } from 'lucide-react';
import { type Task, useTasks } from '@/contexts/TaskContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const { toggleTask, deleteTask } = useTasks();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (taskIdToDelete) {
      deleteTask(taskIdToDelete);
      toast.success("Tarefa excluída");
    }
    setTaskIdToDelete(null);
    setShowConfirm(false);
  };

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-xl border bg-card p-4 transition-all duration-200 hover:bg-accent hover:shadow-md",
        task.completed && "opacity-60"
      )}

    >
      <button
        onClick={() => toggleTask(task.id)}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
          task.completed
            ? "border-primary bg-primary/15"
            : "border-muted-foreground/40 hover:border-primary"
        )}
      >
        {task.completed && <Check className="h-4 w-3 text-primary-foreground" />}
      </button>

      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "font-medium text-card-foreground transition-all",
            task.completed && "line-through"
          )}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1 text-sm text-muted-foreground/70 line-clamp-2">
            {task.description}
          </p>
        )}
        <span className="mt-2 inline-block text-xs text-muted-foreground/50">
          {new Date(task.createdAt).toLocaleDateString('pt-BR')}
        </span>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => navigate(`/editar/${task.id}`)}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            setTaskIdToDelete(task.id);
            setShowConfirm(true);
          }}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tarefa? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} variant="destructive">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default TaskCard;