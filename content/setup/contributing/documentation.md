# Contributing to Documentation


## Forking the Repository

Go to this documentation's [GitHub repository](https://github.com/HippoCampusRobotics/docs) and fork it (see [GitHub's documentation](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) for details on forking if you do not know how to fork a repository).


Then clone your fork with `git clone` so you can work with the repository locally.


## Make your Changes


Modify or complement the existing .rst-files to your liking.


Help with the most common ReStructuredText/Sphinx directives can be found [here](https://documentation-style-guide-sphinx.readthedocs.io/en/latest/style-guide.html). For a more extensive documentation of the capabilities of Sphinx visit the official [website](https://www.sphinx-doc.org/en/master/contents.html).


## Build the Docs locally


Since Sphinx follws the [WYSIWYM paradigm](https://en.wikipedia.org/wiki/WYSIWYM), it is a good idea to build the `html` output, to check if your changes work out as expected.


Probably easiest way to do so is to setup a virtual environment for python by executing the following commmand inside your cloned fork of the documentation repository:


```console
$ python3 -m venv venv
```

Activate the virtual environment with


```console
$ source venv/bin/activate
```

and install the Sphinx dependencies by executing


```console
$ pip3 install -r requirements.txt
```

Now you can build the documentation by running


```console
$ make html
```

<div class="adm adm-note"><p class="adm-title">Note</p>

Always make sure to have the virtual environment activated when executing the `make html` command.



</div>

## View the HTML output


You can view the HTML output by opening `_build/html/index.html` with a webbrowser.


```console
$ firefox _build/html/index.html & disown 
```

## Autogenerate Documentation


<div class="adm adm-attention"><p class="adm-title">Attention</p>

Autodoc is disabled for now. Either implement a docker workflow to build the docs where all runtime dependencies of the documented source code are met or just don't use autodoc. We stick with the latter one for now.



</div>

To generate API documentation for Python packages add the them as submodule under the `src` directory.


```console
$ PKG_NAME="insert-your-package-name-here" && \
git submodule add https://github.com/HippoCampusRobotics/$PKG_NAME.git src/$PKG_NAME
```

Add the package name to the `packages` list in `conf.py`.


Then add the package in `src.rst`. If you get errors/warning telling you that something related to your newly added package could not be imported, make sure you add all external modules imported in your package/modules to the `autodoc_mock_imports` list in `conf.py`.


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/contributing/contributing_to_documentation.html">contents/contributing/contributing_to_documentation</a>.</p>
