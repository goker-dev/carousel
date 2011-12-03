/* carousel 1.1.0 */
(function($){
    // Methods
    var methods = {
        init    : function(element, options){
            var $this = this;
            // Bind options
            var carousel =  $.extend(element, options);
            carousel.init();
            carousel.animating = false;
            $this.set(carousel);
            // Events
            carousel.find('.carousel-right').click(function(){
                $this.left(carousel);
            });
            carousel.find('.carousel-left').click(function(){
                $this.right(carousel);
            });
            carousel.items.click(function(){
                carousel.click($(this));
            });
            // for Media Queries & Mobile Devices
            $(document).resize(function(){
                $this.set(carousel);
            });
            // context menu
            $this.contextmenu(carousel);
            // CUSTOM EASING
            $.easing.carousel = function(x, t, b, c, d){
                return c*((t=t/d-1)*t*t + 1) + b;
            }
            return false;
        },
        contextmenu: function(carousel){
            var $this = this;
            carousel.bind({
                'contextmenu':function(e){
                    if(!e.ctrlKey){
                        e.preventDefault();
                        $('#contextmenu').remove();
                        var c = $('<div id="contextmenu">')
                        .css({
                            position : 'absolute',
                            display  : 'none',
                            'z-index': '10000'
                        })   
                        .appendTo($('body'));
                        $('<a>').click(function(){
                            $this.left(carousel);
                        })
                        .html(carousel.menu[0]).appendTo(c);
                        $('<a>').click(function(){
                            $this.right(carousel);
                        })
                        .html(carousel.menu[1]).appendTo(c);
                        $('<a>',{
                            'href':'http://gokercebeci.com/dev/carousel'
                        })
                        .html('carousel v1.1.0').appendTo(c);
                        // Set position
                        var ww = $(document).width();
                        var wh = $(document).height();
                        var w = c.outerWidth(1);
                        var h = c.outerHeight(1);
                        var x = e.pageX > (ww - w) ? ww : e.pageX;
                        var y = e.pageY > (wh - h) ? wh : e.pageY;
                        c.css({
                            display : 'block',
                            top     : y,
                            left    : x
                        });
                    }
                }
            });
            $(document)
            .click(function(){
                $('#contextmenu').remove();
            })
            .keydown(function(e) {
                if ( e.keyCode == 27 ){
                    $('#contextmenu').remove();
                }
            })
            .scroll(function(){
                $('#contextmenu').remove();
            })
            .resize(function(){
                $('#contextmenu').remove();
            });
        },
        set     : function(carousel){
            carousel.rail      = carousel.find('.carousel-rail');
            carousel.wagon     = carousel.find('.carousel-wagon');
            carousel.items     = carousel.find('.carousel-item');
            carousel.step      = carousel.items.outerWidth(1);
            carousel.wagon.css({
                left : 0,
                width: (carousel.items.length * carousel.step)
            });
            carousel.way       = carousel.wagon.width() - carousel.rail.width();  
        },
        left     : function(carousel){
            if(!carousel.animating){
                carousel.animating = true;
                if(parseInt(carousel.wagon.css('left')) < 0)
                    carousel.animate(carousel, 'left', (parseInt(carousel.wagon.css('left')) +carousel.step));
                else 
                    carousel.animate(carousel, 'left', 20, true);
            }
        },
        right    : function(carousel){
            if(!carousel.animating){
                carousel.animating = true;
                if(parseInt(carousel.wagon.css('left')) *-1 < carousel.way)
                    carousel.animate(carousel, 'right', parseInt(carousel.wagon.css('left')) -carousel.step);
                else
                    carousel.animate(carousel, 'right', -carousel.way -20, true);
            }
        },
        start   : function(carousel){
            carousel.start(carousel);
            return;
        },
        finish  : function(carousel){
            carousel.finish(carousel);
            return;
        },
        error   : function(carousel){
            carousel.error(carousel);
            return;
        },
        animate : function(carousel, direction, to, isDone){
            var $this = this;
            $this.start(carousel);
            var duration = isDone ? 200 : 800;
            carousel.wagon.animate({
                'left': to +'px' 
            }, duration, 'carousel', function(){
                if(isDone){
                    carousel.wagon.animate({
                        'left': direction == 'right' ? -carousel.way: 0 
                    }, duration, 'carousel', function(){
                        carousel.animating = false;
                        $this.finish(carousel);
                    });
                } else {
                    carousel.animating = false;
                    $this.finish(carousel);
                }
            });
        },
        click   : function(item){
        }
    };
    $.fn.carousel = function(options) {
        options = $.extend({
            init    : function(){},
            start   : function(){},
            finish  : function(){},
            error   : function(){},
            animate : methods.animate,
            click   : methods.click,
            menu    : ['left','right']
        }, options);
        this.each(function(){
            methods.init($(this), options);
        });
    };
})(jQuery);