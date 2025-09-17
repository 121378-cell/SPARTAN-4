// CoachGallery - Galería para mostrar todos los coaches disponibles
import { useState } from "react";
import { Card, CardContent } from "./ui";
import { Button } from "./ui";
import { Input } from "./ui";
import { 
  Coach, 
  CoachSpecialty, 
  CoachPersonality,
  PREDEFINED_COACHES
} from "../lib/coaches";
import CoachProfile from "./CoachProfile";

interface CoachGalleryProps {
  onCoachSelect?: (coach: Coach) => void;
  selectedCoach?: Coach | null;
}

export default function CoachGallery({ onCoachSelect, selectedCoach }: CoachGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<CoachSpecialty | "all">("all");
  const [selectedPersonality, setSelectedPersonality] = useState<CoachPersonality | "all">("all");

  // Filtrar coaches según criterios
  const filteredCoaches = PREDEFINED_COACHES.filter(coach => {
    // Filtrar por término de búsqueda
    const matchesSearch = 
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por especialidad
    const matchesSpecialty = selectedSpecialty === "all" || coach.specialty === selectedSpecialty;
    
    // Filtrar por personalidad
    const matchesPersonality = selectedPersonality === "all" || coach.personality === selectedPersonality;
    
    return matchesSearch && matchesSpecialty && matchesPersonality;
  });

  // Obtener especialidades únicas
  const specialties = Array.from(
    new Set(PREDEFINED_COACHES.map(coach => coach.specialty))
  );

  // Obtener personalidades únicas
  const personalities = Array.from(
    new Set(PREDEFINED_COACHES.map(coach => coach.personality))
  );

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="bg-gray-50 border-0">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Buscador */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar Coach
              </label>
              <Input
                placeholder="Nombre, especialidad o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            {/* Filtro por Especialidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value as CoachSpecialty | "all")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas las especialidades</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {getSpecialtyDisplayName(specialty)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtro por Personalidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personalidad
              </label>
              <select
                value={selectedPersonality}
                onChange={(e) => setSelectedPersonality(e.target.value as CoachPersonality | "all")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas las personalidades</option>
                {personalities.map(personality => (
                  <option key={personality} value={personality}>
                    {getPersonalityDisplayName(personality)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="space-y-4">
        {filteredCoaches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron coaches</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {filteredCoaches.length} Coach{filteredCoaches.length !== 1 ? 'es' : ''} Disponible{filteredCoaches.length !== 1 ? 's' : ''}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCoaches.map(coach => (
                <CoachProfile
                  key={coach.id}
                  coach={coach}
                  isSelected={selectedCoach?.id === coach.id}
                  onSelect={onCoachSelect}
                  showSelectButton={!!onCoachSelect}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Funciones auxiliares para mostrar nombres
const getSpecialtyDisplayName = (specialty: string): string => {
  const names: Record<string, string> = {
    'strength': 'Fuerza',
    'calisthenics': 'Calistenia',
    'yoga': 'Yoga',
    'nutrition': 'Nutrición',
    'psychology': 'Psicología'
  };
  return names[specialty] || specialty;
};

const getPersonalityDisplayName = (personality: string): string => {
  const names: Record<string, string> = {
    'motivational': 'Motivacional',
    'scientific': 'Científico',
    'mindful': 'Consciente',
    'disciplinarian': 'Disciplinario',
    'adaptive': 'Adaptativo'
  };
  return names[personality] || personality;
};