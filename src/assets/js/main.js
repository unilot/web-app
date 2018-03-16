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
  $('.jackpot__block__timer_clock1, .lottery__rally__timer1').timeTo(new Date('Wed Nov 22 2017 02:00:00 GMT+0200 (EET)'));
  $('.jackpot__block__timer_clock2, .lottery__rally__timer2').timeTo(new Date('Wed Nov 22 2017 02:00:00 GMT+0200 (EET)'));
  $('.jackpot__block__timer_clock3').timeTo(new Date('Wed Nov 22 2017 16:00:00 GMT+0200 (EET)'));

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

  var baseUrl = 'https://dev.unilot.io/api/v1';

  // Fetch game data from API
  function getToken() {
    return new Promise(function(resolve, reject){
      $.get("/token/", function(token){resolve(token)})
        .fail(function(){reject("failed");});
    });
  }

  function getGames(token) {
    return new Promise(function(resolve, reject){
      $.ajax({
        url: baseUrl + '/games/',
        method: "GET",
        // crossDomain: true,
        beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token)
        },
        success: function(response){
          resolve(response)
        },
        error: function(error){
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
    var gamesContainerBlock = $('.js-games-container');
    var gameSummariesBlock = $('.js-games-summaries');

    var gameTemplate = $.templates('#gameTemplate');
    var gameSummaryTemplate = $.templates('#gameSummaryTemplate');
    
    // Iterate through games object
    var i = 0;
    do {
      var game = games[i];
      gameSummariesBlock.append(gameSummaryTemplate.render(game));
      gamesContainerBlock.append(gameTemplate.render(game));
      // todo: render flip counter
      
      // remove
      // switch(game.type) {
      //   case 10:
      //     game["details_anchor"] = "dailyGame";
      //     game["flip_counter_id"] = "flip-counter";
      //     game["modal_id"] = "dailyParticipate";
      //     // render game details
      //     // $("#dailyGame").html($.render.gameDetails(game));
      //     // render game modal
      //     // $("#dailyModal").html($.render.gameModal(game));
      //     // initialize flip counters
      //     var myCounter = new flipCounter('flip-counter', { value: game.prize_amount.amount, inc: 0, pace: 1000, auto: true });
      //     break;

      //   case 30:
      //     game["details_anchor"] = "weeklyGame";
      //     game["flip_counter_id"] = "flip-counter1";
      //     game["modal_id"] = "weeklyParticipate";
      //     // render game details
      //     $("#weeklyGame").html($.render.gameDetails(game));
      //     // render game modal
      //     $("#weeklyModal").html($.render.gameModal(game));
      //     // initialize flip counters
      //     var myCounter = new flipCounter('flip-counter1', { value: game.prize_amount.amount, inc: 0, pace: 1000, auto: true });
      //     break

      //   case 50:
      //     game["details_anchor"] = "bonusGame"; 
      //     game["flip_counter_id"] = "flip-counter2";
      //     // render game details
      //     $("#bonusGame").html($.render.gameDetails(game));
      //     // initialize flip counters
      //     // var myCounter = new flipCounter('flip-counter2', { value: game.prize_amount.amount, inc: 0, pace: 1000, auto: true });
      //     break;

      //   default:
      //     throw new RangeError('Game type "' + game + '" is unknown.');
      // }
      i += 1;
    } while(games[i]);
    
    // Render past games (static for now)
    // $(".lottery__past__content").html($.render.pastGame());
  }
  // ----------------------------------------------------------------
});