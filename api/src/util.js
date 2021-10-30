const weekday = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

module.exports = () => weekday[new Date().getDay()];
