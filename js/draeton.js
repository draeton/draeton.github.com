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
            this.initSearch();
        },

        bindHandlers: function () {
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
        },

        initSearch: function () {
            var sregex = /[?|&]gsc=([^&]+)/,
                search = document.location.search,
                $input = $("input.gsc-input"),
                matches = search.match(sregex);

            if (matches) {
                $input.focus().val(matches[1]).parents("form").submit();
            }
        }
    };

    var draeton = window.draeton = new Draeton();

})(window, jQuery);