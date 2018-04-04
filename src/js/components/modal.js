/**
 * Всплывающие окна
 * @module Modal
 */

let layout = $('.layout');
 
function openModal(modal) {
  layout.addClass('modal-open');
  $('html, body').css('overflow-y', 'hidden');
  modal.fadeIn(300).addClass('is-opened');
  modal.trigger('opened');
}

function closeModal(modal) {
  modal.fadeOut(300).removeClass('is-opened');
  layout.removeClass('modal-open');
  $('html, body').css('overflow-y', '');
  modal.trigger('closed');
}

/**
 * инициализация событий для всплывающих окон
 * @example
 * Modal.init();
 */
function init(){
    
  $('.js-modal').on('click', function(e){
      e.preventDefault();
      let target = $(this).attr('data-target');
      let modal = $(target);
      if (!modal.hasClass('is-opened')) {
        openModal(modal);
      } else {
        closeModal(modal);
      }
  });
  
  $('.js-close-modal').on('click', function (e) {
    e.preventDefault();
    let modal = $(this).closest('.modal');
    closeModal(modal);
  });
  
  $('.modal__bg').on('click', function(e) {
    let modal = $(this).closest('.modal');
    closeModal(modal);
  });

}

module.exports = {init, openModal, closeModal};