/*!
 * Mandy - Fractal generator for HTML5 canvas
 * http://draeton.github.com/mandy
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
(function (window) {

    "use strict";
    
    var document = window.document;

    var _defaults = {
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
            imax: 0xFFF,

            // granularity
            grain: 1,

            // algorithm
            fractal: "mandelbrot"
        };
    
    var _fractals = {
            mandelbrot: {
                algorithm: function (settings, x0, y0) {
                    var s = settings, i, x = 0, y = 0, xtemp;

                    for (i = 0; ((x * x + y * y) < (s.K * s.K)) && i < s.imax; i += s.grain) {
                        xtemp = x * x - y * y + x0;
                        y = 2 * x * y + y0;
                        x = xtemp;
                    }

                    return ((x * x + y * y) < (s.K * s.K)) ? 0 : i;
                },
                colorize: function (i0, imax) {
                    var i, h, s, v;

                    i = Math.log(i0) / Math.log(imax);

                    h = (60) / 360;
                    s = (i * 100) / 100;
                    v = (i * 100) / 100;

                    return {h: h, s: s, v: v}                    
                }
            }
        };

    window.Mandy = function (canvas, options, cwidth, cheight) {
        return Mandy.prototype.init.apply(this, arguments);
    };

    Mandy.prototype = {
        // settings and calculations
        init: function (canvas, options, cwidth, cheight) {
            this.canvas  = canvas;
            this.cwidth  = canvas.width;
            this.cheight = canvas.height;
            this.context = canvas.getContext('2d');

            // extend settings with options
            this.settings = Object.create(_defaults);

            if (options || cwidth && cheight) {
                this._update(options, cwidth, cheight);
            }
            
            // set fractal
            this.fractal = _fractals[this.settings.fractal] || _fractals[_defaults.fractal];
            this.algorithm = this.fractal.algorithm;
            this.colorize = this.fractal.colorize;
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
            var x, y, rgb, n = 0;

            for (y = 0; y < this.cheight; y += 1) {
                for (x = 0; x < this.cwidth; x += 1) {                    
                    rgb = HSVtoRGB( this._iterationsToHSV( this._getIterations(x, y) ) );

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
            var s = this.settings;

            x0 = x0 * s.scale + s.xoffset;
            y0 = y0 * s.scale + s.yoffset;
            
            return this.algorithm(s, x0, y0);
        },

        // convert iterations to HSV value
        _iterationsToHSV: function (i) {
            var s = this.settings;
            
            return this.colorize(i, s.imax);
        },
        
        // add or update a new fractal algorithm
        addAlgorithm: function (name, algorithm, colorize) {
            _fractals[name] = {
                algorithm: algorithm,
                colorize: colorize
            };
        }
    };

    // adapted from http://purl.eligrey.com/github/color.js
    function HSVtoRGB (hsv) {
		var r, g, b, h = hsv.h, s = hsv.s, v = hsv.v;

		var hue2rgb = function (p, q, t){
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
			r = g = b = v; // achromatic
		} else {
			var
			q = v < 0.5 ? v * (1 + s) : v + s - v * s,
			p = 2 * v - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		return {r: r * 0xFF, g: g * 0xFF, b: b * 0xFF};
	};

})(window);