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
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
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

export function colorToRgba(color: string, alpha: number): string {
  let r = 0;
  let g = 0;
  let b = 0;

  if (color.startsWith('#')) {
    if (color.length === 4) {
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    } else if (color.length === 7) {
      r = parseInt(color[1] + color[2], 16);
      g = parseInt(color[3] + color[4], 16);
      b = parseInt(color[5] + color[6], 16);
    }
  } else if (color.startsWith('rgb')) {
    const rgbValues = color.match(/\d+/g);
    if (rgbValues && rgbValues.length >= 3) {
      r = parseInt(rgbValues[0], 10);
      g = parseInt(rgbValues[1], 10);
      b = parseInt(rgbValues[2], 10);
    }
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
