import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

interface Reminder {
  id: string;
  petId: string;
  type: 'vaccine' | 'bath' | 'vet' | 'grooming' | 'other';
  title: string;
  description?: string;
  date: string;
  completed: boolean;
}

interface ReminderFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (reminder: Omit<Reminder, 'id' | 'completed'>) => void;
  pets: Array<{ id: string; name: string }>;
}

export function ReminderForm({ open, onClose, onSave, pets }: ReminderFormProps) {
  const { register, handleSubmit, setValue, reset } = useForm<Omit<Reminder, 'id' | 'completed'>>();

  const onSubmit = (data: Omit<Reminder, 'id' | 'completed'>) => {
    onSave(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Recordatorio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="petId">Mascota *</Label>
            <Select onValueChange={(value) => setValue('petId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una mascota" />
              </SelectTrigger>
              <SelectContent>
                {pets.map(pet => (
                  <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Tipo de Actividad *</Label>
            <Select onValueChange={(value) => setValue('type', value as Reminder['type'])}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaccine">Vacuna</SelectItem>
                <SelectItem value="bath">Baño</SelectItem>
                <SelectItem value="vet">Cita Veterinaria</SelectItem>
                <SelectItem value="grooming">Peluquería</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Título *</Label>
            <Input id="title" {...register('title', { required: true })} />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register('description')} />
          </div>

          <div>
            <Label htmlFor="date">Fecha *</Label>
            <Input id="date" type="datetime-local" {...register('date', { required: true })} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-400 to-sky-400 hover:from-blue-500 hover:to-sky-500">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
