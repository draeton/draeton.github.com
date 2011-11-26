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


### Install Pygments

1. Download [Pygments 1.4](https://bitbucket.org/birkenfeld/pygments-main/downloads)
2. Extract the compressed file to `%PYTHON_PATH%/Scripts/pygments-1.4/`
3. Start a command prompt at `%PYTHON_PATH%/Scripts/pygments-1.4/`
4. From the command prompt, run `python setup.py install`


### Install Pycco

1. Download [pycco](https://github.com/fitzgen/pycco/downloads)
2. Extract the compressed file to `%PYTHON_PATH%/Scripts/pycco/`
3. Start a command prompt at `%PYTHON_PATH%/Scripts/pycco/`
4. From the command prompt, run `python setup.py install`


### Run Pycco

1. Run `pycco <filename>.js`