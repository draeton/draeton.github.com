(function (window) {

    function Mandelbrot (canvas, options) {
        Mandelbrot.prototype.init.apply(this, arguments);
    }

    window.Mandelbrot = Mandelbrot;

    Mandelbrot.defaults = {
        // axis boundaries
        xmin: -2.5,
        xmax: 1,
        ymin: -1,
        ymax: 1,

        // current zoom
        zoom: 2,

        // scale set to canvas
        xscale : null,
        yscale : null,
        xoffset: null,
        yoffset: null,

        // subset boundary
        K: 2,

        // max iterations
        imax: 100,

        // color masks
        rmask: (Math.pow(2, 24) - 1) ^ (Math.pow(2, 16) - 1),
        gmask: (Math.pow(2, 16) - 1) ^ (Math.pow(2,  8) - 1),
        bmask: (Math.pow(2,  8) - 1),
        cmax : (Math.pow(2, 24) - 1),
        cscale: null
    };

    Mandelbrot.prototype = {
        // settings and calculations
        init: function (canvas, options) {
            this.canvas  = canvas;
            this.cwidth  = canvas.width;
            this.cheight = canvas.height;
            this.context = canvas.getContext('2d');

            // extend settings with options
            this.settings = Object.create(Mandelbrot.defaults);

            if (options) {
                this.update(options);
            }
        },

        // update the settings
        update: function (options, cwidth, cheight) {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.settings[i] = options[i];
                }
            }

            if (cwidth && cheight) {
                this.canvas.width = cwidth;
                this.canvas.height = cheight;
            }
        },

        // calculate dependent variables
        calc: function () {
            var s = this.settings;
            
            s.xscale  = (s.xmax - s.xmin) / (this.cwidth * s.zoom);
            s.yscale  = (s.ymax - s.ymin) / (this.cheight * s.zoom);
            s.xoffset = s.xmin / s.zoom;
            s.yoffset = s.ymin / s.zoom;
            
            s.cscale = s.cmax / s.imax;
        },

        // get the number of iterations before determining member of set
        getIterations: function (x0, y0) {
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
        getRGB: function (i) {
            var s = this.settings, r, g, b;

            i = i * s.cscale;
            r = (i & s.rmask) >> 16;
            g = (i & s.gmask) >> 8;
            b = (i & s.bmask) >> 0;

            return {r: r, g: g, l: b};
        },

        // draw the fractal on the image data
        drawPixels: function (pixels) {
            var s = this.settings, x, y, i, rgb, n = 0;

            for (y = 0; y < this.cheight; y += 1) {
                for (x = 0; x < this.cwidth; x += 1) {
                    i = this.getIterations(x, y);
                    rgb = this.getRGB(i);

                    pixels[n]     = rgb.r;
                    pixels[n + 1] = rgb.g;
                    pixels[n + 2] = rgb.b;
                    pixels[n + 3] = 255; // alpha

                    n += 4;
                }
            }
        },

        // create the fractal
        generate: function (options, cwidth, cheight) {
            var imageData, pixels;

            if (options) {
                this.update(options, cwidth, cheight);
            }

            imageData = this.context.createImageData(this.cwidth, this.cheight);
            pixels    = imageData.data;

            this.calc();
            this.drawPixels(pixels);
            this.context.putImageData(imageData, 0, 0);
        }
    };

})(window);