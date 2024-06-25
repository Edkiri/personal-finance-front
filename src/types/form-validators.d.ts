export interface InputValidator {
  errorMessage: string;
  validate: (value: string) => boolean;
}

export interface InputValues {
  text: string;
  error: string;
  validate: () => void;
}
