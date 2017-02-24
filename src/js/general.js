function generalJs() {
  var $win = $(window);
  var $doc = $(document);
  var $winW = function () {
    return $(window).width();
  };
  var $winH = function () {
    return $(window).height();
  };
  var $screensize = function (element) {
    $(element).width($winW()).height($winH());
  };

  var screencheck = function (mediasize) {
    if (typeof window.matchMedia !== "undefined") {
      var screensize = window.matchMedia("(max-width:" + mediasize + "px)");
      if (screensize.matches) {
        return true;
      } else {
        return false;
      }
    } else { // for IE9 and lower browser
      if ($winW() <= mediasize) {
        return true;
      } else {
        return false;
      }
    }
  };

  $doc.ready(function () {
    /*--------------------------------------------------------------------------------------------------------------------------------------*/
    // Remove No-js Class
    $("html").removeClass('no-js').addClass('js');


    /* Get Screen size
     ---------------------------------------------------------------------*/
    $win.on('load', function () {
      $win.on('resize', function () {
        if (!screencheck(567)) {
          $screensize('#mainbanner');
        } else {
          $('#mainbanner').removeAttr('style');
        }

      }).resize();
    });

    /* Get Screen size
     ---------------------------------------------------------------------*/
    $win.on('load', function () {
      $win.on('resize', function () {
        if (screencheck(1920)) {
          $screensize('.analysis-process');
        }
      }).resize();
    });

    /* Menu ICon Append prepend for responsive
     ---------------------------------------------------------------------*/
    $(window).on('resize', function () {
      if (screencheck(1023)) {
        if (!$('#menu').length) {
          $('#mainmenu').prepend('<a href="#" id="menu" class="menulines-button"><span class="menulines"></span> <em>Menu</em></a>');
        }
      } else {
        $("#menu").remove();
      }
    }).resize();

    /*remove class js
     ---------------------------------------------------------------------*/
    $(window).on('resize', function () {
      if (screencheck(767)) {
        $('.tabnav, .tab-container').removeClass('matchheight');
      }
    }).resize();

    /* This adds placeholder support to browsers that wouldn't otherwise support it.
     ---------------------------------------------------------------------*/
    if (document.createElement("input").placeholder === undefined) {
      var active = document.activeElement;
      $(':text').focus(function () {
        if ($(this).attr('placeholder') !== '' && $(this).val() === $(this).attr('placeholder')) {
          $(this).val('').removeClass('hasPlaceholder');
        }
      }).blur(function () {
        if ($(this).attr('placeholder') !== '' && ($(this).val() === '' || $(this).val() === $(this).attr('placeholder'))) {
          $(this).val($(this).attr('placeholder')).addClass('hasPlaceholder');
        }
      });
      $(':text').blur();
      $(active).focus();
      $('form:eq(0)').submit(function () {
        $(':text.hasPlaceholder').val('');
      });
    }


    /* Tab Content box
     ---------------------------------------------------------------------*/
    var tabBlockElement = $('.tab-data');
    $(tabBlockElement).each(function () {
      var $this = $(this),
        tabTrigger = $this.find(".tabnav li"),
        tabContent = $this.find(".tabcontent");
      var textval = [];
      tabTrigger.each(function () {
        textval.push($(this).text());
      });
      $this.find(tabTrigger).first().addClass("active");
      $this.find(tabContent).first().show();


      $(tabTrigger).on('click', function () {
        $(tabTrigger).removeClass("active");
        $(this).addClass("active");
        $(tabContent).hide().removeClass('visible');
        var activeTab = $(this).find("a").attr("data-rel");
        $this.find('#' + activeTab).fadeIn('normal').addClass('visible');

        return false;
      });

      var responsivetabActive = function () {
        if (screencheck(767)) {
          if (!$('.tabMobiletrigger').length) {
            $(tabContent).each(function (index) {
              $(this).before("<h2 class='tabMobiletrigger'>" + textval[index] + "</h2>");
              $this.find('.tabMobiletrigger:first').addClass("rotate");
            });
            $('.tabMobiletrigger').click('click', function () {
              var tabAcoordianData = $(this).next('.tabcontent');
              if ($(tabAcoordianData).is(':visible')) {
                $(this).removeClass('rotate');
                $(tabAcoordianData).slideUp('normal');
                //return false;
              } else {
                $this.find('.tabMobiletrigger').removeClass('rotate');
                $(tabContent).slideUp('normal');
                $(this).addClass('rotate');
                $(tabAcoordianData).not(':animated').slideToggle('normal');
              }
              return false;
            });
          }

        } else {
          $('.tabMobiletrigger').remove();
          $this.find(tabTrigger).removeClass("active").first().addClass('active');
          $this.find(tabContent).hide().first().show();
        }
      };
      $(window).on('resize', function () {
        if (!$this.hasClass('only-tab')) {
          responsivetabActive();
        }
      }).resize();
    });

    /* Accordion box JS
     ---------------------------------------------------------------------*/
    $('.accordion-databox').each(function () {
      var $accordion = $(this),
        $accordionTrigger = $accordion.find('.accordion-trigger'),
        $accordionDatabox = $accordion.find('.accordion-data');

      $accordionTrigger.first().addClass('open');
      $accordionDatabox.first().show();

      $accordionTrigger.on('click', function (e) {
        var $this = $(this);
        var $accordionData = $this.next('.accordion-data');
        if ($accordionData.is($accordionDatabox) && $accordionData.is(':visible')) {
          $this.removeClass('open');
          $accordionData.slideUp(400);
          e.preventDefault();
        } else {
          $accordionTrigger.removeClass('open');
          $this.addClass('open');
          $accordionDatabox.slideUp(400);
          $accordionData.slideDown(400);
        }
      });
    });

    /*banner-slider
     ----------------------------------------------------------------------*/
    if ($('.main-slider').length) {
      $('.main-slider').owlCarousel({
        loop: true,
        nav: false,
        items: 1,
        autoplay: true,
        animateOut: 'fadeOut'
      });
    }

    /* Go to next screen
     ---------------------------------------------------------------------*/
    $('.scroll-down').click(function () {
      var getOffset = $('#main').offset().top;
      $("html:not(:animated),body:not(:animated)").animate({scrollTop: getOffset}, 550);
      return false;
    });

    /*Lightbox
     -------------------------------------------------------------------------*/
    if ($('.venobox').length) {
      $('.venobox').venobox({
        bgcolor: '#000'
      });
    }

    /* MatchHeight Js
     -------------------------------------------------------------------------*/
    if ($('.matchheight').length) {
      $('.matchheight').matchHeight();
    }

    /*Mobile menu click
     ---------------------------------------------------------------------*/
    $(document).on('click', "#menu", function () {
      $(this).toggleClass('menuopen');
      $(this).next('ul').slideToggle('normal');
      return false;
    });


    /*popupbox
     --------------------------------------------------------------------------*/
    /* Popup function
     ---------------------------------------------------------------------*/
    var $dialogTrigger = $('.poptrigger'),
      $pagebody = $('body');
    $dialogTrigger.click(function () {

      // close already opened modals
      if ($(this).parents('.popouterbox')) {
        $(this).parents('.popouterbox').fadeOut(300, function () {
          $(this).find('.modal-backdrop').fadeOut(250, function () {
            $('body').removeClass('overflowhidden');
            $('.popouterbox .popup-block').removeAttr('style');
            $(this).remove();
          });
        });
      }

      var popID = $(this).attr('data-rel');
      $('body').addClass('overflowhidden');
      var winHeight = $(window).height();
      $('#' + popID).fadeIn();
      var popheight = $('#' + popID).find('.popup-block').outerHeight(true);

      if ($('.popup-block').length) {
        var popMargTop = popheight / 2;
        //var popMargLeft = ($('#' + popID).find('.popup-block').width()/2);

        if (winHeight > popheight) {
          $('#' + popID).find('.popup-block').css({
            'margin-top': -popMargTop,
            //'margin-left' : -popMargLeft
          });
        } else {
          $('#' + popID).find('.popup-block').css({
            'top': 0,
            //'margin-left' : -popMargLeft
          });
        }

      }

      $('#' + popID).append("<div class='modal-backdrop'></div>");
      $('.popouterbox .modal-backdrop').fadeTo("slow", 0.70);

      $('.custom-pop-box .modal-backdrop').fadeTo("fast", 0.88);

      if (popheight > winHeight) {
        $('.popouterbox .modal-backdrop').height(popheight);
      }
      $('#' + popID).focus();
      return false;
    });

    $(window).on("resize", function () {
      if ($('.popouterbox').length && $('.popouterbox').is(':visible')) {
        var popheighton = $('.popouterbox .popup-block').height() + 60;
        var winHeight = $(window).height();
        if (popheighton > winHeight) {
          $('.popouterbox .modal-backdrop').height(popheighton);
          $('.popouterbox .popup-block').removeAttr('style').addClass('taller');

        } else {
          $('.popouterbox .modal-backdrop').height('100%');
          $('.popouterbox .popup-block').removeClass('taller');
          $('.popouterbox .popup-block').css({
            'margin-top': -(popheighton / 2)
          });
        }
      }
    });

    //Close popup
    $(document).on('click', '.close-dialogbox, .modal-backdrop, .close-modal', function () {
      $(this).parents('.popouterbox').fadeOut(300, function () {
        $(this).find('.modal-backdrop').fadeOut(250, function () {
          $('body').removeClass('overflowhidden');
          $('.popouterbox .popup-block').removeAttr('style');
          $(this).remove();
        });
      });
      return false;
    });

    /* DataTable
     ----------------------------------------------------------------------*/
    /*if ($('#datatable').length) {
     $('#datatable').DataTable({
     "order": [],
     "aoColumnDefs": [{
     'bSortable': false,
     'aTargets': [0, 5, 6]
     }]
     });
     }*/

    /*--------------------------------------------------------------------------------------------------------------------------------------*/

  });
};
function customFileinput(elt) {
  $(elt).customFileinput({
    buttontext: 'BROWSE'
  });
}
function closePopup(popupSelector) {
  var popup = $(popupSelector);
  if (popup) {
    popup.fadeOut(300, function () {
      $('.modal-backdrop').fadeOut(250, function () {
        $('body').removeClass('overflowhidden');
        $('.popouterbox .popup-block').removeAttr('style');
        popup.hide();
      });
    });
  }
}

function openPopup(popupSelector) {
  var popup = $(popupSelector);
  if (popup) {
    popup.fadeIn(300, function (){
      $('.modal-backdrop').fadeIn(250, function () {
        popup.show();
      });
    });
  }
}
