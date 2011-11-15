(function($){
    // Methods
    var methods = {
        init    : function(element, options){
            $this = this;
            // Bind options
            var carousel =  $.extend(element, options);
            carousel.init();
            carousel.animating = false;
            $this.set(carousel);
            // Events
            carousel.find('.carousel-right').click(function(){
                if(!carousel.animating){
                    carousel.animating = true;
                    if(parseInt(carousel.wagon.css('left')) *-1 < carousel.way)
                        carousel.animate(carousel, 'right', parseInt(carousel.wagon.css('left')) -carousel.step);
                    else
                        carousel.animate(carousel, 'right', -carousel.way -20, true);
                }
            });
            carousel.find('.carousel-left').click(function(){
                if(!carousel.animating){
                    carousel.animating = true;
                    if(parseInt(carousel.wagon.css('left')) < 0)
                        carousel.animate(carousel, 'left', (parseInt(carousel.wagon.css('left')) +carousel.step));
                    else 
                        carousel.animate(carousel, 'left', 20, true);
                }
            });
            carousel.items.click(function(){
                carousel.click($(this));
            });
            // for Media Queries & Mobile Devices
            $(document).resize(function(){
                $this.set(carousel);
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
            $this = this;
            $this.start(carousel);
            var duration = isDone ? 200 : 800;
            carousel.wagon.animate({
                'left': to +'px' 
            }, duration, function(){
                if(isDone){
                    carousel.wagon.animate({
                        'left': direction == 'right' ? -carousel.way: 0 
                    }, duration, function(){
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
            click   : methods.click
        }, options);
        this.each(function(){
            methods.init($(this), options);
        });
    };
})(jQuery);