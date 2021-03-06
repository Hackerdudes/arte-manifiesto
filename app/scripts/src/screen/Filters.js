/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Filters = function(filters) {  
  this.filters = filters;

  this.oldCategory = this.filters.currentCategory;
  this.oldOrder = this.filters.currentOrder;

  this.isFeatured = Utils.getUrlParameter('featured') !== undefined;
  this.term = Utils.getUrlParameter('term');
  this.currentCategory = this.currentOrder = null;

  this.setupUI();
  this.listeners();

  this.isInitialized = false;
};

APP.Filters.constructor = APP.Filters;


APP.Filters.prototype.setupUI = function() {
  var filterRight = $('.filter.right');
  var rightSelect = $('.filter.right .am-Select')

  var rightFilterItems

  setTimeout(function() {
    rightFilterItems = $('.filter.right .am-Filter-item')
    $(rightFilterItems).click(function() {
      setTimeout(function() {
        $(rightSelect).trigger("click")
      }, 300)
    })
  }, 500)

  $(rightSelect).click(function() {
    var state = filterRight.attr('data-state')
    if (state == 'closed') {
      filterRight.find('.fa-caret-down').addClass('rotate-down');
      filterRight.attr('data-state', 'open')
    } else {
      filterRight.find('.fa-caret-down').removeClass('rotate-down');
      filterRight.attr('data-state', 'closed')
    }
  })

  var filterLeft = $('.filter.left')
  var leftSelect = $('.filter.left .am-Select')
  var discoverContent = $('.discover-content')

  $(leftSelect).click(function() {
    var state = filterLeft.attr('data-state')
    if (state == 'closed') {
      filterLeft.find('.fa-caret-left').removeClass('rotate-left');
      filterLeft.attr('data-state', 'open')
      discoverContent.attr('data-state', 'expand').trigger('resetLayout')
    } else {
      filterLeft.find('.fa-caret-left').addClass('rotate-left');
      filterLeft.attr('data-state', 'closed')
      discoverContent.attr('data-state', 'reduce').trigger('resetLayout')
    }
  })

  var device = new Device({
    toDesktop: function() {
    },
    toMobile: function() {
      $('.filter.left .left-menu').css('display', 'block')
    }
  })

  if (device.getVal() == "mobile") {
    $(leftSelect).trigger("click")
    $('.filter.left .left-menu').css('display', 'block')
  }


  function Device(options) {

    var val = window.innerWidth < 1000 ? 'mobile' : 'desktop',
      toDesktop = options.toDesktop,
      toMobile = options.toMobile;


    window.addEventListener('resize', function() {

      var temp = val;

      val = window.innerWidth < 1000 ? 'mobile' : 'desktop';

      if (temp == 'mobile' && val == 'desktop') toDesktop();
      if (temp == 'desktop' && val == 'mobile') toMobile();
    });

    function getVal() {
      return val;
    }

    return {
      getVal: getVal
    };
  }

  this.filters.categories.unshift({
    name: 'Todo',
    nameSlugify: 'all'
  });

  this.itemFilterRenderer(this.filters.categories, 'category');
  this.itemFilterRenderer(this.filters.order, 'order');

  this.featuredBtn = $('.am-Switch-button');
  this.searchInput = $('.am-Search-input input');
  this.searchBtn = $('.search-btn');
  this.closeBtn = $('.close-btn');

  this.categories = $('[data-meta=category]');
  this.orders = $('[data-meta=order]');

  $('[data-value=' + this.oldCategory + ']').parent().addClass('selected');
  $('[data-value=' + this.oldOrder + ']').parent().addClass('selected');

  if (this.isFeatured) $('input[type=checkbox]').prop('checked', true);
  this.navigation = $('.am-navigation-text');

  this.needsToClose = false;
};

APP.Filters.prototype.itemFilterRenderer = function(data, meta) {

  var item = APP.TemplateManager.instance.getFromDoc('filter-item');

  $.each(data, function(index, value) {
    value.meta = meta;
    $('.filter-' + meta).append(item(value));
  });
};

APP.Filters.prototype.listeners = function() {
  this.categories.on('click', this.filterItemHandler.bind(this, 'category'));
  this.orders.on('click', this.filterItemHandler.bind(this, 'order'));
  this.featuredBtn.on('click', this.featuredHandler.bind(this));

  this.term = this.term === undefined ? '' : this.term;
  this.searchInput.val(decodeURIComponent(this.term));

  this.searchBtn.click(this.searchHandler.bind(this));

  this.searchInput.keyup(this.searchKeyUpHandler.bind(this));
  this.searchInput.keypress(this.searchKeyPressHandler.bind(this));

  this.navigation.click(this.navigationClickHandler.bind(this));

  this.closeBtn.click(this.closeClickHandler.bind(this));
  this.searchInput.keyup();
};

APP.Filters.prototype.searchKeyUpHandler = function(event) {
  this.searchInput.val().length > 0 ? this.closeBtn.show() : this.closeBtn.hide();
};

APP.Filters.prototype.closeClickHandler = function(event) {
  this.searchInput.val('');
  this.closeBtn.hide();
  this.needsToClose = true;
  this.searchBtn.click();
};

APP.Filters.prototype.navigationClickHandler = function(event) {
  var obj = $(event.target);
  var currentIndex, url = DataApp.currentUrl;
  this.navigation.each(function(index, value) {
    var idValue = $(value).attr('id');
    if ($(value).hasClass('link')) {
      if (obj.attr('id') === idValue) currentIndex = index;
    }
    if (index > currentIndex) {
      url = Utils.removeURLParameter(url, idValue);
    }
  });
  window.location.href = url;
};

APP.Filters.prototype.searchKeyPressHandler = function(event) {
  if (event.which !== 13) return;
  var value = encodeURIComponent($(event.target).val());
  if (value.length > 0) {
    if (this.term) {
      DataApp.currentUrl = DataApp.currentUrl.replace('term=' + this.term, 'term=' + value);
    } else {
      DataApp.currentUrl = DataApp.currentUrl + '&term=' + value;
    }
    this.term = value;
  } else {
    if (DataApp.currentUrl.indexOf('&term=' + this.term) > -1) {
      DataApp.currentUrl = DataApp.currentUrl.replace('&term=' + this.term, '');
    }
    if (DataApp.currentUrl.indexOf('term=' + this.term) > -1) {
      DataApp.currentUrl = DataApp.currentUrl.replace('term=' + this.term, '');
    }
    this.term = undefined;
  }
  if (this.needsToClose)
    return window.location.href = DataApp.currentUrl;

  Broadcaster.dispatchEvent(Events.FILTER_CHANGED);
};

APP.Filters.prototype.searchHandler = function(event) {
  event.preventDefault();
  this.searchInput.trigger({
    type: 'keypress',
    which: 13,
    keyCode: 13
  });
}

APP.Filters.prototype.featuredHandler = function() {
  if (this.isFeatured)
    DataApp.currentUrl = DataApp.currentUrl.replace('&featured=1', '');
  else
    DataApp.currentUrl = DataApp.currentUrl + '&featured=1';
  this.isFeatured = !this.isFeatured;
  Broadcaster.dispatchEvent(Events.FILTER_CHANGED);
};

APP.Filters.prototype.start = function() {
  $('[data-value=' + this.oldCategory + ']').click();
  $('[data-value=' + this.oldOrder + ']').click();

  this.isInitialized = true;
};

APP.Filters.prototype.filterItemHandler = function(meta, event) {  
  var filterCapitalized = Utils.capitalize(meta);
  var oldFilter = 'old' + filterCapitalized;
  var currentFilter = 'current' + filterCapitalized;

  var current = $(event.currentTarget).find('.am-Filter-option');
  this[currentFilter] = current.attr('data-value');

  $('[data-value=' + this[oldFilter] + ']').parent().removeClass('selected');
  $('[data-value=' + this[currentFilter] + ']').parent().addClass('selected');

  DataApp.currentUrl = DataApp.currentUrl.replace(this[oldFilter], this[currentFilter]);
  this[oldFilter] = this[currentFilter];
  var newValue = $(event.target).attr('data-name');

  Broadcaster.dispatchEvent(Events.FILTER_CHANGED, {
    meta: meta,
    newValue: newValue
  });
};