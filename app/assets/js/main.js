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

  // Fetch game data from API
  function getToken() {
    return new Promise((resolve, reject) => {
      $.get("/token/", (token) => {resolve(token)})
        .fail(() => {reject("failed")});
    });
  }

  function getGames(token) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "https://dev.unilot.io/api/v1/games/",
        method: "GET",
        // crossDomain: true,
        beforeSend: function(request) {
          request.setRequestHeader("Authorization", `Bearer ${token}`)
        },
        success: (response) => {
          resolve(response)
        },
        error: (error) => {
          console.log("Error", error);
          reject(error)
        }
      });
    });
  }

  getToken()
    .then(getGames)
    .then(renderTemplates);
  
  // ----------------------------------------------------------------
  
  // Render templates based on game data
  function renderTemplates(games) {
    // Iterate through games object
    var i = 0;
    var rendered = {daily: false, weekly: false, bonus: false};
    do {
      var game = games[i];
      
      switch(game.type) {
        case 10:
          console.log(`Received daily game #${game.id}`);            
          // render game summary
          game["type_name"] = "Дневная";
          game["details_anchor"] = "dailyGame";
          game["flip_counter_id"] = "flip-counter";
          game["modal_id"] = "dailyParticipate";
          $("#dailySummary").html($.render.gameSummary(game));
          // render game details
          $("#dailyGame").html($.render.gameDetails(game));
          // render game modal
          $("#dailyModal").html($.render.gameModal(game));
          // initialize flip counters
          var myCounter = new flipCounter('flip-counter', { value: game.prize_amount.amount, inc: 0, pace: 1000, auto: true });
          // mark game as rendered
          rendered.daily = true;
          break

        case 30:
          console.log(`Received weekly game #${game.id}`);
          // render game summary
          game["type_name"] = "Недельная";
          game["details_anchor"] = "weeklyGame";
          game["flip_counter_id"] = "flip-counter1";
          game["modal_id"] = "weeklyParticipate";
          $("#weeklySummary").html($.render.gameSummary(game));
          // render game details
          $("#weeklyGame").html($.render.gameDetails(game));
          // render game modal
          $("#weeklyModal").html($.render.gameModal(game));
          // initialize flip counters
          var myCounter = new flipCounter('flip-counter1', { value: game.prize_amount.amount, inc: 0, pace: 1000, auto: true });
          // mark game as rendered
          rendered.weekly = true;
          break

        case 50:
          console.log(`Received bonus game #${game.id}`);
          // render game summary
          game["type_name"] = "Бонусная";
          game["details_anchor"] = "bonusGame"; 
          game["flip_counter_id"] = "flip-counter2";
          $("#bonusSummary").html($.render.gameSummary(game));
          // render game details
          $("#bonusGame").html($.render.gameDetails(game));
          // initialize flip counters
          var myCounter = new flipCounter('flip-counter2', { value: game.prize_amount.amount, inc: 0, pace: 1000, auto: true });
          // mark game as rendered
          rendered.bonus = true;
          break

        default:
          throw new RangeError(`Game type "${game}" is unknown`)
      }
      i += 1;
    } while(games[i]);

    // Render stubs for absent games
    if(!rendered.daily) {
      $("#dailySummary").html($.render.gameSummary(null));
      $("#dailyGame").html($.render.gameDetails(null));
      rendered.daily = true;
    }    
    if(!rendered.weekly) {
      $("#weeklySummary").html($.render.gameSummary(null));
      $("#weeklyGame").html($.render.gameDetails(null));
      rendered.weekly = true;
    }
    if(!rendered.bonus) {
      $("#bonusSummary").html($.render.gameSummary(null));
      $("#bonusGame").html($.render.gameDetails(null));
      rendered.bonus = true;
    }
    
    // Render past games (static for now)
    // $(".lottery__past__content").html($.render.pastGame());
  }
  // ----------------------------------------------------------------
});