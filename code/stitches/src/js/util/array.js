define(["wrap/jquery"],
function ($) {

    "use strict";

    return {
        remove: function (array, value) {
            return $(array).filter(function () {
                return this !== value;
            });
        }
    };

});