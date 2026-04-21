import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Calendar, Heart, Clock, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Pet {
  id: string;
  name: string;
  type: string;
  age: number;
  breed?: string;
  weight?: number;
  image?: string;
}

interface Reminder {
  id: string;
  petId: string;
  type: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
}

interface HealthRecord {
  id: string;
  petId: string;
  date: string;
  symptoms: string;
  notes?: string;
  temperature?: number;
}

interface Routine {
  id: string;
  petId: string;
  type: string;
  time: string;
  description: string;
}

interface PetDetailsProps {
  pet: Pet | null;
  open: boolean;
  onClose: () => void;
  reminders: Reminder[];
  healthRecords: HealthRecord[];
  routines: Routine[];
  onToggleReminder: (id: string) => void;
}

const reminderTypeLabels: Record<string, string> = {
  vaccine: 'Vacuna',
  bath: 'Baño',
  vet: 'Veterinario',
  grooming: 'Peluquería',
  other: 'Otro'
};

const routineTypeLabels: Record<string, string> = {
  food: 'Comida',
  walk: 'Paseo',
  play: 'Juego',
  medication: 'Medicación',
  other: 'Otro'
};

export function PetDetails({ pet, open, onClose, reminders, healthRecords, routines, onToggleReminder }: PetDetailsProps) {
  if (!pet) return null;

  const petReminders = reminders.filter(r => r.petId === pet.id).sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const petHealthRecords = healthRecords.filter(r => r.petId === pet.id).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const petRoutines = routines.filter(r => r.petId === pet.id).sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de {pet.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recordatorios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {petReminders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay recordatorios programados</p>
              ) : (
                <div className="space-y-2">
                  {petReminders.map(reminder => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{reminder.title}</p>
                          <Badge variant="outline">{reminderTypeLabels[reminder.type]}</Badge>
                        </div>
                        {reminder.description && (
                          <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(reminder.date), "PPp", { locale: es })}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={reminder.completed ? "secondary" : "outline"}
                        onClick={() => onToggleReminder(reminder.id)}
                      >
                        {reminder.completed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Registros de Salud
              </CardTitle>
            </CardHeader>
            <CardContent>
              {petHealthRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay registros de salud</p>
              ) : (
                <div className="space-y-3">
                  {petHealthRecords.map(record => (
                    <div key={record.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium">
                          {format(new Date(record.date), "PPp", { locale: es })}
                        </p>
                        {record.temperature && (
                          <Badge variant="outline">{record.temperature}°C</Badge>
                        )}
                      </div>
                      <p className="text-sm"><span className="font-medium">Síntomas:</span> {record.symptoms}</p>
                      {record.notes && (
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Rutinas Diarias
              </CardTitle>
            </CardHeader>
            <CardContent>
              {petRoutines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay rutinas configuradas</p>
              ) : (
                <div className="space-y-2">
                  {petRoutines.map(routine => (
                    <div key={routine.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge>{routine.time}</Badge>
                        <div>
                          <p className="font-medium">{routineTypeLabels[routine.type]}</p>
                          <p className="text-sm text-muted-foreground">{routine.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
