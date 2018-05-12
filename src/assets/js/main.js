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

    // Параллакс
    var scene = $('.scene').get(0);
    var parallaxInstance = new Parallax(scene);
    // ----------------------------------------------------------------

    // Render games
    getToken()
        .then(getGames)
        .then(renderTemplates)
        .then(renderModals);

    // ----------------------------------------------------------------
});
