import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

interface HealthRecord {
  id: string;
  petId: string;
  date: string;
  symptoms: string;
  notes?: string;
  temperature?: number;
}

interface HealthRecordFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (record: Omit<HealthRecord, 'id'>) => void;
  pets: Array<{ id: string; name: string }>;
}

export function HealthRecordForm({ open, onClose, onSave, pets }: HealthRecordFormProps) {
  const { register, handleSubmit, setValue, reset } = useForm<Omit<HealthRecord, 'id'>>();

  const onSubmit = (data: Omit<HealthRecord, 'id'>) => {
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
          <DialogTitle>Agregar Registro de Salud</DialogTitle>
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
            <Label htmlFor="date">Fecha *</Label>
            <Input id="date" type="datetime-local" {...register('date', { required: true })} />
          </div>

          <div>
            <Label htmlFor="symptoms">Síntomas *</Label>
            <Textarea id="symptoms" {...register('symptoms', { required: true })} placeholder="Describe los síntomas observados..." />
          </div>

          <div>
            <Label htmlFor="temperature">Temperatura (°C)</Label>
            <Input id="temperature" type="number" step="0.1" {...register('temperature', { valueAsNumber: true })} />
          </div>

          <div>
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea id="notes" {...register('notes')} placeholder="Tratamientos, medicamentos, etc..." />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
