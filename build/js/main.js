var Main =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/nioxin/build/js/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var DeviceDetection = __webpack_require__(1);
	var Helpers = __webpack_require__(2);
	var Carousel = __webpack_require__(3);
	var Input = __webpack_require__(4);
	var Form = __webpack_require__(5);
	var Modal = __webpack_require__(6);
	var Animation = __webpack_require__(7);
	var Share = __webpack_require__(8);

	$(document).ready(function () {

	  var hosts = {
	    "elle": "nioxin30days.elle.ru",
	    "psy": "nioxin30days.psychologies.ru",
	    "mc": "nioxin30days.marieclaire.ru"
	  };

	  if (window.location.host === hosts.elle) {
	    $('.logo--elle').addClass('is-active');
	  }
	  if (window.location.host === hosts.psy) {
	    $('.logo--psy').addClass('is-active');
	  }
	  if (window.location.host === hosts.mc) {
	    $('.logo--mc').addClass('is-active');
	  }

	  DeviceDetection.run();
	  Helpers.init();
	  Input.init();
	  Form.init();
	  Carousel.init();
	  Modal.init();
	  Animation.init();
	  Share.init();
	});

	/**
	 * Список экспортируемых модулей, чтобы иметь к ним доступ извне
	 * @example
	 * Main.Form.isFormValid();
	 */
	module.exports = {
	  DeviceDetection: DeviceDetection,
	  Helpers: Helpers,
	  Input: Input,
	  Form: Form,
	  Carousel: Carousel,
	  Modal: Modal,
	  Animation: Animation,
	  Share: Share
		};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	var breakpoints = {
	  sm: 767,
	  md: 1024,
	  lg: 1280,
	  xl: 1600
	};

	function isMobile() {
	  return $(window).width() <= breakpoints.sm;
	}
	function isTablet() {
	  return $(window).width() > breakpoints.sm && $(window).width() <= breakpoints.md;
	}
	function isTouch() {
	  return 'ontouchstart' in window || navigator.maxTouchPoints;
	}
	function isMobileVersion() {
	  return !!~window.location.href.indexOf("/mobile/");
	}

	function run() {
	  if (isTouch()) {
	    $('html').removeClass('no-touch').addClass('touch');
	  } else {
	    $('html').removeClass('touch').addClass('no-touch');
	  }
	}

	module.exports = { run: run, isTouch: isTouch, isMobile: isMobile, isTablet: isTablet, isMobileVersion: isMobileVersion };

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Helpers
	 * @module Helpers
	 */

	/**
	 * Calculate scrollbar width in element
	 * - if the width is 0 it means the scrollbar is floated/overlayed
	 * - accepts "container" paremeter because ie & edge can have different
	 *   scrollbar behaviors for different elements using '-ms-overflow-style'
	 */
	function getNativeScrollbarWidth(container) {
	  container = container || document.body;

	  var fullWidth = 0;
	  var barWidth = 0;

	  var wrapper = document.createElement('div');
	  var child = document.createElement('div');

	  wrapper.style.position = 'absolute';
	  wrapper.style.pointerEvents = 'none';
	  wrapper.style.bottom = '0';
	  wrapper.style.right = '0';
	  wrapper.style.width = '100px';
	  wrapper.style.overflow = 'hidden';

	  wrapper.appendChild(child);
	  container.appendChild(wrapper);

	  fullWidth = child.offsetWidth;
	  wrapper.style.overflowY = 'scroll';
	  barWidth = fullWidth - child.offsetWidth;

	  container.removeChild(wrapper);

	  return barWidth;
	}

	/**
	 * Throttle Helper
	 * https://remysharp.com/2010/07/21/throttling-function-calls
	 */
	function throttle(fn, threshhold, scope) {
	  threshhold || (threshhold = 250);
	  var last = void 0,
	      deferTimer = void 0;
	  return function () {
	    var context = scope || this;

	    var now = +new Date(),
	        args = arguments;
	    if (last && now < last + threshhold) {
	      // hold on to it
	      clearTimeout(deferTimer);
	      deferTimer = setTimeout(function () {
	        last = now;
	        fn.apply(context, args);
	      }, threshhold);
	    } else {
	      last = now;
	      fn.apply(context, args);
	    }
	  };
	}

	/** 
	 * Debounce Helper
	 * https://remysharp.com/2010/07/21/throttling-function-calls
	 */
	function debounce(fn, delay) {
	  var timer = null;
	  return function () {
	    var context = this,
	        args = arguments;
	    clearTimeout(timer);
	    timer = setTimeout(function () {
	      fn.apply(context, args);
	    }, delay);
	  };
	};

	var timer = void 0;
	var timeout = false;
	var delta = 200;
	function resizeEnd() {
	  if (new Date() - timer < delta) {
	    setTimeout(resizeEnd, delta);
	  } else {
	    timeout = false;
	    $(window).trigger('resizeend');
	  }
	}

	function toggleClassIf(el, cond, toggledClass) {
	  if (cond) {
	    el.addClass(toggledClass);
	  } else {
	    el.removeClass(toggledClass);
	  }
	}

	/**
	 * Функция добавляет к элементу класс, если страница прокручена больше, чем на указанное значение, 
	 * и убирает класс, если значение меньше
	 * @param {object} el - элемент, с которым взаимодействуем
	 * @param {mixed} [scrollValue=0] - значение прокрутки, на котором меняем css-класс, ожидаемое значение - число или ключевое слово 'this'. Если передано 'this', подставляется положение el.offset().top минус половина высоты экрана
	 * @param {string} [toggledClass=scrolled] - css-класс, который переключаем
	 */
	function toggleElementClassOnScroll(el) {
	  var scrollValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	  var toggledClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'scrolled';

	  if (el.length == 0) {
	    //console.error("Необходимо передать объект, с которым вы хотите взаимодействовать");
	    return false;
	  }

	  if (scrollValue == 'this') {
	    scrollValue = el.offset().top - $(window).outerHeight() / 2;
	  }

	  $(window).on('scroll', function (e) {
	    if ($(window).scrollTop() > scrollValue) {
	      el.addClass(toggledClass);
	    } else {
	      el.removeClass(toggledClass);
	    }
	  });
	};

	/**
	 * инициализация событий для переключателей классов
	 * @example
	 * Helpers.init();
	 */
	function init() {

	  toggleElementClassOnScroll($('.header'), 50);

	  $('.js-hide-block').on('click', function () {
	    var block = $(this).data('target') === 'self' ? $(this).parent() : $(this).data('target');
	    block.fadeOut(500);
	  });

	  $(window).on('resize', function () {
	    timer = new Date();
	    if (timeout === false) {
	      timeout = true;
	      setTimeout(resizeEnd, delta);
	    }
	  });

	  $('.btn-menu').on('click', function () {
	    $(this).toggleClass('is-open');
	    $('.header').toggleClass('is-open');
	    $('.main-nav').slideToggle(500);
	  });
	}

	module.exports = { init: init, toggleClassIf: toggleClassIf, toggleElementClassOnScroll: toggleElementClassOnScroll };

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Карусель
	 * @module Carousel
	 */
	// default
	var carouselDefault = $(".owl-carousel.carousel--default");
	var carouselDefaultOptions = {
	  items: 1,
	  nav: true,
	  navText: ['<svg class="icon"><use xlink:href="#prev"/></svg>', '<svg class="icon"><use xlink:href="#next"/></svg>'],
	  dots: true,
	  dotsData: true,
	  loop: false,
	  stagePadding: 50,
	  mouseDrag: false,
	  animateOut: 'fadeOut',
	  responsive: {
	    0: {
	      stagePadding: 0,
	      autoHeight: true
	    },
	    1024: {
	      stagePadding: 50,
	      autoHeight: false
	    }
	  }
	  // mobile only
	};var carouselMobile = $(".owl-carousel.carousel--mobile");
	var carouselMobileOptions = {
	  items: 1,
	  margin: 20,
	  autoWidth: true,
	  stagePadding: 20,
	  nav: true,
	  navText: ['<svg class="icon"><use xlink:href="#prev-2"/></svg>', '<svg class="icon"><use xlink:href="#next-2"/></svg>'],
	  dots: false,
	  mouseDrag: false
	};

	function carouselInitByCondition(carousel, options, condition) {
	  if (condition) {
	    carousel.owlCarousel(options);
	  } else {
	    carousel.trigger('destroy.owl.carousel');
	  }
	}

	/**
	 * Инициализация карусели
	 */
	function init() {
	  carouselDefault.owlCarousel(carouselDefaultOptions);
	  carouselInitByCondition(carouselMobile, carouselMobileOptions, Main.DeviceDetection.isMobileVersion());

	  // init on resize
	  $(window).on('resizeend', function () {
	    carouselInitByCondition(carouselMobile, carouselMobileOptions, Main.DeviceDetection.isMobileVersion());
	  });
	}

	module.exports = { init: init };

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Модуль для работы placeholder в элементах формы (.field)
	 * @module Input
	 */

	/**
	 * Установить фокус
	 * @private
	 * @param {object} input
	 */
	function focusLabel(input) {
	    input.closest('.field').addClass("has-focus");
	}

	/**
	 * Убрать фокус
	 * @private
	 * @param {object} input
	 */
	function blurLabel(input) {
	    var wrapper = input.closest('.field');
	    wrapper.removeClass("has-focus");
	}

	/**
	 * Проверить инпут на наличие value
	 * @private
	 * @param {object} input
	 */
	function checkInput(input) {
	    var wrapper = input.closest('.field');
	    if (input.val().length > 0) wrapper.addClass("has-value");else wrapper.removeClass("has-value");
	}

	/**
	 * инициализация событий для инпута
	 * @example
	 * Input.init();
	 */
	function init() {
	    var inputs = $('.field__input');
	    var placeholders = $('.field__placeholder');

	    placeholders.click(function () {
	        $(this).closest('.field').find('.field__input').focus();
	    });

	    inputs.each(function (i, item) {
	        checkInput($(item));
	    });

	    inputs.focus(function () {
	        focusLabel($(this));
	    });

	    inputs.blur(function () {
	        blurLabel($(this));
	        checkInput($(this));
	    });
	}

	module.exports = { init: init };

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Модуль для работы Форм
	 * @module Form
	 */

	function validateField(field) {
	  var isValid = field.validity.valid;
	  var fieldContainer = $(field).closest('.field');
	  if (isValid) {
	    fieldContainer.removeClass('has-error');
	  } else {
	    fieldContainer.addClass('has-error');
	  }
	  return isValid;
	}

	function validateForm(elForm) {
	  var errors = 0;
	  Array.from(elForm.elements).forEach(function (item) {
	    var isValidField = validateField(item);
	    if (!isValidField) {
	      errors += 1;
	    }
	  });
	  return errors;
	}

	/**
	 * инициализация событий форм
	 * @example
	 * Form.init();
	 */
	function init() {
	  var jsForm = $('.js-form');

	  $('input, textarea').on('change', function () {
	    validateField(this);
	  });

	  jsForm.each(function () {
	    var self = $(this);
	    var selfForm = self.find('.js-form-form');
	    var selfResult = self.find('.js-form-result');
	    var selfSubmit = self.find('.js-form-submit');

	    selfSubmit.on('click', function (e) {
	      e.preventDefault();
	      var hasError = validateForm(selfForm[0]);
	      if (!hasError) {
	        var request = $.ajax({
	          url: 'http://loccitane.hsmp.ru/api/emails/',
	          type: 'POST',
	          dataType: 'json',
	          data: {
	            'name': $(selfForm).find('input[name="name"]').val(),
	            'email': $(selfForm).find('input[name="email"]').val(),
	            'message': $(selfForm).find('textarea[name="message"]').val(),
	            'page': window.location.href
	          },
	          beforeSend: function beforeSend() {
	            selfSubmit.attr('disabled', 'disabled');
	          }
	        });
	        request.done(function (response, textStatus, jqXHR) {
	          self.addClass('is-submitted');
	          self.trigger('submitted');
	          setTimeout(function () {
	            selfResult.show();
	          }, 300);
	        });
	      }
	    });
	  });
	}

	module.exports = { init: init };

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Всплывающие окна
	 * @module Modal
	 */

	var layout = $('.layout');

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
	function init() {

	  $('.js-modal').on('click', function (e) {
	    e.preventDefault();
	    var target = $(this).attr('data-target');
	    var modal = $(target);
	    if (!modal.hasClass('is-opened')) {
	      openModal(modal);
	    } else {
	      closeModal(modal);
	    }
	  });

	  $('.js-close-modal').on('click', function (e) {
	    e.preventDefault();
	    var modal = $(this).closest('.modal');
	    closeModal(modal);
	  });

	  $('.modal__bg').on('click', function (e) {
	    var modal = $(this).closest('.modal');
	    closeModal(modal);
	  });
	}

	module.exports = { init: init, openModal: openModal, closeModal: closeModal };

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Переключение классов по различным событиям
	 * @module Animation
	 */

	var scrollAnimationBlocks = $('.a-scroll-box');
	var parallaxBlocks = $('.a-parallax-box');

	function addClassTogglerScene(el, controller) {
	  new ScrollMagic.Scene({
	    triggerElement: el,
	    triggerHook: 0.7
	  }).setClassToggle(el, 'animate').addTo(controller);
	}

	function addClassTogglerController(animationBlocks) {
	  var controller = new ScrollMagic.Controller();
	  animationBlocks.each(function () {
	    var closestContainer = $(this).closest('.l-container').parent()[0];
	    if (closestContainer.offsetTop < window.outerHeight) {
	      $(this).children('[class*="a-"]').css({ 'transition': 'none' });
	      var self = this;
	      var delay = 250 * $(closestContainer).index();
	      $(self).data('timer', setTimeout(function () {
	        $(self).children('[class*="a-"]').css({ 'transition': '' });
	        $(self).addClass('animate');
	      }, 250));
	    } else {
	      var aDelay = 0;
	      if ($(this).attr('data-a-delay') !== undefined) {
	        aDelay = Number($(this).attr('data-a-delay')) * 1000;
	      }
	      setTimeout(addClassTogglerScene, aDelay, this, controller);
	    }
	  });
	}

	function getFromPosition(el) {
	  var defaultPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	  return el.attr('data-parallax-from') !== undefined ? Number(el.attr('data-parallax-from')) : defaultPosition;
	}
	function getToPosition(el) {
	  var defaultPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	  return el.attr('data-parallax-to') !== undefined ? Number(el.attr('data-parallax-to')) : defaultPosition;
	}

	function getParallaxTimeline(el) {
	  var tween = new TimelineMax();
	  var tweensArr = [];
	  if ($(el).find('.a-parallax-back')) {
	    var targetEl = $(el).find('.a-parallax-back');
	    var fromPos = getFromPosition(targetEl, -20);
	    var toPos = getToPosition(targetEl);
	    tweensArr.push(TweenMax.fromTo(targetEl, 1, { yPercent: fromPos }, { yPercent: toPos, ease: Linear.easeNone }));
	  }
	  if ($(el).find('.a-parallax-middle')) {
	    var _targetEl = $(el).find('.a-parallax-middle');
	    var _fromPos = getFromPosition(_targetEl, -15);
	    var _toPos = getToPosition(_targetEl);
	    tweensArr.push(TweenMax.fromTo(_targetEl, 1, { yPercent: _fromPos }, { yPercent: _toPos, ease: Linear.easeNone }));
	  }
	  if ($(el).find('.a-parallax-front')) {
	    var _targetEl2 = $(el).find('.a-parallax-front');
	    var _fromPos2 = getFromPosition(_targetEl2, -10);
	    var _toPos2 = getToPosition(_targetEl2, 10);
	    tweensArr.push(TweenMax.fromTo(_targetEl2, 1, { yPercent: _fromPos2 }, { yPercent: _toPos2, ease: Linear.easeNone }));
	  }
	  tween.add(tweensArr);
	  return tween;
	}

	function addParallaxScene(el, tween, controller) {
	  new ScrollMagic.Scene({
	    triggerElement: el,
	    triggerHook: 0,
	    duration: $(el).height()
	  }).setTween(tween).addTo(controller);
	}

	function addParallaxController(animationBlocks) {
	  var controller = new ScrollMagic.Controller();
	  animationBlocks.each(function () {
	    var tween = getParallaxTimeline(this);
	    addParallaxScene(this, tween, controller);
	  });
	}

	function init() {
	  if (scrollAnimationBlocks.length > 0 && $(window).width() > 1024) {
	    $('html').addClass('is-animating');
	    addClassTogglerController(scrollAnimationBlocks);
	  }
	  if (parallaxBlocks.length > 0 && $(window).width() > 1024) {
	    $('html').addClass('is-animating');
	    addParallaxController(parallaxBlocks);
	  }
	}

	module.exports = { init: init };

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	function getIcon(el) {
	  var icon = '';
	  if (el.hasClass('ya-share2__item_service_vkontakte')) {
	    icon = 'vk';
	  }
	  if (el.hasClass('ya-share2__item_service_facebook')) {
	    icon = 'fb';
	  }
	  if (el.hasClass('ya-share2__item_service_twitter')) {
	    icon = 'tw';
	  }
	  console.log(el);
	  return '<svg class="icon social-icon"><use xlink:href="#' + icon + '"/></svg>';
	}
	function fillIcons() {
	  $('#share .ya-share2__item').each(function () {
	    $(this).find('.ya-share2__icon').html(getIcon($(this)));
	  });
	}
	function init() {
	  Ya.share2('share', {
	    content: {
	      url: window.location.href,
	      title: 'Nioxin30Days',
	      description: "",
	      //image: 'build/img/share.jpg'
	      image: 'http://nioxin30days.elle.ru/build/img/share.jpg'
	    },
	    theme: {
	      services: 'vkontakte,facebook,twitter',
	      bare: true,
	      lang: 'en'
	    },
	    hooks: {
	      onready: function onready() {
	        fillIcons();
	      }
	    }
	  });
	}
	module.exports = { init: init };

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA2Mzg3ODMwY2IyMWFlMWUxMjMzYyIsIndlYnBhY2s6Ly8vc3JjL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2Nhcm91c2VsLmpzIiwid2VicGFjazovLy9zcmMvanMvY29tcG9uZW50cy9pbnB1dC5qcyIsIndlYnBhY2s6Ly8vc3JjL2pzL2NvbXBvbmVudHMvZm9ybS5qcyIsIndlYnBhY2s6Ly8vc3JjL2pzL2NvbXBvbmVudHMvbW9kYWwuanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2FuaW1hdGlvbi5qcyIsIndlYnBhY2s6Ly8vc3JjL2pzL2NvbXBvbmVudHMvc2hhcmUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL25pb3hpbi9idWlsZC9qcy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2Mzg3ODMwY2IyMWFlMWUxMjMzYyIsImxldCBEZXZpY2VEZXRlY3Rpb24gPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb25cIik7XHJcbmxldCBIZWxwZXJzID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9oZWxwZXJzXCIpO1xyXG5sZXQgQ2Fyb3VzZWwgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2Nhcm91c2VsXCIpO1xyXG5sZXQgSW5wdXQgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2lucHV0XCIpO1xyXG5sZXQgRm9ybSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvZm9ybVwiKTtcclxubGV0IE1vZGFsID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9tb2RhbFwiKTtcclxubGV0IEFuaW1hdGlvbiA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvYW5pbWF0aW9uXCIpO1xyXG5sZXQgU2hhcmUgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL3NoYXJlXCIpO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICBcclxuICBsZXQgaG9zdHMgPSB7XHJcbiAgICBcImVsbGVcIjogXCJuaW94aW4zMGRheXMuZWxsZS5ydVwiLFxyXG4gICAgXCJwc3lcIjogXCJuaW94aW4zMGRheXMucHN5Y2hvbG9naWVzLnJ1XCIsXHJcbiAgICBcIm1jXCI6IFwibmlveGluMzBkYXlzLm1hcmllY2xhaXJlLnJ1XCJcclxuICB9O1xyXG4gIFxyXG4gIGlmICh3aW5kb3cubG9jYXRpb24uaG9zdCA9PT0gaG9zdHMuZWxsZSkge1xyXG4gICAgJCgnLmxvZ28tLWVsbGUnKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgfVxyXG4gIGlmICh3aW5kb3cubG9jYXRpb24uaG9zdCA9PT0gaG9zdHMucHN5KSB7XHJcbiAgICAkKCcubG9nby0tcHN5JykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gIH1cclxuICBpZiAod2luZG93LmxvY2F0aW9uLmhvc3QgPT09IGhvc3RzLm1jKSB7XHJcbiAgICAkKCcubG9nby0tbWMnKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgfVxyXG4gIFxyXG4gIERldmljZURldGVjdGlvbi5ydW4oKTtcclxuICBIZWxwZXJzLmluaXQoKTtcclxuICBJbnB1dC5pbml0KCk7XHJcbiAgRm9ybS5pbml0KCk7XHJcbiAgQ2Fyb3VzZWwuaW5pdCgpO1xyXG4gIE1vZGFsLmluaXQoKTtcclxuICBBbmltYXRpb24uaW5pdCgpO1xyXG4gIFNoYXJlLmluaXQoKTtcclxuICBcclxufSk7XHJcblxyXG5cclxuLyoqXHJcbiAqINCh0L/QuNGB0L7QuiDRjdC60YHQv9C+0YDRgtC40YDRg9C10LzRi9GFINC80L7QtNGD0LvQtdC5LCDRh9GC0L7QsdGLINC40LzQtdGC0Ywg0Log0L3QuNC8INC00L7RgdGC0YPQvyDQuNC30LLQvdC1XHJcbiAqIEBleGFtcGxlXHJcbiAqIE1haW4uRm9ybS5pc0Zvcm1WYWxpZCgpO1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgRGV2aWNlRGV0ZWN0aW9uLFxyXG4gIEhlbHBlcnMsXHJcbiAgSW5wdXQsXHJcbiAgRm9ybSxcclxuICBDYXJvdXNlbCxcclxuICBNb2RhbCxcclxuICBBbmltYXRpb24sXHJcbiAgU2hhcmVcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2pzL21haW4uanMiLCJsZXQgYnJlYWtwb2ludHMgPSB7XHJcbiAgc206IDc2NyxcclxuICBtZDogMTAyNCxcclxuICBsZzogMTI4MCxcclxuICB4bDogMTYwMFxyXG59O1xyXG5cclxuZnVuY3Rpb24gaXNNb2JpbGUoKXtcclxuICByZXR1cm4gKCQod2luZG93KS53aWR0aCgpIDw9IGJyZWFrcG9pbnRzLnNtKTtcclxufVxyXG5mdW5jdGlvbiBpc1RhYmxldCgpe1xyXG4gIHJldHVybiAoJCh3aW5kb3cpLndpZHRoKCkgPiBicmVha3BvaW50cy5zbSAmJiAkKHdpbmRvdykud2lkdGgoKSA8PSBicmVha3BvaW50cy5tZClcclxufVxyXG5mdW5jdGlvbiBpc1RvdWNoKCl7XHJcbiAgcmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHM7XHJcbn1cclxuZnVuY3Rpb24gaXNNb2JpbGVWZXJzaW9uKCl7XHJcbiAgcmV0dXJuICEhfndpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCIvbW9iaWxlL1wiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcnVuKCl7XHJcbiAgaWYoaXNUb3VjaCgpKXtcclxuICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnbm8tdG91Y2gnKS5hZGRDbGFzcygndG91Y2gnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCd0b3VjaCcpLmFkZENsYXNzKCduby10b3VjaCcpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7cnVuLCBpc1RvdWNoLCBpc01vYmlsZSwgaXNUYWJsZXQsIGlzTW9iaWxlVmVyc2lvbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb24uanMiLCIvKipcclxuICogSGVscGVyc1xyXG4gKiBAbW9kdWxlIEhlbHBlcnNcclxuICovXHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlIHNjcm9sbGJhciB3aWR0aCBpbiBlbGVtZW50XHJcbiAqIC0gaWYgdGhlIHdpZHRoIGlzIDAgaXQgbWVhbnMgdGhlIHNjcm9sbGJhciBpcyBmbG9hdGVkL292ZXJsYXllZFxyXG4gKiAtIGFjY2VwdHMgXCJjb250YWluZXJcIiBwYXJlbWV0ZXIgYmVjYXVzZSBpZSAmIGVkZ2UgY2FuIGhhdmUgZGlmZmVyZW50XHJcbiAqICAgc2Nyb2xsYmFyIGJlaGF2aW9ycyBmb3IgZGlmZmVyZW50IGVsZW1lbnRzIHVzaW5nICctbXMtb3ZlcmZsb3ctc3R5bGUnXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXROYXRpdmVTY3JvbGxiYXJXaWR0aCAoY29udGFpbmVyKSB7XHJcbiAgY29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmJvZHk7XHJcblxyXG4gIGxldCBmdWxsV2lkdGggPSAwO1xyXG4gIGxldCBiYXJXaWR0aCA9IDA7XHJcblxyXG4gIGxldCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgbGV0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG4gIHdyYXBwZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gIHdyYXBwZXIuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICB3cmFwcGVyLnN0eWxlLmJvdHRvbSA9ICcwJztcclxuICB3cmFwcGVyLnN0eWxlLnJpZ2h0ID0gJzAnO1xyXG4gIHdyYXBwZXIuc3R5bGUud2lkdGggPSAnMTAwcHgnO1xyXG4gIHdyYXBwZXIuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHJcbiAgd3JhcHBlci5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xyXG5cclxuICBmdWxsV2lkdGggPSBjaGlsZC5vZmZzZXRXaWR0aDtcclxuICB3cmFwcGVyLnN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xyXG4gIGJhcldpZHRoID0gZnVsbFdpZHRoIC0gY2hpbGQub2Zmc2V0V2lkdGg7XHJcblxyXG4gIGNvbnRhaW5lci5yZW1vdmVDaGlsZCh3cmFwcGVyKTtcclxuXHJcbiAgcmV0dXJuIGJhcldpZHRoO1xyXG59XHJcblxyXG4vKipcclxuICogVGhyb3R0bGUgSGVscGVyXHJcbiAqIGh0dHBzOi8vcmVteXNoYXJwLmNvbS8yMDEwLzA3LzIxL3Rocm90dGxpbmctZnVuY3Rpb24tY2FsbHNcclxuICovXHJcbmZ1bmN0aW9uIHRocm90dGxlIChmbiwgdGhyZXNoaG9sZCwgc2NvcGUpIHtcclxuICB0aHJlc2hob2xkIHx8ICh0aHJlc2hob2xkID0gMjUwKTtcclxuICBsZXQgbGFzdCxcclxuICAgIGRlZmVyVGltZXI7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBjb250ZXh0ID0gc2NvcGUgfHwgdGhpcztcclxuXHJcbiAgICBsZXQgbm93ID0gK25ldyBEYXRlKCksXHJcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICBpZiAobGFzdCAmJiBub3cgPCBsYXN0ICsgdGhyZXNoaG9sZCkge1xyXG4gICAgICAvLyBob2xkIG9uIHRvIGl0XHJcbiAgICAgIGNsZWFyVGltZW91dChkZWZlclRpbWVyKTtcclxuICAgICAgZGVmZXJUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxhc3QgPSBub3c7XHJcbiAgICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgIH0sIHRocmVzaGhvbGQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGFzdCA9IG5vdztcclxuICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKiogXHJcbiAqIERlYm91bmNlIEhlbHBlclxyXG4gKiBodHRwczovL3JlbXlzaGFycC5jb20vMjAxMC8wNy8yMS90aHJvdHRsaW5nLWZ1bmN0aW9uLWNhbGxzXHJcbiAqL1xyXG5mdW5jdGlvbiBkZWJvdW5jZSAoZm4sIGRlbGF5KSB7XHJcbiAgbGV0IHRpbWVyID0gbnVsbDtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgfSwgZGVsYXkpO1xyXG4gIH07XHJcbn07XHJcblxyXG5sZXQgdGltZXI7XHJcbmxldCB0aW1lb3V0ID0gZmFsc2U7XHJcbmxldCBkZWx0YSA9IDIwMDtcclxuZnVuY3Rpb24gcmVzaXplRW5kKCkge1xyXG4gIGlmIChuZXcgRGF0ZSgpIC0gdGltZXIgPCBkZWx0YSkge1xyXG4gICAgc2V0VGltZW91dChyZXNpemVFbmQsIGRlbHRhKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGltZW91dCA9IGZhbHNlO1xyXG4gICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3Jlc2l6ZWVuZCcpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdG9nZ2xlQ2xhc3NJZihlbCwgY29uZCwgdG9nZ2xlZENsYXNzKXtcclxuXHRpZihjb25kKXtcclxuXHRcdGVsLmFkZENsYXNzKHRvZ2dsZWRDbGFzcyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGVsLnJlbW92ZUNsYXNzKHRvZ2dsZWRDbGFzcyk7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICog0KTRg9C90LrRhtC40Y8g0LTQvtCx0LDQstC70Y/QtdGCINC6INGN0LvQtdC80LXQvdGC0YMg0LrQu9Cw0YHRgSwg0LXRgdC70Lgg0YHRgtGA0LDQvdC40YbQsCDQv9GA0L7QutGA0YPRh9C10L3QsCDQsdC+0LvRjNGI0LUsINGH0LXQvCDQvdCwINGD0LrQsNC30LDQvdC90L7QtSDQt9C90LDRh9C10L3QuNC1LCBcclxuICog0Lgg0YPQsdC40YDQsNC10YIg0LrQu9Cw0YHRgSwg0LXRgdC70Lgg0LfQvdCw0YfQtdC90LjQtSDQvNC10L3RjNGI0LVcclxuICogQHBhcmFtIHtvYmplY3R9IGVsIC0g0Y3Qu9C10LzQtdC90YIsINGBINC60L7RgtC+0YDRi9C8INCy0LfQsNC40LzQvtC00LXQudGB0YLQstGD0LXQvFxyXG4gKiBAcGFyYW0ge21peGVkfSBbc2Nyb2xsVmFsdWU9MF0gLSDQt9C90LDRh9C10L3QuNC1INC/0YDQvtC60YDRg9GC0LrQuCwg0L3QsCDQutC+0YLQvtGA0L7QvCDQvNC10L3Rj9C10LwgY3NzLdC60LvQsNGB0YEsINC+0LbQuNC00LDQtdC80L7QtSDQt9C90LDRh9C10L3QuNC1IC0g0YfQuNGB0LvQviDQuNC70Lgg0LrQu9GO0YfQtdCy0L7QtSDRgdC70L7QstC+ICd0aGlzJy4g0JXRgdC70Lgg0L/QtdGA0LXQtNCw0L3QviAndGhpcycsINC/0L7QtNGB0YLQsNCy0LvRj9C10YLRgdGPINC/0L7Qu9C+0LbQtdC90LjQtSBlbC5vZmZzZXQoKS50b3Ag0LzQuNC90YPRgSDQv9C+0LvQvtCy0LjQvdCwINCy0YvRgdC+0YLRiyDRjdC60YDQsNC90LBcclxuICogQHBhcmFtIHtzdHJpbmd9IFt0b2dnbGVkQ2xhc3M9c2Nyb2xsZWRdIC0gY3NzLdC60LvQsNGB0YEsINC60L7RgtC+0YDRi9C5INC/0LXRgNC10LrQu9GO0YfQsNC10LxcclxuICovXHJcbmZ1bmN0aW9uIHRvZ2dsZUVsZW1lbnRDbGFzc09uU2Nyb2xsKGVsLCBzY3JvbGxWYWx1ZSA9IDAsIHRvZ2dsZWRDbGFzcyA9ICdzY3JvbGxlZCcpe1xyXG5cdGlmKGVsLmxlbmd0aCA9PSAwKSB7XHJcblx0XHQvL2NvbnNvbGUuZXJyb3IoXCLQndC10L7QsdGF0L7QtNC40LzQviDQv9C10YDQtdC00LDRgtGMINC+0LHRitC10LrRgiwg0YEg0LrQvtGC0L7RgNGL0Lwg0LLRiyDRhdC+0YLQuNGC0LUg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0L7QstCw0YLRjFwiKTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblx0XHJcblx0aWYoc2Nyb2xsVmFsdWUgPT0gJ3RoaXMnKSB7XHJcblx0XHRzY3JvbGxWYWx1ZSA9IGVsLm9mZnNldCgpLnRvcCAtICQod2luZG93KS5vdXRlckhlaWdodCgpIC8gMjtcclxuXHR9XHJcblx0XHJcblx0JCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbihlKXtcclxuXHRcdGlmKCQod2luZG93KS5zY3JvbGxUb3AoKSA+IHNjcm9sbFZhbHVlKXtcclxuXHRcdFx0ZWwuYWRkQ2xhc3ModG9nZ2xlZENsYXNzKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGVsLnJlbW92ZUNsYXNzKHRvZ2dsZWRDbGFzcyk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn07XHJcblxyXG4vKipcclxuICog0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtCx0YvRgtC40Lkg0LTQu9GPINC/0LXRgNC10LrQu9GO0YfQsNGC0LXQu9C10Lkg0LrQu9Cw0YHRgdC+0LJcclxuICogQGV4YW1wbGVcclxuICogSGVscGVycy5pbml0KCk7XHJcbiAqL1xyXG5mdW5jdGlvbiBpbml0KCl7XHJcbiAgXHJcbiAgdG9nZ2xlRWxlbWVudENsYXNzT25TY3JvbGwoJCgnLmhlYWRlcicpLCA1MCk7XHJcbiAgXHJcbiAgJCgnLmpzLWhpZGUtYmxvY2snKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgbGV0IGJsb2NrID0gJCh0aGlzKS5kYXRhKCd0YXJnZXQnKSA9PT0gJ3NlbGYnID8gJCh0aGlzKS5wYXJlbnQoKSA6ICQodGhpcykuZGF0YSgndGFyZ2V0Jyk7XHJcbiAgICBibG9jay5mYWRlT3V0KDUwMCk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aW1lciA9IG5ldyBEYXRlKCk7XHJcbiAgICBpZiAodGltZW91dCA9PT0gZmFsc2UpIHtcclxuICAgICAgdGltZW91dCA9IHRydWU7XHJcbiAgICAgIHNldFRpbWVvdXQocmVzaXplRW5kLCBkZWx0YSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgJCgnLmJ0bi1tZW51Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2lzLW9wZW4nKTtcclxuICAgICQoJy5oZWFkZXInKS50b2dnbGVDbGFzcygnaXMtb3BlbicpO1xyXG4gICAgJCgnLm1haW4tbmF2Jykuc2xpZGVUb2dnbGUoNTAwKTtcclxuICB9KTtcclxuICBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7aW5pdCwgdG9nZ2xlQ2xhc3NJZiwgdG9nZ2xlRWxlbWVudENsYXNzT25TY3JvbGx9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvY29tcG9uZW50cy9oZWxwZXJzLmpzIiwiLyoqXHJcbiAqINCa0LDRgNGD0YHQtdC70YxcclxuICogQG1vZHVsZSBDYXJvdXNlbFxyXG4gKi9cclxuLy8gZGVmYXVsdFxyXG5sZXQgY2Fyb3VzZWxEZWZhdWx0ID0gJChcIi5vd2wtY2Fyb3VzZWwuY2Fyb3VzZWwtLWRlZmF1bHRcIik7XHJcbmxldCBjYXJvdXNlbERlZmF1bHRPcHRpb25zID0ge1xyXG4gIGl0ZW1zOiAxLFxyXG4gIG5hdjogdHJ1ZSxcclxuICBuYXZUZXh0OiBbJzxzdmcgY2xhc3M9XCJpY29uXCI+PHVzZSB4bGluazpocmVmPVwiI3ByZXZcIi8+PC9zdmc+JywgJzxzdmcgY2xhc3M9XCJpY29uXCI+PHVzZSB4bGluazpocmVmPVwiI25leHRcIi8+PC9zdmc+J10sXHJcbiAgZG90czogdHJ1ZSxcclxuICBkb3RzRGF0YTogdHJ1ZSxcclxuICBsb29wOiBmYWxzZSxcclxuICBzdGFnZVBhZGRpbmc6IDUwLFxyXG4gIG1vdXNlRHJhZzogZmFsc2UsXHJcbiAgYW5pbWF0ZU91dDogJ2ZhZGVPdXQnLFxyXG4gIHJlc3BvbnNpdmU6IHtcclxuICAgIDA6IHtcclxuICAgICAgc3RhZ2VQYWRkaW5nOiAwLFxyXG4gICAgICBhdXRvSGVpZ2h0OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgMTAyNDoge1xyXG4gICAgICBzdGFnZVBhZGRpbmc6IDUwLFxyXG4gICAgICBhdXRvSGVpZ2h0OiBmYWxzZVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4vLyBtb2JpbGUgb25seVxyXG5sZXQgY2Fyb3VzZWxNb2JpbGUgPSAkKFwiLm93bC1jYXJvdXNlbC5jYXJvdXNlbC0tbW9iaWxlXCIpO1xyXG5sZXQgY2Fyb3VzZWxNb2JpbGVPcHRpb25zID0ge1xyXG4gIGl0ZW1zOiAxLFxyXG4gIG1hcmdpbjogMjAsXHJcbiAgYXV0b1dpZHRoOiB0cnVlLFxyXG4gIHN0YWdlUGFkZGluZzogMjAsXHJcbiAgbmF2OiB0cnVlLFxyXG4gIG5hdlRleHQ6IFsnPHN2ZyBjbGFzcz1cImljb25cIj48dXNlIHhsaW5rOmhyZWY9XCIjcHJldi0yXCIvPjwvc3ZnPicsICc8c3ZnIGNsYXNzPVwiaWNvblwiPjx1c2UgeGxpbms6aHJlZj1cIiNuZXh0LTJcIi8+PC9zdmc+J10sXHJcbiAgZG90czogZmFsc2UsXHJcbiAgbW91c2VEcmFnOiBmYWxzZVxyXG59XHJcblxyXG5mdW5jdGlvbiBjYXJvdXNlbEluaXRCeUNvbmRpdGlvbihjYXJvdXNlbCwgb3B0aW9ucywgY29uZGl0aW9uKSB7XHJcbiAgaWYgKGNvbmRpdGlvbikge1xyXG4gICAgY2Fyb3VzZWwub3dsQ2Fyb3VzZWwob3B0aW9ucyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNhcm91c2VsLnRyaWdnZXIoJ2Rlc3Ryb3kub3dsLmNhcm91c2VsJyk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LrQsNGA0YPRgdC10LvQuFxyXG4gKi9cclxuZnVuY3Rpb24gaW5pdCgpe1xyXG4gIGNhcm91c2VsRGVmYXVsdC5vd2xDYXJvdXNlbChjYXJvdXNlbERlZmF1bHRPcHRpb25zKTtcclxuICBjYXJvdXNlbEluaXRCeUNvbmRpdGlvbihjYXJvdXNlbE1vYmlsZSwgY2Fyb3VzZWxNb2JpbGVPcHRpb25zLCBNYWluLkRldmljZURldGVjdGlvbi5pc01vYmlsZVZlcnNpb24oKSk7XHJcbiAgXHJcbiAgLy8gaW5pdCBvbiByZXNpemVcclxuICAkKHdpbmRvdykub24oJ3Jlc2l6ZWVuZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBjYXJvdXNlbEluaXRCeUNvbmRpdGlvbihjYXJvdXNlbE1vYmlsZSwgY2Fyb3VzZWxNb2JpbGVPcHRpb25zLCBNYWluLkRldmljZURldGVjdGlvbi5pc01vYmlsZVZlcnNpb24oKSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2luaXR9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvY29tcG9uZW50cy9jYXJvdXNlbC5qcyIsIi8qKlxyXG4gKiDQnNC+0LTRg9C70Ywg0LTQu9GPINGA0LDQsdC+0YLRiyBwbGFjZWhvbGRlciDQsiDRjdC70LXQvNC10L3RgtCw0YUg0YTQvtGA0LzRiyAoLmZpZWxkKVxyXG4gKiBAbW9kdWxlIElucHV0XHJcbiAqL1xyXG5cclxuXHJcbi8qKlxyXG4gKiDQo9GB0YLQsNC90L7QstC40YLRjCDRhNC+0LrRg9GBXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBpbnB1dFxyXG4gKi9cclxuZnVuY3Rpb24gZm9jdXNMYWJlbChpbnB1dCl7XHJcbiAgICBpbnB1dC5jbG9zZXN0KCcuZmllbGQnKS5hZGRDbGFzcyhcImhhcy1mb2N1c1wiKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCj0LHRgNCw0YLRjCDRhNC+0LrRg9GBXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBpbnB1dFxyXG4gKi9cclxuZnVuY3Rpb24gYmx1ckxhYmVsKGlucHV0KXtcclxuICAgIHZhciB3cmFwcGVyID0gaW5wdXQuY2xvc2VzdCgnLmZpZWxkJyk7XHJcbiAgICB3cmFwcGVyLnJlbW92ZUNsYXNzKFwiaGFzLWZvY3VzXCIpO1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC+0LLQtdGA0LjRgtGMINC40L3Qv9GD0YIg0L3QsCDQvdCw0LvQuNGH0LjQtSB2YWx1ZVxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge29iamVjdH0gaW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIGNoZWNrSW5wdXQoaW5wdXQpe1xyXG4gICAgdmFyIHdyYXBwZXIgPSBpbnB1dC5jbG9zZXN0KCcuZmllbGQnKTtcclxuICAgIGlmIChpbnB1dC52YWwoKS5sZW5ndGggPiAwKVxyXG4gICAgICAgIHdyYXBwZXIuYWRkQ2xhc3MoXCJoYXMtdmFsdWVcIik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgd3JhcHBlci5yZW1vdmVDbGFzcyhcImhhcy12YWx1ZVwiKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7QsdGL0YLQuNC5INC00LvRjyDQuNC90L/Rg9GC0LBcclxuICogQGV4YW1wbGVcclxuICogSW5wdXQuaW5pdCgpO1xyXG4gKi9cclxuZnVuY3Rpb24gaW5pdCgpe1xyXG4gICAgbGV0IGlucHV0cyA9ICQoJy5maWVsZF9faW5wdXQnKTtcclxuICAgIGxldCBwbGFjZWhvbGRlcnMgPSAkKCcuZmllbGRfX3BsYWNlaG9sZGVyJyk7XHJcbiAgICBcclxuICAgIHBsYWNlaG9sZGVycy5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5maWVsZCcpLmZpbmQoJy5maWVsZF9faW5wdXQnKS5mb2N1cygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaW5wdXRzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgIGNoZWNrSW5wdXQoJChpdGVtKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpbnB1dHMuZm9jdXMoZnVuY3Rpb24oKXtcclxuICAgICAgICBmb2N1c0xhYmVsKCQodGhpcykpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaW5wdXRzLmJsdXIoZnVuY3Rpb24oKXtcclxuICAgICAgICBibHVyTGFiZWwoJCh0aGlzKSk7XHJcbiAgICAgICAgY2hlY2tJbnB1dCgkKHRoaXMpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtpbml0fTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2pzL2NvbXBvbmVudHMvaW5wdXQuanMiLCIvKipcclxuICog0JzQvtC00YPQu9GMINC00LvRjyDRgNCw0LHQvtGC0Ysg0KTQvtGA0LxcclxuICogQG1vZHVsZSBGb3JtXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVGaWVsZChmaWVsZCkge1xyXG4gIGxldCBpc1ZhbGlkID0gZmllbGQudmFsaWRpdHkudmFsaWQ7XHJcbiAgbGV0IGZpZWxkQ29udGFpbmVyID0gJChmaWVsZCkuY2xvc2VzdCgnLmZpZWxkJyk7XHJcbiAgaWYgKGlzVmFsaWQpIHtcclxuICAgIGZpZWxkQ29udGFpbmVyLnJlbW92ZUNsYXNzKCdoYXMtZXJyb3InKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZmllbGRDb250YWluZXIuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG4gIH1cclxuICByZXR1cm4gaXNWYWxpZDtcclxufVxyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVGb3JtKGVsRm9ybSkge1xyXG4gIGxldCBlcnJvcnMgPSAwO1xyXG4gIEFycmF5LmZyb20oZWxGb3JtLmVsZW1lbnRzKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgIGxldCBpc1ZhbGlkRmllbGQgPSB2YWxpZGF0ZUZpZWxkKGl0ZW0pO1xyXG4gICAgaWYoIWlzVmFsaWRGaWVsZCkge1xyXG4gICAgICBlcnJvcnMgKz0gMTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gZXJyb3JzO1xyXG59XHJcblxyXG4vKipcclxuICog0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtCx0YvRgtC40Lkg0YTQvtGA0LxcclxuICogQGV4YW1wbGVcclxuICogRm9ybS5pbml0KCk7XHJcbiAqL1xyXG5mdW5jdGlvbiBpbml0KCl7XHJcbiAgbGV0IGpzRm9ybSA9ICQoJy5qcy1mb3JtJyk7XHJcbiAgXHJcbiAgJCgnaW5wdXQsIHRleHRhcmVhJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YWxpZGF0ZUZpZWxkKHRoaXMpO1xyXG4gIH0pO1xyXG4gIFxyXG4gIGpzRm9ybS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgc2VsZiA9ICQodGhpcyk7XHJcbiAgICBsZXQgc2VsZkZvcm0gPSBzZWxmLmZpbmQoJy5qcy1mb3JtLWZvcm0nKTtcclxuICAgIGxldCBzZWxmUmVzdWx0ID0gc2VsZi5maW5kKCcuanMtZm9ybS1yZXN1bHQnKTtcclxuICAgIGxldCBzZWxmU3VibWl0ID0gc2VsZi5maW5kKCcuanMtZm9ybS1zdWJtaXQnKTtcclxuICAgIFxyXG4gICAgc2VsZlN1Ym1pdC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGhhc0Vycm9yID0gdmFsaWRhdGVGb3JtKHNlbGZGb3JtWzBdKTtcclxuICAgICAgaWYgKCFoYXNFcnJvcikge1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NjaXRhbmUuaHNtcC5ydS9hcGkvZW1haWxzLycsXHJcbiAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAnbmFtZSc6ICQoc2VsZkZvcm0pLmZpbmQoJ2lucHV0W25hbWU9XCJuYW1lXCJdJykudmFsKCksXHJcbiAgICAgICAgICAgICdlbWFpbCc6ICQoc2VsZkZvcm0pLmZpbmQoJ2lucHV0W25hbWU9XCJlbWFpbFwiXScpLnZhbCgpLFxyXG4gICAgICAgICAgICAnbWVzc2FnZSc6ICQoc2VsZkZvcm0pLmZpbmQoJ3RleHRhcmVhW25hbWU9XCJtZXNzYWdlXCJdJykudmFsKCksXHJcbiAgICAgICAgICAgICdwYWdlJzogd2luZG93LmxvY2F0aW9uLmhyZWZcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGZTdWJtaXQuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXF1ZXN0LmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xyXG4gICAgICAgICAgc2VsZi5hZGRDbGFzcygnaXMtc3VibWl0dGVkJyk7XHJcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3N1Ym1pdHRlZCcpO1xyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBzZWxmUmVzdWx0LnNob3coKTtcclxuICAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtpbml0fTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2pzL2NvbXBvbmVudHMvZm9ybS5qcyIsIi8qKlxyXG4gKiDQktGB0L/Qu9GL0LLQsNGO0YnQuNC1INC+0LrQvdCwXHJcbiAqIEBtb2R1bGUgTW9kYWxcclxuICovXHJcblxyXG5sZXQgbGF5b3V0ID0gJCgnLmxheW91dCcpO1xyXG4gXHJcbmZ1bmN0aW9uIG9wZW5Nb2RhbChtb2RhbCkge1xyXG4gIGxheW91dC5hZGRDbGFzcygnbW9kYWwtb3BlbicpO1xyXG4gICQoJ2h0bWwsIGJvZHknKS5jc3MoJ292ZXJmbG93LXknLCAnaGlkZGVuJyk7XHJcbiAgbW9kYWwuZmFkZUluKDMwMCkuYWRkQ2xhc3MoJ2lzLW9wZW5lZCcpO1xyXG4gIG1vZGFsLnRyaWdnZXIoJ29wZW5lZCcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbG9zZU1vZGFsKG1vZGFsKSB7XHJcbiAgbW9kYWwuZmFkZU91dCgzMDApLnJlbW92ZUNsYXNzKCdpcy1vcGVuZWQnKTtcclxuICBsYXlvdXQucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKTtcclxuICAkKCdodG1sLCBib2R5JykuY3NzKCdvdmVyZmxvdy15JywgJycpO1xyXG4gIG1vZGFsLnRyaWdnZXIoJ2Nsb3NlZCcpO1xyXG59XHJcblxyXG4vKipcclxuICog0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtCx0YvRgtC40Lkg0LTQu9GPINCy0YHQv9C70YvQstCw0Y7RidC40YUg0L7QutC+0L1cclxuICogQGV4YW1wbGVcclxuICogTW9kYWwuaW5pdCgpO1xyXG4gKi9cclxuZnVuY3Rpb24gaW5pdCgpe1xyXG4gICAgXHJcbiAgJCgnLmpzLW1vZGFsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IHRhcmdldCA9ICQodGhpcykuYXR0cignZGF0YS10YXJnZXQnKTtcclxuICAgICAgbGV0IG1vZGFsID0gJCh0YXJnZXQpO1xyXG4gICAgICBpZiAoIW1vZGFsLmhhc0NsYXNzKCdpcy1vcGVuZWQnKSkge1xyXG4gICAgICAgIG9wZW5Nb2RhbChtb2RhbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2xvc2VNb2RhbChtb2RhbCk7XHJcbiAgICAgIH1cclxuICB9KTtcclxuICBcclxuICAkKCcuanMtY2xvc2UtbW9kYWwnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IG1vZGFsID0gJCh0aGlzKS5jbG9zZXN0KCcubW9kYWwnKTtcclxuICAgIGNsb3NlTW9kYWwobW9kYWwpO1xyXG4gIH0pO1xyXG4gIFxyXG4gICQoJy5tb2RhbF9fYmcnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICBsZXQgbW9kYWwgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tb2RhbCcpO1xyXG4gICAgY2xvc2VNb2RhbChtb2RhbCk7XHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtpbml0LCBvcGVuTW9kYWwsIGNsb3NlTW9kYWx9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvY29tcG9uZW50cy9tb2RhbC5qcyIsIi8qKlxyXG4gKiDQn9C10YDQtdC60LvRjtGH0LXQvdC40LUg0LrQu9Cw0YHRgdC+0LIg0L/QviDRgNCw0LfQu9C40YfQvdGL0Lwg0YHQvtCx0YvRgtC40Y/QvFxyXG4gKiBAbW9kdWxlIEFuaW1hdGlvblxyXG4gKi9cclxuXHJcbmxldCBzY3JvbGxBbmltYXRpb25CbG9ja3MgPSAkKCcuYS1zY3JvbGwtYm94Jyk7XHJcbmxldCBwYXJhbGxheEJsb2NrcyA9ICQoJy5hLXBhcmFsbGF4LWJveCcpO1xyXG4gXHJcbmZ1bmN0aW9uIGFkZENsYXNzVG9nZ2xlclNjZW5lIChlbCwgY29udHJvbGxlcikge1xyXG4gIG5ldyBTY3JvbGxNYWdpYy5TY2VuZSh7XHJcbiAgICB0cmlnZ2VyRWxlbWVudDogZWwsXHJcbiAgICB0cmlnZ2VySG9vazogMC43XHJcbiAgfSlcclxuICAuc2V0Q2xhc3NUb2dnbGUoZWwsICdhbmltYXRlJylcclxuICAuYWRkVG8oY29udHJvbGxlcik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZENsYXNzVG9nZ2xlckNvbnRyb2xsZXIgKGFuaW1hdGlvbkJsb2Nrcykge1xyXG4gIGxldCBjb250cm9sbGVyID0gbmV3IFNjcm9sbE1hZ2ljLkNvbnRyb2xsZXIoKTtcclxuICBhbmltYXRpb25CbG9ja3MuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgbGV0IGNsb3Nlc3RDb250YWluZXIgPSAkKHRoaXMpLmNsb3Nlc3QoJy5sLWNvbnRhaW5lcicpLnBhcmVudCgpWzBdO1xyXG4gICAgaWYgKGNsb3Nlc3RDb250YWluZXIub2Zmc2V0VG9wIDwgd2luZG93Lm91dGVySGVpZ2h0KSB7XHJcbiAgICAgICQodGhpcykuY2hpbGRyZW4oJ1tjbGFzcyo9XCJhLVwiXScpLmNzcyh7J3RyYW5zaXRpb24nOiAnbm9uZSd9KTtcclxuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICBsZXQgZGVsYXkgPSAyNTAgKiAkKGNsb3Nlc3RDb250YWluZXIpLmluZGV4KCk7XHJcbiAgICAgICQoc2VsZikuZGF0YSgndGltZXInLCBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHNlbGYpLmNoaWxkcmVuKCdbY2xhc3MqPVwiYS1cIl0nKS5jc3Moeyd0cmFuc2l0aW9uJzogJyd9KTtcclxuICAgICAgICAkKHNlbGYpLmFkZENsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAgIH0sIDI1MCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGFEZWxheSA9IDA7XHJcbiAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtYS1kZWxheScpICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBhRGVsYXkgPSBOdW1iZXIoJCh0aGlzKS5hdHRyKCdkYXRhLWEtZGVsYXknKSkgKiAxMDAwO1xyXG4gICAgICB9XHJcbiAgICAgIHNldFRpbWVvdXQoYWRkQ2xhc3NUb2dnbGVyU2NlbmUsIGFEZWxheSwgdGhpcywgY29udHJvbGxlcik7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZyb21Qb3NpdGlvbiAoZWwsIGRlZmF1bHRQb3NpdGlvbiA9IDApe1xyXG4gIHJldHVybiAoZWwuYXR0cignZGF0YS1wYXJhbGxheC1mcm9tJykgIT09IHVuZGVmaW5lZCkgPyBOdW1iZXIoZWwuYXR0cignZGF0YS1wYXJhbGxheC1mcm9tJykpIDogZGVmYXVsdFBvc2l0aW9uO1xyXG59XHJcbmZ1bmN0aW9uIGdldFRvUG9zaXRpb24gKGVsLCBkZWZhdWx0UG9zaXRpb24gPSAwKXtcclxuICByZXR1cm4gKGVsLmF0dHIoJ2RhdGEtcGFyYWxsYXgtdG8nKSAhPT0gdW5kZWZpbmVkKSA/IE51bWJlcihlbC5hdHRyKCdkYXRhLXBhcmFsbGF4LXRvJykpIDogZGVmYXVsdFBvc2l0aW9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQYXJhbGxheFRpbWVsaW5lIChlbCkge1xyXG4gIGxldCB0d2VlbiA9IG5ldyBUaW1lbGluZU1heCgpO1xyXG4gIGxldCB0d2VlbnNBcnIgPSBbXTtcclxuICBpZiAoJChlbCkuZmluZCgnLmEtcGFyYWxsYXgtYmFjaycpKSB7XHJcbiAgICBsZXQgdGFyZ2V0RWwgPSAkKGVsKS5maW5kKCcuYS1wYXJhbGxheC1iYWNrJyk7XHJcbiAgICBsZXQgZnJvbVBvcyA9IGdldEZyb21Qb3NpdGlvbih0YXJnZXRFbCwgLTIwKTtcclxuICAgIGxldCB0b1BvcyA9IGdldFRvUG9zaXRpb24odGFyZ2V0RWwpO1xyXG4gICAgdHdlZW5zQXJyLnB1c2goVHdlZW5NYXguZnJvbVRvKHRhcmdldEVsLCAxLCB7eVBlcmNlbnQ6IGZyb21Qb3N9LCB7eVBlcmNlbnQ6IHRvUG9zLCBlYXNlOiBMaW5lYXIuZWFzZU5vbmV9KSk7XHJcbiAgfVxyXG4gIGlmICgkKGVsKS5maW5kKCcuYS1wYXJhbGxheC1taWRkbGUnKSkge1xyXG4gICAgbGV0IHRhcmdldEVsID0gJChlbCkuZmluZCgnLmEtcGFyYWxsYXgtbWlkZGxlJyk7XHJcbiAgICBsZXQgZnJvbVBvcyA9IGdldEZyb21Qb3NpdGlvbih0YXJnZXRFbCwgLTE1KTtcclxuICAgIGxldCB0b1BvcyA9IGdldFRvUG9zaXRpb24odGFyZ2V0RWwpO1xyXG4gICAgdHdlZW5zQXJyLnB1c2goVHdlZW5NYXguZnJvbVRvKHRhcmdldEVsLCAxLCB7eVBlcmNlbnQ6IGZyb21Qb3N9LCB7eVBlcmNlbnQ6IHRvUG9zLCBlYXNlOiBMaW5lYXIuZWFzZU5vbmV9KSk7XHJcbiAgfVxyXG4gIGlmICgkKGVsKS5maW5kKCcuYS1wYXJhbGxheC1mcm9udCcpKSB7XHJcbiAgICBsZXQgdGFyZ2V0RWwgPSAkKGVsKS5maW5kKCcuYS1wYXJhbGxheC1mcm9udCcpO1xyXG4gICAgbGV0IGZyb21Qb3MgPSBnZXRGcm9tUG9zaXRpb24odGFyZ2V0RWwsIC0xMCk7XHJcbiAgICBsZXQgdG9Qb3MgPSBnZXRUb1Bvc2l0aW9uKHRhcmdldEVsLCAxMCk7XHJcbiAgICB0d2VlbnNBcnIucHVzaChUd2Vlbk1heC5mcm9tVG8odGFyZ2V0RWwsIDEsIHt5UGVyY2VudDogZnJvbVBvc30sIHt5UGVyY2VudDogdG9Qb3MsIGVhc2U6IExpbmVhci5lYXNlTm9uZX0pKTtcclxuICB9XHJcbiAgdHdlZW4uYWRkKHR3ZWVuc0Fycik7XHJcbiAgcmV0dXJuIHR3ZWVuO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRQYXJhbGxheFNjZW5lIChlbCwgdHdlZW4sIGNvbnRyb2xsZXIpIHtcclxuICBuZXcgU2Nyb2xsTWFnaWMuU2NlbmUoe1xyXG4gICAgdHJpZ2dlckVsZW1lbnQ6IGVsLFxyXG4gICAgdHJpZ2dlckhvb2s6IDAsXHJcbiAgICBkdXJhdGlvbjogJChlbCkuaGVpZ2h0KClcclxuICB9KVxyXG4gIC5zZXRUd2Vlbih0d2VlbilcclxuICAuYWRkVG8oY29udHJvbGxlcik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFBhcmFsbGF4Q29udHJvbGxlciAoYW5pbWF0aW9uQmxvY2tzKSB7XHJcbiAgbGV0IGNvbnRyb2xsZXIgPSBuZXcgU2Nyb2xsTWFnaWMuQ29udHJvbGxlcigpO1xyXG4gIGFuaW1hdGlvbkJsb2Nrcy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgdHdlZW4gPSBnZXRQYXJhbGxheFRpbWVsaW5lKHRoaXMpO1xyXG4gICAgYWRkUGFyYWxsYXhTY2VuZSh0aGlzLCB0d2VlbiwgY29udHJvbGxlcik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQgKCkge1xyXG4gIGlmIChzY3JvbGxBbmltYXRpb25CbG9ja3MubGVuZ3RoID4gMCAmJiAkKHdpbmRvdykud2lkdGgoKSA+IDEwMjQpe1xyXG4gICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpcy1hbmltYXRpbmcnKTtcclxuICAgIGFkZENsYXNzVG9nZ2xlckNvbnRyb2xsZXIoc2Nyb2xsQW5pbWF0aW9uQmxvY2tzKTtcclxuICB9XHJcbiAgaWYgKHBhcmFsbGF4QmxvY2tzLmxlbmd0aCA+IDAgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiAxMDI0KXtcclxuICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtYW5pbWF0aW5nJyk7XHJcbiAgICBhZGRQYXJhbGxheENvbnRyb2xsZXIocGFyYWxsYXhCbG9ja3MpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7aW5pdH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL2FuaW1hdGlvbi5qcyIsImZ1bmN0aW9uIGdldEljb24oZWwpIHtcclxuICBsZXQgaWNvbiA9ICcnO1xyXG4gIGlmIChlbC5oYXNDbGFzcygneWEtc2hhcmUyX19pdGVtX3NlcnZpY2VfdmtvbnRha3RlJykpIHtcclxuICAgIGljb24gPSAndmsnO1xyXG4gIH1cclxuICBpZiAoZWwuaGFzQ2xhc3MoJ3lhLXNoYXJlMl9faXRlbV9zZXJ2aWNlX2ZhY2Vib29rJykpIHtcclxuICAgIGljb24gPSAnZmInO1xyXG4gIH1cclxuICBpZiAoZWwuaGFzQ2xhc3MoJ3lhLXNoYXJlMl9faXRlbV9zZXJ2aWNlX3R3aXR0ZXInKSkge1xyXG4gICAgaWNvbiA9ICd0dyc7XHJcbiAgfVxyXG4gIGNvbnNvbGUubG9nKGVsKTtcclxuICByZXR1cm4gJzxzdmcgY2xhc3M9XCJpY29uIHNvY2lhbC1pY29uXCI+PHVzZSB4bGluazpocmVmPVwiIycgKyBpY29uICsgJ1wiLz48L3N2Zz4nO1xyXG59XHJcbmZ1bmN0aW9uIGZpbGxJY29ucygpIHtcclxuICAkKCcjc2hhcmUgLnlhLXNoYXJlMl9faXRlbScpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICQodGhpcykuZmluZCgnLnlhLXNoYXJlMl9faWNvbicpLmh0bWwoZ2V0SWNvbigkKHRoaXMpKSk7XHJcbiAgfSk7XHJcbn1cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICBZYS5zaGFyZTIoJ3NoYXJlJywge1xyXG4gICAgY29udGVudDoge1xyXG4gICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxyXG4gICAgICB0aXRsZTogJ05pb3hpbjMwRGF5cycsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlwiLFxyXG4gICAgICAvL2ltYWdlOiAnYnVpbGQvaW1nL3NoYXJlLmpwZydcclxuICAgICAgaW1hZ2U6ICdodHRwOi8vbmlveGluMzBkYXlzLmVsbGUucnUvYnVpbGQvaW1nL3NoYXJlLmpwZydcclxuICAgIH0sXHJcbiAgICB0aGVtZToge1xyXG4gICAgICBzZXJ2aWNlczogJ3Zrb250YWt0ZSxmYWNlYm9vayx0d2l0dGVyJyxcclxuICAgICAgYmFyZTogdHJ1ZSxcclxuICAgICAgbGFuZzogJ2VuJ1xyXG4gICAgfSxcclxuICAgIGhvb2tzOiB7XHJcbiAgICAgIG9ucmVhZHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGZpbGxJY29ucygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSB7aW5pdH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL3NoYXJlLmpzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7Ozs7Ozs7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUMzQkE7Ozs7O0FBS0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7Ozs7Ozs7O0FDNUpBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBTEE7QUFXQTtBQXJCQTtBQXVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDNURBOzs7OztBQU1BOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDaEVBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBWkE7QUFjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzFFQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNuREE7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFiQTtBQW1CQTs7OzsiLCJzb3VyY2VSb290IjoiIn0=