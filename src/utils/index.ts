export function formatString(inputString: string) {
  return inputString
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function validateFloat(string: string) {
  const regex = /^[-+]?(\d+(\.\d+)?|\.\d+)$/;
  return regex.test(string);
}

export function formatFloat(n: number): string {
  return n.toFixed(2);
}

export function formatDate(date: Date, full: boolean = false): string {
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  const daysOfWeek = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const dayOfWeek = daysOfWeek[date.getDay()];

  return `${dayOfWeek} ${day} de ${month} ${full ? ` del ${year}` : ''} `;
}

export function range(end: number): number[] {
  const result: number[] = [];

  for (let i = 0; i < end; i += 1) {
    result.push(i);
  }

  return result;
}
