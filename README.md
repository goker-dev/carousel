Carousel
========

**carousel** is a **jQuery** plug-in for image sliding.

### It has:
 *  Auto sliding
 *  Customizable animations/effects
 *  Context menu (right click) control
 
You can change animations/effects with plugin options easily.
Carousel reads all dimension values from CSS and the plug-in's options doesn't have any dimension values.

### Tested on: 
 *  Chromium (14.0.835.202)
 *  Google Chrome (15.0.874.120)
 *  Mozilla Firefox (3.6.17)
 *  Opera (11.52) 
 *  Internet Explorer (8.0.6001)

Usage
-----

    <div class="carousel">
        <div class="carousel-rail">
            <div class="carousel-wagon">
                <div class="carousel-item">
                    [YOUR CONTENT 1]
                </div>
                <div class="carousel-item">
                    [YOUR CONTENT 2]
                </div>
            </div>
        </div>
    </div>
    <script src="/data/dev/carousel/carousel.js"></script>
    <link rel="stylesheet" href="/data/dev/carousel/carousel.css" />
    <script>
        $('.carousel').carousel([options]);
    </script>

Options
-------

    init    : function(){}, // Optional init function.
    start   : function(){}, // Optional start function.
    finish  : function(){}, // Optional finish function. 
    error   : function(){}, // Optional error function.
    autoplay: false,        // default false.
    animate : methods.animate, // Optional animate function.
    click   : methods.click,   // Optional click function.
    menu    : ['play','pause','left','right'] // context menu labels

Animations
----------

    $.easing.custom = function(m, t, b, c, d){
        if ((t/=d) < (1/2.75)){
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)){
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)){
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    }
    $('.custom-carousel').carousel({
        animate : function(carousel, direction, to, isDone){
            $this = this;
            $this.start(carousel);
            var speed = isDone ? 200 : 800;
            carousel.wagon.animate({
                'left': [to +'px', 'custom'] 
            }, speed, function(){
                if(isDone){
                    carousel.wagon.animate({
                        'left': direction == 'right' ? -carousel.way: 0 
                    }, speed, function(){
                        carousel.animating = false;
                        $this.finish(carousel);
                    });
                } else {
                    carousel.animating = false;
                    $this.finish(carousel);
                }
            });
        }
    });

License
-------
It is under [MIT License](https://github.com/gokercebeci/carousel/blob/master/LICENSE.md "MIT License").

Developer
---------
[goker](http://gokercebeci.com/ "goker")
