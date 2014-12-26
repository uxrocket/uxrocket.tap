/**
 * UX Rocket
 * Hover/Tap transformation for touch screens
 * @author Bilal Cinarli
 */

;
(function($) {
    var ux, // local shorthand

        defaults = {
            // callbacks
            onReady: false,
            onTap  : false
        };

    // Constructor Method
    var Tap = function(el, options) {
        var $el = $(el),
            opts = $.extend({}, defaults, options, $el.data());

        // call onReady function if any
        callback(opts.onReady);

        // bind the ui interactions
        bindUIActions($el, opts);
    };

    // event bindings
    var bindUIActions = function($el, opts) {
        var tapped = false,
            scrollT,
            scrollL;

        $el.on('click', function(e) {
            var $this = $(this);

            if($this[0] !== tapped[0]) {
                e.preventDefault();
                callback(opts.onTap);
                tapped = $this;
            }
        });

        $(document)
            .on('touchstart pointerdown MSPointerDown', function(e) {
                scrollT = checkPosition('top');
                scrollL = checkPosition('left');
            })
            .on('touchend pointerup MSPointerUp', function(e) {
                if(Math.abs(checkPosition('top') - scrollT) > 20 || Math.abs(checkPosition('left') - scrollL) > 20) {
                    return;
                }
            })
            .on('click', function(e) {
                var clearTapped = true,
                    parents = $(e.target).parents();

                for(var i = 0; i < parents.length; i++) {
                    if(parents[i] == tapped[0]) {
                        clearTapped = false;
                    }
                }

                if(clearTapped) {
                    tapped = false;
                }
            });
    };

    var checkPosition = function(position) {
        if(position == 'top') {
            return document.body.scrollTop;
        }

        return document.body.scrollLeft;
    };

    // global callback
    var callback = function(fn) {
        // if callback string is function call it directly
        if(typeof fn === 'function') {
            fn.apply(this);
        }

        // if callback defined via data-attribute, call it via new Function
        else {
            if(fn !== false) {
                var func = new Function('return' + fn);
                func();
            }
        }
    };

    // touch checks
    var is_touchEnabled = function() {
        if(!( 'ontouchstart' in window ) && !navigator.msMaxTouchPoints && !navigator.userAgent.toLowerCase().match(/windows phone os 7/i)) {
            return false;
        }

        return true;
    };

    // jQuery binding
    ux = $.fn.tap = $.uxtap = function(options) {
        return this.each(function() {
            var $el = $(this),
                tap;

            if($el.hasClass('uxitd-tap-ready') || !is_touchEnabled()) {
                return;
            }

            $el.addClass('uxitd-tap-ready');

            tap = new Tap(this, options);
        });
    };

    // version
    ux.version = "0.2.0";

    // settings
    ux.settings = defaults;
})(jQuery);
