var baseUrl = 'https://dev.unilot.io/api/v1';
var $gamesContainerBlock = $('.js-games-container');
var $gameSummariesBlock = $('.js-games-summaries');

var gameTemplate = $.templates('#gameTemplate');
var gameSummaryTemplate = $.templates('#gameSummaryTemplate');

const gameType = {
    DAILY: 10,
    WEEKLY: 30,
    BONUS: 50,
    TOKEN: 70
};

const getGameTypeName = function (type) {
    result = '';

    if (type === gameType.DAILY) {
        result = 'daily';
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
        resolve();
        // $.get("/token/", function (token) {
        //     resolve(token)
        // })
        //     .fail(function () {
        //         reject("failed");
        //     });
    });
}

function getGames(token) {
    return new Promise(function (resolve, reject) {
        resolve(hardcoded);
        // $.ajax({
        //     url: baseUrl + '/games/',
        //     method: "GET",
        //     beforeSend: function (request) {
        //         request.setRequestHeader("Authorization", 'Bearer ' + token)
        //     },
        //     success: function (response) {
        //         resolve(response)
        //     },
        //     error: function (error) {
        //         console.log("Error", error);
        //         reject(error)
        //     }
        // });
    });
}

function renderGame(gameData) {
    var renderData = gameData;

    //Can render if game is not bonus or token games
    renderData.canParticipate = ([gameType.BONUS, gameType.TOKEN].indexOf(gameData.type) === -1);
    //Rounding fiat amount to avoid numbers like 8.10000000000000000000000000000000000000000000000001
    renderData.prize_amount_fiat = Math.round(renderData.prize_amount_fiat * 100)/100;
    // Rounding prize amount to 2 decimal places
    renderData.prize_amount.amount = (renderData.prize_amount.amount).toFixed(3);

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

    //Processing ending time
    var timer = processEndingTime(gameData.ending_at);
    
    //Setting up counters
    $('.jackpot__block__timer', result.$summaryContainer)
        .countdown(timer.time.toDate(), function (event) {
        $(this).html(event.strftime(timer.template.render()));
    });

    $('.lottery__rally__timer', result.$container)
        .countdown(timer.time.toDate(), function (event) {
            $(this).html(event.strftime(timer.template.render()));
    });

    //If containers has flippers setup them
    var $flipCounterContainer = $('.flip-counter', result.$container);
    if ($flipCounterContainer.length > 0) {
        $flipCounterContainer.each(function (index, element) {
            //Creating unique id for our flipper
            var flipCounterId = 'game-flip-counter-' + index + '-' + gameData.id;
            //Assigning id
            $(element).attr('id', flipCounterId);

            //Creating flipper object and adding it to list in result object
            result.flipCounters.push(new flipCounter(flipCounterId,
                { value: renderData.prize_amount.amount, inc: 0, pace: 1000, auto: false })
            );
        });
    }

    return result;
}

function processEndingTime(endingTime) {
    var time = moment.tz(endingTime, 'UTC');
    var now = moment.tz(new Date(), 'UTC');
    var template = $.templates('#hourlyTimerTemplate');

    //Choosing template to render. Setting daily if more than 24 hours left till the end of game
    if(time.diff(now, 'hours') > 24) {
        template = $.templates('#dailyTimerTemplate');
    }

    return {template, time};
}

// Render templates based on game data
function renderTemplates(gamesData) {

    var typeMap = {};
    var renderOrder = [gameType.DAILY, gameType.WEEKLY, gameType.BONUS, gameType.TOKEN];

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

    return gamesData;
}

// Hardcoded object with games to test when API is unavailable
var hardcoded = [
    {
        "id": 37,
        "status": 10,
        "type": 10,
        "smart_contract_id": "0x0b3cf2fefe2019c6b2a5603570b937609a99fda5",
        "prize_amount": {
            "amount": 0.0124,
            "currency": "ETH"
        },
        "prize_amount_fiat": 3.4102479999999997,
        "num_players": 5,
        "bet_amount": {
            "amount": 0.003,
            "currency": "ETH"
        },
        "bet_amount_fiat": 0.82506,
        "gas_price": 2,
        "gas_limit": 90000,
        "started_at": "2018-05-11T07:03:10Z",
        "ending_at": "2018-05-12T07:03:19Z"
    },
    {
        "id": 38,
        "status": 10,
        "type": 30,
        "smart_contract_id": "0x0b3cf2fefe2019c6b2a5603570b937609a99fda5",
        "prize_amount": {
            "amount": 0.51,
            "currency": "ETH"
        },
        "prize_amount_fiat": 3.4102479999999997,
        "num_players": 5,
        "bet_amount": {
            "amount": 0.003,
            "currency": "ETH"
        },
        "bet_amount_fiat": 0.82506,
        "gas_price": 2,
        "gas_limit": 90000,
        "started_at": "2018-05-10T07:03:10Z",
        "ending_at": "2018-05-17T07:03:19Z"
    },
    {
        "id": 39,
        "status": 10,
        "type": 50,
        "smart_contract_id": "---",
        "prize_amount": {
            "amount": 0.06332,
            "currency": "ETH"
        },
        "prize_amount_fiat": 0.42628099999999997,
        "num_players": 0,
        "bet_amount": {
            "amount": 0,
            "currency": "ETH"
        },
        "bet_amount_fiat": 1.10008,
        "gas_price": 0,
        "gas_limit": 0,
        "started_at": "2018-04-20T07:03:34Z",
        "ending_at": "2018-05-20T07:03:38Z"
    }
];