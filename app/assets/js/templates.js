$.templates('gameSummary', `
<h4>{{:type_name}}</h4>
<p>Джекпот</p>
<span>
  {{:prize_amount.amount}}
  <img src="assets/img/jackpot.png" alt="ETH">
</span>
<div class="jackpot__block__maney">
  <p>US \${{:prize_amount_fiat}}</p>
</div>
<div class="jackpot__block__timer">
  <p>Успей принять участие</p>
  <div class="jackpot__block__timer_clock1">
    <p>10</p><span>:</span>
    <p>20</p><span>:</span>
    <p>59</p>
  </div>
</div>
<div class="row">
  <div class="col-xs-12">
    <a class="btn btn--block" href="{{:details_anchor}}">
      <i class="icon-angle-down"></i>
    </a>
  </div>
</div>
`);

$.templates('gameDetails', `
<div class="container">
  <div class="row">
    <div class="col-md-5 col-xs-12">
      <div class="row">
        <div class="col-md-12 col-xs-6">
          <div class="heading">
            <h2>{{:type_name}} лотерея</h2>
          </div>
        </div>
        <div class="col-md-12 col-sm-8 col-xs-12">
          <p>Децентрализованная лотерея на базе Ethereum Smart Contracts, обеспечивающих полную прозрачность для всех участников
            розыгрышей</p>
        </div>
      </div>
    </div>
    <div class="col-md-7 col-xs-12 start-md center-xs">
      <div class="lottery__rally">
        <div class="row">
          <div class="col-sm-offset-2 col-sm-9 col-xs-12 col-md-10">
            <div class="row">
              <div class="col-md-10 end-xs col-xs-12">
                <h3>Текущий розыгрыш</h3>
              </div>
              <div class="flip-counter-container col-md-offset-1 col-md-9 end-xs col-sm-10 col-sm-offset-2 col-xs-12">
                <div class="flip-counter" id="{{:flip_counter_id}}"></div>
              </div>
              <div class="col-xs-12 end-xs">
                <b>US \${{:prize_amount_fiat}}</b>
              </div>
              <div class="col-md-4 col-sm-5 col-xs-12 end-sm center-xs">
                <p>До следующего розыгрыша:</p>
              </div>
              <div class="col-md-6 col-sm-7 col-xs-12 end-sm center-xs">
                <div class="lottery__rally__timer">
                  {{if type==50}}
                    <span>29</span>
                    <p>Дней</p>
                  {{/if}}
                </div>
              </div>
              {{if type!=50}}
                <div class="col-md-10 col-sm-11 col-xs-12 center-xs">
                  <a class="btn lottery__rally__timer1--btn" href="#">
                    <p>Принять участие</p>
                    <span class="flex end-xs">{{:bet_amount.amount}} {{:bet_amount.currency}}</span>
                  </a>
                </div>
              {{/if}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xs-12">
      <div class="heading">
        <h4>Прошедшие лотереи</h4>
      </div>
      <div class="lottery__past">
        <div class="row center-xs">
          <div class="col-md-4 col-xs-12">
            <div class="lottery__past__content"></div>
          </div>
          <div class="col-md-4 col-xs-12">
            <div class="lottery__past__content"></div>
          </div>
          <div class="col-md-4 col-xs-12">
            <div class="lottery__past__content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`);

$.templates('pastGame', `
<p>Розыгрыш от: <span>31.08.17</span></p>
<div class="lottery__past__content__block">
  <div class="row">
    <div class="col-xs-4">
      <p>Джекпот </p><span>69,995
        <p>eth</p></span>
    </div>
    <div class="col-xs-4">
      <p>Участников </p><span>10.753</span>
    </div>
    <div class="col-xs-4">
      <p>Победителей </p><span>500</span>
    </div>
    <div class="col-xs-12 center-xs"><a class="btn lottery__past__content__block--btn" href="#">Cписок победителей</a></div>
  </div>
</div>
`);