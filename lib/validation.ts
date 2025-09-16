// Sistema de validación de formularios
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormField {
  name: string;
  value: any;
  rules?: ValidationRule[];
}

// Reglas de validación comunes
export const validationRules = {
  required: (message = 'Este campo es requerido'): ValidationRule => ({
    required: true,
    message
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    minLength: min,
    message: message || `Debe tener al menos ${min} caracteres`
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    maxLength: max,
    message: message || `No puede tener más de ${max} caracteres`
  }),
  
  min: (min: number, message?: string): ValidationRule => ({
    min,
    message: message || `Debe ser mayor o igual a ${min}`
  }),
  
  max: (max: number, message?: string): ValidationRule => ({
    max,
    message: message || `Debe ser menor o igual a ${max}`
  }),
  
  email: (message = 'Email inválido'): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message
  }),
  
  password: (message = 'La contraseña debe tener al menos 6 caracteres'): ValidationRule => ({
    minLength: 6,
    message
  }),
  
  age: (message = 'La edad debe estar entre 13 y 120 años'): ValidationRule => ({
    min: 13,
    max: 120,
    message
  }),
  
  weight: (message = 'El peso debe estar entre 30 y 300 kg'): ValidationRule => ({
    min: 30,
    max: 300,
    message
  }),
  
  height: (message = 'La altura debe estar entre 100 y 250 cm'): ValidationRule => ({
    min: 100,
    max: 250,
    message
  }),
  
  phone: (message = 'Número de teléfono inválido'): ValidationRule => ({
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message
  }),
  
  url: (message = 'URL inválida'): ValidationRule => ({
    pattern: /^https?:\/\/.+/,
    message
  })
};

// Clase para manejar validaciones
export class FormValidator {
  private errors: ValidationErrors = {};
  
  validate(fields: FormField[]): ValidationErrors {
    this.errors = {};
    
    fields.forEach(field => {
      if (field.rules) {
        const fieldError = this.validateField(field);
        if (fieldError) {
          this.errors[field.name] = fieldError;
        }
      }
    });
    
    return this.errors;
  }
  
  private validateField(field: FormField): string | null {
    const { name, value, rules = [] } = field;
    
    for (const rule of rules) {
      const error = this.validateRule(value, rule);
      if (error) {
        return error;
      }
    }
    
    return null;
  }
  
  private validateRule(value: any, rule: ValidationRule): string | null {
    // Validación de campo requerido
    if (rule.required && (value === null || value === undefined || value === '')) {
      return rule.message || 'Este campo es requerido';
    }
    
    // Si el valor está vacío y no es requerido, no validar más
    if (!rule.required && (value === null || value === undefined || value === '')) {
      return null;
    }
    
    // Validación de longitud mínima
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return rule.message || `Debe tener al menos ${rule.minLength} caracteres`;
    }
    
    // Validación de longitud máxima
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return rule.message || `No puede tener más de ${rule.maxLength} caracteres`;
    }
    
    // Validación de valor mínimo
    if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
      return rule.message || `Debe ser mayor o igual a ${rule.min}`;
    }
    
    // Validación de valor máximo
    if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
      return rule.message || `Debe ser menor o igual a ${rule.max}`;
    }
    
    // Validación de patrón
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return rule.message || 'Formato inválido';
    }
    
    // Validación personalizada
    if (rule.custom) {
      return rule.custom(value);
    }
    
    return null;
  }
  
  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }
  
  getErrors(): ValidationErrors {
    return this.errors;
  }
  
  getError(fieldName: string): string | null {
    return this.errors[fieldName] || null;
  }
  
  clearErrors(): void {
    this.errors = {};
  }
}

// Validaciones específicas para formularios de la aplicación
export const formValidations = {
  // Validación de registro de usuario
  register: {
    name: [
      validationRules.required('El nombre es requerido'),
      validationRules.minLength(2, 'El nombre debe tener al menos 2 caracteres'),
      validationRules.maxLength(50, 'El nombre no puede tener más de 50 caracteres')
    ],
    email: [
      validationRules.required('El email es requerido'),
      validationRules.email()
    ],
    password: [
      validationRules.required('La contraseña es requerida'),
      validationRules.password()
    ],
    confirmPassword: [
      validationRules.required('Confirma tu contraseña'),
      validationRules.password()
    ]
  },
  
  // Validación de perfil de usuario
  profile: {
    name: [
      validationRules.required('El nombre es requerido'),
      validationRules.minLength(2, 'El nombre debe tener al menos 2 caracteres'),
      validationRules.maxLength(50, 'El nombre no puede tener más de 50 caracteres')
    ],
    age: [
      validationRules.required('La edad es requerida'),
      validationRules.age()
    ],
    weight: [
      validationRules.required('El peso es requerido'),
      validationRules.weight()
    ],
    height: [
      validationRules.required('La altura es requerida'),
      validationRules.height()
    ]
  },
  
  // Validación de objetivos de macros
  macroGoals: {
    calories: [
      validationRules.required('Las calorías son requeridas'),
      validationRules.min(500, 'Las calorías deben ser al menos 500'),
      validationRules.max(5000, 'Las calorías no pueden ser más de 5000')
    ],
    protein: [
      validationRules.required('La proteína es requerida'),
      validationRules.min(20, 'La proteína debe ser al menos 20g'),
      validationRules.max(500, 'La proteína no puede ser más de 500g')
    ],
    carbs: [
      validationRules.required('Los carbohidratos son requeridos'),
      validationRules.min(50, 'Los carbohidratos deben ser al menos 50g'),
      validationRules.max(1000, 'Los carbohidratos no pueden ser más de 1000g')
    ],
    fats: [
      validationRules.required('Las grasas son requeridas'),
      validationRules.min(20, 'Las grasas deben ser al menos 20g'),
      validationRules.max(300, 'Las grasas no pueden ser más de 300g')
    ]
  },
  
  // Validación de análisis de sangre
  bloodTest: {
    value: [
      validationRules.required('El valor es requerido'),
      validationRules.min(0, 'El valor debe ser positivo')
    ]
  }
};

// Hook personalizado para validación de formularios
export function useFormValidation() {
  const validator = new FormValidator();
  
  const validateForm = (fields: FormField[]): ValidationErrors => {
    return validator.validate(fields);
  };
  
  const validateField = (name: string, value: any, rules: ValidationRule[]): string | null => {
    return validator.validate([{ name, value, rules }])[name] || null;
  };
  
  return {
    validateForm,
    validateField,
    hasErrors: () => validator.hasErrors(),
    getErrors: () => validator.getErrors(),
    getError: (fieldName: string) => validator.getError(fieldName),
    clearErrors: () => validator.clearErrors()
  };
}

// Utilidades de validación
export const validationUtils = {
  // Validar contraseñas coincidentes
  passwordsMatch: (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  },
  
  // Validar edad basada en fecha de nacimiento
  validateAgeFromBirthDate: (birthDate: Date): string | null => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return 'Fecha de nacimiento inválida';
    }
    
    if (age < 13) {
      return 'Debes tener al menos 13 años';
    }
    
    if (age > 120) {
      return 'Edad inválida';
    }
    
    return null;
  },
  
  // Validar IMC
  validateBMI: (weight: number, height: number): string | null => {
    const bmi = weight / Math.pow(height / 100, 2);
    
    if (bmi < 15) {
      return 'IMC muy bajo (menos de 15)';
    }
    
    if (bmi > 50) {
      return 'IMC muy alto (más de 50)';
    }
    
    return null;
  },
  
  // Validar rango de fechas
  validateDateRange: (startDate: Date, endDate: Date): string | null => {
    if (startDate >= endDate) {
      return 'La fecha de inicio debe ser anterior a la fecha de fin';
    }
    
    return null;
  }
};

