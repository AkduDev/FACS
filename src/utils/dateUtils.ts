const MONTHS_SHORT_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS_SHORT_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MONTHS_FULL_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatShortDate(dateString: string, lang: string): string {
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const monthNum = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  const months = lang === 'es' ? MONTHS_SHORT_ES : MONTHS_SHORT_EN;
  return `${day}, ${months[monthNum - 1]} ${year}`;
}

export function formatFullDate(dateString: string, lang: string): string {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const monthNum = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  const months = lang === 'es' ? MONTHS_FULL_ES : MONTHS_FULL_EN;
  return `${day} de ${months[monthNum - 1]} de ${year}`;
}

export function formatCalendarDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const monthNum = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  const monthsEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    day,
    month: (lang: string) => (lang === 'es' ? monthsEs : monthsEn)[monthNum - 1] || 'Month',
    year: year.toString(),
  };
}
