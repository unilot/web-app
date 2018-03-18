$(function () {
    // Анимация якоря
    $(document).ready(function () {
        $("#link").on("click", "a", function (event) {
            event.preventDefault();
            var id = $(this).attr('href'),
                top = $(id).offset().top;
            $('body,html').animate({scrollTop: top}, 1000);
        });
    });
    // ----------------------------------------------------------------

    // Боковое меню
    var slideout = new Slideout({
        'panel': document.getElementById('panel'),
        'menu': document.getElementById('menu'),
        'padding': 450,
        'tolerance': 70,
    });

    document.querySelector('.menu-open').addEventListener('click', function () {
        slideout.open();
    });

    document.querySelector('.menu-close').addEventListener('click', function () {
        slideout.close();
    });

    function close(eve) {
        eve.preventDefault();
        slideout.close();
    }

    // Затемнение сайта
    slideout
        .on('beforeopen', function () {
            this.panel.classList.add('panel-open');
        })
        .on('open', function () {
            this.panel.addEventListener('click', close);
        })
        .on('beforeclose', function () {
            this.panel.classList.remove('panel-open');
            this.panel.removeEventListener('click', close);
        });

    slideout.on('open', function () {
        $('#btn').addClass('on');
    });

    slideout.on('close', function () {
        $('#btn').removeClass('on');
    });
    // ----------------------------------------------------------------

    // Переворот иконок
    $(".question__content, .lng, .header__lng").click(function () {
        $(this).toggleClass("active");
    });
    // ----------------------------------------------------------------

    // Таймер дневной
    var d = [5, 4, 3, 2, 1, 7, 6];
    var today = new Date();
    var end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + d[today.getDay()], 16, 0, 0);
    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var timer;

    function showRemaining() {
        var now = new Date();
        var distance = end - now;
        if (distance < 0) {
            return;
        }
        var days = Math.floor(distance / _day);
        var hours = Math.floor((distance % _day) / _hour);
        if (hours < 10) hours = '0' + hours;
        var minutes = Math.floor((distance % _hour) / _minute);
        if (minutes < 10) minutes = '0' + minutes;
        var seconds = Math.floor((distance % _minute) / _second);
        if (seconds < 10) seconds = '0' + seconds;
        $('.lottery__rally__timer3--color span').text(days);
        $('.timer_hou').text(hours);
        $('.timer_minut').text(minutes);
        $('.timer_secon').text(seconds);
    }

    timer = setInterval(showRemaining, 1000);
    // ----------------------------------------------------------------

    // Параллакс
    var scene = $('.scene').get(0);
    var parallaxInstance = new Parallax(scene);
    // ----------------------------------------------------------------

    getToken()
        .then(getGames)
        .then(renderTemplates);
});