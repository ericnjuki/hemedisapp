$(function(){
    'use strict';

    // enxtend verge (viewport reader, docs: https://github.com/ryanve/verge) to jquery
    $.extend(verge);
    // handle layout
    var initVisibilityElms = function(){
        // detect viewport with verge
        var viewport = $.viewportW();

        // large desktop
        if( viewport >= 1680 ){
            // action on large desktop
            if ($('.content-aside').length > 0) {
                $('.content-main').addClass('content-main-md');
            }
            $('.content-aside').addClass('open');
        }
        else{
            // callback
            $('.content-main').removeClass('content-main-md');
            $('.content-aside').removeClass('open');
        }

        // tablet viewport and less
        if( viewport <= 768){
            // close sidebar
            $('.content').addClass('content-lg');
        }
    }
    initVisibilityElms();       // init visibility elements on load
    // handle visibility elements on window resize
    $(window).on('resize', function() {
        // fixed mode type on tablet and phone
        var on_type = $('#smart-search').find('input').is(':focus');

        if (!on_type) {
            initVisibilityElms();   // handle visibility elements on window resize
        }
    });



    /**
     * Side left Menu rule
     */
    $('.side-nav-child').prev().on('click', function(e){
        e.preventDefault();

        var $this = $(this),
            target = $this.attr('href');

        $(target).addClass('open');
    });
    $('.side-nav-back').on('click', function(e){
        e.preventDefault();
        var $this = $(this),
            target = $this.parent().parent();

        $(target).removeClass('open');
    });


    // toggle content
    $('#toggle-content').on('click', function(e){
        e.preventDefault();

        var content = $('#content');

        content.toggleClass('content-lg');
    });


    // toggle search
    $('#toggle-search').on('click', function(e){
        e.preventDefault();

        var headerComponents = $('.content-header .header-actions, .content-title'),
            form_search = $('#smart-search');

        headerComponents.addClass('hide');
        form_search.fadeIn(300, function () {
            $(this).find('input').focus().val('');
        })
        $(this).toggleClass('active');
    });


    /**
     * Search UI theme on side left rule
     * @type {[type]}
     */
    $('#smart-search > .form-control').on('focusout', function(e){
        var headerComponents = $('.content-header .header-actions, .content-title'),
            form_search = $('#smart-search');

        form_search.fadeOut(300, function () {
            headerComponents.removeClass('hide');
        });
    });
});