import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Users, Trash2, Activity, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  lastLogin: string;
}

export function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);
  };

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    const updatedUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Eliminar también los datos de la mascota del usuario
    const allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (user) {
      delete allUserData[user.email];
      localStorage.setItem('userData', JSON.stringify(allUserData));
    }

    setUsers(updatedUsers);
    toast.success('Usuario eliminado correctamente');
  };

  const isInactive = (lastLogin: string) => {
    const daysSinceLogin = Math.floor(
      (new Date().getTime() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceLogin > 30; // Inactivo si no ha entrado en 30 días
  };

  const activeUsers = users.filter(u => !isInactive(u.lastLogin));
  const inactiveUsers = users.filter(u => isInactive(u.lastLogin));

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 bg-clip-text text-transparent">
              Panel de Administración
            </h1>
            <p className="text-red-700/70">Gestión de usuarios de WardenPet</p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-300 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Total Usuarios</CardTitle>
              <div className="bg-red-500 p-2 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-100 to-emerald-200 border-2 border-green-300 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Usuarios Activos</CardTitle>
              <div className="bg-green-500 p-2 rounded-lg">
                <UserCheck className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{activeUsers.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-100 to-amber-200 border-2 border-yellow-300 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Usuarios Inactivos</CardTitle>
              <div className="bg-yellow-500 p-2 rounded-lg">
                <UserX className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700">{inactiveUsers.length}</div>
              <p className="text-xs text-yellow-700/70 mt-1">+30 días sin actividad</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 border-2 border-blue-200 shadow-xl backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100 border-b-2 border-blue-200">
            <CardTitle className="text-2xl text-blue-800">Lista de Usuarios</CardTitle>
            <CardDescription className="text-blue-700/70">
              Gestiona los usuarios registrados en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {users.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-red-100 to-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-red-600" />
                </div>
                <p className="text-muted-foreground">No hay usuarios registrados</p>
              </div>
            ) : (
              <div className="rounded-lg border-2 border-blue-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-100 hover:to-cyan-100">
                      <TableHead className="font-bold text-blue-900">Nombre</TableHead>
                      <TableHead className="font-bold text-blue-900">Email</TableHead>
                      <TableHead className="font-bold text-blue-900">Estado</TableHead>
                      <TableHead className="font-bold text-blue-900">Fecha de Registro</TableHead>
                      <TableHead className="font-bold text-blue-900">Último Acceso</TableHead>
                      <TableHead className="text-right font-bold text-blue-900">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => {
                      const inactive = isInactive(user.lastLogin);
                      const rowColor = index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-r from-blue-50/30 to-cyan-50/30';
                      return (
                        <TableRow key={user.id} className={`${rowColor} hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 transition-all`}>
                          <TableCell className="font-medium text-blue-900">{user.name}</TableCell>
                          <TableCell className="text-blue-800">{user.email}</TableCell>
                          <TableCell>
                            {inactive ? (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow">
                                <Activity className="mr-1 h-3 w-3" />
                                Inactivo
                              </Badge>
                            ) : (
                              <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-white border-0 shadow">
                                <Activity className="mr-1 h-3 w-3" />
                                Activo
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-blue-800">
                            {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: es })}
                          </TableCell>
                          <TableCell className="text-blue-800">
                            {formatDistanceToNow(new Date(user.lastLogin), {
                              addSuffix: true,
                              locale: es
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  className={inactive
                                    ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg"
                                    : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-red-500 hover:to-rose-500 hover:text-white shadow"}
                                  size="sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="border-2 border-red-200">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-red-700">¿Eliminar usuario?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción eliminará permanentemente la cuenta de <strong>{user.name}</strong> y
                                    todos los datos asociados (mascotas, recordatorios, registros de salud, etc.).
                                    Esta acción no se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteUser(user.id)}
                                    className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
