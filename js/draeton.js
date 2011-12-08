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
            initMenu();
            initSearch();
            bindHandlers();
        }
        
        function initMenu () {
            var href = document.location.href;
            
            $("nav li > a").each(function () {
                if (this.href.replace(/[/#]+$/, "") === href.replace(/[/#]+$/, "")) {
                    $(this).parents("li").addClass("active");
                }
            });            
        }
        
        function initSearch () {
            var sregex = /[?|&]gsc=([^&]+)/,
                search = document.location.search,
                $input = $("input.gsc-input"),
                matches = search.match(sregex);

            if (matches) {
                $input.focus().val(matches[1]).parents("form").submit();
            }   
        }
        
        function bindHandlers () {
            if ($.fn.twipsy) {
                $("a[rel=twipsy]").twipsy({live: true});
            }
        }
        
        return {
            init: init
        }
        
    })();
    
    $(Draeton.init);
    
})(window, jQuery);