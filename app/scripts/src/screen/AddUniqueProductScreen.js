/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AddUniqueProductScreen = function() {
  APP.BaseScreen.call(this, 'addProduct');
  this.product = null;
};

APP.AddUniqueProductScreen.constructor = APP.AddUniqueProductScreen;
APP.AddUniqueProductScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AddUniqueProductScreen.prototype.setupUI = function() {
  this.workForm = $('.work-form');
  this.uploader = $('.uploader-work');
  this.uploader2 = $('.uploader-work2');
  this.name = $('input[name=name]');
  this.shortDescription = $('input[name=short]');
  this.weight = $('input[name=weight]');
  this.price = $('input[name=price]');
  this.profit = $('input[name=profit]');
  this.finalPrice = $('input[name=finalPrice]');
  this.category = $('select[name=category]');
  this.description = $('textarea[name=description]');
  this.information = $('textarea[name=information]');

  this.tags = $('input[name=tags]');
  this.tags.tagsInput({
    height: '50px',
    width: '100%',
    defaultText: '+Etiqueta'
  });
  
  this.send = $('.send');
  this.sendLoading = $('.send-loading');

  this.uploaderImage = new APP.UploaderImage(this.uploader, this.imgComplete, {uploader:$('*[data-cloudinary-field="photo"]')});
  this.uploaderImage2 = new APP.UploaderImage(this.uploader2, this.imgComplete2, {uploader:$('*[data-cloudinary-field="photo2"]')});
};

APP.AddUniqueProductScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);
  this.workForm.submit(this.workFormSubmitHandler.bind(this));
  this.price.on('input change paste',this.priceHandler.bind(this));
  this.finalPrice.on('input change paste',this.finalPriceHandler.bind(this));
  this.category.change(this.categoryHandler.bind(this));
};


APP.AddUniqueProductScreen.prototype.workFormSubmitHandler = function(event) {
  event.preventDefault();
  var errors = [],
    scope = this;
  if (!this.uploaderImage.photo) errors.push('Ingrese una foto principal');
  if (!this.uploaderImage2.photo) errors.push('Ingrese una foto secundaria');
  if (Validations.notBlank(this.name.val())) errors.push('Ingrese un nombre');
  if (Validations.notBlank(this.weight.val())) errors.push('Ingrese un peso');
  if (Validations.notBlank(this.price.val())) errors.push('Ingrese un precio de proveedor');
  if (Validations.notBlank(this.profit.val())) errors.push('Ingrese una ganancia de AM');
  if (Validations.notBlank(this.finalPrice.val())) errors.push('Ingrese el precio final');
  if (Validations.notBlank(this.category.val())) errors.push('Ingrese una categoria');
  if (Validations.notBlank(this.description.val())) errors.push('Ingrese una descripcion');
  if (Validations.notBlank(this.information.val())) errors.push('Ingrese informacion del producto');
  if (this.tags.val().split(',')[0].length < 1) errors.push('Ingrese etiquetas');

  if (errors.length > 0) return this.showFlash('error', errors);

  this.sendLoading.show();
  this.send.hide();

  var info = this.information.val().split('\n');

  var config = {
    weight: this.weight.val(),
    description: this.description.val(),
    profit: this.profit.val(),
    info: JSON.stringify(info)
  }

  var descriptionTemp = null;

  if(this.shortDescription.val()) descriptionTemp = this.shortDescription.val();

  var data = {
    product:{
      name: this.name.val(),
      description: descriptionTemp,
      price: (Math.round(parseInt(this.finalPrice.val()) * 1.2)).toString(),
      finalPrice: this.finalPrice.val(),
      photo: scope.uploaderImage.photo,
      printPhoto: scope.uploaderImage.photo,
      config: JSON.stringify(config),
      CategoryId: this.category.val()
    },
    work:{
      name: this.name.val(),
      description: descriptionTemp,
      photo: scope.uploaderImage2.photo,
      public: false,
      visible: false,
      nsfw: true,
      featured: false
    },
    tags: this.tags.val().split(',')
  };
  var url = responseUrl + '/product/createunique';
  this.requestHandler(url, {
    data: JSON.stringify(data)
  }, this.workCreatedComplete);
};

APP.AddUniqueProductScreen.prototype.workCreatedComplete = function(response) {
  this.showFlash('succes', 'El producto se subió exitosamente')
  this.work = response.data.work;

  this.workForm.hide();

  this.sendLoading.hide();
  this.send.show();

  var url = DataApp.currentUser.url + '/work/' + this.work.nameSlugify
  var photo = Utils.addImageFilter(this.work.photo, 'w_300,c_limit');

  this.workView.attr('href', url);
  this.workNew.attr('href', DataApp.currentUser.url + '/work/add');
  this.workEdit.attr('href', url + '/edit');
  this.workPhotoPublished.attr('src', photo);
  this.workNamePublished.text(this.work.name);
  this.workUserPublished.text(DataApp.currentUser.fullname);
  this.workPublished.show();
};

APP.AddUniqueProductScreen.prototype.categoryHandler = function(event) {
  var i = this.category.find(':selected').data('info')
  var data = JSON.parse(categories[i-1].data);

  this.description.val(data.description);
  this.weight.val(data.weight);
  this.profit.val(data.price);
  var temp = data.info.length-1;
  for(line in data.info){
    if(line == temp){
      this.information.append(data.info[line]);
    }
    else{
      this.information.append(data.info[line]+'\n');
    }
  }
};

APP.AddUniqueProductScreen.prototype.priceHandler = function(event) {
  var pro = parseFloat(this.profit.val()) / 100 + 1
  var preTax = parseFloat(this.price.val()) * pro;
  var tax = 1.18
  this.finalPrice.val(Math.round(preTax * tax));
};

APP.AddUniqueProductScreen.prototype.finalPriceHandler = function(event) {
  var tax = 1.18
  var preTax = parseFloat(this.finalPrice.val()) / tax;
  var pro = parseFloat(this.profit.val()) / 100;
  var amProfit = preTax * pro;
  this.price.val(Math.round(preTax - amProfit));
};

APP.AddUniqueProductScreen.prototype.imgComplete = function(idImage) {
  this.$view.find('.upload').show();
  $('.cloudinary-fileupload').show();
  var filters = {
    width: 300,
    crop: 'limit'
  };
  $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));
};

APP.AddUniqueProductScreen.prototype.imgComplete2 = function(idImage) {
  this.$view.find('.upload').show();
  $('.cloudinary-fileupload').show();
  var filters = {
    width: 300,
    crop: 'limit'
  };
  $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));
};