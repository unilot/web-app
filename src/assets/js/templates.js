$.templates('gameModal', `
<div class="modal fade" id="{{:modal_id}}" tabindex="-1" role="dialog" aria-labelledby="{{:details_anchor}}ModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="{{:details_anchor}}ModalLabel">{{:type_name}} лотерея</h4>
      </div>
      <div class="modal-body">
        <center>
          <p>Лотерея закончится через:</p>
          <p>16:14:27</p>
        </center>

        <div class="alert alert-warning" role="alert">
          <h4>Как принять участие</h4>
          <ol>
            <li>Скопируйте указанный ниже адрес кошелька Unilot</li>
            <li>Перейдите в приложение, откуда вы управляете своим кошельком</li>
            <li>
              Отправьте {{:bet_amount.amount}} {{:bet_amount.currency}} на скопированный ранее адрес со следующими параметрами:
              <ul>
                <li>Gas Limit - 90000</li>
                <li>Gas Price - 2 Gwei</li>
              </ul>
            </li>
          </ol>
        </div>

        <center>{{:smart_contract_id}}</center>
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