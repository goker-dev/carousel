/*
 * jQuery carousel plugin
 * Version: 1.2.0 
 * Date (d/m/y): 02/09/12
 * Original author: @gokercebeci 
 * Licensed under the MIT license
 * Demo: http://gokercebeci.com/dev/carousel
 */

(function ( $, window, document, undefined ) {

    var pluginName = 'carousel',
    methods = {
        animate : function($this, direction, to, isDone){
            var finish = this.finish;
            var duration = isDone ? 200 : 800;
            $this.wagon.animate({
                'left': to +'px' 
            }, duration, 'carousel', function(){
                if(isDone){
                    $this.wagon.animate({
                        'left': direction == 'right' ? -$this.way: 0 
                    }, duration, 'carousel', function(){
                        $this.animating = false;
                        finish($this);
                    });
                } else {
                    $this.animating = false;
                    finish($this);
                }
            });
        }
    },
    defaults = {
        init    : function(){},
        start   : function(){},
        finish  : function(){},
        error   : function(){},
        autoplay: false,
        animate : methods.animate,
        click   : methods.click,
        menu    : ['play','pause','left','right']
    };
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            this.options.init(this);
            var $this =  this;
            var el =  $(this.element);
            this.animating = false;
            this.set();
            // Events
            el.find('.carousel-right').click(function(){
                $this.pause();
                $this.right();
            });
            el.find('.carousel-left').click(function(){
                $this.pause();
                $this.left();
            });
            this.items.click(function(e){
                $this.click(e,this);
            });
            // for Media Queries & Mobile Devices
            $(document).resize(function(){
                $this.set();
            });
            // context menu
            this.contextmenu(el);
            // CUSTOM EASING
            $.easing.carousel = function(x, t, b, c, d){
                return c*((t=t/d-1)*t*t + 1) + b;
            }
            if(this.options.autoplay){
                this.play();
            }
        }, 
        set: function() {
            var el =  $(this.element);
            this.rail      = el.find('.carousel-rail');
            this.wagon     = el.find('.carousel-wagon');
            this.items     = el.find('.carousel-item');
            this.step      = this.items.outerWidth(1);
            var h = 0;
            this.items.each(function(){
                h = h > $(this).height() ? h : $(this).height()
            });
            this.items.find('article').height(h);
            h = this.items.height();
            this.rail.height(h);
            el.height(h);
            this.wagon.css({
                left  : 0,
                width : (this.items.length * this.step),
                height: h
            });
            this.way       = this.wagon.width() - this.rail.width();  
        }, 
        left: function() {
            if(!this.animating){
                this.animating = true;
                if(parseInt(this.wagon.css('left')) < 0)
                    this.animate('left', (parseInt(this.wagon.css('left')) +this.step));
                else 
                    this.animate('left', 20, true);
            }
        },
        right: function() {
            if(!this.animating){
                this.animating = true;
                if(parseInt(this.wagon.css('left')) *-1 < this.way)
                    this.animate('right', parseInt(this.wagon.css('left')) -this.step);
                else if(this.options.autoplay)
                    this.animate('left', 0)
                else
                    this.animate('right', -this.way -20, true);
            }
        }, 
        animate: function(direction, to, isDone){
            this.options.start(this);
            this.options.animate(this, direction, to, isDone);
        }, 
        click: function(e, el){
            this.options.click(this, e, el);
        }, 
        play: function(){
            if(this.timer){
                clearTimeout(this.timer);
            }
            this.right(this);
            this.options.autoplay = true;
            this.timer = setTimeout($.proxy(this.play, this), 2000);
        }, 
        pause: function(){
            if(this.timer){
                clearTimeout(this.timer);
            }
            this.options.autoplay = false;
        }, 
        contextmenu: function() {
            var $this = this;
            $(this.element).bind({
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
                        // play & pause
                        $('<a>').click(function(){
                            if($this.options.autoplay){
                                $this.pause();
                                $(this).html($this.options.menu[0]);
                            } else {
                                $this.play();
                                $(this).html($this.options.menu[1]);
                            }
                        })
                        .html($this.options.menu[$this.options.autoplay ? 1 : 0]).appendTo(c);
                        // left
                        $('<a>').click(function(){
                            $this.left();
                        })
                        .html($this.options.menu[2]).appendTo(c);
                        // right
                        $('<a>').click(function(){
                            $this.right();
                        })
                        .html($this.options.menu[3]).appendTo(c);
                        $('<a>',{
                            'href':'http://gokercebeci.com/dev/carousel'
                        })
                        .html('carousel v1.1.1').appendTo(c);
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
        }
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );
