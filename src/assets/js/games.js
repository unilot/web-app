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

const getGameTypeName = function (type) {
    result = '';

    if (type === gameType.DAYLY) {
        result = 'dayly';
    } else if (type === gameType.WEEKLY) {
        result = 'weekly';
    } else if (type === gameType.BONUS) {
        result = 'bonus';
    } else if (type === gameType.TOKEN) {
        result = 'token';
    }

    return result;
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
    //Rounding fiat amount to avoid numbers like 8.10000000000000000000000000000000000000000000000001
    renderData.prize_amount_fiat = Math.round(renderData.prize_amount_fiat * 100)/100;

    //Adding game containers and remembering them
    var result = {
        data: gameData,
        //Newly added elements
        $summaryContainer: $(gameSummaryTemplate.render(renderData)).appendTo($gameSummariesBlock),
        $container: $(gameTemplate.render(renderData)).appendTo($gamesContainerBlock),
        flipCounters: [],
    };

    result.$container.addClass(getGameTypeName(result.data.type));
    result.$summaryContainer.addClass(getGameTypeName(result.data.type));

    $('.modal', result.$container).modal();

    //Processing ending time
    var gameEndTime = moment.tz(gameData.ending_at, 'UTC');
    var now = moment.tz(new Date(), 'UTC');
    var timeTemplate = $.templates('#hourlyTimerTemplate');
    var $flipCounterContainer = $('.flip-counter', result.$container);

    //Choosing template to render. Setting dayly if more than 24 hours left till the end of game
    if ( gameEndTime.diff(now, 'hours') > 24 ) {
        timeTemplate = $.templates('#daylyTimerTemplate');
    }

    //Setting up counters
    $('.jackpot__block__timer', result.$summaryContainer)
        .countdown(gameEndTime.toDate(), function (event) {
        $(this).html(event.strftime(timeTemplate.render()));
    });

    $('.lottery__rally__timer', result.$container)
        .countdown(gameEndTime.toDate(), function (event) {
            $(this).html(event.strftime(timeTemplate.render()));
        });

    //If containers has flippers setup them
    if ($flipCounterContainer.length > 0) {
        $flipCounterContainer.each(function (index, element) {
            //Creating unique id for our flipper
            var flipCounterId = 'game-flip-counter-' + index + '-' + gameData.id;
            //Assigning id
            $(element).attr('id', flipCounterId);

            //Creating flipper object and adding it to list in result object
            result.flipCounters.push(new flipCounter(flipCounterId,
                { value: gameData.prize_amount.amount, inc: 0, pace: 1000, auto: true })
            );
        });
    }

    return result;
}

// Render templates based on game data
function renderTemplates(gamesData) {

    var typeMap = {};
    var renderOrder = [gameType.DAYLY, gameType.WEEKLY, gameType.BONUS, gameType.TOKEN];

    // Iterate through games object
    for (var i in gamesData) {
        if (!gamesData.hasOwnProperty(i)) continue;

        typeMap[gamesData[i].type] = gamesData[i];
    }

    for (var j in renderOrder) {
        if ( !renderOrder.hasOwnProperty(j) || !typeMap.hasOwnProperty(renderOrder[j]) || !typeMap[renderOrder[j]] ) continue;

        var gameData = typeMap[renderOrder[j]];

        games[gameData.id] = renderGame(gameData);
    }
}