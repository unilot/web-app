var baseUrl = 'https://dev.unilot.io/api/v1';
var $gamesContainerBlock = $('.js-games-container');
var $gameSummariesBlock = $('.js-games-summaries');

var gameTemplate = $.templates('#gameTemplate');
var gameSummaryTemplate = $.templates('#gameSummaryTemplate');

const gameType = {
    DAYLY: 10,
    WEEKLY: 30,
    BONUS: 50,
    TOKEN: 70
};

var games = {};

// Fetch game data from API
function getToken() {
    return new Promise(function (resolve, reject) {
        $.get("/token/", function (token) {
            resolve(token)
        })
            .fail(function () {
                reject("failed");
            });
    });
}

function getGames(token) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: baseUrl + '/games/',
            method: "GET",
            // crossDomain: true,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", 'Bearer ' + token)
            },
            success: function (response) {
                resolve(response)
            },
            error: function (error) {
                console.log("Error", error);
                reject(error)
            }
        });
    });
}

function renderGame(gameData) {
    var renderData = gameData;

    //Can render if game is not bonus or token games
    renderData.canParticipate = ([gameType.BONUS, gameType.TOKEN].indexOf(gameData.type) === -1);
    renderData.prize_amount_fiat = Math.round(renderData.prize_amount_fiat * 100)/100;

    var result = {
        data: gameData,
        //Newly added elements
        $summaryContainer: $(gameSummaryTemplate.render(renderData)).appendTo($gameSummariesBlock),
        $container: $(gameTemplate.render(renderData)).appendTo($gamesContainerBlock),
    };

    var gameEndTime = moment.tz(gameData.ending_at, 'UTC');
    var now = moment.tz(new Date(), 'UTC');
    var timeTemplate = $.templates('#hourlyTimerTemplate');
    var $flipCounterContainer = $('.flip-counter', result.$container);

    if ( gameEndTime.diff(now, 'hours') > 24 ) {
        timeTemplate = $.templates('#daylyTimerTemplate');
    }

    $('.jackpot__block__timer', result.$summaryContainer)
        .countdown(gameEndTime.toDate(), function (event) {
        $(this).html(event.strftime(timeTemplate.render()));
    });

    $('.lottery__rally__timer', result.$container)
        .countdown(gameEndTime.toDate(), function (event) {
            $(this).html(event.strftime(timeTemplate.render()));
        });

    if ($flipCounterContainer.length > 0) {
        var flipCounterId = 'game-flip-counter-' + gameData.id;
        $flipCounterContainer.attr('id', flipCounterId);

        result.flipCounter = new flipCounter(flipCounterId,
            { value: gameData.prize_amount.amount, inc: 0, pace: 1000, auto: true });
    }

    return result;
}

// Render templates based on game data
function renderTemplates(gamesData) {

    // Iterate through games object
    for (var i in gamesData) {
        if (!gamesData.hasOwnProperty(i)) continue;

        games[gamesData[i].id] = renderGame(gamesData[i]);
    }
}