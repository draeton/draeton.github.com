/*!
 * Mandelbrot generator for HTML5 canvas
 * http://draeton.github.com/code/mandelbrot/
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
(function (window) {

    "use strict";

    function Mandelbrot (canvas, options, cwidth, cheight) {
        Mandelbrot.prototype.init.apply(this, arguments);
    }

    window.Mandelbrot = Mandelbrot;

    Mandelbrot._defaults = {
        // axis boundaries
        xmin: -2.5,
        xmax: 1,
        ymin: -1,
        ymax: 1,

        // current zoom
        zoom: 1,

        // scale set to canvas
        xscale : null,
        yscale : null,
        xoffset: null,
        yoffset: null,

        // subset boundary
        K: 2,

        // max iterations
        imax: Math.pow(2, 8),

        // color masks
        /*jshint bitwise: false */
        rmask: (Math.pow(2, 24) - 1) ^ (Math.pow(2, 16) - 1),
        gmask: (Math.pow(2, 16) - 1) ^ (Math.pow(2,  8) - 1),
        bmask: (Math.pow(2,  8) - 1),
        /*jshint bitwise: true */
        cmax : (Math.pow(2, 24) - 1),
        cscale: null
    };

    Mandelbrot.prototype = {
        // settings and calculations
        init: function (canvas, options, cwidth, cheight) {
            this.canvas  = canvas;
            this.cwidth  = canvas.width;
            this.cheight = canvas.height;
            this.context = canvas.getContext('2d');

            // extend settings with options
            this.settings = Object.create(Mandelbrot._defaults);

            if (options || cwidth && cheight) {
                this._update(options, cwidth, cheight);
            }
        },

        // update the settings
        _update: function (options, cwidth, cheight) {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.settings[i] = options[i];
                }
            }

            if (cwidth && cheight) {
                this.canvas.width = this.cwidth = cwidth;
                this.canvas.height = this.cheight = cheight;
            }
        },

        // create the fractal
        generate: function (options, cwidth, cheight) {
            var imageData, pixels;

            if (options || cwidth && cheight) {
                this._update(options, cwidth, cheight);
            }

            imageData = this.context.createImageData(this.cwidth, this.cheight);
            pixels    = imageData.data;

            this._calc();
            this._drawPixels(pixels);
            this.context.putImageData(imageData, 0, 0);
        },

        // calculate dependent variables
        _calc: function () {
            var s = this.settings;
            
            s.xscale  = (s.xmax - s.xmin) / (this.cwidth * s.zoom);
            s.yscale  = (s.ymax - s.ymin) / (this.cheight * s.zoom);
            s.xoffset = s.xmin / s.zoom;
            s.yoffset = s.ymin / s.zoom;
            
            s.cscale = s.cmax / s.imax;
        },

        // draw the fractal on the image data
        _drawPixels: function (pixels) {
            var s = this.settings, x, y, i, rgb, n = 0;

            for (y = 0; y < this.cheight; y += 1) {
                for (x = 0; x < this.cwidth; x += 1) {
                    i = this._getIterations(x, y);
                    rgb = this._getRGB(i);

                    pixels[n]     = rgb.r;
                    pixels[n + 1] = rgb.g;
                    pixels[n + 2] = rgb.b;
                    pixels[n + 3] = 255; // alpha

                    n += 4;
                }
            }
        },

        // get the number of iterations before determining member of set
        _getIterations: function (x0, y0) {
            var s = this.settings, x  = 0, y = 0, i, xtemp;

            x0 = x0 * s.xscale + s.xoffset;
            y0 = y0 * s.yscale + s.yoffset;

            for (i = 0; ((x * x + y * y) < (s.K * s.K)) && i < s.imax; i++) {
                xtemp = x * x - y * y + x0;
                y = 2 * x * y + y0;
                x = xtemp;
            }

            return ((x * x + y * y) < (s.K * s.K)) ? 0 : i;
        },

        // convert iterations to RGB value
        _getRGB: function (i) {
            var s = this.settings, r, g, b;

            i = i * s.cscale;
            /*jshint bitwise: false */
            r = (i & s.rmask) >> 16;
            g = (i & s.gmask) >> 8;
            b = (i & s.bmask) >> 0;
            /*jshint bitwise: true */

            return {r: r, g: g, l: b};
        }
    };

})(window);