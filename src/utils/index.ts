export function formatString(inputString: string) {
  return inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();;
}

export function validateFloat(string: string) {
  const regex = /^[-+]?(\d+(\.\d+)?|\.\d+)$/;
  return regex.test(string);
}

export function formatDate(fecha: string) {
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  const parts = fecha.split('-');
  let day = parts[2].replace(/^0+/, '');
  const month = months[parseInt(parts[1], 10) - 1];
  const year = parts[0];

  const date = new Date(fecha);
  const dayOfWeek = daysOfWeek[date.getDay()];

  return `${dayOfWeek}, ${day} de ${month} del ${year} `;
}
