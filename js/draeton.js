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

    var Draeton = function () {
        this.init();
    };

    Draeton.prototype = {
        init: function () {
            this.bindHandlers();
            this.initMenu();
        },

        bindHandlers: function () {
            var $search = $(".navbar form");

            // search form
            $search.on("click", "a.add-on", function () {
                $search.submit();
            });

            // tooltips
            if ($.fn.tooltip) {
                $('a[data-toggle="tooltip"]').tooltip();
            }
        },

        initMenu: function () {
            var href = document.location.href;

            $("ul.nav li > a").each(function () {
                if (this.href.replace(/[/#]+$/, "") === href.replace(/[/#]+$/, "")) {
                    $(this).parents("li").addClass("active");
                }
            });
        }
    };

    $(document).ready(function () {
        window.draeton = new Draeton();
    });

})(window, jQuery);