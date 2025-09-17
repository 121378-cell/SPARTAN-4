// Hook personalizado para manejar la selección de coaches en SPARTAN 4
import { useState, useEffect } from "react";
import { 
  Coach, 
  CoachPreferences, 
  CoachSelectionResult,
  selectBestCoach,
  PREDEFINED_COACHES,
  getCoachesBySpecialty
} from "./coaches";

export function useCoachSelection() {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [preferences, setPreferences] = useState<CoachPreferences>({
    specialty: 'strength',
    personality: 'motivational',
    language: 'es',
    experienceLevel: 'beginner',
    goals: [],
    communicationStyle: 'encouraging'
  });
  const [recommendation, setRecommendation] = useState<CoachSelectionResult | null>(null);
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para filtrar coaches cuando cambia la especialidad
  useEffect(() => {
    const coaches = getCoachesBySpecialty(preferences.specialty);
    setFilteredCoaches(coaches);
  }, [preferences.specialty]);

  // Efecto para calcular recomendación cuando cambian las preferencias
  useEffect(() => {
    if (preferences.specialty && preferences.personality) {
      setIsLoading(true);
      // Simulamos un pequeño retraso para mejor UX
      const timer = setTimeout(() => {
        const result = selectBestCoach(preferences);
        setRecommendation(result);
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [preferences]);

  // Función para actualizar preferencias
  const updatePreferences = (field: keyof CoachPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para seleccionar un coach
  const selectCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('spartan4_selected_coach', JSON.stringify({
        ...coach,
        selectionDate: new Date().toISOString()
      }));
    }
  };

  // Función para limpiar la selección
  const clearSelection = () => {
    setSelectedCoach(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spartan4_selected_coach');
    }
  };

  // Función para cargar coach seleccionado desde localStorage
  const loadStoredCoach = (): Coach | null => {
    if (typeof window !== 'undefined') {
      const storedCoach = localStorage.getItem('spartan4_selected_coach');
      if (storedCoach) {
        try {
          const coachData = JSON.parse(storedCoach);
          // Convertir fechas
          if (coachData.createdAt) coachData.createdAt = new Date(coachData.createdAt);
          if (coachData.updatedAt) coachData.updatedAt = new Date(coachData.updatedAt);
          if (coachData.selectionDate) coachData.selectionDate = new Date(coachData.selectionDate);
          
          return coachData;
        } catch (error) {
          console.error('Error parsing stored coach:', error);
          localStorage.removeItem('spartan4_selected_coach');
        }
      }
    }
    return null;
  };

  // Cargar coach almacenado al inicio
  useEffect(() => {
    const storedCoach = loadStoredCoach();
    if (storedCoach) {
      setSelectedCoach(storedCoach);
    }
  }, []);

  return {
    // Estados
    selectedCoach,
    preferences,
    recommendation,
    filteredCoaches,
    isLoading,
    
    // Funciones
    updatePreferences,
    selectCoach,
    clearSelection,
    loadStoredCoach,
    
    // Datos
    allCoaches: PREDEFINED_COACHES
  };
}