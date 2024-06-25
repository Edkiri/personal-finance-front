import { ref } from 'vue';
import type { InputValidator } from '@/types/form-validators';

export function useInputValue(
  initialValue?: string,
  validator?: InputValidator,
) {
  const text = ref<string>(initialValue ?? '');
  const error = ref<string>('');

  function validate() {
    error.value = '';
    if (!validator || text.value.length < 1) return;

    const validated = validator.validate(text.value);
    if (!validated) {
      error.value = validator.errorMessage;
    }
  }

  return { text, error, validate };
}
