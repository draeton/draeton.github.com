---
layout: post
title: NaN and implicit type conversion
categories:
  - javascript
teaser: Yet another reason to always use strict equality comparisons in JavaScript
---

<script src="https://gist.github.com/1444703.js"> </script>

To quote from Dmitry Soshnikov's [Note 2. ECMAScript. Equality operators](http://dmitrysoshnikov.com/notes/note-2-ecmascript-equality-operators/),
if one of the operands in a non-strict comparison is a `number`, the 
second operand will always be converted to a number.

In this case, `typeof NaN === 'number'`, so `true` and `false` are 
coerced to `0` and `1` before the comparison. Neither is equal to `NaN`.
This pitfall is avoided entirely with strict equality (`===`) comparisons.