/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};
    APP.BaseElement = function (data, id, options) {
    this.options = options || {context: 'normal'};
    this.template = APP.TemplateManager.instance.getFromDoc(id);
    this.data = data;
    this.id = id;
    var viewHelpers = {
      addFilter: Utils.addImageFilter,
      formatDate: function(date){
        return moment(date).fromNow();
      },
      viewer: DataApp.currentUser
    };
    _.extend(this.data, this.options);
    _.extend(this.data, viewHelpers);
    this.view = $(this.template(this.data));
    this.rawView = this.view[0];
    this.listeners();
};

APP.BaseElement.prototype = Object.create(EventDispatcher.prototype);

APP.BaseElement.constructor = APP.BaseElement;

APP.BaseElement.prototype.listeners = function () {
  this.view.find('.featured').click(this.featuredHandler.bind(this));
};

APP.BaseElement.prototype.featuredHandler = function() {
  var url;
  if(this.data.featured) {
    if(this.id ==='user') {
      url = '/user/'+ this.data.username + '/unfeatured';
    }
    // else if(this.id === 'post') {
    //   url = '/blog/' + this.id + '/unfeatured';
    // }
    else {
      url = '/user/'+ this.data.User.username +'/'+ this.id + '/unfeatured';
    }
  }else {
    if(this.id ==='user') {
      url = '/user/'+ this.data.username + '/featured';
    }
    // else if(this.id === 'post') {
    //   url = '/blog/' + this.id + '/featured';
    // }
    else {
      url = '/user/'+ this.data.User.username +'/' + this.id + '/featured';
    }
  }
  var scope = this;
  var payload = {};
  payload['id' + Utils.capitalize(this.id)] = this.data.id;
  $.post(url,payload, function (response) {
    if(response.status === 200) {
      if(response.data[scope.id].featured){
        scope.view.find('.featured').removeClass('disabled');
      }else {
        scope.view.find('.featured').addClass('disabled');
      }
      scope.data.featured = response.data[scope.id].featured;
    }
  });
};

APP.BaseElement.prototype.callToApi = function (params) {
    return APP.RestClientManager.instance.execute(params);
}

APP.BaseElement.prototype.isLogged = function () {
    Utils.checkAuthentication();
    return DataApp.currentUser !== null;
};
