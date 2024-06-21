const validators = {
  email: {
    pattern: /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,})+$/,
    errorMessage: 'Ingresa una dirección de correo válido',
  },
  password: {
    pattern: /.{9,}/,
    errorMessage: 'Ingresa una contraseña de al menos 8 caracteres',
  },
  spainPhoneNumber: {
    pattern: /^(?:(?:\+|00)34[-\s]?)?(?:[6]\d{8}|[89]\d{8})$/,
    errorMessage: 'Ingresa un número de teléfono válido en España',
  },
  username: {
    pattern: /^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]{4,}$/,
    errorMessage: 'Ingresa solo letras y al menos 4 caracteres',
  },
};

export default validators;
