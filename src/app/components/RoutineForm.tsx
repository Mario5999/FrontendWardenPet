"use client";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

interface Routine {
  id: string;
  petId: string;
  type: 'food' | 'walk' | 'play' | 'medication' | 'other';
  time: string;
  description: string;
}

interface RoutineFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (routine: Omit<Routine, 'id'>) => void;
  pets: Array<{ id: string; name: string }>;
}

export function RoutineForm({ open, onClose, onSave, pets }: RoutineFormProps) {
  const { register, handleSubmit, setValue, reset } = useForm<Omit<Routine, 'id'>>();

  const onSubmit = (data: Omit<Routine, 'id'>) => {
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
          <DialogTitle>Agregar Rutina Diaria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="petId">Mascota *</Label>
            <Select onValueChange={(value: string) => setValue('petId', value)}>
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
            <Select onValueChange={(value: string) => setValue('type', value as Routine['type'])}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Comida</SelectItem>
                <SelectItem value="walk">Paseo</SelectItem>
                <SelectItem value="play">Juego</SelectItem>
                <SelectItem value="medication">Medicación</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="time">Hora *</Label>
            <Input id="time" type="time" {...register('time', { required: true })} />
          </div>

          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Input id="description" {...register('description', { required: true })} placeholder="Ej: Desayuno - 200g de alimento" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
