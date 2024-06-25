import type { InputValidator } from '@/types/form-validators';

interface Validators {
  email: InputValidator;
  password: InputValidator;
  spainPhoneNumber: InputValidator;
  username: InputValidator;
  nonNegativeNumber: InputValidator;
}

const validators: Validators = {
  email: {
    validate: (value: string): boolean => {
      const pattern = /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,})+$/;
      return pattern.test(value);
    },
    errorMessage: 'Ingresa una dirección de correo válido',
  },
  password: {
    validate: (value: string): boolean => {
      const pattern = /.{8,}/;
      return pattern.test(value);
    },
    errorMessage: 'Ingresa una contraseña de al menos 8 caracteres',
  },
  spainPhoneNumber: {
    validate: (value: string): boolean => {
      const pattern = /^(?:(?:\+|00)34[-\s]?)?(?:[6]\d{8}|[89]\d{8})$/;
      return pattern.test(value);
    },
    errorMessage: 'Ingresa un número de teléfono válido en España',
  },
  username: {
    validate: (value: string): boolean => {
      const pattern = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]{4,}$/;
      return pattern.test(value);
    },
    errorMessage: 'Ingresa solo letras y al menos 4 caracteres',
  },
  nonNegativeNumber: {
    validate: (value: string): boolean => {
      const number = Number(value);
      return !Number.isNaN(number) && number >= 0;
    },
    errorMessage: 'Ingresa un número mayor o igual a 0',
  },
};

export default validators;
