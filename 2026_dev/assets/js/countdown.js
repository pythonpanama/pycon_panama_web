// var countDownDate = new Date("Oct 25, 2025 15:00:00 UTC").getTime();
var countDownDate = new Date("Oct 16, 2025 00:00 UTC").getTime();

var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  // var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  var daysEl = document.getElementById("days");
  var hoursEl = document.getElementById("hours");
  var minutesEl = document.getElementById("minutes");
  // var secondsEl = document.getElementById("seconds");
  var countdownEl = document.getElementById("countdown");
  var eventStartedEl = document.getElementById("event-started");

  // solo actualiza si existe el contador en la página
  // if (daysEl && hoursEl && minutesEl && secondsEl) {
  if (daysEl && hoursEl && minutesEl) {
    daysEl.innerHTML = days;
    hoursEl.innerHTML = hours;
    minutesEl.innerHTML = minutes;
    // secondsEl.innerHTML = seconds;
  }

  if (distance < 0) {
    clearInterval(x);
    if (countdownEl) countdownEl.style.display = "none";
    if (eventStartedEl) eventStartedEl.style.display = "block";
  }
}, 1000);

//VIEJO CODIGO DE LOS DIAS 

// // esta variable guarda el dia del evento
// var countDownDate = new Date("Oct 25, 2025 15:00:00 UTC").getTime();
//
// //funcion para obtener la fecha actual y calcular la diferencia entre la fecha del evento y la fecha actual
// var x = setInterval(function () {
//
//     var now = new Date().getTime();
//     var distance = countDownDate - now;
//
//     var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//     var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//     var seconds = Math.floor((distance % (1000 * 60)) / 1000);
//
//     //formato en el que se dibuja el contador
//     document.getElementById("days").innerHTML = days;
//     document.getElementById("hours").innerHTML = hours;
//     document.getElementById("minutes").innerHTML = minutes;
//     document.getElementById("seconds").innerHTML = seconds;
//
//     if (distance < 0) {
//         clearInterval(x);
//         //oculta el contador cuando llegue a cero
//         document.getElementById("countdown").style.display = "none";
//         //muestra el mensaje de que ya comenzo el evento
//         document.getElementById("event-started").style.display = "block";
//     }
// }, 1000);
