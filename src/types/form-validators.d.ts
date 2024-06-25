export interface InputValidator {
  errorMessage: string;
  validate: (value: string) => boolean;
}

export interface InputValues {
  text: Ref<string>;
  error: Ref<string>;
  validate: () => void;
}
