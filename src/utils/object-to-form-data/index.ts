/**
 * Transforma um objeto qualquer em um `FormData`
 * @param obj - Objeto a ser transformado em `FormData`
 */
export function objectToFormData<T extends object>(obj: T) {
  const formData = new FormData();

  for (const key in obj) {
    const value = obj[key] as string;

    if (value) {
      formData.append(key, value);
    }
  }

  return formData;
}
