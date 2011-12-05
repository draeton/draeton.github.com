/*!
 * Fractals generator for HTML5 canvas
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
        zoom: 1.2,

        // scale set to canvas
        scale : null,
        xoffset: null,
        yoffset: null,

        // subset boundary
        K: 2,

        // max iterations
        imax: 0xFF,
        
        // granularity
        grain: 1
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

            this._setVars();
            this._setPixels(pixels);
            this.context.rotate(Math.PI*2/6);
            this.context.putImageData(imageData, 0, 0);
        },

        // calculate dependent variables
        _setVars: function () {
            var s = this.settings;
            
            s.scale  = (s.xmax - s.xmin) / (this.cwidth * s.zoom);
            s.xoffset = s.xmin / s.zoom;
            s.yoffset = s.ymin / s.zoom;
            
            s.cscale = s.maxbits / s.imax;
        },

        // draw the fractal on the image data
        _setPixels: function (pixels) {
            var s = this.settings, imax = s.imax, x, y, i, rgb, n = 0;

            for (y = 0; y < this.cheight; y += 1) {
                for (x = 0; x < this.cwidth; x += 1) {
                    i = this._getIterations(x, y);
                    rgb = this._getHSV(i, imax);

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

            x0 = x0 * s.scale + s.xoffset;
            y0 = y0 * s.scale + s.yoffset;

            for (i = 0; ((x * x + y * y) < (s.K * s.K)) && i < s.imax; i += s.grain) {
                xtemp = x * x - y * y + x0;
                y = 2 * x * y + y0;
                x = xtemp;
            }

            return ((x * x + y * y) < (s.K * s.K)) ? 0 : i;
        },

        // convert iterations to HSV value
        _getHSV: function (i0, imax) {
            var i, h, s, v;

            i = (i0 / imax) * 0xFFFFFF;

            /*jshint bitwise: false */
            h = ((i & 0xFF0000) >> 16) / 255;
            s = ((i & 0x00FF00) >> 8) / 255;
            v = ((i & 0x0000FF) >> 0) / 255;
            /*jshint bitwise: true */

            return HSLtoRGB(h, s, v);
        }
    };

    // adapted from http://purl.eligrey.com/github/color.js
    function HSLtoRGB (h, s, l) {
		var r, g, b,

		hue2rgb = function (p, q, t){
		    if (t < 0) {
		    	t += 1;
		    }
		    if (t > 1) {
		    	t -= 1;
		    }
		    if (t < 1/6) {
		    	return p + (q - p) * 6 * t;
		    }
		    if (t < 1/2) {
		    	return q;
		    }
		    if (t < 2/3) {
		    	return p + (q - p) * (2/3 - t) * 6;
		    }
		    return p;
		};

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			var
			q = l < 0.5 ? l * (1 + s) : l + s - l * s,
			p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		return {r: r * 0xFF, g: g * 0xFF, b: b * 0xFF};
	};

})(window);