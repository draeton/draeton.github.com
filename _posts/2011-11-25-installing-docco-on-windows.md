---
layout: post
title: Installing Docco on Windows
categories:
  - documentation
  - javascript
  - build
  - coffeescript
teaser: Docco evaluates .coffee or .js files for comments in Markdown syntax to generate 
documentation.
---

[Docco](http://jashkenas.github.com/docco/) evaluates .coffee or .js files for comments in Markdown syntax to generate 
documentation. The setup process was a little confusing for me on a Windows machine, so I thought I would be friendly
and document the process for others.

### Install Node.js

1. Install [node.js](http://nodejs.org/#download)
2. Add node path to `NODE_PATH` environment variable
3. Add `%NODE_PATH%` to `PATH` environment variable


### Install Python

1. Install [python](http://www.python.org/download/releases/2.7.2/)
2. Add python path to `PYTHON_PATH` environment variable
3. Add `%PYTHON_PATH%` to `PATH` environment variable
4. Add `%PYTHON_PATH%\Scripts` to `PATH` environment variable


### Install Pygments

1. Download [Pygments 1.4](https://bitbucket.org/birkenfeld/pygments-main/downloads)
2. Extract the compressed file to `%PYTHON_PATH%/Scripts/pygments-1.4/`
3. Start a command prompt at `%PYTHON_PATH%/Scripts/pygments-1.4/`
4. From the command prompt, run `python setup.py install`


### Install CoffeeScript

1. Download [coffeescript](http://coffeescript.org/#top)
2. Extract the compressed file to `%NODE_PATH%/node_modules/coffee-script/`
3. Create a file called `%NODE_PATH%/coffee.cmd`...

Use the following contents:

    @echo off
    node.exe %~dp0\.\node_modules\coffee-script\bin\coffee %*


### Install Docco

1. Download [docco](https://github.com/jashkenas/docco/downloads)
2. Extract to `%NODE_PATH%/node_modules/docco/`
3. Create a file called `%NODE_PATH%/docco.cmd`...

Use the following contents:

    @echo off
    node.exe %~dp0\.\node_modules\docco\bin\docco %*


### Run Docco

1. Run `docco <filename>.js`