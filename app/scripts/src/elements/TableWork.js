/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.TableWork = function(data, options) {
  APP.BaseElement.call(this, data, 'table-work', options);
};

APP.TableWork.prototype = Object.create(APP.BaseElement.prototype);

APP.TableWork.constructor = APP.TableWork;

APP.TableWork.prototype.listeners = function() {
  this.featuredBtn = this.view.find('.featured-btn');
  this.featuredBtn.click(this.featuredHandler.bind(this));
};