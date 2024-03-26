export function formatString(inputString: string) {
  return inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();;
}
