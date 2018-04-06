/**
 * Карусель
 * @module Carousel
 */
// default
let carouselDefault = $(".owl-carousel.carousel--default");
let carouselDefaultOptions = {
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
}
// mobile only
let carouselMobile = $(".owl-carousel.carousel--mobile");
let carouselMobileOptions = {
  items: 1,
  margin: 20,
  autoWidth: true,
  stagePadding: 20,
  nav: true,
  navText: ['<svg class="icon"><use xlink:href="#prev-2"/></svg>', '<svg class="icon"><use xlink:href="#next-2"/></svg>'],
  dots: false,
  mouseDrag: false
}

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
function init(){
  carouselDefault.owlCarousel(carouselDefaultOptions);
  carouselInitByCondition(carouselMobile, carouselMobileOptions, Main.DeviceDetection.isMobileVersion());
  
  // init on resize
  $(window).on('resizeend', function(){
    carouselInitByCondition(carouselMobile, carouselMobileOptions, Main.DeviceDetection.isMobileVersion());
  });
}

module.exports = {init};