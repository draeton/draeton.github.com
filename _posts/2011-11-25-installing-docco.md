---
layout: post
title: Installing Docco
---

[Docco](http://jashkenas.github.com/docco/) evaluates .coffee or .js files for comments in Markdown syntax to generate documentation.

### Install Node.js

1. Install node.js -> [http://nodejs.org/#download](http://nodejs.org/#download)
2. Add node path to `NODE_PATH` environment variable
3. Add `%NODE_PATH%` to `PATH` environment variable


### Install Python

1. Install python -> [http://www.python.org/download/releases/2.7.2/](http://www.python.org/download/releases/2.7.2/)
2. Add python path to `PYTHON_PATH` environment variable
3. Add `%PYTHON_PATH%` to `PATH` environment variable
4. Add `%PYTHON_PATH%\Scripts` to `PATH` environment variable


### Install Easy Install#

1. Download file -> [http://peak.telecommunity.com/dist/ez_setup.py](http://peak.telecommunity.com/dist/ez_setup.py)
2. Run `python ez_setup.py`


### Install Pygments

1. Run `easy_install Pygments`


### Install CoffeeScript

1. Download coffeescript -> [http://coffeescript.org/#top](http://coffeescript.org/#top)
2. Extract to `%NODE_PATH%/node_modules/coffee-script/`
3. Create a file called `%NODE_PATH%/coffee.cmd`

Use the following contents:

    @echo off
    "%NODE_PATH%/node.exe" "%NODE_PATH%/node_modules/coffee-script/bin/coffee" %*


### Install Docco

1. Download docco -> [https://github.com/jashkenas/docco/downloads](https://github.com/jashkenas/docco/downloads)
2. Extract to `%NODE_PATH%/node_modules/docco/`
3. Create a file called `%NODE_PATH%/docco.cmd`

Use the following contents:

    @echo off
    "%NODE_PATH%/node.exe" "%NODE_PATH%/node_modules/docco/bin/docco" %*


### Run Docco

1. Run `docco <filename>.js`