import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '@/contexts/TaskContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addTask, updateTask, tasks } = useTasks();
  const isEditing = Boolean(id);

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<{ title: string; description: string } | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
      } else {
        navigate('/');
      }
    }
  }, [id, tasks, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    const data = {
      title: title.trim(),
      description: description.trim(),
    };
    if (!description.trim()) {
      setPendingData(data);
      setShowConfirm(true);
      return;  
    }
    saveTask(data);
  };

  const saveTask = (data: { title: string; description: string }) => {
    if (isEditing && id) {
      updateTask(id, data);
      toast.success("Tarefa atualizada");
    } else {
      addTask(data);
      toast.success("Tarefa criada");
    }
    navigate('/');
  };

  const handleConfirm = () => {
    if (pendingData) {
      saveTask(pendingData);
    }
    setShowConfirm(false);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-8">
        {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Título
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="O que precisa ser feito?"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            Descrição
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Adicione mais detalhes..."
            rows={4}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1">
            {isEditing ? 'Salvar' : 'Adicionar'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/')}>
            Cancelar
          </Button>
        </div>
      </form>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descrição vazia</AlertDialogTitle>
            <AlertDialogDescription>
              A descrição está vazia. Deseja continuar mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Sim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default TaskForm;