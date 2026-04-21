"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Upload, X } from "lucide-react";

interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';
  age: number;
  breed?: string;
  weight?: number;
  image?: string;
}

interface PetFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (pet: Omit<Pet, 'id'> | Pet) => void;
  editingPet?: Pet | null;
}

export function PetForm({ open, onClose, onSave, editingPet }: PetFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Pet['type']>('dog');
  const [age, setAge] = useState(0);
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState(0);
  const [image, setImage] = useState('');

useEffect(() => {
  const loadForm = () => {
    if (open) {
      if (editingPet) {
        setName(editingPet.name);
        setType(editingPet.type);
        setAge(editingPet.age);
        setBreed(editingPet.breed || '');
        setWeight(editingPet.weight || 0);
        setImage(editingPet.image || '');
      } else {
        setName('');
        setType('dog');
        setAge(0);
        setBreed('');
        setWeight(0);
        setImage('');
      }
    }
  };

  loadForm();
}, [editingPet, open]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const petData = {
      name,
      type,
      age: Number(age),
      breed: breed || undefined,
      weight: weight ? Number(weight) : undefined,
      image: image || undefined
    };

    if (editingPet) {
      onSave({ ...petData, id: editingPet.id });
    } else {
      onSave(petData);
    }

    handleClose();
  };

  const handleClose = () => {
    setName('');
    setType('dog');
    setAge(0);
    setBreed('');
    setWeight(0);
    setImage('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{editingPet ? 'Editar Mascota' : 'Agregar Nueva Mascota'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {image ? (
                <div className="relative">
                  <Image
                    src={image}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full object-cover border-4 border-orange-200 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                    title="Eliminar imagen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center border-4 border-orange-200 shadow-lg">
                  <Upload className="h-12 w-12 text-orange-400" />
                </div>
              )}
            </div>
            <Label htmlFor="image" className="cursor-pointer">
              <div className="px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-lg hover:from-orange-500 hover:to-amber-500 transition-all shadow-md">
                {image ? 'Cambiar Foto' : 'Subir Foto'}
              </div>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </Label>
          </div>

          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo de Mascota *</Label>
            <Select value={type} onValueChange={(value: string) => setType(value as Pet['type'])}>
              <SelectTrigger className="border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">🐕 Perro</SelectItem>
                <SelectItem value="cat">🐈 Gato</SelectItem>
                <SelectItem value="rabbit">🐇 Conejo</SelectItem>
                <SelectItem value="bird">🐦 Pájaro</SelectItem>
                <SelectItem value="other">🐾 Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Edad (años) *</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                required
                className="border-orange-200 focus:border-orange-400"
              />
            </div>

            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight || ''}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="breed">Raza</Label>
            <Input
              id="breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500" title="Guardar mascota">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
