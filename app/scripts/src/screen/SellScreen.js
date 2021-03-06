/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.SellScreen = function() {
  APP.BaseScreen.call(this, 'sell');
};

APP.SellScreen.constructor = APP.SellScreen;
APP.SellScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.SellScreen.prototype.setupUI = function() {
  this.createBtn = $('.create-btn');

  this.product1 = new APP.CreatorProductItem(1);
  this.product2 = new APP.CreatorProductItem(2, categories[1]);
  this.product3 = new APP.CreatorProductItem(3, categories[2]);
  this.product4 = new APP.CreatorProductItem(4, categories[3]);

  this.products = [this.product1, this.product2, this.product3, this.product4];

  this.oldIndex = null;
  this.currentIndex = 0;
};

APP.SellScreen.prototype.listeners = function() {
  this.createBtn.click(this.createHandler.bind(this));

  var scope = this;
  $('.product-creator').click(function(e) {
    e.preventDefault();

    scope.currentIndex = parseInt($(this).data('prod'), 10);

    // if(scope.currentIndex === scope.oldIndex)) {
    //   return scope['product' + scope.oldIndex].close();
    // }

    if (scope.oldIndex)
      scope['product' + scope.oldIndex].close();

    scope['product' + scope.currentIndex].open();

    scope.oldIndex = scope.currentIndex;
  });
};

APP.SellScreen.prototype.createHandler = function(e) {
  e.preventDefault();

  $('.create-btn').addClass('hide');
  $('.create-btn-loading').removeClass('hide');

  var url = DataApp.currentUser.url + '/product/create';

  var i, payload = [];
  for (i = 0; i < this.products.length; i++) {
    payload = _.union(payload, this.products[i].getPayload());
  }
  this.requestHandler(url, {
    products: JSON.stringify(payload)
  }, this.productCreatedComplete);
};


APP.SellScreen.prototype.productCreatedComplete = function(response) {
  this.showFlash('succes', 'Su producto se envió a revisión');
  var timeout = setTimeout(function() {
    clearTimeout(timeout);
    window.location.href = DataApp.currentUser.url + '/products';
  }, 2000);
};