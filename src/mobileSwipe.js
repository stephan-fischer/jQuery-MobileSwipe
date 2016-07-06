"use strict";

/*
  jquery.mrfischer.mobile.js
  Created by Stephan Fischer <stephan@mrfischer.de>
  Copyright 2016 Stephan Fischer - MrFischer Web-Development. All rights reserved.
*/
 
$.fn.MobileSwipe =  function(options)
{

  if (!this) return false;

  var defaults = 
  {
      threshold: 
      {
        x: 50, 
        y: 20
      },
      swipeLeft:  () => {},
      swipeRight: () => {},
      preventEvents: true
  };

  var opts = $.extend({}, defaults, options);

  const events = {
    touch: {
      start:   'touchstart',
      move:    'touchmove',
      end:     'touchend',
      cancel : 'touchcancel'
    },
    desktop: {
      start:   'mousedown',
      move:    'mousemove',
      end:     'mouseup'
    },
    msPointer: {
      start:   'MSPointerDown',
      move:    'MSPointerMove',
      end:     'MSPointerUp'
    },
    pointer: {
      start:   'pointerdown',
      move:    'pointermove',
      end:     'pointerup'
    }
  };

  const 
  SUPPORTS_TOUCH        = 'ontouchstart' in window,
  SUPPORTS_MS_POINTER   = window.navigator.msPointerEnabled,
  SUPPORTS_POINTER      = window.PointerEvent;

  events.used = events.desktop;

  if (SUPPORTS_TOUCH)        events.used = events.touch;
  if (SUPPORTS_POINTER)      events.used = events.pointer;
  if (SUPPORTS_MS_POINTER)   events.used = events.msPointer;


  var touchEvent = (event) => 
  {
    return SUPPORTS_TOUCH ? event.touches[0] : event;
  };

  return this.each(function() 
  {

    var   coord  = {};
    const $self  = $(this);
    const self   = this;
    const swipe  = 
    {
      listen: false, // param if touch started and not ended
      active: false, // param if slide is detected and touch not stopped
      start: (event) => {

        if (swipe.active && opts.preventEvents) event.preventDefault();
        if (swipe.listen) return;

        var touch      = touchEvent(event);    
        coord          = { x: touch.pageX, y: touch.pageY};  
        swipe.listen   = true;

      },
      move:  (event) => {

        if (swipe.active && opts.preventEvents) event.preventDefault();
        if (!swipe.listen) return;

        var touch     = touchEvent(event); 
        var distance  = 
        {
          x: touch.pageX - coord.x,
          y: touch.pageY - coord.y 
        };

        if (Math.abs(distance.y) <= opts.threshold.y) {
            if (distance.x       <  -opts.threshold.x)  { 
              swipe.handle(false, distance);
              
            }  else if (distance.x  > opts.threshold.x)  { 
              swipe.handle(true, distance);
            }
        } 
      },
      end:   () => {
        swipe.listen = false;
        swipe.active = false;
        coord        = {};
      },
      handle:   function(left, distance) 
      {
        swipe.active = true;
        swipe.listen = false;

        if (left == true) opts.swipeLeft .apply(self, [distance]);
        else              opts.swipeRight.apply(self, [distance]);
      }
    };


    $self      .on(events.used.start, swipe.start);
    $self      .on(events.used.move,  swipe.move);
    $(document).on(events.used.end,   swipe.end);

    if (events.used.cancel) {
      $(document).on(events.used.cancel, swipe.end);
    }

  });

};