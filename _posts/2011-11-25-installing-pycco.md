---
layout: post
title: Installing Pycco
---

[Pycco](http://fitzgen.github.com/pycco/) evaluates .py or .js files for comments in Markdown syntax to generate documentation.


### Install Python

1. Install [python](http://www.python.org/download/releases/2.7.2/)
2. Create a `PYTHON_PATH` System environment variable with a value of the python install directory
3. Add `%PYTHON_PATH%` to the `PATH` System environment variable
4. Add `%PYTHON_PATH%\Scripts` to the `PATH` System environment variable


### Install Easy Install

1. Download [easy install](http://peak.telecommunity.com/dist/ez_setup.py)
2. Start a command prompt where you downloaded the file
3. From the command prompt, run `python ez_setup.py`


### Install Pygments

1. Restart the command prompt
2. From the command prompt, run `easy_install Pygments`


### Install Pycco

1. Download [pycco](https://github.com/fitzgen/pycco/downloads)
2. Extract the compressed file to a directory and navigate to it
3. From the command prompt, run `python setup.py install`


### Run Pycco

1. Run `pycco <filename>.js`