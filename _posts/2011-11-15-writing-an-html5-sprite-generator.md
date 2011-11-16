---
layout: post
title: Writing an HTML5 Sprite Generator
---

Lots of writing to do here...

##Demo

[Here.](http://github.matthewcobbs.com/Stitches/).

## Dependencies

jQuery 1.6.2+, Modernizr (Dropfile, Flashcanvas for older browser support)

##Setup

{% highlight html %}
<!-- Stitches -->
<link rel="stylesheet" href="src/stitches/stitches.css">

<script defer src="src/stitches/main.js"></script>
<script defer src="src/stitches/page.js"></script>
<script defer src="src/stitches/icon.js"></script>
<script defer src="src/stitches/icons.js"></script>
{% endhighlight %}

##Markup

{% highlight html %}
<div id="stitches"></div>
{% endhighlight %}

##Implementation

{% highlight javascript %}
(function ($, Stitches) {

    var $stitches = $("#stitches");
    Stitches.init($stitches);

}(jQuery, Stitches));
{% endhighlight %}

##TODO

* add ability to configure file locations and other props
* minify and concat
* fix dropfile and flashcanvas support
* write unit tests
* more comments