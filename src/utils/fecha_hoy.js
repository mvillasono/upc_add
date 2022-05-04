export const fechaHoy = () => {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];

  let f = new Date();

  return (
    diasSemana[f.getDay()] +
    " " +
    f.getDate() +
    " de " +
    meses[f.getMonth()] +
    " del " +
    f.getFullYear()
  );
};
