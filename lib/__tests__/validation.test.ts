// Tests para el sistema de validación
import { FormValidator, validationRules, formValidations, validationUtils } from '../validation';

describe('FormValidator', () => {
  let validator: FormValidator;

  beforeEach(() => {
    validator = new FormValidator();
  });

  describe('validateField', () => {
    it('should validate required fields', () => {
      const error = validator.validateField('name', '', [validationRules.required()]);
      expect(error).toBe('Este campo es requerido');
    });

    it('should validate minLength', () => {
      const error = validator.validateField('name', 'a', [validationRules.minLength(2)]);
      expect(error).toBe('Debe tener al menos 2 caracteres');
    });

    it('should validate maxLength', () => {
      const error = validator.validateField('name', 'a'.repeat(51), [validationRules.maxLength(50)]);
      expect(error).toBe('No puede tener más de 50 caracteres');
    });

    it('should validate min value', () => {
      const error = validator.validateField('age', 10, [validationRules.min(13)]);
      expect(error).toBe('Debe ser mayor o igual a 13');
    });

    it('should validate max value', () => {
      const error = validator.validateField('age', 130, [validationRules.max(120)]);
      expect(error).toBe('Debe ser menor o igual a 120');
    });

    it('should validate email pattern', () => {
      const error = validator.validateField('email', 'invalid-email', [validationRules.email()]);
      expect(error).toBe('Email inválido');
    });

    it('should validate custom rules', () => {
      const customRule = {
        custom: (value: any) => value === 'test' ? null : 'Must be "test"'
      };
      const error = validator.validateField('field', 'wrong', [customRule]);
      expect(error).toBe('Must be "test"');
    });

    it('should return null for valid values', () => {
      const error = validator.validateField('name', 'John Doe', [
        validationRules.required(),
        validationRules.minLength(2),
        validationRules.maxLength(50)
      ]);
      expect(error).toBeNull();
    });
  });

  describe('validate', () => {
    it('should validate multiple fields', () => {
      const fields = [
        { name: 'name', value: '', rules: [validationRules.required()] },
        { name: 'email', value: 'invalid', rules: [validationRules.email()] }
      ];

      const errors = validator.validate(fields);
      expect(errors).toEqual({
        name: 'Este campo es requerido',
        email: 'Email inválido'
      });
    });

    it('should return empty object for valid fields', () => {
      const fields = [
        { name: 'name', value: 'John Doe', rules: [validationRules.required()] },
        { name: 'email', value: 'john@example.com', rules: [validationRules.email()] }
      ];

      const errors = validator.validate(fields);
      expect(errors).toEqual({});
    });
  });
});

describe('validationRules', () => {
  describe('email', () => {
    it('should validate correct email formats', () => {
      const rule = validationRules.email();
      const validator = new FormValidator();
      
      expect(validator.validateField('email', 'test@example.com', [rule])).toBeNull();
      expect(validator.validateField('email', 'user.name@domain.co.uk', [rule])).toBeNull();
    });

    it('should reject invalid email formats', () => {
      const rule = validationRules.email();
      const validator = new FormValidator();
      
      expect(validator.validateField('email', 'invalid-email', [rule])).toBe('Email inválido');
      expect(validator.validateField('email', '@example.com', [rule])).toBe('Email inválido');
      expect(validator.validateField('email', 'test@', [rule])).toBe('Email inválido');
    });
  });

  describe('password', () => {
    it('should validate password length', () => {
      const rule = validationRules.password();
      const validator = new FormValidator();
      
      expect(validator.validateField('password', '123456', [rule])).toBeNull();
      expect(validator.validateField('password', '12345', [rule])).toBe('La contraseña debe tener al menos 6 caracteres');
    });
  });

  describe('age', () => {
    it('should validate age range', () => {
      const rule = validationRules.age();
      const validator = new FormValidator();
      
      expect(validator.validateField('age', 25, [rule])).toBeNull();
      expect(validator.validateField('age', 12, [rule])).toBe('La edad debe estar entre 13 y 120 años');
      expect(validator.validateField('age', 121, [rule])).toBe('La edad debe estar entre 13 y 120 años');
    });
  });
});

describe('formValidations', () => {
  describe('register', () => {
    it('should validate registration form', () => {
      const validator = new FormValidator();
      const fields = [
        { name: 'name', value: 'John Doe', rules: formValidations.register.name },
        { name: 'email', value: 'john@example.com', rules: formValidations.register.email },
        { name: 'password', value: 'password123', rules: formValidations.register.password },
        { name: 'confirmPassword', value: 'password123', rules: formValidations.register.confirmPassword }
      ];

      const errors = validator.validate(fields);
      expect(errors).toEqual({});
    });

    it('should catch registration form errors', () => {
      const validator = new FormValidator();
      const fields = [
        { name: 'name', value: '', rules: formValidations.register.name },
        { name: 'email', value: 'invalid-email', rules: formValidations.register.email },
        { name: 'password', value: '123', rules: formValidations.register.password },
        { name: 'confirmPassword', value: '456', rules: formValidations.register.confirmPassword }
      ];

      const errors = validator.validate(fields);
      expect(errors.name).toBe('El nombre es requerido');
      expect(errors.email).toBe('Email inválido');
      expect(errors.password).toBe('La contraseña debe tener al menos 6 caracteres');
      expect(errors.confirmPassword).toBe('La contraseña debe tener al menos 6 caracteres');
    });
  });
});

describe('validationUtils', () => {
  describe('passwordsMatch', () => {
    it('should return null for matching passwords', () => {
      expect(validationUtils.passwordsMatch('password123', 'password123')).toBeNull();
    });

    it('should return error for non-matching passwords', () => {
      expect(validationUtils.passwordsMatch('password123', 'password456')).toBe('Las contraseñas no coinciden');
    });
  });

  describe('validateAgeFromBirthDate', () => {
    it('should validate age from birth date', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      
      expect(validationUtils.validateAgeFromBirthDate(birthDate)).toBeNull();
    });

    it('should reject too young age', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 10);
      
      expect(validationUtils.validateAgeFromBirthDate(birthDate)).toBe('Debes tener al menos 13 años');
    });

    it('should reject too old age', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 130);
      
      expect(validationUtils.validateAgeFromBirthDate(birthDate)).toBe('Edad inválida');
    });
  });

  describe('validateBMI', () => {
    it('should validate normal BMI', () => {
      expect(validationUtils.validateBMI(70, 175)).toBeNull();
    });

    it('should reject too low BMI', () => {
      expect(validationUtils.validateBMI(30, 180)).toBe('IMC muy bajo (menos de 15)');
    });

    it('should reject too high BMI', () => {
      expect(validationUtils.validateBMI(200, 150)).toBe('IMC muy alto (más de 50)');
    });
  });

  describe('validateDateRange', () => {
    it('should validate correct date range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      
      expect(validationUtils.validateDateRange(startDate, endDate)).toBeNull();
    });

    it('should reject invalid date range', () => {
      const startDate = new Date('2024-01-31');
      const endDate = new Date('2024-01-01');
      
      expect(validationUtils.validateDateRange(startDate, endDate)).toBe('La fecha de inicio debe ser anterior a la fecha de fin');
    });
  });
});

