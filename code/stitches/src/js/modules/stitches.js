define(["wrap/jquery", "util/util", "util/stitches", "util/templates", "modules/file-manager", "modules/drop-box", "modules/sprite", "modules/canvas", "modules/toolbar", "modules/palette"],
function($, util, stitches, templates, FileManager, DropBox, Sprite, Canvas, Toolbar, Palette) {

    "use strict";

    var defaults = {
        layout: "compact",
        prefix: "sprite",
        padding: 10,
        uri: true
    };

    var Stitches = function (element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);

        this.init();
    };

    Stitches.prototype = {
        constructor: Stitches,

        init: function () {
            this.render();
            this.proxy();
            this.bind();

            this.setFileManager();
            this.setDropBox();
            this.setLayout();
            this.setCanvas();
            this.setToolbar();
            this.setPalettes();
        },

        render: function () {
            var html = templates.stitches({});

            this.$element.append(html);
            this.$overlay = this.$element.find(".stitches-overlay");
            this.$dropBox = this.$element.find(".stitches-drop-box");
            this.$canvas = this.$element.find(".stitches-canvas");
            this.$toolbar = this.$element.find(".stitches-toolbar");
            this.$progress = this.$element.find(".stitches-progress .progress");
            this.$progressBar = this.$element.find(".stitches-progress .bar");
            this.$about = this.$element.find(".stitches-about");
            this.$settings = this.$element.find(".stitches-settings");
            this.$properties = this.$element.find(".stitches-properties");
        },

        proxy: function () {
            util.proxy(this, "showOverlay hideOverlay openAbout closeAbout openSettings closeSettings openProperties closeProperties closePalettes processFiles createSprite updateToolbar updateProgress errorHandler");
        },

        bind: function () {
            this.$element.on("show-overlay", this.showOverlay);
            this.$element.on("hide-overlay", this.hideOverlay);
            this.$element.on("open-about", this.openAbout);
            this.$element.on("close-about", this.closeAbout);
            this.$element.on("open-settings", this.openSettings);
            this.$element.on("close-settings", this.closeSettings);
            this.$element.on("open-properties", this.openProperties);
            this.$element.on("close-properties", this.closeProperties);
            this.$element.on("close-palettes", this.closePalettes);
            this.$element.on("process-files", this.processFiles);
            this.$element.on("create-sprite", this.createSprite);
            this.$element.on("update-toolbar", this.updateToolbar);
            this.$element.on("error", this.errorHandler);
        },

        setFileManager: function () {
            this.fileManager = new FileManager(this.$element, {
                progress: this.updateProgress
            });
        },

        setDropBox: function () {
            this.dropBox = new DropBox(this.$dropBox);
        },

        setLayout: function () {
            stitches.setLayout(this.settings.layout);
        },

        setCanvas: function () {
            this.canvas = new Canvas(this.$canvas, {
                progress: this.updateProgress
            });
        },

        setToolbar: function () {
            var self = this;

            this.toolbar = new Toolbar(this.$toolbar, {
                name: "toolbar",
                actions: {
                    open: {
                        click: function (e) {
                            self.$element.trigger("show-overlay");
                        },
                        change: function (e) {
                            var $input = self.$toolbar.find("input[type=file]");
                            var $clone = $input.clone(true).val("");

                            self.$element.trigger("process-files", [e.target.files]);
                            $input.replaceWith($clone);
                        }
                    },
                    settings: {
                        click: function (e) {
                            self.$element.trigger("open-settings");
                        }
                    },
                    reset: {
                        click: function (e) {
                            self.canvas.reset();
                        }
                    },
                    generate: {
                        click: function (e) {
                            self.$element.trigger("show-overlay");
                            self.canvas.generate(self.settings);
                            self.$element.trigger("hide-overlay");
                        }
                    },
                    clear: {
                        click: function (e) {
                            self.canvas.clear();
                        }
                    },
                    spritesheet: {
                        click: function (e) {}
                    },
                    stylesheet: {
                        click: function (e) {}
                    },
                    about: {
                        click: function (e) {
                            self.$element.trigger("open-about");
                        }
                    }
                }
            });
        },

        setPalettes: function () {
            var self = this;

            var about = new Palette(this.$about, {
                name: "about",
                visible: true,
                actions: {
                    close: {
                        click: function (e) {
                            this.close();
                        }
                    }
                }
            });

            var settings = new Palette(this.$settings, {
                name: "settings",
                visible: false,
                actions: {
                    close: {
                        click: function (e) {
                            self.$element.trigger("close-settings");
                        }
                    }
                },
                fields: {
                    layout: {
                        "change": function (e) {
                            var $checked = this.$element.find("input[name=layout]:checked");
                            var layout = $checked.val();

                            this.source.layout = layout;
                            stitches.setLayout(layout);

                            self.canvas.reset();
                        }
                    },
                    prefix: {
                        "input blur": function (e) {
                            var prefix = $(e.currentTarget).val();

                            this.source.prefix = prefix;
                        }
                    },
                    padding: {
                        "input blur": function (e) {
                            var padding = $(e.currentTarget).val();

                            this.source.padding = padding;

                            $.map(self.canvas.sprites, function (sprite) {
                                sprite.configure({
                                    padding: padding
                                });
                            });

                            self.canvas.reset();
                        }
                    },
                    uri: {
                        "change": function (e) {
                            var uri = $(e.currentTarget).is(":checked");

                            this.source.uri = uri;
                        }
                    }
                }
            });

            var properties = new Palette(this.$properties, {
                name: "properties",
                visible: false,
                actions: {
                    close: {
                        click: function (e) {
                            self.$element.trigger("close-properties");
                        }
                    },
                    delete: {
                        click: function (e) {
                            self.canvas.remove(properties.source);
                        }
                    }
                },
                fields: {
                    name: {
                        "input blur": function (e) {
                            this.source.name = $(e.currentTarget).val();
                        }
                    }
                }
            });

            this.palettes = {
                about: about,
                settings: settings,
                properties: properties
            };
        },

        showOverlay: function (e, type) {
            this.$overlay.fadeTo("fast", 0.4);
        },

        hideOverlay: function (e) {
            this.$overlay.fadeOut("fast");
        },

        openAbout: function (e) {
            this.closePalettes();

            this.palettes.about.open();
        },

        closeAbout: function (e) {
            if (this.palettes.about.visible) {
                this.palettes.about.close();
            }
        },

        openSettings: function (e) {
            this.closePalettes();

            this.palettes.settings.configure({
                source: this.settings,
                inputs: {
                    layout: this.settings.layout,
                    prefix: this.settings.prefix,
                    padding: this.settings.padding,
                    uri: this.settings.uri,
                }
            });

            this.palettes.settings.open();
        },

        closeSettings: function (e) {
            if (this.palettes.settings.visible) {
                this.palettes.settings.close();
            }
        },

        openProperties: function (e, sprite) {
            this.closePalettes();

            this.palettes.properties.configure({
                source: sprite,
                inputs: {
                    name: sprite.name,
                    x: sprite.x + sprite.padding,
                    y: sprite.y + sprite.padding
                }
            });

            this.palettes.properties.open();
        },

        closeProperties: function (e) {
            if (this.palettes.properties.visible) {
                this.palettes.properties.close();
                this.canvas.$element.trigger("clear-active", [true]);
            }
        },

        closePalettes: function (e) {
            this.closeAbout();
            this.closeSettings();
            this.closeProperties();
        },

        processFiles: function (e, files) {
            this.fileManager.processFiles(files);
        },

        createSprite: function (e, name, src) {
            var self = this;
            var sprite;

            sprite = new Sprite({
                name: name,
                src: src,
                padding: this.settings.padding,
                callback: function (sprite) {
                    self.canvas.add(sprite);
                }
            });
        },

        updateToolbar: function (e) {
            var $toolbar = this.toolbar.$element;
            var toolbar = this.toolbar;

            if (this.canvas.sprites.length) {
                toolbar.enable("reset generate clear");
            } else {
                toolbar.disable("reset generate clear");
            }

            if (this.canvas.spritesheet && this.canvas.stylesheet) {
                $toolbar.find("[data-action=spritesheet]").attr("href", this.canvas.spritesheet);
                $toolbar.find("[data-action=stylesheet]").attr("href", this.canvas.stylesheet);

                toolbar.enable("spritesheet stylesheet");
            } else {
                $toolbar.find("[data-action=spritesheet]").attr("href", "javascript:void(0);");
                $toolbar.find("[data-action=stylesheet]").attr("href", "javascript:void(0);");

                toolbar.disable("spritesheet stylesheet");
            }
        },

        updateProgress: function (progress, type) {
            var percent = Math.ceil(progress * 100);

            if (percent === 100 && type !== "danger" && type !== "warning") {
                type = "success";
            }

            if (type) {
                this.$progress.attr({
                    "class": "progress progress-" + type
                });
            }

            this.$progressBar.css({
                width: percent + "%"
            });
        },

        errorHandler: function (e, err) {
            //this.updateProgress(1, "warning");
        }
    };

    return Stitches;

});