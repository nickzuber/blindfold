'use strict';

/** The amount of checks we'll perform trying to find the target node */
const ERROR_BUFFER = 10;

/** The time between target node checks, in milliseconds */
const RETRY_TIMING = 250;

/**
 * Actually hides the content from LeetCode that we don't want to see.
 * @param  {void}
 * @return {void}
 */
function hideContent () {
  // Hide acceptance
  $('tbody.reactable-data td:nth-child(5)').each((index, obj) => {
      $(obj).css('opacity', '0');
  });

  // Hide difficulty
  $('tbody.reactable-data td:nth-child(6)').each((index, obj) => {
      $(obj).css('opacity', '0');
  });

  // Hide question stats while on the problem's page
  $('.question-info').hide();
}

$(function () {
  // Thanks vsync for figuring out this MutationObserver module so I didn't have to
  //   http://stackoverflow.com/a/14570614/5055063

  // Track any changes to the DOM to keep the content hidden
  var observeDOM = (function (){
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
          eventListenerSupported = window.addEventListener;

      return function (obj, callback){
          if( MutationObserver ){
              // Define a new observer
              var obs = new MutationObserver(function(mutations, observer){
                  if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                      callback();
              });
              // Have the observer observe foo for changes in children
              obs.observe( obj, { childList:true, subtree:true });
          }
          else if( eventListenerSupported ){
              obj.addEventListener('DOMNodeInserted', callback, false);
              obj.addEventListener('DOMNodeRemoved', callback, false);
          }
      }
  })();

  // Track the number of attempts
  var attempts = 0;

  // Target the body to check for changes
  var targetNode = document.querySelector('body');

  // Attempt to hide
  var attemptToHide = function () {
    ++attempts;
    try {
      if (targetNode) {
        console.log('%cBlindfold: %cHiding info...', 'color: #EB3349', 'color: #9CAFBE');
        hideContent();
      }
      observeDOM(targetNode, function (){
          console.log('%cBlindfold: %cNoticed an update in the DOM, rehiding info...', 'color: #EB3349', 'color: #9CAFBE');
          hideContent();
      });
    } catch (e) {
      hideContent();
      console.log(`%cBlindfold: %cUnable to detect target node, trying again in ${RETRY_TIMING / 1000} seconds...`, 'color: #EB3349', 'color: #9CAFBE');
      setTimeout(() => {
        if (attempts < ERROR_BUFFER) {
          attemptToHide();
        } else {
          console.log(`%cBlindfold: %cUnable to detect target node ${ERROR_BUFFER} times, giving up.`, 'color: #EB3349', 'color: #9CAFBE');
        }
      }, RETRY_TIMING);
    }
  }

  attemptToHide();

});
