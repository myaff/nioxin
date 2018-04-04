let DeviceDetection = require("./components/device-detection");
let Helpers = require("./components/helpers");
let Carousel = require("./components/carousel");
let Input = require("./components/input");
let Form = require("./components/form");
let Modal = require("./components/modal");
let Animation = require("./components/animation");
let Share = require("./components/share");

$(document).ready(function(){
  
  let hosts = {
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
  DeviceDetection,
  Helpers,
  Input,
  Form,
  Carousel,
  Modal,
  Animation,
  Share
};