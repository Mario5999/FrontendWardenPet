import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dog, Cat, Rabbit, Bird, Edit, Trash2, Activity } from "lucide-react";

interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';
  age: number;
  breed?: string;
  weight?: number;
  image?: string;
}

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onDelete: (id: string) => void;
  onViewDetails: (pet: Pet) => void;
}

const petIcons = {
  dog: Dog,
  cat: Cat,
  rabbit: Rabbit,
  bird: Bird,
  other: Activity
};

const petColors = {
  dog: 'from-amber-100 to-orange-100 border-amber-200',
  cat: 'from-purple-100 to-pink-100 border-purple-200',
  rabbit: 'from-green-100 to-emerald-100 border-green-200',
  bird: 'from-sky-100 to-blue-100 border-sky-200',
  other: 'from-gray-100 to-slate-100 border-gray-200'
};

export function PetCard({ pet, onEdit, onDelete, onViewDetails }: PetCardProps) {
  const Icon = petIcons[pet.type];

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 bg-gradient-to-br ${petColors[pet.type]}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {pet.image ? (
              <Image
                src={pet.image}
                alt={pet.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                <Icon className="h-7 w-7 text-orange-500" />
              </div>
            )}
            <div>
              <CardTitle className="text-xl">{pet.name}</CardTitle>
              <Badge variant="secondary" className="mt-1 bg-white/80">
                {pet.age} {pet.age === 1 ? 'año' : 'años'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {pet.breed && (
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">Raza:</span> {pet.breed}
            </p>
          )}
          {pet.weight && (
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">Peso:</span> {pet.weight} kg
            </p>
          )}
          <div className="flex gap-2 mt-4 pt-2 border-t border-white/50">
            <Button
              size="sm"
              onClick={() => onViewDetails(pet)}
              className="flex-1 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white shadow-md"
            >
              Ver Detalles
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(pet)}
              className="bg-white/80 hover:bg-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onDelete(pet.id)}
              className="bg-white/80 hover:bg-white hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
