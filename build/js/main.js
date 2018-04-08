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
	    if (Main.DeviceDetection.isMobileVersion()) {
	      if ($('.header').hasClass('is-open')) {
	        console.log('is-open');
	        $('html, body').css('overflow-y', 'hidden');
	      } else {
	        $('html, body').css('overflow-y', '');
	      }
	    }
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
	  dotsContainer: '.owl-dots',
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

	function synhDots(event) {
	  var page = event.page.index == -1 ? 0 : event.page.index;
	  var dots = $(event.target).siblings('.owl-dots--bottom').children('.owl-dot');
	  dots.eq(page).siblings().removeClass('active');
	  dots.eq(page).addClass('active');
	}

	/**
	 * Инициализация карусели
	 */
	function init() {
	  carouselDefault.on('initialized.owl.carousel', function (event) {
	    setTimeout(function () {
	      synhDots(event);
	    }, 100, event);
	  });
	  carouselDefault.owlCarousel(carouselDefaultOptions);
	  carouselDefault.on('changed.owl.carousel', function (event) {
	    synhDots(event);
	  });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjZmUwMGFhNzYxNmVjZTc4NWRmNCIsIndlYnBhY2s6Ly8vc3JjL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2Nhcm91c2VsLmpzIiwid2VicGFjazovLy9zcmMvanMvY29tcG9uZW50cy9pbnB1dC5qcyIsIndlYnBhY2s6Ly8vc3JjL2pzL2NvbXBvbmVudHMvZm9ybS5qcyIsIndlYnBhY2s6Ly8vc3JjL2pzL2NvbXBvbmVudHMvbW9kYWwuanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2FuaW1hdGlvbi5qcyIsIndlYnBhY2s6Ly8vc3JjL2pzL2NvbXBvbmVudHMvc2hhcmUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL25pb3hpbi9idWlsZC9qcy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjZmUwMGFhNzYxNmVjZTc4NWRmNCIsImxldCBEZXZpY2VEZXRlY3Rpb24gPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb25cIik7XHJcbmxldCBIZWxwZXJzID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9oZWxwZXJzXCIpO1xyXG5sZXQgQ2Fyb3VzZWwgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2Nhcm91c2VsXCIpO1xyXG5sZXQgSW5wdXQgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2lucHV0XCIpO1xyXG5sZXQgRm9ybSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvZm9ybVwiKTtcclxubGV0IE1vZGFsID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9tb2RhbFwiKTtcclxubGV0IEFuaW1hdGlvbiA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvYW5pbWF0aW9uXCIpO1xyXG5sZXQgU2hhcmUgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL3NoYXJlXCIpO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICBcclxuICBsZXQgaG9zdHMgPSB7XHJcbiAgICBcImVsbGVcIjogXCJuaW94aW4zMGRheXMuZWxsZS5ydVwiLFxyXG4gICAgXCJwc3lcIjogXCJuaW94aW4zMGRheXMucHN5Y2hvbG9naWVzLnJ1XCIsXHJcbiAgICBcIm1jXCI6IFwibmlveGluMzBkYXlzLm1hcmllY2xhaXJlLnJ1XCJcclxuICB9O1xyXG4gIFxyXG4gIGlmICh3aW5kb3cubG9jYXRpb24uaG9zdCA9PT0gaG9zdHMuZWxsZSkge1xyXG4gICAgJCgnLmxvZ28tLWVsbGUnKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgfVxyXG4gIGlmICh3aW5kb3cubG9jYXRpb24uaG9zdCA9PT0gaG9zdHMucHN5KSB7XHJcbiAgICAkKCcubG9nby0tcHN5JykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gIH1cclxuICBpZiAod2luZG93LmxvY2F0aW9uLmhvc3QgPT09IGhvc3RzLm1jKSB7XHJcbiAgICAkKCcubG9nby0tbWMnKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgfVxyXG4gIFxyXG4gIERldmljZURldGVjdGlvbi5ydW4oKTtcclxuICBIZWxwZXJzLmluaXQoKTtcclxuICBJbnB1dC5pbml0KCk7XHJcbiAgRm9ybS5pbml0KCk7XHJcbiAgQ2Fyb3VzZWwuaW5pdCgpO1xyXG4gIE1vZGFsLmluaXQoKTtcclxuICBBbmltYXRpb24uaW5pdCgpO1xyXG4gIFNoYXJlLmluaXQoKTtcclxuICBcclxufSk7XHJcblxyXG5cclxuLyoqXHJcbiAqINCh0L/QuNGB0L7QuiDRjdC60YHQv9C+0YDRgtC40YDRg9C10LzRi9GFINC80L7QtNGD0LvQtdC5LCDRh9GC0L7QsdGLINC40LzQtdGC0Ywg0Log0L3QuNC8INC00L7RgdGC0YPQvyDQuNC30LLQvdC1XHJcbiAqIEBleGFtcGxlXHJcbiAqIE1haW4uRm9ybS5pc0Zvcm1WYWxpZCgpO1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgRGV2aWNlRGV0ZWN0aW9uLFxyXG4gIEhlbHBlcnMsXHJcbiAgSW5wdXQsXHJcbiAgRm9ybSxcclxuICBDYXJvdXNlbCxcclxuICBNb2RhbCxcclxuICBBbmltYXRpb24sXHJcbiAgU2hhcmVcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2pzL21haW4uanMiLCJsZXQgYnJlYWtwb2ludHMgPSB7XHJcbiAgc206IDc2NyxcclxuICBtZDogMTAyNCxcclxuICBsZzogMTI4MCxcclxuICB4bDogMTYwMFxyXG59O1xyXG5cclxuZnVuY3Rpb24gaXNNb2JpbGUoKXtcclxuICByZXR1cm4gKCQod2luZG93KS53aWR0aCgpIDw9IGJyZWFrcG9pbnRzLnNtKTtcclxufVxyXG5mdW5jdGlvbiBpc1RhYmxldCgpe1xyXG4gIHJldHVybiAoJCh3aW5kb3cpLndpZHRoKCkgPiBicmVha3BvaW50cy5zbSAmJiAkKHdpbmRvdykud2lkdGgoKSA8PSBicmVha3BvaW50cy5tZClcclxufVxyXG5mdW5jdGlvbiBpc1RvdWNoKCl7XHJcbiAgcmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHM7XHJcbn1cclxuZnVuY3Rpb24gaXNNb2JpbGVWZXJzaW9uKCl7XHJcbiAgcmV0dXJuICEhfndpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCIvbW9iaWxlL1wiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcnVuKCl7XHJcbiAgaWYoaXNUb3VjaCgpKXtcclxuICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnbm8tdG91Y2gnKS5hZGRDbGFzcygndG91Y2gnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCd0b3VjaCcpLmFkZENsYXNzKCduby10b3VjaCcpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7cnVuLCBpc1RvdWNoLCBpc01vYmlsZSwgaXNUYWJsZXQsIGlzTW9iaWxlVmVyc2lvbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb24uanMiLCIvKipcclxuICogSGVscGVyc1xyXG4gKiBAbW9kdWxlIEhlbHBlcnNcclxuICovXHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlIHNjcm9sbGJhciB3aWR0aCBpbiBlbGVtZW50XHJcbiAqIC0gaWYgdGhlIHdpZHRoIGlzIDAgaXQgbWVhbnMgdGhlIHNjcm9sbGJhciBpcyBmbG9hdGVkL292ZXJsYXllZFxyXG4gKiAtIGFjY2VwdHMgXCJjb250YWluZXJcIiBwYXJlbWV0ZXIgYmVjYXVzZSBpZSAmIGVkZ2UgY2FuIGhhdmUgZGlmZmVyZW50XHJcbiAqICAgc2Nyb2xsYmFyIGJlaGF2aW9ycyBmb3IgZGlmZmVyZW50IGVsZW1lbnRzIHVzaW5nICctbXMtb3ZlcmZsb3ctc3R5bGUnXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXROYXRpdmVTY3JvbGxiYXJXaWR0aCAoY29udGFpbmVyKSB7XHJcbiAgY29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmJvZHk7XHJcblxyXG4gIGxldCBmdWxsV2lkdGggPSAwO1xyXG4gIGxldCBiYXJXaWR0aCA9IDA7XHJcblxyXG4gIGxldCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgbGV0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG4gIHdyYXBwZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gIHdyYXBwZXIuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICB3cmFwcGVyLnN0eWxlLmJvdHRvbSA9ICcwJztcclxuICB3cmFwcGVyLnN0eWxlLnJpZ2h0ID0gJzAnO1xyXG4gIHdyYXBwZXIuc3R5bGUud2lkdGggPSAnMTAwcHgnO1xyXG4gIHdyYXBwZXIuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHJcbiAgd3JhcHBlci5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xyXG5cclxuICBmdWxsV2lkdGggPSBjaGlsZC5vZmZzZXRXaWR0aDtcclxuICB3cmFwcGVyLnN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xyXG4gIGJhcldpZHRoID0gZnVsbFdpZHRoIC0gY2hpbGQub2Zmc2V0V2lkdGg7XHJcblxyXG4gIGNvbnRhaW5lci5yZW1vdmVDaGlsZCh3cmFwcGVyKTtcclxuXHJcbiAgcmV0dXJuIGJhcldpZHRoO1xyXG59XHJcblxyXG4vKipcclxuICogVGhyb3R0bGUgSGVscGVyXHJcbiAqIGh0dHBzOi8vcmVteXNoYXJwLmNvbS8yMDEwLzA3LzIxL3Rocm90dGxpbmctZnVuY3Rpb24tY2FsbHNcclxuICovXHJcbmZ1bmN0aW9uIHRocm90dGxlIChmbiwgdGhyZXNoaG9sZCwgc2NvcGUpIHtcclxuICB0aHJlc2hob2xkIHx8ICh0aHJlc2hob2xkID0gMjUwKTtcclxuICBsZXQgbGFzdCxcclxuICAgIGRlZmVyVGltZXI7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBjb250ZXh0ID0gc2NvcGUgfHwgdGhpcztcclxuXHJcbiAgICBsZXQgbm93ID0gK25ldyBEYXRlKCksXHJcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICBpZiAobGFzdCAmJiBub3cgPCBsYXN0ICsgdGhyZXNoaG9sZCkge1xyXG4gICAgICAvLyBob2xkIG9uIHRvIGl0XHJcbiAgICAgIGNsZWFyVGltZW91dChkZWZlclRpbWVyKTtcclxuICAgICAgZGVmZXJUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxhc3QgPSBub3c7XHJcbiAgICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgIH0sIHRocmVzaGhvbGQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGFzdCA9IG5vdztcclxuICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKiogXHJcbiAqIERlYm91bmNlIEhlbHBlclxyXG4gKiBodHRwczovL3JlbXlzaGFycC5jb20vMjAxMC8wNy8yMS90aHJvdHRsaW5nLWZ1bmN0aW9uLWNhbGxzXHJcbiAqL1xyXG5mdW5jdGlvbiBkZWJvdW5jZSAoZm4sIGRlbGF5KSB7XHJcbiAgbGV0IHRpbWVyID0gbnVsbDtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgfSwgZGVsYXkpO1xyXG4gIH07XHJcbn07XHJcblxyXG5sZXQgdGltZXI7XHJcbmxldCB0aW1lb3V0ID0gZmFsc2U7XHJcbmxldCBkZWx0YSA9IDIwMDtcclxuZnVuY3Rpb24gcmVzaXplRW5kKCkge1xyXG4gIGlmIChuZXcgRGF0ZSgpIC0gdGltZXIgPCBkZWx0YSkge1xyXG4gICAgc2V0VGltZW91dChyZXNpemVFbmQsIGRlbHRhKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGltZW91dCA9IGZhbHNlO1xyXG4gICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3Jlc2l6ZWVuZCcpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdG9nZ2xlQ2xhc3NJZihlbCwgY29uZCwgdG9nZ2xlZENsYXNzKXtcclxuXHRpZihjb25kKXtcclxuXHRcdGVsLmFkZENsYXNzKHRvZ2dsZWRDbGFzcyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGVsLnJlbW92ZUNsYXNzKHRvZ2dsZWRDbGFzcyk7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICog0KTRg9C90LrRhtC40Y8g0LTQvtCx0LDQstC70Y/QtdGCINC6INGN0LvQtdC80LXQvdGC0YMg0LrQu9Cw0YHRgSwg0LXRgdC70Lgg0YHRgtGA0LDQvdC40YbQsCDQv9GA0L7QutGA0YPRh9C10L3QsCDQsdC+0LvRjNGI0LUsINGH0LXQvCDQvdCwINGD0LrQsNC30LDQvdC90L7QtSDQt9C90LDRh9C10L3QuNC1LCBcclxuICog0Lgg0YPQsdC40YDQsNC10YIg0LrQu9Cw0YHRgSwg0LXRgdC70Lgg0LfQvdCw0YfQtdC90LjQtSDQvNC10L3RjNGI0LVcclxuICogQHBhcmFtIHtvYmplY3R9IGVsIC0g0Y3Qu9C10LzQtdC90YIsINGBINC60L7RgtC+0YDRi9C8INCy0LfQsNC40LzQvtC00LXQudGB0YLQstGD0LXQvFxyXG4gKiBAcGFyYW0ge21peGVkfSBbc2Nyb2xsVmFsdWU9MF0gLSDQt9C90LDRh9C10L3QuNC1INC/0YDQvtC60YDRg9GC0LrQuCwg0L3QsCDQutC+0YLQvtGA0L7QvCDQvNC10L3Rj9C10LwgY3NzLdC60LvQsNGB0YEsINC+0LbQuNC00LDQtdC80L7QtSDQt9C90LDRh9C10L3QuNC1IC0g0YfQuNGB0LvQviDQuNC70Lgg0LrQu9GO0YfQtdCy0L7QtSDRgdC70L7QstC+ICd0aGlzJy4g0JXRgdC70Lgg0L/QtdGA0LXQtNCw0L3QviAndGhpcycsINC/0L7QtNGB0YLQsNCy0LvRj9C10YLRgdGPINC/0L7Qu9C+0LbQtdC90LjQtSBlbC5vZmZzZXQoKS50b3Ag0LzQuNC90YPRgSDQv9C+0LvQvtCy0LjQvdCwINCy0YvRgdC+0YLRiyDRjdC60YDQsNC90LBcclxuICogQHBhcmFtIHtzdHJpbmd9IFt0b2dnbGVkQ2xhc3M9c2Nyb2xsZWRdIC0gY3NzLdC60LvQsNGB0YEsINC60L7RgtC+0YDRi9C5INC/0LXRgNC10LrQu9GO0YfQsNC10LxcclxuICovXHJcbmZ1bmN0aW9uIHRvZ2dsZUVsZW1lbnRDbGFzc09uU2Nyb2xsKGVsLCBzY3JvbGxWYWx1ZSA9IDAsIHRvZ2dsZWRDbGFzcyA9ICdzY3JvbGxlZCcpe1xyXG5cdGlmKGVsLmxlbmd0aCA9PSAwKSB7XHJcblx0XHQvL2NvbnNvbGUuZXJyb3IoXCLQndC10L7QsdGF0L7QtNC40LzQviDQv9C10YDQtdC00LDRgtGMINC+0LHRitC10LrRgiwg0YEg0LrQvtGC0L7RgNGL0Lwg0LLRiyDRhdC+0YLQuNGC0LUg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0L7QstCw0YLRjFwiKTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblx0XHJcblx0aWYoc2Nyb2xsVmFsdWUgPT0gJ3RoaXMnKSB7XHJcblx0XHRzY3JvbGxWYWx1ZSA9IGVsLm9mZnNldCgpLnRvcCAtICQod2luZG93KS5vdXRlckhlaWdodCgpIC8gMjtcclxuXHR9XHJcblx0XHJcblx0JCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbihlKXtcclxuXHRcdGlmKCQod2luZG93KS5zY3JvbGxUb3AoKSA+IHNjcm9sbFZhbHVlKXtcclxuXHRcdFx0ZWwuYWRkQ2xhc3ModG9nZ2xlZENsYXNzKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGVsLnJlbW92ZUNsYXNzKHRvZ2dsZWRDbGFzcyk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn07XHJcblxyXG4vKipcclxuICog0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtCx0YvRgtC40Lkg0LTQu9GPINC/0LXRgNC10LrQu9GO0YfQsNGC0LXQu9C10Lkg0LrQu9Cw0YHRgdC+0LJcclxuICogQGV4YW1wbGVcclxuICogSGVscGVycy5pbml0KCk7XHJcbiAqL1xyXG5mdW5jdGlvbiBpbml0KCl7XHJcbiAgXHJcbiAgdG9nZ2xlRWxlbWVudENsYXNzT25TY3JvbGwoJCgnLmhlYWRlcicpLCA1MCk7XHJcbiAgXHJcbiAgJCgnLmpzLWhpZGUtYmxvY2snKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgbGV0IGJsb2NrID0gJCh0aGlzKS5kYXRhKCd0YXJnZXQnKSA9PT0gJ3NlbGYnID8gJCh0aGlzKS5wYXJlbnQoKSA6ICQodGhpcykuZGF0YSgndGFyZ2V0Jyk7XHJcbiAgICBibG9jay5mYWRlT3V0KDUwMCk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aW1lciA9IG5ldyBEYXRlKCk7XHJcbiAgICBpZiAodGltZW91dCA9PT0gZmFsc2UpIHtcclxuICAgICAgdGltZW91dCA9IHRydWU7XHJcbiAgICAgIHNldFRpbWVvdXQocmVzaXplRW5kLCBkZWx0YSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgJCgnLmJ0bi1tZW51Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2lzLW9wZW4nKTtcclxuICAgICQoJy5oZWFkZXInKS50b2dnbGVDbGFzcygnaXMtb3BlbicpO1xyXG4gICAgJCgnLm1haW4tbmF2Jykuc2xpZGVUb2dnbGUoNTAwKTtcclxuICAgIGlmIChNYWluLkRldmljZURldGVjdGlvbi5pc01vYmlsZVZlcnNpb24oKSkge1xyXG4gICAgICBpZiAoJCgnLmhlYWRlcicpLmhhc0NsYXNzKCdpcy1vcGVuJykpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnaXMtb3BlbicpO1xyXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5jc3MoJ292ZXJmbG93LXknLCAnaGlkZGVuJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCgnaHRtbCwgYm9keScpLmNzcygnb3ZlcmZsb3cteScsICcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtpbml0LCB0b2dnbGVDbGFzc0lmLCB0b2dnbGVFbGVtZW50Q2xhc3NPblNjcm9sbH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL2hlbHBlcnMuanMiLCIvKipcclxuICog0JrQsNGA0YPRgdC10LvRjFxyXG4gKiBAbW9kdWxlIENhcm91c2VsXHJcbiAqL1xyXG4vLyBkZWZhdWx0XHJcbmxldCBjYXJvdXNlbERlZmF1bHQgPSAkKFwiLm93bC1jYXJvdXNlbC5jYXJvdXNlbC0tZGVmYXVsdFwiKTtcclxubGV0IGNhcm91c2VsRGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgaXRlbXM6IDEsXHJcbiAgbmF2OiB0cnVlLFxyXG4gIG5hdlRleHQ6IFsnPHN2ZyBjbGFzcz1cImljb25cIj48dXNlIHhsaW5rOmhyZWY9XCIjcHJldlwiLz48L3N2Zz4nLCAnPHN2ZyBjbGFzcz1cImljb25cIj48dXNlIHhsaW5rOmhyZWY9XCIjbmV4dFwiLz48L3N2Zz4nXSxcclxuICBkb3RzOiB0cnVlLFxyXG4gIGRvdHNEYXRhOiB0cnVlLFxyXG4gIGRvdHNDb250YWluZXI6ICcub3dsLWRvdHMnLFxyXG4gIGxvb3A6IGZhbHNlLFxyXG4gIHN0YWdlUGFkZGluZzogNTAsXHJcbiAgbW91c2VEcmFnOiBmYWxzZSxcclxuICBhbmltYXRlT3V0OiAnZmFkZU91dCcsXHJcbiAgcmVzcG9uc2l2ZToge1xyXG4gICAgMDoge1xyXG4gICAgICBzdGFnZVBhZGRpbmc6IDAsXHJcbiAgICAgIGF1dG9IZWlnaHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICAxMDI0OiB7XHJcbiAgICAgIHN0YWdlUGFkZGluZzogNTAsXHJcbiAgICAgIGF1dG9IZWlnaHQ6IGZhbHNlXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbi8vIG1vYmlsZSBvbmx5XHJcbmxldCBjYXJvdXNlbE1vYmlsZSA9ICQoXCIub3dsLWNhcm91c2VsLmNhcm91c2VsLS1tb2JpbGVcIik7XHJcbmxldCBjYXJvdXNlbE1vYmlsZU9wdGlvbnMgPSB7XHJcbiAgaXRlbXM6IDEsXHJcbiAgbWFyZ2luOiAyMCxcclxuICBhdXRvV2lkdGg6IHRydWUsXHJcbiAgc3RhZ2VQYWRkaW5nOiAyMCxcclxuICBuYXY6IHRydWUsXHJcbiAgbmF2VGV4dDogWyc8c3ZnIGNsYXNzPVwiaWNvblwiPjx1c2UgeGxpbms6aHJlZj1cIiNwcmV2LTJcIi8+PC9zdmc+JywgJzxzdmcgY2xhc3M9XCJpY29uXCI+PHVzZSB4bGluazpocmVmPVwiI25leHQtMlwiLz48L3N2Zz4nXSxcclxuICBkb3RzOiBmYWxzZSxcclxuICBtb3VzZURyYWc6IGZhbHNlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhcm91c2VsSW5pdEJ5Q29uZGl0aW9uKGNhcm91c2VsLCBvcHRpb25zLCBjb25kaXRpb24pIHtcclxuICBpZiAoY29uZGl0aW9uKSB7XHJcbiAgICBjYXJvdXNlbC5vd2xDYXJvdXNlbChvcHRpb25zKTtcclxuICB9IGVsc2Uge1xyXG4gICAgY2Fyb3VzZWwudHJpZ2dlcignZGVzdHJveS5vd2wuY2Fyb3VzZWwnKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN5bmhEb3RzKGV2ZW50KSB7XHJcbiAgbGV0IHBhZ2UgPSBldmVudC5wYWdlLmluZGV4ID09IC0xID8gMCA6IGV2ZW50LnBhZ2UuaW5kZXg7XHJcbiAgbGV0IGRvdHMgPSAkKGV2ZW50LnRhcmdldCkuc2libGluZ3MoJy5vd2wtZG90cy0tYm90dG9tJykuY2hpbGRyZW4oJy5vd2wtZG90Jyk7XHJcbiAgZG90cy5lcShwYWdlKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICBkb3RzLmVxKHBhZ2UpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC60LDRgNGD0YHQtdC70LhcclxuICovXHJcbmZ1bmN0aW9uIGluaXQoKXtcclxuICBjYXJvdXNlbERlZmF1bHQub24oJ2luaXRpYWxpemVkLm93bC5jYXJvdXNlbCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICBzeW5oRG90cyhldmVudCk7XHJcbiAgICB9LCAxMDAsIGV2ZW50KTtcclxuICB9KTtcclxuICBjYXJvdXNlbERlZmF1bHQub3dsQ2Fyb3VzZWwoY2Fyb3VzZWxEZWZhdWx0T3B0aW9ucyk7XHJcbiAgY2Fyb3VzZWxEZWZhdWx0Lm9uKCdjaGFuZ2VkLm93bC5jYXJvdXNlbCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBzeW5oRG90cyhldmVudCk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgY2Fyb3VzZWxJbml0QnlDb25kaXRpb24oY2Fyb3VzZWxNb2JpbGUsIGNhcm91c2VsTW9iaWxlT3B0aW9ucywgTWFpbi5EZXZpY2VEZXRlY3Rpb24uaXNNb2JpbGVWZXJzaW9uKCkpO1xyXG4gIFxyXG4gIC8vIGluaXQgb24gcmVzaXplXHJcbiAgJCh3aW5kb3cpLm9uKCdyZXNpemVlbmQnLCBmdW5jdGlvbigpe1xyXG4gICAgY2Fyb3VzZWxJbml0QnlDb25kaXRpb24oY2Fyb3VzZWxNb2JpbGUsIGNhcm91c2VsTW9iaWxlT3B0aW9ucywgTWFpbi5EZXZpY2VEZXRlY3Rpb24uaXNNb2JpbGVWZXJzaW9uKCkpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtpbml0fTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2pzL2NvbXBvbmVudHMvY2Fyb3VzZWwuanMiLCIvKipcclxuICog0JzQvtC00YPQu9GMINC00LvRjyDRgNCw0LHQvtGC0YsgcGxhY2Vob2xkZXIg0LIg0Y3Qu9C10LzQtdC90YLQsNGFINGE0L7RgNC80YsgKC5maWVsZClcclxuICogQG1vZHVsZSBJbnB1dFxyXG4gKi9cclxuXHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQuNGC0Ywg0YTQvtC60YPRgVxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge29iamVjdH0gaW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIGZvY3VzTGFiZWwoaW5wdXQpe1xyXG4gICAgaW5wdXQuY2xvc2VzdCgnLmZpZWxkJykuYWRkQ2xhc3MoXCJoYXMtZm9jdXNcIik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9Cx0YDQsNGC0Ywg0YTQvtC60YPRgVxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge29iamVjdH0gaW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIGJsdXJMYWJlbChpbnB1dCl7XHJcbiAgICB2YXIgd3JhcHBlciA9IGlucHV0LmNsb3Nlc3QoJy5maWVsZCcpO1xyXG4gICAgd3JhcHBlci5yZW1vdmVDbGFzcyhcImhhcy1mb2N1c1wiKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQvtCy0LXRgNC40YLRjCDQuNC90L/Rg9GCINC90LAg0L3QsNC70LjRh9C40LUgdmFsdWVcclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtvYmplY3R9IGlucHV0XHJcbiAqL1xyXG5mdW5jdGlvbiBjaGVja0lucHV0KGlucHV0KXtcclxuICAgIHZhciB3cmFwcGVyID0gaW5wdXQuY2xvc2VzdCgnLmZpZWxkJyk7XHJcbiAgICBpZiAoaW5wdXQudmFsKCkubGVuZ3RoID4gMClcclxuICAgICAgICB3cmFwcGVyLmFkZENsYXNzKFwiaGFzLXZhbHVlXCIpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHdyYXBwZXIucmVtb3ZlQ2xhc3MoXCJoYXMtdmFsdWVcIik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC+0LHRi9GC0LjQuSDQtNC70Y8g0LjQvdC/0YPRgtCwXHJcbiAqIEBleGFtcGxlXHJcbiAqIElucHV0LmluaXQoKTtcclxuICovXHJcbmZ1bmN0aW9uIGluaXQoKXtcclxuICAgIGxldCBpbnB1dHMgPSAkKCcuZmllbGRfX2lucHV0Jyk7XHJcbiAgICBsZXQgcGxhY2Vob2xkZXJzID0gJCgnLmZpZWxkX19wbGFjZWhvbGRlcicpO1xyXG4gICAgXHJcbiAgICBwbGFjZWhvbGRlcnMuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuZmllbGQnKS5maW5kKCcuZmllbGRfX2lucHV0JykuZm9jdXMoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlucHV0cy5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICBjaGVja0lucHV0KCQoaXRlbSkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaW5wdXRzLmZvY3VzKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZm9jdXNMYWJlbCgkKHRoaXMpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlucHV0cy5ibHVyKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgYmx1ckxhYmVsKCQodGhpcykpO1xyXG4gICAgICAgIGNoZWNrSW5wdXQoJCh0aGlzKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7aW5pdH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL2lucHV0LmpzIiwiLyoqXHJcbiAqINCc0L7QtNGD0LvRjCDQtNC70Y8g0YDQsNCx0L7RgtGLINCk0L7RgNC8XHJcbiAqIEBtb2R1bGUgRm9ybVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlRmllbGQoZmllbGQpIHtcclxuICBsZXQgaXNWYWxpZCA9IGZpZWxkLnZhbGlkaXR5LnZhbGlkO1xyXG4gIGxldCBmaWVsZENvbnRhaW5lciA9ICQoZmllbGQpLmNsb3Nlc3QoJy5maWVsZCcpO1xyXG4gIGlmIChpc1ZhbGlkKSB7XHJcbiAgICBmaWVsZENvbnRhaW5lci5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGZpZWxkQ29udGFpbmVyLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcclxuICB9XHJcbiAgcmV0dXJuIGlzVmFsaWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlRm9ybShlbEZvcm0pIHtcclxuICBsZXQgZXJyb3JzID0gMDtcclxuICBBcnJheS5mcm9tKGVsRm9ybS5lbGVtZW50cykuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICBsZXQgaXNWYWxpZEZpZWxkID0gdmFsaWRhdGVGaWVsZChpdGVtKTtcclxuICAgIGlmKCFpc1ZhbGlkRmllbGQpIHtcclxuICAgICAgZXJyb3JzICs9IDE7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGVycm9ycztcclxufVxyXG5cclxuLyoqXHJcbiAqINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7QsdGL0YLQuNC5INGE0L7RgNC8XHJcbiAqIEBleGFtcGxlXHJcbiAqIEZvcm0uaW5pdCgpO1xyXG4gKi9cclxuZnVuY3Rpb24gaW5pdCgpe1xyXG4gIGxldCBqc0Zvcm0gPSAkKCcuanMtZm9ybScpO1xyXG4gIFxyXG4gICQoJ2lucHV0LCB0ZXh0YXJlYScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xyXG4gICAgdmFsaWRhdGVGaWVsZCh0aGlzKTtcclxuICB9KTtcclxuICBcclxuICBqc0Zvcm0uZWFjaChmdW5jdGlvbigpe1xyXG4gICAgbGV0IHNlbGYgPSAkKHRoaXMpO1xyXG4gICAgbGV0IHNlbGZGb3JtID0gc2VsZi5maW5kKCcuanMtZm9ybS1mb3JtJyk7XHJcbiAgICBsZXQgc2VsZlJlc3VsdCA9IHNlbGYuZmluZCgnLmpzLWZvcm0tcmVzdWx0Jyk7XHJcbiAgICBsZXQgc2VsZlN1Ym1pdCA9IHNlbGYuZmluZCgnLmpzLWZvcm0tc3VibWl0Jyk7XHJcbiAgICBcclxuICAgIHNlbGZTdWJtaXQub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCBoYXNFcnJvciA9IHZhbGlkYXRlRm9ybShzZWxmRm9ybVswXSk7XHJcbiAgICAgIGlmICghaGFzRXJyb3IpIHtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jY2l0YW5lLmhzbXAucnUvYXBpL2VtYWlscy8nLFxyXG4gICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgJ25hbWUnOiAkKHNlbGZGb3JtKS5maW5kKCdpbnB1dFtuYW1lPVwibmFtZVwiXScpLnZhbCgpLFxyXG4gICAgICAgICAgICAnZW1haWwnOiAkKHNlbGZGb3JtKS5maW5kKCdpbnB1dFtuYW1lPVwiZW1haWxcIl0nKS52YWwoKSxcclxuICAgICAgICAgICAgJ21lc3NhZ2UnOiAkKHNlbGZGb3JtKS5maW5kKCd0ZXh0YXJlYVtuYW1lPVwibWVzc2FnZVwiXScpLnZhbCgpLFxyXG4gICAgICAgICAgICAncGFnZSc6IHdpbmRvdy5sb2NhdGlvbi5ocmVmXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmU3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVxdWVzdC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSwgdGV4dFN0YXR1cywganFYSFIpIHtcclxuICAgICAgICAgIHNlbGYuYWRkQ2xhc3MoJ2lzLXN1Ym1pdHRlZCcpO1xyXG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdzdWJtaXR0ZWQnKTtcclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgc2VsZlJlc3VsdC5zaG93KCk7XHJcbiAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7aW5pdH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL2Zvcm0uanMiLCIvKipcclxuICog0JLRgdC/0LvRi9Cy0LDRjtGJ0LjQtSDQvtC60L3QsFxyXG4gKiBAbW9kdWxlIE1vZGFsXHJcbiAqL1xyXG5cclxubGV0IGxheW91dCA9ICQoJy5sYXlvdXQnKTtcclxuIFxyXG5mdW5jdGlvbiBvcGVuTW9kYWwobW9kYWwpIHtcclxuICBsYXlvdXQuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nKTtcclxuICAkKCdodG1sLCBib2R5JykuY3NzKCdvdmVyZmxvdy15JywgJ2hpZGRlbicpO1xyXG4gIG1vZGFsLmZhZGVJbigzMDApLmFkZENsYXNzKCdpcy1vcGVuZWQnKTtcclxuICBtb2RhbC50cmlnZ2VyKCdvcGVuZWQnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VNb2RhbChtb2RhbCkge1xyXG4gIG1vZGFsLmZhZGVPdXQoMzAwKS5yZW1vdmVDbGFzcygnaXMtb3BlbmVkJyk7XHJcbiAgbGF5b3V0LnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJyk7XHJcbiAgJCgnaHRtbCwgYm9keScpLmNzcygnb3ZlcmZsb3cteScsICcnKTtcclxuICBtb2RhbC50cmlnZ2VyKCdjbG9zZWQnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7QsdGL0YLQuNC5INC00LvRjyDQstGB0L/Qu9GL0LLQsNGO0YnQuNGFINC+0LrQvtC9XHJcbiAqIEBleGFtcGxlXHJcbiAqIE1vZGFsLmluaXQoKTtcclxuICovXHJcbmZ1bmN0aW9uIGluaXQoKXtcclxuICAgIFxyXG4gICQoJy5qcy1tb2RhbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCB0YXJnZXQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdGFyZ2V0Jyk7XHJcbiAgICAgIGxldCBtb2RhbCA9ICQodGFyZ2V0KTtcclxuICAgICAgaWYgKCFtb2RhbC5oYXNDbGFzcygnaXMtb3BlbmVkJykpIHtcclxuICAgICAgICBvcGVuTW9kYWwobW9kYWwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNsb3NlTW9kYWwobW9kYWwpO1xyXG4gICAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgJCgnLmpzLWNsb3NlLW1vZGFsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCBtb2RhbCA9ICQodGhpcykuY2xvc2VzdCgnLm1vZGFsJyk7XHJcbiAgICBjbG9zZU1vZGFsKG1vZGFsKTtcclxuICB9KTtcclxuICBcclxuICAkKCcubW9kYWxfX2JnJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgbGV0IG1vZGFsID0gJCh0aGlzKS5jbG9zZXN0KCcubW9kYWwnKTtcclxuICAgIGNsb3NlTW9kYWwobW9kYWwpO1xyXG4gIH0pO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7aW5pdCwgb3Blbk1vZGFsLCBjbG9zZU1vZGFsfTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2pzL2NvbXBvbmVudHMvbW9kYWwuanMiLCIvKipcclxuICog0J/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INC60LvQsNGB0YHQvtCyINC/0L4g0YDQsNC30LvQuNGH0L3Ri9C8INGB0L7QsdGL0YLQuNGP0LxcclxuICogQG1vZHVsZSBBbmltYXRpb25cclxuICovXHJcblxyXG5sZXQgc2Nyb2xsQW5pbWF0aW9uQmxvY2tzID0gJCgnLmEtc2Nyb2xsLWJveCcpO1xyXG5sZXQgcGFyYWxsYXhCbG9ja3MgPSAkKCcuYS1wYXJhbGxheC1ib3gnKTtcclxuIFxyXG5mdW5jdGlvbiBhZGRDbGFzc1RvZ2dsZXJTY2VuZSAoZWwsIGNvbnRyb2xsZXIpIHtcclxuICBuZXcgU2Nyb2xsTWFnaWMuU2NlbmUoe1xyXG4gICAgdHJpZ2dlckVsZW1lbnQ6IGVsLFxyXG4gICAgdHJpZ2dlckhvb2s6IDAuN1xyXG4gIH0pXHJcbiAgLnNldENsYXNzVG9nZ2xlKGVsLCAnYW5pbWF0ZScpXHJcbiAgLmFkZFRvKGNvbnRyb2xsZXIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRDbGFzc1RvZ2dsZXJDb250cm9sbGVyIChhbmltYXRpb25CbG9ja3MpIHtcclxuICBsZXQgY29udHJvbGxlciA9IG5ldyBTY3JvbGxNYWdpYy5Db250cm9sbGVyKCk7XHJcbiAgYW5pbWF0aW9uQmxvY2tzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgIGxldCBjbG9zZXN0Q29udGFpbmVyID0gJCh0aGlzKS5jbG9zZXN0KCcubC1jb250YWluZXInKS5wYXJlbnQoKVswXTtcclxuICAgIGlmIChjbG9zZXN0Q29udGFpbmVyLm9mZnNldFRvcCA8IHdpbmRvdy5vdXRlckhlaWdodCkge1xyXG4gICAgICAkKHRoaXMpLmNoaWxkcmVuKCdbY2xhc3MqPVwiYS1cIl0nKS5jc3Moeyd0cmFuc2l0aW9uJzogJ25vbmUnfSk7XHJcbiAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgbGV0IGRlbGF5ID0gMjUwICogJChjbG9zZXN0Q29udGFpbmVyKS5pbmRleCgpO1xyXG4gICAgICAkKHNlbGYpLmRhdGEoJ3RpbWVyJywgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChzZWxmKS5jaGlsZHJlbignW2NsYXNzKj1cImEtXCJdJykuY3NzKHsndHJhbnNpdGlvbic6ICcnfSk7XHJcbiAgICAgICAgJChzZWxmKS5hZGRDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgICB9LCAyNTApKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBhRGVsYXkgPSAwO1xyXG4gICAgICBpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLWEtZGVsYXknKSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgYURlbGF5ID0gTnVtYmVyKCQodGhpcykuYXR0cignZGF0YS1hLWRlbGF5JykpICogMTAwMDtcclxuICAgICAgfVxyXG4gICAgICBzZXRUaW1lb3V0KGFkZENsYXNzVG9nZ2xlclNjZW5lLCBhRGVsYXksIHRoaXMsIGNvbnRyb2xsZXIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGcm9tUG9zaXRpb24gKGVsLCBkZWZhdWx0UG9zaXRpb24gPSAwKXtcclxuICByZXR1cm4gKGVsLmF0dHIoJ2RhdGEtcGFyYWxsYXgtZnJvbScpICE9PSB1bmRlZmluZWQpID8gTnVtYmVyKGVsLmF0dHIoJ2RhdGEtcGFyYWxsYXgtZnJvbScpKSA6IGRlZmF1bHRQb3NpdGlvbjtcclxufVxyXG5mdW5jdGlvbiBnZXRUb1Bvc2l0aW9uIChlbCwgZGVmYXVsdFBvc2l0aW9uID0gMCl7XHJcbiAgcmV0dXJuIChlbC5hdHRyKCdkYXRhLXBhcmFsbGF4LXRvJykgIT09IHVuZGVmaW5lZCkgPyBOdW1iZXIoZWwuYXR0cignZGF0YS1wYXJhbGxheC10bycpKSA6IGRlZmF1bHRQb3NpdGlvbjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGFyYWxsYXhUaW1lbGluZSAoZWwpIHtcclxuICBsZXQgdHdlZW4gPSBuZXcgVGltZWxpbmVNYXgoKTtcclxuICBsZXQgdHdlZW5zQXJyID0gW107XHJcbiAgaWYgKCQoZWwpLmZpbmQoJy5hLXBhcmFsbGF4LWJhY2snKSkge1xyXG4gICAgbGV0IHRhcmdldEVsID0gJChlbCkuZmluZCgnLmEtcGFyYWxsYXgtYmFjaycpO1xyXG4gICAgbGV0IGZyb21Qb3MgPSBnZXRGcm9tUG9zaXRpb24odGFyZ2V0RWwsIC0yMCk7XHJcbiAgICBsZXQgdG9Qb3MgPSBnZXRUb1Bvc2l0aW9uKHRhcmdldEVsKTtcclxuICAgIHR3ZWVuc0Fyci5wdXNoKFR3ZWVuTWF4LmZyb21Ubyh0YXJnZXRFbCwgMSwge3lQZXJjZW50OiBmcm9tUG9zfSwge3lQZXJjZW50OiB0b1BvcywgZWFzZTogTGluZWFyLmVhc2VOb25lfSkpO1xyXG4gIH1cclxuICBpZiAoJChlbCkuZmluZCgnLmEtcGFyYWxsYXgtbWlkZGxlJykpIHtcclxuICAgIGxldCB0YXJnZXRFbCA9ICQoZWwpLmZpbmQoJy5hLXBhcmFsbGF4LW1pZGRsZScpO1xyXG4gICAgbGV0IGZyb21Qb3MgPSBnZXRGcm9tUG9zaXRpb24odGFyZ2V0RWwsIC0xNSk7XHJcbiAgICBsZXQgdG9Qb3MgPSBnZXRUb1Bvc2l0aW9uKHRhcmdldEVsKTtcclxuICAgIHR3ZWVuc0Fyci5wdXNoKFR3ZWVuTWF4LmZyb21Ubyh0YXJnZXRFbCwgMSwge3lQZXJjZW50OiBmcm9tUG9zfSwge3lQZXJjZW50OiB0b1BvcywgZWFzZTogTGluZWFyLmVhc2VOb25lfSkpO1xyXG4gIH1cclxuICBpZiAoJChlbCkuZmluZCgnLmEtcGFyYWxsYXgtZnJvbnQnKSkge1xyXG4gICAgbGV0IHRhcmdldEVsID0gJChlbCkuZmluZCgnLmEtcGFyYWxsYXgtZnJvbnQnKTtcclxuICAgIGxldCBmcm9tUG9zID0gZ2V0RnJvbVBvc2l0aW9uKHRhcmdldEVsLCAtMTApO1xyXG4gICAgbGV0IHRvUG9zID0gZ2V0VG9Qb3NpdGlvbih0YXJnZXRFbCwgMTApO1xyXG4gICAgdHdlZW5zQXJyLnB1c2goVHdlZW5NYXguZnJvbVRvKHRhcmdldEVsLCAxLCB7eVBlcmNlbnQ6IGZyb21Qb3N9LCB7eVBlcmNlbnQ6IHRvUG9zLCBlYXNlOiBMaW5lYXIuZWFzZU5vbmV9KSk7XHJcbiAgfVxyXG4gIHR3ZWVuLmFkZCh0d2VlbnNBcnIpO1xyXG4gIHJldHVybiB0d2VlbjtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkUGFyYWxsYXhTY2VuZSAoZWwsIHR3ZWVuLCBjb250cm9sbGVyKSB7XHJcbiAgbmV3IFNjcm9sbE1hZ2ljLlNjZW5lKHtcclxuICAgIHRyaWdnZXJFbGVtZW50OiBlbCxcclxuICAgIHRyaWdnZXJIb29rOiAwLFxyXG4gICAgZHVyYXRpb246ICQoZWwpLmhlaWdodCgpXHJcbiAgfSlcclxuICAuc2V0VHdlZW4odHdlZW4pXHJcbiAgLmFkZFRvKGNvbnRyb2xsZXIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRQYXJhbGxheENvbnRyb2xsZXIgKGFuaW1hdGlvbkJsb2Nrcykge1xyXG4gIGxldCBjb250cm9sbGVyID0gbmV3IFNjcm9sbE1hZ2ljLkNvbnRyb2xsZXIoKTtcclxuICBhbmltYXRpb25CbG9ja3MuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgbGV0IHR3ZWVuID0gZ2V0UGFyYWxsYXhUaW1lbGluZSh0aGlzKTtcclxuICAgIGFkZFBhcmFsbGF4U2NlbmUodGhpcywgdHdlZW4sIGNvbnRyb2xsZXIpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0ICgpIHtcclxuICBpZiAoc2Nyb2xsQW5pbWF0aW9uQmxvY2tzLmxlbmd0aCA+IDAgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiAxMDI0KXtcclxuICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtYW5pbWF0aW5nJyk7XHJcbiAgICBhZGRDbGFzc1RvZ2dsZXJDb250cm9sbGVyKHNjcm9sbEFuaW1hdGlvbkJsb2Nrcyk7XHJcbiAgfVxyXG4gIGlmIChwYXJhbGxheEJsb2Nrcy5sZW5ndGggPiAwICYmICQod2luZG93KS53aWR0aCgpID4gMTAyNCl7XHJcbiAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2lzLWFuaW1hdGluZycpO1xyXG4gICAgYWRkUGFyYWxsYXhDb250cm9sbGVyKHBhcmFsbGF4QmxvY2tzKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2luaXR9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvY29tcG9uZW50cy9hbmltYXRpb24uanMiLCJmdW5jdGlvbiBnZXRJY29uKGVsKSB7XHJcbiAgbGV0IGljb24gPSAnJztcclxuICBpZiAoZWwuaGFzQ2xhc3MoJ3lhLXNoYXJlMl9faXRlbV9zZXJ2aWNlX3Zrb250YWt0ZScpKSB7XHJcbiAgICBpY29uID0gJ3ZrJztcclxuICB9XHJcbiAgaWYgKGVsLmhhc0NsYXNzKCd5YS1zaGFyZTJfX2l0ZW1fc2VydmljZV9mYWNlYm9vaycpKSB7XHJcbiAgICBpY29uID0gJ2ZiJztcclxuICB9XHJcbiAgaWYgKGVsLmhhc0NsYXNzKCd5YS1zaGFyZTJfX2l0ZW1fc2VydmljZV90d2l0dGVyJykpIHtcclxuICAgIGljb24gPSAndHcnO1xyXG4gIH1cclxuICBjb25zb2xlLmxvZyhlbCk7XHJcbiAgcmV0dXJuICc8c3ZnIGNsYXNzPVwiaWNvbiBzb2NpYWwtaWNvblwiPjx1c2UgeGxpbms6aHJlZj1cIiMnICsgaWNvbiArICdcIi8+PC9zdmc+JztcclxufVxyXG5mdW5jdGlvbiBmaWxsSWNvbnMoKSB7XHJcbiAgJCgnI3NoYXJlIC55YS1zaGFyZTJfX2l0ZW0nKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAkKHRoaXMpLmZpbmQoJy55YS1zaGFyZTJfX2ljb24nKS5odG1sKGdldEljb24oJCh0aGlzKSkpO1xyXG4gIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgWWEuc2hhcmUyKCdzaGFyZScsIHtcclxuICAgIGNvbnRlbnQ6IHtcclxuICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcclxuICAgICAgdGl0bGU6ICdOaW94aW4zMERheXMnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogXCJcIixcclxuICAgICAgLy9pbWFnZTogJ2J1aWxkL2ltZy9zaGFyZS5qcGcnXHJcbiAgICAgIGltYWdlOiAnaHR0cDovL25pb3hpbjMwZGF5cy5lbGxlLnJ1L2J1aWxkL2ltZy9zaGFyZS5qcGcnXHJcbiAgICB9LFxyXG4gICAgdGhlbWU6IHtcclxuICAgICAgc2VydmljZXM6ICd2a29udGFrdGUsZmFjZWJvb2ssdHdpdHRlcicsXHJcbiAgICAgIGJhcmU6IHRydWUsXHJcbiAgICAgIGxhbmc6ICdlbidcclxuICAgIH0sXHJcbiAgICBob29rczoge1xyXG4gICAgICBvbnJlYWR5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBmaWxsSWNvbnMoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0ge2luaXR9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvY29tcG9uZW50cy9zaGFyZS5qcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBOzs7Ozs7OztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDM0JBOzs7OztBQUtBOzs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBT0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNwS0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUxBO0FBV0E7QUF0QkE7QUF3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFDQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDN0VBOzs7OztBQU1BOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDaEVBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBWkE7QUFjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzFFQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNuREE7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFiQTtBQW1CQTs7OzsiLCJzb3VyY2VSb290IjoiIn0=