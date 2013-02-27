define(["wrap/jquery"],
function ($) {

    var BaseLayout = function () {};

    BaseLayout.prototype = {
        constructor: BaseLayout,

        getDimensions: function () {},

        placeSprites: function () {},

        intersection: function (sprite, obstacles) {
            var x1, x2, y1, y2;
            var intersections = [];
            var intersection;

            $.map(obstacles, function (obstacle) {
                x1 = (obstacle.x < sprite.x + sprite.width);
                x2 = (obstacle.x + obstacle.width > sprite.x);
                y1 = (obstacle.y < sprite.y + sprite.height);
                y2 = (obstacle.y + obstacle.height > sprite.y);

                if (x1 && x2 && y1 && y2) {
                    intersections.push(obstacle);
                }
            });

            if (intersections.length) {
                intersection = intersections.pop();
            }

            return intersection;
        }
    };

    return BaseLayout;

});