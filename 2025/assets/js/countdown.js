// esta variable guarda el dia del evento
var countDownDate = new Date("Oct 25, 2025 15:00:00 UTC").getTime();

//funcion para obtener la fecha actual y calcular la diferencia entre la fecha del evento y la fecha actual
var x = setInterval(function () {

    var now = new Date().getTime();
    var distance = countDownDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    //formato en el que se dibuja el contador
    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
    if (distance < 0) {
        clearInterval(x);

        //oculta el contador cuando llegue a cero
        document.getElementById("countdown").style.display = "none";
        //muestra el mensaje de que ya comenzo el evento
        document.getElementById("event-started").style.display = "block";
    }
}, 1000);