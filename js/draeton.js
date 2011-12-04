// ## draeton.github.com
// 
// Site code for my personal site
// [http://draeton.github.com/draeton.github.com](http://draeton.github.com/draeton.github.com)
//
// Copyright 2011, Matthew Cobbs  
// Licensed under the MIT license.
//
/*global jQuery*/
(function (window, $) {
    
    var document = window.document;
    
    window.Draeton = (function () {
        
        function init () {
            menuInit();
            searchInit();
        }
        
        function menuInit () {
            var href = document.location.href;
            
            $("nav li > a").each(function () {
                if (this.href.indexOf(href) !== -1) {
                    $(this).parents("li").addClass("active");
                }
            });            
        }
        
        function searchInit () {
            var sregex = /[?|&]gsc=([^&]+)/,
                search = document.location.search,
                $input = $("input.gsc-input"),
                matches = search.match(sregex);

            if (matches) {
                $input.focus().val(matches[1]).parents("form").submit();
            }   
        }
        
        return {
            init: init
        }
        
    })();
    
    $(Draeton.init);
    
})(window, jQuery);