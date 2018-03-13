$(function () {
  // Анимация якоря
  $(document).ready(function () {
    $("#link").on("click", "a", function (event) {
      event.preventDefault();
      var id = $(this).attr('href'),
        top = $(id).offset().top;
      $('body,html').animate({ scrollTop: top }, 1000);
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

  // Таймер часовой
  $('.jackpot__block__timer_clock1, .lottery__rally__timer1').timeTo(new Date('Wed Nov 22 2017 02:00:00 GMT+0200 (EET)'))
  $('.jackpot__block__timer_clock2, .lottery__rally__timer2').timeTo(new Date('Wed Nov 22 2017 02:00:00 GMT+0200 (EET)'))
  $('.jackpot__block__timer_clock3').timeTo(new Date('Wed Nov 22 2017 16:00:00 GMT+0200 (EET)'))

  // Таймер дневной
  var d = [5, 4, 3, 2, 1, 7, 6];
  var today = new Date();
  var end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + d[today.getDay()], 16, 00, 00);
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

  // Render templates
  function renderGameSummary(game) {
    var container;

    // Identify game type
    switch(game["type"]) {
      case 10:
        game["type_name"] = "Дневная";
        game["details_anchor"] = "#dailyGame";
        game["flip_counter_id"] = "flip-counter";
        container = "#dailySummary";
        break
      case 30:
        game["type_name"] = "Недельная"; 
        game["details_anchor"] = "#weeklyGame";
        game["flip_counter_id"] = "flip-counter1";
        container = "#weeklySummary";
        break
      case 50:
        game["type_name"] = "Бонусная";
        game["details_anchor"] = "#bonusGame"; 
        game["flip_counter_id"] = "flip-counter2";
        container = "#bonusSummary";
        break
      default:
        game["type_name"] = "Unknown";
    }
    
    // Render game
    $(container).html($.render.gameSummary(game));
  }

  function renderTemplates() {
    // Game objects for testing
    var dailyGame = {"type": 10, "prize_amount": {"currency": "ETH", "amount": 10000}, "prize_amount_fiat": 456.78, "bet_amount": {"currency": "ETH", "amount": 0.01}};
    var weeklyGame = {"type": 30, "prize_amount": {"currency": "ETH", "amount": 200}, "prize_amount_fiat": 600.98, "bet_amount": {"currency": "ETH", "amount": 0.01}};
    var bonusGame = {"type": 50, "prize_amount": {"currency": "ETH", "amount": 300}, "prize_amount_fiat": 6787.98};

    // Initialize rendering of game summaries, which require preparation
    renderGameSummary(dailyGame);
    renderGameSummary(weeklyGame);
    renderGameSummary(bonusGame);

    // Render game details
    $("#dailyGame").html($.render.gameDetails(dailyGame));
    $("#weeklyGame").html($.render.gameDetails(weeklyGame));
    $("#bonusGame").html($.render.gameDetails(bonusGame));

    // Render past games (static for now)
    $(".lottery__past__content").html($.render.pastGame());

    // Initialize flip counters
    var myCounter = new flipCounter('flip-counter', { value: dailyGame.prize_amount.amount, inc: 1, pace: 1000, auto: true });
    var myCounter = new flipCounter('flip-counter1', { value: weeklyGame.prize_amount.amount, inc: 1, pace: 1000, auto: true });
    var myCounter = new flipCounter('flip-counter2', { value: bonusGame.prize_amount.amount, inc: 1, pace: 1000, auto: true });
  }

  renderTemplates();  
  // ----------------------------------------------------------------
});