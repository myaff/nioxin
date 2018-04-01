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
	var Modal = __webpack_require__(4);
	var Animation = __webpack_require__(5);

	$(document).ready(function () {

	  DeviceDetection.run();
	  Helpers.init();
	  Carousel.init();
	  Modal.init();
	  Animation.init();
	});

	/**
	 * Список экспортируемых модулей, чтобы иметь к ним доступ извне
	 * @example
	 * Main.Form.isFormValid();
	 */
	module.exports = {
	  DeviceDetection: DeviceDetection,
	  Helpers: Helpers,
	  Carousel: Carousel,
	  Modal: Modal,
	  Animation: Animation
		};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	var breakpoints = {
	  sm: 767,
	  md: 1023,
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

	var _carouselMobileOption;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	/**
	 * Карусель
	 * @module Carousel
	 */
	// default
	var carouselDefault = $(".owl-carousel.carousel--default");
	var carouselDefaultOptions = {
	  items: 1,
	  nav: true,
	  navText: ['<svg class="icon"><use xlink:href="#arrow-left"/></svg>', '<svg class="icon"><use xlink:href="#arrow-right"/></svg>'],
	  dots: true,
	  loop: true,
	  mouseDrag: false,
	  animateOut: 'fadeOut'
	  // mobile only
	};var carouselMobile = $(".owl-carousel.carousel--mobile");
	var carouselMobileOptions = (_carouselMobileOption = {
	  items: 1,
	  nav: true,
	  dots: false,
	  navText: ['<div class="prev"></div>', '<div class="next"></div>']
	}, _defineProperty(_carouselMobileOption, 'dots', false), _defineProperty(_carouselMobileOption, 'mouseDrag', false), _carouselMobileOption);

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
	  carouselInitByCondition(carouselMobile, carouselMobileOptions, Main.DeviceDetection.isMobile());

	  // init on resize
	  $(window).on('resizeend', function () {
	    carouselInitByCondition(carouselMobile, carouselMobileOptions, Main.DeviceDetection.isMobile());
	  });
	}

	module.exports = { init: init };

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Всплывающие окна
	 * @module Modal
	 */

	var layout = $('.layout');
	var modalWrapperClass = '.modal__wrapper';
	//let modalWrapper = $('.modal__wrapper');

	function openModal(modal) {
	  var isFullscreen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	  var modalWrapper = modal.closest(modalWrapperClass);
	  var modalActivator = $('[data-target="#' + modal.attr('id') + '"]');
	  modalWrapper.removeClass('invisible');
	  modal.removeClass('invisible');
	  var wrapperClasses = 'is-opened';
	  if (isFullscreen) {
	    wrapperClasses += ' is-fullscreen';
	  }
	  layout.addClass('modal-open');
	  modalWrapper.addClass(wrapperClasses);
	  modal.addClass('is-opened');
	  $('html, body').css('overflow-y', 'hidden');
	  modalActivator.each(function () {
	    $(this).addClass('modal-is-opened');
	  });
	}

	function closeModal(modal) {
	  var openNext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	  var modalWrapper = modal.closest(modalWrapperClass);
	  var modalActivator = $('[data-target="#' + modal.attr('id') + '"]');
	  modalActivator.each(function () {
	    $(this).removeClass('modal-is-opened');
	  });
	  modal.removeClass('is-opened');
	  if (!openNext) {
	    layout.removeClass('modal-open');
	    modalWrapper.removeClass('is-opened is-fullscreen');
	    $('html, body').css('overflow-y', '');
	  }
	  setTimeout(function () {
	    modal.addClass('invisible');
	    modalWrapper.addClass('invisible');
	  }, 300);
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
	    var isFullscreen = modal.attr('data-fullscreen') !== undefined;
	    if (!modal.hasClass('is-opened')) {
	      openModal(modal, isFullscreen);
	    } else {
	      closeModal(modal);
	    }
	  });

	  $(modalWrapperClass).on('click', function (e) {
	    if ($(e.target).hasClass('modal__wrapper')) {
	      var modal = $(this).find('.modal.is-opened');
	      modal.each(function () {
	        closeModal($(this));
	      });
	    }
	  });

	  function openModalHash() {
	    var hash = ['competition'],
	        isFullscreen = void 0,
	        modal = void 0,
	        i = void 0;

	    for (i = 0; i < hash.length; i++) {
	      if ('#' + hash[i] == window.location.hash && $('#' + hash[i]).length) {
	        modal = $('#' + hash[i]);
	        isFullscreen = modal.attr('data-fullscreen') !== undefined;

	        openModal(modal, isFullscreen);
	      }
	    }
	  }

	  openModalHash();
	}

	module.exports = { init: init, openModal: openModal, closeModal: closeModal };

/***/ }),
/* 5 */
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
	    var closestContainer = $(this).closest('[class*="l-flex"]:not([class*="l-col"])')[0] || $(this).closest('.l-container')[0];
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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAwMjk3YTI1ODhjMDlhZWNiNGZkMyIsIndlYnBhY2s6Ly8vc3JjL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2Nhcm91c2VsLmpzIiwid2VicGFjazovLy9zcmMvanMvY29tcG9uZW50cy9tb2RhbC5qcyIsIndlYnBhY2s6Ly8vc3JjL2pzL2NvbXBvbmVudHMvYW5pbWF0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9uaW94aW4vYnVpbGQvanMvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMDI5N2EyNTg4YzA5YWVjYjRmZDMiLCJsZXQgRGV2aWNlRGV0ZWN0aW9uID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9kZXZpY2UtZGV0ZWN0aW9uXCIpO1xyXG5sZXQgSGVscGVycyA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvaGVscGVyc1wiKTtcclxubGV0IENhcm91c2VsID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9jYXJvdXNlbFwiKTtcclxubGV0IE1vZGFsID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9tb2RhbFwiKTtcclxubGV0IEFuaW1hdGlvbiA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvYW5pbWF0aW9uXCIpO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICBcclxuICBEZXZpY2VEZXRlY3Rpb24ucnVuKCk7XHJcbiAgSGVscGVycy5pbml0KCk7XHJcbiAgQ2Fyb3VzZWwuaW5pdCgpO1xyXG4gIE1vZGFsLmluaXQoKTtcclxuICBBbmltYXRpb24uaW5pdCgpO1xyXG4gIFxyXG59KTtcclxuXHJcblxyXG4vKipcclxuICog0KHQv9C40YHQvtC6INGN0LrRgdC/0L7RgNGC0LjRgNGD0LXQvNGL0YUg0LzQvtC00YPQu9C10LksINGH0YLQvtCx0Ysg0LjQvNC10YLRjCDQuiDQvdC40Lwg0LTQvtGB0YLRg9C/INC40LfQstC90LVcclxuICogQGV4YW1wbGVcclxuICogTWFpbi5Gb3JtLmlzRm9ybVZhbGlkKCk7XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBEZXZpY2VEZXRlY3Rpb24sXHJcbiAgSGVscGVycyxcclxuICBDYXJvdXNlbCxcclxuICBNb2RhbCxcclxuICBBbmltYXRpb25cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2pzL21haW4uanMiLCJsZXQgYnJlYWtwb2ludHMgPSB7XHJcbiAgc206IDc2NyxcclxuICBtZDogMTAyMyxcclxuICBsZzogMTI4MCxcclxuICB4bDogMTYwMFxyXG59O1xyXG5cclxuZnVuY3Rpb24gaXNNb2JpbGUoKXtcclxuICByZXR1cm4gKCQod2luZG93KS53aWR0aCgpIDw9IGJyZWFrcG9pbnRzLnNtKTtcclxufVxyXG5mdW5jdGlvbiBpc1RhYmxldCgpe1xyXG4gIHJldHVybiAoJCh3aW5kb3cpLndpZHRoKCkgPiBicmVha3BvaW50cy5zbSAmJiAkKHdpbmRvdykud2lkdGgoKSA8PSBicmVha3BvaW50cy5tZClcclxufVxyXG5mdW5jdGlvbiBpc1RvdWNoKCl7XHJcbiAgcmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHM7XHJcbn1cclxuZnVuY3Rpb24gaXNNb2JpbGVWZXJzaW9uKCl7XHJcbiAgcmV0dXJuICEhfndpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCIvbW9iaWxlL1wiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcnVuKCl7XHJcbiAgaWYoaXNUb3VjaCgpKXtcclxuICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnbm8tdG91Y2gnKS5hZGRDbGFzcygndG91Y2gnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCd0b3VjaCcpLmFkZENsYXNzKCduby10b3VjaCcpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7cnVuLCBpc1RvdWNoLCBpc01vYmlsZSwgaXNUYWJsZXQsIGlzTW9iaWxlVmVyc2lvbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb24uanMiLCIvKipcclxuICogSGVscGVyc1xyXG4gKiBAbW9kdWxlIEhlbHBlcnNcclxuICovXHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlIHNjcm9sbGJhciB3aWR0aCBpbiBlbGVtZW50XHJcbiAqIC0gaWYgdGhlIHdpZHRoIGlzIDAgaXQgbWVhbnMgdGhlIHNjcm9sbGJhciBpcyBmbG9hdGVkL292ZXJsYXllZFxyXG4gKiAtIGFjY2VwdHMgXCJjb250YWluZXJcIiBwYXJlbWV0ZXIgYmVjYXVzZSBpZSAmIGVkZ2UgY2FuIGhhdmUgZGlmZmVyZW50XHJcbiAqICAgc2Nyb2xsYmFyIGJlaGF2aW9ycyBmb3IgZGlmZmVyZW50IGVsZW1lbnRzIHVzaW5nICctbXMtb3ZlcmZsb3ctc3R5bGUnXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXROYXRpdmVTY3JvbGxiYXJXaWR0aCAoY29udGFpbmVyKSB7XHJcbiAgY29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmJvZHk7XHJcblxyXG4gIGxldCBmdWxsV2lkdGggPSAwO1xyXG4gIGxldCBiYXJXaWR0aCA9IDA7XHJcblxyXG4gIGxldCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgbGV0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG4gIHdyYXBwZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gIHdyYXBwZXIuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICB3cmFwcGVyLnN0eWxlLmJvdHRvbSA9ICcwJztcclxuICB3cmFwcGVyLnN0eWxlLnJpZ2h0ID0gJzAnO1xyXG4gIHdyYXBwZXIuc3R5bGUud2lkdGggPSAnMTAwcHgnO1xyXG4gIHdyYXBwZXIuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHJcbiAgd3JhcHBlci5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xyXG5cclxuICBmdWxsV2lkdGggPSBjaGlsZC5vZmZzZXRXaWR0aDtcclxuICB3cmFwcGVyLnN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xyXG4gIGJhcldpZHRoID0gZnVsbFdpZHRoIC0gY2hpbGQub2Zmc2V0V2lkdGg7XHJcblxyXG4gIGNvbnRhaW5lci5yZW1vdmVDaGlsZCh3cmFwcGVyKTtcclxuXHJcbiAgcmV0dXJuIGJhcldpZHRoO1xyXG59XHJcblxyXG4vKipcclxuICogVGhyb3R0bGUgSGVscGVyXHJcbiAqIGh0dHBzOi8vcmVteXNoYXJwLmNvbS8yMDEwLzA3LzIxL3Rocm90dGxpbmctZnVuY3Rpb24tY2FsbHNcclxuICovXHJcbmZ1bmN0aW9uIHRocm90dGxlIChmbiwgdGhyZXNoaG9sZCwgc2NvcGUpIHtcclxuICB0aHJlc2hob2xkIHx8ICh0aHJlc2hob2xkID0gMjUwKTtcclxuICBsZXQgbGFzdCxcclxuICAgIGRlZmVyVGltZXI7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBjb250ZXh0ID0gc2NvcGUgfHwgdGhpcztcclxuXHJcbiAgICBsZXQgbm93ID0gK25ldyBEYXRlKCksXHJcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICBpZiAobGFzdCAmJiBub3cgPCBsYXN0ICsgdGhyZXNoaG9sZCkge1xyXG4gICAgICAvLyBob2xkIG9uIHRvIGl0XHJcbiAgICAgIGNsZWFyVGltZW91dChkZWZlclRpbWVyKTtcclxuICAgICAgZGVmZXJUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxhc3QgPSBub3c7XHJcbiAgICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgIH0sIHRocmVzaGhvbGQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGFzdCA9IG5vdztcclxuICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKiogXHJcbiAqIERlYm91bmNlIEhlbHBlclxyXG4gKiBodHRwczovL3JlbXlzaGFycC5jb20vMjAxMC8wNy8yMS90aHJvdHRsaW5nLWZ1bmN0aW9uLWNhbGxzXHJcbiAqL1xyXG5mdW5jdGlvbiBkZWJvdW5jZSAoZm4sIGRlbGF5KSB7XHJcbiAgbGV0IHRpbWVyID0gbnVsbDtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgfSwgZGVsYXkpO1xyXG4gIH07XHJcbn07XHJcblxyXG5sZXQgdGltZXI7XHJcbmxldCB0aW1lb3V0ID0gZmFsc2U7XHJcbmxldCBkZWx0YSA9IDIwMDtcclxuZnVuY3Rpb24gcmVzaXplRW5kKCkge1xyXG4gIGlmIChuZXcgRGF0ZSgpIC0gdGltZXIgPCBkZWx0YSkge1xyXG4gICAgc2V0VGltZW91dChyZXNpemVFbmQsIGRlbHRhKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGltZW91dCA9IGZhbHNlO1xyXG4gICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3Jlc2l6ZWVuZCcpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdG9nZ2xlQ2xhc3NJZihlbCwgY29uZCwgdG9nZ2xlZENsYXNzKXtcclxuXHRpZihjb25kKXtcclxuXHRcdGVsLmFkZENsYXNzKHRvZ2dsZWRDbGFzcyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGVsLnJlbW92ZUNsYXNzKHRvZ2dsZWRDbGFzcyk7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICog0KTRg9C90LrRhtC40Y8g0LTQvtCx0LDQstC70Y/QtdGCINC6INGN0LvQtdC80LXQvdGC0YMg0LrQu9Cw0YHRgSwg0LXRgdC70Lgg0YHRgtGA0LDQvdC40YbQsCDQv9GA0L7QutGA0YPRh9C10L3QsCDQsdC+0LvRjNGI0LUsINGH0LXQvCDQvdCwINGD0LrQsNC30LDQvdC90L7QtSDQt9C90LDRh9C10L3QuNC1LCBcclxuICog0Lgg0YPQsdC40YDQsNC10YIg0LrQu9Cw0YHRgSwg0LXRgdC70Lgg0LfQvdCw0YfQtdC90LjQtSDQvNC10L3RjNGI0LVcclxuICogQHBhcmFtIHtvYmplY3R9IGVsIC0g0Y3Qu9C10LzQtdC90YIsINGBINC60L7RgtC+0YDRi9C8INCy0LfQsNC40LzQvtC00LXQudGB0YLQstGD0LXQvFxyXG4gKiBAcGFyYW0ge21peGVkfSBbc2Nyb2xsVmFsdWU9MF0gLSDQt9C90LDRh9C10L3QuNC1INC/0YDQvtC60YDRg9GC0LrQuCwg0L3QsCDQutC+0YLQvtGA0L7QvCDQvNC10L3Rj9C10LwgY3NzLdC60LvQsNGB0YEsINC+0LbQuNC00LDQtdC80L7QtSDQt9C90LDRh9C10L3QuNC1IC0g0YfQuNGB0LvQviDQuNC70Lgg0LrQu9GO0YfQtdCy0L7QtSDRgdC70L7QstC+ICd0aGlzJy4g0JXRgdC70Lgg0L/QtdGA0LXQtNCw0L3QviAndGhpcycsINC/0L7QtNGB0YLQsNCy0LvRj9C10YLRgdGPINC/0L7Qu9C+0LbQtdC90LjQtSBlbC5vZmZzZXQoKS50b3Ag0LzQuNC90YPRgSDQv9C+0LvQvtCy0LjQvdCwINCy0YvRgdC+0YLRiyDRjdC60YDQsNC90LBcclxuICogQHBhcmFtIHtzdHJpbmd9IFt0b2dnbGVkQ2xhc3M9c2Nyb2xsZWRdIC0gY3NzLdC60LvQsNGB0YEsINC60L7RgtC+0YDRi9C5INC/0LXRgNC10LrQu9GO0YfQsNC10LxcclxuICovXHJcbmZ1bmN0aW9uIHRvZ2dsZUVsZW1lbnRDbGFzc09uU2Nyb2xsKGVsLCBzY3JvbGxWYWx1ZSA9IDAsIHRvZ2dsZWRDbGFzcyA9ICdzY3JvbGxlZCcpe1xyXG5cdGlmKGVsLmxlbmd0aCA9PSAwKSB7XHJcblx0XHQvL2NvbnNvbGUuZXJyb3IoXCLQndC10L7QsdGF0L7QtNC40LzQviDQv9C10YDQtdC00LDRgtGMINC+0LHRitC10LrRgiwg0YEg0LrQvtGC0L7RgNGL0Lwg0LLRiyDRhdC+0YLQuNGC0LUg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0L7QstCw0YLRjFwiKTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblx0XHJcblx0aWYoc2Nyb2xsVmFsdWUgPT0gJ3RoaXMnKSB7XHJcblx0XHRzY3JvbGxWYWx1ZSA9IGVsLm9mZnNldCgpLnRvcCAtICQod2luZG93KS5vdXRlckhlaWdodCgpIC8gMjtcclxuXHR9XHJcblx0XHJcblx0JCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbihlKXtcclxuXHRcdGlmKCQod2luZG93KS5zY3JvbGxUb3AoKSA+IHNjcm9sbFZhbHVlKXtcclxuXHRcdFx0ZWwuYWRkQ2xhc3ModG9nZ2xlZENsYXNzKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGVsLnJlbW92ZUNsYXNzKHRvZ2dsZWRDbGFzcyk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn07XHJcblxyXG4vKipcclxuICog0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtCx0YvRgtC40Lkg0LTQu9GPINC/0LXRgNC10LrQu9GO0YfQsNGC0LXQu9C10Lkg0LrQu9Cw0YHRgdC+0LJcclxuICogQGV4YW1wbGVcclxuICogSGVscGVycy5pbml0KCk7XHJcbiAqL1xyXG5mdW5jdGlvbiBpbml0KCl7XHJcbiAgXHJcbiAgdG9nZ2xlRWxlbWVudENsYXNzT25TY3JvbGwoJCgnLmhlYWRlcicpLCA1MCk7XHJcbiAgXHJcbiAgJCgnLmpzLWhpZGUtYmxvY2snKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgbGV0IGJsb2NrID0gJCh0aGlzKS5kYXRhKCd0YXJnZXQnKSA9PT0gJ3NlbGYnID8gJCh0aGlzKS5wYXJlbnQoKSA6ICQodGhpcykuZGF0YSgndGFyZ2V0Jyk7XHJcbiAgICBibG9jay5mYWRlT3V0KDUwMCk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aW1lciA9IG5ldyBEYXRlKCk7XHJcbiAgICBpZiAodGltZW91dCA9PT0gZmFsc2UpIHtcclxuICAgICAgdGltZW91dCA9IHRydWU7XHJcbiAgICAgIHNldFRpbWVvdXQocmVzaXplRW5kLCBkZWx0YSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgJCgnLmJ0bi1tZW51Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2lzLW9wZW4nKTtcclxuICAgICQoJy5oZWFkZXInKS50b2dnbGVDbGFzcygnaXMtb3BlbicpO1xyXG4gICAgJCgnLm1haW4tbmF2Jykuc2xpZGVUb2dnbGUoNTAwKTtcclxuICB9KTtcclxuICBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7aW5pdCwgdG9nZ2xlQ2xhc3NJZiwgdG9nZ2xlRWxlbWVudENsYXNzT25TY3JvbGx9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvY29tcG9uZW50cy9oZWxwZXJzLmpzIiwiLyoqXHJcbiAqINCa0LDRgNGD0YHQtdC70YxcclxuICogQG1vZHVsZSBDYXJvdXNlbFxyXG4gKi9cclxuLy8gZGVmYXVsdFxyXG5sZXQgY2Fyb3VzZWxEZWZhdWx0ID0gJChcIi5vd2wtY2Fyb3VzZWwuY2Fyb3VzZWwtLWRlZmF1bHRcIik7XHJcbmxldCBjYXJvdXNlbERlZmF1bHRPcHRpb25zID0ge1xyXG4gIGl0ZW1zOiAxLFxyXG4gIG5hdjogdHJ1ZSxcclxuICBuYXZUZXh0OiBbJzxzdmcgY2xhc3M9XCJpY29uXCI+PHVzZSB4bGluazpocmVmPVwiI2Fycm93LWxlZnRcIi8+PC9zdmc+JywgJzxzdmcgY2xhc3M9XCJpY29uXCI+PHVzZSB4bGluazpocmVmPVwiI2Fycm93LXJpZ2h0XCIvPjwvc3ZnPiddLFxyXG4gIGRvdHM6IHRydWUsXHJcbiAgbG9vcDogdHJ1ZSxcclxuICBtb3VzZURyYWc6IGZhbHNlLFxyXG4gIGFuaW1hdGVPdXQ6ICdmYWRlT3V0J1xyXG59XHJcbi8vIG1vYmlsZSBvbmx5XHJcbmxldCBjYXJvdXNlbE1vYmlsZSA9ICQoXCIub3dsLWNhcm91c2VsLmNhcm91c2VsLS1tb2JpbGVcIik7XHJcbmxldCBjYXJvdXNlbE1vYmlsZU9wdGlvbnMgPSB7XHJcbiAgaXRlbXM6IDEsXHJcbiAgbmF2OiB0cnVlLFxyXG4gIGRvdHM6IGZhbHNlLFxyXG4gIG5hdlRleHQ6IFsnPGRpdiBjbGFzcz1cInByZXZcIj48L2Rpdj4nLCAnPGRpdiBjbGFzcz1cIm5leHRcIj48L2Rpdj4nXSxcclxuICBkb3RzOiBmYWxzZSxcclxuICBtb3VzZURyYWc6IGZhbHNlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhcm91c2VsSW5pdEJ5Q29uZGl0aW9uKGNhcm91c2VsLCBvcHRpb25zLCBjb25kaXRpb24pIHtcclxuICBpZiAoY29uZGl0aW9uKSB7XHJcbiAgICBjYXJvdXNlbC5vd2xDYXJvdXNlbChvcHRpb25zKTtcclxuICB9IGVsc2Uge1xyXG4gICAgY2Fyb3VzZWwudHJpZ2dlcignZGVzdHJveS5vd2wuY2Fyb3VzZWwnKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQutCw0YDRg9GB0LXQu9C4XHJcbiAqL1xyXG5mdW5jdGlvbiBpbml0KCl7XHJcbiAgY2Fyb3VzZWxEZWZhdWx0Lm93bENhcm91c2VsKGNhcm91c2VsRGVmYXVsdE9wdGlvbnMpO1xyXG4gIGNhcm91c2VsSW5pdEJ5Q29uZGl0aW9uKGNhcm91c2VsTW9iaWxlLCBjYXJvdXNlbE1vYmlsZU9wdGlvbnMsIE1haW4uRGV2aWNlRGV0ZWN0aW9uLmlzTW9iaWxlKCkpO1xyXG4gIFxyXG4gIC8vIGluaXQgb24gcmVzaXplXHJcbiAgJCh3aW5kb3cpLm9uKCdyZXNpemVlbmQnLCBmdW5jdGlvbigpe1xyXG4gICAgY2Fyb3VzZWxJbml0QnlDb25kaXRpb24oY2Fyb3VzZWxNb2JpbGUsIGNhcm91c2VsTW9iaWxlT3B0aW9ucywgTWFpbi5EZXZpY2VEZXRlY3Rpb24uaXNNb2JpbGUoKSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2luaXR9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvY29tcG9uZW50cy9jYXJvdXNlbC5qcyIsIi8qKlxyXG4gKiDQktGB0L/Qu9GL0LLQsNGO0YnQuNC1INC+0LrQvdCwXHJcbiAqIEBtb2R1bGUgTW9kYWxcclxuICovXHJcblxyXG5sZXQgbGF5b3V0ID0gJCgnLmxheW91dCcpO1xyXG5sZXQgbW9kYWxXcmFwcGVyQ2xhc3MgPSAnLm1vZGFsX193cmFwcGVyJztcclxuLy9sZXQgbW9kYWxXcmFwcGVyID0gJCgnLm1vZGFsX193cmFwcGVyJyk7XHJcbiBcclxuZnVuY3Rpb24gb3Blbk1vZGFsKG1vZGFsLCBpc0Z1bGxzY3JlZW4gPSBmYWxzZSkge1xyXG4gIGxldCBtb2RhbFdyYXBwZXIgPSBtb2RhbC5jbG9zZXN0KG1vZGFsV3JhcHBlckNsYXNzKTtcclxuICBsZXQgbW9kYWxBY3RpdmF0b3IgPSAkKCdbZGF0YS10YXJnZXQ9XCIjJyArIG1vZGFsLmF0dHIoJ2lkJykgKyAnXCJdJyk7XHJcbiAgbW9kYWxXcmFwcGVyLnJlbW92ZUNsYXNzKCdpbnZpc2libGUnKTtcclxuICBtb2RhbC5yZW1vdmVDbGFzcygnaW52aXNpYmxlJyk7XHJcbiAgbGV0IHdyYXBwZXJDbGFzc2VzID0gJ2lzLW9wZW5lZCc7XHJcbiAgaWYgKGlzRnVsbHNjcmVlbikge1xyXG4gICAgd3JhcHBlckNsYXNzZXMgKz0gJyBpcy1mdWxsc2NyZWVuJztcclxuICB9XHJcbiAgbGF5b3V0LmFkZENsYXNzKCdtb2RhbC1vcGVuJyk7XHJcbiAgbW9kYWxXcmFwcGVyLmFkZENsYXNzKHdyYXBwZXJDbGFzc2VzKTtcclxuICBtb2RhbC5hZGRDbGFzcygnaXMtb3BlbmVkJyk7XHJcbiAgJCgnaHRtbCwgYm9keScpLmNzcygnb3ZlcmZsb3cteScsICdoaWRkZW4nKTtcclxuICBtb2RhbEFjdGl2YXRvci5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAkKHRoaXMpLmFkZENsYXNzKCdtb2RhbC1pcy1vcGVuZWQnKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VNb2RhbChtb2RhbCwgb3Blbk5leHQgPSBmYWxzZSkge1xyXG4gIGxldCBtb2RhbFdyYXBwZXIgPSBtb2RhbC5jbG9zZXN0KG1vZGFsV3JhcHBlckNsYXNzKTtcclxuICBsZXQgbW9kYWxBY3RpdmF0b3IgPSAkKCdbZGF0YS10YXJnZXQ9XCIjJyArIG1vZGFsLmF0dHIoJ2lkJykgKyAnXCJdJyk7XHJcbiAgbW9kYWxBY3RpdmF0b3IuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnbW9kYWwtaXMtb3BlbmVkJyk7XHJcbiAgfSk7XHJcbiAgbW9kYWwucmVtb3ZlQ2xhc3MoJ2lzLW9wZW5lZCcpO1xyXG4gIGlmICghb3Blbk5leHQpIHtcclxuICAgIGxheW91dC5yZW1vdmVDbGFzcygnbW9kYWwtb3BlbicpO1xyXG4gICAgbW9kYWxXcmFwcGVyLnJlbW92ZUNsYXNzKCdpcy1vcGVuZWQgaXMtZnVsbHNjcmVlbicpO1xyXG4gICAgJCgnaHRtbCwgYm9keScpLmNzcygnb3ZlcmZsb3cteScsICcnKTtcclxuICB9XHJcbiAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgbW9kYWwuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xyXG4gICAgbW9kYWxXcmFwcGVyLmFkZENsYXNzKCdpbnZpc2libGUnKTtcclxuICB9LCAzMDApO1xyXG59XHJcblxyXG4vKipcclxuICog0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtCx0YvRgtC40Lkg0LTQu9GPINCy0YHQv9C70YvQstCw0Y7RidC40YUg0L7QutC+0L1cclxuICogQGV4YW1wbGVcclxuICogTW9kYWwuaW5pdCgpO1xyXG4gKi9cclxuZnVuY3Rpb24gaW5pdCgpe1xyXG4gICAgXHJcbiAgJCgnLmpzLW1vZGFsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IHRhcmdldCA9ICQodGhpcykuYXR0cignZGF0YS10YXJnZXQnKTtcclxuICAgICAgbGV0IG1vZGFsID0gJCh0YXJnZXQpO1xyXG4gICAgICBsZXQgaXNGdWxsc2NyZWVuID0gbW9kYWwuYXR0cignZGF0YS1mdWxsc2NyZWVuJykgIT09IHVuZGVmaW5lZDtcclxuICAgICAgaWYgKCFtb2RhbC5oYXNDbGFzcygnaXMtb3BlbmVkJykpIHtcclxuICAgICAgICBvcGVuTW9kYWwobW9kYWwsIGlzRnVsbHNjcmVlbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2xvc2VNb2RhbChtb2RhbCk7XHJcbiAgICAgIH1cclxuICB9KTtcclxuICBcclxuICAkKG1vZGFsV3JhcHBlckNsYXNzKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICBpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ21vZGFsX193cmFwcGVyJykpIHtcclxuICAgICAgbGV0IG1vZGFsID0gJCh0aGlzKS5maW5kKCcubW9kYWwuaXMtb3BlbmVkJyk7XHJcbiAgICAgIG1vZGFsLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICBjbG9zZU1vZGFsKCQodGhpcykpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBvcGVuTW9kYWxIYXNoKCkge1xyXG4gICAgICAgIGxldCBoYXNoID0gWydjb21wZXRpdGlvbiddLFxyXG4gICAgICAgICAgICBpc0Z1bGxzY3JlZW4sXHJcbiAgICAgICAgICAgIG1vZGFsLFxyXG4gICAgICAgICAgICBpO1xyXG5cclxuICAgICAgICBmb3IgKGkgPSAwO2kgPCBoYXNoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICggJyMnK2hhc2hbaV0gPT0gd2luZG93LmxvY2F0aW9uLmhhc2ggJiYgJCgnIycraGFzaFtpXSkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBtb2RhbCA9ICQoJyMnK2hhc2hbaV0pO1xyXG4gICAgICAgICAgICAgICAgaXNGdWxsc2NyZWVuID0gbW9kYWwuYXR0cignZGF0YS1mdWxsc2NyZWVuJykgIT09IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICBvcGVuTW9kYWwobW9kYWwsIGlzRnVsbHNjcmVlbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3Blbk1vZGFsSGFzaCgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtpbml0LCBvcGVuTW9kYWwsIGNsb3NlTW9kYWx9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvY29tcG9uZW50cy9tb2RhbC5qcyIsIi8qKlxyXG4gKiDQn9C10YDQtdC60LvRjtGH0LXQvdC40LUg0LrQu9Cw0YHRgdC+0LIg0L/QviDRgNCw0LfQu9C40YfQvdGL0Lwg0YHQvtCx0YvRgtC40Y/QvFxyXG4gKiBAbW9kdWxlIEFuaW1hdGlvblxyXG4gKi9cclxuXHJcbmxldCBzY3JvbGxBbmltYXRpb25CbG9ja3MgPSAkKCcuYS1zY3JvbGwtYm94Jyk7XHJcbmxldCBwYXJhbGxheEJsb2NrcyA9ICQoJy5hLXBhcmFsbGF4LWJveCcpO1xyXG4gXHJcbmZ1bmN0aW9uIGFkZENsYXNzVG9nZ2xlclNjZW5lIChlbCwgY29udHJvbGxlcikge1xyXG4gIG5ldyBTY3JvbGxNYWdpYy5TY2VuZSh7XHJcbiAgICB0cmlnZ2VyRWxlbWVudDogZWwsXHJcbiAgICB0cmlnZ2VySG9vazogMC43XHJcbiAgfSlcclxuICAuc2V0Q2xhc3NUb2dnbGUoZWwsICdhbmltYXRlJylcclxuICAuYWRkVG8oY29udHJvbGxlcik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZENsYXNzVG9nZ2xlckNvbnRyb2xsZXIgKGFuaW1hdGlvbkJsb2Nrcykge1xyXG4gIGxldCBjb250cm9sbGVyID0gbmV3IFNjcm9sbE1hZ2ljLkNvbnRyb2xsZXIoKTtcclxuICBhbmltYXRpb25CbG9ja3MuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgbGV0IGNsb3Nlc3RDb250YWluZXIgPSAkKHRoaXMpLmNsb3Nlc3QoJ1tjbGFzcyo9XCJsLWZsZXhcIl06bm90KFtjbGFzcyo9XCJsLWNvbFwiXSknKVswXSB8fCAkKHRoaXMpLmNsb3Nlc3QoJy5sLWNvbnRhaW5lcicpWzBdO1xyXG4gICAgaWYgKGNsb3Nlc3RDb250YWluZXIub2Zmc2V0VG9wIDwgd2luZG93Lm91dGVySGVpZ2h0KSB7XHJcbiAgICAgICQodGhpcykuY2hpbGRyZW4oJ1tjbGFzcyo9XCJhLVwiXScpLmNzcyh7J3RyYW5zaXRpb24nOiAnbm9uZSd9KTtcclxuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICBsZXQgZGVsYXkgPSAyNTAgKiAkKGNsb3Nlc3RDb250YWluZXIpLmluZGV4KCk7XHJcbiAgICAgICQoc2VsZikuZGF0YSgndGltZXInLCBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHNlbGYpLmNoaWxkcmVuKCdbY2xhc3MqPVwiYS1cIl0nKS5jc3Moeyd0cmFuc2l0aW9uJzogJyd9KTtcclxuICAgICAgICAkKHNlbGYpLmFkZENsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAgIH0sIDI1MCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGFEZWxheSA9IDA7XHJcbiAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtYS1kZWxheScpICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBhRGVsYXkgPSBOdW1iZXIoJCh0aGlzKS5hdHRyKCdkYXRhLWEtZGVsYXknKSkgKiAxMDAwO1xyXG4gICAgICB9XHJcbiAgICAgIHNldFRpbWVvdXQoYWRkQ2xhc3NUb2dnbGVyU2NlbmUsIGFEZWxheSwgdGhpcywgY29udHJvbGxlcik7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZyb21Qb3NpdGlvbiAoZWwsIGRlZmF1bHRQb3NpdGlvbiA9IDApe1xyXG4gIHJldHVybiAoZWwuYXR0cignZGF0YS1wYXJhbGxheC1mcm9tJykgIT09IHVuZGVmaW5lZCkgPyBOdW1iZXIoZWwuYXR0cignZGF0YS1wYXJhbGxheC1mcm9tJykpIDogZGVmYXVsdFBvc2l0aW9uO1xyXG59XHJcbmZ1bmN0aW9uIGdldFRvUG9zaXRpb24gKGVsLCBkZWZhdWx0UG9zaXRpb24gPSAwKXtcclxuICByZXR1cm4gKGVsLmF0dHIoJ2RhdGEtcGFyYWxsYXgtdG8nKSAhPT0gdW5kZWZpbmVkKSA/IE51bWJlcihlbC5hdHRyKCdkYXRhLXBhcmFsbGF4LXRvJykpIDogZGVmYXVsdFBvc2l0aW9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQYXJhbGxheFRpbWVsaW5lIChlbCkge1xyXG4gIGxldCB0d2VlbiA9IG5ldyBUaW1lbGluZU1heCgpO1xyXG4gIGxldCB0d2VlbnNBcnIgPSBbXTtcclxuICBpZiAoJChlbCkuZmluZCgnLmEtcGFyYWxsYXgtYmFjaycpKSB7XHJcbiAgICBsZXQgdGFyZ2V0RWwgPSAkKGVsKS5maW5kKCcuYS1wYXJhbGxheC1iYWNrJyk7XHJcbiAgICBsZXQgZnJvbVBvcyA9IGdldEZyb21Qb3NpdGlvbih0YXJnZXRFbCwgLTIwKTtcclxuICAgIGxldCB0b1BvcyA9IGdldFRvUG9zaXRpb24odGFyZ2V0RWwpO1xyXG4gICAgdHdlZW5zQXJyLnB1c2goVHdlZW5NYXguZnJvbVRvKHRhcmdldEVsLCAxLCB7eVBlcmNlbnQ6IGZyb21Qb3N9LCB7eVBlcmNlbnQ6IHRvUG9zLCBlYXNlOiBMaW5lYXIuZWFzZU5vbmV9KSk7XHJcbiAgfVxyXG4gIGlmICgkKGVsKS5maW5kKCcuYS1wYXJhbGxheC1taWRkbGUnKSkge1xyXG4gICAgbGV0IHRhcmdldEVsID0gJChlbCkuZmluZCgnLmEtcGFyYWxsYXgtbWlkZGxlJyk7XHJcbiAgICBsZXQgZnJvbVBvcyA9IGdldEZyb21Qb3NpdGlvbih0YXJnZXRFbCwgLTE1KTtcclxuICAgIGxldCB0b1BvcyA9IGdldFRvUG9zaXRpb24odGFyZ2V0RWwpO1xyXG4gICAgdHdlZW5zQXJyLnB1c2goVHdlZW5NYXguZnJvbVRvKHRhcmdldEVsLCAxLCB7eVBlcmNlbnQ6IGZyb21Qb3N9LCB7eVBlcmNlbnQ6IHRvUG9zLCBlYXNlOiBMaW5lYXIuZWFzZU5vbmV9KSk7XHJcbiAgfVxyXG4gIGlmICgkKGVsKS5maW5kKCcuYS1wYXJhbGxheC1mcm9udCcpKSB7XHJcbiAgICBsZXQgdGFyZ2V0RWwgPSAkKGVsKS5maW5kKCcuYS1wYXJhbGxheC1mcm9udCcpO1xyXG4gICAgbGV0IGZyb21Qb3MgPSBnZXRGcm9tUG9zaXRpb24odGFyZ2V0RWwsIC0xMCk7XHJcbiAgICBsZXQgdG9Qb3MgPSBnZXRUb1Bvc2l0aW9uKHRhcmdldEVsLCAxMCk7XHJcbiAgICB0d2VlbnNBcnIucHVzaChUd2Vlbk1heC5mcm9tVG8odGFyZ2V0RWwsIDEsIHt5UGVyY2VudDogZnJvbVBvc30sIHt5UGVyY2VudDogdG9Qb3MsIGVhc2U6IExpbmVhci5lYXNlTm9uZX0pKTtcclxuICB9XHJcbiAgdHdlZW4uYWRkKHR3ZWVuc0Fycik7XHJcbiAgcmV0dXJuIHR3ZWVuO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRQYXJhbGxheFNjZW5lIChlbCwgdHdlZW4sIGNvbnRyb2xsZXIpIHtcclxuICBuZXcgU2Nyb2xsTWFnaWMuU2NlbmUoe1xyXG4gICAgdHJpZ2dlckVsZW1lbnQ6IGVsLFxyXG4gICAgdHJpZ2dlckhvb2s6IDAsXHJcbiAgICBkdXJhdGlvbjogJChlbCkuaGVpZ2h0KClcclxuICB9KVxyXG4gIC5zZXRUd2Vlbih0d2VlbilcclxuICAuYWRkVG8oY29udHJvbGxlcik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFBhcmFsbGF4Q29udHJvbGxlciAoYW5pbWF0aW9uQmxvY2tzKSB7XHJcbiAgbGV0IGNvbnRyb2xsZXIgPSBuZXcgU2Nyb2xsTWFnaWMuQ29udHJvbGxlcigpO1xyXG4gIGFuaW1hdGlvbkJsb2Nrcy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgdHdlZW4gPSBnZXRQYXJhbGxheFRpbWVsaW5lKHRoaXMpO1xyXG4gICAgYWRkUGFyYWxsYXhTY2VuZSh0aGlzLCB0d2VlbiwgY29udHJvbGxlcik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQgKCkge1xyXG4gIGlmIChzY3JvbGxBbmltYXRpb25CbG9ja3MubGVuZ3RoID4gMCAmJiAkKHdpbmRvdykud2lkdGgoKSA+IDEwMjQpe1xyXG4gICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpcy1hbmltYXRpbmcnKTtcclxuICAgIGFkZENsYXNzVG9nZ2xlckNvbnRyb2xsZXIoc2Nyb2xsQW5pbWF0aW9uQmxvY2tzKTtcclxuICB9XHJcbiAgaWYgKHBhcmFsbGF4QmxvY2tzLmxlbmd0aCA+IDAgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiAxMDI0KXtcclxuICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtYW5pbWF0aW5nJyk7XHJcbiAgICBhZGRQYXJhbGxheENvbnRyb2xsZXIocGFyYWxsYXhCbG9ja3MpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7aW5pdH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL2FuaW1hdGlvbi5qcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzNCQTs7Ozs7QUFLQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDNUpBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQVRBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUM5Q0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDM0ZBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Iiwic291cmNlUm9vdCI6IiJ9