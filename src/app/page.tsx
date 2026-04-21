"use client";
import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { PetCard } from './components/PetCard';
import { PetForm } from './components/PetForm';
import { PetDetails } from './components/PetDetails';
import { ReminderForm } from './components/ReminderForm';
import { HealthRecordForm } from './components/HealthRecordForm';
import { RoutineForm } from './components/RoutineForm';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { PlusCircle, Bell, Heart, Clock, AlertTriangle, LogOut, ShieldCheck, User } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';
  age: number;
  breed?: string;
  weight?: number;
  image?: string;
}

interface Reminder {
  id: string;
  petId: string;
  type: 'vaccine' | 'bath' | 'vet' | 'grooming' | 'other';
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
  type: 'food' | 'walk' | 'play' | 'medication' | 'other';
  time: string;
  description: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; role: 'user' | 'admin' } | null>(null);

  const [pets, setPets] = useState<Pet[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);

  const [petFormOpen, setPetFormOpen] = useState(false);
  const [reminderFormOpen, setReminderFormOpen] = useState(false);
  const [healthFormOpen, setHealthFormOpen] = useState(false);
  const [routineFormOpen, setRoutineFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  // Cargar datos del usuario autenticado
useEffect(() => {
  const loadUserData = () => {
    if (isAuthenticated && currentUser) {
      const allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userData = allUserData[currentUser.email] || {
        pets: [],
        reminders: [],
        healthRecords: [],
        routines: []
      };

      setPets(prev => userData.pets || prev);
      setReminders(prev => userData.reminders || prev);
      setHealthRecords(prev => userData.healthRecords || prev);
      setRoutines(prev => userData.routines || prev);
    }
  };

  loadUserData();
}, [isAuthenticated, currentUser]);

  // Guardar datos del usuario
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      allUserData[currentUser.email] = {
        pets,
        reminders,
        healthRecords,
        routines
      };
      localStorage.setItem('userData', JSON.stringify(allUserData));
    }
  }, [pets, reminders, healthRecords, routines, isAuthenticated, currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      reminders.forEach(reminder => {
        if (!reminder.completed && isPast(new Date(reminder.date))) {
          const pet = pets.find(p => p.id === reminder.petId);
          if (pet) {
            toast.error(`¡Recordatorio vencido!`, {
              description: `${reminder.title} para ${pet.name}`
            });
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [reminders, pets]);

  const handleSavePet = (petData: Omit<Pet, 'id'> | Pet) => {
    if ('id' in petData) {
      setPets(pets.map(p => p.id === petData.id ? petData : p));
      toast.success('Mascota actualizada');
    } else {
      const newPet = { ...petData, id: crypto.randomUUID() };
      setPets([...pets, newPet]);
      toast.success('Mascota agregada');
    }
    setEditingPet(null);
  };

  const handleDeletePet = (id: string) => {
    const pet = pets.find(p => p.id === id);
    if (pet && confirm(`¿Eliminar a ${pet.name}?`)) {
      setPets(pets.filter(p => p.id !== id));
      setReminders(reminders.filter(r => r.petId !== id));
      setHealthRecords(healthRecords.filter(r => r.petId !== id));
      setRoutines(routines.filter(r => r.petId !== id));
      toast.success('Mascota eliminada');
    }
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setPetFormOpen(true);
  };

  const handleViewDetails = (pet: Pet) => {
    setSelectedPet(pet);
    setDetailsOpen(true);
  };

  const handleSaveReminder = (reminderData: Omit<Reminder, 'id' | 'completed'>) => {
    const newReminder = { ...reminderData, id: crypto.randomUUID(), completed: false };
    setReminders([...reminders, newReminder]);
    toast.success('Recordatorio agregado');
  };

  const handleToggleReminder = (id: string) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      toast.success(reminder.completed ? 'Recordatorio marcado como pendiente' : 'Recordatorio completado');
    }
  };

  const handleSaveHealthRecord = (recordData: Omit<HealthRecord, 'id'>) => {
    const newRecord = { ...recordData, id: crypto.randomUUID() };
    setHealthRecords([...healthRecords, newRecord]);
    toast.success('Registro de salud agregado');
  };

  const handleSaveRoutine = (routineData: Omit<Routine, 'id'>) => {
    const newRoutine = { ...routineData, id: crypto.randomUUID() };
    setRoutines([...routines, newRoutine]);
    toast.success('Rutina agregada');
  };

  const upcomingReminders = reminders
    .filter(r => !r.completed && new Date(r.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const overdueReminders = reminders.filter(r => !r.completed && isPast(new Date(r.date)));

  const handleLogin = (email: string, role: 'user' | 'admin') => {
    setCurrentUser({ email, role });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setPets([]);
    setReminders([]);
    setHealthRecords([]);
    setRoutines([]);
    toast.success('Sesión cerrada');
  };

  // Mostrar pantalla de login si no está autenticado
  if (!isAuthenticated) {
    return (
      <>
        <Toaster />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  // Mostrar panel de administrador
  if (currentUser?.role === 'admin') {
    return (
      <>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
          <header className="border-b-4 border-gradient-to-r from-red-300 via-yellow-300 to-blue-300 bg-white/80 backdrop-blur shadow-lg">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 p-2 rounded-xl shadow-lg">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 bg-clip-text text-transparent">
                  WardenPet
                </h1>
                <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white shadow">
                  Administrador
                </Badge>
              </div>
              <Button
                className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </header>
          <AdminPanel />
        </div>
      </>
    );
  }

  // Vista de usuario normal
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-8">
      <Toaster />

      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-2 rounded-xl shadow-lg">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">WardenPet</h1>
            </div>
            <p className="text-orange-700/70">Sistema de gestión y cuidado de mascotas</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {currentUser?.email}
              </p>
              <p className="text-xs text-muted-foreground">Usuario</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </header>

        {overdueReminders.length > 0 && (
          <Card className="border-2 border-amber-400 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <div className="bg-amber-400 p-2 rounded-lg animate-pulse">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                Recordatorios Vencidos ({overdueReminders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {overdueReminders.map(reminder => {
                  const pet = pets.find(p => p.id === reminder.petId);
                  return (
                    <div key={reminder.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200 shadow">
                      <div>
                        <p className="font-medium text-amber-900">{reminder.title}</p>
                        <p className="text-sm text-amber-700/70">
                          {pet?.name} - {format(new Date(reminder.date), "PPp", { locale: es })}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500"
                        onClick={() => handleToggleReminder(reminder.id)}
                      >
                        Completar
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Mascotas</CardTitle>
              <div className="bg-orange-400 p-2 rounded-lg">
                <PlusCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700">{pets.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-100 to-sky-100 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Recordatorios Activos</CardTitle>
              <div className="bg-blue-400 p-2 rounded-lg">
                <Bell className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">
                {reminders.filter(r => !r.completed).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-800">Registros de Salud</CardTitle>
              <div className="bg-pink-400 p-2 rounded-lg">
                <Heart className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-700">{healthRecords.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Rutinas Configuradas</CardTitle>
              <div className="bg-green-400 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{routines.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pets">Mis Mascotas</TabsTrigger>
            <TabsTrigger value="reminders">Recordatorios</TabsTrigger>
            <TabsTrigger value="health">Salud</TabsTrigger>
            <TabsTrigger value="routines">Rutinas</TabsTrigger>
          </TabsList>

          <TabsContent value="pets" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Mis Mascotas</h2>
              <Button
                onClick={() => { setEditingPet(null); setPetFormOpen(true); }}
                className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 shadow-lg"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Mascota
              </Button>
            </div>

            {pets.length === 0 ? (
              <Card className="bg-white/50 border-2 border-orange-100">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No tienes mascotas registradas aún</p>
                  <Button
                    className="mt-4 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 shadow-lg"
                    onClick={() => setPetFormOpen(true)}
                  >
                    Agregar tu primera mascota
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pets.map(pet => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onEdit={handleEditPet}
                    onDelete={handleDeletePet}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Recordatorios</h2>
              <Button
                onClick={() => setReminderFormOpen(true)}
                disabled={pets.length === 0}
                className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 shadow-lg"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Recordatorio
              </Button>
            </div>

            {pets.length === 0 ? (
              <Card className="bg-white/50 border-2 border-blue-100">
                <CardContent className="py-8 text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-muted-foreground">Primero agrega una mascota para crear recordatorios</p>
                </CardContent>
              </Card>
            ) : upcomingReminders.length === 0 ? (
              <Card className="bg-white/50 border-2 border-orange-100">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No tienes recordatorios próximos</p>
                  <Button
                    className="mt-4 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 shadow-lg"
                    onClick={() => setReminderFormOpen(true)}
                  >
                    Agregar recordatorio
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {upcomingReminders.map(reminder => {
                  const pet = pets.find(p => p.id === reminder.petId);
                  const reminderDate = new Date(reminder.date);
                  const isUrgent = isToday(reminderDate) || isTomorrow(reminderDate);

                  return (
                    <Card
                      key={reminder.id}
                      className={`${isUrgent ? 'border-2 border-red-400 bg-gradient-to-r from-red-50 to-orange-50' : 'bg-white/70 border-2 border-blue-100'} shadow-lg`}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                              {reminder.title}
                              {isUrgent && (
                                <Badge className="bg-gradient-to-r from-red-500 to-orange-500">
                                  Urgente
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>
                              {pet?.name} - {format(reminderDate, "PPp", { locale: es })}
                            </CardDescription>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500"
                            onClick={() => handleToggleReminder(reminder.id)}
                          >
                            Completar
                          </Button>
                        </div>
                      </CardHeader>
                      {reminder.description && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{reminder.description}</p>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Registros de Salud</h2>
              <Button
                onClick={() => setHealthFormOpen(true)}
                disabled={pets.length === 0}
                className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 shadow-lg"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Registro
              </Button>
            </div>

            {pets.length === 0 ? (
              <Card className="bg-white/50 border-2 border-pink-100">
                <CardContent className="py-8 text-center">
                  <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-pink-500" />
                  </div>
                  <p className="text-muted-foreground">Primero agrega una mascota para crear registros de salud</p>
                </CardContent>
              </Card>
            ) : healthRecords.length === 0 ? (
              <Card className="bg-white/50 border-2 border-orange-100">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No tienes registros de salud</p>
                  <Button
                    className="mt-4 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 shadow-lg"
                    onClick={() => setHealthFormOpen(true)}
                  >
                    Agregar primer registro
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {healthRecords
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map(record => {
                    const pet = pets.find(p => p.id === record.petId);
                    return (
                      <Card key={record.id} className="bg-white/70 border-2 border-pink-100 shadow-lg">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-pink-800">{pet?.name}</CardTitle>
                              <CardDescription>
                                {format(new Date(record.date), "PPp", { locale: es })}
                              </CardDescription>
                            </div>
                            {record.temperature && (
                              <Badge className="bg-gradient-to-r from-pink-400 to-rose-400 text-white">
                                {record.temperature}°C
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm"><span className="font-medium">Síntomas:</span> {record.symptoms}</p>
                          {record.notes && (
                            <p className="text-sm text-muted-foreground">{record.notes}</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="routines" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Rutinas Diarias</h2>
              <Button
                onClick={() => setRoutineFormOpen(true)}
                disabled={pets.length === 0}
                className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 shadow-lg"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Rutina
              </Button>
            </div>

            {pets.length === 0 ? (
              <Card className="bg-white/50 border-2 border-green-100">
                <CardContent className="py-8 text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-muted-foreground">Primero agrega una mascota para crear rutinas</p>
                </CardContent>
              </Card>
            ) : routines.length === 0 ? (
              <Card className="bg-white/50 border-2 border-orange-100">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No tienes rutinas configuradas</p>
                  <Button
                    className="mt-4 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 shadow-lg"
                    onClick={() => setRoutineFormOpen(true)}
                  >
                    Agregar primera rutina
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pets.map(pet => {
                  const petRoutines = routines.filter(r => r.petId === pet.id);
                  if (petRoutines.length === 0) return null;

                  return (
                    <Card key={pet.id} className="bg-white/70 border-2 border-green-100 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-green-800">{pet.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {petRoutines
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map(routine => (
                            <div key={routine.id} className="flex items-center gap-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                              <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-white">
                                {routine.time}
                              </Badge>
                              <div className="flex-1">
                                <p className="text-sm font-medium capitalize">{routine.type}</p>
                                <p className="text-sm text-muted-foreground">{routine.description}</p>
                              </div>
                            </div>
                          ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <PetForm
        open={petFormOpen}
        onClose={() => { setPetFormOpen(false); setEditingPet(null); }}
        onSave={handleSavePet}
        editingPet={editingPet}
      />

      <ReminderForm
        open={reminderFormOpen}
        onClose={() => setReminderFormOpen(false)}
        onSave={handleSaveReminder}
        pets={pets.map(p => ({ id: p.id, name: p.name }))}
      />

      <HealthRecordForm
        open={healthFormOpen}
        onClose={() => setHealthFormOpen(false)}
        onSave={handleSaveHealthRecord}
        pets={pets.map(p => ({ id: p.id, name: p.name }))}
      />

      <RoutineForm
        open={routineFormOpen}
        onClose={() => setRoutineFormOpen(false)}
        onSave={handleSaveRoutine}
        pets={pets.map(p => ({ id: p.id, name: p.name }))}
      />

      <PetDetails
        pet={selectedPet}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        reminders={reminders}
        healthRecords={healthRecords}
        routines={routines}
        onToggleReminder={handleToggleReminder}
      />
    </div>
  );
}