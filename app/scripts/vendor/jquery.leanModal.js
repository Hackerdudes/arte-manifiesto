(function($) {

  $.fn.extend({

    leanModal: function(options) {

      var defaults = {
        top: 100,
        overlay: 0.5,
        closeButton: null
      }

      var overlay = $("<div id='lean_overlay'></div>");

      $("body").append(overlay);

      options = $.extend(defaults, options);

      return this.each(function() {

        var o = options;

        $(this).click(function(e) {

          var modal_id = $(this).attr("href");

          // console.log('holi!')
          $('html').css('overflow', 'hidden')

          $("#lean_overlay").click(function() {
            close_modal(modal_id);
          });

          $(o.closeButton).click(function() {
            close_modal(modal_id);
          });

          var modal_height = $(modal_id).outerHeight();
          var modal_width = $(modal_id).outerWidth();

          $('#lean_overlay').css({
            'display': 'block',
            opacity: 0
          });

          $('#lean_overlay').fadeTo(200, o.overlay);

          $(modal_id).css({

            'display': 'block',
            'position': 'fixed',
            'opacity': 0,
            'z-index': 11000,
            'left': 50 + '%',
            'transform': 'translateX(-50%)',
            // 'margin-left' : -(modal_width/2) + "px",
            // 'margin': 'auto',
            // 'width': 100 + '%',
            'top': o.top + "px"

          });

          $(modal_id).fadeTo(200, 1);

          e.preventDefault();

        });

      });

      function close_modal(modal_id) {

        $("#lean_overlay").fadeOut(200);

        $('html').css('overflow', 'auto')


        $(modal_id).css({
          'display': 'none'
        });

      }

    }
  });

})(jQuery);