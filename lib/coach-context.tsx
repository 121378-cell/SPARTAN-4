// Contexto para manejar coaches en la aplicación SPARTAN 4
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  Coach, 
  PREDEFINED_COACHES, 
  getCoachById,
  CoachPreferences,
  selectBestCoach
} from "./coaches";

// Definir el tipo para el contexto
type User = {
  id: string;
  email: string;
  name: string;
  preferredCoach?: Coach;
};

interface CoachContextType {
  selectedCoach: Coach | null;
  recommendedCoach: Coach | null;
  allCoaches: Coach[];
  selectCoach: (coach: Coach) => void;
  getRecommendedCoach: (preferences: CoachPreferences) => Coach;
  clearSelectedCoach: () => void;
  isLoading: boolean;
}

// Crear el contexto
const CoachContext = createContext<CoachContextType | undefined>(undefined);

// Proveedor del contexto
export function CoachProvider({ children }: { children: ReactNode }) {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [recommendedCoach, setRecommendedCoach] = useState<Coach | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Simulamos un usuario básico para esta implementación
  const user: User | null = null;

  // Efecto para cargar el coach seleccionado del usuario
  useEffect(() => {
    const loadUserCoach = () => {
      // En esta implementación simplificada, siempre cargamos desde localStorage
      // La integración completa con autenticación se hará en una fase posterior
      setIsLoading(false);
    };

    loadUserCoach();
  }, []);

  // Función para seleccionar un coach
  const selectCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setRecommendedCoach(null);
    
    // Aquí podrías guardar la selección en el backend o localStorage
    // Por ahora lo guardamos en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('spartan4_selected_coach', JSON.stringify({
        ...coach,
        selectionDate: new Date().toISOString()
      }));
    }
  };

  // Función para obtener un coach recomendado
  const getRecommendedCoach = (preferences: CoachPreferences): Coach => {
    const recommendation = selectBestCoach(preferences);
    setRecommendedCoach(recommendation.coach);
    return recommendation.coach;
  };

  // Función para limpiar el coach seleccionado
  const clearSelectedCoach = () => {
    setSelectedCoach(null);
    setRecommendedCoach(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spartan4_selected_coach');
    }
  };

  // Cargar coach desde localStorage si existe
  useEffect(() => {
    const loadStoredCoach = () => {
      if (typeof window !== 'undefined') {
        const storedCoach = localStorage.getItem('spartan4_selected_coach');
        if (storedCoach) {
          try {
            const coachData = JSON.parse(storedCoach);
            // Convertir fechas
            if (coachData.createdAt) coachData.createdAt = new Date(coachData.createdAt);
            if (coachData.updatedAt) coachData.updatedAt = new Date(coachData.updatedAt);
            if (coachData.selectionDate) coachData.selectionDate = new Date(coachData.selectionDate);
            
            setSelectedCoach(coachData);
          } catch (error) {
            console.error('Error parsing stored coach:', error);
            localStorage.removeItem('spartan4_selected_coach');
          }
        }
      }
      setIsLoading(false);
    };

    loadStoredCoach();
  }, []);

  const value = {
    selectedCoach,
    recommendedCoach,
    allCoaches: PREDEFINED_COACHES,
    selectCoach,
    getRecommendedCoach,
    clearSelectedCoach,
    isLoading
  };

  return (
    <CoachContext.Provider value={value}>
      {children}
    </CoachContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useCoach() {
  const context = useContext(CoachContext);
  if (context === undefined) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  return context;
}

// Hook para obtener un coach específico por ID
export function useCoachById(id: string) {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoach = () => {
      try {
        const foundCoach = getCoachById(id);
        setCoach(foundCoach || null);
      } catch (error) {
        console.error('Error fetching coach:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoach();
    } else {
      setLoading(false);
    }
  }, [id]);

  return { coach, loading };
}