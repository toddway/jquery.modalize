/*
 * Modalize.js is a lightweight, pure-javascript approach to automatically turn part of any web page into a modal overlay.  
 *
 * It was originally designed as a simple alternative for associating file upload fields to WYSIWYGs in Drupal, but can be used to modalize any chunk of HTML on any page (Drupal or non-Drupal) and significantly clean up overloaded pages. 
 */

(function ($) {
    //examples...
    $(function(){
        $.modalize('#edit-field-image-attachments', '+ Attach images', '.field-type-text-with-summary');
        $.modalize('#edit-field-file-attachments', '+ Attach files', '.field-type-text-with-summary');
    });

    $.extend({
        modalize: function(selectorToModalize, openModalLabel, selectorToPrepend) {
            $(selectorToModalize).each(function() {
                //wrap this for modal
                var $modal = $(this)
                    .wrap('<div class="modalize-wrap modalize-closed" id="' + this.id + '-wrap"/>')
                    .addClass('modalize-field');

                //build close link   
                $(document.createElement("a"))
                    .attr('href', '#')
                    .addClass('modalize-close')
                    .html('&times;')
                    .click(function(e) {
                       $('.modalize-active').removeClass('modalize-active');
                    })
                    .prependTo($modal);

                //build open link
                var linktext = openModalLabel ? openModalLabel : $('legend', $modal).text();
                var $openLink = $(document.createElement("a"))
                    .attr('href', '#')
                    .addClass('modalize-open')
                    .html(linktext)
                    .click(function(e) {
                      $($modal).parent().addClass('modalize-active');
                    });

                if (selectorToPrepend) {
                    $(selectorToPrepend).addClass('modalize-attached');
                    $openLink
                        .addClass('modalize-open-right')
                        .prependTo(selectorToPrepend);
                }
                else {
                    $modal.parent().before($openLink);
                }            
            });
        }
    });

    //add modalize styles
    $(document.createElement("style"))
       .append('.modalize-closed {display:none}')
       .append('.modalize-active {display:block;background-color: rgba(0, 0, 0, .8);opacity: 1;width: 100%;height: 100%;position: fixed;top: 0;left: 0;z-index:9998;overflow-y:auto;}')
       .append('.modalize-close {display:none}')
       .append('.modalize-active .modalize-close {display:block;float:right;padding:0px 10px 0 0;color:#999;font-weight:bold;font-size:20px}')
       .append('.modalize-active fieldset.form-wrapper {border:none}')
       .append('.modalize-open-right {float:right;padding:0 10px 0 0}')
       .append('.modalize-field {background:#fff;margin:100px auto;max-width:700px;padding:20px}')   
       .append('.modalize-attached .form-item {padding:0}')
       .appendTo('head');

    //Insert module integration: close modalize modal when insert button is clicked
    Drupal.behaviors.modalize = {
        attach: function (context, settings) {
            $('.insert-button', context).click(function() {
                $('.modalize-active').removeClass('modalize-active');
            });
        }
    }

    //this isnt't really modal related, it's file field related, but file fields are what we usually put in modals.
    //i'm not sure where else this fits, and why wouldn't you want to simpify this?
    Drupal.behaviors.autoUpload = {
      //hide upload button on file uploads - do it automatically
      //this might belong in a different module
      attach: function(context, settings) {
        $('.form-item input.form-submit[value=Upload]', context).hide();
        $('.form-item input.form-file', context).change(function() {
          $parent = $(this).closest('.form-item');

          //setTimeout to allow for validation
          //would prefer an event, but there isn't one
          setTimeout(function() {
            if(!$('.error', $parent).length) {
              $('input.form-submit[value=Upload]', $parent).mousedown();
            }
          }, 100);
        });
      }
    };

}(jQuery));

