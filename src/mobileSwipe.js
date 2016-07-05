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

  const 
  touchDevice   = "ontouchstart" in window,
  evtTouchStart = touchDevice ? 'touchstart' : 'mousedown',
  evtTouchMove  = touchDevice ? 'touchmove'  : 'mousemove',
  evtTouchEnd   = touchDevice ? 'touchend'   : 'mouseup';


  var touchEvent = (event) => 
  {
    return touchDevice ? event.touches[0] : event;
  };

  return this.each(function() 
  {

    var   coord  = {};
    const $self  = $(this);
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
              swipe.handle(false);
              
            }  else if (distance.x  > opts.threshold.x)  { 
              swipe.handle(true);
            }
        } 
      },
      end:   () => {
        if (!swipe.listen || !swipe.active) return;

        swipe.listen = false;
        swipe.active = false;
        coord        = {};
      },
      handle:   function(left) 
      {
        swipe.active = true;
        swipe.listen = false;

        if (left == true) opts.swipeLeft();
        else              opts.swipeRight();
      }
    };


    $self      .on(evtTouchStart, swipe.start);
    $self      .on(evtTouchMove,  swipe.move);
    $(document).on(evtTouchEnd,   swipe.end);

    if (touchDevice) {
      $(document).on(evtTouchEnd, swipe.end);
    }

  });

};