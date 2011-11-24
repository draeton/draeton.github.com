/*global jQuery, FlashCanvas*/
(function (window, $) {

     "use strict";

    var document = window.document;

    // configuration variables
    var c = {
        // font size and positioning
        fontsize   : 12,
        lineheight : 15,
        font       : "12px Courier",
        baseline   : "top",

        // font colors
        linecolor  : "blue",
        codecolor  : "black",

        // text start position
        top        : 10,
        left       : 10,
        indent     : 20,

        // canvas width
        width      : 600,

        // lines to remove from code before drawing
        check      : new RegExp("^--remove this line--")
    };

    // method holder
    var f = {
        // drawing canvas, context, and code
        canvas: null,
        context: null,
        code: null,

        // decode the base64 encoded code
        // get the code text as an array of lines
        // filter out the garbage lines
        "getCode": function (text, className) {
            if (/base64/.test(className)) {
                text = decodeURIComponent(text);
            }

            var code = $.trim(text).split(/\n/);

            return $(code).filter(function (i, line) {
                return !c.check.test(line);
            });
        },

        // create the canvas element with height for the # of lines
        // FlashCanvas for IE support
        "getCanvas": function (code) {
            var canvas = document.createElement("canvas");
            canvas.width = c.width;
            canvas.height = code.length * c.lineheight + c.top * 2;
            canvas.style.width = canvas.width + "px";
            canvas.style.height = canvas.height + "px";

            if (typeof FlashCanvas !== "undefined") {
                FlashCanvas.initElement(canvas);
            }

            return canvas;
        },

        // write a piece of text to the canvas
        "writeText": function (text, x, y, color, align) {
            f.context.font         = c.font;
            f.context.textAlign    = align || "left";
            f.context.textBaseline = c.baseline;
            f.context.fillStyle    = color;
            f.context.fillText(text, x, y);
        },

        "writeTextRight": function (text, x, y, color) {
            f.writeText(text, x, y, color, "right");
        },

        // write the line number
        // write the code
        "writeLine": function (i, line) {
            if (i % 2) {
                // draw an alternating background
                f.context.fillStyle   = 'LightCyan';
                f.context.fillRect(0, i * c.lineheight + c.top, c.width, c.lineheight);
            }

            f.writeTextRight(i + 1, c.indent, i * c.lineheight + c.top, c.linecolor);
            f.writeText(line, c.left + c.indent, i * c.lineheight + c.top, c.codecolor);
        },

        // parse the code from the pre element
        // place and get the canvas
        // get the drawing context
        "replaceCodeBlock": function () {
            f.code = f.getCode(this.innerText, this.className);
            c.indent = 12 * (f.code.length + "").length;
            f.canvas = f.getCanvas(f.code);
            $(this).after(f.canvas);
            f.context = f.canvas.getContext("2d");
            $(f.code).each(f.writeLine);
        }
    };

    // on dom ready, replace each pre with canvas
    $(function () {
        $("pre").each(f.replaceCodeBlock).remove();
    });

})(window, jQuery);


function canvasReady() {
  draw(document.getElementById('canvas').getContext('2d'));
}
function draw(ctx) {
  var w = 500, h = 800;
  var fillText = "fillText";

  grid(ctx, w, h, 10, 5, "SkyBlue", "steelblue");

  ctx.fillStyle     = "blue";
  ctx.textBaseline  = "top";

  var i = 0, v, dim, txt,
      ary = [6,7,8,9,10,11,12,14,16,18,20,24,28,32,36,40,48,58,64,72,84],
      iz = ary.length;
  for (; i < iz; ++i) {
    v = ary[i];
    txt = v + "pt;" + fillText;
    ctx.font = v + "pt Arial";
    ctx.fillText(txt, 10, i * 35 + 10);
  }
}
function grid(ctx, w, h, size, unit, color, color2) {
  var x, y, i, j;
  for (i = 0, x = size; x < w; ++i, x += size) {
    ctx.beginPath();
    ctx.strokeStyle = (i % unit) ? color : color2;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.closePath();
  }
  for (j = 0, y = size; y < h; ++j, y += size) {
    ctx.beginPath();
    ctx.strokeStyle = (j % unit) ? color : color2;
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
    ctx.closePath();
  }
}

