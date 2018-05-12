function renderModals() {
  function Modal() {
      var $overlay = $('.js-modal-overlay');
      var $modalTemplate = $.templates('#gameModalTemplate');

      $('.js-modal-open').on('click', function(e) {
          var contractId = $(e.target).data('contractid');
          var endTime = $(e.target).data('endtime');
          var timer = processEndingTime(endTime);
          var game = {timer, contractId};

          switch($(e.target).data('gametype')) {
              case 10:
                  game.type = 'Дневная';
                  break;
              case 30:
                  game.type = 'Недельная';
                  break;
              default:
                  break;
          }

          Modal.prototype.renderModal($overlay, $modalTemplate, game);
      });

      $overlay.on('click', '.js-modal-close', function(e) {
          Modal.prototype.closeModal();
      });

      // close modal if overlay is clicked, not the modal itself
      $overlay.on('click', function(e) {
          if(e.target == $overlay[0]) {
              Modal.prototype.closeModal();
          }
      });
  }

Modal.prototype = {        
    renderModal: function(modalContainer, template, game) {
        modalContainer.html(template.render(game));

        // setup counter
        $('.modal-timer-value')
            .countdown(game.timer.time.toDate(), function(e) {
                $(this).html(e.strftime(game.timer.template.render()));
            });
        
        // setup contract id
        $('.modal-contract-id').attr('value', game.contractId);

        this.openModal();
    },

    openModal: function() {
        $('.js-modal-overlay').removeClass('closed');
        $('.js-content').addClass('blurred');
        $('body').addClass('no-scroll');
    },

    closeModal: function() {
        $('.js-modal-overlay').addClass('closed');
        $('.js-content').removeClass('blurred');
        $('body').removeClass('no-scroll');
    }
}

  var modal = new Modal();
}