---
layout: post
title: $.getUrlVars (jQuery)
teaser: `$.getUrlVars` differs from other implementations by interpreting both the `search` and `hash` as members of the same object.
categories:
  - jquery
  - javascript
  - library
---

This is my take on an often necessary task, especially since the
advent of so-called Web 2.0, AJAX, and now the HTML5 History API.

`$.getUrlVars` differs from other implementations by interpreting
both the `search` and `hash` as members of the same object. If a key
is found in multiple places, the value is appended to an array
in the returned object.

*One place for improvement I see is storing the requests in a cache
indexed by URL. If a request is made for the exact same string, we
could quickly return a compiled object instead of repeating the same
calculations.*

<script src="https://gist.github.com/882744.js"> </script>